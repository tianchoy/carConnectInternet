import mpMixin from '@/uni_modules/uv-ui-tools/libs/mixin/mpMixin.js';
import mixin from '@/uni_modules/uv-ui-tools/libs/mixin/mixin.js';
import props from './props.js';
/**
 * Toolbar 工具条
 * @description
 * @tutorial https://www.uvui.cn/components/toolbar.html
 * @property {Boolean}	show			是否展示工具条（默认 true ）
 * @property {Boolean}	showBorder			是否展示工具条下方边框（默认 false ）
 * @property {String}	cancelText		取消按钮的文字（默认 '取消' ）
 * @property {String}	confirmText		确认按钮的文字（默认 '确认' ）
 * @property {String}	cancelColor		取消按钮的颜色（默认 '#909193' ）
 * @property {String}	confirmColor	确认按钮的颜色（默认 '#3c9cff' ）
 * @property {String}	title	标题文字
 * @event {Function}
 * @example
 */
const __sfc__ = defineComponent({
    name: 'uv-toolbar',
    emits: ['confirm', 'cancel'],
    mixins: [mpMixin, mixin, props],
    methods: {
        // 点击取消按钮
        cancel() {
            this.$emit('cancel');
        },
        // 点击确定按钮
        confirm() {
            this.$emit('confirm');
        }
    }
});
export default __sfc__;
function GenUniModulesUvToolbarComponentsUvToolbarUvToolbarRender(this: InstanceType<typeof __sfc__>): any | null {
    const _ctx = this;
    const _cache = this.$.renderCache;
    return isTrue(_ctx.show)
        ? _cE("view", _uM({
            key: 0,
            class: _nC(['uv-toolbar', _uM({ 'uv-border-bottom': _ctx.showBorder })]),
            onTouchmove: withModifiers(_ctx.noop, ["stop", "prevent"])
        }), [
            _cE("view", _uM({
                class: "uv-toolbar__cancel__wrapper",
                "hover-class": "uv-hover-class"
            }), [
                _cE("text", _uM({
                    class: "uv-toolbar__wrapper__cancel",
                    onClick: _ctx.cancel,
                    style: _nS(_uM({
                        color: _ctx.cancelColor
                    }))
                }), _tD(_ctx.cancelText), 13 /* TEXT, STYLE, PROPS */, ["onClick"])
            ]),
            isTrue(_ctx.title)
                ? _cE("text", _uM({
                    key: 0,
                    class: "uv-toolbar__title uv-line-1"
                }), _tD(_ctx.title), 1 /* TEXT */)
                : _cC("v-if", true),
            _cE("view", _uM({
                class: "uv-toolbar__confirm__wrapper",
                "hover-class": "uv-hover-class"
            }), [
                _cE("text", _uM({
                    class: "uv-toolbar__wrapper__confirm",
                    onClick: _ctx.confirm,
                    style: _nS(_uM({
                        color: _ctx.confirmColor
                    }))
                }), _tD(_ctx.confirmText), 13 /* TEXT, STYLE, PROPS */, ["onClick"])
            ])
        ], 42 /* CLASS, PROPS, NEED_HYDRATION */, ["onTouchmove"])
        : _cC("v-if", true);
}
export type UvToolbarComponentPublicInstance = InstanceType<typeof __sfc__>;
const GenUniModulesUvToolbarComponentsUvToolbarUvToolbarStyles = [_uM([["uv-line-1", _pS(_uM([["overflow", "hidden"], ["textOverflow", "ellipsis"], ["wordBreak", "break-all"], ["WebkitLineClamp", 1], ["!WebkitBoxOrient", "vertical"]]))], ["uv-line-2", _pS(_uM([["overflow", "hidden"], ["textOverflow", "ellipsis"], ["wordBreak", "break-all"], ["WebkitLineClamp", 2], ["!WebkitBoxOrient", "vertical"]]))], ["uv-line-3", _pS(_uM([["overflow", "hidden"], ["textOverflow", "ellipsis"], ["wordBreak", "break-all"], ["WebkitLineClamp", 3], ["!WebkitBoxOrient", "vertical"]]))], ["uv-line-4", _pS(_uM([["overflow", "hidden"], ["textOverflow", "ellipsis"], ["wordBreak", "break-all"], ["WebkitLineClamp", 4], ["!WebkitBoxOrient", "vertical"]]))], ["uv-line-5", _pS(_uM([["overflow", "hidden"], ["textOverflow", "ellipsis"], ["wordBreak", "break-all"], ["WebkitLineClamp", 5], ["!WebkitBoxOrient", "vertical"]]))], ["uv-border-bottom", _pS(_uM([["!borderBottomWidth", 0.5], ["!borderTopColor", "#dadbde"], ["!borderRightColor", "#dadbde"], ["!borderBottomColor", "#dadbde"], ["!borderLeftColor", "#dadbde"], ["borderBottomStyle", "solid"]]))], ["uv-hover-class", _pS(_uM([["opacity", 0.7]]))], ["uv-toolbar", _pS(_uM([["height", 42], ["display", "flex"], ["flexDirection", "row"], ["justifyContent", "space-between"], ["alignItems", "center"]]))], ["uv-toolbar__wrapper__cancel", _pS(_uM([["color", "#909193"], ["fontSize", 15], ["paddingTop", 0], ["paddingRight", 15], ["paddingBottom", 0], ["paddingLeft", 15]]))], ["uv-toolbar__title", _pS(_uM([["color", "#303133"], ["paddingTop", 0], ["paddingRight", "60rpx"], ["paddingBottom", 0], ["paddingLeft", "60rpx"], ["fontSize", 16], ["flexGrow", 1], ["flexShrink", 1], ["flexBasis", "0%"], ["textAlign", "center"]]))], ["uv-toolbar__wrapper__confirm", _pS(_uM([["color", "#3c9cff"], ["fontSize", 15], ["paddingTop", 0], ["paddingRight", 15], ["paddingBottom", 0], ["paddingLeft", 15]]))]])];
//# sourceMappingURL=uv-toolbar.vue.map