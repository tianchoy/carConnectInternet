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
    case "suv":
      return "/static/cars/online/suv.png";
    case "baby":
      return "/static/cars/online/baby.png";
    case "tank":
      return "/static/cars/online/tank.png";
    case "zhuangjia":
      return "/static/cars/online/zhuangjia.png";
    case "wajue":
      return "/static/cars/online/wajue.png";
    case "plan":
      return "/static/cars/online/plan.png";
    case "walk":
      return "/static/cars/online/walk.png";
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
    case "suv":
      return "/static/cars/offline/suv.png";
    case "baby":
      return "/static/cars/offline/baby.png";
    case "tank":
      return "/static/cars/offline/tank.png";
    case "zhuangjia":
      return "/static/cars/offline/zhuangjia.png";
    case "wajue":
      return "/static/cars/offline/wajue.png";
    case "plan":
      return "/static/cars/offline/plan.png";
    case "walk":
      return "/static/cars/offline/walk.png";
    default:
      return "/static/cars/offline/default.png";
  }
};
exports.getOfflineDeviceIcon = getOfflineDeviceIcon;
exports.getOnlineDeviceIcon = getOnlineDeviceIcon;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/cars.js.map
