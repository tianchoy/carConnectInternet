import mpMixin from '@/uni_modules/uv-ui-tools/libs/mixin/mpMixin.js';
import mixin from '@/uni_modules/uv-ui-tools/libs/mixin/mixin.js';
import props from './props.js';
const __sfc__ = defineComponent({
    name: 'uv-slider',
    mixins: [mpMixin, mixin, props],
    computed: {
        sliderValue() {
            return this.value || this.modelValue;
        }
    },
    methods: {
        // 拖动过程中触发
        changingHandler(e) {
            const { value } = e.detail;
            // 更新v-model的值
            this.$emit('input', value);
            this.$emit('update:modelValue', value);
            // 触发事件
            this.$emit('changing', value);
        },
        // 滑动结束时触发
        changeHandler(e) {
            const { value } = e.detail;
            // 更新v-model的值
            this.$emit('input', value);
            this.$emit('update:modelValue', value);
            // 触发事件
            this.$emit('change', value);
        }
    }
});
export default __sfc__;
function GenUniModulesUvSliderComponentsUvSliderUvSliderRender(this: InstanceType<typeof __sfc__>): any | null {
    const _ctx = this;
    const _cache = this.$.renderCache;
    const _component_slider = resolveComponent("slider");
    return _cE("view", _uM({
        class: "uv-slider",
        style: _nS([_ctx.$uv.addStyle(_ctx.customStyle)])
    }), [
        _cV(_component_slider, _uM({
            min: _ctx.min,
            max: _ctx.max,
            step: _ctx.step,
            value: _ctx.sliderValue,
            activeColor: _ctx.activeColor,
            backgroundColor: _ctx.backgroundColor,
            blockSize: _ctx.$uv.getPx(_ctx.blockSize),
            blockColor: _ctx.blockColor,
            showValue: _ctx.showValue,
            disabled: _ctx.disabled,
            onChanging: _ctx.changingHandler,
            onChange: _ctx.changeHandler
        }), null, 8 /* PROPS */, ["min", "max", "step", "value", "activeColor", "backgroundColor", "blockSize", "blockColor", "showValue", "disabled", "onChanging", "onChange"])
    ], 4 /* STYLE */);
}
export type UvSliderComponentPublicInstance = InstanceType<typeof __sfc__>;
const GenUniModulesUvSliderComponentsUvSliderUvSliderStyles = [];
