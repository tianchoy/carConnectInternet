import _easycom_uv_icon from '@/uni_modules/uv-icon/components/uv-icon/uv-icon.vue'
import _easycom_uv_grid_item from '@/uni_modules/uv-grid/components/uv-grid-item/uv-grid-item.vue'
import _easycom_uv_grid from '@/uni_modules/uv-grid/components/uv-grid/uv-grid.vue'
import _easycom_uv_popup from '@/uni_modules/uv-popup/components/uv-popup/uv-popup.vue'
import { ref } from 'vue'

interface Props {
  title?: string
  col?: number
  iconSize?: number
  safeAreaInsetBottom?: boolean
}

interface Emits {
  (e: 'select', item: any): void
}


const __sfc__ = defineComponent({
  __name: 'car-icons',
  __props: Props,
  props: {
    title: { type: String, required: false, default: '请选择图标' },
    col: { type: Number, required: false, default: 5 },
    iconSize: { type: Number, required: false, default: 50 },
    safeAreaInsetBottom: { type: Boolean, required: false, default: true }
  },
  emits: ["select"],
  setup(__props, __setupCtx: SetupContext) {
const __expose = __setupCtx.expose
const __ins = getCurrentInstance()!;
const _ctx = __ins.proxy as InstanceType<typeof __sfc__>;
const _cache = __ins.renderCache;

const props = __props

function emit(event: string, ...do_not_transform_spread: Array<any | null>) {
__ins.emit(event, ...do_not_transform_spread)
}

// 在组件内部定义完整的图标列表
const iconList = [
  { name: 'car', title: '轿车', img: '/static/cars/online/car.png' },
  { name: 'bus', title: '公交车', img: '/static/cars/online/bus.png' },
  { name: 'bike', title: '自行车', img: '/static/cars/online/bike.png' },
  { name: 'moto', title: '摩托车', img: '/static/cars/online/moto.png' },
  { name: 'diandong', title: '电动车', img: '/static/cars/online/diandong.png' },
  { name: 'huoche', title: '货车', img: '/static/cars/online/huoche.png' },
  { name: 'sanlun', title: '三轮车', img: '/static/cars/online/sanlun.png' },
  { name: 'tuola', title: '拖拉机', img: '/static/cars/online/tuola.png' },
  { name: 'suv', title: '越野车', img: '/static/cars/online/suv.png' },
  { name: 'baby', title: '婴儿车', img: '/static/cars/online/baby.png' },
  { name: 'tank', title: '坦克', img: '/static/cars/online/tank.png' },
  { name: 'zhuangjia', title: '装甲车', img: '/static/cars/online/zhuangjia.png' },
  { name: 'wajue', title: '挖掘机', img: '/static/cars/online/wajue.png' },
  { name: 'plan', title: '飞机', img: '/static/cars/online/plan.png' },
  { name: 'walk', title: '步行', img: '/static/cars/online/walk.png' },
  { name: 'muma', title: '木马', img: '/static/cars/online/muma.png' },
  { name: 'hangmu', title: '航母', img: '/static/cars/online/hangmu.png' },
  { name: 'junjian', title: '军舰', img: '/static/cars/online/junjian.png' },
  { name: 'tuiche', title: '手推车', img: '/static/cars/online/tuiche.png' },
  { name: 'train', title: '火车', img: '/static/cars/online/train.png' },
]

const popupRef = ref(null)

// 选择图标处理函数
const handleSelect = (item: any) => {
  emit('select', item)
  close()
}

// 公开的方法
const open = () => {
  popupRef.value?.open()
}

const close = () => {
  popupRef.value?.close()
}

// 根据图标名称获取图标信息
const getIconByName = (name: string): any => {
  return iconList.find(item => item.name === name)
}

// 暴露方法给父组件
__expose({
  open,
  close,
  iconList,
  getIconByName
})

return (): any | null => {

const _component_uv_icon = resolveEasyComponent("uv-icon",_easycom_uv_icon)
const _component_uv_grid_item = resolveEasyComponent("uv-grid-item",_easycom_uv_grid_item)
const _component_uv_grid = resolveEasyComponent("uv-grid",_easycom_uv_grid)
const _component_uv_popup = resolveEasyComponent("uv-popup",_easycom_uv_popup)

  return _cV(_component_uv_popup, _uM({
    ref_key: "popupRef",
    ref: popupRef,
    title: _ctx.title,
    mode: "bottom",
    safeAreaInsetBottom: _ctx.safeAreaInsetBottom
  }), _uM({
    default: withSlotCtx((): any[] => [
      _cE("view", _uM({ class: "icon-selector" }), [
        _cV(_component_uv_grid, _uM({ col: _ctx.col }), _uM({
          default: withSlotCtx((): any[] => [
            _cE(Fragment, null, RenderHelpers.renderList(iconList, (item, index, __index, _cached): any => {
              return _cV(_component_uv_grid_item, _uM({
                key: index,
                onClick: () => {handleSelect(item)}
              }), _uM({
                default: withSlotCtx((): any[] => [
                  _cV(_component_uv_icon, _uM({
                    customStyle: { paddingTop: '20rpx' },
                    name: item.img,
                    size: _ctx.iconSize
                  }), null, 8 /* PROPS */, ["name", "size"]),
                  _cE("text", _uM({ class: "grid-text" }), _tD(item.title), 1 /* TEXT */)
                ]),
                _: 2 /* DYNAMIC */
              }), 1032 /* PROPS, DYNAMIC_SLOTS */, ["onClick"])
            }), 64 /* STABLE_FRAGMENT */)
          ]),
          _: 1 /* STABLE */
        }), 8 /* PROPS */, ["col"])
      ])
    ]),
    _: 1 /* STABLE */
  }), 8 /* PROPS */, ["title", "safeAreaInsetBottom"])
}
}

})
export default __sfc__
export type CarIconsComponentPublicInstance = InstanceType<typeof __sfc__>;
const GenComponentsCarIconsCarIconsStyles = [_uM([["icon-selector", _pS(_uM([["paddingTop", "20rpx"], ["paddingRight", "20rpx"], ["paddingBottom", "20rpx"], ["paddingLeft", "20rpx"], ["backgroundColor", "#ffffff"]]))], ["grid-text", _uM([[".icon-selector ", _uM([["marginTop", "10rpx"], ["fontSize", "20rpx"], ["color", "#333333"]])]])]])]
