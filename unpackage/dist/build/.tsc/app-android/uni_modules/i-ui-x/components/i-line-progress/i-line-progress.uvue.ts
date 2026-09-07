import { ref, computed } from 'vue'


const __sfc__ = defineComponent({
  __name: 'i-line-progress',
name: 'i-line-progress',
  props: {
  percent: { type: Number, default: 45 },
  title: { type: String, default: '' },
  activeColor: { type: String, default: '#19be6b' },
  inactiveColor: { type: String, default: '#ebeef5' },
  height: { type: Number, default: 8 },
  showText: { type: Boolean, default: true },
},
  emits: ['click', 'change', 'update:percent'],
  setup(__props) {
const __ins = getCurrentInstance()!;
const _ctx = __ins.proxy as InstanceType<typeof __sfc__>;
const _cache = __ins.renderCache;



/**
 * Props 说明：外部传入的配置，用于控制组件展示、状态和行为。
 * - percent: 进度百分比，范围通常为 0 到 100。
 * - title: 主标题文本，用于组件顶部或主要说明位置。
 * - activeColor: 激活态颜色。
 * - inactiveColor: 未激活态颜色。
 * - height: 组件高度，单位为 px。
 * - showText: showText 配置项，用于控制组件展示或交互行为。
 */
const props = __props

/**
 * Emits 说明：组件向外派发的事件，用于页面监听交互结果或同步受控值。
 * - click: 点击组件时触发，用于响应用户主动操作。
 * - change: 状态或值变化时触发，参数为最新状态或值。
 * - update:percent: 同步进度百分比。
 */
function emit(event: string, ...do_not_transform_spread: Array<any | null>) {
__ins.emit(event, ...do_not_transform_spread)
}

const current = ref(props.percent)

const normalized = computed(() => {
  if (current.value < 0) return 0
  if (current.value > 100) return 100
  return Math.round(current.value)
})

function step(delta: number) {
  current.value = Math.min(100, Math.max(0, current.value + delta))
  emit('change', current.value)
  emit('update:percent', current.value)
}

function emitClick() {
  emit('click', current.value)
}

return (): any | null => {

  return _cE("view", _uM({
    class: "i-card",
    onClick: emitClick
  }), [
    _cE("view", _uM({
      class: "i-track",
      style: _nS('height:' + _ctx.height + 'px;background-color:' + _ctx.inactiveColor)
    }), [
      _cE("view", _uM({
        class: "i-fill",
        style: _nS('width:' + normalized.value + '%;background-color:' + _ctx.activeColor)
      }), null, 4 /* STYLE */)
    ], 4 /* STYLE */),
    _cE("view", _uM({ class: "i-row i-head" }), [
      _cE("text", _uM({ class: "i-title" }), _tD(_ctx.title), 1 /* TEXT */),
      isTrue(_ctx.showText)
        ? _cE("text", _uM({
            key: 0,
            class: "i-muted"
          }), _tD(normalized.value) + "%", 1 /* TEXT */)
        : _cC("v-if", true)
    ])
  ])
}
}

})
export default __sfc__
export type ILineProgressComponentPublicInstance = InstanceType<typeof __sfc__>;
const GenUniModulesIUiXComponentsILineProgressILineProgressStyles = [_uM([["i-card", _pS(_uM([["display", "flex"], ["flexDirection", "row"], ["alignItems", "center"], ["justifyContent", "space-between"]]))], ["i-title", _pS(_uM([["color", "#303133"], ["fontSize", 15], ["fontWeight", 600], ["lineHeight", "22px"]]))], ["i-muted", _pS(_uM([["color", "#909399"], ["fontSize", 12], ["lineHeight", "18px"]]))], ["i-row", _pS(_uM([["flexDirection", "row"], ["alignItems", "center"], ["flexWrap", "wrap"]]))], ["i-btn", _pS(_uM([["minHeight", 34], ["marginTop", 10], ["marginRight", 8], ["paddingTop", 0], ["paddingRight", 12], ["paddingBottom", 0], ["paddingLeft", 12], ["borderTopLeftRadius", 6], ["borderTopRightRadius", 6], ["borderBottomRightRadius", 6], ["borderBottomLeftRadius", 6], ["backgroundColor", "#ecf5ff"], ["alignItems", "center"], ["justifyContent", "center"]]))], ["i-btn--plain", _pS(_uM([["backgroundColor", "#f5f7fa"]]))], ["i-btn--danger", _pS(_uM([["backgroundColor", "#fef0f0"]]))], ["i-btn-text", _pS(_uM([["color", "#2979ff"], ["fontSize", 13], ["lineHeight", "18px"]]))], ["i-danger", _pS(_uM([["color", "#f56c6c"]]))], ["i-head", _pS(_uM([["justifyContent", "space-between"]]))], ["i-track", _pS(_uM([["borderTopLeftRadius", 999], ["borderTopRightRadius", 999], ["borderBottomRightRadius", 999], ["borderBottomLeftRadius", 999], ["flexGrow", 1], ["flexShrink", 1], ["flexBasis", "0%"], ["marginRight", 5], ["overflow", "hidden"]]))], ["i-fill", _pS(_uM([["height", "100%"], ["borderTopLeftRadius", 999], ["borderTopRightRadius", 999], ["borderBottomRightRadius", 999], ["borderBottomLeftRadius", 999]]))]])]
