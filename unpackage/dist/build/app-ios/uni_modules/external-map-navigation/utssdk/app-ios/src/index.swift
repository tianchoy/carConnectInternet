import DCloudUTSFoundation
import DCloudUniappRuntime
import Foundation
import UIKit
@objc(UTSSDKModulesExternalMapNavigationExternalMapNavigationParams)
@objcMembers
public class ExternalMapNavigationParams : NSObject, UTSObject {
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
public class ExternalMapNavigationResult : NSObject, UTSObject {
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
        console.error("创建地图链接失败:", error)
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
        console.error("打开 iOS 地图失败:", error)
        return false
    }
}
public func encodedValue(_ value: String) -> String {
    var encoded = encodeURIComponent(value)
    return encoded != nil ? encoded as! String : ""
}
public func destinationName(_ params: ExternalMapNavigationParams) -> String {
    return params.name != "" ? params.name : "车辆位置"
}
public func canOpenProvider(_ providerId: String) -> Bool {
    if (providerId == TENCENT_MAP_PROVIDER_ID) {
        return canOpen("qqmap://")
    }
    if (providerId == AMAP_PROVIDER_ID) {
        return canOpen("iosamap://")
    }
    if (providerId == BAIDU_MAP_PROVIDER_ID) {
        return canOpen("baidumap://")
    }
    return false
}
public func getAvailableIOSMapProviderIds() -> [String] {
    var providerIds: [String] = []
    if (canOpenProvider(TENCENT_MAP_PROVIDER_ID)) {
        providerIds.push(TENCENT_MAP_PROVIDER_ID)
    }
    if (canOpenProvider(AMAP_PROVIDER_ID)) {
        providerIds.push(AMAP_PROVIDER_ID)
    }
    if (canOpenProvider(BAIDU_MAP_PROVIDER_ID)) {
        providerIds.push(BAIDU_MAP_PROVIDER_ID)
    }
    return providerIds
}
public func buildTencentURL(_ params: ExternalMapNavigationParams) -> String {
    var name = encodedValue(destinationName(params))
    var origin = encodedValue("我的位置")
    var latitude = params.latitude.toString() ?? ""
    var longitude = params.longitude.toString() ?? ""
    var url = "qqmap://map/routeplan?type=drive&from=" + origin + "&fromcoord=CurrentLocation&to=" + name
    url += "&tocoord=" + latitude + "," + longitude
    url += "&referer=WDHBZ-AWV6Q-S6I52-2TE5D-UBMX2-NEBAY"
    return url
}
public func buildAmapURL(_ params: ExternalMapNavigationParams) -> String {
    var name = encodedValue(destinationName(params))
    var sourceApplication = encodedValue("中导物联")
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
    var providerIds = getAvailableIOSMapProviderIds()
    if (providerIds.length == 1) {
        return openSelectedProvider(params, providerIds[0])
    }
    if (providerIds.length > 1) {
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
public func getAvailableIOSMapProviderIdsByJs() -> [String] {
    return getAvailableIOSMapProviderIds()
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
    public static func s_getAvailableIOSMapProviderIdsByJs() -> [String] {
        return getAvailableIOSMapProviderIdsByJs()
    }
    public static func s_openExternalMapByJs(_ params: ExternalMapNavigationParamsJSONObject) -> ExternalMapNavigationResult {
        return openExternalMapByJs(params)
    }
}
