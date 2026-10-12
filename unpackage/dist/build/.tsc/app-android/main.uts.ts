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
    const data : Array<number> = [35565,50812,63768,44564,64658,31391,20560,19860,1829,23054,21624,51677,15460,23749,61969,51613,6140,10536,28326,40404,22240,5170,24157,38554,34669,12296,41632,10048,52845,33043,25417,65049,42474,10780,21272,26578,53297,9820,15858,31829,22391,25357,6856,26853,43998,19976,24779,24566,45217,5391,41454,23122,30593,19835,24284,50645,21975,13279,16019,15493,34861,36263,56735,59283,49113,61861,56320,26442,15425,19726,14434,41765,2834,51866,50146,48766,14652,41634,54544,23513,55860,17829,38898,27878,6873,20790,57894,12412,13375,54074,39037,14127,57384,4377,33382,16254,40419,26751,20767,37536,26157,20396,11456,27793,24156,9978,47206,43175,51413,47506,43882,47096,24088,36739,22524,5897,11877,45325,33591,49714,24316,53578,2072,59564,27082,25637,17685,43605,22169,56686,19759,4131,64325,59049,27142,26199,14541,25810,11500,48480,14180,26173,3749,49372,18262,55334,32235,32846,33344,1921,5348,37125,5281,3131,47699,43558,61398,4477,34402,22794,47634,64516,7134,38161,3306,59163,34411,37250,28078,6890,11065,50050,24646,58278,21475,57527,12975,58976,545,54569,36463,19915,18777,44308,28521,36606,42252,637,3196,14040,7362,23709,1532,11950,10944,22274,47549,8318,48959,33687,62902,19778,20012,58064]
    const mask : Array<number> = [35510,50695,63802,44644,64736,31472,20518,19965,1857,23147,21514,51711,15454,23783,62064,51697,6037,10577,28371,40378,22210,5150,24191,38633,34589,12393,41667,10021,52771,33138,25380,65148,42440,10790,21306,26536,53333,9781,15773,31777,22362,25454,6825,26775,44028,20004,24809,24453,45265,5486,41357,23095,30664,19743,24318,50671,22005,13234,16099,15528,34846,36244,56749,59299,49087,61891,56422,26411,15468,19773,14423,41757,2853,51895,50134,48716,14687,41620,54589,23521,55813,17859,38849,27851,6890,20818,57923,12356,13403,54111,38981,14105,57421,4395,33280,16152,40385,26707,20797,37571,26177,20421,11429,27903,24104,9897,47107,43204,51367,47607,43806,47066,24098,36769,22415,5936,11797,45387,33660,49749,24217,53540,2166,59599,27020,25675,17754,43520,22257,56636,19816,4204,64271,59097,27237,26144,14576,25839,11470,48460,14150,26200,3787,49336,18214,55369,32130,32800,33332,1955,5342,37159,5321,3151,47655,43606,61349,4423,34381,22821,47731,64628,7095,38207,3204,59262,34323,37366,28032,6792,11082,50162,24615,58326,21395,57497,13004,58895,588,54539,36419,19945,18751,44405,28416,36498,42339,523,3097,13994,7303,23795,1432,11998,10927,22379,47571,8202,48925,33709,62868,19808,20049,57997]
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
