import mpMixin from '@/uni_modules/uv-ui-tools/libs/mixin/mpMixin.js';
import mixin from '@/uni_modules/uv-ui-tools/libs/mixin/mixin.js';
/**
* PopUp 弹出层
* @description 弹出层组件，为了解决遮罩弹层的问题
* @tutorial https://www.uvui.cn/components/popup.html
* @property {String} mode = [top|center|bottom|left|right] 弹出方式
* 	@value top 顶部弹出
* 	@value center 中间弹出
* 	@value bottom 底部弹出
* 	@value left		左侧弹出
* 	@value right  右侧弹出
* @property {Number} duration 动画时长，默认300
* @property {Boolean} overlay 是否显示遮罩，默认true
* @property {Boolean} overlayOpacity 遮罩透明度，默认0.5
* @property {Object} overlayStyle 遮罩自定义样式
* @property {Boolean} closeOnClickOverlay = [true|false] 蒙版点击是否关闭弹窗，默认true
* @property {Number | String} zIndex 弹出层的层级
* @property {Boolean} safeAreaInsetTop 是否留出顶部安全区（状态栏高度），默认false
* @property {Boolean} safeAreaInsetBottom 是否为留出底部安全区适配，默认true
* @property {Boolean} closeable 是否显示关闭图标，默认false
* @property {Boolean} closeIconPos 自定义关闭图标位置，`top-left`-左上角，`top-right`-右上角，`bottom-left`-左下角，`bottom-right`-右下角，默认top-right
* @property {String}  bgColor 主窗口背景色
* @property {String}  maskBackgroundColor 蒙版颜色
* @property {Boolean} customStyle 自定义样式
* @event {Function} change 打开关闭弹窗触发，e={show: false}
* @event {Function} maskClick 点击遮罩触发
*/
const __sfc__ = defineComponent({
    name: 'uv-popup',
    components: {},
    mixins: [mpMixin, mixin],
    emits: ['change', 'maskClick'],
    props: {
        // 弹出层类型，可选值，top: 顶部弹出层；bottom：底部弹出层；center：全屏弹出层
        // message: 消息提示 ; dialog : 对话框
        mode: {
            type: String,
            default: 'center'
        },
        // 动画时长，单位ms
        duration: {
            type: [String, Number],
            default: 300
        },
        // 层级
        zIndex: {
            type: [String, Number],
            default: 10075
        },
        bgColor: {
            type: String,
            default: '#ffffff'
        },
        safeArea: {
            type: Boolean,
            default: true
        },
        // 是否显示遮罩
        overlay: {
            type: Boolean,
            default: true
        },
        // 点击遮罩是否关闭弹窗
        closeOnClickOverlay: {
            type: Boolean,
            default: true
        },
        // 遮罩的透明度，0-1之间
        overlayOpacity: {
            type: [Number, String],
            default: 0.4
        },
        // 自定义遮罩的样式
        overlayStyle: {
            type: [Object, String],
            default: ''
        },
        // 是否为iPhoneX留出底部安全距离
        safeAreaInsetBottom: {
            type: Boolean,
            default: true
        },
        // 是否留出顶部安全距离（状态栏高度）
        safeAreaInsetTop: {
            type: Boolean,
            default: false
        },
        // 是否显示关闭图标
        closeable: {
            type: Boolean,
            default: false
        },
        // 自定义关闭图标位置，top-left为左上角，top-right为右上角，bottom-left为左下角，bottom-right为右下角
        closeIconPos: {
            type: String,
            default: 'top-right'
        },
        // mode=center，也即中部弹出时，是否使用缩放模式
        zoom: {
            type: Boolean,
            default: true
        },
        round: {
            type: [Number, String],
            default: 0
        },
        ...uni.$uv?.props?.popup
    },
    watch: {
        /**
         * 监听type类型
         */
        type: {
            handler: function (type) {
                if (!this.config[type])
                    return;
                this[this.config[type]](true);
            },
            immediate: true
        },
        isDesktop: {
            handler: function (newVal) {
                if (!this.config[newVal])
                    return;
                this[this.config[this.mode]](true);
            },
            immediate: true
        },
        // H5 下禁止底部滚动
        showPopup(show) {
        }
    },
    data() {
        return {
            ani: [],
            showPopup: false,
            showTrans: false,
            popupWidth: 0,
            popupHeight: 0,
            config: {
                top: 'top',
                bottom: 'bottom',
                center: 'center',
                left: 'left',
                right: 'right',
                message: 'top',
                dialog: 'center',
                share: 'bottom'
            },
            transitionStyle: {
                position: 'fixed',
                left: 0,
                right: 0
            },
            maskShow: true,
            mkclick: true,
            popupClass: this.isDesktop ? 'fixforpc-top' : 'top',
            direction: ''
        };
    },
    computed: {
        isDesktop(): boolean {
            return this.popupWidth >= 500 && this.popupHeight >= 500;
        },
        bg(): string {
            if (this.bgColor === '' || this.bgColor === 'none' || this.$uv.getPx(this.round) > 0) {
                return 'transparent';
            }
            return this.bgColor;
        },
        contentStyle() {
            const style = { __$originalPosition: new UTSSourceMapPosition("style", "uni_modules/uv-popup/components/uv-popup/uv-popup.vue", 249, 11), } as UTSJSONObject;
            if (this.bgColor) {
                style["backgroundColor"] = this.bg;
            }
            if (this.round) {
                const value = this.$uv.addUnit(this.round);
                const mode = this.direction ? this.direction : this.mode;
                style["backgroundColor"] = this.bgColor;
                if (mode === 'top') {
                    style["borderBottomLeftRadius"] = value;
                    style["borderBottomRightRadius"] = value;
                }
                else if (mode === 'bottom') {
                    style["borderTopLeftRadius"] = value;
                    style["borderTopRightRadius"] = value;
                }
                else if (mode === 'center') {
                    style["borderRadius"] = value;
                }
            }
            return this.$uv.deepMerge(style, this.$uv.addStyle(this.customStyle));
        }
    },
    // TODO vue3
    unmounted() {
        this.setH5Visible();
    },
    created() {
        // TODO 处理 message 组件生命周期异常的问题
        this.messageChild = null;
        // TODO 解决头条冒泡的问题
        this.clearPropagation = false;
    },
    methods: {
        setH5Visible() {
        },
        /**
         * 公用方法，不显示遮罩层
         */
        closeMask() {
            this.maskShow = false;
        },
        // TODO nvue 取消冒泡
        clear(e) {
            e.stopPropagation();
            this.clearPropagation = true;
        },
        open(direction): any {
            // fix by mehaotian 处理快速打开关闭的情况
            if (this.showPopup) {
                return;
            }
            let innerType = ['top', 'center', 'bottom', 'left', 'right', 'message', 'dialog', 'share'];
            if (!(direction && innerType.indexOf(direction) !== -1)) {
                direction = this.mode;
            }
            else {
                this.direction = direction;
            }
            if (!this.config[direction]) {
                return this.$uv.error(`缺少类型：${direction}`);
            }
            this[this.config[direction]]();
            this.$emit('change', {
                show: true,
                type: direction
            });
        },
        close(type) {
            this.showTrans = false;
            this.$emit('change', {
                show: false,
                type: this.mode
            });
            clearTimeout(this.timer);
            // // 自定义关闭事件
            this.timer = setTimeout(() => {
                this.showPopup = false;
            }, 300);
        },
        // TODO 处理冒泡事件，头条的冒泡事件有问题 ，先这样兼容
        touchstart() {
            this.clearPropagation = false;
        },
        onTap() {
            if (this.clearPropagation) {
                // fix by mehaotian 兼容 nvue
                this.clearPropagation = false;
                return;
            }
            this.$emit('maskClick');
            if (!this.closeOnClickOverlay)
                return;
            this.close();
        },
        /**
         * 顶部弹出样式处理
         */
        top(type) {
            this.popupClass = this.isDesktop ? 'fixforpc-top' : 'top';
            this.ani = ['slide-top'];
            this.transitionStyle = {
                position: 'fixed',
                zIndex: this.zIndex,
                left: 0,
                right: 0,
                backgroundColor: this.bg
            };
            // TODO 兼容 type 属性 ，后续会废弃
            if (type)
                return;
            this.showPopup = true;
            this.showTrans = true;
            this.$nextTick(() => {
                if (this.messageChild && this.mode === 'message') {
                    this.messageChild.timerClose();
                }
            });
        },
        /**
         * 底部弹出样式处理
         */
        bottom(type) {
            this.popupClass = 'bottom';
            this.ani = ['slide-bottom'];
            this.transitionStyle = {
                position: 'fixed',
                zIndex: this.zIndex,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: this.bg
            };
            // TODO 兼容 type 属性 ，后续会废弃
            if (type)
                return;
            this.showPopup = true;
            this.showTrans = true;
        },
        /**
         * 中间弹出样式处理
         */
        center(type) {
            this.popupClass = 'center';
            this.ani = this.zoom ? ['zoom-in', 'fade'] : ['fade'];
            this.transitionStyle = {
                position: 'fixed',
                zIndex: this.zIndex,
                display: 'flex',
                flexDirection: 'column',
                bottom: 0,
                left: 0,
                right: 0,
                top: 0,
                justifyContent: 'center',
                alignItems: 'center'
            };
            // TODO 兼容 type 属性 ，后续会废弃
            if (type)
                return;
            this.showPopup = true;
            this.showTrans = true;
        },
        left(type) {
            this.popupClass = 'left';
            this.ani = ['slide-left'];
            this.transitionStyle = {
                position: 'fixed',
                zIndex: this.zIndex,
                left: 0,
                bottom: 0,
                top: 0,
                backgroundColor: this.bg,
                display: 'flex',
                flexDirection: 'column'
            };
            // TODO 兼容 type 属性 ，后续会废弃
            if (type)
                return;
            this.showPopup = true;
            this.showTrans = true;
        },
        right(type) {
            this.popupClass = 'right';
            this.ani = ['slide-right'];
            this.transitionStyle = {
                position: 'fixed',
                zIndex: this.zIndex,
                bottom: 0,
                right: 0,
                top: 0,
                backgroundColor: this.bg,
                display: 'flex',
                flexDirection: 'column'
            };
            // TODO 兼容 type 属性 ，后续会废弃
            if (type)
                return;
            this.showPopup = true;
            this.showTrans = true;
        }
    }
});
export default __sfc__;
function GenUniModulesUvPopupComponentsUvPopupUvPopupRender(this: InstanceType<typeof __sfc__>): any | null {
    const _ctx = this;
    const _cache = this.$.renderCache;
    const _component_uv_overlay = resolveEasyComponent("uv-overlay", _easycom_uv_overlay);
    const _component_uv_status_bar = resolveEasyComponent("uv-status-bar", _easycom_uv_status_bar);
    const _component_uv_safe_bottom = resolveEasyComponent("uv-safe-bottom", _easycom_uv_safe_bottom);
    const _component_uv_icon = resolveEasyComponent("uv-icon", _easycom_uv_icon);
    const _component_uv_transition = resolveEasyComponent("uv-transition", _easycom_uv_transition);
    return isTrue(_ctx.showPopup)
        ? _cE("view", _uM({
            key: 0,
            class: _nC(["uv-popup", [_ctx.popupClass, _ctx.isDesktop ? 'fixforpc-z-index' : '']]),
            style: _nS([_uM({ zIndex: _ctx.zIndex })])
        }), [
            _cE("view", _uM({ onTouchstart: _ctx.touchstart }), [
                isTrue(_ctx.maskShow && _ctx.overlay)
                    ? _cV(_component_uv_overlay, _uM({
                        key: "1",
                        show: _ctx.showTrans,
                        duration: _ctx.duration,
                        "custom-style": _ctx.overlayStyle,
                        opacity: _ctx.overlayOpacity,
                        zIndex: _ctx.zIndex,
                        onClick: _ctx.onTap
                    }), null, 8 /* PROPS */, ["show", "duration", "custom-style", "opacity", "zIndex", "onClick"])
                    : _cC("v-if", true),
                _cV(_component_uv_transition, _uM({
                    key: "2",
                    mode: _ctx.ani,
                    name: "content",
                    "custom-style": _ctx.transitionStyle,
                    duration: _ctx.duration,
                    show: _ctx.showTrans,
                    onClick: _ctx.onTap
                }), _uM({
                    default: withSlotCtx((): any[] => [
                        _cE("view", _uM({
                            class: _nC(["uv-popup__content", [_ctx.popupClass]]),
                            style: _nS([_ctx.contentStyle]),
                            onClick: _ctx.clear
                        }), [
                            isTrue(_ctx.safeAreaInsetTop)
                                ? _cV(_component_uv_status_bar, _uM({ key: 0 }))
                                : _cC("v-if", true),
                            renderSlot(_ctx.$slots, "default"),
                            isTrue(_ctx.safeAreaInsetBottom)
                                ? _cV(_component_uv_safe_bottom, _uM({ key: 1 }))
                                : _cC("v-if", true),
                            isTrue(_ctx.closeable)
                                ? _cE("view", _uM({
                                    key: 2,
                                    onClick: withModifiers(_ctx.close, ["stop"]),
                                    class: _nC(["uv-popup__content__close", ['uv-popup__content__close--' + _ctx.closeIconPos]]),
                                    "hover-class": "uv-popup__content__close--hover",
                                    "hover-stay-time": "150"
                                }), [
                                    _cV(_component_uv_icon, _uM({
                                        name: "close",
                                        color: "#909399",
                                        size: "18",
                                        bold: ""
                                    }))
                                ], 10 /* CLASS, PROPS */, ["onClick"])
                                : _cC("v-if", true)
                        ], 14 /* CLASS, STYLE, PROPS */, ["onClick"])
                    ]),
                    _: 3 /* FORWARDED */
                }), 8 /* PROPS */, ["mode", "custom-style", "duration", "show", "onClick"])
            ], 40 /* PROPS, NEED_HYDRATION */, ["onTouchstart"])
        ], 6 /* CLASS, STYLE */)
        : _cC("v-if", true);
}
export type UvPopupComponentPublicInstance = InstanceType<typeof __sfc__>;
const GenUniModulesUvPopupComponentsUvPopupUvPopupStyles = [_uM([["uv-popup", _uM([["", _uM([["position", "fixed"], ["zIndex", 99]])], [".top", _uM([["top", 0]])], [".left", _uM([["top", 0]])], [".right", _uM([["top", 0]])]])], ["uv-popup__content", _uM([[".uv-popup ", _uM([["overflow", "hidden"], ["position", "relative"]])], [".uv-popup .left", _uM([["paddingTop", 0], ["flexGrow", 1], ["flexShrink", 1], ["flexBasis", "0%"]])], [".uv-popup .right", _uM([["paddingTop", 0], ["flexGrow", 1], ["flexShrink", 1], ["flexBasis", "0%"]])]])], ["uv-popup__content__close", _uM([[".uv-popup ", _uM([["position", "absolute"]])]])], ["uv-popup__content__close--hover", _uM([[".uv-popup ", _uM([["opacity", 0.4]])]])], ["uv-popup__content__close--top-left", _uM([[".uv-popup ", _uM([["top", 15], ["left", 15]])]])], ["uv-popup__content__close--top-right", _uM([[".uv-popup ", _uM([["top", 15], ["right", 15]])]])], ["uv-popup__content__close--bottom-left", _uM([[".uv-popup ", _uM([["bottom", 15], ["left", 15]])]])], ["uv-popup__content__close--bottom-right", _uM([[".uv-popup ", _uM([["right", 15], ["bottom", 15]])]])], ["fixforpc-z-index", _pS(_uM([["zIndex", 999]]))], ["fixforpc-top", _pS(_uM([["top", 0]]))]])];
import _easycom_uv_overlay from '@/uni_modules/uv-overlay/components/uv-overlay/uv-overlay.vue';
import _easycom_uv_status_bar from '@/uni_modules/uv-status-bar/components/uv-status-bar/uv-status-bar.vue';
import _easycom_uv_safe_bottom from '@/uni_modules/uv-safe-bottom/components/uv-safe-bottom/uv-safe-bottom.vue';
import _easycom_uv_icon from '@/uni_modules/uv-icon/components/uv-icon/uv-icon.vue';
import _easycom_uv_transition from '@/uni_modules/uv-transition/components/uv-transition/uv-transition.vue';
//# sourceMappingURL=uv-popup.vue.map