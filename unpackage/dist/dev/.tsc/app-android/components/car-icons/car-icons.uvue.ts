import _easycom_i_grid from '@/uni_modules/i-ui-x/components/i-grid/i-grid.uvue'
import _easycom_i_popup from '@/uni_modules/i-ui-x/components/i-popup/i-popup.uvue'
import { ref, computed } from 'vue'

interface Props {
  title: string
  col: number
  iconSize: number
  safeAreaInsetBottom: boolean
}

type CarIconItem = { __$originalPosition?: UTSSourceMapPosition<"CarIconItem", "components/car-icons/car-icons.uvue", 38, 6>;
  name: string
  text: string
  image: string
}

interface Emits {
  (e: 'select', item: CarIconItem): void
}


const __sfc__ = defineComponent({
  __name: 'car-icons',
  __props: Props,
  props: {
    title: { type: String, required: true, default: '请选择图标' },
    col: { type: Number, required: true, default: 4 },
    iconSize: { type: Number, required: true, default: 40 },
    safeAreaInsetBottom: { type: Boolean, required: true, default: true }
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

// 弹窗显示状态
const visible = ref(false)

// 图标列表
const iconList: Array<CarIconItem> = [
  { name: 'car', text: '轿车', image: '/static/cars/online/car.png' },
  { name: 'suv', text: '越野车', image: '/static/cars/online/suv.png' },
  { name: 'bus', text: '公交车', image: '/static/cars/online/bus.png' },
  { name: 'huoche', text: '货车', image: '/static/cars/online/huoche.png' },
  { name: 'train', text: '火车', image: '/static/cars/online/train.png' },
  { name: 'diandong', text: '电动车', image: '/static/cars/online/diandong.png' },
  { name: 'moto', text: '摩托车', image: '/static/cars/online/moto.png' },
  { name: 'bike', text: '自行车', image: '/static/cars/online/bike.png' },
  { name: 'sanlun', text: '三轮车', image: '/static/cars/online/sanlun.png' },
  { name: 'tuola', text: '拖拉机', image: '/static/cars/online/tuola.png' },
  { name: 'wajue', text: '挖掘机', image: '/static/cars/online/wajue.png' },
  { name: 'tuiche', text: '手推车', image: '/static/cars/online/tuiche.png' },  
  { name: 'baby', text: '婴儿车', image: '/static/cars/online/baby.png' },
  { name: 'muma', text: '木马', image: '/static/cars/online/muma.png' },
  { name: 'tank', text: '坦克', image: '/static/cars/online/tank.png' },
  { name: 'zhuangjia', text: '装甲车', image: '/static/cars/online/zhuangjia.png' },
  { name: 'plan', text: '飞机', image: '/static/cars/online/plan.png' },
  { name: 'hangmu', text: '航母', image: '/static/cars/online/hangmu.png' },
  { name: 'junjian', text: '军舰', image: '/static/cars/online/junjian.png' },
  { name: 'walk', text: '步行', image: '/static/cars/online/walk.png' },
]

// 每个宫格宽度（根据列数计算百分比）
const itemWidth = computed(() => {
  const cols = props.col > 0 ? props.col : 4
  return (100 / cols) + '%'
})

// 选择图标处理函数
const close = () => {
  visible.value = false
}

const handleSelect = (item: any) => {
  const selected = item as CarIconItem
  console.log('选择的图标:', selected, " at components/car-icons/car-icons.uvue:97")
  emit('select', selected)
  close()
}

// 弹窗点击处理
const handlePopupClick = () => {
  console.log('Popup clicked', " at components/car-icons/car-icons.uvue:104")
}

// 公开的方法
const open = () => {
  visible.value = true
}

// 根据图标名称获取图标信息
const getIconByName = (name: string): CarIconItem | null => {
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

const _component_i_grid = resolveEasyComponent("i-grid",_easycom_i_grid)
const _component_i_popup = resolveEasyComponent("i-popup",_easycom_i_popup)

  return _cV(_component_i_popup, _uM({
    show: visible.value,
    title: _ctx.title,
    mode: "bottom",
    safeBottom: _ctx.safeAreaInsetBottom,
    showClose: "",
    onClose: close,
    onClick: handlePopupClick
  }), _uM({
    default: withSlotCtx((): any[] => [
      _cE("scroll-view", _uM({
        class: "icon-selector",
        "scroll-y": ""
      }), [
        _cV(_component_i_grid, _uM({
          items: iconList,
          col: 4,
          itemHeight: "88",
          round: "8",
          imageSize: 30,
          iconColor: "#3c9cff",
          textColor: "#606266",
          showBorder: true,
          onClick: ($event: any) => {handleSelect($event)}
        }), null, 8 /* PROPS */, ["onClick"])
      ])
    ]),
    _: 1 /* STABLE */
  }), 8 /* PROPS */, ["show", "title", "safeBottom"])
}
}

})
export default __sfc__
export type CarIconsComponentPublicInstance = InstanceType<typeof __sfc__>;
const GenComponentsCarIconsCarIconsStyles = [_uM([["icon-selector", _pS(_uM([["paddingTop", "20rpx"], ["paddingRight", "20rpx"], ["paddingBottom", "40rpx"], ["paddingLeft", "20rpx"], ["backgroundColor", "#ffffff"], ["width::-webkit-scrollbar", 4], ["backgroundColor::-webkit-scrollbar-thumb", "#dddddd"], ["borderTopLeftRadius::-webkit-scrollbar-thumb", 4], ["borderTopRightRadius::-webkit-scrollbar-thumb", 4], ["borderBottomRightRadius::-webkit-scrollbar-thumb", 4], ["borderBottomLeftRadius::-webkit-scrollbar-thumb", 4], ["backgroundColor::-webkit-scrollbar-track", "#f5f5f5"]]))], ["icon-grid", _uM([[".icon-selector ", _uM([["width", "100%"], ["display", "flex"], ["flexDirection", "row"], ["flexWrap", "wrap"]])]])], ["grid-item", _uM([[".icon-selector .icon-grid ", _uM([["display", "flex"], ["flexDirection", "column"], ["alignItems", "center"], ["justifyContent", "center"], ["paddingTop", "20rpx"], ["paddingRight", "10rpx"], ["paddingBottom", "20rpx"], ["paddingLeft", "10rpx"], ["width", "25%"], ["height", "100%"], ["transitionProperty", "all"], ["transitionDuration", "0.3s"], ["transitionTimingFunction", "ease"]])]])], ["@TRANSITION", _uM([["grid-item", _uM([["property", "all"], ["duration", "0.3s"], ["timingFunction", "ease"]])]])]])]
