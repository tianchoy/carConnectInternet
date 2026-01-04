import DCloudUTSFoundation
import DCloudUniappRuntime
import Foundation
import MobileCoreServices
import Swift
public typealias NullableString = String?
public typealias ConversionType = String
@objc(UTSSDKModulesLimeFileUtilsProcessFileOptions)
@objcMembers
public class ProcessFileOptions : NSObject, UTSObject, IUTSSourceMap {
    public func __$getOriginalPosition() -> UTSSourceMapPosition? {
        return UTSSourceMapPosition("ProcessFileOptions", "uni_modules/lime-file-utils/utssdk/interface.uts", 4, 13)
    }
    public var type: ConversionType!
    public var path: String!
    public var filename: String?
    public var success: ((_ res: String) -> Void)?
    public var fail: ((_ res: Any) -> Void)?
    public var complete: ((_ res: Any) -> Void)?
    public subscript(_ key: String) -> Any? {
        get {
            return utsSubscriptGetValue(key)
        }
        set {
            switch(key){
                case "type":
                    self.type = try! utsSubscriptCheckValue(newValue)
                case "path":
                    self.path = try! utsSubscriptCheckValue(newValue)
                case "filename":
                    self.filename = try! utsSubscriptCheckValueIfPresent(newValue)
                case "success":
                    self.success = try! utsSubscriptCheckValueIfPresent(newValue)
                case "fail":
                    self.fail = try! utsSubscriptCheckValueIfPresent(newValue)
                case "complete":
                    self.complete = try! utsSubscriptCheckValueIfPresent(newValue)
                default:
                    break
            }
        }
    }
    public override init() {
        super.init()
    }
    public init(_ obj: UTSJSONObject) {
        self.type = obj["type"] as! ConversionType
        self.path = obj["path"] as! String
        self.filename = obj["filename"] as! String?
        self.success = obj["success"] as! ((_ res: String) -> Void)?
        self.fail = obj["fail"] as! ((_ res: Any) -> Void)?
        self.complete = obj["complete"] as! ((_ res: Any) -> Void)?
    }
}
public func getResourcePath(_ filePath: String) -> String {
    var path = filePath
    if (path.startsWith("http") || path.startsWith("<svg") || path.startsWith("data:image/")) {
        return path
    }
    if (path.startsWith("file://")) {
        path = path.substring(7)
    } else if (path.startsWith("unifile://")) {
        path = UTSiOS.convert2AbsFullPath(filePath)
    } else if (!path.startsWith("/var/")) {
        path = UTSiOS.getResourcePath(filePath)
    }
    return path
}
public func checkExistence(_ filePath: String) -> [Bool] {
    var path = getResourcePath(filePath)
    var isDirectory: ObjCBool = false
    var exists = FileManager.default.fileExists(atPath: path, isDirectory: &isDirectory)
    return [
        exists,
        isDirectory.boolValue
    ]
}
public func isFile(_ filePath: String) -> Bool {
    var result = checkExistence(filePath)
    return result[0] && !result[1]
}
public func isExists(_ filePath: String) -> Bool {
    var result = checkExistence(filePath)
    return result[0]
}
public func isDirectory(_ filePath: String) -> Bool {
    var result = checkExistence(filePath)
    return result[0] && result[1]
}
public func getMimeType(_ filePath: String) -> NullableString {
    var path = getResourcePath(filePath)
    if (!FileManager.default.fileExists(atPath: path)) {
        return nil
    }
    var pathExtension = URL(fileURLWithPath: path).pathExtension
    var mimeType = UTTypeCreatePreferredIdentifierForTag(kUTTagClassFilenameExtension, pathExtension as! CFString, nil)?.takeRetainedValue()
    if (mimeType == nil) {
        return nil
    }
    var mimeTypeString = UTTypeCopyPreferredTagWithClass(mimeType!, kUTTagClassMIMEType)?.takeRetainedValue()
    if (mimeTypeString == nil) {
        return nil
    }
    return mimeTypeString as! String
}
public func fileToBase64(_ filePath: String) -> NullableString {
    var path = getResourcePath(filePath)
    if (!FileManager.default.fileExists(atPath: path)) {
        return nil
    }
    var fileData = FileManager.default.contents(atPath: path)
    if (fileData == nil) {
        return nil
    }
    return fileData!.base64EncodedString(options: NSData.Base64EncodingOptions.lineLength64Characters)
}
public func fileToDataURL(_ filePath: String) -> NullableString {
    var base64 = fileToBase64(filePath)
    var mimeType = getMimeType(filePath)
    if (base64 == nil || mimeType == nil) {
        return nil
    }
    return ("data:" + mimeType! + ";base64," + base64!)
}
public func getFileExtensionFromDataURL(_ dataURL: String) -> String {
    var commaIndex = dataURL.indexOf(",")
    var mimeType = dataURL.substring(0, commaIndex).replace("data:", "").replace(";base64", "")
    var mimeTypeParts = mimeType.split("/")
    return mimeTypeParts[1]
}
public func dataURLToFile(_ dataURL: String, _ filename: NullableString = nil) -> NullableString {
    var commaIndex = dataURL.indexOf(",")
    var base64 = dataURL.substring(commaIndex + 1)
    var data = Data(base64Encoded: base64)
    var dataPath = UTSiOS.getDataPath()
    var name = filename ?? """
\(Date.now()).\(getFileExtensionFromDataURL(dataURL))
"""
    if (data == nil) {
        return nil
    }
    var temporaryDirectoryURL = URL(fileURLWithPath: dataPath)
    var fileURL = temporaryDirectoryURL.appendingPathComponent(name)
    do {
        try data!.write(to: fileURL)
        return """
\(dataPath)/\(name)
"""
    }
     catch let e {
        var e = UTSError(e)
        return nil
    }
}
public func processFile(_ options: ProcessFileOptions) {
    if (options.type == "toBase64") {
        var res = fileToBase64(options.path)
        var err = "fileToBase64: 解析失败"
        if (res != nil) {
            options.success?(res!)
            options.complete?(res!)
        } else {
            options.complete?(err)
            options.fail?(err)
        }
    } else if (options.type == "toDataURL") {
        var res = fileToDataURL(options.path)
        var err = "fileToDataURL: 解析失败"
        if (res != nil) {
            options.success?(res!)
            options.complete?(res!)
        } else {
            options.complete?(err)
            options.fail?(err)
        }
    } else if (options.type == "toFile") {
        var res = dataURLToFile(options.path, options.filename)
        var err = "dataURLToFile: 解析失败"
        if (res != nil) {
            options.success?(res!)
            options.complete?(res!)
        } else {
            options.complete?(err)
            options.fail?(err)
        }
    }
}
@objc(UTSSDKModulesLimeFileUtilsProcessFileOptionsJSONObject)
@objcMembers
public class ProcessFileOptionsJSONObject : NSObject {
    public var type: ConversionType!
    public var path: String!
    public var filename: String?
    public var success: UTSCallback?
    public var fail: UTSCallback?
    public var complete: UTSCallback?
}
public func getResourcePathByJs(_ filePath: String) -> String {
    return getResourcePath(filePath)
}
public func checkExistenceByJs(_ filePath: String) -> [Bool] {
    return checkExistence(filePath)
}
public func isFileByJs(_ filePath: String) -> Bool {
    return isFile(filePath)
}
public func isExistsByJs(_ filePath: String) -> Bool {
    return isExists(filePath)
}
public func isDirectoryByJs(_ filePath: String) -> Bool {
    return isDirectory(filePath)
}
public func fileToBase64ByJs(_ filePath: String) -> NullableString {
    return fileToBase64(filePath)
}
public func fileToDataURLByJs(_ filePath: String) -> NullableString {
    return fileToDataURL(filePath)
}
public func dataURLToFileByJs(_ dataURL: String, _ filename: NullableString = nil) -> NullableString {
    return dataURLToFile(dataURL, filename)
}
public func processFileByJs(_ options: ProcessFileOptionsJSONObject) {
    return processFile(ProcessFileOptions(UTSJSONObject([
        "type": options.type,
        "path": options.path,
        "filename": options.filename,
        "success": {
        (res: String) -> Void in
        options.success?(res)
        },
        "fail": {
        (res: Any) -> Void in
        options.fail?(res)
        },
        "complete": {
        (res: Any) -> Void in
        options.complete?(res)
        }
    ])))
}
@objc(UTSSDKModulesLimeFileUtilsIndexSwift)
@objcMembers
public class UTSSDKModulesLimeFileUtilsIndexSwift : NSObject {
    public static func s_getResourcePathByJs(_ filePath: String) -> String {
        return getResourcePathByJs(filePath)
    }
    public static func s_checkExistenceByJs(_ filePath: String) -> [Bool] {
        return checkExistenceByJs(filePath)
    }
    public static func s_isFileByJs(_ filePath: String) -> Bool {
        return isFileByJs(filePath)
    }
    public static func s_isExistsByJs(_ filePath: String) -> Bool {
        return isExistsByJs(filePath)
    }
    public static func s_isDirectoryByJs(_ filePath: String) -> Bool {
        return isDirectoryByJs(filePath)
    }
    public static func s_fileToBase64ByJs(_ filePath: String) -> NullableString {
        return fileToBase64ByJs(filePath)
    }
    public static func s_fileToDataURLByJs(_ filePath: String) -> NullableString {
        return fileToDataURLByJs(filePath)
    }
    public static func s_dataURLToFileByJs(_ dataURL: String, _ filename: NullableString = nil) -> NullableString {
        return dataURLToFileByJs(dataURL, filename)
    }
    public static func s_processFileByJs(_ options: ProcessFileOptionsJSONObject) {
        return processFileByJs(options)
    }
}
