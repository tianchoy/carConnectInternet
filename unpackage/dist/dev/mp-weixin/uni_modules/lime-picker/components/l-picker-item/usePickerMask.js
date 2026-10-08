"use strict";
const common_vendor = require("../../../../common/vendor.js");
const usePickerMask = (backgroundColorRef, isDarkModeRef, maskColorsRef, isInitializedRef) => {
  const maskConfig = common_vendor.computed(() => {
    const bgColor = backgroundColorRef.value;
    const isDark = isDarkModeRef.value;
    const maskColors = maskColorsRef == null ? void 0 : maskColorsRef.value;
    if (maskColors != null && maskColors.length >= 1) {
      const maskStartColor = maskColors[0];
      const maskEndColor = maskColors.length > 1 ? maskColors[1] : "rgba(0,0,0,0)";
      return {
        maskStartColor,
        maskEndColor
      };
    }
    const bg = bgColor ?? (isDark ? "#242424" : "#ffffff");
    const endColor = isDark ? "rgba(36, 36, 36, 0)" : "rgba(255, 255, 255, 0)";
    return {
      maskStartColor: bg,
      maskEndColor: endColor
    };
  });
  const platformMaskStyles = common_vendor.computed(() => {
    const { maskStartColor, maskEndColor } = maskConfig.value;
    const clean = (str) => str.replace(/\s+/g, " ").trim();
    return {
      common: backgroundColorRef.value == null && !isDarkModeRef.value ? clean(`background-image:
					linear-gradient(180deg, ${maskStartColor}, ${maskEndColor}),
					linear-gradient(0deg, ${maskStartColor}, ${maskEndColor})`) : "",
      top: `background-image: linear-gradient(to bottom, ${maskStartColor}, ${maskEndColor})`,
      bottom: `background-image: linear-gradient(to top, ${maskStartColor}, ${maskEndColor})`
    };
  });
  return {
    maskConfig,
    platformMaskStyles
  };
};
exports.usePickerMask = usePickerMask;
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/lime-picker/components/l-picker-item/usePickerMask.js.map
