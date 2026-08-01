import DCloudUTSFoundation
import DCloudUniappRuntime
@objc(UTSSDKModulesExternalMapNavigationExternalMapNavigationParams)
@objcMembers
public class ExternalMapNavigationParams : NSObject, UTSObject, IUTSSourceMap {
    public func __$getOriginalPosition() -> UTSSourceMapPosition? {
        return UTSSourceMapPosition("ExternalMapNavigationParams", "uni_modules/external-map-navigation/utssdk/interface.uts", 1, 13)
    }
    public var latitude: NSNumber!
    public var longitude: NSNumber!
    public var name: String!
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
    }
}
@objc(UTSSDKModulesExternalMapNavigationExternalMapNavigationResult)
@objcMembers
public class ExternalMapNavigationResult : NSObject, UTSObject, IUTSSourceMap {
    public func __$getOriginalPosition() -> UTSSourceMapPosition? {
        return UTSSourceMapPosition("ExternalMapNavigationResult", "uni_modules/external-map-navigation/utssdk/interface.uts", 6, 13)
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
public func openExternalMap(_ params: ExternalMapNavigationParams) -> ExternalMapNavigationResult {
    return ExternalMapNavigationResult(UTSJSONObject([
        "code": "unsupported_platform"
    ]))
}
@objc(UTSSDKModulesExternalMapNavigationExternalMapNavigationParamsJSONObject)
@objcMembers
public class ExternalMapNavigationParamsJSONObject : NSObject {
    public var latitude: NSNumber!
    public var longitude: NSNumber!
    public var name: String!
}
public func openExternalMapByJs(_ params: ExternalMapNavigationParamsJSONObject) -> ExternalMapNavigationResult {
    return openExternalMap(ExternalMapNavigationParams(UTSJSONObject([
        "latitude": params.latitude,
        "longitude": params.longitude,
        "name": params.name
    ])))
}
@objc(UTSSDKModulesExternalMapNavigationIndexSwift)
@objcMembers
public class UTSSDKModulesExternalMapNavigationIndexSwift : NSObject {
    public static func s_openExternalMapByJs(_ params: ExternalMapNavigationParamsJSONObject) -> ExternalMapNavigationResult {
        return openExternalMapByJs(params)
    }
}
