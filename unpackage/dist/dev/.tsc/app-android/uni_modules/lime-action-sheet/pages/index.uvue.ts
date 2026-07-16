import _easycom_l_popup from '@/uni_modules/lime-popup/components/l-popup/l-popup.uvue'
import { ActionSheetItem } from '@/uni_modules/lime-action-sheet/components/l-action-sheet/type'
	
	
const __sfc__ = defineComponent({
  __name: 'index',
  setup(__props) {
const __ins = getCurrentInstance()!;
const _ctx = __ins.proxy as InstanceType<typeof __sfc__>;
const _cache = __ins.renderCache;

	const instance = getCurrentInstance()!
	const actionItems = shallowRef<ActionSheetItem[]>([]);
	const description = shallowRef('')
	const title = shallowRef('')
	const cancelText = shallowRef('')
	const align = shallowRef('center')
	const bordered = shallowRef(false)
	const closeable = shallowRef(false)
	const overlay = shallowRef(true);
	const rowCol = ref<number[]|null>(null);
	
	const innerValue = ref(false)
	
	let selected = ref(-1)
	let parentKey = ref(`action-sheet-1`);
	
	onLoad((options: OnLoadOptions)=>{
		const param = UTSAndroid.consoleDebugError(JSON.parseObject(`${options['param'] ?? '{}'}`), " at uni_modules/lime-action-sheet/pages/index.uvue:119")!
		parentKey.value = param.getString('key') ?? `action-sheet-1`; 
		description.value = param.getString('description') ?? '';
		title.value = param.getString('title') ?? '';
		cancelText.value = param.getString('cancelText') ?? '';
		align.value = param.getString('align') ?? 'center';
		bordered.value = param.getBoolean('bordered') ?? false;
		closeable.value = param.getBoolean('closeable') ?? true;
		rowCol.value = param.getArray<number>('rowCol');
		const list = param.getArray<UTSJSONObject>('list')
		const isImage = (name: string|null):boolean => {
			if(name == null) return false;
			return /\.(jpe?g|png|gif|bmp|webp|tiff?)$/i.test(name) || /^data:image\/(jpeg|png|gif|bmp|webp|tiff);base64,/.test(name)
		}
		actionItems.value = list?.map((it, index):ActionSheetItem => ({
			label: it.getString('label') ?? '',
			color: it.getString('color'),
			icon: it.getString('icon'),
			iconColor: it.getString('iconColor'),
			bgColor: it.getString('bgColor'),
			fontSize: it.getString('fontSize') ?? '32rpx',
			disabled: it.getBoolean('disabled') ?? false,
			radius: it.getString('radius'),
			__index:index,
			__isImage: isImage(it.getString('icon'))
		}))??[]
		
		nextTick(()=>{
			innerValue.value = true
		})
	})
	
	const actionRowCols = computed(():ActionSheetItem[][]=>{
		const result: ActionSheetItem[][] = [];
		const _rowCol = rowCol.value
		if(_rowCol == null) return result
		const list = [...actionItems.value] //toRaw(actionItems.value) as ActionSheetItem[]
		const rows = _rowCol.length;
		
		for (let i = 0; i < rows; i++) {
			let cols = _rowCol[i]
			const row: ActionSheetItem[] = [];
			
			while(cols > 0 && list.length > 0) {
				const item = list.shift()
				cols--
				row.push(item!)
			}
			if(row.length > 0) {
				result.push(row)
			}
		}
		if(list.length > 0) {
			result.push(list)
		}
		return result
	})
	const handleSelected = (item:ActionSheetItem) => {
		if(item.disabled) return;
		innerValue.value = false;
		selected.value = item.__index
	}
	const handleCancel = () =>{
		innerValue.value = false
		selected.value = -1
	}
	const onClose = ()=>{
		uni.closeDialogPage({
			dialogPage: instance.proxy!.$page,
			fail(err){
				console.log('err', err, " at uni_modules/lime-action-sheet/pages/index.uvue:189")
			}
		})
		uni.$emit(parentKey.value, selected.value)
	}

return (): any | null => {

const _component_l_icon = resolveComponent("l-icon")
const _component_l_popup = resolveEasyComponent("l-popup",_easycom_l_popup)

  return _cV(_component_l_popup, _uM({
    modelValue: unref(innerValue),
    "onUpdate:modelValue": $event => {trySetRefValue(innerValue, $event)},
    position: "bottom",
    onClosed: onClose
  }), _uM({
    default: withSlotCtx((): any[] => [
      _cE("view", _uM({ class: "l-action-sheet" }), [
        isTrue(unref(title).length > 0 || _ctx.$slots['title'] != null)
          ? _cE("view", _uM({
              key: 0,
              class: "l-action-sheet__title"
            }), [
              renderSlot(_ctx.$slots, "title"),
              unref(title).length > 0
                ? _cE("text", _uM({
                    key: 0,
                    class: "l-action-sheet__title-text"
                  }), _tD(unref(title)), 1 /* TEXT */)
                : _cC("v-if", true),
              isTrue(unref(closeable))
                ? _cE("text", _uM({
                    key: 1,
                    class: "l-action-sheet__close-btn",
                    onClick: handleCancel
                  }), "")
                : _cC("v-if", true)
            ])
          : _cC("v-if", true),
        renderSlot(_ctx.$slots, "description", {}, (): any[] => [
          unref(description).length > 0
            ? _cE("text", _uM({
                key: 0,
                class: _nC(["l-action-sheet__description", _uM({'l-action-sheet__description--left': unref(align) == 'left'})])
              }), _tD(unref(description)), 3 /* TEXT, CLASS */)
            : _cC("v-if", true)
        ]),
        _cE("view", _uM({ class: "l-action-sheet__content" }), [
          unref(rowCol) == null
            ? _cE(Fragment, _uM({ key: 0 }), RenderHelpers.renderList(unref(actionItems), (item, index, __index, _cached): any => {
                return _cE("view", _uM({
                  class: _nC(["l-action-sheet__item", _uM({
							'l-action-sheet__item--left': unref(align) == 'left',
							'l-action-sheet__item--bordered': unref(bordered) && index != unref(actionItems).length - 1,
							'l-action-sheet__item--disabled': item.disabled,
						})]),
                  "hover-class": !item.disabled ? 'l-action-sheet__item--hover': '',
                  onClick: () => {handleSelected(item)},
                  key: index
                }), [
                  item.icon != null
                    ? _cV(_component_l_icon, _uM({
                        key: 0,
                        class: "l-action-sheet__item-icon",
                        color: item.iconColor ?? item.color,
                        size: item.fontSize,
                        name: item.icon
                      }), null, 8 /* PROPS */, ["color", "size", "name"])
                    : _cC("v-if", true),
                  _cE("text", _uM({
                    class: "l-action-sheet__item-text",
                    style: _nS([
								item.color !=null ? 'color:' + item.color: '',
								item.fontSize !=null ? 'font-size:' + item.fontSize : '',
							])
                  }), _tD(item.label), 5 /* TEXT, STYLE */)
                ], 10 /* CLASS, PROPS */, ["hover-class", "onClick"])
              }), 128 /* KEYED_FRAGMENT */)
            : _cE(Fragment, _uM({ key: 1 }), RenderHelpers.renderList(unref(actionRowCols), (row, rowIndex, __index, _cached): any => {
                return _cE("scroll-view", _uM({
                  class: _nC(["l-action-sheet__row", _uM({
							'l-action-sheet__row--border': rowIndex > 0 && rowIndex < unref(actionRowCols).length,
						})]),
                  "scroll-x": true,
                  direction: "horizontal",
                  "show-scrollbar": false,
                  "scroll-with-animation": true,
                  key: 'row' + rowIndex
                }), [
                  _cE(Fragment, null, RenderHelpers.renderList(row, (item, colIndex, __index, _cached): any => {
                    return _cE("view", _uM({
                      class: _nC(["l-action-sheet__col", _uM({
								'l-action-sheet__item--disabled': item.disabled,
								'l-action-sheet__col--evenly': !(row.length > 4),
							})]),
                      onClick: () => {handleSelected(item)},
                      key: colIndex
                    }), [
                      isTrue(item.icon != null && item.__isImage)
                        ? _cE("image", _uM({
                            key: 0,
                            class: "l-action-sheet__image",
                            style: _nS([
								'background: transparent',
								item.radius != null ? 'border-radius:' + item.radius : '',
							]),
                            src: item.icon
                          }), null, 12 /* STYLE, PROPS */, ["src"])
                        : item.icon != null
                          ? _cE("view", _uM({
                              key: 1,
                              class: "l-action-sheet__image l-action-sheet__image--center",
                              style: _nS([
								item.bgColor != null ? 'background:' + item.bgColor : '',
								item.radius != null ? 'border-radius:' + item.radius : '',
							])
                            }), [
                              _cV(_component_l_icon, _uM({
                                class: "l-action-sheet__col-icon",
                                color: item.iconColor ?? item.color,
                                size: item.fontSize??'48rpx',
                                name: item.icon
                              }), null, 8 /* PROPS */, ["color", "size", "name"])
                            ], 4 /* STYLE */)
                          : _cC("v-if", true),
                      _cE("text", _uM({
                        class: "l-action-sheet__col-text",
                        style: _nS([
									item.color !=null ? 'color:' + item.color: '',
									item.fontSize !=null ? 'font-size:' + item.fontSize : '',
								])
                      }), _tD(item.label), 5 /* TEXT, STYLE */)
                    ], 10 /* CLASS, PROPS */, ["onClick"])
                  }), 128 /* KEYED_FRAGMENT */)
                ], 2 /* CLASS */)
              }), 128 /* KEYED_FRAGMENT */)
        ]),
        unref(cancelText).length > 0
          ? _cE("view", _uM({
              key: 1,
              class: "l-action-sheet__gap"
            }))
          : _cC("v-if", true),
        unref(cancelText).length > 0
          ? _cE("view", _uM({
              key: 2,
              class: "l-action-sheet__cancel",
              "hover-class": "l-action-sheet__cancel--hover",
              onClick: handleCancel
            }), [
              _cE("text", _uM({ class: "l-action-sheet__cancel-text" }), _tD(unref(cancelText)), 1 /* TEXT */)
            ])
          : _cC("v-if", true)
      ])
    ]),
    _: 3 /* FORWARDED */
  }), 8 /* PROPS */, ["modelValue"])
}
}

})
export default __sfc__
const GenUniModulesLimeActionSheetPagesIndexStyles = [_uM([["l-action-sheet", _pS(_uM([["borderTopLeftRadius", "var(--l-action-sheet-border-radius, 9px)"], ["borderTopRightRadius", "var(--l-action-sheet-border-radius, 9px)"]]))], ["l-action-sheet__item", _pS(_uM([["height", "var(--l-action-sheet-item-height, 56px)"], ["justifyContent", "center"], ["alignItems", "center"], ["flexDirection", "row"], ["paddingTop", 0], ["paddingRight", 16], ["paddingBottom", 0], ["paddingLeft", 16]]))], ["l-action-sheet__item-text", _pS(_uM([["color", "var(--l-action-sheet-color, #000000E0)"], ["fontSize", "var(--l-action-sheet-font-size, 16px)"], ["marginLeft", 8], ["marginRight", 8]]))], ["l-action-sheet__item-icon", _pS(_uM([["color", "var(--l-action-sheet-color, #000000E0)"], ["fontSize", "var(--l-action-sheet-font-size, 16px)"]]))], ["l-action-sheet__item--hover", _pS(_uM([["backgroundColor", "var(--l-action-sheet-hover-color, #e7e7e7)"]]))], ["l-action-sheet__item--left", _pS(_uM([["justifyContent", "flex-start"]]))], ["l-action-sheet__item--disabled", _pS(_uM([["opacity", 0.5]]))], ["l-action-sheet__item--bordered", _pS(_uM([["borderBottomWidth", 0.5], ["borderBottomStyle", "solid"], ["borderBottomColor", "var(--l-action-sheet-border-color, #e7e7e7)"]]))], ["l-action-sheet__gap", _pS(_uM([["height", "var(--l-action-sheet-gap-height, 8px)"], ["backgroundColor", "var(--l-action-sheet-gap-color, #f3f3f3)"]]))], ["l-action-sheet__cancel", _pS(_uM([["display", "flex"], ["backgroundColor", "var(--l-action-sheet-cancel-bg-color, #fff)"], ["height", "var(--l-action-sheet-cancel-height, 48px)"], ["justifyContent", "center"], ["alignItems", "center"], ["boxSizing", "content-box"]]))], ["l-action-sheet__cancel--hover", _pS(_uM([["backgroundColor", "var(--l-action-sheet-hover-color, #e7e7e7)"]]))], ["l-action-sheet__cancel-text", _pS(_uM([["color", "var(--l-action-sheet-cancel-color, #000000E0)"], ["fontSize", "var(--l-action-sheet-font-size, 16px)"]]))], ["l-action-sheet__title", _pS(_uM([["display", "flex"], ["alignItems", "center"], ["justifyContent", "center"], ["boxSizing", "content-box"], ["paddingTop", "var(--l-action-sheet-title-padding, 16px)"], ["paddingRight", "var(--l-action-sheet-title-padding, 16px)"], ["paddingBottom", "var(--l-action-sheet-title-padding, 16px)"], ["paddingLeft", "var(--l-action-sheet-title-padding, 16px)"], ["position", "relative"]]))], ["l-action-sheet__title-text", _pS(_uM([["fontSize", "var(--l-action-sheet-title-font-size, 18px)"], ["fontWeight", "var(--l-action-sheet-title-font-weight, 700)"], ["color", "var(--l-action-sheet-title-color, #000000E0)"]]))], ["l-action-sheet__close-btn", _pS(_uM([["fontFamily", "l"], ["position", "absolute"], ["top", "var(--l-action-sheet-close-btn-spacing, 16px)"], ["right", "var(--l-action-sheet-close-btn-spacing, 16px)"], ["fontSize", "var(--l-action-sheet-close-btn-font-size, 20px)"], ["color", "var(--l-action-sheet-close-btn-color, #000000E0)"]]))], ["l-action-sheet__description", _pS(_uM([["color", "var(--l-action-sheet-description-color, #00000073)"], ["lineHeight", "var(--l-action-sheet-description-line-height, 22px)"], ["fontSize", "var(--l-action-sheet-description-font-size, 14px)"], ["textAlign", "var(--l-action-sheet-text-align, center)"], ["paddingTop", "var(--l-action-sheet-description-padding-y, 12px)"], ["paddingRight", "var(--l-action-sheet-description-padding-x, 16px)"], ["paddingBottom", "var(--l-action-sheet-description-padding-y, 12px)"], ["paddingLeft", "var(--l-action-sheet-description-padding-x, 16px)"], ["borderBottomWidth", 0.5], ["borderBottomStyle", "solid"], ["borderBottomColor", "var(--l-action-sheet-border-color, #e7e7e7)"]]))], ["l-action-sheet__description--left", _pS(_uM([["textAlign", "left"]]))], ["l-action-sheet__wrap", _pS(_uM([["display", "flex"], ["paddingTop", 16], ["paddingBottom", 16], ["flexDirection", "row"], ["flexWrap", "nowrap"]]))], ["l-action-sheet__row", _pS(_uM([["paddingTop", 16], ["paddingBottom", 16], ["flexDirection", "row"]]))], ["l-action-sheet__row--border", _pS(_uM([["borderTopWidth", 0.8], ["borderTopStyle", "solid"], ["borderTopColor", "var(--l-action-sheet-border-color, #e7e7e7)"]]))], ["l-action-sheet__col", _pS(_uM([["justifyContent", "center"], ["alignItems", "center"]]))], ["l-action-sheet__col--evenly", _pS(_uM([["flexGrow", 1], ["flexShrink", 1], ["flexBasis", "0%"]]))], ["l-action-sheet__col-text", _pS(_uM([["color", "var(--l-action-sheet-color, #000000E0)"], ["paddingTop", "var(--l-action-sheet-col-text-padding, 12px)"], ["fontSize", "var(--l-action-sheet-col-font-size, 12px)"]]))], ["l-action-sheet__col-icon", _pS(_uM([["fontSize", "var(--l-action-sheet-icon-size, 24px)"], ["color", "var(--l-action-sheet-color, #000000E0)"]]))], ["l-action-sheet__image", _pS(_uM([["width", "var(--l-action-sheet-image-size, 48px)"], ["height", "var(--l-action-sheet-image-size, 48px)"], ["marginTop", 0], ["marginRight", 16], ["marginBottom", 0], ["marginLeft", 16], ["backgroundColor", "var(--l-action-sheet-image-bg-color, #0000000A)"], ["borderTopLeftRadius", 99], ["borderTopRightRadius", 99], ["borderBottomRightRadius", 99], ["borderBottomLeftRadius", 99]]))], ["l-action-sheet__image--center", _pS(_uM([["justifyContent", "center"], ["alignItems", "center"]]))]])]
