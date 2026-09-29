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
    const data : Array<number> = [45458,4556,53251,27798,40798,4559,29633,3393,39722,10197,57300,16911,855,11039,41570,53684,51436,54403,27290,158,20685,62116,56608,2485,52557,1424,3332,48594,259,63943,41379,46773,6187,39679,9897,9841,24765,16321,2543,38662,34369,33135,29081,19156,54686,37148,13957,43436,64762,36961,26027,7957,37657,34487,49136,55867,726,61396,12209,64649,60351,39549,19528,885,29182,56206,44288,1186,25560,42787,1062,38197,42845,12790,35526,52357,11501,55100,41976,16106,31026,40563,39449,54485,13824,64331,37342,23810,31884,47508,58073,22641,54561,11880,27989,19061,56340,14964,14367,4079,23943,13892,24546,27225,21829,1773,3756,37434,64213,59576,22888,38579,15206,23979,705,47976,46597,16044,60589,19663,18755,34666,37624,19335,48778,24205,43537,33905,2813,46776,61911,32204,43030,63045,27929,47248,1040,7598,7472,52106,44127,16252,65218,31824,6172,14064,7989,1308,42799,39222,64157,33576,14936,29605,53709,2067,32708,26828,36615,5163,15957,28755,8925,9811,14213,28443,42164,62376,23716,16315,2182,19185,58039,40775,36048,27401,7566,64371,44150,54119,39790,49903,48639,58022,94,13133,20928,38199,11396,43801,33934,12714,54397,52309,46160,34440,38904,38784,38477,33296,15868,62813,28393,36844]
    const mask : Array<number> = [45513,4535,53281,27878,40748,4512,29623,3368,39758,10160,57254,16941,877,11069,41475,53720,51333,54522,27375,240,20719,62088,56578,2502,52541,1521,3431,48567,333,63910,41422,46800,6153,39621,9867,9739,24793,16296,2432,38770,34412,33036,29176,19110,54716,37168,13991,43487,64650,36864,26056,8048,37712,34515,49106,55809,756,61369,12225,64676,60300,39502,19578,837,29080,56296,44390,1219,25589,42768,1043,38157,42858,12763,35570,52407,11406,55050,41941,16082,30979,40469,39466,54520,13875,64303,37307,23866,31976,47601,58081,22599,54596,11866,27955,18963,56374,14936,14397,3980,24043,13869,24455,27191,21809,1726,3785,37465,64167,59613,22812,38545,15196,23945,690,47953,46709,16106,60646,19624,18726,34564,37526,19428,48844,24291,43614,33828,2709,46826,61840,32131,43100,63029,28026,47335,1069,7571,7442,52134,44157,16153,65196,31796,6252,13983,8028,1394,42843,39188,64167,33546,14896,29649,53689,2147,32695,26870,36648,5124,15924,28707,8884,9853,14315,28542,42188,62428,23690,16345,2293,19073,58070,40759,36000,27431,7661,64284,44059,54085,39746,49869,48537,58055,55,13089,20911,38209,11489,43883,33995,12740,54297,52261,46143,34529,38806,38900,38511,33322,15838,62847,28308,36785]
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
