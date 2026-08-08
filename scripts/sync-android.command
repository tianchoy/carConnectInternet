#!/bin/zsh
set -euo pipefail

SCRIPT_DIR="${0:A:h}"
SCRIPT_NAME="${0:t}"
PROJECT_ROOT="${SCRIPT_DIR:h}"
ANDROID_PROJECT_ROOT="${ANDROID_PROJECT_ROOT:-${PROJECT_ROOT:h}/car}"
APP_ID="${APP_ID:-__UNI__662B0B4}"
PLUGIN_NAME="external-map-navigation"
DRY_RUN=false

usage() {
  cat <<EOF
用法：${SCRIPT_NAME} [--dry-run|-n] [--help|-h]

将 HBuilderX 导出的 Android 离线资源同步到本地 Android 工程。

环境变量：
  ANDROID_PROJECT_ROOT  Android 工程根目录（默认：${PROJECT_ROOT:h}/car）
  APP_ID                UniApp X App ID（默认：__UNI__662B0B4）

--dry-run, -n  仅显示将要同步的变更，不写入文件。
EOF
}

fail() {
  print -u2 -- "错误: $1"
  exit 1
}

require_path() {
  [[ -e "$1" ]] || fail "找不到 $2：$1"
}

require_dir() {
  [[ -d "$1" ]] || fail "$2 不是目录：$1"
}

while (( $# > 0 )); do
  case "$1" in
    --dry-run|-n)
      DRY_RUN=true
      ;;
    --help|-h)
      usage
      exit 0
      ;;
    *)
      fail "不支持的参数：$1（使用 --help 查看用法）"
      ;;
  esac
  shift
done

command -v rsync >/dev/null 2>&1 || fail "未找到 rsync 命令"

RESOURCE_ROOT="${PROJECT_ROOT}/unpackage/resources/app-android"
SOURCE_APP_ROOT="${RESOURCE_ROOT}/${APP_ID}"
SOURCE_GENERATED_ROOT="${RESOURCE_ROOT}/uniappx/app-android/src"
SOURCE_PLUGIN_ROOT="${RESOURCE_ROOT}/uni_modules/${PLUGIN_NAME}"

ANDROID_MAIN_ROOT="${ANDROID_PROJECT_ROOT}/uniappx/src/main"
TARGET_APP_ROOT="${ANDROID_MAIN_ROOT}/assets/apps/${APP_ID}"
TARGET_JAVA_ROOT="${ANDROID_MAIN_ROOT}/java"
TARGET_PLUGIN_ROOT="${TARGET_JAVA_ROOT}/uni_modules/${PLUGIN_NAME}"

require_dir "${SOURCE_APP_ROOT}" "HBuilderX 生成的 Android 应用资源目录"
require_path "${SOURCE_APP_ROOT}/www/manifest.json" "HBuilderX 生成的 Android Web manifest"
require_path "${SOURCE_GENERATED_ROOT}/index.kt" "HBuilderX 生成的 Android index.kt"
require_dir "${SOURCE_GENERATED_ROOT}/components" "HBuilderX 生成的 Android components"
require_dir "${SOURCE_GENERATED_ROOT}/pages" "HBuilderX 生成的 Android pages"
require_dir "${SOURCE_GENERATED_ROOT}/uni_modules" "HBuilderX 生成的 Android uni_modules"
require_path "${SOURCE_PLUGIN_ROOT}/utssdk/app-android/AndroidManifest.xml" "外部地图 Android manifest"
require_path "${SOURCE_PLUGIN_ROOT}/utssdk/app-android/config.json" "外部地图 Android 配置"
require_path "${SOURCE_PLUGIN_ROOT}/utssdk/app-android/src/index.kt" "外部地图 Android Kotlin 源码"

require_dir "${ANDROID_PROJECT_ROOT}" "Android 工程根目录"
require_dir "${ANDROID_MAIN_ROOT}/assets/apps" "Android assets/apps 目录"
require_dir "${TARGET_JAVA_ROOT}" "Android Java/Kotlin 源码目录"
require_path "${ANDROID_MAIN_ROOT}/AndroidManifest.xml" "Android 主 Manifest"

grep -Fq "${APP_ID}" "${ANDROID_MAIN_ROOT}/AndroidManifest.xml" || \
  fail "Android 主 Manifest 未包含 App ID：${APP_ID}"
grep -Fq 'android.intent.action.VIEW' "${SOURCE_PLUGIN_ROOT}/utssdk/app-android/AndroidManifest.xml" || \
  fail "外部地图插件 Manifest 缺少 VIEW query"
grep -Fq 'android:scheme="geo"' "${SOURCE_PLUGIN_ROOT}/utssdk/app-android/AndroidManifest.xml" || \
  fail "外部地图插件 Manifest 缺少 geo scheme query"

RSYNC_OPTIONS=(-a --delete --exclude='.DS_Store')
INDEX_RSYNC_OPTIONS=(-a --exclude='.DS_Store')
if [[ "${DRY_RUN}" == true ]]; then
  RSYNC_OPTIONS+=(--dry-run)
  INDEX_RSYNC_OPTIONS+=(--dry-run)
  print -- "预演模式：不会修改文件。"
fi

sync_dir() {
  local source="$1"
  local target="$2"
  shift 2
  rsync "${RSYNC_OPTIONS[@]}" "$@" "${source}/" "${target}/"
}

if [[ "${DRY_RUN}" == false ]]; then
  mkdir -p "${TARGET_APP_ROOT}" \
    "${TARGET_JAVA_ROOT}/components" \
    "${TARGET_JAVA_ROOT}/pages" \
    "${TARGET_JAVA_ROOT}/uni_modules" \
    "${TARGET_PLUGIN_ROOT}"
fi

print -- "[1/5] 同步 Android 应用资源：${APP_ID}"
sync_dir "${SOURCE_APP_ROOT}" "${TARGET_APP_ROOT}"

print -- "[2/5] 同步生成的 index.kt、components 和 pages"
rsync "${INDEX_RSYNC_OPTIONS[@]}" \
  "${SOURCE_GENERATED_ROOT}/index.kt" "${TARGET_JAVA_ROOT}/index.kt"
sync_dir "${SOURCE_GENERATED_ROOT}/components" "${TARGET_JAVA_ROOT}/components"
sync_dir "${SOURCE_GENERATED_ROOT}/pages" "${TARGET_JAVA_ROOT}/pages"

print -- "[3/5] 同步生成的 uni_modules（外部地图插件单独处理）"
sync_dir "${SOURCE_GENERATED_ROOT}/uni_modules" "${TARGET_JAVA_ROOT}/uni_modules" \
  --exclude="${PLUGIN_NAME}/"

print -- "[4/5] 同步 ${PLUGIN_NAME} Android 插件"
sync_dir "${SOURCE_PLUGIN_ROOT}" "${TARGET_PLUGIN_ROOT}"

if [[ "${DRY_RUN}" == false ]]; then
  print -- "[5/5] 校验同步结果"
  require_path "${TARGET_APP_ROOT}/www/manifest.json" "同步后的 Android Web manifest"
  require_path "${TARGET_JAVA_ROOT}/index.kt" "同步后的 Android index.kt"
  require_path "${TARGET_PLUGIN_ROOT}/utssdk/app-android/src/index.kt" "同步后的外部地图 Kotlin 源码"
  grep -Fq 'android:scheme="geo"' "${TARGET_PLUGIN_ROOT}/utssdk/app-android/AndroidManifest.xml" || \
    fail "同步后的外部地图插件 Manifest 缺少 geo scheme query"
else
  print -- "[5/5] 预演完成：未执行同步后文件校验。"
fi

print -- "完成：${ANDROID_PROJECT_ROOT}"
print -- "下一步可执行：cd ${ANDROID_PROJECT_ROOT} && ./gradlew :app:assembleDebug"
