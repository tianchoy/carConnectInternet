import mpMixin from '@/uni_modules/uv-ui-tools/libs/mixin/mpMixin.js';
import mixin from '@/uni_modules/uv-ui-tools/libs/mixin/mixin.js';
import props from './props.js';
/**
 * Form 表单
 * @description 此组件一般用于表单场景，可以配置Input输入框，Select弹出框，进行表单验证等。
 * @tutorial https://www.uvui.cn/components/form.html
 * @property {String}			label			input的label提示语
 * @property {String}			prop			绑定的值
 * @property {String | Boolean}	borderBottom	是否显示表单域的下划线边框
 * @property {String | Number}	labelWidth		label的宽度，单位px
 * @property {String}			rightIcon		右侧图标
 * @property {String}			leftIcon		左侧图标
 * @property {String | Object} leftIconStyle 左侧图标的样式
 * @property {Boolean}			required		是否显示左边的必填星号，只作显示用，具体校验必填的逻辑，请在rules中配置 (默认 false )
 *
 * @example <uv-form-item label="姓名" prop="userInfo.name" borderBottom ref="item1"></uv-form-item>
 */
const __sfc__ = defineComponent({
    name: 'uv-form-item',
    emits: ['click'],
    mixins: [mpMixin, mixin, props],
    data() {
        return {
            // 错误提示语
            message: '',
            parentData: {
                // 提示文本的位置
                labelPosition: 'left',
                // 提示文本对齐方式
                labelAlign: 'left',
                // 提示文本的样式
                labelStyle: {},
                // 提示文本的宽度
                labelWidth: 45,
                // 错误提示方式
                errorType: 'message'
            }
        };
    },
    created() {
        this.init();
    },
    methods: {
        init() {
            // 父组件的实例
            this.updateParentData();
            if (!this.parent) {
                this.$uv.error('uv-form-item需要结合uv-form组件使用');
            }
        },
        // 获取父组件的参数
        updateParentData() {
            // 此方法写在mixin中
            this.getParentData('uv-form');
        },
        // 移除uv-form-item的校验结果
        clearValidate() {
            this.message = null;
        },
        // 清空当前的组件的校验结果，并重置为初始值
        resetField() {
            // 找到原始值
            const value = this.$uv.getProperty(this.parent.originalModel, this.prop);
            // 将uv-form的model的prop属性链还原原始值
            this.$uv.setProperty(this.parent.model, this.prop, value);
            // 移除校验结果
            this.message = null;
        },
        // 点击组件
        clickHandler() {
            this.$emit('click');
        }
    }
});
export default __sfc__;
function GenUniModulesUvFormComponentsUvFormItemUvFormItemRender(this: InstanceType<typeof __sfc__>): any | null {
    const _ctx = this;
    const _cache = this.$.renderCache;
    const _component_uv_icon = resolveEasyComponent("uv-icon", _easycom_uv_icon);
    const _component_uv_transition = resolveEasyComponent("uv-transition", _easycom_uv_transition);
    const _component_uv_line = resolveEasyComponent("uv-line", _easycom_uv_line);
    return _cE("view", _uM({ class: "uv-form-item" }), [
        _cE("view", _uM({
            class: "uv-form-item__body",
            onClick: _ctx.clickHandler,
            style: _nS([_ctx.$uv.addStyle(_ctx.customStyle), _uM({
                    flexDirection: (_ctx.labelPosition || _ctx.parentData.labelPosition) === 'left' ? 'row' : 'column'
                })])
        }), [
            renderSlot(_ctx.$slots, "label", {}, (): any[] => [
                isTrue(_ctx.required || _ctx.leftIcon || _ctx.label)
                    ? _cE("view", _uM({
                        key: 0,
                        class: "uv-form-item__body__left",
                        style: _nS(_uM({
                            width: _ctx.$uv.addUnit(_ctx.labelWidth || _ctx.parentData.labelWidth),
                            marginBottom: _ctx.parentData.labelPosition === 'left' ? 0 : '5px',
                        }))
                    }), [
                        _cE("view", _uM({ class: "uv-form-item__body__left__content" }), [
                            isTrue(_ctx.required)
                                ? _cE("text", _uM({
                                    key: 0,
                                    class: "uv-form-item__body__left__content__required"
                                }), "*")
                                : _cC("v-if", true),
                            isTrue(_ctx.leftIcon)
                                ? _cE("view", _uM({
                                    key: 1,
                                    class: "uv-form-item__body__left__content__icon"
                                }), [
                                    _cV(_component_uv_icon, _uM({
                                        name: _ctx.leftIcon,
                                        "custom-style": _ctx.leftIconStyle
                                    }), null, 8 /* PROPS */, ["name", "custom-style"])
                                ])
                                : _cC("v-if", true),
                            _cE("text", _uM({
                                class: "uv-form-item__body__left__content__label",
                                style: _nS([_ctx.parentData.labelStyle, _uM({
                                        justifyContent: _ctx.parentData.labelAlign === 'left' ? 'flex-start' : _ctx.parentData.labelAlign === 'center' ? 'center' : 'flex-end'
                                    })])
                            }), _tD(_ctx.label), 5 /* TEXT, STYLE */)
                        ])
                    ], 4 /* STYLE */)
                    : _cC("v-if", true)
            ]),
            _cE("view", _uM({ class: "uv-form-item__body__right" }), [
                _cE("view", _uM({ class: "uv-form-item__body__right__content" }), [
                    _cE("view", _uM({ class: "uv-form-item__body__right__content__slot" }), [
                        renderSlot(_ctx.$slots, "default")
                    ]),
                    _cE("view", _uM({ class: "item__body__right__content__icon" }), [
                        renderSlot(_ctx.$slots, "right")
                    ])
                ])
            ])
        ], 12 /* STYLE, PROPS */, ["onClick"]),
        renderSlot(_ctx.$slots, "error", {}, (): any[] => [
            isTrue(!!_ctx.message && _ctx.parentData.errorType === 'message')
                ? _cV(_component_uv_transition, _uM({
                    key: 0,
                    show: true,
                    duration: 100,
                    mode: "fade"
                }), _uM({
                    default: withSlotCtx((): any[] => [
                        _cE("text", _uM({
                            class: "uv-form-item__body__right__message",
                            style: _nS(_uM({
                                marginLeft: _ctx.$uv.addUnit(_ctx.parentData.labelPosition === 'top' ? 0 : (_ctx.labelWidth || _ctx.parentData.labelWidth))
                            }))
                        }), _tD(_ctx.message), 5 /* TEXT, STYLE */)
                    ]),
                    _: 1 /* STABLE */
                }))
                : _cC("v-if", true)
        ]),
        isTrue(_ctx.borderBottom)
            ? _cV(_component_uv_line, _uM({
                key: 0,
                color: _ctx.message && _ctx.parentData.errorType === 'border-bottom' ? '#f56c6c' : '#d6d7d9'
            }), null, 8 /* PROPS */, ["color"])
            : _cC("v-if", true)
    ]);
}
export type UvFormItemComponentPublicInstance = InstanceType<typeof __sfc__>;
const GenUniModulesUvFormComponentsUvFormItemUvFormItemStyles = [_uM([["uv-form-item", _pS(_uM([["display", "flex"], ["flexDirection", "column"], ["fontSize", 14], ["color", "#303133"]]))], ["uv-form-item__body", _pS(_uM([["display", "flex"], ["flexDirection", "row"], ["paddingTop", 10], ["paddingRight", 0], ["paddingBottom", 10], ["paddingLeft", 0]]))], ["uv-form-item__body__left", _pS(_uM([["display", "flex"], ["flexDirection", "row"], ["alignItems", "center"]]))], ["uv-form-item__body__left__content", _pS(_uM([["position", "relative"], ["display", "flex"], ["flexDirection", "row"], ["alignItems", "center"], ["paddingRight", "10rpx"], ["flexGrow", 1], ["flexShrink", 1], ["flexBasis", "0%"]]))], ["uv-form-item__body__left__content__icon", _pS(_uM([["marginRight", "8rpx"]]))], ["uv-form-item__body__left__content__required", _pS(_uM([["position", "absolute"], ["left", -9], ["color", "#f56c6c"], ["lineHeight", "20px"], ["fontSize", 20], ["top", 3]]))], ["uv-form-item__body__left__content__label", _pS(_uM([["display", "flex"], ["flexDirection", "row"], ["alignItems", "center"], ["flexGrow", 1], ["flexShrink", 1], ["flexBasis", "0%"], ["color", "#303133"], ["fontSize", 15]]))], ["uv-form-item__body__right", _pS(_uM([["flexGrow", 1], ["flexShrink", 1], ["flexBasis", "0%"]]))], ["uv-form-item__body__right__content", _pS(_uM([["display", "flex"], ["flexDirection", "row"], ["alignItems", "center"], ["flexGrow", 1], ["flexShrink", 1], ["flexBasis", "0%"]]))], ["uv-form-item__body__right__content__slot", _pS(_uM([["flexGrow", 1], ["flexShrink", 1], ["flexBasis", "0%"], ["display", "flex"], ["flexDirection", "row"], ["alignItems", "center"]]))], ["uv-form-item__body__right__content__icon", _pS(_uM([["marginLeft", "10rpx"], ["color", "#c0c4cc"], ["fontSize", "30rpx"]]))], ["uv-form-item__body__right__message__box", _pS(_uM([["height", 16], ["lineHeight", "16px"]]))], ["uv-form-item__body__right__message", _pS(_uM([["marginTop", -6], ["lineHeight", "24px"], ["fontSize", 12], ["color", "#f56c6c"]]))]])];
import _easycom_uv_icon from '@/uni_modules/uv-icon/components/uv-icon/uv-icon.vue';
import _easycom_uv_transition from '@/uni_modules/uv-transition/components/uv-transition/uv-transition.vue';
import _easycom_uv_line from '@/uni_modules/uv-line/components/uv-line/uv-line.vue';
