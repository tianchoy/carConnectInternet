@file:Suppress("UNCHECKED_CAST", "USELESS_CAST", "INAPPLICABLE_JVM_NAME", "UNUSED_ANONYMOUS_PARAMETER", "NAME_SHADOWING", "UNNECESSARY_NOT_NULL_ASSERTION")
package uts.sdk.modules.limeFileUtils
import android.util.Base64
import android.webkit.MimeTypeMap
import io.dcloud.uniapp.*
import io.dcloud.uniapp.extapi.*
import io.dcloud.uniapp.framework.*
import io.dcloud.uniapp.runtime.*
import io.dcloud.uniapp.vue.*
import io.dcloud.uniapp.vue.shared.*
import io.dcloud.unicloud.*
import io.dcloud.uts.*
import io.dcloud.uts.Map
import io.dcloud.uts.Set
import io.dcloud.uts.UTSAndroid
import java.io.ByteArrayOutputStream
import java.io.File
import java.io.FileInputStream
import java.io.FileOutputStream
import java.io.InputStream
import kotlin.properties.Delegates
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Deferred
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.async
typealias NullableString = String?
typealias ConversionType = String
open class ProcessFileOptions (
    @JsonNotNull
    open var type: ConversionType,
    @JsonNotNull
    open var path: String,
    open var filename: String? = null,
    open var success: ((res: String) -> Unit)? = null,
    open var fail: ((res: Any) -> Unit)? = null,
    open var complete: ((res: Any) -> Unit)? = null,
) : UTSObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("ProcessFileOptions", "uni_modules/lime-file-utils/utssdk/interface.uts", 4, 13)
    }
}
typealias NullByteArray = ByteArray?
fun inputStreamToArray(inputStream: InputStream): NullByteArray {
    try {
        var bos: ByteArrayOutputStream = ByteArrayOutputStream()
        var bytes: ByteArray = ByteArray(1024)
        do {
            var length = inputStream.read(bytes)
            if (length != -1) {
                bos.write(bytes, 0, length)
            } else {
                break
            }
        }
        while (true)
        bos.close()
        return bos.toByteArray()
    }
     catch (e: Throwable) {
        return null
    }
}
fun getMimeType(filePath: String): NullableString {
    val extension = MimeTypeMap.getFileExtensionFromUrl(filePath)
    if (extension == null) {
        return null
    }
    return MimeTypeMap.getSingleton().getMimeTypeFromExtension(extension)
}
fun getResourcePath(path: String): String? {
    var uri = path
    if (uri.startsWith("http") || uri.startsWith("<svg") || uri.startsWith("data:image/")) {
        return uri
    }
    if (uri.startsWith("file://")) {
        uri = uri.substring(7)
    } else if (uri.startsWith("unifile://")) {
        uri = UTSAndroid.convert2AbsFullPath(uri)
    } else {
        uri = UTSAndroid.convert2AbsFullPath(uri)
        if (uri.startsWith("/android_asset/")) {
            try {
                val context = UTSAndroid.getUniActivity()!!
                val inputStream = context.getResources()!!.getAssets().open(path.replace("/android_asset/", ""))
                inputStream.close()
                return uri
            }
             catch (e: Throwable) {
                return null
            }
        }
    }
    val file = File(uri)
    if (file.exists()) {
        return uri
    }
    return null
}
fun checkExistence(filePath: String): UTSArray<Boolean> {
    val path = getResourcePath(filePath)
    if (path == null) {
        return _uA(
            false,
            false
        )
    }
    val file = File(path)
    val exists = file.exists()
    if (exists) {
        return _uA(
            true,
            file.isDirectory
        )
    } else {
        return _uA(
            false,
            false
        )
    }
}
fun isExists(filePath: String): Boolean {
    val result = checkExistence(filePath)
    return result[0]
}
fun isDirectory(filePath: String): Boolean {
    val result = checkExistence(filePath)
    return result[0] && result[1]
}
fun isFile(filePath: String): Boolean {
    val result = checkExistence(filePath)
    return result[0] && !result[1]
}
fun fileToBase64(filePath: String): NullableString {
    try {
        val context = UTSAndroid.getUniActivity()!!
        var path = filePath
        var imageBytes: NullByteArray = null
        if (path.startsWith("file://")) {
            path = path.replace("file://", "")
        } else {
            path = UTSAndroid.convert2AbsFullPath(path)
        }
        if (path.startsWith("/android_asset/")) {
            imageBytes = inputStreamToArray(context.getResources()!!.getAssets().open(path.replace("/android_asset/", "")))
        } else {
            val file = File(path)
            if (file.exists()) {
                var fis: FileInputStream = FileInputStream(file)
                imageBytes = inputStreamToArray(fis)
                fis.close()
            }
        }
        if (imageBytes == null) {
            return null
        }
        return Base64.encodeToString(imageBytes, Base64.DEFAULT)
    }
     catch (e: Throwable) {
        return null
    }
}
fun fileToDataURL(filePath: String): NullableString {
    val base64 = fileToBase64(filePath)
    val mimeType = getMimeType(filePath)
    if (base64 == null || mimeType == null) {
        return null
    }
    return "data:" + mimeType + ";base64," + base64
}
fun getFileExtensionFromDataURL(dataURL: String): String {
    val commaIndex = dataURL.indexOf(",")
    val mimeType = dataURL.substring(0, commaIndex).replace("data:", "").replace(";base64", "")
    val mimeTypeParts = mimeType.split("/")
    return mimeTypeParts[1]
}
fun dataURLToBytes(dataURL: String): ByteArray {
    val commaIndex = dataURL.indexOf(",")
    val base64 = dataURL.substring(commaIndex + 1)
    return Base64.decode(base64, Base64.DEFAULT)
}
fun dataURLToFile(dataURL: String, filename: NullableString = null): NullableString {
    try {
        val bytes = dataURLToBytes(dataURL)
        val name = filename ?: "" + Date.now() + "." + getFileExtensionFromDataURL(dataURL)
        val cacheDir = UTSAndroid.getAppCachePath()!!
        val destFile = File(cacheDir, name)
        val path = File(cacheDir)
        if (!path.exists()) {
            path.mkdir()
        }
        val fos = FileOutputStream(destFile)
        fos.write(bytes)
        fos.close()
        return "" + cacheDir + name
    }
     catch (e: Throwable) {
        console.error("dataURLToFile::", e, " at uni_modules/lime-file-utils/utssdk/app-android/index.uts:183")
        return null
    }
}
fun processFile(options: ProcessFileOptions) {
    if (options.type == "toBase64") {
        val res = fileToBase64(options.path)
        val err = "fileToBase64: 解析失败"
        if (res != null) {
            options.success?.invoke(res)
            options.complete?.invoke(res)
        } else {
            options.complete?.invoke(err)
            options.fail?.invoke(err)
        }
    } else if (options.type == "toDataURL") {
        val res = fileToDataURL(options.path)
        val err = "fileToDataURL: 解析失败"
        if (res != null) {
            options.success?.invoke(res)
            options.complete?.invoke(res)
        } else {
            options.complete?.invoke(err)
            options.fail?.invoke(err)
        }
    } else if (options.type == "toFile") {
        val res = dataURLToFile(options.path, options.filename)
        val err = "dataURLToFile: 解析失败"
        if (res != null) {
            options.success?.invoke(res)
            options.complete?.invoke(res)
        } else {
            options.complete?.invoke(err)
            options.fail?.invoke(err)
        }
    }
}
