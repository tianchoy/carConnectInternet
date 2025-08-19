"use strict";
const common_vendor = require("../../common/vendor.js");
require("../../utils/tiandituRoute.js");
require("../../api/http.js");
if (!Array) {
  const _easycom_custom_navBar_1 = common_vendor.resolveComponent("custom-navBar");
  const _easycom_sub_navBar_1 = common_vendor.resolveComponent("sub-navBar");
  (_easycom_custom_navBar_1 + _easycom_sub_navBar_1)();
}
const _easycom_custom_navBar = () => "../../components/custom-navBar/custom-navBar.js";
const _easycom_sub_navBar = () => "../../components/sub-navBar/sub-navBar.js";
if (!Math) {
  (_easycom_custom_navBar + _easycom_sub_navBar)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "geofencing",
  setup(__props) {
    const imei = common_vendor.ref("");
    const connectionStatus = common_vendor.ref("");
    const center = common_vendor.reactive(new UTSJSONObject({
      latitude: 39.90469,
      longitude: 116.40717
    }));
    const mapScale = common_vendor.ref(15);
    const polygons = common_vendor.ref([]);
    const currentCar = common_vendor.ref("京A12345");
    common_vendor.onLoad((option) => {
      connectionStatus.value = option.connectionStatus;
      imei.value = option.imei;
      currentCar.value = option.plateNo;
      loadGeoData();
    });
    const parsePolygon = (polygonStr) => {
      const coordStr = polygonStr.replace(/POLYGON \(\(/, "").replace(/\)\)/, "");
      const points = coordStr.split(",");
      return points.map((point) => {
        const _a = common_vendor.__read(point.trim().split(" ").map(Number), 2), lat = _a[0], lng = _a[1];
        return new UTSJSONObject({
          latitude: lat,
          longitude: lng
        });
      });
    };
    const setMapCenterToFence = (fencePoints) => {
      if (fencePoints.length === 0)
        return null;
      let totalLat = 0;
      let totalLng = 0;
      fencePoints.forEach((point = null) => {
        totalLat += point.latitude;
        totalLng += point.longitude;
      });
      center.latitude = totalLat / fencePoints.length;
      center.longitude = totalLng / fencePoints.length;
    };
    const loadGeoData = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (imei.value != null) {
          try {
            const res = new UTSJSONObject({
              "code": 0,
              "msg": "success",
              "data": [
                new UTSJSONObject({
                  "id": "geofence-1132635302368776192",
                  "name": "临沂护台小区",
                  "area": "POLYGON ((35.00224297962699 118.27432551316393, 35.0073007687663 118.27558949681305, 35.005152652989636 118.27515650223386, 35.00568851180233 118.27490360192313, 35.005690652725086 118.27962994512339, 35.001147079095205 118.27937666309187, 35.00128942430292 118.2764536042161))",
                  "attributes": null,
                  "description": null,
                  "companyId": "1",
                  "icon": "el-icon-map-location",
                  "createTime": "2025-06-18 08:49:25",
                  "updateTime": "2025-08-07 18:00:51",
                  "alarmType": 1,
                  "fenceType": null,
                  "deviceCount": 1
                }),
                new UTSJSONObject({
                  "id": "geofence-1150895307245096960",
                  "name": "汝州",
                  "area": "POLYGON ((33.998197999928564 112.90414666428558, 34.02528923431426 112.90762061246076, 34.02123597411279 112.95297470703494, 33.997317780676376 112.93513604401471))",
                  "attributes": null,
                  "description": null,
                  "companyId": "1",
                  "icon": "el-icon-map-location",
                  "createTime": "2025-08-07 18:08:09",
                  "updateTime": null,
                  "alarmType": 1,
                  "fenceType": null,
                  "deviceCount": 1
                })
              ]
            });
            common_vendor.index.__f__("log", "at pages/geofencing/geofencing.uvue:111", "地理围栏数据:", res);
            if (res.code === 0 && res.data && res.data.length > 0) {
              const fencePolygons = res.data.map((fence = null, index) => {
                const points = parsePolygon(fence.area);
                if (index === 0) {
                  setMapCenterToFence(points);
                }
                const colors = [
                  new UTSJSONObject({ fillColor: "#7cb30580", strokeColor: "#7cb305" }),
                  new UTSJSONObject(
                    // 浅绿色
                    { fillColor: "#1890ff80", strokeColor: "#1890ff" }
                  ),
                  new UTSJSONObject(
                    // 浅蓝色
                    { fillColor: "#fa8c1680", strokeColor: "#fa8c16" }
                  ),
                  new UTSJSONObject(
                    // 橙色
                    { fillColor: "#f5222d80", strokeColor: "#f5222d" }
                    // 红色
                  )
                ];
                const colorIndex = index % colors.length;
                return new UTSJSONObject({
                  points,
                  fillColor: colors[colorIndex].fillColor,
                  strokeColor: colors[colorIndex].strokeColor,
                  strokeWidth: 2,
                  zIndex: 10,
                  id: fence.id
                });
              });
              polygons.value = fencePolygons;
            }
          } catch (error) {
            common_vendor.index.__f__("error", "at pages/geofencing/geofencing.uvue:146", "加载地理围栏失败:", error);
          }
        }
      });
    };
    return (_ctx = null, _cache = null) => {
      const __returned__ = {
        a: common_vendor.p({
          title: "地理围栏",
          ["show-back"]: true,
          backgroundColor: "#fff",
          textColor: "#333",
          showCapsule: false
        }),
        b: common_vendor.p({
          showTime: false,
          currentCar: currentCar.value,
          showCar: "true",
          carStatus: connectionStatus.value
        }),
        c: common_vendor.sei("myMap", "map"),
        d: center.latitude,
        e: center.longitude,
        f: mapScale.value,
        g: polygons.value,
        h: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
      };
      return __returned__;
    };
  }
});
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/geofencing/geofencing.js.map
