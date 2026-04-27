import mpMixin from '@/uni_modules/uv-ui-tools/libs/mixin/mpMixin.js';
import mixin from '@/uni_modules/uv-ui-tools/libs/mixin/mixin.js';
import props from './props.js';
/**
 * noticeBar 滚动通知
 * @description 该组件用于滚动通告场景，有多种模式可供选择
 * @tutorial https://www.uvui.cn/components/noticeBar.html
 * @property {Array | String}	text			显示的内容，数组
 * @property {String}			direction		通告滚动模式，row-横向滚动，column-竖向滚动 ( 默认 'row' )
 * @property {Boolean}			step			direction = row时，是否使用步进形式滚动  ( 默认 false )
 * @property {String}			icon			是否显示左侧的音量图标 ( 默认 'volume' )
 * @property {String}			mode			通告模式，link-显示右箭头，closable-显示右侧关闭图标
 * @property {String}			color			文字颜色，各图标也会使用文字颜色 ( 默认 '#f9ae3d' )
 * @property {String}			bgColor			背景颜色 ( 默认 '#fdf6ec' )
 * @property {String | Number}	speed			水平滚动时的滚动速度，即每秒滚动多少px(px)，这有利于控制文字无论多少时，都能有一个恒定的速度 ( 默认 80 )
 * @property {String | Number}	fontSize		字体大小 ( 默认 14 )
 * @property {String | Number}	duration		滚动一个周期的时间长，单位ms ( 默认 2000 )
 * @property {Boolean}			disableTouch	是否禁止用手滑动切换 目前HX2.6.11，只支持App 2.5.5+、H5 2.5.5+、支付宝小程序、字节跳动小程序（默认34） ( 默认 true )
 * @property {String}			url				跳转的页面路径
 * @property {String}			linkType		页面跳转的类型 ( 默认 navigateTo )
 * @property {Object}			customStyle		定义需要用到的外部样式
 *
 * @event {Function}			click			点击通告文字触发
 * @event {Function}			close			点击右侧关闭图标触发
 * @example <uv-notice-bar :more-icon="true" :list="list"></uv-notice-bar>
 */
const __sfc__ = defineComponent({
    name: "uv-notice-bar",
    emits: ['click', 'close', 'change'],
    mixins: [mpMixin, mixin, props],
    data() {
        return {
            show: true
        };
    },
    methods: {
        // 点击通告栏
        click(index) {
            this.$emit('click', index);
            if (this.url && this.linkType) {
                // 此方法写在mixin中，另外跳转的url和linkType参数也在mixin的props中
                this.openPage();
            }
        },
        // 点击关闭按钮
        close() {
            this.show = false;
            this.$emit('close');
        },
        // 竖向滚动时触发
        change(index) {
            this.$emit('change', index);
        }
    }
});
export default __sfc__;
function GenUniModulesUvNoticeBarComponentsUvNoticeBarUvNoticeBarRender(this: InstanceType<typeof __sfc__>): any | null {
    const _ctx = this;
    const _cache = this.$.renderCache;
    const _component_uv_column_notice = resolveEasyComponent("uv-column-notice", _easycom_uv_column_notice);
    const _component_uv_row_notice = resolveEasyComponent("uv-row-notice", _easycom_uv_row_notice);
    return isTrue(_ctx.show)
        ? _cE("view", _uM({
            key: 0,
            class: "uv-notice-bar",
            style: _nS([_uM({
                    backgroundColor: _ctx.bgColor
                }), _ctx.$uv.addStyle(_ctx.customStyle)])
        }), [
            isTrue(_ctx.direction === 'column' || (_ctx.direction === 'row' && _ctx.step))
                ? _cV(_component_uv_column_notice, _uM({
                    key: 0,
                    color: _ctx.color,
                    bgColor: _ctx.bgColor,
                    text: _ctx.text,
                    mode: _ctx.mode,
                    step: _ctx.step,
                    icon: _ctx.icon,
                    "disable-touch": _ctx.disableTouch,
                    "disable-scroll": _ctx.disableScroll,
                    fontSize: _ctx.fontSize,
                    duration: _ctx.duration,
                    onClose: _ctx.close,
                    onClick: _ctx.click,
                    onChange: _ctx.change
                }), null, 8 /* PROPS */, ["color", "bgColor", "text", "mode", "step", "icon", "disable-touch", "disable-scroll", "fontSize", "duration", "onClose", "onClick", "onChange"])
                : _cV(_component_uv_row_notice, _uM({
                    key: 1,
                    color: _ctx.color,
                    bgColor: _ctx.bgColor,
                    text: _ctx.text,
                    mode: _ctx.mode,
                    fontSize: _ctx.fontSize,
                    speed: _ctx.speed,
                    url: _ctx.url,
                    linkType: _ctx.linkType,
                    icon: _ctx.icon,
                    onClose: _ctx.close,
                    onClick: _ctx.click
                }), null, 8 /* PROPS */, ["color", "bgColor", "text", "mode", "fontSize", "speed", "url", "linkType", "icon", "onClose", "onClick"])
        ], 4 /* STYLE */)
        : _cC("v-if", true);
}
export type UvNoticeBarComponentPublicInstance = InstanceType<typeof __sfc__>;
const GenUniModulesUvNoticeBarComponentsUvNoticeBarUvNoticeBarStyles = [_uM([["uv-notice-bar", _pS(_uM([["overflow", "hidden"], ["paddingTop", 9], ["paddingRight", 12], ["paddingBottom", 9], ["paddingLeft", 12], ["flexGrow", 1], ["flexShrink", 1], ["flexBasis", "0%"]]))]])];
import _easycom_uv_column_notice from '@/uni_modules/uv-notice-bar/components/uv-column-notice/uv-column-notice.vue';
import _easycom_uv_row_notice from '@/uni_modules/uv-notice-bar/components/uv-row-notice/uv-row-notice.vue';
