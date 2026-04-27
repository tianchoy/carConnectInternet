import mpMixin from '@/uni_modules/uv-ui-tools/libs/mixin/mpMixin.js';
import mixin from '@/uni_modules/uv-ui-tools/libs/mixin/mixin.js';
import props from "./props.js";
/**
 * Input 输入框
 * @description  此组件为一个输入框，默认没有边框和样式，是专门为配合表单组件uv-form而设计的，利用它可以快速实现表单验证，输入内容，下拉选择等功能。
 * @tutorial https://www.uvui.cn/components/input.html
 * @property {String | Number}	value					输入的值
 * @property {String}			type					输入框类型，见上方说明 （ 默认 'text' ）
 * @property {Boolean}			fixed					如果 textarea 是在一个 position:fixed 的区域，需要显示指定属性 fixed 为 true，兼容性：微信小程序、百度小程序、字节跳动小程序、QQ小程序 （ 默认 false ）
 * @property {Boolean}			disabled				是否禁用输入框 （ 默认 false ）
 * @property {String}			disabledColor			禁用状态时的背景色（ 默认 '#f5f7fa' ）
 * @property {Boolean}			clearable				是否显示清除控件 （ 默认 false ）
 * @property {Boolean}			password				是否密码类型 （ 默认 false ）
 * @property {String | Number}	maxlength				最大输入长度，设置为 -1 的时候不限制最大长度 （ 默认 -1 ）
 * @property {String}			placeholder				输入框为空时的占位符
 * @property {String}			placeholderClass		指定placeholder的样式类，注意页面或组件的style中写了scoped时，需要在类名前写/deep/ （ 默认 'input-placeholder' ）
 * @property {String | Object}	placeholderStyle		指定placeholder的样式，字符串/对象形式，如"color: red;"
 * @property {Boolean}			showWordLimit			是否显示输入字数统计，只在 type ="text"或type ="textarea"时有效 （ 默认 false ）
 * @property {String}			confirmType				设置右下角按钮的文字，兼容性详见uni-app文档 （ 默认 'done' ）
 * @property {Boolean}			confirmHold				点击键盘右下角按钮时是否保持键盘不收起，H5无效 （ 默认 false ）
 * @property {Boolean}			holdKeyboard			focus时，点击页面的时候不收起键盘，微信小程序有效 （ 默认 false ）
 * @property {Boolean}			focus					自动获取焦点，在 H5 平台能否聚焦以及软键盘是否跟随弹出，取决于当前浏览器本身的实现。nvue 页面不支持，需使用组件的 focus()、blur() 方法控制焦点 （ 默认 false ）
 * @property {Boolean}			autoBlur				键盘收起时，是否自动失去焦点，目前仅App3.0.0+有效 （ 默认 false ）
 * @property {Boolean}			disableDefaultPadding	是否去掉 iOS 下的默认内边距，仅微信小程序，且type=textarea时有效 （ 默认 false ）
 * @property {String ｜ Number}	cursor					指定focus时光标的位置（ 默认 -1 ）
 * @property {String ｜ Number}	cursorSpacing			输入框聚焦时底部与键盘的距离 （ 默认 30 ）
 * @property {String ｜ Number}	selectionStart			光标起始位置，自动聚集时有效，需与selection-end搭配使用 （ 默认 -1 ）
 * @property {String ｜ Number}	selectionEnd			光标结束位置，自动聚集时有效，需与selection-start搭配使用 （ 默认 -1 ）
 * @property {Boolean}			adjustPosition			键盘弹起时，是否自动上推页面 （ 默认 true ）
 * @property {String}			inputAlign				输入框内容对齐方式（ 默认 'left' ）
 * @property {String | Number}	fontSize				输入框字体的大小 （ 默认 '15px' ）
 * @property {String}			color					输入框字体颜色	（ 默认 '#303133' ）
 * @property {Function}			formatter			    内容式化函数
 * @property {String}			prefixIcon				输入框前置图标
 * @property {String | Object}	prefixIconStyle			前置图标样式，对象或字符串
 * @property {String}			suffixIcon				输入框后置图标
 * @property {String | Object}	suffixIconStyle			后置图标样式，对象或字符串
 * @property {String}			border					边框类型，surround-四周边框，bottom-底部边框，none-无边框 （ 默认 'surround' ）
 * @property {Boolean}			readonly				是否只读，与disabled不同之处在于disabled会置灰组件，而readonly则不会 （ 默认 false ）
 * @property {String}			shape					输入框形状，circle-圆形，square-方形 （ 默认 'square' ）
 * @property {Object}			customStyle				定义需要用到的外部样式
 * @property {Boolean}			ignoreCompositionEvent	是否忽略组件内对文本合成系统事件的处理。
 * @example <uv-input v-model="value" :password="true" suffix-icon="lock-fill" />
 */
const __sfc__ = defineComponent({
    name: "uv-input",
    mixins: [mpMixin, mixin, props],
    data() {
        return {
            // 输入框的值
            innerValue: "",
            // 是否处于获得焦点状态
            focused: false,
            // 过滤处理方法
            innerFormatter: (value): any => value
        };
    },
    created() {
        this.innerValue = this.modelValue;
    },
    watch: {
        value(newVal) {
            this.innerValue = newVal;
        },
        modelValue(newVal) {
            this.innerValue = newVal;
        }
    },
    computed: {
        // 是否显示清除控件
        isShowClear(): boolean {
            const { clearable, readonly, focused, innerValue } = this;
            return !!clearable && !readonly && !!focused && innerValue !== "";
        },
        // 组件的类名
        inputClass(): string {
            let classes = [], { border, disabled, shape } = this;
            border === "surround" &&
                (classes = classes.concat(["uv-border", "uv-input--radius"]));
            classes.push(`uv-input--${shape}`);
            border === "bottom" &&
                (classes = classes.concat([
                    "uv-border-bottom",
                    "uv-input--no-radius",
                ]));
            return classes.join(" ");
        },
        // 组件的样式
        wrapperStyle() {
            const style = {} as UTSJSONObject;
            // 禁用状态下，被背景色加上对应的样式
            if (this.disabled) {
                style["backgroundColor"] = this.disabledColor;
            }
            // 无边框时，去除内边距
            if (this.border === "none") {
                style["padding"] = "0";
            }
            else {
                // 由于uni-app的iOS开发者能力有限，导致需要分开写才有效
                style["paddingTop"] = "6px";
                style["paddingBottom"] = "6px";
                style["paddingLeft"] = "9px";
                style["paddingRight"] = "9px";
            }
            return this.$uv.deepMerge(style, this.$uv.addStyle(this.customStyle));
        },
        // 输入框的样式
        inputStyle(): UTSJSONObject {
            const style = {
                color: this.color,
                fontSize: this.$uv.addUnit(this.fontSize),
                textAlign: this.inputAlign
            } as UTSJSONObject;
            if (this.disabled || this.readonly) {
                style['pointer-events'] = 'none';
            }
            return style;
        }
    },
    methods: {
        // 在微信小程序中，不支持将函数当做props参数，故只能通过ref形式调用
        setFormatter(e) {
            this.innerFormatter = e;
        },
        // 当键盘输入时，触发input事件
        onInput(e) {
            let { value = "" } = e.detail || {};
            // 格式化过滤方法
            const formatter = this.formatter || this.innerFormatter;
            const formatValue = formatter(value);
            // 为了避免props的单向数据流特性，需要先将innerValue值设置为当前值，再在$nextTick中重新赋予设置后的值才有效
            this.innerValue = value;
            this.$nextTick(() => {
                this.innerValue = formatValue;
                this.valueChange();
            });
        },
        // 输入框失去焦点时触发
        onBlur(event) {
            this.$emit("blur", event.detail.value);
            // H5端的blur会先于点击清除控件的点击click事件触发，导致focused
            // 瞬间为false，从而隐藏了清除控件而无法被点击到
            this.$uv.sleep(100).then(() => {
                this.focused = false;
            });
            // 尝试调用uv-form的验证方法
            this.$uv.formValidate(this, "blur");
        },
        // 输入框聚焦时触发
        onFocus(event) {
            this.focused = true;
            this.$emit("focus");
        },
        // 点击完成按钮时触发
        onConfirm(event) {
            this.$emit("confirm", this.innerValue);
        },
        // 键盘高度发生变化的时候触发此事件
        // 兼容性：微信小程序2.7.0+、App 3.1.0+
        onkeyboardheightchange(e) {
            this.$emit("keyboardheightchange", e);
        },
        // 内容发生变化，进行处理
        valueChange() {
            if (this.isClear)
                this.innerValue = '';
            const value = this.innerValue;
            this.$nextTick(() => {
                this.$emit("input", value);
                this.$emit("update:modelValue", value);
                this.$emit("change", value);
                // 尝试调用uv-form的验证方法
                this.$uv.formValidate(this, "change");
            });
        },
        // 点击清除控件
        onClear() {
            this.innerValue = "";
            this.isClear = true;
            this.$uv.sleep(200).then(res => {
                this.isClear = false;
            });
            this.$nextTick(() => {
                this.$emit("clear");
                this.valueChange();
            });
        },
        /**
         * 在安卓nvue上，事件无法冒泡
         * 在某些时间，我们希望监听uv-from-item的点击事件，此时会导致点击uv-form-item内的uv-input后
         * 无法触发uv-form-item的点击事件，这里通过手动调用uv-form-item的方法进行触发
         */
        clickHandler() {
        }
    }
});
export default __sfc__;
function GenUniModulesUvInputComponentsUvInputUvInputRender(this: InstanceType<typeof __sfc__>): any | null {
    const _ctx = this;
    const _cache = this.$.renderCache;
    const _component_uv_icon = resolveEasyComponent("uv-icon", _easycom_uv_icon);
    return _cE("view", _uM({
        class: _nC(["uv-input", _ctx.inputClass]),
        style: _nS([_ctx.wrapperStyle])
    }), [
        _cE("view", _uM({ class: "uv-input__content" }), [
            _cE("view", _uM({ class: "uv-input__content__prefix-icon" }), [
                renderSlot(_ctx.$slots, "prefix", {}, (): any[] => [
                    isTrue(_ctx.prefixIcon)
                        ? _cV(_component_uv_icon, _uM({
                            key: 0,
                            name: _ctx.prefixIcon,
                            size: "18",
                            customStyle: _ctx.prefixIconStyle
                        }), null, 8 /* PROPS */, ["name", "customStyle"])
                        : _cC("v-if", true)
                ])
            ]),
            _cE("view", _uM({
                class: "uv-input__content__field-wrapper",
                onClick: _ctx.clickHandler
            }), [
                _cE("input", _uM({
                    class: "uv-input__content__field-wrapper__field",
                    style: _nS([_ctx.inputStyle]),
                    type: _ctx.type,
                    focus: _ctx.focus,
                    cursor: _ctx.cursor,
                    value: _ctx.innerValue,
                    "auto-blur": _ctx.autoBlur,
                    disabled: _ctx.disabled || _ctx.readonly,
                    maxlength: _ctx.maxlength,
                    placeholder: _ctx.placeholder,
                    "placeholder-style": _ctx.placeholderStyle,
                    "placeholder-class": _ctx.placeholderClass,
                    "confirm-type": _ctx.confirmType,
                    "confirm-hold": _ctx.confirmHold,
                    "hold-keyboard": _ctx.holdKeyboard,
                    "cursor-spacing": _ctx.cursorSpacing,
                    "adjust-position": _ctx.adjustPosition,
                    "selection-end": _ctx.selectionEnd,
                    "selection-start": _ctx.selectionStart,
                    password: _ctx.password || _ctx.type === 'password' || undefined,
                    ignoreCompositionEvent: _ctx.ignoreCompositionEvent,
                    onInput: _ctx.onInput,
                    onBlur: _ctx.onBlur,
                    onFocus: _ctx.onFocus,
                    onConfirm: _ctx.onConfirm,
                    onKeyboardheightchange: _ctx.onkeyboardheightchange
                }), null, 44 /* STYLE, PROPS, NEED_HYDRATION */, ["type", "focus", "cursor", "value", "auto-blur", "disabled", "maxlength", "placeholder", "placeholder-style", "placeholder-class", "confirm-type", "confirm-hold", "hold-keyboard", "cursor-spacing", "adjust-position", "selection-end", "selection-start", "password", "ignoreCompositionEvent", "onInput", "onBlur", "onFocus", "onConfirm", "onKeyboardheightchange"])
            ], 8 /* PROPS */, ["onClick"]),
            isTrue(_ctx.isShowClear)
                ? _cE("view", _uM({
                    key: 0,
                    class: "uv-input__content__clear",
                    onClick: _ctx.onClear
                }), [
                    _cV(_component_uv_icon, _uM({
                        name: "close",
                        size: "11",
                        color: "#ffffff",
                        customStyle: "line-height: 12px"
                    }))
                ], 8 /* PROPS */, ["onClick"])
                : _cC("v-if", true),
            _cE("view", _uM({ class: "uv-input__content__subfix-icon" }), [
                renderSlot(_ctx.$slots, "suffix", {}, (): any[] => [
                    isTrue(_ctx.suffixIcon)
                        ? _cV(_component_uv_icon, _uM({
                            key: 0,
                            name: _ctx.suffixIcon,
                            size: "18",
                            customStyle: _ctx.suffixIconStyle
                        }), null, 8 /* PROPS */, ["name", "customStyle"])
                        : _cC("v-if", true)
                ])
            ])
        ])
    ], 6 /* CLASS, STYLE */);
}
export type UvInputComponentPublicInstance = InstanceType<typeof __sfc__>;
const GenUniModulesUvInputComponentsUvInputUvInputStyles = [_uM([["uv-border", _pS(_uM([["!borderTopWidth", 0.5], ["!borderRightWidth", 0.5], ["!borderBottomWidth", 0.5], ["!borderLeftWidth", 0.5], ["!borderTopColor", "#dadbde"], ["!borderRightColor", "#dadbde"], ["!borderBottomColor", "#dadbde"], ["!borderLeftColor", "#dadbde"], ["borderTopStyle", "solid"], ["borderRightStyle", "solid"], ["borderBottomStyle", "solid"], ["borderLeftStyle", "solid"]]))], ["uv-border-bottom", _pS(_uM([["!borderBottomWidth", 0.5], ["!borderTopColor", "#dadbde"], ["!borderRightColor", "#dadbde"], ["!borderBottomColor", "#dadbde"], ["!borderLeftColor", "#dadbde"], ["borderBottomStyle", "solid"]]))], ["uv-input", _pS(_uM([["display", "flex"], ["flexDirection", "row"], ["alignItems", "center"], ["justifyContent", "space-between"], ["flexGrow", 1], ["flexShrink", 1], ["flexBasis", "0%"]]))], ["uv-input--radius", _pS(_uM([["borderTopLeftRadius", 4], ["borderTopRightRadius", 4], ["borderBottomRightRadius", 4], ["borderBottomLeftRadius", 4]]))], ["uv-input--square", _pS(_uM([["borderTopLeftRadius", 4], ["borderTopRightRadius", 4], ["borderBottomRightRadius", 4], ["borderBottomLeftRadius", 4]]))], ["uv-input--no-radius", _pS(_uM([["borderTopLeftRadius", 0], ["borderTopRightRadius", 0], ["borderBottomRightRadius", 0], ["borderBottomLeftRadius", 0]]))], ["uv-input--circle", _pS(_uM([["borderTopLeftRadius", 100], ["borderTopRightRadius", 100], ["borderBottomRightRadius", 100], ["borderBottomLeftRadius", 100]]))], ["uv-input__content", _pS(_uM([["flexGrow", 1], ["flexShrink", 1], ["flexBasis", "0%"], ["display", "flex"], ["flexDirection", "row"], ["alignItems", "center"], ["justifyContent", "space-between"]]))], ["uv-input__content__field-wrapper", _pS(_uM([["position", "relative"], ["display", "flex"], ["flexDirection", "row"], ["marginTop", 0], ["marginRight", 0], ["marginBottom", 0], ["marginLeft", 0], ["flexGrow", 1], ["flexShrink", 1], ["flexBasis", "0%"]]))], ["uv-input__content__field-wrapper__field", _pS(_uM([["lineHeight", "26px"], ["textAlign", "left"], ["color", "#303133"], ["height", 24], ["fontSize", 15], ["flexGrow", 1], ["flexShrink", 1], ["flexBasis", "0%"]]))], ["uv-input__content__clear", _pS(_uM([["width", 20], ["height", 20], ["borderTopLeftRadius", 100], ["borderTopRightRadius", 100], ["borderBottomRightRadius", 100], ["borderBottomLeftRadius", 100], ["backgroundColor", "#c6c7cb"], ["display", "flex"], ["flexDirection", "row"], ["alignItems", "center"], ["justifyContent", "center"], ["transform", "scale(0.82)"], ["marginLeft", 15]]))], ["uv-input__content__subfix-icon", _pS(_uM([["marginLeft", 4]]))], ["uv-input__content__prefix-icon", _pS(_uM([["marginRight", 4]]))]])];
import _easycom_uv_icon from '@/uni_modules/uv-icon/components/uv-icon/uv-icon.vue';
