"use strict";
const common_vendor = require("../../common/vendor.js");
const uni_modules_limeShared_raf_vue = require("../lime-shared/raf/vue.js");
function useTransition(options) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _j;
  const state = common_vendor.ref(false);
  const display = common_vendor.ref(false);
  const inited = common_vendor.ref(false);
  const classes = common_vendor.ref("");
  const name = common_vendor.ref((_a = options.defaultName) !== null && _a !== void 0 ? _a : "fade");
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
  const emitEvent = (event) => {
    var _a2;
    (_a2 = options.emits) === null || _a2 === void 0 ? void 0 : _a2.call(options, event);
  };
  const finished = () => {
    if (isTransitionEnd)
      return;
    isTransitionEnd = true;
    emitEvent(`after-${status}`);
    if (display.value && !state.value) {
      display.value = false;
    }
  };
  const sleep = () => {
    return new Promise((resolve) => {
      common_vendor.nextTick$1(() => {
        uni_modules_limeShared_raf_vue.raf(() => {
          resolve();
        });
      });
    });
  };
  const getClassNames = (name2) => {
    return /* @__PURE__ */ new Map([
      ["enter", `l-${name2}-enter l-${name2}-enter-active ${enterClass} ${enterActiveClass}`],
      ["enter-to", `l-${name2}-enter-to l-${name2}-enter-active ${enterToClass} ${enterActiveClass}`],
      ["leave", `l-${name2}-leave l-${name2}-leave-active ${leaveClass} ${leaveActiveClass}`],
      ["leave-to", `l-${name2}-leave-to l-${name2}-leave-active ${leaveToClass} ${leaveActiveClass}`]
    ]);
  };
  const transitionQueue = common_vendor.ref([]);
  const performTransition = (newStatus, eventName) => {
    return common_vendor.__awaiter(this, void 0, void 0, function* () {
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
        emitEvent(`before-${eventName}`);
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
        yield sleep();
        yield sleep();
        if (status != currentStatus)
          continue;
        classes.value = classNames.get(`${eventName}-to`);
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
  common_vendor.watchEffect(() => {
    if (options.visible == null)
      return;
    state.value = options.visible();
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
  common_vendor.watchEffect(() => {
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
exports.useTransition = useTransition;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/uni_modules/lime-transition/index.js.map
