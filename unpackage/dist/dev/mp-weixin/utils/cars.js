"use strict";
const getOnlineDeviceIcon = (deviceType = null) => {
  switch (deviceType) {
    case "car":
      return "/static/cars/online/car.png";
    case "bus":
      return "/static/cars/online/bus.png";
    case "bike":
      return "/static/cars/online/bike.png";
    case "moto":
      return "/static/cars/online/moto.png";
    case "diandong":
      return "/static/cars/online/diandong.png";
    case "huoche":
      return "/static/cars/online/huoche.png";
    case "sanlun":
      return "/static/cars/online/sanlun.png";
    case "tuola":
      return "/static/cars/online/tuola.png";
    default:
      return "/static/cars/online/default.png";
  }
};
const getOfflineDeviceIcon = (deviceType = null) => {
  switch (deviceType) {
    case "car":
      return "/static/cars/offline/car.png";
    case "bus":
      return "/static/cars/offline/bus.png";
    case "bike":
      return "/static/cars/offline/bike.png";
    case "moto":
      return "/static/cars/offline/moto.png";
    case "diandong":
      return "/static/cars/offline/diandong.png";
    case "huoche":
      return "/static/cars/offline/huoche.png";
    case "sanlun":
      return "/static/cars/offline/sanlun.png";
    case "tuola":
      return "/static/cars/offline/tuola.png";
    default:
      return "/static/cars/offline/default.png";
  }
};
exports.getOfflineDeviceIcon = getOfflineDeviceIcon;
exports.getOnlineDeviceIcon = getOnlineDeviceIcon;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/cars.js.map
