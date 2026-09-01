import _easycom_i_icon from '@/uni_modules/i-ui-x/components/i-icon/i-icon.uvue'
import { computed, ref, watch } from 'vue'

type ActionPayload = { index: number, item: any, name: string, value: string }


const __sfc__ = defineComponent({
  __name: 'i-action-sheet',
name: 'i-action-sheet',
  props: {
  show: { type: Boolean, default: false },
  title: { type: String, default: '' },
  titleStyle: { type: [String, Object], default: '' },
  closeable: { type: Boolean, default: false },
  description: { type: String, default: '' },
  actions: { type: Array, default() { return [] } },
  cancelText: { type: String, default: '' },
  closeOnClickAction: { type: Boolean, default: true },
  safeBottom: { type: Boolean, default: true },
  openType: { type: String, default: '' },
  closeOnMask: { type: Boolean, default: true },
  height: { type: [String, Number], default: '' },
  round: { type: [String, Number], default: 10 },
  lang: { type: String, default: 'en' },
  sessionFrom: { type: String, default: '' },
  sendMessageTitle: { type: String, default: '' },
  sendMessagePath: { type: String, default: '' },
  sendMessageImg: { type: String, default: '' },
  showMessageCard: { type: Boolean, default: false },
  appParameter: { type: String, default: '' },
  customStyle: { type: [String, Object], default: '' },
},
  emits: ['select', 'close', 'getuserinfo', 'contact', 'getphonenumber', 'chooseavatar', 'error', 'launchapp', 'opensetting', 'update:show'],
  setup(__props, __setupCtx: SetupContext) {
const __expose = __setupCtx.expose
const __ins = getCurrentInstance()!;
const _ctx = __ins.proxy as InstanceType<typeof __sfc__>;
const _cache = __ins.renderCache;



const props = __props

function emit(event: string, ...do_not_transform_spread: Array<any | null>) {
__ins.emit(event, ...do_not_transform_spread)
}

function formatSize(value: string | number): string {
  const text = value.toString()
  if (text.length == 0) return '0px'
  if (text.indexOf('vh') >= 0 || text.indexOf('vw') >= 0) {
    const parsed = parseFloat(text.replace('vh', '').replace('vw', ''))
    return (isNaN(parsed) ? 0 : Number.from(parsed)).toString() + 'px'
  }
  if (text.indexOf('px') >= 0 || text.indexOf('rpx') >= 0 || text.indexOf('%') >= 0) return text
  return text + 'px'
}

function itemValue(item: any, keyName: string): string {
  if (item == null) return ''

  if (typeof item == 'object') {
    return (item as UTSJSONObject).getString(keyName, '')
  }







  if (keyName == 'name' || keyName == 'value') return item.toString()
  return ''
}

function itemBoolean(item: any, keyName: string): boolean {
  if (item == null || typeof item != 'object') return false

  return (item as UTSJSONObject).getBoolean(keyName, false)





}

function getActionText(item: any): string { return itemValue(item, 'name') }
function getActionValue(item: any): string {
  const value = itemValue(item, 'value')
  return value.length > 0 ? value : getActionText(item)
}
function getSubname(item: any): string { return itemValue(item, 'subname') }
function getActionIcon(item: any): string { return itemValue(item, 'icon') }
function getActionColor(item: any): string {
  const color = itemValue(item, 'color')
  return color.length > 0 ? color : '#303133'
}
function isDisabled(item: any): boolean {
  return itemBoolean(item, 'disabled')
}
function isLoading(item: any): boolean {
  return itemBoolean(item, 'loading')
}
function getItemColor(item: any): string { return isDisabled(item) ? '#b8b8b8' : getActionColor(item) }
function getActionOpenType(item: any): string {
  const itemOpenType = itemValue(item, 'openType')
  return itemOpenType.length > 0 ? itemOpenType : props.openType
}
function getItemClass(item: any): string {
  if (isDisabled(item)) return 'i-action-sheet__item i-action-sheet__item--disabled'
  return isLoading(item) ? 'i-action-sheet__item i-action-sheet__item--loading' : 'i-action-sheet__item'
}
function buildPayload(item: any, index: number): ActionPayload {
  return { index, item, name: getActionText(item), value: getActionValue(item) }
}

const actionItems = computed((): Array<any> => {
  const actions = props.actions
  if (actions == null) return [] as Array<any>
  return actions as Array<any>
})

const innerShow = ref<boolean>(props.show)

function open(): void {
  if (innerShow.value) return
  innerShow.value = true
  emit('update:show', true)
}
function closeSilently(): void {
  if (!innerShow.value) return
  innerShow.value = false
  emit('update:show', false)
}
function closeByUser(): void {
  if (!innerShow.value) return
  innerShow.value = false
  emit('close')
  emit('update:show', false)
}
function handleOverlayClick(): void { if (props.closeOnMask) closeByUser() }
function handleSelect(item: any, index: number): void {
  if (isDisabled(item) || isLoading(item)) return
  emit('select', buildPayload(item, index))
  if (props.closeOnClickAction) closeSilently()
}
function handleOpenEvent(name: string, event: any): void { emit(name, event) }

const titleStyleText = computed<string>(() : string => typeof props.titleStyle == 'string' ? props.titleStyle as string : '')
const panelStyle = computed<string>(() : string => {
  let style = 'border-top-left-radius:' + formatSize(props.round) + ';border-top-right-radius:' + formatSize(props.round) + ';'
  if (props.height.toString().length > 0) style += 'height:' + formatSize(props.height) + ';'
  if (typeof props.customStyle == 'string') style += props.customStyle as string
  return style
})

watch(() : boolean => props.show, (value: boolean) : void => { innerShow.value = value })
__expose({ open, close: closeByUser })

return (): any | null => {

const _component_i_icon = resolveEasyComponent("i-icon",_easycom_i_icon)

  return _cE("view", null, [
    _cE("view", _uM({
      class: "i-action-sheet__trigger",
      onClick: open
    }), [
      renderSlot(_ctx.$slots, "trigger", {}, (): any[] => [
        renderSlot(_ctx.$slots, "default")
      ])
    ]),
    isTrue(innerShow.value)
      ? _cE("view", _uM({
          key: 0,
          class: "i-action-sheet__mask",
          onClick: handleOverlayClick
        }))
      : _cC("v-if", true),
    isTrue(innerShow.value)
      ? _cE("view", _uM({
          key: 1,
          class: "i-action-sheet__panel",
          style: _nS(panelStyle.value)
        }), [
          isTrue(_ctx.closeable)
            ? _cE("view", _uM({
                key: 0,
                class: "i-action-sheet__close",
                onClick: closeByUser
              }), [
                _cE("text", _uM({ class: "i-action-sheet__close-text" }), "×")
              ])
            : _cC("v-if", true),
          isTrue(_ctx.title.length > 0 || _ctx.description.length > 0)
            ? _cE("view", _uM({
                key: 1,
                class: "i-action-sheet__header"
              }), [
                _ctx.title.length > 0
                  ? _cE("text", _uM({
                      key: 0,
                      class: "i-action-sheet__title",
                      style: _nS(titleStyleText.value)
                    }), _tD(_ctx.title), 5 /* TEXT, STYLE */)
                  : _cC("v-if", true),
                _ctx.description.length > 0
                  ? _cE("text", _uM({
                      key: 1,
                      class: "i-action-sheet__desc"
                    }), _tD(_ctx.description), 1 /* TEXT */)
                  : _cC("v-if", true)
              ])
            : _cC("v-if", true),
          _cE("scroll-view", _uM({
            "scroll-y": "true",
            class: "i-action-sheet__scroll"
          }), [
            _cE(Fragment, null, RenderHelpers.renderList(actionItems.value, (item, index, __index, _cached): any => {
              return _cE("button", _uM({
                key: index.toString() + '-' + getActionText(item),
                class: _nC(getItemClass(item)),
                disabled: isDisabled(item) || isLoading(item),
                "open-type": getActionOpenType(item),
                "app-parameter": _ctx.appParameter,
                lang: _ctx.lang,
                "session-from": _ctx.sessionFrom,
                "send-message-title": _ctx.sendMessageTitle,
                "send-message-path": _ctx.sendMessagePath,
                "send-message-img": _ctx.sendMessageImg,
                "show-message-card": _ctx.showMessageCard,
                onClick: () => {handleSelect(item, index)},
                onGetuserinfo: ($event: any) => {handleOpenEvent('getuserinfo', $event)},
                onContact: ($event: any) => {handleOpenEvent('contact', $event)},
                onGetphonenumber: ($event: any) => {handleOpenEvent('getphonenumber', $event)},
                onChooseavatar: ($event: any) => {handleOpenEvent('chooseavatar', $event)},
                onError: ($event: any) => {handleOpenEvent('error', $event)},
                onLaunchapp: ($event: any) => {handleOpenEvent('launchapp', $event)},
                onOpensetting: ($event: any) => {handleOpenEvent('opensetting', $event)}
              }), [
                _cE("view", _uM({ class: "i-action-sheet__item-inner" }), [
                  _cE("view", _uM({ class: "i-action-sheet__main" }), [
                    getActionIcon(item).length > 0
                      ? _cV(_component_i_icon, _uM({
                          key: 0,
                          class: "i-action-sheet__icon",
                          name: getActionIcon(item),
                          fontSize: "17",
                          color: getItemColor(item)
                        }), null, 8 /* PROPS */, ["name", "color"])
                      : _cC("v-if", true),
                    _cE("text", _uM({
                      class: "i-action-sheet__item-text",
                      style: _nS('color:' + getItemColor(item))
                    }), _tD(getActionText(item)), 5 /* TEXT, STYLE */)
                  ]),
                  getSubname(item).length > 0
                    ? _cE("text", _uM({
                        key: 0,
                        class: "i-action-sheet__subname"
                      }), _tD(getSubname(item)), 1 /* TEXT */)
                    : _cC("v-if", true),
                  isTrue(isLoading(item))
                    ? _cE("text", _uM({
                        key: 1,
                        class: "i-action-sheet__loading"
                      }), "加载中")
                    : _cC("v-if", true)
                ])
              ], 42 /* CLASS, PROPS, NEED_HYDRATION */, ["disabled", "open-type", "app-parameter", "lang", "session-from", "send-message-title", "send-message-path", "send-message-img", "show-message-card", "onClick", "onGetuserinfo", "onContact", "onGetphonenumber", "onChooseavatar", "onError", "onLaunchapp", "onOpensetting"])
            }), 128 /* KEYED_FRAGMENT */)
          ]),
          _ctx.cancelText.length > 0
            ? _cE("view", _uM({
                key: 2,
                class: "i-action-sheet__cancel",
                onClick: closeByUser
              }), [
                _cE("text", _uM({ class: "i-action-sheet__cancel-text" }), _tD(_ctx.cancelText), 1 /* TEXT */)
              ])
            : _cC("v-if", true),
          isTrue(props.safeBottom)
            ? _cE("view", _uM({
                key: 3,
                class: "i-action-sheet__safe-bottom"
              }))
            : _cC("v-if", true)
        ], 4 /* STYLE */)
      : _cC("v-if", true)
  ])
}
}

})
export default __sfc__
export type IActionSheetComponentPublicInstance = InstanceType<typeof __sfc__>;
const GenUniModulesIUiXComponentsIActionSheetIActionSheetStyles = [_uM([["i-action-sheet__trigger", _pS(_uM([["flexDirection", "column"]]))], ["i-action-sheet__mask", _pS(_uM([["position", "fixed"], ["left", 0], ["right", 0], ["top", 0], ["bottom", 0], ["zIndex", 99], ["backgroundColor", "rgba(0,0,0,0.45)"]]))], ["i-action-sheet__panel", _pS(_uM([["position", "fixed"], ["left", 0], ["right", 0], ["bottom", 0], ["zIndex", 100], ["backgroundColor", "#f7f7f7"], ["overflow", "hidden"]]))], ["i-action-sheet__close", _pS(_uM([["position", "absolute"], ["top", 10], ["right", 12], ["zIndex", 2], ["width", 32], ["height", 32], ["borderTopLeftRadius", 16], ["borderTopRightRadius", 16], ["borderBottomRightRadius", 16], ["borderBottomLeftRadius", 16], ["alignItems", "center"], ["justifyContent", "center"]]))], ["i-action-sheet__close-text", _pS(_uM([["color", "#909193"], ["fontSize", 24], ["lineHeight", "28px"]]))], ["i-action-sheet__header", _pS(_uM([["minHeight", 38], ["paddingTop", 8], ["paddingRight", 48], ["paddingBottom", 8], ["paddingLeft", 48], ["borderBottomWidth", 1], ["borderBottomStyle", "solid"], ["borderBottomColor", "#eeeeee"], ["backgroundColor", "#ffffff"], ["alignItems", "center"], ["justifyContent", "center"]]))], ["i-action-sheet__title", _pS(_uM([["color", "#909193"], ["fontSize", 14], ["fontWeight", 400], ["lineHeight", "20px"], ["textAlign", "center"]]))], ["i-action-sheet__desc", _pS(_uM([["marginTop", 4], ["color", "#909193"], ["fontSize", 13], ["lineHeight", "20px"], ["textAlign", "center"]]))], ["i-action-sheet__scroll", _pS(_uM([["maxHeight", 320], ["backgroundColor", "#ffffff"]]))], ["i-action-sheet__item", _pS(_uM([["minHeight", 51], ["paddingTop", 0], ["paddingRight", 0], ["paddingBottom", 0], ["paddingLeft", 0], ["marginTop", 0], ["marginRight", 0], ["marginBottom", 0], ["marginLeft", 0], ["borderTopLeftRadius", 0], ["borderTopRightRadius", 0], ["borderBottomRightRadius", 0], ["borderBottomLeftRadius", 0], ["backgroundColor", "#ffffff"], ["borderTopWidth", 1], ["borderTopStyle", "solid"], ["borderTopColor", "#f2f3f5"]]))], ["i-action-sheet__item--disabled", _pS(_uM([["backgroundColor", "#fafafa"], ["opacity", 1]]))], ["i-action-sheet__item--loading", _pS(_uM([["opacity", 0.72]]))], ["i-action-sheet__item-inner", _pS(_uM([["minHeight", 51], ["paddingTop", 8], ["paddingRight", 16], ["paddingBottom", 8], ["paddingLeft", 16], ["alignItems", "center"], ["justifyContent", "center"]]))], ["i-action-sheet__main", _pS(_uM([["flexDirection", "row"], ["alignItems", "center"], ["justifyContent", "center"]]))], ["i-action-sheet__icon", _pS(_uM([["marginRight", 6]]))], ["i-action-sheet__item-text", _pS(_uM([["fontSize", 15], ["lineHeight", "22px"], ["textAlign", "center"]]))], ["i-action-sheet__subname", _pS(_uM([["marginTop", 2], ["color", "#909193"], ["fontSize", 12], ["lineHeight", "18px"], ["textAlign", "center"]]))], ["i-action-sheet__loading", _pS(_uM([["marginTop", 2], ["color", "#909193"], ["fontSize", 12], ["lineHeight", "18px"]]))], ["i-action-sheet__cancel", _pS(_uM([["minHeight", 52], ["marginTop", 8], ["backgroundColor", "#ffffff"], ["alignItems", "center"], ["justifyContent", "center"]]))], ["i-action-sheet__cancel-text", _pS(_uM([["color", "#303133"], ["fontSize", 16], ["lineHeight", "22px"]]))], ["i-action-sheet__safe-bottom", _pS(_uM([["height", 12], ["backgroundColor", "#ffffff"]]))]])]
