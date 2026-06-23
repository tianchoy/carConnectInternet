import mpMixin from '@/uni_modules/uv-ui-tools/libs/mixin/mpMixin.js';
import mixin from '@/uni_modules/uv-ui-tools/libs/mixin/mixin.js';
import props from './props.js';
/**
 * badge 徽标数
 * @description 该组件一般用于图标右上角显示未读的消息数量，提示用户点击，有圆点和圆包含文字两种形式。
 * @tutorial https://www.uvui.cn/components/badge.html
 *
 * @property {Boolean} 			isDot 		是否显示圆点 （默认 false ）
 * @property {String | Number} 	value 		显示的内容
 * @property {Boolean} 			show 		是否显示 （默认 true ）
 * @property {String | Number} 	max 		最大值，超过最大值会显示 '{max}+'  （默认999）
 * @property {String} 			type 		主题类型，error|warning|success|primary （默认 'error' ）
 * @property {Boolean} 			showZero	当数值为 0 时，是否展示 Badge （默认 false ）
 * @property {String} 			bgColor 	背景颜色，优先级比type高，如设置，type参数会失效
 * @property {String} 			color 		字体颜色 （默认 '#ffffff' ）
 * @property {String} 			shape 		徽标形状，circle-四角均为圆角，horn-左下角为直角 （默认 'circle' ）
 * @property {String} 			numberType	设置数字的显示方式，overflow|ellipsis|limit  （默认 'overflow' ）
 * @property {Array}} 			offset		设置badge的位置偏移，格式为 [x, y]，也即设置的为top和right的值，absolute为true时有效
 * @property {Boolean} 			inverted	是否反转背景和字体颜色（默认 false ）
 * @property {Boolean} 			absolute	是否绝对定位（默认 false ）
 * @property {Object}			customStyle	定义需要用到的外部样式
 * @example <uv-badge :type="type" :count="count"></uv-badge>
 */
const __sfc__ = defineComponent({
    name: 'uv-badge',
    mixins: [mpMixin, mixin, props],
    computed: {
        // 是否将badge中心与父组件右上角重合
        boxStyle(): UTSJSONObject {
            let style = { __$originalPosition: new UTSSourceMapPosition("style", "uni_modules/uv-badge/components/uv-badge/uv-badge.vue", 41, 9), } as UTSJSONObject;
            return style;
        },
        // 整个组件的样式
        badgeStyle(): UTSJSONObject {
            const style = { __$originalPosition: new UTSSourceMapPosition("style", "uni_modules/uv-badge/components/uv-badge/uv-badge.vue", 46, 11), } as UTSJSONObject;
            if (this.color) {
                style["color"] = this.color;
            }
            if (this.bgColor && !this.inverted) {
                style["backgroundColor"] = this.bgColor;
            }
            if (this.absolute) {
                style["position"] = 'absolute';
                // 如果有设置offset参数
                if (isTruthy(this.offset.length)) {
                    // top和right分为为offset的第一个和第二个值，如果没有第二个值，则right等于top
                    const top = this.offset[0];
                    const right = this.offset[1] || top;
                    style["top"] = this.$uv.addUnit(top);
                    style["right"] = this.$uv.addUnit(right);
                }
            }
            return style;
        },
        showValue(): any {
            switch (this.numberType) {
                case "overflow":
                    return Number(this.value) > Number(this.max) ? this.max + "+" : this.value;
                    break;
                case "ellipsis":
                    return Number(this.value) > Number(this.max) ? "..." : this.value;
                    break;
                case "limit":
                    return Number(this.value) > 999 ? Number(this.value) >= 9999 ?
                        Math.floor(this.value / 1e4 * 100) / 100 + "w" : Math.floor(this.value /
                        1e3 * 100) / 100 + "k" : this.value;
                    break;
                default:
                    return Number(this.value);
            }
        },
        propsType() {
            return this.type || 'error';
        }
    }
});
export default __sfc__;
function GenUniModulesUvBadgeComponentsUvBadgeUvBadgeRender(this: InstanceType<typeof __sfc__>): any | null {
    const _ctx = this;
    const _cache = this.$.renderCache;
    return isTrue(_ctx.show && ((Number(_ctx.value) === 0 ? _ctx.showZero : true) || _ctx.isDot))
        ? _cE("text", _uM({
            key: 0,
            class: _nC([[_ctx.isDot ? 'uv-badge--dot' : 'uv-badge--not-dot', _ctx.inverted && 'uv-badge--inverted', _ctx.shape === 'horn' && 'uv-badge--horn', `uv-badge--${_ctx.propsType}${_ctx.inverted ? '--inverted' : ''}`], "uv-badge"]),
            style: _nS([_ctx.$uv.addStyle(_ctx.customStyle), _ctx.badgeStyle])
        }), _tD(_ctx.isDot ? '' : _ctx.showValue), 7 /* TEXT, CLASS, STYLE */)
        : _cC("v-if", true);
}
export type UvBadgeComponentPublicInstance = InstanceType<typeof __sfc__>;
const GenUniModulesUvBadgeComponentsUvBadgeUvBadgeStyles = [_uM([["uv-badge", _pS(_uM([["borderTopRightRadius", 100], ["borderTopLeftRadius", 100], ["borderBottomLeftRadius", 100], ["borderBottomRightRadius", 100], ["display", "flex"], ["flexDirection", "row"], ["lineHeight", "11px"], ["textAlign", "center"], ["fontSize", 11], ["color", "#FFFFFF"]]))], ["uv-badge--dot", _pS(_uM([["height", 8], ["width", 8]]))], ["uv-badge--inverted", _pS(_uM([["fontSize", 13]]))], ["uv-badge--not-dot", _pS(_uM([["paddingTop", 2], ["paddingRight", 5], ["paddingBottom", 2], ["paddingLeft", 5]]))], ["uv-badge--horn", _pS(_uM([["borderBottomLeftRadius", 0]]))], ["uv-badge--primary", _pS(_uM([["backgroundColor", "#3c9cff"]]))], ["uv-badge--primary--inverted", _pS(_uM([["color", "#3c9cff"]]))], ["uv-badge--error", _pS(_uM([["backgroundColor", "#f56c6c"]]))], ["uv-badge--error--inverted", _pS(_uM([["color", "#f56c6c"]]))], ["uv-badge--success", _pS(_uM([["backgroundColor", "#5ac725"]]))], ["uv-badge--success--inverted", _pS(_uM([["color", "#5ac725"]]))], ["uv-badge--info", _pS(_uM([["backgroundColor", "#909399"]]))], ["uv-badge--info--inverted", _pS(_uM([["color", "#909399"]]))], ["uv-badge--warning", _pS(_uM([["backgroundColor", "#f9ae3d"]]))], ["uv-badge--warning--inverted", _pS(_uM([["color", "#f9ae3d"]]))]])];
//# sourceMappingURL=uv-badge.vue.map