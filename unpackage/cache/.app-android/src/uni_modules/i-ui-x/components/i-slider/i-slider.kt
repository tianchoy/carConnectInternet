@file:Suppress("UNCHECKED_CAST", "USELESS_CAST", "INAPPLICABLE_JVM_NAME", "UNUSED_ANONYMOUS_PARAMETER", "SENSELESS_COMPARISON", "NAME_SHADOWING", "UNNECESSARY_NOT_NULL_ASSERTION")
package uni.UNI662B0B4
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
import io.dcloud.uniapp.extapi.createSelectorQuery as uni_createSelectorQuery
open class GenUniModulesIUiXComponentsISliderISlider : VueComponent {
    constructor(__ins: ComponentInternalInstance) : super(__ins) {}
    open var modelValue: Any by `$props`
    open var value: Any by `$props`
    open var min: Number by `$props`
    open var max: Number by `$props`
    open var step: Number by `$props`
    open var range: Boolean by `$props`
    open var disabled: Boolean by `$props`
    open var readonly: Boolean by `$props`
    open var noCross: Boolean by `$props`
    open var vertical: Boolean by `$props`
    open var size: String by `$props`
    open var railColor: String by `$props`
    open var railRadius: String by `$props`
    open var railSize: String by `$props`
    open var trackColor: String by `$props`
    open var thumbSize: String by `$props`
    open var thumbColor: String by `$props`
    open var thumbBorder: String by `$props`
    open var thumbRadius: String by `$props`
    open var showValue: Boolean by `$props`
    companion object {
        @Suppress("UNUSED_PARAMETER", "UNUSED_VARIABLE")
        var setup: (__props: GenUniModulesIUiXComponentsISliderISlider) -> Any? = fun(__props): Any? {
            val __ins = getCurrentInstance()!!
            val _ctx = __ins.proxy as GenUniModulesIUiXComponentsISliderISlider
            val _cache = __ins.renderCache
            val props = __props
            fun emit(event: String, vararg do_not_transform_spread: Any?) {
                __ins.emit(event, *do_not_transform_spread)
            }
            fun gen_initialValue_fn(): Any {
                if (props.modelValue.toString().length > 0) {
                    return props.modelValue
                }
                return props.value
            }
            val initialValue = ::gen_initialValue_fn
            fun gen_normalizeSingle_fn(value: Any): Number {
                var nextValue = parseFloat(value.toString())
                if (isNaN(nextValue)) {
                    nextValue = props.min
                }
                if (nextValue < props.min) {
                    nextValue = props.min
                }
                if (nextValue > props.max) {
                    nextValue = props.max
                }
                return nextValue
            }
            val normalizeSingle = ::gen_normalizeSingle_fn
            fun gen_normalizeRange_fn(value: Any): UTSArray<Number> {
                var start = props.min
                var end = props.max
                if (UTSArray.isArray(value) && (value as UTSArray<Any>).length > 1) {
                    start = parseFloat((value as UTSArray<Any>)[0].toString())
                    end = parseFloat((value as UTSArray<Any>)[1].toString())
                } else {
                    val text = value.toString()
                    if (text.indexOf(",") >= 0) {
                        start = parseFloat(text.split(",")[0])
                        end = parseFloat(text.split(",")[1])
                    }
                }
                start = normalizeSingle(start)
                end = normalizeSingle(end)
                if (props.noCross && start > end) {
                    start = end
                }
                return _uA(
                    start,
                    end
                )
            }
            val normalizeRange = ::gen_normalizeRange_fn
            fun gen_valuePercent_fn(value: Number): Number {
                val distance = props.max - props.min
                if (distance <= 0) {
                    return 0
                }
                val percent = ((value - props.min) / distance) * 100
                if (percent < 0) {
                    return 0
                }
                if (percent > 100) {
                    return 100
                }
                return percent
            }
            val valuePercent = ::gen_valuePercent_fn
            fun gen_formatSize_fn(value: Any): String {
                val text = value.toString()
                if (text.indexOf("px") >= 0 || text.indexOf("rpx") >= 0 || text.indexOf("%") >= 0) {
                    return text
                }
                return text + "px"
            }
            val formatSize = ::gen_formatSize_fn
            fun gen_thumbStyle_fn(value: Number): String {
                val size = parseFloat(props.thumbSize.toString())
                val halfSize = if (isNaN(size)) {
                    10
                } else {
                    size / 2
                }
                return ("left:" + valuePercent(value).toString(10) + "%;width:" + formatSize(props.thumbSize) + ";height:" + formatSize(props.thumbSize) + ";margin-left:" + formatSize(0 - halfSize) + ";border:" + props.thumbBorder + ";border-radius:" + props.thumbRadius + ";background-color:" + props.thumbColor + ";")
            }
            val thumbStyle = ::gen_thumbStyle_fn
            val singleValue = ref(normalizeSingle(initialValue()))
            val rangeStart = ref(normalizeRange(initialValue())[0])
            val rangeEnd = ref(normalizeRange(initialValue())[1])
            val dragging = ref(false)
            val rangeId = "i-slider-range-" + Math.floor(Math.random() * 1000000).toString(10)
            val rangeRectLeft = ref(0)
            val rangeRectWidth = ref(0)
            val activeRangeThumb = ref("")
            val wrapClass = computed(fun(): String {
                val classes = _uA(
                    "i-slider"
                )
                if (props.vertical) {
                    classes.push("i-slider--vertical")
                }
                if (props.disabled) {
                    classes.push("i-slider--disabled")
                }
                return classes.join(" ")
            }
            )
            val displayValue = computed(fun(): String {
                if (props.range) {
                    return rangeStart.value.toString(10) + " - " + rangeEnd.value.toString(10)
                }
                return singleValue.value.toString(10)
            }
            )
            val rangeRailStyle = computed(fun(): String {
                return ("height:" + formatSize(props.railSize) + ";border-radius:" + formatSize(props.railRadius) + ";background-color:" + props.railColor + ";")
            }
            )
            val rangeTrackStyle = computed(fun(): String {
                val startPercent = valuePercent(rangeStart.value)
                val endPercent = valuePercent(rangeEnd.value)
                return ("left:" + startPercent.toString(10) + "%;width:" + (endPercent - startPercent).toString(10) + "%;height:" + formatSize(props.railSize) + ";border-radius:" + formatSize(props.railRadius) + ";background-color:" + props.trackColor + ";")
            }
            )
            val startThumbStyle = computed(fun(): String {
                return thumbStyle(rangeStart.value)
            }
            )
            val endThumbStyle = computed(fun(): String {
                return thumbStyle(rangeEnd.value)
            }
            )
            val syncFromProps = fun(): Unit {
                singleValue.value = normalizeSingle(initialValue())
                val values = normalizeRange(initialValue())
                rangeStart.value = values[0]
                rangeEnd.value = values[1]
            }
            watch(fun(): Any {
                return props.modelValue
            }
            , fun(): Unit {
                syncFromProps()
            }
            )
            watch(fun(): Any {
                return props.value
            }
            , fun(): Unit {
                syncFromProps()
            }
            )
            fun gen_normalizeStart_fn(value: Number): Number {
                var nextValue = normalizeSingle(value)
                if (props.noCross && nextValue > rangeEnd.value) {
                    nextValue = rangeEnd.value
                }
                return nextValue
            }
            val normalizeStart = ::gen_normalizeStart_fn
            fun gen_normalizeEnd_fn(value: Number): Number {
                var nextValue = normalizeSingle(value)
                if (props.noCross && nextValue < rangeStart.value) {
                    nextValue = rangeStart.value
                }
                return nextValue
            }
            val normalizeEnd = ::gen_normalizeEnd_fn
            val startDrag = fun(): Unit {
                if (dragging.value) {
                    return
                }
                dragging.value = true
                emit("dragStart")
            }
            val endDrag = fun(): Unit {
                dragging.value = false
                emit("dragEnd")
            }
            val emitValue = fun(value: Any): Unit {
                emit("update:modelValue", value)
                emit("update:value", value)
                emit("change", value)
            }
            fun gen_handleSingleChanging_fn(event: UniSliderChangeEvent) {
                startDrag()
                singleValue.value = normalizeSingle(event.detail.value)
                emit("changing", singleValue.value)
            }
            val handleSingleChanging = ::gen_handleSingleChanging_fn
            fun gen_handleSingleChange_fn(event: UniSliderChangeEvent) {
                singleValue.value = normalizeSingle(event.detail.value)
                emitValue(singleValue.value)
                endDrag()
            }
            val handleSingleChange = ::gen_handleSingleChange_fn
            fun gen_handleStartChanging_fn(event: UniSliderChangeEvent) {
                startDrag()
                rangeStart.value = normalizeStart(event.detail.value)
                emit("changing", _uA(
                    rangeStart.value,
                    rangeEnd.value
                ))
            }
            val handleStartChanging = ::gen_handleStartChanging_fn
            fun gen_handleStartChange_fn(event: UniSliderChangeEvent) {
                rangeStart.value = normalizeStart(event.detail.value)
                emitValue(_uA(
                    rangeStart.value,
                    rangeEnd.value
                ))
                endDrag()
            }
            val handleStartChange = ::gen_handleStartChange_fn
            fun gen_handleEndChanging_fn(event: UniSliderChangeEvent) {
                startDrag()
                rangeEnd.value = normalizeEnd(event.detail.value)
                emit("changing", _uA(
                    rangeStart.value,
                    rangeEnd.value
                ))
            }
            val handleEndChanging = ::gen_handleEndChanging_fn
            fun gen_handleEndChange_fn(event: UniSliderChangeEvent) {
                rangeEnd.value = normalizeEnd(event.detail.value)
                emitValue(_uA(
                    rangeStart.value,
                    rangeEnd.value
                ))
                endDrag()
            }
            val handleEndChange = ::gen_handleEndChange_fn
            fun gen_normalizeRectPoint_fn(first: Any, fallback: Any): Number {
                val firstValue = parseFloat(first.toString())
                if (!isNaN(firstValue)) {
                    return firstValue
                }
                val fallbackValue = parseFloat(fallback.toString())
                if (!isNaN(fallbackValue)) {
                    return fallbackValue
                }
                return 0
            }
            val normalizeRectPoint = ::gen_normalizeRectPoint_fn
            fun gen_normalizeStep_fn(value: Number): Number {
                val stepValue = if (props.step <= 0) {
                    1
                } else {
                    props.step
                }
                val nextValue = props.min + Math.round((value - props.min) / stepValue) * stepValue
                return normalizeSingle(parseFloat(nextValue.toFixed(6)))
            }
            val normalizeStep = ::gen_normalizeStep_fn
            fun gen_valueFromPoint_fn(x: Number): Number {
                var percent = (x - rangeRectLeft.value) / rangeRectWidth.value
                if (percent < 0) {
                    percent = 0
                }
                if (percent > 1) {
                    percent = 1
                }
                val rawValue = props.min + (props.max - props.min) * percent
                return normalizeStep(rawValue)
            }
            val valueFromPoint = ::gen_valueFromPoint_fn
            fun gen_pickRangeThumb_fn(value: Number): Unit {
                val startDistance = Math.abs(value - rangeStart.value)
                val endDistance = Math.abs(value - rangeEnd.value)
                activeRangeThumb.value = if (startDistance <= endDistance) {
                    "start"
                } else {
                    "end"
                }
            }
            val pickRangeThumb = ::gen_pickRangeThumb_fn
            fun gen_readTouchX_fn(event: UniTouchEvent): Number {
                var point: UniTouch? = null
                if (event.touches.length > 0) {
                    point = event.touches[0]
                } else if (event.changedTouches.length > 0) {
                    point = event.changedTouches[0]
                }
                if (point == null) {
                    return NaN
                }
                return point.clientX
            }
            val readTouchX = ::gen_readTouchX_fn
            fun gen_updateRangeByTouch_fn(event: UniTouchEvent, shouldPickThumb: Boolean): Unit {
                val x = readTouchX(event)
                if (isNaN(x) || rangeRectWidth.value <= 0) {
                    return
                }
                val nextValue = valueFromPoint(x)
                if (shouldPickThumb) {
                    pickRangeThumb(nextValue)
                }
                if (activeRangeThumb.value == "start") {
                    rangeStart.value = normalizeStart(nextValue)
                } else {
                    rangeEnd.value = normalizeEnd(nextValue)
                }
                emit("changing", _uA(
                    rangeStart.value,
                    rangeEnd.value
                ))
            }
            val updateRangeByTouch = ::gen_updateRangeByTouch_fn
            fun gen_setRangeRect_fn(rect: Any): Unit {
                val rects = rect as UTSArray<NodeInfo>
                if (rects.length == 0) {
                    return
                }
                val nodeInfo = rects[0]
                rangeRectLeft.value = if (nodeInfo.left != null) {
                    nodeInfo.left!!
                } else {
                    0
                }
                rangeRectWidth.value = if (nodeInfo.width != null) {
                    nodeInfo.width!!
                } else {
                    0
                }
            }
            val setRangeRect = ::gen_setRangeRect_fn
            fun gen_refreshRangeRect_fn(event: UniTouchEvent, shouldPickThumb: Boolean, shouldUpdate: Boolean): Unit {
                uni_createSelectorQuery().select("#" + rangeId).boundingClientRect(fun(rect: Any){
                    setRangeRect(rect)
                    if (shouldUpdate) {
                        updateRangeByTouch(event, shouldPickThumb)
                    }
                }
                ).exec()
            }
            val refreshRangeRect = ::gen_refreshRangeRect_fn
            fun gen_handleRangeTouchStart_fn(event: UniTouchEvent) {
                if (props.disabled || props.readonly) {
                    return
                }
                startDrag()
                refreshRangeRect(event, true, true)
            }
            val handleRangeTouchStart = ::gen_handleRangeTouchStart_fn
            fun gen_handleRangeTouchMove_fn(event: UniTouchEvent) {
                if (props.disabled || props.readonly || activeRangeThumb.value.length == 0) {
                    return
                }
                updateRangeByTouch(event, false)
            }
            val handleRangeTouchMove = ::gen_handleRangeTouchMove_fn
            fun gen_handleRangeTouchEnd_fn() {
                if (activeRangeThumb.value.length == 0) {
                    return
                }
                emitValue(_uA(
                    rangeStart.value,
                    rangeEnd.value
                ))
                activeRangeThumb.value = ""
                endDrag()
            }
            val handleRangeTouchEnd = ::gen_handleRangeTouchEnd_fn
            return fun(): Any? {
                val _component_slider = resolveComponent("slider")
                return _cE("view", _uM("class" to _nC(wrapClass.value)), _uA(
                    if (isTrue(!_ctx.range)) {
                        _cE("view", _uM("key" to 0, "class" to "i-slider__line"), _uA(
                            _cV(_component_slider, _uM("class" to "i-slider__native", "value" to singleValue.value, "min" to _ctx.min, "max" to _ctx.max, "step" to _ctx.step, "disabled" to (_ctx.disabled || _ctx.readonly), "activeColor" to _ctx.trackColor, "backgroundColor" to _ctx.railColor, "onChanging" to handleSingleChanging, "onChange" to handleSingleChange), null, 8, _uA(
                                "value",
                                "min",
                                "max",
                                "step",
                                "disabled",
                                "activeColor",
                                "backgroundColor"
                            )),
                            renderSlot(_ctx.`$slots`, "startThumb")
                        ))
                    } else {
                        _cE("view", _uM("key" to 1, "id" to rangeId, "class" to "i-slider__range", "onTouchstart" to withModifiers(handleRangeTouchStart, _uA(
                            "stop",
                            "prevent"
                        )), "onTouchmove" to withModifiers(handleRangeTouchMove, _uA(
                            "stop",
                            "prevent"
                        )), "onTouchend" to withModifiers(handleRangeTouchEnd, _uA(
                            "stop",
                            "prevent"
                        )), "onTouchcancel" to withModifiers(handleRangeTouchEnd, _uA(
                            "stop",
                            "prevent"
                        ))), _uA(
                            _cE("view", _uM("class" to "i-slider__range-rail", "style" to _nS(rangeRailStyle.value)), null, 4),
                            _cE("view", _uM("class" to "i-slider__range-track", "style" to _nS(rangeTrackStyle.value)), null, 4),
                            _cE("view", _uM("class" to "i-slider__thumb", "style" to _nS(startThumbStyle.value)), _uA(
                                renderSlot(_ctx.`$slots`, "startThumb")
                            ), 4),
                            _cE("view", _uM("class" to "i-slider__thumb", "style" to _nS(endThumbStyle.value)), _uA(
                                renderSlot(_ctx.`$slots`, "endThumb")
                            ), 4)
                        ), 32)
                    }
                    ,
                    if (isTrue(_ctx.showValue)) {
                        _cE("text", _uM("key" to 2, "class" to "i-slider__value"), _tD(displayValue.value), 1)
                    } else {
                        _cC("v-if", true)
                    }
                ), 2)
            }
        }
        var name = "i-slider"
        val styles: Map<String, Map<String, Map<String, Any>>> by lazy {
            _nCS(_uA(
                styles0
            ))
        }
        val styles0: Map<String, Map<String, Map<String, Any>>>
            get() {
                return _uM("i-slider" to _pS(_uM("flexDirection" to "row", "alignItems" to "center")), "i-slider--vertical" to _pS(_uM("flexDirection" to "column", "alignItems" to "stretch")), "i-slider--disabled" to _pS(_uM("opacity" to 0.55)), "i-slider__line" to _pS(_uM("flexGrow" to 1, "flexShrink" to 1, "flexBasis" to "0%")), "i-slider__native" to _pS(_uM("width" to "100%")), "i-slider__range" to _pS(_uM("position" to "relative", "flexGrow" to 1, "flexShrink" to 1, "flexBasis" to "0%", "height" to 64)), "i-slider__range-rail" to _pS(_uM("position" to "absolute", "top" to 20, "left" to 0, "right" to 0)), "i-slider__range-track" to _pS(_uM("position" to "absolute", "top" to 20, "left" to 0)), "i-slider__thumb" to _pS(_uM("position" to "absolute", "top" to 10, "zIndex" to 3, "alignItems" to "center", "justifyContent" to "center", "boxShadow" to "0 2px 8px rgba(31, 45, 61, 0.16)")), "i-slider__value" to _pS(_uM("minWidth" to 58, "marginLeft" to 8, "color" to "#606266", "fontSize" to 14, "lineHeight" to "22px", "textAlign" to "right")))
            }
        var inheritAttrs = true
        var inject: Map<String, Map<String, Any?>> = _uM()
        var emits: Map<String, Any?> = _uM("update:modelValue" to null, "update:value" to null, "change" to null, "changing" to null, "dragStart" to null, "dragEnd" to null)
        var props = _nP(_uM("modelValue" to _uM("type" to _uA(
            "Number",
            "String",
            "Array"
        ), "default" to 0), "value" to _uM("type" to _uA(
            "Number",
            "String",
            "Array"
        ), "default" to 0), "min" to _uM("type" to "Number", "default" to 0), "max" to _uM("type" to "Number", "default" to 100), "step" to _uM("type" to "Number", "default" to 1), "range" to _uM("type" to "Boolean", "default" to false), "disabled" to _uM("type" to "Boolean", "default" to false), "readonly" to _uM("type" to "Boolean", "default" to false), "noCross" to _uM("type" to "Boolean", "default" to false), "vertical" to _uM("type" to "Boolean", "default" to false), "size" to _uM("type" to "String", "default" to "24px"), "railColor" to _uM("type" to "String", "default" to "rgba(0, 0, 0, 0.1)"), "railRadius" to _uM("type" to "String", "default" to "2px"), "railSize" to _uM("type" to "String", "default" to "4px"), "trackColor" to _uM("type" to "String", "default" to "#1677ff"), "thumbSize" to _uM("type" to "String", "default" to "20px"), "thumbColor" to _uM("type" to "String", "default" to "#ffffff"), "thumbBorder" to _uM("type" to "String", "default" to "3px solid #1677ff"), "thumbRadius" to _uM("type" to "String", "default" to "50%"), "showValue" to _uM("type" to "Boolean", "default" to false)))
        var propsNeedCastKeys = _uA(
            "modelValue",
            "value",
            "min",
            "max",
            "step",
            "range",
            "disabled",
            "readonly",
            "noCross",
            "vertical",
            "size",
            "railColor",
            "railRadius",
            "railSize",
            "trackColor",
            "thumbSize",
            "thumbColor",
            "thumbBorder",
            "thumbRadius",
            "showValue"
        )
        var components: Map<String, CreateVueComponent> = _uM()
    }
}
