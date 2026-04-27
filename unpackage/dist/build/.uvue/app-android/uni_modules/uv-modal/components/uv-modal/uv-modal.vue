import mpMixin from '@/uni_modules/uv-ui-tools/libs/mixin/mpMixin.js';
import mixin from '@/uni_modules/uv-ui-tools/libs/mixin/mixin.js';
import props from './props.js';
/**
 * Modal 模态框
 * @description 弹出模态框，常用于消息提示、消息确认、在当前页面内完成特定的交互操作。
 * @tutorial https://www.uvui.cn/components/modul.html
 * @property {String}			title				标题内容
 * @property {String}			content				模态框内容，如传入slot内容，则此参数无效
 * @property {String}			confirmText			确认按钮的文字 （默认 '确认' ）
 * @property {String}			cancelText			取消按钮的文字 （默认 '取消' ）
 * @property {Boolean}			showConfirmButton	是否显示确认按钮 （默认 true ）
 * @property {Boolean}			showCancelButton	是否显示取消按钮 （默认 false ）
 * @property {String}			confirmColor		确认按钮的颜色 （默认 '#2979ff' ）
 * @property {String}			cancelColor			取消按钮的颜色 （默认 '#606266' ）
 * @property {Boolean}			buttonReverse		对调确认和取消的位置 （默认 false ）
 * @property {Boolean}			zoom				是否开启缩放模式 （默认 true ）
 * @property {Boolean}			asyncClose			是否异步关闭，只对确定按钮有效，见上方说明 （默认 false ）
 * @property {Boolean}			closeOnClickOverlay	是否允许点击遮罩关闭该组件 （默认 true ）
 * @property {String | Number}	negativeTop			往上偏移的值，给一个负的margin-top，往上偏移，避免和键盘重合的情况，单位任意，数值则默认为px单位 （默认 0 ）
 * @property {String | Number}	width				modal宽度，不支持百分比，可以数值，px，rpx单位 （默认 '650rpx' ）
 * @property {String} align 文本对齐方式 （默认'left'）
 * @property {String | Object} textStyle 文本扩展样式
 * @event {Function} confirm	点击确认按钮时触发
 * @event {Function} cancel		点击取消按钮时触发
 * @event {Function} close		点击遮罩关闭出发，closeOnClickOverlay为true有效
 * @example <uv-modal ref="modalPopup" title="title" content="content"></uv-modal>
 */
const __sfc__ = defineComponent({
    name: 'uv-modal',
    mixins: [mpMixin, mixin, props],
    data() {
        return {
            loading: false
        };
    },
    computed: {
        nvueStyle(): UTSJSONObject {
            const style = {} as UTSJSONObject;
            // 避免nvue中不能换行的问题
            return style;
        }
    },
    methods: {
        open() {
            this.$refs.modalPopup.open();
            if (this.loading)
                this.loading = false;
        },
        close() {
            this.$refs.modalPopup.close();
        },
        popupChange(e) {
            if (!e.show)
                this.$emit('close');
        },
        // 点击确定按钮
        confirmHandler() {
            if (!this.loading) {
                this.$emit('confirm');
            }
            // 如果配置了异步关闭，将按钮值为loading状态
            if (this.asyncClose) {
                this.loading = true;
            }
            else {
                this.close();
            }
        },
        // 点击取消按钮
        cancelHandler() {
            this.$emit('cancel');
            this.close();
        },
        closeLoading() {
            this.$nextTick(() => {
                this.loading = false;
            });
        }
    }
});
export default __sfc__;
function GenUniModulesUvModalComponentsUvModalUvModalRender(this: InstanceType<typeof __sfc__>): any | null {
    const _ctx = this;
    const _cache = this.$.renderCache;
    const _component_uv_line = resolveEasyComponent("uv-line", _easycom_uv_line);
    const _component_uv_loading_icon = resolveEasyComponent("uv-loading-icon", _easycom_uv_loading_icon);
    const _component_uv_popup = resolveEasyComponent("uv-popup", _easycom_uv_popup);
    return _cV(_component_uv_popup, _uM({
        ref: "modalPopup",
        mode: "center",
        zoom: _ctx.zoom,
        zIndex: _ctx.zIndex,
        customStyle: {
            borderRadius: '6px',
            overflow: 'hidden',
            marginTop: `-${_ctx.$uv.addUnit(_ctx.negativeTop)}`
        },
        closeOnClickOverlay: _ctx.closeOnClickOverlay,
        safeAreaInsetBottom: false,
        duration: 400,
        onChange: _ctx.popupChange
    }), _uM({
        default: withSlotCtx((): any[] => [
            _cE("view", _uM({
                class: "uv-modal",
                style: _nS(_uM({
                    width: _ctx.$uv.addUnit(_ctx.width),
                }))
            }), [
                isTrue(_ctx.title)
                    ? _cE("text", _uM({
                        key: 0,
                        class: "uv-modal__title"
                    }), _tD(_ctx.title), 1 /* TEXT */)
                    : _cC("v-if", true),
                _cE("view", _uM({
                    class: "uv-modal__content",
                    style: _nS(_uM({
                        paddingTop: `${_ctx.title ? 12 : 25}px`
                    }))
                }), [
                    renderSlot(_ctx.$slots, "default", {}, (): any[] => [
                        _cE("text", _uM({
                            class: "uv-modal__content__text",
                            style: _nS([
                                _uM({
                                    textAlign: _ctx.align
                                }),
                                _ctx.nvueStyle,
                                _ctx.$uv.addStyle(_ctx.textStyle)
                            ])
                        }), _tD(_ctx.content), 5 /* TEXT, STYLE */)
                    ])
                ], 4 /* STYLE */),
                renderSlot(_ctx.$slots, "confirmButton", {}, (): any[] => [
                    _cV(_component_uv_line),
                    isTrue(_ctx.showConfirmButton || _ctx.showCancelButton)
                        ? _cE("view", _uM({
                            key: 0,
                            class: "uv-modal__button-group",
                            style: _nS(_uM({
                                flexDirection: _ctx.buttonReverse ? 'row-reverse' : 'row'
                            }))
                        }), [
                            isTrue(_ctx.showCancelButton)
                                ? _cE("view", _uM({
                                    key: 0,
                                    class: _nC(["uv-modal__button-group__wrapper uv-modal__button-group__wrapper--cancel", [_ctx.showCancelButton && !_ctx.showConfirmButton && 'uv-modal__button-group__wrapper--only-cancel']]),
                                    "hover-stay-time": 150,
                                    "hover-class": "uv-modal__button-group__wrapper--hover",
                                    onClick: _ctx.cancelHandler
                                }), [
                                    _cE("text", _uM({
                                        class: "uv-modal__button-group__wrapper__text",
                                        style: _nS(_uM({
                                            color: _ctx.cancelColor
                                        }))
                                    }), _tD(_ctx.cancelText), 5 /* TEXT, STYLE */)
                                ], 10 /* CLASS, PROPS */, ["onClick"])
                                : _cC("v-if", true),
                            isTrue(_ctx.showConfirmButton && _ctx.showCancelButton)
                                ? _cV(_component_uv_line, _uM({
                                    key: 1,
                                    direction: "column"
                                }))
                                : _cC("v-if", true),
                            isTrue(_ctx.showConfirmButton)
                                ? _cE("view", _uM({
                                    key: 2,
                                    class: _nC(["uv-modal__button-group__wrapper uv-modal__button-group__wrapper--confirm", [!_ctx.showCancelButton && _ctx.showConfirmButton && 'uv-modal__button-group__wrapper--only-confirm']]),
                                    "hover-stay-time": 150,
                                    "hover-class": "uv-modal__button-group__wrapper--hover",
                                    onClick: _ctx.confirmHandler
                                }), [
                                    isTrue(_ctx.loading)
                                        ? _cV(_component_uv_loading_icon, _uM({ key: 0 }))
                                        : _cE("text", _uM({
                                            key: 1,
                                            class: "uv-modal__button-group__wrapper__text",
                                            style: _nS(_uM({
                                                color: _ctx.confirmColor
                                            }))
                                        }), _tD(_ctx.confirmText), 5 /* TEXT, STYLE */)
                                ], 10 /* CLASS, PROPS */, ["onClick"])
                                : _cC("v-if", true)
                        ], 4 /* STYLE */)
                        : _cC("v-if", true)
                ])
            ], 4 /* STYLE */)
        ]),
        _: 3 /* FORWARDED */
    }), 8 /* PROPS */, ["zoom", "zIndex", "customStyle", "closeOnClickOverlay", "onChange"]);
}
export type UvModalComponentPublicInstance = InstanceType<typeof __sfc__>;
const GenUniModulesUvModalComponentsUvModalUvModalStyles = [_uM([["uv-modal", _pS(_uM([["width", "650rpx"], ["borderTopLeftRadius", 6], ["borderTopRightRadius", 6], ["borderBottomRightRadius", 6], ["borderBottomLeftRadius", 6], ["overflow", "hidden"]]))], ["uv-modal__title", _pS(_uM([["fontSize", 16], ["fontWeight", "bold"], ["color", "#606266"], ["textAlign", "center"], ["paddingTop", 25]]))], ["uv-modal__content", _pS(_uM([["paddingTop", 12], ["paddingRight", 25], ["paddingBottom", 25], ["paddingLeft", 25], ["display", "flex"], ["flexDirection", "row"], ["justifyContent", "center"]]))], ["uv-modal__content__text", _pS(_uM([["lineHeight", "48rpx"], ["fontSize", 15], ["color", "#606266"], ["flexGrow", 1], ["flexShrink", 1], ["flexBasis", "0%"]]))], ["uv-modal__button-group", _pS(_uM([["display", "flex"], ["flexDirection", "row"], ["height", 48]]))], ["uv-modal__button-group__wrapper", _pS(_uM([["flexGrow", 1], ["flexShrink", 1], ["flexBasis", "0%"], ["display", "flex"], ["flexDirection", "row"], ["justifyContent", "center"], ["alignItems", "center"], ["height", 48]]))], ["uv-modal__button-group__wrapper--confirm", _pS(_uM([["borderBottomRightRadius", 6]]))], ["uv-modal__button-group__wrapper--only-cancel", _pS(_uM([["borderBottomRightRadius", 6]]))], ["uv-modal__button-group__wrapper--cancel", _pS(_uM([["borderBottomLeftRadius", 6]]))], ["uv-modal__button-group__wrapper--only-confirm", _pS(_uM([["borderBottomLeftRadius", 6]]))], ["uv-modal__button-group__wrapper--hover", _pS(_uM([["backgroundColor", "#f3f4f6"]]))], ["uv-modal__button-group__wrapper__text", _pS(_uM([["color", "#606266"], ["fontSize", 16], ["textAlign", "center"]]))]])];
import _easycom_uv_line from '@/uni_modules/uv-line/components/uv-line/uv-line.vue';
import _easycom_uv_loading_icon from '@/uni_modules/uv-loading-icon/components/uv-loading-icon/uv-loading-icon.vue';
import _easycom_uv_popup from '@/uni_modules/uv-popup/components/uv-popup/uv-popup.vue';
