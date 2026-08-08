#!/bin/zsh
set -euo pipefail

SCRIPT_DIR="${0:A:h}"
PROJECT_ROOT="${SCRIPT_DIR:h}"
IOS_PROJECT_ROOT="${IOS_PROJECT_ROOT:-${PROJECT_ROOT:h}/car-ios}"
APP_ID="${APP_ID:-__UNI__662B0B4}"
PLUGIN_NAME="external-map-navigation"
FRAMEWORK_NAME="unimoduleExternalMapNavigation"
CONFIGURATION="${CONFIGURATION:-Debug}"

RESOURCE_ROOT="${PROJECT_ROOT}/unpackage/resources/app-ios"
SOURCE_WWW="${RESOURCE_ROOT}/${APP_ID}/www"
SOURCE_APP_SERVICE="${SOURCE_WWW}/app-service.js"
SOURCE_SWIFT="${RESOURCE_ROOT}/uni_modules/${PLUGIN_NAME}/utssdk/app-ios/src/index.swift"

IOS_APP_ROOT="${IOS_PROJECT_ROOT}/UniAppXDemo"
TARGET_WWW="${IOS_APP_ROOT}/UniAppXDemo/uni-app-x/apps/${APP_ID}/www"
PLUGIN_ROOT="${IOS_PROJECT_ROOT}/UTSPluginExample/${FRAMEWORK_NAME}"
PLUGIN_PROJECT="${PLUGIN_ROOT}/${FRAMEWORK_NAME}.xcodeproj"
PLUGIN_SOURCE="${PLUGIN_ROOT}/${FRAMEWORK_NAME}/index.swift"
FRAMEWORK_OUTPUT_ROOT="${IOS_APP_ROOT}/GeneratedFrameworks"
FRAMEWORK_OUTPUT="${FRAMEWORK_OUTPUT_ROOT}/${FRAMEWORK_NAME}.xcframework"
SIMULATOR_DERIVED_DATA="${TMPDIR:-/tmp}/${FRAMEWORK_NAME}-simulator"
DEVICE_DERIVED_DATA="${TMPDIR:-/tmp}/${FRAMEWORK_NAME}-device"

fail() {
  print -u2 -- "错误: $1"
  exit 1
}

require_path() {
  [[ -e "$1" ]] || fail "找不到 $2：$1"
}

require_path "${SOURCE_WWW}" "HBuilderX 生成的 iOS Web 资源"
require_path "${SOURCE_APP_SERVICE}" "HBuilderX 生成的 iOS app-service.js"
require_path "${SOURCE_SWIFT}" "HBuilderX 生成的 iOS UTS Swift 源码"
require_path "${PLUGIN_PROJECT}" "iOS 外部地图 Framework 工程"
require_path "${PROJECT_ROOT}/nativeResources/ios/Info.plist" "iOS 源资源 Info.plist"
require_path "${IOS_APP_ROOT}/UniAppXDemo/Info.plist" "iOS 主工程 Info.plist"

for plist in \
  "${PROJECT_ROOT}/nativeResources/ios/Info.plist" \
  "${IOS_APP_ROOT}/UniAppXDemo/Info.plist"; do
  python3 - "${plist}" <<'PY'
import plistlib
import sys

with open(sys.argv[1], 'rb') as fp:
    schemes = set(plistlib.load(fp).get('LSApplicationQueriesSchemes', []))

missing = {'qqmap', 'iosamap', 'baidumap'} - schemes
if missing:
    raise SystemExit(f'{sys.argv[1]} 的 LSApplicationQueriesSchemes 缺少 ' + ', '.join(sorted(missing)))
PY
done

print -- "[1/5] 同步 HBuilderX 生成的 iOS Web 资源"
mkdir -p "${TARGET_WWW}"
rsync -a --delete --exclude='.DS_Store' "${SOURCE_WWW}/" "${TARGET_WWW}/"

print -- "[2/5] 更新 ${FRAMEWORK_NAME} 的 Swift 源码"
cp "${SOURCE_SWIFT}" "${PLUGIN_SOURCE}"

# HBuilderX 当前版本仍会为 UIApplication.openURL 生成已废弃的同步调用。
# 在每次同步时，只替换该固定桥接函数为主线程上的现代 UIApplication.open 调用；
# 地图业务逻辑始终来自 app-ios/index.uts。
python3 - "${PLUGIN_SOURCE}" <<'PY'
from pathlib import Path
import sys

path = Path(sys.argv[1])
text = path.read_text(encoding='utf-8')
legacy = '''public func openURL(_ value: String) -> Bool {
    var url = createURL(value)
    if (url == nil) {
        return false
    }
    do {
        return UIApplication.shared.openURL(url!)
    }
     catch let error {
        var error = UTSError(error)
        console.error("打开 iOS 地图失败:", error)
        return false
    }
}
'''
modern = '''public func openURL(_ value: String) -> Bool {
    let url = createURL(value)
    if (url == nil || !UIApplication.shared.canOpenURL(url!)) {
        return false
    }
    DispatchQueue.main.async(execute: {
        UIApplication.shared.open(
            url!,
            options: Map<UIApplication.OpenExternalURLOptionsKey, Any>(),
            completionHandler: nil
        )
    })
    return true
}
'''

if legacy in text:
    text = text.replace(legacy, modern, 1)
elif 'DispatchQueue.main.async' not in text or 'UIApplication.shared.open(' not in text:
    raise SystemExit('HBuilderX 生成的地图 Swift URL 打开函数结构已变化，请检查同步脚本。')

required = [
    'getAvailableIOSMapProviderIds',
    'getAvailableIOSMapProviderIdsByJs',
    'openSelectedProvider',
    'baidumap://map/direction?origin=我的位置',
    'destination=name:',
    '|latlng:',
    'coord_type=gcj02',
    'src=ios.carConnectInternet.carConnectInternet',
    'https://maps.apple.com/',
]
missing = [value for value in required if value not in text]
if missing:
    raise SystemExit('HBuilderX 生成的地图 Swift 缺少预期实现：' + ', '.join(missing))

path.write_text(text, encoding='utf-8')
PY

python3 - "${SOURCE_APP_SERVICE}" <<'PY'
from pathlib import Path
import sys

text = Path(sys.argv[1]).read_text(encoding='utf-8')
required = [
    'getAvailableIOSMapProviderIds',
    'const providerIds = [];',
    'const providerId = providerIds[tapIndex];',
]
missing = [value for value in required if value not in text]
if missing:
    raise SystemExit('HBuilderX 生成的 iOS app-service.js 缺少预期实现：' + ', '.join(missing))
if 'getAvailableIOSMapProviders' in text:
    raise SystemExit('HBuilderX 生成的 iOS app-service.js 仍包含旧的地图 Provider 对象桥接。')
PY

print -- "[3/5] 构建模拟器 Framework"
rm -rf "${SIMULATOR_DERIVED_DATA}"
xcodebuild \
  -project "${PLUGIN_PROJECT}" \
  -scheme "${FRAMEWORK_NAME}" \
  -configuration "${CONFIGURATION}" \
  -sdk iphonesimulator \
  -derivedDataPath "${SIMULATOR_DERIVED_DATA}" \
  CODE_SIGNING_ALLOWED=NO \
  build

print -- "[4/5] 构建真机 Framework"
rm -rf "${DEVICE_DERIVED_DATA}"
xcodebuild \
  -project "${PLUGIN_PROJECT}" \
  -scheme "${FRAMEWORK_NAME}" \
  -configuration "${CONFIGURATION}" \
  -sdk iphoneos \
  -derivedDataPath "${DEVICE_DERIVED_DATA}" \
  CODE_SIGNING_ALLOWED=NO \
  build

SIMULATOR_FRAMEWORK="${SIMULATOR_DERIVED_DATA}/Build/Products/${CONFIGURATION}-iphonesimulator/${FRAMEWORK_NAME}.framework"
DEVICE_FRAMEWORK="${DEVICE_DERIVED_DATA}/Build/Products/${CONFIGURATION}-iphoneos/${FRAMEWORK_NAME}.framework"
require_path "${SIMULATOR_FRAMEWORK}" "模拟器 Framework"
require_path "${DEVICE_FRAMEWORK}" "真机 Framework"

print -- "[5/5] 生成并替换 XCFramework"
mkdir -p "${FRAMEWORK_OUTPUT_ROOT}"
rm -rf "${FRAMEWORK_OUTPUT}"
xcodebuild -create-xcframework \
  -framework "${SIMULATOR_FRAMEWORK}" \
  -framework "${DEVICE_FRAMEWORK}" \
  -output "${FRAMEWORK_OUTPUT}"

plutil -lint "${FRAMEWORK_OUTPUT}/Info.plist" >/dev/null
print -- "完成：${FRAMEWORK_OUTPUT}"
print -- "接下来请打开 ${IOS_APP_ROOT}/UniAppXDemo.xcworkspace 进行真机运行或 Archive。"
