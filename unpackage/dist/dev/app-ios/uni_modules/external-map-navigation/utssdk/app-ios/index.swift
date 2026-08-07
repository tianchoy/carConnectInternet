import DCloudUTSFoundation
import DCloudUniappRuntime
import Foundation
import UIKit
@objc(UTSSDKModulesExternalMapNavigationExternalMapNavigationParams)
@objcMembers
public class ExternalMapNavigationParams : NSObject, UTSObject, IUTSSourceMap {
    public func __$getOriginalPosition() -> UTSSourceMapPosition? {
        return UTSSourceMapPosition("ExternalMapNavigationParams", "uni_modules/external-map-navigation/utssdk/interface.uts", 1, 13)
    }
    public var latitude: NSNumber!
    public var longitude: NSNumber!
    public var name: String!
    public var providerId: String?
    public var wgs84Latitude: NSNumber?
    public var wgs84Longitude: NSNumber?
    public subscript(_ key: String) -> Any? {
        get {
            return utsSubscriptGetValue(key)
        }
        set {
            switch(key){
                case "latitude":
                    self.latitude = try! utsSubscriptCheckValue(newValue)
                case "longitude":
                    self.longitude = try! utsSubscriptCheckValue(newValue)
                case "name":
                    self.name = try! utsSubscriptCheckValue(newValue)
                case "providerId":
                    self.providerId = try! utsSubscriptCheckValueIfPresent(newValue)
                case "wgs84Latitude":
                    self.wgs84Latitude = try! utsSubscriptCheckValueIfPresent(newValue)
                case "wgs84Longitude":
                    self.wgs84Longitude = try! utsSubscriptCheckValueIfPresent(newValue)
                default:
                    break
            }
        }
    }
    public override init() {
        super.init()
    }
    public init(_ obj: UTSJSONObject) {
        self.latitude = obj["latitude"] as! NSNumber
        self.longitude = obj["longitude"] as! NSNumber
        self.name = obj["name"] as! String
        self.providerId = obj["providerId"] as! String?
        self.wgs84Latitude = obj["wgs84Latitude"] as! NSNumber?
        self.wgs84Longitude = obj["wgs84Longitude"] as! NSNumber?
    }
}
@objc(UTSSDKModulesExternalMapNavigationExternalMapNavigationResult)
@objcMembers
public class ExternalMapNavigationResult : NSObject, UTSObject, IUTSSourceMap {
    public func __$getOriginalPosition() -> UTSSourceMapPosition? {
        return UTSSourceMapPosition("ExternalMapNavigationResult", "uni_modules/external-map-navigation/utssdk/interface.uts", 9, 13)
    }
    public var code: String!
    public subscript(_ key: String) -> Any? {
        get {
            return utsSubscriptGetValue(key)
        }
        set {
            switch(key){
                case "code":
                    self.code = try! utsSubscriptCheckValue(newValue)
                default:
                    break
            }
        }
    }
    public override init() {
        super.init()
    }
    public init(_ obj: UTSJSONObject) {
        self.code = obj["code"] as! String
    }
}
@objc(UTSSDKModulesExternalMapNavigationIOSMapProvider)
@objcMembers
public class IOSMapProvider : NSObject, UTSObject, IUTSSourceMap {
    public func __$getOriginalPosition() -> UTSSourceMapPosition? {
        return UTSSourceMapPosition("IOSMapProvider", "uni_modules/external-map-navigation/utssdk/interface.uts", 12, 13)
    }
    public var id: String!
    public var name: String!
    public subscript(_ key: String) -> Any? {
        get {
            return utsSubscriptGetValue(key)
        }
        set {
            switch(key){
                case "id":
                    self.id = try! utsSubscriptCheckValue(newValue)
                case "name":
                    self.name = try! utsSubscriptCheckValue(newValue)
                default:
                    break
            }
        }
    }
    public override init() {
        super.init()
    }
    public init(_ obj: UTSJSONObject) {
        self.id = obj["id"] as! String
        self.name = obj["name"] as! String
    }
}
public var TENCENT_MAP_PROVIDER_ID = "qqmap"
public var AMAP_PROVIDER_ID = "iosamap"
public var BAIDU_MAP_PROVIDER_ID = "baidumap"
public func result(_ code: String) -> ExternalMapNavigationResult {
    return ExternalMapNavigationResult(UTSJSONObject([
        "code": code
    ]))
}
public func isValidCoordinate(_ latitude: NSNumber, _ longitude: NSNumber) -> Bool {
    return !isNaN(latitude) && !isNaN(longitude) && latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180 && !(latitude == 0 && longitude == 0)
}
public func createURL(_ value: String) -> URL? {
    do {
        return URL(string: value)
    }
     catch let error {
        var error = UTSError(error)
        console.error("创建地图链接失败:", error, " at uni_modules/external-map-navigation/utssdk/app-ios/index.uts:24")
        return nil
    }
}
public func canOpen(_ value: String) -> Bool {
    var url = createURL(value)
    return url != nil && UIApplication.shared.canOpenURL(url!)
}
public func openURL(_ value: String) -> Bool {
    var url = createURL(value)
    if (url == nil || !UIApplication.shared.canOpenURL(url!)) {
        return false
    }
    do {
        DispatchQueue.main.async(execute: {
        () -> Void in
        UIApplication.shared.open(url!, options: Map(), completionHandler: nil)
        })
        return true
    }
     catch let error {
        var error = UTSError(error)
        console.error("打开 iOS 地图失败:", error, " at uni_modules/external-map-navigation/utssdk/app-ios/index.uts:52")
        return false
    }
}
public func encodedValue(_ value: String) -> String {
    var encoded = UTSiOS.consoleDebugError(encodeURIComponent(value), " at uni_modules/external-map-navigation/utssdk/app-ios/index.uts:46")
    return encoded != nil ? encoded as! String : ""
}
public func destinationName(_ params: ExternalMapNavigationParams) -> String {
    return params.name != "" ? params.name : "车辆位置"
}
public func provider(_ id: String, _ name: String, _ scheme: String) -> IOSMapProvider? {
    return canOpen(scheme) ? IOSMapProvider(UTSJSONObject([
        "id": id,
        "name": name
    ])) : nil
}
public func getAvailableIOSMapProviders() -> [IOSMapProvider] {
    var providers: [IOSMapProvider] = []
    var tencent = provider(TENCENT_MAP_PROVIDER_ID, "腾讯地图", "qqmap://")
    var amap = provider(AMAP_PROVIDER_ID, "高德地图", "iosamap://")
    var baidu = provider(BAIDU_MAP_PROVIDER_ID, "百度地图", "baidumap://")
    if (tencent != nil) {
        providers.push(tencent as! IOSMapProvider)
    }
    if (amap != nil) {
        providers.push(amap as! IOSMapProvider)
    }
    if (baidu != nil) {
        providers.push(baidu as! IOSMapProvider)
    }
    return providers
}
public func buildTencentURL(_ params: ExternalMapNavigationParams) -> String {
    var name = encodedValue(destinationName(params))
    var origin = encodedValue("我的位置")
    var latitude = params.latitude.toString() ?? ""
    var longitude = params.longitude.toString() ?? ""
    var url = "qqmap://map/routeplan?type=drive&from=" + origin + "&fromcoord=CurrentLocation&to=" + name
    url += "&tocoord=" + latitude + "," + longitude
    url += "&referer=FUTBZ-I7V3W-Y7TR2-YK62F-IFTZK-73FKD"
    return url
}
public func buildAmapURL(_ params: ExternalMapNavigationParams) -> String {
    var name = encodedValue(destinationName(params))
    var sourceApplication = encodedValue("车载GPS")
    var latitude = params.latitude.toString() ?? ""
    var longitude = params.longitude.toString() ?? ""
    var url = "iosamap://navi?sourceApplication=" + sourceApplication + "&poiname=" + name
    url += "&lat=" + latitude + "&lon=" + longitude
    url += "&dev=0&style=0"
    return url
}
public func buildBaiduURL(_ params: ExternalMapNavigationParams) -> String {
    var name = encodedValue(destinationName(params))
    var latitude = params.latitude.toString() ?? ""
    var longitude = params.longitude.toString() ?? ""
    var url = "baidumap://map/direction?origin=我的位置&destination=name:" + name
    url += "|latlng:" + latitude + "," + longitude
    url += "&mode=driving&coord_type=gcj02&src=ios.carConnectInternet.carConnectInternet"
    return url
}
public func buildAppleURL(_ params: ExternalMapNavigationParams) -> String {
    var latitude = (params.wgs84Latitude ?? params.latitude).toString() ?? ""
    var longitude = (params.wgs84Longitude ?? params.longitude).toString() ?? ""
    return "https://maps.apple.com/?daddr=" + latitude + "," + longitude + "&dirflg=d"
}
public func openSelectedProvider(_ params: ExternalMapNavigationParams, _ providerId: String) -> ExternalMapNavigationResult {
    if (providerId == TENCENT_MAP_PROVIDER_ID) {
        return openURL(buildTencentURL(params)) ? result("opened") : result("launch_failed")
    }
    if (providerId == AMAP_PROVIDER_ID) {
        return openURL(buildAmapURL(params)) ? result("opened") : result("launch_failed")
    }
    if (providerId == BAIDU_MAP_PROVIDER_ID) {
        return openURL(buildBaiduURL(params)) ? result("opened") : result("launch_failed")
    }
    return result("invalid_provider")
}
public func openExternalMap(_ params: ExternalMapNavigationParams) -> ExternalMapNavigationResult {
    if (!isValidCoordinate(params.latitude, params.longitude)) {
        return result("invalid_coordinate")
    }
    if (params.providerId != nil && params.providerId != "") {
        return openSelectedProvider(params, params.providerId as! String)
    }
    var providers = getAvailableIOSMapProviders()
    if (providers.length == 1) {
        return openSelectedProvider(params, providers[0].id)
    }
    if (providers.length > 1) {
        return result("selection_required")
    }
    return openURL(buildAppleURL(params)) ? result("opened") : result("launch_failed")
}
@objc(UTSSDKModulesExternalMapNavigationExternalMapNavigationParamsJSONObject)
@objcMembers
public class ExternalMapNavigationParamsJSONObject : NSObject {
    public var latitude: NSNumber!
    public var longitude: NSNumber!
    public var name: String!
    public var providerId: String?
    public var wgs84Latitude: NSNumber?
    public var wgs84Longitude: NSNumber?
}
public func getAvailableIOSMapProvidersByJs() -> [IOSMapProvider] {
    return getAvailableIOSMapProviders()
}
public func openExternalMapByJs(_ params: ExternalMapNavigationParamsJSONObject) -> ExternalMapNavigationResult {
    return openExternalMap(ExternalMapNavigationParams(UTSJSONObject([
        "latitude": params.latitude,
        "longitude": params.longitude,
        "name": params.name,
        "providerId": params.providerId,
        "wgs84Latitude": params.wgs84Latitude,
        "wgs84Longitude": params.wgs84Longitude
    ])))
}
@objc(UTSSDKModulesExternalMapNavigationIndexSwift)
@objcMembers
public class UTSSDKModulesExternalMapNavigationIndexSwift : NSObject {
    public static func s_getAvailableIOSMapProvidersByJs() -> [IOSMapProvider] {
        return getAvailableIOSMapProvidersByJs()
    }
    public static func s_openExternalMapByJs(_ params: ExternalMapNavigationParamsJSONObject) -> ExternalMapNavigationResult {
        return openExternalMapByJs(params)
    }
}
