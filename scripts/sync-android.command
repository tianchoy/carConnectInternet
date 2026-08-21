#!/bin/zsh
set -euo pipefail

SCRIPT_DIR="${0:A:h}"
SCRIPT_NAME="${0:t}"
PROJECT_ROOT="${SCRIPT_DIR:h}"
ANDROID_PROJECT_ROOT="${ANDROID_PROJECT_ROOT:-${PROJECT_ROOT:h}/car}"
APP_ID="${APP_ID:-__UNI__662B0B4}"
JPUSH_PLUGIN_NAME="jg-jpush-u"
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
SOURCE_RESOURCE_PLUGINS_ROOT="${RESOURCE_ROOT}/uni_modules"
SOURCE_JPUSH_CACHE_ROOT="${PROJECT_ROOT}/unpackage/cache/uts_standard_android/app-android/uts/uni_modules/${JPUSH_PLUGIN_NAME}"
SOURCE_LOCAL_MAVEN_ROOT="${PROJECT_ROOT}/android-offline-maven"

ANDROID_MAIN_ROOT="${ANDROID_PROJECT_ROOT}/uniappx/src/main"
TARGET_APP_ROOT="${ANDROID_MAIN_ROOT}/assets/apps/${APP_ID}"
TARGET_JAVA_ROOT="${ANDROID_MAIN_ROOT}/java"
TARGET_UNI_MODULES_ROOT="${TARGET_JAVA_ROOT}/uni_modules"
TARGET_JPUSH_PLUGIN_ROOT="${TARGET_UNI_MODULES_ROOT}/${JPUSH_PLUGIN_NAME}"
TARGET_LOCAL_MAVEN_ROOT="${ANDROID_PROJECT_ROOT}/local-maven"

require_dir "${SOURCE_APP_ROOT}" "HBuilderX 生成的 Android 应用资源目录"
require_path "${SOURCE_APP_ROOT}/www/manifest.json" "HBuilderX 生成的 Android Web manifest"
require_path "${SOURCE_GENERATED_ROOT}/index.kt" "HBuilderX 生成的 Android index.kt"
require_dir "${SOURCE_GENERATED_ROOT}/components" "HBuilderX 生成的 Android components"
require_dir "${SOURCE_GENERATED_ROOT}/pages" "HBuilderX 生成的 Android pages"
require_dir "${SOURCE_GENERATED_ROOT}/uni_modules" "HBuilderX 生成的 Android uni_modules"
require_dir "${SOURCE_RESOURCE_PLUGINS_ROOT}" "HBuilderX 导出的 Android 插件目录"
require_path "${SOURCE_JPUSH_CACHE_ROOT}/index.kt" "JPush 生成的 Android Kotlin 源码"
require_path "${SOURCE_JPUSH_CACHE_ROOT}/manifest.json" "JPush 生成的 Android 模块 manifest"
require_path "${SOURCE_LOCAL_MAVEN_ROOT}/cn/jiguang/sdk/jpush/6.2.0/jpush-6.2.0.aar" "离线 JPush AAR"
require_path "${SOURCE_LOCAL_MAVEN_ROOT}/cn/jiguang/sdk/jpush/6.2.0/jpush-6.2.0.pom" "离线 JPush POM"
require_path "${SOURCE_LOCAL_MAVEN_ROOT}/cn/jiguang/sdk/jcore/5.5.0/jcore-5.5.0.aar" "离线 JCore AAR"
require_path "${SOURCE_LOCAL_MAVEN_ROOT}/cn/jiguang/sdk/jcore/5.5.0/jcore-5.5.0.pom" "离线 JCore POM"

require_dir "${ANDROID_PROJECT_ROOT}" "Android 工程根目录"
require_dir "${ANDROID_MAIN_ROOT}/assets/apps" "Android assets/apps 目录"
require_dir "${TARGET_JAVA_ROOT}" "Android Java/Kotlin 源码目录"
require_path "${ANDROID_MAIN_ROOT}/AndroidManifest.xml" "Android 主 Manifest"

grep -Fq "${APP_ID}" "${ANDROID_MAIN_ROOT}/AndroidManifest.xml" || \
  fail "Android 主 Manifest 未包含 App ID：${APP_ID}"

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

sync_generated_modules() {
  local module_source
  local module_name
  local target_module

  for module_source in "${SOURCE_GENERATED_ROOT}/uni_modules"/*(N/); do
    module_name="${module_source:t}"
    target_module="${TARGET_UNI_MODULES_ROOT}/${module_name}"
    [[ "${DRY_RUN}" == true ]] || mkdir -p "${target_module}"
    print -- "  生成模块：${module_name}"
    sync_dir "${module_source}" "${target_module}"
  done
}

clear_projected_kotlin() {
  local target_plugin="$1"

  if [[ "${DRY_RUN}" == true ]]; then
    find "${target_plugin}" -path "${target_plugin}/utssdk" -prune -o \
      -type f -name '*.kt' -print 2>/dev/null
  else
    find "${target_plugin}" -path "${target_plugin}/utssdk" -prune -o \
      -type f -name '*.kt' -delete
  fi
}

sync_exported_plugin() {
  local plugin_source="$1"
  local plugin_name="${plugin_source:t}"
  local target_plugin="${TARGET_UNI_MODULES_ROOT}/${plugin_name}"
  local source_kotlin_root="${plugin_source}/utssdk/app-android/src"

  [[ "${DRY_RUN}" == true ]] || mkdir -p "${target_plugin}"
  print -- "  导出插件：${plugin_name}"

  # Keep manifests, config, and resources, but never retain Kotlin beneath
  # utssdk/app-android/src: Gradle compiles this tree recursively.
  rsync "${RSYNC_OPTIONS[@]}" --delete-excluded \
    --exclude='.DS_Store' --exclude='utssdk/app-android/src/***' \
    "${plugin_source}/" "${target_plugin}/"

  [[ -d "${source_kotlin_root}" ]] || return

  # A plugin's Kotlin must exist once only, at its module root. Remove previous
  # projections before copying, while preserving non-Kotlin plugin payloads.
  clear_projected_kotlin "${target_plugin}"
  rsync "${INDEX_RSYNC_OPTIONS[@]}" \
    --include='*/' --include='*.kt' --exclude='*' \
    "${source_kotlin_root}/" "${target_plugin}/"
}

sync_exported_plugins() {
  local plugin_source

  for plugin_source in "${SOURCE_RESOURCE_PLUGINS_ROOT}"/*(N/); do
    sync_exported_plugin "${plugin_source}"
  done
}

validate_exported_plugins() {
  local plugin_source
  local plugin_name
  local target_plugin
  local source_kotlin_root
  local source_kotlin
  local relative_kotlin

  for plugin_source in "${SOURCE_RESOURCE_PLUGINS_ROOT}"/*(N/); do
    plugin_name="${plugin_source:t}"
    target_plugin="${TARGET_UNI_MODULES_ROOT}/${plugin_name}"
    source_kotlin_root="${plugin_source}/utssdk/app-android/src"
    require_dir "${target_plugin}" "同步后的 ${plugin_name} 插件目录"

    if [[ -d "${source_kotlin_root}" ]]; then
      for source_kotlin in "${source_kotlin_root}"/**/*.kt(N); do
        relative_kotlin="${source_kotlin#${source_kotlin_root}/}"
        require_path "${target_plugin}/${relative_kotlin}" "同步后的 ${plugin_name} Kotlin 源码"
      done
      if find "${target_plugin}/utssdk/app-android/src" -type f -name '*.kt' -print -quit 2>/dev/null | grep -q .; then
        fail "同步后的 ${plugin_name} 插件仍保留重复 Kotlin 源码"
      fi
    fi
  done
}

validate_external_map_plugin() {
  local source_manifest="${SOURCE_RESOURCE_PLUGINS_ROOT}/external-map-navigation/utssdk/app-android/AndroidManifest.xml"
  local target_manifest="${TARGET_UNI_MODULES_ROOT}/external-map-navigation/utssdk/app-android/AndroidManifest.xml"

  [[ -e "${source_manifest}" ]] || return
  grep -Fq 'android.intent.action.VIEW' "${source_manifest}" || \
    fail "外部地图插件 Manifest 缺少 VIEW query"
  grep -Fq 'android:scheme="geo"' "${source_manifest}" || \
    fail "外部地图插件 Manifest 缺少 geo scheme query"
  require_path "${target_manifest}" "同步后的外部地图 Android manifest"
  grep -Fq 'android:scheme="geo"' "${target_manifest}" || \
    fail "同步后的外部地图插件 Manifest 缺少 geo scheme query"
}

if [[ "${DRY_RUN}" == false ]]; then
  mkdir -p "${TARGET_APP_ROOT}" \
    "${TARGET_JAVA_ROOT}/components" \
    "${TARGET_JAVA_ROOT}/pages" \
    "${TARGET_UNI_MODULES_ROOT}" \
    "${TARGET_JPUSH_PLUGIN_ROOT}" \
    "${TARGET_LOCAL_MAVEN_ROOT}"
fi

print -- "[1/7] 同步 Android 应用资源：${APP_ID}"
sync_dir "${SOURCE_APP_ROOT}" "${TARGET_APP_ROOT}"

print -- "[2/7] 同步离线 JPush/JCore Maven 仓库"
sync_dir "${SOURCE_LOCAL_MAVEN_ROOT}" "${TARGET_LOCAL_MAVEN_ROOT}"

print -- "[3/7] 同步生成的 index.kt、components 和 pages"
rsync "${INDEX_RSYNC_OPTIONS[@]}" \
  "${SOURCE_GENERATED_ROOT}/index.kt" "${TARGET_JAVA_ROOT}/index.kt"
sync_dir "${SOURCE_GENERATED_ROOT}/components" "${TARGET_JAVA_ROOT}/components"
sync_dir "${SOURCE_GENERATED_ROOT}/pages" "${TARGET_JAVA_ROOT}/pages"

print -- "[4/7] 同步生成的 uni_modules"
sync_generated_modules

print -- "[5/7] 同步 HBuilderX 导出的 Android 插件及 Kotlin 源码"
sync_exported_plugins

print -- "[6/7] 同步 ${JPUSH_PLUGIN_NAME} 生成的 Android Kotlin 模块"
sync_dir "${SOURCE_JPUSH_CACHE_ROOT}" "${TARGET_JPUSH_PLUGIN_ROOT}"

if [[ "${DRY_RUN}" == false ]]; then
  print -- "[7/7] 校验同步结果"
  require_path "${TARGET_APP_ROOT}/www/manifest.json" "同步后的 Android Web manifest"
  require_path "${TARGET_JAVA_ROOT}/index.kt" "同步后的 Android index.kt"
  validate_exported_plugins
  validate_external_map_plugin
  require_path "${TARGET_JPUSH_PLUGIN_ROOT}/index.kt" "同步后的 JPush Kotlin 源码"
  require_path "${TARGET_JPUSH_PLUGIN_ROOT}/manifest.json" "同步后的 JPush 模块 manifest"
  require_path "${TARGET_LOCAL_MAVEN_ROOT}/cn/jiguang/sdk/jpush/6.2.0/jpush-6.2.0.aar" "同步后的离线 JPush AAR"
  require_path "${TARGET_LOCAL_MAVEN_ROOT}/cn/jiguang/sdk/jpush/6.2.0/jpush-6.2.0.pom" "同步后的离线 JPush POM"
  require_path "${TARGET_LOCAL_MAVEN_ROOT}/cn/jiguang/sdk/jcore/5.5.0/jcore-5.5.0.aar" "同步后的离线 JCore AAR"
  require_path "${TARGET_LOCAL_MAVEN_ROOT}/cn/jiguang/sdk/jcore/5.5.0/jcore-5.5.0.pom" "同步后的离线 JCore POM"
else
  print -- "[7/7] 预演完成：未执行同步后文件校验。"
fi

print -- "完成：${ANDROID_PROJECT_ROOT}"
print -- "下一步可执行：cd ${ANDROID_PROJECT_ROOT} && ./gradlew :app:assembleDebug"
