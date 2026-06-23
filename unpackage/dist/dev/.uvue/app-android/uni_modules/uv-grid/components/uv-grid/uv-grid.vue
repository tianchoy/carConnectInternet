import mpMixin from '@/uni_modules/uv-ui-tools/libs/mixin/mpMixin.js';
import mixin from '@/uni_modules/uv-ui-tools/libs/mixin/mixin.js';
import props from './props.js';
/**
 * grid 宫格布局
 * @description 宫格组件一般用于同时展示多个同类项目的场景，可以给宫格的项目设置徽标组件(badge)，或者图标等，也可以扩展为左右滑动的轮播形式。
 * @tutorial https://www.uvui.cn/components/grid.html
 * @property {String | Number}	col			宫格的列数（默认 3 ）
 * @property {Boolean}			border		是否显示宫格的边框（默认 false ）
 * @property {String}			align		宫格对齐方式，表现为数量少的时候，靠左，居中，还是靠右 （默认 'left' ）
 * @property {Object}			customStyle	定义需要用到的外部样式
 * @event {Function} click 点击宫格触发
 * @example <uv-grid :col="3" @click="click"></uv-grid>
 */
const __sfc__ = defineComponent({
    name: 'uv-grid',
    mixins: [mpMixin, mixin, props],
    emits: ['click'],
    data() {
        return {
            index: 0,
            width: 0
        };
    },
    watch: {
        // 当父组件需要子组件需要共享的参数发生了变化，手动通知子组件
        parentData() {
            if (isTruthy(this.children.length)) {
                this.children.map(child => {
                    // 判断子组件(uv-radio)如果有updateParentData方法的话，就就执行(执行的结果是子组件重新从父组件拉取了最新的值)
                    typeof (child.updateParentData) == 'function' && child.updateParentData();
                });
            }
        },
    },
    created() {
        // 如果将children定义在data中，在微信小程序会造成循环引用而报错
        this.children = [];
    },
    computed: {
        // 计算父组件的值是否发生变化
        parentData(): never[] {
            return [this.hoverClass, this.col, this.size, this.border];
        },
        // 宫格对齐方式
        gridStyle() {
            let style = { __$originalPosition: new UTSSourceMapPosition("style", "uni_modules/uv-grid/components/uv-grid/uv-grid.vue", 58, 9), } as UTSJSONObject;
            switch (this.align) {
                case 'left':
                    style["justifyContent"] = 'flex-start';
                    break;
                case 'center':
                    style["justifyContent"] = 'center';
                    break;
                case 'right':
                    style["justifyContent"] = 'flex-end';
                    break;
                default:
                    style["justifyContent"] = 'flex-start';
            }
            ;
            return this.$uv.deepMerge(style, this.$uv.addStyle(this.customStyle));
        }
    },
    methods: {
        // 此方法由uv-grid-item触发，用于在uv-grid发出事件
        childClick(name) {
            this.$emit('click', name);
        }
    }
});
export default __sfc__;
function GenUniModulesUvGridComponentsUvGridUvGridRender(this: InstanceType<typeof __sfc__>): any | null {
    const _ctx = this;
    const _cache = this.$.renderCache;
    return _cE("view", _uM({
        class: "uv-grid",
        ref: "uv-grid",
        style: _nS([_ctx.gridStyle])
    }), [
        renderSlot(_ctx.$slots, "default")
    ], 4 /* STYLE */);
}
export type UvGridComponentPublicInstance = InstanceType<typeof __sfc__>;
const GenUniModulesUvGridComponentsUvGridUvGridStyles = [_uM([["uv-grid", _pS(_uM([["justifyContent", "center"], ["display", "flex"], ["flexDirection", "row"], ["flexWrap", "wrap"], ["alignItems", "center"]]))]])];
//# sourceMappingURL=uv-grid.vue.map