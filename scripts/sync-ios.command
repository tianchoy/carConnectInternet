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
SOURCE_MANIFEST="${PROJECT_ROOT}/manifest.json"
SOURCE_WWW="${RESOURCE_ROOT}/${APP_ID}/www"
SOURCE_APP_SERVICE="${SOURCE_WWW}/app-service.js"
SOURCE_SWIFT="${RESOURCE_ROOT}/uni_modules/${PLUGIN_NAME}/utssdk/app-ios/src/index.swift"
SOURCE_JPUSH_CONFIG="${RESOURCE_ROOT}/uni_modules/jg-jpush-u/utssdk/app-ios/config.json"
SOURCE_JPUSH_SWIFT="${RESOURCE_ROOT}/uni_modules/jg-jpush-u/utssdk/app-ios/src/index.swift"

IOS_APP_ROOT="${IOS_PROJECT_ROOT}/UniAppXDemo"
IOS_PROJECT_FILE="${IOS_APP_ROOT}/UniAppXDemo.xcodeproj/project.pbxproj"
TARGET_WWW="${IOS_APP_ROOT}/UniAppXDemo/uni-app-x/apps/${APP_ID}/www"
TARGET_JPUSH_SWIFT="${IOS_APP_ROOT}/UniAppXDemo/JPushUTSBridge.swift"
TARGET_JPUSH_INFO_PLIST="${IOS_APP_ROOT}/UniAppXDemo/Info.plist"
TARGET_JPUSH_DEVICE_CONFIG="${IOS_PROJECT_ROOT}/TemporarySampleFramework/DCloudUTSExtAPI.xcframework/ios-arm64/DCloudUTSExtAPI.framework/uts-config.json"
TARGET_JPUSH_SIMULATOR_CONFIG="${IOS_PROJECT_ROOT}/TemporarySampleFramework/DCloudUTSExtAPI.xcframework/ios-x86_64-simulator/DCloudUTSExtAPI.framework/uts-config.json"
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

require_path "${SOURCE_MANIFEST}" "项目 manifest.json"
require_path "${SOURCE_WWW}" "HBuilderX 生成的 iOS Web 资源"
require_path "${SOURCE_APP_SERVICE}" "HBuilderX 生成的 iOS app-service.js"
require_path "${SOURCE_SWIFT}" "HBuilderX 生成的 iOS UTS Swift 源码"
require_path "${SOURCE_JPUSH_CONFIG}" "HBuilderX 生成的 JPush iOS 配置"
require_path "${SOURCE_JPUSH_SWIFT}" "HBuilderX 生成的 JPush iOS Swift 源码"
require_path "${TARGET_JPUSH_SWIFT}" "iOS 主工程 JPush Swift 桥接"
require_path "${TARGET_JPUSH_INFO_PLIST}" "iOS 主工程 Info.plist"
require_path "${TARGET_JPUSH_DEVICE_CONFIG}" "真机 DCloud UTS Hook 配置"
require_path "${TARGET_JPUSH_SIMULATOR_CONFIG}" "模拟器 DCloud UTS Hook 配置"
require_path "${PLUGIN_PROJECT}" "iOS 外部地图 Framework 工程"
require_path "${PROJECT_ROOT}/nativeResources/ios/Info.plist" "iOS 源资源 Info.plist"
require_path "${IOS_APP_ROOT}/UniAppXDemo/Info.plist" "iOS 主工程 Info.plist"
require_path "${IOS_PROJECT_FILE}" "iOS 主工程 project.pbxproj"

read_manifest_version() {
  python3 - "${SOURCE_MANIFEST}" <<'PY'
import json
from pathlib import Path
import sys

path = Path(sys.argv[1])
try:
    manifest = json.loads(path.read_text(encoding='utf-8'))
except (OSError, json.JSONDecodeError) as error:
    raise SystemExit(f'无法读取 {path}：{error}')

version_name = manifest.get('versionName')
version_code = manifest.get('versionCode')
if not isinstance(version_name, str) or not version_name.strip():
    raise SystemExit(f'{path} 的 versionName 必须是非空字符串')
if not isinstance(version_code, str) or not version_code.isdecimal() or int(version_code) <= 0:
    raise SystemExit(f'{path} 的 versionCode 必须是正整数的字符串')

print(version_name)
print(version_code)
PY
}

version_values=("${(@f)$(read_manifest_version)}")
VERSION_NAME="${version_values[1]}"
VERSION_CODE="${version_values[2]}"
print -- "将同步原生版本：${VERSION_NAME} (${VERSION_CODE})"

sync_xcode_version() {
  python3 - "$1" "${VERSION_NAME}" "${VERSION_CODE}" <<'PY'
from pathlib import Path
import re
import sys

project_path = Path(sys.argv[1])
version_name, version_code = sys.argv[2:]
text = project_path.read_text(encoding='utf-8')

configuration_list = re.search(
    r'/\* Build configuration list for PBXNativeTarget "UniAppX" \*/ = \{\s*'
    r'isa = XCConfigurationList;\s*buildConfigurations = \(\s*'
    r'([A-F0-9]+) /\* Debug \*/,\s*([A-F0-9]+) /\* Release \*/,',
    text,
    flags=re.DOTALL,
)
if not configuration_list:
    raise SystemExit(f'{project_path} 未找到 UniAppX 的 Debug/Release 构建配置列表')

for configuration_id, configuration_name in zip(configuration_list.groups(), ('Debug', 'Release')):
    pattern = (
        rf'(\n\s*{re.escape(configuration_id)} /\* {configuration_name} \*/ = \{{\n'
        rf'\s*isa = XCBuildConfiguration;\n\s*buildSettings = \{{)(.*?)(\n\s*\}};\n'
        rf'\s*name = {configuration_name};\n\s*\}};)'
    )
    match = re.search(pattern, text, flags=re.DOTALL)
    if not match:
        raise SystemExit(f'{project_path} 无法读取 UniAppX {configuration_name} 配置')

    settings = match.group(2)
    updated, marketing_count = re.subn(
        r'^(\s*MARKETING_VERSION = )[^;]+;$',
        rf'\g<1>{version_name};',
        settings,
        flags=re.MULTILINE,
    )
    updated, build_count = re.subn(
        r'^(\s*CURRENT_PROJECT_VERSION = )[^;]+;$',
        rf'\g<1>{version_code};',
        updated,
        flags=re.MULTILINE,
    )
    if marketing_count != 1 or build_count != 1:
        raise SystemExit(
            f'{project_path} 的 UniAppX {configuration_name} 配置必须各包含一个 '
            f'MARKETING_VERSION 和 CURRENT_PROJECT_VERSION '
            f'(实际：{marketing_count} / {build_count})'
        )

    text = text[:match.start(2)] + updated + text[match.end(2):]

project_path.write_text(text, encoding='utf-8')
PY
}

validate_xcode_version() {
  python3 - "$1" "${VERSION_NAME}" "${VERSION_CODE}" <<'PY'
from pathlib import Path
import re
import sys

project_path = Path(sys.argv[1])
version_name, version_code = sys.argv[2:]
text = project_path.read_text(encoding='utf-8')

configuration_list = re.search(
    r'/\* Build configuration list for PBXNativeTarget "UniAppX" \*/ = \{\s*'
    r'isa = XCConfigurationList;\s*buildConfigurations = \(\s*'
    r'([A-F0-9]+) /\* Debug \*/,\s*([A-F0-9]+) /\* Release \*/,',
    text,
    flags=re.DOTALL,
)
if not configuration_list:
    raise SystemExit(f'{project_path} 未找到 UniAppX 的 Debug/Release 构建配置列表')

for configuration_id, configuration_name in zip(configuration_list.groups(), ('Debug', 'Release')):
    pattern = (
        rf'\n\s*{re.escape(configuration_id)} /\* {configuration_name} \*/ = \{{\n'
        rf'\s*isa = XCBuildConfiguration;\n\s*buildSettings = \{{(.*?)\n\s*\}};\n'
        rf'\s*name = {configuration_name};\n\s*\}};'
    )
    match = re.search(pattern, text, flags=re.DOTALL)
    if not match:
        raise SystemExit(f'{project_path} 无法验证 UniAppX {configuration_name} 配置')
    settings = match.group(1)
    if not re.search(rf'^\s*MARKETING_VERSION = {re.escape(version_name)};$', settings, re.MULTILINE):
        raise SystemExit(f'{project_path} 的 UniAppX {configuration_name} 未同步 MARKETING_VERSION')
    if not re.search(rf'^\s*CURRENT_PROJECT_VERSION = {re.escape(version_code)};$', settings, re.MULTILINE):
        raise SystemExit(f'{project_path} 的 UniAppX {configuration_name} 未同步 CURRENT_PROJECT_VERSION')
PY
}


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

print -- "[1/7] 同步 HBuilderX 生成的 iOS Web 资源"
mkdir -p "${TARGET_WWW}"
rsync -a --delete --exclude='.DS_Store' "${SOURCE_WWW}/" "${TARGET_WWW}/"

print -- "[2/7] 同步 iOS 原生包版本"
sync_xcode_version "${IOS_PROJECT_FILE}"
validate_xcode_version "${IOS_PROJECT_FILE}"

print -- "[3/7] 同步 JPush iOS 桥接并切换 APNs Hook"
python3 - "${SOURCE_JPUSH_CONFIG}" "${SOURCE_JPUSH_SWIFT}" "${TARGET_JPUSH_DEVICE_CONFIG}" "${TARGET_JPUSH_SIMULATOR_CONFIG}" <<'PY'
import json
from pathlib import Path
import sys

source_config, source_swift, *target_configs = map(Path, sys.argv[1:])
jpush_hook = 'UTSSDKModulesJgJpushUJGPushIOSPlugin'
unipush_hook = 'UTSSDKModulesDCloudUniPushHookProxy'

config = json.loads(source_config.read_text(encoding='utf-8'))
if config.get('hooksClass') != jpush_hook:
    raise SystemExit(f'{source_config} 的 hooksClass 不是 {jpush_hook}')

swift = source_swift.read_text(encoding='utf-8')
required = [
    '@objc(UTSSDKModulesJgJpushUJGPushIOSPlugin)',
    'public var ENABLE_JPUSH_IOS_APNS_HOOK = true',
    'applicationDidFinishLaunchingWithOptions',
    'didRegisterForRemoteNotifications',
    'registerDeviceToken',
]
missing = [value for value in required if value not in swift]
if missing:
    raise SystemExit('HBuilderX 生成的 JPush Swift 缺少预期实现：' + ', '.join(missing))

registration_call = 'JPUSHService.register(forRemoteNotificationConfig:'
if swift.count(registration_call) != 1:
    raise SystemExit('HBuilderX 生成的 JPush Swift 必须只在运行时初始化中注册一次远程通知。')
if 'delegate: JGPushTool' in swift:
    raise SystemExit('HBuilderX 生成的 JPush Swift 不得在应用启动 Hook 中注册远程通知。')
if 'JGPushModule setup started' not in swift or 'JGPushModule notification registration started' not in swift:
    raise SystemExit('HBuilderX 生成的 JPush Swift 缺少预期的单次初始化生命周期实现。')

for target in target_configs:
    runtime = json.loads(target.read_text(encoding='utf-8'))
    hooks = runtime.get('hooksClasses')
    if not isinstance(hooks, list) or not all(isinstance(value, str) for value in hooks):
        raise SystemExit(f'{target} 的 hooksClasses 格式无效')

    runtime['hooksClasses'] = [
        value for value in hooks if value not in (unipush_hook, jpush_hook)
    ] + [jpush_hook]
    target.write_text(
        json.dumps(runtime, ensure_ascii=False, indent=2) + '\n',
        encoding='utf-8',
    )
PY
cp "${SOURCE_JPUSH_SWIFT}" "${TARGET_JPUSH_SWIFT}"

python3 - "${TARGET_JPUSH_SWIFT}" "${TARGET_JPUSH_INFO_PLIST}" <<'PY'
from pathlib import Path
import plistlib
import sys

swift_path, plist_path = map(Path, sys.argv[1:])
setup = 'JPUSHService.setup(withOption: self.launchOptions, appKey: param.appkey, channel: param.channel, apsForProduction: param.isProduction, advertisingIdentifier: param.advertisingId)'
setup_replacement = '''let configuredAPNsEnvironment = Bundle.main.object(forInfoDictionaryKey: "JPushAPNsProduction") as? String
        let apsForProduction = configuredAPNsEnvironment == "true"
        log("JGPushModule effective APNs environment", apsForProduction ? "production" : "development")
        JPUSHService.setup(withOption: self.launchOptions, appKey: param.appkey, channel: param.channel, apsForProduction: apsForProduction, advertisingIdentifier: param.advertisingId)'''
token_registration = '''public func registerDeviceToken(_ token: Data?) {
        log("JGPushModule registerDeviceToken")
        if (token == nil) {
            log("JGPushModule APNs device token is empty")
            return
        }
        JPUSHService.registerDeviceToken(token)
    }'''
token_registration_replacement = '''public func registerDeviceToken(_ token: Data?) {
        log("JGPushModule registerDeviceToken")
        guard let token else {
            log("JGPushModule APNs device token is empty")
            return
        }
        JPUSHService.registerDeviceToken(token)
    }'''
registration_id_completion = '(resCode: Int, registrationId: String?) -> Void in'
registration_id_completion_replacement = '(resCode: Int32, registrationId: String?) -> Void in'
text = swift_path.read_text(encoding='utf-8')
if setup in text:
    text = text.replace(setup, setup_replacement, 1)
elif 'object(forInfoDictionaryKey: "JPushAPNsProduction")' not in text:
    raise SystemExit('HBuilderX 生成的 JPush Swift 初始化结构已变化，请检查同步脚本。')

if token_registration in text:
    text = text.replace(token_registration, token_registration_replacement, 1)
elif 'guard let token else' not in text:
    raise SystemExit('HBuilderX 生成的 JPush Swift APNs Token 注册结构已变化，请检查同步脚本。')

if registration_id_completion in text:
    text = text.replace(
        registration_id_completion,
        registration_id_completion_replacement,
        1,
    )
elif registration_id_completion_replacement not in text:
    raise SystemExit('HBuilderX 生成的 JPush RegistrationID 回调结构已变化，请检查同步脚本。')

swift_path.write_text(text, encoding='utf-8')

with plist_path.open('rb') as fp:
    plist = plistlib.load(fp)
if plist.get('JPushAPNsProduction') != '$(JPUSH_APNS_PRODUCTION)':
    raise SystemExit(f'{plist_path} 缺少 JPushAPNsProduction Build Setting 占位符')
PY

python3 - "${TARGET_JPUSH_DEVICE_CONFIG}" "${TARGET_JPUSH_SIMULATOR_CONFIG}" <<'PY'
import json
from pathlib import Path
import sys

jpush_hook = 'UTSSDKModulesJgJpushUJGPushIOSPlugin'
unipush_hook = 'UTSSDKModulesDCloudUniPushHookProxy'
for value in sys.argv[1:]:
    path = Path(value)
    hooks = json.loads(path.read_text(encoding='utf-8')).get('hooksClasses', [])
    if hooks.count(jpush_hook) != 1 or unipush_hook in hooks:
        raise SystemExit(f'{path} 的 APNs Hook 配置校验失败')
PY

print -- "[4/7] 更新 ${FRAMEWORK_NAME} 的 Swift 源码"
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

print -- "[5/7] 构建模拟器 Framework"
rm -rf "${SIMULATOR_DERIVED_DATA}"
xcodebuild \
  -project "${PLUGIN_PROJECT}" \
  -scheme "${FRAMEWORK_NAME}" \
  -configuration "${CONFIGURATION}" \
  -sdk iphonesimulator \
  -derivedDataPath "${SIMULATOR_DERIVED_DATA}" \
  CODE_SIGNING_ALLOWED=NO \
  build

print -- "[6/7] 构建真机 Framework"
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

print -- "[7/7] 生成并替换 XCFramework"
mkdir -p "${FRAMEWORK_OUTPUT_ROOT}"
rm -rf "${FRAMEWORK_OUTPUT}"
xcodebuild -create-xcframework \
  -framework "${SIMULATOR_FRAMEWORK}" \
  -framework "${DEVICE_FRAMEWORK}" \
  -output "${FRAMEWORK_OUTPUT}"

plutil -lint "${FRAMEWORK_OUTPUT}/Info.plist" >/dev/null

python3 - "${IOS_PROJECT_FILE}" "${FRAMEWORK_NAME}" <<'PY'
from pathlib import Path
import re
import sys

project_path = Path(sys.argv[1])
framework_name = sys.argv[2] + '.xcframework'
text = project_path.read_text(encoding='utf-8')

reference = re.search(
    rf'^\s*([A-F0-9]+) /\* {re.escape(framework_name)} \*/ = \{{'
    rf'isa = PBXFileReference;[^\n]*path = GeneratedFrameworks/{re.escape(framework_name)};',
    text,
    flags=re.MULTILINE,
)
if reference is None:
    raise SystemExit(f'{project_path} 缺少 {framework_name} 的文件引用。')

reference_id = reference.group(1)
linked = re.search(
    rf'^\s*([A-F0-9]+) /\* {re.escape(framework_name)} in Frameworks \*/ = \{{'
    rf'isa = PBXBuildFile; fileRef = {reference_id} /\* {re.escape(framework_name)} \*/;',
    text,
    flags=re.MULTILINE,
)
embedded = re.search(
    rf'^\s*([A-F0-9]+) /\* {re.escape(framework_name)} in Embed Frameworks \*/ = \{{'
    rf'isa = PBXBuildFile; fileRef = {reference_id} /\* {re.escape(framework_name)} \*/; '
    rf'settings = \{{ATTRIBUTES = \(CodeSignOnCopy, RemoveHeadersOnCopy, \); \}};',
    text,
    flags=re.MULTILINE,
)
if linked is None or embedded is None:
    raise SystemExit(f'{project_path} 未配置 {framework_name} 的链接或嵌入构建项。')

if linked.group(1) not in text or embedded.group(1) not in text:
    raise SystemExit(f'{project_path} 未在 UniAppX 构建阶段使用 {framework_name}。')
PY

print -- "完成：${FRAMEWORK_OUTPUT}"
print -- "接下来请打开 ${IOS_APP_ROOT}/UniAppXDemo.xcworkspace 进行真机运行或 Archive。"
