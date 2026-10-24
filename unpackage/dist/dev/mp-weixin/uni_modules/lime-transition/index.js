"use strict";
const uni_modules_limeShared_raf_vue = require("../lime-shared/raf/vue.js");
const common_vendor = require("../../common/vendor.js");
function useTransition(options) {
  const state = common_vendor.ref(false);
  const display = common_vendor.ref(false);
  const inited = common_vendor.ref(false);
  const classes = common_vendor.ref("");
  const name = common_vendor.ref(options.defaultName ?? "fade");
  const enterClass = options.enterClass ?? "";
  const enterActiveClass = options.enterActiveClass ?? "";
  const enterToClass = options.enterToClass ?? "";
  const leaveActiveClass = options.leaveActiveClass ?? "";
  const leaveToClass = options.leaveToClass ?? "";
  const leaveClass = options.leaveClass ?? "";
  const appear = options.appear ?? false;
  const duration = options.duration ?? 300;
  let status = "";
  let isTransitionEnd = false;
  let isTransitioning = false;
  let timeoutId = -1;
  let finishTimeoutId = -1;
  const emitEvent = (event) => {
    var _a;
    (_a = options.emits) == null ? void 0 : _a.call(options, event);
  };
  const finished = () => {
    if (isTransitionEnd)
      return;
    isTransitionEnd = true;
    clearTimeout(finishTimeoutId);
    if (options.removeClasses ?? false) {
      classes.value = "";
    }
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
  const performTransition = async (newStatus, eventName) => {
    var _a;
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
      await sleep();
      await sleep();
      await sleep();
      await sleep();
      await sleep();
      if (status != currentStatus)
        continue;
      const classNames = getClassNames(name.value);
      inited.value = true;
      display.value = true;
      classes.value = classNames.get(eventName);
      emitEvent(eventName);
      const executeAfterTick = (_a = options.onNextTick) == null ? void 0 : _a.call(options, eventName);
      if (executeAfterTick != null) {
        await executeAfterTick;
      }
      await sleep();
      await sleep();
      await sleep();
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
  };
  const enter = () => {
    performTransition("enter", "enter");
  };
  const leave = () => {
    performTransition("leave", "leave");
  };
  let init = false;
  let lastState = null;
  common_vendor.watchEffect(() => {
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
