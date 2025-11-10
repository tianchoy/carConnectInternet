import mpMixin from '@/uni_modules/uv-ui-tools/libs/mixin/mpMixin.js';
import mixin from '@/uni_modules/uv-ui-tools/libs/mixin/mixin.js';
import props from './props.js';
/**
 * switch 开关选择器
 * @description 选择开关一般用于只有两个选择，且只能选其一的场景。
 * @tutorial https://www.uvui.cn/components/switch.html
 * @property {Boolean}						loading			是否处于加载中（默认 false ）
 * @property {Boolean}						disabled		是否禁用（默认 false ）
 * @property {String | Number}				size			开关尺寸，单位px （默认 25 ）
 * @property {String}						activeColor		打开时的背景色 （默认 '#2979ff' ）
 * @property {String} 						inactiveColor	关闭时的背景色 （默认 '#ffffff' ）
 * @property {Boolean | String | Number}	value			通过v-model双向绑定的值 （默认 false ）
 * @property {Boolean | String | Number}	activeValue		打开选择器时通过change事件发出的值 （默认 true ）
 * @property {Boolean | String | Number}	inactiveValue	关闭选择器时通过change事件发出的值 （默认 false ）
 * @property {Boolean}						asyncChange		是否开启异步变更，开启后需要手动控制输入值 （默认 false ）
 * @property {String | Number}				space			圆点与外边框的距离 （默认 0 ）
 * @property {Object}						customStyle		定义需要用到的外部样式
 *
 * @event {Function} change 在switch打开或关闭时触发
 * @example <uv-switch v-model="checked" active-color="red" inactive-color="#eee"></uv-switch>
 */
const __sfc__ = defineComponent({
    name: "uv-switch",
    mixins: [mpMixin, mixin, props],
    data() {
        return {
            bgColor: '#ffffff',
            innerValue: false
        };
    },
    watch: {
        modelValue: {
            immediate: true,
            handler(newVal): any {
                if (newVal !== this.inactiveValue && newVal !== this.activeValue) {
                    return this.$uv.error('v-model绑定的值必须为inactiveValue、activeValue二者之一');
                }
                this.innerValue = newVal;
            }
        }
    },
    created() {
        this.innerValue = this.value || this.modelValue;
    },
    computed: {
        isActive(): boolean {
            return this.innerValue === this.activeValue;
        },
        switchStyle(): UTSJSONObject {
            let style = { __$originalPosition: new UTSSourceMapPosition("style", "uni_modules/uv-switch/components/uv-switch/uv-switch.vue", 93, 9), } as UTSJSONObject;
            // 这里需要加2，是为了腾出边框的距离，否则圆点node会和外边框紧贴在一起
            style["width"] = this.$uv.addUnit(this.$uv.getPx(this.size) * 2 + 2);
            style["height"] = this.$uv.addUnit(this.$uv.getPx(this.size) + 2);
            // 如果自定义了“非激活”演示，name边框颜色设置为透明(跟非激活颜色一致)
            // 这里不能简单的设置为非激活的颜色，否则打开状态时，会有边框，所以需要透明
            if (this.customInactiveColor) {
                style["borderColor"] = 'rgba(0, 0, 0, 0)';
            }
            style["backgroundColor"] = this.isActive ? this.activeColor : this.inactiveColor;
            return style;
        },
        nodeStyle(): UTSJSONObject {
            let style = { __$originalPosition: new UTSSourceMapPosition("style", "uni_modules/uv-switch/components/uv-switch/uv-switch.vue", 106, 9), } as UTSJSONObject;
            // 如果自定义非激活颜色，将node圆点的尺寸减少两个像素，让其与外边框距离更大一点
            style["width"] = this.$uv.addUnit(this.$uv.getPx(this.size) - this.space);
            style["height"] = this.$uv.addUnit(this.$uv.getPx(this.size) - this.space);
            const translateX = this.isActive ? this.$uv.addUnit(this.space) : this.$uv.addUnit(this.$uv.getPx(this.size));
            style["transform"] = `translateX(-${translateX})`;
            return style;
        },
        bgStyle(): UTSJSONObject {
            let style = { __$originalPosition: new UTSSourceMapPosition("style", "uni_modules/uv-switch/components/uv-switch/uv-switch.vue", 115, 9), } as UTSJSONObject;
            // 这里配置一个多余的元素在HTML中，是为了让switch切换时，有更良好的背景色扩充体验(见实际效果)
            style["width"] = this.$uv.addUnit(this.$uv.getPx(this.size) * 2 - this.$uv.getPx(this.size) / 2);
            style["height"] = this.$uv.addUnit(this.$uv.getPx(this.size));
            style["backgroundColor"] = this.inactiveColor;
            // 打开时，让此元素收缩，否则反之
            style["transform"] = `scale(${this.isActive ? 0 : 1})`;
            return style;
        },
        customInactiveColor(): boolean {
            // 之所以需要判断是否自定义了“非激活”颜色，是为了让node圆点离外边框更宽一点的距离
            return this.inactiveColor !== '#fff' && this.inactiveColor !== '#ffffff';
        }
    },
    methods: {
        clickHandler() {
            if (!this.disabled && !this.loading) {
                const oldValue = this.isActive ? this.inactiveValue : this.activeValue;
                if (!this.asyncChange) {
                    this.$emit('input', oldValue);
                    this.$emit('update:modelValue', oldValue);
                }
                // 放到下一个生命周期，因为双向绑定的value修改父组件状态需要时间，且是异步的
                this.$nextTick(() => {
                    this.$emit('change', oldValue);
                });
            }
        }
    }
});
export default __sfc__;
function GenUniModulesUvSwitchComponentsUvSwitchUvSwitchRender(this: InstanceType<typeof __sfc__>): any | null {
    const _ctx = this;
    const _cache = this.$.renderCache;
    const _component_uv_loading_icon = resolveEasyComponent("uv-loading-icon", _easycom_uv_loading_icon);
    return _cE("view", _uM({
        class: _nC(["uv-switch", [_ctx.disabled && 'uv-switch--disabled']]),
        style: _nS([_ctx.switchStyle, _ctx.$uv.addStyle(_ctx.customStyle)]),
        onClick: _ctx.clickHandler
    }), [
        _cE("view", _uM({
            class: "uv-switch__bg",
            style: _nS([_ctx.bgStyle])
        }), null, 4 /* STYLE */),
        _cE("view", _uM({
            class: _nC(["uv-switch__node", [_ctx.innerValue && 'uv-switch__node--on']]),
            style: _nS([_ctx.nodeStyle]),
            ref: "uv-switch__node"
        }), [
            _cV(_component_uv_loading_icon, _uM({
                show: _ctx.loading,
                mode: "circle",
                timingFunction: "linear",
                color: _ctx.innerValue ? _ctx.activeColor : '#AAABAD',
                size: _ctx.size * 0.6
            }), null, 8 /* PROPS */, ["show", "color", "size"])
        ], 6 /* CLASS, STYLE */)
    ], 14 /* CLASS, STYLE, PROPS */, ["onClick"]);
}
export type UvSwitchComponentPublicInstance = InstanceType<typeof __sfc__>;
const GenUniModulesUvSwitchComponentsUvSwitchUvSwitchStyles = [_uM([["uv-switch", _pS(_uM([["display", "flex"], ["flexDirection", "row"], ["boxSizing", "border-box"], ["position", "relative"], ["backgroundColor", "#ffffff"], ["borderTopWidth", 1], ["borderRightWidth", 1], ["borderBottomWidth", 1], ["borderLeftWidth", 1], ["borderTopLeftRadius", 100], ["borderTopRightRadius", 100], ["borderBottomRightRadius", 100], ["borderBottomLeftRadius", 100], ["transitionProperty", "backgroundColor"], ["transitionDuration", "0.4s"], ["borderTopColor", "rgba(0,0,0,0.12)"], ["borderRightColor", "rgba(0,0,0,0.12)"], ["borderBottomColor", "rgba(0,0,0,0.12)"], ["borderLeftColor", "rgba(0,0,0,0.12)"], ["borderTopStyle", "solid"], ["borderRightStyle", "solid"], ["borderBottomStyle", "solid"], ["borderLeftStyle", "solid"], ["justifyContent", "flex-end"], ["alignItems", "center"], ["overflow", "hidden"]]))], ["uv-switch__node", _pS(_uM([["display", "flex"], ["flexDirection", "row"], ["alignItems", "center"], ["justifyContent", "center"], ["borderTopLeftRadius", 100], ["borderTopRightRadius", 100], ["borderBottomRightRadius", 100], ["borderBottomLeftRadius", 100], ["backgroundColor", "#ffffff"], ["boxShadow", "1px 1px 1px 0 rgba(0, 0, 0, 0.25)"], ["transitionProperty", "transform"], ["transitionDuration", "0.4s"], ["transitionTimingFunction", "cubic-bezier(0.3,1.05,0.4,1.05)"]]))], ["uv-switch__bg", _pS(_uM([["position", "absolute"], ["borderTopLeftRadius", 0], ["borderTopRightRadius", 100], ["borderBottomRightRadius", 100], ["borderBottomLeftRadius", 0], ["backgroundColor", "#FFFFFF"], ["transitionProperty", "transform"], ["transitionDuration", "0.4s"], ["transitionTimingFunction", "ease"]]))], ["uv-switch--disabled", _pS(_uM([["opacity", 0.6]]))], ["@TRANSITION", _uM([["uv-switch", _uM([["property", "backgroundColor"], ["duration", "0.4s"]])], ["uv-switch__node", _uM([["property", "transform"], ["duration", "0.4s"], ["timingFunction", "cubic-bezier(0.3,1.05,0.4,1.05)"]])], ["uv-switch__bg", _uM([["property", "transform"], ["duration", "0.4s"], ["timingFunction", "ease"]])]])]])];
import _easycom_uv_loading_icon from '@/uni_modules/uv-loading-icon/components/uv-loading-icon/uv-loading-icon.vue';
//# sourceMappingURL=uv-switch.vue.map