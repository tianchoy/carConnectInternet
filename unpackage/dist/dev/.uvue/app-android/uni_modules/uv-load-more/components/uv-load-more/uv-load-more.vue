import mpMixin from '@/uni_modules/uv-ui-tools/libs/mixin/mpMixin.js';
import mixin from '@/uni_modules/uv-ui-tools/libs/mixin/mixin.js';
import props from './props.js';
/**
 * loadmore 加载更多
 * @description 此组件一般用于标识页面底部加载数据时的状态。
 * @tutorial https://www.uvui.cn/components/loadMore.html
 * @property {String}			status			组件状态（默认 'loadmore' ）
 * @property {String}			bgColor			组件背景颜色，在页面是非白色时会用到（默认 'transparent' ）
 * @property {Boolean}			icon			加载中时是否显示图标（默认 true ）
 * @property {String | Number}	fontSize		字体大小（默认 14 ）
 * @property {String | Number}	iconSize		图标大小（默认 17 ）
 * @property {String}			color			字体颜色（默认 '#606266' ）
 * @property {String}			loadingIcon		加载图标（默认 'circle' ）
 * @property {String}			loadmoreText	加载前的提示语（默认 '加载更多' ）
 * @property {String}			loadingText		加载中提示语（默认 '正在加载...' ）
 * @property {String}			nomoreText		没有更多的提示语（默认 '没有更多了' ）
 * @property {Boolean}			isDot			到上一个相邻元素的距离 （默认 false ）
 * @property {String}			iconColor		加载中图标的颜色 （默认 '#b7b7b7' ）
 * @property {String}			lineColor		线条颜色（默认 #E6E8EB ）
 * @property {String | Number}	marginTop		上边距 （默认 10 ）
 * @property {String | Number}	marginBottom	下边距 （默认 10 ）
 * @property {String | Number}	height			高度，单位px （默认 'auto' ）
 * @property {Boolean}			line			是否显示左边分割线  （默认 false ）
 * @property {Boolean}			dashed		// 是否虚线，true-虚线，false-实线  （默认 false ）
 * @event {Function} loadmore status为loadmore时，点击组件会发出此事件
 * @example <uv-loadmore :status="status" icon-type="iconType" load-text="loadText" />
 */
const __sfc__ = defineComponent({
    name: "uv-loadmore",
    mixins: [mpMixin, mixin, props],
    data() {
        return {
            // 粗点
            dotText: "●"
        };
    },
    computed: {
        // 加载的文字显示的样式
        loadTextStyle(): UTSJSONObject {
            return {
                color: this.color,
                fontSize: this.$uv.addUnit(this.fontSize),
                lineHeight: this.$uv.addUnit(this.fontSize),
                backgroundColor: this.bgColor,
            };
        },
        // 显示的提示文字
        showText(): string {
            let text = '';
            if (this.status == 'loadmore')
                text = this.loadmoreText;
            else if (this.status == 'loading')
                text = this.loadingText;
            else if (this.status == 'nomore' && this.isDot)
                text = this.dotText;
            else
                text = this.nomoreText;
            return text;
        }
    },
    methods: {
        loadMore() {
            // 只有在“加载更多”的状态下才发送点击事件，内容不满一屏时无法触发底部上拉事件，所以需要点击来触发
            if (this.status == 'loadmore')
                this.$emit('loadmore');
        }
    }
});
export default __sfc__;
function GenUniModulesUvLoadMoreComponentsUvLoadMoreUvLoadMoreRender(this: InstanceType<typeof __sfc__>): any | null {
    const _ctx = this;
    const _cache = this.$.renderCache;
    const _component_uv_line = resolveEasyComponent("uv-line", _easycom_uv_line);
    const _component_uv_loading_icon = resolveEasyComponent("uv-loading-icon", _easycom_uv_loading_icon);
    return _cE("view", _uM({
        class: "uv-loadmore",
        style: _nS([_uM({
                backgroundColor: _ctx.bgColor,
                marginBottom: _ctx.$uv.addUnit(_ctx.marginBottom),
                marginTop: _ctx.$uv.addUnit(_ctx.marginTop),
                height: _ctx.$uv.addUnit(_ctx.height),
            }),
            _ctx.$uv.addStyle(_ctx.customStyle)])
    }), [
        isTrue(_ctx.line)
            ? _cV(_component_uv_line, _uM({
                key: 0,
                length: "140rpx",
                color: _ctx.lineColor,
                hairline: false,
                dashed: _ctx.dashed
            }), null, 8 /* PROPS */, ["color", "dashed"])
            : _cC("v-if", true),
        _cE("view", _uM({
            class: _nC([_ctx.status == 'loadmore' || _ctx.status == 'nomore' ? 'uv-more' : '', "uv-loadmore__content"])
        }), [
            isTrue(_ctx.status === 'loading' && _ctx.icon)
                ? _cE("view", _uM({
                    key: 0,
                    class: "uv-loadmore__content__icon-wrap"
                }), [
                    _cV(_component_uv_loading_icon, _uM({
                        color: _ctx.iconColor,
                        size: _ctx.iconSize,
                        mode: _ctx.loadingIcon
                    }), null, 8 /* PROPS */, ["color", "size", "mode"])
                ])
                : _cC("v-if", true),
            _cE("text", _uM({
                class: _nC(["uv-line-1", [(_ctx.status == 'nomore' && _ctx.isDot == true) ? 'uv-loadmore__content__dot-text' : 'uv-loadmore__content__text']]),
                style: _nS([_ctx.loadTextStyle]),
                onClick: _ctx.loadMore
            }), _tD(_ctx.showText), 15 /* TEXT, CLASS, STYLE, PROPS */, ["onClick"])
        ], 2 /* CLASS */),
        isTrue(_ctx.line)
            ? _cV(_component_uv_line, _uM({
                key: 1,
                length: "140rpx",
                color: _ctx.lineColor,
                hairline: false,
                dashed: _ctx.dashed
            }), null, 8 /* PROPS */, ["color", "dashed"])
            : _cC("v-if", true)
    ], 4 /* STYLE */);
}
export type UvLoadMoreComponentPublicInstance = InstanceType<typeof __sfc__>;
const GenUniModulesUvLoadMoreComponentsUvLoadMoreUvLoadMoreStyles = [_uM([["uv-line-1", _pS(_uM([["overflow", "hidden"], ["textOverflow", "ellipsis"], ["wordBreak", "break-all"], ["WebkitLineClamp", 1], ["!WebkitBoxOrient", "vertical"]]))], ["uv-line-2", _pS(_uM([["overflow", "hidden"], ["textOverflow", "ellipsis"], ["wordBreak", "break-all"], ["WebkitLineClamp", 2], ["!WebkitBoxOrient", "vertical"]]))], ["uv-line-3", _pS(_uM([["overflow", "hidden"], ["textOverflow", "ellipsis"], ["wordBreak", "break-all"], ["WebkitLineClamp", 3], ["!WebkitBoxOrient", "vertical"]]))], ["uv-line-4", _pS(_uM([["overflow", "hidden"], ["textOverflow", "ellipsis"], ["wordBreak", "break-all"], ["WebkitLineClamp", 4], ["!WebkitBoxOrient", "vertical"]]))], ["uv-line-5", _pS(_uM([["overflow", "hidden"], ["textOverflow", "ellipsis"], ["wordBreak", "break-all"], ["WebkitLineClamp", 5], ["!WebkitBoxOrient", "vertical"]]))], ["uv-loadmore", _pS(_uM([["display", "flex"], ["flexDirection", "row"], ["alignItems", "center"], ["justifyContent", "center"], ["flexGrow", 1], ["flexShrink", 1], ["flexBasis", "0%"]]))], ["uv-loadmore__content", _pS(_uM([["marginTop", 0], ["marginRight", 15], ["marginBottom", 0], ["marginLeft", 15], ["display", "flex"], ["flexDirection", "row"], ["alignItems", "center"], ["justifyContent", "center"]]))], ["uv-loadmore__content__icon-wrap", _pS(_uM([["marginRight", 8]]))], ["uv-loadmore__content__text", _pS(_uM([["fontSize", 14], ["color", "#606266"]]))], ["uv-loadmore__content__dot-text", _pS(_uM([["fontSize", 15], ["color", "#909193"]]))]])];
import _easycom_uv_line from '@/uni_modules/uv-line/components/uv-line/uv-line.vue';
import _easycom_uv_loading_icon from '@/uni_modules/uv-loading-icon/components/uv-loading-icon/uv-loading-icon.vue';
//# sourceMappingURL=uv-load-more.vue.map