"use strict";
const getDeviceIcon = (connectionStatus = null, carType = null) => {
  const basePath = connectionStatus === "online" ? "/static/cars/online/" : "/static/cars/offline/";
  const validTypes = ["car", "bus", "bike", "moto", "diandong", "huoche", "sanlun", "tuola", "suv", "baby", "tank", "zhuangjia", "wajue", "plan", "walk", "muma", "hangmu", "junjian", "tuiche", "train"];
  let iconPath = basePath + "default.png";
  if (validTypes.includes(carType)) {
    iconPath = basePath + carType + ".png";
  }
  return iconPath;
};
exports.getDeviceIcon = getDeviceIcon;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/cars.js.map
