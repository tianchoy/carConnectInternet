# lime-date-time-picker 时间选择器
一个功能丰富的时间选择器组件，用于选择时间，支持日期、时分等时间维度。

> 插件依赖：`lime-shared`、`lime-picker`

## 文档链接
📚 组件详细文档请访问以下站点：
- [时间选择器文档 - 站点1](https://limex.qcoon.cn/components/date-time-picker.html)
- [时间选择器文档 - 站点2](https://limeui.netlify.app/components/date-time-picker.html)
- [时间选择器文档 - 站点3](https://limeui.familyzone.top/components/date-time-picker.html)

## 安装方法
1. 在uni-app插件市场中搜索并导入`lime-date-time-picker`
2. 首次导入可能需要重新编译

## 代码演示

### 基础使用
通过 `v-model` 绑定当前选中的日期，通过 `start` 和 `end` 属性来设定可选的时间范围。在实际场景中 通常搭配 [Popup](https://ext.dcloud.net.cn/plugin?id=20769)一起使用。
```html
<l-date-time-picker 
	title="选择日期"
	v-model="value"
	confirm-btn="确认"
	cancel-btn="取消"
	start="2020-6-30"
	end="2025-6-30"
	@confirm="onConfirm"
	@change="onChange">
</l-date-time-picker>
```
```js
const value = ref('2024-05-02');

const onConfirm = (value: string) => {
	console.log('onConfirm', value)
}
const onChange = (value: string) => {
	console.log('onChange', value)
}

```

### 类型选择
通过 `mode` 属性可以控制选项的类型，它可以是number,也可以是中文或英文，支持以任意顺序对 `1 = 年 = year` 、 `2 = 月 = month` 、 `4 = 日 = date` 、 `8 = 时 = hour` 、 `16 = 分 = minute` 、 `32 = 秒 = second` 进行排列组合。

比如：<br>

传入 `1` 来单独选择年份<br>。
传入 `2` 来单独选择月份<br>。
传入 `1|2` 来选择年份和月份，位运算结果：`3`传入`3`也可以<br>。
传入 `2|4` 来选择月份和日期，位运算结果：`6`传入`6`也可以<br>。
传入 `1|2|4` 来选择年月日，位运算结果：`7`传入`7`也可以<br>。
传入 `4|8` 来选择日时，位运算结果：`12`传入`12`也可以<br>。
传入 `8|16` 来选择时分，位运算结果：`24`传入`24`也可以<br>。
传入 `8|16|32` 来选择时分秒，位运算结果：`56`传入`56`也可以<br>。
传入 `1|2|4|8` 来选择年月日时，位运算结果：`15`传入`15`也可以<br>。
传入 `1|2|4|8|16` 来选择年月日时分，位运算结果：`31`传入`31`也可以<br>。
传入 `1|2|4|8|16|32` 来选择年月日时分秒，位运算结果：`63`传入`63`也可以<br>。
任意组合，但必须是连续的。不能相隔即不能`日`和`分`这种组合，如果觉得数字不够直观，也可以直接写对应的中文或英文
```html
// 数值
<l-date-time-picker 
	title="选择日期"
	:mode="1|2|4"
	confirm-btn="确认"
	cancel-btn="取消"
	@confirm="onConfirm"
	@change="onChange">
</l-date-time-picker>
//文本
<l-date-time-picker 
	title="选择日期"
	mode="年月日时分"
	confirm-btn="确认"
	cancel-btn="取消"
	@confirm="onConfirm"
	@change="onChange">
</l-date-time-picker>
```
```js
const value = ref('2024-05-02')
```


### 自定义label
通过传入 `renderLabel` 函数，可以对选项文字进行格式化处理。
```html
<l-date-time-picker 
	title="选择日期" 
	confirm-btn="确认"
	cancel-btn="取消"
	start="2020-6-30"
	end="2025-6-30"
	format="YYYY-MM-DD"
	:renderLabel="renderLabel"
	@confirm="onConfirm">
</l-date-time-picker>
```
```js
import type { TimeModeValues } from '@/uni_modules/lime-date-time-picker'
const renderLabel = (type: TimeModeValues, value: string): string => {
	if(type == 'year') {
		return `${value}年`
	}
	return value
}
```

### 过滤项
通过传入 `customFilter` 函数，可以对选项数组进行过滤，实现自定义选项间隔。
```html
<l-date-time-picker 
	title="选择日期" 
	confirm-btn="确认"
	cancel-btn="取消"
	start="2020-6-30"
	end="2025-6-30"
	format="YYYY-MM-DD"
	:customFilter="filter"
	@confirm="onConfirm">
</l-date-time-picker>
```
```js
import type { DateTimePickerColumn, TimeModeValues } from '@/uni_modules/lime-date-time-picker'
const filter = (type: TimeModeValues, columns: DateTimePickerColumn):DateTimePickerColumn => {
	if (type == 'month') {
	    return columns.filter((option) => parseInt(option.value) % 6 == 0);
	}
	return columns
}
```


## Vue2使用说明
本插件使用了`composition-api`，请按照[官方教程](https://uniapp.dcloud.net.cn/tutorial/vue-composition-api.html)配置。

关键配置代码（在main.js中添加）：
```js
// main.js
import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'
Vue.use(VueCompositionAPI)
```

## 快速预览
导入插件后，可以直接使用以下标签查看演示效果：

```html
<!-- 代码位于 uni_modules/lime-date-time-picker/components/lime-date-time-picker -->
<lime-date-time-picker />
```

## 插件标签说明
- `l-date-time-picker`：时间选择器组件
- `lime-date-time-picker`：演示标签

## API文档

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| v-model | 当前选中的日期 | string | - |
| value | 当前选中的日期 | string | - |
| start | 选择器的最小可选时间，默认为当前时间-10年 | string\|number | - |
| end | 选择器的最大可选时间，默认为当前时间+10年 | string\|number | - |
| format | 用于confirm事件参数格式化，详细[文档](https://ext.dcloud.net.cn/plugin?id=17301) | string | - |
| mode | 1=年、2=月、4=日、8=时、16=分、32=秒，任意组合 | string\|number | `1\|2\|4` |
| customFilter | 选项过滤函数(type可能值为year, month, day, hour, minute) | Function | - |
| renderLabel | 选项格式化函数(type可能值为year, month, day, hour, minute) | Function | - |
| showUnit | label后面是否显示单位 | boolean | `true` |
| minHour | 可选的最小小时 | number | `0` |
| maxHour | 可选的最大小时 | number | `23` |
| minMinute | 可选的最小分钟 | number | `0` |
| maxMinute | 可选的最大分钟 | number | `59` |
| cancelBtn | 取消按钮文字 | string | - |
| cancelStyle | 取消按钮样式 | string | - |
| confirmBtn | 确定按钮文字 | string | - |
| confirmStyle | 确定按钮样式 | string | - |
| title | 标题 | string | - |
| titleStyle | 标题样式 | string | - |
| itemHeight | 每项高度 | string | `50px` |
| itemColor | 每项文本颜色 | string | - |
| itemFontSize | 每项文本字体大小 | string | - |
| itemActiveColor | 每项文本选中颜色 | string | - |
| indicatorStyle | 选择器中间选中框的样式 | string | - |
| maskColors | 选择器遮罩颜色样式，`[开始颜色, 结束颜色]` | _string[]_ | `` |
| bgColor | 选择器背景色 | string | - |
| groupHeight | 选项组高度 | string | `400rpx` |
| radius | 圆角 | string | - |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| cancel | 点击取消按钮时触发 | - |
| change | 选中变化时候触发 | value: string |
| confirm | 点击确认按钮时触发 | value: string |
| pick | 任何一列选中都会触发 | value: string |

## 主题定制

组件提供了下列CSS变量，可用于自定义样式。

| 名称 | 默认值 | 描述 |
|--------|--------|------|
| `--l-picker-border-radius` | `$border-radius-xl` | 选择器整体圆角 |
| `--l-picker-bg-color` | `$bg-color-container` | 选择器背景色 |
| `--l-picker-toolbar-height` | `58px` | 工具栏高度 |
| `--l-picker-cancel-color` | `$text-color-2` | 取消按钮文字颜色 |
| `--l-picker-confirm-color` | `$primary-color` | 确认按钮文字颜色 |
| `--l-picker-button-font-size` | `$font-size-md` | 按钮文字大小 |
| `--l-picker-title-font-size` | `18px` | 标题文字大小 |
| `--l-picker-title-font-weight` | `700` | 标题文字粗细 |
| `--l-picker-title-line-height` | `26px` | 标题行高 |
| `--l-picker-title-color` | `$text-color-1` | 标题文字颜色 |
| `--l-picker-group-height` | `200px` | 选择器内容区高度 |
| `--l-picker-indicator-bg-color` | `$fill-4` | 选中指示器背景色 |
| `--l-picker-indicator-border-radius` | `6px` | 选中指示器圆角 |
| `--l-picker-item-height` | `50px` | 每个选项高度 |
| `--l-picker-item-color` | `$text-color-1` | 选项文字颜色 |
| `--l-picker-item-active-color` | `$text-color-1` | 选中项文字颜色 |
| `--l-picker-item-active-font-weight` | `700` | 选中项文字粗细 |
| `--l-picker-item-font-size` | `$font-size-md` | 选项文字大小 |
| `--l-picker-loading-mask-color` | `rgba(255,255,255,.9)` | 加载遮罩颜色 |
| `--l-picker-loading-color` | `$primary-color` | 加载动画颜色 |

## 支持与赞赏

如果你觉得本插件解决了你的问题，可以考虑支持作者：
| 支付宝赞助 | 微信赞助 |
|------------|------------|
| ![](https://testingcf.jsdelivr.net/gh/liangei/image@1.9/alipay.png) | ![](https://testingcf.jsdelivr.net/gh/liangei/image@1.9/wpay.png) |