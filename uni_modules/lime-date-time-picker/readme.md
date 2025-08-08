# lime-date-time-picker 时间选择器
- 用于选择时间，支持日期、时分等时间维度
- 插件依赖`lime-shared`, `lime-picker`不喜勿下

## 文档
[date-time-picker](https://limex.qcoon.cn/components/date-time-picker.html)

## 安装
插件市场导入即可。首次导入可能需要重新编译


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
import { TimeModeValues } from '@/uni_modules/lime-date-time-picker'
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
import { DateTimePickerColumn, TimeModeValues } from '@/uni_modules/lime-date-time-picker'
const filter = (type: TimeModeValues, columns: DateTimePickerColumn):DateTimePickerColumn => {
	if (type == 'month') {
	    return columns.filter((option) => parseInt(option.value) % 6 == 0);
	}
	return columns
}
```



### 查看示例
- 导入后直接使用这个标签查看演示效果

```html
<!-- // 代码位于 uni_modules/lime-date-time-picker/compoents/lime-date-time-picker -->
<lime-date-time-picker />
```


### 插件标签
- 默认 l-date-time-picker 为 component
- 默认 lime-date-time-picker 为 demo

### 关于vue2的使用方式
- 插件使用了`composition-api`, 如果你希望在vue2中使用请按官方的教程[vue-composition-api](https://uniapp.dcloud.net.cn/tutorial/vue-composition-api.html)配置
- 关键代码是: 在main.js中 在vue2部分加上这一段即可
```js
// vue2
import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'
Vue.use(VueCompositionAPI)
```



## API

### Picker Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| v-model | 当前选中的日期 | _string_ | - |
| value | 当前选中的日期 | _string_ | - |
| start | 选择器的最小可选时间，默认为当前时间-10年 | _string\|number_ | - |
| end | 选择器的最大可选时间，默认为当前时间+10年 | _string\|number_ | - |
| format | 用于confirm事件参数格式化详细[文档](https://ext.dcloud.net.cn/plugin?id=17301) | _string_ | `` |
| mode | 1=年、2=月、4=日、8=时、16=分、32=秒,任意组合。 | _string\|numbr_ | `1|2|4` |
| customFilter | 选项过滤函数(type 可能值为 year, month, day, hour, minute)。 | _Func_ | `` |
| renderLabel | 选项格式化函数(type 可能值为 year, month, day, hour, minute)。 | _Func_ | `` |
| showUnit | label后面是否显示单位 | _boolean_ | `true` |
| minHour | 可选的最小小时 | _number_ | `0` |
| maxHour | 可选的最大小时 | _number_ | `23` |
| minMinute | 可选的最小分钟 | _number_ | `0` |
| maxMinute | 可选的最大分种 | _number_ | `59` |
| cancelBtn | 取消按钮文字 | _string_ | `` |
| cancelStyle | 取消按钮样式 | _string_ | `` |
| confirmBtn | 确定按钮文字 | _string_ | `` |
| confirmStyle | 确定按钮样式 | _string_ | `` |
| title |  标题 | _string_ | `` |
| titleStyle |  标题样式 | _string_ | `` |
| itemHeight | 每项高度 | _string_ | `50px` |
| itemColor | 每项文本颜色 | _string_ | `` |
| itemFontSize | 每项文本字体大小 | _string_ | `` |
| itemActiveColor | 每项文本选中颜色 | _string_ | `` |
| indicatorStyle | 选择器中间选中框的样式 | _string_ | `` |
| bgColor | 选择器背景色 | _string_ | `` |
| groupHeight | 选项组高度 | _string_ | `400rpx` |
| radius | 圆角 | _string_ |  |


### Events
| 事件名 | 说明                     | 回调参数               |
| ------ | ------------------------ | ---------------------- |
| cancel | 点击取消按钮时触发 | __ |
| change | 选中变化时候触发 | _value: string_ |
| confirm | 点击确认按钮时触发 | _value:string_ |
| pick | 任何一列选中都会触发 | _value:string_ |




## 主题定制

### 样式变量

组件提供了下列 CSS 变量，可用于自定义样式，uvue app无效。

| 名称                     | 默认值               | 描述 |
| ------------------------ | -------------------- | ---- |
| --l-picker-border-radius    | _24rpx_                  | -    |
| --l-picker-bg-color | _$bg-color-container_ | -    |
| --l-picker-toolbar-height | _116rpx_ | -    |
| --l-picker-cancel-color | _text-color-2_ | -    |
| --l-picker-confirm-color | _$primary-color_ | -    |
| --l-picker-button-font-size | _32rpx_ | -    |
| --l-picker-title-font-size | _36rpx_ | -    |
| --l-picker-title-font-weight | _700_ | -    |
| --l-picker-title-line-height | _52rpx_ | -    |
| --l-picker-title-color | _$text-color-1_ | -    |
| --l-picker-group-height | _400rpx_ | -    |
| --l-picker-indicator-bg-color | _$fill-4_ | -    |
| --l-picker-indicator-border-radius | _12rpx_ | -    |
| --l-picker-item-height | _50px_ | -    |
| --l-picker-item-color | _$text-color-1_ | -    |
| --l-picker-item-active-color | _$text-color-1_ | -    |
| --l-picker-item-active-color | _$text-color-1_ | -    |
| --l-picker-loading-mask-color | _rgba(255,255,255,.9)_ | -    |
| --l-picker-item-font-size | _$font-size-md_ | -    |


## 打赏

如果你觉得本插件，解决了你的问题，赠人玫瑰，手留余香。  
![](https://testingcf.jsdelivr.net/gh/liangei/image@1.9/alipay.png)
![](https://testingcf.jsdelivr.net/gh/liangei/image@1.9/wpay.png)