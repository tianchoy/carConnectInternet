import _easycom_i_button from '@/uni_modules/i-ui-x/components/i-button/i-button.uvue'
import { computed, nextTick, ref, watch } from 'vue'

type IFormField = {
  name : string,
  label : string,
  value : any | null,
  hasValue : boolean,
  required : boolean,
  message : string,
}

type IFormError = {
  field : string,
  message : string,
}

type IFormValidatePayload = {
  valid : boolean,
  message : string,
  errors : Array<IFormError>,
  values : UTSJSONObject,
}

type IFormSubmitPayload = {
  valid : boolean,
  values : UTSJSONObject,
  errors : Array<IFormError>,
  message : string,
}

type IFormResetPayload = {
  values : UTSJSONObject,
}

type IFormScrollPayload = {
  field : string,
  targetId : string,
  selector : string,
  offsetTop : number,
  duration : number,
}


const __sfc__ = defineComponent({
  __name: 'i-form',
name: 'i-form',
  props: {
  modelValue: {
    type: Object,
    default() {
      return {}
    },
  },
  fields: {
    type: Array,
    default() {
      return []
    },
  },
  rules: {
    type: Array,
    default() {
      return []
    },
  },
  showActions: {
    type: Boolean,
    default: false,
  },
  submitText: {
    type: String,
    default: '提交',
  },
  resetText: {
    type: String,
    default: '重置',
  },
  labelDirection: {
    type: String,
    default: 'horizontal',
  },
  errorAlign: {
    type: String,
    default: 'left',
  },
  errorAutoPage: {
    type: Boolean,
    default: true,
  },
  scrollOffsetTop: {
    type: [String, Number],
    default: 12,
  },
  scrollDuration: {
    type: [String, Number],
    default: 300,
  },
  scrollIdPrefix: {
    type: String,
    default: 'i-form-item-',
  },
  watchValidStatus: {
    type: Boolean,
    default: false,
  },
  modelValid: {
    type: Boolean,
    default: false,
  },
},
  emits: ["submit", "reset", "validate", "scroll-to-error", "update:modelValid", "update:valid"],
  setup(__props, __setupCtx: SetupContext) {
const __expose = __setupCtx.expose
const __ins = getCurrentInstance()!;
const _ctx = __ins.proxy as InstanceType<typeof __sfc__>;
const _cache = __ins.renderCache;



/**
 * Props 说明：依据 DCloud uni-app x form，提供表单容器、校验和提交能力。
 * - modelValue: 表单数据对象，和 rules/fields 中的 name 对应。
 * - fields: 字段配置数组，兼容旧版写法；支持 name、label、value、required、message。
 * - rules: 校验规则数组；当 fields 为空时使用，支持 required、message、validator。
 * - showActions: 是否显示内置提交/重置按钮。
 * - submitText/resetText: 内置按钮文案。
 * - labelDirection: 标签方向，horizontal 横向，vertical 纵向。
 * - errorAlign: 错误信息对齐方式，left、center、right。
 * - errorAutoPage: 校验失败后是否滚动到首个错误字段。
 * - scrollOffsetTop: 滚动到错误字段时的顶部偏移。
 * - scrollDuration: 滚动动画时长。
 * - scrollIdPrefix: 字段滚动定位 id 前缀，需要和 i-form-item 保持一致。
 * - watchValidStatus: 是否在字段变化时实时输出 modelValid。
 * - modelValid: 当前校验状态，建议通过 v-model:valid 或 update:modelValid 读取。
 */
const props = __props

/**
 * Emits 说明：表单校验和提交状态。
 * - submit: 提交表单时触发，参数包含 valid、values、errors。
 * - reset: 重置组件状态时触发。
 * - validate: 触发表单校验时触发。
 * - scroll-to-error: 校验失败并准备滚动到错误项时触发，参数包含 field、targetId、selector。
 * - update:modelValid/update:valid: 输出实时或手动校验结果。
 */
function emit(event: string, ...do_not_transform_spread: Array<any | null>) {
__ins.emit(event, ...do_not_transform_spread)
}

function objectText(object : UTSJSONObject, keyName : string) : string {
  const value = object[keyName]
  return value == null ? '' : value.toString()
}

function normalizeField(raw : any | null) : IFormField | null {
  if (raw == null || typeof raw != 'object') return null
  const object = raw as UTSJSONObject
  const value = object['value']
  return {
    name: objectText(object, 'name'),
    label: objectText(object, 'label'),
    value,
    hasValue: value != null,
    required: object['required'] == true,
    message: objectText(object, 'message'),
  }
}

function normalizeFields(value : Array<any | null> | null) : Array<IFormField> {
  const result : Array<IFormField> = []
  if (value == null) return result
  for (let i = 0; i < value.length; i++) {
    const field = normalizeField(value[i])
    if (field != null) result.push(field)
  }
  return result
}

function activeFields() : Array<IFormField> {
  const fields = normalizeFields(props.fields)
  if (fields.length > 0) return fields
  return normalizeFields(props.rules)
}

function modelFieldValue(name : string) : any | null {
  const model = props.modelValue
  if (model == null || typeof model != 'object') return null
  return (model as UTSJSONObject)[name]
}

function fieldValue(item : IFormField) : any {
  const configuredValue = item.value
  if (item.hasValue && configuredValue != null) return configuredValue
  if (item.name.length == 0) return ''
  const value = modelFieldValue(item.name)
  return value == null ? '' : value
}

function fieldLabel(item : IFormField) : string {
  const label = item.label.length > 0 ? item.label : item.name
  return label.length > 0 ? label : '字段'
}

function fieldMessage(item : IFormField) : string {
  if (item.message.length > 0) return item.message
  return fieldLabel(item) + '不能为空'
}

function checkField(item : IFormField, selectedKeys : Array<string>) : string {
  if (selectedKeys.length > 0 && selectedKeys.indexOf(item.name) < 0) return ''
  const value = fieldValue(item)
  if (item.required && value.toString().length == 0) return fieldMessage(item)
  return ''
}

function collectValues() : UTSJSONObject {
  const values : UTSJSONObject = {}
  const list = activeFields()
  for (let i = 0; i < list.length; i++) {
    const item = list[i]
    if (item.name.length > 0) values[item.name] = fieldValue(item)
  }
  return values
}

function normalizeIdName(name : string) : string {
  const allowed = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_'
  let result = ''
  for (let i = 0; i < name.length; i++) {
    const char = name.charAt(i)
    result += allowed.indexOf(char) >= 0 ? char : '-'
  }
  return result
}

function scrollTargetId(name : string) : string {
  return props.scrollIdPrefix + normalizeIdName(name)
}

const valid = ref(true)
const message = ref('')
const errors = ref<Array<IFormError>>([])

const formClass = computed(() : string => {
  const classes = ['i-form']
  if (props.labelDirection == 'vertical') classes.push('i-form--vertical')
  return classes.join(' ')
})

const messageClass = computed(() : string => {
  return valid.value
    ? 'i-form__message i-form__message--success'
    : 'i-form__message i-form__message--error'
})

const messageStyle = computed(() : string => {
  return 'text-align:' + props.errorAlign + ';'
})

function scrollToFirstError(nextErrors : Array<IFormError>) : void {
  if (!props.errorAutoPage || nextErrors.length == 0) return
  const field = nextErrors[0].field
  if (field.length == 0) return
  const targetId = scrollTargetId(field)
  const selector = '#' + targetId
  const offsetTop = parseFloat(props.scrollOffsetTop.toString())
  const duration = parseFloat(props.scrollDuration.toString())
  const payload : IFormScrollPayload = {
    field,
    targetId,
    selector,
    offsetTop,
    duration,
  }
  emit('scroll-to-error', payload)
  nextTick(() : void => {
    uni.pageScrollTo({ selector, offsetTop, duration })
  })
}

function validateFields(selectedKeys : Array<string>, silent : boolean) : boolean {
  const list = activeFields()
  const nextErrors : Array<IFormError> = []
  for (let i = 0; i < list.length; i++) {
    const item = list[i]
    const errorMessage = checkField(item, selectedKeys)
    if (errorMessage.length > 0) {
      const error : IFormError = { field: item.name, message: errorMessage }
      nextErrors.push(error)
    }
  }
  errors.value = nextErrors
  valid.value = nextErrors.length == 0
  if (!silent) {
    message.value = valid.value ? '校验通过' : (nextErrors[0].message).toString()
    const payload : IFormValidatePayload = {
      valid: valid.value,
      message: message.value,
      errors: nextErrors,
      values: collectValues(),
    }
    emit('validate', payload)
    if (!valid.value) scrollToFirstError(nextErrors)
  }
  emit('update:modelValid', valid.value)
  emit('update:valid', valid.value)
  return valid.value
}

function validate() : boolean {
  return validateFields([], false)
}

function validFields(keys : Array<string>) : boolean {
  return validateFields(keys, false)
}

function checkAsyncVaildStatus() : boolean {
  return validateFields([], true)
}

function clearValid() : void {
  valid.value = true
  message.value = ''
  errors.value = []
  emit('update:modelValid', true)
  emit('update:valid', true)
}

function submit() : void {
  const isValid = validate()
  const result : IFormSubmitPayload = {
    valid: isValid,
    values: collectValues(),
    errors: errors.value,
    message: message.value,
  }
  emit('submit', result)
}

function reset() : void {
  clearValid()
  const payload : IFormResetPayload = { values: collectValues() }
  emit('reset', payload)
}

watch(
  () : Array<any | null> | null => props.fields,
  () : void => {
    if (props.watchValidStatus) validateFields([], true)
  },
  { deep: true }
)

watch(
  () : Array<any | null> | null => props.rules,
  () : void => {
    if (props.watchValidStatus) validateFields([], true)
  },
  { deep: true }
)

watch(
  () : any | null => props.modelValue,
  () : void => {
    if (props.watchValidStatus) validateFields([], true)
  },
  { deep: true }
)

watch(
  () : boolean => props.watchValidStatus,
  (value : boolean) : void => {
    if (value) validateFields([], true)
  }
)

__expose({
  valid: validFields,
  validate,
  clearValid,
  checkAsyncVaildStatus,
  submit,
  reset,
})

return (): any | null => {

const _component_i_button = resolveEasyComponent("i-button",_easycom_i_button)

  return _cE("view", _uM({
    class: _nC(formClass.value)
  }), [
    renderSlot(_ctx.$slots, "default"),
    message.value.length > 0
      ? _cE("text", _uM({
          key: 0,
          class: _nC(messageClass.value),
          style: _nS(messageStyle.value)
        }), _tD(message.value), 7 /* TEXT, CLASS, STYLE */)
      : _cC("v-if", true),
    isTrue(_ctx.showActions)
      ? _cE("view", _uM({
          key: 1,
          class: "i-form__actions"
        }), [
          _cV(_component_i_button, _uM({
            size: "small",
            plain: "",
            onClick: reset
          }), _uM({
            default: withSlotCtx((): any[] => [_tD(_ctx.resetText)]),
            _: 1 /* STABLE */
          })),
          _cV(_component_i_button, _uM({
            size: "small",
            type: "primary",
            onClick: submit
          }), _uM({
            default: withSlotCtx((): any[] => [_tD(_ctx.submitText)]),
            _: 1 /* STABLE */
          }))
        ])
      : _cC("v-if", true)
  ], 2 /* CLASS */)
}
}

})
export default __sfc__
export type IFormComponentPublicInstance = InstanceType<typeof __sfc__>;
const GenUniModulesIUiXComponentsIFormIFormStyles = [_uM([["i-form", _pS(_uM([["paddingTop", 4], ["paddingRight", 0], ["paddingBottom", 4], ["paddingLeft", 0]]))], ["i-form__message", _pS(_uM([["marginTop", 10], ["fontSize", 13], ["lineHeight", "20px"]]))], ["i-form__message--success", _pS(_uM([["color", "#19be6b"]]))], ["i-form__message--error", _pS(_uM([["color", "#fa3534"]]))], ["i-form__actions", _pS(_uM([["marginTop", 12], ["flexDirection", "row"], ["justifyContent", "flex-end"]]))]])]
