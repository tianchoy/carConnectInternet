(function(vue) {
  "use strict";
  function currentPageCaptureScreenshot(fullPage, callback) {
    var _a;
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    (_a = currentPage.vm) === null || _a === void 0 ? void 0 : _a.$viewToTempFilePath({
      wholeContent: fullPage,
      overwrite: true,
      success: (res) => {
        const fileManager = uni.getFileSystemManager();
        fileManager.readFile({
          encoding: "base64",
          filePath: res.tempFilePath,
          success(readFileRes) {
            callback(readFileRes.data, "");
          },
          fail(err) {
            callback("", "captureScreenshot fail: ".concat(JSON.stringify(err)));
          }
        });
      },
      fail: (err) => {
        callback("", "captureScreenshot fail: ".concat(JSON.stringify(err)));
      }
    });
  }
  function initRuntimeSocket(hosts, port, id) {
    if (hosts == "" || port == "" || id == "")
      return Promise.resolve(null);
    return hosts.split(",").reduce((promise, host) => {
      return promise.then((socket) => {
        if (socket != null)
          return Promise.resolve(socket);
        return tryConnectSocket(host, port, id);
      });
    }, Promise.resolve(null));
  }
  const SOCKET_TIMEOUT = 500;
  function tryConnectSocket(host, port, id) {
    return new Promise((resolve, reject) => {
      const socket = uni.connectSocket({
        url: "ws://".concat(host, ":").concat(port, "/").concat(id),
        fail() {
          resolve(null);
        }
      });
      const timer = setTimeout(() => {
        socket.close({
          code: 1006,
          reason: "connect timeout"
        });
        resolve(null);
      }, SOCKET_TIMEOUT);
      socket.onOpen((e) => {
        clearTimeout(timer);
        resolve(socket);
      });
      socket.onClose((e) => {
        clearTimeout(timer);
        resolve(null);
      });
      socket.onError((e) => {
        clearTimeout(timer);
        resolve(null);
      });
      socket.onMessage((result) => {
        if (typeof result["data"] == "string") {
          const message = JSON.parse(result["data"]);
          if (message["type"] == "screencap") {
            const id2 = message["id"];
            currentPageCaptureScreenshot(message["fullPage"], (base64, error) => {
              socket.send({
                data: JSON.stringify({
                  id: id2,
                  base64,
                  error
                })
              });
            });
          }
        }
        resolve(null);
      });
    });
  }
  function initRuntimeSocketService() {
    const hosts = "127.0.0.1,192.168.1.252";
    const port = "8090";
    const id = "app-ios_XO-X41";
    return Promise.resolve().then(() => {
      return initRuntimeSocket(hosts, port, id).then((socket) => {
        if (socket == null) {
          return false;
        }
        return true;
      });
    }).catch(() => {
      return false;
    });
  }
  initRuntimeSocketService();
  const _sfc_main$N = /* @__PURE__ */ vue.defineComponent(Object.assign({ name: "i-icon" }, { __name: "i-icon", props: {
    name: {
      type: String,
      default: "home-3-fill"
    },
    fontSize: {
      type: String,
      default: "16"
    },
    fontFamily: {
      type: String,
      default: "remixicon"
    },
    code: {
      type: String,
      default: ""
    },
    color: {
      type: String,
      default: "black"
    },
    darkColor: {
      type: String,
      default: ""
    },
    spin: {
      type: Boolean,
      default: false
    },
    rotation: {
      type: Number,
      default: 0
    },
    duration: {
      type: Number,
      default: 1500
    },
    type: {
      type: String,
      default: ""
    },
    size: {
      type: String,
      default: ""
    },
    plain: {
      type: Boolean,
      default: false
    },
    bgColor: {
      type: String,
      default: ""
    },
    label: {
      type: String,
      default: ""
    },
    customStyle: {
      type: String,
      default: ""
    }
  }, emits: ["click"], setup(__props, _a) {
    var __expose = _a.expose, __emit = _a.emit;
    __expose();
    const props = __props;
    const emit = __emit;
    const spinAngle = vue.ref(0);
    let spinTimer = 0;
    function formatSize(value) {
      if (value.indexOf("px") >= 0 || value.indexOf("rpx") >= 0 || value.indexOf("rem") >= 0 || value.indexOf("%") >= 0) {
        return value;
      }
      return value + "px";
    }
    const iconBgColor = vue.computed(() => {
      return props.bgColor;
    });
    const remixCodeMap = /* @__PURE__ */ new Map([
      ["home-3-fill", "ee1a"],
      ["chat-3-line", "eb51"],
      ["chat-3-fill", "eb50"],
      ["contrast-drop-2-fill", "ebd5"],
      ["circle-line", "f3c2"],
      ["smartphone-line", "f15a"],
      ["git-repository-private-fill", "edc8"],
      ["mouse-fill", "ef7c"],
      ["arrow-up-line", "ea76"],
      ["information-line", "ee59"],
      ["gps-line", "eddb"],
      ["headphone-line", "ee05"],
      ["rocket-fill", "f095"],
      ["mic-2-line", "ef4e"],
      ["image-circle-line", "f413"],
      ["plane-line", "f005"],
      ["loader-line", "eeca"],
      ["refresh-line", "f064"],
      ["check-line", "eb7b"],
      ["close-line", "eb99"],
      ["add-line", "ea13"],
      ["subtract-line", "f1af"],
      ["search-line", "f0d1"],
      ["star-fill", "f186"],
      ["map-pin-line", "ef14"],
      ["error-warning-line", "eca1"],
      ["arrow-right-line", "ea6c"],
      ["arrow-left-line", "ea60"]
    ]);
    const legacyNameMap = /* @__PURE__ */ new Map([
      ["check", "check-line"],
      ["close", "close-line"],
      ["plus", "add-line"],
      ["minus", "subtract-line"],
      ["search", "search-line"],
      ["star", "star-fill"],
      ["map", "map-pin-line"],
      ["warning", "error-warning-line"],
      ["arrow-right", "arrow-right-line"],
      ["arrow-left", "arrow-left-line"]
    ]);
    const legacyGlyphMap = /* @__PURE__ */ new Map([
      ["check", "✓"],
      ["close", "x"],
      ["plus", "+"],
      ["minus", "-"],
      ["search", "⌕"],
      ["star", "★"],
      ["map", "⌖"],
      ["warning", "!"],
      ["arrow-right", ">"],
      ["arrow-left", "<"]
    ]);
    const normalizedName = vue.computed(() => {
      const value = props.name;
      if (legacyNameMap.has(value))
        return UTS.mapGet(legacyNameMap, value);
      if (value.indexOf("ri-") == 0)
        return value.substring(3);
      return value;
    });
    const isImage = vue.computed(() => {
      const value = props.name;
      return value.indexOf("http://") == 0 || value.indexOf("https://") == 0 || value.indexOf("/") == 0 || value.indexOf("./") == 0 || value.indexOf("../") == 0 || value.indexOf("@/") == 0;
    });
    const iconCode = vue.computed(() => {
      if (props.code.length > 0)
        return props.code;
      const value = normalizedName.value;
      if (remixCodeMap.has(value))
        return UTS.mapGet(remixCodeMap, value);
      return "";
    });
    const iconText = vue.computed(() => {
      const code = iconCode.value;
      if (code.length > 0)
        return String.fromCharCode(parseInt(code, 16));
      if (legacyGlyphMap.has(props.name))
        return UTS.mapGet(legacyGlyphMap, props.name);
      return props.name;
    });
    const normalizedSize = vue.computed(() => {
      const value = props.size;
      if (value == "mini" || value == "normal" || value == "large")
        return value;
      if (value.length > 0)
        return "custom";
      return "";
    });
    const hasBadge = vue.computed(() => {
      return props.type.length > 0 || iconBgColor.value.length > 0 || props.plain;
    });
    const iconClass = vue.computed(() => {
      const classes = ["i-icon"];
      if (hasBadge.value) {
        classes.push("i-icon--badge");
        if (props.type.length > 0)
          classes.push("i-icon--" + props.type);
        if (normalizedSize.value.length > 0)
          classes.push("i-icon--" + normalizedSize.value);
        if (props.plain)
          classes.push("i-icon--plain");
      }
      return classes.join(" ");
    });
    const textClass = vue.computed(() => {
      const classes = ["i-icon__text"];
      if (props.spin)
        classes.push("i-icon__text--spin");
      if (hasBadge.value)
        classes.push("i-icon__text--badge");
      if (hasBadge.value && props.plain && props.type.length > 0) {
        classes.push("i-icon__text--" + props.type);
      }
      return classes.join(" ");
    });
    const imageClass = vue.computed(() => {
      const classes = ["i-icon__image"];
      if (props.spin)
        classes.push("i-icon__image--spin");
      return classes.join(" ");
    });
    const resolvedFontSize = vue.computed(() => {
      const value = props.size;
      if (value == "mini")
        return "14px";
      if (value == "normal")
        return "17px";
      if (value == "large")
        return "22px";
      if (value.length > 0)
        return formatSize(value);
      return formatSize(props.fontSize);
    });
    const badgeSize = vue.computed(() => {
      const value = props.size;
      if (value == "mini")
        return "26px";
      if (value == "normal")
        return "34px";
      if (value == "large")
        return "44px";
      if (value.length > 0)
        return formatSize(value);
      if (props.fontSize.length > 0)
        return formatSize(props.fontSize);
      return "16px";
    });
    const wrapStyle = vue.computed(() => {
      let style = props.customStyle;
      if (hasBadge.value) {
        const size = badgeSize.value;
        style = style + "width:" + size + ";height:" + size + ";border-radius:" + size + ";";
      }
      if (iconBgColor.value.length > 0) {
        style = style + "background-color:" + iconBgColor.value + ";";
      }
      return style;
    });
    function iconTypeColor() {
      if (props.type == "primary")
        return "#2979ff";
      if (props.type == "success")
        return "#19be6b";
      if (props.type == "warning")
        return "#ff9900";
      if (props.type == "danger")
        return "#fa3534";
      return "#303133";
    }
    const activeRotation = vue.computed(() => {
      let angle = (props.rotation + spinAngle.value) % 360;
      if (angle < 0)
        angle = angle + 360;
      return angle;
    });
    const imageStyle = vue.computed(() => {
      const size = resolvedFontSize.value;
      let style = "width:" + size + ";height:" + size + ";";
      const angle = activeRotation.value;
      if (angle != 0)
        style = style + "transform:rotate(" + angle.toString() + "deg);";
      return style;
    });
    function startSpin() {
      if (spinTimer > 0)
        return null;
      spinTimer = setInterval(() => {
        const duration = Math.max(120, props.duration);
        const step = Math.max(6, Math.round(360 * 50 / duration));
        let angle = (spinAngle.value + step) % 360;
        if (angle < 0)
          angle = angle + 360;
        spinAngle.value = angle;
      }, 50);
    }
    function stopSpin() {
      if (spinTimer > 0) {
        clearInterval(spinTimer);
        spinTimer = 0;
      }
      spinAngle.value = 0;
    }
    const textStyle = vue.computed(() => {
      let style = "font-size:" + resolvedFontSize.value + ";";
      if (props.fontFamily.length > 0 && iconCode.value.length > 0) {
        style = style + "font-family:" + props.fontFamily + ";";
      }
      let color = props.color;
      if (hasBadge.value && props.color == "black") {
        color = props.plain ? iconTypeColor() : "#ffffff";
      }
      if (color.length > 0)
        style = style + "color:" + color + ";";
      const angle = activeRotation.value;
      if (angle != 0)
        style = style + "transform:rotate(" + angle.toString() + "deg);";
      return style;
    });
    vue.onMounted(() => {
      if (props.spin)
        startSpin();
    });
    vue.onUnmounted(() => {
      stopSpin();
    });
    function handleClick() {
      emit("click", new UTSJSONObject({
        name: props.name,
        code: iconCode.value,
        label: props.label
      }));
    }
    const __returned__ = { props, emit, spinAngle, get spinTimer() {
      return spinTimer;
    }, set spinTimer(v) {
      spinTimer = v;
    }, formatSize, iconBgColor, remixCodeMap, legacyNameMap, legacyGlyphMap, normalizedName, isImage, iconCode, iconText, normalizedSize, hasBadge, iconClass, textClass, imageClass, resolvedFontSize, badgeSize, wrapStyle, iconTypeColor, activeRotation, imageStyle, startSpin, stopSpin, textStyle, handleClick };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  } }));
  const _style_0$L = { "i-icon": { "": { "display": "flex", "alignItems": "center", "justifyContent": "center" } }, "i-icon--badge": { "": { "width": 34, "height": 34, "borderTopLeftRadius": 34, "borderTopRightRadius": 34, "borderBottomRightRadius": 34, "borderBottomLeftRadius": 34 } }, "i-icon--mini": { "": { "width": 26, "height": 26, "borderTopLeftRadius": 26, "borderTopRightRadius": 26, "borderBottomRightRadius": 26, "borderBottomLeftRadius": 26 } }, "i-icon--large": { "": { "width": 44, "height": 44, "borderTopLeftRadius": 44, "borderTopRightRadius": 44, "borderBottomRightRadius": 44, "borderBottomLeftRadius": 44 } }, "i-icon--primary": { "": { "backgroundColor": "#2979ff" } }, "i-icon--success": { "": { "backgroundColor": "#19be6b" } }, "i-icon--warning": { "": { "backgroundColor": "#ff9900" } }, "i-icon--danger": { "": { "backgroundColor": "#fa3534" } }, "i-icon--plain": { "": { "backgroundColor": "#ffffff", "borderTopColor": "#dcdfe6", "borderRightColor": "#dcdfe6", "borderBottomColor": "#dcdfe6", "borderLeftColor": "#dcdfe6", "borderTopStyle": "solid", "borderRightStyle": "solid", "borderBottomStyle": "solid", "borderLeftStyle": "solid", "borderTopWidth": 1, "borderRightWidth": 1, "borderBottomWidth": 1, "borderLeftWidth": 1 } }, "i-icon__text": { "": { "color": "#303133", "fontSize": 16, "lineHeight": 1 } }, "i-icon__text--badge": { "": { "color": "#ffffff", "fontWeight": 700 } }, "i-icon__text--primary": { "": { "color": "#2979ff" } }, "i-icon__text--success": { "": { "color": "#19be6b" } }, "i-icon__text--warning": { "": { "color": "#ff9900" } }, "i-icon__text--danger": { "": { "color": "#fa3534" } }, "i-icon__image": { "": { "width": 16, "height": 16 } }, "@FONT-FACE": [{ "fontFamily": "remixicon", "src": 'url("/uni_modules/i-ui-x/static/remixicon.woff2") format("woff2"),\n    url("https://cdn.jsdelivr.net/npm/remixicon@4.5.0/fonts/remixicon.ttf")\n      format("truetype")' }] };
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  function _sfc_render$M(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass($setup.iconClass),
        style: vue.normalizeStyle($setup.wrapStyle),
        onClick: $setup.handleClick
      },
      [
        $setup.isImage ? (vue.openBlock(), vue.createElementBlock("image", {
          key: 0,
          class: vue.normalizeClass($setup.imageClass),
          src: $setup.props.name,
          style: vue.normalizeStyle($setup.imageStyle),
          mode: "aspectFit"
        }, null, 14, ["src"])) : (vue.openBlock(), vue.createElementBlock(
          "text",
          {
            key: 1,
            class: vue.normalizeClass($setup.textClass),
            style: vue.normalizeStyle($setup.textStyle)
          },
          vue.toDisplayString($setup.iconText),
          7
          /* TEXT, CLASS, STYLE */
        ))
      ],
      6
      /* CLASS, STYLE */
    );
  }
  const __easycom_2$6 = /* @__PURE__ */ _export_sfc(_sfc_main$N, [["render", _sfc_render$M], ["styles", [_style_0$L]], ["__file", "/Users/xyhc/Documents/carConnectInternet/uni_modules/i-ui-x/components/i-icon/i-icon.uvue"]]);
  function resolveEasycom(component, easycom) {
    return typeof component === "string" ? easycom : component;
  }
  const _sfc_main$M = /* @__PURE__ */ vue.defineComponent(Object.assign({ name: "i-line-progress" }, { __name: "i-line-progress", props: {
    percent: { type: Number, default: 45 },
    title: { type: String, default: "" },
    activeColor: { type: String, default: "#19be6b" },
    inactiveColor: { type: String, default: "#ebeef5" },
    height: { type: Number, default: 8 },
    showText: { type: Boolean, default: true }
  }, emits: ["click", "change", "update:percent"], setup(__props, _a) {
    var __expose = _a.expose, __emit = _a.emit;
    __expose();
    const props = __props;
    const emit = __emit;
    const current = vue.ref(props.percent);
    const normalized = vue.computed(() => {
      if (current.value < 0)
        return 0;
      if (current.value > 100)
        return 100;
      return Math.round(current.value);
    });
    function step(delta) {
      current.value = Math.min(100, Math.max(0, current.value + delta));
      emit("change", current.value);
      emit("update:percent", current.value);
    }
    function emitClick() {
      emit("click", current.value);
    }
    const __returned__ = { props, emit, current, normalized, step, emitClick };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  } }));
  const _style_0$K = { "i-card": { "": { "display": "flex", "flexDirection": "row", "alignItems": "center", "justifyContent": "space-between" } }, "i-title": { "": { "color": "#303133", "fontSize": 15, "fontWeight": 600, "lineHeight": "22px" } }, "i-muted": { "": { "color": "#909399", "fontSize": 12, "lineHeight": "18px" } }, "i-row": { "": { "flexDirection": "row", "alignItems": "center", "flexWrap": "wrap" } }, "i-btn": { "": { "minHeight": 34, "marginTop": 10, "marginRight": 8, "paddingTop": 0, "paddingRight": 12, "paddingBottom": 0, "paddingLeft": 12, "borderTopLeftRadius": 6, "borderTopRightRadius": 6, "borderBottomRightRadius": 6, "borderBottomLeftRadius": 6, "backgroundColor": "#ecf5ff", "alignItems": "center", "justifyContent": "center" } }, "i-btn--plain": { "": { "backgroundColor": "#f5f7fa" } }, "i-btn--danger": { "": { "backgroundColor": "#fef0f0" } }, "i-btn-text": { "": { "color": "#2979ff", "fontSize": 13, "lineHeight": "18px" } }, "i-danger": { "": { "color": "#f56c6c" } }, "i-head": { "": { "justifyContent": "space-between" } }, "i-track": { "": { "borderTopLeftRadius": 999, "borderTopRightRadius": 999, "borderBottomRightRadius": 999, "borderBottomLeftRadius": 999, "flexGrow": 1, "flexShrink": 1, "flexBasis": "0%", "marginRight": 5, "overflow": "hidden" } }, "i-fill": { "": { "height": "100%", "borderTopLeftRadius": 999, "borderTopRightRadius": 999, "borderBottomRightRadius": 999, "borderBottomLeftRadius": 999 } } };
  function _sfc_render$L(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", {
      class: "i-card",
      onClick: $setup.emitClick
    }, [
      vue.createElementVNode(
        "view",
        {
          class: "i-track",
          style: vue.normalizeStyle("height:" + $props.height + "px;background-color:" + $props.inactiveColor)
        },
        [
          vue.createElementVNode(
            "view",
            {
              class: "i-fill",
              style: vue.normalizeStyle("width:" + $setup.normalized + "%;background-color:" + $props.activeColor)
            },
            null,
            4
            /* STYLE */
          )
        ],
        4
        /* STYLE */
      ),
      vue.createElementVNode("view", { class: "i-row i-head" }, [
        vue.createElementVNode(
          "text",
          { class: "i-title" },
          vue.toDisplayString($props.title),
          1
          /* TEXT */
        ),
        $props.showText ? (vue.openBlock(), vue.createElementBlock(
          "text",
          {
            key: 0,
            class: "i-muted"
          },
          vue.toDisplayString($setup.normalized) + "%",
          1
          /* TEXT */
        )) : vue.createCommentVNode("v-if", true)
      ])
    ]);
  }
  const __easycom_1$4 = /* @__PURE__ */ _export_sfc(_sfc_main$M, [["render", _sfc_render$L], ["styles", [_style_0$K]], ["__file", "/Users/xyhc/Documents/carConnectInternet/uni_modules/i-ui-x/components/i-line-progress/i-line-progress.uvue"]]);
  let PickerItem$1 = class PickerItem2 extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            text: { type: String, optional: false },
            value: { type: "Any", optional: false },
            disabled: { type: Boolean, optional: false }
          };
        },
        name: "PickerItem"
      };
    }
    constructor(options, metadata = PickerItem2.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.text = this.__props__.text;
      this.value = this.__props__.value;
      this.disabled = this.__props__.disabled;
      delete this.__props__;
    }
  };
  const _sfc_main$L = /* @__PURE__ */ vue.defineComponent(Object.assign({ name: "i-picker" }, { __name: "i-picker", props: {
    modelValue: {
      type: [String, Number, Array],
      default: ""
    },
    show: {
      type: Boolean,
      default: false
    },
    showToolbar: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: ""
    },
    columns: {
      type: Array,
      default: () => {
        return [];
      }
    },
    loading: {
      type: Boolean,
      default: false
    },
    itemHeight: {
      type: Number,
      default: 44
    },
    cancelText: {
      type: String,
      default: "取消"
    },
    confirmText: {
      type: String,
      default: "确认"
    },
    cancelColor: {
      type: String,
      default: "#909193"
    },
    confirmColor: {
      type: String,
      default: "#3c9cff"
    },
    visibleItemCount: {
      type: Number,
      default: 5
    },
    closeOnMask: { type: Boolean, default: true },
    defaultIndex: {
      type: [Number, Array],
      default: 0
    },
    immediateChange: {
      type: Boolean,
      default: false
    },
    round: {
      type: [String, Number],
      default: 16
    },
    showInput: {
      type: Boolean,
      default: true
    },
    showDefaultValue: {
      type: Boolean,
      default: true
    },
    options: {
      type: Array,
      default: () => {
        return ["Apple", "Orange", "Banana"];
      }
    },
    value: {
      type: [String, Number],
      default: ""
    },
    disabled: {
      type: Boolean,
      default: false
    }
  }, emits: [
    "open",
    "close",
    "cancel",
    "change",
    "confirm",
    "clear",
    "update:value",
    "update:modelValue",
    "update:show"
  ], setup(__props, _a) {
    var __expose = _a.expose, __emit = _a.emit;
    const props = __props;
    const emit = __emit;
    function isArray(value = null) {
      return Array.isArray(value);
    }
    function normalizeItem(item = null) {
      const data = item;
      if (data != null) {
        const rawValue = data["value"];
        const rawText = data["text"];
        const text = rawText != null ? rawText.toString() : rawValue != null ? rawValue.toString() : "";
        const value = rawValue != null ? rawValue : text;
        return new PickerItem$1({
          text,
          value,
          disabled: data["disabled"] == true
        });
      }
      return new PickerItem$1({
        text: item.toString(),
        value: item,
        disabled: false
      });
    }
    function normalizeColumn(list) {
      const result = new Array();
      for (let i = 0; i < list.length; i++)
        result.push(normalizeItem(list[i]));
      return result;
    }
    const opened = vue.ref(props.show);
    const currentIndexs = vue.ref([]);
    const normalizedColumns = vue.computed(() => {
      const source = props.columns.length > 0 ? props.columns : props.options;
      if (source.length == 0)
        return new Array();
      const first = source[0];
      if (isArray(first)) {
        const result = new Array();
        for (let i = 0; i < source.length; i++)
          result.push(normalizeColumn(source[i]));
        return result;
      }
      return [normalizeColumn(source)];
    });
    function selectedIndexAt(columnIndex) {
      if (currentIndexs.value.length <= columnIndex)
        return 0;
      return currentIndexs.value[columnIndex];
    }
    function selectedItems() {
      const result = new Array();
      const columns = normalizedColumns.value;
      for (let i = 0; i < columns.length; i++) {
        const column = columns[i];
        const index = selectedIndexAt(i);
        if (index >= 0 && index < column.length)
          result.push(column[index]);
      }
      return result;
    }
    function columnAt(index) {
      if (index < 0 || index >= normalizedColumns.value.length)
        return new Array();
      return normalizedColumns.value[index];
    }
    function visibleCountNumber() {
      const count = props.visibleItemCount;
      if (count <= 0)
        return 5;
      return count;
    }
    function itemHeightNumber() {
      const height = props.itemHeight;
      if (height <= 0)
        return 44;
      return height;
    }
    function formatSize(value) {
      return value.toString() + "px";
    }
    const displayText = vue.computed(() => {
      const items = selectedItems();
      if (items.length == 0)
        return "请选择";
      const texts = new Array();
      for (let i = 0; i < items.length; i++)
        texts.push(items[i].text);
      return texts.join(" / ");
    });
    const displayTextClass = vue.computed(() => {
      return selectedItems().length == 0 ? "i-picker__input-text i-picker__input-text--placeholder" : "i-picker__input-text";
    });
    const columnCount = vue.computed(() => {
      return normalizedColumns.value.length;
    });
    const column0 = vue.computed(() => {
      return columnAt(0);
    });
    const column1 = vue.computed(() => {
      return columnAt(1);
    });
    const column2 = vue.computed(() => {
      return columnAt(2);
    });
    const column3 = vue.computed(() => {
      return columnAt(3);
    });
    const column4 = vue.computed(() => {
      return columnAt(4);
    });
    const column5 = vue.computed(() => {
      return columnAt(5);
    });
    const columnsStyle = vue.computed(() => {
      const height = itemHeightNumber() * visibleCountNumber();
      return "width:100%;height:" + height.toString() + "px;";
    });
    const indicatorStyle = vue.computed(() => {
      return "height:" + formatSize(props.itemHeight) + ";background-color:transparent;border-top:1px solid #eef0f4;border-bottom:1px solid #eef0f4;";
    });
    const itemStyle = vue.computed(() => {
      return "height:" + formatSize(props.itemHeight) + ";";
    });
    const panelStyle = vue.computed(() => {
      const radius = formatSize(props.round);
      return "border-radius:" + radius + " " + radius + " 0 0;";
    });
    function hasModelValue() {
      if (isArray(props.modelValue)) {
        const modelValues = props.modelValue;
        return modelValues.length > 0;
      }
      return props.modelValue.length > 0;
    }
    function activeModelValue() {
      if (hasModelValue())
        return props.modelValue;
      const value = props.value;
      if (value.length > 0)
        return value;
      return null;
    }
    function columnTargetValue(value = null, columnIndex) {
      if (value == null)
        return null;
      if (isArray(value)) {
        const values = value;
        return values.length > columnIndex ? values[columnIndex] : null;
      }
      return columnIndex == 0 ? value : null;
    }
    function defaultIndexAt(columnIndex) {
      if (isArray(props.defaultIndex)) {
        const defaultIndexes = props.defaultIndex;
        if (defaultIndexes.length > columnIndex)
          return defaultIndexes[columnIndex];
        return 0;
      }
      return columnIndex == 0 ? props.defaultIndex : 0;
    }
    function findValueIndex(column, value = null) {
      for (let i = 0; i < column.length; i++) {
        const itemValue = column[i].value;
        if (itemValue == value)
          return i;
      }
      return -1;
    }
    function hasTargetValue(value = null) {
      if (value == null)
        return false;
      if (isArray(value))
        return true;
      return value.length > 0;
    }
    function syncIndexs() {
      const columns = normalizedColumns.value;
      const result = new Array();
      const value = activeModelValue();
      for (let i = 0; i < columns.length; i++) {
        const column = columns[i];
        const targetValue = columnTargetValue(value, i);
        let index = -1;
        if (hasTargetValue(targetValue)) {
          index = findValueIndex(column, targetValue);
        }
        if (index < 0 && (props.showDefaultValue || !hasModelValue())) {
          index = defaultIndexAt(i);
        }
        if (index < 0)
          index = 0;
        if (index >= column.length)
          index = column.length - 1;
        result.push(index);
      }
      currentIndexs.value = result;
    }
    syncIndexs();
    function selectedValue() {
      const items = selectedItems();
      if (items.length == 0)
        return "";
      if (items.length == 1)
        return items[0].value;
      const values = new Array();
      for (let i = 0; i < items.length; i++)
        values.push(items[i].value);
      return values;
    }
    function pickerValuePayload() {
      const items = selectedItems();
      if (items.length == 1)
        return items[0];
      return items;
    }
    function buildChangeEvent(columnIndex, index) {
      return new UTSJSONObject({
        index,
        indexs: currentIndexs.value,
        columnIndex,
        value: pickerValuePayload(),
        values: selectedItems()
      });
    }
    function buildConfirmEvent() {
      return new UTSJSONObject({
        indexs: currentIndexs.value,
        value: pickerValuePayload(),
        values: selectedItems()
      });
    }
    function emitSelectedValue() {
      const value = selectedValue();
      emit("update:modelValue", value);
      emit("update:value", isArray(value) ? "" : value);
    }
    function open() {
      if (opened.value)
        return null;
      syncIndexs();
      opened.value = true;
      emit("open");
      emit("update:show", true);
    }
    function openByTrigger() {
      if (props.disabled)
        return null;
      open();
    }
    function close() {
      if (!opened.value)
        return null;
      opened.value = false;
      emit("close");
      emit("update:show", false);
    }
    function cancel() {
      emit("cancel", buildChangeEvent(0, selectedIndexAt(0)));
      close();
    }
    function confirm() {
      const event = buildConfirmEvent();
      emit("confirm", event);
      emitSelectedValue();
      close();
    }
    function clear() {
      currentIndexs.value = [];
      emit("clear");
      emit("change", buildChangeEvent(0, -1));
      emit("update:value", "");
      emit("update:modelValue", "");
    }
    function handleOverlayClick() {
      if (!props.closeOnMask)
        return null;
      close();
    }
    function handlePickerChange(event) {
      if (props.disabled || props.loading)
        return null;
      const values = event.detail.value;
      const nextIndexs = new Array();
      let changedColumnIndex = 0;
      for (let i = 0; i < normalizedColumns.value.length; i++) {
        const column = normalizedColumns.value[i];
        const oldIndex = selectedIndexAt(i);
        let nextIndex = 0;
        if (values.length > i)
          nextIndex = values[i];
        if (nextIndex < 0)
          nextIndex = 0;
        if (nextIndex >= column.length)
          nextIndex = column.length - 1;
        if (column.length > 0 && column[nextIndex].disabled)
          nextIndex = oldIndex;
        if (oldIndex != nextIndex)
          changedColumnIndex = i;
        nextIndexs.push(nextIndex);
      }
      currentIndexs.value = nextIndexs;
      const eventValue = buildChangeEvent(changedColumnIndex, selectedIndexAt(changedColumnIndex));
      emit("change", eventValue);
      if (props.immediateChange)
        emitSelectedValue();
    }
    function itemClass(item, columnIndex, itemIndex) {
      const classes = new Array();
      classes.push("i-picker__item");
      if (selectedIndexAt(columnIndex) == itemIndex)
        classes.push("i-picker__item--active");
      if (item.disabled)
        classes.push("i-picker__item--disabled");
      return classes.join(" ");
    }
    function itemTextClass(item, columnIndex, itemIndex) {
      return selectedIndexAt(columnIndex) == itemIndex ? "i-picker__item-text i-picker__item-text--active" : "i-picker__item-text";
    }
    function itemTextStyle(item, columnIndex, itemIndex) {
      let style = "line-height:" + formatSize(props.itemHeight) + ";color:#606266;";
      if (selectedIndexAt(columnIndex) == itemIndex) {
        style = style + "color:#111827;";
      }
      return style;
    }
    __expose({
      open,
      close,
      clear,
      getIndexs() {
        return currentIndexs.value;
      },
      getValues() {
        return selectedItems();
      },
      getColumns() {
        return normalizedColumns.value;
      },
      getColumnValues(columnIndex) {
        if (columnIndex < 0 || columnIndex >= normalizedColumns.value.length)
          return [];
        return normalizedColumns.value[columnIndex];
      },
      setColumnValues(columnIndex, values) {
        emit("change", {
          index: selectedIndexAt(columnIndex),
          indexs: currentIndexs.value,
          columnIndex,
          value: values,
          values
        });
      }
    });
    const __returned__ = { props, emit, isArray, normalizeItem, normalizeColumn, opened, currentIndexs, normalizedColumns, selectedIndexAt, selectedItems, columnAt, visibleCountNumber, itemHeightNumber, formatSize, displayText, displayTextClass, columnCount, column0, column1, column2, column3, column4, column5, columnsStyle, indicatorStyle, itemStyle, panelStyle, hasModelValue, activeModelValue, columnTargetValue, defaultIndexAt, findValueIndex, hasTargetValue, syncIndexs, selectedValue, pickerValuePayload, buildChangeEvent, buildConfirmEvent, emitSelectedValue, open, openByTrigger, close, cancel, confirm, clear, handleOverlayClick, handlePickerChange, itemClass, itemTextClass, itemTextStyle };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  } }));
  const _style_0$J = { "i-picker": { "": { "width": "100%" } }, "i-picker__trigger": { "": { "width": "100%" } }, "i-picker__input": { "": { "height": 44, "paddingTop": 0, "paddingRight": 12, "paddingBottom": 0, "paddingLeft": 12, "borderTopLeftRadius": 8, "borderTopRightRadius": 8, "borderBottomRightRadius": 8, "borderBottomLeftRadius": 8, "backgroundColor": "#ffffff", "flexDirection": "row", "alignItems": "center" } }, "i-picker__input-text": { "": { "flexGrow": 1, "flexShrink": 1, "flexBasis": "0%", "color": "#303133", "fontSize": 14, "lineHeight": "22px" } }, "i-picker__input-text--placeholder": { "": { "color": "#909193" } }, "i-picker__arrow": { "": { "width": 20, "color": "#909193", "fontSize": 20, "lineHeight": "24px", "textAlign": "right", "transform": "rotate(90deg)" } }, "i-picker__mask": { "": { "position": "fixed", "left": 0, "right": 0, "top": 0, "bottom": 0, "zIndex": 150, "backgroundColor": "rgba(0,0,0,0.42)", "justifyContent": "flex-end" } }, "i-picker__panel": { "": { "overflow": "hidden", "backgroundColor": "#ffffff" } }, "i-picker__toolbar": { "": { "height": 48, "paddingTop": 0, "paddingRight": 16, "paddingBottom": 0, "paddingLeft": 16, "borderBottomWidth": 1, "borderBottomStyle": "solid", "borderBottomColor": "#eef0f4", "flexDirection": "row", "alignItems": "center", "justifyContent": "space-between" } }, "i-picker__cancel": { "": { "width": 64, "fontSize": 14, "lineHeight": "22px" } }, "i-picker__confirm": { "": { "width": 64, "fontSize": 14, "lineHeight": "22px", "textAlign": "right" } }, "i-picker__title": { "": { "flexGrow": 1, "flexShrink": 1, "flexBasis": "0%", "color": "#111827", "fontSize": 16, "fontWeight": 700, "lineHeight": "24px", "textAlign": "center" } }, "i-picker__loading": { "": { "position": "absolute", "left": 0, "right": 0, "top": 48, "bottom": 0, "zIndex": 2, "backgroundColor": "rgba(255,255,255,0.78)", "alignItems": "center", "justifyContent": "center" } }, "i-picker__loading-text": { "": { "color": "#606266", "fontSize": 14, "lineHeight": "22px" } }, "i-picker__columns": { "": { "width": "100%" } }, "i-picker__column": { "": { "flexGrow": 1, "flexShrink": 1, "flexBasis": "0%", "height": "100%" } }, "i-picker__item": { "": { "width": "100%", "paddingTop": 0, "paddingRight": 8, "paddingBottom": 0, "paddingLeft": 8, "alignItems": "center", "justifyContent": "center" } }, "i-picker__item--active": { "": { "backgroundColor": "rgba(0,0,0,0)" } }, "i-picker__item--disabled": { "": { "opacity": 0.42 } }, "i-picker__item-text": { "": { "color": "#303133", "fontSize": 15, "lineHeight": "22px", "textAlign": "center" } }, "i-picker__item-text--active": { "": { "color": "#111827", "fontWeight": 700 } } };
  function _sfc_render$K(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "i-picker" }, [
      $props.showInput ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "i-picker__trigger",
        onClick: $setup.openByTrigger
      }, [
        vue.renderSlot(_ctx.$slots, "trigger", {}, () => [
          vue.renderSlot(_ctx.$slots, "default", {}, () => [
            vue.createElementVNode("view", { class: "i-picker__input" }, [
              vue.createElementVNode(
                "text",
                {
                  class: vue.normalizeClass($setup.displayTextClass)
                },
                vue.toDisplayString($setup.displayText),
                3
                /* TEXT, CLASS */
              ),
              vue.createElementVNode("text", { class: "i-picker__arrow" }, "›")
            ])
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true),
      $setup.opened ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "i-picker__mask",
        onClick: $setup.handleOverlayClick
      }, [
        vue.createElementVNode(
          "view",
          {
            class: "i-picker__panel",
            style: vue.normalizeStyle($setup.panelStyle),
            onClick: _cache[0] || (_cache[0] = vue.withModifiers(() => {
            }, ["stop"]))
          },
          [
            $props.showToolbar ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "i-picker__toolbar"
            }, [
              vue.createElementVNode(
                "text",
                {
                  class: "i-picker__cancel",
                  style: vue.normalizeStyle("color:" + $props.cancelColor + ";"),
                  onClick: $setup.cancel
                },
                vue.toDisplayString($props.cancelText),
                5
                /* TEXT, STYLE */
              ),
              vue.createElementVNode(
                "text",
                { class: "i-picker__title" },
                vue.toDisplayString($props.title),
                1
                /* TEXT */
              ),
              vue.createElementVNode(
                "text",
                {
                  class: "i-picker__confirm",
                  style: vue.normalizeStyle("color:" + $props.confirmColor + ";"),
                  onClick: $setup.confirm
                },
                vue.toDisplayString($props.confirmText),
                5
                /* TEXT, STYLE */
              )
            ])) : vue.createCommentVNode("v-if", true),
            $props.loading ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 1,
              class: "i-picker__loading"
            }, [
              vue.createElementVNode("text", { class: "i-picker__loading-text" }, "加载中...")
            ])) : vue.createCommentVNode("v-if", true),
            vue.createElementVNode("picker-view", {
              class: "i-picker__columns",
              style: vue.normalizeStyle($setup.columnsStyle),
              value: $setup.currentIndexs,
              "indicator-style": $setup.indicatorStyle,
              onChange: $setup.handlePickerChange
            }, [
              $setup.columnCount > 0 ? (vue.openBlock(), vue.createElementBlock("picker-view-column", {
                key: 0,
                class: "i-picker__column"
              }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($setup.column0, (item, itemIndex) => {
                    return vue.openBlock(), vue.createElementBlock(
                      "view",
                      {
                        key: item.value,
                        class: vue.normalizeClass($setup.itemClass(item, 0, itemIndex)),
                        style: vue.normalizeStyle($setup.itemStyle)
                      },
                      [
                        vue.createElementVNode(
                          "text",
                          {
                            class: vue.normalizeClass($setup.itemTextClass(item, 0, itemIndex)),
                            style: vue.normalizeStyle($setup.itemTextStyle(item, 0, itemIndex))
                          },
                          vue.toDisplayString(item.text),
                          7
                          /* TEXT, CLASS, STYLE */
                        )
                      ],
                      6
                      /* CLASS, STYLE */
                    );
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ])) : vue.createCommentVNode("v-if", true),
              $setup.columnCount > 1 ? (vue.openBlock(), vue.createElementBlock("picker-view-column", {
                key: 1,
                class: "i-picker__column"
              }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($setup.column1, (item, itemIndex) => {
                    return vue.openBlock(), vue.createElementBlock(
                      "view",
                      {
                        key: item.value,
                        class: vue.normalizeClass($setup.itemClass(item, 1, itemIndex)),
                        style: vue.normalizeStyle($setup.itemStyle)
                      },
                      [
                        vue.createElementVNode(
                          "text",
                          {
                            class: vue.normalizeClass($setup.itemTextClass(item, 1, itemIndex)),
                            style: vue.normalizeStyle($setup.itemTextStyle(item, 1, itemIndex))
                          },
                          vue.toDisplayString(item.text),
                          7
                          /* TEXT, CLASS, STYLE */
                        )
                      ],
                      6
                      /* CLASS, STYLE */
                    );
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ])) : vue.createCommentVNode("v-if", true),
              $setup.columnCount > 2 ? (vue.openBlock(), vue.createElementBlock("picker-view-column", {
                key: 2,
                class: "i-picker__column"
              }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($setup.column2, (item, itemIndex) => {
                    return vue.openBlock(), vue.createElementBlock(
                      "view",
                      {
                        key: item.value,
                        class: vue.normalizeClass($setup.itemClass(item, 2, itemIndex)),
                        style: vue.normalizeStyle($setup.itemStyle)
                      },
                      [
                        vue.createElementVNode(
                          "text",
                          {
                            class: vue.normalizeClass($setup.itemTextClass(item, 2, itemIndex)),
                            style: vue.normalizeStyle($setup.itemTextStyle(item, 2, itemIndex))
                          },
                          vue.toDisplayString(item.text),
                          7
                          /* TEXT, CLASS, STYLE */
                        )
                      ],
                      6
                      /* CLASS, STYLE */
                    );
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ])) : vue.createCommentVNode("v-if", true),
              $setup.columnCount > 3 ? (vue.openBlock(), vue.createElementBlock("picker-view-column", {
                key: 3,
                class: "i-picker__column"
              }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($setup.column3, (item, itemIndex) => {
                    return vue.openBlock(), vue.createElementBlock(
                      "view",
                      {
                        key: item.value,
                        class: vue.normalizeClass($setup.itemClass(item, 3, itemIndex)),
                        style: vue.normalizeStyle($setup.itemStyle)
                      },
                      [
                        vue.createElementVNode(
                          "text",
                          {
                            class: vue.normalizeClass($setup.itemTextClass(item, 3, itemIndex)),
                            style: vue.normalizeStyle($setup.itemTextStyle(item, 3, itemIndex))
                          },
                          vue.toDisplayString(item.text),
                          7
                          /* TEXT, CLASS, STYLE */
                        )
                      ],
                      6
                      /* CLASS, STYLE */
                    );
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ])) : vue.createCommentVNode("v-if", true),
              $setup.columnCount > 4 ? (vue.openBlock(), vue.createElementBlock("picker-view-column", {
                key: 4,
                class: "i-picker__column"
              }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($setup.column4, (item, itemIndex) => {
                    return vue.openBlock(), vue.createElementBlock(
                      "view",
                      {
                        key: item.value,
                        class: vue.normalizeClass($setup.itemClass(item, 4, itemIndex)),
                        style: vue.normalizeStyle($setup.itemStyle)
                      },
                      [
                        vue.createElementVNode(
                          "text",
                          {
                            class: vue.normalizeClass($setup.itemTextClass(item, 4, itemIndex)),
                            style: vue.normalizeStyle($setup.itemTextStyle(item, 4, itemIndex))
                          },
                          vue.toDisplayString(item.text),
                          7
                          /* TEXT, CLASS, STYLE */
                        )
                      ],
                      6
                      /* CLASS, STYLE */
                    );
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ])) : vue.createCommentVNode("v-if", true),
              $setup.columnCount > 5 ? (vue.openBlock(), vue.createElementBlock("picker-view-column", {
                key: 5,
                class: "i-picker__column"
              }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($setup.column5, (item, itemIndex) => {
                    return vue.openBlock(), vue.createElementBlock(
                      "view",
                      {
                        key: item.value,
                        class: vue.normalizeClass($setup.itemClass(item, 5, itemIndex)),
                        style: vue.normalizeStyle($setup.itemStyle)
                      },
                      [
                        vue.createElementVNode(
                          "text",
                          {
                            class: vue.normalizeClass($setup.itemTextClass(item, 5, itemIndex)),
                            style: vue.normalizeStyle($setup.itemTextStyle(item, 5, itemIndex))
                          },
                          vue.toDisplayString(item.text),
                          7
                          /* TEXT, CLASS, STYLE */
                        )
                      ],
                      6
                      /* CLASS, STYLE */
                    );
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ])) : vue.createCommentVNode("v-if", true)
            ], 44, ["value", "indicator-style"])
          ],
          4
          /* STYLE */
        )
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const __easycom_2$5 = /* @__PURE__ */ _export_sfc(_sfc_main$L, [["render", _sfc_render$K], ["styles", [_style_0$J]], ["__file", "/Users/xyhc/Documents/carConnectInternet/uni_modules/i-ui-x/components/i-picker/i-picker.uvue"]]);
  const _sfc_main$K = /* @__PURE__ */ vue.defineComponent(Object.assign({ name: "i-toast" }, { __name: "i-toast", props: {
    zIndex: { type: [String, Number], default: 10090 },
    loading: { type: Boolean, default: false },
    title: { type: String, default: "" },
    icon: { type: String, default: "" },
    type: { type: String, default: "default" },
    mask: { type: Boolean, default: false },
    position: { type: String, default: "center" },
    duration: { type: [String, Number], default: 2e3 },
    fill: { type: Boolean, default: false },
    customStyle: { type: [String, Object], default: "" }
  }, setup(__props, _a) {
    var __expose = _a.expose;
    const props = __props;
    const visible = vue.ref(false);
    const timer = vue.ref(0);
    const currentZIndex = vue.ref(props.zIndex);
    const currentLoading = vue.ref(props.loading);
    const currentTitle = vue.ref(props.title);
    const currentIcon = vue.ref(props.icon);
    const currentType = vue.ref(props.type);
    const currentMask = vue.ref(props.mask);
    const currentPosition = vue.ref(props.position);
    const currentDuration = vue.ref(props.duration);
    const currentFill = vue.ref(props.fill);
    const currentCustomStyle = vue.ref(props.customStyle);
    const loadingAngle = vue.ref(0);
    let loadingTimer = 0;
    const toastClass = vue.computed(() => {
      return "i-toast i-toast--" + normalizePosition(currentPosition.value);
    });
    const toastStyle = vue.computed(() => {
      let style = "z-index:" + String(currentZIndex.value) + ";";
      style += "background-color:" + resolveBgColor() + ";";
      if (typeof currentCustomStyle.value == "string")
        style += currentCustomStyle.value;
      return style;
    });
    const iconClass = vue.computed(() => {
      if (currentFill.value)
        return "i-toast__icon i-toast__icon--fill";
      return "i-toast__icon";
    });
    const displayIcon = vue.computed(() => {
      if (currentIcon.value.length > 0 && !isImagePath(currentIcon.value)) {
        return currentIcon.value;
      }
      if (currentType.value == "success")
        return "✓";
      if (currentType.value == "error")
        return "×";
      if (currentType.value == "warning")
        return "!";
      if (currentType.value == "primary")
        return "i";
      return "";
    });
    const isImageIcon = vue.computed(() => {
      return currentIcon.value.length > 0 && isImagePath(currentIcon.value);
    });
    const loadingStyle = vue.computed(() => {
      return "transform:rotate(" + String(loadingAngle.value) + "deg);";
    });
    vue.onUnmounted(() => {
      clearTimeout(timer.value);
      stopLoadingAnimation();
    });
    function open(options = null) {
      applyOptions(options, "");
      showToast();
    }
    function close() {
      clearTimeout(timer.value);
      stopLoadingAnimation();
      visible.value = false;
    }
    function primary(options = null) {
      applyOptions(options, "primary");
      showToast();
    }
    function success(options = null) {
      applyOptions(options, "success");
      showToast();
    }
    function error(options = null) {
      applyOptions(options, "error");
      showToast();
    }
    function warning(options = null) {
      applyOptions(options, "warning");
      showToast();
    }
    function showLoading(options = null) {
      applyOptions(options, "default");
      currentLoading.value = true;
      if (currentTitle.value.length == 0)
        currentTitle.value = "加载中";
      showToast();
    }
    function showToast() {
      clearTimeout(timer.value);
      visible.value = true;
      if (currentLoading.value) {
        startLoadingAnimation();
      } else {
        stopLoadingAnimation();
      }
      const duration = Number(currentDuration.value);
      if (duration > 0) {
        timer.value = setTimeout(() => {
          close();
        }, duration);
      }
    }
    function applyOptions(options = null, forcedType = null) {
      currentZIndex.value = props.zIndex;
      currentLoading.value = props.loading;
      currentTitle.value = props.title;
      currentIcon.value = props.icon;
      currentType.value = forcedType.length > 0 ? forcedType : props.type;
      currentMask.value = props.mask;
      currentPosition.value = props.position;
      currentDuration.value = props.duration;
      currentFill.value = props.fill;
      currentCustomStyle.value = props.customStyle;
      if (options == null)
        return null;
      if (typeof options == "string") {
        currentTitle.value = options;
        return null;
      }
      if (typeof options == "object") {
        setValue(options, "zIndex");
        setValue(options, "loading");
        setValue(options, "title");
        setValue(options, "icon");
        setValue(options, "type");
        setValue(options, "mask");
        setValue(options, "position");
        setValue(options, "duration");
        setValue(options, "fill");
        setValue(options, "customStyle");
      }
    }
    function setValue(options = null, keyName = null) {
      const value = options[keyName];
      if (value == null)
        return null;
      if (keyName == "zIndex")
        currentZIndex.value = value;
      if (keyName == "loading")
        currentLoading.value = value == true;
      if (keyName == "title")
        currentTitle.value = String(value);
      if (keyName == "icon")
        currentIcon.value = String(value);
      if (keyName == "type")
        currentType.value = String(value);
      if (keyName == "mask")
        currentMask.value = value == true;
      if (keyName == "position")
        currentPosition.value = String(value);
      if (keyName == "duration")
        currentDuration.value = value;
      if (keyName == "fill")
        currentFill.value = value == true;
      if (keyName == "customStyle")
        currentCustomStyle.value = value;
    }
    function startLoadingAnimation() {
      if (loadingTimer > 0)
        return null;
      loadingTimer = setInterval(() => {
        let angle = (loadingAngle.value + 24) % 360;
        if (angle < 0)
          angle = angle + 360;
        loadingAngle.value = angle;
      }, 50);
    }
    function stopLoadingAnimation() {
      if (loadingTimer > 0) {
        clearInterval(loadingTimer);
        loadingTimer = 0;
      }
      loadingAngle.value = 0;
    }
    function normalizePosition(value = null) {
      if (value == "top" || value == "bottom")
        return value;
      return "center";
    }
    function resolveBgColor() {
      if (currentType.value == "primary")
        return "#2979ff";
      if (currentType.value == "success")
        return "#19be6b";
      if (currentType.value == "warning")
        return "#ff9900";
      if (currentType.value == "error")
        return "#fa3534";
      return "rgba(0, 0, 0, 0.78)";
    }
    function isImagePath(value = null) {
      const text = String(value);
      return text.indexOf("/") >= 0 || text.indexOf("http") == 0;
    }
    __expose({
      open,
      close,
      primary,
      success,
      error,
      warning,
      showLoading
    });
    const __returned__ = { props, visible, timer, currentZIndex, currentLoading, currentTitle, currentIcon, currentType, currentMask, currentPosition, currentDuration, currentFill, currentCustomStyle, loadingAngle, get loadingTimer() {
      return loadingTimer;
    }, set loadingTimer(v) {
      loadingTimer = v;
    }, toastClass, toastStyle, iconClass, displayIcon, isImageIcon, loadingStyle, open, close, primary, success, error, warning, showLoading, showToast, applyOptions, setValue, startLoadingAnimation, stopLoadingAnimation, normalizePosition, resolveBgColor, isImagePath };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  } }));
  const _style_0$I = { "i-toast__mask": { "": { "position": "fixed", "left": 0, "right": 0, "top": 0, "bottom": 0, "backgroundColor": "rgba(0,0,0,0)" } }, "i-toast": { "": { "position": "fixed", "alignSelf": "center", "paddingTop": 10, "paddingRight": 16, "paddingBottom": 10, "paddingLeft": 16, "borderTopLeftRadius": 8, "borderTopRightRadius": 8, "borderBottomRightRadius": 8, "borderBottomLeftRadius": 8, "flexDirection": "row", "alignItems": "center", "justifyContent": "center" } }, "i-toast--top": { "": { "top": 0 } }, "i-toast--center": { "": { "top": "45%" } }, "i-toast--bottom": { "": { "bottom": 0 } }, "i-toast__text": { "": { "color": "#ffffff", "fontSize": 14, "lineHeight": "22px", "textAlign": "center" } }, "i-toast__icon": { "": { "width": 24, "height": 24, "marginRight": 8, "alignItems": "center", "justifyContent": "center" } }, "i-toast__icon--fill": { "": { "borderTopLeftRadius": 12, "borderTopRightRadius": 12, "borderBottomRightRadius": 12, "borderBottomLeftRadius": 12, "backgroundColor": "rgba(255,255,255,0.2)" } }, "i-toast__icon-text": { "": { "color": "#ffffff", "fontSize": 18, "fontWeight": 700, "lineHeight": "24px" } }, "i-toast__image": { "": { "width": 24, "height": 24, "marginRight": 8 } }, "i-toast__loading": { "": { "width": 28, "height": 28, "marginRight": 8, "borderTopLeftRadius": 14, "borderTopRightRadius": 14, "borderBottomRightRadius": 14, "borderBottomLeftRadius": 14, "borderTopWidth": 2, "borderRightWidth": 2, "borderBottomWidth": 2, "borderLeftWidth": 2, "borderTopStyle": "solid", "borderRightStyle": "solid", "borderBottomStyle": "solid", "borderLeftStyle": "solid", "borderTopColor": "#ffffff", "borderRightColor": "rgba(255,255,255,0.38)", "borderBottomColor": "rgba(255,255,255,0.38)", "borderLeftColor": "rgba(255,255,255,0.38)" } } };
  function _sfc_render$J(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        $setup.visible && $setup.currentMask ? (vue.openBlock(), vue.createElementBlock(
          "view",
          {
            key: 0,
            class: "i-toast__mask",
            style: vue.normalizeStyle("z-index:" + String(Number($setup.currentZIndex) - 1))
          },
          null,
          4
          /* STYLE */
        )) : vue.createCommentVNode("v-if", true),
        $setup.visible ? (vue.openBlock(), vue.createElementBlock(
          "view",
          {
            key: 1,
            class: vue.normalizeClass($setup.toastClass),
            style: vue.normalizeStyle($setup.toastStyle)
          },
          [
            $setup.currentLoading ? (vue.openBlock(), vue.createElementBlock(
              "view",
              {
                key: 0,
                class: "i-toast__loading",
                style: vue.normalizeStyle($setup.loadingStyle)
              },
              null,
              4
              /* STYLE */
            )) : $setup.isImageIcon ? (vue.openBlock(), vue.createElementBlock("image", {
              key: 1,
              class: "i-toast__image",
              src: $setup.currentIcon,
              mode: "aspectFit"
            }, null, 8, ["src"])) : $setup.displayIcon.length > 0 ? (vue.openBlock(), vue.createElementBlock(
              "view",
              {
                key: 2,
                class: vue.normalizeClass($setup.iconClass)
              },
              [
                vue.createElementVNode(
                  "text",
                  { class: "i-toast__icon-text" },
                  vue.toDisplayString($setup.displayIcon),
                  1
                  /* TEXT */
                )
              ],
              2
              /* CLASS */
            )) : vue.createCommentVNode("v-if", true),
            vue.createElementVNode(
              "text",
              { class: "i-toast__text" },
              vue.toDisplayString($setup.currentTitle),
              1
              /* TEXT */
            )
          ],
          6
          /* CLASS, STYLE */
        )) : vue.createCommentVNode("v-if", true)
      ],
      64
      /* STABLE_FRAGMENT */
    );
  }
  const __easycom_0$6 = /* @__PURE__ */ _export_sfc(_sfc_main$K, [["render", _sfc_render$J], ["styles", [_style_0$I]], ["__file", "/Users/xyhc/Documents/carConnectInternet/uni_modules/i-ui-x/components/i-toast/i-toast.uvue"]]);
  const iosToastHandlers = [];
  function registerIosToastHandler(handler) {
    const index = iosToastHandlers.indexOf(handler);
    if (index == -1)
      iosToastHandlers.push(handler);
  }
  function unregisterIosToastHandler(handler) {
    const index = iosToastHandlers.indexOf(handler);
    if (index >= 0)
      iosToastHandlers.splice(index, 1);
  }
  function showAppToast(options) {
    const handler = iosToastHandlers.length > 0 ? iosToastHandlers[iosToastHandlers.length - 1] : null;
    if (handler != null)
      handler(options);
  }
  const _sfc_main$J = /* @__PURE__ */ vue.defineComponent(Object.assign({ name: "app-toast" }, { __name: "app-toast", setup(__props, _a) {
    var __expose = _a.expose;
    __expose();
    const toastRef = vue.ref(null);
    const handleToast = (options) => {
      var _a2, _b, _c;
      const toast = toastRef.value;
      if (toast == null)
        return null;
      const toastOptions = new UTSJSONObject({
        title: options.title,
        duration: (_a2 = options.duration) !== null && _a2 !== void 0 ? _a2 : 2e3,
        position: (_b = options.position) !== null && _b !== void 0 ? _b : "center",
        mask: (_c = options.mask) !== null && _c !== void 0 ? _c : false
      });
      if (options.icon == "success") {
        toast.success(toastOptions);
      } else if (options.icon == "error") {
        toast.error(toastOptions);
      } else {
        toast.open(toastOptions);
      }
    };
    registerIosToastHandler(handleToast);
    vue.onUnmounted(() => {
      unregisterIosToastHandler(handleToast);
    });
    const __returned__ = { toastRef, handleToast };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  } }));
  function _sfc_render$I(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_i_toast = resolveEasycom(vue.resolveDynamicComponent("i-toast"), __easycom_0$6);
    return vue.openBlock(), vue.createBlock(
      _component_i_toast,
      { ref: "toastRef" },
      null,
      512
      /* NEED_PATCH */
    );
  }
  const __easycom_3$3 = /* @__PURE__ */ _export_sfc(_sfc_main$J, [["render", _sfc_render$I], ["__file", "/Users/xyhc/Documents/carConnectInternet/components/app-toast/app-toast.uvue"]]);
  function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  }
  function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m)
      return m.call(o);
    if (o && typeof o.length === "number")
      return {
        next: function() {
          if (o && i >= o.length)
            o = void 0;
          return { value: o && o[i++], done: !o };
        }
      };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
  }
  function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m)
      return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
        ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"]))
          m.call(i);
      } finally {
        if (e)
          throw e.error;
      }
    }
    return ar;
  }
  typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
  };
  class RequestOptions extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            url: { type: String, optional: true },
            method: { type: "Unknown", optional: true },
            data: { type: "Any", optional: true },
            header: { type: "Unknown", optional: true },
            showLoading: { type: Boolean, optional: true }
          };
        },
        name: "RequestOptions"
      };
    }
    constructor(options, metadata = RequestOptions.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.url = this.__props__.url;
      this.method = this.__props__.method;
      this.data = this.__props__.data;
      this.header = this.__props__.header;
      this.showLoading = this.__props__.showLoading;
      delete this.__props__;
    }
  }
  class HttpResponse extends UTS.UTSType {
    static get$UTSMetadata$(T) {
      return {
        kind: 2,
        get fields() {
          return {
            code: { type: Number, optional: false },
            message: { type: String, optional: false },
            data: { type: "Unknown", optional: false }
          };
        },
        name: "HttpResponse"
      };
    }
    constructor(options, metadata = HttpResponse.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.code = this.__props__.code;
      this.message = this.__props__.message;
      this.data = this.__props__.data;
      delete this.__props__;
    }
  }
  class HttpError extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            statusCode: { type: Number, optional: false },
            message: { type: String, optional: false },
            data: { type: "Any", optional: true }
          };
        },
        name: "HttpError"
      };
    }
    constructor(options, metadata = HttpError.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.statusCode = this.__props__.statusCode;
      this.message = this.__props__.message;
      this.data = this.__props__.data;
      delete this.__props__;
    }
  }
  class RequestResult extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            statusCode: { type: Number, optional: false },
            data: { type: "Any", optional: false },
            errMsg: { type: String, optional: true }
          };
        },
        name: "RequestResult"
      };
    }
    constructor(options, metadata = RequestResult.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.statusCode = this.__props__.statusCode;
      this.data = this.__props__.data;
      this.errMsg = this.__props__.errMsg;
      delete this.__props__;
    }
  }
  class RequestFailure extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            errMsg: { type: String, optional: true },
            data: { type: "Any", optional: true }
          };
        },
        name: "RequestFailure"
      };
    }
    constructor(options, metadata = RequestFailure.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.errMsg = this.__props__.errMsg;
      this.data = this.__props__.data;
      delete this.__props__;
    }
  }
  const BASE_URL = "https://car.zdiot.cn:18443/api";
  function handleTokenExpired() {
    uni.__log__("log", "at api/http.uts:39", "检测到token过期，执行跳转登录页逻辑");
    uni.removeStorageSync("token");
    showAppToast({
      title: "登录已过期，请重新登录",
      icon: "none",
      duration: 2e3
    });
    setTimeout(() => {
      uni.__log__("log", "at api/http.uts:53", "正在跳转到登录页...");
      uni.redirectTo({
        url: "/pages/login/login",
        success: () => {
          uni.__log__("log", "at api/http.uts:57", "跳转登录页成功");
        },
        fail: (err) => {
          uni.__log__("log", "at api/http.uts:60", "跳转登录页失败:", err);
          uni.reLaunch({
            url: "/pages/login/login"
          });
        }
      });
    }, 500);
  }
  function requestInterceptor(config) {
    const token = uni.getStorageSync("token");
    if (token != null && token.toString().length > 0) {
      if (config.header == null) {
        config.header = new UTSJSONObject();
      }
      config.header.set("token", token.toString());
    }
    return config;
  }
  function responseInterceptor(response, config) {
    return response.data;
  }
  function errorHandler(error, config) {
    if (config.showLoading != false) {
      uni.hideLoading();
    }
    uni.__log__("log", "at api/http.uts:112", "请求错误详情:", error);
    if (error.statusCode != 0) {
      switch (error.statusCode) {
        case 401:
          handleTokenExpired();
          break;
        case 403:
          showAppToast({
            title: "没有权限访问",
            icon: "none"
          });
          break;
        case 404:
          showAppToast({
            title: "请求资源不存在",
            icon: "none"
          });
          break;
        case 500:
          showAppToast({
            title: "服务器错误",
            icon: "none"
          });
          break;
        default:
          showAppToast({
            title: error.message != null ? error.message : "请求错误: ".concat(error.statusCode),
            icon: "none"
          });
      }
    } else {
      showAppToast({
        title: "网络错误，请检查网络连接",
        icon: "none"
      });
    }
  }
  function request(options) {
    const requestUrl = options.url != null ? options.url : "";
    const config = new UTSJSONObject(
      {
        url: requestUrl,
        method: options.method != null ? options.method : "GET",
        data: options.data != null ? options.data : new UTSJSONObject({}),
        header: options.header != null ? options.header : new UTSJSONObject(),
        showLoading: options.showLoading != false
      }
      // 处理完整URL
    );
    if (!config.url.startsWith("http")) {
      config.url = BASE_URL + config.url;
    }
    const processedConfig = requestInterceptor(config);
    return new Promise((resolve, reject) => {
      uni.request({
        url: processedConfig.url,
        method: processedConfig.method,
        data: processedConfig.data,
        header: processedConfig.header,
        success: (res) => {
          const statusCode = res.statusCode;
          if (statusCode == 200) {
            const data = responseInterceptor(res);
            resolve(data);
          } else {
            const httpError = new HttpError({
              statusCode,
              message: "请求失败: ".concat(statusCode),
              data: res.data
            });
            errorHandler(httpError, processedConfig);
            reject(httpError);
          }
        },
        fail: (error) => {
          const httpError = new HttpError({
            statusCode: 0,
            message: error.errMsg != null ? error.errMsg : "网络请求失败",
            data: error
          });
          errorHandler(httpError, processedConfig);
          reject(httpError);
        }
      });
    });
  }
  function get(url, data = new UTSJSONObject({}), options = new RequestOptions({
    url: null,
    method: null,
    data: null,
    header: null,
    showLoading: null
  })) {
    return request(new UTSJSONObject({
      url,
      method: "GET",
      data,
      header: options.header,
      showLoading: options.showLoading
    }));
  }
  function post(url, data = new UTSJSONObject({}), options = new RequestOptions({
    url: null,
    method: null,
    data: null,
    header: null,
    showLoading: null
  })) {
    return request(new UTSJSONObject({
      url,
      method: "POST",
      data,
      header: options.header,
      showLoading: options.showLoading
    }));
  }
  function put(url, data = new UTSJSONObject({}), options = new RequestOptions({
    url: null,
    method: null,
    data: null,
    header: null,
    showLoading: null
  })) {
    return request(new UTSJSONObject({
      url,
      method: "PUT",
      data,
      header: options.header,
      showLoading: options.showLoading
    }));
  }
  function remove(url, data = new UTSJSONObject({}), options = new RequestOptions({
    url: null,
    method: null,
    data: null,
    header: null,
    showLoading: null
  })) {
    return request(new UTSJSONObject({
      url,
      method: "DELETE",
      data,
      header: options.header,
      showLoading: options.showLoading
    }));
  }
  function asJSONObject(value = null) {
    if (value == null) {
      return new UTSJSONObject();
    }
    return value;
  }
  function getResponseCode(response) {
    return response.getNumber("code", -1);
  }
  function getResponseMessage(response) {
    const msg = response.getString("msg", "");
    return msg != "" ? msg : response.getString("message", "");
  }
  function getResponseDataObject(response) {
    const data = response.getJSON("data");
    return data != null ? data : new UTSJSONObject();
  }
  function getResponseDataArray(response) {
    const data = response.getArray("data");
    return data != null ? data : [];
  }
  const loginUrl = "/sys/login";
  const devicePos = "/gps/lastPosition?deptId=";
  const trackPos = "/gps/trackPos?";
  const userinfo = "/sys/user/info";
  const addDeviceUrl = "/userDevice/add";
  const userDeviceList = "/userDevice/list";
  const changePSW = "/sys/user/password";
  const userMsgList = "/usermessage/listForUser";
  const msgState = "/usermessage/detail/";
  const updateDevice = "/device/update";
  const deviceDetail = "/device/info/";
  const logoutUrl = "/sys/logout";
  const sendcmd = "/command/sendCmd";
  const getGeofence = "/geofence";
  const deleteGeo = "/geofence/";
  const unbindDeviceList = "/device/unbindGeofenceList";
  const bindDeviceList = "/device/bindGeofenceList";
  const bindGeofence = "/geofence/bind";
  const unbindGeofence = "/geofence/unbind";
  const deleteDevice = "/userDevice/del";
  const cmdActionUrl = "/command/cmdAction";
  const cmdByMidUrl = "/command/cmdByMid";
  const cmdSendUrl = "/command/sendCmd";
  class BasicResponse extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            code: { type: Number, optional: false },
            msg: { type: String, optional: false }
          };
        },
        name: "BasicResponse"
      };
    }
    constructor(options, metadata = BasicResponse.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.code = this.__props__.code;
      this.msg = this.__props__.msg;
      delete this.__props__;
    }
  }
  class JsonDataResponse extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            code: { type: Number, optional: false },
            msg: { type: String, optional: false },
            data: { type: "Unknown", optional: false }
          };
        },
        name: "JsonDataResponse"
      };
    }
    constructor(options, metadata = JsonDataResponse.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.code = this.__props__.code;
      this.msg = this.__props__.msg;
      this.data = this.__props__.data;
      delete this.__props__;
    }
  }
  class DevicePositionResponse extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            code: { type: Number, optional: false },
            message: { type: String, optional: false },
            data: { type: "Unknown", optional: false }
          };
        },
        name: "DevicePositionResponse"
      };
    }
    constructor(options, metadata = DevicePositionResponse.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.code = this.__props__.code;
      this.message = this.__props__.message;
      this.data = this.__props__.data;
      delete this.__props__;
    }
  }
  class TrackPosResponse extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            code: { type: Number, optional: false },
            msg: { type: String, optional: false },
            data: { type: "Unknown", optional: false }
          };
        },
        name: "TrackPosResponse"
      };
    }
    constructor(options, metadata = TrackPosResponse.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.code = this.__props__.code;
      this.msg = this.__props__.msg;
      this.data = this.__props__.data;
      delete this.__props__;
    }
  }
  class UserInfoResponse extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            code: { type: Number, optional: false },
            msg: { type: String, optional: false },
            data: { type: "Unknown", optional: false }
          };
        },
        name: "UserInfoResponse"
      };
    }
    constructor(options, metadata = UserInfoResponse.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.code = this.__props__.code;
      this.msg = this.__props__.msg;
      this.data = this.__props__.data;
      delete this.__props__;
    }
  }
  let UserDeviceListData$1 = class UserDeviceListData2 extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            list: { type: "Unknown", optional: false },
            totalPage: { type: Number, optional: false },
            totalCount: { type: Number, optional: false }
          };
        },
        name: "UserDeviceListData"
      };
    }
    constructor(options, metadata = UserDeviceListData2.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.list = this.__props__.list;
      this.totalPage = this.__props__.totalPage;
      this.totalCount = this.__props__.totalCount;
      delete this.__props__;
    }
  };
  class UserDeviceListResponse extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            code: { type: Number, optional: false },
            msg: { type: String, optional: false },
            data: { type: UserDeviceListData$1, optional: false }
          };
        },
        name: "UserDeviceListResponse"
      };
    }
    constructor(options, metadata = UserDeviceListResponse.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.code = this.__props__.code;
      this.msg = this.__props__.msg;
      this.data = this.__props__.data;
      delete this.__props__;
    }
  }
  class DeviceDetailResponse extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            code: { type: Number, optional: false },
            msg: { type: String, optional: false },
            data: { type: "Unknown", optional: false }
          };
        },
        name: "DeviceDetailResponse"
      };
    }
    constructor(options, metadata = DeviceDetailResponse.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.code = this.__props__.code;
      this.msg = this.__props__.msg;
      this.data = this.__props__.data;
      delete this.__props__;
    }
  }
  class GeofenceResponse extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            code: { type: Number, optional: false },
            msg: { type: String, optional: false },
            data: { type: "Unknown", optional: false }
          };
        },
        name: "GeofenceResponse"
      };
    }
    constructor(options, metadata = GeofenceResponse.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.code = this.__props__.code;
      this.msg = this.__props__.msg;
      this.data = this.__props__.data;
      delete this.__props__;
    }
  }
  class DevicePageData extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            list: { type: "Unknown", optional: false },
            totalPage: { type: Number, optional: false },
            totalCount: { type: Number, optional: false }
          };
        },
        name: "DevicePageData"
      };
    }
    constructor(options, metadata = DevicePageData.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.list = this.__props__.list;
      this.totalPage = this.__props__.totalPage;
      this.totalCount = this.__props__.totalCount;
      delete this.__props__;
    }
  }
  class DevicePageResponse extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            code: { type: Number, optional: false },
            msg: { type: String, optional: false },
            data: { type: DevicePageData, optional: false }
          };
        },
        name: "DevicePageResponse"
      };
    }
    constructor(options, metadata = DevicePageResponse.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.code = this.__props__.code;
      this.msg = this.__props__.msg;
      this.data = this.__props__.data;
      delete this.__props__;
    }
  }
  class CommandListResponse extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            code: { type: Number, optional: false },
            msg: { type: String, optional: false },
            data: { type: "Unknown", optional: false }
          };
        },
        name: "CommandListResponse"
      };
    }
    constructor(options, metadata = CommandListResponse.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.code = this.__props__.code;
      this.msg = this.__props__.msg;
      this.data = this.__props__.data;
      delete this.__props__;
    }
  }
  class SendCmdResponse extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            code: { type: Number, optional: false },
            msg: { type: String, optional: false },
            data: { type: String, optional: false }
          };
        },
        name: "SendCmdResponse"
      };
    }
    constructor(options, metadata = SendCmdResponse.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.code = this.__props__.code;
      this.msg = this.__props__.msg;
      this.data = this.__props__.data;
      delete this.__props__;
    }
  }
  class ChangePasswordResponse extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            code: { type: Number, optional: false },
            msg: { type: String, optional: false }
          };
        },
        name: "ChangePasswordResponse"
      };
    }
    constructor(options, metadata = ChangePasswordResponse.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.code = this.__props__.code;
      this.msg = this.__props__.msg;
      delete this.__props__;
    }
  }
  let MessageResponse$1 = class MessageResponse2 extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            code: { type: Number, optional: false },
            msg: { type: String, optional: false },
            data: { type: UserDeviceListData$1, optional: false }
          };
        },
        name: "MessageResponse"
      };
    }
    constructor(options, metadata = MessageResponse2.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.code = this.__props__.code;
      this.msg = this.__props__.msg;
      this.data = this.__props__.data;
      delete this.__props__;
    }
  };
  function basicResponse(raw = null) {
    const response = asJSONObject(raw);
    return new BasicResponse({ code: getResponseCode(response), msg: getResponseMessage(response) });
  }
  function jsonDataResponse(raw = null) {
    const response = asJSONObject(raw);
    return new JsonDataResponse({
      code: getResponseCode(response),
      msg: getResponseMessage(response),
      data: getResponseDataObject(response)
    });
  }
  function devicePageResponse(raw = null) {
    const response = asJSONObject(raw);
    const data = getResponseDataObject(response);
    const list = data.getArray("list");
    return new DevicePageResponse({
      code: getResponseCode(response),
      msg: getResponseMessage(response),
      data: new DevicePageData({
        list: list != null ? list : [],
        totalPage: data.getNumber("totalPage", 0),
        totalCount: data.getNumber("totalCount", 0)
      })
    });
  }
  function userDevicePageResponse(raw = null) {
    const page = devicePageResponse(raw);
    return new UserDeviceListResponse({
      code: page.code,
      msg: page.msg,
      data: new UserDeviceListData$1({
        list: page.data.list,
        totalPage: page.data.totalPage,
        totalCount: page.data.totalCount
      })
    });
  }
  function messagePageResponse(raw = null) {
    const page = devicePageResponse(raw);
    return new MessageResponse$1({
      code: page.code,
      msg: page.msg,
      data: new UserDeviceListData$1({
        list: page.data.list,
        totalPage: page.data.totalPage,
        totalCount: page.data.totalCount
      })
    });
  }
  function userInfoResponse(raw = null) {
    const response = jsonDataResponse(raw);
    return new UserInfoResponse({ code: response.code, msg: response.msg, data: response.data });
  }
  function deviceDetailResponse(raw = null) {
    const response = jsonDataResponse(raw);
    return new DeviceDetailResponse({ code: response.code, msg: response.msg, data: response.data });
  }
  function changePasswordResponse(raw = null) {
    const response = basicResponse(raw);
    return new ChangePasswordResponse({ code: response.code, msg: response.msg });
  }
  const login = (data) => {
    return post(loginUrl, data).then((raw = null) => {
      return jsonDataResponse(raw);
    });
  };
  const logout = () => {
    return post(logoutUrl).then((raw = null) => {
      return basicResponse(raw);
    });
  };
  const sendCommand = (data) => {
    return post(sendcmd, data).then((raw = null) => {
      return basicResponse(raw);
    });
  };
  const getDevicePos = (data) => {
    return get(devicePos, data).then((raw = null) => {
      const response = asJSONObject(raw);
      return new DevicePositionResponse({
        code: getResponseCode(response),
        message: getResponseMessage(response),
        data: getResponseDataArray(response)
      });
    });
  };
  const getTrackPos = (data) => {
    return get(trackPos, data).then((raw = null) => {
      const response = asJSONObject(raw);
      return new TrackPosResponse({ code: getResponseCode(response), msg: getResponseMessage(response), data: getResponseDataObject(response) });
    });
  };
  const getUserInfo = () => {
    return get(userinfo).then((raw = null) => {
      return userInfoResponse(raw);
    });
  };
  const addDevice = (data) => {
    return post(addDeviceUrl, data).then((raw = null) => {
      return basicResponse(raw);
    });
  };
  const delDevice = (imei) => {
    return post(deleteDevice, new UTSJSONObject({ imei })).then((raw = null) => {
      return basicResponse(raw);
    });
  };
  const getUserDeviceList = (data) => {
    return post(userDeviceList, data).then((raw = null) => {
      return userDevicePageResponse(raw);
    });
  };
  const changePassWord = (data) => {
    return put(changePSW, data).then((raw = null) => {
      return changePasswordResponse(raw);
    });
  };
  const getUserMsgList = (data = null) => {
    return (data != null ? get(userMsgList, data) : get(userMsgList)).then((raw = null) => {
      return messagePageResponse(raw);
    });
  };
  const setMsgState = (msgId) => {
    return get("".concat(msgState).concat(msgId)).then((raw = null) => {
      return basicResponse(raw);
    });
  };
  const editDeviceInfo = (data) => {
    return put(updateDevice, data).then((raw = null) => {
      return basicResponse(raw);
    });
  };
  const getDeviceDetail = (deviceId) => {
    return get("".concat(deviceDetail).concat(deviceId)).then((raw = null) => {
      return deviceDetailResponse(raw);
    });
  };
  const getGeofenceList = () => {
    return get(getGeofence).then((raw = null) => {
      const response = asJSONObject(raw);
      return new GeofenceResponse({ code: getResponseCode(response), msg: getResponseMessage(response), data: getResponseDataArray(response) });
    });
  };
  const addGeofence = (data) => {
    return post(getGeofence, data).then((raw = null) => {
      return basicResponse(raw);
    });
  };
  const updateGeofence = (data) => {
    return put(getGeofence, data).then((raw = null) => {
      return basicResponse(raw);
    });
  };
  const deleteGeofence = (id) => {
    return remove("".concat(deleteGeo).concat(id)).then((raw = null) => {
      return basicResponse(raw);
    });
  };
  const getUnboundDevices = (params) => {
    return get(unbindDeviceList, params).then((raw = null) => {
      return devicePageResponse(raw);
    });
  };
  const getBoundDevices = (params) => {
    return get(bindDeviceList, params).then((raw = null) => {
      return devicePageResponse(raw);
    });
  };
  const bindDevices = (data) => {
    return post(bindGeofence, data).then((raw = null) => {
      return basicResponse(raw);
    });
  };
  const unbindDevices = (data) => {
    return remove(unbindGeofence, data).then((raw = null) => {
      return basicResponse(raw);
    });
  };
  const getCmdAction = () => {
    return get(cmdActionUrl).then((raw = null) => {
      const response = asJSONObject(raw);
      return new CommandListResponse({ code: getResponseCode(response), msg: getResponseMessage(response), data: getResponseDataArray(response) });
    });
  };
  const getCmdByMid = (data) => {
    return get(cmdByMidUrl, data).then((raw = null) => {
      const response = asJSONObject(raw);
      return new CommandListResponse({ code: getResponseCode(response), msg: getResponseMessage(response), data: getResponseDataArray(response) });
    });
  };
  const sendCmd = (data) => {
    return post(cmdSendUrl, data).then((raw = null) => {
      const response = asJSONObject(raw);
      return new SendCmdResponse({ code: getResponseCode(response), msg: getResponseMessage(response), data: response.getString("data", "") });
    });
  };
  class Coordinate extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            lat: { type: Number, optional: false },
            lng: { type: Number, optional: false }
          };
        },
        name: "Coordinate"
      };
    }
    constructor(options, metadata = Coordinate.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.lat = this.__props__.lat;
      this.lng = this.__props__.lng;
      delete this.__props__;
    }
  }
  class CoordTransform {
    /**
     * WGS84转腾讯地图坐标系（GCJ02）
     * @param wgLat WGS84纬度
     * @param wgLon WGS84经度
     * @returns 腾讯地图坐标系 { lat: number, lng: number }
     */
    static wgs84ToTencent(wgLat, wgLon) {
      if (!this.isInChina(wgLon, wgLat)) {
        return new Coordinate({ lat: wgLat, lng: wgLon });
      }
      let dLat = this.transformLat(wgLon - 105, wgLat - 35);
      let dLng = this.transformLng(wgLon - 105, wgLat - 35);
      let radLat = wgLat / 180 * this.pi;
      let magic = Math.sin(radLat);
      magic = 1 - this.ee * magic * magic;
      let sqrtMagic = Math.sqrt(magic);
      dLat = dLat * 180 / (this.a * (1 - this.ee) / (magic * sqrtMagic) * this.pi);
      dLng = dLng * 180 / (this.a / sqrtMagic * Math.cos(radLat) * this.pi);
      const mgLat = wgLat + dLat;
      const mgLng = wgLon + dLng;
      return new Coordinate({
        lat: parseFloat(mgLat.toFixed(6)),
        lng: parseFloat(mgLng.toFixed(6))
      });
    }
    /**
     * 腾讯地图坐标系转WGS84（使用高精度算法）
     * @param tcLat 腾讯地图纬度
     * @param tcLon 腾讯地图经度
     * @returns WGS84坐标系 { lat: number, lng: number }
     */
    static tencentToWgs84(tcLat, tcLon) {
      if (!this.isInChina(tcLon, tcLat)) {
        return new Coordinate({ lat: tcLat, lng: tcLon });
      }
      let wgsLat = tcLat;
      let wgsLng = tcLon;
      for (let i = 0; i < 5; i++) {
        const gcj02 = this.wgs84ToTencent(wgsLat, wgsLng);
        const deltaLat = tcLat - gcj02.lat;
        const deltaLng = tcLon - gcj02.lng;
        wgsLat += deltaLat;
        wgsLng += deltaLng;
        if (Math.abs(deltaLat) < 1e-7 && Math.abs(deltaLng) < 1e-7) {
          break;
        }
      }
      return new Coordinate({
        lat: parseFloat(wgsLat.toFixed(6)),
        lng: parseFloat(wgsLng.toFixed(6))
      });
    }
    /**
     * 批量转换坐标（内部使用高精度转换）
     * @param devices 设备数组
     * @param targetSystem 目标坐标系 'tencent' | 'wgs84'
     * @returns 转换后的设备数组
     */
    static batchConvertCoordinates(devices, targetSystem = "tencent") {
      if (!Array.isArray(devices))
        return [];
      return devices.map((device) => {
        if (device == null)
          return device;
        const item = device;
        const latitude = item["latitude"];
        const longitude = item["longitude"];
        if (latitude == null || longitude == null) {
          return device;
        }
        const lat = parseFloat(latitude.toString());
        const lng = parseFloat(longitude.toString());
        if (isNaN(lat) || isNaN(lng)) {
          uni.__log__("warn", "at utils/coordTransform.uts:108", "设备经纬度无效", device);
          return device;
        }
        let converted = new Coordinate({ lat, lng });
        if (targetSystem === "tencent") {
          converted = this.wgs84ToTencent(lat, lng);
        } else {
          converted = this.tencentToWgs84(lat, lng);
        }
        item["latitude"] = converted.lat;
        item["longitude"] = converted.lng;
        item["originalLatitude"] = lat;
        item["originalLongitude"] = lng;
        return item;
      });
    }
    /**
     * 转换单个坐标点（内部使用高精度转换）
     * @param lat 纬度
     * @param lng 经度
     * @param fromSystem 原坐标系 'wgs84' | 'tencent'
     * @param toSystem 目标坐标系 'tencent' | 'wgs84'
     * @returns 转换后的坐标 { lat: number, lng: number }
     */
    static convertCoordinate(lat, lng, fromSystem = "wgs84", toSystem = "tencent") {
      if (fromSystem === "wgs84" && toSystem === "tencent") {
        return this.wgs84ToTencent(lat, lng);
      } else if (fromSystem === "tencent" && toSystem === "wgs84") {
        return this.tencentToWgs84(lat, lng);
      } else {
        uni.__log__("warn", "at utils/coordTransform.uts:143", "不支持的坐标系转换", fromSystem, "->", toSystem);
        return new Coordinate({ lat, lng });
      }
    }
    /**
     * 检查坐标是否在中国境内
     * @param lat 纬度
     * @param lng 经度
     * @returns 是否在中国境内
     */
    static isInChina(lng, lat) {
      return lng >= 72.004 && lng <= 137.8347 && lat >= 0.8293 && lat <= 55.8271;
    }
    // 私有方法：纬度转换
    static transformLat(x, y) {
      let ret = -100 + 2 * x + 3 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
      ret += (20 * Math.sin(6 * x * Math.PI) + 20 * Math.sin(2 * x * Math.PI)) * 2 / 3;
      ret += (20 * Math.sin(y * Math.PI) + 40 * Math.sin(y / 3 * Math.PI)) * 2 / 3;
      ret += (160 * Math.sin(y / 12 * Math.PI) + 320 * Math.sin(y * Math.PI / 30)) * 2 / 3;
      return ret;
    }
    // 私有方法：经度转换
    static transformLng(x, y) {
      let ret = 300 + x + 2 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
      ret += (20 * Math.sin(6 * x * Math.PI) + 20 * Math.sin(2 * x * Math.PI)) * 2 / 3;
      ret += (20 * Math.sin(x * Math.PI) + 40 * Math.sin(x / 3 * Math.PI)) * 2 / 3;
      ret += (150 * Math.sin(x / 12 * Math.PI) + 300 * Math.sin(x / 30 * Math.PI)) * 2 / 3;
      return ret;
    }
  }
  CoordTransform.a = 6378245;
  CoordTransform.ee = 0.006693421622965943;
  CoordTransform.pi = 3.141592653589793;
  class TodayTimeRange extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            nowTime: { type: Number, optional: false },
            todayZero: { type: Number, optional: false }
          };
        },
        name: "TodayTimeRange"
      };
    }
    constructor(options, metadata = TodayTimeRange.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.nowTime = this.__props__.nowTime;
      this.todayZero = this.__props__.todayZero;
      delete this.__props__;
    }
  }
  function getTodayZeroTime() {
    const now = /* @__PURE__ */ new Date();
    const nowTime = now.getTime();
    const todayZero = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).getTime();
    return new TodayTimeRange({
      nowTime,
      todayZero
    });
  }
  function formatTimes(timestamp) {
    const d = new Date(timestamp);
    const y = d.getFullYear();
    const m = (d.getMonth() + 1).toString().padStart(2, "0");
    const day = d.getDate().toString().padStart(2, "0");
    const h = d.getHours().toString().padStart(2, "0");
    const mi = d.getMinutes().toString().padStart(2, "0");
    const s = d.getSeconds().toString().padStart(2, "0");
    return "".concat(y, "-").concat(m, "-").concat(day, " ").concat(h, ":").concat(mi, ":").concat(s);
  }
  function getDeviceIcon(connectionStatus, carType) {
    const basePath = connectionStatus == "online" ? "/static/cars/online/" : "/static/cars/offline/";
    const validTypes = ["car", "bus", "bike", "moto", "diandong", "huoche", "sanlun", "tuola", "suv", "baby", "tank", "zhuangjia", "wajue", "plan", "walk", "muma", "hangmu", "junjian", "tuiche", "train"];
    let iconPath = basePath + "default.png";
    if (validTypes.includes(carType)) {
      iconPath = basePath + carType + ".png";
    }
    return iconPath;
  }
  class Device extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            name: { type: String, optional: false },
            deviceName: { type: String, optional: false },
            value: { type: String, optional: false },
            imei: { type: String, optional: false },
            deptId: { type: String, optional: false },
            deviceId: { type: String, optional: false },
            iccid: { type: String, optional: false },
            simMerchant: { type: String, optional: false },
            connectionStatus: { type: String, optional: false },
            carType: { type: String, optional: false },
            plateNo: { type: String, optional: false },
            latitude: { type: Number, optional: false },
            longitude: { type: Number, optional: false }
          };
        },
        name: "Device"
      };
    }
    constructor(options, metadata = Device.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.name = this.__props__.name;
      this.deviceName = this.__props__.deviceName;
      this.value = this.__props__.value;
      this.imei = this.__props__.imei;
      this.deptId = this.__props__.deptId;
      this.deviceId = this.__props__.deviceId;
      this.iccid = this.__props__.iccid;
      this.simMerchant = this.__props__.simMerchant;
      this.connectionStatus = this.__props__.connectionStatus;
      this.carType = this.__props__.carType;
      this.plateNo = this.__props__.plateNo;
      this.latitude = this.__props__.latitude;
      this.longitude = this.__props__.longitude;
      delete this.__props__;
    }
  }
  let MapCenter$1 = class MapCenter2 extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            latitude: { type: Number, optional: false },
            longitude: { type: Number, optional: false }
          };
        },
        name: "MapCenter"
      };
    }
    constructor(options, metadata = MapCenter2.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.latitude = this.__props__.latitude;
      this.longitude = this.__props__.longitude;
      delete this.__props__;
    }
  };
  class UserDeviceListData extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            list: { type: "Unknown", optional: false }
          };
        },
        name: "UserDeviceListData"
      };
    }
    constructor(options, metadata = UserDeviceListData.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.list = this.__props__.list;
      delete this.__props__;
    }
  }
  class DeviceStatus extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            batteryPercent: { type: Number, optional: false },
            voltage: { type: Number, optional: false },
            signalStrength: { type: Number, optional: false }
          };
        },
        name: "DeviceStatus"
      };
    }
    constructor(options, metadata = DeviceStatus.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.batteryPercent = this.__props__.batteryPercent;
      this.voltage = this.__props__.voltage;
      this.signalStrength = this.__props__.signalStrength;
      delete this.__props__;
    }
  }
  class DeviceDetailState extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            deviceStatus: { type: DeviceStatus, optional: false },
            connectionStatus: { type: String, optional: false },
            lastUpdateTime: { type: String, optional: false }
          };
        },
        name: "DeviceDetailState"
      };
    }
    constructor(options, metadata = DeviceDetailState.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.deviceStatus = this.__props__.deviceStatus;
      this.connectionStatus = this.__props__.connectionStatus;
      this.lastUpdateTime = this.__props__.lastUpdateTime;
      delete this.__props__;
    }
  }
  const SELECTED_DEVICE_STORAGE_KEY = "selected_device_info";
  const SELECTED_DEVICE_INDEX_STORAGE_KEY = "selected_device_index";
  class SavedDevice extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            name: { type: String, optional: false },
            deviceName: { type: String, optional: false },
            imei: { type: String, optional: false },
            deptId: { type: String, optional: false },
            deviceId: { type: String, optional: false },
            iccid: { type: String, optional: false },
            simMerchant: { type: String, optional: false },
            connectionStatus: { type: String, optional: false },
            carType: { type: String, optional: false },
            plateNo: { type: String, optional: false },
            latitude: { type: Number, optional: false },
            longitude: { type: Number, optional: false }
          };
        },
        name: "SavedDevice"
      };
    }
    constructor(options, metadata = SavedDevice.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.name = this.__props__.name;
      this.deviceName = this.__props__.deviceName;
      this.imei = this.__props__.imei;
      this.deptId = this.__props__.deptId;
      this.deviceId = this.__props__.deviceId;
      this.iccid = this.__props__.iccid;
      this.simMerchant = this.__props__.simMerchant;
      this.connectionStatus = this.__props__.connectionStatus;
      this.carType = this.__props__.carType;
      this.plateNo = this.__props__.plateNo;
      this.latitude = this.__props__.latitude;
      this.longitude = this.__props__.longitude;
      delete this.__props__;
    }
  }
  const _sfc_main$I = /* @__PURE__ */ vue.defineComponent({
    __name: "index",
    setup(__props, _a) {
      var __expose = _a.expose;
      __expose();
      const timeRange = getTodayZeroTime();
      const nowTime = timeRange.nowTime;
      const todayZero = timeRange.todayZero;
      const center = vue.reactive(new MapCenter$1({
        latitude: 39.90469,
        longitude: 116.40717
      }));
      const userDeviceList2 = vue.ref([]);
      const isMapReady = vue.ref(false);
      const mapScale = vue.ref(12);
      const statusBarHeight = vue.ref(20);
      const menuButtonInfo = vue.ref(null);
      const navBarHeight = vue.ref(44);
      const deviceList = vue.ref([]);
      const showPicker = vue.ref(false);
      const pickerDefaultIndex = vue.ref([0]);
      const pickerKey = vue.ref(0);
      const currentCarImei = vue.ref("");
      const currentCarDeptId = vue.ref("");
      const currentCarDeviceId = vue.ref("");
      const currentCarIccId = vue.ref("");
      const currentCarName = vue.ref("");
      const currentCarSimMerchant = vue.ref("");
      const currentCarConnectionStatus = vue.ref("");
      const currentCarCarType = vue.ref("");
      const currentCarPlateNo = vue.ref("");
      const deviceDetail2 = vue.ref(new DeviceDetailState({
        deviceStatus: new DeviceStatus({
          batteryPercent: 0,
          voltage: 0,
          signalStrength: 0
        }),
        connectionStatus: "offline",
        lastUpdateTime: ""
      }));
      const markers = vue.ref([]);
      const lastUpdateTime = vue.ref("--:--:--");
      const safeDeviceDetail = vue.computed(() => {
        const detail = deviceDetail2.value;
        return new DeviceDetailState({
          deviceStatus: new DeviceStatus({
            batteryPercent: detail.deviceStatus.batteryPercent,
            voltage: detail.deviceStatus.voltage,
            signalStrength: detail.deviceStatus.signalStrength
          }),
          connectionStatus: detail.connectionStatus,
          lastUpdateTime: detail.lastUpdateTime
        });
      });
      const pickerColumns = vue.computed(() => {
        return [deviceList.value.map((device) => {
          const displayName = device.deviceName || device.name || device.imei || "未命名设备";
          const statusText = device.connectionStatus == "online" ? "在线" : "离线";
          return new UTSJSONObject({
            text: "".concat(displayName, " (").concat(statusText, ")"),
            value: device.imei || device.deviceId,
            disabled: false
          });
        })];
      });
      const closePicker = () => {
        showPicker.value = false;
      };
      const initDimensions = () => {
        const systemInfo = uni.getSystemInfoSync();
        statusBarHeight.value = systemInfo.statusBarHeight != null ? systemInfo.statusBarHeight : 20;
      };
      const delay = (ms) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      };
      const saveSelectedDevice = (device) => {
        try {
          const deviceInfo = new UTSJSONObject({
            name: device.deviceName || device.name || device.imei,
            deviceName: device.deviceName || device.name || device.imei,
            imei: device.imei || device.value,
            deptId: device.deptId,
            deviceId: device.deviceId,
            iccid: device.iccid,
            simMerchant: device.simMerchant,
            connectionStatus: device.connectionStatus,
            carType: device.carType,
            plateNo: device.plateNo,
            latitude: device.latitude,
            longitude: device.longitude
          });
          uni.setStorageSync(SELECTED_DEVICE_STORAGE_KEY, UTS.JSON.stringify(deviceInfo));
          uni.__log__("log", "at pages/index/index.uvue:350", "保存选中设备成功:", deviceInfo);
        } catch (error) {
          uni.__log__("error", "at pages/index/index.uvue:352", "保存选中设备失败:", error);
        }
      };
      const decodeSavedDevice = (raw = null) => {
        if (raw == null || raw == "")
          return null;
        let data = null;
        if (typeof raw == "string") {
          try {
            data = UTS.JSON.parse(raw);
          } catch (error) {
            return null;
          }
        } else {
          data = raw;
        }
        if (data == null)
          return null;
        const imei = data.getString("imei", "");
        if (imei == "")
          return null;
        const device = new SavedDevice({
          name: data.getString("name", imei),
          deviceName: data.getString("deviceName", data.getString("name", imei)),
          imei,
          deptId: data.getString("deptId", ""),
          deviceId: data.getString("deviceId", ""),
          iccid: data.getString("iccid", ""),
          simMerchant: data.getString("simMerchant", ""),
          connectionStatus: data.getString("connectionStatus", ""),
          carType: data.getString("carType", ""),
          plateNo: data.getString("plateNo", ""),
          latitude: data.getNumber("latitude", 0),
          longitude: data.getNumber("longitude", 0)
        });
        return device;
      };
      const getSavedSelectedDevice = () => {
        try {
          const rawDevice = uni.getStorageSync(SELECTED_DEVICE_STORAGE_KEY);
          if (rawDevice == null)
            return null;
          return decodeSavedDevice(rawDevice);
        } catch (error) {
          uni.__log__("error", "at pages/index/index.uvue:410", "获取保存设备失败:", error);
        }
        return null;
      };
      const clearSavedSelectedDevice = () => {
        try {
          uni.removeStorageSync(SELECTED_DEVICE_STORAGE_KEY);
          uni.__log__("log", "at pages/index/index.uvue:419", "清除保存设备成功");
        } catch (error) {
          uni.__log__("error", "at pages/index/index.uvue:421", "清除保存设备失败:", error);
        }
      };
      const saveSelectedDeviceIndex = (index) => {
        try {
          uni.setStorageSync(SELECTED_DEVICE_INDEX_STORAGE_KEY, index);
        } catch (error) {
          uni.__log__("error", "at pages/index/index.uvue:430", "保存选中设备索引失败:", error);
        }
      };
      const getSavedSelectedDeviceIndex = () => {
        try {
          const savedIndex = uni.getStorageSync(SELECTED_DEVICE_INDEX_STORAGE_KEY);
          if (savedIndex != null && savedIndex.toString() != "") {
            const index = parseInt(savedIndex.toString());
            return isNaN(index) || index < 0 ? null : index;
          }
        } catch (error) {
          uni.__log__("error", "at pages/index/index.uvue:443", "获取保存设备索引失败:", error);
        }
        return null;
      };
      const clearSavedSelectedDeviceIndex = () => {
        try {
          uni.removeStorageSync(SELECTED_DEVICE_INDEX_STORAGE_KEY);
        } catch (error) {
          uni.__log__("error", "at pages/index/index.uvue:453", "清除保存设备索引失败:", error);
        }
      };
      const setCurrentCarFromSavedDevice = (savedDevice = null) => {
        const deviceName = savedDevice.deviceName || savedDevice.name || "未命名设备";
        currentCarName.value = deviceName;
        currentCarImei.value = savedDevice.imei || savedDevice.value;
        currentCarDeptId.value = savedDevice.deptId;
        currentCarDeviceId.value = savedDevice.deviceId;
        currentCarIccId.value = savedDevice.iccid;
        currentCarSimMerchant.value = savedDevice.simMerchant;
        currentCarConnectionStatus.value = savedDevice.connectionStatus;
        currentCarCarType.value = savedDevice.carType;
        currentCarPlateNo.value = savedDevice.plateNo;
        center.latitude = savedDevice.latitude;
        center.longitude = savedDevice.longitude;
      };
      const handlePicker = () => {
        if (deviceList.value.length == 0) {
          showAppToast({
            title: "暂无车辆数据",
            icon: "none"
          });
          return null;
        }
        pickerKey.value++;
        const savedIndex = getSavedSelectedDeviceIndex();
        if (savedIndex != null && savedIndex >= 0 && savedIndex < deviceList.value.length) {
          pickerDefaultIndex.value = [savedIndex];
        } else {
          const currentIndex = deviceList.value.findIndex((device) => {
            return device.imei == currentCarImei.value || device.deviceId == currentCarDeviceId.value;
          });
          if (currentIndex != -1) {
            pickerDefaultIndex.value = [currentIndex];
          } else {
            pickerDefaultIndex.value = [0];
          }
        }
        vue.nextTick(() => {
          showPicker.value = true;
        });
      };
      const createMarker = (id, lat, lng, type, title = null) => {
        const isOnline = currentCarConnectionStatus.value == "online";
        const callout = new UTSJSONObject({
          content: title || "爱车位置",
          color: isOnline ? "#ffffff" : "#999999",
          borderRadius: 6,
          bgColor: isOnline ? "#07C160" : "#CCCCCC",
          padding: 4,
          fontSize: 12,
          display: "ALWAYS"
        });
        return {
          id,
          latitude: lat,
          longitude: lng,
          iconPath: getDeviceIcon(currentCarConnectionStatus.value, currentCarCarType.value),
          width: 30,
          height: 30,
          anchor: { x: 0.5, y: 0.5 },
          callout
        };
      };
      const loadDeviceDetail = (deviceId) => {
        return __awaiter(this, void 0, void 0, function* () {
          var _a2, _b, _c;
          try {
            const res = yield getDeviceDetail(deviceId);
            const detail = res.data;
            if (detail != null) {
              const deviceStatus = detail.getJSON("deviceStatus");
              deviceDetail2.value = {
                deviceStatus: {
                  batteryPercent: (_a2 = deviceStatus === null || deviceStatus === void 0 ? null : deviceStatus.getNumber("batteryPercent", 0)) !== null && _a2 !== void 0 ? _a2 : 0,
                  voltage: (_b = deviceStatus === null || deviceStatus === void 0 ? null : deviceStatus.getNumber("voltage", 0)) !== null && _b !== void 0 ? _b : 0,
                  signalStrength: (_c = deviceStatus === null || deviceStatus === void 0 ? null : deviceStatus.getNumber("signalStrength", 0)) !== null && _c !== void 0 ? _c : 0
                },
                connectionStatus: detail.getString("connectionStatus", "offline"),
                lastUpdateTime: detail.getString("lastUpdateTime", "")
              };
              const updateTime = detail.getString("lastUpdateTime", "");
              if (updateTime) {
                const date = new Date(updateTime);
                lastUpdateTime.value = "".concat(date.getHours().toString().padStart(2, "0"), ":").concat(date.getMinutes().toString().padStart(2, "0"), ":").concat(date.getSeconds().toString().padStart(2, "0"));
              }
            }
          } catch (error) {
            uni.__log__("error", "at pages/index/index.uvue:556", "加载设备详情失败", error);
          }
        });
      };
      const trackPosInfo = vue.ref(new UTSJSONObject({}));
      const tripData = vue.ref([]);
      const totalMileage = vue.ref(0);
      const averageSpeed = vue.ref(0);
      const processTripData = (data) => {
        const trips = data.getArray("trips");
        if (trips != null && trips.length > 0) {
          tripData.value = trips;
          let totalDistance = 0;
          let totalDuration = 0;
          let totalAvgSpeed = 0;
          trips.forEach((trip) => {
            totalDistance += trip.getNumber("distance", 0);
            totalDuration += trip.getNumber("duration", 0);
            totalAvgSpeed += trip.getNumber("averageSpeed", 0);
          });
          totalMileage.value = totalDistance;
          averageSpeed.value = totalAvgSpeed / trips.length;
        } else {
          tripData.value = [];
          totalMileage.value = 0;
          averageSpeed.value = 0;
        }
      };
      const loadTrackPos = (data) => {
        return __awaiter(this, void 0, void 0, function* () {
          try {
            const res = yield getTrackPos(data);
            if (res.code == 401) {
              showAppToast({
                title: "登录过期，请重新登录",
                icon: "none",
                duration: 2e3
              });
              uni.removeStorageSync("token");
              uni.reLaunch({
                url: "/pages/index/index"
              });
              return Promise.resolve(null);
            }
            const trackData = res.data;
            if (trackData != null) {
              processTripData(trackData);
            }
            uni.hideLoading();
          } catch (error) {
            uni.__log__("error", "at pages/index/index.uvue:612", "加载轨迹失败", error);
          }
        });
      };
      const devicePosInfo = vue.ref(null);
      const devicePositionUpdateTime = vue.computed(() => {
        const position = devicePosInfo.value;
        return position != null ? position.getString("positionUpdateTime", "暂无位置") : "暂无位置";
      });
      const loadDevicePos = (data) => {
        return __awaiter(this, void 0, void 0, function* () {
          try {
            const res = yield getDevicePos(data);
            if (res.code == 0 && res.data && res.data.length > 0) {
              const position = res.data[0];
              devicePosInfo.value = position;
              const lat = position.getNumber("latitude", 0);
              const lng = position.getNumber("longitude", 0);
              if (isNaN(lat) || isNaN(lng)) {
                uni.__log__("error", "at pages/index/index.uvue:633", "经纬度格式错误", position.getString("latitude", ""), position.getString("longitude", ""));
                showAppToast({
                  title: "定位数据异常",
                  icon: "none"
                });
                return false;
              }
              const convertedCoord = CoordTransform.wgs84ToTencent(lat, lng);
              center.latitude = convertedCoord.lat;
              center.longitude = convertedCoord.lng;
              isMapReady.value = true;
              yield delay(100);
              const nextMarker = createMarker(1, convertedCoord.lat, convertedCoord.lng, "device", currentCarName.value);
              markers.value = [nextMarker];
              uni.__log__("log", "at pages/index/index.uvue:659", "标记点更新完成");
              return true;
            } else {
              uni.__log__("warn", "at pages/index/index.uvue:662", "获取设备位置失败");
              isMapReady.value = false;
              showAppToast({
                title: "获取位置失败",
                icon: "none"
              });
              return false;
            }
          } catch (error) {
            uni.__log__("error", "at pages/index/index.uvue:671", "加载设备位置失败", error);
            showAppToast({
              title: "定位失败，请重试",
              icon: "none"
            });
            return false;
          }
        });
      };
      const loadDeviceData = (device) => {
        return __awaiter(this, void 0, void 0, function* () {
          uni.__log__("log", "at pages/index/index.uvue:682", "开始加载设备数据:", device);
          try {
            yield loadDeviceDetail(device.deviceId);
            yield loadDevicePos(new UTSJSONObject({
              deviceId: device.deviceId,
              deviceids: device.imei || device.value
            }));
            yield loadTrackPos(new UTSJSONObject({
              imei: device.imei || device.value,
              startTime: formatTimes(todayZero),
              endTime: formatTimes(nowTime),
              minParkTime: 120,
              withStop: false,
              withPos: false,
              withTrip: true
            }));
            showAppToast({
              title: "切换成功",
              icon: "none"
            });
          } catch (error) {
            uni.__log__("error", "at pages/index/index.uvue:703", "切换车辆失败", error);
            showAppToast({
              title: "切换失败，请重试",
              icon: "none"
            });
          } finally {
            uni.hideLoading();
          }
        });
      };
      const handleConfirm = (e) => {
        showPicker.value = false;
        const indexs = e.getArray("indexs");
        let selectedIndex = indexs != null && indexs.length > 0 ? indexs[0] : -1;
        if (selectedIndex < 0 || selectedIndex >= deviceList.value.length) {
          uni.__log__("warn", "at pages/index/index.uvue:725", "无法解析选中的索引，使用当前设备");
          const currentIndex = deviceList.value.findIndex((device) => {
            return device.imei == currentCarImei.value || device.deviceId == currentCarDeviceId.value;
          });
          if (currentIndex != -1) {
            selectedIndex = currentIndex;
            uni.__log__("log", "at pages/index/index.uvue:731", "使用当前设备索引:", selectedIndex);
          } else {
            selectedIndex = 0;
            uni.__log__("log", "at pages/index/index.uvue:734", "使用默认索引: 0");
          }
        }
        const selectedDevice = deviceList.value[selectedIndex];
        if (!selectedDevice) {
          showAppToast({
            title: "选择设备失败",
            icon: "none"
          });
          return null;
        }
        if (selectedDevice.imei == currentCarImei.value && selectedDevice.deviceId == currentCarDeviceId.value) {
          uni.__log__("log", "at pages/index/index.uvue:749", "选择的设备与当前设备相同，不重复加载");
          return null;
        }
        const deviceName = selectedDevice.deviceName || selectedDevice.name || "未命名设备";
        currentCarName.value = deviceName;
        currentCarImei.value = selectedDevice.imei || selectedDevice.value;
        currentCarDeptId.value = selectedDevice.deptId;
        currentCarDeviceId.value = selectedDevice.deviceId;
        currentCarIccId.value = selectedDevice.iccid;
        currentCarSimMerchant.value = selectedDevice.simMerchant;
        currentCarConnectionStatus.value = selectedDevice.connectionStatus;
        currentCarCarType.value = selectedDevice.carType;
        currentCarPlateNo.value = selectedDevice.plateNo;
        center.latitude = selectedDevice.latitude;
        center.longitude = selectedDevice.longitude;
        if (selectedIndex != -1) {
          saveSelectedDeviceIndex(selectedIndex);
          pickerDefaultIndex.value = [selectedIndex];
        }
        saveSelectedDevice(selectedDevice);
        uni.showLoading(new UTSJSONObject({
          title: "加载车辆数据...",
          mask: true
        }));
        loadDeviceData(selectedDevice);
      };
      const loadDeviceList = () => {
        return __awaiter(this, void 0, void 0, function* () {
          try {
            const res = yield getUserDeviceList(new UTSJSONObject({
              pageSize: 1e3
            }));
            const code = res.code;
            const data = res.data;
            const list = data.list;
            if (code == 0 && list != null && list.length > 0) {
              userDeviceList2.value = list;
              deviceList.value = list.map((item) => {
                const imei = item.getString("imei", "");
                const rawDeviceName = item.getString("deviceName", "");
                const deviceName = rawDeviceName != "" ? rawDeviceName : imei != "" ? imei : "未命名设备";
                return new Device({
                  name: deviceName,
                  deviceName,
                  value: imei,
                  imei,
                  deptId: item.getString("companyId", ""),
                  deviceId: item.getString("deviceId", ""),
                  iccid: item.getString("iccid", ""),
                  simMerchant: item.getString("simMerchant", ""),
                  connectionStatus: item.getString("connectionStatus", ""),
                  carType: item.getString("carType", ""),
                  plateNo: item.getString("plateNo", ""),
                  latitude: item.getNumber("latitude", 0),
                  longitude: item.getNumber("longitude", 0)
                });
              });
              const savedDevice = getSavedSelectedDevice();
              const savedIndex = getSavedSelectedDeviceIndex();
              let selectedDevice = null;
              let selectedIdx = -1;
              if (savedIndex != null && savedIndex >= 0 && savedIndex < deviceList.value.length) {
                selectedDevice = deviceList.value[savedIndex];
                selectedIdx = savedIndex;
              }
              if (selectedDevice == null && savedDevice != null && savedDevice.imei != "") {
                selectedDevice = UTS.arrayFind(deviceList.value, (device) => {
                  return device.imei == savedDevice.imei || device.value == savedDevice.imei;
                });
                if (selectedDevice) {
                  selectedIdx = deviceList.value.indexOf(selectedDevice);
                } else {
                  clearSavedSelectedDevice();
                  clearSavedSelectedDeviceIndex();
                }
              }
              if (!selectedDevice && deviceList.value.length > 0) {
                selectedDevice = deviceList.value[0];
                selectedIdx = 0;
                saveSelectedDevice(selectedDevice);
                saveSelectedDeviceIndex(0);
                uni.__log__("log", "at pages/index/index.uvue:852", "使用第一个设备作为默认:", selectedDevice === null || selectedDevice === void 0 ? null : selectedDevice.deviceName);
              }
              if (selectedDevice != null) {
                const device = selectedDevice;
                const deviceName = device.deviceName != "" ? device.deviceName : device.name != "" ? device.name : "未命名设备";
                currentCarName.value = deviceName;
                currentCarImei.value = device.imei != "" ? device.imei : device.value;
                currentCarDeptId.value = device.deptId;
                currentCarDeviceId.value = device.deviceId;
                currentCarIccId.value = device.iccid;
                currentCarSimMerchant.value = device.simMerchant;
                currentCarConnectionStatus.value = device.connectionStatus;
                currentCarCarType.value = device.carType;
                currentCarPlateNo.value = device.plateNo;
                center.latitude = device.latitude;
                center.longitude = device.longitude;
                if (selectedIdx != -1) {
                  pickerDefaultIndex.value = [selectedIdx];
                }
                yield loadDeviceDetail(device.deviceId);
                yield loadDevicePos(new UTSJSONObject({
                  deviceId: device.deviceId,
                  deviceids: device.imei != "" ? device.imei : device.value
                }));
                yield loadTrackPos(new UTSJSONObject({
                  imei: device.imei != "" ? device.imei : device.value,
                  startTime: formatTimes(todayZero),
                  endTime: formatTimes(nowTime),
                  minParkTime: 120,
                  withStop: false,
                  withPos: false,
                  withTrip: true
                }));
              }
            } else {
              showAppToast({
                title: "暂无车辆数据",
                icon: "none"
              });
            }
          } catch (error) {
            uni.__log__("error", "at pages/index/index.uvue:898", "加载车辆列表失败", error);
            showAppToast({
              title: "加载失败，请下拉重试",
              icon: "none"
            });
          }
        });
      };
      const totalTrips = vue.computed(() => {
        return tripData.value.length;
      });
      const refreshLocation = () => {
        return __awaiter(this, void 0, void 0, function* () {
          if (!currentCarDeviceId.value) {
            showAppToast({
              title: "请先选择车辆",
              icon: "none"
            });
            return Promise.resolve(null);
          }
          uni.showLoading(new UTSJSONObject({
            title: "刷新位置中...",
            mask: true
          }));
          try {
            yield loadDeviceList();
          } catch (error) {
            uni.__log__("error", "at pages/index/index.uvue:927", "刷新位置失败", error);
            showAppToast({
              title: "刷新失败",
              icon: "none"
            });
          } finally {
            uni.hideLoading();
          }
        });
      };
      function checkToken() {
        const token = uni.getStorageSync("token");
        return token != null && token.toString() != "";
      }
      function isLogin() {
        if (!checkToken()) {
          showAppToast({
            title: "请先登录",
            icon: "none"
          });
          return false;
        }
        return true;
      }
      const toRecordDetail = () => {
        if (!isLogin())
          return null;
        uni.navigateTo({
          url: "/pages/playBack/playBack?imei=" + currentCarImei.value + "&connectionStatus=" + currentCarConnectionStatus.value + "&plateNo=" + currentCarPlateNo.value + "&carType=" + currentCarCarType.value + "&lat=" + center.latitude + "&lng=" + center.longitude,
          fail: (err) => {
            if (err.errMsg.indexOf("locked") < 0)
              uni.__log__("error", "at pages/index/index.uvue:959", "跳转轨迹详情失败:", err);
          }
        });
      };
      const toDeviceList = () => {
        uni.__log__("log", "at pages/index/index.uvue:966", "toDeviceList");
        if (!isLogin())
          return null;
        uni.navigateTo({
          url: "/pages/deviceList/deviceList"
        });
      };
      const toDeviceDetail = (e = null) => {
        if (!isLogin())
          return null;
        if (!currentCarImei.value || !currentCarDeptId.value || !currentCarDeviceId.value) {
          showAppToast({
            title: "请先选择车辆",
            icon: "none"
          });
          return null;
        }
        uni.navigateTo({
          url: "/pages/carInfoDetail/carInfoDetail?imei=".concat(currentCarImei.value, "&deptId=").concat(currentCarDeptId.value, "&deviceId=").concat(currentCarDeviceId.value)
        });
      };
      const toAdd = () => {
        if (!isLogin())
          return null;
        uni.navigateTo({
          url: "/pages/addCar/addCar",
          fail: (err) => {
            if (err.errMsg.indexOf("locked") < 0)
              uni.__log__("error", "at pages/index/index.uvue:994", "跳转添加设备失败:", err);
          }
        });
      };
      const toMsgCenter = () => {
        if (!isLogin())
          return null;
        uni.switchTab({
          url: "/pages/message/message"
        });
      };
      const toFindCar = () => {
        if (!isLogin())
          return null;
        uni.openLocation({
          latitude: center.latitude,
          longitude: center.longitude,
          name: currentCarName.value,
          scale: 18,
          success: () => {
            showAppToast({
              title: "成功调起地图",
              icon: "none"
            });
          },
          fail: (err) => {
            showAppToast({
              title: "调起地图失败",
              icon: "none"
            });
            uni.__log__("error", "at pages/index/index.uvue:1026", "调起地图失败:", err);
          }
        });
      };
      const toFence = () => {
        if (!isLogin())
          return null;
        uni.navigateTo({
          url: "/pages/geofencing/geofencing?imei=" + currentCarImei.value + "&connectionStatus=" + currentCarConnectionStatus.value + "&plateNo=" + currentCarName.value + "&carType=" + currentCarCarType.value + "&deptId=" + currentCarDeptId.value + "&deviceName=" + currentCarName.value
        });
      };
      const contactCustomerService = () => {
        showAppToast({
          title: "请在微信小程序中联系客服",
          icon: "none"
        });
      };
      const needRefresh = vue.ref(false);
      const toPay = (iccid, simMerchant) => {
        if (!isLogin())
          return null;
        if (simMerchant.toLowerCase() == "zddx") {
          iccid = iccid.substring(0, iccid.length - 1);
        }
        needRefresh.value = true;
        uni.__log__("log", "at pages/index/index.uvue:1089", "iccid", iccid);
        needRefresh.value = false;
        showAppToast({
          title: "请在微信小程序中完成充值",
          icon: "none",
          duration: 2e3,
          mask: true
        });
      };
      const gotoLogin = () => {
        uni.navigateTo({
          url: "/pages/login/login"
        });
      };
      function unbindCurrentDevice() {
        return __awaiter(this, void 0, void 0, function* () {
          const result = yield delDevice(currentCarImei.value);
          if (result.code == 0) {
            showAppToast({
              title: "解绑成功",
              icon: "none"
            });
            clearSavedSelectedDevice();
            clearSavedSelectedDeviceIndex();
          } else {
            showAppToast({
              title: "解绑失败",
              icon: "error"
            });
          }
          yield loadDeviceList();
        });
      }
      const unbindDevice = () => {
        if (!isLogin())
          return null;
        uni.showModal(new UTSJSONObject({
          title: "解绑车辆",
          content: "确定解绑当前车辆吗？",
          success: (res) => {
            if (res.confirm) {
              void unbindCurrentDevice();
            }
          }
        }));
      };
      const handleExit = () => {
        if (!isLogin())
          return null;
        uni.showModal(new UTSJSONObject({
          title: "退出登录",
          content: "确定退出登录吗？",
          success: (res) => {
            return __awaiter(this, void 0, void 0, function* () {
              if (res.confirm) {
                const res_1 = yield logout();
                if (res_1.code == 0) {
                  clearSavedSelectedDevice();
                  clearSavedSelectedDeviceIndex();
                  uni.removeStorageSync("token");
                  uni.reLaunch({
                    url: "/pages/login/login"
                  });
                } else {
                  showAppToast({
                    title: "退出账户失败"
                  });
                }
              }
            });
          }
        }));
      };
      vue.onShow(() => {
        return __awaiter(this, void 0, void 0, function* () {
          if (checkToken()) {
            const needRefresh_1 = uni.getStorageSync("needRefreshHome");
            if (needRefresh_1) {
              yield loadDeviceList();
              uni.removeStorageSync("needRefreshHome");
            }
          }
        });
      });
      const handleReload = () => {
        if (!isLogin())
          return null;
        loadDeviceList();
      };
      vue.onLoad(() => {
        uni.hideTabBar();
        initDimensions();
        if (checkToken()) {
          loadDeviceList();
        }
      });
      const __returned__ = { timeRange, nowTime, todayZero, center, userDeviceList: userDeviceList2, isMapReady, mapScale, statusBarHeight, menuButtonInfo, navBarHeight, deviceList, showPicker, pickerDefaultIndex, pickerKey, currentCarImei, currentCarDeptId, currentCarDeviceId, currentCarIccId, currentCarName, currentCarSimMerchant, currentCarConnectionStatus, currentCarCarType, currentCarPlateNo, deviceDetail: deviceDetail2, markers, lastUpdateTime, SELECTED_DEVICE_STORAGE_KEY, SELECTED_DEVICE_INDEX_STORAGE_KEY, safeDeviceDetail, pickerColumns, closePicker, initDimensions, delay, saveSelectedDevice, decodeSavedDevice, getSavedSelectedDevice, clearSavedSelectedDevice, saveSelectedDeviceIndex, getSavedSelectedDeviceIndex, clearSavedSelectedDeviceIndex, setCurrentCarFromSavedDevice, handlePicker, createMarker, loadDeviceDetail, trackPosInfo, tripData, totalMileage, averageSpeed, processTripData, loadTrackPos, devicePosInfo, devicePositionUpdateTime, loadDevicePos, loadDeviceData, handleConfirm, loadDeviceList, totalTrips, refreshLocation, checkToken, isLogin, toRecordDetail, toDeviceList, toDeviceDetail, toAdd, toMsgCenter, toFindCar, toFence, contactCustomerService, needRefresh, toPay, gotoLogin, unbindCurrentDevice, unbindDevice, handleExit, handleReload };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  const _imports_1$2 = "/static/banner.png";
  const _imports_2$2 = "/static/pos.png";
  const _imports_3$1 = "/static/car.png";
  const _imports_4 = "/static/dzwl.png";
  const _imports_5 = "/static/msg.png";
  const _imports_6 = "/static/pay.png";
  const _imports_7 = "/static/online.png";
  const _imports_8 = "/static/del.png";
  const _style_0$H = { "container": { "": { "height": "100%", "backgroundColor": "#E6F9E6", "backgroundImage": "linear-gradient(to right, #E6F9E6, #E0F0FF)" } }, "page-bg": { ".container ": { "paddingTop": 0, "paddingRight": "30rpx", "paddingBottom": "30rpx", "paddingLeft": "30rpx" } }, "loading-container": { ".container .page-bg ": { "position": "fixed", "top": "50%", "left": "50%", "transform": "translate(-50%, -50%)", "display": "flex", "flexDirection": "column", "alignItems": "center", "zIndex": 999 } }, "loading-text": { ".container .page-bg .loading-container ": { "marginTop": "20rpx", "fontSize": "28rpx", "color": "#666666" } }, "device-car": { ".container .page-bg .top ": { "display": "flex", "flexDirection": "row", "justifyContent": "space-between", "alignItems": "center" } }, "current-car": { ".container .page-bg .top .device-car ": { "position": "relative", "display": "flex", "flexDirection": "row", "alignItems": "flex-end" } }, "car-id": { ".container .page-bg .top .device-car .current-car ": { "fontSize": "36rpx", "fontWeight": "bold", "color": "#000000", "textAlign": "center", "position": "relative" } }, "login": { ".container .page-bg .top .device-car .current-car ": { "fontSize": "36rpx", "fontWeight": "bold", "color": "#000000", "textAlign": "center", "paddingRight": "30rpx" } }, "nav-tools": { ".container .page-bg .top .device-car ": { "display": "flex", "flexDirection": "row", "justifyContent": "space-between", "alignItems": "center" } }, "nav-tool-spacing": { ".container .page-bg .top .device-car .nav-tools ": { "marginLeft": "30rpx" } }, "exit": { ".container .page-bg .top .device-car .nav-tools ": { "display": "flex", "alignItems": "center", "justifyContent": "center", "paddingTop": "10rpx", "paddingRight": "10rpx", "paddingBottom": "10rpx", "paddingLeft": "10rpx", "backgroundColor": "rgba(0,0,0,0.05)", "transitionProperty": "all", "transitionDuration": "0.2s", "transitionTimingFunction": "ease", "borderTopLeftRadius": "50%", "borderTopRightRadius": "50%", "borderBottomRightRadius": "50%", "borderBottomLeftRadius": "50%" } }, "exit-icon": { ".container .page-bg .top .device-car .nav-tools .exit ": { "width": "40rpx", "height": "40rpx" } }, "device-info": { ".container .page-bg .top ": { "display": "flex", "flexDirection": "column", "paddingTop": "20rpx", "paddingRight": "20rpx", "paddingBottom": "20rpx", "paddingLeft": "20rpx", "borderTopLeftRadius": "16rpx", "borderTopRightRadius": "16rpx", "borderBottomRightRadius": "16rpx", "borderBottomLeftRadius": "16rpx", "width": "50%" } }, "info": { ".container .page-bg .top .device-info .info+": { "marginTop": "16rpx" }, ".container .page-bg .top .device-info ": { "fontSize": "26rpx", "color": "#333333" } }, "banner-image": { ".container .page-bg .top ": { "width": "100%", "height": "300rpx" } }, "car-state": { ".container .page-bg .top ": { "display": "flex", "flexDirection": "row", "justifyContent": "space-between", "alignItems": "center", "paddingTop": "20rpx", "paddingRight": 0, "paddingBottom": "20rpx", "paddingLeft": 0, "borderTopLeftRadius": "16rpx", "borderTopRightRadius": "16rpx", "borderBottomRightRadius": "16rpx", "borderBottomLeftRadius": "16rpx" } }, "state-item": { ".container .page-bg .top .car-state .state-item+": { "marginLeft": "20rpx" }, ".container .page-bg .top .car-state ": { "flexGrow": 1, "flexShrink": 1, "flexBasis": "0%", "display": "flex", "flexDirection": "column", "alignItems": "center", "backgroundColor": "#ffffff", "paddingTop": "20rpx", "paddingRight": "20rpx", "paddingBottom": "20rpx", "paddingLeft": "20rpx", "borderTopLeftRadius": "30rpx", "borderTopRightRadius": "30rpx", "borderBottomRightRadius": "30rpx", "borderBottomLeftRadius": "30rpx" } }, "state-label": { ".container .page-bg .top .car-state .state-item ": { "fontSize": "24rpx", "color": "#999999" } }, "state-value": { ".container .page-bg .top .car-state .state-item ": { "marginTop": "12rpx", "fontSize": "25rpx", "fontWeight": "bold", "color": "#333333" }, ".container .page-bg .top .car-state .state-item .online": { "color": "#07C160" } }, "map-box": { ".container .page-bg .content ": { "width": "100%", "height": "400rpx", "marginTop": "10rpx", "marginRight": 0, "marginBottom": "40rpx", "marginLeft": 0, "backgroundColor": "#ffffff", "borderTopLeftRadius": "20rpx", "borderTopRightRadius": "20rpx", "borderBottomRightRadius": "20rpx", "borderBottomLeftRadius": "20rpx", "display": "flex", "flexDirection": "column", "overflow": "hidden", "boxShadow": "0 4rpx 20rpx rgba(0, 0, 0, 0.08)" } }, "map-header": { ".container .page-bg .content .map-box ": { "display": "flex", "flexDirection": "row", "justifyContent": "space-between", "alignItems": "center", "paddingTop": "20rpx", "paddingRight": "30rpx", "paddingBottom": "20rpx", "paddingLeft": "30rpx", "borderBottomWidth": "1rpx", "borderBottomStyle": "solid", "borderBottomColor": "#f0f0f0" } }, "map-title": { ".container .page-bg .content .map-box .map-header ": { "fontSize": "32rpx", "fontWeight": "bold", "color": "#333333" } }, "map-refresh": { ".container .page-bg .content .map-box .map-header ": { "fontSize": "26rpx", "color": "#07C160", "paddingTop": "8rpx", "paddingRight": "16rpx", "paddingBottom": "8rpx", "paddingLeft": "16rpx", "backgroundImage": "none", "backgroundColor": "#f0f9f0", "borderTopLeftRadius": "8rpx", "borderTopRightRadius": "8rpx", "borderBottomRightRadius": "8rpx", "borderBottomLeftRadius": "8rpx" } }, "map-container": { ".container .page-bg .content .map-box ": { "height": "300rpx" } }, "mile-record": { ".container .page-bg .content ": { "width": "100%", "backgroundColor": "#ffffff", "borderTopLeftRadius": "20rpx", "borderTopRightRadius": "20rpx", "borderBottomRightRadius": "20rpx", "borderBottomLeftRadius": "20rpx", "display": "flex", "flexDirection": "column", "overflow": "hidden", "boxShadow": "0 4rpx 20rpx rgba(0, 0, 0, 0.08)" } }, "record-header": { ".container .page-bg .content .mile-record ": { "display": "flex", "flexDirection": "row", "justifyContent": "space-between", "alignItems": "center", "paddingTop": "20rpx", "paddingRight": "30rpx", "paddingBottom": "20rpx", "paddingLeft": "30rpx", "borderBottomWidth": "1rpx", "borderBottomStyle": "solid", "borderBottomColor": "#f0f0f0" } }, "record-title": { ".container .page-bg .content .mile-record .record-header ": { "fontSize": "32rpx", "fontWeight": "bold", "color": "#333333" } }, "record-desc": { ".container .page-bg .content .mile-record .record-header ": { "fontSize": "26rpx", "color": "#07C160", "paddingTop": "8rpx", "paddingRight": "16rpx", "paddingBottom": "8rpx", "paddingLeft": "16rpx", "backgroundImage": "none", "backgroundColor": "#f0f9f0", "borderTopLeftRadius": "8rpx", "borderTopRightRadius": "8rpx", "borderBottomRightRadius": "8rpx", "borderBottomLeftRadius": "8rpx" } }, "ring-container": { ".container .page-bg .content .mile-record ": { "display": "flex", "flexDirection": "row", "justifyContent": "space-around", "paddingTop": "30rpx", "paddingRight": "20rpx", "paddingBottom": "30rpx", "paddingLeft": "20rpx", "backgroundColor": "#edf7ff", "borderTopLeftRadius": "24rpx", "borderTopRightRadius": "24rpx", "borderBottomRightRadius": "24rpx", "borderBottomLeftRadius": "24rpx", "marginTop": "20rpx", "marginRight": "20rpx", "marginBottom": "20rpx", "marginLeft": "20rpx" } }, "ring-item": { ".container .page-bg .content .mile-record ": { "position": "relative", "width": "250rpx", "height": "250rpx", "display": "flex", "alignItems": "center", "justifyContent": "center" } }, "ring-bg": { ".container .page-bg .content .mile-record ": { "position": "absolute", "width": "250rpx", "height": "250rpx", "zIndex": 2 } }, "ring-quarter": { ".container .page-bg .content .mile-record ": { "position": "absolute", "width": "125rpx", "height": "125rpx", "overflow": "hidden" } }, "ring-quarter--top-left": { ".container .page-bg .content .mile-record ": { "top": 0, "left": 0 } }, "ring-quarter--top-right": { ".container .page-bg .content .mile-record ": { "top": 0, "right": 0 } }, "ring-quarter--bottom-right": { ".container .page-bg .content .mile-record ": { "right": 0, "bottom": 0 } }, "ring-quarter--bottom-left": { ".container .page-bg .content .mile-record ": { "bottom": 0, "left": 0 } }, "ring-stroke": { ".container .page-bg .content .mile-record ": { "position": "absolute", "width": "250rpx", "height": "250rpx", "boxSizing": "border-box", "borderTopWidth": "16rpx", "borderRightWidth": "16rpx", "borderBottomWidth": "16rpx", "borderLeftWidth": "16rpx", "borderTopStyle": "solid", "borderRightStyle": "solid", "borderBottomStyle": "solid", "borderLeftStyle": "solid", "borderTopColor": "#000000", "borderRightColor": "#000000", "borderBottomColor": "#000000", "borderLeftColor": "#000000", "borderTopLeftRadius": 999, "borderTopRightRadius": 999, "borderBottomRightRadius": 999, "borderBottomLeftRadius": 999 }, ".container .page-bg .content .mile-record .ring-quarter--top-left ": { "top": 0, "left": 0 }, ".container .page-bg .content .mile-record .ring-quarter--top-right ": { "top": 0, "right": 0 }, ".container .page-bg .content .mile-record .ring-quarter--bottom-right ": { "right": 0, "bottom": 0 }, ".container .page-bg .content .mile-record .ring-quarter--bottom-left ": { "bottom": 0, "left": 0 } }, "ring-stroke--track": { ".container .page-bg .content .mile-record ": { "borderTopColor": "#dceaf3", "borderRightColor": "#dceaf3", "borderBottomColor": "#dceaf3", "borderLeftColor": "#dceaf3", "borderTopWidth": "5rpx", "borderRightWidth": "5rpx", "borderBottomWidth": "5rpx", "borderLeftWidth": "5rpx" } }, "ring-stroke--active": { ".container .page-bg .content .mile-record ": { "borderTopColor": "#4cd964", "borderRightColor": "#4cd964", "borderBottomColor": "#4cd964", "borderLeftColor": "#4cd964" }, ".container .page-bg .content .mile-record .ring-bg.orange ": { "borderTopColor": "#ff9500", "borderRightColor": "#ff9500", "borderBottomColor": "#ff9500", "borderLeftColor": "#ff9500" } }, "ring-text": { ".container .page-bg .content .mile-record ": { "position": "relative", "zIndex": 10 } }, "num": { ".container .page-bg .content .mile-record ": { "fontSize": "45rpx", "fontWeight": "bold", "color": "#333333", "textAlign": "center" } }, "unit": { ".container .page-bg .content .mile-record ": { "fontSize": "20rpx", "color": "#666666", "textAlign": "right" } }, "label": { ".container .page-bg .content .mile-record ": { "fontSize": "25rpx", "color": "#666666", "marginTop": "12rpx", "textAlign": "center" } }, "device-list": { ".container .page-bg .content ": { "display": "flex", "flexDirection": "column", "marginTop": "40rpx", "marginRight": 0, "marginBottom": "40rpx", "marginLeft": 0 } }, "device-item": { ".container .page-bg .content .device-list .device-item+": { "marginTop": "30rpx" }, ".container .page-bg .content .device-list ": { "display": "flex", "flexDirection": "row", "justifyContent": "space-between", "alignItems": "center", "paddingTop": "24rpx", "paddingRight": "24rpx", "paddingBottom": "24rpx", "paddingLeft": "24rpx", "backgroundColor": "#ffffff", "borderTopLeftRadius": "20rpx", "borderTopRightRadius": "20rpx", "borderBottomRightRadius": "20rpx", "borderBottomLeftRadius": "20rpx" } }, "item-label": { ".container .page-bg .content .device-list .device-item ": { "display": "flex", "flexDirection": "row", "alignItems": "center" } }, "icon": { ".container .page-bg .content .device-list .device-item .item-label ": { "width": "80rpx", "height": "80rpx", "borderTopLeftRadius": "50%", "borderTopRightRadius": "50%", "borderBottomRightRadius": "50%", "borderBottomLeftRadius": "50%", "paddingTop": "18rpx", "paddingRight": "18rpx", "paddingBottom": "18rpx", "paddingLeft": "18rpx" }, ".container .page-bg .content .device-list .device-item .item-label .icon-device": { "backgroundColor": "#f0f9f0" }, ".container .page-bg .content .device-list .device-item .item-label .icon-car": { "backgroundColor": "#f3f8fb" }, ".container .page-bg .content .device-list .device-item .item-label .icon-fence": { "backgroundColor": "#f1f7f4" } }, "icon-image": { ".container .page-bg .content .device-list .device-item .item-label ": { "width": "45rpx", "height": "45rpx" }, ".container .page-bg .content .service .service-content .service-item ": { "width": "60rpx", "height": "60rpx" } }, "item-info": { ".container .page-bg .content .device-list .device-item .item-label ": { "marginLeft": "20rpx" } }, "item-title": { ".container .page-bg .content .device-list .device-item .item-label .item-info ": { "fontSize": "28rpx", "fontWeight": "bold", "color": "#333333" }, ".container .page-bg .content .service .service-content .service-item ": { "marginTop": "10rpx", "fontSize": "25rpx", "color": "#222222" } }, "item-desc": { ".container .page-bg .content .device-list .device-item .item-label .item-info ": { "color": "#cccccc", "fontSize": "24rpx", "marginTop": "10rpx" } }, "service": { ".container .page-bg .content ": { "display": "flex", "flexDirection": "column", "borderTopLeftRadius": "20rpx", "borderTopRightRadius": "20rpx", "borderBottomRightRadius": "20rpx", "borderBottomLeftRadius": "20rpx", "backgroundColor": "#ffffff", "marginBottom": "30rpx" } }, "service-header": { ".container .page-bg .content .service ": { "fontSize": "32rpx", "fontWeight": "bold", "color": "#333333", "paddingTop": "20rpx", "paddingRight": "30rpx", "paddingBottom": "20rpx", "paddingLeft": "30rpx", "borderBottomWidth": "1rpx", "borderBottomStyle": "solid", "borderBottomColor": "#f0f0f0", "marginBottom": "30rpx" } }, "service-content": { ".container .page-bg .content .service ": { "display": "flex", "flexDirection": "row", "justifyContent": "space-between", "alignItems": "center", "paddingTop": "20rpx", "paddingRight": "30rpx", "paddingBottom": "20rpx", "paddingLeft": "30rpx" } }, "service-item": { ".container .page-bg .content .service .service-content ": { "display": "flex", "flexDirection": "column", "alignItems": "center" } }, "@TRANSITION": { "exit": { "property": "all", "duration": "0.2s", "timingFunction": "ease" } } };
  function _sfc_render$H(_ctx, _cache, $props, $setup, $data, $options) {
    var _a;
    const _component_i_icon = resolveEasycom(vue.resolveDynamicComponent("i-icon"), __easycom_2$6);
    const _component_i_line_progress = resolveEasycom(vue.resolveDynamicComponent("i-line-progress"), __easycom_1$4);
    const _component_map = vue.resolveComponent("map");
    const _component_i_picker = resolveEasycom(vue.resolveDynamicComponent("i-picker"), __easycom_2$5);
    const _component_app_toast = resolveEasycom(vue.resolveDynamicComponent("app-toast"), __easycom_3$3);
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.createElementVNode("scroll-view", {
          class: "container",
          "scroll-y": "true",
          "show-scrollbar": false
        }, [
          vue.createElementVNode("view", { class: "page-bg" }, [
            vue.createElementVNode(
              "view",
              {
                class: "top",
                style: vue.normalizeStyle({ paddingTop: $setup.statusBarHeight + 10 + "px" })
              },
              [
                vue.createElementVNode("view", { class: "device-car" }, [
                  vue.createElementVNode("view", { class: "current-car" }, [
                    $setup.checkToken() ? (vue.openBlock(), vue.createElementBlock("view", { key: 0 }, [
                      $setup.currentCarName ? (vue.openBlock(), vue.createElementBlock(
                        "text",
                        {
                          key: 0,
                          class: "car-id",
                          onClick: $setup.handlePicker
                        },
                        vue.toDisplayString((_a = $setup.currentCarName) != null ? _a : "加载中…"),
                        1
                        /* TEXT */
                      )) : (vue.openBlock(), vue.createElementBlock("text", {
                        key: 1,
                        class: "car-id"
                      }, "暂无设备"))
                    ])) : (vue.openBlock(), vue.createElementBlock("text", {
                      key: 1,
                      class: "login",
                      onClick: $setup.gotoLogin
                    }, "点击登录!")),
                    vue.createVNode(_component_i_icon, {
                      name: "/static/right-bottom.png",
                      fontSize: "7"
                    })
                  ]),
                  vue.createElementVNode("view", { class: "nav-tools" }, [
                    vue.createCommentVNode("v-if", true),
                    vue.createVNode(_component_i_icon, {
                      name: "/static/reload.png",
                      fontSize: "18",
                      onClick: $setup.handleReload
                    }),
                    vue.createVNode(_component_i_icon, {
                      class: "nav-tool-spacing",
                      name: "/static/maps.png",
                      fontSize: "20",
                      onClick: $setup.toDeviceList
                    }),
                    vue.createVNode(_component_i_icon, {
                      class: "nav-tool-spacing",
                      name: "/static/addNew.png",
                      fontSize: "18",
                      onClick: $setup.toAdd
                    })
                  ])
                ]),
                $setup.safeDeviceDetail.deviceStatus.batteryPercent && $setup.safeDeviceDetail.deviceStatus.voltage ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 0,
                  class: "device-info"
                }, [
                  $setup.safeDeviceDetail.deviceStatus.batteryPercent ? (vue.openBlock(), vue.createBlock(_component_i_line_progress, {
                    key: 0,
                    percent: $setup.safeDeviceDetail.deviceStatus.batteryPercent
                  }, null, 8, ["percent"])) : vue.createCommentVNode("v-if", true),
                  $setup.safeDeviceDetail.deviceStatus.batteryPercent ? (vue.openBlock(), vue.createElementBlock(
                    "view",
                    {
                      key: 1,
                      class: "info"
                    },
                    "电量: " + vue.toDisplayString($setup.safeDeviceDetail.deviceStatus.batteryPercent) + "%",
                    1
                    /* TEXT */
                  )) : vue.createCommentVNode("v-if", true),
                  $setup.safeDeviceDetail.deviceStatus.voltage ? (vue.openBlock(), vue.createElementBlock(
                    "view",
                    {
                      key: 2,
                      class: "info"
                    },
                    "电压: " + vue.toDisplayString($setup.safeDeviceDetail.deviceStatus.voltage) + "V",
                    1
                    /* TEXT */
                  )) : vue.createCommentVNode("v-if", true)
                ])) : vue.createCommentVNode("v-if", true),
                vue.createElementVNode("view", { class: "banner" }, [
                  vue.createElementVNode("image", {
                    src: _imports_1$2,
                    mode: "aspectFit",
                    class: "banner-image"
                  })
                ]),
                vue.createElementVNode("view", { class: "car-state" }, [
                  vue.createElementVNode("view", { class: "state-item" }, [
                    vue.createElementVNode("text", { class: "state-label" }, "设备状态"),
                    vue.createElementVNode(
                      "text",
                      {
                        class: vue.normalizeClass(["state-value", { "online": $setup.safeDeviceDetail.connectionStatus == "online" }])
                      },
                      vue.toDisplayString($setup.safeDeviceDetail.connectionStatus == "online" ? "在线" : "离线"),
                      3
                      /* TEXT, CLASS */
                    )
                  ]),
                  vue.createElementVNode("view", { class: "state-item" }, [
                    vue.createElementVNode("text", { class: "state-label" }, "最后定位"),
                    vue.createElementVNode(
                      "text",
                      { class: "state-value" },
                      vue.toDisplayString($setup.devicePositionUpdateTime),
                      1
                      /* TEXT */
                    )
                  ])
                ])
              ],
              4
              /* STYLE */
            ),
            vue.createElementVNode("view", { class: "content" }, [
              vue.createElementVNode("view", { class: "map-box" }, [
                vue.createElementVNode("view", { class: "map-header" }, [
                  vue.createElementVNode("text", { class: "map-title" }, "车辆定位"),
                  vue.createElementVNode("text", {
                    class: "map-refresh",
                    onClick: $setup.refreshLocation
                  }, "刷新位置")
                ]),
                vue.createElementVNode("view", { class: "map-container" }, [
                  $setup.isMapReady ? (vue.openBlock(), vue.createBlock(_component_map, {
                    key: 0,
                    id: "myMap",
                    latitude: $setup.center.latitude,
                    longitude: $setup.center.longitude,
                    scale: $setup.mapScale,
                    style: { "width": "100%", "height": "100%" },
                    "show-location": true,
                    "enable-traffic": true,
                    "enable-overlooking": true,
                    "enable-building": true,
                    "enable-3D": false,
                    markers: $setup.markers
                  }, null, 8, ["latitude", "longitude", "scale", "markers"])) : vue.createCommentVNode("v-if", true)
                ])
              ]),
              vue.createElementVNode("view", { class: "mile-record" }, [
                vue.createElementVNode("view", { class: "record-header" }, [
                  vue.createElementVNode("text", { class: "record-title" }, "轨迹记录"),
                  vue.createElementVNode("text", {
                    class: "record-desc",
                    onClick: $setup.toRecordDetail
                  }, "更多轨迹")
                ]),
                vue.createElementVNode("view", { class: "ring-container" }, [
                  vue.createElementVNode("view", { class: "ring-item" }, [
                    vue.createElementVNode("view", { class: "ring-bg green" }, [
                      vue.createElementVNode("view", { class: "ring-quarter ring-quarter--top-left" }, [
                        vue.createElementVNode("view", { class: "ring-stroke ring-stroke--track" })
                      ]),
                      vue.createElementVNode("view", { class: "ring-quarter ring-quarter--top-right" }, [
                        vue.createElementVNode("view", { class: "ring-stroke ring-stroke--active" })
                      ]),
                      vue.createElementVNode("view", { class: "ring-quarter ring-quarter--bottom-right" }, [
                        vue.createElementVNode("view", { class: "ring-stroke ring-stroke--active" })
                      ]),
                      vue.createElementVNode("view", { class: "ring-quarter ring-quarter--bottom-left" }, [
                        vue.createElementVNode("view", { class: "ring-stroke ring-stroke--active" })
                      ])
                    ]),
                    vue.createElementVNode("view", { class: "ring-text" }, [
                      vue.createElementVNode("text", { class: "unit" }, "条"),
                      vue.createElementVNode(
                        "text",
                        { class: "num" },
                        vue.toDisplayString($setup.totalTrips),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode("text", { class: "label" }, "今日轨迹")
                    ])
                  ]),
                  vue.createElementVNode("view", { class: "ring-item" }, [
                    vue.createElementVNode("view", { class: "ring-bg orange" }, [
                      vue.createElementVNode("view", { class: "ring-quarter ring-quarter--top-left" }, [
                        vue.createElementVNode("view", { class: "ring-stroke ring-stroke--track" })
                      ]),
                      vue.createElementVNode("view", { class: "ring-quarter ring-quarter--top-right" }, [
                        vue.createElementVNode("view", { class: "ring-stroke ring-stroke--active" })
                      ]),
                      vue.createElementVNode("view", { class: "ring-quarter ring-quarter--bottom-right" }, [
                        vue.createElementVNode("view", { class: "ring-stroke ring-stroke--active" })
                      ]),
                      vue.createElementVNode("view", { class: "ring-quarter ring-quarter--bottom-left" }, [
                        vue.createElementVNode("view", { class: "ring-stroke ring-stroke--active" })
                      ])
                    ]),
                    vue.createElementVNode("view", { class: "ring-text" }, [
                      vue.createElementVNode("text", { class: "unit" }, "km"),
                      vue.createElementVNode(
                        "text",
                        { class: "num" },
                        vue.toDisplayString(($setup.totalMileage / 1e3).toFixed(2)),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode("text", { class: "label" }, "今日里程")
                    ])
                  ])
                ])
              ]),
              vue.createElementVNode("view", { class: "device-list" }, [
                vue.createElementVNode("view", {
                  class: "device-item",
                  onClick: $setup.toDeviceDetail
                }, [
                  vue.createElementVNode("view", { class: "item-label" }, [
                    vue.createElementVNode("view", { class: "icon icon-device" }, [
                      vue.createElementVNode("image", {
                        src: _imports_2$2,
                        mode: "aspectFill",
                        class: "icon-image"
                      })
                    ]),
                    vue.createElementVNode("view", { class: "item-info" }, [
                      vue.createElementVNode("text", { class: "item-title" }, "设备详情"),
                      vue.createElementVNode("text", { class: "item-desc" }, "查看设备更多详情")
                    ])
                  ]),
                  vue.createVNode(_component_i_icon, {
                    name: "/static/arrow-right.png",
                    fontSize: "15"
                  })
                ]),
                vue.createElementVNode("view", {
                  class: "device-item",
                  onClick: $setup.toFindCar
                }, [
                  vue.createElementVNode("view", { class: "item-label" }, [
                    vue.createElementVNode("view", { class: "icon icon-car" }, [
                      vue.createElementVNode("image", {
                        src: _imports_3$1,
                        mode: "aspectFill",
                        class: "icon-image"
                      })
                    ]),
                    vue.createElementVNode("view", { class: "item-info" }, [
                      vue.createElementVNode("text", { class: "item-title" }, "一键寻车"),
                      vue.createElementVNode("text", { class: "item-desc" }, "点击立即寻找车辆位置")
                    ])
                  ]),
                  vue.createVNode(_component_i_icon, {
                    name: "/static/arrow-right.png",
                    fontSize: "15"
                  })
                ]),
                vue.createElementVNode("view", {
                  class: "device-item",
                  onClick: $setup.toFence
                }, [
                  vue.createElementVNode("view", { class: "item-label" }, [
                    vue.createElementVNode("view", { class: "icon icon-fence" }, [
                      vue.createElementVNode("image", {
                        src: _imports_4,
                        mode: "aspectFill",
                        class: "icon-image"
                      })
                    ]),
                    vue.createElementVNode("view", { class: "item-info" }, [
                      vue.createElementVNode("text", { class: "item-title" }, "电子围栏"),
                      vue.createElementVNode("text", { class: "item-desc" }, "点击去设置或者查看电子围栏")
                    ])
                  ]),
                  vue.createVNode(_component_i_icon, {
                    name: "/static/arrow-right.png",
                    fontSize: "15"
                  })
                ])
              ]),
              vue.createElementVNode("view", { class: "service" }, [
                vue.createElementVNode("text", { class: "service-header" }, "服务中心"),
                vue.createElementVNode("view", { class: "service-content" }, [
                  vue.createElementVNode("view", {
                    class: "service-item",
                    onClick: $setup.toMsgCenter
                  }, [
                    vue.createElementVNode("image", {
                      src: _imports_5,
                      mode: "aspectFill",
                      class: "icon-image"
                    }),
                    vue.createElementVNode("text", { class: "item-title" }, "警报消息")
                  ]),
                  vue.createElementVNode("view", {
                    class: "service-item",
                    onClick: _cache[0] || (_cache[0] = ($event) => $setup.toPay($setup.currentCarIccId, $setup.currentCarSimMerchant))
                  }, [
                    vue.createElementVNode("image", {
                      src: _imports_6,
                      mode: "aspectFill",
                      class: "icon-image"
                    }),
                    vue.createElementVNode("text", { class: "item-title" }, "一键续费")
                  ]),
                  vue.createElementVNode("view", {
                    class: "service-item",
                    onClick: $setup.contactCustomerService
                  }, [
                    vue.createElementVNode("image", {
                      src: _imports_7,
                      mode: "aspectFill",
                      class: "icon-image"
                    }),
                    vue.createElementVNode("text", { class: "item-title" }, "在线客服")
                  ]),
                  vue.createElementVNode("view", {
                    class: "service-item",
                    onClick: $setup.unbindDevice
                  }, [
                    vue.createElementVNode("image", {
                      src: _imports_8,
                      mode: "aspectFill",
                      class: "icon-image"
                    }),
                    vue.createElementVNode("text", {
                      class: "item-title",
                      style: { "color": "#d81e06" }
                    }, "删除设备")
                  ])
                ])
              ])
            ])
          ]),
          $setup.showPicker ? (vue.openBlock(), vue.createBlock(_component_i_picker, {
            key: $setup.pickerKey,
            show: $setup.showPicker,
            columns: $setup.pickerColumns,
            defaultIndex: $setup.pickerDefaultIndex,
            visibleItemCount: 5,
            onConfirm: $setup.handleConfirm,
            onCancel: $setup.closePicker,
            onClose: $setup.closePicker
          }, null, 8, ["show", "columns", "defaultIndex"])) : vue.createCommentVNode("v-if", true)
        ]),
        vue.createVNode(_component_app_toast)
      ],
      64
      /* STABLE_FRAGMENT */
    );
  }
  const PagesIndexIndex = /* @__PURE__ */ _export_sfc(_sfc_main$I, [["render", _sfc_render$H], ["styles", [_style_0$H]], ["__file", "/Users/xyhc/Documents/carConnectInternet/pages/index/index.uvue"]]);
  const _sfc_main$H = /* @__PURE__ */ vue.defineComponent({
    __name: "custom-navBar",
    props: {
      title: String,
      showBack: { type: Boolean, default: true },
      backText: { type: String, default: "" },
      showCapsule: { type: Boolean, default: true },
      backgroundColor: { type: String, default: "#f1f1f1" },
      textColor: { type: String, default: "#000000" },
      isIcon: { type: Boolean, default: true },
      Icon: { type: String, default: "plus-circle" },
      rightText: { type: String, default: "" },
      isShowStyle: { type: Boolean, default: false },
      iconColor: { type: String, default: "#606266" }
    },
    emits: ["back", "capsuleClick"],
    setup(__props, _a) {
      var __expose = _a.expose, __emit = _a.emit;
      __expose();
      const props = __props;
      const emit = __emit;
      const statusBarHeight = vue.ref(20);
      const navBarHeight = vue.ref(44);
      const menuButtonInfo = vue.ref(new UTSJSONObject({
        top: 4,
        right: 10,
        width: 87,
        height: 32
      }));
      const initDimensions = () => {
        const systemInfo = uni.getSystemInfoSync();
        statusBarHeight.value = systemInfo.statusBarHeight != null ? systemInfo.statusBarHeight : 20;
      };
      const handleCapsuleClick = () => {
        emit("capsuleClick", "menu");
      };
      const handleBack = () => {
        const pages = getCurrentPages();
        if (pages.length > 1) {
          uni.navigateBack();
        } else {
          uni.switchTab({ url: "/pages/index/index" });
        }
        emit("back");
      };
      vue.onMounted(initDimensions);
      const __returned__ = { props, emit, statusBarHeight, navBarHeight, menuButtonInfo, initDimensions, handleCapsuleClick, handleBack };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  const _imports_0$3 = "/static/back.png";
  const _style_0$G = { "navbar": { "": { "position": "relative", "display": "flex", "flexDirection": "row", "justifyContent": "space-between", "alignItems": "center" } }, "back-btn": { "": { "display": "flex", "alignItems": "center", "width": "70rpx", "height": "40rpx", "zIndex": 10, "justifyContent": "center" } }, "title": { "": { "textAlign": "center", "fontWeight": "bold", "fontSize": "36rpx" } }, "capsule-item": { "": { "width": 40, "height": "100%", "display": "flex", "justifyContent": "center", "alignItems": "center" } }, "icon": { "": { "width": "40rpx", "height": "40rpx" } }, "menu-icon": { "": { "width": "60rpx", "height": "60rpx" } } };
  function _sfc_render$G(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_i_icon = resolveEasycom(vue.resolveDynamicComponent("i-icon"), __easycom_2$6);
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.createElementVNode(
          "view",
          {
            style: vue.normalizeStyle($props.isShowStyle ? { height: $setup.statusBarHeight + "px", "background-color": "#f1f1f1", position: "fixed", width: "100%", letf: 0, top: 0, "z-index": "100" } : { height: $setup.statusBarHeight + "px", "background-color": "#f1f1f1" })
          },
          null,
          4
          /* STYLE */
        ),
        vue.createElementVNode(
          "view",
          {
            class: "navbar",
            style: vue.normalizeStyle($props.isShowStyle ? {
              height: $setup.navBarHeight + "px",
              background: $props.backgroundColor,
              position: "fixed",
              width: "100%",
              letf: "0",
              top: $setup.statusBarHeight + "px",
              "z-index": "100"
            } : {
              height: $setup.navBarHeight + "px",
              background: $props.backgroundColor
            })
          },
          [
            vue.createElementVNode("view", { class: "back-btn" }, [
              $props.showBack ? (vue.openBlock(), vue.createElementBlock("image", {
                key: 0,
                src: _imports_0$3,
                mode: "aspectFit",
                class: "icon",
                onClick: $setup.handleBack
              })) : vue.createCommentVNode("v-if", true)
            ]),
            vue.createElementVNode(
              "text",
              {
                class: "title",
                style: vue.normalizeStyle({ color: $props.textColor, "line-height": $setup.navBarHeight + "px" })
              },
              [
                vue.renderSlot(_ctx.$slots, "title", {}, () => [
                  vue.createTextVNode(
                    vue.toDisplayString($props.title),
                    1
                    /* TEXT */
                  )
                ])
              ],
              4
              /* STYLE */
            ),
            vue.createElementVNode("view", {
              class: "capsule",
              style: {
                right: "10rpx"
              }
            }, [
              vue.createElementVNode("view", { class: "capsule-item" }, [
                $props.showCapsule ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 0,
                  onClick: $setup.handleCapsuleClick
                }, [
                  $props.isIcon ? (vue.openBlock(), vue.createBlock(_component_i_icon, {
                    key: 0,
                    name: $props.Icon,
                    fontSize: "20"
                  }, null, 8, ["name"])) : (vue.openBlock(), vue.createElementBlock(
                    "text",
                    { key: 1 },
                    vue.toDisplayString($props.rightText),
                    1
                    /* TEXT */
                  ))
                ])) : vue.createCommentVNode("v-if", true)
              ])
            ])
          ],
          4
          /* STYLE */
        )
      ],
      64
      /* STABLE_FRAGMENT */
    );
  }
  const __easycom_0$5 = /* @__PURE__ */ _export_sfc(_sfc_main$H, [["render", _sfc_render$G], ["styles", [_style_0$G]], ["__file", "/Users/xyhc/Documents/carConnectInternet/components/custom-navBar/custom-navBar.uvue"]]);
  const _sfc_main$G = /* @__PURE__ */ vue.defineComponent(Object.assign({ name: "i-modal" }, { __name: "i-modal", props: {
    show: { type: Boolean, default: false },
    title: { type: String, default: "" },
    content: { type: String, default: "" },
    confirmText: { type: String, default: "确认" },
    cancelText: { type: String, default: "取消" },
    showConfirmButton: { type: Boolean, default: true },
    showCancelButton: { type: Boolean, default: false },
    confirmColor: { type: String, default: "#2979ff" },
    cancelColor: { type: String, default: "#606266" },
    duration: { type: Number, default: 200 },
    buttonReverse: { type: Boolean, default: false },
    zoom: { type: Boolean, default: true },
    zIndex: { type: Number, default: 10075 },
    asyncClose: { type: Boolean, default: false },
    closeable: { type: Boolean, default: false },
    closeOnMask: { type: Boolean, default: false },
    negativeTop: { type: String, default: "0px" },
    width: { type: String, default: "320px" },
    confirmButtonShape: { type: String, default: "100px" },
    round: { type: String, default: "6px" },
    buttonModel: { type: String, default: "text" },
    buttonRadius: { type: String, default: "100px" },
    confirmBgColor: { type: String, default: "" },
    cancelBgColor: { type: String, default: "" },
    customStyle: { type: String, default: "" }
  }, emits: ["confirm", "cancel", "close", "update:show"], setup(__props, _a) {
    var __expose = _a.expose, __emit = _a.emit;
    const props = __props;
    const emit = __emit;
    function formatMs(value) {
      return value.toString() + "ms";
    }
    function formatSize(value) {
      if (value.indexOf("px") >= 0 || value.indexOf("rpx") >= 0 || value.indexOf("%") >= 0) {
        return value;
      }
      return value + "px";
    }
    function stringifyStyle(value) {
      if (value.length == 0)
        return "";
      return value.endsWith(";") ? value : value + ";";
    }
    function animationDuration() {
      return props.duration;
    }
    const opened = vue.ref(props.show);
    const active = vue.ref(props.show);
    const loading = vue.ref(false);
    let closeTimer = 0;
    const maskStyle = vue.computed(() => {
      return "z-index:" + props.zIndex.toString() + ";opacity:" + (props.show || active.value ? "1" : "0") + ";transition-duration:" + formatMs(props.duration) + ";";
    });
    const visibleMaskStyle = vue.computed(() => {
      if (props.show && !opened.value) {
        return "z-index:" + props.zIndex.toString() + ";opacity:1;transition-duration:" + formatMs(props.duration) + ";";
      }
      return maskStyle.value;
    });
    const modalClass = vue.computed(() => {
      const classes = ["i-modal"];
      return classes.join(" ");
    });
    const modalStyle = vue.computed(() => {
      let style = "width:" + formatSize(props.width) + ";";
      style = style + "border-radius:" + formatSize(props.round) + ";";
      style = style + "transition-duration:" + formatMs(props.duration) + ";";
      const top = formatSize(props.negativeTop);
      const scaleValue = props.zoom ? props.show || active.value ? "1" : "0.86" : "1";
      const translateValue = top != "0px" ? "-" + top : "0px";
      style = style + "opacity:" + (props.show || active.value ? "1" : "0") + ";";
      style = style + "transform:translateY(" + translateValue + ") scale(" + scaleValue + ");";
      style = style + stringifyStyle(props.customStyle);
      return style;
    });
    const visibleModalStyle = vue.computed(() => {
      return modalStyle.value;
    });
    const confirmButtonClass = vue.computed(() => {
      const classes = ["i-modal__button", "i-modal__button--confirm"];
      if (props.buttonModel == "button")
        classes.push("i-modal__button--model-button");
      if (props.confirmButtonShape == "square")
        classes.push("i-modal__button--square");
      return classes.join(" ");
    });
    const cancelButtonClass = vue.computed(() => {
      const classes = ["i-modal__button", "i-modal__button--cancel"];
      if (props.buttonModel == "button")
        classes.push("i-modal__button--model-button");
      return classes.join(" ");
    });
    const confirmTextStyle = vue.computed(() => {
      return "color:" + props.confirmColor + ";";
    });
    const cancelTextStyle = vue.computed(() => {
      return "color:" + props.cancelColor + ";";
    });
    const confirmButtonStyle = vue.computed(() => {
      if (props.buttonModel != "button")
        return "";
      let style = "border-radius:" + formatSize(props.buttonRadius) + ";";
      if (props.confirmBgColor.length > 0)
        style = style + "background-color:" + props.confirmBgColor + ";";
      return style;
    });
    const cancelButtonStyle = vue.computed(() => {
      if (props.buttonModel != "button")
        return "";
      let style = "border-radius:" + formatSize(props.buttonRadius) + ";";
      if (props.cancelBgColor.length > 0)
        style = style + "background-color:" + props.cancelBgColor + ";";
      return style;
    });
    function clearCloseTimer() {
      if (closeTimer > 0) {
        clearTimeout(closeTimer);
        closeTimer = 0;
      }
    }
    function openPanel() {
      clearCloseTimer();
      opened.value = true;
      setTimeout(() => {
        active.value = true;
      }, 20);
    }
    function closePanel(shouldEmitUpdate) {
      clearCloseTimer();
      active.value = false;
      loading.value = false;
      closeTimer = setTimeout(() => {
        opened.value = false;
        closeTimer = 0;
        if (shouldEmitUpdate)
          emit("update:show", false);
      }, animationDuration());
    }
    function open() {
      openPanel();
      emit("update:show", true);
    }
    function close() {
      closePanel(true);
    }
    function confirm() {
      if (loading.value)
        return null;
      emit("confirm");
      if (props.asyncClose) {
        loading.value = true;
        return null;
      }
      close();
    }
    function cancel() {
      emit("cancel");
      closePanel(true);
    }
    function closeByIcon() {
      emit("close");
      closePanel(true);
    }
    function handleOverlayClick() {
      if (!props.closeOnMask)
        return null;
      emit("close");
      closePanel(true);
    }
    __expose({
      open,
      close
    });
    const __returned__ = { props, emit, formatMs, formatSize, stringifyStyle, animationDuration, opened, active, loading, get closeTimer() {
      return closeTimer;
    }, set closeTimer(v) {
      closeTimer = v;
    }, maskStyle, visibleMaskStyle, modalClass, modalStyle, visibleModalStyle, confirmButtonClass, cancelButtonClass, confirmTextStyle, cancelTextStyle, confirmButtonStyle, cancelButtonStyle, clearCloseTimer, openPanel, closePanel, open, close, confirm, cancel, closeByIcon, handleOverlayClick };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  } }));
  const _style_0$F = { "i-modal__mask": { "": { "position": "fixed", "left": 0, "right": 0, "top": 0, "bottom": 0, "backgroundColor": "rgba(0,0,0,0.5)", "alignItems": "center", "justifyContent": "center", "transitionProperty": "opacity", "transitionTimingFunction": "ease" } }, "i-modal": { "": { "position": "relative", "overflow": "hidden", "backgroundColor": "#ffffff", "transitionProperty": "transform,opacity", "transitionTimingFunction": "cubic-bezier(0.22,1,0.36,1)" } }, "i-modal__close": { "": { "position": "absolute", "right": 8, "top": 8, "zIndex": 2, "width": 34, "height": 34, "alignItems": "center", "justifyContent": "center" } }, "i-modal__close-text": { "": { "color": "#909399", "fontSize": 22, "lineHeight": "30px" } }, "i-modal__title": { "": { "paddingTop": 22, "paddingRight": 22, "paddingBottom": 8, "paddingLeft": 22, "color": "#303133", "fontSize": 17, "fontWeight": 600, "lineHeight": "24px", "textAlign": "center" } }, "i-modal__content-wrap": { "": { "minHeight": 52, "paddingTop": 8, "paddingRight": 22, "paddingBottom": 22, "paddingLeft": 22, "alignItems": "center", "justifyContent": "center" } }, "i-modal__content": { "": { "color": "#606266", "fontSize": 14, "lineHeight": "22px", "textAlign": "center" } }, "i-modal__footer": { "": { "minHeight": 48, "borderTopWidth": 1, "borderTopStyle": "solid", "borderTopColor": "#f3f4f6" } }, "i-modal__footer--button": { "": { "paddingTop": 10, "paddingRight": 14, "paddingBottom": 14, "paddingLeft": 14, "borderTopWidth": 0 } }, "i-modal__footer-inner": { "": { "flexDirection": "row" } }, "i-modal__button": { "": { "flexGrow": 1, "flexShrink": 1, "flexBasis": "0%", "height": 48, "alignItems": "center", "justifyContent": "center" } }, "i-modal__button--cancel": { "": { "borderRightWidth": 1, "borderRightStyle": "solid", "borderRightColor": "#f3f4f6" } }, "i-modal__button--model-button": { "": { "height": 40, "marginTop": 0, "marginRight": 5, "marginBottom": 0, "marginLeft": 5, "borderRightWidth": 0, "backgroundColor": "#f5f7fb" } }, "i-modal__button--square": { "": { "borderTopLeftRadius": 4, "borderTopRightRadius": 4, "borderBottomRightRadius": 4, "borderBottomLeftRadius": 4 } }, "i-modal__confirm-text": { "": { "fontSize": 15, "fontWeight": 600, "lineHeight": "22px" } }, "i-modal__cancel-text": { "": { "fontSize": 15, "fontWeight": 600, "lineHeight": "22px" } }, "@TRANSITION": { "i-modal__mask": { "property": "opacity", "timingFunction": "ease" }, "i-modal": { "property": "transform,opacity", "timingFunction": "cubic-bezier(0.22,1,0.36,1)" } } };
  function _sfc_render$F(_ctx, _cache, $props, $setup, $data, $options) {
    return $props.show || $setup.opened ? (vue.openBlock(), vue.createElementBlock(
      "view",
      {
        key: 0,
        class: "i-modal__mask",
        style: vue.normalizeStyle($setup.visibleMaskStyle),
        onClick: $setup.handleOverlayClick
      },
      [
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass($setup.modalClass),
            style: vue.normalizeStyle($setup.visibleModalStyle),
            onClick: _cache[0] || (_cache[0] = vue.withModifiers(() => {
            }, ["stop"]))
          },
          [
            $props.closeable ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "i-modal__close",
              onClick: $setup.closeByIcon
            }, [
              vue.createElementVNode("text", { class: "i-modal__close-text" }, "×")
            ])) : vue.createCommentVNode("v-if", true),
            $props.title.length > 0 ? (vue.openBlock(), vue.createElementBlock(
              "text",
              {
                key: 1,
                class: "i-modal__title"
              },
              vue.toDisplayString($props.title),
              1
              /* TEXT */
            )) : vue.createCommentVNode("v-if", true),
            vue.createElementVNode("view", { class: "i-modal__content-wrap" }, [
              vue.renderSlot(_ctx.$slots, "default", {}, () => [
                vue.createElementVNode(
                  "text",
                  { class: "i-modal__content" },
                  vue.toDisplayString($props.content),
                  1
                  /* TEXT */
                )
              ])
            ]),
            vue.createElementVNode(
              "view",
              {
                class: vue.normalizeClass(["i-modal__footer", $props.buttonModel == "button" ? "i-modal__footer--button" : ""])
              },
              [
                $props.buttonReverse ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 0,
                  class: "i-modal__footer-inner"
                }, [
                  vue.renderSlot(_ctx.$slots, "confirmButton", {}, () => [
                    $props.showConfirmButton ? (vue.openBlock(), vue.createElementBlock(
                      "view",
                      {
                        key: 0,
                        class: vue.normalizeClass($setup.confirmButtonClass),
                        style: vue.normalizeStyle($setup.confirmButtonStyle),
                        onClick: $setup.confirm
                      },
                      [
                        vue.createElementVNode(
                          "text",
                          {
                            class: "i-modal__confirm-text",
                            style: vue.normalizeStyle($setup.confirmTextStyle)
                          },
                          vue.toDisplayString($setup.loading ? "..." : $props.confirmText),
                          5
                          /* TEXT, STYLE */
                        )
                      ],
                      6
                      /* CLASS, STYLE */
                    )) : vue.createCommentVNode("v-if", true)
                  ]),
                  $props.showCancelButton ? (vue.openBlock(), vue.createElementBlock(
                    "view",
                    {
                      key: 0,
                      class: vue.normalizeClass($setup.cancelButtonClass),
                      style: vue.normalizeStyle($setup.cancelButtonStyle),
                      onClick: $setup.cancel
                    },
                    [
                      vue.createElementVNode(
                        "text",
                        {
                          class: "i-modal__cancel-text",
                          style: vue.normalizeStyle($setup.cancelTextStyle)
                        },
                        vue.toDisplayString($props.cancelText),
                        5
                        /* TEXT, STYLE */
                      )
                    ],
                    6
                    /* CLASS, STYLE */
                  )) : vue.createCommentVNode("v-if", true)
                ])) : (vue.openBlock(), vue.createElementBlock("view", {
                  key: 1,
                  class: "i-modal__footer-inner"
                }, [
                  $props.showCancelButton ? (vue.openBlock(), vue.createElementBlock(
                    "view",
                    {
                      key: 0,
                      class: vue.normalizeClass($setup.cancelButtonClass),
                      style: vue.normalizeStyle($setup.cancelButtonStyle),
                      onClick: $setup.cancel
                    },
                    [
                      vue.createElementVNode(
                        "text",
                        {
                          class: "i-modal__cancel-text",
                          style: vue.normalizeStyle($setup.cancelTextStyle)
                        },
                        vue.toDisplayString($props.cancelText),
                        5
                        /* TEXT, STYLE */
                      )
                    ],
                    6
                    /* CLASS, STYLE */
                  )) : vue.createCommentVNode("v-if", true),
                  vue.renderSlot(_ctx.$slots, "confirmButton", {}, () => [
                    $props.showConfirmButton ? (vue.openBlock(), vue.createElementBlock(
                      "view",
                      {
                        key: 0,
                        class: vue.normalizeClass($setup.confirmButtonClass),
                        style: vue.normalizeStyle($setup.confirmButtonStyle),
                        onClick: $setup.confirm
                      },
                      [
                        vue.createElementVNode(
                          "text",
                          {
                            class: "i-modal__confirm-text",
                            style: vue.normalizeStyle($setup.confirmTextStyle)
                          },
                          vue.toDisplayString($setup.loading ? "..." : $props.confirmText),
                          5
                          /* TEXT, STYLE */
                        )
                      ],
                      6
                      /* CLASS, STYLE */
                    )) : vue.createCommentVNode("v-if", true)
                  ])
                ]))
              ],
              2
              /* CLASS */
            )
          ],
          6
          /* CLASS, STYLE */
        )
      ],
      4
      /* STYLE */
    )) : vue.createCommentVNode("v-if", true);
  }
  const __easycom_1$3 = /* @__PURE__ */ _export_sfc(_sfc_main$G, [["render", _sfc_render$F], ["styles", [_style_0$F]], ["__file", "/Users/xyhc/Documents/carConnectInternet/uni_modules/i-ui-x/components/i-modal/i-modal.uvue"]]);
  class ModalInstance extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            open: { type: "Unknown", optional: false },
            close: { type: "Unknown", optional: false }
          };
        },
        name: "ModalInstance"
      };
    }
    constructor(options, metadata = ModalInstance.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.open = this.__props__.open;
      this.close = this.__props__.close;
      delete this.__props__;
    }
  }
  class MessageData extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            list: { type: "Unknown", optional: false },
            total: { type: Number, optional: false },
            totalPage: { type: Number, optional: false }
          };
        },
        name: "MessageData"
      };
    }
    constructor(options, metadata = MessageData.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.list = this.__props__.list;
      this.total = this.__props__.total;
      this.totalPage = this.__props__.totalPage;
      delete this.__props__;
    }
  }
  class MessageResponse extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            code: { type: Number, optional: false },
            msg: { type: String, optional: false },
            data: { type: MessageData, optional: false }
          };
        },
        name: "MessageResponse"
      };
    }
    constructor(options, metadata = MessageResponse.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.code = this.__props__.code;
      this.msg = this.__props__.msg;
      this.data = this.__props__.data;
      delete this.__props__;
    }
  }
  const _sfc_main$F = /* @__PURE__ */ vue.defineComponent({
    __name: "message",
    setup(__props, _a) {
      var __expose = _a.expose;
      __expose();
      const modal = vue.ref(false);
      const modalContent = vue.ref(new UTSJSONObject({}));
      const refresherTriggered = vue.ref(false);
      const msgList = vue.ref([]);
      const currPage = vue.ref(1);
      const pageSize = vue.ref(10);
      const totalPage = vue.ref(1);
      const loadStatus = vue.ref("loadmore");
      const isLoading = vue.ref(false);
      const hasNewMessages = vue.ref(false);
      const newMessageCount = vue.ref(0);
      const lastUpdateTime = vue.ref((/* @__PURE__ */ new Date()).getTime());
      const Login = vue.ref(false);
      let checkTimer = 0;
      const isPageActive = vue.ref(false);
      function stopNewMessageCheck() {
        if (checkTimer > 0) {
          uni.__log__("log", "at pages/message/message.uvue:100", "停止定时消息检查");
          clearInterval(checkTimer);
          checkTimer = 0;
        }
      }
      function vibrateAlert() {
        for (let i = 0; i < 3; i++) {
          uni.vibrateLong(new UTSJSONObject({}));
        }
      }
      function checkNewMessages() {
        return __awaiter(this, void 0, void 0, function* () {
          if (!isPageActive.value || isLoading.value)
            return Promise.resolve(null);
          try {
            const res = yield getUserMsgList(new UTSJSONObject({ page: 1, pageSize: 1 }));
            const code = res.code;
            if (code != 0)
              return Promise.resolve(null);
            const data = res.data;
            const list = data.list;
            if (list == null || list.length == 0)
              return Promise.resolve(null);
            const latestMessage = list[0];
            const createTime = latestMessage.getString("createTime", "");
            if (createTime == "")
              return Promise.resolve(null);
            const messageTime = new Date(createTime).getTime();
            if (messageTime <= lastUpdateTime.value)
              return Promise.resolve(null);
            hasNewMessages.value = true;
            vibrateAlert();
            const countRes = yield getUserMsgList(new UTSJSONObject({ page: 1, pageSize: 50 }));
            const newList = countRes.data.list;
            if (newList != null) {
              let count = 0;
              newList.forEach((message) => {
                if (new Date(message.getString("createTime", "")).getTime() > lastUpdateTime.value)
                  count++;
              });
              newMessageCount.value = count;
            }
          } catch (error) {
            uni.__log__("error", "at pages/message/message.uvue:140", "检查新消息失败:", error);
          }
        });
      }
      function startNewMessageCheck() {
        if (checkTimer > 0) {
          stopNewMessageCheck();
        }
        uni.__log__("log", "at pages/message/message.uvue:150", "启动定时消息检查");
        checkTimer = setInterval(() => {
          if (isPageActive.value) {
            uni.__log__("log", "at pages/message/message.uvue:154", "定时检查新消息...");
            checkNewMessages();
          }
        }, 1e4);
      }
      function loadMsgList(isInit = false) {
        return __awaiter(this, void 0, void 0, function* () {
          if (isInit) {
            currPage.value = 1;
            msgList.value = [];
            loadStatus.value = "loadmore";
          }
          if (isLoading.value)
            return Promise.resolve(null);
          isLoading.value = true;
          try {
            if (!isInit)
              loadStatus.value = "loading";
            const res = yield getUserMsgList(new UTSJSONObject({
              page: currPage.value,
              pageSize: pageSize.value
            }));
            if (res.code != 0) {
              loadStatus.value = "loadmore";
              return Promise.resolve(null);
            }
            const data = res.data;
            const totalPages = data.totalPage > 0 ? data.totalPage : 1;
            totalPage.value = totalPages;
            const newData = data.list;
            if (isInit) {
              msgList.value = newData;
              if (newData.length > 0)
                lastUpdateTime.value = (/* @__PURE__ */ new Date()).getTime();
            } else {
              newData.forEach((item) => {
                const messageId = item.getString("messageId", "");
                const exists = msgList.value.some((existing) => {
                  return existing.getString("messageId", "") == messageId;
                });
                if (!exists)
                  msgList.value.push(item);
              });
            }
            loadStatus.value = currPage.value >= totalPage.value ? "nomore" : "loadmore";
            if (isInit) {
              hasNewMessages.value = false;
              newMessageCount.value = 0;
            }
          } catch (error) {
            loadStatus.value = "loadmore";
            uni.__log__("error", "at pages/message/message.uvue:201", "请求异常:", error);
          } finally {
            isLoading.value = false;
          }
        });
      }
      function loadNewMessages() {
        return __awaiter(this, void 0, void 0, function* () {
          uni.__log__("log", "at pages/message/message.uvue:209", "加载新消息");
          yield loadMsgList(true);
          hasNewMessages.value = false;
          newMessageCount.value = 0;
          lastUpdateTime.value = (/* @__PURE__ */ new Date()).getTime();
          uni.__log__("log", "at pages/message/message.uvue:214", "新消息加载完成");
        });
      }
      vue.onLoad(() => {
        const token = uni.getStorageSync("token");
        if (token) {
          Login.value = true;
          loadMsgList(true);
        } else {
          Login.value = false;
        }
      });
      const gotoLogin = () => {
        uni.redirectTo({ url: "/pages/login/login" });
      };
      vue.onShow(() => {
        if (Login.value) {
          uni.__log__("log", "at pages/message/message.uvue:238", "页面显示 - 启动自动刷新");
          isPageActive.value = true;
          startNewMessageCheck();
          checkNewMessages();
        }
      });
      vue.onHide(() => {
        uni.__log__("log", "at pages/message/message.uvue:248", "页面隐藏 - 停止自动刷新");
        if (Login.value) {
          uni.__log__("log", "at pages/message/message.uvue:250", "页面隐藏 - 停止自动刷新");
          isPageActive.value = false;
          stopNewMessageCheck();
        }
      });
      vue.onUnload(() => {
        uni.__log__("log", "at pages/message/message.uvue:258", "页面卸载 - 清理资源");
        if (Login.value) {
          uni.__log__("log", "at pages/message/message.uvue:260", "页面卸载 - 清理资源");
          isPageActive.value = false;
          stopNewMessageCheck();
        }
      });
      vue.onActivated(() => {
        uni.__log__("log", "at pages/message/message.uvue:267", "页面激活 - 启动自动刷新");
        if (Login.value) {
          uni.__log__("log", "at pages/message/message.uvue:269", "页面激活 - 启动自动刷新");
          isPageActive.value = true;
          startNewMessageCheck();
          checkNewMessages();
        }
      });
      vue.onDeactivated(() => {
        uni.__log__("log", "at pages/message/message.uvue:278", "页面停用 - 停止自动刷新");
        if (Login.value) {
          uni.__log__("log", "at pages/message/message.uvue:280", "页面停用 - 停止自动刷新");
          isPageActive.value = false;
          stopNewMessageCheck();
        }
      });
      const onRefresherRefresh = () => {
        uni.__log__("log", "at pages/message/message.uvue:288", "下拉刷新触发");
        refresherTriggered.value = true;
        loadMsgList(true).then(() => {
          refresherTriggered.value = false;
        }).catch(() => {
          refresherTriggered.value = false;
        });
      };
      const loadMore = () => {
        return __awaiter(this, void 0, void 0, function* () {
          uni.__log__("log", "at pages/message/message.uvue:299", "准备加载更多 - 当前页:", currPage.value, "总页数:", totalPage.value);
          if (isLoading.value || loadStatus.value != "loadmore" || currPage.value >= totalPage.value) {
            if (currPage.value >= totalPage.value) {
              loadStatus.value = "nomore";
            }
            return Promise.resolve(null);
          }
          currPage.value++;
          yield loadMsgList();
        });
      };
      const onScrollToLower = () => {
        uni.__log__("log", "at pages/message/message.uvue:313", "滚动到底部 - 当前页:", currPage.value, "总页数:", totalPage.value);
        if (loadStatus.value == "loadmore" && !isLoading.value) {
          loadMore();
        }
      };
      const handleItemClick = (item) => {
        return __awaiter(this, void 0, void 0, function* () {
          modalContent.value = item;
          modal.value = true;
          if (item.getNumber("status", 0) == 1) {
            try {
              const messageId = item.getString("messageId", "");
              const res = yield setMsgState(messageId);
              if (res.code == 0 || res.msg == "success") {
                const index = msgList.value.findIndex((message) => {
                  return message.getString("messageId", "") == messageId;
                });
                if (index != -1) {
                  msgList.value[index].set("status", 0);
                  msgList.value = [...msgList.value];
                }
              }
            } catch (error) {
              uni.__log__("error", "at pages/message/message.uvue:337", "更新状态失败:", error);
            }
          }
        });
      };
      const ReadIt = () => {
        modal.value = false;
      };
      const getMessageId = (item, index) => {
        const messageId = item.getString("messageId", "");
        return messageId != "" ? messageId : index.toString();
      };
      const getMessageCreateTime = (item) => {
        return item.getString("createTime", "");
      };
      const getMessageContent = (item) => {
        return item.getString("content", "");
      };
      const isMessageUnread = (item) => {
        return item.getNumber("status", 0) == 1;
      };
      const getMessageTypeText = (type) => {
        switch (type) {
          case 1:
            return "警告";
          case 2:
            return "事件";
          default:
            return "通知";
        }
      };
      const getMessageTitle = (item) => {
        return getMessageTypeText(item.getNumber("messageType", 0)) + " - " + getMessageCreateTime(item);
      };
      const formatTime = (timeString) => {
        if (!timeString)
          return "";
        try {
          const date = new Date(timeString);
          const now = /* @__PURE__ */ new Date();
          const diff = now.getTime() - date.getTime();
          const minutes = Math.floor(diff / 6e4);
          const hours = Math.floor(diff / 36e5);
          const days = Math.floor(diff / 864e5);
          if (minutes < 1)
            return "刚刚";
          if (minutes < 60)
            return "".concat(minutes, "分钟前");
          if (hours < 24)
            return "".concat(hours, "小时前");
          if (days < 7)
            return "".concat(days, "天前");
          return "".concat(date.getMonth() + 1, "-").concat(date.getDate());
        } catch (error) {
          return timeString;
        }
      };
      const __returned__ = { modal, modalContent, refresherTriggered, msgList, currPage, pageSize, totalPage, loadStatus, isLoading, hasNewMessages, newMessageCount, lastUpdateTime, Login, get checkTimer() {
        return checkTimer;
      }, set checkTimer(v) {
        checkTimer = v;
      }, isPageActive, stopNewMessageCheck, vibrateAlert, checkNewMessages, startNewMessageCheck, loadMsgList, loadNewMessages, gotoLogin, onRefresherRefresh, loadMore, onScrollToLower, handleItemClick, ReadIt, getMessageId, getMessageCreateTime, getMessageContent, isMessageUnread, getMessageTypeText, getMessageTitle, formatTime };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  const _style_0$E = { "container": { "": { "width": "100%", "height": "100%", "backgroundColor": "#f5f5f5", "marginTop": "170rpx", "position": "relative" } }, "scroll-container": { ".container ": { "height": "100%", "width": "100%" } }, "list-box": { ".container ": { "width": "100%", "paddingTop": "20rpx", "paddingRight": "20rpx", "paddingBottom": "20rpx", "paddingLeft": "20rpx", "position": "relative" } }, "message-item": { ".container .list-box ": { "marginBottom": "20rpx", "paddingTop": "24rpx", "paddingRight": "24rpx", "paddingBottom": "24rpx", "paddingLeft": "24rpx", "borderTopLeftRadius": "20rpx", "borderTopRightRadius": "20rpx", "borderBottomRightRadius": "20rpx", "borderBottomLeftRadius": "20rpx", "backgroundColor": "#ffffff" } }, "message-header": { ".container .list-box ": { "display": "flex", "flexDirection": "row", "alignItems": "center", "justifyContent": "space-between" } }, "message-content-row": { ".container .list-box ": { "display": "flex", "flexDirection": "row", "alignItems": "center", "justifyContent": "space-between", "marginTop": "16rpx" } }, "message-title": { ".container .list-box ": { "flexGrow": 1, "flexShrink": 1, "flexBasis": "0%", "fontSize": "30rpx", "color": "#333333", "whiteSpace": "nowrap", "textOverflow": "ellipsis", "overflow": "hidden" } }, "message-content": { ".container .list-box ": { "flexGrow": 1, "flexShrink": 1, "flexBasis": "0%", "fontSize": "26rpx", "color": "#666666", "whiteSpace": "nowrap", "textOverflow": "ellipsis", "overflow": "hidden" } }, "unread-badge": { ".container .list-box ": { "marginLeft": "16rpx", "paddingTop": "4rpx", "paddingRight": "12rpx", "paddingBottom": "4rpx", "paddingLeft": "12rpx", "borderTopLeftRadius": "20rpx", "borderTopRightRadius": "20rpx", "borderBottomRightRadius": "20rpx", "borderBottomLeftRadius": "20rpx", "backgroundColor": "#f56c6c", "color": "#ffffff", "fontSize": "22rpx" } }, "empty-state": { ".container .list-box ": { "textAlign": "center", "paddingTop": "50rpx", "paddingRight": 0, "paddingBottom": "50rpx", "paddingLeft": 0, "color": "#999999", "fontSize": "28rpx" } }, "new-message-tip": { ".container .list-box ": { "backgroundImage": "linear-gradient(135deg, #2979ff, #07c160)", "backgroundColor": "rgba(0,0,0,0)", "color": "#FFFFFF", "paddingTop": "20rpx", "paddingRight": "20rpx", "paddingBottom": "20rpx", "paddingLeft": "20rpx", "textAlign": "center", "borderTopLeftRadius": "10rpx", "borderTopRightRadius": "10rpx", "borderBottomRightRadius": "10rpx", "borderBottomLeftRadius": "10rpx", "marginBottom": "20rpx", "fontSize": "26rpx" } }, "load-more": { ".container .list-box ": { "display": "flex", "flexDirection": "row", "justifyContent": "center", "alignItems": "center", "paddingTop": "30rpx", "paddingRight": 0, "paddingBottom": "30rpx", "paddingLeft": 0, "textAlign": "center" } }, "tips-text": { ".container .list-box .load-more ": { "color": "#999999", "fontSize": "26rpx", "textAlign": "center" } } };
  function _sfc_render$E(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_custom_navBar = resolveEasycom(vue.resolveDynamicComponent("custom-navBar"), __easycom_0$5);
    const _component_i_modal = resolveEasycom(vue.resolveDynamicComponent("i-modal"), __easycom_1$3);
    const _component_app_toast = resolveEasycom(vue.resolveDynamicComponent("app-toast"), __easycom_3$3);
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.createVNode(_component_custom_navBar, {
          title: "消息中心",
          "show-back": true,
          backgroundColor: "#fff",
          textColor: "#333",
          showCapsule: false,
          isShowStyle: true
        }),
        vue.createElementVNode("view", { class: "container" }, [
          vue.createElementVNode("scroll-view", {
            "scroll-y": "",
            class: "scroll-container",
            "refresher-enabled": "",
            "refresher-triggered": $setup.refresherTriggered,
            "lower-threshold": 100,
            onRefresherrefresh: $setup.onRefresherRefresh,
            onScrolltolower: $setup.onScrollToLower
          }, [
            vue.createElementVNode("view", { class: "list-box" }, [
              $setup.msgList.length == 0 && !$setup.isLoading ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "empty-state"
              }, [
                vue.createElementVNode("text", null, "暂无消息")
              ])) : vue.createCommentVNode("v-if", true),
              $setup.hasNewMessages ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 1,
                class: "new-message-tip",
                onClick: $setup.loadNewMessages
              }, [
                vue.createElementVNode(
                  "text",
                  null,
                  "有 " + vue.toDisplayString($setup.newMessageCount) + " 条新消息，点击查看",
                  1
                  /* TEXT */
                )
              ])) : vue.createCommentVNode("v-if", true),
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($setup.msgList, (item, index) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    key: $setup.getMessageId(item, index),
                    class: "message-item",
                    onClick: ($event) => $setup.handleItemClick(item)
                  }, [
                    vue.createElementVNode("view", { class: "message-header" }, [
                      vue.createElementVNode(
                        "text",
                        { class: "message-title" },
                        vue.toDisplayString($setup.getMessageTitle(item)),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "text",
                        { class: "time-text" },
                        vue.toDisplayString($setup.formatTime($setup.getMessageCreateTime(item))),
                        1
                        /* TEXT */
                      )
                    ]),
                    vue.createElementVNode("view", { class: "message-content-row" }, [
                      vue.createElementVNode(
                        "text",
                        { class: "message-content" },
                        vue.toDisplayString($setup.getMessageContent(item)),
                        1
                        /* TEXT */
                      ),
                      $setup.isMessageUnread(item) ? (vue.openBlock(), vue.createElementBlock("text", {
                        key: 0,
                        class: "unread-badge"
                      }, "未读")) : vue.createCommentVNode("v-if", true)
                    ])
                  ], 8, ["onClick"]);
                }),
                128
                /* KEYED_FRAGMENT */
              )),
              $setup.Login ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 2,
                class: "load-more"
              }, [
                $setup.loadStatus == "loading" ? (vue.openBlock(), vue.createElementBlock("text", {
                  key: 0,
                  class: "tips-text"
                }, "上拉加载更多")) : $setup.loadStatus == "nomore" ? (vue.openBlock(), vue.createElementBlock("text", {
                  key: 1,
                  class: "tips-text"
                }, "没有更多了")) : (vue.openBlock(), vue.createElementBlock("text", {
                  key: 2,
                  class: "tips-text"
                }, "加载中..."))
              ])) : vue.createCommentVNode("v-if", true)
            ])
          ], 40, ["refresher-triggered"]),
          vue.createVNode(_component_i_modal, {
            show: $setup.modal,
            title: $setup.getMessageTypeText($setup.modalContent.getNumber("messageType", 0)),
            content: $setup.modalContent.getString("content", ""),
            onConfirm: $setup.ReadIt
          }, null, 8, ["show", "title", "content"])
        ]),
        vue.createVNode(_component_app_toast)
      ],
      64
      /* STABLE_FRAGMENT */
    );
  }
  const PagesMessageMessage = /* @__PURE__ */ _export_sfc(_sfc_main$F, [["render", _sfc_render$E], ["styles", [_style_0$E]], ["__file", "/Users/xyhc/Documents/carConnectInternet/pages/message/message.uvue"]]);
  const _sfc_main$E = /* @__PURE__ */ vue.defineComponent(Object.assign({ name: "i-badge" }, { __name: "i-badge", props: {
    label: {
      type: String,
      default: ""
    },
    count: {
      type: Number,
      default: 0
    },
    value: {
      type: [String, Number],
      default: ""
    },
    type: {
      type: String,
      default: "danger"
    },
    dot: {
      type: Boolean,
      default: true
    },
    maxCount: {
      type: Number,
      default: 99
    },
    max: {
      type: Number,
      default: 99
    },
    position: {
      type: String,
      default: "right"
    },
    offset: {
      type: Array,
      default() {
        return [0, 0];
      }
    },
    fontSize: {
      type: [String, Number],
      default: "9"
    },
    showZero: {
      type: Boolean,
      default: false
    },
    hidden: {
      type: Boolean,
      default: false
    },
    bgColor: {
      type: String,
      default: "error"
    },
    fontColor: {
      type: String,
      default: "white"
    },
    color: {
      type: String,
      default: ""
    }
  }, emits: ["click"], setup(__props, _a) {
    var __expose = _a.expose, __emit = _a.emit;
    __expose();
    const props = __props;
    const emit = __emit;
    function hasNumberValue() {
      if (props.value != null && props.value.toString().length > 0)
        return true;
      return props.count > 0 || props.showZero;
    }
    function effectiveCount() {
      if (props.value != null && props.value.toString().length > 0) {
        if (typeof props.value == "number")
          return props.value;
        return parseFloat(props.value);
      }
      return props.count;
    }
    function getMaxCount() {
      if (props.maxCount != 99)
        return props.maxCount;
      return props.max;
    }
    function effectiveBgColor() {
      if (props.bgColor.length > 0)
        return props.bgColor;
      return props.type;
    }
    function effectiveFontColor() {
      if (props.color.length > 0)
        return props.color;
      return props.fontColor;
    }
    function normalizeTheme(value) {
      const text = value;
      if (text == "danger")
        return "error";
      if (text == "error" || text == "primary" || text == "success" || text == "warning" || text == "info")
        return text;
      return "custom";
    }
    function parseColor(value) {
      const text = value;
      if (text == "white")
        return "#ffffff";
      if (text == "black")
        return "#000000";
      if (text == "danger" || text == "error")
        return "#f56c6c";
      if (text == "primary")
        return "#3c9cff";
      if (text == "success")
        return "#5ac725";
      if (text == "warning")
        return "#f9ae3d";
      if (text == "info")
        return "#909399";
      return text;
    }
    function normalizePosition(value) {
      const text = value;
      if (text == "rightTop")
        return "right";
      if (text == "leftTop")
        return "left";
      if (text == "rightBottom")
        return "bottomRight";
      if (text == "leftBottom")
        return "bottomLeft";
      if (text == "left" || text == "right" || text == "bottomLeft" || text == "bottomRight" || text == "top" || text == "bottom")
        return text;
      return "right";
    }
    function getOffset(index) {
      const offset = props.offset;
      if (offset == null || offset.length <= index)
        return 0;
      const value = offset[index];
      if (typeof value == "number")
        return value;
      if (typeof value == "string")
        return parseFloat(value);
      return 0;
    }
    function positionStyle() {
      const x = getOffset(0);
      const y = getOffset(1);
      const position = normalizePosition(props.position);
      const edge = 0;
      if (position == "left")
        return "left:" + (edge + x) + "px;top:" + (edge + y) + "px;";
      if (position == "bottomLeft")
        return "left:" + (edge + x) + "px;bottom:" + (edge - y) + "px;";
      if (position == "bottomRight")
        return "right:" + (edge - x) + "px;bottom:" + (edge - y) + "px;";
      if (position == "top")
        return "left:50%;top:" + (edge + y) + "px;transform:translateX(-50%);margin-left:" + x + "px;";
      if (position == "bottom")
        return "left:50%;bottom:" + (edge - y) + "px;transform:translateX(-50%);margin-left:" + x + "px;";
      return "right:" + (edge - x) + "px;top:" + (edge + y) + "px;";
    }
    function formatSize(value) {
      const text = value.toString();
      if (text.indexOf("px") >= 0 || text.indexOf("rpx") >= 0 || text.indexOf("%") >= 0)
        return text;
      return text + "px";
    }
    const bgColor = vue.computed(() => {
      return props.bgColor;
    });
    const showBadge = vue.computed(() => {
      if (props.hidden)
        return false;
      if (props.label.length > 0)
        return true;
      if (hasNumberValue()) {
        if (effectiveCount() == 0 && !props.showZero)
          return props.dot;
        return true;
      }
      return props.dot;
    });
    const displayValue = vue.computed(() => {
      if (props.label.length > 0)
        return props.label;
      const value = effectiveCount();
      const max = getMaxCount();
      if (value > max)
        return max + "+";
      return value.toString();
    });
    const dot = vue.computed(() => {
      if (props.label.length > 0)
        return false;
      if (hasNumberValue()) {
        if (effectiveCount() == 0 && !props.showZero)
          return props.dot;
        return false;
      }
      return props.dot;
    });
    const rootClass = vue.computed(() => {
      const classes = ["i-badge"];
      const position = normalizePosition(props.position);
      classes.push("i-badge--" + position);
      if (dot.value)
        classes.push("i-badge--dot");
      if (position == "left" || position == "bottomLeft")
        classes.push("i-badge--left-space");
      if (dot.value && (position == "left" || position == "bottomLeft")) {
        classes.push("i-badge--dot-left-space");
      }
      if (dot.value && (position == "bottomLeft" || position == "bottomRight" || position == "bottom")) {
        classes.push("i-badge--dot-bottom");
      }
      if (dot.value && position == "top")
        classes.push("i-badge--dot-top");
      return classes.join(" ");
    });
    const badgeClass = vue.computed(() => {
      const classes = ["i-badge__mark", "i-badge__mark--" + normalizeTheme(effectiveBgColor())];
      if (dot.value)
        classes.push("i-badge__mark--dot");
      classes.push("i-badge__mark--" + normalizePosition(props.position));
      return classes.join(" ");
    });
    const badgeStyle = vue.computed(() => {
      let style = positionStyle();
      const bgColor2 = parseColor(effectiveBgColor());
      if (bgColor2.length > 0)
        style = style + "background-color:" + bgColor2 + ";";
      return style;
    });
    const badgeTextStyle = vue.computed(() => {
      return "color:" + parseColor(effectiveFontColor()) + ";font-size:" + formatSize(props.fontSize) + ";";
    });
    function handleClick() {
      emit("click", new UTSJSONObject({
        label: props.label,
        count: effectiveCount(),
        value: displayValue.value,
        dot: dot.value,
        position: props.position
      }));
    }
    const __returned__ = { props, emit, hasNumberValue, effectiveCount, getMaxCount, effectiveBgColor, effectiveFontColor, normalizeTheme, parseColor, normalizePosition, getOffset, positionStyle, formatSize, bgColor, showBadge, displayValue, dot, rootClass, badgeClass, badgeStyle, badgeTextStyle, handleClick };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  } }));
  const _style_0$D = { "i-badge": { "": { "position": "relative", "alignSelf": "flex-start", "paddingTop": 10, "paddingRight": 12, "overflow": "visible" } }, "i-badge--left-space": { "": { "paddingLeft": 12, "paddingRight": 0 } }, "i-badge--dot": { "": { "paddingTop": 4, "paddingRight": 4 } }, "i-badge--dot-left-space": { "": { "paddingLeft": 4, "paddingRight": 0 } }, "i-badge--bottomLeft": { "": { "paddingTop": 0, "paddingBottom": 10 } }, "i-badge--bottomRight": { "": { "paddingTop": 0, "paddingBottom": 10 } }, "i-badge--bottom": { "": { "paddingTop": 0, "paddingBottom": 10 } }, "i-badge--dot-bottom": { "": { "paddingBottom": 4 } }, "i-badge--top": { "": { "paddingRight": 0 } }, "i-badge--dot-top": { "": { "paddingRight": 0 } }, "i-badge__mark": { "": { "position": "absolute", "zIndex": 2, "minWidth": 20, "height": 20, "paddingTop": 0, "paddingRight": 6, "paddingBottom": 0, "paddingLeft": 6, "borderTopLeftRadius": 10, "borderTopRightRadius": 10, "borderBottomRightRadius": 10, "borderBottomLeftRadius": 10, "flexDirection": "row", "alignItems": "center", "justifyContent": "center", "overflow": "visible" } }, "i-badge__mark--dot": { "": { "width": 8, "minWidth": 8, "height": 8, "paddingTop": 0, "paddingRight": 0, "paddingBottom": 0, "paddingLeft": 0, "borderTopLeftRadius": 4, "borderTopRightRadius": 4, "borderBottomRightRadius": 4, "borderBottomLeftRadius": 4 } }, "i-badge__mark--danger": { "": { "backgroundColor": "#f56c6c" } }, "i-badge__mark--error": { "": { "backgroundColor": "#f56c6c" } }, "i-badge__mark--primary": { "": { "backgroundColor": "#3c9cff" } }, "i-badge__mark--success": { "": { "backgroundColor": "#5ac725" } }, "i-badge__mark--warning": { "": { "backgroundColor": "#f9ae3d" } }, "i-badge__mark--info": { "": { "backgroundColor": "#909399" } }, "i-badge__text": { "": { "color": "#ffffff", "lineHeight": "20px", "whiteSpace": "nowrap" } } };
  function _sfc_render$D(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass($setup.rootClass)
      },
      [
        vue.renderSlot(_ctx.$slots, "default"),
        $setup.showBadge && $setup.dot ? (vue.openBlock(), vue.createElementBlock(
          "view",
          {
            key: 0,
            class: vue.normalizeClass($setup.badgeClass),
            style: vue.normalizeStyle($setup.badgeStyle),
            onClick: $setup.handleClick
          },
          null,
          6
          /* CLASS, STYLE */
        )) : $setup.showBadge ? (vue.openBlock(), vue.createElementBlock(
          "view",
          {
            key: 1,
            class: vue.normalizeClass($setup.badgeClass),
            style: vue.normalizeStyle($setup.badgeStyle),
            onClick: $setup.handleClick
          },
          [
            vue.createElementVNode(
              "text",
              {
                class: "i-badge__text",
                style: vue.normalizeStyle($setup.badgeTextStyle)
              },
              vue.toDisplayString($setup.displayValue),
              5
              /* TEXT, STYLE */
            )
          ],
          6
          /* CLASS, STYLE */
        )) : vue.createCommentVNode("v-if", true)
      ],
      2
      /* CLASS */
    );
  }
  const __easycom_2$4 = /* @__PURE__ */ _export_sfc(_sfc_main$E, [["render", _sfc_render$D], ["styles", [_style_0$D]], ["__file", "/Users/xyhc/Documents/carConnectInternet/uni_modules/i-ui-x/components/i-badge/i-badge.uvue"]]);
  const buttonWidth = 120;
  const buttonHeight = 200;
  const _sfc_main$D = /* @__PURE__ */ vue.defineComponent({
    __name: "userCenter",
    setup(__props, _a) {
      var __expose = _a.expose;
      __expose();
      const userInfo = vue.ref(new UTSJSONObject({
        avatar: "/static/avatar.png",
        nickname: ""
      }));
      const carsnumber = vue.ref(0);
      const Login = vue.ref(false);
      const version = vue.ref("");
      const moveX = vue.ref(0);
      const moveY = vue.ref(0);
      const windowWidth = vue.ref(0);
      const windowHeight = vue.ref(0);
      const loadData = () => {
        return __awaiter(this, void 0, void 0, function* () {
          const params = new UTSJSONObject({});
          const res = yield getUserInfo();
          userInfo.value = {
            avatar: res.data.getString("avatar", "/static/avatar.png"),
            nickname: res.data.getString("nickname", "")
          };
          const resCars = yield getUserDeviceList(params);
          carsnumber.value = resCars.data.totalCount;
        });
      };
      vue.onShow(() => {
        const systemInfo = uni.getSystemInfoSync();
        windowWidth.value = systemInfo.windowWidth;
        windowHeight.value = systemInfo.windowHeight;
        moveX.value = windowWidth.value - buttonWidth - 20;
        moveY.value = windowHeight.value - buttonHeight - 20;
        const token = uni.getStorageSync("token");
        if (token) {
          Login.value = true;
          loadData();
        } else {
          Login.value = false;
        }
      });
      const contactCustomerService = () => {
        showAppToast({
          title: "请在微信小程序中联系人工客服",
          icon: "none"
        });
      };
      const onMoveChange = (e) => {
        const detail = e.getJSON("detail");
        const x = detail != null ? detail.getNumber("x", 0) : 0;
        const y = detail != null ? detail.getNumber("y", 0) : 0;
        const maxX = windowWidth.value - buttonWidth;
        const maxY = windowHeight.value - buttonHeight;
        if (x < 0 || x > maxX || y < 0 || y > maxY) {
          moveX.value = Math.max(0, Math.min(maxX, x));
          moveY.value = Math.max(0, Math.min(maxY, y));
        }
      };
      const userInfoDetail = () => {
        if (Login.value) {
          uni.navigateTo({
            url: "/pages/userCenter/userInfo/userInfo?userInfo=" + encodeURIComponent(UTS.JSON.stringify(userInfo.value))
          });
        } else {
          uni.navigateTo({
            url: "/pages/login/login"
          });
        }
      };
      const carList = () => {
        if (Login.value) {
          uni.navigateTo({
            url: "/pages/userCenter/carList/carList"
          });
        } else {
          showAppToast({
            title: "请先登录",
            icon: "none"
          });
        }
      };
      const platformRenewal = () => {
        if (Login.value) {
          uni.navigateTo({
            url: "/pages/userCenter/payDeviceList/payDeviceList"
          });
        } else {
          showAppToast({
            title: "请先登录",
            icon: "none"
          });
        }
      };
      const productMall = () => {
        if (Login.value) {
          uni.navigateTo({
            url: "/pages/webview/webview?url=" + encodeURIComponent("https://shop.zdiot.cn/")
          });
        } else {
          showAppToast({
            title: "请先登录",
            icon: "none"
          });
        }
      };
      const __returned__ = { userInfo, carsnumber, Login, version, moveX, moveY, windowWidth, windowHeight, buttonWidth, buttonHeight, loadData, contactCustomerService, onMoveChange, userInfoDetail, carList, platformRenewal, productMall };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  const _style_0$C = { "container": { "": { "width": "100%", "height": "100%", "backgroundColor": "#ffffff", "position": "relative" } }, "user-info-box": { ".container ": { "width": "100%", "paddingTop": "40rpx", "paddingRight": "60rpx", "paddingBottom": "40rpx", "paddingLeft": "60rpx", "display": "flex", "flexDirection": "row", "justifyContent": "space-between", "alignItems": "center" } }, "userinfo": { ".container .user-info-box ": { "display": "flex", "flexDirection": "row", "justifyContent": "flex-start", "alignItems": "center", "flexGrow": 1, "flexShrink": 1, "flexBasis": "0%" } }, "user-info": { ".container .user-info-box ": { "marginLeft": "20rpx", "textAlign": "center", "fontSize": "30rpx", "color": "#333333" } }, "list": { ".container ": { "backgroundColor": "#f5f5f5", "paddingTop": "30rpx", "paddingRight": "30rpx", "paddingBottom": "30rpx", "paddingLeft": "30rpx", "borderTopLeftRadius": "20rpx", "borderTopRightRadius": "20rpx", "borderBottomRightRadius": "20rpx", "borderBottomLeftRadius": "20rpx", "marginTop": "15rpx", "marginRight": "15rpx", "marginBottom": "15rpx", "marginLeft": "15rpx", "display": "flex", "flexDirection": "row", "justifyContent": "space-between", "alignItems": "center", "fontSize": "25rpx" } }, "left": { ".container .list ": { "display": "flex", "flexDirection": "row", "justifyContent": "space-between", "alignItems": "center" } }, "badge": { ".container .list .left ": { "marginLeft": "20rpx" } }, "version": { ".container ": { "position": "fixed", "bottom": "50rpx", "left": "20rpx", "right": "20rpx", "textAlign": "center", "fontSize": "25rpx", "color": "#c3c2c2ff", "marginTop": "20rpx", "marginRight": "40rpx", "marginBottom": 0, "marginLeft": "40rpx" } }, "movable-area": { ".container ": { "position": "fixed", "top": 0, "left": 0, "right": 0, "bottom": 0, "width": "100%", "height": "100%", "pointerEvents": "none", "zIndex": 999 } } };
  function _sfc_render$C(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_custom_navBar = resolveEasycom(vue.resolveDynamicComponent("custom-navBar"), __easycom_0$5);
    const _component_i_icon = resolveEasycom(vue.resolveDynamicComponent("i-icon"), __easycom_2$6);
    const _component_i_badge = resolveEasycom(vue.resolveDynamicComponent("i-badge"), __easycom_2$4);
    const _component_movable_view = vue.resolveComponent("movable-view");
    const _component_movable_area = vue.resolveComponent("movable-area");
    const _component_app_toast = resolveEasycom(vue.resolveDynamicComponent("app-toast"), __easycom_3$3);
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.createElementVNode("view", { class: "container" }, [
          vue.createVNode(_component_custom_navBar, {
            title: "个人中心",
            "show-back": false,
            backgroundColor: "#fff",
            textColor: "#333",
            showCapsule: false
          }),
          vue.createElementVNode("view", {
            class: "user-info-box",
            onClick: $setup.userInfoDetail
          }, [
            vue.createElementVNode("view", { class: "userinfo" }, [
              vue.createElementVNode("view", null, [
                vue.createVNode(_component_i_icon, {
                  name: "/static/avatar.png",
                  fontSize: "40"
                })
              ]),
              vue.createElementVNode("view", { class: "user-info" }, [
                $setup.Login ? (vue.openBlock(), vue.createElementBlock(
                  "text",
                  { key: 0 },
                  vue.toDisplayString($setup.userInfo.mobile),
                  1
                  /* TEXT */
                )) : (vue.openBlock(), vue.createElementBlock("text", { key: 1 }, "点击登录"))
              ])
            ]),
            vue.createVNode(_component_i_icon, {
              name: "/static/arrow-right.png",
              fontSize: "15"
            })
          ]),
          $setup.Login ? (vue.openBlock(), vue.createElementBlock("view", { key: 0 }, [
            vue.createElementVNode("view", {
              class: "list",
              onClick: $setup.carList
            }, [
              vue.createElementVNode("view", { class: "left" }, [
                vue.createElementVNode("text", null, "我的车辆"),
                vue.createElementVNode("text", { class: "badge" }, [
                  vue.createVNode(_component_i_badge, {
                    type: "danger",
                    maxCount: "99",
                    count: $setup.carsnumber
                  }, null, 8, ["count"])
                ])
              ]),
              vue.createVNode(_component_i_icon, {
                name: "/static/arrow-right.png",
                fontSize: "15"
              })
            ]),
            vue.createElementVNode("view", {
              class: "list",
              onClick: $setup.platformRenewal
            }, "平台续费")
          ])) : vue.createCommentVNode("v-if", true),
          $setup.version ? (vue.openBlock(), vue.createElementBlock(
            "view",
            {
              key: 1,
              class: "version"
            },
            "当前版本：" + vue.toDisplayString($setup.version),
            1
            /* TEXT */
          )) : vue.createCommentVNode("v-if", true),
          vue.createVNode(_component_movable_area, { class: "movable-area" }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_movable_view, {
                class: "movable-view",
                direction: "all",
                x: $setup.moveX,
                y: $setup.moveY,
                onChange: $setup.onMoveChange
              }, {
                default: vue.withCtx(() => [
                  vue.createElementVNode("view", {
                    class: "contact-button-movable",
                    onClick: $setup.contactCustomerService
                  }, [
                    vue.createVNode(_component_i_icon, {
                      name: "/static/server-man.png",
                      fontSize: "20"
                    }),
                    vue.createElementVNode("text", { class: "contact-text" }, "人工客服"),
                    vue.createElementVNode("text", { class: "contact-text" }, "08:00-24:00")
                  ])
                ]),
                _: 1
                /* STABLE */
              }, 8, ["x", "y"])
            ]),
            _: 1
            /* STABLE */
          })
        ]),
        vue.createVNode(_component_app_toast)
      ],
      64
      /* STABLE_FRAGMENT */
    );
  }
  const PagesUserCenterUserCenter = /* @__PURE__ */ _export_sfc(_sfc_main$D, [["render", _sfc_render$C], ["styles", [_style_0$C]], ["__file", "/Users/xyhc/Documents/carConnectInternet/pages/userCenter/userCenter.uvue"]]);
  const _sfc_main$C = /* @__PURE__ */ vue.defineComponent(Object.assign({ name: "i-input" }, { __name: "i-input", props: {
    modelValue: {
      type: String,
      default: ""
    },
    value: {
      type: String,
      default: ""
    },
    type: {
      type: String,
      default: "text"
    },
    height: {
      type: String,
      default: "40px"
    },
    disabled: {
      type: Boolean,
      default: false
    },
    disabledColor: {
      type: String,
      default: "#f5f7fa"
    },
    clearable: {
      type: Boolean,
      default: false
    },
    password: {
      type: Boolean,
      default: false
    },
    showPasswordToggle: {
      type: Boolean,
      default: true
    },
    maxlength: {
      type: Number,
      default: -1
    },
    placeholder: {
      type: String,
      default: ""
    },
    placeholderClass: {
      type: String,
      default: "input-placeholder"
    },
    placeholderStyle: {
      type: String,
      default: ""
    },
    showWordLimit: {
      type: Boolean,
      default: false
    },
    confirmType: {
      type: String,
      default: "done"
    },
    confirmHold: {
      type: Boolean,
      default: false
    },
    focus: {
      type: Boolean,
      default: false
    },
    cursor: {
      type: Number,
      default: -1
    },
    cursorSpacing: {
      type: Number,
      default: 30
    },
    selectionStart: {
      type: Number,
      default: -1
    },
    selectionEnd: {
      type: Number,
      default: -1
    },
    adjustPosition: {
      type: Boolean,
      default: true
    },
    inputAlign: {
      type: String,
      default: "left"
    },
    fontSize: {
      type: String,
      default: "15px"
    },
    color: {
      type: String,
      default: "#303133"
    },
    prefiicon: {
      type: String,
      default: ""
    },
    prefiiconStyle: {
      type: String,
      default: ""
    },
    suffiicon: {
      type: String,
      default: ""
    },
    suffiiconStyle: {
      type: String,
      default: ""
    },
    border: {
      type: String,
      default: "surround"
    },
    readonly: {
      type: Boolean,
      default: false
    },
    shape: {
      type: String,
      default: "square"
    },
    customStyle: {
      type: String,
      default: ""
    },
    round: {
      type: String,
      default: "4px"
    },
    borderColor: {
      type: String,
      default: "#e5e5e5"
    },
    bgColor: {
      type: String,
      default: "#ffffff"
    },
    inputmode: {
      type: String,
      default: "text"
    },
    prefix: {
      type: String,
      default: ""
    }
  }, emits: [
    "update:modelValue",
    "update:value",
    "input",
    "change",
    "focus",
    "blur",
    "confirm",
    "keyboardheightchange",
    "clear"
  ], setup(__props, _a) {
    var __expose = _a.expose, __emit = _a.emit;
    const props = __props;
    const emit = __emit;
    function initialValue() {
      const modelValue = props.modelValue;
      if (modelValue.length > 0)
        return modelValue;
      return props.value;
    }
    function formatSize(value) {
      if (value.indexOf("px") >= 0 || value.indexOf("rpx") >= 0 || value.indexOf("%") >= 0) {
        return value;
      }
      return value + "px";
    }
    const inputBgColor = vue.computed(() => {
      return props.bgColor;
    });
    const current = vue.ref(initialValue());
    const focused = vue.ref(false);
    const passwordVisible = vue.ref(props.password);
    const wrapClass = vue.computed(() => {
      const classes = ["i-input"];
      if (props.disabled)
        classes.push("i-input--disabled");
      if (focused.value && !props.disabled)
        classes.push("i-input--focus");
      if (props.shape == "circle")
        classes.push("i-input--circle");
      return classes.join(" ");
    });
    const wrapStyle = vue.computed(() => {
      let style = "min-height:" + formatSize(props.height) + ";background-color:" + (props.disabled ? props.disabledColor : inputBgColor.value) + ";border-radius:" + (props.shape == "circle" ? formatSize(props.height) : props.round) + ";";
      if (props.border == "surround") {
        style += "border-width:1px;border-style:solid;border-color:" + props.borderColor + ";";
      }
      if (props.border == "bottom") {
        style += "border-bottom-width:1px;border-bottom-style:solid;border-bottom-color:" + props.borderColor + ";";
      }
      return style + props.customStyle;
    });
    const fieldStyle = vue.computed(() => {
      return "height:" + formatSize(props.height) + ";color:" + props.color + ";font-size:" + formatSize(props.fontSize) + ";text-align:" + props.inputAlign + ";";
    });
    const placeholderStyleText = vue.computed(() => {
      if (props.placeholderStyle.length > 0)
        return props.placeholderStyle;
      return "color:#c0c4cc;";
    });
    function emitValue(value) {
      emit("update:modelValue", value);
      emit("update:value", value);
      emit("input", value);
      emit("change", value);
    }
    function handleInput(event) {
      const nextValue = event.detail.value;
      if (props.readonly) {
        current.value = initialValue();
        return null;
      }
      current.value = nextValue;
      emitValue(nextValue);
    }
    function handleFocus(event) {
      focused.value = true;
      emit("focus", event);
    }
    function handleBlur(event) {
      focused.value = false;
      emit("blur", event);
    }
    function handleConfirm(event) {
      emit("confirm", event.detail.value);
    }
    function handleKeyboardHeightChange(event) {
      emit("keyboardheightchange", event);
    }
    function clear() {
      current.value = "";
      emitValue("");
      emit("clear");
    }
    function togglePassword() {
      passwordVisible.value = !passwordVisible.value;
    }
    __expose({
      setFormatter() {
      }
    });
    const __returned__ = { props, emit, initialValue, formatSize, inputBgColor, current, focused, passwordVisible, wrapClass, wrapStyle, fieldStyle, placeholderStyleText, emitValue, handleInput, handleFocus, handleBlur, handleConfirm, handleKeyboardHeightChange, clear, togglePassword };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  } }));
  const _style_0$B = { "i-input": { "": { "paddingTop": 0, "paddingRight": 12, "paddingBottom": 0, "paddingLeft": 12, "flexDirection": "row", "alignItems": "center" } }, "i-input--disabled": { "": { "opacity": 0.76 } }, "i-input--focus": { "": { "borderTopColor": "#3c9cff", "borderRightColor": "#3c9cff", "borderBottomColor": "#3c9cff", "borderLeftColor": "#3c9cff" } }, "i-input__prefix": { "": { "color": "#606266", "fontSize": 14, "lineHeight": "22px", "marginRight": 8 } }, "i-input__suffix": { "": { "color": "#606266", "fontSize": 14, "lineHeight": "22px", "marginLeft": 8 } }, "i-input__clear": { "": { "marginLeft": 8, "color": "#c0c4cc", "fontSize": 16, "lineHeight": "22px" } }, "i-input__eye": { "": { "marginLeft": 8, "color": "#c0c4cc", "fontSize": 16, "lineHeight": "22px" } }, "i-input__count": { "": { "marginLeft": 8, "color": "#c0c4cc", "fontSize": 12, "lineHeight": "18px" } }, "i-input__field": { "": { "flexGrow": 1, "flexShrink": 1, "flexBasis": "0%", "minWidth": 0 } } };
  function _sfc_render$B(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass($setup.wrapClass),
        style: vue.normalizeStyle($setup.wrapStyle)
      },
      [
        vue.renderSlot(_ctx.$slots, "prefix", {}, () => [
          $props.prefiicon.length > 0 || $props.prefix.length > 0 ? (vue.openBlock(), vue.createElementBlock(
            "text",
            {
              key: 0,
              class: "i-input__prefix",
              style: vue.normalizeStyle($props.prefiiconStyle)
            },
            vue.toDisplayString($props.prefix.length > 0 ? $props.prefix : $props.prefiicon),
            5
            /* TEXT, STYLE */
          )) : vue.createCommentVNode("v-if", true)
        ]),
        vue.createElementVNode("input", {
          class: "i-input__field",
          style: vue.normalizeStyle($setup.fieldStyle),
          type: $props.type,
          value: $setup.current,
          placeholder: $props.placeholder,
          "placeholder-class": $props.placeholderClass,
          "placeholder-style": $setup.placeholderStyleText,
          password: $setup.passwordVisible,
          disabled: $props.disabled,
          maxlength: $props.maxlength,
          "confirm-type": $props.confirmType,
          "confirm-hold": $props.confirmHold,
          inputmode: $props.inputmode,
          focus: $props.focus,
          cursor: $props.cursor,
          "cursor-spacing": $props.cursorSpacing,
          "selection-start": $props.selectionStart,
          "selection-end": $props.selectionEnd,
          "adjust-position": $props.adjustPosition,
          onInput: $setup.handleInput,
          onFocus: $setup.handleFocus,
          onBlur: $setup.handleBlur,
          onConfirm: $setup.handleConfirm,
          onKeyboardheightchange: $setup.handleKeyboardHeightChange
        }, null, 44, ["type", "value", "placeholder", "placeholder-class", "placeholder-style", "password", "disabled", "maxlength", "confirm-type", "confirm-hold", "inputmode", "focus", "cursor", "cursor-spacing", "selection-start", "selection-end", "adjust-position"]),
        $props.showWordLimit ? (vue.openBlock(), vue.createElementBlock(
          "text",
          {
            key: 0,
            class: "i-input__count"
          },
          vue.toDisplayString($setup.current.length) + "/" + vue.toDisplayString($props.maxlength),
          1
          /* TEXT */
        )) : vue.createCommentVNode("v-if", true),
        $props.clearable && $setup.current.length > 0 && !$props.disabled && !$props.readonly ? (vue.openBlock(), vue.createElementBlock("text", {
          key: 1,
          class: "i-input__clear",
          onClick: $setup.clear
        }, " × ")) : vue.createCommentVNode("v-if", true),
        $props.password && $props.showPasswordToggle ? (vue.openBlock(), vue.createElementBlock(
          "text",
          {
            key: 2,
            class: "i-input__eye",
            onClick: $setup.togglePassword
          },
          vue.toDisplayString($setup.passwordVisible ? "show" : "hide"),
          1
          /* TEXT */
        )) : vue.createCommentVNode("v-if", true),
        vue.renderSlot(_ctx.$slots, "suffix", {}, () => [
          $props.suffiicon.length > 0 ? (vue.openBlock(), vue.createElementBlock(
            "text",
            {
              key: 0,
              class: "i-input__suffix",
              style: vue.normalizeStyle($props.suffiiconStyle)
            },
            vue.toDisplayString($props.suffiicon),
            5
            /* TEXT, STYLE */
          )) : vue.createCommentVNode("v-if", true)
        ])
      ],
      6
      /* CLASS, STYLE */
    );
  }
  const __easycom_1$2 = /* @__PURE__ */ _export_sfc(_sfc_main$C, [["render", _sfc_render$B], ["styles", [_style_0$B]], ["__file", "/Users/xyhc/Documents/carConnectInternet/uni_modules/i-ui-x/components/i-input/i-input.uvue"]]);
  const _sfc_main$B = /* @__PURE__ */ vue.defineComponent(Object.assign({ name: "i-form-item" }, { __name: "i-form-item", props: {
    name: {
      type: String,
      default: ""
    },
    label: {
      type: String,
      default: ""
    },
    hint: {
      type: String,
      default: ""
    },
    error: {
      type: String,
      default: ""
    },
    required: {
      type: Boolean,
      default: false
    },
    scrollId: {
      type: String,
      default: ""
    },
    scrollIdPrefix: {
      type: String,
      default: "i-form-item-"
    },
    labelWidth: {
      type: [String, Number],
      default: "100px"
    },
    labelDirection: {
      type: String,
      default: "vertical"
    },
    labelFontColor: {
      type: String,
      default: "#303133"
    },
    labelFontSize: {
      type: [String, Number],
      default: "14px"
    },
    showLabel: {
      type: Boolean,
      default: true
    },
    errorAlign: {
      type: String,
      default: "left"
    }
  }, emits: [], setup(__props, _a) {
    var __expose = _a.expose, __emit = _a.emit;
    __expose();
    const props = __props;
    const emit = __emit;
    function formatSize(value) {
      const text = value.toString();
      if (text.indexOf("px") >= 0 || text.indexOf("rpx") >= 0 || text.indexOf("%") >= 0) {
        return text;
      }
      return text + "px";
    }
    function normalizeIdName(name) {
      let result = "";
      for (let i = 0; i < name.length; i++) {
        const char = name.charAt(i);
        const isNumber2 = char >= "0" && char <= "9";
        const isUpper = char >= "A" && char <= "Z";
        const isLower = char >= "a" && char <= "z";
        if (isNumber2 || isUpper || isLower || char == "-" || char == "_") {
          result = result + char;
        } else {
          result = result + "-";
        }
      }
      return result;
    }
    const itemId = vue.computed(() => {
      if (props.scrollId.length > 0)
        return props.scrollId;
      if (props.name.length == 0)
        return "";
      return props.scrollIdPrefix + normalizeIdName(props.name);
    });
    const itemClass = vue.computed(() => {
      const classes = ["i-form-item"];
      if (props.labelDirection == "horizontal")
        classes.push("i-form-item--horizontal");
      return classes.join(" ");
    });
    const headerClass = vue.computed(() => {
      const classes = ["i-form-item__header"];
      if (props.labelDirection == "horizontal")
        classes.push("i-form-item__header--horizontal");
      return classes.join(" ");
    });
    const contentClass = vue.computed(() => {
      const classes = ["i-form-item__content"];
      if (props.labelDirection == "horizontal")
        classes.push("i-form-item__content--horizontal");
      return classes.join(" ");
    });
    const headerStyle = vue.computed(() => {
      if (props.labelDirection != "horizontal")
        return "";
      return "width:" + formatSize(props.labelWidth) + ";";
    });
    const labelStyle = vue.computed(() => {
      return "color:" + props.labelFontColor + ";font-size:" + formatSize(props.labelFontSize) + ";";
    });
    const footerStyle = vue.computed(() => {
      return "text-align:" + props.errorAlign + ";";
    });
    const __returned__ = { props, emit, formatSize, normalizeIdName, itemId, itemClass, headerClass, contentClass, headerStyle, labelStyle, footerStyle };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  } }));
  const _style_0$A = { "i-form-item": { "": { "paddingTop": 12, "paddingRight": 14, "paddingBottom": 12, "paddingLeft": 14, "borderTopLeftRadius": 8, "borderTopRightRadius": 8, "borderBottomRightRadius": 8, "borderBottomLeftRadius": 8, "backgroundColor": "#ffffff" } }, "i-form-item--horizontal": { "": { "flexDirection": "row", "alignItems": "flex-start" } }, "i-form-item__header": { "": { "flexDirection": "row", "alignItems": "center" } }, "i-form-item__header--horizontal": { "": { "minHeight": 40 } }, "i-form-item__required": { "": { "marginRight": 4, "color": "#fa3534", "fontSize": 14, "lineHeight": "22px" } }, "i-form-item__label": { "": { "color": "#303133", "fontSize": 14, "fontWeight": 600, "lineHeight": "22px" } }, "i-form-item__content": { "": { "marginTop": 8 } }, "i-form-item__content--horizontal": { "": { "marginTop": 0 } }, "i-form-item__body": { "": { "flexGrow": 1, "flexShrink": 1, "flexBasis": "0%" } }, "i-form-item__hint": { "": { "marginTop": 6, "color": "#909399", "fontSize": 12, "lineHeight": "18px" } }, "i-form-item__error": { "": { "marginTop": 6, "color": "#fa3534", "fontSize": 12, "lineHeight": "18px" } } };
  function _sfc_render$A(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", {
      id: $setup.itemId,
      class: vue.normalizeClass($setup.itemClass)
    }, [
      $props.showLabel ? (vue.openBlock(), vue.createElementBlock(
        "view",
        {
          key: 0,
          class: vue.normalizeClass($setup.headerClass),
          style: vue.normalizeStyle($setup.headerStyle)
        },
        [
          $props.required ? (vue.openBlock(), vue.createElementBlock("text", {
            key: 0,
            class: "i-form-item__required"
          }, "*")) : vue.createCommentVNode("v-if", true),
          vue.createElementVNode(
            "text",
            {
              class: "i-form-item__label",
              style: vue.normalizeStyle($setup.labelStyle)
            },
            vue.toDisplayString($props.label),
            5
            /* TEXT, STYLE */
          )
        ],
        6
        /* CLASS, STYLE */
      )) : vue.createCommentVNode("v-if", true),
      vue.createElementVNode("view", { class: "i-form-item__body" }, [
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass($setup.contentClass)
          },
          [
            vue.renderSlot(_ctx.$slots, "default")
          ],
          2
          /* CLASS */
        ),
        $props.error.length > 0 ? (vue.openBlock(), vue.createElementBlock(
          "text",
          {
            key: 0,
            class: "i-form-item__error",
            style: vue.normalizeStyle($setup.footerStyle)
          },
          vue.toDisplayString($props.error),
          5
          /* TEXT, STYLE */
        )) : $props.hint.length > 0 ? (vue.openBlock(), vue.createElementBlock(
          "text",
          {
            key: 1,
            class: "i-form-item__hint",
            style: vue.normalizeStyle($setup.footerStyle)
          },
          vue.toDisplayString($props.hint),
          5
          /* TEXT, STYLE */
        )) : vue.createCommentVNode("v-if", true)
      ])
    ], 10, ["id"]);
  }
  const __easycom_2$3 = /* @__PURE__ */ _export_sfc(_sfc_main$B, [["render", _sfc_render$A], ["styles", [_style_0$A]], ["__file", "/Users/xyhc/Documents/carConnectInternet/uni_modules/i-ui-x/components/i-form-item/i-form-item.uvue"]]);
  const _sfc_main$A = /* @__PURE__ */ vue.defineComponent(Object.assign({ name: "i-checkbox" }, { __name: "i-checkbox", props: {
    name: {
      type: [String, Number],
      default: ""
    },
    modelValue: {
      type: [Array, Boolean, String, Number],
      default: false
    },
    value: {
      type: [Array, Boolean, String, Number],
      default: false
    },
    checked: {
      type: Boolean,
      default: false
    },
    shape: {
      type: String,
      default: "square"
    },
    disabled: {
      type: Boolean,
      default: false
    },
    activeColor: {
      type: String,
      default: "#2979ff"
    },
    inactiveColor: {
      type: String,
      default: "#dcdfe6"
    },
    size: {
      type: [String, Number],
      default: 20
    },
    placement: {
      type: String,
      default: "row"
    },
    label: {
      type: String,
      default: ""
    },
    labelSize: {
      type: [String, Number],
      default: 14
    },
    labelColor: {
      type: String,
      default: "#303133"
    },
    labelDisabled: {
      type: Boolean,
      default: false
    },
    iconColor: {
      type: String,
      default: "#ffffff"
    },
    iconSize: {
      type: [String, Number],
      default: 14
    },
    iconPlacement: {
      type: String,
      default: "left"
    },
    borderBottom: {
      type: Boolean,
      default: false
    },
    activeLabelColor: {
      type: String,
      default: ""
    },
    plain: {
      type: Boolean,
      default: true
    }
  }, emits: ["change", "update:modelValue", "update:value", "update:checked"], setup(__props, _a) {
    var __expose = _a.expose, __emit = _a.emit;
    __expose();
    const props = __props;
    const emit = __emit;
    function formatSize(value) {
      const text = value.toString();
      if (text.indexOf("px") >= 0 || text.indexOf("rpx") >= 0 || text.indexOf("%") >= 0) {
        return text;
      }
      return text + "px";
    }
    function valueText(value = null) {
      if (typeof value == "string")
        return value;
      if (typeof value == "number" || typeof value == "boolean")
        return value.toString();
      return "";
    }
    function isChecked() {
      if (props.checked)
        return true;
      const modelValue = props.modelValue;
      const value = valueText(modelValue).length > 0 ? modelValue : props.value;
      if (Array.isArray(value)) {
        const names2 = value;
        for (let i = 0; i < names2.length; i++) {
          if (valueText(names2[i]) == valueText(props.name))
            return true;
        }
        return false;
      }
      if (typeof value == "boolean")
        return value;
      return valueText(value) == valueText(props.name);
    }
    const internalChecked = vue.ref(isChecked());
    const checked = vue.computed(() => {
      return internalChecked.value;
    });
    const wrapClass = vue.computed(() => {
      const classes = ["i-checkbox"];
      if (props.placement == "column")
        classes.push("i-checkbox--column");
      if (props.iconPlacement == "right")
        classes.push("i-checkbox--right");
      if (props.shape == "button")
        classes.push("i-checkbox--button");
      if (props.plain && props.shape == "button")
        classes.push("i-checkbox--plain");
      if (checked.value)
        classes.push("i-checkbox--checked");
      if (props.shape == "button" && checked.value)
        classes.push("i-checkbox--button-checked");
      if (props.shape == "button" && props.plain && checked.value) {
        classes.push("i-checkbox--button-plain-checked");
      }
      if (props.disabled)
        classes.push("i-checkbox--disabled");
      if (props.borderBottom)
        classes.push("i-checkbox--border");
      return classes.join(" ");
    });
    const labelClass = vue.computed(() => {
      const classes = ["i-checkbox__label"];
      if (props.shape == "button")
        classes.push("i-checkbox__label--button");
      return classes.join(" ");
    });
    const boxStyle = vue.computed(() => {
      return "width:" + formatSize(props.size) + ";height:" + formatSize(props.size) + ";border-radius:" + (props.shape == "circle" ? formatSize(props.size) : "4px") + ";border-color:" + (checked.value ? props.activeColor : props.inactiveColor) + ";background-color:" + (checked.value && props.shape != "check" ? props.activeColor : "transparent") + ";";
    });
    const markStyle = vue.computed(() => {
      return "color:" + props.iconColor + ";font-size:" + formatSize(props.iconSize) + ";";
    });
    const labelStyle = vue.computed(() => {
      let color = props.labelColor;
      if (checked.value && props.activeLabelColor.length > 0)
        color = props.activeLabelColor;
      return "color:" + color + ";font-size:" + formatSize(props.labelSize) + ";";
    });
    vue.watch(() => {
      return props.modelValue;
    }, () => {
      internalChecked.value = isChecked();
    });
    vue.watch(() => {
      return props.value;
    }, () => {
      internalChecked.value = isChecked();
    });
    vue.watch(() => {
      return props.checked;
    }, () => {
      internalChecked.value = isChecked();
    });
    function buildValue(nextChecked, previousChecked) {
      const modelValue = props.modelValue;
      const value = valueText(modelValue).length > 0 ? modelValue : props.value;
      if (Array.isArray(value)) {
        const list = value;
        const nextList = list.slice(0);
        const exists = previousChecked;
        if (nextChecked && !exists)
          nextList.push(props.name);
        if (!nextChecked && exists) {
          const filtered = [];
          for (let i = 0; i < nextList.length; i++) {
            if (valueText(nextList[i]) != valueText(props.name))
              filtered.push(nextList[i]);
          }
          return filtered;
        }
        return nextList;
      }
      return nextChecked;
    }
    function updateChecked(nextChecked) {
      const previousChecked = checked.value;
      internalChecked.value = nextChecked;
      const nextValue = buildValue(nextChecked, previousChecked);
      emit("update:checked", nextChecked);
      emit("update:modelValue", nextValue);
      emit("update:value", nextValue);
      emit("change", nextValue);
    }
    function toggle() {
      if (props.disabled)
        return null;
      updateChecked(!checked.value);
    }
    function toggleByLabel() {
      if (props.labelDisabled)
        return null;
      toggle();
    }
    const __returned__ = { props, emit, formatSize, valueText, isChecked, internalChecked, checked, wrapClass, labelClass, boxStyle, markStyle, labelStyle, buildValue, updateChecked, toggle, toggleByLabel };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  } }));
  const _style_0$z = { "i-checkbox": { "": { "minHeight": 32, "flexDirection": "row", "alignItems": "center" } }, "i-checkbox--right": { "": { "flexDirection": "row-reverse", "justifyContent": "space-between" } }, "i-checkbox--button": { "": { "minWidth": 64, "minHeight": 34, "paddingTop": 7, "paddingRight": 12, "paddingBottom": 7, "paddingLeft": 12, "borderTopLeftRadius": 6, "borderTopRightRadius": 6, "borderBottomRightRadius": 6, "borderBottomLeftRadius": 6, "borderTopWidth": 1, "borderRightWidth": 1, "borderBottomWidth": 1, "borderLeftWidth": 1, "borderTopStyle": "solid", "borderRightStyle": "solid", "borderBottomStyle": "solid", "borderLeftStyle": "solid", "borderTopColor": "#dcdfe6", "borderRightColor": "#dcdfe6", "borderBottomColor": "#dcdfe6", "borderLeftColor": "#dcdfe6", "alignItems": "center", "justifyContent": "center" } }, "i-checkbox--button-checked": { "": { "borderTopColor": "#2979ff", "borderRightColor": "#2979ff", "borderBottomColor": "#2979ff", "borderLeftColor": "#2979ff", "backgroundColor": "#ecf5ff" } }, "i-checkbox--button-plain-checked": { "": { "backgroundColor": "#ffffff" } }, "i-checkbox--disabled": { "": { "opacity": 0.5 } }, "i-checkbox--border": { "": { "borderBottomWidth": 1, "borderBottomStyle": "solid", "borderBottomColor": "#eef0f4" } }, "i-checkbox__box": { "": { "borderTopWidth": 1, "borderRightWidth": 1, "borderBottomWidth": 1, "borderLeftWidth": 1, "borderTopStyle": "solid", "borderRightStyle": "solid", "borderBottomStyle": "solid", "borderLeftStyle": "solid", "alignItems": "center", "justifyContent": "center" } }, "i-checkbox__mark": { "": { "lineHeight": "18px" } }, "i-checkbox__label": { "": { "marginLeft": 8, "lineHeight": "22px" } }, "i-checkbox__label--button": { "": { "marginLeft": 0, "textAlign": "center" } } };
  function _sfc_render$z(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass($setup.wrapClass),
        onClick: $setup.toggle
      },
      [
        vue.renderSlot(_ctx.$slots, "icon", { checked: $setup.checked }, () => [
          $props.shape != "button" ? (vue.openBlock(), vue.createElementBlock(
            "view",
            {
              key: 0,
              class: "i-checkbox__box",
              style: vue.normalizeStyle($setup.boxStyle)
            },
            [
              $setup.checked ? (vue.openBlock(), vue.createElementBlock(
                "text",
                {
                  key: 0,
                  class: "i-checkbox__mark",
                  style: vue.normalizeStyle($setup.markStyle)
                },
                "✓",
                4
                /* STYLE */
              )) : vue.createCommentVNode("v-if", true)
            ],
            4
            /* STYLE */
          )) : vue.createCommentVNode("v-if", true)
        ]),
        vue.renderSlot(_ctx.$slots, "default", { checked: $setup.checked }, () => [
          vue.createElementVNode(
            "text",
            {
              class: vue.normalizeClass($setup.labelClass),
              style: vue.normalizeStyle($setup.labelStyle),
              onClick: vue.withModifiers($setup.toggleByLabel, ["stop"])
            },
            vue.toDisplayString($props.label),
            7
            /* TEXT, CLASS, STYLE */
          )
        ])
      ],
      2
      /* CLASS */
    );
  }
  const __easycom_3$2 = /* @__PURE__ */ _export_sfc(_sfc_main$A, [["render", _sfc_render$z], ["styles", [_style_0$z]], ["__file", "/Users/xyhc/Documents/carConnectInternet/uni_modules/i-ui-x/components/i-checkbox/i-checkbox.uvue"]]);
  const _sfc_main$z = /* @__PURE__ */ vue.defineComponent(Object.assign({ name: "i-button" }, { __name: "i-button", props: {
    hairline: {
      type: Boolean,
      default: true
    },
    type: {
      type: String,
      default: "default"
    },
    size: {
      type: String,
      default: "normal"
    },
    block: {
      type: Boolean,
      default: false
    },
    shape: {
      type: String,
      default: "square"
    },
    plain: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    round: {
      type: [String, Number],
      default: "4px"
    },
    loading: {
      type: Boolean,
      default: false
    },
    loadingMode: {
      type: String,
      default: "spinner"
    },
    loadingSize: {
      type: [String, Number],
      default: 15
    },
    openType: {
      type: String,
      default: ""
    },
    formType: {
      type: String,
      default: ""
    },
    appParameter: {
      type: String,
      default: ""
    },
    hoverStopPropagation: {
      type: Boolean,
      default: true
    },
    lang: {
      type: String,
      default: "en"
    },
    sessionFrom: {
      type: String,
      default: ""
    },
    sendMessageTitle: {
      type: String,
      default: ""
    },
    sendMessagePath: {
      type: String,
      default: ""
    },
    sendMessageImg: {
      type: String,
      default: ""
    },
    showMessageCard: {
      type: Boolean,
      default: false
    },
    dataName: {
      type: String,
      default: ""
    },
    throttleTime: {
      type: [String, Number],
      default: 0
    },
    hoverStartTime: {
      type: [String, Number],
      default: 0
    },
    hoverStayTime: {
      type: [String, Number],
      default: 200
    },
    hoverClass: {
      type: String,
      default: "i-button--hover"
    },
    text: {
      type: [String, Number],
      default: ""
    },
    icon: {
      type: String,
      default: ""
    },
    iconColor: {
      type: String,
      default: ""
    },
    iconPosition: {
      type: String,
      default: "left"
    },
    color: {
      type: String,
      default: ""
    },
    customStyle: {
      type: String,
      default: ""
    }
  }, emits: [
    "click",
    "getphonenumber",
    "getuserinfo",
    "error",
    "opensetting",
    "launchapp",
    "agreeprivacyauthorization"
  ], setup(__props, _a) {
    var __expose = _a.expose, __emit = _a.emit;
    __expose();
    const props = __props;
    const emit = __emit;
    const lastClickTime = vue.ref(0);
    const loadingAngle = vue.ref(0);
    let loadingTimer = 0;
    function formatSize(value) {
      const text = value.toString();
      if (text.indexOf("px") >= 0 || text.indexOf("rpx") >= 0 || text.indexOf("%") >= 0)
        return text;
      return text + "px";
    }
    const normalizedType = vue.computed(() => {
      if (props.type == "danger")
        return "error";
      return props.type;
    });
    const contentText = vue.computed(() => {
      if (props.text == null)
        return "";
      return props.text.toString();
    });
    const computedHoverClass = vue.computed(() => {
      if (props.disabled || props.loading)
        return "none";
      return props.hoverClass;
    });
    function normalizeNumber(value) {
      if (typeof value == "number")
        return value;
      return Number.from(parseFloat(value));
    }
    const hoverStartTimeValue = vue.computed(() => {
      return normalizeNumber(props.hoverStartTime);
    });
    const hoverStayTimeValue = vue.computed(() => {
      return normalizeNumber(props.hoverStayTime);
    });
    const useNativeButton = vue.computed(() => {
      return props.openType.length > 0 || props.formType.length > 0;
    });
    const buttonClass = vue.computed(() => {
      const classes = ["i-button", "i-button--" + normalizedType.value, "i-button--" + props.size];
      if (props.block)
        classes.push("i-button--block");
      if (props.plain)
        classes.push("i-button--plain");
      if (props.plain)
        classes.push("i-button--plain-" + normalizedType.value);
      if (props.hairline && props.plain)
        classes.push("i-button--hairline");
      if (props.shape == "circle")
        classes.push("i-button--circle");
      if (props.disabled)
        classes.push("i-button--disabled");
      if (props.loading)
        classes.push("i-button--loading");
      return classes.join(" ");
    });
    const textClass = vue.computed(() => {
      const classes = ["i-button__text"];
      if (props.size == "small" || props.size == "mini")
        classes.push("i-button__text--small");
      if (normalizedType.value == "default")
        classes.push("i-button__text--default");
      if (props.plain)
        classes.push("i-button__text--plain-" + normalizedType.value);
      if (props.color.length > 0 && props.plain)
        classes.push("i-button__text--custom");
      if (props.disabled)
        classes.push("i-button__text--disabled");
      if (props.loading)
        classes.push("i-button__text--loading");
      return classes.join(" ");
    });
    const iconClass = vue.computed(() => {
      const classes = ["i-button__icon"];
      if (props.iconPosition == "right")
        classes.push("i-button__icon--right");
      return classes.join(" ");
    });
    const loadingClass = vue.computed(() => {
      const classes = ["i-button__loading"];
      if (props.loadingMode == "circle")
        classes.push("i-button__loading--circle");
      if (normalizedType.value == "default" || props.plain)
        classes.push("i-button__loading--muted");
      if (props.plain)
        classes.push("i-button__loading--plain-" + normalizedType.value);
      return classes.join(" ");
    });
    const buttonStyle = vue.computed(() => {
      let style = "";
      if (props.shape != "circle")
        style = style + "border-radius:" + formatSize(props.round) + ";";
      if (props.color.length > 0) {
        if (props.plain) {
          style = style + "background-color:transparent;border-color:" + props.color + ";";
        } else {
          style = style + "background:" + props.color + ";border-color:transparent;";
        }
      }
      if (props.customStyle.length > 0)
        style = style + props.customStyle;
      return style;
    });
    const textStyle = vue.computed(() => {
      if (props.color.length > 0 && props.plain)
        return "color:" + props.color + ";";
      return "";
    });
    const iconStyle = vue.computed(() => {
      if (props.iconColor.length > 0)
        return "color:" + props.iconColor + ";";
      if (props.color.length > 0 && props.plain)
        return "color:" + props.color + ";";
      return "";
    });
    const loadingStyle = vue.computed(() => {
      const size = formatSize(props.loadingSize);
      return "width:" + size + ";height:" + size + ";transform:rotate(" + loadingAngle.value.toString() + "deg);";
    });
    function startLoading() {
      if (loadingTimer > 0)
        return null;
      loadingTimer = setInterval(() => {
        let angle = (loadingAngle.value + 24) % 360;
        if (angle < 0)
          angle = angle + 360;
        loadingAngle.value = angle;
      }, 50);
    }
    function stopLoading() {
      if (loadingTimer > 0) {
        clearInterval(loadingTimer);
        loadingTimer = 0;
      }
      loadingAngle.value = 0;
    }
    vue.watch(() => {
      return props.loading;
    }, (nextValue) => {
      if (nextValue) {
        startLoading();
      } else {
        stopLoading();
      }
    });
    vue.onMounted(() => {
      if (props.loading)
        startLoading();
    });
    vue.onUnmounted(() => {
      stopLoading();
    });
    function canClick() {
      if (props.disabled || props.loading)
        return false;
      const wait = normalizeNumber(props.throttleTime);
      if (wait <= 0 || isNaN(wait))
        return true;
      const now = Date.now();
      if (now - lastClickTime.value < wait)
        return false;
      lastClickTime.value = now;
      return true;
    }
    function handleClick(event = null) {
      if (!canClick())
        return null;
      emit("click", event);
    }
    function handleGetPhoneNumber(event = null) {
      emit("getphonenumber", event);
    }
    function handleGetUserInfo(event = null) {
      emit("getuserinfo", event);
    }
    function handleError(event = null) {
      emit("error", event);
    }
    function handleOpenSetting(event = null) {
      emit("opensetting", event);
    }
    function handleLaunchApp(event = null) {
      emit("launchapp", event);
    }
    function handleAgreePrivacyAuthorization(event = null) {
      emit("agreeprivacyauthorization", event);
    }
    const __returned__ = { props, emit, lastClickTime, loadingAngle, get loadingTimer() {
      return loadingTimer;
    }, set loadingTimer(v) {
      loadingTimer = v;
    }, formatSize, normalizedType, contentText, computedHoverClass, normalizeNumber, hoverStartTimeValue, hoverStayTimeValue, useNativeButton, buttonClass, textClass, iconClass, loadingClass, buttonStyle, textStyle, iconStyle, loadingStyle, startLoading, stopLoading, canClick, handleClick, handleGetPhoneNumber, handleGetUserInfo, handleError, handleOpenSetting, handleLaunchApp, handleAgreePrivacyAuthorization };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  } }));
  const _style_0$y = { "i-button": { "": { "display": "flex", "height": 44, "minWidth": 86, "paddingTop": 0, "paddingRight": 18, "paddingBottom": 0, "paddingLeft": 18, "borderTopWidth": 1, "borderRightWidth": 1, "borderBottomWidth": 1, "borderLeftWidth": 1, "borderTopStyle": "solid", "borderRightStyle": "solid", "borderBottomStyle": "solid", "borderLeftStyle": "solid", "borderTopColor": "rgba(0,0,0,0)", "borderRightColor": "rgba(0,0,0,0)", "borderBottomColor": "rgba(0,0,0,0)", "borderLeftColor": "rgba(0,0,0,0)", "backgroundColor": "#f4f4f5", "alignItems": "center", "justifyContent": "center", "flexDirection": "row", "marginTop": 0, "marginRight": 0, "marginBottom": 0, "marginLeft": 0, "overflow": "hidden" } }, "i-button__inner": { "": { "flexDirection": "row", "alignItems": "center", "justifyContent": "center" } }, "i-button--block": { "": { "width": "100%" } }, "i-button--large": { "": { "height": 50, "minWidth": 108, "paddingTop": 0, "paddingRight": 22, "paddingBottom": 0, "paddingLeft": 22 } }, "i-button--normal": { "": { "height": 44 } }, "i-button--small": { "": { "height": 36, "minWidth": 72, "paddingTop": 0, "paddingRight": 14, "paddingBottom": 0, "paddingLeft": 14 } }, "i-button--mini": { "": { "height": 30, "minWidth": 58, "paddingTop": 0, "paddingRight": 10, "paddingBottom": 0, "paddingLeft": 10 } }, "i-button--circle": { "": { "borderTopLeftRadius": 999, "borderTopRightRadius": 999, "borderBottomRightRadius": 999, "borderBottomLeftRadius": 999 } }, "i-button--primary": { "": { "backgroundColor": "#3c9cff" } }, "i-button--success": { "": { "backgroundColor": "#5ac725" } }, "i-button--warning": { "": { "backgroundColor": "#f9ae3d" } }, "i-button--error": { "": { "backgroundColor": "#f56c6c" } }, "i-button--info": { "": { "backgroundColor": "#909399" } }, "i-button--default": { "": { "backgroundColor": "#f4f4f5", "borderTopColor": "#dadbde", "borderRightColor": "#dadbde", "borderBottomColor": "#dadbde", "borderLeftColor": "#dadbde" } }, "i-button--plain": { "": { "backgroundColor": "#ffffff", "borderTopColor": "#dadbde", "borderRightColor": "#dadbde", "borderBottomColor": "#dadbde", "borderLeftColor": "#dadbde" } }, "i-button--plain-primary": { "": { "borderTopColor": "#3c9cff", "borderRightColor": "#3c9cff", "borderBottomColor": "#3c9cff", "borderLeftColor": "#3c9cff", "backgroundColor": "#ffffff" } }, "i-button--plain-success": { "": { "borderTopColor": "#5ac725", "borderRightColor": "#5ac725", "borderBottomColor": "#5ac725", "borderLeftColor": "#5ac725", "backgroundColor": "#ffffff" } }, "i-button--plain-warning": { "": { "borderTopColor": "#f9ae3d", "borderRightColor": "#f9ae3d", "borderBottomColor": "#f9ae3d", "borderLeftColor": "#f9ae3d", "backgroundColor": "#ffffff" } }, "i-button--plain-error": { "": { "borderTopColor": "#f56c6c", "borderRightColor": "#f56c6c", "borderBottomColor": "#f56c6c", "borderLeftColor": "#f56c6c", "backgroundColor": "#ffffff" } }, "i-button--plain-info": { "": { "borderTopColor": "#909399", "borderRightColor": "#909399", "borderBottomColor": "#909399", "borderLeftColor": "#909399", "backgroundColor": "#ffffff" } }, "i-button--hairline": { "": { "borderTopWidth": 0.5, "borderRightWidth": 0.5, "borderBottomWidth": 0.5, "borderLeftWidth": 0.5 } }, "i-button--disabled": { "": { "opacity": 0.6 } }, "i-button--loading": { "": { "opacity": 0.9 } }, "i-button--hover": { "": { "opacity": 0.86 } }, "i-button__text": { "": { "color": "#ffffff", "fontSize": 15, "fontWeight": 500, "lineHeight": "22px" } }, "i-button__text--small": { "": { "fontSize": 13, "lineHeight": "20px" } }, "i-button__text--default": { "": { "color": "#303133" } }, "i-button__text--plain-primary": { "": { "color": "#3c9cff" } }, "i-button__text--plain-success": { "": { "color": "#5ac725" } }, "i-button__text--plain-warning": { "": { "color": "#f9ae3d" } }, "i-button__text--plain-error": { "": { "color": "#f56c6c" } }, "i-button__text--plain-info": { "": { "color": "#909399" } }, "i-button__text--plain-default": { "": { "color": "#303133" } }, "i-button__text--disabled": { "": { "opacity": 0.9 } }, "i-button__icon": { "": { "marginRight": 6, "color": "#ffffff", "fontSize": 15, "lineHeight": "22px" } }, "i-button__icon--right": { "": { "marginRight": 0, "marginLeft": 6 } }, "i-button__loading": { "": { "marginRight": 6, "borderTopLeftRadius": 999, "borderTopRightRadius": 999, "borderBottomRightRadius": 999, "borderBottomLeftRadius": 999, "borderTopWidth": 2, "borderRightWidth": 2, "borderBottomWidth": 2, "borderLeftWidth": 2, "borderTopStyle": "solid", "borderRightStyle": "solid", "borderBottomStyle": "solid", "borderLeftStyle": "solid", "borderTopColor": "#ffffff", "borderRightColor": "rgba(255,255,255,0.45)", "borderBottomColor": "rgba(255,255,255,0.45)", "borderLeftColor": "rgba(255,255,255,0.45)", "boxSizing": "border-box" } }, "i-button__loading--circle": { "": { "borderTopLeftRadius": 999, "borderTopRightRadius": 999, "borderBottomRightRadius": 999, "borderBottomLeftRadius": 999 } }, "i-button__text--loading": { "": { "opacity": 0.96 } }, "i-button__loading--muted": { "": { "borderTopColor": "#606266", "borderRightColor": "rgba(48,49,51,0.18)", "borderBottomColor": "rgba(48,49,51,0.18)", "borderLeftColor": "rgba(48,49,51,0.18)" } }, "i-button__loading--plain-primary": { "": { "borderTopColor": "#3c9cff" } }, "i-button__loading--plain-success": { "": { "borderTopColor": "#5ac725" } }, "i-button__loading--plain-warning": { "": { "borderTopColor": "#f9ae3d" } }, "i-button__loading--plain-error": { "": { "borderTopColor": "#f56c6c" } }, "i-button__loading--plain-info": { "": { "borderTopColor": "#909399" } } };
  function _sfc_render$y(_ctx, _cache, $props, $setup, $data, $options) {
    return $setup.useNativeButton ? (vue.openBlock(), vue.createElementBlock("button", {
      key: 0,
      class: vue.normalizeClass($setup.buttonClass),
      style: vue.normalizeStyle($setup.buttonStyle),
      disabled: $props.disabled || $props.loading,
      "form-type": $props.formType,
      "open-type": $props.openType,
      "app-parameter": $props.appParameter,
      "hover-class": $setup.computedHoverClass,
      "hover-stop-propagation": $props.hoverStopPropagation,
      "hover-start-time": $setup.hoverStartTimeValue,
      "hover-stay-time": $setup.hoverStayTimeValue,
      lang: $props.lang,
      "session-from": $props.sessionFrom,
      "send-message-title": $props.sendMessageTitle,
      "send-message-path": $props.sendMessagePath,
      "send-message-img": $props.sendMessageImg,
      "show-message-card": $props.showMessageCard,
      "data-name": $props.dataName,
      onClick: $setup.handleClick,
      onGetphonenumber: $setup.handleGetPhoneNumber,
      onGetuserinfo: $setup.handleGetUserInfo,
      onError: $setup.handleError,
      onOpensetting: $setup.handleOpenSetting,
      onLaunchapp: $setup.handleLaunchApp,
      onAgreeprivacyauthorization: $setup.handleAgreePrivacyAuthorization
    }, [
      vue.createElementVNode("view", { class: "i-button__inner" }, [
        $props.loading ? (vue.openBlock(), vue.createElementBlock(
          "text",
          {
            key: 0,
            class: vue.normalizeClass($setup.loadingClass),
            style: vue.normalizeStyle($setup.loadingStyle)
          },
          null,
          6
          /* CLASS, STYLE */
        )) : vue.createCommentVNode("v-if", true),
        $props.icon.length > 0 && $props.iconPosition == "left" && !$props.loading ? (vue.openBlock(), vue.createElementBlock(
          "text",
          {
            key: 1,
            class: vue.normalizeClass($setup.iconClass),
            style: vue.normalizeStyle($setup.iconStyle)
          },
          vue.toDisplayString($props.icon),
          7
          /* TEXT, CLASS, STYLE */
        )) : vue.createCommentVNode("v-if", true),
        $setup.contentText.length > 0 ? (vue.openBlock(), vue.createElementBlock(
          "text",
          {
            key: 2,
            class: vue.normalizeClass($setup.textClass),
            style: vue.normalizeStyle($setup.textStyle)
          },
          vue.toDisplayString($setup.contentText),
          7
          /* TEXT, CLASS, STYLE */
        )) : (vue.openBlock(), vue.createElementBlock(
          "text",
          {
            key: 3,
            class: vue.normalizeClass($setup.textClass),
            style: vue.normalizeStyle($setup.textStyle)
          },
          [
            vue.renderSlot(_ctx.$slots, "default")
          ],
          6
          /* CLASS, STYLE */
        )),
        $props.icon.length > 0 && $props.iconPosition == "right" && !$props.loading ? (vue.openBlock(), vue.createElementBlock(
          "text",
          {
            key: 4,
            class: vue.normalizeClass($setup.iconClass),
            style: vue.normalizeStyle($setup.iconStyle)
          },
          vue.toDisplayString($props.icon),
          7
          /* TEXT, CLASS, STYLE */
        )) : vue.createCommentVNode("v-if", true)
      ])
    ], 46, ["disabled", "form-type", "open-type", "app-parameter", "hover-class", "hover-stop-propagation", "hover-start-time", "hover-stay-time", "lang", "session-from", "send-message-title", "send-message-path", "send-message-img", "show-message-card", "data-name"])) : (vue.openBlock(), vue.createElementBlock("view", {
      key: 1,
      class: vue.normalizeClass($setup.buttonClass),
      style: vue.normalizeStyle($setup.buttonStyle),
      "hover-class": $setup.computedHoverClass,
      "hover-stop-propagation": $props.hoverStopPropagation,
      "hover-start-time": $setup.hoverStartTimeValue,
      "hover-stay-time": $setup.hoverStayTimeValue,
      "data-name": $props.dataName,
      onClick: $setup.handleClick
    }, [
      vue.createElementVNode("view", { class: "i-button__inner" }, [
        $props.loading ? (vue.openBlock(), vue.createElementBlock(
          "text",
          {
            key: 0,
            class: vue.normalizeClass($setup.loadingClass),
            style: vue.normalizeStyle($setup.loadingStyle)
          },
          null,
          6
          /* CLASS, STYLE */
        )) : vue.createCommentVNode("v-if", true),
        $props.icon.length > 0 && $props.iconPosition == "left" && !$props.loading ? (vue.openBlock(), vue.createElementBlock(
          "text",
          {
            key: 1,
            class: vue.normalizeClass($setup.iconClass),
            style: vue.normalizeStyle($setup.iconStyle)
          },
          vue.toDisplayString($props.icon),
          7
          /* TEXT, CLASS, STYLE */
        )) : vue.createCommentVNode("v-if", true),
        $setup.contentText.length > 0 ? (vue.openBlock(), vue.createElementBlock(
          "text",
          {
            key: 2,
            class: vue.normalizeClass($setup.textClass),
            style: vue.normalizeStyle($setup.textStyle)
          },
          vue.toDisplayString($setup.contentText),
          7
          /* TEXT, CLASS, STYLE */
        )) : (vue.openBlock(), vue.createElementBlock(
          "text",
          {
            key: 3,
            class: vue.normalizeClass($setup.textClass),
            style: vue.normalizeStyle($setup.textStyle)
          },
          [
            vue.renderSlot(_ctx.$slots, "default")
          ],
          6
          /* CLASS, STYLE */
        )),
        $props.icon.length > 0 && $props.iconPosition == "right" && !$props.loading ? (vue.openBlock(), vue.createElementBlock(
          "text",
          {
            key: 4,
            class: vue.normalizeClass($setup.iconClass),
            style: vue.normalizeStyle($setup.iconStyle)
          },
          vue.toDisplayString($props.icon),
          7
          /* TEXT, CLASS, STYLE */
        )) : vue.createCommentVNode("v-if", true)
      ])
    ], 14, ["hover-class", "hover-stop-propagation", "hover-start-time", "hover-stay-time", "data-name"]));
  }
  const __easycom_2$2 = /* @__PURE__ */ _export_sfc(_sfc_main$z, [["render", _sfc_render$y], ["styles", [_style_0$y]], ["__file", "/Users/xyhc/Documents/carConnectInternet/uni_modules/i-ui-x/components/i-button/i-button.uvue"]]);
  const _sfc_main$y = /* @__PURE__ */ vue.defineComponent(Object.assign({ name: "i-form" }, { __name: "i-form", props: {
    modelValue: {
      type: Object,
      default() {
        return new UTSJSONObject({});
      }
    },
    fields: {
      type: Array,
      default() {
        return [];
      }
    },
    rules: {
      type: Array,
      default() {
        return [];
      }
    },
    showActions: {
      type: Boolean,
      default: false
    },
    submitText: {
      type: String,
      default: "提交"
    },
    resetText: {
      type: String,
      default: "重置"
    },
    labelDirection: {
      type: String,
      default: "horizontal"
    },
    errorAlign: {
      type: String,
      default: "left"
    },
    errorAutoPage: {
      type: Boolean,
      default: true
    },
    scrollOffsetTop: {
      type: [String, Number],
      default: 12
    },
    scrollDuration: {
      type: [String, Number],
      default: 300
    },
    scrollIdPrefix: {
      type: String,
      default: "i-form-item-"
    },
    watchValidStatus: {
      type: Boolean,
      default: false
    },
    modelValid: {
      type: Boolean,
      default: false
    }
  }, emits: [
    "submit",
    "reset",
    "validate",
    "scroll-to-error",
    "update:modelValid",
    "update:valid"
  ], setup(__props, _a) {
    var __expose = _a.expose, __emit = _a.emit;
    const props = __props;
    const emit = __emit;
    const valid = vue.ref(true);
    const message = vue.ref("");
    const errors = vue.ref([]);
    const formClass = vue.computed(() => {
      const classes = ["i-form"];
      if (props.labelDirection == "vertical")
        classes.push("i-form--vertical");
      return classes.join(" ");
    });
    const messageClass = vue.computed(() => {
      return valid.value ? "i-form__message i-form__message--success" : "i-form__message i-form__message--error";
    });
    const messageStyle = vue.computed(() => {
      return "text-align:" + props.errorAlign + ";";
    });
    function valueText(value = null) {
      if (typeof value == "string")
        return value;
      if (typeof value == "number" || typeof value == "boolean")
        return value.toString();
      if (Array.isArray(value)) {
        const list = value;
        return list.join(",");
      }
      if (value != null && typeof value == "object")
        return "[object Object]";
      return "";
    }
    function activeFields() {
      const fields = props.fields;
      if (fields != null && fields.length > 0)
        return fields;
      const rules = props.rules;
      if (rules != null)
        return rules;
      return [];
    }
    function fieldValue(item) {
      const configuredValue = item["value"];
      if (configuredValue != null)
        return configuredValue;
      const name = item.getString("name", "");
      if (name.length == 0)
        return "";
      const values = props.modelValue;
      if (values != null) {
        const modelValue = values[name];
        if (modelValue != null)
          return modelValue;
      }
      return "";
    }
    function fieldLabel(item) {
      const label = item.getString("label", item.getString("name", ""));
      return label.length > 0 ? label : "字段";
    }
    function fieldRequired(item) {
      return item.getBoolean("required", false);
    }
    function fieldMessage(item) {
      const customMessage = item.getString("message", "");
      if (customMessage.length > 0)
        return customMessage;
      return fieldLabel(item) + "不能为空";
    }
    function checkField(item, selectedKeys) {
      const name = item.getString("name", "");
      if (selectedKeys.length > 0 && selectedKeys.indexOf(name) < 0)
        return "";
      const value = fieldValue(item);
      if (fieldRequired(item) && valueText(value).length == 0) {
        return fieldMessage(item);
      }
      return "";
    }
    function collectValues() {
      const values = new UTSJSONObject({});
      const list = activeFields();
      for (let i = 0; i < list.length; i++) {
        const item = list[i];
        const name = item.getString("name", "");
        if (name.length > 0)
          values[name] = fieldValue(item);
      }
      return values;
    }
    function numberValue(value) {
      if (typeof value == "number")
        return value;
      return Number.from(parseFloat(value));
    }
    function normalizeIdName(name) {
      let result = "";
      for (let i = 0; i < name.length; i++) {
        const char = name.charAt(i);
        const isNumber2 = char >= "0" && char <= "9";
        const isUpper = char >= "A" && char <= "Z";
        const isLower = char >= "a" && char <= "z";
        if (isNumber2 || isUpper || isLower || char == "-" || char == "_") {
          result = result + char;
        } else {
          result = result + "-";
        }
      }
      return result;
    }
    function scrollTargetId(name) {
      return props.scrollIdPrefix + normalizeIdName(name);
    }
    function scrollToFirstError(nextErrors) {
      if (!props.errorAutoPage || nextErrors.length == 0)
        return null;
      const field = nextErrors[0].getString("field", "");
      if (field.length == 0)
        return null;
      const targetId = scrollTargetId(field);
      const selector = "#" + targetId;
      const offsetTop = numberValue(props.scrollOffsetTop);
      const duration = numberValue(props.scrollDuration);
      emit("scroll-to-error", new UTSJSONObject({
        field,
        targetId,
        selector,
        offsetTop,
        duration
      }));
      vue.nextTick(() => {
        uni.pageScrollTo(new UTSJSONObject({
          selector,
          offsetTop,
          duration
        }));
      });
    }
    function validateFields(selectedKeys, silent) {
      const list = activeFields();
      const nextErrors = [];
      for (let i = 0; i < list.length; i++) {
        const item = list[i];
        const errorMessage = checkField(item, selectedKeys);
        if (errorMessage.length > 0) {
          nextErrors.push(new UTSJSONObject({
            field: item.getString("name", ""),
            message: errorMessage
          }));
        }
      }
      errors.value = nextErrors;
      valid.value = nextErrors.length == 0;
      if (!silent) {
        if (valid.value) {
          message.value = "校验通过";
        } else {
          const firstError = nextErrors[0];
          message.value = firstError.getString("message", "");
        }
        emit("validate", new UTSJSONObject({
          valid: valid.value,
          message: message.value,
          errors: nextErrors,
          values: collectValues()
        }));
        if (!valid.value)
          scrollToFirstError(nextErrors);
      }
      emit("update:modelValid", valid.value);
      emit("update:valid", valid.value);
      return valid.value;
    }
    function validate() {
      return validateFields([], false);
    }
    function validFields(keys) {
      return validateFields(keys, false);
    }
    function checkAsyncVaildStatus() {
      return validateFields([], true);
    }
    function clearValid() {
      valid.value = true;
      message.value = "";
      errors.value = [];
      emit("update:modelValid", true);
      emit("update:valid", true);
    }
    function submit() {
      const isValid = validate();
      const result = new UTSJSONObject({
        valid: isValid,
        values: collectValues(),
        errors: errors.value,
        message: message.value
      });
      emit("submit", result);
    }
    function reset() {
      clearValid();
      emit("reset", new UTSJSONObject({
        values: collectValues()
      }));
    }
    vue.watch(() => {
      return [props.fields, props.rules, props.modelValue, props.watchValidStatus];
    }, () => {
      if (props.watchValidStatus)
        validateFields([], true);
    }, { deep: true });
    __expose({
      valid: validFields,
      validate,
      clearValid,
      checkAsyncVaildStatus,
      submit,
      reset
    });
    const __returned__ = { props, emit, valid, message, errors, formClass, messageClass, messageStyle, valueText, activeFields, fieldValue, fieldLabel, fieldRequired, fieldMessage, checkField, collectValues, numberValue, normalizeIdName, scrollTargetId, scrollToFirstError, validateFields, validate, validFields, checkAsyncVaildStatus, clearValid, submit, reset };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  } }));
  const _style_0$x = { "i-form": { "": { "paddingTop": 4, "paddingRight": 0, "paddingBottom": 4, "paddingLeft": 0 } }, "i-form__message": { "": { "marginTop": 10, "fontSize": 13, "lineHeight": "20px" } }, "i-form__message--success": { "": { "color": "#19be6b" } }, "i-form__message--error": { "": { "color": "#fa3534" } }, "i-form__actions": { "": { "marginTop": 12, "flexDirection": "row", "justifyContent": "flex-end" } } };
  function _sfc_render$x(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_i_button = resolveEasycom(vue.resolveDynamicComponent("i-button"), __easycom_2$2);
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass($setup.formClass)
      },
      [
        vue.renderSlot(_ctx.$slots, "default"),
        $setup.message.length > 0 ? (vue.openBlock(), vue.createElementBlock(
          "text",
          {
            key: 0,
            class: vue.normalizeClass($setup.messageClass),
            style: vue.normalizeStyle($setup.messageStyle)
          },
          vue.toDisplayString($setup.message),
          7
          /* TEXT, CLASS, STYLE */
        )) : vue.createCommentVNode("v-if", true),
        $props.showActions ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 1,
          class: "i-form__actions"
        }, [
          vue.createVNode(_component_i_button, {
            size: "small",
            plain: "",
            onClick: $setup.reset
          }, {
            default: vue.withCtx(() => [
              vue.createTextVNode(
                vue.toDisplayString($props.resetText),
                1
                /* TEXT */
              )
            ]),
            _: 1
            /* STABLE */
          }),
          vue.createVNode(_component_i_button, {
            size: "small",
            type: "primary",
            onClick: $setup.submit
          }, {
            default: vue.withCtx(() => [
              vue.createTextVNode(
                vue.toDisplayString($props.submitText),
                1
                /* TEXT */
              )
            ]),
            _: 1
            /* STABLE */
          })
        ])) : vue.createCommentVNode("v-if", true)
      ],
      2
      /* CLASS */
    );
  }
  const __easycom_3$1 = /* @__PURE__ */ _export_sfc(_sfc_main$y, [["render", _sfc_render$x], ["styles", [_style_0$x]], ["__file", "/Users/xyhc/Documents/carConnectInternet/uni_modules/i-ui-x/components/i-form/i-form.uvue"]]);
  class FormData extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            username: { type: String, optional: false },
            password: { type: String, optional: false }
          };
        },
        name: "FormData"
      };
    }
    constructor(options, metadata = FormData.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.username = this.__props__.username;
      this.password = this.__props__.password;
      delete this.__props__;
    }
  }
  class SavedAccount extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            username: { type: String, optional: false },
            password: { type: String, optional: false }
          };
        },
        name: "SavedAccount"
      };
    }
    constructor(options, metadata = SavedAccount.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.username = this.__props__.username;
      this.password = this.__props__.password;
      delete this.__props__;
    }
  }
  const userAgreement = "\n欢迎使用车联网平台！\n\n一、服务条款的确认和接纳\n本协议是您与车联网平台之间关于使用平台服务的协议。您使用平台服务即表示您已阅读并同意本协议的全部条款。\n\n二、服务内容\n1. 车联网平台提供车辆管理、远程控制、数据分析等服务。\n2. 平台保留随时变更、中断或终止部分或全部网络服务的权利。\n\n三、用户账号\n用户应对其账号的全部行为负责，不得将账号转让或出借给他人使用。\n\n四、用户隐私保护\n保护用户隐私是平台的一项基本政策，详情请参阅《隐私政策》。\n\n五、免责声明\n1. 平台不保证服务一定能满足用户的要求，也不保证服务不会中断。\n2. 对于因不可抗力造成的服务中断，平台不承担责任。\n\n六、法律适用\n本协议的订立、执行和解释及争议的解决均适用中华人民共和国法律。\n\n如有任何疑问，请联系我们。";
  const privacyPolicy = "\n车联网平台非常重视您的隐私保护！\n\n一、信息收集\n1. 我们可能收集的信息包括：手机号码、车辆信息、位置信息、设备信息等。\n2. 我们会在您注册、使用服务时收集必要的信息。\n\n二、信息使用\n1. 我们使用收集的信息来提供、维护和改进服务。\n2. 我们不会向第三方出售或分享您的个人信息。\n\n三、信息保护\n1. 我们采用行业标准的安全措施保护您的信息。\n2. 我们会定期评估安全措施的有效性。\n\n四、未成年人保护\n我们重视未成年人的隐私保护，如您是未成年人，请在监护人指导下使用服务。\n\n五、政策更新\n我们可能会更新隐私政策，更新后的政策将在平台公布。\n\n如有任何隐私问题，请联系我们。";
  const _sfc_main$x = /* @__PURE__ */ vue.defineComponent({
    __name: "login",
    setup(__props, _a) {
      var __expose = _a.expose;
      __expose();
      const docState = vue.ref(false);
      const pswLogin = vue.ref(false);
      const rememberPassword = vue.ref(false);
      const formValid = vue.ref(false);
      const loading = vue.ref(false);
      const form = vue.ref(new FormData({
        username: "",
        password: ""
      }));
      const deviceModel = vue.ref("");
      const pswrules = [
        new UTSJSONObject({ name: "username", required: true, message: "请输入账号" }),
        new UTSJSONObject({ name: "password", required: true, message: "请输入密码" })
      ];
      const updateFormValid = (valid) => {
        formValid.value = valid;
      };
      function loadSavedAccount() {
        try {
          const rawAccount = uni.getStorageSync("savedEnterpriseAccount");
          if (rawAccount == null || rawAccount == "")
            return null;
          const account = typeof rawAccount == "string" ? UTS.JSON.parse(rawAccount) : rawAccount;
          form.value.username = account.getString("username", "");
          form.value.password = account.getString("password", "");
          rememberPassword.value = form.value.username != "" || form.value.password != "";
        } catch (error) {
          uni.__log__("error", "at pages/login/login.uvue:129", "加载保存的账号密码失败:", error);
        }
      }
      const isPswLogin = () => {
        pswLogin.value = !pswLogin.value;
        if (pswLogin.value) {
          setTimeout(() => {
            loadSavedAccount();
          }, 100);
        }
      };
      const toggleRememberPassword = () => {
        rememberPassword.value = !rememberPassword.value;
        if (!rememberPassword.value) {
          uni.removeStorageSync("savedEnterpriseAccount");
        }
      };
      const saveAccountPassword = () => {
        if (rememberPassword.value && form.value.username != "" && form.value.password != "") {
          const accountInfo = new SavedAccount({
            username: form.value.username,
            password: form.value.password
          });
          uni.setStorageSync("savedEnterpriseAccount", UTS.JSON.stringify(accountInfo));
        } else if (!rememberPassword.value) {
          uni.removeStorageSync("savedEnterpriseAccount");
        }
      };
      const filterNonLatin = (value) => {
        form.value.password = value.replace(/[^\x00-\x7F]/g, "");
      };
      const isDocState = () => {
        docState.value = !docState.value;
      };
      const getSystemInfo = () => {
        const res = uni.getSystemInfoSync();
        deviceModel.value = res.deviceModel;
        uni.__log__("log", "at pages/login/login.uvue:172", "设备型号:", deviceModel.value);
      };
      const validateForm = () => {
        if (form.value.username.length == 0) {
          showAppToast({ title: "请输入账号", icon: "none" });
          return false;
        }
        if (form.value.password.length == 0) {
          showAppToast({ title: "请输入密码", icon: "none" });
          return false;
        }
        return true;
      };
      const loginBt = () => {
        if (!docState.value) {
          showAppToast({
            title: "请先阅读并同意用户协议",
            icon: "error"
          });
          return null;
        }
      };
      const handleGetPhoneNumber = (e = null) => {
        return __awaiter(this, void 0, void 0, function* () {
        });
      };
      const submit = () => {
        return __awaiter(this, void 0, void 0, function* () {
          if (!docState.value) {
            showAppToast({
              title: "请先阅读并同意用户协议",
              icon: "error"
            });
            return Promise.resolve(null);
          }
          try {
            uni.__log__("log", "at pages/login/login.uvue:300", "准备验证表单...");
            if (!validateForm())
              return Promise.resolve(null);
            uni.__log__("log", "at pages/login/login.uvue:302", "✅ 表单验证通过");
            const newFormData = new UTSJSONObject({
              username: form.value.username,
              password: form.value.password,
              from: deviceModel.value,
              type: "USER"
            });
            uni.__log__("log", "at pages/login/login.uvue:311", "📤 请求参数:", newFormData);
            loading.value = true;
            uni.showLoading(new UTSJSONObject({
              title: "登录中...",
              mask: true
            }));
            uni.__log__("log", "at pages/login/login.uvue:321", "🚀 开始调用 login 接口...");
            const res = yield login(newFormData);
            uni.__log__("log", "at pages/login/login.uvue:323", "✅ 登录接口返回:", res);
            loading.value = false;
            uni.hideLoading();
            const loginData = res.data;
            const token = loginData != null ? loginData.getString("token", "") : "";
            if (token != "") {
              saveAccountPassword();
              uni.setStorageSync("token", token);
              showAppToast({
                title: "登录成功",
                icon: "success"
              });
              setTimeout(() => {
                uni.reLaunch({
                  url: "/pages/index/index"
                });
              }, 500);
            } else {
              showAppToast({
                title: "登录失败，请重试",
                icon: "error"
              });
            }
          } catch (error) {
            uni.__log__("error", "at pages/login/login.uvue:352", "❌ 登录失败:", error);
            loading.value = false;
            uni.hideLoading();
            if (error && error.message) {
              showAppToast({
                icon: "error",
                title: "登录失败，请检查账号、密码或网络"
              });
            } else {
              showAppToast({
                icon: "error",
                title: "登录失败，请检查网络后重试"
              });
            }
          }
        });
      };
      const gotoIndex = () => {
        uni.reLaunch({
          url: "/pages/index/index"
        });
      };
      const gotoAgreement = () => {
        uni.showModal(new UTSJSONObject({
          title: "用户协议",
          content: userAgreement,
          showCancel: false
        }));
      };
      const gotoPrivacy = () => {
        uni.showModal(new UTSJSONObject({
          title: "隐私政策",
          content: privacyPolicy,
          showCancel: false
        }));
      };
      vue.onMounted(() => {
        getSystemInfo();
        loadSavedAccount();
        uni.__log__("log", "at pages/login/login.uvue:448", "pswLogin 初始值:", pswLogin.value);
      });
      const __returned__ = { docState, pswLogin, rememberPassword, formValid, loading, form, deviceModel, pswrules, updateFormValid, loadSavedAccount, isPswLogin, toggleRememberPassword, saveAccountPassword, filterNonLatin, isDocState, getSystemInfo, validateForm, loginBt, handleGetPhoneNumber, submit, userAgreement, privacyPolicy, gotoIndex, gotoAgreement, gotoPrivacy };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  const _imports_0$2 = "/static/car_location.png";
  const _style_0$w = { "container": { "": { "height": "100%", "backgroundColor": "#ffffff" } }, "banner": { ".container ": { "backgroundColor": "#ffffff", "display": "flex", "flexDirection": "row", "justifyContent": "center", "alignItems": "center", "height": "20%" } }, "banner-image": { ".container .banner ": { "width": "180rpx", "height": "180rpx" } }, "title": { ".container .banner ": { "fontSize": "40rpx", "fontWeight": "bold", "color": "#333333" } }, "content": { ".container ": { "backgroundColor": "#ffffff", "paddingTop": "20rpx", "paddingRight": "100rpx", "paddingBottom": "20rpx", "paddingLeft": "100rpx" } }, "other-login": { ".container .content ": { "display": "flex", "flexDirection": "row", "justifyContent": "space-between", "alignItems": "center", "marginTop": "20rpx", "marginRight": 0, "marginBottom": "30rpx", "marginLeft": 0, "fontSize": "25rpx" } }, "documents": { ".container .content ": { "display": "flex", "flexDirection": "row", "justifyContent": "flex-start", "alignItems": "center", "marginTop": "40rpx" } }, "doc-info-box": { ".container .content .documents ": { "display": "flex", "flexDirection": "row", "justifyContent": "flex-start", "alignItems": "center", "whiteSpace": "nowrap" } }, "doc-link": { ".container .content .documents .doc-info-box ": { "color": "#007AFF", "fontSize": 10 } }, "doc-text": { ".container .content .documents .doc-info-box ": { "fontSize": 10 } }, "remember-password": { ".container .content ": { "display": "flex", "flexDirection": "row", "alignItems": "center", "marginTop": "20rpx", "marginRight": 0, "marginBottom": "20rpx", "marginLeft": 0, "fontSize": "25rpx" } }, "i-checkbox": { ".container .content .remember-password ": { "display": "flex", "alignItems": "center" } }, "other-way": { ".container ": { "display": "flex", "flexDirection": "row", "justifyContent": "center", "alignItems": "center", "fontSize": "25rpx", "marginTop": "40rpx", "color": "#999999" } }, "noLogin": { ".container .other-way ": { "borderRightWidth": "1rpx", "borderRightStyle": "solid", "borderRightColor": "#999999", "paddingRight": "50rpx" } }, "BLogin": { ".container .other-way ": { "paddingLeft": "50rpx" } }, "wechat-login-btn": { ".container ": { "!color": "#ffffff" } }, "i-form-item": { ".container ": { "paddingTop": 12, "paddingRight": 0, "paddingBottom": 12, "paddingLeft": 0 } } };
  function _sfc_render$w(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_custom_navBar = resolveEasycom(vue.resolveDynamicComponent("custom-navBar"), __easycom_0$5);
    const _component_i_input = resolveEasycom(vue.resolveDynamicComponent("i-input"), __easycom_1$2);
    const _component_i_form_item = resolveEasycom(vue.resolveDynamicComponent("i-form-item"), __easycom_2$3);
    const _component_i_checkbox = resolveEasycom(vue.resolveDynamicComponent("i-checkbox"), __easycom_3$2);
    const _component_i_button = resolveEasycom(vue.resolveDynamicComponent("i-button"), __easycom_2$2);
    const _component_i_form = resolveEasycom(vue.resolveDynamicComponent("i-form"), __easycom_3$1);
    const _component_app_toast = resolveEasycom(vue.resolveDynamicComponent("app-toast"), __easycom_3$3);
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.createElementVNode("view", { class: "container" }, [
          vue.createVNode(_component_custom_navBar, {
            title: "登陆",
            "show-back": false,
            backgroundColor: "#fff",
            textColor: "#333",
            showCapsule: false
          }),
          vue.createElementVNode("view", { class: "banner" }, [
            vue.createElementVNode("image", {
              src: _imports_0$2,
              class: "banner-image",
              mode: "aspectFill"
            }),
            vue.createElementVNode("text", { class: "title" }, "车联网")
          ]),
          vue.createElementVNode("view", { class: "content" }, [
            $setup.pswLogin ? (vue.openBlock(), vue.createElementBlock("view", { key: 0 }, [
              vue.createVNode(_component_i_form, {
                modelValue: $setup.form,
                rules: $setup.pswrules,
                labelDirection: "horizontal",
                watchValidStatus: "",
                "onUpdate:modelValid": $setup.updateFormValid
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_i_form_item, {
                    name: "username",
                    label: "",
                    required: "",
                    labelDirection: "horizontal",
                    labelWidth: "0"
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_i_input, {
                        modelValue: $setup.form.username,
                        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.form.username = $event),
                        placeholder: "请输入账号",
                        clearable: "",
                        prefixIcon: "account-fill"
                      }, null, 8, ["modelValue"])
                    ]),
                    _: 1
                    /* STABLE */
                  }),
                  vue.createVNode(_component_i_form_item, {
                    name: "password",
                    label: "",
                    required: "",
                    labelDirection: "horizontal",
                    labelWidth: "0"
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_i_input, {
                        modelValue: $setup.form.password,
                        "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.form.password = $event),
                        onInput: $setup.filterNonLatin,
                        placeholder: "请输入密码",
                        password: true
                      }, null, 8, ["modelValue"])
                    ]),
                    _: 1
                    /* STABLE */
                  }),
                  vue.createElementVNode("view", { class: "remember-password" }, [
                    vue.createVNode(_component_i_checkbox, {
                      checked: $setup.rememberPassword,
                      onChange: $setup.toggleRememberPassword,
                      label: "记住密码"
                    }, null, 8, ["checked"])
                  ]),
                  vue.createVNode(_component_i_button, {
                    type: "primary",
                    onClick: $setup.submit,
                    loading: $setup.loading
                  }, {
                    default: vue.withCtx(() => [
                      vue.createTextVNode("提交")
                    ]),
                    _: 1
                    /* STABLE */
                  }, 8, ["loading"])
                ]),
                _: 1
                /* STABLE */
              }, 8, ["modelValue"])
            ])) : (vue.openBlock(), vue.createElementBlock("view", { key: 1 }, [
              !$setup.docState ? (vue.openBlock(), vue.createElementBlock("button", {
                key: 0,
                type: "primary",
                plain: "true",
                onClick: $setup.loginBt
              }, " 个人用户登录 ")) : vue.createCommentVNode("v-if", true),
              $setup.docState ? (vue.openBlock(), vue.createElementBlock(
                "button",
                {
                  key: 1,
                  "open-type": "getPhoneNumber",
                  type: "primary",
                  plain: "true",
                  onGetphonenumber: $setup.handleGetPhoneNumber
                },
                " 个人用户登录 ",
                32
                /* NEED_HYDRATION */
              )) : vue.createCommentVNode("v-if", true)
            ])),
            vue.createElementVNode("view", { class: "documents" }, [
              vue.createVNode(_component_i_checkbox, {
                checked: $setup.docState,
                onChange: $setup.isDocState
              }, null, 8, ["checked"]),
              vue.createElementVNode("view", { class: "doc-info-box" }, [
                vue.createElementVNode("text", { class: "doc-text" }, "已阅读并同意"),
                vue.createElementVNode("text", {
                  class: "doc-link",
                  onClick: $setup.gotoAgreement
                }, "《用户协议》"),
                vue.createElementVNode("text", { class: "doc-text" }, "和"),
                vue.createElementVNode("text", {
                  class: "doc-link",
                  onClick: $setup.gotoPrivacy
                }, "《隐私政策》")
              ])
            ])
          ]),
          vue.createElementVNode("view", { class: "other-way" }, [
            vue.createElementVNode("view", {
              class: "noLogin",
              onClick: $setup.gotoIndex
            }, "暂不登录"),
            vue.createElementVNode(
              "view",
              {
                class: "BLogin",
                onClick: $setup.isPswLogin
              },
              vue.toDisplayString($setup.pswLogin ? "个人用户登录" : "企业用户登录"),
              1
              /* TEXT */
            )
          ])
        ]),
        vue.createVNode(_component_app_toast)
      ],
      64
      /* STABLE_FRAGMENT */
    );
  }
  const PagesLoginLogin = /* @__PURE__ */ _export_sfc(_sfc_main$x, [["render", _sfc_render$w], ["styles", [_style_0$w]], ["__file", "/Users/xyhc/Documents/carConnectInternet/pages/login/login.uvue"]]);
  class PickerItem extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            label: { type: String, optional: false },
            value: { type: String, optional: false }
          };
        },
        name: "PickerItem"
      };
    }
    constructor(options, metadata = PickerItem.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.label = this.__props__.label;
      this.value = this.__props__.value;
      delete this.__props__;
    }
  }
  class PickerConfirmEvent extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            value: { type: "Unknown", optional: false }
          };
        },
        name: "PickerConfirmEvent"
      };
    }
    constructor(options, metadata = PickerConfirmEvent.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.value = this.__props__.value;
      delete this.__props__;
    }
  }
  const _sfc_main$w = /* @__PURE__ */ vue.defineComponent({
    __name: "sub-navBar",
    props: {
      showTime: {
        type: Boolean,
        default: true
      },
      showPickerTime: {
        type: Boolean,
        default: true
      },
      showCar: {
        type: Boolean,
        default: false
      },
      showPicker: {
        type: Boolean,
        default: true
      },
      currentTime: {
        type: String,
        default: ""
      },
      currentCar: {
        type: String,
        default: ""
      },
      carStatus: {
        type: String,
        default: "在线"
      },
      times: {
        type: Array,
        default: () => {
          return [[]];
        }
        // 默认值调整为二维数组
      },
      cars: {
        type: Array,
        default: () => {
          return [[]];
        }
        // 默认值调整为二维数组
      }
    },
    emits: ["update:currentTime", "update:currentCar"],
    setup(__props, _a) {
      var __expose = _a.expose, __emit = _a.emit;
      __expose();
      const props = __props;
      const columns = vue.ref([]);
      const picker = vue.ref(null);
      const currentPickerType = vue.ref("");
      const handleTime = () => {
        columns.value = props.times;
        currentPickerType.value = "time";
      };
      const handleCar = () => {
        columns.value = props.cars;
        currentPickerType.value = "car";
      };
      const confirm = (e) => {
        const selected = e.value[0];
        if (currentPickerType.value === "time") {
          emit("update:currentTime", selected.label);
        } else if (currentPickerType.value === "car") {
          emit("update:currentCar", selected.label);
        }
        currentPickerType.value = "";
      };
      const emit = __emit;
      const __returned__ = { props, columns, picker, currentPickerType, handleTime, handleCar, confirm, emit };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  const _style_0$v = { "tools-box": { "": { "display": "flex", "flexDirection": "row", "justifyContent": "space-between", "alignItems": "center", "paddingTop": "20rpx", "paddingRight": "30rpx", "paddingBottom": "20rpx", "paddingLeft": "30rpx" } }, "second": { ".tools-box ": { "display": "flex", "flexDirection": "row", "justifyContent": "space-between", "alignItems": "center", "paddingTop": "10rpx", "paddingRight": "10rpx", "paddingBottom": "10rpx", "paddingLeft": "10rpx", "backgroundColor": "rgba(3,109,246,0.71)", "borderTopLeftRadius": "10rpx", "borderTopRightRadius": "10rpx", "borderBottomRightRadius": "10rpx", "borderBottomLeftRadius": "10rpx", "color": "#ffffff" } }, "car-state": { ".tools-box .car-box ": { "display": "flex", "flexDirection": "row", "justifyContent": "space-between", "alignItems": "center", "paddingTop": "10rpx", "paddingRight": "15rpx", "paddingBottom": "10rpx", "paddingLeft": "15rpx", "borderTopLeftRadius": "10rpx", "borderTopRightRadius": "10rpx", "borderBottomRightRadius": "10rpx", "borderBottomLeftRadius": "10rpx", "fontSize": "25rpx" } }, "car-box": { ".tools-box .car-box .car-state ": { "display": "flex", "flexDirection": "row", "justifyContent": "space-between", "alignItems": "center", "paddingTop": 0, "paddingRight": 0, "paddingBottom": 0, "paddingLeft": 0 }, ".tools-box .car-box .selectCar ": { "display": "flex", "flexDirection": "row", "justifyContent": "space-between", "alignItems": "center", "paddingTop": 0, "paddingRight": 0, "paddingBottom": 0, "paddingLeft": 0 }, ".tools-box ": { "display": "flex", "flexDirection": "row", "justifyContent": "space-between", "alignItems": "center", "paddingTop": 0, "paddingRight": 0, "paddingBottom": 0, "paddingLeft": 0 } }, "selectCar": { ".tools-box .car-box ": { "display": "flex", "flexDirection": "row", "justifyContent": "space-between", "alignItems": "center", "paddingTop": "10rpx", "paddingRight": "10rpx", "paddingBottom": "10rpx", "paddingLeft": "10rpx", "marginRight": "20rpx", "backgroundColor": "rgba(3,109,246,0.71)", "borderTopLeftRadius": "10rpx", "borderTopRightRadius": "10rpx", "borderBottomRightRadius": "10rpx", "borderBottomLeftRadius": "10rpx" } }, "slot": { ".tools-box ": { "width": "50rpx", "height": "20rpx" }, ".tools-box .car-box .car-state ": { "width": "50rpx", "height": "20rpx" }, ".tools-box .car-box .selectCar ": { "width": "50rpx", "height": "20rpx" } }, "plateNo": { ".tools-box .car-box .selectCar ": { "fontSize": "30rpx", "color": "#ffffff" } }, "state": { ".tools-box .car-box .car-state ": { "fontSize": "25rpx", "color": "#ffffff" } }, "success": { ".tools-box .car-box ": { "backgroundColor": "#5ac725" } }, "error": { ".tools-box .car-box ": { "backgroundColor": "#f56c6c" } }, "times": { ".tools-box .second ": { "display": "flex", "flexDirection": "row", "justifyContent": "flex-start", "alignItems": "center", "fontSize": "30rpx" } }, "refresh": { ".tools-box .second .times ": { "color": "#ffffff" } }, "down_icon": { ".tools-box ": { "width": "30rpx", "height": "30rpx" } } };
  function _sfc_render$v(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "tools-box" }, [
      $props.showTime ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "second",
        onClick: _cache[0] || (_cache[0] = ($event) => $props.showPickerTime ? $setup.handleTime : null)
      }, [
        vue.createElementVNode("view", { class: "times" }, [
          vue.createElementVNode(
            "text",
            { class: "refresh" },
            vue.toDisplayString($props.currentTime),
            1
            /* TEXT */
          ),
          !$props.showPickerTime ? (vue.openBlock(), vue.createElementBlock("text", {
            key: 0,
            class: "refresh"
          }, "刷新一次位置")) : vue.createCommentVNode("v-if", true)
        ])
      ])) : (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "slot"
      })),
      vue.createElementVNode("view", { class: "car-box" }, [
        $props.showCar ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "selectCar",
          onClick: _cache[1] || (_cache[1] = ($event) => $props.showPicker ? $setup.handleCar : null)
        }, [
          vue.createElementVNode(
            "text",
            { class: "plateNo" },
            vue.toDisplayString($props.currentCar),
            1
            /* TEXT */
          )
        ])) : vue.createCommentVNode("v-if", true),
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(["car-state", $props.carStatus == "online" ? "success" : "error"])
          },
          [
            vue.createElementVNode(
              "text",
              { class: "state" },
              vue.toDisplayString($props.carStatus == "online" ? "在线" : "离线"),
              1
              /* TEXT */
            )
          ],
          2
          /* CLASS */
        )
      ])
    ]);
  }
  const __easycom_1$1 = /* @__PURE__ */ _export_sfc(_sfc_main$w, [["render", _sfc_render$v], ["styles", [_style_0$v]], ["__file", "/Users/xyhc/Documents/carConnectInternet/components/sub-navBar/sub-navBar.uvue"]]);
  const _sfc_main$v = /* @__PURE__ */ vue.defineComponent(Object.assign({ name: "i-grid" }, { __name: "i-grid", props: {
    items: {
      type: Array,
      default() {
        return ["首页", "分类", "购物车", "我的", "优惠券", "设置"];
      }
    },
    col: {
      type: Number,
      default: 3
    },
    itemHeight: {
      type: [String, Number],
      default: "70"
    },
    itemBgColor: {
      type: String,
      default: "#ffffff"
    },
    bgColor: {
      type: String,
      default: "transparent"
    },
    width: {
      type: String,
      default: "auto"
    },
    iconColor: {
      type: String,
      default: "#333333"
    },
    textColor: {
      type: String,
      default: "#888888"
    },
    fontSize: {
      type: [String, Number],
      default: "13"
    },
    iconSize: {
      type: [String, Number],
      default: "25"
    },
    imageSize: {
      type: [String, Number],
      default: "40"
    },
    showBorder: {
      type: Boolean,
      default: true
    },
    borderColor: {
      type: String,
      default: "#f5f5f5"
    },
    round: {
      type: [String, Number],
      default: "0"
    },
    isLink: {
      type: Boolean,
      default: true
    }
  }, emits: ["select", "change", "click", "loadmore"], setup(__props, _a) {
    var __expose = _a.expose, __emit = _a.emit;
    __expose();
    const props = __props;
    const emit = __emit;
    function valueText(value = null) {
      if (typeof value == "string")
        return value;
      if (typeof value == "number" || typeof value == "boolean")
        return value.toString();
      return "";
    }
    function formatSize(value) {
      const text = value.toString();
      if (text.indexOf("px") >= 0 || text.indexOf("rpx") >= 0 || text.indexOf("%") >= 0 || text == "auto") {
        return text;
      }
      return text + "px";
    }
    function itemValue(item = null, keyName) {
      if (item == null || typeof item != "object")
        return "";
      const values = item;
      const value = values[keyName];
      if (value == null)
        return "";
      return valueText(value);
    }
    function getItemText(item = null) {
      const text = itemValue(item, "text");
      if (text.length > 0)
        return text;
      return valueText(item);
    }
    function getItemIcon(item = null) {
      return itemValue(item, "icon");
    }
    function getItemImage(item = null) {
      return itemValue(item, "image");
    }
    function getItemName(item = null) {
      return itemValue(item, "name");
    }
    function getItemBgColor(item = null) {
      const color = itemValue(item, "bgColor");
      if (color.length > 0)
        return color;
      return props.itemBgColor;
    }
    function getItemIconColor(item = null) {
      const color = itemValue(item, "iconColor");
      if (color.length > 0)
        return color;
      return props.iconColor;
    }
    function getItemTextColor(item = null) {
      const color = itemValue(item, "textColor");
      if (color.length > 0)
        return color;
      return props.textColor;
    }
    function getItemUrl(item = null) {
      return itemValue(item, "url");
    }
    const bgColor = vue.computed(() => {
      return props.bgColor;
    });
    const gridItems = vue.computed(() => {
      const items = props.items;
      if (items == null)
        return [];
      return items;
    });
    const selected = vue.ref(-1);
    const gridStyle = vue.computed(() => {
      return "width:" + props.width + ";background-color:" + bgColor.value + ";border-radius:" + formatSize(props.round) + ";";
    });
    function getColumns() {
      if (props.col <= 1)
        return 1;
      if (props.col >= 6)
        return 6;
      return props.col;
    }
    function getRows() {
      const columns = getColumns();
      const items = props.items;
      if (items == null)
        return 0;
      return Math.ceil(items.length / columns);
    }
    function getItemWidth() {
      const columns = getColumns();
      if (columns == 1)
        return "100%";
      if (columns == 2)
        return "50%";
      if (columns == 3)
        return "33.3333%";
      if (columns == 4)
        return "25%";
      if (columns == 5)
        return "20%";
      return "16.6667%";
    }
    function getItemStyle(index, item = null) {
      const columns = getColumns();
      const row = Math.floor(index / columns);
      const colIndex = index % columns;
      let style = "width:" + getItemWidth() + ";height:" + formatSize(props.itemHeight) + ";background-color:" + getItemBgColor(item) + ";";
      if (props.showBorder) {
        if (colIndex < columns - 1) {
          style = style + "border-right-width:1px;border-right-style:solid;border-right-color:" + props.borderColor + ";";
        }
        if (row < getRows() - 1) {
          style = style + "border-bottom-width:1px;border-bottom-style:solid;border-bottom-color:" + props.borderColor + ";";
        }
      }
      return style;
    }
    function getIconStyle(item = null) {
      return "color:" + getItemIconColor(item) + ";font-size:" + formatSize(props.iconSize) + ";line-height:" + formatSize(props.iconSize) + ";";
    }
    function getImageStyle(item = null) {
      const size = formatSize(props.imageSize);
      return "width:" + size + ";height:" + size + ";";
    }
    function getTextStyle(item = null) {
      return "color:" + getItemTextColor(item) + ";font-size:" + formatSize(props.fontSize) + ";";
    }
    function buildPayload(item = null, index) {
      return new UTSJSONObject({
        index,
        name: getItemName(item),
        text: getItemText(item),
        icon: getItemIcon(item),
        image: getItemImage(item),
        url: getItemUrl(item)
      });
    }
    function select(item = null, index) {
      selected.value = index;
      const payload = buildPayload(item, index);
      emit("select", payload);
      emit("change", payload);
      emit("click", payload);
    }
    function loadMore() {
      emit("loadmore", gridItems.value.length);
    }
    const __returned__ = { props, emit, valueText, formatSize, itemValue, getItemText, getItemIcon, getItemImage, getItemName, getItemBgColor, getItemIconColor, getItemTextColor, getItemUrl, bgColor, gridItems, selected, gridStyle, getColumns, getRows, getItemWidth, getItemStyle, getIconStyle, getImageStyle, getTextStyle, buildPayload, select, loadMore };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  } }));
  const _style_0$u = { "i-grid": { "": { "flexDirection": "row", "flexWrap": "wrap", "overflow": "hidden" } }, "i-grid__item": { "": { "boxSizing": "border-box", "overflow": "hidden", "alignItems": "center", "justifyContent": "center" } }, "i-grid__item--hover": { "": { "backgroundColor": "#f3f4f6" } }, "i-grid__item--active": { "": { "backgroundColor": "#ecf5ff" } }, "i-grid__image": { "": { "marginBottom": 8 } }, "i-grid__icon": { "": { "marginBottom": 8, "textAlign": "center", "lines": 1 } }, "i-grid__text": { "": { "lineHeight": "18px", "textAlign": "center", "lines": 1 } } };
  function _sfc_render$u(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: "i-grid",
        style: vue.normalizeStyle($setup.gridStyle)
      },
      [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($setup.gridItems, (item, index) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              key: index.toString() + "-" + $setup.getItemText(item),
              class: vue.normalizeClass(
                $setup.selected == index ? "i-grid__item i-grid__item--active" : "i-grid__item"
              ),
              style: vue.normalizeStyle($setup.getItemStyle(index, item)),
              "hover-class": $props.isLink ? "i-grid__item--hover" : "none",
              onClick: ($event) => $setup.select(item, index)
            }, [
              $setup.getItemImage(item).length > 0 ? (vue.openBlock(), vue.createElementBlock("image", {
                key: 0,
                class: "i-grid__image",
                src: $setup.getItemImage(item),
                style: vue.normalizeStyle($setup.getImageStyle(item)),
                mode: "aspectFit"
              }, null, 12, ["src"])) : $setup.getItemIcon(item).length > 0 ? (vue.openBlock(), vue.createElementBlock(
                "text",
                {
                  key: 1,
                  class: "i-grid__icon",
                  style: vue.normalizeStyle($setup.getIconStyle(item))
                },
                vue.toDisplayString($setup.getItemIcon(item)),
                5
                /* TEXT, STYLE */
              )) : vue.createCommentVNode("v-if", true),
              vue.createElementVNode(
                "text",
                {
                  class: "i-grid__text",
                  style: vue.normalizeStyle($setup.getTextStyle(item))
                },
                vue.toDisplayString($setup.getItemText(item)),
                5
                /* TEXT, STYLE */
              )
            ], 14, ["hover-class", "onClick"]);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ],
      4
      /* STYLE */
    );
  }
  const __easycom_0$4 = /* @__PURE__ */ _export_sfc(_sfc_main$v, [["render", _sfc_render$u], ["styles", [_style_0$u]], ["__file", "/Users/xyhc/Documents/carConnectInternet/uni_modules/i-ui-x/components/i-grid/i-grid.uvue"]]);
  const DEFAULT_TK = "1e3374be3d63de65d44dbfdc7b311afb";
  class AddressResult extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            formatted_address: { type: String, optional: false }
          };
        },
        name: "AddressResult"
      };
    }
    constructor(options, metadata = AddressResult.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.formatted_address = this.__props__.formatted_address;
      delete this.__props__;
    }
  }
  class AddressResponse extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            result: { type: AddressResult, optional: false }
          };
        },
        name: "AddressResponse"
      };
    }
    constructor(options, metadata = AddressResponse.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.result = this.__props__.result;
      delete this.__props__;
    }
  }
  function getAddress(latitude, longitude, tk = DEFAULT_TK) {
    return new Promise((resolve, reject) => {
      const postStr = UTS.JSON.stringify(new UTSJSONObject({
        lon: longitude,
        lat: latitude,
        ver: 1
      }));
      uni.request({
        url: "https://api.tianditu.gov.cn/geocoder?postStr=".concat(encodeURIComponent(postStr), "&type=geocode&tk=").concat(tk),
        method: "GET",
        header: new UTSJSONObject({
          "User-Agent": "Mozilla/5.0"
        }),
        success: (res) => {
          if (res.statusCode != 200 || res.data == null) {
            reject(new Error("获取地址信息失败，状态码：".concat(res.statusCode)));
            return null;
          }
          const response = res.data;
          const result = response.getJSON("result");
          if (result == null) {
            reject(new Error("获取地址信息失败：".concat(response.getString("msg", "响应缺少结果"))));
            return null;
          }
          const formattedAddress = result.getString("formatted_address", "");
          if (formattedAddress == "") {
            reject(new Error("获取地址信息失败：响应缺少地址"));
            return null;
          }
          resolve({ result: new AddressResult({ formatted_address: formattedAddress }) });
        },
        fail: (err) => {
          reject(err);
        }
      });
    });
  }
  class MapCenter extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            latitude: { type: Number, optional: false },
            longitude: { type: Number, optional: false }
          };
        },
        name: "MapCenter"
      };
    }
    constructor(options, metadata = MapCenter.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.latitude = this.__props__.latitude;
      this.longitude = this.__props__.longitude;
      delete this.__props__;
    }
  }
  class SignalDetail extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            experience: { type: String, optional: false },
            quality: { type: String, optional: false },
            color: { type: String, optional: false },
            level: { type: Number, optional: false }
          };
        },
        name: "SignalDetail"
      };
    }
    constructor(options, metadata = SignalDetail.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.experience = this.__props__.experience;
      this.quality = this.__props__.quality;
      this.color = this.__props__.color;
      this.level = this.__props__.level;
      delete this.__props__;
    }
  }
  const _sfc_main$u = /* @__PURE__ */ vue.defineComponent({
    __name: "carInfoDetail",
    setup(__props, _a) {
      var __expose = _a.expose;
      __expose();
      const deptId = vue.ref("");
      const imei = vue.ref("");
      const deviceId = vue.ref("");
      const center = vue.reactive(new MapCenter({
        latitude: 39.90469,
        longitude: 116.40717
      }));
      const mapScale = vue.ref(15);
      const datainfo = vue.ref(new UTSJSONObject({}));
      const address = vue.ref("");
      const currentTime = vue.ref("5s");
      const onCurrentTimeChange = (value) => {
        currentTime.value = value;
      };
      const times = vue.ref([
        [
          new UTSJSONObject({ label: "5s", value: "5" }),
          new UTSJSONObject({ label: "10s", value: "10" }),
          new UTSJSONObject({ label: "20s", value: "20" }),
          new UTSJSONObject({ label: "30s", value: "30" }),
          new UTSJSONObject({ label: "停止刷新", value: "0" })
        ]
      ]);
      const refreshTimer = vue.ref(null);
      const isRefreshing = vue.ref(false);
      const popupRef = vue.ref(false);
      const psw = vue.ref("");
      const currentOperation = vue.ref(0);
      const modalTitle = vue.ref("验证密码");
      const userType = vue.ref("");
      const filterNonLatin = (value) => {
        psw.value = value.replace(/[^\x00-\x7F]/g, "");
      };
      const markers = vue.ref([]);
      const showDevicePopup = vue.ref(false);
      const currentDeviceInfo = vue.ref(new UTSJSONObject({
        deviceName: "",
        carNumber: "",
        deviceSerial: "",
        locationType: "",
        lngLat: "",
        updateTime: "",
        locationTime: "",
        speed: "",
        totalMileage: "",
        address: ""
      }));
      const currentCarInfo = vue.ref(new UTSJSONObject({}));
      const signalRssi = vue.ref(null);
      const signalSat = vue.ref(null);
      const carVoltage = vue.computed(() => {
        return currentCarInfo.value["voltage"];
      });
      const batteryPercent = vue.computed(() => {
        return datainfo.value["batteryPercent"];
      });
      const getBatteryColor = (batteryPercent2 = null) => {
        if (batteryPercent2 == null || batteryPercent2 == "")
          return "#c9c9c9";
        const batteryValue = parseFloat(batteryPercent2.toString());
        if (batteryValue >= 70) {
          return "#07C160";
        } else if (batteryValue >= 30) {
          return "#FF9C19";
        } else if (batteryValue >= 10) {
          return "#FF6B00";
        } else {
          return "#FF0000";
        }
      };
      function getSignalDetail(rssi = null) {
        if (rssi == null || rssi == "") {
          return new SignalDetail({
            experience: "无信号",
            quality: "无服务",
            color: "#999",
            level: 0
          });
        }
        const signalValue = parseFloat(rssi.toString());
        if (isNaN(signalValue)) {
          return new SignalDetail({
            experience: "信号数据无效",
            quality: "无服务",
            color: "#999",
            level: 0
          });
        }
        if (signalValue >= 26) {
          return new SignalDetail({
            experience: "极好",
            quality: "极强",
            color: "#07C160",
            level: 5
          });
        } else if (signalValue >= 20) {
          return new SignalDetail({
            experience: "良好",
            quality: "强",
            color: "#52c41a",
            level: 4
          });
        } else if (signalValue >= 15) {
          return new SignalDetail({
            experience: "一般",
            quality: "一般",
            color: "#faad14",
            level: 3
          });
        } else if (signalValue >= 10) {
          return new SignalDetail({
            experience: "差",
            quality: "较弱",
            color: "#fa8c16",
            level: 2
          });
        } else if (signalValue >= 1) {
          return new SignalDetail({
            experience: "非常差",
            quality: "微弱",
            color: "#f5222d",
            level: 1
          });
        } else {
          return new SignalDetail({
            experience: "无信号",
            quality: "无服务",
            color: "#999",
            level: 0
          });
        }
      }
      const getMobileSignalBarClass = (barIndex, rssi = null) => {
        if (rssi == null || rssi == "") {
          return "bar-off";
        }
        const signalValue = parseFloat(rssi.toString());
        if (isNaN(signalValue))
          return "bar-off";
        const signalDetail = getSignalDetail(signalValue);
        const level = signalDetail.level;
        return barIndex < level ? "bar-active" : "bar-off";
      };
      const createMarker = (id, lat, lng, type, title = null) => {
        const connectionStatus = datainfo.value["connectionStatus"];
        const carType = currentCarInfo.value["carType"];
        const marker = {
          id,
          latitude: lat,
          longitude: lng,
          width: 25,
          height: 25,
          iconPath: getDeviceIcon(connectionStatus !== null && connectionStatus !== void 0 ? connectionStatus : "", carType !== null && carType !== void 0 ? carType : ""),
          callout: new UTSJSONObject({
            content: title || "爱车位置",
            color: connectionStatus == "online" ? "#fff" : "#666",
            borderRadius: 10,
            bgColor: connectionStatus == "online" ? "#07C160" : "#ccc",
            padding: 5,
            display: "ALWAYS"
          })
        };
        return marker;
      };
      const delay = (ms) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      };
      const loadData = (data, retryCount) => {
        return __awaiter(this, void 0, void 0, function* () {
          signalRssi.value = null;
          signalSat.value = null;
          let retry = retryCount;
          const tryLoad = (attempt) => {
            return __awaiter(this, void 0, void 0, function* () {
              var e_1, _a2;
              try {
                const res = yield getDevicePos(data);
                if (!res || !res.data || res.data.length == 0) {
                  throw new Error("返回数据为空");
                }
                let foundDevice = false;
                try {
                  for (var _b = __values(res.data), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var item = _c.value;
                    const itemImei = item.getString("imei", "");
                    if (itemImei != null && itemImei == imei.value) {
                      foundDevice = true;
                      datainfo.value = item;
                      const attribute = item["attribute"];
                      signalRssi.value = attribute != null ? attribute["rssi"] : null;
                      signalSat.value = attribute != null ? attribute["sat"] : null;
                      const latitude = item.getNumber("latitude", 0);
                      const longitude = item.getNumber("longitude", 0);
                      if (latitude == null || longitude == null || latitude.toString().length == 0 || longitude.toString().length == 0) {
                        uni.__log__("error", "at pages/carInfoDetail/carInfoDetail.uvue:358", "位置信息缺失", item);
                        showAppToast({
                          title: "位置信息缺失",
                          icon: "none"
                        });
                        return false;
                      }
                      const lat = parseFloat(latitude.toString());
                      const lng = parseFloat(longitude.toString());
                      if (isNaN(lat) || isNaN(lng)) {
                        uni.__log__("error", "at pages/carInfoDetail/carInfoDetail.uvue:371", "经纬度格式错误", latitude, longitude);
                        return false;
                      }
                      let convertedLat = lat;
                      let convertedLng = lng;
                      try {
                        const coord = CoordTransform.wgs84ToTencent(lat, lng);
                        convertedLat = coord.lat;
                        convertedLng = coord.lng;
                      } catch (transformError) {
                        uni.__log__("error", "at pages/carInfoDetail/carInfoDetail.uvue:383", "坐标转换失败:", transformError);
                      }
                      center.latitude = convertedLat;
                      center.longitude = convertedLng;
                      yield delay(50);
                      const deviceMarker = createMarker(1, convertedLat, convertedLng, "device", currentCarInfo.value["deviceName"]);
                      markers.value = [];
                      yield delay(50);
                      markers.value = [deviceMarker];
                      const connectionStatus = item["connectionStatus"];
                      if (connectionStatus != "online" && refreshTimer.value !== null) {
                        const timer = refreshTimer.value;
                        if (timer !== null) {
                          clearInterval(timer);
                        }
                        refreshTimer.value = null;
                        isRefreshing.value = false;
                        showAppToast({
                          title: "设备已离线，停止自动刷新",
                          icon: "none"
                        });
                      }
                      if (signalRssi.value != null) {
                        const signalExp = getSignalDetail(signalRssi.value).experience;
                        if (signalExp === "差" || signalExp === "非常差" || signalExp === "无信号") {
                          uni.__log__("warn", "at pages/carInfoDetail/carInfoDetail.uvue:425", "设备 ".concat(imei.value, " 信号较弱: ").concat(signalRssi.value, "dBm"));
                        }
                      }
                    }
                  }
                } catch (e_1_1) {
                  e_1 = { error: e_1_1 };
                } finally {
                  try {
                    if (_c && !_c.done && (_a2 = _b.return))
                      _a2.call(_b);
                  } finally {
                    if (e_1)
                      throw e_1.error;
                  }
                }
                if (!foundDevice) {
                  throw new Error("未找到对应的设备数据");
                }
                return true;
              } catch (error) {
                uni.__log__("error", "at pages/carInfoDetail/carInfoDetail.uvue:439", "第".concat(attempt, "次加载设备数据失败:"), error);
                if (attempt < retry) {
                  const delayMs = Math.pow(2, attempt) * 1e3;
                  uni.__log__("log", "at pages/carInfoDetail/carInfoDetail.uvue:445", "等待".concat(delayMs / 1e3, "秒后重试..."));
                  yield delay(delayMs);
                  return false;
                } else {
                  showAppToast({
                    title: "数据加载失败，请稍后重试",
                    icon: "none",
                    duration: 2e3
                  });
                  if (datainfo.value.connectionStatus == "online" && refreshTimer.value !== null) {
                    const timer = refreshTimer.value;
                    if (timer !== null) {
                      clearInterval(timer);
                    }
                    refreshTimer.value = null;
                    isRefreshing.value = false;
                    showAppToast({
                      title: "数据加载失败，停止自动刷新",
                      icon: "none"
                    });
                  }
                  return false;
                }
              }
            });
          };
          return tryLoad(1);
        });
      };
      const manualRefresh = () => {
        return __awaiter(this, void 0, void 0, function* () {
          uni.showLoading(new UTSJSONObject({
            title: "刷新中...",
            mask: true
          }));
          try {
            const success = yield loadData(new UTSJSONObject({
              deptId: deptId.value,
              deviceids: imei.value
            }), 3);
            if (success) {
              showAppToast({
                title: "刷新成功",
                icon: "success"
              });
            } else {
              showAppToast({
                title: "刷新失败",
                icon: "none"
              });
            }
          } catch (error) {
            uni.__log__("error", "at pages/carInfoDetail/carInfoDetail.uvue:507", "手动刷新失败:", error);
            showAppToast({
              title: "刷新失败",
              icon: "none"
            });
          } finally {
            uni.hideLoading();
          }
        });
      };
      const setupAutoRefresh = (intervalValue) => {
        if (refreshTimer.value !== null) {
          const timer = refreshTimer.value;
          if (timer !== null) {
            clearInterval(timer);
          }
          refreshTimer.value = null;
          isRefreshing.value = false;
        }
        if (intervalValue == "0") {
          isRefreshing.value = false;
          return null;
        }
        if (datainfo.value.connectionStatus != "online") {
          isRefreshing.value = false;
          return null;
        }
        const intervalSeconds = parseInt(intervalValue);
        if (intervalSeconds > 0) {
          isRefreshing.value = true;
          const intervalMs = intervalSeconds * 1e3;
          loadData(new UTSJSONObject({
            deptId: deptId.value,
            deviceids: imei.value
          }), 3);
          refreshTimer.value = setInterval(() => {
            loadData(new UTSJSONObject({
              deptId: deptId.value,
              deviceids: imei.value
            }), 3);
          }, intervalMs);
        }
      };
      vue.watch(currentTime, (newVal) => {
        setupAutoRefresh(newVal);
      });
      const stopAutoRefresh = () => {
        if (refreshTimer.value !== null) {
          const timer = refreshTimer.value;
          if (timer !== null) {
            clearInterval(timer);
          }
          refreshTimer.value = null;
          isRefreshing.value = false;
        }
      };
      const baseList = vue.computed(() => {
        const list = [new UTSJSONObject({
          image: "/static/gjhf.png",
          text: "轨迹回放"
        }), new UTSJSONObject({
          image: "/static/clgz.png",
          text: "车辆跟踪"
        }), new UTSJSONObject({
          image: "/static/lcjl.png",
          text: "里程记录"
        }), new UTSJSONObject({
          image: "/static/tcjl.png",
          text: "停车记录"
        }), new UTSJSONObject({
          image: "/static/dzwl.png",
          text: "电子围栏"
        }), new UTSJSONObject({
          image: "/static/navto.png",
          text: "一键寻车"
        }), new UTSJSONObject({
          image: "/static/power.png",
          text: "恢复油电"
        }), new UTSJSONObject({
          image: "/static/offpower.png",
          text: "断开油电"
        })];
        const productId = currentCarInfo.value.productId;
        if (productId === "product-1141811865601576960" || productId === "product-1183161303028600832") {
          list.push(new UTSJSONObject({
            image: "/static/cmd.png",
            text: "发送指令"
          }));
        }
        return list;
      });
      function executeOperation(operationType) {
        return __awaiter(this, void 0, void 0, function* () {
          let predictCmdId = 0;
          let type = 0;
          if (operationType == 1) {
            predictCmdId = 2;
            type = 2;
          } else if (operationType == 2) {
            predictCmdId = 1;
            type = 1;
          } else {
            showAppToast({
              title: "操作类型错误",
              icon: "none"
            });
            return Promise.resolve(null);
          }
          try {
            uni.showLoading(new UTSJSONObject({
              title: "执行中...",
              mask: true
            }));
            const res = yield sendCommand(new UTSJSONObject({
              imei: imei.value,
              password: userType.value == "1" ? psw.value : "",
              params: ["1111"],
              predictCmdId,
              type
            }));
            uni.hideLoading();
            if (res.code == 0) {
              showAppToast({
                title: operationType == 1 ? "恢复油电成功" : "断开油电成功",
                icon: "success"
              });
              psw.value = "";
            } else {
              showAppToast({
                title: res.msg.length > 0 ? res.msg : "操作失败",
                icon: "none"
              });
            }
          } catch (error) {
            uni.hideLoading();
            uni.__log__("error", "at pages/carInfoDetail/carInfoDetail.uvue:685", "操作失败:", error);
            showAppToast({
              title: "操作失败，请重试",
              icon: "none"
            });
          }
        });
      }
      const confirm = () => {
        return __awaiter(this, void 0, void 0, function* () {
          if (userType.value == "1" && psw.value == "") {
            showAppToast({
              title: "请输入密码",
              icon: "none"
            });
            return Promise.resolve(null);
          }
          executeOperation(currentOperation.value);
        });
      };
      const carDetail = () => {
        stopAutoRefresh();
        uni.navigateTo({
          url: "/pages/userCenter/carDetail/carDetail?deviceId=" + deviceId.value
        });
      };
      const refreshAdress = () => {
        return __awaiter(this, void 0, void 0, function* () {
          try {
            const addr = yield getAddress(center.latitude, center.longitude);
            address.value = addr.result.formatted_address;
          } catch (error) {
            uni.__log__("error", "at pages/carInfoDetail/carInfoDetail.uvue:721", "获取地址信息失败:", error);
          }
        });
      };
      function navTo() {
        return __awaiter(this, void 0, void 0, function* () {
          if (!address.value) {
            yield refreshAdress();
          }
          uni.openLocation({
            latitude: center.latitude,
            longitude: center.longitude,
            name: address.value || "当前位置",
            scale: 18,
            success: () => {
              showAppToast({
                title: "成功调起地图",
                icon: "none"
              });
            },
            fail: (err) => {
              showAppToast({
                title: "调起地图失败",
                icon: "none"
              });
              uni.__log__("error", "at pages/carInfoDetail/carInfoDetail.uvue:746", "调起地图失败:", err);
            }
          });
        });
      }
      const handleGridClick = (event = null) => {
        const name = event;
        const itemTo = name.text;
        if (itemTo == "轨迹回放") {
          stopAutoRefresh();
          uni.navigateTo({
            url: "/pages/playBack/playBack?imei=" + imei.value + "&connectionStatus=" + datainfo.value.connectionStatus + "&plateNo=" + currentCarInfo.value.deviceName + "&carType=" + currentCarInfo.value.carType + "&lat=" + datainfo.value.latitude + "&lng=" + datainfo.value.longitude
          });
        }
        if (itemTo == "车辆跟踪") {
          stopAutoRefresh();
          uni.navigateTo({
            url: "/pages/vehicleTracking/vehicleTracking?imei=" + imei.value + "&deptId=" + deptId.value + "&connectionStatus=" + datainfo.value.connectionStatus + "&plateNo=" + currentCarInfo.value.deviceName + "&carType=" + currentCarInfo.value.carType
          });
        }
        if (itemTo == "里程记录") {
          stopAutoRefresh();
          uni.navigateTo({
            url: "/pages/mileageRecord/mileageRecord?imei=" + imei.value + "&connectionStatus=" + datainfo.value.connectionStatus + "&plateNo=" + currentCarInfo.value.deviceName + "&carType=" + currentCarInfo.value.carType
          });
        }
        if (itemTo == "停车记录") {
          stopAutoRefresh();
          uni.navigateTo({
            url: "/pages/stopRecord/stopRecord?imei=" + imei.value + "&deptId=" + deptId.value
          });
        }
        if (itemTo == "恢复油电") {
          if (userType.value == "1") {
            psw.value = "";
            currentOperation.value = 1;
            modalTitle.value = "验证密码";
            popupRef.value = true;
          } else {
            executeOperation(1);
          }
        }
        if (itemTo == "断开油电") {
          if (userType.value == "1") {
            psw.value = "";
            currentOperation.value = 2;
            modalTitle.value = "验证密码";
            popupRef.value = true;
          } else {
            executeOperation(2);
          }
        }
        if (itemTo == "电子围栏") {
          stopAutoRefresh();
          uni.navigateTo({
            url: "/pages/geofencing/geofencing?imei=" + imei.value + "&connectionStatus=" + datainfo.value.connectionStatus + "&plateNo=" + currentCarInfo.value.deviceName + "&carType=" + currentCarInfo.value.carType + "&deptId=" + deptId.value + "&deviceName=" + currentCarInfo.value.deviceName
          });
        }
        if (itemTo == "一键寻车") {
          navTo();
        }
        if (itemTo == "发送指令") {
          stopAutoRefresh();
          uni.navigateTo({
            url: "/pages/cmd/cmd?imei=" + imei.value
          });
        }
      };
      const loadDeviceDetail = () => {
        return __awaiter(this, void 0, void 0, function* () {
          if (deviceId.value !== null) {
            const res = yield getDeviceDetail(deviceId.value);
            currentCarInfo.value = res.data;
          } else {
            uni.__log__("error", "at pages/carInfoDetail/carInfoDetail.uvue:829", "设备id获取失败");
          }
        });
      };
      vue.onLoad((option) => {
        deptId.value = option.deptId;
        imei.value = option.imei;
        deviceId.value = option.deviceId;
        const storedUserType = uni.getStorageSync("userType");
        userType.value = storedUserType !== null && storedUserType !== void 0 ? storedUserType : "";
        loadDeviceDetail().then(() => {
          const data = new UTSJSONObject({
            deptId: deptId.value,
            deviceids: imei.value
          });
          uni.showLoading(new UTSJSONObject({ title: "加载中..." }));
          loadData(data, 3).then((success) => {
            uni.hideLoading();
            if (success && datainfo.value.connectionStatus == "online") {
              setupAutoRefresh(currentTime.value);
            }
          });
        });
      });
      vue.onShow(() => {
        uni.__log__("log", "at pages/carInfoDetail/carInfoDetail.uvue:863", "页面显示，检查自动刷新状态");
        if (datainfo.value.connectionStatus == "online" && !isRefreshing.value) {
          setupAutoRefresh(currentTime.value);
        }
      });
      vue.onHide(() => {
        uni.__log__("log", "at pages/carInfoDetail/carInfoDetail.uvue:872", "页面隐藏时停止自动刷新");
        stopAutoRefresh();
      });
      vue.onUnmounted(() => {
        uni.__log__("log", "at pages/carInfoDetail/carInfoDetail.uvue:877", "页面卸载时停止自动刷新");
        stopAutoRefresh();
      });
      const __returned__ = { deptId, imei, deviceId, center, mapScale, datainfo, address, currentTime, onCurrentTimeChange, times, refreshTimer, isRefreshing, popupRef, psw, currentOperation, modalTitle, userType, filterNonLatin, markers, showDevicePopup, currentDeviceInfo, currentCarInfo, signalRssi, signalSat, carVoltage, batteryPercent, getBatteryColor, getSignalDetail, getMobileSignalBarClass, createMarker, delay, loadData, manualRefresh, setupAutoRefresh, stopAutoRefresh, baseList, executeOperation, confirm, carDetail, refreshAdress, navTo, handleGridClick, loadDeviceDetail };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  const _imports_0$1 = "/static/sate.png";
  const _imports_1$1 = "/static/v.png";
  const _imports_2$1 = "/static/pow.png";
  const _style_0$t = { "container": { "": { "position": "relative", "width": "100%", "height": "100%", "display": "flex", "flexDirection": "column", "backgroundColor": "#f5f7fa" } }, "map-container": { ".container ": { "flexGrow": 1, "flexShrink": 1, "flexBasis": "0%", "width": "100%", "position": "relative" } }, "sub-nav-overlay": { ".container .map-container ": { "position": "absolute", "top": 0, "left": 0, "right": 0, "zIndex": 100 } }, "drag-hint": { ".container .map-container ": { "position": "absolute", "top": "20rpx", "left": 0, "right": 0, "zIndex": 100, "backgroundColor": "rgba(255,255,255,0.9)", "paddingTop": "16rpx", "paddingRight": "16rpx", "paddingBottom": "16rpx", "paddingLeft": "16rpx", "textAlign": "center", "fontSize": "28rpx", "color": "#00aa00", "fontWeight": "bold", "boxShadow": "0 4rpx 10rpx rgba(0, 0, 0, 0.1)" } }, "navTo": { ".container .map-container ": { "width": "60rpx", "height": "60rpx", "backgroundColor": "#ffffff", "borderTopLeftRadius": "10rpx", "borderTopRightRadius": "10rpx", "borderBottomRightRadius": "10rpx", "borderBottomLeftRadius": "10rpx", "position": "absolute", "zIndex": 100, "bottom": "10%", "right": "30rpx", "paddingTop": "5rpx", "paddingRight": "5rpx", "paddingBottom": "5rpx", "paddingLeft": "5rpx" } }, "tool-nav": { ".container ": { "position": "absolute", "top": "200rpx", "right": "20rpx", "zIndex": 100 } }, "btn-map-list": { ".container .tool-nav ": { "width": "60rpx", "height": "60rpx" } }, "btn-map-list-icon": { ".container .tool-nav ": { "width": "100%", "height": "100%", "paddingTop": "8rpx", "paddingRight": "8rpx", "paddingBottom": "8rpx", "paddingLeft": "8rpx", "borderTopLeftRadius": "10rpx", "borderTopRightRadius": "10rpx", "borderBottomRightRadius": "10rpx", "borderBottomLeftRadius": "10rpx", "backgroundColor": "#69c2f1" } }, "tool-more": { ".container ": { "position": "absolute", "top": "30%", "right": "20rpx", "zIndex": 100, "width": "60rpx", "height": "60rpx" } }, "btn-tool-more-icon": { ".container .tool-more ": { "width": "100%", "height": "100%" } }, "tools-panel": { ".container ": { "width": "100%", "backgroundColor": "#ffffff", "paddingBottom": "70rpx" } }, "refresh-status": { ".container .tools-panel ": { "display": "flex", "alignItems": "center", "paddingTop": "20rpx", "paddingRight": "30rpx", "paddingBottom": "20rpx", "paddingLeft": "30rpx", "backgroundImage": "none", "backgroundColor": "#f8f9fa", "borderBottomWidth": "1rpx", "borderBottomStyle": "solid", "borderBottomColor": "#e8e8e8" } }, "refresh-text": { ".container .tools-panel .refresh-status ": { "fontSize": "26rpx", "color": "#666666" }, ".container .tools-panel .refresh-status .refreshing": { "color": "#1890ff" } }, "refresh-btn": { ".container .tools-panel .refresh-status ": { "marginLeft": "auto", "color": "#1890ff", "fontSize": "26rpx" } }, "Imei-box": { ".container .tools-panel ": { "marginTop": "30rpx", "marginRight": "30rpx", "marginBottom": 0, "marginLeft": "30rpx", "fontSize": "28rpx", "borderBottomWidth": "1rpx", "borderBottomStyle": "solid", "borderBottomColor": "#dcdfe6" } }, "imei-info": { ".container .tools-panel .Imei-box ": { "display": "flex", "flexDirection": "row", "justifyContent": "space-between", "alignItems": "center" } }, "imeis": { ".container .tools-panel .Imei-box .imei-info ": { "display": "flex", "flexDirection": "row", "justifyContent": "flex-start", "alignItems": "center" } }, "pos-time": { ".container .tools-panel .Imei-box ": { "fontSize": "20rpx", "color": "#999999", "marginLeft": "30rpx" } }, "pos-date": { ".container .tools-panel .Imei-box ": { "display": "flex", "flexDirection": "row", "justifyContent": "space-between", "alignItems": "center" } }, "pos-adress": { ".container .tools-panel .Imei-box ": { "display": "flex", "flexDirection": "row", "justifyContent": "space-between", "alignItems": "center" } }, "addree-box": { ".container .tools-panel .Imei-box .pos-date ": { "display": "flex", "flexDirection": "row", "justifyContent": "flex-start", "alignItems": "center", "fontSize": "22rpx", "marginTop": "20rpx", "marginRight": 0, "marginBottom": 0, "marginLeft": 0, "color": "#999999" }, ".container .tools-panel .Imei-box .pos-adress ": { "display": "flex", "flexDirection": "row", "justifyContent": "flex-start", "alignItems": "center", "fontSize": "22rpx", "marginTop": "20rpx", "marginRight": 0, "marginBottom": 0, "marginLeft": 0, "color": "#999999" } }, "address-text": { ".container .tools-panel .Imei-box .pos-date .addree-box ": { "fontSize": "22rpx", "maxWidth": "490rpx", "lineHeight": 1.4 }, ".container .tools-panel .Imei-box .pos-adress .addree-box ": { "fontSize": "22rpx", "maxWidth": "490rpx", "lineHeight": 1.4 } }, "pos-icon": { ".container .tools-panel .Imei-box .pos-date .addree-box ": { "width": "30rpx", "height": "30rpx", "marginRight": "10rpx" }, ".container .tools-panel .Imei-box .pos-adress .addree-box ": { "width": "30rpx", "height": "30rpx", "marginRight": "10rpx" } }, "signal-container": { ".container .tools-panel .Imei-box ": { "display": "flex", "flexDirection": "row", "alignItems": "center", "paddingTop": "20rpx", "paddingRight": 0, "paddingBottom": "20rpx", "paddingLeft": 0 } }, "signal-item": { ".container .tools-panel .Imei-box .signal-container ": { "display": "flex", "flexDirection": "row", "alignItems": "center", "marginRight": "10rpx" } }, "mobile-signal": { ".container .tools-panel .Imei-box .signal-container .signal-item ": { "display": "flex", "flexDirection": "row", "alignItems": "center", "justifyContent": "center", "backgroundImage": "none", "backgroundColor": "#f0f8ff", "paddingTop": "10rpx", "paddingRight": "20rpx", "paddingBottom": "10rpx", "paddingLeft": "20rpx", "borderTopLeftRadius": "10rpx", "borderTopRightRadius": "10rpx", "borderBottomRightRadius": "10rpx", "borderBottomLeftRadius": "10rpx" } }, "signal-bars-horizontal": { ".container .tools-panel .Imei-box .signal-container .signal-item .mobile-signal ": { "display": "flex", "flexDirection": "row", "alignItems": "flex-end", "height": "40rpx", "marginRight": "5rpx" } }, "signal-bar-h": { ".container .tools-panel .Imei-box .signal-container .signal-item .mobile-signal .signal-bars-horizontal ": { "width": "8rpx", "marginRight": "3rpx", "borderTopLeftRadius": "2rpx", "borderTopRightRadius": "2rpx", "borderBottomRightRadius": 0, "borderBottomLeftRadius": 0, "transitionProperty": "all", "transitionDuration": "0.3s", "transitionTimingFunction": "ease" }, ".container .tools-panel .Imei-box .signal-container .signal-item .mobile-signal .signal-bars-horizontal .signal-bar-h-1": { "height": "12rpx" }, ".container .tools-panel .Imei-box .signal-container .signal-item .mobile-signal .signal-bars-horizontal .signal-bar-h-2": { "height": "16rpx" }, ".container .tools-panel .Imei-box .signal-container .signal-item .mobile-signal .signal-bars-horizontal .signal-bar-h-3": { "height": "20rpx" }, ".container .tools-panel .Imei-box .signal-container .signal-item .mobile-signal .signal-bars-horizontal .signal-bar-h-4": { "height": "24rpx" }, ".container .tools-panel .Imei-box .signal-container .signal-item .mobile-signal .signal-bars-horizontal .signal-bar-h-5": { "height": "28rpx" } }, "signal-info-h": { ".container .tools-panel .Imei-box .signal-container .signal-item .mobile-signal ": { "display": "flex", "flexDirection": "column", "justifyContent": "center", "alignItems": "center" } }, "signal-value": { ".container .tools-panel .Imei-box .signal-container .signal-item .mobile-signal .signal-info-h ": { "fontSize": "18rpx", "color": "#333333" } }, "experience": { ".container .tools-panel .Imei-box .signal-container .signal-item .mobile-signal .signal-info-h ": { "fontSize": "18rpx", "fontWeight": "normal" } }, "satellite-item-h": { ".container .tools-panel .Imei-box .signal-container ": { "display": "flex", "flexDirection": "row", "alignItems": "center", "backgroundImage": "none", "backgroundColor": "#f0f8ff", "paddingTop": "10rpx", "paddingRight": "20rpx", "paddingBottom": "10rpx", "paddingLeft": "20rpx", "borderTopLeftRadius": "10rpx", "borderTopRightRadius": "10rpx", "borderBottomRightRadius": "10rpx", "borderBottomLeftRadius": "10rpx" } }, "satellite-icon": { ".container .tools-panel .Imei-box .signal-container .satellite-item-h ": { "width": "47rpx", "height": "47rpx", "marginRight": "10rpx" } }, "satellite-text": { ".container .tools-panel .Imei-box .signal-container .satellite-item-h ": { "fontSize": "24rpx", "color": "#1890ff", "fontWeight": "bold" } }, "power-icon": { ".container .tools-panel .Imei-box .signal-container ": { "width": "47rpx", "height": "47rpx", "marginRight": "10rpx" } }, "battery-icon": { ".container .tools-panel .Imei-box .signal-container ": { "width": "47rpx", "height": "47rpx", "marginRight": "10rpx" } }, "power": { ".container .tools-panel .Imei-box .signal-container ": { "display": "flex", "flexDirection": "row", "alignItems": "center", "fontSize": "24rpx", "backgroundImage": "none", "backgroundColor": "#f0f8ff", "paddingTop": "10rpx", "paddingRight": "20rpx", "paddingBottom": "10rpx", "paddingLeft": "20rpx", "borderTopLeftRadius": "10rpx", "borderTopRightRadius": "10rpx", "borderBottomRightRadius": "10rpx", "borderBottomLeftRadius": "10rpx" } }, "battery": { ".container .tools-panel .Imei-box .signal-container ": { "display": "flex", "flexDirection": "row", "alignItems": "center", "fontSize": "24rpx", "backgroundImage": "none", "backgroundColor": "#f0f8ff", "paddingTop": "10rpx", "paddingRight": "20rpx", "paddingBottom": "10rpx", "paddingLeft": "20rpx", "borderTopLeftRadius": "10rpx", "borderTopRightRadius": "10rpx", "borderBottomRightRadius": "10rpx", "borderBottomLeftRadius": "10rpx" } }, "h-line": { ".container .tools-panel ": { "width": "90%", "height": "2rpx", "backgroundColor": "#f1f1f1", "marginTop": "50rpx", "marginRight": "auto", "marginBottom": 0, "marginLeft": "auto" } }, "tool-tag-item": { ".container .tools-panel ": { "display": "flex", "flexDirection": "row", "justifyContent": "space-between", "alignItems": "center", "paddingTop": "50rpx", "paddingRight": "20rpx", "paddingBottom": "50rpx", "paddingLeft": "20rpx" } }, "speed-control": { ".container .tools-panel ": { "paddingTop": "20rpx", "paddingRight": "20rpx", "paddingBottom": "20rpx", "paddingLeft": "20rpx" } }, "slider": { ".container .tools-panel .speed-control ": { "width": "90%", "marginTop": 0, "marginRight": "auto", "marginBottom": 0, "marginLeft": "auto" } }, "grid-text": { ".container .tools-panel ": { "paddingTop": "10rpx", "paddingRight": 0, "paddingBottom": 0, "paddingLeft": 0, "boxSizing": "border-box", "fontSize": "24rpx" } }, "@TRANSITION": { "signal-bar-h": { "property": "all", "duration": "0.3s", "timingFunction": "ease" } } };
  function _sfc_render$t(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_custom_navBar = resolveEasycom(vue.resolveDynamicComponent("custom-navBar"), __easycom_0$5);
    const _component_map = vue.resolveComponent("map");
    const _component_sub_navBar = resolveEasycom(vue.resolveDynamicComponent("sub-navBar"), __easycom_1$1);
    const _component_i_icon = resolveEasycom(vue.resolveDynamicComponent("i-icon"), __easycom_2$6);
    const _component_i_grid = resolveEasycom(vue.resolveDynamicComponent("i-grid"), __easycom_0$4);
    const _component_i_input = resolveEasycom(vue.resolveDynamicComponent("i-input"), __easycom_1$2);
    const _component_i_modal = resolveEasycom(vue.resolveDynamicComponent("i-modal"), __easycom_1$3);
    const _component_app_toast = resolveEasycom(vue.resolveDynamicComponent("app-toast"), __easycom_3$3);
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.createElementVNode("view", { class: "container" }, [
          vue.createVNode(_component_custom_navBar, {
            title: "详情",
            "show-back": true,
            backgroundColor: "#fff",
            textColor: "#333",
            showCapsule: false
          }),
          vue.createElementVNode("view", { class: "map-container" }, [
            vue.createVNode(_component_map, {
              id: "myMap",
              latitude: $setup.center.latitude,
              longitude: $setup.center.longitude,
              markers: $setup.markers,
              scale: $setup.mapScale,
              style: { "width": "100%", "height": "100%" },
              "show-location": false,
              "enable-traffic": true,
              "enable-overlooking": true,
              "enable-building": true,
              "enable-3D": true
            }, null, 8, ["latitude", "longitude", "markers", "scale"]),
            vue.createVNode(_component_sub_navBar, {
              class: "sub-nav-overlay",
              currentTime: $setup.currentTime,
              showTime: true,
              showPickerTime: false,
              "onUpdate:currentTime": $setup.onCurrentTimeChange,
              currentCar: $setup.currentCarInfo.deviceName,
              times: $setup.times,
              carStatus: $setup.datainfo.connectionStatus,
              showPicker: false,
              showCar: true
            }, null, 8, ["currentTime", "currentCar", "times", "carStatus"])
          ]),
          vue.createElementVNode("view", { class: "tools-panel" }, [
            vue.createElementVNode("view", { class: "Imei-box" }, [
              vue.createElementVNode("view", {
                class: "imei-info",
                onClick: $setup.carDetail
              }, [
                vue.createElementVNode("view", { class: "imeis" }, [
                  vue.createElementVNode(
                    "text",
                    null,
                    "ID: " + vue.toDisplayString($setup.imei),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode("text", { class: "pos-time" })
                ]),
                vue.createVNode(_component_i_icon, {
                  name: "/static/arrow-right.png",
                  fontSize: "16"
                })
              ]),
              vue.createElementVNode("view", { class: "pos-date" }, [
                vue.createElementVNode(
                  "text",
                  { class: "addree-box" },
                  "定位时间: " + vue.toDisplayString($setup.datainfo.positionUpdateTime),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "text",
                  { class: "addree-box" },
                  "通信时间: " + vue.toDisplayString($setup.datainfo.signalUpdateTime),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "pos-adress" }, [
                vue.createElementVNode("view", { class: "addree-box" }, [
                  vue.createElementVNode("text", { style: { "margin-right": "10rpx", "font-size": "22rpx" } }, "当前位置:"),
                  $setup.address ? (vue.openBlock(), vue.createElementBlock(
                    "text",
                    {
                      key: 0,
                      class: "address-text"
                    },
                    vue.toDisplayString($setup.address),
                    1
                    /* TEXT */
                  )) : (vue.openBlock(), vue.createElementBlock(
                    "text",
                    {
                      key: 1,
                      class: "address-text"
                    },
                    vue.toDisplayString($setup.center.latitude) + " , " + vue.toDisplayString($setup.center.longitude),
                    1
                    /* TEXT */
                  )),
                  !$setup.address ? (vue.openBlock(), vue.createElementBlock("text", {
                    key: 2,
                    style: { "color": "#007AFF", "margin-left": "20rpx", "font-weight": "bold", "font-size": "22rpx" },
                    onClick: $setup.refreshAdress
                  }, "中文地址")) : vue.createCommentVNode("v-if", true)
                ])
              ]),
              vue.createElementVNode("view", { class: "signal-container" }, [
                $setup.signalRssi != null ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 0,
                  class: "signal-item"
                }, [
                  vue.createElementVNode("view", { class: "mobile-signal" }, [
                    vue.createElementVNode("view", { class: "signal-bars-horizontal" }, [
                      vue.createElementVNode(
                        "view",
                        {
                          class: "signal-bar-h signal-bar-h-1",
                          style: vue.normalizeStyle({ backgroundColor: $setup.getMobileSignalBarClass(0, $setup.signalRssi) == "bar-active" ? $setup.getSignalDetail($setup.signalRssi).color : "#e8e8e8" })
                        },
                        null,
                        4
                        /* STYLE */
                      ),
                      vue.createElementVNode(
                        "view",
                        {
                          class: "signal-bar-h signal-bar-h-2",
                          style: vue.normalizeStyle({ backgroundColor: $setup.getMobileSignalBarClass(1, $setup.signalRssi) == "bar-active" ? $setup.getSignalDetail($setup.signalRssi).color : "#e8e8e8" })
                        },
                        null,
                        4
                        /* STYLE */
                      ),
                      vue.createElementVNode(
                        "view",
                        {
                          class: "signal-bar-h signal-bar-h-3",
                          style: vue.normalizeStyle({ backgroundColor: $setup.getMobileSignalBarClass(2, $setup.signalRssi) == "bar-active" ? $setup.getSignalDetail($setup.signalRssi).color : "#e8e8e8" })
                        },
                        null,
                        4
                        /* STYLE */
                      ),
                      vue.createElementVNode(
                        "view",
                        {
                          class: "signal-bar-h signal-bar-h-4",
                          style: vue.normalizeStyle({ backgroundColor: $setup.getMobileSignalBarClass(3, $setup.signalRssi) == "bar-active" ? $setup.getSignalDetail($setup.signalRssi).color : "#e8e8e8" })
                        },
                        null,
                        4
                        /* STYLE */
                      ),
                      vue.createElementVNode(
                        "view",
                        {
                          class: "signal-bar-h signal-bar-h-5",
                          style: vue.normalizeStyle({ backgroundColor: $setup.getMobileSignalBarClass(4, $setup.signalRssi) == "bar-active" ? $setup.getSignalDetail($setup.signalRssi).color : "#e8e8e8" })
                        },
                        null,
                        4
                        /* STYLE */
                      )
                    ]),
                    vue.createElementVNode("view", { class: "signal-info-h" }, [
                      vue.createElementVNode(
                        "text",
                        {
                          class: "experience",
                          style: vue.normalizeStyle({ color: $setup.getSignalDetail($setup.signalRssi).color })
                        },
                        vue.toDisplayString($setup.getSignalDetail($setup.signalRssi).experience),
                        5
                        /* TEXT, STYLE */
                      ),
                      vue.createElementVNode(
                        "text",
                        {
                          class: "signal-value",
                          style: vue.normalizeStyle({ color: $setup.getSignalDetail($setup.signalRssi).color })
                        },
                        "CSQ " + vue.toDisplayString($setup.signalRssi),
                        5
                        /* TEXT, STYLE */
                      )
                    ])
                  ])
                ])) : vue.createCommentVNode("v-if", true),
                $setup.signalSat != null ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 1,
                  class: "satellite-item-h"
                }, [
                  vue.createElementVNode("image", {
                    class: "satellite-icon",
                    src: _imports_0$1
                  }),
                  vue.createElementVNode(
                    "text",
                    { class: "satellite-text" },
                    vue.toDisplayString($setup.signalSat),
                    1
                    /* TEXT */
                  )
                ])) : vue.createCommentVNode("v-if", true),
                $setup.carVoltage ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 2,
                  class: "power"
                }, [
                  vue.createElementVNode("image", {
                    class: "power-icon",
                    src: _imports_1$1
                  }),
                  vue.createElementVNode(
                    "text",
                    null,
                    vue.toDisplayString($setup.carVoltage) + "V",
                    1
                    /* TEXT */
                  )
                ])) : vue.createCommentVNode("v-if", true),
                $setup.batteryPercent ? (vue.openBlock(), vue.createElementBlock(
                  "view",
                  {
                    key: 3,
                    class: "battery",
                    style: vue.normalizeStyle({ color: $setup.getBatteryColor($setup.batteryPercent) })
                  },
                  [
                    vue.createElementVNode("image", {
                      class: "battery-icon",
                      src: _imports_2$1,
                      alt: ""
                    }),
                    vue.createElementVNode(
                      "text",
                      null,
                      vue.toDisplayString($setup.batteryPercent) + "%",
                      1
                      /* TEXT */
                    )
                  ],
                  4
                  /* STYLE */
                )) : vue.createCommentVNode("v-if", true)
              ])
            ]),
            vue.createVNode(_component_i_grid, {
              items: $setup.baseList,
              col: 5,
              itemHeight: "88",
              round: "8",
              imageSize: 30,
              iconColor: "#3c9cff",
              textColor: "#606266",
              showBorder: true,
              onClick: _cache[0] || (_cache[0] = ($event) => $setup.handleGridClick($event))
            }, null, 8, ["items"])
          ]),
          vue.createElementVNode("view", null, [
            vue.createVNode(_component_i_modal, {
              show: $setup.popupRef,
              title: $setup.modalTitle,
              onConfirm: $setup.confirm
            }, {
              default: vue.withCtx(() => [
                vue.createElementVNode("view", null, [
                  vue.createVNode(_component_i_input, {
                    modelValue: $setup.psw,
                    "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.psw = $event),
                    onInput: $setup.filterNonLatin,
                    placeholder: "请输入密码",
                    clearable: "",
                    password: true
                  }, null, 8, ["modelValue"])
                ])
              ]),
              _: 1
              /* STABLE */
            }, 8, ["show", "title"])
          ])
        ]),
        vue.createVNode(_component_app_toast)
      ],
      64
      /* STABLE_FRAGMENT */
    );
  }
  const PagesCarInfoDetailCarInfoDetail = /* @__PURE__ */ _export_sfc(_sfc_main$u, [["render", _sfc_render$t], ["styles", [_style_0$t]], ["__file", "/Users/xyhc/Documents/carConnectInternet/pages/carInfoDetail/carInfoDetail.uvue"]]);
  const _sfc_main$t = /* @__PURE__ */ vue.defineComponent(Object.assign({ name: "i-popup" }, { __name: "i-popup", props: {
    show: { type: Boolean, default: false },
    overlay: { type: Boolean, default: true },
    mode: { type: String, default: "bottom" },
    position: { type: String, default: "" },
    title: { type: String, default: "" },
    showTitle: { type: Boolean, default: true },
    showClose: { type: Boolean, default: false },
    showFooter: { type: Boolean, default: false },
    showCancel: { type: Boolean, default: true },
    cancelText: { type: String, default: "" },
    confirmText: { type: String, default: "" },
    titleStyle: { type: [String, Object], default: "" },
    duration: { type: [String, Number], default: 300 },
    closeable: { type: Boolean, default: false },
    overlayStyle: { type: [String, Object], default: "" },
    overlayOpacity: { type: [String, Number], default: 0.5 },
    closeOnMask: { type: Boolean, default: true },
    overlayClick: { type: Boolean, default: true },
    overflayBgColor: { type: String, default: "" },
    zIndex: { type: [String, Number], default: 10075 },
    safeBottom: { type: Boolean, default: true },
    safeTop: { type: Boolean, default: false },
    closeIcon: { type: String, default: "close" },
    closeIconColor: { type: String, default: "#909399" },
    closeIconSize: { type: [String, Number], default: 18 },
    closeIconPos: { type: String, default: "top-right" },
    margin: { type: [String, Number], default: 0 },
    navbarHeight: { type: Number, default: 0 },
    round: { type: [String, Number], default: 16 },
    zoom: { type: Boolean, default: true },
    bgColor: { type: String, default: "#ffffff" },
    size: { type: [String, Number], default: "" },
    maxHeight: { type: [String, Number], default: "" },
    width: { type: [String, Number], default: "" },
    height: { type: [String, Number], default: "" },
    customStyle: { type: [String, Object], default: "" },
    customWrapStyle: { type: [String, Object], default: "" },
    customFooterStyle: { type: [String, Object], default: "" },
    contentMargin: { type: [String, Number], default: 16 },
    widthCoverCenter: { type: Boolean, default: false },
    offsetTop: { type: [String, Number], default: "0" },
    offsetBottom: { type: [String, Number], default: "0" },
    lazy: { type: Boolean, default: false },
    disabledScroll: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    disabledConfirm: { type: Boolean, default: false },
    btnColor: { type: String, default: "" },
    swipeClose: { type: Boolean, default: false },
    swipeHandle: { type: Boolean, default: true },
    contentDraggable: { type: Boolean, default: true },
    swipeCloseThreshold: { type: [String, Number], default: 50 }
  }, emits: [
    "click",
    "open",
    "close",
    "beforeOpen",
    "beforeClose",
    "cancel",
    "confirm",
    "update:show"
  ], setup(__props, _a) {
    var __expose = _a.expose, __emit = _a.emit;
    const props = __props;
    const emit = __emit;
    const bgColor = vue.computed(() => {
      return props.bgColor;
    });
    const opened = vue.ref(props.show);
    const active = vue.ref(props.show);
    const contentReady = vue.ref(!props.lazy || props.show);
    const startX = vue.ref(0);
    const startY = vue.ref(0);
    const offsetX = vue.ref(0);
    const offsetY = vue.ref(0);
    const touching = vue.ref(false);
    let closeTimer = 0;
    let lazyTimer = 0;
    const drawerPosition = vue.computed(() => {
      if (props.position.length > 0)
        return props.position;
      return props.mode;
    });
    const normalizedMode = vue.computed(() => {
      if (drawerPosition.value == "left" || drawerPosition.value == "right" || drawerPosition.value == "top" || drawerPosition.value == "center") {
        return drawerPosition.value;
      }
      return "bottom";
    });
    function shouldCoverCenter() {
      return props.widthCoverCenter && (normalizedMode.value == "top" || normalizedMode.value == "bottom") && props.width.toString().length > 0;
    }
    function stringifyStyle(value = null) {
      if (value == null)
        return "";
      const text = value.toString();
      if (text == "[object Object]")
        return "";
      if (text.length == 0)
        return "";
      return text.endsWith(";") ? text : text + ";";
    }
    function formatMs(value = null) {
      const text = value.toString();
      if (text.indexOf("ms") >= 0 || text.indexOf("s") >= 0)
        return text;
      return text + "ms";
    }
    function formatSize(value = null) {
      const text = value.toString();
      if (text.indexOf("px") >= 0 || text.indexOf("rpx") >= 0 || text.indexOf("%") >= 0) {
        return text;
      }
      return text + "px";
    }
    const rootStyle = vue.computed(() => {
      return "z-index:" + props.zIndex.toString() + ";";
    });
    const panelClass = vue.computed(() => {
      const classes = ["i-popup__panel"];
      classes.push("i-popup__panel--" + normalizedMode.value);
      if (shouldCoverCenter())
        classes.push("i-popup__panel--cover-center");
      return classes.join(" ");
    });
    const overlayComputedStyle = vue.computed(() => {
      let bgColor2 = "rgba(0,0,0," + props.overlayOpacity.toString() + ")";
      if (props.overflayBgColor.length > 0)
        bgColor2 = props.overflayBgColor;
      let style = "background-color:" + bgColor2 + ";";
      style = style + "opacity:" + (active.value ? "1" : "0") + ";";
      style = style + "transition-duration:" + formatMs(props.duration) + ";";
      style = style + stringifyStyle(props.overlayStyle);
      return style;
    });
    const titleStyleText = vue.computed(() => {
      return stringifyStyle(props.titleStyle);
    });
    function marginStyle() {
      const margin = formatSize(props.margin);
      if (margin == "0px")
        return "";
      return "margin:" + margin + ";";
    }
    function sizeStyle() {
      let style = "";
      const size = props.size.toString();
      if (normalizedMode.value == "left" || normalizedMode.value == "right") {
        if (props.width.toString().length > 0) {
          style = style + "width:" + formatSize(props.width) + ";";
        } else if (size.length > 0) {
          style = style + "width:" + formatSize(size) + ";";
        }
      } else if (normalizedMode.value == "top" || normalizedMode.value == "bottom") {
        if (props.width.toString().length == 0 && !shouldCoverCenter()) {
          style = style + "width:100%;";
        }
        if (props.height.toString().length > 0) {
          style = style + "height:" + formatSize(props.height) + ";";
        } else if (size.length > 0) {
          style = style + "height:" + formatSize(size) + ";";
        }
        if (props.width.toString().length > 0)
          style = style + "width:" + formatSize(props.width) + ";";
      } else {
        if (props.width.toString().length > 0)
          style = style + "width:" + formatSize(props.width) + ";";
        if (props.height.toString().length > 0)
          style = style + "height:" + formatSize(props.height) + ";";
      }
      if (normalizedMode.value == "top") {
        if (props.navbarHeight > 0)
          style = style + "top:" + props.navbarHeight.toString() + "px;";
        if (props.offsetTop.toString().length > 0)
          style = style + "top:" + formatSize(props.offsetTop) + ";";
      }
      if (normalizedMode.value == "bottom" && props.offsetBottom.toString().length > 0) {
        style = style + "bottom:" + formatSize(props.offsetBottom) + ";";
      }
      return style;
    }
    function roundStyle() {
      const round = formatSize(props.round);
      if (normalizedMode.value == "top")
        return "border-radius:0 0 " + round + " " + round + ";";
      if (normalizedMode.value == "bottom")
        return "border-radius:" + round + " " + round + " 0 0;";
      if (normalizedMode.value == "left")
        return "border-radius:0 " + round + " " + round + " 0;";
      if (normalizedMode.value == "right")
        return "border-radius:" + round + " 0 0 " + round + ";";
      if (normalizedMode.value == "center")
        return "border-radius:" + round + ";";
      return "";
    }
    function safeAreaStyle() {
      let style = "";
      if (props.safeTop && normalizedMode.value == "top") {
        style = style + "padding-top:env(safe-area-inset-top);";
      }
      if (props.safeBottom && normalizedMode.value == "bottom") {
        style = style + "padding-bottom:env(safe-area-inset-bottom);";
      }
      return style;
    }
    function transformStyle() {
      const x = offsetX.value.toString();
      const y = offsetY.value.toString();
      if (normalizedMode.value == "center") {
        const scale = props.zoom ? active.value ? "1" : "0.88" : "1";
        return "opacity:" + (active.value ? "1" : "0") + ";transform:translate(-50%,-50%) translate(" + x + "px," + y + "px) scale(" + scale + ");";
      }
      if (normalizedMode.value == "bottom") {
        const prefix = shouldCoverCenter() ? "translateX(-50%) " : "";
        return "transform:" + prefix + "translateY(" + (active.value ? y + "px" : "100%") + ");";
      }
      if (normalizedMode.value == "top") {
        const prefix = shouldCoverCenter() ? "translateX(-50%) " : "";
        return "transform:" + prefix + "translateY(" + (active.value ? y + "px" : "-100%") + ");";
      }
      if (normalizedMode.value == "left")
        return "transform:translateX(" + (active.value ? x + "px" : "-100%") + ");";
      if (normalizedMode.value == "right")
        return "transform:translateX(" + (active.value ? x + "px" : "100%") + ");";
      return "";
    }
    const panelStyle = vue.computed(() => {
      let style = "background-color:" + bgColor.value + ";";
      style = style + "transition-duration:" + formatMs(props.duration) + ";";
      style = style + marginStyle();
      style = style + sizeStyle();
      style = style + roundStyle();
      style = style + safeAreaStyle();
      style = style + transformStyle();
      style = style + stringifyStyle(props.customStyle);
      style = style + stringifyStyle(props.customWrapStyle);
      return style;
    });
    const bodyStyle = vue.computed(() => {
      let style = "padding:" + formatSize(props.contentMargin) + ";";
      if (props.maxHeight.toString().length > 0)
        style = style + "max-height:" + formatSize(props.maxHeight) + ";";
      return style;
    });
    const footerStyle = vue.computed(() => {
      return stringifyStyle(props.customFooterStyle);
    });
    const confirmTextStyle = vue.computed(() => {
      const color = props.btnColor.length > 0 ? props.btnColor : "#1989fa";
      return "color:" + color + ";";
    });
    const confirmTextValue = vue.computed(() => {
      return props.confirmText.length > 0 ? props.confirmText : "确定";
    });
    const cancelTextValue = vue.computed(() => {
      return props.cancelText.length > 0 ? props.cancelText : "取消";
    });
    const contentVisible = vue.computed(() => {
      return !props.lazy || contentReady.value;
    });
    const closeClass = vue.computed(() => {
      const classes = ["i-popup__close"];
      let position = "top-right";
      if (props.closeIconPos == "top-left" || props.closeIconPos == "bottom-left" || props.closeIconPos == "bottom-right") {
        position = props.closeIconPos;
      }
      classes.push("i-popup__close--" + position);
      return classes.join(" ");
    });
    const closeStyle = vue.computed(() => {
      return "color:" + props.closeIconColor + ";font-size:" + formatSize(props.closeIconSize) + ";";
    });
    const closeIconText = vue.computed(() => {
      if (props.closeIcon == "close")
        return "×";
      return props.closeIcon;
    });
    const clearTimers = () => {
      if (closeTimer > 0) {
        clearTimeout(closeTimer);
        closeTimer = 0;
      }
      if (lazyTimer > 0) {
        clearTimeout(lazyTimer);
        lazyTimer = 0;
      }
    };
    const resetOffset = () => {
      offsetX.value = 0;
      offsetY.value = 0;
      touching.value = false;
    };
    const animationDuration = () => {
      const text = props.duration.toString();
      if (text.indexOf("ms") >= 0)
        return parseFloat(text.replace("ms", ""));
      if (text.indexOf("s") >= 0)
        return parseFloat(text.replace("s", "")) * 1e3;
      const duration = parseFloat(text);
      if (isNaN(duration))
        return 300;
      return duration;
    };
    const openPanel = (shouldEmitUpdate) => {
      if (props.disabled)
        return null;
      if (opened.value && active.value)
        return null;
      clearTimers();
      emit("beforeOpen");
      opened.value = true;
      resetOffset();
      if (!props.lazy)
        contentReady.value = true;
      setTimeout(() => {
        active.value = true;
        if (props.lazy) {
          lazyTimer = setTimeout(() => {
            contentReady.value = true;
            lazyTimer = 0;
          }, animationDuration());
        }
        emit("open");
        if (shouldEmitUpdate)
          emit("update:show", true);
      }, 20);
    };
    const closePanel = (shouldEmitUpdate) => {
      if (!opened.value && !active.value)
        return null;
      clearTimers();
      emit("beforeClose");
      active.value = false;
      if (props.lazy)
        contentReady.value = false;
      resetOffset();
      closeTimer = setTimeout(() => {
        opened.value = false;
        closeTimer = 0;
        emit("close");
        if (shouldEmitUpdate)
          emit("update:show", false);
      }, animationDuration());
    };
    vue.watch(() => {
      return props.show;
    }, (nextValue) => {
      if (nextValue) {
        openPanel(false);
      } else {
        closePanel(false);
      }
    });
    function open() {
      openPanel(true);
    }
    function close() {
      closePanel(true);
    }
    function handleOverlayClick() {
      emit("click");
      if (!props.overlayClick || !props.closeOnMask)
        return null;
      close();
    }
    function cancel() {
      emit("cancel");
      close();
    }
    function confirm() {
      if (props.disabledConfirm)
        return null;
      emit("confirm");
      close();
    }
    const readTouchX = (event) => {
      let point = null;
      if (event.touches.length > 0) {
        point = event.touches[0];
      } else if (event.changedTouches.length > 0) {
        point = event.changedTouches[0];
      }
      if (point == null)
        return 0;
      return point.clientX;
    };
    const readTouchY = (event) => {
      let point = null;
      if (event.touches.length > 0) {
        point = event.touches[0];
      } else if (event.changedTouches.length > 0) {
        point = event.changedTouches[0];
      }
      if (point == null)
        return 0;
      return point.clientY;
    };
    const handleTouchStart = (event) => {
      if (!props.swipeClose)
        return null;
      touching.value = true;
      startX.value = readTouchX(event);
      startY.value = readTouchY(event);
    };
    function handleContentTouchStart(event) {
      if (!props.contentDraggable)
        return null;
      handleTouchStart(event);
    }
    function handleHandleTouchStart(event) {
      handleTouchStart(event);
    }
    function handleTouchMove(event) {
      if (!props.swipeClose || !touching.value)
        return null;
      const currentX = readTouchX(event);
      const currentY = readTouchY(event);
      const deltaX = currentX - startX.value;
      const deltaY = currentY - startY.value;
      if (normalizedMode.value == "bottom" && deltaY > 0)
        offsetY.value = deltaY;
      if (normalizedMode.value == "top" && deltaY < 0)
        offsetY.value = deltaY;
      if (normalizedMode.value == "left" && deltaX < 0)
        offsetX.value = deltaX;
      if (normalizedMode.value == "right" && deltaX > 0)
        offsetX.value = deltaX;
      if (normalizedMode.value == "center" && deltaY > 0)
        offsetY.value = deltaY;
    }
    function handleTouchEnd() {
      if (!touching.value)
        return null;
      touching.value = false;
      const threshold = parseFloat(props.swipeCloseThreshold.toString());
      if (Math.abs(offsetX.value) >= threshold || Math.abs(offsetY.value) >= threshold) {
        close();
        return null;
      }
      resetOffset();
    }
    __expose({
      open,
      close
    });
    const __returned__ = { props, emit, bgColor, opened, active, contentReady, startX, startY, offsetX, offsetY, touching, get closeTimer() {
      return closeTimer;
    }, set closeTimer(v) {
      closeTimer = v;
    }, get lazyTimer() {
      return lazyTimer;
    }, set lazyTimer(v) {
      lazyTimer = v;
    }, drawerPosition, normalizedMode, shouldCoverCenter, stringifyStyle, formatMs, formatSize, rootStyle, panelClass, overlayComputedStyle, titleStyleText, marginStyle, sizeStyle, roundStyle, safeAreaStyle, transformStyle, panelStyle, bodyStyle, footerStyle, confirmTextStyle, confirmTextValue, cancelTextValue, contentVisible, closeClass, closeStyle, closeIconText, clearTimers, resetOffset, animationDuration, openPanel, closePanel, open, close, handleOverlayClick, cancel, confirm, readTouchX, readTouchY, handleTouchStart, handleContentTouchStart, handleHandleTouchStart, handleTouchMove, handleTouchEnd };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  } }));
  const _style_0$s = { "i-popup__trigger": { "": { "flexDirection": "column" } }, "i-popup": { "": { "position": "fixed", "left": 0, "right": 0, "top": 0, "bottom": 0 } }, "i-popup__overlay": { "": { "position": "absolute", "left": 0, "right": 0, "top": 0, "bottom": 0, "transitionProperty": "opacity", "transitionTimingFunction": "ease" } }, "i-popup__panel": { "": { "position": "absolute", "overflow": "hidden", "flexDirection": "column", "boxShadow": "0 12px 34px rgba(15, 23, 42, 0.18)", "transitionProperty": "transform,opacity", "transitionTimingFunction": "cubic-bezier(0.22,1,0.36,1)" } }, "i-popup__panel--bottom": { "": { "left": 0, "right": 0, "bottom": 0, "minHeight": 160 } }, "i-popup__panel--top": { "": { "left": 0, "right": 0, "top": 0, "minHeight": 160 } }, "i-popup__panel--left": { "": { "left": 0, "top": 0, "bottom": 0, "width": 280 } }, "i-popup__panel--right": { "": { "right": 0, "top": 0, "bottom": 0, "width": 280 } }, "i-popup__panel--center": { "": { "left": "50%", "top": "50%", "width": 300 } }, "i-popup__panel--cover-center": { "": { "left": "50%", "right": "auto", "width": "100%", "transformOrigin": "center center" } }, "i-popup__swipe-handle": { "": { "height": 24, "alignItems": "center", "justifyContent": "center" } }, "i-popup__swipe-bar": { "": { "width": 38, "height": 4, "borderTopLeftRadius": 99, "borderTopRightRadius": 99, "borderBottomRightRadius": 99, "borderBottomLeftRadius": 99, "backgroundColor": "#d9dee8" } }, "i-popup__header": { "": { "minHeight": 54, "paddingTop": 0, "paddingRight": 52, "paddingBottom": 0, "paddingLeft": 18, "borderBottomWidth": 1, "borderBottomStyle": "solid", "borderBottomColor": "#f2f3f5", "alignItems": "center", "justifyContent": "center" } }, "i-popup__title": { "": { "color": "#303133", "fontSize": 16, "fontWeight": 600, "lineHeight": "24px" } }, "i-popup__close": { "": { "position": "absolute", "zIndex": 2, "width": 34, "height": 34, "borderTopLeftRadius": 34, "borderTopRightRadius": 34, "borderBottomRightRadius": 34, "borderBottomLeftRadius": 34, "backgroundColor": "rgba(245,247,250,0.92)", "alignItems": "center", "justifyContent": "center" } }, "i-popup__close--top-right": { "": { "right": 12, "top": 10 } }, "i-popup__close--top-left": { "": { "left": 12, "top": 10 } }, "i-popup__close--bottom-left": { "": { "left": 12, "bottom": 10 } }, "i-popup__close--bottom-right": { "": { "right": 12, "bottom": 10 } }, "i-popup__close-text": { "": { "color": "#606266", "fontSize": 22, "lineHeight": "34px", "textAlign": "center" } }, "i-popup__body": { "": { "position": "relative", "flexGrow": 1, "flexShrink": 1, "flexBasis": "0%" } }, "i-popup__body--scroll": { "": { "flexGrow": 1, "flexShrink": 1, "flexBasis": "0%" } }, "i-popup__footer": { "": { "minHeight": 58, "paddingTop": 10, "paddingRight": 14, "paddingBottom": 10, "paddingLeft": 14, "borderTopWidth": 1, "borderTopStyle": "solid", "borderTopColor": "#f2f3f5", "backgroundColor": "#ffffff", "flexDirection": "row" } }, "i-popup__footer-button": { "": { "flexGrow": 1, "flexShrink": 1, "flexBasis": "0%", "height": 40, "borderTopLeftRadius": 8, "borderTopRightRadius": 8, "borderBottomRightRadius": 8, "borderBottomLeftRadius": 8, "alignItems": "center", "justifyContent": "center" } }, "i-popup__footer-button--cancel": { "": { "marginRight": 8, "backgroundColor": "#f5f7fb" } }, "i-popup__footer-button--confirm": { "": { "backgroundColor": "#eef6ff" } }, "i-popup__footer-button--disabled": { "": { "opacity": 0.45 } }, "i-popup__footer-cancel": { "": { "fontSize": 15, "fontWeight": 600, "lineHeight": "22px", "color": "#606266" } }, "i-popup__footer-confirm": { "": { "fontSize": 15, "fontWeight": 600, "lineHeight": "22px" } }, "@TRANSITION": { "i-popup__overlay": { "property": "opacity", "timingFunction": "ease" }, "i-popup__panel": { "property": "transform,opacity", "timingFunction": "cubic-bezier(0.22,1,0.36,1)" } } };
  function _sfc_render$s(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", null, [
      vue.createElementVNode("view", {
        class: "i-popup__trigger",
        onClick: $setup.open
      }, [
        vue.renderSlot(_ctx.$slots, "trigger")
      ]),
      $setup.opened ? (vue.openBlock(), vue.createElementBlock(
        "view",
        {
          key: 0,
          class: "i-popup",
          style: vue.normalizeStyle($setup.rootStyle)
        },
        [
          $props.overlay ? (vue.openBlock(), vue.createElementBlock(
            "view",
            {
              key: 0,
              class: "i-popup__overlay",
              style: vue.normalizeStyle($setup.overlayComputedStyle),
              onClick: $setup.handleOverlayClick
            },
            null,
            4
            /* STYLE */
          )) : vue.createCommentVNode("v-if", true),
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass($setup.panelClass),
              style: vue.normalizeStyle($setup.panelStyle),
              onClick: _cache[0] || (_cache[0] = vue.withModifiers(() => {
              }, ["stop"]))
            },
            [
              vue.renderSlot(_ctx.$slots, "bg"),
              $props.swipeClose && $props.swipeHandle ? (vue.openBlock(), vue.createElementBlock(
                "view",
                {
                  key: 0,
                  class: "i-popup__swipe-handle",
                  onTouchstart: vue.withModifiers($setup.handleHandleTouchStart, ["stop"]),
                  onTouchmove: vue.withModifiers($setup.handleTouchMove, ["stop", "prevent"]),
                  onTouchend: vue.withModifiers($setup.handleTouchEnd, ["stop"]),
                  onTouchcancel: vue.withModifiers($setup.handleTouchEnd, ["stop"])
                },
                [
                  vue.createElementVNode("view", { class: "i-popup__swipe-bar" })
                ],
                32
                /* NEED_HYDRATION */
              )) : vue.createCommentVNode("v-if", true),
              $setup.normalizedMode == "bottom" ? vue.renderSlot(_ctx.$slots, "contentTop", { key: 1 }) : vue.createCommentVNode("v-if", true),
              vue.renderSlot(_ctx.$slots, "header", {}, () => [
                $props.showTitle && $props.title.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 0,
                  class: "i-popup__header"
                }, [
                  vue.renderSlot(_ctx.$slots, "title", {}, () => [
                    vue.createElementVNode(
                      "text",
                      {
                        class: "i-popup__title",
                        style: vue.normalizeStyle($setup.titleStyleText)
                      },
                      vue.toDisplayString($props.title),
                      5
                      /* TEXT, STYLE */
                    )
                  ])
                ])) : vue.createCommentVNode("v-if", true)
              ]),
              $props.showClose ? (vue.openBlock(), vue.createElementBlock(
                "view",
                {
                  key: 2,
                  class: vue.normalizeClass($setup.closeClass),
                  onClick: $setup.close
                },
                [
                  vue.createElementVNode(
                    "text",
                    {
                      class: "i-popup__close-text",
                      style: vue.normalizeStyle($setup.closeStyle)
                    },
                    vue.toDisplayString($setup.closeIconText),
                    5
                    /* TEXT, STYLE */
                  )
                ],
                2
                /* CLASS */
              )) : vue.createCommentVNode("v-if", true),
              $props.disabledScroll ? (vue.openBlock(), vue.createElementBlock(
                "view",
                {
                  key: 3,
                  class: "i-popup__body",
                  style: vue.normalizeStyle($setup.bodyStyle)
                },
                [
                  $setup.contentVisible ? vue.renderSlot(_ctx.$slots, "default", { key: 0 }) : vue.createCommentVNode("v-if", true)
                ],
                4
                /* STYLE */
              )) : (vue.openBlock(), vue.createElementBlock(
                "scroll-view",
                {
                  key: 4,
                  "scroll-y": "",
                  class: "i-popup__body i-popup__body--scroll",
                  style: vue.normalizeStyle($setup.bodyStyle)
                },
                [
                  $setup.contentVisible ? vue.renderSlot(_ctx.$slots, "default", { key: 0 }) : vue.createCommentVNode("v-if", true)
                ],
                4
                /* STYLE */
              )),
              vue.renderSlot(_ctx.$slots, "footer", {}, () => [
                $props.showFooter ? (vue.openBlock(), vue.createElementBlock(
                  "view",
                  {
                    key: 0,
                    class: "i-popup__footer",
                    style: vue.normalizeStyle($setup.footerStyle)
                  },
                  [
                    $props.showCancel ? (vue.openBlock(), vue.createElementBlock("view", {
                      key: 0,
                      class: "i-popup__footer-button i-popup__footer-button--cancel",
                      onClick: $setup.cancel
                    }, [
                      vue.createElementVNode(
                        "text",
                        { class: "i-popup__footer-cancel" },
                        vue.toDisplayString($setup.cancelTextValue),
                        1
                        /* TEXT */
                      )
                    ])) : vue.createCommentVNode("v-if", true),
                    vue.createElementVNode(
                      "view",
                      {
                        class: vue.normalizeClass(
                          $props.disabledConfirm ? "i-popup__footer-button i-popup__footer-button--confirm i-popup__footer-button--disabled" : "i-popup__footer-button i-popup__footer-button--confirm"
                        ),
                        onClick: $setup.confirm
                      },
                      [
                        vue.createElementVNode(
                          "text",
                          {
                            class: "i-popup__footer-confirm",
                            style: vue.normalizeStyle($setup.confirmTextStyle)
                          },
                          vue.toDisplayString($setup.confirmTextValue),
                          5
                          /* TEXT, STYLE */
                        )
                      ],
                      2
                      /* CLASS */
                    )
                  ],
                  4
                  /* STYLE */
                )) : vue.createCommentVNode("v-if", true)
              ]),
              $props.closeable && !$props.showClose ? (vue.openBlock(), vue.createElementBlock(
                "view",
                {
                  key: 5,
                  class: vue.normalizeClass($setup.closeClass),
                  onClick: $setup.close
                },
                [
                  vue.createElementVNode(
                    "text",
                    {
                      class: "i-popup__close-text",
                      style: vue.normalizeStyle($setup.closeStyle)
                    },
                    vue.toDisplayString($setup.closeIconText),
                    5
                    /* TEXT, STYLE */
                  )
                ],
                2
                /* CLASS */
              )) : vue.createCommentVNode("v-if", true)
            ],
            6
            /* CLASS, STYLE */
          )
        ],
        4
        /* STYLE */
      )) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const __easycom_4$1 = /* @__PURE__ */ _export_sfc(_sfc_main$t, [["render", _sfc_render$s], ["styles", [_style_0$s]], ["__file", "/Users/xyhc/Documents/carConnectInternet/uni_modules/i-ui-x/components/i-popup/i-popup.uvue"]]);
  const _sfc_main$s = /* @__PURE__ */ vue.defineComponent({
    __name: "car-icons",
    props: {
      show: { type: Boolean, required: true, default: false },
      title: { type: String, required: true, default: "请选择图标" },
      col: { type: Number, required: true, default: 4 },
      iconSize: { type: Number, required: true, default: 40 },
      safeAreaInsetBottom: { type: Boolean, required: true, default: true }
    },
    emits: ["select", "update:show"],
    setup(__props, _a) {
      var __expose = _a.expose, __emit = _a.emit;
      __expose();
      const props = __props;
      const emit = __emit;
      const iconList = [
        new UTSJSONObject({ name: "car", text: "轿车", image: "/static/cars/online/car.png" }),
        new UTSJSONObject({ name: "suv", text: "越野车", image: "/static/cars/online/suv.png" }),
        new UTSJSONObject({ name: "bus", text: "公交车", image: "/static/cars/online/bus.png" }),
        new UTSJSONObject({ name: "huoche", text: "货车", image: "/static/cars/online/huoche.png" }),
        new UTSJSONObject({ name: "train", text: "火车", image: "/static/cars/online/train.png" }),
        new UTSJSONObject({ name: "diandong", text: "电动车", image: "/static/cars/online/diandong.png" }),
        new UTSJSONObject({ name: "moto", text: "摩托车", image: "/static/cars/online/moto.png" }),
        new UTSJSONObject({ name: "bike", text: "自行车", image: "/static/cars/online/bike.png" }),
        new UTSJSONObject({ name: "sanlun", text: "三轮车", image: "/static/cars/online/sanlun.png" }),
        new UTSJSONObject({ name: "tuola", text: "拖拉机", image: "/static/cars/online/tuola.png" }),
        new UTSJSONObject({ name: "wajue", text: "挖掘机", image: "/static/cars/online/wajue.png" }),
        new UTSJSONObject({ name: "tuiche", text: "手推车", image: "/static/cars/online/tuiche.png" }),
        new UTSJSONObject({ name: "baby", text: "婴儿车", image: "/static/cars/online/baby.png" }),
        new UTSJSONObject({ name: "muma", text: "木马", image: "/static/cars/online/muma.png" }),
        new UTSJSONObject({ name: "tank", text: "坦克", image: "/static/cars/online/tank.png" }),
        new UTSJSONObject({ name: "zhuangjia", text: "装甲车", image: "/static/cars/online/zhuangjia.png" }),
        new UTSJSONObject({ name: "plan", text: "飞机", image: "/static/cars/online/plan.png" }),
        new UTSJSONObject({ name: "hangmu", text: "航母", image: "/static/cars/online/hangmu.png" }),
        new UTSJSONObject({ name: "junjian", text: "军舰", image: "/static/cars/online/junjian.png" }),
        new UTSJSONObject({ name: "walk", text: "步行", image: "/static/cars/online/walk.png" })
      ];
      const itemWidth = vue.computed(() => {
        const cols = props.col > 0 ? props.col : 4;
        return 100 / cols + "%";
      });
      const close = () => {
        emit("update:show", false);
      };
      const handleSelect = (item = null) => {
        const selected = item;
        uni.__log__("log", "at components/car-icons/car-icons.uvue:93", "选择的图标:", selected);
        emit("select", selected);
        close();
      };
      const handlePopupClick = () => {
        uni.__log__("log", "at components/car-icons/car-icons.uvue:100", "Popup clicked");
      };
      const getIconByName = (name) => {
        for (let index = 0; index < iconList.length; index++) {
          const item = iconList[index];
          if (item.getString("name", "") == name)
            return item;
        }
        return null;
      };
      const __returned__ = { props, emit, iconList, itemWidth, close, handleSelect, handlePopupClick, getIconByName };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  const _style_0$r = { "icon-selector": { "": { "paddingTop": "20rpx", "paddingRight": "20rpx", "paddingBottom": "40rpx", "paddingLeft": "20rpx", "backgroundColor": "#ffffff", "width::-webkit-scrollbar": 4, "backgroundColor::-webkit-scrollbar-thumb": "#dddddd", "borderTopLeftRadius::-webkit-scrollbar-thumb": 4, "borderTopRightRadius::-webkit-scrollbar-thumb": 4, "borderBottomRightRadius::-webkit-scrollbar-thumb": 4, "borderBottomLeftRadius::-webkit-scrollbar-thumb": 4, "backgroundColor::-webkit-scrollbar-track": "#f5f5f5" } }, "icon-grid": { ".icon-selector ": { "width": "100%", "display": "flex", "flexDirection": "row", "flexWrap": "wrap" } }, "grid-item": { ".icon-selector .icon-grid ": { "display": "flex", "flexDirection": "column", "alignItems": "center", "justifyContent": "center", "paddingTop": "20rpx", "paddingRight": "10rpx", "paddingBottom": "20rpx", "paddingLeft": "10rpx", "width": "25%", "height": "100%", "transitionProperty": "all", "transitionDuration": "0.3s", "transitionTimingFunction": "ease" } }, "@TRANSITION": { "grid-item": { "property": "all", "duration": "0.3s", "timingFunction": "ease" } } };
  function _sfc_render$r(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_i_grid = resolveEasycom(vue.resolveDynamicComponent("i-grid"), __easycom_0$4);
    const _component_i_popup = resolveEasycom(vue.resolveDynamicComponent("i-popup"), __easycom_4$1);
    return vue.openBlock(), vue.createBlock(_component_i_popup, {
      show: $setup.props.show,
      title: $props.title,
      mode: "bottom",
      safeBottom: $props.safeAreaInsetBottom,
      showClose: "",
      onClose: $setup.close,
      onClick: $setup.handlePopupClick
    }, {
      default: vue.withCtx(() => [
        vue.createElementVNode("scroll-view", {
          class: "icon-selector",
          "scroll-y": ""
        }, [
          vue.createVNode(_component_i_grid, {
            items: $setup.iconList,
            col: 4,
            itemHeight: "88",
            round: "8",
            imageSize: 30,
            iconColor: "#3c9cff",
            textColor: "#606266",
            showBorder: true,
            onClick: _cache[0] || (_cache[0] = ($event) => $setup.handleSelect($event))
          })
        ])
      ]),
      _: 1
      /* STABLE */
    }, 8, ["show", "title", "safeBottom"]);
  }
  const carIcons = /* @__PURE__ */ _export_sfc(_sfc_main$s, [["render", _sfc_render$r], ["styles", [_style_0$r]], ["__file", "/Users/xyhc/Documents/carConnectInternet/components/car-icons/car-icons.uvue"]]);
  class CarFormData extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            deviceName: { type: String, optional: false },
            imei: { type: String, optional: false },
            deviceType: { type: String, optional: false },
            deviceTypeValue: { type: String, optional: false },
            plateNo: { type: String, optional: false },
            carType: { type: String, optional: false }
          };
        },
        name: "CarFormData"
      };
    }
    constructor(options, metadata = CarFormData.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.deviceName = this.__props__.deviceName;
      this.imei = this.__props__.imei;
      this.deviceType = this.__props__.deviceType;
      this.deviceTypeValue = this.__props__.deviceTypeValue;
      this.plateNo = this.__props__.plateNo;
      this.carType = this.__props__.carType;
      delete this.__props__;
    }
  }
  class ScanResultData extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            result: { type: String, optional: false }
          };
        },
        name: "ScanResultData"
      };
    }
    constructor(options, metadata = ScanResultData.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.result = this.__props__.result;
      delete this.__props__;
    }
  }
  class AddDeviceResponse extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            code: { type: Number, optional: false },
            msg: { type: String, optional: false },
            data: { type: CarFormData, optional: false }
          };
        },
        name: "AddDeviceResponse"
      };
    }
    constructor(options, metadata = AddDeviceResponse.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.code = this.__props__.code;
      this.msg = this.__props__.msg;
      this.data = this.__props__.data;
      delete this.__props__;
    }
  }
  const _sfc_main$r = /* @__PURE__ */ vue.defineComponent({
    __name: "addCar",
    setup(__props, _a) {
      var __expose = _a.expose;
      __expose();
      const carIconSelectorVisible = vue.ref(false);
      const loading = vue.ref(false);
      const formValid = vue.ref(false);
      const carInfo = vue.ref(new CarFormData({
        deviceName: "",
        imei: "",
        deviceType: "",
        deviceTypeValue: "",
        plateNo: "",
        carType: ""
      }));
      const actions = vue.ref([]);
      const rules = [
        new UTSJSONObject({ name: "imei", required: true, message: "请输入设备ID" }),
        new UTSJSONObject({ name: "deviceType", required: true, message: "请选择设备图标" })
      ];
      const handleModelValid = (value = null) => {
        formValid.value = !!value;
      };
      const scanCode = () => {
        uni.navigateTo({
          url: "/pages/scancode/scancode?source=addCar"
        });
      };
      const handleScanResult = (data) => {
        uni.__log__("log", "at pages/addCar/addCar.uvue:117", "接收到扫码结果:", data.result);
        if (data.result.length == 15) {
          carInfo.value.imei = "0" + data.result.slice(4, 15);
        } else if (data.result.length == 11) {
          carInfo.value.imei = "0" + data.result;
        } else {
          showAppToast({
            title: "请输入正确的设备ID",
            icon: "none"
          });
        }
      };
      const updateCarIconSelectorVisible = (visible) => {
        carIconSelectorVisible.value = visible;
      };
      const selectIcon = (item) => {
        const name = item.getString("name", "");
        const text = item.getString("text", "");
        uni.__log__("log", "at pages/addCar/addCar.uvue:139", name);
        carInfo.value.deviceType = name;
        carInfo.value.deviceTypeValue = text;
        carIconSelectorVisible.value = false;
      };
      const deviceTypeSelectFun = () => {
        carIconSelectorVisible.value = true;
      };
      const refreshDeviceList = () => {
        uni.$emit("refreshDeviceList");
      };
      const validateForm = () => {
        if (carInfo.value.imei.length == 0) {
          showAppToast({
            title: "请输入设备ID",
            icon: "none"
          });
          return false;
        }
        if (carInfo.value.deviceType.length == 0) {
          showAppToast({
            title: "请选择设备图标",
            icon: "none"
          });
          return false;
        }
        return true;
      };
      const submit = () => {
        return __awaiter(this, void 0, void 0, function* () {
          uni.__log__("log", "at pages/addCar/addCar.uvue:176", "=== 开始提交设备 ===");
          try {
            if (!validateForm())
              return Promise.resolve(null);
            uni.__log__("log", "at pages/addCar/addCar.uvue:181", "✅ 表单验证通过");
            loading.value = true;
            uni.showLoading(new UTSJSONObject({
              title: "添加中...",
              mask: true
            }));
            const submitData = new UTSJSONObject({
              deviceName: carInfo.value.deviceName,
              imei: carInfo.value.imei,
              carType: carInfo.value.deviceType,
              plateNo: carInfo.value.plateNo
            });
            uni.__log__("log", "at pages/addCar/addCar.uvue:196", "📤 提交数据:", submitData);
            const res = yield addDevice(submitData);
            uni.__log__("log", "at pages/addCar/addCar.uvue:199", "✅ 添加设备返回:", res);
            uni.hideLoading();
            loading.value = false;
            if (res.code == 0) {
              showAppToast({
                title: "添加成功",
                icon: "success"
              });
              uni.setStorageSync("needRefreshHome", true);
              refreshDeviceList();
              setTimeout(() => {
                uni.navigateBack();
              }, 1500);
            } else {
              showAppToast({
                title: res.msg || "添加失败",
                icon: "none",
                duration: 2e3
              });
            }
          } catch (error) {
            uni.__log__("error", "at pages/addCar/addCar.uvue:226", "❌ 添加设备失败:", error);
            uni.hideLoading();
            loading.value = false;
            showAppToast({
              title: "添加设备失败",
              icon: "none"
            });
          }
        });
      };
      vue.onLoad(() => {
        uni.$on("scanCodeResult", handleScanResult);
      });
      vue.onShow(() => {
        const rawResult = uni.getStorageSync("scanCodeResult");
        const result = rawResult != null ? rawResult.toString() : "";
        if (result.length > 0) {
          uni.removeStorageSync("scanCodeResult");
          handleScanResult(new ScanResultData({ result }));
        }
      });
      vue.onUnload(() => {
        uni.$off("scanCodeResult", handleScanResult);
      });
      const __returned__ = { carIconSelectorVisible, loading, formValid, carInfo, actions, rules, handleModelValid, scanCode, handleScanResult, updateCarIconSelectorVisible, selectIcon, deviceTypeSelectFun, refreshDeviceList, validateForm, submit, get carIcons() {
        return carIcons;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  const _style_0$q = { "container": { "": { "width": "100%", "height": "100%", "backgroundColor": "#f5f5f5" } }, "content": { ".container ": { "marginTop": "20rpx", "marginRight": "20rpx", "marginBottom": "20rpx", "marginLeft": "20rpx", "paddingTop": "20rpx", "paddingRight": "40rpx", "paddingBottom": "20rpx", "paddingLeft": "40rpx", "backgroundColor": "#ffffff", "borderTopLeftRadius": "20rpx", "borderTopRightRadius": "20rpx", "borderBottomRightRadius": "20rpx", "borderBottomLeftRadius": "20rpx" } }, "clickable": { ".container ": { "marginTop": 10, "color": "#999999", "fontSize": "28rpx" } }, "btn": { ".container ": { "marginTop": "50rpx", "marginRight": "20rpx", "marginBottom": 0, "marginLeft": "20rpx" } }, "plate-input": { ".container ": { "width": "100%" } }, "input-wrapper": { ".container .plate-input ": { "paddingTop": 0, "paddingRight": 0, "paddingBottom": 0, "paddingLeft": 0, "borderTopWidth": "medium", "borderRightWidth": "medium", "borderBottomWidth": "medium", "borderLeftWidth": "medium", "borderTopStyle": "none", "borderRightStyle": "none", "borderBottomStyle": "none", "borderLeftStyle": "none", "borderTopColor": "#000000", "borderRightColor": "#000000", "borderBottomColor": "#000000", "borderLeftColor": "#000000" } }, "car-input-container": { ".container ": { "display": "flex", "flexDirection": "row" } }, "car-number-input": { ".container ": { "width": "60%", "textAlign": "right" } }, "plate-close": { ".container .car-number-container ": { "height": 40, "display": "flex", "textAlign": "right", "backgroundColor": "#FFFFFF", "flexDirection": "row", "justifyContent": "flex-end", "alignItems": "center" } }, "car-input-item": { ".container .car-input-container .car-input-box ": { "position": "relative", "borderTopWidth": 1, "borderRightWidth": 1, "borderBottomWidth": 1, "borderLeftWidth": 1, "borderTopStyle": "solid", "borderRightStyle": "solid", "borderBottomStyle": "solid", "borderLeftStyle": "solid", "borderTopColor": "#E2E2E2", "borderRightColor": "#E2E2E2", "borderBottomColor": "#E2E2E2", "borderLeftColor": "#E2E2E2", "height": 40, "lineHeight": "40px", "textAlign": "center", "fontSize": 17 } }, "new-item-img": { ".container .car-input-container .car-input-box .car-input-item ": { "position": "absolute", "top": -2, "left": "50%", "marginLeft": -15, "height": 13, "width": 30, "zIndex": 9 } }, "i-form-item": { ".container ": { "paddingTop": "5rpx", "paddingRight": "10rpx", "paddingBottom": "5rpx", "paddingLeft": "10rpx", "borderTopLeftRadius": 0, "borderTopRightRadius": 0, "borderBottomRightRadius": 0, "borderBottomLeftRadius": 0, "borderBottomWidth": 1, "borderBottomStyle": "solid", "borderBottomColor": "#99999924" } } };
  function _sfc_render$q(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_custom_navBar = resolveEasycom(vue.resolveDynamicComponent("custom-navBar"), __easycom_0$5);
    const _component_i_input = resolveEasycom(vue.resolveDynamicComponent("i-input"), __easycom_1$2);
    const _component_i_form_item = resolveEasycom(vue.resolveDynamicComponent("i-form-item"), __easycom_2$3);
    const _component_i_icon = resolveEasycom(vue.resolveDynamicComponent("i-icon"), __easycom_2$6);
    const _component_i_form = resolveEasycom(vue.resolveDynamicComponent("i-form"), __easycom_3$1);
    const _component_i_button = resolveEasycom(vue.resolveDynamicComponent("i-button"), __easycom_2$2);
    const _component_app_toast = resolveEasycom(vue.resolveDynamicComponent("app-toast"), __easycom_3$3);
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.createElementVNode("view", { class: "container" }, [
          vue.createVNode(_component_custom_navBar, {
            title: "添加设备",
            "show-back": true,
            backgroundColor: "#fff",
            textColor: "#333",
            showCapsule: false
          }),
          vue.createElementVNode("view", { class: "content" }, [
            vue.createVNode(_component_i_form, {
              labelPosition: "left",
              modelValue: $setup.carInfo,
              rules: $setup.rules,
              labelDirection: "horizontal",
              watchValidStatus: "",
              "onUpdate:modelValid": $setup.handleModelValid
            }, {
              default: vue.withCtx(() => [
                vue.createVNode(_component_i_form_item, {
                  label: "设备名称",
                  name: "deviceName",
                  labelDirection: "horizontal"
                }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_i_input, {
                      border: "none",
                      modelValue: $setup.carInfo.deviceName,
                      "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.carInfo.deviceName = $event),
                      placeholder: "请输入设备名称"
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                  /* STABLE */
                }),
                vue.createVNode(_component_i_form_item, {
                  label: "*设备ID",
                  name: "imei",
                  labelDirection: "horizontal"
                }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_i_input, {
                      border: "none",
                      modelValue: $setup.carInfo.imei,
                      "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.carInfo.imei = $event),
                      placeholder: "请输入设备ID(必填)"
                    }, {
                      suffix: vue.withCtx(() => [
                        vue.createVNode(_component_i_icon, {
                          name: "/static/sancode.png",
                          fontSize: "20",
                          onClick: $setup.scanCode
                        })
                      ]),
                      _: 1
                      /* STABLE */
                    }, 8, ["modelValue"])
                  ]),
                  _: 1
                  /* STABLE */
                }),
                vue.createVNode(_component_i_form_item, {
                  label: "车标",
                  name: "deviceType",
                  labelDirection: "horizontal"
                }, {
                  default: vue.withCtx(() => [
                    vue.createElementVNode("view", {
                      class: "car-type-selector",
                      onClick: $setup.deviceTypeSelectFun
                    }, [
                      vue.createElementVNode(
                        "text",
                        {
                          class: vue.normalizeClass(["clickable", { "placeholder": !$setup.carInfo.deviceTypeValue }])
                        },
                        vue.toDisplayString($setup.carInfo.deviceTypeValue || "请选择设备图标(必选)"),
                        3
                        /* TEXT, CLASS */
                      )
                    ])
                  ]),
                  _: 1
                  /* STABLE */
                }),
                vue.createVNode(_component_i_form_item, {
                  label: "车牌名",
                  name: "plateNo",
                  labelDirection: "horizontal"
                }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_i_input, {
                      border: "none",
                      modelValue: $setup.carInfo.plateNo,
                      "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.carInfo.plateNo = $event),
                      placeholder: "请输入车牌名"
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                  /* STABLE */
                }),
                vue.createVNode($setup["carIcons"], {
                  show: $setup.carIconSelectorVisible,
                  "onUpdate:show": $setup.updateCarIconSelectorVisible,
                  onSelect: $setup.selectIcon
                }, null, 8, ["show"])
              ]),
              _: 1
              /* STABLE */
            }, 8, ["modelValue"])
          ]),
          vue.createElementVNode("view", { class: "btn" }, [
            vue.createVNode(_component_i_button, {
              type: "primary",
              onClick: $setup.submit,
              loading: $setup.loading
            }, {
              default: vue.withCtx(() => [
                vue.createTextVNode("提交")
              ]),
              _: 1
              /* STABLE */
            }, 8, ["loading"])
          ])
        ]),
        vue.createVNode(_component_app_toast)
      ],
      64
      /* STABLE_FRAGMENT */
    );
  }
  const PagesAddCarAddCar = /* @__PURE__ */ _export_sfc(_sfc_main$r, [["render", _sfc_render$q], ["styles", [_style_0$q]], ["__file", "/Users/xyhc/Documents/carConnectInternet/pages/addCar/addCar.uvue"]]);
  const _sfc_main$q = /* @__PURE__ */ vue.defineComponent(Object.assign({ name: "i-slider" }, { __name: "i-slider", props: {
    modelValue: {
      type: [Number, String, Array],
      default: 0
    },
    value: {
      type: [Number, String, Array],
      default: 0
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    },
    step: {
      type: Number,
      default: 1
    },
    range: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    noCross: {
      type: Boolean,
      default: false
    },
    vertical: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: "24px"
    },
    railColor: {
      type: String,
      default: "rgba(0, 0, 0, 0.1)"
    },
    railRadius: {
      type: String,
      default: "2px"
    },
    railSize: {
      type: String,
      default: "4px"
    },
    trackColor: {
      type: String,
      default: "#1677ff"
    },
    thumbSize: {
      type: String,
      default: "20px"
    },
    thumbColor: {
      type: String,
      default: "#ffffff"
    },
    thumbBorder: {
      type: String,
      default: "3px solid #1677ff"
    },
    thumbRadius: {
      type: String,
      default: "50%"
    },
    showValue: {
      type: Boolean,
      default: false
    }
  }, emits: [
    "update:modelValue",
    "update:value",
    "change",
    "changing",
    "dragStart",
    "dragEnd"
  ], setup(__props, _a) {
    var __expose = _a.expose, __emit = _a.emit;
    __expose();
    const props = __props;
    const emit = __emit;
    function initialValue() {
      if (props.modelValue.toString().length > 0)
        return props.modelValue;
      return props.value;
    }
    function normalizeSingle(value = null) {
      let nextValue = parseFloat(value.toString());
      if (isNaN(nextValue))
        nextValue = props.min;
      if (nextValue < props.min)
        nextValue = props.min;
      if (nextValue > props.max)
        nextValue = props.max;
      return nextValue;
    }
    function normalizeRange(value = null) {
      let start = props.min;
      let end = props.max;
      if (Array.isArray(value) && value.length > 1) {
        start = parseFloat(value[0].toString());
        end = parseFloat(value[1].toString());
      } else {
        const text = value.toString();
        if (text.indexOf(",") >= 0) {
          start = parseFloat(text.split(",")[0]);
          end = parseFloat(text.split(",")[1]);
        }
      }
      start = normalizeSingle(start);
      end = normalizeSingle(end);
      if (props.noCross && start > end)
        start = end;
      return [start, end];
    }
    function valuePercent(value) {
      const distance = props.max - props.min;
      if (distance <= 0)
        return 0;
      const percent = (value - props.min) / distance * 100;
      if (percent < 0)
        return 0;
      if (percent > 100)
        return 100;
      return percent;
    }
    function formatSize(value = null) {
      const text = value.toString();
      if (text.indexOf("px") >= 0 || text.indexOf("rpx") >= 0 || text.indexOf("%") >= 0) {
        return text;
      }
      return text + "px";
    }
    function thumbStyle(value) {
      const size = parseFloat(props.thumbSize.toString());
      const halfSize = isNaN(size) ? 10 : size / 2;
      return "left:" + valuePercent(value).toString() + "%;width:" + formatSize(props.thumbSize) + ";height:" + formatSize(props.thumbSize) + ";margin-left:" + formatSize(0 - halfSize) + ";border:" + props.thumbBorder + ";border-radius:" + props.thumbRadius + ";background-color:" + props.thumbColor + ";";
    }
    const singleValue = vue.ref(normalizeSingle(initialValue()));
    const rangeStart = vue.ref(normalizeRange(initialValue())[0]);
    const rangeEnd = vue.ref(normalizeRange(initialValue())[1]);
    const dragging = vue.ref(false);
    const rangeId = "i-slider-range-" + Math.floor(Math.random() * 1e6).toString();
    const rangeRectLeft = vue.ref(0);
    const rangeRectWidth = vue.ref(0);
    const activeRangeThumb = vue.ref("");
    const wrapClass = vue.computed(() => {
      const classes = ["i-slider"];
      if (props.vertical)
        classes.push("i-slider--vertical");
      if (props.disabled)
        classes.push("i-slider--disabled");
      return classes.join(" ");
    });
    const displayValue = vue.computed(() => {
      if (props.range)
        return rangeStart.value.toString() + " - " + rangeEnd.value.toString();
      return singleValue.value.toString();
    });
    const rangeRailStyle = vue.computed(() => {
      return "height:" + formatSize(props.railSize) + ";border-radius:" + formatSize(props.railRadius) + ";background-color:" + props.railColor + ";";
    });
    const rangeTrackStyle = vue.computed(() => {
      const startPercent = valuePercent(rangeStart.value);
      const endPercent = valuePercent(rangeEnd.value);
      return "left:" + startPercent.toString() + "%;width:" + (endPercent - startPercent).toString() + "%;height:" + formatSize(props.railSize) + ";border-radius:" + formatSize(props.railRadius) + ";background-color:" + props.trackColor + ";";
    });
    const startThumbStyle = vue.computed(() => {
      return thumbStyle(rangeStart.value);
    });
    const endThumbStyle = vue.computed(() => {
      return thumbStyle(rangeEnd.value);
    });
    const syncFromProps = () => {
      singleValue.value = normalizeSingle(initialValue());
      const values = normalizeRange(initialValue());
      rangeStart.value = values[0];
      rangeEnd.value = values[1];
    };
    vue.watch(() => {
      return props.modelValue;
    }, () => {
      syncFromProps();
    });
    vue.watch(() => {
      return props.value;
    }, () => {
      syncFromProps();
    });
    function normalizeStart(value) {
      let nextValue = normalizeSingle(value);
      if (props.noCross && nextValue > rangeEnd.value)
        nextValue = rangeEnd.value;
      return nextValue;
    }
    function normalizeEnd(value) {
      let nextValue = normalizeSingle(value);
      if (props.noCross && nextValue < rangeStart.value)
        nextValue = rangeStart.value;
      return nextValue;
    }
    const startDrag = () => {
      if (dragging.value)
        return null;
      dragging.value = true;
      emit("dragStart");
    };
    const endDrag = () => {
      dragging.value = false;
      emit("dragEnd");
    };
    const emitValue = (value = null) => {
      emit("update:modelValue", value);
      emit("update:value", value);
      emit("change", value);
    };
    function handleSingleChanging(event) {
      startDrag();
      singleValue.value = normalizeSingle(event.detail.value);
      emit("changing", singleValue.value);
    }
    function handleSingleChange(event) {
      singleValue.value = normalizeSingle(event.detail.value);
      emitValue(singleValue.value);
      endDrag();
    }
    function handleStartChanging(event) {
      startDrag();
      rangeStart.value = normalizeStart(event.detail.value);
      emit("changing", [rangeStart.value, rangeEnd.value]);
    }
    function handleStartChange(event) {
      rangeStart.value = normalizeStart(event.detail.value);
      emitValue([rangeStart.value, rangeEnd.value]);
      endDrag();
    }
    function handleEndChanging(event) {
      startDrag();
      rangeEnd.value = normalizeEnd(event.detail.value);
      emit("changing", [rangeStart.value, rangeEnd.value]);
    }
    function handleEndChange(event) {
      rangeEnd.value = normalizeEnd(event.detail.value);
      emitValue([rangeStart.value, rangeEnd.value]);
      endDrag();
    }
    function normalizeRectPoint(first = null, fallback = null) {
      const firstValue = parseFloat(first.toString());
      if (!isNaN(firstValue))
        return firstValue;
      const fallbackValue = parseFloat(fallback.toString());
      if (!isNaN(fallbackValue))
        return fallbackValue;
      return 0;
    }
    function normalizeStep(value) {
      const stepValue = props.step <= 0 ? 1 : props.step;
      const nextValue = props.min + Math.round((value - props.min) / stepValue) * stepValue;
      return normalizeSingle(parseFloat(nextValue.toFixed(6)));
    }
    function valueFromPoint(x) {
      let percent = (x - rangeRectLeft.value) / rangeRectWidth.value;
      if (percent < 0)
        percent = 0;
      if (percent > 1)
        percent = 1;
      const rawValue = props.min + (props.max - props.min) * percent;
      return normalizeStep(rawValue);
    }
    function pickRangeThumb(value) {
      const startDistance = Math.abs(value - rangeStart.value);
      const endDistance = Math.abs(value - rangeEnd.value);
      activeRangeThumb.value = startDistance <= endDistance ? "start" : "end";
    }
    function readTouchX(event) {
      let point = null;
      if (event.touches.length > 0)
        point = event.touches[0];
      else if (event.changedTouches.length > 0)
        point = event.changedTouches[0];
      if (point == null)
        return NaN;
      return point.clientX;
    }
    function updateRangeByTouch(event, shouldPickThumb) {
      const x = readTouchX(event);
      if (isNaN(x) || rangeRectWidth.value <= 0)
        return null;
      const nextValue = valueFromPoint(x);
      if (shouldPickThumb)
        pickRangeThumb(nextValue);
      if (activeRangeThumb.value == "start")
        rangeStart.value = normalizeStart(nextValue);
      else
        rangeEnd.value = normalizeEnd(nextValue);
      emit("changing", [rangeStart.value, rangeEnd.value]);
    }
    function setRangeRect(rect = null) {
      const rects = rect;
      if (rects.length == 0)
        return null;
      const nodeInfo = rects[0];
      rangeRectLeft.value = nodeInfo.left != null ? nodeInfo.left : 0;
      rangeRectWidth.value = nodeInfo.width != null ? nodeInfo.width : 0;
    }
    function refreshRangeRect(event, shouldPickThumb, shouldUpdate) {
      uni.createSelectorQuery().select("#" + rangeId).boundingClientRect((rect = null) => {
        setRangeRect(rect);
        if (shouldUpdate)
          updateRangeByTouch(event, shouldPickThumb);
      }).exec();
    }
    function handleRangeTouchStart(event) {
      if (props.disabled || props.readonly)
        return null;
      startDrag();
      refreshRangeRect(event, true, true);
    }
    function handleRangeTouchMove(event) {
      if (props.disabled || props.readonly || activeRangeThumb.value.length == 0)
        return null;
      updateRangeByTouch(event, false);
    }
    function handleRangeTouchEnd() {
      if (activeRangeThumb.value.length == 0)
        return null;
      emitValue([rangeStart.value, rangeEnd.value]);
      activeRangeThumb.value = "";
      endDrag();
    }
    const __returned__ = { props, emit, initialValue, normalizeSingle, normalizeRange, valuePercent, formatSize, thumbStyle, singleValue, rangeStart, rangeEnd, dragging, rangeId, rangeRectLeft, rangeRectWidth, activeRangeThumb, wrapClass, displayValue, rangeRailStyle, rangeTrackStyle, startThumbStyle, endThumbStyle, syncFromProps, normalizeStart, normalizeEnd, startDrag, endDrag, emitValue, handleSingleChanging, handleSingleChange, handleStartChanging, handleStartChange, handleEndChanging, handleEndChange, normalizeRectPoint, normalizeStep, valueFromPoint, pickRangeThumb, readTouchX, updateRangeByTouch, setRangeRect, refreshRangeRect, handleRangeTouchStart, handleRangeTouchMove, handleRangeTouchEnd };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  } }));
  const _style_0$p = { "i-slider": { "": { "flexDirection": "row", "alignItems": "center" } }, "i-slider--vertical": { "": { "flexDirection": "column", "alignItems": "stretch" } }, "i-slider--disabled": { "": { "opacity": 0.55 } }, "i-slider__line": { "": { "flexGrow": 1, "flexShrink": 1, "flexBasis": "0%" } }, "i-slider__native": { "": { "width": "100%" } }, "i-slider__range": { "": { "position": "relative", "flexGrow": 1, "flexShrink": 1, "flexBasis": "0%", "height": 64 } }, "i-slider__range-rail": { "": { "position": "absolute", "top": 20, "left": 0, "right": 0 } }, "i-slider__range-track": { "": { "position": "absolute", "top": 20, "left": 0 } }, "i-slider__thumb": { "": { "position": "absolute", "top": 10, "zIndex": 3, "alignItems": "center", "justifyContent": "center", "boxShadow": "0 2px 8px rgba(31, 45, 61, 0.16)" } }, "i-slider__value": { "": { "minWidth": 58, "marginLeft": 8, "color": "#606266", "fontSize": 14, "lineHeight": "22px", "textAlign": "right" } } };
  function _sfc_render$p(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass($setup.wrapClass)
      },
      [
        !$props.range ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "i-slider__line"
        }, [
          vue.createElementVNode("slider", {
            class: "i-slider__native",
            value: $setup.singleValue,
            min: $props.min,
            max: $props.max,
            step: $props.step,
            disabled: $props.disabled || $props.readonly,
            activeColor: $props.trackColor,
            backgroundColor: $props.railColor,
            onChanging: $setup.handleSingleChanging,
            onChange: $setup.handleSingleChange
          }, null, 40, ["value", "min", "max", "step", "disabled", "activeColor", "backgroundColor"]),
          vue.renderSlot(_ctx.$slots, "startThumb")
        ])) : (vue.openBlock(), vue.createElementBlock(
          "view",
          {
            key: 1,
            id: $setup.rangeId,
            class: "i-slider__range",
            onTouchstart: vue.withModifiers($setup.handleRangeTouchStart, ["stop", "prevent"]),
            onTouchmove: vue.withModifiers($setup.handleRangeTouchMove, ["stop", "prevent"]),
            onTouchend: vue.withModifiers($setup.handleRangeTouchEnd, ["stop", "prevent"]),
            onTouchcancel: vue.withModifiers($setup.handleRangeTouchEnd, ["stop", "prevent"])
          },
          [
            vue.createElementVNode(
              "view",
              {
                class: "i-slider__range-rail",
                style: vue.normalizeStyle($setup.rangeRailStyle)
              },
              null,
              4
              /* STYLE */
            ),
            vue.createElementVNode(
              "view",
              {
                class: "i-slider__range-track",
                style: vue.normalizeStyle($setup.rangeTrackStyle)
              },
              null,
              4
              /* STYLE */
            ),
            vue.createElementVNode(
              "view",
              {
                class: "i-slider__thumb",
                style: vue.normalizeStyle($setup.startThumbStyle)
              },
              [
                vue.renderSlot(_ctx.$slots, "startThumb")
              ],
              4
              /* STYLE */
            ),
            vue.createElementVNode(
              "view",
              {
                class: "i-slider__thumb",
                style: vue.normalizeStyle($setup.endThumbStyle)
              },
              [
                vue.renderSlot(_ctx.$slots, "endThumb")
              ],
              4
              /* STYLE */
            )
          ],
          32
          /* NEED_HYDRATION */
        )),
        $props.showValue ? (vue.openBlock(), vue.createElementBlock(
          "text",
          {
            key: 2,
            class: "i-slider__value"
          },
          vue.toDisplayString($setup.displayValue),
          1
          /* TEXT */
        )) : vue.createCommentVNode("v-if", true)
      ],
      2
      /* CLASS */
    );
  }
  const __easycom_4 = /* @__PURE__ */ _export_sfc(_sfc_main$q, [["render", _sfc_render$p], ["styles", [_style_0$p]], ["__file", "/Users/xyhc/Documents/carConnectInternet/uni_modules/i-ui-x/components/i-slider/i-slider.uvue"]]);
  function isString$1(str) {
    return typeof str == "string";
  }
  function isNumber$2(value) {
    return ["Int8", "UInt8", "Int16", "UInt16", "Int32", "UInt32", "Int64", "UInt64", "Int", "UInt", "Float", "Float16", "Float32", "Float64", "Double", "number"].includes(typeof value);
  }
  function isNumeric$1(value) {
    if (value == null) {
      return false;
    }
    if (isNumber$2(value)) {
      return true;
    } else if (isString$1(value)) {
      const regex = new RegExp("^(-)?\\d+(\\.\\d+)?$");
      return regex.test(value);
    }
    return false;
  }
  function unitConvert(value, base = 0) {
    if (value == null)
      return NaN;
    if (isNumber$2(value)) {
      return value;
    }
    if (isNumeric$1(value)) {
      return parseFloat(value);
    }
    if (isString$1(value)) {
      const reg = /^-?([0-9]+)?([.]{1}[0-9]+){0,1}(em|rpx|px|%)$/g;
      const results = reg.exec(value);
      if (results == null) {
        return NaN;
      }
      const unit = results[3];
      const _value = parseFloat(value);
      if (unit == "rpx") {
        return uni.rpx2px(_value);
      }
      if (unit == "px") {
        return _value;
      }
      if (unit == "%") {
        return _value / 100 * base;
      }
    }
    return NaN;
  }
  function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }
  const usePickerMask = (backgroundColorRef, isDarkModeRef, maskColorsRef, isInitializedRef) => {
    const maskConfig = vue.computed(() => {
      const bgColor = backgroundColorRef.value;
      const isDark = isDarkModeRef.value;
      const maskColors = maskColorsRef === null || maskColorsRef === void 0 ? void 0 : maskColorsRef.value;
      if (maskColors != null && maskColors.length >= 1) {
        const maskStartColor = maskColors[0];
        const maskEndColor = maskColors.length > 1 ? maskColors[1] : "rgba(0,0,0,0)";
        return {
          maskStartColor,
          maskEndColor
        };
      }
      const bg = bgColor !== null && bgColor !== void 0 ? bgColor : isDark ? "#242424" : "#ffffff";
      const endColor = isDark ? "rgba(36, 36, 36, 0)" : "rgba(255, 255, 255, 0)";
      return {
        maskStartColor: bg,
        maskEndColor: endColor
      };
    });
    const platformMaskStyles = vue.computed(() => {
      const _a = maskConfig.value, maskStartColor = _a.maskStartColor, maskEndColor = _a.maskEndColor;
      const clean = (str) => {
        return str.replace(/\s+/g, " ").trim();
      };
      return {
        common: backgroundColorRef.value == null && !isDarkModeRef.value ? clean("background-image:\n					linear-gradient(180deg, ".concat(maskStartColor, ", ").concat(maskEndColor, "),\n					linear-gradient(0deg, ").concat(maskStartColor, ", ").concat(maskEndColor, ")")) : "",
        top: isInitializedRef.value ? "background-color: rgba(0,0,0,0)" : "",
        bottom: isInitializedRef.value ? "background-color: rgba(0,0,0,0)" : ""
      };
    });
    return {
      maskConfig,
      platformMaskStyles
    };
  };
  class PickerCanvasConfig extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            itemHeight: { type: Number, optional: false },
            itemFontSize: { type: Number, optional: false },
            itemActiveFontWeight: { type: Number, optional: true },
            itemColor: { type: String, optional: true },
            itemActiveColor: { type: String, optional: true },
            canvasWidth: { type: Number, optional: false },
            canvasHeight: { type: Number, optional: false }
          };
        },
        name: "PickerCanvasConfig"
      };
    }
    constructor(options, metadata = PickerCanvasConfig.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.itemHeight = this.__props__.itemHeight;
      this.itemFontSize = this.__props__.itemFontSize;
      this.itemActiveFontWeight = this.__props__.itemActiveFontWeight;
      this.itemColor = this.__props__.itemColor;
      this.itemActiveColor = this.__props__.itemActiveColor;
      this.canvasWidth = this.__props__.canvasWidth;
      this.canvasHeight = this.__props__.canvasHeight;
      delete this.__props__;
    }
  }
  class PickerCanvasRenderer {
    constructor(itemRef) {
      this.ctx = null;
      this.dpr = 1;
      this.isInitialized = false;
      this.lastWidth = 0;
      this.lastHeight = 0;
      this.canvas = itemRef;
      this.initCanvas();
    }
    initCanvas() {
      this.isInitialized = true;
      return null;
    }
    setupCanvas(width, height) {
      return null;
    }
    clearRect(width = 1e3, height = 1e5) {
      var _a;
      (_a = this.ctx) === null || _a === void 0 ? null : _a.reset();
      return null;
    }
    render(options, curIndex, config, isDarkMode) {
      var _a, _b, _c;
      const ctx = this.canvas.getDrawableContext();
      const itemHeight = config.itemHeight;
      const fontSize = config.itemFontSize;
      const canvasWidth = config.canvasWidth;
      const canvasHeight = config.canvasHeight;
      this.setupCanvas(canvasWidth, canvasHeight);
      ctx.reset();
      const x = canvasWidth / 2;
      const itemActiveFontWeight = (_a = config === null || config === void 0 ? null : config.itemActiveFontWeight) !== null && _a !== void 0 ? _a : 700;
      const color = (_b = config === null || config === void 0 ? null : config.itemColor) !== null && _b !== void 0 ? _b : isDarkMode ? "rgba(255,255,255,0.88)" : "rgba(0,0,0,0.88)";
      const itemActiveColor = (_c = config === null || config === void 0 ? null : config.itemActiveColor) !== null && _c !== void 0 ? _c : isDarkMode ? "rgba(255,255,255,0.88)" : "rgba(0,0,0,0.88)";
      ctx.font = "".concat(fontSize, "px");
      ctx.textAlign = "center";
      ctx.lineWidth = 0.5;
      this.clearRect(canvasWidth, canvasHeight);
      options.forEach((item, index) => {
        let offset = 0.4;
        offset = 0.55;
        const y = itemHeight * index + fontSize + (itemHeight - fontSize) * offset;
        const isActive = index == curIndex && itemActiveFontWeight > 600;
        ctx.fillStyle = isActive ? itemActiveColor : color;
        ctx.strokeStyle = isActive ? itemActiveColor : color;
        ctx.fillText(item.label, x, y);
        if (isActive) {
          ctx.fillText(item.label, x - 0.2, y);
          ctx.fillText(item.label, x + 0.2, y);
          ctx.fillText(item.label, x, y - 0.2);
          ctx.fillText(item.label, x, y + 0.2);
        }
      });
      ctx.update();
    }
    destroy() {
      this.ctx = null;
      this.isInitialized = false;
    }
  }
  const _sfc_main$p = /* @__PURE__ */ vue.defineComponent({
    __name: "l-picker-item",
    props: {
      options: { type: Array, required: true, default: [] },
      value: { type: [String, Number], required: false },
      column: { type: Number, required: true, default: -1 },
      name: { type: [String, Number], required: false }
    },
    setup(__props, _a) {
      var __expose = _a.expose;
      const themeMode = vue.inject("limeConfigProviderTheme", vue.computed(() => {
        return "light";
      }));
      const instance = vue.getCurrentInstance();
      const props = __props;
      const picker = vue.inject("limePicker", null);
      const pickerItemInstanceArray = vue.inject("limePickerItems", null);
      const manageChildInList = vue.inject("limePickerManageChildInList", null);
      manageChildInList === null || manageChildInList === void 0 ? null : manageChildInList(instance.proxy, true);
      const onPick = vue.inject("limePickerOnPick", null);
      const updateItems = vue.inject("limePickerUpdateItems", null);
      const curIndex = vue.ref(0);
      const isInitialized = vue.ref(false);
      const curValue = vue.ref(props.value);
      const innerIndex = vue.computed(() => {
        return [curIndex.value];
      });
      const isDarkMode = vue.computed(() => {
        return themeMode.value == "dark";
      });
      const column = vue.computed(() => {
        var _a2;
        return props.column != -1 ? props.column : (_a2 = pickerItemInstanceArray === null || pickerItemInstanceArray === void 0 ? null : pickerItemInstanceArray.indexOf(instance.proxy)) !== null && _a2 !== void 0 ? _a2 : props.column;
      });
      const platformMaskStyles = usePickerMask(vue.computed(() => {
        return picker === null || picker === void 0 ? null : picker.bgColor;
      }), isDarkMode, vue.computed(() => {
        return picker === null || picker === void 0 ? null : picker.maskColors;
      }), isInitialized).platformMaskStyles;
      const indicatorStyles = vue.computed(() => {
        var _a2;
        let style = "height: ".concat((_a2 = picker === null || picker === void 0 ? null : picker.itemHeight) !== null && _a2 !== void 0 ? _a2 : "50px", ";border-bottom-color: transparent;");
        return style + (isInitialized.value ? "border-top-color: rgba(0,0,0,0.001);" : "border-top-color: transparent;");
      });
      const itemStyles = vue.computed(() => {
        var _a2;
        const style = /* @__PURE__ */ new Map();
        style.set("height", unitConvert((_a2 = picker === null || picker === void 0 ? null : picker.itemHeight) !== null && _a2 !== void 0 ? _a2 : 50) * props.options.length + "px");
        return style;
      });
      const itemActiveStyles = vue.computed(() => {
        const style = /* @__PURE__ */ new Map();
        if ((picker === null || picker === void 0 ? null : picker.itemActiveColor) != null) {
          style.set("color", picker.itemActiveColor);
        }
        if ((picker === null || picker === void 0 ? null : picker.itemActiveFontWeight) != null) {
          style.set("font-weight", picker.itemActiveFontWeight);
        }
        return style;
      });
      const getIndexByValue = (val = null) => {
        let defaultIndex = 0;
        if (val != null) {
          defaultIndex = props.options.findIndex((item = null) => {
            return item.value == val;
          });
        }
        return defaultIndex < 0 ? 0 : defaultIndex;
      };
      let lastCount = props.options.length;
      const setIndex = (index) => {
        curIndex.value;
        let _index = clamp(index, 0, props.options.length - 1);
        if (props.options.length > _index) {
          if (props.options.length == lastCount) {
            curIndex.value = _index;
            curValue.value = props.options[_index].value;
          } else {
            requestAnimationFrame(() => {
              curIndex.value = _index - 1;
              curIndex.value = _index;
              curValue.value = props.options[_index].value;
              lastCount = props.options.length;
            });
          }
        }
      };
      const setValue = (value = null) => {
        if (value == curValue.value)
          return null;
        curValue.value = value;
        const index = getIndexByValue(value);
        setIndex(index);
      };
      const setOptions = () => {
      };
      const setUpdateItems = () => {
        const index = clamp(curIndex.value, 0, props.options.length - 1);
        const curItem = props.options.length > index ? props.options[index] : null;
        if (curItem == null)
          return null;
        updateItems === null || updateItems === void 0 ? null : updateItems(curItem, index, column.value);
      };
      const handlePick = (e) => {
        if (props.options.length == 0)
          return null;
        const index = clamp(e.detail.value[0], 0, props.options.length - 1);
        const curItem = props.options[index];
        if (index == curIndex.value)
          return null;
        setIndex(index);
        onPick === null || onPick === void 0 ? null : onPick(curItem, index, column.value);
      };
      const stopValue = vue.watch(() => {
        return props.value;
      }, (v = null) => {
        setValue(v);
        setUpdateItems();
      }, { immediate: true });
      const itemRef = vue.ref(null);
      let canvasRenderer = null;
      const canvasWidth = vue.ref(0);
      const canvasHeight = vue.ref(0);
      const canvasConfig = vue.computed(() => {
        var _a2, _b;
        return new PickerCanvasConfig({
          itemHeight: unitConvert((_a2 = picker === null || picker === void 0 ? null : picker.itemHeight) !== null && _a2 !== void 0 ? _a2 : 50),
          itemFontSize: unitConvert((_b = picker === null || picker === void 0 ? null : picker.itemFontSize) !== null && _b !== void 0 ? _b : 16),
          itemActiveFontWeight: picker === null || picker === void 0 ? null : picker.itemActiveFontWeight,
          itemColor: picker === null || picker === void 0 ? null : picker.itemColor,
          itemActiveColor: picker === null || picker === void 0 ? null : picker.itemActiveColor,
          canvasWidth: canvasWidth.value,
          canvasHeight: canvasHeight.value
        });
      });
      const updateItemStyle = () => {
        if (itemRef.value == null)
          return null;
        if (canvasRenderer == null) {
          canvasRenderer = new PickerCanvasRenderer(itemRef.value);
        }
        canvasRenderer === null || canvasRenderer === void 0 ? null : canvasRenderer.render(props.options, curIndex.value, canvasConfig.value, isDarkMode.value);
      };
      const getBoundingClientRect = () => {
        requestAnimationFrame(() => {
          var _a2, _b;
          (_b = (_a2 = itemRef.value) === null || _a2 === void 0 ? null : _a2.getBoundingClientRectAsync()) === null || _b === void 0 ? null : _b.then((res) => {
            canvasWidth.value = res.width;
            canvasHeight.value = res.height;
          });
        });
      };
      const resizeObserver = new UniResizeObserver((entries) => {
        getBoundingClientRect();
      });
      let timerId = null;
      let renderCount = 0;
      const stopOptionsWatch = vue.watch([() => {
        return props.options;
      }, canvasHeight, isDarkMode, curIndex], () => {
        if (canvasHeight.value == 0)
          return null;
        updateItemStyle();
        if (renderCount > 2)
          return null;
        if (timerId != null) {
          clearTimeout(timerId);
        }
        timerId = setTimeout(() => {
          updateItemStyle();
          renderCount++;
        }, 50);
      });
      const stopItemRefWatch = vue.watch(() => {
        return itemRef.value;
      }, (el = null) => {
        if (el == null)
          return null;
        resizeObserver.observe(el);
        getBoundingClientRect();
      });
      vue.onMounted(() => {
        vue.nextTick(() => {
          setTimeout(() => {
            isInitialized.value = true;
          }, 400);
        });
      });
      vue.onBeforeUnmount(() => {
        manageChildInList === null || manageChildInList === void 0 ? null : manageChildInList(instance.proxy, false);
        stopOptionsWatch();
        stopItemRefWatch();
        resizeObserver.disconnect();
        canvasRenderer = null;
      });
      __expose({
        setIndex,
        setValue,
        // setOptions,
        // setUpdateItems,
        getIndexByValue
      });
      const __returned__ = { themeMode, instance, props, picker, pickerItemInstanceArray, manageChildInList, onPick, updateItems, curIndex, isInitialized, curValue, innerIndex, isDarkMode, column, platformMaskStyles, indicatorStyles, itemStyles, itemActiveStyles, getIndexByValue, get lastCount() {
        return lastCount;
      }, set lastCount(v = null) {
        lastCount = v;
      }, setIndex, setValue, setOptions, setUpdateItems, handlePick, stopValue, itemRef, get canvasRenderer() {
        return canvasRenderer;
      }, set canvasRenderer(v = null) {
        canvasRenderer = v;
      }, canvasWidth, canvasHeight, canvasConfig, updateItemStyle, getBoundingClientRect, resizeObserver, get timerId() {
        return timerId;
      }, set timerId(v = null) {
        timerId = v;
      }, get renderCount() {
        return renderCount;
      }, set renderCount(v) {
        renderCount = v;
      }, stopOptionsWatch, stopItemRefWatch };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  const _style_0$o = { "l-picker-item__group": { "": { "flexGrow": 1, "flexShrink": 1, "flexBasis": "0%" } }, "l-picker-item__group-item": { "": { "height": "var(--l-picker-item-height, 50px)", "lineHeight": "var(--l-picker-item-height, 50px)", "textAlign": "center", "transitionDuration": "100ms", "transitionProperty": "fontWeight,color", "transitionTimingFunction": "linear", "fontWeight": 400, "color": "var(--l-picker-item-color, #000000E0)", "fontSize": "var(--l-picker-item-font-size, 16px)", "whiteSpace": "nowrap" } }, "l-picker-item__group-item--active": { "": { "color": "var(--l-picker-item-active-color, #000000E0)", "fontWeight": "var(--l-picker-item-active-font-weight, 700)" } }, "l-picker-item__wrapper": { "": { "width": "100%" } }, "@TRANSITION": { "l-picker-item__group-item": { "duration": "100ms", "property": "fontWeight,color", "timingFunction": "linear" } } };
  function _sfc_render$o(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("picker-view", {
      class: "l-picker-item__group",
      style: vue.normalizeStyle({ opacity: $props.options.length > 0 ? 1 : 0 }),
      "mask-style": $setup.platformMaskStyles.common,
      "mask-top-style": $setup.platformMaskStyles.top,
      "mask-bottom-style": $setup.platformMaskStyles.bottom,
      "indicator-style": $setup.indicatorStyles,
      "mask-class": "l-picker-item__mask",
      value: $setup.innerIndex,
      onChange: $setup.handlePick,
      "indicator-class": "l-picker-item__indicator"
    }, [
      vue.createElementVNode("picker-view-column", { class: "l-picker-item__wrapper" }, [
        vue.createElementVNode(
          "view",
          {
            ref: "itemRef",
            style: vue.normalizeStyle([$setup.itemStyles])
          },
          null,
          4
          /* STYLE */
        )
      ])
    ], 44, ["mask-style", "mask-top-style", "mask-bottom-style", "indicator-style", "value"]);
  }
  const __easycom_0$3 = /* @__PURE__ */ _export_sfc(_sfc_main$p, [["render", _sfc_render$o], ["styles", [_style_0$o]], ["__file", "/Users/xyhc/Documents/carConnectInternet/uni_modules/lime-picker/components/l-picker-item/l-picker-item.uvue"]]);
  function arrayEqual(arr1, arr2) {
    return arr1.length == arr2.length && arr1.every((val, i) => {
      return val == arr2[i];
    });
  }
  function assignAtIndex(arr, index, value) {
    if (index < 0) {
      throw new Error("Index must be a non-negative integer, got ".concat(index));
    }
    arr[index] = value;
  }
  class RGB extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            r: { type: Number, optional: false },
            g: { type: Number, optional: false },
            b: { type: Number, optional: false }
          };
        },
        name: "RGB"
      };
    }
    constructor(options, metadata = RGB.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.r = this.__props__.r;
      this.g = this.__props__.g;
      this.b = this.__props__.b;
      delete this.__props__;
    }
  }
  class RGBA extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            r: { type: Number, optional: false },
            g: { type: Number, optional: false },
            b: { type: Number, optional: false },
            a: { type: Number, optional: false }
          };
        },
        name: "RGBA"
      };
    }
    constructor(options, metadata = RGBA.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.r = this.__props__.r;
      this.g = this.__props__.g;
      this.b = this.__props__.b;
      this.a = this.__props__.a;
      delete this.__props__;
    }
  }
  class RGBAString extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            r: { type: String, optional: false },
            g: { type: String, optional: false },
            b: { type: String, optional: false },
            a: { type: Number, optional: false }
          };
        },
        name: "RGBAString"
      };
    }
    constructor(options, metadata = RGBAString.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.r = this.__props__.r;
      this.g = this.__props__.g;
      this.b = this.__props__.b;
      this.a = this.__props__.a;
      delete this.__props__;
    }
  }
  class HSL extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            h: { type: Number, optional: false },
            s: { type: Number, optional: false },
            l: { type: Number, optional: false }
          };
        },
        name: "HSL"
      };
    }
    constructor(options, metadata = HSL.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.h = this.__props__.h;
      this.s = this.__props__.s;
      this.l = this.__props__.l;
      delete this.__props__;
    }
  }
  class HSLA extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            h: { type: Number, optional: false },
            s: { type: Number, optional: false },
            l: { type: Number, optional: false },
            a: { type: Number, optional: false }
          };
        },
        name: "HSLA"
      };
    }
    constructor(options, metadata = HSLA.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.h = this.__props__.h;
      this.s = this.__props__.s;
      this.l = this.__props__.l;
      this.a = this.__props__.a;
      delete this.__props__;
    }
  }
  class HSV extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            h: { type: Number, optional: false },
            s: { type: Number, optional: false },
            v: { type: Number, optional: false }
          };
        },
        name: "HSV"
      };
    }
    constructor(options, metadata = HSV.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.h = this.__props__.h;
      this.s = this.__props__.s;
      this.v = this.__props__.v;
      delete this.__props__;
    }
  }
  class HSVA extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            h: { type: Number, optional: false },
            s: { type: Number, optional: false },
            v: { type: Number, optional: false },
            a: { type: Number, optional: false }
          };
        },
        name: "HSVA"
      };
    }
    constructor(options, metadata = HSVA.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.h = this.__props__.h;
      this.s = this.__props__.s;
      this.v = this.__props__.v;
      this.a = this.__props__.a;
      delete this.__props__;
    }
  }
  class HSB extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            h: { type: Number, optional: false },
            s: { type: Number, optional: false },
            b: { type: Number, optional: false }
          };
        },
        name: "HSB"
      };
    }
    constructor(options, metadata = HSB.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.h = this.__props__.h;
      this.s = this.__props__.s;
      this.b = this.__props__.b;
      delete this.__props__;
    }
  }
  class HSBA extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            h: { type: Number, optional: false },
            s: { type: Number, optional: false },
            b: { type: Number, optional: false },
            a: { type: Number, optional: false }
          };
        },
        name: "HSBA"
      };
    }
    constructor(options, metadata = HSBA.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.h = this.__props__.h;
      this.s = this.__props__.s;
      this.b = this.__props__.b;
      this.a = this.__props__.a;
      delete this.__props__;
    }
  }
  class LColorInfo extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            ok: { type: Boolean, optional: true },
            format: { type: "Unknown", optional: true },
            r: { type: Number, optional: false },
            g: { type: Number, optional: false },
            b: { type: Number, optional: false },
            a: { type: Number, optional: false }
          };
        },
        name: "LColorInfo"
      };
    }
    constructor(options, metadata = LColorInfo.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.ok = this.__props__.ok;
      this.format = this.__props__.format;
      this.r = this.__props__.r;
      this.g = this.__props__.g;
      this.b = this.__props__.b;
      this.a = this.__props__.a;
      delete this.__props__;
    }
  }
  class LColorOptions extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            format: { type: "Unknown", optional: true },
            gradientType: { type: String, optional: true }
          };
        },
        name: "LColorOptions"
      };
    }
    constructor(options, metadata = LColorOptions.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.format = this.__props__.format;
      this.gradientType = this.__props__.gradientType;
      delete this.__props__;
    }
  }
  class LGenerateOptions extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            theme: { type: "Unknown", optional: true },
            backgroundColor: { type: String, optional: true }
          };
        },
        name: "LGenerateOptions"
      };
    }
    constructor(options, metadata = LGenerateOptions.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.theme = this.__props__.theme;
      this.backgroundColor = this.__props__.backgroundColor;
      delete this.__props__;
    }
  }
  function isNumber$1(value = null) {
    return ["Int8", "UInt8", "Int16", "UInt16", "Int32", "UInt32", "Int64", "UInt64", "Int", "UInt", "Float", "Float16", "Float32", "Float64", "Double", "number"].includes(typeof value);
  }
  function isString(value = null) {
    return typeof value == "string";
  }
  function isNumeric(value = null) {
    if (isNumber$1(value)) {
      return true;
    } else if (isString(value)) {
      const regex = new RegExp("^(-)?\\d+(\\.\\d+)?$");
      return regex.test(value);
    }
    return false;
  }
  function toBoolean(value = null) {
    if (isNumber$1(value)) {
      return value != 0;
    }
    if (isString(value)) {
      return "".concat(value).length > 0;
    }
    if (typeof value == "boolean") {
      return value;
    }
    return value != null;
  }
  function isPercentage(n = null) {
    return isString(n) && n.indexOf("%") != -1;
  }
  function isOnePointZero(n = null) {
    return isString(n) && n.indexOf(".") != -1 && parseFloat(n) == 1;
  }
  function bound01(n = null, max) {
    if (!(isNumber$1(n) || isString(n))) {
      return 1;
    }
    if (isOnePointZero(n)) {
      n = "100%";
    }
    const isPercent = isPercentage(n);
    n = isNumber$1(n) ? n : parseFloat(n);
    n = max == 360 ? n : Math.min(max, Math.max(0, n));
    if (isPercent) {
      n = parseInt("".concat(Math.min(n, 100) * max), 10) / 100;
    }
    if (Math.abs(n - max) < 1e-6) {
      return 1;
    }
    if (max == 360) {
      n = (n < 0 ? n % max + max : n % max) / max;
    } else {
      n = n % max / max;
    }
    return n;
  }
  function clamp01(val) {
    return Math.min(1, Math.max(0, val));
  }
  function boundAlpha(a = null) {
    let n = a == null ? 1 : isString(a) ? parseFloat(a) : a;
    if (isNaN(n) || n < 0 || n > 1) {
      n = 1;
    }
    return n;
  }
  function convertToPercentage(n = null) {
    n = isNumeric(n) ? parseFloat("".concat(n)) : n;
    if (isNumber$1(n) && n <= 1) {
      return "".concat(n * 100, "%").replace(".0%", "%");
    }
    return n;
  }
  function pad2(c) {
    return c.length == 1 ? "0" + c : "".concat(c);
  }
  function rgbToRgb(r = null, g = null, b = null) {
    return new RGB({
      r: bound01(r, 255) * 255,
      g: bound01(g, 255) * 255,
      b: bound01(b, 255) * 255
    });
  }
  function rgbToHsl(r = null, g = null, b = null) {
    r = bound01(r, 255);
    g = bound01(g, 255);
    b = bound01(b, 255);
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s;
    const l = (max + min) / 2;
    if (max == min) {
      s = 0;
      h = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
        default:
          uni.__log__("log", "at uni_modules/lime-color/common/conversion.uts:64", "h");
          break;
      }
      h /= 6;
    }
    return new HSL({ h, s, l });
  }
  function hue2rgb(p, q, t) {
    let _t = t;
    if (_t < 0) {
      _t += 1;
    }
    if (_t > 1) {
      _t -= 1;
    }
    if (_t < 1 / 6) {
      return p + (q - p) * (6 * _t);
    }
    if (_t < 1 / 2) {
      return q;
    }
    if (_t < 2 / 3) {
      return p + (q - p) * (2 / 3 - _t) * 6;
    }
    return p;
  }
  function hslToRgb(h = null, s = null, l = null) {
    let r;
    let g;
    let b;
    h = bound01(h, 360);
    s = bound01(s, 100);
    l = bound01(l, 100);
    if (s == 0) {
      g = l;
      b = l;
      r = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
    return new RGB({ r: r * 255, g: g * 255, b: b * 255 });
  }
  function rgbToHsv(r, g, b) {
    r = bound01(r, 255);
    g = bound01(g, 255);
    b = bound01(b, 255);
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    const v = max;
    const d = max - min;
    const s = max == 0 ? 0 : d / max;
    if (max == min) {
      h = 0;
    } else {
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
        default:
          uni.__log__("log", "at uni_modules/lime-color/common/conversion.uts:171", "1");
          break;
      }
      h /= 6;
    }
    return new HSV({ h, s, v });
  }
  function hsvToRgb(h = null, s = null, v = null) {
    h = bound01(h, 360) * 6;
    s = bound01(s, 100);
    v = bound01(v, 100);
    const i = Math.floor(h);
    const f = h - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);
    const mod = i % 6;
    const r = [v, q, p, p, t, v][mod];
    const g = [t, v, v, q, p, p][mod];
    const b = [p, p, t, v, v, q][mod];
    return new RGB({ r: r * 255, g: g * 255, b: b * 255 });
  }
  function rgbToHex(r, g, b, allow3Char = false) {
    const hex = [
      pad2(Math.round(r).toString(16)),
      pad2(Math.round(g).toString(16)),
      pad2(Math.round(b).toString(16))
    ];
    if (allow3Char && hex[0].startsWith(hex[0].charAt(1)) && hex[1].startsWith(hex[1].charAt(1)) && hex[2].startsWith(hex[2].charAt(1))) {
      return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
    }
    return hex.join("");
  }
  function rgbaToHex(r, g, b, a, allow4Char = false) {
    const hex = [
      pad2(Math.round(r).toString(16)),
      pad2(Math.round(g).toString(16)),
      pad2(Math.round(b).toString(16)),
      pad2(convertDecimalToHex(a))
    ];
    if (allow4Char && hex[0].startsWith(hex[0].charAt(1)) && hex[1].startsWith(hex[1].charAt(1)) && hex[2].startsWith(hex[2].charAt(1)) && hex[3].startsWith(hex[3].charAt(1))) {
      return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0) + hex[3].charAt(0);
    }
    return hex.join("");
  }
  function convertDecimalToHex(d = null) {
    return Math.round(parseFloat("".concat(d)) * 255).toString(16);
  }
  function convertHexToDecimal(h) {
    return parseIntFromHex(h) / 255;
  }
  function parseIntFromHex(val) {
    return parseInt(val, 16);
  }
  function numberInputToObject(color) {
    return new RGB({
      r: color >> 16,
      g: (color & 65280) >> 8,
      b: color & 255
    });
  }
  const names = /* @__PURE__ */ new Map([
    ["aliceblue", "#f0f8ff"],
    ["antiquewhite", "#faebd7"],
    ["aqua", "#00ffff"],
    ["aquamarine", "#7fffd4"],
    ["azure", "#f0ffff"],
    ["beige", "#f5f5dc"],
    ["bisque", "#ffe4c4"],
    ["black", "#000000"],
    ["blanchedalmond", "#ffebcd"],
    ["blue", "#0000ff"],
    ["blueviolet", "#8a2be2"],
    ["brown", "#a52a2a"],
    ["burlywood", "#deb887"],
    ["cadetblue", "#5f9ea0"],
    ["chartreuse", "#7fff00"],
    ["chocolate", "#d2691e"],
    ["coral", "#ff7f50"],
    ["cornflowerblue", "#6495ed"],
    ["cornsilk", "#fff8dc"],
    ["crimson", "#dc143c"],
    ["cyan", "#00ffff"],
    ["darkblue", "#00008b"],
    ["darkcyan", "#008b8b"],
    ["darkgoldenrod", "#b8860b"],
    ["darkgray", "#a9a9a9"],
    ["darkgreen", "#006400"],
    ["darkgrey", "#a9a9a9"],
    ["darkkhaki", "#bdb76b"],
    ["darkmagenta", "#8b008b"],
    ["darkolivegreen", "#556b2f"],
    ["darkorange", "#ff8c00"],
    ["darkorchid", "#9932cc"],
    ["darkred", "#8b0000"],
    ["darksalmon", "#e9967a"],
    ["darkseagreen", "#8fbc8f"],
    ["darkslateblue", "#483d8b"],
    ["darkslategray", "#2f4f4f"],
    ["darkslategrey", "#2f4f4f"],
    ["darkturquoise", "#00ced1"],
    ["darkviolet", "#9400d3"],
    ["deeppink", "#ff1493"],
    ["deepskyblue", "#00bfff"],
    ["dimgray", "#696969"],
    ["dimgrey", "#696969"],
    ["dodgerblue", "#1e90ff"],
    ["firebrick", "#b22222"],
    ["floralwhite", "#fffaf0"],
    ["forestgreen", "#228b22"],
    ["fuchsia", "#ff00ff"],
    ["gainsboro", "#dcdcdc"],
    ["ghostwhite", "#f8f8ff"],
    ["goldenrod", "#daa520"],
    ["gold", "#ffd700"],
    ["gray", "#808080"],
    ["green", "#008000"],
    ["greenyellow", "#adff2f"],
    ["grey", "#808080"],
    ["honeydew", "#f0fff0"],
    ["hotpink", "#ff69b4"],
    ["indianred", "#cd5c5c"],
    ["indigo", "#4b0082"],
    ["ivory", "#fffff0"],
    ["khaki", "#f0e68c"],
    ["lavenderblush", "#fff0f5"],
    ["lavender", "#e6e6fa"],
    ["lawngreen", "#7cfc00"],
    ["lemonchiffon", "#fffacd"],
    ["lightblue", "#add8e6"],
    ["lightcoral", "#f08080"],
    ["lightcyan", "#e0ffff"],
    ["lightgoldenrodyellow", "#fafad2"],
    ["lightgray", "#d3d3d3"],
    ["lightgreen", "#90ee90"],
    ["lightgrey", "#d3d3d3"],
    ["lightpink", "#ffb6c1"],
    ["lightsalmon", "#ffa07a"],
    ["lightseagreen", "#20b2aa"],
    ["lightskyblue", "#87cefa"],
    ["lightslategray", "#778899"],
    ["lightslategrey", "#778899"],
    ["lightsteelblue", "#b0c4de"],
    ["lightyellow", "#ffffe0"],
    ["lime", "#00ff00"],
    ["limegreen", "#32cd32"],
    ["linen", "#faf0e6"],
    ["magenta", "#ff00ff"],
    ["maroon", "#800000"],
    ["mediumaquamarine", "#66cdaa"],
    ["mediumblue", "#0000cd"],
    ["mediumorchid", "#ba55d3"],
    ["mediumpurple", "#9370db"],
    ["mediumseagreen", "#3cb371"],
    ["mediumslateblue", "#7b68ee"],
    ["mediumspringgreen", "#00fa9a"],
    ["mediumturquoise", "#48d1cc"],
    ["mediumvioletred", "#c71585"],
    ["midnightblue", "#191970"],
    ["mintcream", "#f5fffa"],
    ["mistyrose", "#ffe4e1"],
    ["moccasin", "#ffe4b5"],
    ["navajowhite", "#ffdead"],
    ["navy", "#000080"],
    ["oldlace", "#fdf5e6"],
    ["olive", "#808000"],
    ["olivedrab", "#6b8e23"],
    ["orange", "#ffa500"],
    ["orangered", "#ff4500"],
    ["orchid", "#da70d6"],
    ["palegoldenrod", "#eee8aa"],
    ["palegreen", "#98fb98"],
    ["paleturquoise", "#afeeee"],
    ["palevioletred", "#db7093"],
    ["papayawhip", "#ffefd5"],
    ["peachpuff", "#ffdab9"],
    ["peru", "#cd853f"],
    ["pink", "#ffc0cb"],
    ["plum", "#dda0dd"],
    ["powderblue", "#b0e0e6"],
    ["purple", "#800080"],
    ["rebeccapurple", "#663399"],
    ["red", "#ff0000"],
    ["rosybrown", "#bc8f8f"],
    ["royalblue", "#4169e1"],
    ["saddlebrown", "#8b4513"],
    ["salmon", "#fa8072"],
    ["sandybrown", "#f4a460"],
    ["seagreen", "#2e8b57"],
    ["seashell", "#fff5ee"],
    ["sienna", "#a0522d"],
    ["silver", "#c0c0c0"],
    ["skyblue", "#87ceeb"],
    ["slateblue", "#6a5acd"],
    ["slategray", "#708090"],
    ["slategrey", "#708090"],
    ["snow", "#fffafa"],
    ["springgreen", "#00ff7f"],
    ["steelblue", "#4682b4"],
    ["tan", "#d2b48c"],
    ["teal", "#008080"],
    ["thistle", "#d8bfd8"],
    ["tomato", "#ff6347"],
    ["turquoise", "#40e0d0"],
    ["violet", "#ee82ee"],
    ["wheat", "#f5deb3"],
    ["white", "#ffffff"],
    ["whitesmoke", "#f5f5f5"],
    ["yellow", "#ffff00"],
    ["yellowgreen", "#9acd32"]
  ]);
  class ColorMatchers extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            CSS_UNIT: { type: "Unknown", optional: false },
            rgb: { type: "Unknown", optional: false },
            rgba: { type: "Unknown", optional: false },
            hsl: { type: "Unknown", optional: false },
            hsla: { type: "Unknown", optional: false },
            hsv: { type: "Unknown", optional: false },
            hsva: { type: "Unknown", optional: false },
            hsb: { type: "Unknown", optional: false },
            hsba: { type: "Unknown", optional: false },
            hex3: { type: "Unknown", optional: false },
            hex6: { type: "Unknown", optional: false },
            hex4: { type: "Unknown", optional: false },
            hex8: { type: "Unknown", optional: false }
          };
        },
        name: "ColorMatchers"
      };
    }
    constructor(options, metadata = ColorMatchers.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.CSS_UNIT = this.__props__.CSS_UNIT;
      this.rgb = this.__props__.rgb;
      this.rgba = this.__props__.rgba;
      this.hsl = this.__props__.hsl;
      this.hsla = this.__props__.hsla;
      this.hsv = this.__props__.hsv;
      this.hsva = this.__props__.hsva;
      this.hsb = this.__props__.hsb;
      this.hsba = this.__props__.hsba;
      this.hex3 = this.__props__.hex3;
      this.hex6 = this.__props__.hex6;
      this.hex4 = this.__props__.hex4;
      this.hex8 = this.__props__.hex8;
      delete this.__props__;
    }
  }
  const CSS_INTEGER = "[-\\+]?\\d+%?";
  const CSS_NUMBER = "[-\\+]?\\d*\\.\\d+%?";
  const CSS_UNIT = "(?:".concat(CSS_NUMBER, ")|(?:").concat(CSS_INTEGER, ")");
  const PERMISSIVE_MATCH3 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
  const PERMISSIVE_MATCH4 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
  const matchers = new ColorMatchers({
    CSS_UNIT: new RegExp(CSS_UNIT),
    rgb: new RegExp("rgb" + PERMISSIVE_MATCH3),
    rgba: new RegExp("rgba" + PERMISSIVE_MATCH4),
    hsl: new RegExp("hsl" + PERMISSIVE_MATCH3),
    hsla: new RegExp("hsla" + PERMISSIVE_MATCH4),
    hsv: new RegExp("hsv" + PERMISSIVE_MATCH3),
    hsva: new RegExp("hsva" + PERMISSIVE_MATCH4),
    hsb: new RegExp("hsb" + PERMISSIVE_MATCH3),
    hsba: new RegExp("hsba" + PERMISSIVE_MATCH4),
    hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
    hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
    hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
    hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
  });
  function isValidCSSUnit(color = null) {
    return toBoolean(matchers.CSS_UNIT.exec("".concat(color)));
  }
  function inputToRGB(color = null) {
    var _a;
    let _color = null;
    let rgb = new RGB({ r: 0, g: 0, b: 0 });
    let a = 1;
    let s = null;
    let v = null;
    let l = null;
    let ok = false;
    let format = null;
    if (typeof color == "string") {
      _color = stringInputToObject(color);
    } else if (typeof color == "object") {
      _color = UTS.JSON.parse(UTS.JSON.stringify(color), UTSJSONObject);
    } else
      ;
    if (_color != null) {
      if (isValidCSSUnit(_color["r"]) && isValidCSSUnit(_color["g"]) && isValidCSSUnit(_color["b"])) {
        rgb = rgbToRgb(_color["r"], _color["g"], _color["b"]);
        ok = true;
        format = "".concat(_color["r"]).endsWith("%") ? "prgb" : "rgb";
      } else if (isValidCSSUnit(_color["h"]) && isValidCSSUnit(_color["s"]) && (isValidCSSUnit(_color["v"]) || isValidCSSUnit(_color["b"]))) {
        const isHSV = _color["v"] != null;
        s = convertToPercentage(_color["s"]);
        v = isHSV ? convertToPercentage(_color["v"]) : convertToPercentage(_color["b"]);
        rgb = hsvToRgb(_color["h"], s, v);
        ok = true;
        format = isHSV ? "hsv" : "hsb";
      } else if (isValidCSSUnit(_color["h"]) && isValidCSSUnit(_color["s"]) && isValidCSSUnit(_color["l"])) {
        s = convertToPercentage(_color["s"]);
        l = convertToPercentage(_color["l"]);
        rgb = hslToRgb(_color["h"], s, l);
        ok = true;
        format = "hsl";
      }
      if (_color["a"] != null) {
        a = _color["a"];
      }
    }
    a = boundAlpha(a);
    return new LColorInfo({
      ok,
      format: (_a = _color === null || _color === void 0 ? null : _color["format"]) !== null && _a !== void 0 ? _a : format,
      r: Math.min(255, Math.max(rgb.r, 0)),
      g: Math.min(255, Math.max(rgb.g, 0)),
      b: Math.min(255, Math.max(rgb.b, 0)),
      a
    });
  }
  function stringInputToObject(color) {
    let _color = color.trim().toLowerCase();
    if (_color.length == 0) {
      return null;
    }
    let named = false;
    if (UTS.mapGet(names, _color) != null) {
      _color = UTS.mapGet(names, _color);
      named = true;
    } else if (_color == "transparent") {
      return new UTSJSONObject({ r: 0, g: 0, b: 0, a: 0, format: "name" });
    }
    let match = matchers.rgb.exec(_color);
    if (match != null) {
      const r = match[1];
      const g = match[2];
      const b = match[3];
      return new UTSJSONObject({ r, g, b });
    }
    match = matchers.rgba.exec(_color);
    if (match != null) {
      const r = match[1];
      const g = match[2];
      const b = match[3];
      const a = match[4];
      return new UTSJSONObject({ r, g, b, a });
    }
    match = matchers.hsl.exec(_color);
    if (match != null) {
      match[1];
      const s = match[2];
      const l = match[3];
      return new UTSJSONObject({ h: vue.h, s, l });
    }
    match = matchers.hsla.exec(_color);
    if (match != null) {
      match[1];
      const s = match[2];
      const l = match[3];
      const a = match[4];
      return new UTSJSONObject({ h: vue.h, s, l, a });
    }
    match = matchers.hsv.exec(_color);
    if (match != null) {
      match[1];
      const s = match[2];
      const v = match[3];
      return new UTSJSONObject({ h: vue.h, s, v });
    }
    match = matchers.hsva.exec(_color);
    if (match != null) {
      match[1];
      const s = match[2];
      const v = match[3];
      const a = match[4];
      return new UTSJSONObject({ h: vue.h, s, v, a });
    }
    match = matchers.hex8.exec(_color);
    if (match != null) {
      const r = parseIntFromHex(match[1]);
      const g = parseIntFromHex(match[2]);
      const b = parseIntFromHex(match[3]);
      const a = convertHexToDecimal(match[4]);
      return new UTSJSONObject({
        r,
        g,
        b,
        a,
        format: named ? "name" : "hex8"
      });
    }
    match = matchers.hex6.exec(_color);
    if (match != null) {
      const r = parseIntFromHex(match[1]);
      const g = parseIntFromHex(match[2]);
      const b = parseIntFromHex(match[3]);
      return new UTSJSONObject({
        r,
        g,
        b,
        format: named ? "name" : "hex"
      });
    }
    match = matchers.hex4.exec(_color);
    if (match != null) {
      const r = parseIntFromHex(match[1] + match[1]);
      const g = parseIntFromHex(match[2] + match[2]);
      const b = parseIntFromHex(match[3] + match[3]);
      const a = convertHexToDecimal(match[4] + match[4]);
      return new UTSJSONObject({
        r,
        g,
        b,
        a,
        format: named ? "name" : "hex8"
      });
    }
    match = matchers.hex3.exec(_color);
    if (match != null) {
      const r = parseIntFromHex(match[1] + match[1]);
      const g = parseIntFromHex(match[2] + match[2]);
      const b = parseIntFromHex(match[3] + match[3]);
      return new UTSJSONObject({
        r,
        g,
        b,
        format: named ? "name" : "hex"
      });
    }
    return null;
  }
  class TinyColor {
    constructor(color = "", opts = new LColorOptions({
      format: null,
      gradientType: null
    })) {
      var _a, _b;
      let _color = color;
      if (isNumber$1(color)) {
        _color = numberInputToObject(color);
      }
      this.originalInput = _color;
      const rgb = inputToRGB(_color);
      this.r = rgb.r;
      this.g = rgb.g;
      this.b = rgb.b;
      this.a = rgb.a;
      this.roundA = Math.round(100 * this.a) / 100;
      this.format = (_a = opts.format) !== null && _a !== void 0 ? _a : rgb.format;
      this.gradientType = opts.gradientType;
      if (this.r < 1) {
        this.r = Math.round(this.r);
      }
      if (this.g < 1) {
        this.g = Math.round(this.g);
      }
      if (this.b < 1) {
        this.b = Math.round(this.b);
      }
      this.isValid = (_b = rgb.ok) !== null && _b !== void 0 ? _b : false;
      this.reversedNames = /* @__PURE__ */ new Map();
      names.forEach((value, key) => {
        this.reversedNames.set(value, key);
      });
    }
    /**
     * 判断当前颜色是否为暗色。
     * @returns 一个布尔值，表示当前颜色是否为暗色。
     */
    isDark() {
      return this.getBrightness() < 128;
    }
    /**
     * 判断当前颜色是否为亮色。
     * @returns 一个布尔值，表示当前颜色是否为亮色。
     */
    isLight() {
      return !this.isDark();
    }
    /**
     * 计算当前颜色的亮度值。
     * 亮度值是根据 RGB 颜色空间中的红、绿、蓝三个通道的值计算得出的，计算公式为：(r * 299 + g * 587 + b * 114) / 1000。
     * @returns 返回颜色的感知亮度，范围从0-255。
     */
    getBrightness() {
      const rgb = this.toRgb();
      return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1e3;
    }
    /**
     * 计算当前颜色的相对亮度值。
     * 相对亮度值是根据 RGB 颜色空间中的红、绿、蓝三个通道的值计算得出的，计算公式为：0.2126 * R + 0.7152 * G + 0.0722 * B。
     * @returns 返回颜色的感知亮度，范围从0-1。
     */
    getLuminance() {
      const rgb = this.toRgb();
      let R;
      let G;
      let B;
      const RsRGB = rgb.r / 255;
      const GsRGB = rgb.g / 255;
      const BsRGB = rgb.b / 255;
      if (RsRGB <= 0.03928) {
        R = RsRGB / 12.92;
      } else {
        R = Math.pow((RsRGB + 0.055) / 1.055, 2.4);
      }
      if (GsRGB <= 0.03928) {
        G = GsRGB / 12.92;
      } else {
        G = Math.pow((GsRGB + 0.055) / 1.055, 2.4);
      }
      if (BsRGB <= 0.03928) {
        B = BsRGB / 12.92;
      } else {
        B = Math.pow((BsRGB + 0.055) / 1.055, 2.4);
      }
      return 0.2126 * R + 0.7152 * G + 0.0722 * B;
    }
    /**
     * 获取当前颜色的透明度值。
     * 透明度值的范围是 0 到 1，其中 0 表示完全透明，1 表示完全不透明。
     * @returns 一个数字，表示当前颜色的透明度值。
     */
    getAlpha() {
      return this.a;
    }
    setAlpha(alpha = null) {
      this.a = boundAlpha(alpha);
      this.roundA = Math.round(100 * this.a) / 100;
      return this;
    }
    /**
     * 判断当前颜色是否为单色。
     * 单色是指颜色的饱和度（S）为 0 的颜色，这些颜色只有明度（L）变化，没有颜色变化。
     * @returns 一个布尔值，表示当前颜色是否为单色。
     */
    isMonochrome() {
      const s = this.toHsl().s;
      return s == 0;
    }
    /**
     * 将当前颜色转换为 HSV（色相、饱和度、亮度）颜色空间。
     * @returns 一个对象，包含四个属性：`h`（色相）、`s`（饱和度）、`v`（亮度）和 `a`（透明度）。
     */
    toHsv() {
      const hsv = rgbToHsv(this.r, this.g, this.b);
      return new HSVA({ h: Math.round(hsv.h * 360), s: hsv.s, v: hsv.v, a: this.a });
    }
    /**
     * 将当前颜色转换为 HSV（色相、饱和度、亮度）颜色空间的字符串表示。
     * @returns 一个字符串，表示当前颜色的 HSV 或 HSVA 格式 hsva(xxx, xxx, xxx, xx)。
     */
    toHsvString() {
      const hsv = rgbToHsv(this.r, this.g, this.b);
      const h = Math.round(hsv.h * 360);
      const s = Math.round(hsv.s * 100);
      const v = Math.round(hsv.v * 100);
      return this.a == 1 ? "hsv(".concat(h, ", ").concat(s, "%, ").concat(v, "%)") : "hsva(".concat(h, ", ").concat(s, "%, ").concat(v, "%, ").concat(this.roundA, ")");
    }
    /**
     * 将当前颜色对象转换为HSBA颜色空间,即Hue（色相）、Saturation（饱和度）、Brightness（亮度）和Alpha（透明度
     * @returns {HSBA} 返回一个HSBA对象，表示当前颜色对象在HSBA颜色空间中的值
     */
    toHsb() {
      const hsv = rgbToHsv(this.r, this.g, this.b);
      return new HSBA({ h: Math.round(hsv.h * 360), s: hsv.s, b: hsv.v, a: this.a });
    }
    /**
     * 将当前颜色对象转换为CSS风格的HSB或HSVA字符串
     * @returns {string} 返回一个CSS风格的HSB或HSVA字符串，表示当前颜色对象的颜色值
     */
    toHsbString() {
      const hsb = this.toHsb();
      const h = Math.round(hsb.h);
      const s = Math.round(hsb.s * 100);
      const b = Math.round(hsb.b * 100);
      return this.a == 1 ? "hsb(".concat(h, ", ").concat(s, "%, ").concat(b, "%)") : "hsba(".concat(h, ", ").concat(s, "%, ").concat(b, "%, ").concat(this.roundA, ")");
    }
    /**
     * 将当前颜色转换为 HSL（色相、饱和度、明度）颜色空间。
     * @returns 一个对象，包含四个属性：`h`（色相）、`s`（饱和度）、`l`（明度）和 `a`（透明度）。
     */
    toHsl() {
      const hsl = rgbToHsl(this.r, this.g, this.b);
      return new HSLA({ h: hsl.h * 360, s: hsl.s, l: hsl.l, a: this.a });
    }
    /**
     * 将当前颜色转换为 HSL（色相、饱和度、明度）颜色空间的字符串表示。
     * @returns 一个字符串，表示当前颜色的 HSL 或 HSLA 格式 hsla(xxx, xxx, xxx, xx)。
     */
    toHslString() {
      const hsl = rgbToHsl(this.r, this.g, this.b);
      const h = Math.round(hsl.h * 360);
      const s = Math.round(hsl.s * 100);
      const l = Math.round(hsl.l * 100);
      return this.a == 1 ? "hsl(".concat(h, ", ").concat(s, "%, ").concat(l, "%)") : "hsla(".concat(h, ", ").concat(s, "%, ").concat(l, "%, ").concat(this.roundA, ")");
    }
    /**
     * 将当前颜色转换为十六进制颜色表示。
     * @param allow3Char 是否允许返回简写的十六进制颜色表示（如果可能）。默认值为 `false`。
     * @returns 一个字符串，表示当前颜色的十六进制格式。
     */
    toHex(allow3Char = false) {
      return rgbToHex(this.r, this.g, this.b, allow3Char);
    }
    /**
     * 将当前颜色转换为带有井号（`#`）前缀的十六进制颜色表示。
     * @param allow3Char 是否允许返回简写的十六进制颜色表示（如果可能）。默认值为 `false`。
     * @returns 一个字符串，表示当前颜色的带有井号前缀的十六进制格式。
     */
    toHexString(allow3Char = false) {
      return "#" + this.toHex(allow3Char);
    }
    /**
     * 返回颜色的八位十六进制值.
     * @param allow4Char 如果可能的话，将十六进制值缩短为4个字符
     */
    toHex8(allow4Char = false) {
      return rgbaToHex(this.r, this.g, this.b, this.a, allow4Char);
    }
    /**
     * 返回颜色的八位十六进制值，并且值前面带有#符号.
     * @param allow4Char 如果可能的话，将十六进制值缩短为4个字符
     */
    toHex8String(allow4Char = false) {
      return "#" + this.toHex8(allow4Char);
    }
    /**
     * 根据颜色的透明度（Alpha值）返回较短的十六进制值，并且值前面带有#符号。
     * @param allowShortChar 如果可能的话，将十六进制值缩短至3个或4个字符
     */
    toHexShortString(allowShortChar = false) {
      return this.a == 1 ? this.toHexString(allowShortChar) : this.toHex8String(allowShortChar);
    }
    /**
     * 将当前颜色转换为 RGB（红、绿、蓝）颜色空间的对象表示。
     * @returns 一个包含 `r`、`g`、`b` 和 `a` 属性的对象，表示当前颜色的 RGB 格式。
     */
    toRgb() {
      return new RGBA({
        r: Math.round(this.r),
        g: Math.round(this.g),
        b: Math.round(this.b),
        a: this.a
      });
    }
    /**
     * 将当前颜色对象转换为CSS风格的RGB或RGBA字符串
     * @returns {string} 返回一个CSS风格的RGB或RGBA字符串，表示当前颜色对象的颜色值
     */
    toRgbString() {
      const r = Math.round(this.r);
      const g = Math.round(this.g);
      const b = Math.round(this.b);
      return this.a == 1 ? "rgb(".concat(r, ", ").concat(g, ", ").concat(b, ")") : "rgba(".concat(r, ", ").concat(g, ", ").concat(b, ", ").concat(this.roundA, ")");
    }
    /**
     * 将当前颜色转换为百分比表示的 RGB（红、绿、蓝）颜色空间的对象表示。
     * @returns 一个包含 `r`、`g`、`b` 和 `a` 属性的对象，表示当前颜色的百分比表示的 RGB 格式。
     */
    toPercentageRgb() {
      const fmt = (x) => {
        return "".concat(Math.round(bound01(x, 255) * 100), "%");
      };
      return new RGBAString({
        r: fmt(this.r),
        g: fmt(this.g),
        b: fmt(this.b),
        a: this.a
      });
    }
    /**
     * 将RGBA相对值插值为一个字符串，颜色值以百分比表示。
     */
    toPercentageRgbString() {
      const rnd = (x) => {
        return Math.round(bound01(x, 255) * 100);
      };
      return this.a == 1 ? "rgb(".concat(rnd(this.r), "%, ").concat(rnd(this.g), "%, ").concat(rnd(this.b), "%)") : "rgba(".concat(rnd(this.r), "%, ").concat(rnd(this.g), "%, ").concat(rnd(this.b), "%, ").concat(this.roundA, ")");
    }
    /**
     * 返回这个颜色的'真实'名称,不存在返回null
     */
    toName() {
      if (this.a == 0) {
        return "transparent";
      }
      if (this.a < 1) {
        return null;
      }
      const hex = this.toHexString();
      return UTS.mapGet(this.reversedNames, hex);
    }
    /**
     * 将颜色转换为字符串表示。
     *
     * @param format - 用于显示字符串表示的格式。
     */
    // toString<T extends 'name'>(format : T) : string;
    // toString<T extends LColorFormats>(format ?: T) : string;
    toString(format = null) {
      var _a;
      const formatSet = toBoolean(format);
      let _format = format !== null && format !== void 0 ? format : this.format;
      let formattedString = null;
      const hasAlpha = this.a < 1 && this.a >= 0;
      const needsAlphaFormat = !formatSet && hasAlpha && (_format != null && _format.startsWith("hex") || _format == "name");
      if (needsAlphaFormat) {
        if (_format == "name" && this.a == 0) {
          return (_a = this.toName()) !== null && _a !== void 0 ? _a : "transparent";
        }
        return this.toRgbString();
      }
      if (_format == "rgb") {
        formattedString = this.toRgbString();
      }
      if (_format == "prgb") {
        formattedString = this.toPercentageRgbString();
      }
      if (_format == "hex" || _format == "hex6") {
        formattedString = this.toHexString();
      }
      if (_format == "hex3") {
        formattedString = this.toHexString(true);
      }
      if (_format == "hex4") {
        formattedString = this.toHex8String(true);
      }
      if (_format == "hex8") {
        formattedString = this.toHex8String();
      }
      if (_format == "name") {
        formattedString = this.toName();
      }
      if (_format == "hsl") {
        formattedString = this.toHslString();
      }
      if (_format == "hsv") {
        formattedString = this.toHsvString();
      }
      if (_format == "hsb") {
        formattedString = this.toHsbString();
      }
      return formattedString !== null && formattedString !== void 0 ? formattedString : this.toHexString();
    }
    toNumber() {
      return (Math.round(this.r) << 16) + (Math.round(this.g) << 8) + Math.round(this.b);
    }
    clone() {
      return new TinyColor(this.toString());
    }
    /**
     * 将颜色变浅指定的量。提供100将始终返回白色。
     * @param amount - 有效值介于1-100之间
     */
    lighten(amount = 10) {
      const hsl = this.toHsl();
      hsl.l += amount / 100;
      hsl.l = clamp01(hsl.l);
      return new TinyColor(hsl, new LColorOptions({
        gradientType: null,
        format: this.format
      }));
    }
    /**
     * 将颜色变亮一定的量，范围从0到100。
     * @param amount - 有效值在1-100之间
     */
    brighten(amount = 10) {
      const rgb = this.toRgb();
      rgb.r = Math.max(0, Math.min(255, rgb.r - Math.round(255 * -(amount / 100))));
      rgb.g = Math.max(0, Math.min(255, rgb.g - Math.round(255 * -(amount / 100))));
      rgb.b = Math.max(0, Math.min(255, rgb.b - Math.round(255 * -(amount / 100))));
      return new TinyColor(rgb, new LColorOptions({
        gradientType: null,
        format: this.format
      }));
    }
    /**
     * 将颜色变暗一定的量，范围从0到100。
     * 提供100将始终返回黑色。
     * @param amount - 有效值在1-100之间
     */
    darken(amount = 10) {
      const hsl = this.toHsl();
      hsl.l -= amount / 100;
      hsl.l = clamp01(hsl.l);
      return new TinyColor(hsl, new LColorOptions({
        gradientType: null,
        format: this.format
      }));
    }
    /**
     * 将颜色与纯白色混合，范围从0到100。
     * 提供0将什么都不做，提供100将始终返回白色。
     * @param amount - 有效值在1-100之间
     */
    tint(amount = 10) {
      return this.mix("white", amount);
    }
    /**
     * 将颜色与纯黑色混合，范围从0到100。
     * 提供0将什么都不做，提供100将始终返回黑色。
     * @param amount - 有效值在1-100之间
     */
    shade(amount = 10) {
      return this.mix("black", amount);
    }
    /**
     * 将颜色的饱和度降低一定的量，范围从0到100。
     * 提供100与调用greyscale相同
     * @param amount - 有效值在1-100之间
     */
    desaturate(amount = 10) {
      const hsl = this.toHsl();
      hsl.s -= amount / 100;
      hsl.s = clamp01(hsl.s);
      return new TinyColor(hsl, new LColorOptions({
        gradientType: null,
        format: this.format
      }));
    }
    /**
     * 将颜色饱和度提高一定数量，范围从 0 到 100。
     * @param amount - 有效值介于 1 到 100 之间。
     */
    saturate(amount = 10) {
      const hsl = this.toHsl();
      hsl.s += amount / 100;
      hsl.s = clamp01(hsl.s);
      return new TinyColor(hsl, new LColorOptions({
        gradientType: null,
        format: this.format
      }));
    }
    /**
     * 将颜色完全去饱和为灰度。
     * 等同于调用 `desaturate(100)`。
     */
    greyscale() {
      return this.desaturate(100);
    }
    /**
     * spin 方法接收一个正数或负数作为参数，表示色相的变化量，变化范围在 [-360, 360] 之间。
     * 如果提供的值超出此范围，它将被限制在此范围内。
     */
    spin(amount) {
      const hsl = this.toHsl();
      const hue = (hsl.h + amount) % 360;
      hsl.h = hue < 0 ? 360 + hue : hue;
      return new TinyColor(hsl, new LColorOptions({
        gradientType: null,
        format: this.format
      }));
    }
    /**
     * 将当前颜色与另一种颜色按给定的比例混合，范围从0到100。
     * 0表示不混合（返回当前颜色）
     */
    mix(color = null, amount = 50) {
      const rgb1 = this.toRgb();
      const rgb2 = new TinyColor(color).toRgb();
      const p = amount / 100;
      const rgba = new UTSJSONObject({
        r: (rgb2.r - rgb1.r) * p + rgb1.r,
        g: (rgb2.g - rgb1.g) * p + rgb1.g,
        b: (rgb2.b - rgb1.b) * p + rgb1.b,
        a: (rgb2.a - rgb1.a) * p + rgb1.a
      });
      return new TinyColor(rgba, new LColorOptions({
        gradientType: null,
        format: this.format
      }));
    }
    /**
     * 生成一组与当前颜色相似的颜色。
     * 这些颜色在色相环上是相邻的，形成一个类似于彩虹的颜色序列。
     * @param results - 要生成的相似颜色的数量，默认值为 6。
     * @param slices - 将色相环划分为多少个部分，默认值为 30。
     * @returns 一个包含当前颜色及其相似颜色的 TinyColor 对象数组。
     */
    analogous(results = 6, slices = 30) {
      const hsl = this.toHsl();
      const part = 360 / slices;
      const ret = [this];
      let _results = results;
      hsl.h = (hsl.h - (part * _results >> 1) + 720) % 360;
      while (_results > 0) {
        hsl.h = (hsl.h + part) % 360;
        ret.push(new TinyColor(hsl));
        _results--;
      }
      return ret;
    }
    /**
     * 计算当前颜色的补色。
     * 补色是指在色相环上相对位置的颜色，它们的色相差为 180°。
     * taken from https://github.com/infusion/jQuery-xcolor/blob/master/jquery.xcolor.js
     * @returns 一个 TinyColor 对象，表示当前颜色的补色。
     */
    complement() {
      const hsl = this.toHsl();
      hsl.h = (hsl.h + 180) % 360;
      return new TinyColor(hsl, new LColorOptions({
        gradientType: null,
        format: this.format
      }));
    }
    /**
     * 生成一组与当前颜色具有相同色相和饱和度的颜色。
     * 这些颜色的亮度值不同，形成一个单色调的颜色序列。
     * @param results - 要生成的单色调颜色的数量，默认值为 6。
     * @returns 一个包含当前颜色及其单色调颜色的 TinyColor 对象数组。
     */
    monochromatic(results = 6) {
      const hsv = this.toHsv();
      const h = hsv.h;
      const s = hsv.s;
      let v = hsv.v;
      const res = [];
      const modification = 1 / results;
      let _results = results;
      while (_results > 0) {
        res.push(new TinyColor(new UTSJSONObject({ h, s, v })));
        v = (v + modification) % 1;
        _results--;
      }
      return res;
    }
    /**
     * 生成当前颜色的分裂补色。
     * 分裂补色是指在色相环上位于当前颜色的两侧的颜色，它们的色相差为 180°。
     * @returns 一个包含当前颜色及其分裂补色的 TinyColor 对象数组。
     */
    splitcomplement() {
      const hsl = this.toHsl();
      const h = hsl.h;
      return [
        this,
        new TinyColor(new UTSJSONObject({ h: (h + 72) % 360, s: hsl.s, l: hsl.l })),
        new TinyColor(new UTSJSONObject({ h: (h + 216) % 360, s: hsl.s, l: hsl.l }))
      ];
    }
    /**
     * 计算当前颜色在给定背景颜色上的显示效果。
     * @param background - 背景颜色，可以是任何 LColorInput 类型的值。
     * @returns 一个 TinyColor 对象，表示当前颜色在给定背景颜色上的显示效果。
     */
    onBackground(background = null) {
      const fg = this.toRgb();
      const bg = new TinyColor(background).toRgb();
      const alpha = fg.a + bg.a * (1 - fg.a);
      return new TinyColor(new UTSJSONObject({
        r: (fg.r * fg.a + bg.r * bg.a * (1 - fg.a)) / alpha,
        g: (fg.g * fg.a + bg.g * bg.a * (1 - fg.a)) / alpha,
        b: (fg.b * fg.a + bg.b * bg.a * (1 - fg.a)) / alpha,
        a: alpha
      }));
    }
    /**
     * 生成当前颜色的三色调。
     * 三色调是指在色相环上位于当前颜色的两侧的颜色，它们的色相差为 120°。
     * 这是 `polyad(3)` 方法的别名。
     * @returns 一个包含当前颜色及其三色调颜色的 TinyColor 对象数组。
     */
    triad() {
      return this.polyad(3);
    }
    /**
     * 生成当前颜色的四色调。
     * 四色调是指在色相环上位于当前颜色的两侧的颜色，它们的色相差为 90°。
     * 这是 `polyad(4)` 方法的别名。
     * @returns 一个包含当前颜色及其四色调颜色的 TinyColor 对象数组。
     */
    tetrad() {
      return this.polyad(4);
    }
    /**
     * 生成当前颜色的 n 色调。
     * n 色调是指在色相环上位于当前颜色的两侧的颜色，它们的色相差为 360° / n。
     * Get polyad colors, like (for 1, 2, 3, 4, 5, 6, 7, 8, etc...)
     * monad, dyad, triad, tetrad, pentad, hexad, heptad, octad, etc...
     * @param n - 一个整数，表示要生成的色调数量。
     * @returns 一个包含当前颜色及其 n 色调颜色的 TinyColor 对象数组。
     */
    polyad(n) {
      const hsl = this.toHsl();
      const h = hsl.h;
      const result = [this];
      const increment = 360 / n;
      for (let i = 1; i < n; i++) {
        result.push(new TinyColor(new UTSJSONObject({ h: (h + i * increment) % 360, s: hsl.s, l: hsl.l })));
      }
      return result;
    }
    /**
     * 比较当前颜色与给定颜色是否相等。
     * @param color - 一个 LColorInput 类型的值，表示要比较的颜色。
     * @returns 一个布尔值，表示当前颜色与给定颜色是否相等。
     */
    equals(other = null) {
      if (other == null) {
        return false;
      } else if (UTS.isInstanceOf(other, TinyColor)) {
        return this.toRgbString() == other.toRgbString();
      }
      return this.toRgbString() == new TinyColor(other).toRgbString();
    }
  }
  function tinyColor(color = "", opts = new LColorOptions({
    format: null,
    gradientType: null
  })) {
    return new TinyColor(color, opts);
  }
  class DarkColorMapItem extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            index: { type: Number, optional: false },
            opacity: { type: Number, optional: false }
          };
        },
        name: "DarkColorMapItem"
      };
    }
    constructor(options, metadata = DarkColorMapItem.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.index = this.__props__.index;
      this.opacity = this.__props__.opacity;
      delete this.__props__;
    }
  }
  [
    new DarkColorMapItem({ index: 7, opacity: 0.15 }),
    new DarkColorMapItem({ index: 6, opacity: 0.25 }),
    new DarkColorMapItem({ index: 5, opacity: 0.3 }),
    new DarkColorMapItem({ index: 5, opacity: 0.45 }),
    new DarkColorMapItem({ index: 5, opacity: 0.65 }),
    new DarkColorMapItem({ index: 5, opacity: 0.85 }),
    new DarkColorMapItem({ index: 4, opacity: 0.9 }),
    new DarkColorMapItem({ index: 3, opacity: 0.95 }),
    new DarkColorMapItem({ index: 2, opacity: 0.97 }),
    new DarkColorMapItem({ index: 1, opacity: 0.98 })
  ];
  class UseLoadingReturn extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            ratio: { type: "Unknown", optional: false },
            type: { type: "Unknown", optional: false },
            mode: { type: "Unknown", optional: false },
            color: { type: String, optional: false },
            play: { type: "Unknown", optional: false },
            failed: { type: "Unknown", optional: false },
            clear: { type: "Unknown", optional: false },
            destroy: { type: "Unknown", optional: false },
            pause: { type: "Unknown", optional: false }
          };
        },
        name: "UseLoadingReturn"
      };
    }
    constructor(options, metadata = UseLoadingReturn.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.ratio = this.__props__.ratio;
      this.type = this.__props__.type;
      this.mode = this.__props__.mode;
      this.color = this.__props__.color;
      this.play = this.__props__.play;
      this.failed = this.__props__.failed;
      this.clear = this.__props__.clear;
      this.destroy = this.__props__.destroy;
      this.pause = this.__props__.pause;
      delete this.__props__;
    }
  }
  function getPointOnCircle(centerX, centerY, radius, angleDegrees) {
    const angleRadians = angleDegrees * Math.PI / 180;
    const x = centerX + radius * Math.cos(angleRadians);
    const y = centerY + radius * Math.sin(angleRadians);
    return [x, y];
  }
  function useLoading(element) {
    let isPlaying = false;
    let canvasWidth = vue.ref(0);
    let canvasHeight = vue.ref(0);
    let canvasSize = vue.ref(0);
    let animationFrameId = -1;
    let animation = null;
    let drawFrame = null;
    const tick = vue.ref("pause");
    const context = vue.shallowRef(null);
    const state = vue.reactive(new UseLoadingReturn({
      color: "#000",
      type: "circular",
      ratio: 1,
      mode: "raf",
      play: () => {
        tick.value = "play";
      },
      failed: () => {
        tick.value = "failed";
      },
      clear: () => {
        tick.value = "clear";
      },
      destroy: () => {
        var _a, _b;
        tick.value = "destroy";
        cancelAnimationFrame(animationFrameId);
        animation === null || animation === void 0 ? null : animation.pause();
        animation === null || animation === void 0 ? null : animation.cancel();
        (_a = context.value) === null || _a === void 0 ? null : _a.reset();
        (_b = context.value) === null || _b === void 0 ? null : _b.update();
        context.value = null;
        animation = null;
        isPlaying = false;
      },
      pause: () => {
        tick.value = "pause";
      }
    }));
    const size = vue.computed(() => {
      return state.ratio > 1 ? state.ratio : canvasSize.value * state.ratio;
    });
    const drawCircular = () => {
      let startAngle = 0;
      let endAngle = 0;
      let rotate = 0;
      const MIN_ANGLE = 5;
      const ARC_LENGTH = 359.5;
      const PI = Math.PI / 180;
      const SPEED = 0.018 / 4;
      const ROTATE_INTERVAL = 0.09 / 4;
      const lineWidth = size.value / 10;
      const x = canvasWidth.value / 2;
      const y = canvasHeight.value / 2;
      const radius = size.value / 2 - lineWidth;
      try {
        drawFrame = () => {
          if (context.value == null || !isPlaying)
            return null;
          let ctx = context.value;
          ctx.reset();
          ctx.beginPath();
          ctx.arc(x, y, radius, startAngle * PI + rotate, endAngle * PI + rotate);
          ctx.lineWidth = lineWidth;
          ctx.strokeStyle = state.color;
          ctx.stroke();
          if (endAngle < ARC_LENGTH) {
            endAngle = Math.min(ARC_LENGTH, endAngle + (ARC_LENGTH - MIN_ANGLE) * SPEED);
          } else if (startAngle < ARC_LENGTH) {
            startAngle = Math.min(ARC_LENGTH, startAngle + (ARC_LENGTH - MIN_ANGLE) * SPEED);
          } else {
            startAngle = 0;
            endAngle = MIN_ANGLE;
          }
          ctx.update();
          if (state.mode == "raf") {
            rotate = (rotate + ROTATE_INTERVAL) % 360;
            if (isPlaying && drawFrame != null) {
              animationFrameId = requestAnimationFrame(drawFrame);
            }
          }
        };
      } catch (err) {
      }
    };
    let lastTime = Date.now();
    const drawSpinner = () => {
      const steps = 12;
      const lineWidth = size.value / 10;
      const x = canvasWidth.value / 2;
      const y = canvasHeight.value / 2;
      let step = 0;
      const length = size.value / 3.6 - lineWidth;
      const offset = size.value / 4;
      function generateColorGradient(hex, steps2) {
        const colors2 = [];
        const _color = tinyColor(hex);
        for (let i = 1; i <= steps2; i++) {
          _color.setAlpha(i / steps2);
          colors2.push(_color.toRgbString());
        }
        return colors2;
      }
      let colors = vue.computed(() => {
        return generateColorGradient(state.color, steps);
      });
      drawFrame = () => {
        if (context.value == null || !isPlaying)
          return null;
        const delta = Date.now() - lastTime;
        if (delta >= 1e3 / 10) {
          lastTime = Date.now();
          let ctx = context.value;
          ctx.reset();
          for (let i = 0; i < steps; i++) {
            const stepAngle = 360 / steps;
            const angle = stepAngle * i;
            const index = (steps + i - step) % steps;
            const radian = angle * Math.PI / 180;
            const cos = Math.cos(radian);
            const sin = Math.sin(radian);
            ctx.beginPath();
            ctx.moveTo(x + offset * cos, y + offset * sin);
            ctx.lineTo(x + (offset + length) * cos, y + (offset + length) * sin);
            ctx.lineWidth = lineWidth;
            ctx.lineCap = "round";
            ctx.strokeStyle = colors.value[index];
            ctx.stroke();
          }
          ctx.update();
          if (state.mode == "raf") {
            step = (step + 1) % steps;
          }
        }
        if (state.mode == "raf") {
          if (isPlaying && drawFrame != null) {
            animationFrameId = requestAnimationFrame(drawFrame);
          }
        }
      };
    };
    const drwaFailed = () => {
      if (context.value == null)
        return null;
      let ctx = context.value;
      const innerSize = size.value * 0.8;
      const lineWidth = innerSize / 10;
      const lineLength = (size.value - lineWidth) / 2;
      const centerX = canvasWidth.value / 2;
      const centerY = canvasHeight.value / 2;
      const radius = (size.value - lineWidth) / 2;
      const angleRadians1 = 45 * Math.PI / 180;
      const angleRadians2 = (45 - 90) * Math.PI / 180;
      ctx.reset();
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = state.color;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = state.color;
      ctx.stroke();
      const _a = __read(getPointOnCircle(centerX, centerY, lineLength / 2, 180 + 45), 2), startX1 = _a[0], startY = _a[1];
      const _b = __read(getPointOnCircle(centerX, centerY, lineLength / 2, 180 + 90 + 45), 1), startX2 = _b[0];
      const x2 = Math.sin(angleRadians1) * lineLength + startX1;
      const y2 = Math.cos(angleRadians1) * lineLength + startY;
      ctx.beginPath();
      ctx.moveTo(startX1, startY);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      const x3 = Math.sin(angleRadians2) * lineLength + startX2;
      const y3 = Math.cos(angleRadians2) * lineLength + startY;
      ctx.beginPath();
      ctx.moveTo(startX2, startY);
      ctx.lineTo(x3, y3);
      ctx.stroke();
      ctx.update();
    };
    let currentType = null;
    const useMode = () => {
      if (state.mode != "raf") {
        const keyframes = [new UTSJSONObject({ transform: "rotate(0)" }), new UTSJSONObject({ transform: "rotate(360)" })];
        animation = element.value.animate(keyframes, new UTSJSONObject({
          duration: 8e4,
          easing: "linear",
          // fill: 'forwards',
          iterations: Infinity
        }));
      }
    };
    const startAnimation = (type) => {
      if (context.value == null || element.value == null)
        return null;
      animation === null || animation === void 0 ? null : animation.pause();
      if (currentType == type) {
        isPlaying = true;
        animation === null || animation === void 0 ? null : animation.play();
        drawFrame === null || drawFrame === void 0 ? null : drawFrame();
        return null;
      }
      if (type == "circular") {
        currentType = "circular";
        drawCircular();
        useMode();
      }
      if (type == "spinner") {
        currentType = "spinner";
        drawSpinner();
        useMode();
      }
      isPlaying = true;
      drawFrame === null || drawFrame === void 0 ? null : drawFrame();
    };
    let manualCheckTimer = null;
    const getBoundingClientRect = () => {
      if (manualCheckTimer != null) {
        clearTimeout(manualCheckTimer);
      }
      requestAnimationFrame(() => {
        var _a, _b;
        (_b = (_a = element.value) === null || _a === void 0 ? null : _a.getBoundingClientRectAsync()) === null || _b === void 0 ? null : _b.then((rect) => {
          if (rect.width == 0 || rect.height == 0)
            return null;
          context.value = element.value.getDrawableContext();
          canvasWidth.value = rect.width;
          canvasHeight.value = rect.height;
          canvasSize.value = Math.min(rect.width, rect.height);
        });
      });
    };
    const resizeObserver = new UniResizeObserver((_entries) => {
      getBoundingClientRect();
    });
    vue.watchEffect(() => {
      if (element.value == null)
        return null;
      resizeObserver.observe(element.value);
      manualCheckTimer = setTimeout(() => {
        getBoundingClientRect();
      }, 50);
    });
    vue.watchEffect(() => {
      var _a, _b, _c, _d;
      if (context.value == null)
        return null;
      if (tick.value == "play") {
        animation === null || animation === void 0 ? null : animation.pause();
        isPlaying = false;
        cancelAnimationFrame(animationFrameId);
        startAnimation(state.type);
      }
      if (tick.value == "failed") {
        cancelAnimationFrame(animationFrameId);
        animation === null || animation === void 0 ? null : animation.pause();
        animation === null || animation === void 0 ? null : animation.cancel();
        drwaFailed();
        return null;
      }
      if (tick.value == "clear") {
        cancelAnimationFrame(animationFrameId);
        animation === null || animation === void 0 ? null : animation.pause();
        animation === null || animation === void 0 ? null : animation.cancel();
        (_a = context.value) === null || _a === void 0 ? null : _a.reset();
        (_b = context.value) === null || _b === void 0 ? null : _b.update();
        isPlaying = false;
        return null;
      }
      if (tick.value == "destroy") {
        cancelAnimationFrame(animationFrameId);
        animation === null || animation === void 0 ? null : animation.pause();
        animation === null || animation === void 0 ? null : animation.cancel();
        (_c = context.value) === null || _c === void 0 ? null : _c.reset();
        (_d = context.value) === null || _d === void 0 ? null : _d.update();
        context.value = null;
        animation = null;
        isPlaying = false;
        return null;
      }
      if (tick.value == "pause") {
        if (animation == null) {
          startAnimation(state.type);
        }
        cancelAnimationFrame(animationFrameId);
        isPlaying = false;
        animation === null || animation === void 0 ? null : animation.pause();
        return null;
      }
    });
    vue.watchEffect(() => {
      if (state.color == "")
        return null;
    });
    return state;
  }
  const _sfc_main$o = /* @__PURE__ */ vue.defineComponent({
    __name: "l-picker",
    props: {
      cancelBtn: { type: String, required: false },
      cancelStyle: { type: null, required: false },
      confirmBtn: { type: String, required: false },
      confirmStyle: { type: null, required: false },
      title: { type: String, required: false },
      titleStyle: { type: null, required: false },
      keys: { type: null, required: false },
      columns: { type: Array, required: true, default: [] },
      modelValue: { type: Array, required: false },
      defaultValue: { type: Array, required: false },
      value: { type: Array, required: false },
      loading: { type: Boolean, required: true, default: false },
      loadingColor: { type: String, required: false },
      loadingMaskColor: { type: String, required: false },
      loadingSize: { type: String, required: true, default: "32px" },
      itemHeight: { type: String, required: false },
      itemColor: { type: String, required: false },
      itemFontSize: { type: String, required: false },
      itemActiveColor: { type: String, required: false },
      itemActiveFontWeight: { type: Number, required: false },
      indicatorStyle: { type: String, required: false },
      maskColors: { type: Array, required: false },
      bgColor: { type: String, required: false },
      groupHeight: { type: String, required: false },
      radius: { type: String, required: false },
      resetIndex: { type: Boolean, required: true, default: false }
    },
    emits: ["change", "cancel", "pick", "confirm", "update:modelValue"],
    setup(__props, _a) {
      var _b, _c, _d, _e;
      var __expose = _a.expose, __emit = _a.emit;
      const emit = __emit;
      const props = __props;
      const pickerItemInstanceArray = vue.reactive([]);
      const modelValue = vue.ref((_d = (_c = (_b = props.value) !== null && _b !== void 0 ? _b : props.modelValue) !== null && _c !== void 0 ? _c : props.defaultValue) !== null && _d !== void 0 ? _d : []);
      const pickerValue = vue.computed({
        set(value) {
          if (arrayEqual(value, modelValue.value))
            return null;
          modelValue.value = value;
          emit("update:modelValue", value);
          emit("change", value);
        },
        get() {
          var _a2, _b2;
          return (_b2 = (_a2 = props.value) !== null && _a2 !== void 0 ? _a2 : props.modelValue) !== null && _b2 !== void 0 ? _b2 : modelValue.value;
        }
      });
      const isEmpty = vue.computed(() => {
        return props.columns.length == 0 && pickerItemInstanceArray.every((child = null) => {
          return child.options.length == 0;
        });
      });
      const styles = vue.computed(() => {
        const style = /* @__PURE__ */ new Map();
        if (props.bgColor != null) {
          style.set("background", props.bgColor);
        }
        if (props.radius != null) {
          style.set("border-top-left-radius", props.radius);
          style.set("border-top-right-radius", props.radius);
        }
        return style;
      });
      const curIndexArray = vue.ref([]);
      const curValueArray = vue.ref([...pickerValue.value]);
      const curItemArray = [];
      const realColumns = vue.computed(() => {
        const pickerColumns = pickerItemInstanceArray.map((child = null) => {
          return child.options;
        });
        if (pickerColumns.length > 0) {
          return pickerColumns;
        }
        return props.columns;
      });
      const manageChildInList = (child = null, shouldAdd) => {
        const index = pickerItemInstanceArray.indexOf(child);
        if (shouldAdd) {
          if (index != -1)
            return null;
          pickerItemInstanceArray.push(child);
        } else {
          if (index == -1)
            return null;
          pickerItemInstanceArray.splice(index, 1);
        }
      };
      const updateItems = (item, index, column) => {
        assignAtIndex(curIndexArray.value, column, index);
        assignAtIndex(curValueArray.value, column, item.value);
        assignAtIndex(curItemArray, column, item);
      };
      const updatePickerItems = () => {
        const _indexs = [];
        const _values = [];
        pickerItemInstanceArray.forEach((child = null, column) => {
          if (child.options.length == 0)
            return null;
          const value = curValueArray.value.length > column ? curValueArray.value[column] : null;
          const index = value == null ? 0 : child.$callMethod("getIndexByValue", value);
          child.$callMethod("setIndex", index);
          const item = child.options[index];
          _indexs.push(index);
          _values.push(item.value);
          assignAtIndex(curItemArray, column, item);
        });
        if (arrayEqual(curValueArray.value, _values) && arrayEqual(curIndexArray.value, _indexs))
          return null;
        curIndexArray.value = _indexs;
        curValueArray.value = _values;
        pickerValue.value = [...curValueArray.value];
      };
      const onPick = (item, index, column) => {
        if (curIndexArray.value[column] == index)
          return null;
        assignAtIndex(curIndexArray.value, column, index);
        assignAtIndex(curValueArray.value, column, item.value);
        assignAtIndex(curItemArray, column, item);
        const obj = {
          values: curValueArray.value,
          column,
          index
        };
        pickerValue.value = [...curValueArray.value];
        emit("pick", obj);
      };
      const onCancel = (e) => {
        updatePickerItems();
        emit("cancel", e);
      };
      const onConfirm = () => {
        const values = [...curValueArray.value];
        const indexs = [...curIndexArray.value];
        const items = curItemArray.map((item) => {
          return vue.toRaw(item);
        });
        if (!arrayEqual(pickerValue.value, values)) {
          pickerValue.value = values;
        }
        const obj = {
          values,
          indexs,
          items
        };
        emit("confirm", obj);
      };
      const stopPickerValue = vue.watch(pickerValue, () => {
        if (arrayEqual(pickerValue.value, curValueArray.value))
          return null;
        curValueArray.value = pickerValue.value.map((item) => {
          return item;
        });
        updatePickerItems();
      });
      const stopColumns = vue.watch(realColumns, () => {
        updatePickerItems();
      });
      vue.onMounted(() => {
        vue.nextTick(() => {
          if (!arrayEqual(pickerValue.value, curValueArray.value) && pickerValue.value.length > 0) {
            curValueArray.value = [...pickerValue.value];
            updatePickerItems();
          }
        });
      });
      const loadingRef = vue.ref(null);
      const loadingAni = useLoading(loadingRef);
      loadingAni.type = "circular";
      loadingAni.color = (_e = props.loadingColor) !== null && _e !== void 0 ? _e : "#3283ff";
      loadingAni.ratio = unitConvert(props.loadingSize);
      vue.watchEffect(() => {
        if (props.loading) {
          loadingAni.play();
        } else {
          loadingAni.clear();
        }
      });
      vue.onBeforeUnmount(() => {
        stopPickerValue();
        stopColumns();
      });
      __expose({
        confirm: onConfirm,
        getSelectedOptions: () => {
          const values = [...curValueArray.value];
          const indexs = [...curIndexArray.value];
          const items = curItemArray.map((item) => {
            return vue.toRaw(item);
          });
          if (!arrayEqual(pickerValue.value, values)) {
            pickerValue.value = values;
          }
          const obj = {
            values,
            indexs,
            items
          };
          return obj;
        }
      });
      vue.provide("limePicker", props);
      vue.provide("limePickerOnPick", onPick);
      vue.provide("limePickerUpdateItems", updateItems);
      vue.provide("limePickerItems", pickerItemInstanceArray);
      vue.provide("limePickerManageChildInList", manageChildInList);
      const __returned__ = { emit, props, pickerItemInstanceArray, modelValue, pickerValue, isEmpty, styles, curIndexArray, curValueArray, curItemArray, realColumns, manageChildInList, updateItems, updatePickerItems, onPick, onCancel, onConfirm, stopPickerValue, stopColumns, loadingRef, loadingAni };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  const _style_0$n = { "l-picker": { "": { "position": "relative", "backgroundColor": "var(--l-picker-bg-color, #fff)", "borderTopLeftRadius": "var(--l-picker-border-radius, 12px)", "borderTopRightRadius": "var(--l-picker-border-radius, 12px)" } }, "l-picker__toolbar": { "": { "display": "flex", "alignItems": "center", "justifyContent": "space-between", "height": "var(--l-picker-toolbar-height, 58px)", "flexDirection": "row", "position": "relative" } }, "l-picker__title": { "": { "position": "absolute", "left": "50%", "top": "50%", "transform": "translateX(-50%) translateY(-50%)", "textAlign": "center", "overflow": "hidden", "whiteSpace": "nowrap", "textOverflow": "ellipsis", "color": "var(--l-picker-title-color, #000000E0)", "lineHeight": "var(--l-picker-title-line-height, 26px)", "fontWeight": "var(--l-picker-title-font-weight, 700)", "fontSize": "var(--l-picker-title-font-size, 18px)" } }, "l-picker__cancel": { "": { "whiteSpace": "nowrap", "fontSize": "var(--l-picker-button-font-size, 16px)", "lineHeight": "var(--l-picker-toolbar-height, 58px)", "height": "100%", "paddingTop": 0, "paddingRight": 16, "paddingBottom": 0, "paddingLeft": 16, "marginRight": "auto", "color": "var(--l-picker-cancel-color, #000000A6)" } }, "l-picker__confirm": { "": { "whiteSpace": "nowrap", "fontSize": "var(--l-picker-button-font-size, 16px)", "lineHeight": "var(--l-picker-toolbar-height, 58px)", "height": "100%", "paddingTop": 0, "paddingRight": 16, "paddingBottom": 0, "paddingLeft": 16, "marginLeft": "auto", "color": "var(--l-picker-confirm-color, #3283ff)" } }, "l-picker__main": { "": { "position": "relative", "display": "flex", "height": "var(--l-picker-group-height, 200px)", "flexDirection": "row", "zIndex": 2, "paddingTop": 0, "paddingRight": 8, "paddingBottom": 0, "paddingLeft": 8 } }, "l-picker__empty": { "": { "pointerEvents": "none", "justifyContent": "center", "alignItems": "center", "display": "flex", "position": "absolute", "top": 0, "bottom": 0, "left": 0, "right": 0, "zIndex": 3 } }, "l-picker__loading": { "": { "zIndex": 3, "backgroundColor": "var(--l-picker-loading-mask-color, rgba(255, 255, 255, 0.9))", "justifyContent": "center", "alignItems": "center", "display": "flex", "position": "absolute", "top": 0, "bottom": 0, "left": 0, "right": 0 } }, "l-picker__indicator": { "": { "position": "absolute", "backgroundColor": "var(--l-picker-indicator-bg-color, #0000000A)", "top": "50%", "left": "var(--l-picker-indicator-margin, 10px)", "right": "var(--l-picker-indicator-margin, 10px)", "height": "var(--l-picker-item-height, 50px)", "transform": "translateY(-50%)", "zIndex": -1, "borderTopLeftRadius": "var(--l-picker-indicator-border-radius, 6px)", "borderTopRightRadius": "var(--l-picker-indicator-border-radius, 6px)", "borderBottomRightRadius": "var(--l-picker-indicator-border-radius, 6px)", "borderBottomLeftRadius": "var(--l-picker-indicator-border-radius, 6px)" } } };
  function _sfc_render$n(_ctx, _cache, $props, $setup, $data, $options) {
    var _a, _b, _c, _d;
    const _component_l_picker_item = resolveEasycom(vue.resolveDynamicComponent("l-picker-item"), __easycom_0$3);
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: "l-picker",
        style: vue.normalizeStyle([$setup.styles]),
        ref: "pickerRef"
      },
      [
        $props.cancelBtn != null || $props.title != null || $props.confirmBtn != null ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "l-picker__toolbar"
        }, [
          $props.cancelBtn != null ? (vue.openBlock(), vue.createElementBlock(
            "text",
            {
              key: 0,
              class: "l-picker__cancel",
              style: vue.normalizeStyle([(_a = $props.cancelStyle) != null ? _a : {}]),
              onClick: $setup.onCancel
            },
            vue.toDisplayString($props.cancelBtn),
            5
            /* TEXT, STYLE */
          )) : vue.createCommentVNode("v-if", true),
          vue.createElementVNode(
            "text",
            {
              class: "l-picker__title",
              style: vue.normalizeStyle([(_b = $props.titleStyle) != null ? _b : {}])
            },
            vue.toDisplayString($props.title),
            5
            /* TEXT, STYLE */
          ),
          $props.confirmBtn != null ? (vue.openBlock(), vue.createElementBlock(
            "text",
            {
              key: 1,
              class: "l-picker__confirm",
              style: vue.normalizeStyle([(_c = $props.confirmStyle) != null ? _c : {}]),
              onClick: $setup.onConfirm
            },
            vue.toDisplayString($props.confirmBtn),
            5
            /* TEXT, STYLE */
          )) : vue.createCommentVNode("v-if", true)
        ])) : vue.createCommentVNode("v-if", true),
        vue.renderSlot(_ctx.$slots, "header"),
        vue.createElementVNode(
          "view",
          {
            class: "l-picker__main",
            style: vue.normalizeStyle([$props.groupHeight != null ? { height: $props.groupHeight } : {}])
          },
          [
            vue.renderSlot(_ctx.$slots, "default", {}, () => [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($setup.props.columns, (options, i) => {
                  return vue.openBlock(), vue.createBlock(_component_l_picker_item, {
                    options,
                    key: i,
                    column: i,
                    value: $setup.pickerValue.length > i ? $setup.pickerValue[i] : null
                  }, null, 8, ["options", "column", "value"]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ]),
            $setup.isEmpty ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "l-picker__empty"
            }, [
              vue.renderSlot(_ctx.$slots, "empty")
            ])) : vue.createCommentVNode("v-if", true),
            !$setup.isEmpty ? (vue.openBlock(), vue.createElementBlock(
              "view",
              {
                key: 1,
                class: "l-picker__indicator",
                style: vue.normalizeStyle((_d = $props.indicatorStyle) != null ? _d : "")
              },
              null,
              4
              /* STYLE */
            )) : vue.createCommentVNode("v-if", true)
          ],
          4
          /* STYLE */
        ),
        vue.renderSlot(_ctx.$slots, "footer"),
        $props.loading ? (vue.openBlock(), vue.createElementBlock(
          "view",
          {
            key: 1,
            class: "l-picker__loading",
            ref: "loadingRef",
            style: vue.normalizeStyle([$props.loadingMaskColor != null ? { background: $props.loadingMaskColor } : {}])
          },
          null,
          4
          /* STYLE */
        )) : vue.createCommentVNode("v-if", true)
      ],
      4
      /* STYLE */
    );
  }
  const __easycom_0$2 = /* @__PURE__ */ _export_sfc(_sfc_main$o, [["render", _sfc_render$n], ["styles", [_style_0$n]], ["__file", "/Users/xyhc/Documents/carConnectInternet/uni_modules/lime-picker/components/l-picker/l-picker.uvue"]]);
  const MODE_YEAR = 1;
  const MODE_MONTH = 2;
  const MODE_DATE = 4;
  const MODE_HOUR = 8;
  const MODE_MINUTE = 16;
  const MODE_SECOND = 32;
  const MODE_MAP = /* @__PURE__ */ new Map([
    ["年", MODE_YEAR],
    ["月", MODE_MONTH],
    ["日", MODE_DATE],
    ["时", MODE_HOUR],
    ["分", MODE_MINUTE],
    ["秒", MODE_SECOND],
    ["year", MODE_YEAR],
    ["month", MODE_MONTH],
    ["date", MODE_DATE],
    ["hour", MODE_HOUR],
    ["minute", MODE_MINUTE],
    ["second", MODE_SECOND]
  ]);
  const FORMAT_MAP = /* @__PURE__ */ new Map([
    ["year", "YYYY"],
    ["month", "MM"],
    ["date", "DD"],
    ["hour", "HH"],
    ["minute", "mm"],
    ["second", "ss"]
  ]);
  const UNIT_MAP = /* @__PURE__ */ new Map([
    ["year", "年"],
    ["month", "月"],
    ["date", "日"],
    ["hour", "时"],
    ["minute", "分"],
    ["second", "秒"]
  ]);
  const MODE_NAMES = ["year", "month", "date", "hour", "minute", "second"];
  const DEFAULT_FORMAT = "YYYY-MM-DD HH:mm:ss";
  function coalesce(...values) {
    var e_1, _a;
    try {
      for (var values_1 = __values(values), values_1_1 = values_1.next(); !values_1_1.done; values_1_1 = values_1.next()) {
        var value = values_1_1.value;
        if (value == null)
          continue;
        if (typeof value == "string" && value == "")
          continue;
        return value;
      }
    } catch (e_1_1) {
      e_1 = { error: e_1_1 };
    } finally {
      try {
        if (values_1_1 && !values_1_1.done && (_a = values_1.return))
          _a.call(values_1);
      } finally {
        if (e_1)
          throw e_1.error;
      }
    }
    return null;
  }
  function getMeaningColumn(mode) {
    const res = [];
    let _mode = 0;
    if (typeof mode == "string") {
      if (mode.includes("|") && /\d/.test(mode)) {
        const bits = mode.split("|").map((bit) => {
          return parseInt(bit.trim());
        });
        _mode = bits.reduce((result, bit) => {
          return result | bit;
        }, 0);
      } else {
        MODE_MAP.forEach((value, key) => {
          if (mode.includes(key)) {
            _mode = _mode | value;
          }
        });
      }
    } else if (typeof mode == "number") {
      _mode = mode;
    }
    if (_mode <= 0) {
      return res;
    }
    const modeBitmasks = [MODE_YEAR, MODE_MONTH, MODE_DATE, MODE_HOUR, MODE_MINUTE, MODE_SECOND];
    const activeBitmasks = modeBitmasks.filter((bitmask) => {
      return (_mode & bitmask) != 0;
    });
    if (activeBitmasks.length == 0) {
      return [];
    }
    let longestSequence = [];
    let currentSequence = [];
    activeBitmasks.forEach((bitmask) => {
      if (currentSequence.length == 0 || bitmask == currentSequence[currentSequence.length - 1] * 2) {
        currentSequence.push(bitmask);
      } else {
        if (currentSequence.length > longestSequence.length) {
          longestSequence = currentSequence;
        }
        currentSequence = [bitmask];
      }
    });
    if (currentSequence.length > longestSequence.length) {
      longestSequence = currentSequence;
    }
    return longestSequence.map((bitmask) => {
      return MODE_NAMES[modeBitmasks.indexOf(bitmask)];
    });
  }
  class DayutsConfig extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            date: { type: "Any", optional: true },
            format: { type: String, optional: true },
            locale: { type: String, optional: true }
          };
        },
        name: "DayutsConfig"
      };
    }
    constructor(options, metadata = DayutsConfig.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.date = this.__props__.date;
      this.format = this.__props__.format;
      this.locale = this.__props__.locale;
      delete this.__props__;
    }
  }
  class DayutsFormats extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            LT: { type: String, optional: false },
            LTS: { type: String, optional: false },
            L: { type: String, optional: false },
            LL: { type: String, optional: false },
            LLL: { type: String, optional: false },
            LLLL: { type: String, optional: false },
            l: { type: String, optional: false },
            ll: { type: String, optional: false },
            lll: { type: String, optional: false },
            llll: { type: String, optional: false }
          };
        },
        name: "DayutsFormats"
      };
    }
    constructor(options, metadata = DayutsFormats.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.LT = this.__props__.LT;
      this.LTS = this.__props__.LTS;
      this.L = this.__props__.L;
      this.LL = this.__props__.LL;
      this.LLL = this.__props__.LLL;
      this.LLLL = this.__props__.LLLL;
      this.l = this.__props__.l;
      this.ll = this.__props__.ll;
      this.lll = this.__props__.lll;
      this.llll = this.__props__.llll;
      delete this.__props__;
    }
  }
  class DayutsRelativeTime extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            future: { type: String, optional: false },
            past: { type: String, optional: false },
            s: { type: String, optional: false },
            m: { type: String, optional: false },
            mm: { type: String, optional: false },
            h: { type: String, optional: false },
            hh: { type: String, optional: false },
            d: { type: String, optional: false },
            dd: { type: String, optional: false },
            M: { type: String, optional: false },
            MM: { type: String, optional: false },
            y: { type: String, optional: false },
            yy: { type: String, optional: false }
          };
        },
        name: "DayutsRelativeTime"
      };
    }
    constructor(options, metadata = DayutsRelativeTime.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.future = this.__props__.future;
      this.past = this.__props__.past;
      this.s = this.__props__.s;
      this.m = this.__props__.m;
      this.mm = this.__props__.mm;
      this.h = this.__props__.h;
      this.hh = this.__props__.hh;
      this.d = this.__props__.d;
      this.dd = this.__props__.dd;
      this.M = this.__props__.M;
      this.MM = this.__props__.MM;
      this.y = this.__props__.y;
      this.yy = this.__props__.yy;
      delete this.__props__;
    }
  }
  let DayutsLocale$1 = class DayutsLocale2 extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            name: { type: String, optional: false },
            weekdays: { type: UTS.UTSType.withGenerics(Array, [String]), optional: false },
            weekdaysShort: { type: UTS.UTSType.withGenerics(Array, [String]), optional: true },
            weekdaysMin: { type: UTS.UTSType.withGenerics(Array, [String]), optional: true },
            months: { type: UTS.UTSType.withGenerics(Array, [String]), optional: false },
            monthsShort: { type: UTS.UTSType.withGenerics(Array, [String]), optional: true },
            ordinal: { type: "Unknown", optional: false },
            weekStart: { type: Number, optional: true },
            yearStart: { type: Number, optional: true },
            formats: { type: DayutsFormats, optional: true },
            relativeTime: { type: DayutsRelativeTime, optional: true },
            meridiem: { type: "Unknown", optional: true }
          };
        },
        name: "DayutsLocale"
      };
    }
    constructor(options, metadata = DayutsLocale2.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.name = this.__props__.name;
      this.weekdays = this.__props__.weekdays;
      this.weekdaysShort = this.__props__.weekdaysShort;
      this.weekdaysMin = this.__props__.weekdaysMin;
      this.months = this.__props__.months;
      this.monthsShort = this.__props__.monthsShort;
      this.ordinal = this.__props__.ordinal;
      this.weekStart = this.__props__.weekStart;
      this.yearStart = this.__props__.yearStart;
      this.formats = this.__props__.formats;
      this.relativeTime = this.__props__.relativeTime;
      this.meridiem = this.__props__.meridiem;
      delete this.__props__;
    }
  };
  class DayutsObject extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            years: { type: Number, optional: false },
            months: { type: Number, optional: false },
            date: { type: Number, optional: false },
            hours: { type: Number, optional: false },
            minutes: { type: Number, optional: false },
            seconds: { type: Number, optional: false },
            milliseconds: { type: Number, optional: false }
          };
        },
        name: "DayutsObject"
      };
    }
    constructor(options, metadata = DayutsObject.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.years = this.__props__.years;
      this.months = this.__props__.months;
      this.date = this.__props__.date;
      this.hours = this.__props__.hours;
      this.minutes = this.__props__.minutes;
      this.seconds = this.__props__.seconds;
      this.milliseconds = this.__props__.milliseconds;
      delete this.__props__;
    }
  }
  const SECONDS_A_MINUTE = 60;
  const SECONDS_A_HOUR = SECONDS_A_MINUTE * 60;
  const SECONDS_A_DAY = SECONDS_A_HOUR * 24;
  const SECONDS_A_WEEK = SECONDS_A_DAY * 7;
  const MILLISECONDS_A_SECOND = 1e3;
  const MILLISECONDS_A_MINUTE = SECONDS_A_MINUTE * MILLISECONDS_A_SECOND;
  const MILLISECONDS_A_HOUR = SECONDS_A_HOUR * MILLISECONDS_A_SECOND;
  const MILLISECONDS_A_DAY = SECONDS_A_DAY * MILLISECONDS_A_SECOND;
  const MILLISECONDS_A_WEEK = SECONDS_A_WEEK * MILLISECONDS_A_SECOND;
  const MS = "millisecond";
  const S = "second";
  const MIN = "minute";
  const H = "hour";
  const D = "day";
  const W = "week";
  const M = "month";
  const Q = "quarter";
  const Y = "year";
  const DATE = "date";
  const FORMAT_DEFAULT = "YYYY-MM-DDTHH:mm:ssZ";
  const INVALID_DATE_STRING = "Invalid Date";
  const REGEX_PARSE = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/;
  const REGEX_FORMAT = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g;
  function padStart(string, length, pad) {
    const str = string;
    if (str.length >= length)
      return str;
    return str.padStart(length, pad);
  }
  function padZoneStr(instance) {
    const negMinutes = -instance.utcOffset();
    const minutes = Math.abs(negMinutes);
    const hourOffset = Math.floor(minutes / 60);
    const minuteOffset = minutes % 60;
    return "".concat(negMinutes <= 0 ? "+" : "-").concat(padStart(hourOffset.toString(), 2, "0"), ":").concat(padStart(minuteOffset.toString(), 2, "0"));
  }
  function isNumber(value) {
    return ["Int8", "UInt8", "Int16", "UInt16", "Int32", "UInt32", "Int64", "UInt64", "Int", "UInt", "Float", "Float16", "Float32", "Float64", "Double", "number"].includes(typeof value);
  }
  function prettyUnit(u) {
    var _a;
    const special = /* @__PURE__ */ new Map([
      ["M", M],
      ["y", Y],
      ["w", W],
      ["d", D],
      ["D", DATE],
      ["h", H],
      ["m", MIN],
      ["s", S],
      ["ms", MS],
      ["Q", Q]
    ]);
    return (_a = special.get(u)) !== null && _a !== void 0 ? _a : "".concat(u).toLowerCase().replace(/s$/, "");
  }
  function monthDiff(a, b) {
    if (a.date() < b.date())
      return -monthDiff(b, a);
    const wholeMonthDiff = (b.year() - a.year()) * 12 + (b.month() - a.month());
    const anchor = a.clone().add(wholeMonthDiff, M).valueOf();
    const c = b.valueOf() - anchor < 0;
    const anchor2 = a.clone().add(wholeMonthDiff + (c ? -1 : 1), M).valueOf();
    const decimalMonthDiff = (b.valueOf() - anchor) / (c ? anchor - anchor2 : anchor2 - anchor);
    const result = wholeMonthDiff + decimalMonthDiff;
    const negatedResult = -result;
    const absResult = +negatedResult;
    const finalResult = !isNaN(absResult) ? absResult : 0;
    return finalResult;
  }
  function absFloor(n) {
    return n < 0 ? Math.max(Math.ceil(n), 0) : Math.floor(n);
  }
  const en = {
    name: "en",
    /**
     * 星期名称数组。
     */
    weekdays: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    /**
     * 月份名称数组。
     */
    months: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ],
    relativeTime: {
      future: "in %s",
      past: "%s ago",
      s: "a few seconds",
      m: "a minute",
      mm: "%d minutes",
      h: "an hour",
      hh: "%d hours",
      d: "a day",
      dd: "%d days",
      M: "a month",
      MM: "%d months",
      y: "a year",
      yy: "%d years"
    },
    /**
     * 序数函数，用于将数字转换为带有序数后缀的字符串。
     *
     * @param {number} n - 要转换的数字。
     * @returns {string} 带有序数后缀的字符串。
     */
    ordinal: (n, _) => {
      const s = ["th", "st", "nd", "rd"];
      const v = n % 100;
      const i = (v - 20) % 10;
      const k = i < s.length ? i : v < s.length ? v : 0;
      return "[".concat(n).concat(s[k], "]");
    }
  };
  const locale = {
    name: "zh-cn",
    weekdays: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
    weekdaysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
    weekdaysMin: ["日", "一", "二", "三", "四", "五", "六"],
    months: [
      "一月",
      "二月",
      "三月",
      "四月",
      "五月",
      "六月",
      "七月",
      "八月",
      "九月",
      "十月",
      "十一月",
      "十二月"
    ],
    monthsShort: [
      "1月",
      "2月",
      "3月",
      "4月",
      "5月",
      "6月",
      "7月",
      "8月",
      "9月",
      "10月",
      "11月",
      "12月"
    ],
    ordinal: (number, period) => {
      if (period == "W") {
        return "".concat(number, "周");
      }
      return "".concat(number, "日");
    },
    weekStart: 1,
    yearStart: 4,
    formats: {
      LT: "HH:mm",
      LTS: "HH:mm:ss",
      L: "YYYY/MM/DD",
      LL: "YYYY年M月D日",
      LLL: "YYYY年M月D日Ah点mm分",
      LLLL: "YYYY年M月D日ddddAh点mm分",
      l: "YYYY/M/D",
      ll: "YYYY年M月D日",
      lll: "YYYY年M月D日 HH:mm",
      llll: "YYYY年M月D日dddd HH:mm"
    },
    relativeTime: {
      future: "%s内",
      past: "%s前",
      s: "几秒",
      m: "1 分钟",
      mm: "%d 分钟",
      h: "1 小时",
      hh: "%d 小时",
      d: "1 天",
      dd: "%d 天",
      M: "1 个月",
      MM: "%d 个月",
      y: "1 年",
      yy: "%d 年"
    },
    meridiem: (hour, minute, _) => {
      const hm = hour * 100 + minute;
      if (hm < 600) {
        return "凌晨";
      } else if (hm < 900) {
        return "早上";
      } else if (hm < 1100) {
        return "上午";
      } else if (hm < 1300) {
        return "中午";
      } else if (hm < 1800) {
        return "下午";
      }
      return "晚上";
    }
  };
  const localesMap = /* @__PURE__ */ new Map();
  let localeState = vue.reactive({
    lang: "en",
    locales: localesMap
  });
  localeState.locales.set("en", en);
  localeState.locales.set("zh-cn", locale);
  class DayutsIntl {
    constructor() {
    }
    use(locale2) {
      localeState.locales.set(locale2.name, locale2);
      return this;
    }
    set locale(locale2) {
      if (localeState.locales.has(locale2)) {
        localeState.lang = locale2;
      } else {
        let list = [];
        localeState.locales.forEach(function(_, key) {
          list.push(key);
        });
        uni.__log__("warn", "at uni_modules/lime-dayuts/common/use.ts:46", '未知语言: "'.concat(locale2, '". 请使用以下已知语言之一:').concat(list.join(", ")));
      }
    }
    get locale() {
      return localeState.lang;
    }
    set(name, locale2) {
      localeState.locales.set(name, locale2);
    }
    has(name) {
      return localeState.locales.has(name);
    }
  }
  const dayutsIntl = new DayutsIntl();
  function parseLocale(preset, object = null, isLocal = false) {
    let l = null;
    if (preset == null)
      return dayutsIntl.locale;
    if (typeof preset == "string") {
      const presetLower = preset.toLowerCase();
      if (dayutsIntl.has(presetLower)) {
        l = presetLower;
      }
      if (object != null) {
        dayutsIntl.set(presetLower, object);
        l = presetLower;
      }
      const presetSplit = preset.split("-");
      if (l == null && presetSplit.length > 1) {
        return parseLocale(presetSplit[0]);
      }
    } else if (preset instanceof DayutsLocale) {
      dayutsIntl.set(preset.name, preset);
      l = preset.name;
    }
    if (!isLocal && l != null) {
      dayutsIntl.locale = l;
    }
    return l !== null && l !== void 0 ? l : dayutsIntl.locale;
  }
  function tryParseNumberAtIndex(digits, index) {
    if (index >= 0 && index < digits.length) {
      if (digits[index] == null)
        return null;
      const parsedNumber = isNumber(digits[index]) ? digits[index] : parseInt("".concat(digits[index]), 10);
      if (!isNaN(parsedNumber)) {
        return parsedNumber;
      }
    }
    return null;
  }
  function createDateFromArray(d, offset = 0) {
    var _a, _b, _c, _e, _f, _g, _h;
    const year = (_a = tryParseNumberAtIndex(d, 1 - offset)) !== null && _a !== void 0 ? _a : (/* @__PURE__ */ new Date()).getFullYear();
    const month = ((_b = tryParseNumberAtIndex(d, 2 - offset)) !== null && _b !== void 0 ? _b : 1) - 1;
    const day = (_c = tryParseNumberAtIndex(d, 3 - offset)) !== null && _c !== void 0 ? _c : 1;
    const hour = (_e = tryParseNumberAtIndex(d, 4 - offset)) !== null && _e !== void 0 ? _e : 0;
    const minute = (_f = tryParseNumberAtIndex(d, 5 - offset)) !== null && _f !== void 0 ? _f : 0;
    const second = (_g = tryParseNumberAtIndex(d, 6 - offset)) !== null && _g !== void 0 ? _g : 0;
    const millisecond = ((_h = tryParseNumberAtIndex(d, 7 - offset)) !== null && _h !== void 0 ? _h : 0).toString().substring(0, 3);
    return new Date(year, month, day, hour, minute, second, parseInt(millisecond));
  }
  function parseDate(cfg) {
    const date = cfg.date;
    if (date == null)
      return /* @__PURE__ */ new Date();
    if (date instanceof Date)
      return date;
    try {
      if (typeof date == "string" && !/Z$/i.test(date)) {
        const d = date.match(REGEX_PARSE);
        const isNull = d == null || Array.isArray(d) && d.length == 0;
        if (!isNull) {
          return createDateFromArray(d);
        }
      }
      if (typeof date == "string")
        return new Date(date);
      if (Array.isArray(date)) {
        return createDateFromArray(date, 1);
      }
      if (isNumber(date))
        return new Date(date);
      return null;
    } catch (err) {
      return null;
    }
  }
  function wrapper(date, instance) {
    return dayuts(date, instance.$L);
  }
  class Dayuts {
    constructor(cfg) {
      var _a;
      this.valid = true;
      this.$d = /* @__PURE__ */ new Date();
      this.$y = 0;
      this.$M = 0;
      this.$D = 0;
      this.$W = 0;
      this.$H = 0;
      this.$m = 0;
      this.$s = 0;
      this.$ms = 0;
      this.$u = false;
      this.$L = (_a = parseLocale(cfg.locale)) !== null && _a !== void 0 ? _a : dayutsIntl.locale;
      this.parse(cfg);
    }
    parse(cfg) {
      const _d = parseDate(cfg);
      if (_d != null) {
        this.$d = parseDate(cfg);
        this.init();
      } else {
        this.valid = false;
      }
    }
    init() {
      const $d = this.$d;
      this.$y = $d.getFullYear();
      this.$M = $d.getMonth();
      this.$D = $d.getDate();
      this.$W = $d.getDay();
      this.$H = $d.getHours();
      this.$m = $d.getMinutes();
      this.$s = $d.getSeconds();
      this.$ms = $d.getMilliseconds();
    }
    /**
     * 检查日期对象是否有效。
     *
     * @returns {boolean} 如果日期对象有效，则返回true；否则返回false。
     */
    isValid() {
      return this.valid;
    }
    isSame(input, units = "millisecond") {
      const other = input instanceof Dayuts ? input : dayuts(input);
      const date1 = this.startOf(units).valueOf();
      const date2 = other.valueOf();
      const date3 = this.endOf(units).valueOf();
      return date1 <= date2 && date2 <= date3;
    }
    isAfter(input, units = "millisecond") {
      const other = input instanceof Dayuts ? input : dayuts(input);
      const date1 = other.valueOf();
      const date2 = this.startOf(units).valueOf();
      return date1 < date2;
    }
    isBefore(input, units = "millisecond") {
      const other = input instanceof Dayuts ? input : dayuts(input);
      const date1 = other.valueOf();
      const date2 = this.endOf(units).valueOf();
      return date2 < date1;
    }
    isSameOrBefore(input, units = "millisecond") {
      return this.isSame(input, units) || this.isBefore(input, units);
    }
    isSameOrAfter(input, units = "millisecond") {
      return this.isSame(input, units) || this.isAfter(input, units);
    }
    /**
     * 判断当前Dayuts对象是否在给定的两个时间之间
     * @param {any} input - 第一个时间输入
     * @param {any} input2 - 第二个时间输入
     * @param {DayutsUnit} units - 指定的时间单位
     * @param {string} interval - 区间符号，表示区间的开闭性，默认为'()'，表示开区间
     * @returns {boolean} - 如果当前Dayuts对象在给定的两个时间之间，则返回true，否则返回false
     */
    isBetween(input, input2, units = "millisecond", interval = "()") {
      const dA = dayuts(input);
      const dB = dayuts(input2);
      const dAi = interval.startsWith("(");
      const dBi = interval.endsWith(")");
      return (dAi ? this.isAfter(dA, units) : !this.isBefore(dA, units)) && (dBi ? this.isBefore(dB, units) : !this.isAfter(dB, units)) || (dAi ? this.isBefore(dA, units) : !this.isAfter(dA, units)) && (dBi ? this.isAfter(dB, units) : !this.isBefore(dB, units));
    }
    /**
     * 判断当前Dayuts对象所在的年份是否为闰年
     * @returns {boolean} - 如果当前Dayuts对象所在的年份是闰年，则返回true，否则返回false
     */
    isLeapYear() {
      return this.$y % 4 == 0 && this.$y % 100 != 0 || this.$y % 400 == 0;
    }
    isToday() {
      const comparisonTemplate = "YYYY-MM-DD";
      const now = dayuts();
      return this.format(comparisonTemplate) == now.format(comparisonTemplate);
    }
    /**
     * 获取当前 `dayuts` 对象的 Unix 时间戳（以秒为单位）。
     *
     * @returns {number} 返回当前 `dayuts` 对象的 Unix 时间戳（以秒为单位）。
     */
    unix() {
      return Math.floor(this.valueOf() / 1e3);
    }
    /**
     * 将当前日期设置为指定时间单位的开始或结束。
     *
     * @param {string} units - 时间单位，例如'year'、'month'、'day'等。
     * @param {boolean} startOf - 如果为true，则设置为开始；如果为false，则设置为结束。
     * @returns {Dayuts} 返回一个新的Dayuts对象，表示调整后的日期。
     */
    startOf(units, startOf = true) {
      var _a;
      const isStartOf = startOf;
      const unit = prettyUnit(units);
      const instanceFactory = (d, m) => {
        const ins = dayuts(new Date(this.$y, m, d));
        return isStartOf ? ins : ins.endOf(D);
      };
      const instanceFactorySet = (method, slice) => {
        const argumentStart = [0, 0, 0, 0];
        const argumentEnd = [23, 59, 59, 999];
        const args = (isStartOf ? argumentStart : argumentEnd).slice(slice);
        const date = this.toDate();
        if (method == "setHours") {
          date.setHours(args[0]);
          date.setMinutes(args[1]);
          date.setSeconds(args[2]);
          date.setMilliseconds(args[3]);
        } else if (method == "setMinutes") {
          date.setMinutes(args[0]);
          date.setSeconds(args[1]);
          date.setMilliseconds(args[2]);
        } else if (method == "setSeconds") {
          date.setSeconds(args[0]);
          date.setMilliseconds(args[1]);
        } else if (method == "setMilliseconds") {
          date.setMilliseconds(args[0]);
        }
        return dayuts(date);
      };
      const _b = this, $W = _b.$W, $M = _b.$M, $D = _b.$D;
      const utcPad = "set".concat(this.$u ? "UTC" : "");
      if (unit == Y) {
        return isStartOf ? instanceFactory(1, 0) : instanceFactory(31, 11);
      } else if (unit == M) {
        return isStartOf ? instanceFactory(1, $M) : instanceFactory(0, $M + 1);
      } else if (unit == W) {
        const weekStart = (_a = this.$locale().weekStart) !== null && _a !== void 0 ? _a : 0;
        const gap = ($W < weekStart ? $W + 7 : $W) - weekStart;
        return instanceFactory(isStartOf ? $D - gap : $D + (6 - gap), $M);
      } else if (unit == D || unit == DATE) {
        return instanceFactorySet("".concat(utcPad, "Hours"), 0);
      } else if (unit == H) {
        return instanceFactorySet("".concat(utcPad, "Minutes"), 1);
      } else if (unit == MIN) {
        return instanceFactorySet("".concat(utcPad, "Seconds"), 2);
      } else if (unit == S) {
        return instanceFactorySet("".concat(utcPad, "Milliseconds"), 3);
      } else {
        return this.clone();
      }
    }
    /**
     * 将当前日期设置为指定时间单位的结束。
     *
     * @param {string} arg - 时间单位，例如'year'、'month'、'day'等。
     * @returns {Dayuts} 返回一个新的Dayuts对象，表示调整后的日期。
     */
    endOf(units) {
      return this.startOf(units, false);
    }
    /**
     * 设置指定的时间单位的值。
     *
     * @param {string} units - 要设置的时间单位（如 "year"、"month"、"day" 等）。
     * @param {number} int - 要设置的值。
     * @returns {Dayuts} 返回当前对象。
     */
    $set(units, int) {
      const unit = prettyUnit(units);
      const arg = unit == D ? this.$D + (int - this.$W) : int;
      const setDateUnit = (date, unit2, arg2) => {
        if (unit2 == D || unit2 == DATE) {
          date.$d.setDate(arg2);
        } else if (unit2 == M) {
          date.$d.setMonth(arg2);
        } else if (unit2 == Y) {
          date.$d.setFullYear(arg2);
        } else if (unit2 == H) {
          date.$d.setHours(arg2);
        } else if (unit2 == MIN) {
          date.$d.setMinutes(arg2);
        } else if (unit2 == S) {
          date.$d.setSeconds(arg2);
        } else if (unit2 == MS) {
          date.$d.setMilliseconds(arg2);
        }
      };
      if (unit == M || unit == Y) {
        const date = this.clone().set(DATE, 1);
        setDateUnit(date, unit, arg);
        date.init();
        this.$d = date.set(DATE, Math.min(this.$D, date.daysInMonth())).$d;
      } else {
        setDateUnit(this, unit, arg);
      }
      this.init();
      return this;
    }
    /**
     * 创建一个当前对象的副本，并设置指定的时间单位的值。
     *
     * @param {string} string - 要设置的时间单位（如 "year"、"month"、"day" 等）。
     * @param {number} int - 要设置的值。
     * @returns {Dayuts} 返回一个新的 `dayuts` 对象，其值为当前对象的副本，并设置了指定的时间单位的值。
     */
    set(string, int) {
      return this.clone().$set(string, int);
    }
    /**
     * 获取当前 `dayuts` 对象的指定时间单位的值。
     *
     * @param {string} units - 要获取的时间单位（如 "year"、"month"、"day" 等）。
     * @returns {number} 返回当前 `dayuts` 对象的指定时间单位的值。
     */
    get(units) {
      const unit = prettyUnit(units);
      if (unit == D) {
        return this.day();
      } else if (unit == DATE) {
        return this.date();
      } else if (unit == M) {
        return this.month();
      } else if (unit == Y) {
        return this.year();
      } else if (unit == H) {
        return this.hour();
      } else if (unit == MIN) {
        return this.minute();
      } else if (unit == S) {
        return this.second();
      } else if (unit == MS) {
        return this.millisecond();
      }
      return 0;
    }
    year(input = null) {
      if (input == null)
        return this.$y;
      return this.set(Y, input);
    }
    month(input = null) {
      if (input == null)
        return this.$M;
      return this.set(M, input);
    }
    day(input = null) {
      if (input == null)
        return this.$W;
      return this.set(D, input);
    }
    date(input = null) {
      if (input == null)
        return this.$D;
      return this.set(DATE, input);
    }
    hour(input = null) {
      if (input == null)
        return this.$H;
      return this.set(H, input);
    }
    minute(input = null) {
      if (input == null)
        return this.$m;
      return this.set(MIN, input);
    }
    second(input = null) {
      if (input == null)
        return this.$s;
      return this.set(S, input);
    }
    millisecond(input = null) {
      if (input == null)
        return this.$ms;
      return this.set(MS, input);
    }
    /**
     * 在当前 Dayuts 实例上添加指定的时间长度。
     * @param {number} number - 要添加的时间长度。
     * @param {string} units - 要添加的时间单位（例如，“years”，“months”，“days”等）。
     * @returns {Dayuts} 更新的 Dayuts 实例。
     */
    add(number, units) {
      var _a;
      const unit = prettyUnit(units);
      const instanceFactorySet = (n) => {
        const d = dayuts(this);
        return d.date(d.date() + Math.round(n * number));
      };
      if (unit == M) {
        return this.set(M, this.$M + number);
      }
      if (unit == Y) {
        return this.set(Y, this.$y + number);
      }
      if (unit == D) {
        return instanceFactorySet(1);
      }
      if (unit == W) {
        return instanceFactorySet(7);
      }
      const steps = /* @__PURE__ */ new Map([
        [MIN, MILLISECONDS_A_MINUTE],
        [H, MILLISECONDS_A_HOUR],
        [S, MILLISECONDS_A_SECOND]
      ]);
      const step = (_a = steps.get(unit)) !== null && _a !== void 0 ? _a : 1;
      const nextTimeStamp = this.$d.getTime() + number * step;
      return wrapper(nextTimeStamp, this);
    }
    /**
     * 从当前 Dayuts 实例中减去指定的时间。
     * @param {number} number - 要减去的时间。
     * @param {string} units - 要减去的时间单位（例如，“years”，“months”，“days”等）。
     * @returns {Dayuts} 更新的 Dayuts 实例。
     */
    subtract(number, units) {
      return this.add(number * -1, units);
    }
    /**
     * 日期格式化
     * @param {string} formatStr - 格式化字符串，包含各种格式化占位符（例如，“YYYY-MM-DD”，“HH:mm:ss”等）。
     * @returns {string} 格式化后的日期字符串。
     */
    format(formatStr = null) {
      const locale2 = this.$locale();
      if (!this.isValid())
        return INVALID_DATE_STRING;
      const str = formatStr !== null && formatStr !== void 0 ? formatStr : FORMAT_DEFAULT;
      const zoneStr = padZoneStr(this);
      const _a = this, $H = _a.$H, $m = _a.$m, $M = _a.$M;
      const weekdays = locale2.weekdays, months = locale2.months, meridiem = locale2.meridiem;
      function getShort(arr, index, full = [], length = 0) {
        if (arr != null && arr.length >= index) {
          return arr[index];
        } else if (full.length >= index) {
          return full[index].slice(0, length);
        }
        return "";
      }
      const get$H = (num) => {
        return padStart(($H % 12 == 0 ? 12 : $H % 12).toString(), num, "0");
      };
      const meridiemFunc = meridiem !== null && meridiem !== void 0 ? meridiem : (hour, _, isLowercase) => {
        const m = hour < 12 ? "AM" : "PM";
        return isLowercase ? m.toLowerCase() : m;
      };
      const matches = (match) => {
        if (match == "YY") {
          return this.$y.toString().slice(-2);
        } else if (match == "YYYY") {
          return padStart(this.$y.toString(), 4, "0");
        } else if (match == "M") {
          return ($M + 1).toString();
        } else if (match == "MM") {
          return padStart(($M + 1).toString(), 2, "0");
        } else if (match == "MMM") {
          return getShort(locale2.monthsShort, $M, months, 3);
        } else if (match == "MMMM") {
          return getShort(months, $M);
        } else if (match == "D") {
          return this.$D.toString();
        } else if (match == "DD") {
          return padStart(this.$D.toString(), 2, "0");
        } else if (match == "d") {
          return this.$W.toString();
        } else if (match == "dd") {
          return getShort(locale2.weekdaysMin, this.$W, weekdays, 2);
        } else if (match == "ddd") {
          return getShort(locale2.weekdaysShort, this.$W, weekdays, 3);
        } else if (match == "dddd") {
          return weekdays[this.$W];
        } else if (match == "H") {
          return $H.toString();
        } else if (match == "HH") {
          return padStart($H.toString(), 2, "0");
        } else if (match == "h") {
          return get$H(1);
        } else if (match == "hh") {
          return get$H(2);
        } else if (match == "a") {
          return meridiemFunc($H, $m, true);
        } else if (match == "A") {
          return meridiemFunc($H, $m, false);
        } else if (match == "m") {
          return $m.toString();
        } else if (match == "mm") {
          return padStart($m.toString(), 2, "0");
        } else if (match == "s") {
          return this.$s.toString();
        } else if (match == "ss") {
          return padStart(this.$s.toString(), 2, "0");
        } else if (match == "SSS") {
          return padStart(this.$ms.toString(), 3, "0");
        } else if (match == "Z") {
          return zoneStr;
        }
        return null;
      };
      return str.replace(REGEX_FORMAT, (match, $1, offset, string) => {
        var _a2;
        return (_a2 = $1 !== null && $1 !== void 0 ? $1 : matches(match)) !== null && _a2 !== void 0 ? _a2 : zoneStr.replace(":", "");
      });
    }
    /**
     * 获取 Dayuts 实例的 UTC 偏移量（以分钟为单位）。
     * @returns {number} UTC 偏移量（以分钟为单位）。
     */
    utcOffset() {
      return 0;
    }
    diff(input, units = "millisecond", float = false) {
      const unit = prettyUnit(units);
      const that = dayuts(input);
      const zoneDelta = (that.utcOffset() - this.utcOffset()) * MILLISECONDS_A_MINUTE;
      const diff = this.valueOf() - that.valueOf();
      const getMonth = () => {
        return monthDiff(this, that);
      };
      let result;
      switch (unit) {
        case Y:
          result = getMonth() / 12;
          break;
        case M:
          result = getMonth();
          break;
        case Q:
          result = getMonth() / 3;
          break;
        case W:
          result = (diff - zoneDelta) / MILLISECONDS_A_WEEK;
          break;
        case D:
          result = (diff - zoneDelta) / MILLISECONDS_A_DAY;
          break;
        case H:
          result = diff / MILLISECONDS_A_HOUR;
          break;
        case MIN:
          result = diff / MILLISECONDS_A_MINUTE;
          break;
        case S:
          result = diff / MILLISECONDS_A_SECOND;
          break;
        default:
          result = diff;
          break;
      }
      return float ? result : absFloor(result);
    }
    /**
     * 将当前 Dayuts 对象转换为原生 Date 对象。
     *
     * @returns {Date} 返回一个表示当前日期的原生 Date 对象。
     */
    toDate() {
      return new Date(this.valueOf());
    }
    /**
     * 将 Moment 对象转换为 JSON 字符串
     * @returns {string | null} 如果 Moment 对象有效，则返回 ISO 8601 格式的字符串，否则返回 null
     */
    toJSON() {
      return this.isValid() ? this.toISOString() : null;
    }
    /**
     * 将 Moment 对象转换为 ISO 8601 格式的字符串
     * @returns {string} 返回 ISO 8601 格式的字符串
     */
    toISOString() {
      return this.$d.toString();
    }
    toObject() {
      return {
        years: this.$y,
        months: this.$M,
        date: this.$D,
        hours: this.$H,
        minutes: this.$m,
        seconds: this.$s,
        milliseconds: this.$ms
      };
    }
    toArray() {
      return [
        this.$y,
        this.$M,
        this.$D,
        this.$H,
        this.$m,
        this.$s,
        this.$ms
      ];
    }
    /**
     * 获取当前日期的毫秒数。
     *
     * @returns {number} 返回一个表示当前日期的毫秒数。
     */
    valueOf() {
      return this.$d.getTime();
    }
    /**
     * 获取当前 `dayuts` 对象所在月份的天数。
     *
     * @returns {number} 返回当前 `dayuts` 对象所在月份的天数。
     */
    daysInMonth() {
      return this.endOf(M).$D;
    }
    /**
     * 获取当前日期的区域设置对象。
     *
     * @returns {Object} 区域设置对象。
     */
    $locale() {
      return localeState.locales.get(this.$L);
    }
    locale(preset, object = null) {
      const that = this.clone();
      const nextLocaleName = parseLocale(preset, object, true);
      if (nextLocaleName != null)
        that.$L = nextLocaleName;
      return that;
    }
    clone() {
      return wrapper(this.$d.getTime(), this);
    }
    /**
     * 返回当前 dayuts 对象的 UTC 字符串表示。
     *
     * @returns {string} 当前 dayuts 对象的 UTC 字符串表示。
     */
    toString() {
      return this.$d.toString();
    }
    dayOfYear(input = null) {
      const dayOfYear = Math.round((this.startOf("day").valueOf() - this.startOf("year").valueOf()) / 864e5) + 1;
      return input == null ? dayOfYear : this.add(input - dayOfYear, "day");
    }
    fromToBase(input, withoutSuffix, instance, isFrom) {
      var _a, _b;
      const relObj = (_a = localeState.locales.get("en")) === null || _a === void 0 ? void 0 : _a.relativeTime;
      const loc = (_b = instance.$locale().relativeTime) !== null && _b !== void 0 ? _b : relObj;
      if (loc == null)
        return "";
      const T = [
        { l: "s", r: 44, d: S },
        { l: "m", r: 89 },
        { l: "mm", r: 44, d: MIN },
        { l: "h", r: 89 },
        { l: "hh", r: 21, d: H },
        { l: "d", r: 35 },
        { l: "dd", r: 25, d: D },
        { l: "M", r: 45 },
        { l: "MM", r: 10, d: M },
        { l: "y", r: 17 },
        { l: "yy", d: Y }
      ];
      const Tl = T.length;
      let result = 0;
      let out = "";
      let isFuture = false;
      for (let i = 0; i < Tl; i += 1) {
        let t = T[i];
        if (t.d != null) {
          result = isFrom ? dayuts(input).diff(instance, t.d, true) : instance.diff(input, t.d, true);
        }
        let abs = Math.round(Math.abs(result));
        isFuture = result > 0;
        if (t.r == null || t.r != null && abs <= t.r) {
          if (abs <= 1 && i > 0)
            t = T[i - 1];
          const format = loc[t.l];
          if (typeof format == "string") {
            out = format.replace("%d", abs.toString());
          }
          break;
        }
      }
      if (withoutSuffix)
        return out;
      const pastOrFuture = isFuture ? loc.future : loc.past;
      return pastOrFuture.replace("%s", out);
    }
    to(input, withoutSuffix = false) {
      return this.fromToBase(input, withoutSuffix, this, true);
    }
    from(input, withoutSuffix = false) {
      return this.fromToBase(input, withoutSuffix, this, false);
    }
    toNow(withoutSuffix = false) {
      return this.to(dayuts(), withoutSuffix);
    }
    fromNow(withoutSuffix = false) {
      return this.from(dayuts(), withoutSuffix);
    }
  }
  function dayuts(date = null, format = null, locale2 = null) {
    if (date != null && date instanceof Dayuts)
      return date.clone();
    return new Dayuts({
      date,
      format,
      locale: locale2
    });
  }
  const _sfc_main$n = /* @__PURE__ */ vue.defineComponent({
    __name: "l-date-time-picker",
    props: {
      cancelBtn: { type: String, required: false },
      cancelStyle: { type: null, required: false },
      confirmBtn: { type: String, required: false },
      confirmStyle: { type: null, required: false },
      customLocale: { type: String, required: false },
      end: { type: [String, Number], required: false },
      start: { type: [String, Number], required: false },
      steps: { type: null, required: false },
      title: { type: String, required: false },
      titleStyle: { type: null, required: false },
      value: { type: [String, Number], required: false },
      defaultValue: { type: [String, Number], required: false },
      modelValue: { type: [String, Number], required: false },
      format: { type: String, required: true, default: DEFAULT_FORMAT },
      mode: { type: null, required: true, default: 1 | 2 | 4 },
      customFilter: { type: Function, required: false },
      renderLabel: { type: Function, required: false },
      showUnit: { type: Boolean, required: true, default: true },
      itemHeight: { type: String, required: false },
      itemColor: { type: String, required: false },
      itemFontSize: { type: String, required: false },
      itemActiveColor: { type: String, required: false },
      indicatorStyle: { type: String, required: false },
      maskColors: { type: Array, required: false },
      bgColor: { type: String, required: false },
      groupHeight: { type: String, required: false },
      radius: { type: String, required: false },
      resetIndex: { type: Boolean, required: true, default: false },
      minHour: { type: Number, required: true, default: 0 },
      maxHour: { type: Number, required: true, default: 23 },
      minMinute: { type: Number, required: true, default: 0 },
      maxMinute: { type: Number, required: true, default: 59 }
    },
    emits: ["change", "cancel", "confirm", "pick", "update:modelValue", "update:value"],
    setup(__props, _a) {
      var _b;
      var __expose = _a.expose, __emit = _a.emit;
      __expose();
      const emit = __emit;
      const props = __props;
      let defaultValue = (_b = coalesce(props.value, props.modelValue, props.defaultValue)) !== null && _b !== void 0 ? _b : Date.now();
      const innerValue = vue.computed({
        set(value) {
          if (defaultValue == value)
            return null;
          defaultValue = value;
          emit("change", value);
          emit("update:modelValue", value);
          emit("update:value", value);
        },
        get() {
          var _a2;
          return (_a2 = coalesce(props.value, props.modelValue)) !== null && _a2 !== void 0 ? _a2 : defaultValue;
        }
      });
      const meaningColumn = getMeaningColumn(props.mode);
      const isTimeMode = ["hour", "minute", "second"].includes(meaningColumn[0]);
      const normalize = (val = null, defaultDay) => {
        return val != "" && val != null && dayuts(val).isValid() ? dayuts(val) : defaultDay;
      };
      const minDate = vue.computed(() => {
        return normalize(props.start, dayuts().subtract(1, "year"));
      });
      const maxDate = vue.computed(() => {
        return normalize(props.end, dayuts());
      });
      const rationalize = (val) => {
        if (isTimeMode)
          return val;
        if (val.isBefore(minDate.value))
          return minDate.value;
        if (val.isAfter(maxDate.value))
          return maxDate.value;
        return val;
      };
      const calcDate = (currentValue = null) => {
        if (meaningColumn.length == 1 && meaningColumn[0] == "year") {
          if (currentValue != null) {
            if (typeof currentValue == "string") {
              const yearNum = parseInt(currentValue);
              if (!isNaN(yearNum) && yearNum > 1e3) {
                return rationalize(dayuts().year(yearNum).startOf("year"));
              }
            }
          }
        }
        if (isTimeMode && typeof currentValue == "string") {
          let format = "YYYY-MM-DD";
          let space = " ";
          const hasHour = meaningColumn.includes("hour");
          const hasMinute = meaningColumn.includes("minute");
          const hasSecond = meaningColumn.includes("second");
          if (!hasHour && hasMinute) {
            format += " HH";
            space = ":";
          } else if (!hasHour && !hasMinute && hasSecond) {
            format += " HH:mm";
            space = ":";
          }
          const dateStr = dayuts(minDate.value).format(format);
          currentValue = "".concat(dateStr).concat(space).concat(currentValue);
        }
        return currentValue != null && dayuts(currentValue).isValid() ? rationalize(dayuts(currentValue)) : maxDate.value;
      };
      const curDate = vue.ref(calcDate(innerValue.value));
      const valueOfPicker = vue.computed(() => {
        return meaningColumn.map((item) => {
          return curDate.value.get(item).toString();
        });
      });
      const columnCache = /* @__PURE__ */ new Map();
      const columns = vue.computed(() => {
        const ret = [];
        const getDate = (date) => {
          return [
            date.year(),
            date.month() + 1,
            date.date(),
            date.hour(),
            date.minute(),
            date.second()
          ];
        };
        const _a2 = __read(getDate(curDate.value), 5), curYear = _a2[0], curMonth = _a2[1], curDay = _a2[2], curHour = _a2[3], curMinute = _a2[4];
        const _b2 = __read(getDate(minDate.value), 6), minYear = _b2[0], minMonth = _b2[1], minDay = _b2[2], minHour = _b2[3], minMinute = _b2[4], minSecond = _b2[5];
        const _c = __read(getDate(maxDate.value), 6), maxYear = _c[0], maxMonth = _c[1], maxDay = _c[2], maxHour = _c[3], maxMinute = _c[4], maxSecond = _c[5];
        const isInMinYear = curYear == minYear;
        const isInMaxYear = curYear == maxYear;
        const isInMinMonth = isInMinYear && curMonth == minMonth;
        const isInMaxMonth = isInMaxYear && curMonth === maxMonth;
        const isInMinDay = isInMinMonth && curDay == minDay;
        const isInMaxDay = isInMaxMonth && curDay == maxDay;
        const isInMinHour = isInMinDay && curHour == minHour;
        const isInMaxHour = isInMaxDay && curHour == maxHour;
        const isInMinMinute = isInMinHour && curMinute == minMinute;
        const isInMaxMinute = isInMaxHour && curMinute == maxMinute;
        const generateColumn = (type, lowerBound, upperBound) => {
          const cacheKey = "".concat(type, "-").concat(lowerBound, "-").concat(upperBound);
          if (columnCache.has(cacheKey)) {
            ret.push(UTS.mapGet(columnCache, cacheKey));
            return null;
          }
          const arr = [];
          for (let i = lowerBound; i <= upperBound; i++) {
            const value = i;
            arr.push({
              label: props.renderLabel != null ? props.renderLabel(type, i.toString()) : "".concat(value).concat(props.showUnit ? UTS.mapGet(UNIT_MAP, type) : ""),
              value: type == "month" ? "".concat(value - 1) : value.toString()
            });
          }
          if (props.customFilter != null) {
            const _arr = props.customFilter(type, arr);
            ret.push(_arr);
            columnCache.set(cacheKey, _arr);
          } else {
            ret.push(arr);
            columnCache.set(cacheKey, arr);
          }
        };
        if (meaningColumn.includes("year")) {
          generateColumn("year", minYear, maxYear);
        }
        if (meaningColumn.includes("month")) {
          const lower = isInMinYear ? minMonth : 1;
          const upper = isInMaxYear ? maxMonth : 12;
          generateColumn("month", lower, upper);
        }
        if (meaningColumn.includes("date")) {
          const lower = isInMinMonth ? minDay : 1;
          const upper = isInMaxMonth ? maxDay : dayuts("".concat(curYear, "-").concat(curMonth)).daysInMonth();
          generateColumn("date", lower, upper);
        }
        if (meaningColumn.includes("hour")) {
          const lower = isInMinDay && !isTimeMode ? minHour : clamp(props.minHour, 0, 23);
          const upper = isInMaxDay && !isTimeMode ? maxHour : clamp(props.maxHour, lower, 23);
          generateColumn("hour", lower, upper);
        }
        if (meaningColumn.includes("minute")) {
          const lower = isInMinHour && !isTimeMode ? minMinute : clamp(props.minMinute, 0, 59);
          const upper = isInMaxHour && !isTimeMode ? maxMinute : clamp(props.maxMinute, lower, 59);
          generateColumn("minute", lower, upper);
        }
        if (meaningColumn.includes("second")) {
          const lower = isInMinMinute && !isTimeMode ? minSecond : 0;
          const upper = isInMaxMinute && !isTimeMode ? maxSecond : 59;
          generateColumn("second", lower, upper);
        }
        return ret;
      });
      const innterFormat = vue.computed(() => {
        const first = meaningColumn.length > 0 ? meaningColumn[0] : "year";
        const last = meaningColumn.length > 0 ? meaningColumn[meaningColumn.length - 1] : "date";
        const format = DEFAULT_FORMAT.substring(DEFAULT_FORMAT.indexOf(UTS.mapGet(FORMAT_MAP, first)), DEFAULT_FORMAT.lastIndexOf(UTS.mapGet(FORMAT_MAP, last)) + UTS.mapGet(FORMAT_MAP, last).length);
        return format;
      });
      const onConfirm = (_a2) => {
        var values = _a2.values;
        let cur = curDate.value;
        values.forEach((item, index) => {
          const type = meaningColumn[index];
          cur = cur.set(type, parseInt("".concat(item), 10));
        });
        const curValue = cur.format(props.format);
        innerValue.value = cur.format(innterFormat.value);
        emit("confirm", curValue);
      };
      const onCancel = () => {
        emit("cancel");
      };
      const onPick = (_a2) => {
        _a2.values;
        var column = _a2.column, index = _a2.index;
        const type = meaningColumn[column];
        const val = curDate.value.set(type, parseInt(columns.value[column][index].value, 10));
        curDate.value = rationalize(val);
        emit("pick", rationalize(val).format(props.format));
      };
      const onChange = (values) => {
        let cur = curDate.value;
        values.forEach((item, index) => {
          const type = meaningColumn[index];
          cur = cur.set(type, parseInt("".concat(item), 10));
        });
        curDate.value = rationalize(cur);
        const curValue = curDate.value.format(innterFormat.value);
        innerValue.value = curValue;
      };
      const stop = vue.watch(innerValue, (val) => {
        curDate.value = calcDate(val);
      });
      vue.onBeforeUnmount(() => {
        stop();
        columnCache.clear();
      });
      const __returned__ = { emit, props, get defaultValue() {
        return defaultValue;
      }, set defaultValue(v) {
        defaultValue = v;
      }, innerValue, meaningColumn, isTimeMode, normalize, minDate, maxDate, rationalize, calcDate, curDate, valueOfPicker, columnCache, columns, innterFormat, onConfirm, onCancel, onPick, onChange, stop };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$m(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_l_picker = resolveEasycom(vue.resolveDynamicComponent("l-picker"), __easycom_0$2);
    return vue.openBlock(), vue.createBlock(_component_l_picker, {
      title: $props.title,
      titleStyle: $props.titleStyle,
      "confirm-btn": $props.confirmBtn,
      "confirm-style": $props.confirmStyle,
      "cancel-btn": $props.cancelBtn,
      "cancel-style": $props.cancelStyle,
      itemHeight: $props.itemHeight,
      itemColor: $props.itemColor,
      itemFontSize: $props.itemFontSize,
      itemActiveColor: $props.itemActiveColor,
      indicatorStyle: $props.indicatorStyle,
      bgColor: $props.bgColor,
      groupHeight: $props.groupHeight,
      radius: $props.radius,
      value: $setup.valueOfPicker,
      columns: $setup.columns,
      maskColors: $props.maskColors,
      onConfirm: $setup.onConfirm,
      onCancel: $setup.onCancel,
      onChange: $setup.onChange,
      onPick: $setup.onPick
    }, null, 8, ["title", "titleStyle", "confirm-btn", "confirm-style", "cancel-btn", "cancel-style", "itemHeight", "itemColor", "itemFontSize", "itemActiveColor", "indicatorStyle", "bgColor", "groupHeight", "radius", "value", "columns", "maskColors"]);
  }
  const __easycom_2$1 = /* @__PURE__ */ _export_sfc(_sfc_main$n, [["render", _sfc_render$m], ["__file", "/Users/xyhc/Documents/carConnectInternet/uni_modules/lime-date-time-picker/components/l-date-time-picker/l-date-time-picker.uvue"]]);
  function raf(fn = null) {
    if (typeof fn == "UniAnimationFrameCallback") {
      return requestAnimationFrame(fn);
    } else {
      return requestAnimationFrame(fn);
    }
  }
  function useTransition(options) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    const state = vue.ref(false);
    const display = vue.ref(false);
    const inited = vue.ref(false);
    const classes = vue.ref("");
    const name = vue.ref((_a = options.defaultName) !== null && _a !== void 0 ? _a : "fade");
    const enterClass = (_b = options.enterClass) !== null && _b !== void 0 ? _b : "";
    const enterActiveClass = (_c = options.enterActiveClass) !== null && _c !== void 0 ? _c : "";
    const enterToClass = (_d = options.enterToClass) !== null && _d !== void 0 ? _d : "";
    const leaveActiveClass = (_e = options.leaveActiveClass) !== null && _e !== void 0 ? _e : "";
    const leaveToClass = (_f = options.leaveToClass) !== null && _f !== void 0 ? _f : "";
    const leaveClass = (_g = options.leaveClass) !== null && _g !== void 0 ? _g : "";
    const appear = (_h = options.appear) !== null && _h !== void 0 ? _h : false;
    const duration = (_j = options.duration) !== null && _j !== void 0 ? _j : 300;
    let status = "";
    let isTransitionEnd = false;
    let isTransitioning = false;
    let timeoutId = -1;
    let finishTimeoutId = -1;
    const emitEvent = (event) => {
      var _a2;
      (_a2 = options.emits) === null || _a2 === void 0 ? void 0 : _a2.call(options, event);
    };
    const finished = () => {
      var _a2;
      if (isTransitionEnd)
        return;
      isTransitionEnd = true;
      clearTimeout(finishTimeoutId);
      if ((_a2 = options.removeClasses) !== null && _a2 !== void 0 ? _a2 : false) {
        classes.value = "";
      }
      emitEvent("after-".concat(status));
      if (display.value && !state.value) {
        display.value = false;
      }
    };
    const sleep = () => {
      return new Promise((resolve) => {
        vue.nextTick(() => {
          raf(() => {
            var _a2, _b2, _c2, _d2;
            if (((_a2 = options.element) === null || _a2 === void 0 ? void 0 : _a2.value) != null) {
              (_d2 = (_c2 = (_b2 = options.element) === null || _b2 === void 0 ? void 0 : _b2.value) === null || _c2 === void 0 ? void 0 : _c2.getBoundingClientRectAsync()) === null || _d2 === void 0 ? void 0 : _d2.then((res) => {
                resolve();
              });
            } else {
              resolve();
            }
          });
        });
      });
    };
    const getClassNames = (name2) => {
      return /* @__PURE__ */ new Map([
        ["enter", "l-".concat(name2, "-enter l-").concat(name2, "-enter-active ").concat(enterClass, " ").concat(enterActiveClass)],
        ["enter-to", "l-".concat(name2, "-enter-to l-").concat(name2, "-enter-active ").concat(enterToClass, " ").concat(enterActiveClass)],
        ["leave", "l-".concat(name2, "-leave l-").concat(name2, "-leave-active ").concat(leaveClass, " ").concat(leaveActiveClass)],
        ["leave-to", "l-".concat(name2, "-leave-to l-").concat(name2, "-leave-active ").concat(leaveToClass, " ").concat(leaveActiveClass)]
      ]);
    };
    const transitionQueue = vue.ref([]);
    const performTransition = (newStatus, eventName) => {
      return __awaiter(this, void 0, void 0, function* () {
        var _a2;
        if (status == newStatus)
          return;
        transitionQueue.value.push(newStatus);
        if (isTransitioning)
          return;
        isTransitioning = true;
        isTransitionEnd = true;
        while (transitionQueue.value.length > 0) {
          const currentStatus = transitionQueue.value.shift();
          status = currentStatus;
          emitEvent("before-".concat(eventName));
          yield sleep();
          yield sleep();
          yield sleep();
          yield sleep();
          yield sleep();
          if (status != currentStatus)
            continue;
          const classNames = getClassNames(name.value);
          inited.value = true;
          display.value = true;
          classes.value = classNames.get(eventName);
          emitEvent(eventName);
          const executeAfterTick = (_a2 = options.onNextTick) === null || _a2 === void 0 ? void 0 : _a2.call(options, eventName);
          if (executeAfterTick != null) {
            yield executeAfterTick;
          }
          yield sleep();
          if (status != currentStatus)
            continue;
          classes.value = classNames.get("".concat(eventName, "-to"));
          if (status == "leave") {
            setTimeout(() => {
              finished();
            }, duration);
          }
        }
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          if (transitionQueue.value.length == 0 && status == newStatus) {
            isTransitionEnd = false;
          }
        }, duration * 0.8);
        isTransitioning = false;
      });
    };
    const enter = () => {
      performTransition("enter", "enter");
    };
    const leave = () => {
      performTransition("leave", "leave");
    };
    let init = false;
    let lastState = null;
    vue.watchEffect(() => {
      if (options.visible == null)
        return;
      state.value = options.visible();
      if (lastState == state.value)
        return;
      lastState = state.value;
      if (!appear && !init) {
        init = true;
        return;
      }
      if (state.value) {
        enter();
      } else {
        leave();
      }
    });
    vue.watchEffect(() => {
      if (options.name == null)
        return;
      name.value = options.name();
    });
    const toggle = (v) => {
      state.value = v;
      if (v) {
        enter();
      } else {
        leave();
      }
    };
    return {
      state,
      inited,
      display,
      classes,
      name,
      finished,
      toggle
    };
  }
  const _sfc_main$m = /* @__PURE__ */ vue.defineComponent({
    __name: "l-overlay",
    props: {
      ariaLabel: { type: String, required: true, default: "关闭" },
      ariaRole: { type: String, required: true, default: "button" },
      lClass: { type: String, required: false },
      bgColor: { type: String, required: false },
      lStyle: { type: null, required: false },
      duration: { type: Number, required: true, default: 300 },
      preventScrollThrough: { type: Boolean, required: true, default: true },
      visible: { type: Boolean, required: true, default: false },
      zIndex: { type: Number, required: true, default: 998 }
    },
    emits: ["click", "before-enter", "enter", "after-enter", "before-leave", "leave", "after-leave"],
    setup(__props, _a) {
      var __expose = _a.expose, __emit = _a.emit;
      __expose();
      const props = __props;
      const emit = __emit;
      const _b = useTransition({
        defaultName: "fade",
        appear: props.visible,
        emits: (name) => {
          emit(name);
        },
        visible: () => {
          return props.visible;
        },
        duration: props.duration
      }), inited = _b.inited, display = _b.display, classes = _b.classes, finished = _b.finished;
      const styles = vue.computed(() => {
        const style = /* @__PURE__ */ new Map();
        if (props.bgColor != null) {
          style.set("background-color", props.bgColor);
        }
        if (props.zIndex > 0) {
          style.set("z-index", props.zIndex);
        }
        return style;
      });
      const noop = () => {
      };
      const onClick = (event) => {
        emit("click", !props.visible);
      };
      const overlayRef = vue.ref(null);
      vue.watchEffect(() => {
        var _a2, _b2, _c;
        (_a2 = overlayRef.value) === null || _a2 === void 0 ? null : _a2.style.setProperty("transition-duration", "".concat(props.duration, "ms"));
        if (!display.value) {
          (_b2 = overlayRef.value) === null || _b2 === void 0 ? null : _b2.style.setProperty("display", "none");
        } else {
          (_c = overlayRef.value) === null || _c === void 0 ? null : _c.style.setProperty("display", "flex");
        }
      });
      const __returned__ = { props, emit, inited, display, classes, finished, styles, noop, onClick, overlayRef };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  const _style_0$m = { "l-overlay": { "": { "position": "fixed", "top": 0, "left": 0, "width": "100%", "bottom": 0, "backgroundColor": "var(--l-overlay-bg-color, rgba(0, 0, 0, 0.45))", "transitionProperty": "opacity", "transitionTimingFunction": "ease", "zIndex": "var(--l-overlay-z-index, 998)", "opacity": 1, "transitionDuration": "300ms" } }, "l-fade-enter": { "": { "opacity": 0 } }, "l-fade-leave-to": { "": { "opacity": 0 } }, "@TRANSITION": { "l-overlay": { "property": "opacity", "timingFunction": "ease", "duration": "300ms" } } };
  function _sfc_render$l(_ctx, _cache, $props, $setup, $data, $options) {
    return $setup.inited ? (vue.openBlock(), vue.createElementBlock("view", {
      key: 0,
      class: vue.normalizeClass(["l-overlay", [$props.lClass, $setup.classes]]),
      ref: "overlayRef",
      style: vue.normalizeStyle([$setup.styles, $props.lStyle]),
      onClick: vue.withModifiers($setup.onClick, ["stop"]),
      onTouchmove: vue.withModifiers($setup.noop, ["stop"]),
      onTransitionend: _cache[0] || (_cache[0] = (...args) => $setup.finished && $setup.finished(...args)),
      "aria-role": $props.ariaRole,
      "aria-label": $props.ariaLabel
    }, [
      vue.renderSlot(_ctx.$slots, "default")
    ], 46, ["aria-role", "aria-label"])) : vue.createCommentVNode("v-if", true);
  }
  const __easycom_0$1 = /* @__PURE__ */ _export_sfc(_sfc_main$m, [["render", _sfc_render$l], ["styles", [_style_0$m]], ["__file", "/Users/xyhc/Documents/carConnectInternet/uni_modules/lime-overlay/components/l-overlay/l-overlay.uvue"]]);
  function isDef(value) {
    return value != null;
  }
  function addUnit(value) {
    if (!isDef(value)) {
      return null;
    }
    value = "".concat(value);
    return isNumeric$1(value) ? "".concat(value, "px") : value;
  }
  function convertRadius(radius) {
    var _a;
    if (Array.isArray(radius)) {
      const values = radius.map((item) => {
        return addUnit(item);
      });
      if (values.length == 1) {
        return [values[0], values[0], values[0], values[0]];
      }
      if (values.length == 2) {
        return [values[0], values[1], values[0], values[1]];
      }
      if (values.length == 3) {
        return [values[0], values[1], values[2], values[1]];
      }
      if (values.length == 4) {
        return [values[0], values[1], values[2], values[3]];
      }
      return ["0", "0", "0", "0"];
    }
    const value = (_a = addUnit(radius)) !== null && _a !== void 0 ? _a : "0";
    return [value, value, value, value];
  }
  const _sfc_main$l = /* @__PURE__ */ vue.defineComponent({
    __name: "l-popup",
    props: /* @__PURE__ */ vue.mergeModels(new UTSJSONObject({
      closeable: { type: Boolean, required: true, default: false },
      closeOnClickOverlay: { type: Boolean, required: true, default: true },
      destroyOnClose: { type: Boolean, required: true, default: false },
      overlayStyle: { type: null, required: false },
      position: { type: String, required: true, default: "center" },
      preventScrollThrough: { type: Boolean, required: true, default: true },
      overlay: { type: Boolean, required: true, default: true },
      transitionName: { type: String, required: false },
      visible: { type: Boolean, required: false },
      zIndex: { type: Number, required: true, default: 999 },
      duration: { type: Number, required: true, default: 300 },
      bgColor: { type: String, required: false },
      closeIcon: { type: String, required: true, default: "close" },
      iconColor: { type: String, required: false },
      lStyle: { type: null, required: false },
      safeAreaInsetBottom: { type: Boolean, required: true, default: true },
      safeAreaInsetTop: { type: Boolean, required: true, default: false },
      radius: { type: [String, Number, Array], required: false }
    }), new UTSJSONObject({
      "modelValue": { type: Boolean },
      "modelModifiers": {}
    })),
    emits: /* @__PURE__ */ vue.mergeModels(["change", "click-overlay", "click-close", "open", "opened", "close", "closed", "before-enter", "enter", "after-enter", "before-leave", "leave", "after-leave"], ["update:modelValue"]),
    setup(__props, _a) {
      var _b;
      var __expose = _a.expose, __emit = _a.emit;
      __expose();
      const emit = __emit;
      const props = __props;
      const modelValue = vue.useModel(__props, "modelValue");
      const innerValue = vue.computed({
        set(value) {
          modelValue.value = value;
          emit("change", value);
        },
        get() {
          return props.visible || modelValue.value;
        }
      });
      const status = vue.ref("before-enter");
      const _c = useTransition({
        defaultName: (_b = props.transitionName) !== null && _b !== void 0 ? _b : "popup-fade",
        appear: innerValue.value,
        emits: (name) => {
          status.value = name;
          if (name == "before-enter") {
            emit("open");
          } else if (name == "after-enter") {
            emit("opened");
          } else if (name == "before-leave") {
            emit("close");
          } else if (name == "after-leave") {
            emit("closed");
          }
          emit(name);
        },
        visible: () => {
          return innerValue.value;
        },
        duration: props.duration
      }), inited = _c.inited, display = _c.display, classes = _c.classes, finished = _c.finished;
      const overlayZIndex = vue.computed(() => {
        return props.zIndex > 0 ? props.zIndex - 1 : 998;
      });
      const rootClass = vue.computed(() => {
        const safe = props.safeAreaInsetTop && props.position == "top" ? "l-popup--safe-top" : props.safeAreaInsetBottom && props.position == "bottom" ? "l-popup--safe-bottom" : "";
        return "l-popup--".concat(props.position, " ").concat(safe, " ").concat(classes.value);
      });
      const safeAreaInsets = uni.getWindowInfo().safeAreaInsets;
      const styles = vue.computed(() => {
        const style = /* @__PURE__ */ new Map();
        style.set("transition-duration", (["after-leave", "before-enter"].includes(status.value) ? 0 : props.duration) + "ms");
        if (props.bgColor != null) {
          style.set("background", props.bgColor);
        }
        if (props.zIndex > 0) {
          style.set("z-index", props.zIndex);
        }
        if (props.radius != null) {
          const values = convertRadius(props.radius);
          style.set("border-top-left-radius", values[0]);
          style.set("border-top-right-radius", values[1]);
          style.set("border-bottom-right-radius", values[2]);
          style.set("border-bottom-left-radius", values[3]);
        }
        return style;
      });
      const handleOverlayClick = () => {
        if (props.closeOnClickOverlay) {
          innerValue.value = false;
          emit("click-overlay");
        }
      };
      const handleClose = () => {
        innerValue.value = false;
        emit("click-close");
      };
      const popupRef = vue.ref(null);
      vue.watchEffect(() => {
        var _a2, _b2, _c2, _d;
        if (!display.value) {
          (_a2 = popupRef.value) === null || _a2 === void 0 ? null : _a2.style.setProperty("pointer-events", "none");
          (_b2 = popupRef.value) === null || _b2 === void 0 ? null : _b2.style.setProperty("z-index", -1e4);
        } else {
          (_c2 = popupRef.value) === null || _c2 === void 0 ? null : _c2.style.setProperty("pointer-events", "auto");
          (_d = popupRef.value) === null || _d === void 0 ? null : _d.style.setProperty("z-index", props.zIndex);
        }
      });
      const __returned__ = { emit, props, modelValue, innerValue, status, inited, display, classes, finished, overlayZIndex, rootClass, safeAreaInsets, styles, handleOverlayClick, handleClose, popupRef };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  const _style_0$l = { "l-popup": { "": { "position": "fixed", "transitionDuration": "300ms", "transitionProperty": "transform,opacity", "transitionTimingFunction": "ease", "backgroundColor": "var(--l-popup-bg-color, #fff)", "overflow": "visible", "opacity": 1 }, ".l-popup-fade-enter": { "opacity": 0 }, ".l-popup-fade-leave-to": { "opacity": 0 }, ".l-popup-fade-enter.l-popup--top": { "transform": "scale(1) translate(0, -100%)" }, ".l-popup-fade-leave-to.l-popup--top": { "transform": "scale(1) translate(0, -100%)" }, ".l-popup-fade-enter.l-popup--bottom": { "transform": "scale(1) translate(0, 100%)" }, ".l-popup-fade-leave-to.l-popup--bottom": { "transform": "scale(1) translate(0, 100%)" }, ".l-popup-fade-enter.l-popup--left": { "transform": "scale(1) translate(-100%, 0)" }, ".l-popup-fade-leave-to.l-popup--left": { "transform": "scale(1) translate(-100%, 0)" }, ".l-popup-fade-enter.l-popup--right": { "transform": "scale(1) translate(100%, 0)" }, ".l-popup-fade-leave-to.l-popup--right": { "transform": "scale(1) translate(100%, 0)" }, ".l-popup-fade-enter.l-popup--center": { "transform": "translate(-50%, -50%)", "opacity": 0 }, ".l-popup-fade-leave-to.l-popup--center": { "transform": "translate(-50%, -50%)", "opacity": 0 }, ".l-dialog-enter.l-popup--center": { "transform": "scale(0.6) translate(-50%, -50%)", "opacity": 0 }, ".l-dialog-leave-to.l-popup--center": { "transform": "scale(0.6) translate(-50%, -50%)", "opacity": 0 } }, "l-popup__close": { "": { "position": "absolute", "top": 0, "right": 0, "paddingTop": 10, "paddingRight": 10, "paddingBottom": 10, "paddingLeft": 10 } }, "l-popup__close-icon": { "": { "color": "var(--l-popup-close-icon-color, #000000A6)" } }, "l-popup--top": { "": { "top": 0, "left": 0, "right": 0, "borderBottomLeftRadius": "var(--l-popup-border-radius, 9px)", "borderBottomRightRadius": "var(--l-popup-border-radius, 9px)", "transform": "scale(1) translate(0, 0)" } }, "l-popup--bottom": { "": { "bottom": 0, "left": 0, "right": 0, "borderTopLeftRadius": "var(--l-popup-border-radius, 9px)", "borderTopRightRadius": "var(--l-popup-border-radius, 9px)", "transform": "scale(1) translate(0, 0)" } }, "l-popup--safe-top": { "": { "paddingTop": "var(--uni-safe-area-inset-top)" } }, "l-popup--safe-bottom": { "": { "paddingBottom": "var(--uni-safe-area-inset-bottom)" } }, "l-popup--left": { "": { "top": 0, "left": 0, "bottom": 0, "transform": "scale(1) translate(0, 0)" } }, "l-popup--right": { "": { "top": 0, "right": 0, "bottom": 0, "transform": "scale(1) translate(0, 0)" } }, "l-popup--center": { "": { "top": "50%", "left": "50%", "transform": "translate(-50%, -50%)", "transformOrigin": "50% 50%", "borderTopLeftRadius": "var(--l-popup-border-radius, 9px)", "borderTopRightRadius": "var(--l-popup-border-radius, 9px)", "borderBottomRightRadius": "var(--l-popup-border-radius, 9px)", "borderBottomLeftRadius": "var(--l-popup-border-radius, 9px)" } }, "@TRANSITION": { "l-popup": { "duration": "300ms", "property": "transform,opacity", "timingFunction": "ease" } } };
  function _sfc_render$k(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_l_overlay = resolveEasycom(vue.resolveDynamicComponent("l-overlay"), __easycom_0$1);
    const _component_i_icon = resolveEasycom(vue.resolveDynamicComponent("i-icon"), __easycom_2$6);
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        ($props.destroyOnClose ? $setup.display && $props.overlay : $props.overlay) ? (vue.openBlock(), vue.createBlock(_component_l_overlay, {
          key: 0,
          visible: $setup.innerValue,
          zIndex: $setup.overlayZIndex,
          appear: true,
          preventScrollThrough: $props.preventScrollThrough,
          "l-style": $props.overlayStyle,
          onClick: $setup.handleOverlayClick
        }, null, 8, ["visible", "zIndex", "preventScrollThrough", "l-style"])) : vue.createCommentVNode("v-if", true),
        ($props.destroyOnClose ? $setup.display : $setup.inited) ? (vue.openBlock(), vue.createElementBlock(
          "view",
          {
            key: 1,
            class: vue.normalizeClass(["l-popup", $setup.rootClass]),
            ref: "popupRef",
            style: vue.normalizeStyle([$setup.styles, $props.lStyle]),
            onTransitionend: _cache[0] || (_cache[0] = (...args) => $setup.finished && $setup.finished(...args))
          },
          [
            vue.renderSlot(_ctx.$slots, "default"),
            $props.closeable ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "l-popup__close",
              onClick: $setup.handleClose
            }, [
              vue.renderSlot(_ctx.$slots, "close-btn", {}, () => [
                vue.createVNode(_component_i_icon, {
                  name: "close",
                  fontSize: "20",
                  size: "27px",
                  color: $props.iconColor
                }, null, 8, ["color"])
              ])
            ])) : vue.createCommentVNode("v-if", true)
          ],
          38
          /* CLASS, STYLE, NEED_HYDRATION */
        )) : vue.createCommentVNode("v-if", true)
      ],
      64
      /* STABLE_FRAGMENT */
    );
  }
  const __easycom_3 = /* @__PURE__ */ _export_sfc(_sfc_main$l, [["render", _sfc_render$k], ["styles", [_style_0$l]], ["__file", "/Users/xyhc/Documents/carConnectInternet/uni_modules/lime-popup/components/l-popup/l-popup.uvue"]]);
  class TrackPoint extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            latitude: { type: Number, optional: false },
            longitude: { type: Number, optional: false },
            rotation: { type: Number, optional: false },
            deviceTime: { type: String, optional: false },
            speed: { type: Number, optional: false }
          };
        },
        name: "TrackPoint"
      };
    }
    constructor(options, metadata = TrackPoint.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.latitude = this.__props__.latitude;
      this.longitude = this.__props__.longitude;
      this.rotation = this.__props__.rotation;
      this.deviceTime = this.__props__.deviceTime;
      this.speed = this.__props__.speed;
      delete this.__props__;
    }
  }
  class TrackBounds extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            minLat: { type: Number, optional: false },
            maxLat: { type: Number, optional: false },
            minLng: { type: Number, optional: false },
            maxLng: { type: Number, optional: false }
          };
        },
        name: "TrackBounds"
      };
    }
    constructor(options, metadata = TrackBounds.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.minLat = this.__props__.minLat;
      this.maxLat = this.__props__.maxLat;
      this.minLng = this.__props__.minLng;
      this.maxLng = this.__props__.maxLng;
      delete this.__props__;
    }
  }
  class MapPolylinePoint extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            latitude: { type: Number, optional: false },
            longitude: { type: Number, optional: false }
          };
        },
        name: "MapPolylinePoint"
      };
    }
    constructor(options, metadata = MapPolylinePoint.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.latitude = this.__props__.latitude;
      this.longitude = this.__props__.longitude;
      delete this.__props__;
    }
  }
  class MpPolylineData extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            points: { type: "Unknown", optional: false },
            color: { type: String, optional: false },
            width: { type: Number, optional: false },
            dottedLine: { type: Boolean, optional: false },
            arrowLine: { type: Boolean, optional: false },
            borderColor: { type: String, optional: false },
            borderWidth: { type: Number, optional: false }
          };
        },
        name: "MpPolylineData"
      };
    }
    constructor(options, metadata = MpPolylineData.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.points = this.__props__.points;
      this.color = this.__props__.color;
      this.width = this.__props__.width;
      this.dottedLine = this.__props__.dottedLine;
      this.arrowLine = this.__props__.arrowLine;
      this.borderColor = this.__props__.borderColor;
      this.borderWidth = this.__props__.borderWidth;
      delete this.__props__;
    }
  }
  const _sfc_main$k = /* @__PURE__ */ vue.defineComponent({
    __name: "playBack",
    setup(__props, _a) {
      var __expose = _a.expose;
      __expose();
      const center = vue.reactive(new UTSJSONObject({
        latitude: 39.90469,
        longitude: 116.40717
      }));
      const mapScale = vue.ref(15);
      const imei = vue.ref("");
      const carStatus = vue.ref("");
      const plateNo = vue.ref("");
      const carType = vue.ref("");
      const showDateTimePicker = vue.ref(false);
      const currentPickerType = vue.ref("start");
      const pickerTitle = vue.ref("选择开始时间");
      const trackPoints = vue.ref([]);
      const polyline = vue.ref([]);
      const isPlaying = vue.ref(false);
      const isTrackPlayable = vue.ref(false);
      const playbackSpeed = vue.ref(5);
      const totalDistance = vue.ref(0);
      const currentSpeed = vue.ref(0);
      const currentTime = vue.ref("");
      const currentIndex = vue.ref(0);
      const carMarker = vue.ref(null);
      let playbackTimer = null;
      let lastTimestamp = 0;
      let replaySessionId = 0;
      const startTime = vue.ref("");
      const endTime = vue.ref("");
      const lat = vue.ref("");
      const lng = vue.ref("");
      const sTime = vue.ref("");
      const eTime = vue.ref("");
      const markers = vue.ref([]);
      function safeParseDate(dateStr) {
        if (!dateStr)
          return 0;
        const iosCompatibleStr = dateStr.replace(/-/g, "/");
        const date = new Date(iosCompatibleStr);
        if (isNaN(date.getTime())) {
          const isoStr = dateStr.replace(" ", "T");
          const isoDate = new Date(isoStr);
          if (!isNaN(isoDate.getTime())) {
            return isoDate.getTime();
          }
          return 0;
        }
        return date.getTime();
      }
      function normalizeDateTime(dateStr) {
        if (!dateStr)
          return "";
        let normalized = dateStr.replace(/-/g, "/");
        const parts = normalized.split(" ");
        if (parts.length < 2)
          return normalized;
        const timeParts = parts[1].split(":");
        if (timeParts.length == 2)
          normalized += ":00";
        return normalized;
      }
      function formatDateForDisplay(dateStr) {
        return normalizeDateTime(dateStr).replace(/\//g, "-");
      }
      function calculateBearing(lat1, lng1, lat2, lng2) {
        const degToRad = (d) => {
          return d * Math.PI / 180;
        };
        const radToDeg = (r) => {
          return r * 180 / Math.PI;
        };
        const φ1 = degToRad(lat1);
        const φ2 = degToRad(lat2);
        const Δλ = degToRad(lng2 - lng1);
        const y = Math.sin(Δλ) * Math.cos(φ2);
        const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
        const θ = Math.atan2(y, x);
        return (radToDeg(θ) + 360) % 360;
      }
      function getDistance(lat1, lng1, lat2, lng2) {
        const rad = (d) => {
          return d * Math.PI / 180;
        };
        const radLat1 = rad(lat1);
        const radLat2 = rad(lat2);
        const a = radLat1 - radLat2;
        const b = rad(lng1) - rad(lng2);
        const s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
        return s * 6378.137 * 1e3;
      }
      function calculateTrackBounds() {
        if (trackPoints.value.length == 0)
          return null;
        let minLat = trackPoints.value[0].latitude;
        let maxLat = trackPoints.value[0].latitude;
        let minLng = trackPoints.value[0].longitude;
        let maxLng = trackPoints.value[0].longitude;
        trackPoints.value.forEach((point) => {
          minLat = Math.min(minLat, point.latitude);
          maxLat = Math.max(maxLat, point.latitude);
          minLng = Math.min(minLng, point.longitude);
          maxLng = Math.max(maxLng, point.longitude);
        });
        return {
          minLat,
          maxLat,
          minLng,
          maxLng
        };
      }
      function adjustMapToFitTrack() {
        const nullableBounds = calculateTrackBounds();
        if (nullableBounds == null)
          return null;
        const bounds = nullableBounds;
        center.latitude = (bounds.minLat + bounds.maxLat) / 2;
        center.longitude = (bounds.minLng + bounds.maxLng) / 2;
        const latDiff = bounds.maxLat - bounds.minLat;
        const lngDiff = bounds.maxLng - bounds.minLng;
        const maxDiff = Math.max(latDiff, lngDiff);
        if (maxDiff > 0.1)
          mapScale.value = 10;
        else if (maxDiff > 0.05)
          mapScale.value = 12;
        else if (maxDiff > 0.02)
          mapScale.value = 15;
        else
          mapScale.value = 16;
      }
      function calculateTrackDistance() {
        totalDistance.value = 0;
        for (let i = 1; i < trackPoints.value.length; i++) {
          totalDistance.value += getDistance(trackPoints.value[i - 1].latitude, trackPoints.value[i - 1].longitude, trackPoints.value[i].latitude, trackPoints.value[i].longitude);
        }
      }
      function initDateTime() {
        const now = /* @__PURE__ */ new Date();
        const formatTime = (date) => {
          const month = (date.getMonth() + 1).toString().padStart(2, "0");
          const day = date.getDate().toString().padStart(2, "0");
          const hours = date.getHours().toString().padStart(2, "0");
          const minutes = date.getMinutes().toString().padStart(2, "0");
          const seconds = date.getSeconds().toString().padStart(2, "0");
          return "".concat(date.getFullYear(), "/").concat(month, "/").concat(day, " ").concat(hours, ":").concat(minutes, ":").concat(seconds);
        };
        endTime.value = formatTime(now);
        const startDate = new Date(now.getTime() - 36e5 * 24);
        startTime.value = formatTime(startDate);
      }
      function initCarMarker() {
        var _a2, _b;
        if (trackPoints.value.length == 0)
          return null;
        const firstPoint = trackPoints.value[0];
        const marker = {
          id: 999,
          latitude: firstPoint.latitude,
          longitude: firstPoint.longitude,
          iconPath: getDeviceIcon((_a2 = carStatus.value) !== null && _a2 !== void 0 ? _a2 : "", (_b = carType.value) !== null && _b !== void 0 ? _b : ""),
          width: 25,
          height: 25,
          rotate: firstPoint.rotation,
          anchor: { x: 0.5, y: 0.5 }
        };
        carMarker.value = marker;
        const startMarker = {
          id: 1e3,
          latitude: firstPoint.latitude,
          longitude: firstPoint.longitude,
          iconPath: "/static/start.png",
          width: 24,
          height: 24,
          anchor: { x: 0.5, y: 0.5 },
          callout: new UTSJSONObject({ content: "起点", borderRadius: 5, padding: 5, display: "BYCLICK" })
        };
        const lastPoint = trackPoints.value[trackPoints.value.length - 1];
        const endMarker = {
          id: 1001,
          latitude: lastPoint.latitude,
          longitude: lastPoint.longitude,
          iconPath: "/static/end.png",
          width: 24,
          height: 24,
          anchor: { x: 0.5, y: 0.5 },
          callout: new UTSJSONObject({ content: "终点", borderRadius: 5, padding: 5, display: "BYCLICK" })
        };
        markers.value = [marker, startMarker, endMarker];
      }
      function toMpPoints(points) {
        return points.map((point) => {
          return new MapPolylinePoint({
            latitude: point.latitude,
            longitude: point.longitude
          });
        });
      }
      function updatePolyline() {
        if (trackPoints.value.length < 2) {
          polyline.value = [];
          return null;
        }
        const lines = [];
        const unplayedPoints = trackPoints.value.slice(currentIndex.value);
        if (unplayedPoints.length >= 2) {
          lines.push(new MpPolylineData({
            points: toMpPoints(unplayedPoints),
            color: "#999999",
            width: 3,
            dottedLine: true,
            arrowLine: false,
            borderColor: "#FFFFFF",
            borderWidth: 1
          }));
        }
        if (currentIndex.value > 0) {
          lines.push(new MpPolylineData({
            points: toMpPoints(trackPoints.value.slice(0, currentIndex.value + 1)),
            color: "#1890FF",
            width: 6,
            dottedLine: false,
            arrowLine: true,
            borderColor: "#FFFFFF",
            borderWidth: 1
          }));
        }
        polyline.value = lines;
      }
      function initPolyline() {
        updatePolyline();
      }
      function updateCarPosition() {
        const marker = carMarker.value;
        if (marker != null && trackPoints.value.length > 0 && currentIndex.value < trackPoints.value.length) {
          const point = trackPoints.value[currentIndex.value];
          const updatedMarker = {
            id: marker.id,
            latitude: point.latitude,
            longitude: point.longitude,
            iconPath: marker.iconPath,
            width: marker.width,
            height: marker.height,
            rotate: point.rotation,
            anchor: marker.anchor,
            callout: marker.callout,
            label: marker.label
          };
          carMarker.value = updatedMarker;
          markers.value = [updatedMarker, ...markers.value.slice(1)];
          if (currentIndex.value % 5 == 0 || currentIndex.value == 0 || currentIndex.value == trackPoints.value.length - 1) {
            center.latitude = point.latitude;
            center.longitude = point.longitude;
          }
        }
      }
      function showPicker(type) {
        currentPickerType.value = type;
        pickerTitle.value = type == "start" ? "选择开始时间" : "选择结束时间";
        showDateTimePicker.value = true;
      }
      function showCurrentPosition() {
        var _a2, _b, _c, _d;
        isTrackPlayable.value = false;
        const originalLatText = (_a2 = lat.value) !== null && _a2 !== void 0 ? _a2 : "";
        const originalLngText = (_b = lng.value) !== null && _b !== void 0 ? _b : "";
        const originalLat = parseFloat(originalLatText);
        const originalLng = parseFloat(originalLngText);
        if (isNaN(originalLat) || isNaN(originalLng) || originalLat == 0 || originalLng == 0) {
          showAppToast({
            title: "这段时间没有数据",
            icon: "none",
            duration: 2e3
          });
          return null;
        }
        showAppToast({
          title: "这段时间没有数据",
          icon: "none",
          duration: 2e3
        });
        const convertedCoord = CoordTransform.wgs84ToTencent(originalLat, originalLng);
        center.latitude = convertedCoord.lat;
        center.longitude = convertedCoord.lng;
        mapScale.value = 15;
        const currentPoint = new TrackPoint(
          {
            latitude: convertedCoord.lat,
            longitude: convertedCoord.lng,
            rotation: 0,
            deviceTime: (/* @__PURE__ */ new Date()).toLocaleString(),
            speed: 0
          }
          // 初始化小车标记
        );
        const marker = {
          id: 999,
          latitude: currentPoint.latitude,
          longitude: currentPoint.longitude,
          iconPath: getDeviceIcon((_c = carStatus.value) !== null && _c !== void 0 ? _c : "", (_d = carType.value) !== null && _d !== void 0 ? _d : ""),
          width: 25,
          height: 25,
          rotate: 0,
          anchor: { x: 0.5, y: 0.5 }
        };
        carMarker.value = marker;
        markers.value = [marker];
      }
      function clearTrackDisplay() {
        trackPoints.value = [];
        isTrackPlayable.value = false;
        currentIndex.value = 0;
        currentSpeed.value = 0;
        currentTime.value = "";
        totalDistance.value = 0;
        carMarker.value = null;
        markers.value = [];
        polyline.value = [];
      }
      function pausePlayback() {
        isPlaying.value = false;
        const timer = playbackTimer;
        if (timer != null) {
          clearTimeout(timer);
          playbackTimer = null;
        }
      }
      function renderPlaybackIndex() {
        if (trackPoints.value.length == 0)
          return null;
        updateCarPosition();
        updatePolyline();
        const point = trackPoints.value[currentIndex.value];
        currentSpeed.value = point.speed;
        currentTime.value = point.deviceTime;
      }
      function processTrackData(positions) {
        const processedPoints = [];
        for (let i = 0; i < positions.length; i++) {
          const point = positions[i];
          const deviceTimeStr = point.getString("deviceTime", "");
          const originalLat = point.getNumber("latitude", 0);
          const originalLng = point.getNumber("longitude", 0);
          if (originalLat == 0 || originalLng == 0 || !isFinite(originalLat) || !isFinite(originalLng) || deviceTimeStr == "" || safeParseDate(deviceTimeStr) == 0) {
            continue;
          }
          const convertedCoord = CoordTransform.wgs84ToTencent(originalLat, originalLng);
          if (!isFinite(convertedCoord.lat) || !isFinite(convertedCoord.lng)) {
            continue;
          }
          processedPoints.push(new TrackPoint({
            latitude: convertedCoord.lat,
            longitude: convertedCoord.lng,
            rotation: 0,
            deviceTime: formatDateForDisplay(deviceTimeStr),
            speed: point.getNumber("speed", 0)
          }));
        }
        for (let i = 1; i < processedPoints.length; i++) {
          const previousPoint = processedPoints[i - 1];
          const currentPoint = processedPoints[i];
          currentPoint.rotation = calculateBearing(previousPoint.latitude, previousPoint.longitude, currentPoint.latitude, currentPoint.longitude);
        }
        if (processedPoints.length > 1) {
          processedPoints[processedPoints.length - 1].rotation = processedPoints[processedPoints.length - 2].rotation;
        }
        trackPoints.value = processedPoints;
        isTrackPlayable.value = processedPoints.length > 1;
        currentIndex.value = 0;
        calculateTrackDistance();
        initCarMarker();
        initPolyline();
        adjustMapToFitTrack();
        renderPlaybackIndex();
      }
      const loadTrackPos = () => {
        return __awaiter(this, void 0, void 0, function* () {
          var _a2, _b, _c;
          pausePlayback();
          const requestId = ++replaySessionId;
          clearTrackDisplay();
          uni.showLoading(new UTSJSONObject({ title: "加载中..." }));
          const data = new UTSJSONObject({
            imei: imei.value,
            startTime: startTime.value.replace(/\//g, "-"),
            endTime: endTime.value.replace(/\//g, "-"),
            minParkTime: 2,
            withStop: false,
            withPos: true,
            withTrip: false
          });
          try {
            const res = yield getTrackPos(data);
            if (requestId != replaySessionId)
              return Promise.resolve(null);
            const positions = (_a2 = res.data) === null || _a2 === void 0 ? null : _a2.getArray("positions");
            if (positions != null && positions.length > 0) {
              processTrackData(positions);
              if (trackPoints.value.length == 0) {
                showCurrentPosition();
              }
            } else {
              showCurrentPosition();
            }
          } catch (error) {
            if (requestId != replaySessionId)
              return Promise.resolve(null);
            uni.__log__("error", "at pages/playBack/playBack.uvue:631", "加载轨迹失败:", error);
            showAppToast({ title: "轨迹加载失败", icon: "none" });
            if (!isNaN(parseFloat((_b = lat.value) !== null && _b !== void 0 ? _b : "")) && !isNaN(parseFloat((_c = lng.value) !== null && _c !== void 0 ? _c : ""))) {
              showCurrentPosition();
            }
          } finally {
            if (requestId == replaySessionId) {
              uni.hideLoading();
            }
          }
        });
      };
      function resetPlayback() {
        pausePlayback();
        currentIndex.value = 0;
        renderPlaybackIndex();
      }
      function playNextPoint() {
        if (currentIndex.value >= trackPoints.value.length - 1) {
          pausePlayback();
          showAppToast({
            title: "轨迹回放完成",
            icon: "none",
            duration: 1500
          });
          return false;
        }
        currentIndex.value++;
        renderPlaybackIndex();
        return true;
      }
      function playbackStep(sessionId) {
        if (!isPlaying.value || sessionId != replaySessionId)
          return null;
        const now = Date.now();
        const elapsed = now - lastTimestamp;
        const interval = 1e3 / playbackSpeed.value;
        if (elapsed >= interval) {
          playNextPoint();
          lastTimestamp = now - elapsed % interval;
        }
        if (isPlaying.value && sessionId == replaySessionId) {
          playbackTimer = setTimeout(() => {
            playbackStep(sessionId);
          }, 16);
        }
      }
      function startPlayback() {
        if (!isTrackPlayable.value) {
          showAppToast({ title: "没有轨迹数据", icon: "none" });
          return null;
        }
        if (currentIndex.value >= trackPoints.value.length - 1) {
          resetPlayback();
        }
        isPlaying.value = true;
        const sessionId = ++replaySessionId;
        if (!playNextPoint())
          return null;
        lastTimestamp = Date.now();
        playbackStep(sessionId);
      }
      function togglePlayback() {
        if (isPlaying.value) {
          pausePlayback();
        } else {
          startPlayback();
        }
      }
      function onConfirm(value) {
        const formattedValue = normalizeDateTime(value);
        if (currentPickerType.value == "start") {
          startTime.value = formattedValue;
        } else {
          endTime.value = formattedValue;
        }
        resetPlayback();
        void loadTrackPos();
        showDateTimePicker.value = false;
      }
      function onCancel() {
        showDateTimePicker.value = false;
      }
      function setPlaybackSpeed(e) {
        const wasPlaying = isPlaying.value;
        if (wasPlaying) {
          pausePlayback();
        }
        playbackSpeed.value = e;
        if (wasPlaying) {
          startPlayback();
        }
      }
      vue.onLoad((option) => {
        var _a2, _b, _c, _d, _e, _f, _g, _h;
        imei.value = (_a2 = option.imei) !== null && _a2 !== void 0 ? _a2 : null;
        carStatus.value = (_b = option.connectionStatus) !== null && _b !== void 0 ? _b : "";
        plateNo.value = (_c = option.plateNo) !== null && _c !== void 0 ? _c : "";
        carType.value = (_d = option.carType) !== null && _d !== void 0 ? _d : "";
        lat.value = (_e = option.lat) !== null && _e !== void 0 ? _e : null;
        lng.value = (_f = option.lng) !== null && _f !== void 0 ? _f : null;
        sTime.value = (_g = option.startTime) !== null && _g !== void 0 ? _g : "";
        eTime.value = (_h = option.endTime) !== null && _h !== void 0 ? _h : "";
        uni.__log__("log", "at pages/playBack/playBack.uvue:750", sTime.value, eTime.value);
        if (sTime.value != "" && eTime.value != "") {
          startTime.value = normalizeDateTime(sTime.value);
          endTime.value = normalizeDateTime(eTime.value);
          loadTrackPos();
        } else {
          initDateTime();
          loadTrackPos();
        }
      });
      vue.onHide(() => {
        pausePlayback();
        ++replaySessionId;
      });
      vue.onUnload(() => {
        pausePlayback();
        ++replaySessionId;
      });
      const __returned__ = { center, mapScale, imei, carStatus, plateNo, carType, showDateTimePicker, currentPickerType, pickerTitle, trackPoints, polyline, isPlaying, isTrackPlayable, playbackSpeed, totalDistance, currentSpeed, currentTime, currentIndex, carMarker, get playbackTimer() {
        return playbackTimer;
      }, set playbackTimer(v = null) {
        playbackTimer = v;
      }, get lastTimestamp() {
        return lastTimestamp;
      }, set lastTimestamp(v) {
        lastTimestamp = v;
      }, get replaySessionId() {
        return replaySessionId;
      }, set replaySessionId(v) {
        replaySessionId = v;
      }, startTime, endTime, lat, lng, sTime, eTime, markers, safeParseDate, normalizeDateTime, formatDateForDisplay, calculateBearing, getDistance, calculateTrackBounds, adjustMapToFitTrack, calculateTrackDistance, initDateTime, initCarMarker, toMpPoints, updatePolyline, initPolyline, updateCarPosition, showPicker, showCurrentPosition, clearTrackDisplay, pausePlayback, renderPlaybackIndex, processTrackData, loadTrackPos, resetPlayback, playNextPoint, playbackStep, startPlayback, togglePlayback, onConfirm, onCancel, setPlaybackSpeed };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  const _style_0$k = { "container": { "": { "position": "relative", "width": "100%", "height": "100%", "display": "flex", "flexDirection": "column", "backgroundColor": "#f5f7fa" } }, "map-container": { ".container ": { "flexGrow": 1, "flexShrink": 1, "flexBasis": "0%", "width": "100%", "position": "relative" } }, "sub-nav-overlay": { ".container .map-container ": { "position": "absolute", "top": 0, "left": 0, "right": 0, "zIndex": 100 } }, "tools-panel": { ".container ": { "width": "100%", "backgroundColor": "#ffffff", "paddingTop": "50rpx", "paddingRight": "20rpx", "paddingBottom": "50rpx", "paddingLeft": "20rpx", "boxShadow": "0 -10rpx 20rpx rgba(0, 0, 0, 0.1)" } }, "Datetime-box": { ".container .tools-panel ": { "display": "flex", "flexDirection": "row", "justifyContent": "space-between", "alignItems": "center", "marginBottom": "30rpx" } }, "date-box": { ".container .tools-panel .Datetime-box ": { "display": "flex", "flexDirection": "row", "justifyContent": "center", "alignItems": "center" } }, "Date": { ".container .tools-panel .Datetime-box .date-box ": { "fontSize": "30rpx", "borderTopLeftRadius": "5rpx", "borderTopRightRadius": "5rpx", "borderBottomRightRadius": "5rpx", "borderBottomLeftRadius": "5rpx", "backgroundColor": "#f5f5f5", "paddingTop": 0, "paddingRight": "10rpx", "paddingBottom": 0, "paddingLeft": "10rpx" } }, "playbackdetail": { ".container .tools-panel .Datetime-box ": { "fontSize": "25rpx", "color": "#1890FF" } }, "tool-tag-item": { ".container .tools-panel ": { "paddingTop": "40rpx", "paddingRight": "20rpx", "paddingBottom": "40rpx", "paddingLeft": "20rpx", "display": "flex", "flexDirection": "row", "justifyContent": "space-between", "alignItems": "center" } }, "speed-label": { ".container .tools-panel .tool-tag-item ": { "borderTopWidth": "2rpx", "borderRightWidth": "2rpx", "borderBottomWidth": "2rpx", "borderLeftWidth": "2rpx", "borderTopStyle": "solid", "borderRightStyle": "solid", "borderBottomStyle": "solid", "borderLeftStyle": "solid", "borderTopColor": "#1890FF", "borderRightColor": "#1890FF", "borderBottomColor": "#1890FF", "borderLeftColor": "#1890FF", "fontSize": "25rpx", "color": "#1890FF", "paddingTop": "5rpx", "paddingRight": "15rpx", "paddingBottom": "5rpx", "paddingLeft": "15rpx", "borderTopLeftRadius": "30rpx", "borderTopRightRadius": "30rpx", "borderBottomRightRadius": "30rpx", "borderBottomLeftRadius": "30rpx", "marginLeft": "20rpx" } }, "slider": { ".container .tools-panel .tool-tag-item ": { "flexGrow": 1, "flexShrink": 1, "flexBasis": "0%", "paddingTop": 0, "paddingRight": "20rpx", "paddingBottom": 0, "paddingLeft": "30rpx", "overflow": "visible" } }, "play-btn": { ".container .tools-panel .tool-tag-item ": { "fontSize": "25rpx", "color": "#ffffff", "paddingTop": "10rpx", "paddingRight": "25rpx", "paddingBottom": "10rpx", "paddingLeft": "25rpx", "borderTopLeftRadius": "10rpx", "borderTopRightRadius": "10rpx", "borderBottomRightRadius": "10rpx", "borderBottomLeftRadius": "10rpx", "marginLeft": "20rpx", "backgroundColor": "#1890FF" } }, "play-back-info": { ".container .tools-panel ": { "display": "flex", "flexDirection": "row", "justifyContent": "space-between", "alignItems": "center", "paddingTop": "20rpx", "paddingRight": "20rpx", "paddingBottom": "20rpx", "paddingLeft": "20rpx", "marginTop": "20rpx", "backgroundColor": "#f9f9f9", "borderTopLeftRadius": "15rpx", "borderTopRightRadius": "15rpx", "borderBottomRightRadius": "15rpx", "borderBottomLeftRadius": "15rpx" } }, "item-info": { ".container .tools-panel .play-back-info ": { "display": "flex", "flexDirection": "column", "justifyContent": "center", "alignItems": "center" } }, "info-label": { ".container .tools-panel .play-back-info ": { "fontSize": "24rpx", "paddingTop": "10rpx", "paddingRight": 0, "paddingBottom": "10rpx", "paddingLeft": 0, "color": "#999999" } } };
  function _sfc_render$j(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_custom_navBar = resolveEasycom(vue.resolveDynamicComponent("custom-navBar"), __easycom_0$5);
    const _component_map = vue.resolveComponent("map");
    const _component_sub_navBar = resolveEasycom(vue.resolveDynamicComponent("sub-navBar"), __easycom_1$1);
    const _component_i_icon = resolveEasycom(vue.resolveDynamicComponent("i-icon"), __easycom_2$6);
    const _component_i_button = resolveEasycom(vue.resolveDynamicComponent("i-button"), __easycom_2$2);
    const _component_i_slider = resolveEasycom(vue.resolveDynamicComponent("i-slider"), __easycom_4);
    const _component_l_date_time_picker = resolveEasycom(vue.resolveDynamicComponent("l-date-time-picker"), __easycom_2$1);
    const _component_l_popup = resolveEasycom(vue.resolveDynamicComponent("l-popup"), __easycom_3);
    const _component_app_toast = resolveEasycom(vue.resolveDynamicComponent("app-toast"), __easycom_3$3);
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.createElementVNode("view", { class: "container" }, [
          vue.createVNode(_component_custom_navBar, {
            title: "轨迹回放",
            "show-back": true,
            backgroundColor: "#fff",
            textColor: "#333",
            showCapsule: false
          }),
          vue.createElementVNode("view", { class: "map-container" }, [
            vue.createVNode(_component_map, {
              id: "myMap",
              latitude: $setup.center.latitude,
              longitude: $setup.center.longitude,
              markers: $setup.markers,
              polyline: $setup.polyline,
              scale: $setup.mapScale,
              style: { "width": "100%", "height": "100%" },
              "show-location": true,
              "enable-traffic": true,
              "enable-overlooking": true,
              "enable-building": true,
              "enable-3D": true
            }, null, 8, ["latitude", "longitude", "markers", "polyline", "scale"]),
            vue.createVNode(_component_sub_navBar, {
              class: "sub-nav-overlay",
              showTime: false,
              currentCar: $setup.plateNo,
              showCar: true,
              carStatus: $setup.carStatus
            }, null, 8, ["currentCar", "carStatus"])
          ]),
          vue.createElementVNode("view", { class: "tools-panel" }, [
            vue.createElementVNode("view", { class: "Datetime-box" }, [
              vue.createElementVNode("view", { class: "date-box" }, [
                vue.createVNode(_component_i_icon, {
                  name: "/static/rili.png",
                  fontSize: "15"
                }),
                vue.createElementVNode(
                  "text",
                  {
                    class: "Date",
                    onClick: _cache[0] || (_cache[0] = ($event) => $setup.showPicker("start"))
                  },
                  vue.toDisplayString($setup.startTime),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("text", null, "至"),
                vue.createElementVNode(
                  "text",
                  {
                    class: "Date",
                    onClick: _cache[1] || (_cache[1] = ($event) => $setup.showPicker("end"))
                  },
                  vue.toDisplayString($setup.endTime),
                  1
                  /* TEXT */
                )
              ])
            ]),
            vue.createElementVNode("view", { class: "tool-tag-item" }, [
              vue.createVNode(_component_i_button, {
                type: "primary",
                onClick: $setup.togglePlayback,
                size: "small",
                text: $setup.isPlaying ? "暂停" : "播放"
              }, null, 8, ["text"]),
              vue.createElementVNode("view", { class: "slider" }, [
                vue.createVNode(_component_i_slider, {
                  modelValue: $setup.playbackSpeed,
                  "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.playbackSpeed = $event),
                  min: 1,
                  max: 50,
                  step: 5,
                  onChange: $setup.setPlaybackSpeed
                }, null, 8, ["modelValue"])
              ]),
              vue.createElementVNode(
                "text",
                { class: "speed-label" },
                vue.toDisplayString($setup.playbackSpeed) + "x",
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("view", { class: "play-back-info" }, [
              vue.createElementVNode("view", { class: "item-info" }, [
                vue.createElementVNode(
                  "text",
                  { class: "info-label" },
                  vue.toDisplayString($setup.currentTime),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("text", { class: "info-label" }, "时间")
              ]),
              vue.createElementVNode("view", { class: "item-info" }, [
                vue.createElementVNode(
                  "text",
                  { class: "info-label" },
                  vue.toDisplayString($setup.currentSpeed) + "Km/h",
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("text", { class: "info-label" }, "速度")
              ]),
              vue.createElementVNode("view", { class: "item-info" }, [
                vue.createElementVNode(
                  "text",
                  { class: "info-label" },
                  vue.toDisplayString(($setup.totalDistance / 1e3).toFixed(1)) + "Km",
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("text", { class: "info-label" }, "里程")
              ])
            ]),
            vue.createVNode(_component_l_popup, {
              modelValue: $setup.showDateTimePicker,
              "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $setup.showDateTimePicker = $event),
              position: "bottom",
              closeable: false
            }, {
              default: vue.withCtx(() => [
                vue.createVNode(_component_l_date_time_picker, {
                  "confirm-btn": "确认",
                  "cancel-btn": "取消",
                  title: $setup.pickerTitle,
                  mode: 63,
                  onConfirm: $setup.onConfirm,
                  onCancel: $setup.onCancel
                }, null, 8, ["title"])
              ]),
              _: 1
              /* STABLE */
            }, 8, ["modelValue"])
          ])
        ]),
        vue.createVNode(_component_app_toast)
      ],
      64
      /* STABLE_FRAGMENT */
    );
  }
  const PagesPlayBackPlayBack = /* @__PURE__ */ _export_sfc(_sfc_main$k, [["render", _sfc_render$j], ["styles", [_style_0$k]], ["__file", "/Users/xyhc/Documents/carConnectInternet/pages/playBack/playBack.uvue"]]);
  const _sfc_main$j = /* @__PURE__ */ vue.defineComponent({
    __name: "index",
    setup(__props, _a) {
      var __expose = _a.expose;
      __expose();
      const instance = vue.getCurrentInstance();
      const actionItems = vue.shallowRef([]);
      const description = vue.shallowRef("");
      const title = vue.shallowRef("");
      const cancelText = vue.shallowRef("");
      const align = vue.shallowRef("center");
      const bordered = vue.shallowRef(false);
      const closeable = vue.shallowRef(false);
      const overlay = vue.shallowRef(true);
      const rowCol = vue.ref(null);
      const innerValue = vue.ref(false);
      let selected = vue.ref(-1);
      let parentKey = vue.ref("action-sheet-1");
      vue.onLoad((options) => {
        var _a2, _b, _c, _d, _e, _f, _g, _h, _j;
        const param = UTS.JSON.parseObject("".concat((_a2 = options["param"]) !== null && _a2 !== void 0 ? _a2 : "{}"));
        parentKey.value = (_b = param.getString("key")) !== null && _b !== void 0 ? _b : "action-sheet-1";
        description.value = (_c = param.getString("description")) !== null && _c !== void 0 ? _c : "";
        title.value = (_d = param.getString("title")) !== null && _d !== void 0 ? _d : "";
        cancelText.value = (_e = param.getString("cancelText")) !== null && _e !== void 0 ? _e : "";
        align.value = (_f = param.getString("align")) !== null && _f !== void 0 ? _f : "center";
        bordered.value = (_g = param.getBoolean("bordered")) !== null && _g !== void 0 ? _g : false;
        closeable.value = (_h = param.getBoolean("closeable")) !== null && _h !== void 0 ? _h : true;
        rowCol.value = param.getArray("rowCol");
        const list = param.getArray("list");
        const isImage = (name = null) => {
          if (name == null)
            return false;
          return /\.(jpe?g|png|gif|bmp|webp|tiff?)$/i.test(name) || /^data:image\/(jpeg|png|gif|bmp|webp|tiff);base64,/.test(name);
        };
        actionItems.value = (_j = list === null || list === void 0 ? null : list.map((it, index) => {
          var _a3, _b2, _c2;
          return {
            label: (_a3 = it.getString("label")) !== null && _a3 !== void 0 ? _a3 : "",
            color: it.getString("color"),
            icon: it.getString("icon"),
            iconColor: it.getString("iconColor"),
            bgColor: it.getString("bgColor"),
            fontSize: (_b2 = it.getString("fontSize")) !== null && _b2 !== void 0 ? _b2 : "32rpx",
            disabled: (_c2 = it.getBoolean("disabled")) !== null && _c2 !== void 0 ? _c2 : false,
            radius: it.getString("radius"),
            __index: index,
            __isImage: isImage(it.getString("icon"))
          };
        })) !== null && _j !== void 0 ? _j : [];
        vue.nextTick(() => {
          innerValue.value = true;
        });
      });
      const actionRowCols = vue.computed(() => {
        const result = [];
        const _rowCol = rowCol.value;
        if (_rowCol == null)
          return result;
        const list = [...actionItems.value];
        const rows = _rowCol.length;
        for (let i = 0; i < rows; i++) {
          let cols = _rowCol[i];
          const row = [];
          while (cols > 0 && list.length > 0) {
            const item = UTS.arrayShift(list);
            cols--;
            row.push(item);
          }
          if (row.length > 0) {
            result.push(row);
          }
        }
        if (list.length > 0) {
          result.push(list);
        }
        return result;
      });
      const handleSelected = (item) => {
        if (item.disabled)
          return null;
        innerValue.value = false;
        selected.value = item.__index;
      };
      const handleCancel = () => {
        innerValue.value = false;
        selected.value = -1;
      };
      const onClose = () => {
        uni.closeDialogPage(new UTSJSONObject({
          dialogPage: instance.proxy.$page,
          fail(err) {
            uni.__log__("log", "at uni_modules/lime-action-sheet/pages/index.uvue:189", "err", err);
          }
        }));
        uni.$emit(parentKey.value, selected.value);
      };
      const __returned__ = { instance, actionItems, description, title, cancelText, align, bordered, closeable, overlay, rowCol, innerValue, get selected() {
        return selected;
      }, set selected(v) {
        selected = v;
      }, get parentKey() {
        return parentKey;
      }, set parentKey(v) {
        parentKey = v;
      }, actionRowCols, handleSelected, handleCancel, onClose };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  const _style_0$j = { "l-action-sheet": { "": { "borderTopLeftRadius": "var(--l-action-sheet-border-radius, 9px)", "borderTopRightRadius": "var(--l-action-sheet-border-radius, 9px)" } }, "l-action-sheet__item": { "": { "height": "var(--l-action-sheet-item-height, 56px)", "justifyContent": "center", "alignItems": "center", "flexDirection": "row", "paddingTop": 0, "paddingRight": 16, "paddingBottom": 0, "paddingLeft": 16 } }, "l-action-sheet__item-text": { "": { "color": "var(--l-action-sheet-color, #000000E0)", "fontSize": "var(--l-action-sheet-font-size, 16px)", "marginLeft": 8, "marginRight": 8 } }, "l-action-sheet__item-icon": { "": { "color": "var(--l-action-sheet-color, #000000E0)", "fontSize": "var(--l-action-sheet-font-size, 16px)" } }, "l-action-sheet__item--hover": { "": { "backgroundColor": "var(--l-action-sheet-hover-color, #e7e7e7)" } }, "l-action-sheet__item--left": { "": { "justifyContent": "flex-start" } }, "l-action-sheet__item--disabled": { "": { "opacity": 0.5 } }, "l-action-sheet__item--bordered": { "": { "borderBottomWidth": 0.5, "borderBottomStyle": "solid", "borderBottomColor": "var(--l-action-sheet-border-color, #e7e7e7)" } }, "l-action-sheet__gap": { "": { "height": "var(--l-action-sheet-gap-height, 8px)", "backgroundColor": "var(--l-action-sheet-gap-color, #f3f3f3)" } }, "l-action-sheet__cancel": { "": { "display": "flex", "backgroundColor": "var(--l-action-sheet-cancel-bg-color, #fff)", "height": "var(--l-action-sheet-cancel-height, 48px)", "justifyContent": "center", "alignItems": "center", "boxSizing": "content-box" } }, "l-action-sheet__cancel--hover": { "": { "backgroundColor": "var(--l-action-sheet-hover-color, #e7e7e7)" } }, "l-action-sheet__cancel-text": { "": { "color": "var(--l-action-sheet-cancel-color, #000000E0)", "fontSize": "var(--l-action-sheet-font-size, 16px)" } }, "l-action-sheet__title": { "": { "display": "flex", "alignItems": "center", "justifyContent": "center", "boxSizing": "content-box", "paddingTop": "var(--l-action-sheet-title-padding, 16px)", "paddingRight": "var(--l-action-sheet-title-padding, 16px)", "paddingBottom": "var(--l-action-sheet-title-padding, 16px)", "paddingLeft": "var(--l-action-sheet-title-padding, 16px)", "position": "relative" } }, "l-action-sheet__title-text": { "": { "fontSize": "var(--l-action-sheet-title-font-size, 18px)", "fontWeight": "var(--l-action-sheet-title-font-weight, 700)", "color": "var(--l-action-sheet-title-color, #000000E0)" } }, "l-action-sheet__close-btn": { "": { "fontFamily": "l", "position": "absolute", "top": "var(--l-action-sheet-close-btn-spacing, 16px)", "right": "var(--l-action-sheet-close-btn-spacing, 16px)", "fontSize": "var(--l-action-sheet-close-btn-font-size, 20px)", "color": "var(--l-action-sheet-close-btn-color, #000000E0)" } }, "l-action-sheet__description": { "": { "color": "var(--l-action-sheet-description-color, #00000073)", "lineHeight": "var(--l-action-sheet-description-line-height, 22px)", "fontSize": "var(--l-action-sheet-description-font-size, 14px)", "textAlign": "var(--l-action-sheet-text-align, center)", "paddingTop": "var(--l-action-sheet-description-padding-y, 12px)", "paddingRight": "var(--l-action-sheet-description-padding-x, 16px)", "paddingBottom": "var(--l-action-sheet-description-padding-y, 12px)", "paddingLeft": "var(--l-action-sheet-description-padding-x, 16px)", "borderBottomWidth": 0.5, "borderBottomStyle": "solid", "borderBottomColor": "var(--l-action-sheet-border-color, #e7e7e7)" } }, "l-action-sheet__description--left": { "": { "textAlign": "left" } }, "l-action-sheet__wrap": { "": { "display": "flex", "paddingTop": 16, "paddingBottom": 16, "flexDirection": "row", "flexWrap": "nowrap" } }, "l-action-sheet__row": { "": { "paddingTop": 16, "paddingBottom": 16, "flexDirection": "row" } }, "l-action-sheet__row--border": { "": { "borderTopWidth": 0.8, "borderTopStyle": "solid", "borderTopColor": "var(--l-action-sheet-border-color, #e7e7e7)" } }, "l-action-sheet__col": { "": { "justifyContent": "center", "alignItems": "center" } }, "l-action-sheet__col--evenly": { "": { "flexGrow": 1, "flexShrink": 1, "flexBasis": "0%" } }, "l-action-sheet__col-text": { "": { "color": "var(--l-action-sheet-color, #000000E0)", "paddingTop": "var(--l-action-sheet-col-text-padding, 12px)", "fontSize": "var(--l-action-sheet-col-font-size, 12px)" } }, "l-action-sheet__col-icon": { "": { "fontSize": "var(--l-action-sheet-icon-size, 24px)", "color": "var(--l-action-sheet-color, #000000E0)" } }, "l-action-sheet__image": { "": { "width": "var(--l-action-sheet-image-size, 48px)", "height": "var(--l-action-sheet-image-size, 48px)", "marginTop": 0, "marginRight": 16, "marginBottom": 0, "marginLeft": 16, "backgroundColor": "var(--l-action-sheet-image-bg-color, #0000000A)", "borderTopLeftRadius": 99, "borderTopRightRadius": 99, "borderBottomRightRadius": 99, "borderBottomLeftRadius": 99 } }, "l-action-sheet__image--center": { "": { "justifyContent": "center", "alignItems": "center" } } };
  function _sfc_render$i(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_l_icon = vue.resolveComponent("l-icon");
    const _component_l_popup = resolveEasycom(vue.resolveDynamicComponent("l-popup"), __easycom_3);
    return vue.openBlock(), vue.createBlock(_component_l_popup, {
      modelValue: $setup.innerValue,
      "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.innerValue = $event),
      position: "bottom",
      onClosed: $setup.onClose
    }, {
      default: vue.withCtx(() => [
        vue.createElementVNode("view", { class: "l-action-sheet" }, [
          $setup.title.length > 0 || _ctx.$slots["title"] != null ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "l-action-sheet__title"
          }, [
            vue.renderSlot(_ctx.$slots, "title"),
            $setup.title.length > 0 ? (vue.openBlock(), vue.createElementBlock(
              "text",
              {
                key: 0,
                class: "l-action-sheet__title-text"
              },
              vue.toDisplayString($setup.title),
              1
              /* TEXT */
            )) : vue.createCommentVNode("v-if", true),
            $setup.closeable ? (vue.openBlock(), vue.createElementBlock("text", {
              key: 1,
              class: "l-action-sheet__close-btn",
              onClick: $setup.handleCancel
            }, "")) : vue.createCommentVNode("v-if", true)
          ])) : vue.createCommentVNode("v-if", true),
          vue.renderSlot(_ctx.$slots, "description", {}, () => [
            $setup.description.length > 0 ? (vue.openBlock(), vue.createElementBlock(
              "text",
              {
                key: 0,
                class: vue.normalizeClass(["l-action-sheet__description", { "l-action-sheet__description--left": $setup.align == "left" }])
              },
              vue.toDisplayString($setup.description),
              3
              /* TEXT, CLASS */
            )) : vue.createCommentVNode("v-if", true)
          ]),
          vue.createElementVNode("view", { class: "l-action-sheet__content" }, [
            $setup.rowCol == null ? (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              { key: 0 },
              vue.renderList($setup.actionItems, (item, index) => {
                var _a;
                return vue.openBlock(), vue.createElementBlock("view", {
                  class: vue.normalizeClass(["l-action-sheet__item", {
                    "l-action-sheet__item--left": $setup.align == "left",
                    "l-action-sheet__item--bordered": $setup.bordered && index != $setup.actionItems.length - 1,
                    "l-action-sheet__item--disabled": item.disabled
                  }]),
                  "hover-class": !item.disabled ? "l-action-sheet__item--hover" : "",
                  onClick: ($event) => $setup.handleSelected(item),
                  key: index
                }, [
                  item.icon != null ? (vue.openBlock(), vue.createBlock(_component_l_icon, {
                    key: 0,
                    class: "l-action-sheet__item-icon",
                    color: (_a = item.iconColor) != null ? _a : item.color,
                    size: item.fontSize,
                    name: item.icon
                  }, null, 8, ["color", "size", "name"])) : vue.createCommentVNode("v-if", true),
                  vue.createElementVNode(
                    "text",
                    {
                      class: "l-action-sheet__item-text",
                      style: vue.normalizeStyle([
                        item.color != null ? "color:" + item.color : "",
                        item.fontSize != null ? "font-size:" + item.fontSize : ""
                      ])
                    },
                    vue.toDisplayString(item.label),
                    5
                    /* TEXT, STYLE */
                  )
                ], 10, ["hover-class", "onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            )) : (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              { key: 1 },
              vue.renderList($setup.actionRowCols, (row, rowIndex) => {
                return vue.openBlock(), vue.createElementBlock(
                  "scroll-view",
                  {
                    class: vue.normalizeClass(["l-action-sheet__row", {
                      "l-action-sheet__row--border": rowIndex > 0 && rowIndex < $setup.actionRowCols.length
                    }]),
                    "scroll-x": true,
                    direction: "horizontal",
                    "show-scrollbar": false,
                    "scroll-with-animation": true,
                    key: "row" + rowIndex
                  },
                  [
                    (vue.openBlock(true), vue.createElementBlock(
                      vue.Fragment,
                      null,
                      vue.renderList(row, (item, colIndex) => {
                        var _a, _b;
                        return vue.openBlock(), vue.createElementBlock("view", {
                          class: vue.normalizeClass(["l-action-sheet__col", {
                            "l-action-sheet__item--disabled": item.disabled,
                            "l-action-sheet__col--evenly": !(row.length > 4)
                          }]),
                          onClick: ($event) => $setup.handleSelected(item),
                          key: colIndex
                        }, [
                          item.icon != null && item.__isImage ? (vue.openBlock(), vue.createElementBlock("image", {
                            key: 0,
                            class: "l-action-sheet__image",
                            style: vue.normalizeStyle([
                              "background: transparent",
                              item.radius != null ? "border-radius:" + item.radius : ""
                            ]),
                            src: item.icon
                          }, null, 12, ["src"])) : item.icon != null ? (vue.openBlock(), vue.createElementBlock(
                            "view",
                            {
                              key: 1,
                              class: "l-action-sheet__image l-action-sheet__image--center",
                              style: vue.normalizeStyle([
                                item.bgColor != null ? "background:" + item.bgColor : "",
                                item.radius != null ? "border-radius:" + item.radius : ""
                              ])
                            },
                            [
                              vue.createVNode(_component_l_icon, {
                                class: "l-action-sheet__col-icon",
                                color: (_a = item.iconColor) != null ? _a : item.color,
                                size: (_b = item.fontSize) != null ? _b : "48rpx",
                                name: item.icon
                              }, null, 8, ["color", "size", "name"])
                            ],
                            4
                            /* STYLE */
                          )) : vue.createCommentVNode("v-if", true),
                          vue.createElementVNode(
                            "text",
                            {
                              class: "l-action-sheet__col-text",
                              style: vue.normalizeStyle([
                                item.color != null ? "color:" + item.color : "",
                                item.fontSize != null ? "font-size:" + item.fontSize : ""
                              ])
                            },
                            vue.toDisplayString(item.label),
                            5
                            /* TEXT, STYLE */
                          )
                        ], 10, ["onClick"]);
                      }),
                      128
                      /* KEYED_FRAGMENT */
                    ))
                  ],
                  2
                  /* CLASS */
                );
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ]),
          $setup.cancelText.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "l-action-sheet__gap"
          })) : vue.createCommentVNode("v-if", true),
          $setup.cancelText.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 2,
            class: "l-action-sheet__cancel",
            "hover-class": "l-action-sheet__cancel--hover",
            onClick: $setup.handleCancel
          }, [
            vue.createElementVNode(
              "text",
              { class: "l-action-sheet__cancel-text" },
              vue.toDisplayString($setup.cancelText),
              1
              /* TEXT */
            )
          ])) : vue.createCommentVNode("v-if", true)
        ])
      ]),
      _: 3
      /* FORWARDED */
    }, 8, ["modelValue"]);
  }
  const UniModulesLimeActionSheetPagesIndex = /* @__PURE__ */ _export_sfc(_sfc_main$j, [["render", _sfc_render$i], ["styles", [_style_0$j]], ["__file", "/Users/xyhc/Documents/carConnectInternet/uni_modules/lime-action-sheet/pages/index.uvue"]]);
  class CoordinatePoint extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            latitude: { type: Number, optional: false },
            longitude: { type: Number, optional: false }
          };
        },
        name: "CoordinatePoint"
      };
    }
    constructor(options, metadata = CoordinatePoint.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.latitude = this.__props__.latitude;
      this.longitude = this.__props__.longitude;
      delete this.__props__;
    }
  }
  class AnimationQueueItem extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            position: { type: CoordinatePoint, optional: false },
            rotation: { type: Number, optional: false },
            speed: { type: Number, optional: false },
            address: { type: String, optional: false },
            connectionStatus: { type: String, optional: false }
          };
        },
        name: "AnimationQueueItem"
      };
    }
    constructor(options, metadata = AnimationQueueItem.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.position = this.__props__.position;
      this.rotation = this.__props__.rotation;
      this.speed = this.__props__.speed;
      this.address = this.__props__.address;
      this.connectionStatus = this.__props__.connectionStatus;
      delete this.__props__;
    }
  }
  const MARKER_UPDATE_INTERVAL = 100;
  const _sfc_main$i = /* @__PURE__ */ vue.defineComponent({
    __name: "vehicleTracking",
    setup(__props, _a) {
      var __expose = _a.expose;
      __expose();
      const imei = vue.ref("");
      const connectionStatus = vue.ref("");
      const deviceId = vue.ref("");
      const deptId = vue.ref("");
      const carType = vue.ref("");
      const center = vue.reactive(new UTSJSONObject({
        latitude: 39.90469,
        longitude: 116.40717
      }));
      const mapScale = vue.ref(15);
      const isAnimating = vue.ref(false);
      const animationTimer = vue.ref(null);
      const currentPosition = vue.reactive(new CoordinatePoint({
        latitude: 39.90469,
        longitude: 116.40717
      }));
      const targetPosition = vue.reactive(new CoordinatePoint({
        latitude: 39.90469,
        longitude: 116.40717
      }));
      const currentRotation = vue.ref(0);
      const targetRotation = vue.ref(0);
      const animationQueue = vue.ref([]);
      const isProcessingQueue = vue.ref(false);
      const markers = vue.ref([]);
      const markerInitialized = vue.ref(false);
      let lastIconPath = "";
      let lastMarkerUpdateTime = 0;
      const isTracking = vue.ref(false);
      const trackingInterval = vue.ref(null);
      const lastDirection = vue.ref(0);
      const currentSpeed = vue.ref(0);
      const currentAddress = vue.ref("获取中...");
      const currentTime = vue.ref("1s");
      const currentCar = vue.ref("京A12345");
      const times = vue.ref([
        [
          new UTSJSONObject({ label: "1s", value: "1" }),
          new UTSJSONObject({ label: "5s", value: "5" }),
          new UTSJSONObject({ label: "10s", value: "10" }),
          new UTSJSONObject({ label: "20s", value: "20" })
        ]
      ]);
      function handleCurrentTimeUpdate(value) {
        currentTime.value = value;
      }
      function createVehicleMarker(iconPath) {
        return {
          id: 1,
          latitude: currentPosition.latitude,
          longitude: currentPosition.longitude,
          iconPath,
          width: 25,
          height: 25,
          rotate: currentRotation.value,
          anchor: { x: 0.5, y: 0.5 },
          alpha: 1
        };
      }
      function loadInitialPosition() {
        return __awaiter(this, void 0, void 0, function* () {
          try {
            const data = new UTSJSONObject({
              deptId: deptId.value,
              deviceids: imei.value
            });
            const res = yield getDevicePos(data);
            if ((res === null || res === void 0 ? null : res.code) == 0 && res.data && res.data.length > 0) {
              let foundDevice = false;
              res.data.forEach((item) => {
                const itemImei = item.getString("imei", "");
                if (itemImei == imei.value) {
                  foundDevice = true;
                  const latitude = item.getNumber("latitude", 0);
                  const longitude = item.getNumber("longitude", 0);
                  if (latitude == 0 || longitude == 0) {
                    showAppToast({
                      title: "位置信息缺失",
                      icon: "none"
                    });
                    return null;
                  }
                  const direction = item.getNumber("direction", 0);
                  const speed = item.getNumber("speed", 0);
                  const positionUpdateTime = item.getString("positionUpdateTime", "定位时间未知");
                  const status = item.getString("connectionStatus", "unknown");
                  const convertedCoord = CoordTransform.wgs84ToTencent(latitude, longitude);
                  currentPosition.latitude = convertedCoord.lat;
                  currentPosition.longitude = convertedCoord.lng;
                  targetPosition.latitude = convertedCoord.lat;
                  targetPosition.longitude = convertedCoord.lng;
                  center.latitude = convertedCoord.lat;
                  center.longitude = convertedCoord.lng;
                  lastDirection.value = direction;
                  let initialRotation = lastDirection.value % 360;
                  if (initialRotation < 0) {
                    initialRotation += 360;
                  }
                  currentRotation.value = initialRotation;
                  targetRotation.value = currentRotation.value;
                  currentSpeed.value = speed;
                  currentAddress.value = positionUpdateTime;
                  connectionStatus.value = status;
                  if (!markerInitialized.value) {
                    const iconPath = getDeviceIcon(connectionStatus.value, carType.value);
                    lastIconPath = iconPath;
                    markers.value = [createVehicleMarker(iconPath)];
                    markerInitialized.value = true;
                  }
                }
              });
              if (!foundDevice) {
                showAppToast({
                  title: "未找到车辆设备",
                  icon: "none"
                });
              }
            } else {
              showAppToast({
                title: "获取位置失败",
                icon: "none"
              });
            }
          } catch (err) {
            uni.__log__("error", "at pages/vehicleTracking/vehicleTracking.uvue:210", "获取初始位置失败:", err);
            showAppToast({
              title: "网络请求失败",
              icon: "none"
            });
          }
        });
      }
      function initMarker() {
        if (markerInitialized.value) {
          return null;
        }
        const iconPath = getDeviceIcon(connectionStatus.value, carType.value);
        lastIconPath = iconPath;
        const marker = createVehicleMarker(iconPath);
        markers.value = [marker];
        markerInitialized.value = true;
        uni.__log__("log", "at pages/vehicleTracking/vehicleTracking.uvue:231", "初始化标记点完成");
      }
      function calculateMapRotation(direction) {
        let rotation = direction;
        if (rotation >= 360)
          rotation -= 360;
        if (rotation < 0)
          rotation += 360;
        return rotation;
      }
      function normalizeRotation(rotation) {
        let normalized = rotation % 360;
        if (normalized < 0) {
          normalized += 360;
        }
        return normalized;
      }
      vue.onLoad((option) => {
        var _a2, _b, _c, _d, _e;
        uni.__log__("log", "at pages/vehicleTracking/vehicleTracking.uvue:252", "option", option);
        connectionStatus.value = (_a2 = option.connectionStatus) !== null && _a2 !== void 0 ? _a2 : "";
        imei.value = (_b = option.imei) !== null && _b !== void 0 ? _b : "";
        currentCar.value = (_c = option.plateNo) !== null && _c !== void 0 ? _c : "未知车辆";
        deptId.value = (_d = option.deptId) !== null && _d !== void 0 ? _d : "";
        carType.value = (_e = option.carType) !== null && _e !== void 0 ? _e : "";
        loadInitialPosition();
      });
      const calculateDistance = (lat1, lng1, lat2, lng2) => {
        const R = 6371e3;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
      };
      const calculateRealisticAnimationDuration = (distance, speedKmh) => {
        if (speedKmh <= 0 || distance <= 0) {
          return 2e3;
        }
        const speedMs = speedKmh / 3.6;
        const realTimeSeconds = distance / speedMs;
        let duration = realTimeSeconds * 1e3;
        if (duration < 1e3)
          duration = 1e3;
        if (duration > 15e3)
          duration = 15e3;
        if (speedKmh < 10 && duration < 3e3) {
          duration = 3e3;
        }
        return duration;
      };
      function calculateShortestRotation(from, to) {
        let diff = to - from;
        if (diff > 180) {
          diff -= 360;
        } else if (diff < -180) {
          diff += 360;
        }
        return diff;
      }
      const updateMarkerSmooth = () => {
        if (markers.value.length == 0) {
          initMarker();
          return null;
        }
        const newIconPath = getDeviceIcon(connectionStatus.value, carType.value);
        const needUpdateIcon = newIconPath != lastIconPath;
        const updatedMarker = createVehicleMarker(needUpdateIcon ? newIconPath : lastIconPath);
        markers.value = [updatedMarker];
        if (needUpdateIcon) {
          lastIconPath = newIconPath;
        }
      };
      const startPositionAnimation = (duration, onComplete) => {
        if (isAnimating.value && animationTimer.value != null) {
          clearInterval(animationTimer.value);
        }
        isAnimating.value = true;
        const startTime = Date.now();
        const startLat = currentPosition.latitude;
        const startLng = currentPosition.longitude;
        const startRot = currentRotation.value;
        const latDiff = targetPosition.latitude - startLat;
        const lngDiff = targetPosition.longitude - startLng;
        const rotDiff = calculateShortestRotation(startRot, targetRotation.value);
        const interval = 30;
        let lastMarkerUpdate = startTime;
        animationTimer.value = setInterval(() => {
          const now = Date.now();
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const linearProgress = progress;
          currentPosition.latitude = startLat + latDiff * linearProgress;
          currentPosition.longitude = startLng + lngDiff * linearProgress;
          currentRotation.value = normalizeRotation(startRot + rotDiff * linearProgress);
          center.latitude = currentPosition.latitude;
          center.longitude = currentPosition.longitude;
          if (now - lastMarkerUpdate >= MARKER_UPDATE_INTERVAL || progress >= 1) {
            updateMarkerSmooth();
            lastMarkerUpdate = now;
          }
          if (progress >= 1) {
            clearInterval(animationTimer.value);
            animationTimer.value = null;
            isAnimating.value = false;
            currentPosition.latitude = targetPosition.latitude;
            currentPosition.longitude = targetPosition.longitude;
            currentRotation.value = normalizeRotation(targetRotation.value);
            updateMarkerSmooth();
            onComplete();
          }
        }, interval);
      };
      function processAnimationQueue() {
        if (animationQueue.value.length == 0) {
          isProcessingQueue.value = false;
          return null;
        }
        isProcessingQueue.value = true;
        const nextAnimation = animationQueue.value[0];
        animationQueue.value.splice(0, 1);
        targetPosition.latitude = nextAnimation.position.latitude;
        targetPosition.longitude = nextAnimation.position.longitude;
        targetRotation.value = nextAnimation.rotation;
        currentSpeed.value = nextAnimation.speed;
        currentAddress.value = nextAnimation.address;
        connectionStatus.value = nextAnimation.connectionStatus;
        const distance = calculateDistance(currentPosition.latitude, currentPosition.longitude, targetPosition.latitude, targetPosition.longitude);
        const animationDuration = calculateRealisticAnimationDuration(distance, currentSpeed.value);
        startPositionAnimation(animationDuration, () => {
          isProcessingQueue.value = false;
          if (animationQueue.value.length > 0) {
            setTimeout(() => {
              processAnimationQueue();
            }, 50);
          }
        });
      }
      const addToAnimationQueue = (animationData) => {
        if (animationQueue.value.length > 2) {
          animationQueue.value = animationQueue.value.slice(-1);
        }
        animationQueue.value.push(animationData);
        if (!isProcessingQueue.value && !isAnimating.value) {
          processAnimationQueue();
        }
      };
      const loadTrackData = () => {
        return __awaiter(this, void 0, void 0, function* () {
          try {
            const data = new UTSJSONObject({
              deptId: deptId.value,
              deviceids: imei.value
            });
            const res = yield getDevicePos(data);
            uni.__log__("log", "at pages/vehicleTracking/vehicleTracking.uvue:448", "222222");
            if ((res === null || res === void 0 ? null : res.code) == 0 && res.data && res.data.length > 0) {
              const deviceData = UTS.arrayFind(res.data, (item) => {
                return item.getString("imei", "") == imei.value;
              });
              if (deviceData != null) {
                const latitude = deviceData.getNumber("latitude", 0);
                const longitude = deviceData.getNumber("longitude", 0);
                const speed = deviceData.getNumber("speed", 0);
                const address = deviceData.getString("positionUpdateTime", "未知位置");
                const status = deviceData.getString("connectionStatus", "unknown");
                const direction = deviceData.getNumber("direction", lastDirection.value);
                const convertedCoord = CoordTransform.wgs84ToTencent(latitude, longitude);
                const newDirection = direction;
                const animationData = new AnimationQueueItem({
                  position: new CoordinatePoint({
                    latitude: convertedCoord.lat,
                    longitude: convertedCoord.lng
                  }),
                  rotation: normalizeRotation(calculateMapRotation(newDirection)),
                  speed,
                  address,
                  connectionStatus: status
                });
                addToAnimationQueue(animationData);
                lastDirection.value = newDirection;
              }
            }
          } catch (err) {
            uni.__log__("error", "at pages/vehicleTracking/vehicleTracking.uvue:477", "获取跟踪位置失败:", err);
          }
        });
      };
      function stopTracking() {
        isTracking.value = false;
        if (trackingInterval.value != null) {
          clearInterval(trackingInterval.value);
          trackingInterval.value = null;
        }
        animationQueue.value = [];
        isProcessingQueue.value = false;
        if (animationTimer.value != null) {
          clearInterval(animationTimer.value);
          animationTimer.value = null;
        }
        isAnimating.value = false;
        showAppToast({
          title: "停止跟踪",
          icon: "success",
          duration: 1500
        });
      }
      function startTracking() {
        if (!markerInitialized.value) {
          initMarker();
        }
        animationQueue.value = [];
        isProcessingQueue.value = false;
        const interval = 3e3;
        isTracking.value = true;
        if (trackingInterval.value != null) {
          clearInterval(trackingInterval.value);
        }
        loadTrackData();
        trackingInterval.value = setInterval(() => {
          loadTrackData();
        }, interval);
        showAppToast({
          title: "开始跟踪",
          icon: "success",
          duration: 1500
        });
      }
      const toggleTracking = () => {
        if (isTracking.value) {
          stopTracking();
        } else {
          startTracking();
        }
      };
      vue.onHide(() => {
        uni.__log__("log", "at pages/vehicleTracking/vehicleTracking.uvue:552", "页面隐藏时停止自动刷新");
        isTracking.value = false;
        if (trackingInterval.value != null) {
          clearInterval(trackingInterval.value);
          trackingInterval.value = null;
        }
        animationQueue.value = [];
        isProcessingQueue.value = false;
        if (animationTimer.value != null) {
          clearInterval(animationTimer.value);
          animationTimer.value = null;
        }
        isAnimating.value = false;
      });
      vue.onUnmounted(() => {
        uni.__log__("log", "at pages/vehicleTracking/vehicleTracking.uvue:573", "页面卸载时停止自动刷新");
        isTracking.value = false;
        if (trackingInterval.value != null) {
          clearInterval(trackingInterval.value);
          trackingInterval.value = null;
        }
        animationQueue.value = [];
        isProcessingQueue.value = false;
        if (animationTimer.value != null) {
          clearInterval(animationTimer.value);
          animationTimer.value = null;
        }
        isAnimating.value = false;
      });
      const __returned__ = { imei, connectionStatus, deviceId, deptId, carType, center, mapScale, isAnimating, animationTimer, currentPosition, targetPosition, currentRotation, targetRotation, animationQueue, isProcessingQueue, markers, markerInitialized, get lastIconPath() {
        return lastIconPath;
      }, set lastIconPath(v) {
        lastIconPath = v;
      }, get lastMarkerUpdateTime() {
        return lastMarkerUpdateTime;
      }, set lastMarkerUpdateTime(v) {
        lastMarkerUpdateTime = v;
      }, MARKER_UPDATE_INTERVAL, isTracking, trackingInterval, lastDirection, currentSpeed, currentAddress, currentTime, currentCar, times, handleCurrentTimeUpdate, createVehicleMarker, loadInitialPosition, initMarker, calculateMapRotation, normalizeRotation, calculateDistance, calculateRealisticAnimationDuration, calculateShortestRotation, updateMarkerSmooth, startPositionAnimation, processAnimationQueue, addToAnimationQueue, loadTrackData, stopTracking, startTracking, toggleTracking };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  const _style_0$i = { "container": { "": { "position": "relative", "width": "100%", "height": "100%", "display": "flex", "flexDirection": "column", "backgroundColor": "#f5f7fa" } }, "map-container": { ".container ": { "flexGrow": 1, "flexShrink": 1, "flexBasis": "0%", "width": "100%", "position": "relative" } }, "sub-nav-overlay": { ".container .map-container ": { "position": "absolute", "top": 0, "left": 0, "right": 0, "zIndex": 100 } }, "tools-panel": { ".container ": { "width": "100%", "backgroundColor": "#ffffff", "paddingTop": "20rpx", "paddingRight": "40rpx", "paddingBottom": "20rpx", "paddingLeft": "40rpx", "display": "flex", "flexDirection": "column", "boxShadow": "0 -2px 10px rgba(0, 0, 0, 0.1)" } }, "btn": { ".container .tools-panel ": { "marginBottom": "20rpx" } }, "pos-info-box": { ".container .tools-panel ": { "paddingTop": "10rpx", "paddingRight": 0, "paddingBottom": "10rpx", "paddingLeft": 0 } }, "speed": { ".container .tools-panel .pos-info-box ": { "display": "flex", "flexDirection": "row", "justifyContent": "flex-start", "alignItems": "center", "paddingTop": "8rpx", "paddingRight": 0, "paddingBottom": "8rpx", "paddingLeft": 0 } }, "address": { ".container .tools-panel .pos-info-box ": { "display": "flex", "flexDirection": "row", "justifyContent": "flex-start", "alignItems": "center", "paddingTop": "8rpx", "paddingRight": 0, "paddingBottom": "8rpx", "paddingLeft": 0 } }, "tracking-info-text": { ".container ": { "fontSize": "28rpx" } } };
  function _sfc_render$h(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_custom_navBar = resolveEasycom(vue.resolveDynamicComponent("custom-navBar"), __easycom_0$5);
    const _component_map = vue.resolveComponent("map");
    const _component_sub_navBar = resolveEasycom(vue.resolveDynamicComponent("sub-navBar"), __easycom_1$1);
    const _component_i_button = resolveEasycom(vue.resolveDynamicComponent("i-button"), __easycom_2$2);
    const _component_app_toast = resolveEasycom(vue.resolveDynamicComponent("app-toast"), __easycom_3$3);
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.createElementVNode("view", { class: "container" }, [
          vue.createVNode(_component_custom_navBar, {
            title: "车辆跟踪",
            "show-back": true,
            backgroundColor: "#fff",
            textColor: "#333",
            showCapsule: false
          }),
          vue.createElementVNode("view", { class: "map-container" }, [
            vue.createVNode(_component_map, {
              id: "myMap",
              latitude: $setup.center.latitude,
              longitude: $setup.center.longitude,
              markers: $setup.markers,
              scale: $setup.mapScale,
              style: { "width": "100%", "height": "100%" },
              "show-location": false,
              "enable-traffic": true,
              "enable-overlooking": true,
              "enable-building": true,
              "enable-3D": true
            }, null, 8, ["latitude", "longitude", "markers", "scale"]),
            vue.createVNode(_component_sub_navBar, {
              class: "sub-nav-overlay",
              currentTime: $setup.currentTime,
              currentCar: $setup.currentCar,
              times: $setup.times,
              showCar: true,
              "onUpdate:currentTime": $setup.handleCurrentTimeUpdate,
              carStatus: $setup.connectionStatus
            }, null, 8, ["currentTime", "currentCar", "times", "carStatus"])
          ]),
          vue.createElementVNode("view", { class: "tools-panel" }, [
            vue.createElementVNode("view", { class: "btn" }, [
              vue.createVNode(_component_i_button, {
                type: $setup.isTracking ? "danger" : "primary",
                size: "small",
                onClick: $setup.toggleTracking,
                style: vue.normalizeStyle({ backgroundColor: $setup.isTracking ? "#e64340" : "#1296db" }),
                text: $setup.isTracking ? "停止跟踪" : "开始跟踪"
              }, null, 8, ["type", "style", "text"])
            ]),
            vue.createElementVNode("view", { class: "pos-info-box" }, [
              vue.createElementVNode("view", { class: "speed" }, [
                vue.createElementVNode("text", { class: "tracking-info-text" }, "时速："),
                vue.createElementVNode(
                  "text",
                  { class: "tracking-info-text" },
                  vue.toDisplayString($setup.currentSpeed) + "Km/h",
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "address" }, [
                vue.createElementVNode("text", { class: "tracking-info-text" }, "定位时间："),
                vue.createElementVNode(
                  "text",
                  { class: "tracking-info-text" },
                  vue.toDisplayString($setup.currentAddress),
                  1
                  /* TEXT */
                )
              ])
            ])
          ])
        ]),
        vue.createVNode(_component_app_toast)
      ],
      64
      /* STABLE_FRAGMENT */
    );
  }
  const PagesVehicleTrackingVehicleTracking = /* @__PURE__ */ _export_sfc(_sfc_main$i, [["render", _sfc_render$h], ["styles", [_style_0$i]], ["__file", "/Users/xyhc/Documents/carConnectInternet/pages/vehicleTracking/vehicleTracking.uvue"]]);
  const _sfc_main$h = /* @__PURE__ */ vue.defineComponent(Object.assign({ name: "i-empty" }, { __name: "i-empty", props: {
    icon: { type: String, default: "∅" },
    image: { type: String, default: "" },
    text: { type: String, default: "暂无数据" },
    description: { type: String, default: "可以点击按钮重新加载。" },
    buttonText: { type: String, default: "重新加载" },
    showButton: { type: Boolean, default: true },
    iconSize: { type: [String, Number], default: 42 },
    iconColor: { type: String, default: "#c0c4cc" },
    textColor: { type: String, default: "#303133" },
    descriptionColor: { type: String, default: "#909399" },
    buttonColor: { type: String, default: "#2979ff" },
    buttonTextColor: { type: String, default: "#ffffff" },
    padding: { type: [String, Number], default: "28px 16px" },
    bgColor: { type: String, default: "#ffffff" }
  }, emits: ["click", "retry"], setup(__props, _a) {
    var __expose = _a.expose, __emit = _a.emit;
    __expose();
    const props = __props;
    const emit = __emit;
    function formatSize(value) {
      const text = value.toString();
      if (text.indexOf("px") >= 0 || text.indexOf("rpx") >= 0 || text.indexOf("%") >= 0)
        return text;
      return text + "px";
    }
    function formatBoxSize(value) {
      const text = value.toString();
      if (text.indexOf(" ") >= 0)
        return text;
      return formatSize(value);
    }
    const bgColor = vue.computed(() => {
      return props.bgColor;
    });
    const wrapStyle = vue.computed(() => {
      return "padding:" + formatBoxSize(props.padding) + ";background-color:" + bgColor.value + ";";
    });
    const iconStyle = vue.computed(() => {
      return "font-size:" + formatSize(props.iconSize) + ";color:" + props.iconColor + ";";
    });
    const textStyle = vue.computed(() => {
      return "color:" + props.textColor + ";";
    });
    const descStyle = vue.computed(() => {
      return "color:" + props.descriptionColor + ";";
    });
    const buttonStyle = vue.computed(() => {
      return "background-color:" + props.buttonColor + ";";
    });
    const buttonTextStyle = vue.computed(() => {
      return "color:" + props.buttonTextColor + ";";
    });
    const __returned__ = { props, emit, formatSize, formatBoxSize, bgColor, wrapStyle, iconStyle, textStyle, descStyle, buttonStyle, buttonTextStyle };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  } }));
  const _style_0$h = { "i-empty": { "": { "borderTopLeftRadius": 8, "borderTopRightRadius": 8, "borderBottomRightRadius": 8, "borderBottomLeftRadius": 8, "alignItems": "center" } }, "i-empty__image": { "": { "width": 110, "height": 110 } }, "i-empty__icon": { "": { "lineHeight": "52px" } }, "i-empty__text": { "": { "marginTop": 8, "fontSize": 15, "fontWeight": 600, "lineHeight": "22px" } }, "i-empty__desc": { "": { "marginTop": 4, "fontSize": 12, "lineHeight": "18px", "textAlign": "center" } }, "i-empty__button": { "": { "minWidth": 96, "height": 36, "marginTop": 14, "paddingTop": 0, "paddingRight": 14, "paddingBottom": 0, "paddingLeft": 14, "borderTopLeftRadius": 18, "borderTopRightRadius": 18, "borderBottomRightRadius": 18, "borderBottomLeftRadius": 18, "alignItems": "center", "justifyContent": "center" } }, "i-empty__button-text": { "": { "fontSize": 13, "lineHeight": "18px" } } };
  function _sfc_render$g(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: "i-empty",
        style: vue.normalizeStyle($setup.wrapStyle),
        onClick: _cache[1] || (_cache[1] = ($event) => $setup.emit("click"))
      },
      [
        vue.renderSlot(_ctx.$slots, "image", {}, () => [
          $props.image.length > 0 ? (vue.openBlock(), vue.createElementBlock("image", {
            key: 0,
            class: "i-empty__image",
            src: $props.image,
            mode: "aspectFit"
          }, null, 8, ["src"])) : (vue.openBlock(), vue.createElementBlock(
            "text",
            {
              key: 1,
              class: "i-empty__icon",
              style: vue.normalizeStyle($setup.iconStyle)
            },
            vue.toDisplayString($props.icon),
            5
            /* TEXT, STYLE */
          ))
        ]),
        vue.createElementVNode(
          "text",
          {
            class: "i-empty__text",
            style: vue.normalizeStyle($setup.textStyle)
          },
          vue.toDisplayString($props.text),
          5
          /* TEXT, STYLE */
        ),
        $props.description.length > 0 ? (vue.openBlock(), vue.createElementBlock(
          "text",
          {
            key: 0,
            class: "i-empty__desc",
            style: vue.normalizeStyle($setup.descStyle)
          },
          vue.toDisplayString($props.description),
          5
          /* TEXT, STYLE */
        )) : vue.createCommentVNode("v-if", true),
        vue.renderSlot(_ctx.$slots, "default", {}, () => [
          $props.showButton ? (vue.openBlock(), vue.createElementBlock(
            "view",
            {
              key: 0,
              class: "i-empty__button",
              style: vue.normalizeStyle($setup.buttonStyle),
              onClick: _cache[0] || (_cache[0] = vue.withModifiers(($event) => $setup.emit("retry"), ["stop"]))
            },
            [
              vue.createElementVNode(
                "text",
                {
                  class: "i-empty__button-text",
                  style: vue.normalizeStyle($setup.buttonTextStyle)
                },
                vue.toDisplayString($props.buttonText),
                5
                /* TEXT, STYLE */
              )
            ],
            4
            /* STYLE */
          )) : vue.createCommentVNode("v-if", true)
        ])
      ],
      4
      /* STYLE */
    );
  }
  const __easycom_0 = /* @__PURE__ */ _export_sfc(_sfc_main$h, [["render", _sfc_render$g], ["styles", [_style_0$h]], ["__file", "/Users/xyhc/Documents/carConnectInternet/uni_modules/i-ui-x/components/i-empty/i-empty.uvue"]]);
  const _sfc_main$g = /* @__PURE__ */ vue.defineComponent(Object.assign({ name: "i-tag" }, { __name: "i-tag", props: {
    type: {
      type: String,
      default: "primary"
    },
    plain: {
      type: Boolean,
      default: false
    },
    skin: {
      type: String,
      default: "normal"
    },
    round: {
      type: [Boolean, String, Number],
      default: false
    },
    text: {
      type: [String, Number],
      default: ""
    },
    size: {
      type: String,
      default: "normal"
    },
    width: {
      type: [String, Number],
      default: ""
    },
    height: {
      type: [String, Number],
      default: ""
    },
    closable: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: ""
    },
    iconSize: {
      type: [String, Number],
      default: ""
    },
    fontSize: {
      type: [String, Number],
      default: ""
    },
    color: {
      type: String,
      default: ""
    },
    fontColor: {
      type: String,
      default: ""
    },
    bgColor: {
      type: String,
      default: ""
    },
    borderColor: {
      type: String,
      default: ""
    },
    borderWidth: {
      type: [String, Number],
      default: 1
    },
    linear: {
      type: Array,
      default: () => {
        return [];
      }
    },
    shadow: {
      type: [String, Number, Array],
      default: ""
    },
    closeIcon: {
      type: String,
      default: "x"
    },
    customStyle: {
      type: String,
      default: ""
    }
  }, emits: ["click", "close"], setup(__props, _a) {
    var __expose = _a.expose, __emit = _a.emit;
    __expose();
    const props = __props;
    const emit = __emit;
    const bgColor = vue.computed(() => {
      return props.bgColor;
    });
    const closeClicking = vue.ref(false);
    const contentText = vue.computed(() => {
      return props.text.toString();
    });
    const normalizedType = vue.computed(() => {
      if (props.type == "danger")
        return "error";
      if (props.type == "warn")
        return "warning";
      return props.type;
    });
    const normalizedSkin = vue.computed(() => {
      if (props.plain)
        return "outlined";
      if (props.skin == "outline")
        return "outlined";
      if (props.skin == "light")
        return "thin";
      if (props.skin == "plain")
        return "outlined";
      return props.skin;
    });
    const themeColor = vue.computed(() => {
      if (props.color.length > 0)
        return props.color;
      if (normalizedType.value == "primary")
        return "#3c9cff";
      if (normalizedType.value == "success")
        return "#5ac725";
      if (normalizedType.value == "warning")
        return "#f9ae3d";
      if (normalizedType.value == "error")
        return "#f56c6c";
      if (normalizedType.value == "info")
        return "#909399";
      return "#303133";
    });
    const computedTextColor = vue.computed(() => {
      if (props.fontColor.length > 0)
        return props.fontColor;
      if (props.color.length > 0 && normalizedSkin.value == "normal")
        return "#ffffff";
      if (normalizedSkin.value == "normal" && bgColor.value.length == 0 && props.linear.length == 0) {
        return "#ffffff";
      }
      return themeColor.value;
    });
    const computedIconSize = vue.computed(() => {
      if (props.iconSize.toString().length > 0)
        return props.iconSize;
      if (props.fontSize.toString().length > 0)
        return props.fontSize;
      if (props.size == "xs" || props.size == "mini")
        return 11;
      if (props.size == "s" || props.size == "small")
        return 12;
      if (props.size == "g" || props.size == "large")
        return 15;
      return 13;
    });
    const closeText = vue.computed(() => {
      if (props.closeIcon == "close" || props.closeIcon == "close-line")
        return "x";
      return props.closeIcon;
    });
    const normalizedSize = vue.computed(() => {
      if (props.size == "xs" || props.size == "mini")
        return "xs";
      if (props.size == "s" || props.size == "small")
        return "small";
      if (props.size == "m" || props.size == "normal" || props.size == "n")
        return "normal";
      if (props.size == "g" || props.size == "large")
        return "large";
      return props.size;
    });
    const isCustomRound = vue.computed(() => {
      if (typeof props.round == "boolean")
        return false;
      return props.round.toString().length > 0;
    });
    const isRound = vue.computed(() => {
      if (typeof props.round == "boolean")
        return props.round;
      return props.round.toString().length > 0;
    });
    const tagClass = vue.computed(() => {
      const classes = [
        "i-tag",
        "i-tag--" + normalizedType.value,
        "i-tag--" + normalizedSize.value,
        "i-tag--" + normalizedSkin.value
      ];
      classes.push("i-tag--" + normalizedSkin.value + "-" + normalizedType.value);
      if (isRound.value)
        classes.push("i-tag--round");
      if (props.disabled)
        classes.push("i-tag--disabled");
      return classes.join(" ");
    });
    const textClass = vue.computed(() => {
      const classes = ["i-tag__text"];
      if (normalizedSize.value == "xs")
        classes.push("i-tag__text--xs");
      if (normalizedSize.value == "large")
        classes.push("i-tag__text--large");
      return classes.join(" ");
    });
    const closeClass = vue.computed(() => {
      const classes = ["i-tag__close"];
      if (normalizedSize.value == "xs")
        classes.push("i-tag__close--xs");
      return classes.join(" ");
    });
    function formatSize(value = null) {
      const text = value.toString();
      if (text.indexOf("px") >= 0 || text.indexOf("rpx") >= 0 || text.indexOf("rem") >= 0 || text.indexOf("%") >= 0) {
        return text;
      }
      return text + "px";
    }
    const shadowStyle = vue.computed(() => {
      const value = props.shadow;
      const text = value.toString();
      if (text.length == 0 || text == "none")
        return "";
      if (Array.isArray(value) && value.length >= 4) {
        const shadowValues = value;
        return "box-shadow:" + formatSize(shadowValues[0]) + " " + formatSize(shadowValues[1]) + " " + formatSize(shadowValues[2]) + " " + shadowValues[3].toString() + ";";
      }
      return "box-shadow:0 " + formatSize(value) + " " + formatSize(parseFloat(value.toString()) * 2) + " rgba(0,0,0,0.12);";
    });
    const tagStyle = vue.computed(() => {
      let style = "";
      if (props.width.toString().length > 0)
        style = style + "width:" + formatSize(props.width) + ";";
      if (props.height.toString().length > 0)
        style = style + "height:" + formatSize(props.height) + ";";
      if (props.borderWidth != 1)
        style = style + "border-width:" + formatSize(props.borderWidth) + ";";
      if (isCustomRound.value)
        style = style + "border-radius:" + formatSize(props.round) + ";";
      if (props.linear.length >= 3) {
        style = style + "background:linear-gradient(" + props.linear[0].toString() + "," + props.linear[1].toString() + "," + props.linear[2].toString() + ");border-color:transparent;";
      } else if (bgColor.value.length > 0) {
        style = style + "background-color:" + bgColor.value + ";";
        if (normalizedSkin.value == "normal" && props.borderColor.length == 0) {
          style = style + "border-color:" + bgColor.value + ";";
        }
      }
      if (props.borderColor.length > 0)
        style = style + "border-color:" + props.borderColor + ";";
      if (shadowStyle.value.length > 0)
        style = style + shadowStyle.value;
      if (props.customStyle.length > 0)
        style = style + props.customStyle;
      return style;
    });
    const textStyle = vue.computed(() => {
      let style = "color:" + computedTextColor.value + ";";
      if (props.fontSize.toString().length > 0) {
        style = style + "font-size:" + formatSize(props.fontSize) + ";";
      }
      return style;
    });
    const closeStyle = vue.computed(() => {
      return "color:" + computedTextColor.value + ";";
    });
    function handleClick(event = null) {
      if (closeClicking.value) {
        closeClicking.value = false;
        return null;
      }
      if (props.disabled)
        return null;
      emit("click", event);
    }
    function handleClose() {
      if (props.disabled)
        return null;
      closeClicking.value = true;
      emit("close", contentText.value);
      setTimeout(() => {
        closeClicking.value = false;
      }, 0);
    }
    const __returned__ = { props, emit, bgColor, closeClicking, contentText, normalizedType, normalizedSkin, themeColor, computedTextColor, computedIconSize, closeText, normalizedSize, isCustomRound, isRound, tagClass, textClass, closeClass, formatSize, shadowStyle, tagStyle, textStyle, closeStyle, handleClick, handleClose };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  } }));
  const _style_0$g = { "i-tag": { "": { "height": 28, "paddingTop": 0, "paddingRight": 10, "paddingBottom": 0, "paddingLeft": 10, "borderTopLeftRadius": 4, "borderTopRightRadius": 4, "borderBottomRightRadius": 4, "borderBottomLeftRadius": 4, "borderTopWidth": 1, "borderRightWidth": 1, "borderBottomWidth": 1, "borderLeftWidth": 1, "borderTopStyle": "solid", "borderRightStyle": "solid", "borderBottomStyle": "solid", "borderLeftStyle": "solid", "borderTopColor": "rgba(0,0,0,0)", "borderRightColor": "rgba(0,0,0,0)", "borderBottomColor": "rgba(0,0,0,0)", "borderLeftColor": "rgba(0,0,0,0)", "alignItems": "center", "justifyContent": "center", "flexDirection": "row", "backgroundColor": "#3c9cff", "overflow": "hidden" } }, "i-tag--round": { "": { "borderTopLeftRadius": 999, "borderTopRightRadius": 999, "borderBottomRightRadius": 999, "borderBottomLeftRadius": 999 } }, "i-tag--xs": { "": { "height": 20, "paddingTop": 0, "paddingRight": 7, "paddingBottom": 0, "paddingLeft": 7 } }, "i-tag--small": { "": { "height": 22, "paddingTop": 0, "paddingRight": 8, "paddingBottom": 0, "paddingLeft": 8 } }, "i-tag--large": { "": { "height": 34, "paddingTop": 0, "paddingRight": 12, "paddingBottom": 0, "paddingLeft": 12 } }, "i-tag--disabled": { "": { "opacity": 0.5 } }, "i-tag--primary": { "": { "backgroundColor": "#3c9cff", "borderTopColor": "#3c9cff", "borderRightColor": "#3c9cff", "borderBottomColor": "#3c9cff", "borderLeftColor": "#3c9cff" } }, "i-tag--success": { "": { "backgroundColor": "#5ac725", "borderTopColor": "#5ac725", "borderRightColor": "#5ac725", "borderBottomColor": "#5ac725", "borderLeftColor": "#5ac725" } }, "i-tag--warning": { "": { "backgroundColor": "#f9ae3d", "borderTopColor": "#f9ae3d", "borderRightColor": "#f9ae3d", "borderBottomColor": "#f9ae3d", "borderLeftColor": "#f9ae3d" } }, "i-tag--error": { "": { "backgroundColor": "#f56c6c", "borderTopColor": "#f56c6c", "borderRightColor": "#f56c6c", "borderBottomColor": "#f56c6c", "borderLeftColor": "#f56c6c" } }, "i-tag--info": { "": { "backgroundColor": "#909399", "borderTopColor": "#909399", "borderRightColor": "#909399", "borderBottomColor": "#909399", "borderLeftColor": "#909399" } }, "i-tag--thin": { "": { "backgroundColor": "#ecf5ff", "borderTopColor": "#ecf5ff", "borderRightColor": "#ecf5ff", "borderBottomColor": "#ecf5ff", "borderLeftColor": "#ecf5ff" } }, "i-tag--thin-success": { "": { "backgroundColor": "#f0f9eb", "borderTopColor": "#f0f9eb", "borderRightColor": "#f0f9eb", "borderBottomColor": "#f0f9eb", "borderLeftColor": "#f0f9eb" } }, "i-tag--thin-warning": { "": { "backgroundColor": "#fdf6ec", "borderTopColor": "#fdf6ec", "borderRightColor": "#fdf6ec", "borderBottomColor": "#fdf6ec", "borderLeftColor": "#fdf6ec" } }, "i-tag--thin-error": { "": { "backgroundColor": "#fef0f0", "borderTopColor": "#fef0f0", "borderRightColor": "#fef0f0", "borderBottomColor": "#fef0f0", "borderLeftColor": "#fef0f0" } }, "i-tag--thin-info": { "": { "backgroundColor": "#f4f4f5", "borderTopColor": "#f4f4f5", "borderRightColor": "#f4f4f5", "borderBottomColor": "#f4f4f5", "borderLeftColor": "#f4f4f5" } }, "i-tag--outlined": { "": { "backgroundColor": "#ffffff" } }, "i-tag--dashed": { "": { "backgroundColor": "#ffffff", "borderTopStyle": "dashed", "borderRightStyle": "dashed", "borderBottomStyle": "dashed", "borderLeftStyle": "dashed" } }, "i-tag--text": { "": { "backgroundColor": "#ffffff", "borderTopColor": "rgba(0,0,0,0)", "borderRightColor": "rgba(0,0,0,0)", "borderBottomColor": "rgba(0,0,0,0)", "borderLeftColor": "rgba(0,0,0,0)" } }, "i-tag--outlined-primary": { "": { "borderTopColor": "#3c9cff", "borderRightColor": "#3c9cff", "borderBottomColor": "#3c9cff", "borderLeftColor": "#3c9cff" } }, "i-tag--dashed-primary": { "": { "borderTopColor": "#3c9cff", "borderRightColor": "#3c9cff", "borderBottomColor": "#3c9cff", "borderLeftColor": "#3c9cff" } }, "i-tag--outlined-success": { "": { "borderTopColor": "#5ac725", "borderRightColor": "#5ac725", "borderBottomColor": "#5ac725", "borderLeftColor": "#5ac725" } }, "i-tag--dashed-success": { "": { "borderTopColor": "#5ac725", "borderRightColor": "#5ac725", "borderBottomColor": "#5ac725", "borderLeftColor": "#5ac725" } }, "i-tag--outlined-warning": { "": { "borderTopColor": "#f9ae3d", "borderRightColor": "#f9ae3d", "borderBottomColor": "#f9ae3d", "borderLeftColor": "#f9ae3d" } }, "i-tag--dashed-warning": { "": { "borderTopColor": "#f9ae3d", "borderRightColor": "#f9ae3d", "borderBottomColor": "#f9ae3d", "borderLeftColor": "#f9ae3d" } }, "i-tag--outlined-error": { "": { "borderTopColor": "#f56c6c", "borderRightColor": "#f56c6c", "borderBottomColor": "#f56c6c", "borderLeftColor": "#f56c6c" } }, "i-tag--dashed-error": { "": { "borderTopColor": "#f56c6c", "borderRightColor": "#f56c6c", "borderBottomColor": "#f56c6c", "borderLeftColor": "#f56c6c" } }, "i-tag--outlined-info": { "": { "borderTopColor": "#909399", "borderRightColor": "#909399", "borderBottomColor": "#909399", "borderLeftColor": "#909399" } }, "i-tag--dashed-info": { "": { "borderTopColor": "#909399", "borderRightColor": "#909399", "borderBottomColor": "#909399", "borderLeftColor": "#909399" } }, "i-tag__text": { "": { "color": "#ffffff", "fontSize": 12, "lineHeight": "18px" } }, "i-tag__text--xs": { "": { "fontSize": 11, "lineHeight": "16px" } }, "i-tag__text--large": { "": { "fontSize": 14, "lineHeight": "20px" } }, "i-tag__icon": { "": { "marginRight": 4 } }, "i-tag__close": { "": { "marginLeft": 5, "color": "#ffffff", "fontSize": 14, "lineHeight": "18px" } }, "i-tag__close--xs": { "": { "fontSize": 12, "lineHeight": "16px" } } };
  function _sfc_render$f(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_i_icon = resolveEasycom(vue.resolveDynamicComponent("i-icon"), __easycom_2$6);
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass($setup.tagClass),
        style: vue.normalizeStyle($setup.tagStyle),
        onClick: vue.withModifiers($setup.handleClick, ["stop"])
      },
      [
        $props.icon.length > 0 ? (vue.openBlock(), vue.createBlock(_component_i_icon, {
          key: 0,
          class: "i-tag__icon",
          name: $props.icon,
          fontSize: $setup.computedIconSize,
          color: $setup.computedTextColor
        }, null, 8, ["name", "fontSize", "color"])) : vue.createCommentVNode("v-if", true),
        $setup.contentText.length > 0 ? (vue.openBlock(), vue.createElementBlock(
          "text",
          {
            key: 1,
            class: vue.normalizeClass($setup.textClass),
            style: vue.normalizeStyle($setup.textStyle)
          },
          vue.toDisplayString($setup.contentText),
          7
          /* TEXT, CLASS, STYLE */
        )) : (vue.openBlock(), vue.createElementBlock(
          "text",
          {
            key: 2,
            class: vue.normalizeClass($setup.textClass),
            style: vue.normalizeStyle($setup.textStyle)
          },
          [
            vue.renderSlot(_ctx.$slots, "default")
          ],
          6
          /* CLASS, STYLE */
        )),
        $props.closable ? (vue.openBlock(), vue.createElementBlock(
          "text",
          {
            key: 3,
            class: vue.normalizeClass($setup.closeClass),
            style: vue.normalizeStyle($setup.closeStyle),
            onClick: $setup.handleClose
          },
          vue.toDisplayString($setup.closeText),
          7
          /* TEXT, CLASS, STYLE */
        )) : vue.createCommentVNode("v-if", true)
      ],
      6
      /* CLASS, STYLE */
    );
  }
  const __easycom_1 = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["render", _sfc_render$f], ["styles", [_style_0$g]], ["__file", "/Users/xyhc/Documents/carConnectInternet/uni_modules/i-ui-x/components/i-tag/i-tag.uvue"]]);
  class GroupType extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            date: { type: String, optional: false },
            trips: { type: "Unknown", optional: false },
            totalDistance: { type: Number, optional: false }
          };
        },
        name: "GroupType"
      };
    }
    constructor(options, metadata = GroupType.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.date = this.__props__.date;
      this.trips = this.__props__.trips;
      this.totalDistance = this.__props__.totalDistance;
      delete this.__props__;
    }
  }
  class DateTripGroup extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            date: { type: String, optional: false },
            trips: { type: "Unknown", optional: false }
          };
        },
        name: "DateTripGroup"
      };
    }
    constructor(options, metadata = DateTripGroup.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.date = this.__props__.date;
      this.trips = this.__props__.trips;
      delete this.__props__;
    }
  }
  const _sfc_main$f = /* @__PURE__ */ vue.defineComponent({
    __name: "mileageRecord",
    setup(__props, _a) {
      var __expose = _a.expose;
      __expose();
      const carStatus = vue.ref("在线");
      const plateNo = vue.ref("");
      const carType = vue.ref("");
      const totalMileage = vue.ref(0);
      const averageSpeed = vue.ref(0);
      const tripData = vue.ref([]);
      const showDateTimePicker = vue.ref(false);
      const currentPickerType = vue.ref("start");
      const pickerTitle = vue.ref("选择开始时间");
      const startTime = vue.ref("");
      const endTime = vue.ref("");
      const imei = vue.ref("");
      const groupedTrips = vue.computed(() => {
        const dateGroups = [];
        tripData.value.forEach((trip) => {
          const startTimeStr = trip.getString("startTime", "");
          const endTimeStr = trip.getString("endTime", "");
          const startParts = startTimeStr.split(" ");
          const endParts = endTimeStr.split(" ");
          const date = startParts.length > 0 && startParts[0] != "" ? startParts[0] : "未知日期";
          trip.set("startHour", startParts.length > 1 ? startParts[1] : "");
          trip.set("endHour", endParts.length > 1 ? endParts[1] : "");
          let group = UTS.arrayFind(dateGroups, (item) => {
            return item.date == date;
          });
          if (group == null) {
            group = { date, trips: [] };
            dateGroups.push(group);
          }
          group.trips.push(trip);
        });
        const groups = [];
        dateGroups.forEach((dateGroup) => {
          dateGroup.trips.sort((a, b) => {
            return new Date(b.getString("startTime", "")).getTime() - new Date(a.getString("startTime", "")).getTime();
          });
          let totalDistance = 0;
          dateGroup.trips.forEach((trip) => {
            totalDistance += trip.getNumber("distance", 0);
          });
          groups.push(new GroupType({ date: dateGroup.date, trips: dateGroup.trips, totalDistance }));
        });
        return groups.sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
      });
      const getTripStartTime = (trip) => {
        return trip.getString("startTime", "");
      };
      const getTripEndTime = (trip) => {
        return trip.getString("endTime", "");
      };
      const getTripHourRange = (trip) => {
        return trip.getString("startHour", "") + "-" + trip.getString("endHour", "");
      };
      const getTripDistanceText = (trip) => {
        return (trip.getNumber("distance", 0) / 1e3).toFixed(2);
      };
      const getTripDuration = (trip) => {
        return trip.getNumber("duration", 0);
      };
      const totalTrips = vue.computed(() => {
        return tripData.value.length;
      });
      const initDateTime = () => {
        const now = /* @__PURE__ */ new Date();
        const formatTime2 = (date) => {
          const month = (date.getMonth() + 1).toString().padStart(2, "0");
          const day = date.getDate().toString().padStart(2, "0");
          const hours = date.getHours().toString().padStart(2, "0");
          const minutes = date.getMinutes().toString().padStart(2, "0");
          const seconds = date.getSeconds().toString().padStart(2, "0");
          return "".concat(date.getFullYear(), "-").concat(month, "-").concat(day, " ").concat(hours, ":").concat(minutes, ":").concat(seconds);
        };
        endTime.value = formatTime2(now);
        const startDate = new Date(now.getTime() - 36e5 * 24);
        startTime.value = formatTime2(startDate);
      };
      const processTripData = (data) => {
        const trips = data.getArray("trips");
        if (trips != null && trips.length > 0) {
          tripData.value = trips;
          let totalDistance = 0;
          let totalAvgSpeed = 0;
          trips.forEach((trip) => {
            totalDistance += trip.getNumber("distance", 0);
            totalAvgSpeed += trip.getNumber("averageSpeed", 0);
          });
          totalMileage.value = totalDistance;
          averageSpeed.value = totalAvgSpeed / trips.length;
        } else {
          tripData.value = [];
          totalMileage.value = 0;
          averageSpeed.value = 0;
        }
      };
      const loadMileageData = () => {
        return __awaiter(this, void 0, void 0, function* () {
          uni.showLoading(new UTSJSONObject({
            title: "加载中..."
          }));
          if (!imei.value)
            return Promise.resolve(null);
          try {
            const data = new UTSJSONObject({
              imei: imei.value,
              startTime: startTime.value,
              endTime: endTime.value,
              minParkTime: 120,
              withStop: false,
              withPos: false,
              withTrip: true
            });
            const res = yield getTrackPos(data);
            uni.__log__("log", "at pages/mileageRecord/mileageRecord.uvue:201", "获取里程数据成功:", res);
            const trackData = res.data;
            if (trackData != null) {
              processTripData(trackData);
            }
          } catch (e) {
            uni.__log__("error", "at pages/mileageRecord/mileageRecord.uvue:207", "获取里程数据失败:", e);
            showAppToast({
              title: "数据加载失败",
              icon: "none"
            });
          } finally {
            uni.hideLoading();
          }
        });
      };
      vue.onMounted(() => {
        initDateTime();
        loadMileageData();
      });
      vue.onLoad((option) => {
        var _a2, _b, _c, _d;
        imei.value = (_a2 = option.imei) !== null && _a2 !== void 0 ? _a2 : null;
        carStatus.value = (_b = option.connectionStatus) !== null && _b !== void 0 ? _b : "在线";
        plateNo.value = (_c = option.plateNo) !== null && _c !== void 0 ? _c : "";
        carType.value = (_d = option.carType) !== null && _d !== void 0 ? _d : "";
      });
      const gotoTripDetail = (startTime2, endTime2) => {
        uni.navigateTo({
          url: "/pages/playBack/playBack?startTime=" + startTime2 + "&endTime=" + endTime2 + "&imei=" + imei.value + "&connectionStatus=" + carStatus.value + "&plateNo=" + plateNo.value + "&carType=" + carType.value
        });
      };
      const formatDisplayTime = (timeString) => {
        if (!timeString)
          return "选择时间";
        return timeString;
      };
      const formatTime = (timeString) => {
        if (!timeString)
          return "";
        return timeString.split(" ")[1].substring(0, 5);
      };
      const formatDuration = (milliseconds) => {
        const seconds = Math.floor(milliseconds / 1e3);
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor(seconds % 3600 / 60);
        if (hours > 0) {
          return "".concat(hours, "小时").concat(minutes, "分");
        } else if (minutes > 0) {
          return "".concat(minutes, "分钟");
        } else {
          return "".concat(seconds % 60, "秒");
        }
      };
      const showPicker = (type) => {
        currentPickerType.value = type;
        pickerTitle.value = type === "start" ? "选择开始时间" : "选择结束时间";
        showDateTimePicker.value = true;
      };
      const onConfirm = (value) => {
        if (currentPickerType.value === "start") {
          startTime.value = value;
        } else {
          endTime.value = value;
        }
        showDateTimePicker.value = false;
        loadMileageData();
      };
      const onCancel = () => {
        showDateTimePicker.value = false;
      };
      const __returned__ = { carStatus, plateNo, carType, totalMileage, averageSpeed, tripData, showDateTimePicker, currentPickerType, pickerTitle, startTime, endTime, imei, groupedTrips, getTripStartTime, getTripEndTime, getTripHourRange, getTripDistanceText, getTripDuration, totalTrips, initDateTime, processTripData, loadMileageData, gotoTripDetail, formatDisplayTime, formatTime, formatDuration, showPicker, onConfirm, onCancel };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  const _style_0$f = { "container": { "": { "height": "100%", "display": "flex", "flexDirection": "column", "backgroundColor": "#f5f7fa", "paddingBottom": "20rpx" } }, "tools-panel": { ".container ": { "backgroundColor": "#ffffff", "borderTopWidth": "1rpx", "borderRightWidth": "1rpx", "borderBottomWidth": "1rpx", "borderLeftWidth": "1rpx", "borderTopStyle": "solid", "borderRightStyle": "solid", "borderBottomStyle": "solid", "borderLeftStyle": "solid", "borderTopColor": "#69c2f1", "borderRightColor": "#69c2f1", "borderBottomColor": "#69c2f1", "borderLeftColor": "#69c2f1", "paddingTop": "20rpx", "paddingRight": "20rpx", "paddingBottom": "20rpx", "paddingLeft": "20rpx", "marginTop": "20rpx", "marginRight": "20rpx", "marginBottom": "20rpx", "marginLeft": "20rpx", "borderTopLeftRadius": "20rpx", "borderTopRightRadius": "20rpx", "borderBottomRightRadius": "20rpx", "borderBottomLeftRadius": "20rpx" } }, "Datetime-box": { ".container .tools-panel ": { "display": "flex", "flexDirection": "row", "justifyContent": "center", "alignItems": "center" } }, "date-box": { ".container .tools-panel .Datetime-box ": { "display": "flex", "flexDirection": "row", "justifyContent": "center", "alignItems": "center" } }, "Date": { ".container .tools-panel .Datetime-box .date-box ": { "fontSize": "25rpx", "borderTopLeftRadius": "5rpx", "borderTopRightRadius": "5rpx", "borderBottomRightRadius": "5rpx", "borderBottomLeftRadius": "5rpx", "color": "#333333" } }, "summary-panel": { ".container ": { "display": "flex", "flexDirection": "row", "justifyContent": "space-around", "backgroundColor": "#ffffff", "marginTop": "20rpx", "marginRight": "20rpx", "marginBottom": "20rpx", "marginLeft": "20rpx", "paddingTop": "20rpx", "paddingRight": "20rpx", "paddingBottom": "20rpx", "paddingLeft": "20rpx", "borderTopLeftRadius": "15rpx", "borderTopRightRadius": "15rpx", "borderBottomRightRadius": "15rpx", "borderBottomLeftRadius": "15rpx", "boxShadow": "0 2rpx 10rpx rgba(0, 0, 0, 0.05)" } }, "summary-item": { ".container .summary-panel ": { "display": "flex", "flexDirection": "column", "alignItems": "center" } }, "label": { ".container .summary-panel .summary-item ": { "fontSize": "24rpx", "color": "#999999", "marginBottom": "10rpx" } }, "value": { ".container .summary-panel .summary-item ": { "fontSize": "28rpx", "color": "#333333", "fontWeight": "bold" } }, "content": { ".container ": { "flexGrow": 1, "flexShrink": 1, "flexBasis": "0%", "marginTop": 0, "marginRight": "20rpx", "marginBottom": "20%", "marginLeft": "20rpx", "backgroundColor": "#ffffff", "borderTopLeftRadius": "20rpx", "borderTopRightRadius": "20rpx", "borderBottomRightRadius": "20rpx", "borderBottomLeftRadius": "20rpx" } }, "trip-list": { ".container .content ": { "width": "100%", "paddingBottom": "20rpx" } }, "trip-group": { ".container .content .trip-list ": { "paddingTop": "20rpx", "paddingRight": "20rpx", "paddingBottom": "20rpx", "paddingLeft": "20rpx", "backgroundColor": "#ffffff", "borderTopLeftRadius": "15rpx", "borderTopRightRadius": "15rpx", "borderBottomRightRadius": "15rpx", "borderBottomLeftRadius": "15rpx" } }, "group-header": { ".container .content .trip-list .trip-group ": { "display": "flex", "flexDirection": "row", "justifyContent": "space-between", "alignItems": "center", "paddingTop": "15rpx", "paddingRight": 0, "paddingBottom": "15rpx", "paddingLeft": 0 } }, "group-header-title": { ".container .content .trip-list .trip-group .group-header ": { "display": "flex", "flexDirection": "row", "justifyContent": "space-between", "alignItems": "center" } }, "group-date": { ".container .content .trip-list .trip-group .group-header ": { "fontSize": "30rpx", "color": "#333333", "marginRight": "30rpx" } }, "group-separator": { ".container .content .trip-list .trip-group ": { "height": "1rpx", "backgroundColor": "#eeeeee", "marginTop": "10rpx", "marginRight": 0, "marginBottom": "10rpx", "marginLeft": 0 } }, "trip-item": { ".container .content .trip-list .trip-group ": { "display": "flex", "paddingTop": "25rpx", "paddingRight": 0, "paddingBottom": "25rpx", "paddingLeft": 0, "borderBottomWidth": "1rpx", "borderBottomStyle": "solid", "borderBottomColor": "#f5f5f5" } }, "trip-index": { ".container .content .trip-list .trip-group .trip-item ": { "display": "flex", "flexDirection": "row", "justifyContent": "flex-start", "alignItems": "center", "paddingTop": "5rpx" } }, "icon": { ".container .content .trip-list .trip-group .trip-item .trip-index ": { "width": "40rpx", "height": "40rpx", "backgroundColor": "#1296db", "color": "#ffffff", "borderTopLeftRadius": "50%", "borderTopRightRadius": "50%", "borderBottomRightRadius": "50%", "borderBottomLeftRadius": "50%", "display": "flex", "justifyContent": "center", "alignItems": "center", "fontSize": "24rpx", "marginRight": "20rpx" } }, "trip-distance-time": { ".container .content .trip-list .trip-group .trip-item .trip-index ": { "display": "flex", "flexDirection": "row", "justifyContent": "space-between", "alignItems": "center", "flexGrow": 1, "flexShrink": 1, "flexBasis": "0%" } }, "trip-content": { ".container .content .trip-list .trip-group .trip-item ": { "flexGrow": 1, "flexShrink": 1, "flexBasis": "0%" } }, "icons": { ".container .content .trip-list .trip-group .trip-item .trip-content .trip-locations ": { "width": "50rpx", "height": "50rpx" } } };
  function _sfc_render$e(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_custom_navBar = resolveEasycom(vue.resolveDynamicComponent("custom-navBar"), __easycom_0$5);
    const _component_i_icon = resolveEasycom(vue.resolveDynamicComponent("i-icon"), __easycom_2$6);
    const _component_l_date_time_picker = resolveEasycom(vue.resolveDynamicComponent("l-date-time-picker"), __easycom_2$1);
    const _component_l_popup = resolveEasycom(vue.resolveDynamicComponent("l-popup"), __easycom_3);
    const _component_i_empty = resolveEasycom(vue.resolveDynamicComponent("i-empty"), __easycom_0);
    const _component_i_tag = resolveEasycom(vue.resolveDynamicComponent("i-tag"), __easycom_1);
    const _component_app_toast = resolveEasycom(vue.resolveDynamicComponent("app-toast"), __easycom_3$3);
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.createVNode(_component_custom_navBar, {
          title: "里程记录",
          "show-back": true,
          backgroundColor: "#fff",
          textColor: "#333",
          showCapsule: false
        }),
        vue.createElementVNode("view", { class: "container" }, [
          vue.createElementVNode("view", { class: "tools-panel" }, [
            vue.createElementVNode("view", { class: "Datetime-box" }, [
              vue.createElementVNode("view", { class: "date-box" }, [
                vue.createVNode(_component_i_icon, {
                  name: "/static/rili.png",
                  fontSize: "15"
                }),
                vue.createElementVNode(
                  "text",
                  {
                    class: "Date",
                    onClick: _cache[0] || (_cache[0] = ($event) => $setup.showPicker("start"))
                  },
                  vue.toDisplayString($setup.formatDisplayTime($setup.startTime)),
                  1
                  /* TEXT */
                ),
                vue.createVNode(_component_i_icon, {
                  name: "/static/xiangxia.png",
                  fontSize: "15",
                  onClick: _cache[1] || (_cache[1] = ($event) => $setup.showPicker("start"))
                }),
                vue.createElementVNode("text", { style: { "padding": "0 10rpx" } }, "至"),
                vue.createElementVNode(
                  "text",
                  {
                    class: "Date",
                    onClick: _cache[2] || (_cache[2] = ($event) => $setup.showPicker("end"))
                  },
                  vue.toDisplayString($setup.formatDisplayTime($setup.endTime)),
                  1
                  /* TEXT */
                ),
                vue.createVNode(_component_i_icon, {
                  name: "/static/xiangxia.png",
                  fontSize: "15",
                  onClick: _cache[3] || (_cache[3] = ($event) => $setup.showPicker("end"))
                })
              ])
            ]),
            vue.createVNode(_component_l_popup, {
              modelValue: $setup.showDateTimePicker,
              "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $setup.showDateTimePicker = $event),
              position: "bottom",
              closeable: false
            }, {
              default: vue.withCtx(() => [
                vue.createVNode(_component_l_date_time_picker, {
                  "confirm-btn": "确认",
                  "cancel-btn": "取消",
                  title: $setup.pickerTitle,
                  mode: 63,
                  onConfirm: $setup.onConfirm,
                  onCancel: $setup.onCancel
                }, null, 8, ["title"])
              ]),
              _: 1
              /* STABLE */
            }, 8, ["modelValue"])
          ]),
          vue.createElementVNode("view", { class: "summary-panel" }, [
            vue.createElementVNode("view", { class: "summary-item" }, [
              vue.createElementVNode("text", { class: "label" }, "总里程"),
              vue.createElementVNode(
                "text",
                { class: "value" },
                vue.toDisplayString(($setup.totalMileage / 1e3).toFixed(2)) + " Km",
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("view", { class: "summary-item" }, [
              vue.createElementVNode("text", { class: "label" }, "行程次数"),
              vue.createElementVNode(
                "text",
                { class: "value" },
                vue.toDisplayString($setup.totalTrips) + " 次",
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("view", { class: "summary-item" }, [
              vue.createElementVNode("text", { class: "label" }, "平均速度"),
              vue.createElementVNode(
                "text",
                { class: "value" },
                vue.toDisplayString($setup.averageSpeed.toFixed(1)) + " km/h",
                1
                /* TEXT */
              )
            ])
          ]),
          vue.createElementVNode("scroll-view", {
            class: "content",
            "scroll-y": "true",
            "show-scrollbar": false,
            "enable-flex": ""
          }, [
            $setup.groupedTrips.length == 0 ? (vue.openBlock(), vue.createBlock(_component_i_empty, {
              key: 0,
              text: "当前时间点暂无行程数据",
              showButton: false,
              description: ""
            })) : (vue.openBlock(), vue.createElementBlock("view", {
              key: 1,
              class: "trip-list"
            }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($setup.groupedTrips, (group, groupIndex) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    key: groupIndex,
                    class: "trip-group"
                  }, [
                    vue.createElementVNode("view", { class: "group-header" }, [
                      vue.createElementVNode("view", { class: "group-header-title" }, [
                        vue.createElementVNode(
                          "text",
                          { class: "group-date" },
                          vue.toDisplayString(group.date),
                          1
                          /* TEXT */
                        ),
                        vue.createVNode(_component_i_tag, {
                          text: group.trips.length + "段",
                          type: "success",
                          size: "small"
                        }, null, 8, ["text"])
                      ]),
                      vue.createElementVNode(
                        "text",
                        null,
                        "里程 " + vue.toDisplayString((group.totalDistance / 1e3).toFixed(2)) + " km",
                        1
                        /* TEXT */
                      )
                    ]),
                    vue.createElementVNode("view", { class: "group-separator" }),
                    (vue.openBlock(true), vue.createElementBlock(
                      vue.Fragment,
                      null,
                      vue.renderList(group.trips, (item, index) => {
                        return vue.openBlock(), vue.createElementBlock("view", {
                          key: index,
                          class: "trip-item",
                          onClick: ($event) => $setup.gotoTripDetail($setup.getTripStartTime(item), $setup.getTripEndTime(item))
                        }, [
                          vue.createElementVNode("view", { class: "trip-index" }, [
                            vue.createElementVNode("view", { class: "icon" }, [
                              vue.createElementVNode(
                                "text",
                                { style: { "color": "#ffffff", "font-size": "24rpx" } },
                                vue.toDisplayString(index + 1),
                                1
                                /* TEXT */
                              )
                            ]),
                            vue.createElementVNode("view", { class: "trip-distance-time" }, [
                              vue.createElementVNode(
                                "text",
                                null,
                                vue.toDisplayString($setup.getTripHourRange(item)),
                                1
                                /* TEXT */
                              ),
                              vue.createElementVNode(
                                "text",
                                null,
                                vue.toDisplayString($setup.getTripDistanceText(item)) + " km",
                                1
                                /* TEXT */
                              ),
                              vue.createElementVNode(
                                "text",
                                null,
                                vue.toDisplayString($setup.formatDuration($setup.getTripDuration(item))),
                                1
                                /* TEXT */
                              )
                            ])
                          ])
                        ], 8, ["onClick"]);
                      }),
                      128
                      /* KEYED_FRAGMENT */
                    ))
                  ]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ]))
          ])
        ]),
        vue.createVNode(_component_app_toast)
      ],
      64
      /* STABLE_FRAGMENT */
    );
  }
  const PagesMileageRecordMileageRecord = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["render", _sfc_render$e], ["styles", [_style_0$f]], ["__file", "/Users/xyhc/Documents/carConnectInternet/pages/mileageRecord/mileageRecord.uvue"]]);
  const _sfc_main$e = /* @__PURE__ */ vue.defineComponent({
    __name: "stopRecord",
    setup(__props, _a) {
      var __expose = _a.expose;
      __expose();
      const carStatus = vue.ref("在线");
      const showDateTimePicker = vue.ref(false);
      const currentPickerType = vue.ref("start");
      const pickerTitle = vue.ref("选择开始时间");
      const startTime = vue.ref("");
      const endTime = vue.ref("");
      const imei = vue.ref("");
      const carStopDetail = vue.ref([]);
      const getStopNumber = (item, key) => {
        return item.getNumber(key, 0);
      };
      const getStopText = (item, key) => {
        return item.getString(key, "");
      };
      const sortedCarStopDetail = vue.computed(() => {
        const sorted = carStopDetail.value.slice();
        sorted.sort((a, b) => {
          const timeA = new Date(a.getString("endTime", "")).getTime();
          const timeB = new Date(b.getString("endTime", "")).getTime();
          return timeB - timeA;
        });
        return sorted;
      });
      vue.onLoad((option) => {
        imei.value = option.imei;
      });
      const initDateTime = () => {
        const now = /* @__PURE__ */ new Date();
        const formatTime = (date) => {
          const month = (date.getMonth() + 1).toString().padStart(2, "0");
          const day = date.getDate().toString().padStart(2, "0");
          const hours = date.getHours().toString().padStart(2, "0");
          const minutes = date.getMinutes().toString().padStart(2, "0");
          const seconds = date.getSeconds().toString().padStart(2, "0");
          return "".concat(date.getFullYear(), "-").concat(month, "-").concat(day, " ").concat(hours, ":").concat(minutes, ":").concat(seconds);
        };
        endTime.value = formatTime(now);
        const startDate = new Date(now.getTime() - 36e5 * 24);
        startTime.value = formatTime(startDate);
      };
      const loadStopData = () => {
        return __awaiter(this, void 0, void 0, function* () {
          var _a2;
          uni.showLoading(new UTSJSONObject({
            title: "加载中..."
          }));
          const data = new UTSJSONObject({
            imei: imei.value,
            startTime: startTime.value,
            endTime: endTime.value,
            minParkTime: 10,
            withStop: true,
            withPos: false,
            withTrip: false
          });
          const res = yield getTrackPos(data);
          let stopsWithAddress = [];
          const trackData = res.data;
          const stops = (_a2 = trackData === null || trackData === void 0 ? null : trackData.getArray("stops")) !== null && _a2 !== void 0 ? _a2 : [];
          stops.forEach((stop) => {
            const convertedCoord = CoordTransform.wgs84ToTencent(stop.getNumber("latitude", 0), stop.getNumber("longitude", 0));
            stop.set("latitude", convertedCoord.lat);
            stop.set("longitude", convertedCoord.lng);
            stopsWithAddress.push(stop);
          });
          carStopDetail.value = stopsWithAddress;
          uni.hideLoading();
        });
      };
      vue.onMounted(() => {
        initDateTime();
        loadStopData();
      });
      const showPicker = (type) => {
        currentPickerType.value = type;
        pickerTitle.value = type === "start" ? "选择开始时间" : "选择结束时间";
        showDateTimePicker.value = true;
      };
      const onConfirm = (value) => {
        if (currentPickerType.value === "start") {
          startTime.value = value;
        } else {
          endTime.value = value;
        }
        loadStopData();
        showDateTimePicker.value = false;
      };
      const onCancel = () => {
        showDateTimePicker.value = false;
      };
      const calculateDuration = (diff) => {
        const hours = Math.floor(diff / (1e3 * 60 * 60));
        const minutes = Math.floor(diff % (1e3 * 60 * 60) / (1e3 * 60));
        const seconds = Math.floor(diff % (1e3 * 60) / 1e3);
        return "".concat(hours, "小时").concat(minutes, "分").concat(seconds, "秒");
      };
      const showAddress = (latitude, longitude) => {
        return __awaiter(this, void 0, void 0, function* () {
          uni.__log__("log", "at pages/stopRecord/stopRecord.uvue:172", latitude, longitude);
          uni.openLocation({
            latitude,
            longitude,
            name: "当前位置",
            scale: 18,
            success: () => {
              uni.__log__("log", "at pages/stopRecord/stopRecord.uvue:179", "成功调起地图");
            },
            fail: (err) => {
              showAppToast({
                title: "调起地图失败",
                icon: "none"
              });
              uni.__log__("error", "at pages/stopRecord/stopRecord.uvue:186", "调起地图失败:", err);
            }
          });
        });
      };
      const __returned__ = { carStatus, showDateTimePicker, currentPickerType, pickerTitle, startTime, endTime, imei, carStopDetail, getStopNumber, getStopText, sortedCarStopDetail, initDateTime, loadStopData, showPicker, onConfirm, onCancel, calculateDuration, showAddress };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  const _imports_0 = "/static/startTime.png";
  const _imports_1 = "/static/endTime.png";
  const _imports_2 = "/static/stopTime.png";
  const _imports_3 = "/static/user_location.png";
  const _style_0$e = { "container": { "": { "height": "100%", "display": "flex", "flexDirection": "column", "backgroundColor": "#f5f7fa" } }, "tools-panel": { ".container ": { "backgroundColor": "#ffffff", "borderTopWidth": "1rpx", "borderRightWidth": "1rpx", "borderBottomWidth": "1rpx", "borderLeftWidth": "1rpx", "borderTopStyle": "solid", "borderRightStyle": "solid", "borderBottomStyle": "solid", "borderLeftStyle": "solid", "borderTopColor": "#69c2f1", "borderRightColor": "#69c2f1", "borderBottomColor": "#69c2f1", "borderLeftColor": "#69c2f1", "paddingTop": "20rpx", "paddingRight": "20rpx", "paddingBottom": "20rpx", "paddingLeft": "20rpx", "marginTop": "20rpx", "marginRight": "20rpx", "marginBottom": "20rpx", "marginLeft": "20rpx", "borderTopLeftRadius": "20rpx", "borderTopRightRadius": "20rpx", "borderBottomRightRadius": "20rpx", "borderBottomLeftRadius": "20rpx" } }, "Datetime-box": { ".container .tools-panel ": { "display": "flex", "flexDirection": "row", "justifyContent": "center", "alignItems": "center" } }, "date-box": { ".container .tools-panel .Datetime-box ": { "width": "100%", "display": "flex", "flexDirection": "row", "justifyContent": "space-between", "alignItems": "center" } }, "Date": { ".container .tools-panel .Datetime-box .date-box ": { "fontSize": "25rpx", "borderTopLeftRadius": "5rpx", "borderTopRightRadius": "5rpx", "borderBottomRightRadius": "5rpx", "borderBottomLeftRadius": "5rpx" } }, "mileage_title": { ".container ": { "marginTop": "20rpx", "marginRight": "40rpx", "marginBottom": 0, "marginLeft": "40rpx", "paddingTop": "20rpx", "paddingRight": "20rpx", "paddingBottom": "20rpx", "paddingLeft": "20rpx", "display": "flex", "flexDirection": "row", "justifyContent": "space-between", "alignItems": "center" } }, "content": { ".container ": { "marginTop": "20rpx", "marginRight": "40rpx", "marginBottom": "20rpx", "marginLeft": "40rpx", "paddingTop": "20rpx", "paddingRight": "20rpx", "paddingBottom": "20rpx", "paddingLeft": "20rpx", "display": "flex", "flexDirection": "column", "justifyContent": "flex-start", "alignItems": "flex-start", "backgroundColor": "#ffffff", "borderTopLeftRadius": "15rpx", "borderTopRightRadius": "15rpx", "borderBottomRightRadius": "15rpx", "borderBottomLeftRadius": "15rpx" } }, "content-box": { ".container ": { "flexGrow": 1, "flexShrink": 1, "flexBasis": "0%", "minHeight": 0, "marginBottom": "30rpx" } }, "item": { ".container .content ": { "display": "flex", "flexDirection": "row", "alignItems": "center", "paddingTop": "15rpx", "paddingRight": 0, "paddingBottom": "15rpx", "paddingLeft": 0 } }, "icons": { ".container .content .item ": { "width": "40rpx", "height": "40rpx", "marginRight": "15rpx" } } };
  function _sfc_render$d(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_custom_navBar = resolveEasycom(vue.resolveDynamicComponent("custom-navBar"), __easycom_0$5);
    const _component_i_icon = resolveEasycom(vue.resolveDynamicComponent("i-icon"), __easycom_2$6);
    const _component_l_date_time_picker = resolveEasycom(vue.resolveDynamicComponent("l-date-time-picker"), __easycom_2$1);
    const _component_l_popup = resolveEasycom(vue.resolveDynamicComponent("l-popup"), __easycom_3);
    const _component_i_empty = resolveEasycom(vue.resolveDynamicComponent("i-empty"), __easycom_0);
    const _component_app_toast = resolveEasycom(vue.resolveDynamicComponent("app-toast"), __easycom_3$3);
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.createElementVNode("view", { class: "container" }, [
          vue.createVNode(_component_custom_navBar, {
            title: "停车记录",
            "show-back": true,
            backgroundColor: "#fff",
            textColor: "#333",
            showCapsule: false
          }),
          vue.createElementVNode("view", { class: "tools-panel" }, [
            vue.createElementVNode("view", { class: "Datetime-box" }, [
              vue.createElementVNode("view", { class: "date-box" }, [
                vue.createVNode(_component_i_icon, {
                  name: "/static/rili.png",
                  fontSize: "15"
                }),
                vue.createElementVNode(
                  "text",
                  {
                    class: "Date",
                    onClick: _cache[0] || (_cache[0] = ($event) => $setup.showPicker("start"))
                  },
                  vue.toDisplayString($setup.startTime),
                  1
                  /* TEXT */
                ),
                vue.createVNode(_component_i_icon, {
                  name: "/static/xiangxia.png",
                  fontSize: "15",
                  onClick: _cache[1] || (_cache[1] = ($event) => $setup.showPicker("start"))
                }),
                vue.createElementVNode("text", { style: { "padding": "0 10rpx" } }, "至"),
                vue.createElementVNode(
                  "text",
                  {
                    class: "Date",
                    onClick: _cache[2] || (_cache[2] = ($event) => $setup.showPicker("end"))
                  },
                  vue.toDisplayString($setup.endTime),
                  1
                  /* TEXT */
                ),
                vue.createVNode(_component_i_icon, {
                  name: "/static/xiangxia.png",
                  fontSize: "15",
                  onClick: _cache[3] || (_cache[3] = ($event) => $setup.showPicker("end"))
                })
              ])
            ]),
            vue.createVNode(_component_l_popup, {
              modelValue: $setup.showDateTimePicker,
              "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $setup.showDateTimePicker = $event),
              position: "bottom",
              closeable: false
            }, {
              default: vue.withCtx(() => [
                vue.createVNode(_component_l_date_time_picker, {
                  "confirm-btn": "确认",
                  "cancel-btn": "取消",
                  title: $setup.pickerTitle,
                  mode: 63,
                  onConfirm: $setup.onConfirm,
                  onCancel: $setup.onCancel
                }, null, 8, ["title"])
              ]),
              _: 1
              /* STABLE */
            }, 8, ["modelValue"])
          ]),
          vue.createElementVNode("scroll-view", {
            class: "content-box",
            "scroll-y": "true"
          }, [
            $setup.sortedCarStopDetail.length == 0 ? (vue.openBlock(), vue.createBlock(_component_i_empty, {
              key: 0,
              text: "当前时间暂无停车数据",
              showButton: false,
              description: ""
            })) : (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              { key: 1 },
              vue.renderList($setup.sortedCarStopDetail, (item, index) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  class: "content",
                  key: index
                }, [
                  vue.createElementVNode("view", { class: "item" }, [
                    vue.createElementVNode("image", {
                      class: "icons",
                      mode: "aspectFit",
                      src: _imports_0
                    }),
                    vue.createElementVNode(
                      "text",
                      null,
                      vue.toDisplayString(item.startTime),
                      1
                      /* TEXT */
                    )
                  ]),
                  vue.createElementVNode("view", { class: "item" }, [
                    vue.createElementVNode("image", {
                      class: "icons",
                      mode: "aspectFit",
                      src: _imports_1
                    }),
                    vue.createElementVNode(
                      "text",
                      null,
                      vue.toDisplayString(item.endTime),
                      1
                      /* TEXT */
                    )
                  ]),
                  vue.createElementVNode("view", { class: "item" }, [
                    vue.createElementVNode("image", {
                      class: "icons",
                      mode: "aspectFit",
                      src: _imports_2
                    }),
                    vue.createElementVNode(
                      "text",
                      null,
                      "停留 " + vue.toDisplayString($setup.calculateDuration(item.getNumber("duration", 0))),
                      1
                      /* TEXT */
                    )
                  ]),
                  vue.createElementVNode("view", { class: "item" }, [
                    vue.createElementVNode("image", {
                      class: "icons",
                      mode: "aspectFit",
                      src: _imports_3
                    }),
                    item.address ? (vue.openBlock(), vue.createElementBlock(
                      "text",
                      {
                        key: 0,
                        class: "address"
                      },
                      vue.toDisplayString(item.address || "加载中..."),
                      1
                      /* TEXT */
                    )) : (vue.openBlock(), vue.createElementBlock("text", {
                      key: 1,
                      onClick: ($event) => $setup.showAddress(item.getNumber("latitude", 0), item.getNumber("longitude", 0))
                    }, "点击查看停车位置", 8, ["onClick"]))
                  ])
                ]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])
        ]),
        vue.createVNode(_component_app_toast)
      ],
      64
      /* STABLE_FRAGMENT */
    );
  }
  const PagesStopRecordStopRecord = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["render", _sfc_render$d], ["styles", [_style_0$e]], ["__file", "/Users/xyhc/Documents/carConnectInternet/pages/stopRecord/stopRecord.uvue"]]);
  let UserInfo$1 = class UserInfo2 extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            id: { type: String, optional: false },
            mobile: { type: String, optional: false },
            type: { type: Number, optional: false },
            createTime: { type: String, optional: false }
          };
        },
        name: "UserInfo"
      };
    }
    constructor(options, metadata = UserInfo2.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.id = this.__props__.id;
      this.mobile = this.__props__.mobile;
      this.type = this.__props__.type;
      this.createTime = this.__props__.createTime;
      delete this.__props__;
    }
  };
  const _sfc_main$d = /* @__PURE__ */ vue.defineComponent({
    __name: "userInfo",
    setup(__props, _a) {
      var __expose = _a.expose;
      __expose();
      const userInfo = vue.ref(new UserInfo$1({
        id: "",
        mobile: "",
        type: 0,
        createTime: ""
      }));
      vue.onLoad((options) => {
        if (options.userInfo != null) {
          try {
            const parsedInfo = UTS.JSON.parse(decodeURIComponent(options.userInfo));
            const userId = parsedInfo.getString("userId");
            const mobile = parsedInfo.getString("mobile");
            const type = parsedInfo.getNumber("type");
            const createTime = parsedInfo.getString("createTime");
            userInfo.value = {
              id: userId != null ? userId : "",
              mobile: mobile != null ? mobile : "",
              type: type != null ? type : 0,
              createTime: createTime != null ? createTime : ""
            };
            uni.__log__("log", "at pages/userCenter/userInfo/userInfo.uvue:82", "用户信息:", userInfo.value);
          } catch (e) {
            uni.__log__("error", "at pages/userCenter/userInfo/userInfo.uvue:84", "解析用户信息失败:", e);
          }
        }
      });
      const editPassword = () => {
        uni.navigateTo({
          url: "/pages/userCenter/editPassword/editPassword"
        });
      };
      const logoutBtn = () => {
        return __awaiter(this, void 0, void 0, function* () {
          const res = yield logout();
          if (res.code == 0) {
            uni.removeStorageSync("token");
            uni.reLaunch({
              url: "/pages/login/login"
            });
          } else {
            showAppToast({
              title: "退出账户失败"
            });
          }
        });
      };
      const __returned__ = { userInfo, editPassword, logoutBtn };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  const _style_0$d = { "container": { "": { "width": "100%", "height": "100%", "backgroundColor": "#f5f5f5", "position": "relative" } }, "content": { ".container ": { "paddingTop": "20rpx", "paddingRight": "20rpx", "paddingBottom": "120rpx", "paddingLeft": "20rpx" } }, "title": { ".container .content ": { "color": "#666666", "fontSize": "26rpx", "marginTop": "30rpx", "marginRight": 0, "marginBottom": "20rpx", "marginLeft": 0 } }, "list": { ".container .content ": { "backgroundColor": "#ffffff", "borderTopLeftRadius": "20rpx", "borderTopRightRadius": "20rpx", "borderBottomRightRadius": "20rpx", "borderBottomLeftRadius": "20rpx", "paddingTop": "20rpx", "paddingRight": "20rpx", "paddingBottom": "20rpx", "paddingLeft": "20rpx" } }, "item": { ".container .content .list ": { "display": "flex", "flexDirection": "row", "justifyContent": "space-between", "alignItems": "center", "paddingTop": "20rpx", "paddingRight": "10rpx", "paddingBottom": "20rpx", "paddingLeft": "10rpx", "borderBottomWidth": "1rpx", "borderBottomStyle": "solid", "borderBottomColor": "#e5e5e5" } }, "right": { ".container .content .list .item ": { "display": "flex", "flexDirection": "row", "justifyContent": "space-between", "alignItems": "center" } }, "info": { ".container .content .list .item .right ": { "marginRight": "10rpx" } }, "footer": { ".container .content ": { "position": "fixed", "bottom": "100rpx", "left": "20rpx", "right": "20rpx" } }, "logout": { ".container .content .footer ": { "width": "100%", "height": "90rpx", "lineHeight": "90rpx", "borderTopWidth": "1rpx", "borderRightWidth": "1rpx", "borderBottomWidth": "1rpx", "borderLeftWidth": "1rpx", "borderTopStyle": "solid", "borderRightStyle": "solid", "borderBottomStyle": "solid", "borderLeftStyle": "solid", "borderTopColor": "#f56c6c", "borderRightColor": "#f56c6c", "borderBottomColor": "#f56c6c", "borderLeftColor": "#f56c6c", "borderTopLeftRadius": "10rpx", "borderTopRightRadius": "10rpx", "borderBottomRightRadius": "10rpx", "borderBottomLeftRadius": "10rpx", "color": "#f56c6c", "textAlign": "center", "backgroundColor": "#ffffff", "fontSize": "32rpx" } } };
  function _sfc_render$c(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_custom_navBar = resolveEasycom(vue.resolveDynamicComponent("custom-navBar"), __easycom_0$5);
    const _component_i_icon = resolveEasycom(vue.resolveDynamicComponent("i-icon"), __easycom_2$6);
    const _component_app_toast = resolveEasycom(vue.resolveDynamicComponent("app-toast"), __easycom_3$3);
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.createElementVNode("view", { class: "container" }, [
          vue.createVNode(_component_custom_navBar, {
            title: "个人信息",
            "show-back": true,
            backgroundColor: "#fff",
            textColor: "#333",
            showCapsule: false
          }),
          vue.createElementVNode("view", { class: "content" }, [
            vue.createElementVNode("view", { class: "title" }, " 基本信息 "),
            vue.createElementVNode("view", { class: "list" }, [
              vue.createElementVNode("view", { class: "item" }, [
                vue.createElementVNode("text", null, "账号"),
                vue.createElementVNode("view", { class: "right" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "info" },
                    vue.toDisplayString($setup.userInfo.id),
                    1
                    /* TEXT */
                  )
                ])
              ]),
              vue.createElementVNode("view", { class: "item" }, [
                vue.createElementVNode("text", null, "手机号"),
                vue.createElementVNode("view", { class: "right" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "info" },
                    vue.toDisplayString($setup.userInfo.mobile),
                    1
                    /* TEXT */
                  )
                ])
              ]),
              vue.createElementVNode("view", { class: "item" }, [
                vue.createElementVNode("text", null, "类型"),
                vue.createElementVNode("view", { class: "right" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "info" },
                    vue.toDisplayString($setup.userInfo.type == 1 ? "公司用户" : "个人用户"),
                    1
                    /* TEXT */
                  )
                ])
              ]),
              vue.createElementVNode("view", { class: "item" }, [
                vue.createElementVNode("text", null, "创建时间"),
                vue.createElementVNode("view", { class: "right" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "info" },
                    vue.toDisplayString($setup.userInfo.createTime),
                    1
                    /* TEXT */
                  )
                ])
              ])
            ]),
            $setup.userInfo.type == 1 ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "title"
            }, " 安全信息 ")) : vue.createCommentVNode("v-if", true),
            $setup.userInfo.type == 1 ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 1,
              class: "list",
              onClick: $setup.editPassword
            }, [
              vue.createElementVNode("view", { class: "item" }, [
                vue.createElementVNode("text", null, "修改密码"),
                vue.createVNode(_component_i_icon, {
                  name: "/static/arrow-right.png",
                  fontSize: "15"
                })
              ])
            ])) : vue.createCommentVNode("v-if", true),
            vue.createElementVNode("view", { class: "footer" }, [
              vue.createElementVNode("view", {
                class: "logout",
                onClick: $setup.logoutBtn
              }, "退出登录")
            ])
          ])
        ]),
        vue.createVNode(_component_app_toast)
      ],
      64
      /* STABLE_FRAGMENT */
    );
  }
  const PagesUserCenterUserInfoUserInfo = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["render", _sfc_render$c], ["styles", [_style_0$d]], ["__file", "/Users/xyhc/Documents/carConnectInternet/pages/userCenter/userInfo/userInfo.uvue"]]);
  class UserInfo extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            id: { type: String, optional: false },
            mobile: { type: String, optional: false }
          };
        },
        name: "UserInfo"
      };
    }
    constructor(options, metadata = UserInfo.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.id = this.__props__.id;
      this.mobile = this.__props__.mobile;
      delete this.__props__;
    }
  }
  class FormInstance extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            validate: { type: "Unknown", optional: false }
          };
        },
        name: "FormInstance"
      };
    }
    constructor(options, metadata = FormInstance.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.validate = this.__props__.validate;
      delete this.__props__;
    }
  }
  const _sfc_main$c = /* @__PURE__ */ vue.defineComponent({
    __name: "editPassword",
    setup(__props, _a) {
      var __expose = _a.expose;
      __expose();
      const userInfo = vue.ref(new UserInfo({
        id: "",
        mobile: ""
      }));
      const formData = vue.ref(new UTSJSONObject({
        password: "",
        newPassword: "",
        confirmPassword: ""
      }));
      const formRef = vue.ref(null);
      const validateConfirmPassword = (rule, value, callback) => {
        if (value !== formData.value.newPassword) {
          callback(new Error("两次输入的密码不一致"));
        } else {
          callback(null);
        }
      };
      const rules = [
        new UTSJSONObject({ name: "password", required: true, message: "请输入原密码" }),
        new UTSJSONObject({ name: "newPassword", required: true, message: "请输入新密码" }),
        new UTSJSONObject({ name: "confirmPassword", required: true, message: "请确认新密码" })
      ];
      const handleSubmit = () => {
        return __awaiter(this, void 0, void 0, function* () {
          try {
            const form = formRef.value;
            if (form == null || !form.validate()) {
              throw new Error("表单验证失败");
            }
            uni.showLoading(new UTSJSONObject({ title: "提交中...", mask: true }));
            const submitData = new UTSJSONObject({
              password: formData.value.password,
              newPassword: formData.value.newPassword
            });
            const res = yield changePassWord(submitData);
            if (res.msg == "success") {
              uni.hideLoading();
              showAppToast({
                title: "密码修改成功",
                icon: "success",
                duration: 2e3
              });
              setTimeout(() => {
                uni.navigateBack();
              }, 1500);
            } else {
              uni.hideLoading();
              showAppToast({
                title: "密码修改失败",
                icon: "error",
                duration: 2e3
              });
            }
          } catch (error) {
            uni.hideLoading();
            showAppToast({
              title: "表单验证失败",
              icon: "none",
              duration: 2e3
            });
          }
        });
      };
      vue.onLoad((options) => {
        if (options.userInfo != null) {
          try {
            const parsedInfo = UTS.JSON.parse(decodeURIComponent(options.userInfo));
            uni.__log__("log", "at pages/userCenter/editPassword/editPassword.uvue:120", parsedInfo);
            const userId = parsedInfo.getString("userId");
            const mobile = parsedInfo.getString("mobile");
            userInfo.value = {
              id: userId != null ? userId : "",
              mobile: mobile != null ? mobile : ""
            };
            uni.__log__("log", "at pages/userCenter/editPassword/editPassword.uvue:127", "用户信息:", userInfo.value);
          } catch (e) {
            uni.__log__("error", "at pages/userCenter/editPassword/editPassword.uvue:129", "解析用户信息失败:", e);
          }
        }
      });
      const __returned__ = { userInfo, formData, formRef, validateConfirmPassword, rules, handleSubmit };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  const _style_0$c = { "container": { "": { "width": "100%", "height": "100%", "backgroundColor": "#f5f5f5" } }, "content": { ".container ": { "marginTop": "20rpx", "marginRight": "20rpx", "marginBottom": "20rpx", "marginLeft": "20rpx", "paddingTop": "20rpx", "paddingRight": "40rpx", "paddingBottom": "20rpx", "paddingLeft": "40rpx", "backgroundColor": "#ffffff", "borderTopLeftRadius": "20rpx", "borderTopRightRadius": "20rpx", "borderBottomRightRadius": "20rpx", "borderBottomLeftRadius": "20rpx" } }, "btn": { ".container ": { "marginTop": "50rpx", "marginRight": "20rpx", "marginBottom": 0, "marginLeft": "20rpx" } } };
  function _sfc_render$b(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_custom_navBar = resolveEasycom(vue.resolveDynamicComponent("custom-navBar"), __easycom_0$5);
    const _component_i_input = resolveEasycom(vue.resolveDynamicComponent("i-input"), __easycom_1$2);
    const _component_i_form_item = resolveEasycom(vue.resolveDynamicComponent("i-form-item"), __easycom_2$3);
    const _component_i_form = resolveEasycom(vue.resolveDynamicComponent("i-form"), __easycom_3$1);
    const _component_i_button = resolveEasycom(vue.resolveDynamicComponent("i-button"), __easycom_2$2);
    const _component_app_toast = resolveEasycom(vue.resolveDynamicComponent("app-toast"), __easycom_3$3);
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.createElementVNode("view", { class: "container" }, [
          vue.createVNode(_component_custom_navBar, {
            title: "修改密码",
            "show-back": true,
            backgroundColor: "#fff",
            textColor: "#333",
            showCapsule: false
          }),
          vue.createElementVNode("view", { class: "content" }, [
            vue.createVNode(_component_i_form, {
              modelValue: $setup.formData,
              rules: $setup.rules,
              ref: "formRef"
            }, {
              default: vue.withCtx(() => [
                vue.createVNode(_component_i_form_item, {
                  label: "原密码",
                  labelDirection: "horizontal",
                  labelWidth: "80",
                  name: "password",
                  borderBottom: ""
                }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_i_input, {
                      modelValue: $setup.formData.password,
                      "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.formData.password = $event),
                      placeholder: "请输入原密码",
                      border: "none",
                      type: "password",
                      password: "",
                      customStyle: "padding:20rpx"
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                  /* STABLE */
                }),
                vue.createVNode(_component_i_form_item, {
                  label: "新密码",
                  labelDirection: "horizontal",
                  labelWidth: "80",
                  name: "newPassword",
                  borderBottom: ""
                }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_i_input, {
                      modelValue: $setup.formData.newPassword,
                      "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.formData.newPassword = $event),
                      placeholder: "请输入新密码",
                      border: "none",
                      type: "password",
                      password: "",
                      customStyle: "padding:20rpx"
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                  /* STABLE */
                }),
                vue.createVNode(_component_i_form_item, {
                  label: "确认密码",
                  labelDirection: "horizontal",
                  labelWidth: "80",
                  name: "confirmPassword"
                }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_i_input, {
                      modelValue: $setup.formData.confirmPassword,
                      "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.formData.confirmPassword = $event),
                      placeholder: "请再次输入新密码",
                      border: "none",
                      type: "password",
                      password: "",
                      customStyle: "padding:20rpx"
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                  /* STABLE */
                })
              ]),
              _: 1
              /* STABLE */
            }, 8, ["modelValue"])
          ]),
          vue.createElementVNode("view", { class: "btn" }, [
            vue.createVNode(_component_i_button, {
              type: "primary",
              text: "提交修改",
              onClick: $setup.handleSubmit
            })
          ])
        ]),
        vue.createVNode(_component_app_toast)
      ],
      64
      /* STABLE_FRAGMENT */
    );
  }
  const PagesUserCenterEditPasswordEditPassword = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["render", _sfc_render$b], ["styles", [_style_0$c]], ["__file", "/Users/xyhc/Documents/carConnectInternet/pages/userCenter/editPassword/editPassword.uvue"]]);
  const _sfc_main$b = /* @__PURE__ */ vue.defineComponent({
    __name: "carList",
    setup(__props, _a) {
      var __expose = _a.expose;
      __expose();
      const carList = vue.ref([]);
      const currPage = vue.ref(1);
      const pageSize = vue.ref(10);
      const totalPage = vue.ref(0);
      const loading = vue.ref(false);
      const hasMore = vue.ref(true);
      const addCar = () => {
        uni.navigateTo({
          url: "/pages/addCar/addCar"
        });
      };
      const resetData = () => {
        carList.value = [];
        currPage.value = 1;
        totalPage.value = 0;
        hasMore.value = true;
      };
      const loadCarListData = () => {
        return __awaiter(this, void 0, void 0, function* () {
          uni.__log__("log", "at pages/userCenter/carList/carList.uvue:60", currPage.value, totalPage.value);
          if (loading.value || !hasMore.value)
            return Promise.resolve(null);
          loading.value = true;
          try {
            const data = new UTSJSONObject({
              page: currPage.value,
              pageSize: pageSize.value
            });
            const res = yield getUserDeviceList(data);
            const code = res.code;
            const list = res.data.list;
            const pageCount = res.data.totalPage;
            if (code == 0 && list != null) {
              totalPage.value = pageCount;
              if (currPage.value == 1) {
                carList.value = list;
              } else {
                carList.value = [...carList.value, ...list];
              }
              hasMore.value = currPage.value < totalPage.value;
              if (hasMore.value) {
                currPage.value++;
              }
            } else {
              showAppToast({
                title: res.msg || "加载失败",
                icon: "none"
              });
            }
          } catch (error) {
            uni.__log__("error", "at pages/userCenter/carList/carList.uvue:100", "加载车辆列表失败:", error);
            showAppToast({
              title: "加载失败，请重试",
              icon: "none"
            });
          } finally {
            loading.value = false;
          }
        });
      };
      vue.onShow(() => {
        resetData();
        loadCarListData();
      });
      vue.onReachBottom(() => {
        loadCarListData();
      });
      const carDetail = (deviceId) => {
        uni.navigateTo({
          url: "/pages/userCenter/carDetail/carDetail?deviceId=".concat(deviceId)
        });
      };
      const __returned__ = { carList, currPage, pageSize, totalPage, loading, hasMore, addCar, resetData, loadCarListData, carDetail };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  const _style_0$b = { "container": { "": { "width": "100%", "backgroundColor": "#f5f5f5", "marginTop": "170rpx" } }, "content": { ".container ": { "marginTop": "30rpx", "marginRight": "20rpx", "marginBottom": "20rpx", "marginLeft": "20rpx" } }, "list": { ".container .content ": { "backgroundColor": "#ffffff", "borderTopLeftRadius": "20rpx", "borderTopRightRadius": "20rpx", "borderBottomRightRadius": "20rpx", "borderBottomLeftRadius": "20rpx", "paddingTop": "30rpx", "paddingRight": "40rpx", "paddingBottom": "30rpx", "paddingLeft": "40rpx", "marginBottom": "30rpx", "fontSize": "25rpx" } }, "title": { ".container .content .list ": { "fontWeight": "bold", "fontSize": "32rpx" } }, "device-info": { ".container .content .list ": { "display": "flex", "flexDirection": "row", "justifyContent": "space-between", "alignItems": "center", "paddingTop": "20rpx" } }, "tel": { ".container .content .list .device-info ": { "color": "#999999", "fontSize": "22rpx" } }, "loading": { ".container .content ": { "textAlign": "center", "paddingTop": "30rpx", "paddingRight": 0, "paddingBottom": "30rpx", "paddingLeft": 0, "color": "#999999", "fontSize": "24rpx" } }, "no-more": { ".container .content ": { "textAlign": "center", "paddingTop": "30rpx", "paddingRight": 0, "paddingBottom": "30rpx", "paddingLeft": 0, "color": "#999999", "fontSize": "24rpx" } } };
  function _sfc_render$a(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_custom_navBar = resolveEasycom(vue.resolveDynamicComponent("custom-navBar"), __easycom_0$5);
    const _component_app_toast = resolveEasycom(vue.resolveDynamicComponent("app-toast"), __easycom_3$3);
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.createVNode(_component_custom_navBar, {
          title: "车辆管理",
          "show-back": true,
          backgroundColor: "#fff",
          textColor: "#333",
          showCapsule: true,
          isIcon: true,
          onCapsuleClick: $setup.addCar,
          isShowStyle: true
        }),
        vue.createElementVNode("view", { class: "container" }, [
          vue.createElementVNode("view", { class: "content" }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.carList, (item, index) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  class: "list",
                  key: index,
                  onClick: ($event) => $setup.carDetail(item.getString("deviceId", ""))
                }, [
                  vue.createElementVNode(
                    "text",
                    { class: "title" },
                    vue.toDisplayString(item.getString("deviceName", "")),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode("view", { class: "device-info" }, [
                    vue.createElementVNode(
                      "text",
                      null,
                      vue.toDisplayString(item.getString("plateNo", "")),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "text",
                      { class: "tel" },
                      vue.toDisplayString(item.getString("imei", "")),
                      1
                      /* TEXT */
                    )
                  ])
                ], 8, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            )),
            $setup.loading ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "loading"
            }, [
              vue.createElementVNode("text", null, "加载中...")
            ])) : vue.createCommentVNode("v-if", true),
            !$setup.hasMore && !$setup.loading ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 1,
              class: "no-more"
            }, [
              vue.createElementVNode("text", null, "没有更多数据了")
            ])) : vue.createCommentVNode("v-if", true)
          ])
        ]),
        vue.createVNode(_component_app_toast)
      ],
      64
      /* STABLE_FRAGMENT */
    );
  }
  const PagesUserCenterCarListCarList = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["render", _sfc_render$a], ["styles", [_style_0$b]], ["__file", "/Users/xyhc/Documents/carConnectInternet/pages/userCenter/carList/carList.uvue"]]);
  class VehicleEditInfo extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            deviceName: { type: String, optional: false },
            carType: { type: String, optional: false },
            carTypeValue: { type: String, optional: false },
            plateNo: { type: String, optional: false },
            carVin: { type: String, optional: false },
            engineNum: { type: String, optional: false }
          };
        },
        name: "VehicleEditInfo"
      };
    }
    constructor(options, metadata = VehicleEditInfo.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.deviceName = this.__props__.deviceName;
      this.carType = this.__props__.carType;
      this.carTypeValue = this.__props__.carTypeValue;
      this.plateNo = this.__props__.plateNo;
      this.carVin = this.__props__.carVin;
      this.engineNum = this.__props__.engineNum;
      delete this.__props__;
    }
  }
  const _sfc_main$a = /* @__PURE__ */ vue.defineComponent({
    __name: "carDetail",
    setup(__props, _a) {
      var __expose = _a.expose;
      __expose();
      const deviceId = vue.ref("");
      const carInfo = vue.ref(new UTSJSONObject({}));
      const isEditing = vue.ref(false);
      const saving = vue.ref(false);
      const loadingDetail = vue.ref(false);
      const detailLoaded = vue.ref(false);
      const carIconSelectorVisible = vue.ref(false);
      const editInfo = vue.ref(new VehicleEditInfo({
        deviceName: "",
        carType: "",
        carTypeValue: "",
        plateNo: "",
        carVin: "",
        engineNum: ""
      }));
      const carTitle = vue.computed(() => {
        return carInfo.value.getString("carType", "未知");
      });
      const formattedPlateNo = vue.computed(() => {
        return carInfo.value.getString("plateNo", "京A");
      });
      const getCarTypeText = (carType) => {
        const carTypeNames = new UTSJSONObject({
          car: "轿车",
          suv: "越野车",
          bus: "公交车",
          huoche: "货车",
          train: "火车",
          diandong: "电动车",
          moto: "摩托车",
          bike: "自行车",
          sanlun: "三轮车",
          tuola: "拖拉机",
          wajue: "挖掘机",
          tuiche: "手推车",
          baby: "婴儿车",
          muma: "木马",
          tank: "坦克",
          zhuangjia: "装甲车",
          plan: "飞机",
          hangmu: "航母",
          junjian: "军舰",
          walk: "步行"
        });
        return carTypeNames.getString(carType, carType);
      };
      const createEditInfo = () => {
        const carType = carInfo.value.getString("carType", "");
        return new VehicleEditInfo({
          deviceName: carInfo.value.getString("deviceName", ""),
          carType,
          carTypeValue: carType,
          plateNo: carInfo.value.getString("plateNo", ""),
          carVin: carInfo.value.getString("carVin", ""),
          engineNum: carInfo.value.getString("engineNum", "")
        });
      };
      const toggleEdit = () => {
        if (loadingDetail.value || saving.value)
          return null;
        if (!detailLoaded.value || deviceId.value.length == 0) {
          showAppToast({ title: "车辆信息尚未加载完成", icon: "none" });
          return null;
        }
        editInfo.value = createEditInfo();
        isEditing.value = true;
      };
      const updateCarIconSelectorVisible = (visible) => {
        carIconSelectorVisible.value = visible;
      };
      const openCarIconSelector = () => {
        if (!saving.value)
          carIconSelectorVisible.value = true;
      };
      const selectIcon = (item) => {
        editInfo.value.carType = item.getString("name", "");
        editInfo.value.carTypeValue = item.getString("text", "");
        carIconSelectorVisible.value = false;
      };
      const normalizePlateNo = (value) => {
        return value.replace(/\s/g, "");
      };
      const cancelEdit = () => {
        if (saving.value)
          return null;
        carIconSelectorVisible.value = false;
        isEditing.value = false;
      };
      const saveChanges = () => {
        return __awaiter(this, void 0, void 0, function* () {
          if (saving.value)
            return Promise.resolve(null);
          if (deviceId.value.length == 0) {
            showAppToast({ title: "设备ID不能为空", icon: "none" });
            return Promise.resolve(null);
          }
          const plateNo = normalizePlateNo(editInfo.value.plateNo);
          const payload = new UTSJSONObject({
            deviceId: deviceId.value,
            deviceName: editInfo.value.deviceName,
            carType: editInfo.value.carType,
            plateNo,
            carVin: editInfo.value.carVin,
            engineNum: editInfo.value.engineNum
          });
          saving.value = true;
          uni.showLoading(new UTSJSONObject({ title: "保存中...", mask: true }));
          try {
            const res = yield editDeviceInfo(payload);
            if (res.code == 0) {
              carInfo.value = payload;
              editInfo.value.plateNo = plateNo;
              isEditing.value = false;
              carIconSelectorVisible.value = false;
              showAppToast({ title: "保存成功", icon: "success" });
            } else {
              showAppToast({ title: res.msg || "保存失败", icon: "none" });
            }
          } catch (error) {
            uni.__log__("error", "at pages/userCenter/carDetail/carDetail.uvue:190", "保存车辆信息失败:", error);
            showAppToast({ title: "保存失败，请重试", icon: "none" });
          } finally {
            uni.hideLoading();
            saving.value = false;
          }
        });
      };
      const loadCarListData = () => {
        return __awaiter(this, void 0, void 0, function* () {
          if (deviceId.value.length == 0)
            return Promise.resolve(null);
          loadingDetail.value = true;
          try {
            const res = yield getDeviceDetail(deviceId.value);
            if (res.code == 0 && res.data != null) {
              carInfo.value = res.data;
              detailLoaded.value = true;
            } else {
              showAppToast({ title: res.msg || "获取车辆详情失败", icon: "none" });
            }
          } catch (error) {
            uni.__log__("error", "at pages/userCenter/carDetail/carDetail.uvue:210", "获取车辆详情失败:", error);
            showAppToast({ title: "获取车辆详情失败", icon: "none" });
          } finally {
            loadingDetail.value = false;
          }
        });
      };
      vue.onLoad((option) => {
        const id = option.deviceId;
        if (id != null) {
          deviceId.value = id;
          loadCarListData();
        }
      });
      const __returned__ = { deviceId, carInfo, isEditing, saving, loadingDetail, detailLoaded, carIconSelectorVisible, editInfo, carTitle, formattedPlateNo, getCarTypeText, createEditInfo, toggleEdit, updateCarIconSelectorVisible, openCarIconSelector, selectIcon, normalizePlateNo, cancelEdit, saveChanges, loadCarListData, get carIcons() {
        return carIcons;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  const _style_0$a = { "container": { "": { "height": "100%", "backgroundColor": "#f5f5f5" } }, "content": { "": { "marginTop": "20rpx", "marginRight": "20rpx", "marginBottom": "20rpx", "marginLeft": "20rpx", "backgroundColor": "#ffffff", "paddingTop": "40rpx", "paddingRight": "40rpx", "paddingBottom": "40rpx", "paddingLeft": "40rpx", "borderTopLeftRadius": "20rpx", "borderTopRightRadius": "20rpx", "borderBottomRightRadius": "20rpx", "borderBottomLeftRadius": "20rpx" } }, "list": { "": { "display": "flex", "flexDirection": "row", "justifyContent": "space-between", "alignItems": "center", "minHeight": "76rpx", "paddingTop": "20rpx", "paddingRight": "10rpx", "paddingBottom": "20rpx", "paddingLeft": "10rpx", "borderBottomWidth": "1rpx", "borderBottomStyle": "solid", "borderBottomColor": "#eeeeee" } }, "title": { "": { "width": "30%", "color": "#999999" } }, "info": { "": { "color": "#333333", "textAlign": "right", "flexGrow": 1, "flexShrink": 1, "flexBasis": "0%" } }, "input": { "": { "textAlign": "right", "paddingTop": 0, "paddingRight": "10rpx", "paddingBottom": 0, "paddingLeft": "10rpx", "borderTopLeftRadius": "8rpx", "borderTopRightRadius": "8rpx", "borderBottomRightRadius": "8rpx", "borderBottomLeftRadius": "8rpx", "width": "60%" } }, "car-type-selector": { "": { "flexGrow": 1, "flexShrink": 1, "flexBasis": "0%", "display": "flex", "flexDirection": "row", "alignItems": "center", "justifyContent": "flex-end" } }, "button-group": { "": { "display": "flex", "flexDirection": "row", "justifyContent": "space-between", "alignItems": "center", "marginTop": "40rpx", "marginRight": "40rpx", "marginBottom": 0, "marginLeft": "40rpx" } }, "action-button": { "": { "width": "40%", "borderTopLeftRadius": "8rpx", "borderTopRightRadius": "8rpx", "borderBottomRightRadius": "8rpx", "borderBottomLeftRadius": "8rpx", "fontSize": "32rpx", "height": "80rpx", "lineHeight": "80rpx" } }, "save-btn": { "": { "backgroundColor": "#007AFF", "color": "#FFFFFF" } }, "cancel-btn": { "": { "backgroundColor": "#f5f5f5", "color": "#333333", "borderTopWidth": "1rpx", "borderRightWidth": "1rpx", "borderBottomWidth": "1rpx", "borderLeftWidth": "1rpx", "borderTopStyle": "solid", "borderRightStyle": "solid", "borderBottomStyle": "solid", "borderLeftStyle": "solid", "borderTopColor": "#dddddd", "borderRightColor": "#dddddd", "borderBottomColor": "#dddddd", "borderLeftColor": "#dddddd" } } };
  function _sfc_render$9(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_custom_navBar = resolveEasycom(vue.resolveDynamicComponent("custom-navBar"), __easycom_0$5);
    const _component_i_input = resolveEasycom(vue.resolveDynamicComponent("i-input"), __easycom_1$2);
    const _component_i_icon = resolveEasycom(vue.resolveDynamicComponent("i-icon"), __easycom_2$6);
    const _component_i_button = resolveEasycom(vue.resolveDynamicComponent("i-button"), __easycom_2$2);
    const _component_app_toast = resolveEasycom(vue.resolveDynamicComponent("app-toast"), __easycom_3$3);
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.createElementVNode("view", { class: "container" }, [
          vue.createVNode(_component_custom_navBar, {
            title: "车辆详情",
            "show-back": true,
            backgroundColor: "#fff",
            textColor: "#333",
            showCapsule: !$setup.isEditing && !$setup.loadingDetail,
            isIcon: true,
            onCapsuleClick: $setup.toggleEdit,
            Icon: "/static/edit-pen.png"
          }, null, 8, ["showCapsule"]),
          vue.createElementVNode("view", { class: "content" }, [
            vue.createElementVNode("view", { class: "list" }, [
              vue.createElementVNode("text", { class: "title" }, "设备ID"),
              vue.createElementVNode(
                "text",
                { class: "info" },
                vue.toDisplayString($setup.carInfo.getString("deviceId", "")),
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("view", { class: "list" }, [
              vue.createElementVNode("text", { class: "title" }, "设备名称"),
              !$setup.isEditing ? (vue.openBlock(), vue.createElementBlock(
                "text",
                {
                  key: 0,
                  class: "info"
                },
                vue.toDisplayString($setup.carInfo.getString("deviceName", "")),
                1
                /* TEXT */
              )) : (vue.openBlock(), vue.createBlock(_component_i_input, {
                key: 1,
                modelValue: $setup.editInfo.deviceName,
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.editInfo.deviceName = $event),
                border: "none",
                inputAlign: "right",
                class: "input",
                placeholder: "请输入设备名称"
              }, null, 8, ["modelValue"]))
            ]),
            vue.createElementVNode("view", { class: "list" }, [
              vue.createElementVNode("text", { class: "title" }, "车标"),
              !$setup.isEditing ? (vue.openBlock(), vue.createElementBlock(
                "text",
                {
                  key: 0,
                  class: "info"
                },
                vue.toDisplayString($setup.carTitle),
                1
                /* TEXT */
              )) : (vue.openBlock(), vue.createElementBlock("view", {
                key: 1,
                class: "car-type-selector",
                onClick: $setup.openCarIconSelector
              }, [
                vue.createElementVNode(
                  "text",
                  {
                    class: vue.normalizeClass({ placeholder: $setup.editInfo.carTypeValue.length == 0 })
                  },
                  vue.toDisplayString($setup.editInfo.carTypeValue || "请选择车标"),
                  3
                  /* TEXT, CLASS */
                ),
                vue.createVNode(_component_i_icon, {
                  name: "/static/xiangxia.png",
                  fontSize: "18"
                })
              ]))
            ]),
            vue.createElementVNode("view", { class: "list" }, [
              vue.createElementVNode("text", { class: "title" }, "车牌号"),
              !$setup.isEditing ? (vue.openBlock(), vue.createElementBlock(
                "text",
                {
                  key: 0,
                  class: "info"
                },
                vue.toDisplayString($setup.formattedPlateNo),
                1
                /* TEXT */
              )) : (vue.openBlock(), vue.createBlock(_component_i_input, {
                key: 1,
                modelValue: $setup.editInfo.plateNo,
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.editInfo.plateNo = $event),
                border: "none",
                inputAlign: "right",
                class: "input",
                placeholder: "请输入车牌号"
              }, null, 8, ["modelValue"]))
            ]),
            vue.createElementVNode("view", { class: "list" }, [
              vue.createElementVNode("text", { class: "title" }, "车架号"),
              !$setup.isEditing ? (vue.openBlock(), vue.createElementBlock(
                "text",
                {
                  key: 0,
                  class: "info"
                },
                vue.toDisplayString($setup.carInfo.getString("carVin", "")),
                1
                /* TEXT */
              )) : (vue.openBlock(), vue.createBlock(_component_i_input, {
                key: 1,
                modelValue: $setup.editInfo.carVin,
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.editInfo.carVin = $event),
                border: "none",
                inputAlign: "right",
                class: "input",
                placeholder: "请输入车架号"
              }, null, 8, ["modelValue"]))
            ]),
            vue.createElementVNode("view", { class: "list" }, [
              vue.createElementVNode("text", { class: "title" }, "发动机号"),
              !$setup.isEditing ? (vue.openBlock(), vue.createElementBlock(
                "text",
                {
                  key: 0,
                  class: "info"
                },
                vue.toDisplayString($setup.carInfo.getString("engineNum", "")),
                1
                /* TEXT */
              )) : (vue.openBlock(), vue.createBlock(_component_i_input, {
                key: 1,
                modelValue: $setup.editInfo.engineNum,
                "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $setup.editInfo.engineNum = $event),
                border: "none",
                inputAlign: "right",
                class: "input",
                placeholder: "请输入发动机号"
              }, null, 8, ["modelValue"]))
            ])
          ]),
          $setup.isEditing ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "button-group"
          }, [
            vue.createVNode(_component_i_button, {
              class: "action-button save-btn",
              type: "primary",
              loading: $setup.saving,
              onClick: $setup.saveChanges
            }, {
              default: vue.withCtx(() => [
                vue.createTextVNode("保存")
              ]),
              _: 1
              /* STABLE */
            }, 8, ["loading"]),
            vue.createVNode(_component_i_button, {
              class: "action-button cancel-btn",
              disabled: $setup.saving,
              onClick: $setup.cancelEdit
            }, {
              default: vue.withCtx(() => [
                vue.createTextVNode("取消")
              ]),
              _: 1
              /* STABLE */
            }, 8, ["disabled"])
          ])) : vue.createCommentVNode("v-if", true),
          vue.createVNode($setup["carIcons"], {
            show: $setup.carIconSelectorVisible,
            "onUpdate:show": $setup.updateCarIconSelectorVisible,
            onSelect: $setup.selectIcon
          }, null, 8, ["show"])
        ]),
        vue.createVNode(_component_app_toast)
      ],
      64
      /* STABLE_FRAGMENT */
    );
  }
  const PagesUserCenterCarDetailCarDetail = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["render", _sfc_render$9], ["styles", [_style_0$a]], ["__file", "/Users/xyhc/Documents/carConnectInternet/pages/userCenter/carDetail/carDetail.uvue"]]);
  const _sfc_main$9 = /* @__PURE__ */ vue.defineComponent(Object.assign({ name: "i-radio" }, { __name: "i-radio", props: {
    name: {
      type: [String, Number, Boolean],
      default: ""
    },
    modelValue: {
      type: [String, Number, Boolean],
      default: ""
    },
    value: {
      type: [String, Number, Boolean],
      default: ""
    },
    checked: {
      type: Boolean,
      default: false
    },
    shape: {
      type: String,
      default: "circle"
    },
    disabled: {
      type: Boolean,
      default: false
    },
    activeColor: {
      type: String,
      default: "#2979ff"
    },
    inactiveColor: {
      type: String,
      default: "#dcdfe6"
    },
    size: {
      type: [String, Number],
      default: 20
    },
    placement: {
      type: String,
      default: "row"
    },
    label: {
      type: String,
      default: ""
    },
    labelColor: {
      type: String,
      default: "#303133"
    },
    labelSize: {
      type: [String, Number],
      default: 14
    },
    labelDisabled: {
      type: Boolean,
      default: false
    },
    iconColor: {
      type: String,
      default: "#ffffff"
    },
    iconSize: {
      type: [String, Number],
      default: 14
    },
    borderBottom: {
      type: Boolean,
      default: false
    },
    iconPlacement: {
      type: String,
      default: "left"
    },
    activeLabelColor: {
      type: String,
      default: ""
    }
  }, emits: ["change", "update:modelValue", "update:value", "update:checked"], setup(__props, _a) {
    var __expose = _a.expose, __emit = _a.emit;
    __expose();
    const props = __props;
    const emit = __emit;
    function formatSize(value = null) {
      const text = value.toString();
      if (text.indexOf("px") >= 0 || text.indexOf("rpx") >= 0 || text.indexOf("%") >= 0) {
        return text;
      }
      return text + "px";
    }
    const checked = vue.computed(() => {
      if (props.checked)
        return true;
      const modelValueText = props.modelValue.toString();
      const value = modelValueText.length > 0 ? props.modelValue : props.value;
      return value.toString() == props.name.toString();
    });
    const wrapClass = vue.computed(() => {
      const classes = ["i-radio"];
      if (props.placement == "column")
        classes.push("i-radio--column");
      if (props.iconPlacement == "right")
        classes.push("i-radio--right");
      if (props.shape == "button")
        classes.push("i-radio--button");
      if (checked.value)
        classes.push("i-radio--checked");
      if (props.shape == "button" && checked.value)
        classes.push("i-radio--button-checked");
      if (props.disabled)
        classes.push("i-radio--disabled");
      if (props.borderBottom)
        classes.push("i-radio--border");
      return classes.join(" ");
    });
    const labelClass = vue.computed(() => {
      const classes = ["i-radio__label"];
      if (props.placement == "column")
        classes.push("i-radio__label--column");
      if (props.shape == "button")
        classes.push("i-radio__label--button");
      return classes.join(" ");
    });
    const boxStyle = vue.computed(() => {
      const circle = props.shape == "circle" || props.shape == "dot";
      return "width:" + formatSize(props.size) + ";height:" + formatSize(props.size) + ";border-radius:" + (circle ? formatSize(props.size) : "4px") + ";border-color:" + (checked.value ? props.activeColor : props.inactiveColor) + ";background-color:" + (checked.value && props.shape == "check" ? props.activeColor : "transparent") + ";";
    });
    const dotStyle = vue.computed(() => {
      return "background-color:" + props.activeColor + ";";
    });
    const checkStyle = vue.computed(() => {
      return "background-color:" + props.activeColor + ";color:" + props.iconColor + ";font-size:" + formatSize(parseFloat(props.iconSize.toString()) + 2) + ";";
    });
    const labelStyle = vue.computed(() => {
      let color = props.labelColor;
      if (checked.value && props.activeLabelColor.length > 0)
        color = props.activeLabelColor;
      return "color:" + color + ";font-size:" + formatSize(props.labelSize) + ";";
    });
    function select() {
      if (props.disabled)
        return null;
      emit("change", props.name);
      emit("update:modelValue", props.name);
      emit("update:value", props.name);
      emit("update:checked", true);
    }
    function selectByLabel() {
      if (props.labelDisabled)
        return null;
      select();
    }
    const __returned__ = { props, emit, formatSize, checked, wrapClass, labelClass, boxStyle, dotStyle, checkStyle, labelStyle, select, selectByLabel };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  } }));
  const _style_0$9 = { "i-radio": { "": { "minHeight": 32, "flexDirection": "row", "alignItems": "center" } }, "i-radio--right": { "": { "flexDirection": "row-reverse", "justifyContent": "space-between" } }, "i-radio--column": { "": { "flexDirection": "column", "alignItems": "flex-start" } }, "i-radio__label--column": { "": { "marginLeft": 0, "marginTop": 6 } }, "i-radio--button": { "": { "minWidth": 64, "minHeight": 34, "paddingTop": 7, "paddingRight": 12, "paddingBottom": 7, "paddingLeft": 12, "borderTopLeftRadius": 6, "borderTopRightRadius": 6, "borderBottomRightRadius": 6, "borderBottomLeftRadius": 6, "borderTopWidth": 1, "borderRightWidth": 1, "borderBottomWidth": 1, "borderLeftWidth": 1, "borderTopStyle": "solid", "borderRightStyle": "solid", "borderBottomStyle": "solid", "borderLeftStyle": "solid", "borderTopColor": "#dcdfe6", "borderRightColor": "#dcdfe6", "borderBottomColor": "#dcdfe6", "borderLeftColor": "#dcdfe6", "alignItems": "center", "justifyContent": "center" } }, "i-radio--button-checked": { "": { "borderTopColor": "#2979ff", "borderRightColor": "#2979ff", "borderBottomColor": "#2979ff", "borderLeftColor": "#2979ff", "backgroundColor": "#ecf5ff" } }, "i-radio--disabled": { "": { "opacity": 0.5 } }, "i-radio--border": { "": { "borderBottomWidth": 1, "borderBottomStyle": "solid", "borderBottomColor": "#eef0f4" } }, "i-radio__box": { "": { "borderTopWidth": 1, "borderRightWidth": 1, "borderBottomWidth": 1, "borderLeftWidth": 1, "borderTopStyle": "solid", "borderRightStyle": "solid", "borderBottomStyle": "solid", "borderLeftStyle": "solid", "alignItems": "center", "justifyContent": "center" } }, "i-radio__dot": { "": { "width": 10, "height": 10, "borderTopLeftRadius": 5, "borderTopRightRadius": 5, "borderBottomRightRadius": 5, "borderBottomLeftRadius": 5 } }, "i-radio__check": { "": { "lineHeight": "20px", "fontWeight": 700 } }, "i-radio__label": { "": { "marginLeft": 8, "lineHeight": "22px" } }, "i-radio__label--button": { "": { "marginLeft": 0, "textAlign": "center" } } };
  function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass($setup.wrapClass),
        onClick: $setup.select
      },
      [
        vue.renderSlot(_ctx.$slots, "icon", { checked: $setup.checked }, () => [
          $props.shape != "button" ? (vue.openBlock(), vue.createElementBlock(
            "view",
            {
              key: 0,
              class: "i-radio__box",
              style: vue.normalizeStyle($setup.boxStyle)
            },
            [
              $setup.checked && $props.shape != "check" ? (vue.openBlock(), vue.createElementBlock(
                "view",
                {
                  key: 0,
                  class: "i-radio__dot",
                  style: vue.normalizeStyle($setup.dotStyle)
                },
                null,
                4
                /* STYLE */
              )) : vue.createCommentVNode("v-if", true),
              $setup.checked && $props.shape == "check" ? (vue.openBlock(), vue.createElementBlock(
                "text",
                {
                  key: 1,
                  class: "i-radio__check",
                  style: vue.normalizeStyle($setup.checkStyle)
                },
                "✓",
                4
                /* STYLE */
              )) : vue.createCommentVNode("v-if", true)
            ],
            4
            /* STYLE */
          )) : vue.createCommentVNode("v-if", true)
        ]),
        vue.renderSlot(_ctx.$slots, "default", { checked: $setup.checked }, () => [
          vue.createElementVNode(
            "text",
            {
              class: vue.normalizeClass($setup.labelClass),
              style: vue.normalizeStyle($setup.labelStyle),
              onClick: vue.withModifiers($setup.selectByLabel, ["stop"])
            },
            vue.toDisplayString($props.label),
            7
            /* TEXT, CLASS, STYLE */
          )
        ])
      ],
      2
      /* CLASS */
    );
  }
  const __easycom_6 = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", _sfc_render$8], ["styles", [_style_0$9]], ["__file", "/Users/xyhc/Documents/carConnectInternet/uni_modules/i-ui-x/components/i-radio/i-radio.uvue"]]);
  const _sfc_main$8 = /* @__PURE__ */ vue.defineComponent(Object.assign({ name: "i-switch" }, { __name: "i-switch", props: {
    modelValue: {
      type: [Boolean, String, Number],
      default: ""
    },
    value: {
      type: [Boolean, String, Number],
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    shape: {
      type: String,
      default: "round"
    },
    size: {
      type: [String, Number],
      default: "26px"
    },
    width: {
      type: [String, Number],
      default: 0
    },
    activeColor: {
      type: String,
      default: "#2979ff"
    },
    inactiveColor: {
      type: String,
      default: "#dcdfe6"
    },
    activeValue: {
      type: [Boolean, String, Number],
      default: true
    },
    inactiveValue: {
      type: [Boolean, String, Number],
      default: false
    },
    asyncChange: {
      type: Boolean,
      default: false
    },
    space: {
      type: [String, Number],
      default: "2px"
    },
    textSpace: {
      type: [String, Number],
      default: 8
    },
    activeText: {
      type: String,
      default: ""
    },
    inactiveText: {
      type: String,
      default: ""
    },
    loadingMode: {
      type: String,
      default: "spinner"
    },
    loadingSize: {
      type: [String, Number],
      default: 15
    },
    loadingIcon: {
      type: String,
      default: "loading"
    }
  }, emits: ["update:modelValue", "update:value", "change"], setup(__props, _a) {
    var __expose = _a.expose, __emit = _a.emit;
    __expose();
    const props = __props;
    const emit = __emit;
    function initialValue() {
      if (props.modelValue.toString().length > 0)
        return props.modelValue;
      return props.value;
    }
    function formatSize(value = null) {
      const text = value.toString();
      if (text.indexOf("px") >= 0 || text.indexOf("rpx") >= 0 || text.indexOf("%") >= 0) {
        return text;
      }
      return text + "px";
    }
    function numericSize(value = null, fallback) {
      const text = value.toString().replace("px", "").replace("rpx", "").replace("%", "");
      const numberValue = parseFloat(text);
      if (isNaN(numberValue))
        return fallback;
      return numberValue;
    }
    const current = vue.ref(initialValue());
    const checked = vue.computed(() => {
      return current.value.toString() == props.activeValue.toString();
    });
    const switchClass = vue.computed(() => {
      const classes = ["i-switch"];
      if (checked.value)
        classes.push("i-switch--checked");
      if (props.disabled || props.loading)
        classes.push("i-switch--disabled");
      if (props.shape == "square")
        classes.push("i-switch--square");
      return classes.join(" ");
    });
    const switchStyle = vue.computed(() => {
      const height = numericSize(props.size, 26);
      const width = numericSize(props.width, 0) > 0 ? numericSize(props.width, 0) : height * 2;
      return "width:" + formatSize(width) + ";height:" + formatSize(height) + ";padding:" + formatSize(props.space) + ";border-radius:" + (props.shape == "square" ? "4px" : formatSize(height)) + ";background-color:" + (checked.value ? props.activeColor : props.inactiveColor) + ";margin-left:" + formatSize(props.textSpace) + ";margin-right:" + formatSize(props.textSpace) + ";";
    });
    const thumbStyle = vue.computed(() => {
      const height = numericSize(props.size, 26);
      const space = numericSize(props.space, 2);
      const thumb = height - space * 2;
      const width = numericSize(props.width, 0) > 0 ? numericSize(props.width, 0) : height * 2;
      const offset = checked.value ? width - thumb - space * 2 : 0;
      return "width:" + formatSize(thumb) + ";height:" + formatSize(thumb) + ";border-radius:" + (props.shape == "square" ? "3px" : formatSize(thumb)) + ";margin-left:" + formatSize(offset) + ";";
    });
    const loadingStyle = vue.computed(() => {
      return "font-size:" + formatSize(props.loadingSize) + ";";
    });
    vue.watch(() => {
      return props.modelValue;
    }, () => {
      current.value = initialValue();
    });
    vue.watch(() => {
      return props.value;
    }, () => {
      current.value = initialValue();
    });
    function toggle() {
      if (props.disabled || props.loading)
        return null;
      const nextValue = checked.value ? props.inactiveValue : props.activeValue;
      if (!props.asyncChange)
        current.value = nextValue;
      emit("change", nextValue);
      emit("update:modelValue", nextValue);
      emit("update:value", nextValue);
    }
    const __returned__ = { props, emit, initialValue, formatSize, numericSize, current, checked, switchClass, switchStyle, thumbStyle, loadingStyle, toggle };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  } }));
  const _style_0$8 = { "i-switch-wrap": { "": { "flexDirection": "row", "alignItems": "center" } }, "i-switch": { "": { "position": "relative", "flexDirection": "row", "alignItems": "center", "backgroundColor": "#ffffff", "borderTopWidth": 1, "borderRightWidth": 1, "borderBottomWidth": 1, "borderLeftWidth": 1, "borderTopStyle": "solid", "borderRightStyle": "solid", "borderBottomStyle": "solid", "borderLeftStyle": "solid", "borderTopColor": "rgba(0,0,0,0.08)", "borderRightColor": "rgba(0,0,0,0.08)", "borderBottomColor": "rgba(0,0,0,0.08)", "borderLeftColor": "rgba(0,0,0,0.08)" } }, "i-switch--disabled": { "": { "opacity": 0.55 } }, "i-switch__thumb": { "": { "backgroundColor": "#ffffff", "boxShadow": "0 1px 4px rgba(0, 0, 0, 0.18)" } }, "i-switch__loading": { "": { "position": "absolute", "left": "50%", "top": "50%", "transform": "translate(-50%, -50%)", "color": "#909399", "lineHeight": "18px" } }, "i-switch__side-text": { "": { "color": "#606266", "fontSize": 13, "lineHeight": "20px" } } };
  function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "i-switch-wrap" }, [
      $props.inactiveText.length > 0 ? (vue.openBlock(), vue.createElementBlock(
        "text",
        {
          key: 0,
          class: "i-switch__side-text"
        },
        vue.toDisplayString($props.inactiveText),
        1
        /* TEXT */
      )) : vue.createCommentVNode("v-if", true),
      vue.createElementVNode(
        "view",
        {
          class: vue.normalizeClass($setup.switchClass),
          style: vue.normalizeStyle($setup.switchStyle),
          onClick: $setup.toggle
        },
        [
          $props.loading ? (vue.openBlock(), vue.createElementBlock(
            "text",
            {
              key: 0,
              class: "i-switch__loading",
              style: vue.normalizeStyle($setup.loadingStyle)
            },
            vue.toDisplayString($props.loadingMode == "spinner" ? "..." : $props.loadingIcon),
            5
            /* TEXT, STYLE */
          )) : vue.createCommentVNode("v-if", true),
          vue.createElementVNode(
            "view",
            {
              class: "i-switch__thumb",
              style: vue.normalizeStyle($setup.thumbStyle)
            },
            null,
            4
            /* STYLE */
          )
        ],
        6
        /* CLASS, STYLE */
      ),
      $props.activeText.length > 0 ? (vue.openBlock(), vue.createElementBlock(
        "text",
        {
          key: 1,
          class: "i-switch__side-text"
        },
        vue.toDisplayString($props.activeText),
        1
        /* TEXT */
      )) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const __easycom_7 = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$7], ["styles", [_style_0$8]], ["__file", "/Users/xyhc/Documents/carConnectInternet/uni_modules/i-ui-x/components/i-switch/i-switch.uvue"]]);
  class PaginationState extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            pageNum: { type: Number, optional: false },
            pageSize: { type: Number, optional: false },
            hasMore: { type: Boolean, optional: false },
            loadingMore: { type: Boolean, optional: false }
          };
        },
        name: "PaginationState"
      };
    }
    constructor(options, metadata = PaginationState.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.pageNum = this.__props__.pageNum;
      this.pageSize = this.__props__.pageSize;
      this.hasMore = this.__props__.hasMore;
      this.loadingMore = this.__props__.loadingMore;
      delete this.__props__;
    }
  }
  class Pagination extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            bind: { type: PaginationState, optional: false },
            unbind: { type: PaginationState, optional: false }
          };
        },
        name: "Pagination"
      };
    }
    constructor(options, metadata = Pagination.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.bind = this.__props__.bind;
      this.unbind = this.__props__.unbind;
      delete this.__props__;
    }
  }
  class CircleData extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            latitude: { type: Number, optional: false },
            longitude: { type: Number, optional: false },
            radius: { type: Number, optional: false }
          };
        },
        name: "CircleData"
      };
    }
    constructor(options, metadata = CircleData.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.latitude = this.__props__.latitude;
      this.longitude = this.__props__.longitude;
      this.radius = this.__props__.radius;
      delete this.__props__;
    }
  }
  class ModalResult extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            confirm: { type: Boolean, optional: false }
          };
        },
        name: "ModalResult"
      };
    }
    constructor(options, metadata = ModalResult.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.confirm = this.__props__.confirm;
      delete this.__props__;
    }
  }
  class FenceForm extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            name: { type: String, optional: false },
            alarmType: { type: String, optional: false }
          };
        },
        name: "FenceForm"
      };
    }
    constructor(options, metadata = FenceForm.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.name = this.__props__.name;
      this.alarmType = this.__props__.alarmType;
      delete this.__props__;
    }
  }
  class FenceResponse extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            code: { type: Number, optional: false },
            msg: { type: String, optional: false }
          };
        },
        name: "FenceResponse"
      };
    }
    constructor(options, metadata = FenceResponse.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.code = this.__props__.code;
      this.msg = this.__props__.msg;
      delete this.__props__;
    }
  }
  class SwitchChangeEvent extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            value: { type: Boolean, optional: false }
          };
        },
        name: "SwitchChangeEvent"
      };
    }
    constructor(options, metadata = SwitchChangeEvent.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.value = this.__props__.value;
      delete this.__props__;
    }
  }
  class CoordinateBounds extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            minLat: { type: Number, optional: false },
            maxLat: { type: Number, optional: false },
            minLng: { type: Number, optional: false },
            maxLng: { type: Number, optional: false }
          };
        },
        name: "CoordinateBounds"
      };
    }
    constructor(options, metadata = CoordinateBounds.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.minLat = this.__props__.minLat;
      this.maxLat = this.__props__.maxLat;
      this.minLng = this.__props__.minLng;
      this.maxLng = this.__props__.maxLng;
      delete this.__props__;
    }
  }
  const _sfc_main$7 = /* @__PURE__ */ vue.defineComponent({
    __name: "geofencing",
    setup(__props, _a) {
      var __expose = _a.expose;
      __expose();
      const imei = vue.ref(null);
      const connectionStatus = vue.ref(null);
      const deptId = vue.ref(null);
      const carType = vue.ref(null);
      const deviceName = vue.ref(null);
      const center = vue.reactive(new UTSJSONObject({
        latitude: 39.90469,
        longitude: 116.40717
      }));
      const mapScale = vue.ref(15);
      const markers = vue.ref([]);
      const carMarker = vue.ref(null);
      const circles = vue.ref([]);
      const carInFence = vue.ref(false);
      const isDrawing = vue.ref(false);
      const drawingMode = vue.ref("polygon");
      const points = vue.ref([]);
      const polygons = vue.ref([]);
      const circleCenter = vue.ref(null);
      const circleRadius = vue.ref(0);
      const currentSpeed = vue.ref(0);
      const currentAddress = vue.ref("获取中...");
      const currentCar = vue.ref("京A12345");
      const lastDirection = vue.ref(0);
      const showFenceModal = vue.ref(null);
      const fenceList = vue.ref([]);
      const selectedFence = vue.ref(null);
      const fencesPopup = vue.ref(null);
      const editDialogPopup = vue.ref(null);
      const editingFence = vue.ref(null);
      const alarmTypeOptions = ["0", "1", "2", "3"];
      const fenceForm = vue.reactive(new FenceForm({
        name: "",
        alarmType: "1"
      }));
      const deviceDialogPopup = vue.ref(null);
      const activeTab = vue.ref("bind");
      const deviceList = vue.ref([]);
      const boundDevices = vue.ref([]);
      const currentFenceName = vue.ref("");
      const currentFenceId = vue.ref("");
      const loading = vue.ref(false);
      const scrollTop = vue.ref(0);
      let loadMoreTimer = null;
      const pagination = vue.reactive(new Pagination({
        bind: new PaginationState({
          pageNum: 1,
          pageSize: 10,
          hasMore: true,
          loadingMore: false
          // 加载更多中状态
        }),
        unbind: new PaginationState({
          pageNum: 1,
          pageSize: 10,
          hasMore: true,
          loadingMore: false
        })
      }));
      const canFinishDrawing = vue.computed(() => {
        if (drawingMode.value === "polygon") {
          return points.value.length >= 3;
        } else if (drawingMode.value === "circle") {
          return circleCenter.value !== null && circleRadius.value > 0;
        }
        return false;
      });
      const loadingMore = vue.computed(() => {
        return activeTab.value === "bind" ? pagination.bind.loadingMore : pagination.unbind.loadingMore;
      });
      const hasMore = vue.computed(() => {
        return activeTab.value === "bind" ? pagination.bind.hasMore : pagination.unbind.hasMore;
      });
      const loadInitialPosition = () => {
        return __awaiter(this, void 0, void 0, function* () {
          uni.showLoading(new UTSJSONObject({
            title: "获取车辆位置中..."
          }));
          try {
            const data = new UTSJSONObject({ deptId: deptId.value, deviceids: imei.value });
            const res = yield getDevicePos(data);
            res.data.forEach((item) => {
              if (item.getString("imei", "") == imei.value) {
                const deviceData = item;
                const convertedCoord = CoordTransform.wgs84ToTencent(deviceData.getNumber("latitude", 0), deviceData.getNumber("longitude", 0));
                center.latitude = convertedCoord.lat;
                center.longitude = convertedCoord.lng;
                const position = {
                  latitude: convertedCoord.lat,
                  longitude: convertedCoord.lng
                };
                lastDirection.value = deviceData.getNumber("direction", 0);
                carMarker.value = {
                  id: 0,
                  latitude: position.latitude,
                  longitude: position.longitude,
                  iconPath: getDeviceIcon(connectionStatus.value.toString(), carType.value.toString()),
                  width: 25,
                  height: 25,
                  rotate: lastDirection.value >= 360 ? lastDirection.value - 360 : lastDirection.value < 0 ? lastDirection.value + 360 : lastDirection.value,
                  callout: new UTSJSONObject({
                    content: deviceName.value || "爱车位置",
                    color: connectionStatus.value == "online" ? "#fff" : "#666",
                    bgColor: connectionStatus.value == "online" ? "#07C160" : "#ccc",
                    padding: 5,
                    borderRadius: 4,
                    display: "ALWAYS"
                  })
                };
                const marker = carMarker.value;
                if (marker != null) {
                  markers.value = [marker];
                }
                currentSpeed.value = deviceData.speed ? parseFloat(deviceData.speed.toString()) : 0;
                currentAddress.value = deviceData.positionUpdateTime ? "最后定位: ".concat(deviceData.positionUpdateTime) : "未知位置";
                connectionStatus.value = deviceData.connectionStatus ? deviceData.connectionStatus.toString() : "unknown";
              }
            });
          } catch (err) {
            uni.__log__("error", "at pages/geofencing/geofencing.uvue:357", "获取初始位置失败:", err);
            showAppToast({
              title: "获取车辆位置失败",
              icon: "none"
            });
          } finally {
            uni.hideLoading();
          }
        });
      };
      function calculateMapRotation(direction) {
        let rotation = direction;
        if (rotation >= 360)
          rotation -= 360;
        if (rotation < 0)
          rotation += 360;
        return rotation;
      }
      function getFenceType(fence) {
        const type = fence.getString("type", "");
        if (type && type !== "null") {
          return type;
        }
        const area = fence.getString("area", "");
        if (area.startsWith("CIRCLE")) {
          return "circle";
        } else if (area.startsWith("POLYGON")) {
          return "polygon";
        }
        return "polygon";
      }
      function isValidCoordinate(latitude, longitude) {
        return isFinite(latitude) && isFinite(longitude) && latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180;
      }
      function parsePolygon(polygonStr) {
        if (!polygonStr)
          return [];
        const coordStr = polygonStr.replace(/POLYGON \(\(/, "").replace(/\)\)/, "");
        const points2 = [];
        coordStr.split(",").forEach((point) => {
          const values = point.trim().split(/\s+/);
          if (values.length != 2)
            return null;
          const latitude = parseFloat(values[0]);
          const longitude = parseFloat(values[1]);
          if (!isValidCoordinate(latitude, longitude))
            return null;
          const convertedCoord = CoordTransform.wgs84ToTencent(latitude, longitude);
          points2.push({
            latitude: convertedCoord.lat,
            longitude: convertedCoord.lng
          });
        });
        return points2;
      }
      function parseCircle(circleStr) {
        if (!circleStr || !circleStr.startsWith("CIRCLE"))
          return null;
        try {
          const coordStr = circleStr.replace(/CIRCLE \(/, "").replace(/\)/, "");
          const parts = coordStr.split(",");
          if (parts.length != 2)
            return null;
          const centerValues = parts[0].trim().split(/\s+/);
          if (centerValues.length != 2)
            return null;
          const lat = parseFloat(centerValues[0]);
          const lng = parseFloat(centerValues[1]);
          const radius = parseFloat(parts[1].trim());
          if (!isValidCoordinate(lat, lng) || !isFinite(radius) || radius <= 0) {
            uni.__log__("error", "at pages/geofencing/geofencing.uvue:427", "无效的圆形围栏数据:", circleStr);
            return null;
          }
          const convertedCoord = CoordTransform.wgs84ToTencent(lat, lng);
          return {
            latitude: convertedCoord.lat,
            longitude: convertedCoord.lng,
            radius
          };
        } catch (error) {
          uni.__log__("error", "at pages/geofencing/geofencing.uvue:437", "解析圆形围栏失败:", error, "数据:", circleStr);
          return null;
        }
      }
      function updateMarkers() {
        const newMarkers = [];
        if (carMarker.value) {
          newMarkers.push(carMarker.value);
        }
        if (isDrawing.value) {
          if (drawingMode.value === "polygon") {
            points.value.forEach((point, index) => {
              newMarkers.push({
                id: 1e3 + index,
                latitude: point.latitude,
                longitude: point.longitude,
                iconPath: "/static/marker.png",
                width: 32,
                height: 32,
                callout: new UTSJSONObject({ content: "顶点".concat(index + 1), display: "ALWAYS" }),
                anchor: { x: 0.5, y: 0.5 }
              });
            });
          } else if (drawingMode.value === "circle" && circleCenter.value) {
            newMarkers.push({
              id: 1e3,
              latitude: circleCenter.value.latitude,
              longitude: circleCenter.value.longitude,
              iconPath: "/static/marker.png",
              width: 32,
              height: 32,
              callout: new UTSJSONObject({ content: "圆心", display: "ALWAYS" }),
              anchor: { x: 0.5, y: 0.5 }
            });
          }
        } else {
          const selected = selectedFence.value;
          if (selected == null) {
            markers.value = newMarkers;
            return null;
          }
          const fenceType = getFenceType(selected);
          const area = selected.getString("area", "");
          if (fenceType === "circle") {
            const circleData = parseCircle(area);
            if (circleData != null) {
              newMarkers.push({
                id: 2e3,
                latitude: circleData.latitude,
                longitude: circleData.longitude,
                iconPath: "/static/marker.png",
                width: 32,
                height: 32,
                callout: new UTSJSONObject({ content: "圆心", display: "ALWAYS" }),
                anchor: { x: 0.5, y: 0.5 }
              });
            }
          } else {
            const fencePoints = parsePolygon(area);
            fencePoints.forEach((point, index) => {
              newMarkers.push({
                id: 2e3 + index,
                latitude: point.latitude,
                longitude: point.longitude,
                iconPath: "/static/marker.png",
                width: 32,
                height: 32,
                callout: new UTSJSONObject({ content: "顶点".concat(index + 1), display: "ALWAYS" }),
                anchor: { x: 0.5, y: 0.5 }
              });
            });
          }
        }
        markers.value = newMarkers;
      }
      const renderFencesOnMap = () => {
        if (!fenceList.value || fenceList.value.length == 0) {
          polygons.value = [];
          circles.value = [];
          updateMarkers();
          return null;
        }
        const fencePolygons = [];
        const fenceCircles = [];
        let colorIndex = 0;
        fenceList.value.forEach((fence) => {
          const fenceType = getFenceType(fence);
          if (fenceType === "circle") {
            const circleData = parseCircle(fence.getString("area", ""));
            if (circleData != null) {
              const displayRadius = circleData.radius > 1e5 ? 1e5 : circleData.radius;
              fenceCircles.push({
                latitude: circleData.latitude,
                longitude: circleData.longitude,
                radius: displayRadius,
                strokeWidth: 2,
                color: "#FF0000",
                fillColor: "rgba(255,0,0,0.2)"
              });
            }
          } else {
            const fencePoints = parsePolygon(fence.getString("area", ""));
            if (fencePoints.length >= 3) {
              fencePolygons.push({
                points: fencePoints,
                strokeWidth: 2,
                strokeColor: "#FF0000",
                fillColor: colorIndex++ == 0 ? "rgba(255,0,0,0.2)" : "rgba(".concat(Math.floor(Math.random() * 200), ",").concat(Math.floor(Math.random() * 200), ",").concat(Math.floor(Math.random() * 200), ",0.2)"),
                zIndex: 1
              });
            }
          }
        });
        polygons.value = fencePolygons;
        circles.value = fenceCircles;
        if (fenceCircles.length > 0 && !selectedFence.value) {
          const firstCircle = fenceCircles[0];
          center.latitude = firstCircle.latitude;
          center.longitude = firstCircle.longitude;
          mapScale.value = firstCircle.radius > 5e4 ? 8 : firstCircle.radius > 2e4 ? 9 : firstCircle.radius > 1e4 ? 10 : firstCircle.radius > 5e3 ? 11 : firstCircle.radius > 2e3 ? 12 : firstCircle.radius > 1e3 ? 13 : firstCircle.radius > 500 ? 14 : firstCircle.radius > 200 ? 15 : 16;
        }
      };
      function updateMapDisplay() {
        updateMarkers();
        if (isDrawing.value) {
          if (drawingMode.value === "polygon") {
            polygons.value = points.value.length >= 3 ? [{
              points: points.value,
              strokeWidth: 2,
              strokeColor: "#FF0000",
              fillColor: "rgba(255,0,0,0.2)",
              zIndex: 1
            }] : [];
            circles.value = [];
          } else if (drawingMode.value === "circle") {
            const drawingCenter = circleCenter.value;
            if (drawingCenter != null && circleRadius.value > 0) {
              const drawingCircle = {
                latitude: drawingCenter.latitude,
                longitude: drawingCenter.longitude,
                radius: circleRadius.value,
                strokeWidth: 2,
                color: "#FF0000",
                fillColor: "rgba(255,0,0,0.2)"
              };
              circles.value = [drawingCircle];
            } else {
              circles.value = [];
            }
            polygons.value = [];
          }
        } else {
          renderFencesOnMap();
        }
      }
      const loadGeofenceList = () => {
        return __awaiter(this, void 0, void 0, function* () {
          try {
            const res = yield getGeofenceList();
            if (res.code == 0) {
              fenceList.value = res.data;
            } else {
              showAppToast({ title: "获取围栏列表失败", icon: "none" });
              fenceList.value = [];
            }
            renderFencesOnMap();
          } catch (error) {
            uni.__log__("error", "at pages/geofencing/geofencing.uvue:632", "加载围栏列表失败:", error);
            showAppToast({ title: "获取围栏列表失败", icon: "none" });
            fenceList.value = [];
            renderFencesOnMap();
          }
        });
      };
      const generatePolygonString = (points2) => {
        const coords = points2.map((point) => {
          const originalCoord = CoordTransform.tencentToWgs84(point.latitude, point.longitude);
          return "".concat(originalCoord.lat, " ").concat(originalCoord.lng);
        }).join(", ");
        return "POLYGON ((".concat(coords, "))");
      };
      const generateCircleString = (center2, radius) => {
        const originalCoord = CoordTransform.tencentToWgs84(center2.latitude, center2.longitude);
        return "CIRCLE (".concat(originalCoord.lat, " ").concat(originalCoord.lng, ", ").concat(radius, ")");
      };
      const calculateZoomLevelFromRadius = (radius) => {
        if (radius > 5e4)
          return 8;
        if (radius > 2e4)
          return 9;
        if (radius > 1e4)
          return 10;
        if (radius > 5e3)
          return 11;
        if (radius > 2e3)
          return 12;
        if (radius > 1e3)
          return 13;
        if (radius > 500)
          return 14;
        if (radius > 200)
          return 15;
        return 16;
      };
      const calculateBounds = (points2) => {
        let minLat = points2[0].latitude;
        let maxLat = points2[0].latitude;
        let minLng = points2[0].longitude;
        let maxLng = points2[0].longitude;
        points2.forEach((point) => {
          minLat = Math.min(minLat, point.latitude);
          maxLat = Math.max(maxLat, point.latitude);
          minLng = Math.min(minLng, point.longitude);
          maxLng = Math.max(maxLng, point.longitude);
        });
        return new CoordinateBounds({ minLat, maxLat, minLng, maxLng });
      };
      const setMapCenterToFence = (fence) => {
        const fenceType = getFenceType(fence);
        const area = fence.getString("area", "");
        if (fenceType === "circle") {
          const circleData = parseCircle(area);
          if (circleData != null) {
            center.latitude = circleData.latitude;
            center.longitude = circleData.longitude;
            const displayRadius = circleData.radius > 1e5 ? 1e5 : circleData.radius;
            mapScale.value = calculateZoomLevelFromRadius(displayRadius);
          }
        } else {
          const fencePoints = parsePolygon(area);
          if (fencePoints.length == 0)
            return null;
          let totalLat = 0;
          let totalLng = 0;
          fencePoints.forEach((point) => {
            totalLat += point.latitude;
            totalLng += point.longitude;
          });
          center.latitude = totalLat / fencePoints.length;
          center.longitude = totalLng / fencePoints.length;
          const bounds = calculateBounds(fencePoints);
          const latDiff = bounds.maxLat - bounds.minLat;
          const lngDiff = bounds.maxLng - bounds.minLng;
          const maxDiff = Math.max(latDiff, lngDiff);
          if (maxDiff > 0.1)
            mapScale.value = 11;
          else if (maxDiff > 0.05)
            mapScale.value = 12;
          else if (maxDiff > 0.02)
            mapScale.value = 13;
          else
            mapScale.value = 14;
        }
      };
      const showFenceList = () => {
        var _a2;
        (_a2 = fencesPopup.value) === null || _a2 === void 0 ? null : _a2.$callMethod("open");
      };
      const selectFence = (fence) => {
        var _a2, _b;
        selectedFence.value = fence;
        (_a2 = fencesPopup.value) === null || _a2 === void 0 ? null : _a2.$callMethod("close");
        (_b = showFenceModal.value) === null || _b === void 0 ? null : _b.$callMethod("open");
        const fenceType = getFenceType(fence);
        const area = fence.getString("area", "");
        if (fenceType === "circle") {
          const circleData = parseCircle(area);
          if (circleData != null) {
            circleCenter.value = { latitude: circleData.latitude, longitude: circleData.longitude };
            circleRadius.value = circleData.radius;
            points.value = [];
          }
        } else {
          const fencePoints = parsePolygon(area);
          points.value = fencePoints;
          circleCenter.value = null;
          circleRadius.value = 0;
        }
        setMapCenterToFence(fence);
        updateMapDisplay();
      };
      const editFence = (fence) => {
        var _a2;
        editingFence.value = fence;
        fenceForm.name = fence.getString("name", "");
        const alarmTypeText = fence.getString("alarmType", "");
        const alarmType = alarmTypeText.length > 0 ? alarmTypeText : fence.getNumber("alarmType", 1).toString();
        fenceForm.alarmType = alarmTypeOptions.includes(alarmType) ? alarmType : "1";
        const fenceType = getFenceType(fence);
        drawingMode.value = fenceType;
        const area = fence.getString("area", "");
        if (fenceType === "circle") {
          const circleData = parseCircle(area);
          if (circleData != null) {
            circleCenter.value = {
              latitude: circleData.latitude,
              longitude: circleData.longitude
            };
            circleRadius.value = circleData.radius;
            points.value = [];
          }
        } else {
          const fencePoints = parsePolygon(area);
          if (fencePoints.length >= 3) {
            points.value = fencePoints;
            circleCenter.value = null;
            circleRadius.value = 0;
          }
        }
        updateMapDisplay();
        (_a2 = editDialogPopup.value) === null || _a2 === void 0 ? null : _a2.$callMethod("open");
      };
      function deleteFenceById(id) {
        var _a2;
        return __awaiter(this, void 0, void 0, function* () {
          try {
            const result = yield deleteGeofence(id);
            if (result.code == 0) {
              showAppToast({ title: "删除成功" });
              selectedFence.value = null;
              points.value = [];
              circleCenter.value = null;
              circleRadius.value = 0;
              isDrawing.value = false;
              polygons.value = [];
              circles.value = [];
              updateMarkers();
              (_a2 = showFenceModal.value) === null || _a2 === void 0 ? null : _a2.$callMethod("close");
              yield loadGeofenceList();
            } else {
              showAppToast({ title: "删除失败", icon: "none" });
            }
          } catch (error) {
            uni.__log__("error", "at pages/geofencing/geofencing.uvue:840", "删除围栏失败:", error);
            showAppToast({ title: "删除失败", icon: "none" });
          }
        });
      }
      const deleteFence = (id) => {
        uni.showModal(new UTSJSONObject({
          title: "确认删除",
          content: "确定要删除这个围栏吗？",
          success: (res) => {
            if (res.confirm) {
              void deleteFenceById(id.toString());
            }
          }
        }));
      };
      const saveFence = () => {
        return __awaiter(this, void 0, void 0, function* () {
          var _a2, _b;
          if (!fenceForm.name) {
            showAppToast({ title: "请输入围栏名称", icon: "none" });
            return Promise.resolve(null);
          }
          let area = "";
          if (editingFence.value) {
            if (drawingMode.value === "polygon" && points.value.length >= 3) {
              area = generatePolygonString(points.value);
            } else if (drawingMode.value === "circle" && circleCenter.value && circleRadius.value > 0) {
              area = generateCircleString(circleCenter.value, circleRadius.value);
            } else {
              area = editingFence.value.getString("area", "");
            }
          } else {
            if (drawingMode.value === "polygon" && points.value.length < 3) {
              showAppToast({ title: "请绘制有效的围栏区域（至少3个顶点）", icon: "none" });
              return Promise.resolve(null);
            } else if (drawingMode.value === "circle" && (!circleCenter.value || circleRadius.value <= 0)) {
              showAppToast({ title: "请绘制有效的圆形围栏", icon: "none" });
              return Promise.resolve(null);
            }
            if (drawingMode.value === "polygon") {
              area = generatePolygonString(points.value);
            } else if (drawingMode.value === "circle" && circleCenter.value) {
              area = generateCircleString(circleCenter.value, circleRadius.value);
            }
          }
          if (!area) {
            showAppToast({ title: "围栏数据无效，请重新绘制", icon: "none" });
            return Promise.resolve(null);
          }
          if (!alarmTypeOptions.includes(fenceForm.alarmType)) {
            showAppToast({ title: "请选择有效的告警类型", icon: "none" });
            return Promise.resolve(null);
          }
          const fenceData = new UTSJSONObject({
            name: fenceForm.name,
            area,
            alarmType: parseInt(fenceForm.alarmType),
            type: drawingMode.value
          });
          try {
            let result = null;
            if (editingFence.value) {
              uni.showLoading(new UTSJSONObject({ title: "更新中..." }));
              result = yield updateGeofence(new UTSJSONObject(Object.assign({ id: editingFence.value.id }, fenceData)));
            } else {
              uni.showLoading(new UTSJSONObject({ title: "保存中..." }));
              result = yield addGeofence(fenceData);
            }
            uni.hideLoading();
            if (result.code == 0) {
              showAppToast({ title: editingFence.value ? "更新成功" : "保存成功" });
              (_a2 = editDialogPopup.value) === null || _a2 === void 0 ? null : _a2.$callMethod("close");
              const tempFence = editingFence.value;
              editingFence.value = null;
              isDrawing.value = false;
              points.value = [];
              circleCenter.value = null;
              circleRadius.value = 0;
              yield loadGeofenceList();
              if (tempFence) {
                selectedFence.value = null;
                (_b = showFenceModal.value) === null || _b === void 0 ? null : _b.$callMethod("close");
              }
            } else {
              showAppToast({ title: result.msg || "保存失败", icon: "none" });
            }
          } catch (error) {
            uni.hideLoading();
            uni.__log__("error", "at pages/geofencing/geofencing.uvue:951", "保存围栏失败:", error);
            showAppToast({ title: "保存失败，请重试", icon: "none" });
          }
        });
      };
      function resetPagination(page) {
        page.pageNum = 1;
        page.pageSize = 10;
        page.hasMore = true;
        page.loadingMore = false;
      }
      function initPagination(tabType) {
        if (tabType == "bind") {
          resetPagination(pagination.bind);
        } else {
          resetPagination(pagination.unbind);
        }
        if (activeTab.value == tabType) {
          deviceList.value = [];
        }
      }
      function loadBoundDevices(fenceId) {
        return __awaiter(this, void 0, void 0, function* () {
          const page = pagination.bind;
          if (!page.hasMore || page.loadingMore)
            return Promise.resolve(null);
          page.loadingMore = true;
          try {
            const res = yield getBoundDevices(new UTSJSONObject({
              pageNum: page.pageNum,
              pageSize: page.pageSize,
              geoId: fenceId
            }));
            if (res.code == 0) {
              const dataList = res.data.list || [];
              if (page.pageNum == 1) {
                boundDevices.value = dataList;
                deviceList.value = dataList;
              } else {
                deviceList.value = [...deviceList.value, ...dataList];
              }
              page.hasMore = dataList.length === page.pageSize;
              if (page.hasMore)
                page.pageNum++;
            } else {
              page.hasMore = false;
            }
          } catch (error) {
            page.hasMore = false;
          } finally {
            page.loadingMore = false;
          }
        });
      }
      function loadUnboundDevices() {
        return __awaiter(this, void 0, void 0, function* () {
          const page = pagination.unbind;
          if (!page.hasMore || page.loadingMore)
            return Promise.resolve(null);
          page.loadingMore = true;
          try {
            const res = yield getUnboundDevices(new UTSJSONObject({
              pageNum: page.pageNum,
              pageSize: page.pageSize
            }));
            if (res.code == 0) {
              const dataList = res.data.list || [];
              if (page.pageNum == 1) {
                deviceList.value = dataList;
              } else {
                deviceList.value = [...deviceList.value, ...dataList];
              }
              page.hasMore = dataList.length === page.pageSize;
              if (page.hasMore)
                page.pageNum++;
            } else {
              page.hasMore = false;
            }
          } catch (error) {
            page.hasMore = false;
          } finally {
            page.loadingMore = false;
          }
        });
      }
      const showBindDevices = (fenceId) => {
        return __awaiter(this, void 0, void 0, function* () {
          var _a2;
          currentFenceId.value = fenceId;
          const selected = selectedFence.value;
          currentFenceName.value = selected != null ? selected.getString("name", "") : "";
          (_a2 = deviceDialogPopup.value) === null || _a2 === void 0 ? null : _a2.$callMethod("open");
          activeTab.value = "bind";
          scrollTop.value = 0;
          initPagination("bind");
          yield loadBoundDevices(fenceId);
        });
      };
      const switchTab = (tab) => {
        return __awaiter(this, void 0, void 0, function* () {
          uni.__log__("log", "at pages/geofencing/geofencing.uvue:1052", "switchTab", tab, currentFenceId.value);
          if (activeTab.value === tab)
            return Promise.resolve(null);
          activeTab.value = tab;
          scrollTop.value = 0;
          deviceList.value = [];
          initPagination(tab);
          if (tab === "bind") {
            uni.__log__("log", "at pages/geofencing/geofencing.uvue:1064", "switchTab,bind:", currentFenceId.value);
            yield loadBoundDevices(currentFenceId.value);
          } else {
            yield loadUnboundDevices();
          }
        });
      };
      const handleLoadMore = () => {
        if (loadingMore.value || !hasMore.value)
          return null;
        if (activeTab.value === "bind") {
          loadBoundDevices(currentFenceId.value);
        } else {
          loadUnboundDevices();
        }
      };
      const toggleDeviceBinding = (deviceImei, bound) => {
        return __awaiter(this, void 0, void 0, function* () {
          uni.__log__("log", "at pages/geofencing/geofencing.uvue:1084", "toggleDeviceBinding", deviceImei, bound);
          loading.value = true;
          try {
            const params = new UTSJSONObject({
              geofenceId: currentFenceId.value,
              imeis: [deviceImei]
            });
            uni.__log__("log", "at pages/geofencing/geofencing.uvue:1091", "toggleDeviceBindingparams", params);
            let result = null;
            if (bound) {
              result = yield bindDevices(params);
            } else {
              result = yield unbindDevices(params);
            }
            if (result.code == 0) {
              showAppToast({ title: bound ? "绑定成功" : "解绑成功" });
              initPagination(activeTab.value);
              scrollTop.value = 0;
              if (activeTab.value === "bind") {
                yield loadBoundDevices(currentFenceId.value);
              } else {
                yield loadUnboundDevices();
              }
            } else {
              showAppToast({ title: result.msg || "操作失败", icon: "none" });
            }
          } catch (error) {
            uni.__log__("error", "at pages/geofencing/geofencing.uvue:1114", "设备绑定操作失败:", error);
            showAppToast({ title: "操作失败", icon: "none" });
          } finally {
            loading.value = false;
          }
        });
      };
      const isDeviceBound = (deviceImei) => {
        return boundDevices.value.some((device) => {
          return device.getString("imei", "") === deviceImei;
        });
      };
      const setDrawingMode = (mode) => {
        drawingMode.value = mode;
        if (isDrawing.value) {
          points.value = [];
          circleCenter.value = null;
          circleRadius.value = 0;
          updateMapDisplay();
        }
      };
      const startDrawing = () => {
        isDrawing.value = true;
        points.value = [];
        circleCenter.value = null;
        circleRadius.value = 0;
        selectedFence.value = null;
        updateMapDisplay();
      };
      function handleDeviceBindingChange(deviceImei, bound) {
        void toggleDeviceBinding(deviceImei, bound);
      }
      function getDeviceImei(device) {
        return device.getString("imei", "");
      }
      function isDeviceOnline(device) {
        return device.getString("connectionStatus", "") === "online";
      }
      function getDeviceDisplayName(device) {
        const deviceName2 = device.getString("deviceName", "");
        return deviceName2 ? deviceName2 : device.getString("plateNo", "");
      }
      function closeEditDialog() {
        var _a2;
        (_a2 = editDialogPopup.value) === null || _a2 === void 0 ? null : _a2.$callMethod("close");
      }
      function getSelectedFenceName() {
        const fence = selectedFence.value;
        return fence != null ? fence.getString("name", "") : "";
      }
      function editSelectedFence() {
        const fence = selectedFence.value;
        if (fence != null) {
          editFence(fence);
        }
      }
      function deleteSelectedFence() {
        const fence = selectedFence.value;
        uni.__log__("log", "at pages/geofencing/geofencing.uvue:1184", "删除电子围栏", fence);
        if (fence != null) {
          const fenceId = fence.getString("id", "");
          uni.__log__("log", "at pages/geofencing/geofencing.uvue:1188", "删除电子围栏ID", fenceId);
          if (fenceId !== "") {
            deleteFence(fenceId);
          } else {
            showAppToast({
              title: "围栏ID无效",
              icon: "none"
            });
          }
        }
      }
      function showSelectedFenceDevices() {
        const fence = selectedFence.value;
        if (fence != null) {
          void showBindDevices(fence.getString("id", ""));
        }
      }
      function calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371e3;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
      }
      function addNewPoint(lat, lng) {
        const point = { latitude: lat, longitude: lng };
        points.value.push(point);
        updateMapDisplay();
      }
      const handleMapTap = (e) => {
        const detail = e.detail;
        if (!isDrawing.value || detail == null || detail.latitude == null || detail.longitude == null)
          return null;
        const latitude = detail.latitude;
        const longitude = detail.longitude;
        if (isDrawing.value) {
          if (drawingMode.value === "polygon") {
            addNewPoint(latitude, longitude);
          } else if (drawingMode.value === "circle") {
            if (!circleCenter.value) {
              circleCenter.value = {
                latitude,
                longitude
              };
              updateMapDisplay();
            } else {
              const radius = calculateDistance(circleCenter.value.latitude, circleCenter.value.longitude, latitude, longitude);
              circleRadius.value = radius < 10 ? 10 : radius;
              updateMapDisplay();
            }
          }
        }
      };
      const finishDrawing = () => {
        var _a2;
        if (drawingMode.value === "polygon" && points.value.length < 3) {
          showAppToast({ title: "至少需要3个顶点", icon: "none" });
          return null;
        } else if (drawingMode.value === "circle" && (!circleCenter.value || circleRadius.value <= 0)) {
          showAppToast({ title: "请设置有效的圆形围栏", icon: "none" });
          return null;
        }
        isDrawing.value = false;
        fenceForm.name = "".concat(drawingMode.value === "circle" ? "圆形" : "多边形", "围栏").concat(fenceList.value.length + 1);
        (_a2 = editDialogPopup.value) === null || _a2 === void 0 ? null : _a2.$callMethod("open");
      };
      const updateFencePolygon = () => {
        if (drawingMode.value === "polygon") {
          polygons.value = points.value.length >= 3 ? [{
            points: points.value,
            strokeWidth: 2,
            strokeColor: "#FF0000",
            fillColor: "rgba(255,0,0,0.2)",
            zIndex: 1
          }] : [];
        } else {
          polygons.value = [];
        }
      };
      const updateFenceCircle = () => {
        if (drawingMode.value === "circle" && circleCenter.value && circleRadius.value > 0) {
          circles.value = [{
            latitude: circleCenter.value.latitude,
            longitude: circleCenter.value.longitude,
            radius: circleRadius.value,
            strokeWidth: 2,
            color: "#FF0000",
            fillColor: "rgba(255,0,0,0.2)"
          }];
        } else {
          circles.value = [];
        }
      };
      const clearDrawing = () => {
        isDrawing.value = false;
        points.value = [];
        circleCenter.value = null;
        circleRadius.value = 0;
        selectedFence.value = null;
        polygons.value = [];
        circles.value = [];
        updateMarkers();
        renderFencesOnMap();
      };
      vue.onLoad((option) => {
        connectionStatus.value = option.connectionStatus;
        imei.value = option.imei;
        currentCar.value = option.plateNo;
        deptId.value = option.deptId;
        carType.value = option.carType;
        deviceName.value = option.deviceName;
        loadInitialPosition();
        loadGeofenceList();
      });
      const __returned__ = { imei, connectionStatus, deptId, carType, deviceName, center, mapScale, markers, carMarker, circles, carInFence, isDrawing, drawingMode, points, polygons, circleCenter, circleRadius, currentSpeed, currentAddress, currentCar, lastDirection, showFenceModal, fenceList, selectedFence, fencesPopup, editDialogPopup, editingFence, alarmTypeOptions, fenceForm, deviceDialogPopup, activeTab, deviceList, boundDevices, currentFenceName, currentFenceId, loading, scrollTop, get loadMoreTimer() {
        return loadMoreTimer;
      }, set loadMoreTimer(v = null) {
        loadMoreTimer = v;
      }, pagination, canFinishDrawing, loadingMore, hasMore, loadInitialPosition, calculateMapRotation, getFenceType, isValidCoordinate, parsePolygon, parseCircle, updateMarkers, renderFencesOnMap, updateMapDisplay, loadGeofenceList, generatePolygonString, generateCircleString, calculateZoomLevelFromRadius, calculateBounds, setMapCenterToFence, showFenceList, selectFence, editFence, deleteFenceById, deleteFence, saveFence, resetPagination, initPagination, loadBoundDevices, loadUnboundDevices, showBindDevices, switchTab, handleLoadMore, toggleDeviceBinding, isDeviceBound, setDrawingMode, startDrawing, handleDeviceBindingChange, getDeviceImei, isDeviceOnline, getDeviceDisplayName, closeEditDialog, getSelectedFenceName, editSelectedFence, deleteSelectedFence, showSelectedFenceDevices, calculateDistance, addNewPoint, handleMapTap, finishDrawing, updateFencePolygon, updateFenceCircle, clearDrawing };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  const _style_0$7 = { "container": { "": { "position": "relative", "width": "100%", "height": "100%", "display": "flex", "flexDirection": "column", "backgroundColor": "#f5f7fa" } }, "map-container": { ".container ": { "flexGrow": 1, "flexShrink": 1, "flexBasis": "0%", "width": "100%", "position": "relative" } }, "sub-nav-overlay": { ".container .map-container ": { "position": "absolute", "top": 0, "left": 0, "right": 0, "zIndex": 100 } }, "drag-hint": { ".container .map-container ": { "position": "absolute", "top": "150rpx", "left": 0, "right": 0, "zIndex": 100, "backgroundColor": "rgba(255,255,255,0.9)", "paddingTop": "16rpx", "paddingRight": "16rpx", "paddingBottom": "16rpx", "paddingLeft": "16rpx", "boxShadow": "0 4rpx 10rpx rgba(0, 0, 0, 0.1)" } }, "fence-operations": { ".container ": { "backgroundColor": "#ffffff", "paddingTop": "20rpx", "paddingRight": "20rpx", "paddingBottom": "50rpx", "paddingLeft": "20rpx" } }, "fence-header": { ".container .fence-operations ": { "display": "flex", "flexDirection": "row", "justifyContent": "space-between", "alignItems": "center", "marginBottom": "40rpx", "paddingBottom": "20rpx", "borderBottomWidth": "1rpx", "borderBottomStyle": "solid", "borderBottomColor": "#eeeeee" } }, "fence-name": { ".container .fence-operations .fence-header ": { "fontSize": "32rpx", "fontWeight": "bold" } }, "fence-actions": { ".container .fence-operations ": { "display": "flex", "flexDirection": "row", "justifyContent": "space-between" } }, "tools-panel": { ".container ": { "width": "100%", "backgroundColor": "#ffffff", "paddingTop": "20rpx", "paddingRight": "20rpx", "paddingBottom": "20rpx", "paddingLeft": "20rpx", "display": "flex", "flexDirection": "column", "boxShadow": "0 -2px 10px rgba(0, 0, 0, 0.1)" } }, "drawing-mode-selector": { ".container .tools-panel ": { "marginBottom": "20rpx", "paddingBottom": "20rpx", "borderBottomWidth": "1rpx", "borderBottomStyle": "solid", "borderBottomColor": "#eeeeee" } }, "mode-title": { ".container .tools-panel .drawing-mode-selector ": { "fontSize": "28rpx", "marginBottom": "15rpx", "color": "#333333", "fontWeight": 500 } }, "mode-buttons": { ".container .tools-panel .drawing-mode-selector ": { "display": "flex", "flexDirection": "row", "justifyContent": "flex-start", "alignItems": "center" } }, "mode-button-spacing": { ".container .tools-panel .drawing-mode-selector .mode-buttons ": { "marginLeft": "20rpx" } }, "tool-tag-item": { ".container .tools-panel ": { "display": "flex", "flexDirection": "row", "justifyContent": "space-between", "alignItems": "center", "marginBottom": "20rpx" } }, "status-info": { ".container .tools-panel ": { "display": "flex", "flexDirection": "column", "paddingTop": "20rpx", "paddingRight": 0, "paddingBottom": "20rpx", "paddingLeft": 0, "borderTopWidth": "1rpx", "borderTopStyle": "solid", "borderTopColor": "#eeeeee" } }, "fence-list": { ".container ": { "height": "100%", "display": "flex", "flexDirection": "column", "backgroundColor": "#ffffff" } }, "list-header": { ".container .fence-list ": { "flexShrink": 0, "display": "flex", "flexDirection": "row", "justifyContent": "space-between", "alignItems": "center", "paddingTop": "30rpx", "paddingRight": "30rpx", "paddingBottom": "30rpx", "paddingLeft": "30rpx", "borderBottomWidth": "1rpx", "borderBottomStyle": "solid", "borderBottomColor": "#eeeeee" } }, "title": { ".container .fence-list .list-header ": { "fontSize": "32rpx", "fontWeight": "bold" } }, "list-content": { ".container .fence-list ": { "height": "640rpx", "boxSizing": "border-box", "paddingTop": "20rpx", "paddingRight": "20rpx", "paddingBottom": "20rpx", "paddingLeft": "20rpx" } }, "fence-item": { ".container .fence-list .list-content ": { "display": "flex", "flexDirection": "row", "justifyContent": "space-between", "alignItems": "center", "paddingTop": "24rpx", "paddingRight": "24rpx", "paddingBottom": "24rpx", "paddingLeft": "24rpx", "borderBottomWidth": "1rpx", "borderBottomStyle": "solid", "borderBottomColor": "#f5f5f5" } }, "fence-info": { ".container .fence-list .list-content .fence-item ": { "display": "flex", "flexDirection": "column", "flexGrow": 1, "flexShrink": 1, "flexBasis": "0%" } }, "name": { ".container .fence-list .list-content .fence-item .fence-info ": { "fontSize": "30rpx", "fontWeight": 500, "marginBottom": "8rpx" }, ".container .device-dialog .device-list .device-item .device-info ": { "fontSize": "30rpx", "marginBottom": "8rpx" } }, "type": { ".container .fence-list .list-content .fence-item .fence-info ": { "fontSize": "24rpx", "color": "#2979ff", "marginBottom": "8rpx" } }, "devices": { ".container .fence-list .list-content .fence-item .fence-info ": { "fontSize": "24rpx", "color": "#999999" } }, "empty": { ".container .fence-list .list-content ": { "paddingTop": "100rpx", "paddingRight": 0, "paddingBottom": "100rpx", "paddingLeft": 0 }, ".container .device-dialog .device-list ": { "paddingTop": "100rpx", "paddingRight": 0, "paddingBottom": "100rpx", "paddingLeft": 0 } }, "edit-dialog": { ".container ": { "backgroundColor": "#ffffff", "borderTopLeftRadius": "16rpx", "borderTopRightRadius": "16rpx", "borderBottomRightRadius": "16rpx", "borderBottomLeftRadius": "16rpx", "overflow": "hidden" } }, "dialog-header": { ".container .edit-dialog ": { "paddingTop": "30rpx", "paddingRight": "30rpx", "paddingBottom": "30rpx", "paddingLeft": "30rpx", "borderBottomWidth": "1rpx", "borderBottomStyle": "solid", "borderBottomColor": "#eeeeee" }, ".container .device-dialog ": { "display": "flex", "justifyContent": "space-between", "flexDirection": "row", "alignItems": "center", "paddingTop": "30rpx", "paddingRight": "30rpx", "paddingBottom": "30rpx", "paddingLeft": "30rpx", "borderBottomWidth": "1rpx", "borderBottomStyle": "solid", "borderBottomColor": "#eeeeee" } }, "dialog-title": { ".container .edit-dialog ": { "textAlign": "center", "fontSize": "32rpx", "fontWeight": "bold" } }, "dialog-content": { ".container .edit-dialog ": { "paddingTop": "30rpx", "paddingRight": "30rpx", "paddingBottom": "30rpx", "paddingLeft": "30rpx" } }, "radio-group": { ".container .edit-dialog .dialog-content ": { "marginTop": "30rpx" } }, "label": { ".container .edit-dialog .dialog-content .radio-group ": { "marginBottom": "30rpx", "fontSize": "28rpx", "fontWeight": 500 } }, "radio-options": { ".container .edit-dialog .dialog-content .radio-group ": { "display": "flex", "flexDirection": "row", "flexWrap": "wrap", "alignItems": "center" } }, "dialog-actions": { ".container .edit-dialog ": { "display": "flex", "flexDirection": "row", "justifyContent": "space-between", "paddingTop": "20rpx", "paddingRight": "30rpx", "paddingBottom": "20rpx", "paddingLeft": "30rpx", "borderTopWidth": "1rpx", "borderTopStyle": "solid", "borderTopColor": "#eeeeee" }, ".container .device-dialog ": { "paddingTop": "20rpx", "paddingRight": "30rpx", "paddingBottom": "20rpx", "paddingLeft": "30rpx", "borderTopWidth": "1rpx", "borderTopStyle": "solid", "borderTopColor": "#eeeeee" } }, "device-dialog": { ".container ": { "height": "800rpx", "backgroundColor": "#ffffff" } }, "dialog-tabs": { ".container .device-dialog ": { "display": "flex", "flexDirection": "row", "borderBottomWidth": "1rpx", "borderBottomStyle": "solid", "borderBottomColor": "#eeeeee" } }, "tab": { ".container .device-dialog .dialog-tabs ": { "flexGrow": 1, "flexShrink": 1, "flexBasis": "0%", "textAlign": "center", "paddingTop": "24rpx", "paddingRight": "24rpx", "paddingBottom": "24rpx", "paddingLeft": "24rpx", "fontSize": "28rpx" }, ".container .device-dialog .dialog-tabs .active": { "color": "#2979ff", "borderBottomWidth": "4rpx", "borderBottomStyle": "solid", "borderBottomColor": "#2979ff" } }, "device-list": { ".container .device-dialog ": { "height": "100%", "paddingTop": "20rpx", "paddingRight": "20rpx", "paddingBottom": "75rpx", "paddingLeft": "20rpx", "boxSizing": "border-box" } }, "device-item": { ".container .device-dialog .device-list ": { "display": "flex", "flexDirection": "row", "justifyContent": "space-between", "alignItems": "center", "paddingTop": "24rpx", "paddingRight": "24rpx", "paddingBottom": "24rpx", "paddingLeft": "24rpx", "borderBottomWidth": "1rpx", "borderBottomStyle": "solid", "borderBottomColor": "#f5f5f5" } }, "device-info": { ".container .device-dialog .device-list .device-item ": { "display": "flex", "flexDirection": "column" } }, "status": { ".container .device-dialog .device-list .device-item .device-info ": { "fontSize": "24rpx", "color": "#999999" } }, "loading-tip": { ".container .device-dialog .device-list ": { "display": "flex", "alignItems": "center", "justifyContent": "center", "paddingTop": "30rpx", "paddingRight": 0, "paddingBottom": "30rpx", "paddingLeft": 0 } }, "no-more": { ".container .device-dialog .device-list ": { "textAlign": "center", "paddingTop": "30rpx", "paddingRight": 0, "paddingBottom": "30rpx", "paddingLeft": 0, "color": "#999999", "fontSize": "26rpx" } }, "drag-hint-text": { ".container ": { "fontSize": "28rpx", "color": "#00aa00", "fontWeight": "bold", "textAlign": "center" } }, "status-text": { ".container ": { "fontSize": "28rpx", "color": "#333333" } }, "empty-text-box": { ".container ": { "marginTop": "30rpx" } }, "empty-text": { ".container ": { "textAlign": "center", "fontSize": "22rpx", "color": "#999999" } }, "i-popup__content": { ".container ": { "borderTopLeftRadius": "20rpx", "borderTopRightRadius": "20rpx", "borderBottomRightRadius": "20rpx", "borderBottomLeftRadius": "20rpx" } }, "i-grid-item": { ".container ": { "!alignItems": "flex-start", "marginTop": "10rpx", "marginRight": 0, "marginBottom": "10rpx", "marginLeft": 0 } } };
  function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_custom_navBar = resolveEasycom(vue.resolveDynamicComponent("custom-navBar"), __easycom_0$5);
    const _component_map = vue.resolveComponent("map");
    const _component_sub_navBar = resolveEasycom(vue.resolveDynamicComponent("sub-navBar"), __easycom_1$1);
    const _component_i_icon = resolveEasycom(vue.resolveDynamicComponent("i-icon"), __easycom_2$6);
    const _component_i_button = resolveEasycom(vue.resolveDynamicComponent("i-button"), __easycom_2$2);
    const _component_i_popup = resolveEasycom(vue.resolveDynamicComponent("i-popup"), __easycom_4$1);
    const _component_i_input = resolveEasycom(vue.resolveDynamicComponent("i-input"), __easycom_1$2);
    const _component_i_radio = resolveEasycom(vue.resolveDynamicComponent("i-radio"), __easycom_6);
    const _component_i_switch = resolveEasycom(vue.resolveDynamicComponent("i-switch"), __easycom_7);
    const _component_app_toast = resolveEasycom(vue.resolveDynamicComponent("app-toast"), __easycom_3$3);
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.createElementVNode("view", { class: "container" }, [
          vue.createVNode(_component_custom_navBar, {
            title: "地理围栏",
            "show-back": true,
            backgroundColor: "#fff",
            textColor: "#333",
            showCapsule: false
          }),
          vue.createElementVNode("view", { class: "map-container" }, [
            vue.createVNode(_component_map, {
              id: "myMap",
              latitude: $setup.center.latitude,
              longitude: $setup.center.longitude,
              scale: $setup.mapScale,
              style: { "width": "100%", "height": "100%" },
              "show-location": false,
              polygons: $setup.polygons,
              markers: $setup.markers,
              circles: $setup.circles,
              onTap: $setup.handleMapTap,
              "enable-traffic": true,
              "enable-overlooking": true,
              "enable-building": true,
              "enable-3D": true
            }, null, 8, ["latitude", "longitude", "scale", "polygons", "markers", "circles"]),
            vue.createVNode(_component_sub_navBar, {
              class: "sub-nav-overlay",
              showTime: false,
              currentCar: $setup.currentCar,
              showCar: true,
              carStatus: $setup.connectionStatus
            }, null, 8, ["currentCar", "carStatus"]),
            $setup.isDrawing ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "drag-hint"
            }, [
              $setup.drawingMode === "polygon" ? (vue.openBlock(), vue.createElementBlock("text", {
                key: 0,
                class: "drag-hint-text"
              }, "点击地图添加围栏点,至少需要3个点")) : vue.createCommentVNode("v-if", true),
              $setup.drawingMode === "circle" ? (vue.openBlock(), vue.createElementBlock("text", {
                key: 1,
                class: "drag-hint-text"
              }, "点击地图确定圆心，再点一下地图确定半径")) : vue.createCommentVNode("v-if", true)
            ])) : vue.createCommentVNode("v-if", true)
          ]),
          vue.createVNode(
            _component_i_popup,
            {
              ref: "showFenceModal",
              mode: "bottom",
              round: "10",
              showClose: true
            },
            {
              default: vue.withCtx(() => [
                $setup.selectedFence ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 0,
                  class: "fence-operations"
                }, [
                  vue.createElementVNode("view", { class: "fence-header" }, [
                    vue.createElementVNode(
                      "text",
                      { class: "fence-name" },
                      vue.toDisplayString($setup.getSelectedFenceName()),
                      1
                      /* TEXT */
                    ),
                    vue.createVNode(_component_i_icon, {
                      name: "close",
                      onClick: _cache[0] || (_cache[0] = ($event) => {
                        var _a;
                        $setup.selectedFence = null;
                        (_a = $setup.showFenceModal) == null ? void 0 : _a.$callMethod("close");
                      })
                    })
                  ]),
                  vue.createElementVNode("view", { class: "fence-actions" }, [
                    vue.createVNode(_component_i_button, {
                      size: "small",
                      onClick: $setup.editSelectedFence
                    }, {
                      default: vue.withCtx(() => [
                        vue.createTextVNode("编辑")
                      ]),
                      _: 1
                      /* STABLE */
                    }),
                    vue.createVNode(_component_i_button, {
                      size: "small",
                      type: "error",
                      onClick: $setup.deleteSelectedFence
                    }, {
                      default: vue.withCtx(() => [
                        vue.createTextVNode("删除")
                      ]),
                      _: 1
                      /* STABLE */
                    }),
                    vue.createVNode(_component_i_button, {
                      size: "small",
                      type: "primary",
                      onClick: $setup.showSelectedFenceDevices
                    }, {
                      default: vue.withCtx(() => [
                        vue.createTextVNode("绑定设备")
                      ]),
                      _: 1
                      /* STABLE */
                    })
                  ])
                ])) : vue.createCommentVNode("v-if", true)
              ]),
              _: 1
              /* STABLE */
            },
            512
            /* NEED_PATCH */
          ),
          vue.createElementVNode("view", { class: "tools-panel" }, [
            !$setup.isDrawing && !$setup.selectedFence ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "drawing-mode-selector"
            }, [
              vue.createElementVNode("text", { class: "mode-title" }, "选择围栏类型:"),
              vue.createElementVNode("view", { class: "mode-buttons" }, [
                vue.createVNode(_component_i_button, {
                  type: $setup.drawingMode == "polygon" ? "success" : "default",
                  size: "small",
                  customStyle: "border:1rpx solid #ebedf0",
                  onClick: _cache[1] || (_cache[1] = ($event) => $setup.setDrawingMode("polygon"))
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode(" 多边形 ")
                  ]),
                  _: 1
                  /* STABLE */
                }, 8, ["type"]),
                vue.createVNode(_component_i_button, {
                  class: "mode-button-spacing",
                  type: $setup.drawingMode == "circle" ? "success" : "default",
                  size: "small",
                  customStyle: "border:1rpx solid #ebedf0",
                  onClick: _cache[2] || (_cache[2] = ($event) => $setup.setDrawingMode("circle"))
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode(" 圆形 ")
                  ]),
                  _: 1
                  /* STABLE */
                }, 8, ["type"])
              ])
            ])) : vue.createCommentVNode("v-if", true),
            vue.createElementVNode("view", { class: "tool-tag-item" }, [
              vue.createVNode(_component_i_button, {
                onClick: $setup.startDrawing,
                disabled: $setup.isDrawing || $setup.selectedFence != null,
                size: "small"
              }, {
                default: vue.withCtx(() => [
                  vue.createTextVNode(" 开始绘制 ")
                ]),
                _: 1
                /* STABLE */
              }, 8, ["disabled"]),
              vue.createVNode(_component_i_button, {
                onClick: $setup.finishDrawing,
                disabled: !$setup.isDrawing || !$setup.canFinishDrawing,
                size: "small"
              }, {
                default: vue.withCtx(() => [
                  vue.createTextVNode(" 完成绘制 ")
                ]),
                _: 1
                /* STABLE */
              }, 8, ["disabled"]),
              vue.createVNode(_component_i_button, {
                onClick: $setup.clearDrawing,
                size: "small"
              }, {
                default: vue.withCtx(() => [
                  vue.createTextVNode(" 重置绘制 ")
                ]),
                _: 1
                /* STABLE */
              }),
              vue.createVNode(_component_i_button, {
                onClick: $setup.showFenceList,
                size: "small"
              }, {
                default: vue.withCtx(() => [
                  vue.createTextVNode(" 围栏列表 ")
                ]),
                _: 1
                /* STABLE */
              })
            ]),
            vue.createElementVNode("view", { class: "status-info" }, [
              vue.createElementVNode(
                "text",
                { class: "status-text" },
                "围栏类型: " + vue.toDisplayString($setup.drawingMode === "polygon" ? "多边形" : "圆形"),
                1
                /* TEXT */
              ),
              $setup.drawingMode === "polygon" ? (vue.openBlock(), vue.createElementBlock(
                "text",
                {
                  key: 0,
                  class: "status-text"
                },
                "顶点数量: " + vue.toDisplayString($setup.points.length),
                1
                /* TEXT */
              )) : vue.createCommentVNode("v-if", true),
              $setup.drawingMode === "circle" ? (vue.openBlock(), vue.createElementBlock(
                "text",
                {
                  key: 1,
                  class: "status-text"
                },
                "半径: " + vue.toDisplayString($setup.circleRadius.toFixed(2)) + "米",
                1
                /* TEXT */
              )) : vue.createCommentVNode("v-if", true)
            ])
          ]),
          vue.createVNode(
            _component_i_popup,
            {
              ref: "fencesPopup",
              mode: "bottom",
              round: "10",
              height: "800rpx",
              disabledScroll: true,
              contentMargin: "0",
              showClose: true
            },
            {
              default: vue.withCtx(() => [
                vue.createElementVNode("view", { class: "fence-list" }, [
                  vue.createElementVNode("view", { class: "list-header" }, [
                    vue.createElementVNode("text", { class: "title" }, "围栏列表")
                  ]),
                  vue.createElementVNode("scroll-view", {
                    class: "list-content",
                    "scroll-y": "true",
                    "show-scrollbar": false
                  }, [
                    (vue.openBlock(true), vue.createElementBlock(
                      vue.Fragment,
                      null,
                      vue.renderList($setup.fenceList, (fence) => {
                        return vue.openBlock(), vue.createElementBlock("view", {
                          key: fence.id,
                          class: "fence-item",
                          onClick: ($event) => $setup.selectFence(fence)
                        }, [
                          vue.createElementVNode("view", { class: "fence-info" }, [
                            vue.createElementVNode(
                              "text",
                              { class: "name" },
                              vue.toDisplayString(fence.name),
                              1
                              /* TEXT */
                            ),
                            vue.createElementVNode(
                              "text",
                              { class: "type" },
                              vue.toDisplayString($setup.getFenceType(fence) === "circle" ? "圆形" : "多边形"),
                              1
                              /* TEXT */
                            ),
                            vue.createElementVNode(
                              "text",
                              { class: "devices" },
                              "绑定设备: " + vue.toDisplayString(fence.deviceCount || 0) + "台",
                              1
                              /* TEXT */
                            )
                          ]),
                          vue.createVNode(_component_i_icon, {
                            name: "/static/arrow-right.png",
                            fontSize: "15"
                          })
                        ], 8, ["onClick"]);
                      }),
                      128
                      /* KEYED_FRAGMENT */
                    )),
                    $setup.fenceList.length == 0 ? (vue.openBlock(), vue.createElementBlock("view", {
                      key: 0,
                      class: "empty"
                    }, [
                      vue.createElementVNode("text", { class: "empty-text" }, "暂无围栏数据")
                    ])) : vue.createCommentVNode("v-if", true)
                  ])
                ])
              ]),
              _: 1
              /* STABLE */
            },
            512
            /* NEED_PATCH */
          ),
          vue.createVNode(
            _component_i_popup,
            {
              ref: "editDialogPopup",
              mode: "bottom",
              round: "10",
              contentDraggable: false,
              showClose: true
            },
            {
              default: vue.withCtx(() => [
                vue.createElementVNode("view", { class: "edit-dialog" }, [
                  vue.createElementVNode("view", { class: "dialog-header" }, [
                    vue.createElementVNode(
                      "text",
                      { class: "dialog-title" },
                      vue.toDisplayString($setup.editingFence ? "编辑围栏" : "新增围栏"),
                      1
                      /* TEXT */
                    )
                  ]),
                  vue.createElementVNode("view", { class: "dialog-content" }, [
                    vue.createVNode(_component_i_input, {
                      modelValue: $setup.fenceForm.name,
                      "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $setup.fenceForm.name = $event),
                      placeholder: "请输入围栏名称",
                      border: "surround"
                    }, null, 8, ["modelValue"]),
                    vue.createElementVNode("view", { class: "radio-group" }, [
                      vue.createElementVNode("text", { class: "label" }, "告警类型:"),
                      vue.createElementVNode("view", { class: "radio-options" }, [
                        vue.createVNode(_component_i_radio, {
                          modelValue: $setup.fenceForm.alarmType,
                          "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $setup.fenceForm.alarmType = $event),
                          name: "0",
                          iconPlacement: "left"
                        }, {
                          default: vue.withCtx(() => [
                            vue.createTextVNode("不告警")
                          ]),
                          _: 1
                          /* STABLE */
                        }, 8, ["modelValue"]),
                        vue.createVNode(_component_i_radio, {
                          modelValue: $setup.fenceForm.alarmType,
                          "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => $setup.fenceForm.alarmType = $event),
                          name: "1",
                          iconPlacement: "left"
                        }, {
                          default: vue.withCtx(() => [
                            vue.createTextVNode("出入告警")
                          ]),
                          _: 1
                          /* STABLE */
                        }, 8, ["modelValue"]),
                        vue.createVNode(_component_i_radio, {
                          modelValue: $setup.fenceForm.alarmType,
                          "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => $setup.fenceForm.alarmType = $event),
                          name: "2",
                          iconPlacement: "left"
                        }, {
                          default: vue.withCtx(() => [
                            vue.createTextVNode("出告警")
                          ]),
                          _: 1
                          /* STABLE */
                        }, 8, ["modelValue"]),
                        vue.createVNode(_component_i_radio, {
                          modelValue: $setup.fenceForm.alarmType,
                          "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => $setup.fenceForm.alarmType = $event),
                          name: "3",
                          iconPlacement: "left"
                        }, {
                          default: vue.withCtx(() => [
                            vue.createTextVNode("入告警")
                          ]),
                          _: 1
                          /* STABLE */
                        }, 8, ["modelValue"])
                      ])
                    ])
                  ]),
                  vue.createElementVNode("view", { class: "dialog-actions" }, [
                    vue.createVNode(_component_i_button, { onClick: $setup.closeEditDialog }, {
                      default: vue.withCtx(() => [
                        vue.createTextVNode("取消")
                      ]),
                      _: 1
                      /* STABLE */
                    }),
                    vue.createVNode(_component_i_button, {
                      type: "primary",
                      onClick: $setup.saveFence
                    }, {
                      default: vue.withCtx(() => [
                        vue.createTextVNode("保存")
                      ]),
                      _: 1
                      /* STABLE */
                    })
                  ])
                ])
              ]),
              _: 1
              /* STABLE */
            },
            512
            /* NEED_PATCH */
          ),
          vue.createVNode(
            _component_i_popup,
            {
              ref: "deviceDialogPopup",
              mode: "bottom",
              round: "10",
              closeOnMask: true,
              showClose: true
            },
            {
              default: vue.withCtx(() => [
                vue.createElementVNode("view", { class: "device-dialog" }, [
                  vue.createElementVNode("view", { class: "dialog-header" }, [
                    vue.createElementVNode(
                      "text",
                      { class: "dialog-title" },
                      "设备绑定 - " + vue.toDisplayString($setup.currentFenceName),
                      1
                      /* TEXT */
                    )
                  ]),
                  vue.createElementVNode("view", { class: "dialog-tabs" }, [
                    vue.createElementVNode(
                      "text",
                      {
                        class: vue.normalizeClass(["tab", $setup.activeTab === "bind" ? "active" : ""]),
                        onClick: _cache[8] || (_cache[8] = ($event) => $setup.switchTab("bind"))
                      },
                      "已绑定设备",
                      2
                      /* CLASS */
                    ),
                    vue.createElementVNode(
                      "text",
                      {
                        class: vue.normalizeClass(["tab", $setup.activeTab === "unbind" ? "active" : ""]),
                        onClick: _cache[9] || (_cache[9] = ($event) => $setup.switchTab("unbind"))
                      },
                      "未绑定设备",
                      2
                      /* CLASS */
                    )
                  ]),
                  vue.createElementVNode("scroll-view", {
                    class: "device-list",
                    "scroll-y": "true",
                    "show-scrollbar": false,
                    "scroll-top": $setup.scrollTop,
                    onScrolltolower: $setup.handleLoadMore,
                    "lower-threshold": 150
                  }, [
                    (vue.openBlock(true), vue.createElementBlock(
                      vue.Fragment,
                      null,
                      vue.renderList($setup.deviceList, (device) => {
                        return vue.openBlock(), vue.createElementBlock("view", {
                          key: $setup.getDeviceImei(device),
                          class: "device-item"
                        }, [
                          vue.createElementVNode("view", { class: "device-info" }, [
                            vue.createElementVNode(
                              "text",
                              { class: "name" },
                              vue.toDisplayString($setup.getDeviceDisplayName(device)),
                              1
                              /* TEXT */
                            ),
                            $setup.getDeviceImei(device) ? (vue.openBlock(), vue.createElementBlock(
                              "text",
                              {
                                key: 0,
                                class: "status"
                              },
                              vue.toDisplayString($setup.isDeviceOnline(device) ? "在线" : "离线"),
                              1
                              /* TEXT */
                            )) : vue.createCommentVNode("v-if", true)
                          ]),
                          vue.createVNode(_component_i_switch, {
                            "model-value": $setup.isDeviceBound($setup.getDeviceImei(device)),
                            onChange: ($event) => $setup.handleDeviceBindingChange($setup.getDeviceImei(device), $event),
                            disabled: $setup.loading || $setup.loadingMore,
                            size: "20"
                          }, null, 8, ["model-value", "onChange", "disabled"])
                        ]);
                      }),
                      128
                      /* KEYED_FRAGMENT */
                    )),
                    $setup.deviceList.length == 0 && !$setup.loading ? (vue.openBlock(), vue.createElementBlock("view", {
                      key: 0,
                      class: "empty"
                    }, [
                      vue.createElementVNode(
                        "text",
                        { class: "empty-text" },
                        vue.toDisplayString($setup.activeTab === "bind" ? "暂无绑定设备" : "暂无可用设备"),
                        1
                        /* TEXT */
                      )
                    ])) : vue.createCommentVNode("v-if", true),
                    $setup.loadingMore ? (vue.openBlock(), vue.createElementBlock("view", {
                      key: 1,
                      class: "loading-tip"
                    }, [
                      vue.createElementVNode("text", { class: "empty-text" }, "正在加载更多...")
                    ])) : vue.createCommentVNode("v-if", true),
                    $setup.deviceList.length > 0 && !$setup.hasMore && !$setup.loadingMore ? (vue.openBlock(), vue.createElementBlock("view", {
                      key: 2,
                      class: "empty-text-box"
                    }, [
                      vue.createElementVNode("text", { class: "empty-text" }, "暂无更多数据")
                    ])) : vue.createCommentVNode("v-if", true)
                  ], 40, ["scroll-top"])
                ])
              ]),
              _: 1
              /* STABLE */
            },
            512
            /* NEED_PATCH */
          )
        ]),
        vue.createVNode(_component_app_toast)
      ],
      64
      /* STABLE_FRAGMENT */
    );
  }
  const PagesGeofencingGeofencing = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$6], ["styles", [_style_0$7]], ["__file", "/Users/xyhc/Documents/carConnectInternet/pages/geofencing/geofencing.uvue"]]);
  const _sfc_main$6 = /* @__PURE__ */ vue.defineComponent({
    __name: "scancode",
    setup(__props, _a) {
      var __expose = _a.expose;
      __expose();
      const scanFunctionIsUseable = vue.ref(true);
      const goBack = () => {
        uni.navigateBack(new UTSJSONObject({ delta: 1 }));
      };
      const handleScanResult = (scanResult) => {
        if (!scanFunctionIsUseable.value || scanResult.length == 0)
          return null;
        scanFunctionIsUseable.value = false;
        uni.__log__("log", "at pages/scancode/scancode.uvue:19", "扫码结果:", scanResult);
        uni.setStorageSync("scanCodeResult", scanResult);
        uni.$emit("scanCodeResult", new UTSJSONObject({ result: scanResult }));
        showAppToast({
          title: "扫码成功",
          icon: "success",
          duration: 1e3
        });
        setTimeout(() => {
          uni.navigateBack(new UTSJSONObject({ delta: 1 }));
        }, 1e3);
      };
      const startScan = () => {
        if (!scanFunctionIsUseable.value)
          return null;
        uni.scanCode(new UTSJSONObject({
          onlyFromCamera: true,
          success: (res) => {
            uni.__log__("log", "at pages/scancode/scancode.uvue:37", "扫码成功res:", res);
            const result = res.result;
            if (result != null)
              handleScanResult(result);
          },
          fail: (err) => {
            uni.__log__("log", "at pages/scancode/scancode.uvue:42", "扫码失败:", err);
            showAppToast({ title: "扫码失败", icon: "none" });
            goBack();
          }
        }));
      };
      vue.onLoad(() => {
        startScan();
      });
      const __returned__ = { scanFunctionIsUseable, goBack, handleScanResult, startScan };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  const _style_0$6 = { "container": { "": { "height": "100%", "display": "flex", "flexDirection": "column", "backgroundColor": "#000000" } }, "scan-header": { "": { "height": "88rpx", "display": "flex", "flexDirection": "row", "alignItems": "center", "backgroundColor": "#ffffff" } }, "back-button": { "": { "width": "120rpx", "color": "#333333", "fontSize": "28rpx", "textAlign": "center" } }, "title": { "": { "flexGrow": 1, "flexShrink": 1, "flexBasis": "0%", "color": "#333333", "fontSize": "36rpx", "fontWeight": "bold", "textAlign": "center", "marginRight": "120rpx" } }, "scancode-box": { "": { "flexGrow": 1, "flexShrink": 1, "flexBasis": "0%", "display": "flex", "alignItems": "center", "justifyContent": "center" } }, "scan-button": { "": { "color": "#ffffff", "fontSize": "32rpx", "backgroundColor": "#007aff", "borderTopLeftRadius": "12rpx", "borderTopRightRadius": "12rpx", "borderBottomRightRadius": "12rpx", "borderBottomLeftRadius": "12rpx", "paddingTop": "24rpx", "paddingRight": "60rpx", "paddingBottom": "24rpx", "paddingLeft": "60rpx" } }, "tip": { "": { "position": "fixed", "bottom": "100rpx", "left": 0, "right": 0, "textAlign": "center", "color": "#ffffff", "fontSize": "28rpx", "backgroundColor": "rgba(0,0,0,0.5)", "paddingTop": "20rpx", "paddingRight": "20rpx", "paddingBottom": "20rpx", "paddingLeft": "20rpx" } } };
  function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_app_toast = resolveEasycom(vue.resolveDynamicComponent("app-toast"), __easycom_3$3);
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.createElementVNode("view"),
        vue.createVNode(_component_app_toast)
      ],
      64
      /* STABLE_FRAGMENT */
    );
  }
  const PagesScancodeScancode = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$5], ["styles", [_style_0$6]], ["__file", "/Users/xyhc/Documents/carConnectInternet/pages/scancode/scancode.uvue"]]);
  const _sfc_main$5 = /* @__PURE__ */ vue.defineComponent({
    __name: "payDeviceList",
    setup(__props, _a) {
      var __expose = _a.expose;
      __expose();
      const deviceList = vue.ref([]);
      const currPage = vue.ref(1);
      const pageSize = vue.ref(10);
      const totalPage = vue.ref(0);
      const loading = vue.ref(false);
      const hasMore = vue.ref(true);
      const needRefresh = vue.ref(false);
      const addCar = () => {
        uni.navigateTo({
          url: "/pages/addCar/addCar"
        });
      };
      const resetData = () => {
        deviceList.value = [];
        currPage.value = 1;
        totalPage.value = 0;
        hasMore.value = true;
      };
      const loadPayDeviceListData = () => {
        return __awaiter(this, void 0, void 0, function* () {
          if (loading.value || !hasMore.value)
            return Promise.resolve(null);
          loading.value = true;
          try {
            const data = new UTSJSONObject({
              page: currPage.value,
              pageSize: pageSize.value
            });
            const res = yield getUserDeviceList(data);
            const code = res.code;
            const list = res.data.list;
            const pageCount = res.data.totalPage;
            if (code == 0 && list != null) {
              totalPage.value = pageCount;
              if (currPage.value == 1) {
                deviceList.value = list;
              } else {
                deviceList.value = [...deviceList.value, ...list];
              }
              hasMore.value = currPage.value < totalPage.value;
              if (hasMore.value) {
                currPage.value++;
              }
            } else {
              showAppToast({
                title: res.msg || "加载失败",
                icon: "none"
              });
            }
          } catch (error) {
            uni.__log__("error", "at pages/userCenter/payDeviceList/payDeviceList.uvue:125", "加载车辆列表失败:", error);
            showAppToast({
              title: "加载失败，请重试",
              icon: "none"
            });
          } finally {
            loading.value = false;
          }
        });
      };
      vue.onShow(() => {
        if (needRefresh.value || deviceList.value.length == 0) {
          resetData();
          loadPayDeviceListData();
          needRefresh.value = false;
        }
      });
      vue.onReachBottom(() => {
        loadPayDeviceListData();
      });
      function pay(iccid, simMerchant) {
        if (simMerchant.toLowerCase() == "zddx") {
          iccid = iccid.substring(0, iccid.length - 1);
        }
        uni.__log__("log", "at pages/userCenter/payDeviceList/payDeviceList.uvue:156", iccid);
        needRefresh.value = true;
        needRefresh.value = false;
        showAppToast({
          title: "请在微信小程序中完成充值",
          icon: "none"
        });
      }
      const payDevice = (item) => {
        const iccid = item.getString("iccid", "");
        const simMerchant = item.getString("simMerchant", "");
        pay(iccid, simMerchant);
      };
      vue.onPullDownRefresh(() => {
        resetData();
        loadPayDeviceListData().finally(() => {
          uni.stopPullDownRefresh();
          showAppToast({
            title: "刷新成功",
            icon: "success"
          });
        });
      });
      const __returned__ = { deviceList, currPage, pageSize, totalPage, loading, hasMore, needRefresh, addCar, resetData, loadPayDeviceListData, pay, payDevice };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  const _style_0$5 = { "container": { "": { "width": "100%", "backgroundColor": "#f5f5f5", "marginTop": "170rpx" } }, "content": { ".container ": { "marginTop": "30rpx", "marginRight": "20rpx", "marginBottom": "20rpx", "marginLeft": "20rpx" } }, "list": { ".container .content ": { "backgroundColor": "#ffffff", "borderTopLeftRadius": "20rpx", "borderTopRightRadius": "20rpx", "borderBottomRightRadius": "20rpx", "borderBottomLeftRadius": "20rpx", "paddingTop": "20rpx", "paddingRight": "20rpx", "paddingBottom": "20rpx", "paddingLeft": "20rpx", "marginBottom": "30rpx" } }, "device-info": { ".container .content .list ": { "display": "flex", "flexDirection": "row", "justifyContent": "space-between", "alignItems": "center", "fontSize": "28rpx", "paddingTop": "10rpx", "paddingRight": 0, "paddingBottom": "10rpx", "paddingLeft": 0 } }, "label": { ".container .content .list .device-info ": { "color": "#666666" } }, "title": { ".container .content .list .device-info ": { "fontWeight": "bold", "fontSize": "32rpx", "color": "#000000" } }, "value": { ".container .content .list .device-info ": { "color": "#333333" } }, "pay-btn": { ".container .content .list .device-info ": { "paddingTop": "10rpx", "paddingRight": "15rpx", "paddingBottom": "10rpx", "paddingLeft": "15rpx", "fontSize": "25rpx", "color": "#ffffff", "backgroundColor": "#5ac725", "borderTopLeftRadius": "10rpx", "borderTopRightRadius": "10rpx", "borderBottomRightRadius": "10rpx", "borderBottomLeftRadius": "10rpx" } }, "loading": { ".container .content ": { "textAlign": "center", "paddingTop": "30rpx", "paddingRight": 0, "paddingBottom": "30rpx", "paddingLeft": 0, "color": "#999999", "fontSize": "24rpx" } }, "no-more": { ".container .content ": { "textAlign": "center", "paddingTop": "30rpx", "paddingRight": 0, "paddingBottom": "30rpx", "paddingLeft": 0, "color": "#999999", "fontSize": "24rpx" } }, "empty": { ".container .content ": { "textAlign": "center", "paddingTop": "100rpx", "paddingRight": 0, "paddingBottom": "100rpx", "paddingLeft": 0, "color": "#999999", "fontSize": "28rpx" } } };
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_custom_navBar = resolveEasycom(vue.resolveDynamicComponent("custom-navBar"), __easycom_0$5);
    const _component_app_toast = resolveEasycom(vue.resolveDynamicComponent("app-toast"), __easycom_3$3);
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.createVNode(_component_custom_navBar, {
          title: "续费管理",
          "show-back": true,
          backgroundColor: "#fff",
          textColor: "#333",
          showCapsule: false,
          isIcon: true,
          isShowStyle: true
        }),
        vue.createElementVNode("view", { class: "container" }, [
          vue.createElementVNode("view", { class: "content" }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.deviceList, (item, index) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  class: "list",
                  key: index
                }, [
                  vue.createElementVNode("view", { class: "device-info" }, [
                    vue.createElementVNode(
                      "view",
                      { class: "label title" },
                      vue.toDisplayString(item.deviceName),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode("view", { class: "value" })
                  ]),
                  item.iccid ? (vue.openBlock(), vue.createElementBlock("view", {
                    key: 0,
                    class: "device-info"
                  }, [
                    vue.createElementVNode("view", { class: "label" }, "ICCID:"),
                    vue.createElementVNode(
                      "view",
                      { class: "value" },
                      vue.toDisplayString(item.iccid),
                      1
                      /* TEXT */
                    )
                  ])) : vue.createCommentVNode("v-if", true),
                  item.imei && item.imei != "" ? (vue.openBlock(), vue.createElementBlock("view", {
                    key: 1,
                    class: "device-info"
                  }, [
                    vue.createElementVNode("view", { class: "label" }, "ID:"),
                    vue.createElementVNode(
                      "view",
                      { class: "value" },
                      vue.toDisplayString(item.imei),
                      1
                      /* TEXT */
                    )
                  ])) : vue.createCommentVNode("v-if", true),
                  vue.createElementVNode("view", { class: "device-info" }, [
                    vue.createElementVNode("view"),
                    vue.createElementVNode("text", {
                      class: "pay-btn",
                      onClick: ($event) => $setup.payDevice(item)
                    }, "去续费", 8, ["onClick"])
                  ])
                ]);
              }),
              128
              /* KEYED_FRAGMENT */
            )),
            $setup.loading ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "loading"
            }, [
              vue.createElementVNode("text", null, "加载中...")
            ])) : vue.createCommentVNode("v-if", true),
            !$setup.hasMore && !$setup.loading && $setup.deviceList.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 1,
              class: "no-more"
            }, [
              vue.createElementVNode("text", null, "没有更多数据了")
            ])) : vue.createCommentVNode("v-if", true),
            !$setup.loading && $setup.deviceList.length == 0 ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 2,
              class: "empty"
            }, [
              vue.createElementVNode("text", null, "暂无设备数据")
            ])) : vue.createCommentVNode("v-if", true)
          ])
        ]),
        vue.createVNode(_component_app_toast)
      ],
      64
      /* STABLE_FRAGMENT */
    );
  }
  const PagesUserCenterPayDeviceListPayDeviceList = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$4], ["styles", [_style_0$5]], ["__file", "/Users/xyhc/Documents/carConnectInternet/pages/userCenter/payDeviceList/payDeviceList.uvue"]]);
  const _sfc_main$4 = /* @__PURE__ */ vue.defineComponent({
    __name: "cmd",
    setup(__props, _a) {
      var __expose = _a.expose;
      __expose();
      const imei = vue.ref("");
      const commandTypes = vue.ref([]);
      const selectedTypeId = vue.ref(null);
      const commands = vue.ref([]);
      const selectedCommandId = vue.ref(null);
      const selectedCommand = vue.ref(null);
      const paramValues = vue.ref([]);
      const loading = vue.ref(false);
      const commandRecords = vue.ref(null);
      const commandRecordReason = vue.computed(() => {
        var _a2;
        if (commandRecords.value == null)
          return "暂无指令返回记录";
        return (_a2 = commandRecords.value["reason"]) !== null && _a2 !== void 0 ? _a2 : "暂无指令返回记录";
      });
      const selectedCommandDetails = vue.computed(() => {
        if (selectedCommand.value == null)
          return null;
        return selectedCommand.value["details"];
      });
      const paramConfigs = vue.computed(() => {
        const details = selectedCommandDetails.value;
        if (details == null || details.length == 0)
          return [];
        try {
          return UTS.JSON.parse(details);
        } catch (e) {
          uni.__log__("error", "at pages/cmd/cmd.uvue:103", "解析参数配置失败:", e);
          return [];
        }
      });
      const isFormValid = vue.computed(() => {
        return paramValues.value.length > 0 && paramValues.value.every((val) => {
          return val != "";
        });
      });
      const sortByCmdNameLengthAndAlphabet = (data) => {
        const sortedData = data.slice();
        sortedData.sort((a, b) => {
          var _a2, _b;
          const aName = (_a2 = a["cmdName"]) !== null && _a2 !== void 0 ? _a2 : "";
          const bName = (_b = b["cmdName"]) !== null && _b !== void 0 ? _b : "";
          if (aName.length != bName.length) {
            return aName.length - bName.length;
          }
          if (aName == bName)
            return 0;
          return aName < bName ? -1 : 1;
        });
        return sortedData;
      };
      const loadCommandTypes = () => {
        return __awaiter(this, void 0, void 0, function* () {
          try {
            loading.value = true;
            const response = yield getCmdAction();
            uni.__log__("log", "at pages/cmd/cmd.uvue:135", "加载指令类型响应:", response);
            if (response.code == 0) {
              commandTypes.value = sortByCmdNameLengthAndAlphabet(response.data);
            } else {
              showAppToast({
                title: "加载指令类型失败",
                icon: "none"
              });
            }
          } catch (error) {
            uni.__log__("error", "at pages/cmd/cmd.uvue:146", "加载指令类型出错:", error);
            showAppToast({
              title: "网络错误",
              icon: "none"
            });
          } finally {
            loading.value = false;
          }
        });
      };
      vue.onLoad((options) => {
        var _a2;
        imei.value = (_a2 = options.imei) !== null && _a2 !== void 0 ? _a2 : "";
        loadCommandTypes();
      });
      const selectTypeByItem = (type) => {
        return __awaiter(this, void 0, void 0, function* () {
          const typeId = type["cmdmId"];
          if (typeId == null)
            return Promise.resolve(null);
          selectedTypeId.value = typeId;
          selectedCommandId.value = null;
          selectedCommand.value = null;
          paramValues.value = [];
          commandRecords.value = null;
          try {
            loading.value = true;
            const response = yield getCmdByMid(new UTSJSONObject({
              imei: imei.value,
              cmdmId: typeId
            }));
            if (response.code == 0) {
              commands.value = response.data;
            } else {
              showAppToast({ title: "加载指令列表失败", icon: "none" });
            }
          } catch (error) {
            uni.__log__("error", "at pages/cmd/cmd.uvue:181", "加载指令列表出错:", error);
            showAppToast({ title: "网络错误", icon: "none" });
          } finally {
            loading.value = false;
          }
        });
      };
      const selectCommand = (command) => {
        var _a2;
        selectedCommandId.value = command["predictCmdId"];
        selectedCommand.value = command;
        paramValues.value = [];
        const details = command["details"];
        if (details == null || details.length == 0)
          return null;
        try {
          const configs = UTS.JSON.parse(details);
          const values = [];
          for (let index = 0; index < configs.length; index++) {
            const config = configs[index];
            const defaultValue = config["default"];
            if (defaultValue != null) {
              values[index] = defaultValue.toString();
              continue;
            }
            const configType = config["type"];
            const items = config["items"];
            if (configType == "radio" && items != null && items.length > 0) {
              values[index] = (_a2 = items[0]["value"]) !== null && _a2 !== void 0 ? _a2 : "";
            } else {
              values[index] = "";
            }
          }
          paramValues.value = values;
        } catch (e) {
          uni.__log__("error", "at pages/cmd/cmd.uvue:216", "初始化参数值失败:", e);
          paramValues.value = [];
        }
      };
      const getRadioItems = (config) => {
        var _a2;
        return (_a2 = config["items"]) !== null && _a2 !== void 0 ? _a2 : [];
      };
      const getRadioValue = (item) => {
        var _a2;
        return (_a2 = item["value"]) !== null && _a2 !== void 0 ? _a2 : "";
      };
      const getRadioDescription = (item) => {
        var _a2;
        return (_a2 = item["desc"]) !== null && _a2 !== void 0 ? _a2 : "";
      };
      const selectRadio = (index, value) => {
        while (paramValues.value.length <= index) {
          paramValues.value.push("");
        }
        paramValues.value[index] = value;
      };
      const sendCommand2 = () => {
        return __awaiter(this, void 0, void 0, function* () {
          var _a2, _b;
          if (!isFormValid.value || selectedCommand.value == null) {
            showAppToast({ title: "请填写所有参数", icon: "none" });
            return Promise.resolve(null);
          }
          const command = selectedCommand.value;
          let cmdData = (_a2 = command["params"]) !== null && _a2 !== void 0 ? _a2 : "";
          for (let index = 0; index < paramConfigs.value.length; index++) {
            const config = paramConfigs.value[index];
            const value = paramValues.value[index];
            const configuredPlaceholder = config["placeholder"];
            const placeholder = configuredPlaceholder != null && configuredPlaceholder.length > 0 ? configuredPlaceholder : "${param" + (index + 1).toString() + "}";
            cmdData = cmdData.replace(placeholder, value);
          }
          try {
            loading.value = true;
            const response = yield sendCmd(new UTSJSONObject({
              imei: imei.value,
              type: (_b = command["cmdCode"]) !== null && _b !== void 0 ? _b : "",
              password: null,
              cmdData: encodeURIComponent(cmdData),
              predictCmdId: command["predictCmdId"]
            }));
            if (response.code == 0) {
              showAppToast({ title: "指令发送成功", icon: "success" });
            } else {
              showAppToast({ title: "指令发送失败", icon: "none", duration: 3e3 });
            }
          } catch (error) {
            uni.__log__("error", "at pages/cmd/cmd.uvue:273", "发送指令出错:", error);
            showAppToast({ title: "网络错误", icon: "none" });
          } finally {
            loading.value = false;
          }
        });
      };
      const __returned__ = { imei, commandTypes, selectedTypeId, commands, selectedCommandId, selectedCommand, paramValues, loading, commandRecords, commandRecordReason, selectedCommandDetails, paramConfigs, isFormValid, sortByCmdNameLengthAndAlphabet, loadCommandTypes, selectTypeByItem, selectCommand, getRadioItems, getRadioValue, getRadioDescription, selectRadio, sendCommand: sendCommand2 };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  const _style_0$4 = { "container": { "": { "backgroundColor": "#f5f5f5", "display": "flex", "flexDirection": "column" } }, "device-info": { "": { "display": "flex", "alignItems": "center", "backgroundImage": "none", "backgroundColor": "#FFFFFF", "paddingTop": "20rpx", "paddingRight": "20rpx", "paddingBottom": "20rpx", "paddingLeft": "20rpx", "borderTopLeftRadius": "10rpx", "borderTopRightRadius": "10rpx", "borderBottomRightRadius": "10rpx", "borderBottomLeftRadius": "10rpx", "marginTop": "30rpx", "marginRight": 0, "marginBottom": "30rpx", "marginLeft": 0 } }, "device-label": { "": { "fontSize": "28rpx", "color": "#666666", "whiteSpace": "nowrap" } }, "device-input": { "": { "flexGrow": 1, "flexShrink": 1, "flexBasis": "0%", "fontSize": "28rpx", "color": "#333333" } }, "section": { "": { "backgroundImage": "none", "backgroundColor": "#FFFFFF", "borderTopLeftRadius": "10rpx", "borderTopRightRadius": "10rpx", "borderBottomRightRadius": "10rpx", "borderBottomLeftRadius": "10rpx", "paddingTop": "20rpx", "paddingRight": "20rpx", "paddingBottom": "20rpx", "paddingLeft": "20rpx", "marginBottom": "30rpx" } }, "section-title": { "": { "fontSize": "32rpx", "fontWeight": "bold", "color": "#333333", "marginBottom": "20rpx" } }, "record-list": { "": { "fontSize": "26rpx", "color": "#666666" } }, "type-container": { "": { "width": "100%" } }, "type-list": { "": { "display": "flex", "flexDirection": "row", "flexWrap": "wrap", "justifyContent": "flex-start", "alignItems": "center" } }, "type-item": { "": { "marginRight": "20rpx", "marginBottom": "20rpx", "paddingTop": "15rpx", "paddingRight": "30rpx", "paddingBottom": "15rpx", "paddingLeft": "30rpx", "backgroundImage": "none", "backgroundColor": "#f0f0f0", "borderTopLeftRadius": "50rpx", "borderTopRightRadius": "50rpx", "borderBottomRightRadius": "50rpx", "borderBottomLeftRadius": "50rpx" }, ".active": { "backgroundImage": "none", "backgroundColor": "#007AFF" } }, "type-name": { ".type-item.active ": { "color": "#FFFFFF" }, "": { "fontSize": "26rpx", "color": "#666666", "whiteSpace": "nowrap", "overflow": "hidden", "textOverflow": "ellipsis" } }, "command-list": { "": { "display": "flex", "flexDirection": "row" } }, "command-item": { ".command-item+": { "marginLeft": "20rpx" }, "": { "flexGrow": 1, "flexShrink": 1, "flexBasis": "0%", "paddingTop": "25rpx", "paddingRight": "25rpx", "paddingBottom": "25rpx", "paddingLeft": "25rpx", "borderTopWidth": "1rpx", "borderRightWidth": "1rpx", "borderBottomWidth": "1rpx", "borderLeftWidth": "1rpx", "borderTopStyle": "solid", "borderRightStyle": "solid", "borderBottomStyle": "solid", "borderLeftStyle": "solid", "borderTopColor": "#e0e0e0", "borderRightColor": "#e0e0e0", "borderBottomColor": "#e0e0e0", "borderLeftColor": "#e0e0e0", "borderTopLeftRadius": "10rpx", "borderTopRightRadius": "10rpx", "borderBottomRightRadius": "10rpx", "borderBottomLeftRadius": "10rpx" }, ".active": { "borderTopColor": "#007AFF", "borderRightColor": "#007AFF", "borderBottomColor": "#007AFF", "borderLeftColor": "#007AFF", "backgroundColor": "#f0f8ff" } }, "command-name": { "": { "fontSize": "30rpx", "color": "#333333", "marginBottom": "10rpx" } }, "command-descr": { "": { "fontSize": "24rpx", "color": "#999999" } }, "param-form": { "": { "display": "flex", "flexDirection": "column" } }, "param-item": { ".param-item+": { "marginTop": "30rpx" }, "": { "display": "flex", "flexDirection": "column" } }, "param-label": { "": { "marginBottom": "15rpx", "fontSize": "28rpx", "color": "#333333" } }, "param-input": { "": { "borderTopWidth": "1rpx", "borderRightWidth": "1rpx", "borderBottomWidth": "1rpx", "borderLeftWidth": "1rpx", "borderTopStyle": "solid", "borderRightStyle": "solid", "borderBottomStyle": "solid", "borderLeftStyle": "solid", "borderTopColor": "#e0e0e0", "borderRightColor": "#e0e0e0", "borderBottomColor": "#e0e0e0", "borderLeftColor": "#e0e0e0", "borderTopLeftRadius": "8rpx", "borderTopRightRadius": "8rpx", "borderBottomRightRadius": "8rpx", "borderBottomLeftRadius": "8rpx", "paddingTop": "20rpx", "paddingRight": "20rpx", "paddingBottom": "20rpx", "paddingLeft": "20rpx", "fontSize": "26rpx" } }, "radio-group": { "": { "display": "flex", "flexDirection": "column" } }, "radio-item": { ".radio-item+": { "marginTop": "20rpx" }, "": { "display": "flex", "alignItems": "center" } }, "radio-icon": { "": { "marginRight": "20rpx", "width": "36rpx", "height": "36rpx", "borderTopLeftRadius": "50%", "borderTopRightRadius": "50%", "borderBottomRightRadius": "50%", "borderBottomLeftRadius": "50%", "borderTopWidth": "1rpx", "borderRightWidth": "1rpx", "borderBottomWidth": "1rpx", "borderLeftWidth": "1rpx", "borderTopStyle": "solid", "borderRightStyle": "solid", "borderBottomStyle": "solid", "borderLeftStyle": "solid", "borderTopColor": "#cccccc", "borderRightColor": "#cccccc", "borderBottomColor": "#cccccc", "borderLeftColor": "#cccccc", "display": "flex", "alignItems": "center", "justifyContent": "center" } }, "radio-inner": { "": { "width": "25rpx", "height": "25rpx", "borderTopLeftRadius": "50%", "borderTopRightRadius": "50%", "borderBottomRightRadius": "50%", "borderBottomLeftRadius": "50%", "backgroundImage": "none", "backgroundColor": "rgba(0,0,0,0)" }, ".checked": { "backgroundImage": "none", "backgroundColor": "#007AFF" } }, "radio-label": { "": { "fontSize": "26rpx", "color": "#333333" } }, "submit-btn": { "": { "color": "#FFFFFF", "borderTopWidth": "medium", "borderRightWidth": "medium", "borderBottomWidth": "medium", "borderLeftWidth": "medium", "borderTopStyle": "none", "borderRightStyle": "none", "borderBottomStyle": "none", "borderLeftStyle": "none", "borderTopColor": "#000000", "borderRightColor": "#000000", "borderBottomColor": "#000000", "borderLeftColor": "#000000", "borderTopLeftRadius": "10rpx", "borderTopRightRadius": "10rpx", "borderBottomRightRadius": "10rpx", "borderBottomLeftRadius": "10rpx", "paddingTop": "25rpx", "paddingRight": "25rpx", "paddingBottom": "25rpx", "paddingLeft": "25rpx", "fontSize": "30rpx", "marginTop": "20rpx", "backgroundImage:disabled": "none", "backgroundColor:disabled": "#cccccc", "color:disabled": "#999999" } }, "empty-state": { "": { "textAlign": "center", "paddingTop": "100rpx", "paddingRight": 0, "paddingBottom": "100rpx", "paddingLeft": 0 } }, "loading": { "": { "textAlign": "center", "paddingTop": "50rpx", "paddingRight": 0, "paddingBottom": "50rpx", "paddingLeft": 0 } }, "placeholder": { "": { "color": "#cccccc" } } };
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_custom_navBar = resolveEasycom(vue.resolveDynamicComponent("custom-navBar"), __easycom_0$5);
    const _component_i_input = resolveEasycom(vue.resolveDynamicComponent("i-input"), __easycom_1$2);
    const _component_i_button = resolveEasycom(vue.resolveDynamicComponent("i-button"), __easycom_2$2);
    const _component_app_toast = resolveEasycom(vue.resolveDynamicComponent("app-toast"), __easycom_3$3);
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.createElementVNode("view", { class: "container" }, [
          vue.createVNode(_component_custom_navBar, {
            title: "指令",
            "show-back": true,
            backgroundColor: "#fff",
            textColor: "#333",
            showCapsule: false
          }),
          vue.createElementVNode("view", { class: "device-info" }, [
            vue.createElementVNode(
              "text",
              { class: "device-label" },
              "设备ID: " + vue.toDisplayString($setup.imei),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "section" }, [
            vue.createElementVNode("text", { class: "section-title" }, "指令类型"),
            vue.createElementVNode("view", { class: "type-container" }, [
              vue.createElementVNode("view", { class: "type-list" }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($setup.commandTypes, (type, index) => {
                    return vue.openBlock(), vue.createElementBlock("view", {
                      key: type.cmdmId,
                      class: vue.normalizeClass(["type-item", { active: $setup.selectedTypeId == type.cmdmId }]),
                      onClick: ($event) => $setup.selectTypeByItem(type)
                    }, [
                      vue.createElementVNode(
                        "text",
                        { class: "type-name" },
                        vue.toDisplayString(type.cmdName),
                        1
                        /* TEXT */
                      )
                    ], 10, ["onClick"]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ])
            ])
          ]),
          $setup.commands.length ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "section"
          }, [
            vue.createElementVNode("text", { class: "section-title" }, "指令列表"),
            vue.createElementVNode("view", { class: "command-list" }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($setup.commands, (cmd, index) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    key: cmd.predictCmdId,
                    class: vue.normalizeClass(["command-item", { active: $setup.selectedCommandId == cmd.predictCmdId }]),
                    onClick: ($event) => $setup.selectCommand(cmd)
                  }, [
                    vue.createElementVNode(
                      "text",
                      { class: "command-name" },
                      vue.toDisplayString(cmd.cmdName),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "text",
                      { class: "command-descr" },
                      vue.toDisplayString(cmd.remarks),
                      1
                      /* TEXT */
                    )
                  ], 10, ["onClick"]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])
          ])) : vue.createCommentVNode("v-if", true),
          $setup.selectedCommandDetails ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "section"
          }, [
            vue.createElementVNode("view", { class: "param-form" }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($setup.paramConfigs, (param, index) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    key: "param_" + index,
                    class: "param-item"
                  }, [
                    vue.createElementVNode(
                      "text",
                      { class: "section-title" },
                      vue.toDisplayString(param.label),
                      1
                      /* TEXT */
                    ),
                    param.type == "input" ? (vue.openBlock(), vue.createBlock(_component_i_input, {
                      key: 0,
                      class: "param-input",
                      modelValue: $setup.paramValues[index],
                      "onUpdate:modelValue": ($event) => $setup.paramValues[index] = $event,
                      placeholder: "请输入" + param.label,
                      "placeholder-class": "placeholder"
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])) : vue.createCommentVNode("v-if", true),
                    param.type == "number" ? (vue.openBlock(), vue.createBlock(_component_i_input, {
                      key: 1,
                      class: "param-input",
                      type: "number",
                      modelValue: $setup.paramValues[index],
                      "onUpdate:modelValue": ($event) => $setup.paramValues[index] = $event,
                      placeholder: "请输入" + param.label,
                      "placeholder-class": "placeholder",
                      maxlength: param.max
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder", "maxlength"])) : vue.createCommentVNode("v-if", true),
                    param.type == "radio" ? (vue.openBlock(), vue.createElementBlock("view", {
                      key: 2,
                      class: "radio-group"
                    }, [
                      (vue.openBlock(true), vue.createElementBlock(
                        vue.Fragment,
                        null,
                        vue.renderList($setup.getRadioItems(param), (item) => {
                          return vue.openBlock(), vue.createElementBlock("view", {
                            key: "radio_" + item.value,
                            class: "radio-item",
                            onClick: ($event) => $setup.selectRadio(index, $setup.getRadioValue(item))
                          }, [
                            vue.createElementVNode("view", { class: "radio-icon" }, [
                              vue.createElementVNode(
                                "view",
                                {
                                  class: vue.normalizeClass(["radio-inner", { checked: $setup.paramValues[index] == $setup.getRadioValue(item) }])
                                },
                                null,
                                2
                                /* CLASS */
                              )
                            ]),
                            vue.createElementVNode(
                              "text",
                              { class: "radio-label" },
                              vue.toDisplayString($setup.getRadioDescription(item)),
                              1
                              /* TEXT */
                            )
                          ], 8, ["onClick"]);
                        }),
                        128
                        /* KEYED_FRAGMENT */
                      ))
                    ])) : vue.createCommentVNode("v-if", true)
                  ]);
                }),
                128
                /* KEYED_FRAGMENT */
              )),
              vue.createVNode(_component_i_button, {
                type: "primary",
                text: "发送指令",
                class: "submit-btn",
                disabled: !$setup.isFormValid,
                onClick: $setup.sendCommand
              }, null, 8, ["disabled"])
            ])
          ])) : vue.createCommentVNode("v-if", true),
          $setup.commandRecords ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 2,
            class: "section"
          }, [
            vue.createElementVNode("text", { class: "section-title" }, "指令记录"),
            vue.createElementVNode(
              "view",
              { class: "record-list" },
              vue.toDisplayString($setup.commandRecordReason),
              1
              /* TEXT */
            )
          ])) : vue.createCommentVNode("v-if", true),
          !$setup.selectedTypeId ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 3,
            class: "empty-state"
          }, [
            vue.createElementVNode("text", { class: "empty-text" }, "请先选择指令类型")
          ])) : vue.createCommentVNode("v-if", true),
          $setup.loading ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 4,
            class: "loading"
          }, [
            vue.createElementVNode("text", { class: "loading-text" }, "加载中...")
          ])) : $setup.commands.length == 0 && $setup.selectedTypeId != null ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 5,
            class: "empty-state"
          }, [
            vue.createElementVNode("text", { class: "empty-text" }, "暂无指令")
          ])) : vue.createCommentVNode("v-if", true)
        ]),
        vue.createVNode(_component_app_toast)
      ],
      64
      /* STABLE_FRAGMENT */
    );
  }
  const PagesCmdCmd = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$3], ["styles", [_style_0$4]], ["__file", "/Users/xyhc/Documents/carConnectInternet/pages/cmd/cmd.uvue"]]);
  const emptyImage = "/static/empty.png";
  const _sfc_main$3 = /* @__PURE__ */ vue.defineComponent({
    __name: "webview",
    setup(__props, _a) {
      var __expose = _a.expose;
      __expose();
      const webviewUrl = vue.ref("");
      function extractTitleFromUrl(url) {
        let hostname = url;
        const protocolIndex = hostname.indexOf("://");
        if (protocolIndex >= 0) {
          hostname = hostname.substring(protocolIndex + 3);
        }
        const pathIndex = hostname.indexOf("/");
        if (pathIndex >= 0) {
          hostname = hostname.substring(0, pathIndex);
        }
        if (hostname.startsWith("www.")) {
          hostname = hostname.substring(4);
        }
        return hostname;
      }
      vue.onLoad((options) => {
        var _a2, _b, _c, _d;
        uni.__log__("log", "at pages/webview/webview.uvue:44", "接收到的参数:", options);
        const optionData = options;
        const url = (_a2 = optionData.getString("url", "")) !== null && _a2 !== void 0 ? _a2 : "";
        const pageTitle = (_b = optionData.getString("title", "")) !== null && _b !== void 0 ? _b : "";
        if (url != "") {
          let decodedUrl = (_c = decodeURIComponent(url)) !== null && _c !== void 0 ? _c : "";
          if (!decodedUrl.startsWith("http://") && !decodedUrl.startsWith("https://")) {
            decodedUrl = "https://" + decodedUrl;
          }
          webviewUrl.value = decodedUrl;
          if (pageTitle != "") {
            uni.setNavigationBarTitle({
              title: (_d = decodeURIComponent(pageTitle)) !== null && _d !== void 0 ? _d : ""
            });
          } else {
            const extractedTitle = extractTitleFromUrl(decodedUrl);
            uni.setNavigationBarTitle({
              title: extractedTitle != "" ? extractedTitle : "网页加载中..."
            });
          }
        } else {
          showAppToast({
            title: "链接地址无效",
            icon: "none"
          });
        }
      });
      const handleLoad = (e = null) => {
        uni.__log__("log", "at pages/webview/webview.uvue:81", "网页加载成功", e);
        uni.hideLoading();
      };
      const handleError = (e = null) => {
        uni.__log__("error", "at pages/webview/webview.uvue:87", "网页加载失败", e);
        showAppToast({
          title: "页面加载失败",
          icon: "none"
        });
      };
      const handleMessage = (e) => {
        const detail = e.getJSON("detail");
        uni.__log__("log", "at pages/webview/webview.uvue:97", "接收网页消息:", detail);
      };
      const goBack = () => {
        uni.navigateBack(new UTSJSONObject({
          delta: 1
        }));
      };
      const __returned__ = { webviewUrl, emptyImage, extractTitleFromUrl, handleLoad, handleError, handleMessage, goBack };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  const _style_0$3 = { "webview-container": { "": { "width": "100%", "height": "100%", "backgroundColor": "#f5f5f5" } }, "error-page": { ".webview-container ": { "display": "flex", "flexDirection": "column", "justifyContent": "center", "alignItems": "center", "height": "100%", "paddingTop": "40rpx", "paddingRight": "40rpx", "paddingBottom": "40rpx", "paddingLeft": "40rpx" } }, "back-btn": { ".webview-container .error-page ": { "marginTop": "60rpx", "width": "400rpx", "backgroundColor": "#007aff", "color": "#ffffff", "borderTopLeftRadius": "44rpx", "borderTopRightRadius": "44rpx", "borderBottomRightRadius": "44rpx", "borderBottomLeftRadius": "44rpx", "fontSize": "28rpx" } } };
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_web_view = vue.resolveComponent("web-view");
    const _component_i_empty = resolveEasycom(vue.resolveDynamicComponent("i-empty"), __easycom_0);
    const _component_app_toast = resolveEasycom(vue.resolveDynamicComponent("app-toast"), __easycom_3$3);
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.createElementVNode("view", { class: "webview-container" }, [
          $setup.webviewUrl ? (vue.openBlock(), vue.createBlock(_component_web_view, {
            key: 0,
            src: $setup.webviewUrl,
            onMessage: $setup.handleMessage,
            onLoad: $setup.handleLoad,
            onError: $setup.handleError
          }, null, 8, ["src"])) : (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "error-page"
          }, [
            vue.createVNode(_component_i_empty, {
              text: "页面加载失败",
              showButton: false,
              description: "",
              image: $setup.emptyImage
            }),
            vue.createElementVNode("button", {
              class: "back-btn",
              onClick: $setup.goBack
            }, "返回上一页")
          ]))
        ]),
        vue.createVNode(_component_app_toast)
      ],
      64
      /* STABLE_FRAGMENT */
    );
  }
  const PagesWebviewWebview = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$2], ["styles", [_style_0$3]], ["__file", "/Users/xyhc/Documents/carConnectInternet/pages/webview/webview.uvue"]]);
  class DeviceItem extends UTS.UTSType {
    static get$UTSMetadata$() {
      return {
        kind: 2,
        get fields() {
          return {
            plateNo: { type: String, optional: false },
            imei: { type: String, optional: false },
            status: { type: Number, optional: false },
            companyId: { type: String, optional: false },
            deviceName: { type: String, optional: false },
            deviceId: { type: String, optional: false },
            iccid: { type: String, optional: false },
            simMerchant: { type: String, optional: false },
            connectionStatus: { type: String, optional: false }
          };
        },
        name: "DeviceItem"
      };
    }
    constructor(options, metadata = DeviceItem.get$UTSMetadata$(), isJSONParse = false) {
      super();
      this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
      this.plateNo = this.__props__.plateNo;
      this.imei = this.__props__.imei;
      this.status = this.__props__.status;
      this.companyId = this.__props__.companyId;
      this.deviceName = this.__props__.deviceName;
      this.deviceId = this.__props__.deviceId;
      this.iccid = this.__props__.iccid;
      this.simMerchant = this.__props__.simMerchant;
      this.connectionStatus = this.__props__.connectionStatus;
      delete this.__props__;
    }
  }
  const _sfc_main$2 = /* @__PURE__ */ vue.defineComponent({
    __name: "indexListMode",
    props: {
      lists: { type: Array, required: true }
    },
    emits: ["unbindDevice"],
    setup(__props, _a) {
      var __expose = _a.expose, __emit = _a.emit;
      __expose();
      const props = __props;
      const emit = __emit;
      const modal = vue.ref(false);
      const imeis = vue.ref("");
      const needRefresh = vue.ref(false);
      const pay = (iccid, simMerchant) => {
        if (simMerchant.toLowerCase() == "zddx") {
          iccid = iccid.substring(0, iccid.length - 1);
        }
        uni.__log__("log", "at components/indexListMode/indexListMode.uvue:52", iccid);
        needRefresh.value = true;
        needRefresh.value = false;
        showAppToast({
          title: "请在微信小程序中完成充值",
          icon: "none"
        });
      };
      const unbindDevice = (imei) => {
        imeis.value = imei;
        modal.value = true;
      };
      const confirm = () => {
        emit("unbindDevice", imeis.value);
        modal.value = false;
      };
      const cancel = () => {
        modal.value = false;
      };
      const todetail = (companyId, imei, deviceId) => {
        uni.navigateTo({
          url: "/pages/carInfoDetail/carInfoDetail?deptId=" + companyId + "&imei=" + imei + "&deviceId=" + deviceId
        });
      };
      const __returned__ = { props, emit, modal, imeis, needRefresh, pay, unbindDevice, confirm, cancel, todetail };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  const _style_0$2 = { "list-container": { "": { "width": "100%", "height": "100%", "backgroundColor": "#f5f5f5", "paddingTop": 0, "paddingRight": "20rpx", "paddingBottom": 0, "paddingLeft": "20rpx" } }, "list-item": { ".list-container .content ": { "paddingTop": "20rpx", "paddingRight": "20rpx", "paddingBottom": "20rpx", "paddingLeft": "20rpx", "backgroundColor": "#ffffff", "borderTopLeftRadius": "10rpx", "borderTopRightRadius": "10rpx", "borderBottomRightRadius": "10rpx", "borderBottomLeftRadius": "10rpx", "marginBottom": "20rpx" } }, "title": { ".list-container .content .list-item ": { "display": "flex", "flexDirection": "row", "justifyContent": "space-between", "alignItems": "center", "marginBottom": "20rpx" } }, "car-number": { ".list-container .content .list-item .title ": { "display": "flex", "fontSize": "35rpx", "fontWeight": "bold", "marginRight": "20rpx", "flexDirection": "row", "justifyContent": "center", "alignItems": "center" } }, "car-status-spacing": { ".list-container .content .list-item .title ": { "marginLeft": "10rpx" } }, "device-tool-spacing": { ".list-container .content .list-item .title ": { "marginLeft": "10rpx" } }, "device-tools": { ".list-container .content .list-item .title ": { "display": "flex", "flexDirection": "row", "justifyContent": "flex-end", "alignItems": "center" } }, "imei": { ".list-container .content .list-item ": { "color": "#cccccc" } }, "empty": { ".list-container ": { "display": "flex", "flexDirection": "row", "justifyContent": "center", "alignItems": "center", "color": "#cccccc" } } };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_i_tag = resolveEasycom(vue.resolveDynamicComponent("i-tag"), __easycom_1);
    const _component_i_modal = resolveEasycom(vue.resolveDynamicComponent("i-modal"), __easycom_1$3);
    return vue.openBlock(), vue.createElementBlock("view", { class: "list-container" }, [
      $setup.props.lists.length != 0 ? (vue.openBlock(), vue.createElementBlock("scroll-view", {
        key: 0,
        class: "content",
        "scroll-y": ""
      }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($setup.props.lists, (item, index) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              class: "list-item",
              key: index,
              onClick: ($event) => $setup.todetail(item.companyId, item.imei, item.deviceId)
            }, [
              vue.createElementVNode("view", { class: "title" }, [
                vue.createElementVNode("view", { class: "car-number" }, [
                  vue.createTextVNode(
                    vue.toDisplayString(item.deviceName || item.imei) + " ",
                    1
                    /* TEXT */
                  ),
                  vue.createVNode(_component_i_tag, {
                    class: "car-status-spacing",
                    size: "mini",
                    shape: "circle",
                    text: item.connectionStatus == "online" ? "在线" : "离线",
                    type: item.connectionStatus == "online" ? "success" : "error"
                  }, null, 8, ["text", "type"])
                ]),
                vue.createElementVNode("view", { class: "device-tools" }, [
                  vue.createVNode(_component_i_tag, {
                    class: "device-tool-spacing",
                    text: "解绑",
                    type: "warning",
                    onClick: vue.withModifiers(($event) => $setup.unbindDevice(item.imei), ["stop"])
                  }, null, 8, ["onClick"])
                ])
              ]),
              vue.createElementVNode("view", null, [
                vue.createElementVNode(
                  "text",
                  { class: "imei" },
                  "ID: " + vue.toDisplayString(item.imei),
                  1
                  /* TEXT */
                )
              ])
            ], 8, ["onClick"]);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ])) : (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "empty"
      }, " 暂无数据 ")),
      vue.createVNode(_component_i_modal, {
        show: $setup.modal,
        title: "提示",
        content: "是否要解绑设备？",
        buttonReverse: true,
        align: "center",
        confirmText: "确定",
        cancelText: "取消",
        showCancelButton: true,
        onConfirm: $setup.confirm,
        onCancel: $setup.cancel
      }, null, 8, ["show"])
    ]);
  }
  const __easycom_2 = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$1], ["styles", [_style_0$2]], ["__file", "/Users/xyhc/Documents/carConnectInternet/components/indexListMode/indexListMode.uvue"]]);
  const _sfc_main$1 = /* @__PURE__ */ vue.defineComponent({
    __name: "deviceList",
    setup(__props, _a) {
      var __expose = _a.expose;
      __expose();
      const mapScale = vue.ref(4);
      const showMap = vue.ref(true);
      const markers = vue.ref([]);
      const iconColor = vue.ref("#1296db");
      const userLocation = vue.ref(new UTSJSONObject({
        latitude: 0,
        longitude: 0
      }));
      const pickerStateTitle = vue.ref("全部状态");
      const showWhat = () => {
        showMap.value = !showMap.value;
      };
      const originalDeviceList = vue.ref([]);
      const deviceListItems = vue.computed(() => {
        return originalDeviceList.value.map((item) => {
          const imei = item.getString("imei", "");
          const rawDeviceName = item.getString("deviceName", "");
          return new DeviceItem({
            plateNo: item.getString("plateNo", ""),
            imei,
            status: item.getNumber("status", 0),
            companyId: item.getString("companyId", ""),
            deviceName: rawDeviceName != "" ? rawDeviceName : imei,
            deviceId: item.getString("deviceId", ""),
            iccid: item.getString("iccid", ""),
            simMerchant: item.getString("simMerchant", ""),
            connectionStatus: item.getString("connectionStatus", "")
          });
        });
      });
      const filteredDevices = vue.computed(() => {
        if (!Array.isArray(originalDeviceList.value))
          return [];
        let result = [...originalDeviceList.value];
        if (pickerStateTitle.value == "在线") {
          result = result.filter((device) => {
            return device["connectionStatus"] == "online";
          });
        } else if (pickerStateTitle.value === "离线") {
          result = result.filter((device) => {
            return device["connectionStatus"] == "offline";
          });
        }
        return result;
      });
      const totalCount = vue.computed(() => {
        return originalDeviceList.value.length;
      });
      const onlineCount = vue.computed(() => {
        return originalDeviceList.value.filter((d) => {
          return d["connectionStatus"] == "online";
        }).length;
      });
      const offlineCount = vue.computed(() => {
        return totalCount.value - onlineCount.value;
      });
      const updateMarkers = (devices) => {
        var _a2, _b, _c, _d;
        const nextMarkers = [];
        for (let index = 0; index < devices.length; index++) {
          const device = devices[index];
          const latitude = device["latitude"];
          const longitude = device["longitude"];
          if (latitude == null || longitude == null)
            continue;
          const lat = parseFloat(latitude.toString());
          const lng = parseFloat(longitude.toString());
          if (isNaN(lat) || isNaN(lng))
            continue;
          const connectionStatus = (_a2 = device["connectionStatus"]) !== null && _a2 !== void 0 ? _a2 : "";
          const carType = (_b = device["carType"]) !== null && _b !== void 0 ? _b : "";
          const idValue = device["deviceId"];
          const parsedId = idValue != null ? parseInt(idValue.toString()) : NaN;
          const markerId = isNaN(parsedId) ? index + 1 : parsedId;
          const deviceName = (_d = (_c = device["deviceName"]) !== null && _c !== void 0 ? _c : device["plateNo"]) !== null && _d !== void 0 ? _d : "设备";
          nextMarkers.push({
            id: markerId,
            latitude: lat,
            longitude: lng,
            iconPath: getDeviceIcon(connectionStatus, carType),
            width: 30,
            height: 30,
            callout: new UTSJSONObject({
              content: deviceName,
              display: "ALWAYS",
              padding: 8,
              borderRadius: 8,
              bgColor: "#ffffff"
            }),
            anchor: { x: 0.5, y: 0.5 }
          });
        }
        markers.value = nextMarkers;
        if (nextMarkers.length > 0 && userLocation.value.latitude == 0 && userLocation.value.longitude == 0) {
          const firstMarker = nextMarkers[0];
          userLocation.value.latitude = firstMarker.latitude;
          userLocation.value.longitude = firstMarker.longitude;
        }
      };
      vue.watchEffect(() => {
        if (showMap.value) {
          updateMarkers(filteredDevices.value);
        }
      });
      const loadUserDeviceList = (data, from) => {
        return __awaiter(this, void 0, void 0, function* () {
          try {
            let deviceList = data;
            if (from) {
              const params = new UTSJSONObject({ pageSize: 1e3 });
              const res = yield getUserDeviceList(params);
              const list = res.code == 0 && res.data != null ? res.data.list : null;
              if (list == null || !Array.isArray(list)) {
                uni.__log__("warn", "at pages/deviceList/deviceList.uvue:147", "获取设备列表返回异常:", res);
                originalDeviceList.value = [];
                markers.value = [];
                return Promise.resolve(null);
              }
              deviceList = list !== null && list !== void 0 ? list : [];
            }
            if (!Array.isArray(deviceList))
              deviceList = [];
            originalDeviceList.value = CoordTransform.batchConvertCoordinates(deviceList, "tencent");
            updateMarkers(originalDeviceList.value);
          } catch (err) {
            uni.__log__("error", "at pages/deviceList/deviceList.uvue:158", "获取设备列表失败:", err);
            originalDeviceList.value = [];
            markers.value = [];
            showAppToast({ title: "获取设备列表失败", icon: "none" });
          }
        });
      };
      const unbindDevice = (imei) => {
        return __awaiter(this, void 0, void 0, function* () {
          const res = yield delDevice(imei);
          if (res.code == 0) {
            showAppToast({
              title: "解绑成功",
              icon: "success"
            });
            uni.setStorageSync("needRefreshHome", true);
          } else {
            showAppToast({
              title: "解绑失败",
              icon: "error"
            });
          }
          yield loadUserDeviceList([], true);
        });
      };
      const getLocation = () => {
        uni.getLocation(new UTSJSONObject({
          type: "wgs84",
          success: (res) => {
            uni.__log__("log", "at pages/deviceList/deviceList.uvue:187", "获取位置成功:", res);
            userLocation.value.latitude = res.latitude;
            userLocation.value.longitude = res.longitude;
          },
          fail: (err) => {
            uni.__log__("log", "at pages/deviceList/deviceList.uvue:192", "获取位置失败:", err);
          }
        }));
      };
      const subMsg = () => {
        uni.__log__("log", "at pages/deviceList/deviceList.uvue:199", "订阅消息");
        uni.requestSubscribeMessage(new UTSJSONObject({
          tmplIds: ["VRR0UEO9VJOLs0MHlU0OilqX6MVFDwH3_3gz3Oc0NIc"],
          success: (res = null) => {
            uni.__log__("log", "at pages/deviceList/deviceList.uvue:203", "订阅成功:", res);
          },
          fail: (err = null) => {
            uni.__log__("log", "at pages/deviceList/deviceList.uvue:206", "订阅失败:", err);
          }
        }));
      };
      const changeState = (type) => {
        pickerStateTitle.value = type;
      };
      const handleTap = (event = null) => {
        var _a2, _b, _c;
        const detail = event;
        const markerId = detail != null ? detail["markerId"] : null;
        const selectedDevice = UTS.arrayFind(originalDeviceList.value, (device) => {
          return device["deviceId"] == markerId;
        });
        if (selectedDevice == null) {
          uni.__log__("warn", "at pages/deviceList/deviceList.uvue:222", "未找到对应的设备信息", markerId);
          return null;
        }
        const imeiValue = (_a2 = selectedDevice["imei"]) !== null && _a2 !== void 0 ? _a2 : "";
        const companyId = (_b = selectedDevice["companyId"]) !== null && _b !== void 0 ? _b : "";
        const deviceId = (_c = selectedDevice["deviceId"]) !== null && _c !== void 0 ? _c : "";
        uni.navigateTo({
          url: "/pages/carInfoDetail/carInfoDetail?imei=" + imeiValue + "&deptId=" + companyId.toString() + "&deviceId=" + deviceId.toString()
        });
      };
      vue.onLoad((options) => {
        getLocation();
        loadUserDeviceList([], true);
      });
      const __returned__ = { mapScale, showMap, markers, iconColor, userLocation, pickerStateTitle, showWhat, originalDeviceList, deviceListItems, filteredDevices, totalCount, onlineCount, offlineCount, updateMarkers, loadUserDeviceList, unbindDevice, getLocation, subMsg, changeState, handleTap };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  const _style_0$1 = { "container": { "": { "position": "relative", "width": "100%", "height": "100%", "display": "flex", "flexDirection": "column", "backgroundColor": "#f5f7fa" } }, "map-container": { ".container ": { "flexGrow": 1, "flexShrink": 1, "flexBasis": "0%", "width": "100%", "position": "relative" } }, "tool-nav": { ".container ": { "position": "absolute", "top": "200rpx", "right": "20rpx", "zIndex": 100, "display": "flex", "flexDirection": "row", "justifyContent": "center", "alignItems": "center", "fontSize": "35rpx" } }, "btn-map-list": { ".container .tool-nav ": { "paddingTop": "10rpx", "paddingRight": "10rpx", "paddingBottom": "10rpx", "paddingLeft": "10rpx", "backgroundColor": "#1296db", "color": "#ffffff", "borderTopLeftRadius": "10rpx", "borderTopRightRadius": "10rpx", "borderBottomRightRadius": "10rpx", "borderBottomLeftRadius": "10rpx" } }, "right-bar": { ".container ": { "position": "absolute", "top": "25rpx", "left": "20rpx", "zIndex": 100, "display": "flex", "flexDirection": "row", "justifyContent": "center", "alignItems": "center" } }, "status-spacing": { ".container .right-bar ": { "marginLeft": "20rpx" } }, "allCar": { ".container .right-bar ": { "backgroundColor": "#1296db" } }, "onlineCar": { ".container .right-bar ": { "backgroundColor": "#0da117" } }, "offlineCar": { ".container .right-bar ": { "backgroundColor": "#d81e06" } } };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_custom_navBar = resolveEasycom(vue.resolveDynamicComponent("custom-navBar"), __easycom_0$5);
    const _component_map = vue.resolveComponent("map");
    const _component_i_tag = resolveEasycom(vue.resolveDynamicComponent("i-tag"), __easycom_1);
    const _component_indexListMode = resolveEasycom(vue.resolveDynamicComponent("indexListMode"), __easycom_2);
    const _component_app_toast = resolveEasycom(vue.resolveDynamicComponent("app-toast"), __easycom_3$3);
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.createElementVNode("view", { class: "container" }, [
          vue.createVNode(_component_custom_navBar, {
            title: "全部设备",
            "show-back": true,
            backgroundColor: "#f1f1f1",
            textColor: "#333",
            showCapsule: true,
            isIcon: true,
            onCapsuleClick: $setup.showWhat,
            Icon: "/static/maps.png",
            iconColor: $setup.iconColor
          }, null, 8, ["iconColor"]),
          $setup.showMap ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "map-container"
          }, [
            vue.createVNode(_component_map, {
              id: "myMap",
              scale: $setup.mapScale,
              style: { "width": "100%", "height": "100%" },
              onMarkertap: $setup.handleTap,
              latitude: $setup.userLocation.latitude,
              longitude: $setup.userLocation.longitude,
              markers: $setup.markers,
              "enable-traffic": true
            }, null, 8, ["scale", "latitude", "longitude", "markers"]),
            $setup.showMap ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "right-bar"
            }, [
              vue.createVNode(_component_i_tag, {
                type: "primary",
                onClick: _cache[0] || (_cache[0] = ($event) => $setup.changeState("全部")),
                text: "全部 ".concat($setup.totalCount)
              }, null, 8, ["text"]),
              vue.createVNode(_component_i_tag, {
                type: "success",
                onClick: _cache[1] || (_cache[1] = ($event) => $setup.changeState("在线")),
                text: "在线 ".concat($setup.onlineCount)
              }, null, 8, ["text"]),
              vue.createVNode(_component_i_tag, {
                type: "danger",
                onClick: _cache[2] || (_cache[2] = ($event) => $setup.changeState("离线")),
                text: "离线 ".concat($setup.offlineCount)
              }, null, 8, ["text"])
            ])) : vue.createCommentVNode("v-if", true)
          ])) : (vue.openBlock(), vue.createElementBlock("view", { key: 1 }, [
            vue.createVNode(_component_indexListMode, {
              lists: $setup.deviceListItems,
              onUnbindDevice: $setup.unbindDevice
            }, null, 8, ["lists"])
          ]))
        ]),
        vue.createVNode(_component_app_toast)
      ],
      64
      /* STABLE_FRAGMENT */
    );
  }
  const PagesDeviceListDeviceList = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["styles", [_style_0$1]], ["__file", "/Users/xyhc/Documents/carConnectInternet/pages/deviceList/deviceList.uvue"]]);
  __definePage("pages/index/index", PagesIndexIndex);
  __definePage("pages/message/message", PagesMessageMessage);
  __definePage("pages/userCenter/userCenter", PagesUserCenterUserCenter);
  __definePage("pages/login/login", PagesLoginLogin);
  __definePage("pages/carInfoDetail/carInfoDetail", PagesCarInfoDetailCarInfoDetail);
  __definePage("pages/addCar/addCar", PagesAddCarAddCar);
  __definePage("pages/playBack/playBack", PagesPlayBackPlayBack);
  __definePage("uni_modules/lime-action-sheet/pages/index", UniModulesLimeActionSheetPagesIndex);
  __definePage("pages/vehicleTracking/vehicleTracking", PagesVehicleTrackingVehicleTracking);
  __definePage("pages/mileageRecord/mileageRecord", PagesMileageRecordMileageRecord);
  __definePage("pages/stopRecord/stopRecord", PagesStopRecordStopRecord);
  __definePage("pages/userCenter/userInfo/userInfo", PagesUserCenterUserInfoUserInfo);
  __definePage("pages/userCenter/editPassword/editPassword", PagesUserCenterEditPasswordEditPassword);
  __definePage("pages/userCenter/carList/carList", PagesUserCenterCarListCarList);
  __definePage("pages/userCenter/carDetail/carDetail", PagesUserCenterCarDetailCarDetail);
  __definePage("pages/geofencing/geofencing", PagesGeofencingGeofencing);
  __definePage("pages/scancode/scancode", PagesScancodeScancode);
  __definePage("pages/userCenter/payDeviceList/payDeviceList", PagesUserCenterPayDeviceListPayDeviceList);
  __definePage("pages/cmd/cmd", PagesCmdCmd);
  __definePage("pages/webview/webview", PagesWebviewWebview);
  __definePage("pages/deviceList/deviceList", PagesDeviceListDeviceList);
  const _sfc_main = vue.defineComponent({
    onLaunch: function() {
      uni.__log__("log", "at App.uvue:73", "App onLaunch");
    },
    onShow: function() {
      uni.__log__("log", "at App.uvue:77", "App Show");
    },
    onHide: function() {
      uni.__log__("log", "at App.uvue:80", "App Hide");
    },
    onExit: function() {
      uni.__log__("log", "at App.uvue:101", "App Exit");
    }
  });
  const _style_0 = { "uni-row": { "": { "flexDirection": "row" } }, "uni-column": { "": { "flexDirection": "column" } } };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["styles", [_style_0]], ["__file", "/Users/xyhc/Documents/carConnectInternet/App.uvue"]]);
  const __global__ = typeof globalThis === "undefined" ? Function("return this")() : globalThis;
  __global__.__uniX = true;
  function createApp() {
    const app = vue.createSSRApp(App);
    return {
      app
    };
  }
  createApp().app.mount("#app");
})(Vue);
//# sourceMappingURL=../../../cache/.app-ios/sourcemap/app-service.js.map
