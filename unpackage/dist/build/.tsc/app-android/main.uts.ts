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
    override uniCompilerVersion: string = "5.31"
    
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
const __uniTabBar: Map<string, any | null> | null = null
const __uniLaunchPage: Map<string, any | null> = _uM([["url","pages/index/index"],["style",_uM([["navigationBarTitleText","车联网"]])]])
function defineAppConfig(){
  __uniConfig.entryPagePath = '/pages/index/index'
  __uniConfig.globalStyle = _uM([["navigationStyle","custom"],["navigationBarTextStyle","black"],["navigationBarTitleText","车联网"],["navigationBarBackgroundColor","#F8F8F8"],["backgroundColor","#F8F8F8"]])
  __uniConfig.getTabBarConfig = ():Map<string, any> | null =>  null
  __uniConfig.tabBar = __uniConfig.getTabBarConfig()
  __uniConfig.conditionUrl = ''
  __uniConfig.uniIdRouter = _uM()
  
  __uniConfig.ready = true
}


function __decodeUniCloudSpaceList() : string {
    const data : Array<number> = [52098,14119,19939,47802,29608,61628,12051,47316,4751,292,19243,896,20572,6780,14520,62564,30280,38525,46047,19856,24331,6899,2446,38693,28468,25144,64561,12712,24037,65453,33045,53927,794,47726,12369,31605,39399,11171,23194,7942,34173,46179,41374,39820,50646,6168,26939,43692,6218,48330,36338,63428,63827,44293,28043,32704,5750,52170,60942,37514,40935,3141,35789,6489,39990,25880,35978,627,61834,50873,52391,23894,18010,20709,15627,59995,21220,52133,20334,25728,21436,3710,7325,31551,37844,46920,54600,1861,32107,25540,9831,10595,80,24523,22865,38683,16758,23388,55664,15681,45782,47868,56790,8236,19716,5276,6752,54467,64889,33971,20602,42389,33453,12129,35183,26803,28010,58475,29521,44292,22344,29504,30515,819,38462,4701,40393,34142,18682,49928,10692,23855,5507,6629,14712,62527,7093,13565,1429,64769,9253,55291,23131,24526,57969,18406,25071,6720,51960,6454,28736,58339,15269,5063,37038,51278,56750,55032,45937,27906,50787,29902,54632,58996,30312,28819,28534,52326,63071,44307,48585,50371,41913,41187,62556,16804,34408,17376,29188,29308,15758,38728,65023,53270,2322,10921,15953,54211,60393,17623,23737,253,47237,42362,44803,20228,13364,24832,23087,61137,52717,33828,34896,10613]
    const mask : Array<number> = [52185,14172,19905,47818,29658,61651,12133,47293,4843,321,19289,930,20582,6750,14553,62472,30241,38404,45994,19966,24361,6879,2476,38742,28484,25177,64594,12749,23979,65484,33144,53954,824,47700,12403,31503,39299,11210,23285,8050,34128,46080,41471,39934,50676,6196,26905,43743,6202,48299,36241,63393,63770,44385,28073,32762,5716,52135,61054,37543,40916,3190,35839,6505,40016,25982,36076,530,61863,50826,52370,23918,18029,20680,15679,60009,21127,52115,20291,25784,21389,3608,7342,31506,37863,46892,54573,1917,32015,25505,9823,10581,53,24569,22839,38781,16724,23408,55634,15650,45754,47765,56755,8258,19824,5327,6661,54432,64779,34006,20494,42423,33431,12099,35100,26762,27930,58413,29466,44387,22317,29486,30557,848,38520,4659,40326,34059,18578,50010,10627,23904,5577,6549,14619,62536,7048,13504,1463,64813,9223,55198,23093,24490,57857,18313,24966,6702,51852,6420,28794,58305,15309,5043,37082,51262,56797,54978,45918,27949,50690,29886,54529,58970,30214,28918,28430,52242,63089,44401,48570,50355,41944,41107,62508,16778,34315,17295,29289,29278,15778,38762,64921,53367,2427,10949,15934,54197,60300,17573,23804,147,47329,42250,44908,20333,13402,24948,23053,61163,52687,33798,34861,10536]
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
