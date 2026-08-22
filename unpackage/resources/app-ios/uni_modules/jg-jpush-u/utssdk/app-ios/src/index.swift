import AdSupport
import AppTrackingTransparency
import Assignables
import CoreFoundation
import DCloudUTSFoundation
import DCloudUniappRuntime
import Foundation
import MarketplaceKit
import Swift
import UIKit
import UserNotifications
@objc(UTSSDKModulesJgJpushUEventCallBack)
@objcMembers
public class EventCallBack : NSObject, UTSObject {
    public var eventName: String!
    public var eventData: String!
    public subscript(_ key: String) -> Any? {
        get {
            return utsSubscriptGetValue(key)
        }
        set {
            switch(key){
                case "eventName":
                    self.eventName = try! utsSubscriptCheckValue(newValue)
                case "eventData":
                    self.eventData = try! utsSubscriptCheckValue(newValue)
                default:
                    break
            }
        }
    }
    public override init() {
        super.init()
    }
    public init(_ obj: UTSJSONObject) {
        self.eventName = obj["eventName"] as! String
        self.eventData = obj["eventData"] as! String
    }
}
@objc(UTSSDKModulesJgJpushUEventCallBackParams)
@objcMembers
public class EventCallBackParams : NSObject, UTSObject {
    public var callback: ((_ res: EventCallBack) -> Void)?
    public subscript(_ key: String) -> Any? {
        get {
            return utsSubscriptGetValue(key)
        }
        set {
            switch(key){
                case "callback":
                    self.callback = try! utsSubscriptCheckValueIfPresent(newValue)
                default:
                    break
            }
        }
    }
    public override init() {
        super.init()
    }
    public init(_ obj: UTSJSONObject) {
        self.callback = obj["callback"] as! ((_ res: EventCallBack) -> Void)?
    }
}
@objc(UTSSDKModulesJgJpushURegistrationIdResult)
@objcMembers
public class RegistrationIdResult : NSObject, UTSObject {
    public var code: NSNumber!
    public var registrationId: String!
    public subscript(_ key: String) -> Any? {
        get {
            return utsSubscriptGetValue(key)
        }
        set {
            switch(key){
                case "code":
                    self.code = try! utsSubscriptCheckValue(newValue)
                case "registrationId":
                    self.registrationId = try! utsSubscriptCheckValue(newValue)
                default:
                    break
            }
        }
    }
    public override init() {
        super.init()
    }
    public init(_ obj: UTSJSONObject) {
        self.code = obj["code"] as! NSNumber
        self.registrationId = obj["registrationId"] as! String
    }
}
public var TAG = "| JIGUANG | JPUSH-uni-"
public var ENABLE_JPUSH_IOS_APNS_HOOK = true
public func log(_ message: String, _ spreadArgs: Any...) -> Void {
    var args = Array(spreadArgs)
    var fullMessage = message
    if (args != nil && args.length > 0) {
        for arg in resolveUTSValueIterator(args){
            fullMessage += " " + JSON.stringify(arg)!
        }
    }
    console.log(TAG, fullMessage)
    NSLog("%@ %@ ", TAG, fullMessage)
}
@objc(UTSSDKModulesJgJpushUEventCallbackManager)
@objcMembers
public class EventCallbackManager : NSObject {
    private var callBack: EventCallBackParams? = nil
    private var cachedEvents: Array<EventCallBack> = []
    public func setEventCallBack(_ param: EventCallBackParams) -> Void {
        log("setEventCallBack")
        self.callBack = param
        if (self.cachedEvents.length > 0) {
            log("处理缓存事件，数量:", self.cachedEvents.length)
            for event in resolveUTSValueIterator(self.cachedEvents){
                self.triggerCallBack(event)
            }
            self.cachedEvents = []
        }
    }
    public func triggerCallBack(_ event: EventCallBack) -> Void {
        if (self.callBack != nil) {
            log("触发回调")
            if (self.callBack!.callback != nil) {
                self.callBack!.callback!(event)
            } else {
                log("未设置回调函数，事件内容：", event)
            }
        } else {
            log("回调未设置，缓存事件")
            self.cachedEvents.push(event)
        }
    }
    public func triggerEvent(_ eventName: String, _ eventData: String) -> Void {
        var callback = EventCallBack(UTSJSONObject([
            "eventName": eventName,
            "eventData": eventData
        ]))
        self.triggerCallBack(callback)
    }
    public func getCallBack() -> EventCallBackParams? {
        return self.callBack
    }
    public func hasCallBack() -> Bool {
        return self.callBack != nil && self.callBack!.callback != nil
    }
}
public var eventCallbackManager = EventCallbackManager()
@objc(UTSSDKModulesJgJpushUInitPushParams)
@objcMembers
public class InitPushParams : NSObject, UTSObject {
    public var appkey: String!
    public var channel: String!
    public var isProduction: Bool = false
    public var advertisingId: String!
    public subscript(_ key: String) -> Any? {
        get {
            return utsSubscriptGetValue(key)
        }
        set {
            switch(key){
                case "appkey":
                    self.appkey = try! utsSubscriptCheckValue(newValue)
                case "channel":
                    self.channel = try! utsSubscriptCheckValue(newValue)
                case "isProduction":
                    self.isProduction = try! utsSubscriptCheckValue(newValue)
                case "advertisingId":
                    self.advertisingId = try! utsSubscriptCheckValue(newValue)
                default:
                    break
            }
        }
    }
    public override init() {
        super.init()
    }
    public init(_ obj: UTSJSONObject) {
        self.appkey = obj["appkey"] as! String
        self.channel = obj["channel"] as! String
        self.isProduction = obj["isProduction"] as! Bool
        self.advertisingId = obj["advertisingId"] as! String
    }
}
@objc(UTSSDKModulesJgJpushUJGPushIOSPlugin)
@objcMembers
public class JGPushIOSPlugin : NSObject, UTSiOSHookProxy {
    public func onCreate() -> Void {
        log("JGPushIOSPlugin onCreate")
    }
    public func applicationDidFinishLaunchingWithOptions(_ application: UIApplication?, _ launchOptions: Map<UIApplication.LaunchOptionsKey, Any>? = nil) -> Bool {
        if (!ENABLE_JPUSH_IOS_APNS_HOOK) {
            log("JGPush iOS APNs hook disabled; UniPush owns notification handling")
            return true
        }
        log("JGPushIOSPlugin captured launch options")
        JGPushTool.launchOptions = launchOptions
        return true
    }
    public func didRegisterForRemoteNotifications(_ deviceToken: Data?) {
        if (!ENABLE_JPUSH_IOS_APNS_HOOK) {
            log("JGPush iOS APNs token hook disabled; UniPush owns notification handling")
            return
        }
        log("JGPushIOSPlugin received APNs device token")
        JGPushTool.registerDeviceToken(deviceToken)
    }
    public func didFailToRegisterForRemoteNotifications(_ error: Error?) {
        log("JGPushIOSPlugin APNs registration failed")
    }
    public func didReceiveRemoteNotification(_ userInfo: Map<AnyHashable, Any>?) {
        log("JGPushIOSPlugin received remote notification")
    }
}
@objc(UTSSDKModulesJgJpushUJGPushModule)
@objcMembers
public class JGPushModule : NSObject, JPUSHRegisterDelegate {
    public var launchOptions: Map<UIApplication.LaunchOptionsKey, Any>? = nil
    private var initialized: Bool = false
    public func initPush(_ param: InitPushParams) {
        if (self.initialized) {
            log("JGPushModule initialization already completed")
            return
        }
        self.initialized = true
        log("JGPushModule setup started")
        var method = Selector("didReceiveCustomMessage:")
        NotificationCenter.default.addObserver(self, selector: method, name: NSNotification.Name.jpfNetworkDidReceiveMessage, object: nil)
        var method1 = Selector("networkDidLogin:")
        NotificationCenter.default.addObserver(self, selector: method1, name: NSNotification.Name.jpfNetworkDidLogin, object: nil)
        var method2 = Selector("networkDidClose:")
        NotificationCenter.default.addObserver(self, selector: method2, name: NSNotification.Name.jpfNetworkDidClose, object: nil)
        JPUSHService.setup(withOption: self.launchOptions, appKey: param.appkey, channel: param.channel, apsForProduction: param.isProduction, advertisingIdentifier: param.advertisingId)
        log("JGPushModule setup completed")
        var entity = JPUSHRegisterEntity()
        var types = JPAuthorizationOptions(rawValue: (JPAuthorizationOptions.alert.rawValue | JPAuthorizationOptions.sound.rawValue | JPAuthorizationOptions.badge.rawValue))
        entity.types = Int(types.rawValue)
        log("JGPushModule notification registration started")
        JPUSHService.register(forRemoteNotificationConfig: entity, delegate: self)
        log("JGPushModule initialization completed")
    }
    public func registerDeviceToken(_ token: Data?) {
        log("JGPushModule registerDeviceToken")
        if (token == nil) {
            log("JGPushModule APNs device token is empty")
            return
        }
        JPUSHService.registerDeviceToken(token)
    }
    @objc
    public func didReceiveCustomMessage(_ notification: Notification) {
        log("JGPushModule received custom message")
        var userInfo = notification.userInfo
        if (userInfo != nil) {
            var jsonString = JSON.stringify(userInfo! as! Dictionary<String, Any>)
            if (jsonString != nil) {
                eventCallbackManager.triggerEvent("onCustomMessage", jsonString!)
            }
        }
    }
    @objc
    public func networkDidLogin(_ notification: Notification) {
        log("JGPushModule network connected")
        eventCallbackManager.triggerEvent("onConnected", "true")
    }
    @objc
    public func networkDidClose(_ notification: Notification) {
        log("JGPushModule network disconnected")
        eventCallbackManager.triggerEvent("onConnected", "false")
    }
    public func jpushNotificationCenter(_ center: UNUserNotificationCenter, willPresent notification: UNNotification, withCompletionHandler completionHandler: @escaping (_ code: Int) -> Void) -> Void {
        log("JGPushModule jpushNotificationCenter willPresent")
        var userInfo = notification.request.content.userInfo
        if (notification.request.trigger?.isKind(of: UNPushNotificationTrigger.self) != nil) {
            JPUSHService.handleRemoteNotification(userInfo)
        }
        var u = userInfo as! Dictionary<String, Any>
        var jsonString = JSON.stringify(u)
        eventCallbackManager.triggerEvent("onNotifyMessageArrived", jsonString!)
        completionHandler(Int(UNNotificationPresentationOptions.alert.rawValue) | Int(UNNotificationPresentationOptions.sound.rawValue) | Int(UNNotificationPresentationOptions.badge.rawValue))
    }
    public func jpushNotificationCenter(_ center: UNUserNotificationCenter, didReceive response: UNNotificationResponse, withCompletionHandler completionHandler: @escaping () -> Void) -> Void {
        log("JGPushModule jpushNotificationCenter didReceive")
        var userInfo = response.notification.request.content.userInfo
        if (response.notification.request.trigger?.isKind(of: UNPushNotificationTrigger.self) != nil) {
            JPUSHService.handleRemoteNotification(userInfo)
        }
        var u = userInfo as! Dictionary<String, Any>
        var jsonString = JSON.stringify(u)
        eventCallbackManager.triggerEvent("onClickMessage", jsonString!)
        completionHandler()
    }
    public func jpushNotificationCenter(_ center: UNUserNotificationCenter, openSettingsFor notification: UNNotification) -> Void {
        log("JGPushModule jpushNotificationCenter openSettingsFor")
        if (notification != nil && notification.request.trigger?.isKind(of: UNPushNotificationTrigger.self) != nil) {
            log("从通知界面直接进入应用")
        } else {
            log("从通知设置界面进入应用")
        }
    }
    public func jpushNotificationAuthorization(_ status: JPAuthorizationStatus, withInfo info: Map<AnyHashable, Any>?) -> Void {
        log("JGPushModule jpushNotificationAuthorization", status)
    }
}
public var JGPushTool: JGPushModule = JGPushModule()
public func setEventCallBack(_ param: EventCallBackParams) -> Void {
    log("setEventCallBack", param)
    eventCallbackManager.setEventCallBack(param)
}
public func initPush(_ param: InitPushParams) -> Void {
    log("initPush")
    JGPushTool.initPush(param)
}
public func setDebug(_ debug: Bool) -> Void {
    log("setDebug", debug)
    if (debug) {
        JPUSHService.setDebugMode()
    } else {
        JPUSHService.setLogOFF()
    }
}
public func setBackgroundEnable(_ isEnable: Bool) -> Void {
    log("setBackgroundEnable:", isEnable)
    if (isEnable) {
        JPUSHService.setBackgroundEnable(true)
    } else {
        JPUSHService.setBackgroundEnable(false)
    }
}
public func getPushStatus(_ callback: @escaping (_ code: NSNumber, _ isStopped: Bool) -> Void) -> Void {
    log("getPushStatus")
    var completion = {
    (_ iResCode: Int, _ isStopped: Bool) -> Void in
    callback(iResCode as! NSNumber, isStopped as! Bool)
    }
    JPUSHService.getPushStatus(completion)
}
public func getRegistrationIdAsync(_ callback: @escaping (_ result: RegistrationIdResult) -> Void) -> Void {
    log("getRegistrationIdAsync")
    JPUSHService.registrationIDCompletionHandler({
    (resCode: Int, registrationId: String?) -> Void in
    var result = RegistrationIdResult(UTSJSONObject([
        "code": NSNumber(resCode),
        "registrationId": registrationId == nil ? "" : registrationId!
    ]))
    log(registrationId == nil || registrationId == "" ? "JPush RegistrationID callback returned empty ID" : "JPush RegistrationID callback completed")
    if (resCode != 0) {
        log("JPush RegistrationID callback error code", NSNumber(resCode))
    }
    callback(result)
    })
}
public func getRegistrationId() -> String {
    log("getRegistrationId")
    return JPUSHService.registrationID()
}
public func setTags(_ sequence: Int, _ tags: [String]) -> Void {
    log("setTags", sequence, tags)
    var callback = {
    (_ iResCode: Int, _ iTags: Swift.Set<AnyHashable>?, _ seq: Int) -> Void in
    var result: UTSJSONObject = UTSJSONObject([
        "code": iResCode,
        "tags": iTags,
        "sequence": seq
    ])
    log("setTags completion", result)
    eventCallbackManager.triggerEvent("onTagOperatorResult", JSON.stringify(result)!)
    }
    var setTags: Swift.Set<String> = Swift.Set<String>(tags)
    JPUSHService.setTags(setTags, completion: callback, seq: sequence)
}
public func addTags(_ sequence: Int, _ tags: [String]) -> Void {
    log("addTags", sequence, tags)
    var callback = {
    (_ iResCode: Int, _ iTags: Swift.Set<AnyHashable>?, _ seq: Int) -> Void in
    var result: UTSJSONObject = UTSJSONObject([
        "code": iResCode,
        "tags": iTags,
        "sequence": seq
    ])
    log("addTags completion", result)
    eventCallbackManager.triggerEvent("onTagOperatorResult", JSON.stringify(result)!)
    }
    var setTags: Swift.Set<String> = Swift.Set<String>(tags)
    JPUSHService.addTags(setTags, completion: callback, seq: sequence)
}
public func deleteTags(_ sequence: Int, _ tags: [String]) -> Void {
    log("deleteTags", sequence, tags)
    var callback = {
    (_ iResCode: Int, _ iTags: Swift.Set<AnyHashable>?, _ seq: Int) -> Void in
    var result: UTSJSONObject = UTSJSONObject([
        "code": iResCode,
        "tags": iTags,
        "sequence": seq
    ])
    log("deleteTags completion", result)
    eventCallbackManager.triggerEvent("onTagOperatorResult", JSON.stringify(result)!)
    }
    var setTags: Swift.Set<String> = Swift.Set<String>(tags)
    JPUSHService.deleteTags(setTags, completion: callback, seq: sequence)
}
public func cleanTags(_ sequence: Int) -> Void {
    log("cleanTags", sequence)
    var callback = {
    (_ iResCode: Int, _ iTags: Swift.Set<AnyHashable>?, _ seq: Int) -> Void in
    var result: UTSJSONObject = UTSJSONObject([
        "code": iResCode,
        "tags": iTags,
        "sequence": seq
    ])
    log("cleanTags completion", result)
    eventCallbackManager.triggerEvent("onTagOperatorResult", JSON.stringify(result)!)
    }
    JPUSHService.cleanTags(callback, seq: sequence)
}
public func getAllTags(_ sequence: Int) -> Void {
    log("getAllTags", sequence)
    var callback = {
    (_ iResCode: Int, _ iTags: Swift.Set<AnyHashable>?, _ seq: Int) -> Void in
    var result: UTSJSONObject = UTSJSONObject([
        "code": iResCode,
        "tags": iTags,
        "sequence": seq
    ])
    log("getAllTags completion", result)
    eventCallbackManager.triggerEvent("onTagOperatorResult", JSON.stringify(result)!)
    }
    JPUSHService.getAllTags(callback, seq: sequence)
}
public func checkTagBindState(_ sequence: Int, _ tag: String) -> Void {
    log("checkTagBindState", sequence, tag)
    var callback = {
    (_ iResCode: Int, _ iTags: Swift.Set<AnyHashable>?, _ seq: Int, _ isBind: Bool) -> Void in
    var result: UTSJSONObject = UTSJSONObject([
        "code": iResCode,
        "tags": iTags,
        "sequence": seq,
        "isBind": isBind
    ])
    log("validTag completion", result)
    eventCallbackManager.triggerEvent("onTagOperatorResult", JSON.stringify(result)!)
    }
    JPUSHService.validTag(tag, completion: callback, seq: sequence)
}
public func setAlias(_ sequence: Int, _ alias: String) -> Void {
    log("setAlias", sequence, alias)
    var callback: (_ iResCode: Int, _ iAlias: String?, _ seq: Int) -> Void = {
    (_ iResCode: Int, _ iAlias: String?, _ seq: Int) -> Void in
    var result: UTSJSONObject = UTSJSONObject([
        "code": iResCode,
        "alias": iAlias,
        "sequence": seq
    ])
    log("setAlias completion", result)
    eventCallbackManager.triggerEvent("onAliasOperatorResult", JSON.stringify(result)!)
    }
    JPUSHService.setAlias(alias, completion: callback, seq: sequence)
}
public func deleteAlias(_ sequence: Int) -> Void {
    log("deleteAlias", sequence)
    var callback: (_ iResCode: Int, _ iAlias: String?, _ seq: Int) -> Void = {
    (_ iResCode: Int, _ iAlias: String?, _ seq: Int) -> Void in
    var result: UTSJSONObject = UTSJSONObject([
        "code": iResCode,
        "alias": iAlias,
        "sequence": seq
    ])
    log("deleteAlias completion", result)
    eventCallbackManager.triggerEvent("onAliasOperatorResult", JSON.stringify(result)!)
    }
    JPUSHService.deleteAlias(callback, seq: sequence)
}
public func getAlias(_ sequence: Int) -> Void {
    log("getAlias", sequence)
    var callback: (_ iResCode: Int, _ iAlias: String?, _ seq: Int) -> Void = {
    (_ iResCode: Int, _ iAlias: String?, _ seq: Int) -> Void in
    var result: UTSJSONObject = UTSJSONObject([
        "code": iResCode,
        "alias": iAlias,
        "sequence": seq
    ])
    log("getAlias completion", result)
    eventCallbackManager.triggerEvent("onAliasOperatorResult", JSON.stringify(result)!)
    }
    JPUSHService.getAlias(callback, seq: sequence)
}
public func setMobileNumber(_ sequence: NSNumber, _ mobileNumber: String) -> Void {
    log("setMobileNumber", mobileNumber)
    var callback: (_ error: Error?) -> Void = {
    (_ error: Error?) -> Void in
    if (error != nil) {
        log("setMobileNumber error", error)
    } else {
        log("setMobileNumber success")
    }
    var result: UTSJSONObject = UTSJSONObject([
        "code": error == nil ? 0 : (error as! NSError).code,
        "message": error == nil ? "success" : error,
        "mobileNumber": mobileNumber,
        "sequence": sequence
    ])
    log("setMobileNumber completion", result)
    eventCallbackManager.triggerEvent("onMobileNumberOperatorResult", JSON.stringify(result)!)
    }
    JPUSHService.setMobileNumber(mobileNumber, completion: callback)
}
public func setBadgeNumber(_ curNum: Int) -> Void {
    log("setBadgeNumber", curNum)
    JPUSHService.setBadge(curNum)
    if #available(iOS 16.0, *) {
        UNUserNotificationCenter.current().setBadgeCount(Int(curNum), withCompletionHandler: {
        (error: Error?) -> Void in
        if (error != nil) {
            log("setBadgeCount error:", error)
        }
        })
    } else {
        UIApplication.shared.applicationIconBadgeNumber = Int(curNum)
    }
}
public func resetBadge() -> Void {
    log("resetBadge")
    JPUSHService.resetBadge()
    UIApplication.shared.applicationIconBadgeNumber = 0
    if #available(iOS 16.0, *) {
        UNUserNotificationCenter.current().setBadgeCount(0, withCompletionHandler: {
        (error: Error?) -> Void in
        if (error != nil) {
            log("resetBadge setBadgeCount error:", error)
        }
        })
    }
}
public func getBadgeNumber() -> NSNumber {
    var badgeNumber = UIApplication.shared.applicationIconBadgeNumber
    log("getBadgeNumber", badgeNumber)
    return NSNumber(badgeNumber)
}
@objc(UTSSDKModulesJgJpushUEventCallBackParamsJSONObject)
@objcMembers
public class EventCallBackParamsJSONObject : NSObject {
    public var callback: UTSCallback?
}
@objc(UTSSDKModulesJgJpushUInitPushParamsJSONObject)
@objcMembers
public class InitPushParamsJSONObject : NSObject {
    public var appkey: String!
    public var channel: String!
    public var isProduction: Bool = false
    public var advertisingId: String!
}
@objc(UTSSDKModulesJgJpushUJGPushIOSPluginByJs)
@objcMembers
public class JGPushIOSPluginByJs : JGPushIOSPlugin {
    public func onCreateByJs() -> Void {
        return self.onCreate()
    }
    public func applicationDidFinishLaunchingWithOptionsByJs(_ application: UIApplication?, _ launchOptions: Map<UIApplication.LaunchOptionsKey, Any>? = nil) -> Bool {
        return self.applicationDidFinishLaunchingWithOptions(application, launchOptions)
    }
    public func didRegisterForRemoteNotificationsByJs(_ deviceToken: Data?) {
        return self.didRegisterForRemoteNotifications(deviceToken)
    }
    public func didFailToRegisterForRemoteNotificationsByJs(_ error: Error?) {
        return self.didFailToRegisterForRemoteNotifications(error)
    }
    public func didReceiveRemoteNotificationByJs(_ userInfo: Map<AnyHashable, Any>?) {
        return self.didReceiveRemoteNotification(userInfo)
    }
}
public func setEventCallBackByJs(_ param: EventCallBackParamsJSONObject) -> Void {
    return setEventCallBack(EventCallBackParams(UTSJSONObject([
        "callback": {
        (res: EventCallBack) -> Void in
        param.callback?(res)
        }
    ])))
}
public func initPushByJs(_ param: InitPushParamsJSONObject) -> Void {
    return initPush(InitPushParams(UTSJSONObject([
        "appkey": param.appkey,
        "channel": param.channel,
        "isProduction": param.isProduction,
        "advertisingId": param.advertisingId
    ])))
}
public func setDebugByJs(_ debug: Bool) -> Void {
    return setDebug(debug)
}
public func setBackgroundEnableByJs(_ isEnable: Bool) -> Void {
    return setBackgroundEnable(isEnable)
}
public func getPushStatusByJs(_ callback: UTSCallback) -> Void {
    return getPushStatus({
    (code: NSNumber, isStopped: Bool) -> Void in
    callback(code, isStopped)
    })
}
public func getRegistrationIdAsyncByJs(_ callback: UTSCallback) -> Void {
    return getRegistrationIdAsync({
    (result: RegistrationIdResult) -> Void in
    callback(result)
    })
}
public func getRegistrationIdByJs() -> String {
    return getRegistrationId()
}
public func setTagsByJs(_ sequence: Int, _ tags: [String]) -> Void {
    return setTags(sequence, tags)
}
public func addTagsByJs(_ sequence: Int, _ tags: [String]) -> Void {
    return addTags(sequence, tags)
}
public func deleteTagsByJs(_ sequence: Int, _ tags: [String]) -> Void {
    return deleteTags(sequence, tags)
}
public func cleanTagsByJs(_ sequence: Int) -> Void {
    return cleanTags(sequence)
}
public func getAllTagsByJs(_ sequence: Int) -> Void {
    return getAllTags(sequence)
}
public func checkTagBindStateByJs(_ sequence: Int, _ tag: String) -> Void {
    return checkTagBindState(sequence, tag)
}
public func setAliasByJs(_ sequence: Int, _ alias: String) -> Void {
    return setAlias(sequence, alias)
}
public func deleteAliasByJs(_ sequence: Int) -> Void {
    return deleteAlias(sequence)
}
public func getAliasByJs(_ sequence: Int) -> Void {
    return getAlias(sequence)
}
public func setMobileNumberByJs(_ sequence: NSNumber, _ mobileNumber: String) -> Void {
    return setMobileNumber(sequence, mobileNumber)
}
public func setBadgeNumberByJs(_ curNum: Int) -> Void {
    return setBadgeNumber(curNum)
}
public func resetBadgeByJs() -> Void {
    return resetBadge()
}
public func getBadgeNumberByJs() -> NSNumber {
    return getBadgeNumber()
}
@objc(UTSSDKModulesJgJpushUIndexSwift)
@objcMembers
public class UTSSDKModulesJgJpushUIndexSwift : NSObject {
    public static func s_setEventCallBackByJs(_ param: EventCallBackParamsJSONObject) -> Void {
        return setEventCallBackByJs(param)
    }
    public static func s_initPushByJs(_ param: InitPushParamsJSONObject) -> Void {
        return initPushByJs(param)
    }
    public static func s_setDebugByJs(_ debug: Bool) -> Void {
        return setDebugByJs(debug)
    }
    public static func s_setBackgroundEnableByJs(_ isEnable: Bool) -> Void {
        return setBackgroundEnableByJs(isEnable)
    }
    public static func s_getPushStatusByJs(_ callback: UTSCallback) -> Void {
        return getPushStatusByJs(callback)
    }
    public static func s_getRegistrationIdAsyncByJs(_ callback: UTSCallback) -> Void {
        return getRegistrationIdAsyncByJs(callback)
    }
    public static func s_getRegistrationIdByJs() -> String {
        return getRegistrationIdByJs()
    }
    public static func s_setTagsByJs(_ sequence: Int, _ tags: [String]) -> Void {
        return setTagsByJs(sequence, tags)
    }
    public static func s_addTagsByJs(_ sequence: Int, _ tags: [String]) -> Void {
        return addTagsByJs(sequence, tags)
    }
    public static func s_deleteTagsByJs(_ sequence: Int, _ tags: [String]) -> Void {
        return deleteTagsByJs(sequence, tags)
    }
    public static func s_cleanTagsByJs(_ sequence: Int) -> Void {
        return cleanTagsByJs(sequence)
    }
    public static func s_getAllTagsByJs(_ sequence: Int) -> Void {
        return getAllTagsByJs(sequence)
    }
    public static func s_checkTagBindStateByJs(_ sequence: Int, _ tag: String) -> Void {
        return checkTagBindStateByJs(sequence, tag)
    }
    public static func s_setAliasByJs(_ sequence: Int, _ alias: String) -> Void {
        return setAliasByJs(sequence, alias)
    }
    public static func s_deleteAliasByJs(_ sequence: Int) -> Void {
        return deleteAliasByJs(sequence)
    }
    public static func s_getAliasByJs(_ sequence: Int) -> Void {
        return getAliasByJs(sequence)
    }
    public static func s_setMobileNumberByJs(_ sequence: NSNumber, _ mobileNumber: String) -> Void {
        return setMobileNumberByJs(sequence, mobileNumber)
    }
    public static func s_setBadgeNumberByJs(_ curNum: Int) -> Void {
        return setBadgeNumberByJs(curNum)
    }
    public static func s_resetBadgeByJs() -> Void {
        return resetBadgeByJs()
    }
    public static func s_getBadgeNumberByJs() -> NSNumber {
        return getBadgeNumberByJs()
    }
}
