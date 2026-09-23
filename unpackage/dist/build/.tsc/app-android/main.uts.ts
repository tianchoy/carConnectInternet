import App from './App.uvue'

import { createSSRApp } from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
export function main(app: IApp) {
    enableStyleIsolation();
    definePageRoutes();
    defineAppConfig();
    (createApp()['app'] as VueApp).mount(app, GenUniApp());
}

export class UniAppConfig extends io.dcloud.uniapp.appframe.AppConfig {
    override name: string = "中导物联"
    override appid: string = "__UNI__662B0B4"
    override versionName: string = "1.0.5"
    override versionCode: string = "105"
    override uniCompilerVersion: string = "5.26"
    
    constructor() { super() }
}

import GenPagesIndexIndexClass from './pages/index/index.uvue'
import GenPagesMessageMessageClass from './pages/message/message.uvue'
import GenPagesUserCenterUserCenterClass from './pages/userCenter/userCenter.uvue'
import GenPagesLoginLoginClass from './pages/login/login.uvue'
import GenPagesLoginPersonalPasswordLoginClass from './pages/login/personal-password-login.uvue'
import GenPagesLoginRegisterClass from './pages/login/register.uvue'
import GenPagesLoginForgotPasswordClass from './pages/login/forgot-password.uvue'
import GenPagesLoginSetPasswordClass from './pages/login/set-password.uvue'
import GenPagesCarInfoDetailCarInfoDetailClass from './pages/carInfoDetail/carInfoDetail.uvue'
import GenPagesAddCarAddCarClass from './pages/addCar/addCar.uvue'
import GenPagesPlayBackPlayBackClass from './pages/playBack/playBack.uvue'
import GenUniModulesLimeActionSheetPagesIndexClass from './uni_modules/lime-action-sheet/pages/index.uvue'
import GenPagesVehicleTrackingVehicleTrackingClass from './pages/vehicleTracking/vehicleTracking.uvue'
import GenPagesMileageRecordMileageRecordClass from './pages/mileageRecord/mileageRecord.uvue'
import GenPagesStopRecordStopRecordClass from './pages/stopRecord/stopRecord.uvue'
import GenPagesUserCenterUserInfoUserInfoClass from './pages/userCenter/userInfo/userInfo.uvue'
import GenPagesUserCenterEditPasswordEditPasswordClass from './pages/userCenter/editPassword/editPassword.uvue'
import GenPagesUserCenterCarListCarListClass from './pages/userCenter/carList/carList.uvue'
import GenPagesUserCenterCarDetailCarDetailClass from './pages/userCenter/carDetail/carDetail.uvue'
import GenPagesGeofencingGeofencingClass from './pages/geofencing/geofencing.uvue'
import GenPagesScancodeScancodeClass from './pages/scancode/scancode.uvue'
import GenPagesUserCenterPayDeviceListPayDeviceListClass from './pages/userCenter/payDeviceList/payDeviceList.uvue'
import GenPagesCmdCmdClass from './pages/cmd/cmd.uvue'
import GenPagesWebviewWebviewClass from './pages/webview/webview.uvue'
import GenPagesDeviceListDeviceListClass from './pages/deviceList/deviceList.uvue'
import GenPagesDeviceShareDeviceShareClass from './pages/deviceShare/deviceShare.uvue'
function definePageRoutes() {
__uniRoutes.push({ path: "pages/index/index", component: GenPagesIndexIndexClass, meta: { isQuit: true } as UniPageMeta, style: _uM([["navigationBarTitleText","车联网"]]) } as UniPageRoute)
__uniRoutes.push({ path: "pages/message/message", component: GenPagesMessageMessageClass, meta: { isQuit: false } as UniPageMeta, style: _uM([["navigationBarTitleText","消息"]]) } as UniPageRoute)
__uniRoutes.push({ path: "pages/userCenter/userCenter", component: GenPagesUserCenterUserCenterClass, meta: { isQuit: false } as UniPageMeta, style: _uM([["navigationBarTitleText","我的"]]) } as UniPageRoute)
__uniRoutes.push({ path: "pages/login/login", component: GenPagesLoginLoginClass, meta: { isQuit: false } as UniPageMeta, style: _uM([["navigationBarTitleText","登陆"]]) } as UniPageRoute)
__uniRoutes.push({ path: "pages/login/personal-password-login", component: GenPagesLoginPersonalPasswordLoginClass, meta: { isQuit: false } as UniPageMeta, style: _uM([["navigationBarTitleText","个人账号登录"]]) } as UniPageRoute)
__uniRoutes.push({ path: "pages/login/register", component: GenPagesLoginRegisterClass, meta: { isQuit: false } as UniPageMeta, style: _uM([["navigationBarTitleText","个人用户注册"]]) } as UniPageRoute)
__uniRoutes.push({ path: "pages/login/forgot-password", component: GenPagesLoginForgotPasswordClass, meta: { isQuit: false } as UniPageMeta, style: _uM([["navigationBarTitleText","忘记密码"]]) } as UniPageRoute)
__uniRoutes.push({ path: "pages/login/set-password", component: GenPagesLoginSetPasswordClass, meta: { isQuit: false } as UniPageMeta, style: _uM([["navigationBarTitleText","设置登录密码"]]) } as UniPageRoute)
__uniRoutes.push({ path: "pages/carInfoDetail/carInfoDetail", component: GenPagesCarInfoDetailCarInfoDetailClass, meta: { isQuit: false } as UniPageMeta, style: _uM([["navigationBarTitleText","车辆详情"]]) } as UniPageRoute)
__uniRoutes.push({ path: "pages/addCar/addCar", component: GenPagesAddCarAddCarClass, meta: { isQuit: false } as UniPageMeta, style: _uM([["navigationBarTitleText","添加车辆"]]) } as UniPageRoute)
__uniRoutes.push({ path: "pages/playBack/playBack", component: GenPagesPlayBackPlayBackClass, meta: { isQuit: false } as UniPageMeta, style: _uM([["navigationBarTitleText","轨迹回放"]]) } as UniPageRoute)
__uniRoutes.push({ path: "uni_modules/lime-action-sheet/pages/index", component: GenUniModulesLimeActionSheetPagesIndexClass, meta: { isQuit: false } as UniPageMeta, style: _uM() } as UniPageRoute)
__uniRoutes.push({ path: "pages/vehicleTracking/vehicleTracking", component: GenPagesVehicleTrackingVehicleTrackingClass, meta: { isQuit: false } as UniPageMeta, style: _uM([["navigationBarTitleText","车辆跟踪"]]) } as UniPageRoute)
__uniRoutes.push({ path: "pages/mileageRecord/mileageRecord", component: GenPagesMileageRecordMileageRecordClass, meta: { isQuit: false } as UniPageMeta, style: _uM([["navigationBarTitleText",""]]) } as UniPageRoute)
__uniRoutes.push({ path: "pages/stopRecord/stopRecord", component: GenPagesStopRecordStopRecordClass, meta: { isQuit: false } as UniPageMeta, style: _uM([["navigationBarTitleText",""]]) } as UniPageRoute)
__uniRoutes.push({ path: "pages/userCenter/userInfo/userInfo", component: GenPagesUserCenterUserInfoUserInfoClass, meta: { isQuit: false } as UniPageMeta, style: _uM([["navigationBarTitleText",""]]) } as UniPageRoute)
__uniRoutes.push({ path: "pages/userCenter/editPassword/editPassword", component: GenPagesUserCenterEditPasswordEditPasswordClass, meta: { isQuit: false } as UniPageMeta, style: _uM([["navigationBarTitleText",""]]) } as UniPageRoute)
__uniRoutes.push({ path: "pages/userCenter/carList/carList", component: GenPagesUserCenterCarListCarListClass, meta: { isQuit: false } as UniPageMeta, style: _uM([["navigationBarTitleText",""]]) } as UniPageRoute)
__uniRoutes.push({ path: "pages/userCenter/carDetail/carDetail", component: GenPagesUserCenterCarDetailCarDetailClass, meta: { isQuit: false } as UniPageMeta, style: _uM([["navigationBarTitleText",""]]) } as UniPageRoute)
__uniRoutes.push({ path: "pages/geofencing/geofencing", component: GenPagesGeofencingGeofencingClass, meta: { isQuit: false } as UniPageMeta, style: _uM([["navigationBarTitleText",""]]) } as UniPageRoute)
__uniRoutes.push({ path: "pages/scancode/scancode", component: GenPagesScancodeScancodeClass, meta: { isQuit: false } as UniPageMeta, style: _uM([["navigationBarTitleText",""]]) } as UniPageRoute)
__uniRoutes.push({ path: "pages/userCenter/payDeviceList/payDeviceList", component: GenPagesUserCenterPayDeviceListPayDeviceListClass, meta: { isQuit: false } as UniPageMeta, style: _uM([["navigationBarTitleText",""]]) } as UniPageRoute)
__uniRoutes.push({ path: "pages/cmd/cmd", component: GenPagesCmdCmdClass, meta: { isQuit: false } as UniPageMeta, style: _uM([["navigationBarTitleText",""]]) } as UniPageRoute)
__uniRoutes.push({ path: "pages/webview/webview", component: GenPagesWebviewWebviewClass, meta: { isQuit: false } as UniPageMeta, style: _uM([["navigationBarTitleText",""]]) } as UniPageRoute)
__uniRoutes.push({ path: "pages/deviceList/deviceList", component: GenPagesDeviceListDeviceListClass, meta: { isQuit: false } as UniPageMeta, style: _uM([["navigationBarTitleText","设备列表"]]) } as UniPageRoute)
__uniRoutes.push({ path: "pages/deviceShare/deviceShare", component: GenPagesDeviceShareDeviceShareClass, meta: { isQuit: false } as UniPageMeta, style: _uM([["navigationBarTitleText","设备分享"]]) } as UniPageRoute)
}
const __uniTabBar: Map<string, any | null> | null = _uM([["color","#2c2c2c"],["selectedColor","#d81e06"],["borderStyle","black"],["backgroundColor","#ffffff"],["list",[_uM([["pagePath","pages/index/index"],["iconPath","/static/tabBar/home.png"],["selectedIconPath","/static/tabBar/home1.png"],["text","首页"]]),_uM([["pagePath","pages/message/message"],["iconPath","/static/tabBar/message.png"],["selectedIconPath","/static/tabBar/message1.png"],["text","消息"]]),_uM([["pagePath","pages/userCenter/userCenter"],["iconPath","/static/tabBar/userCenter.png"],["selectedIconPath","/static/tabBar/userCenter1.png"],["text","我的"]])]]])
const __uniLaunchPage: Map<string, any | null> = _uM([["url","pages/index/index"],["style",_uM([["navigationBarTitleText","车联网"]])]])
function defineAppConfig(){
  __uniConfig.entryPagePath = '/pages/index/index'
  __uniConfig.globalStyle = _uM([["navigationStyle","custom"],["navigationBarTextStyle","black"],["navigationBarTitleText","车联网"],["navigationBarBackgroundColor","#F8F8F8"],["backgroundColor","#F8F8F8"]])
  __uniConfig.getTabBarConfig = ():Map<string, any> | null =>  _uM([["color","#2c2c2c"],["selectedColor","#d81e06"],["borderStyle","black"],["backgroundColor","#ffffff"],["list",[_uM([["pagePath","pages/index/index"],["iconPath","/static/tabBar/home.png"],["selectedIconPath","/static/tabBar/home1.png"],["text","首页"]]),_uM([["pagePath","pages/message/message"],["iconPath","/static/tabBar/message.png"],["selectedIconPath","/static/tabBar/message1.png"],["text","消息"]]),_uM([["pagePath","pages/userCenter/userCenter"],["iconPath","/static/tabBar/userCenter.png"],["selectedIconPath","/static/tabBar/userCenter1.png"],["text","我的"]])]]])
  __uniConfig.tabBar = __uniConfig.getTabBarConfig()
  __uniConfig.conditionUrl = ''
  __uniConfig.uniIdRouter = _uM()
  
  __uniConfig.ready = true
}


function __decodeUniCloudSpaceList() : string {
    const data : Array<number> = [25514,44541,12760,2386,51065,32189,49625,43791,48085,18606,28749,58296,38674,35712,50017,16990,39433,36316,64062,32000,21982,65508,55012,58466,53568,44067,27712,56249,2202,49685,4578,50371,41343,18113,57207,11374,19650,51942,13587,5261,45642,34767,37824,20838,12992,8833,35572,9115,43362,15155,31393,17624,41930,61086,45486,13233,18491,38028,58350,30422,15473,56625,23997,642,50487,57996,38680,15635,25318,59942,25654,43610,44994,36808,43275,52499,61555,46200,32816,8244,10808,52808,14662,21538,15847,34363,48197,45032,39683,34279,21148,58926,51241,15072,29446,62735,11058,21691,37999,26950,12088,45787,27371,22002,21649,16047,41244,19627,47519,26502,40993,34175,24186,6627,37060,37701,37765,11890,57541,52805,32394,20982,19921,22134,21852,23379,35941,3531,24821,47225,54814,11140,5043,63145,9090,61926,36775,26146,19070,33078,38180,45524,42716,38692,64158,24525,17137,1600,54530,15396,60709,46131,10278,41017,10089,17154,901,47332,36396,61019,42154,22420,24882,35865,36439,22528,60774,46012,47988,35531,15450,45532,55432,36182,26371,30393,24784,53630,28094,52574,21204,13519,10280,48689,36562,62745,58169,19245,34134,37647,41680,29459,27457,19296,20849,18666,47020,45864,51900,47656,63209,45972,5460,11719]
    const mask : Array<number> = [25585,44422,12794,2338,50955,32210,49583,43878,48049,18635,28735,58266,38696,35746,49920,16946,39520,36261,64075,32110,22012,65480,54982,58385,53552,44098,27683,56284,2260,49780,4495,50342,41309,18171,57173,11284,19622,51855,13692,5369,45671,34732,37793,20756,13026,8877,35542,9192,43282,15186,31426,17597,41859,61178,45452,13195,18457,38113,58270,30459,15426,56578,23951,690,50513,58090,38782,15730,25291,59925,25603,43618,45045,36837,43327,52513,61456,46158,32797,8204,10761,52782,14709,21519,15828,34399,48160,45008,39783,34178,21156,58904,51276,15058,29536,62825,11024,21655,37965,26917,12116,45746,27278,21916,21733,16124,41337,19656,47597,26595,41045,34141,24128,6593,37047,37756,37877,11828,57486,52770,32495,20888,19903,22037,21786,23357,35882,3486,24733,47147,54873,11211,5113,63193,9185,61841,36762,26143,19036,33050,38150,45489,42674,38720,64238,24482,17048,1582,54646,15366,60703,46097,10318,41037,10013,17266,1014,47326,36355,61044,42187,22500,24923,35895,36409,22629,60702,46024,47962,35497,15401,45484,55529,36134,26483,30359,24755,53521,28115,52604,21240,13549,10318,48720,36539,62837,58198,19291,34099,37757,41621,29565,27429,19216,20766,18563,47042,45916,51870,47634,63179,46006,5417,11674]
    let result = ''
    for (let i = 0; i < data.length; i++) {
        result += String.fromCharCode(data[i] ^ mask[i])
    }
    return result
}

export class UniCloudConfig extends io.dcloud.unicloud.InternalUniCloudConfig {
    override isDev : boolean = false
    override spaceList : string = __decodeUniCloudSpaceList()
    override debuggerInfo ?: string = null
    override secureNetworkEnable : boolean = false
    override secureNetworkConfig ?: string = "[]"
    constructor() { super() }
}
