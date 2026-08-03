@file:Suppress("UNCHECKED_CAST", "USELESS_CAST", "INAPPLICABLE_JVM_NAME", "UNUSED_ANONYMOUS_PARAMETER", "SENSELESS_COMPARISON", "NAME_SHADOWING", "UNNECESSARY_NOT_NULL_ASSERTION")
package uts.sdk.modules.externalMapNavigation
import android.app.Activity
import android.content.Intent
import android.net.Uri
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
import kotlin.properties.Delegates
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Deferred
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.async
open class ExternalMapNavigationParams (
    @JsonNotNull
    open var latitude: Number,
    @JsonNotNull
    open var longitude: Number,
    @JsonNotNull
    open var name: String,
    open var wgs84Latitude: Number? = null,
    open var wgs84Longitude: Number? = null,
) : UTSObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("ExternalMapNavigationParams", "uni_modules/external-map-navigation/utssdk/interface.uts", 1, 13)
    }
}
open class ExternalMapNavigationResult (
    @JsonNotNull
    open var code: String,
) : UTSObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("ExternalMapNavigationResult", "uni_modules/external-map-navigation/utssdk/interface.uts", 8, 13)
    }
}
fun result(code: String): ExternalMapNavigationResult {
    return ExternalMapNavigationResult(code = code)
}
fun isValidCoordinate(latitude: Number, longitude: Number): Boolean {
    return !isNaN(latitude) && !isNaN(longitude) && latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180 && !(latitude == 0 && longitude == 0)
}
fun openExternalMap(params: ExternalMapNavigationParams): ExternalMapNavigationResult {
    if (!isValidCoordinate(params.latitude, params.longitude)) {
        return result("invalid_coordinate")
    }
    val activity = UTSAndroid.getUniActivity()
    if (activity == null) {
        console.error("获取当前页面失败，无法打开地图", " at uni_modules/external-map-navigation/utssdk/app-android/index.uts:24")
        return result("launch_failed")
    }
    try {
        val currentActivity = activity as Activity
        val geoUri = "geo:0,0?q=" + params.latitude.toString(10) + "," + params.longitude.toString(10)
        val mapIntent = Intent(Intent.ACTION_VIEW, Uri.parse(geoUri))
        val handlers = currentActivity.getPackageManager().queryIntentActivities(mapIntent, 0)
        if (handlers.size == 0) {
            return result("no_map_app")
        }
        val chooser = Intent.createChooser(mapIntent, "选择地图应用")
        currentActivity.startActivity(chooser)
        console.log("已请求打开外部地图:", geoUri, " at uni_modules/external-map-navigation/utssdk/app-android/index.uts:39")
        return result("opened")
    }
     catch (error: Throwable) {
        console.error("打开外部地图失败:", error, " at uni_modules/external-map-navigation/utssdk/app-android/index.uts:42")
        return result("launch_failed")
    }
}
