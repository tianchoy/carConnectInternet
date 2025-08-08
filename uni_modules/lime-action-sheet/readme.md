# lime-action-sheet 动作面板
- 底部弹起的模态面板，包含与当前情境相关的多个选项，兼容uniapp/uniappx。
- 插件依赖`lime-popup`,`lime-style`,`lime-shared`,`lime-icon`,`lime-overlay`,`lime-transition`,不喜勿下

## 文档
[action-sheet](https://limex.qcoon.cn/components/action-sheet.html)

## 安装
插件市场导入即可，首次导入可能需要重新编译

如果你不是在市场导入的，而是在gitcode上拉取的，`uniappx app`需要手动在`pages.json`注册一下页面
```json
"pages": [
	//...其它页面，
	// 注册action-sheet页
		{
            "path": "uni_modules/lime-action-sheet/pages/index"
        }
    ]
```

**注意** 
* 🔔 本插件依赖的[lime-svg](https://ext.dcloud.net.cn/plugin?id=18519)在 uniapp x app中是原生插件，如果购买(收费为5元)则需要自定义基座，才能使用！uniapp可忽略。
* 🔔 不需要[lime-svg](https://ext.dcloud.net.cn/plugin?id=18519)在lime-icon代码中注释掉即可

```html
// lime-icon/components/l-icon.uvue 第4行 注释掉即可。
<!-- <l-svg class="l-icon" :class="classes" :style="styles" :color="color" :src="iconUrl" v-else :web="web" @error="imageError" @load="imageload" @click="$emit('click')"></l-svg> -->
```

## 代码演示

### 基础用法

动作面板通过 `list` 属性来定义选项，`list` 属性是一个由对象构成的数组，数组中的每个对象配置一列，对象格式见文档下方表格。

```html
<button @click="show = true">基础用法</button>
<l-action-sheet v-model="show" :list="list" @select="onSelect" />
```

```js
const show = ref(false);
const list = [
      { label: '选项一' },
      { label: '选项二' },
      { label: '选项三' },
    ];
const onSelect = (index:number) => {
   console.log('index', index)
};
```

### 展示图标

使用 `list` 的 `icon` 字段可以为选项设置图标。

```html
<button @click="show = true">展示图标</button>
<l-action-sheet v-model="show" :list="list" @select="onSelect" />
```

```js
const show = ref(false);
const list = [
    { label: '选项一', icon: 'app'},
	{ label: '选项二', icon: 'app'},
	{ label: '选项三', icon: 'app'},
];
const onSelect = (index:number) => {
   console.log('index', index)
};
```

### 展示取消按钮

设置 `cancel-text` 属性后，会在底部展示取消按钮，点击后关闭当前面板并触发 `cancel` 事件。

```html
<button @click="show = true">展示图标</button>
<l-action-sheet v-model="show" :list="list" @cancel="onCancel" cancel-text="取消"/>
```

```js
const show = ref(false);
const list = [
    { label: '选项一' },
    { label: '选项二' },
    { label: '选项三' },
];
const onCancel = () => {
	console.log('取消')
};
```

### 展示描述信息

通过 `description` 可以在菜单顶部显示描述信息。

```html
<l-action-sheet
  v-model="show"
  :list="list"
  cancel-text="取消"
  description="这是一段描述信息"
/>
```

```js
const show = ref(false);
const list = [
    { label: '选项一' },
    { label: '选项二' },
    { label: '选项三' },
];
```

### 选项状态

可以通过  `disabled` 将选项设置为禁用状态，或者通过`color`设置选项的颜色

```html
<l-action-sheet
  v-model="show"
  :list="list"
  cancel-text="取消"
/>
```

```js
const show = ref(false);
const actions = [
    { label: '着色选项', color: '#ee0a24' },
    { label: '禁用选项', disabled: true },
];
```

### 宫格型

通过`rowCol`属性设置每行列数，如`[4, 8]`表示第一行有4列，第二行有8列。超过4列时会出现滚动条。

```html
<l-action-sheet v-model="show" :rowCol="[4, 8]" :list="grid" @select="select" cancelText="取消" description="这是一段描述信息"></l-action-sheet>
```
```js
const show = ref(false);
const grid = [
	{ label: '微信', icon: 'https://tdesign.gtimg.com/mobile/demos/wechat.png', radius: '0' }, //设置圆角
	{ label: '朋友圈', icon: 'https://tdesign.gtimg.com/mobile/demos/times.png', radius: '0' },
	{ label: 'QQ', icon: 'https://tdesign.gtimg.com/mobile/demos/qq.png', radius: '0' },
	{ label: '企业微信', icon: 'https://tdesign.gtimg.com/mobile/demos/wecom.png', radius: '0'},
	{ label: '收藏', icon: 'share', color: '#ddd' }, //文本或图标颜色
	{ label: '下载', icon: 'download', iconColor: '#ddd' },//图标颜色
	{ label: '编辑', icon: 'edit', bgColor: '#0bc15f'},//图标背景颜色
	{ label: '选项', icon: 'app',fontSize: '28rpx' },//文本或图标大小
	{ label: '选项', icon: 'app' },
	{ label: '选项', icon: 'app', disabled: true},
	{ label: '选项', icon: 'app' },
	{ label: '选项', icon: 'app' },
]
```



### 查看示例
- 导入后直接使用这个标签查看演示效果

```html
<!-- // 代码位于 uni_modules/lime-action-sheet/compoents/lime-action-sheet -->
<lime-action-sheet />
```


### 插件标签
- 默认 l-action-sheet 为 component
- 默认 lime-action-sheet 为 demo

### 关于vue2的使用方式
- 插件使用了`composition-api`, 如果你希望在vue2中使用请按官方的教程[vue-composition-api](https://uniapp.dcloud.net.cn/tutorial/vue-composition-api.html)配置
- 关键代码是: 在main.js中 在vue2部分加上这一段即可.
```js
// vue2
import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'
Vue.use(VueCompositionAPI)
```



## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| v-model | 是否显示动作面板 | _boolean_ | `false` |
| list | 面板选项列表 | _ActionSheetItem[]_ | `[]` |
| title | 顶部标题 | _string_ | - |
| cancel-text | 取消按钮文字 | _string_ | - |
| align | 对齐方式，可选`center\|left` | _string_ | `center` |
| description | 选项上方的描述信息 | _string_ | - |
| safe-area-inset-bottom | 是否开启底部安全区适配,未实现 | _boolean_ | `true` |

### list 数据结构

`list` 属性是一个由对象构成的数组，数组中的每个对象配置一列，对象可以包含以下值：

| 键名          | 说明                     | 类型                        |
| ------------- | ------------------------ | --------------------------- |
| label          | 标题                     | _string_                    |
| color         | 选项文字颜色             | _string_                    |
| icon  | 选项图标名称或图片链接   | _string_                    |
| iconColor  | 选项图标颜色   | _string_                    |
| bgColor  | 选项图标背景颜色   | _string_                    |
| fontSize  | 选项字体大小   | _string_                    |
| radius  | 选项图标圆角   | _string_                    |
| disabled      | 是否为禁用状态           | _boolean_                   |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| select | 点击选项时触发，禁用或加载状态下不会触发 | _index: number_ |
| cancel | 点击取消按钮时触发 | - |

### Slots

| 名称 | 说明 | 参数 |
| --- | --- | --- |
| description | 自定义描述文案 | - |


## 主题定制

### 样式变量

组件提供了下列 CSS 变量，可用于自定义样式，uvue app无效。

| 名称 | 默认值 | 描述 |
| --- | --- | --- |
| --l-action-sheet-item-height | _112rpx_ | - |
| --l-action-sheet-item-disabled-color | _$text-color-4_ | - |
| --l-action-sheet-hover-color | _$fill-3_ | - |
| --l-action-sheet-gap-height | _16rpx_ | - |
| --l-action-sheet-gap-color | _$bg-color-page_ | - |
| --l-action-sheet-color | _text-color-1_ | - |
| --l-action-sheet-border-radius | _$border-radius-lg_ | - |
| --l-action-sheet-description-color | _$text-color-3_ | - |
| --l-action-sheet-description-font-size | _$font-size-3_ | - |
| --l-action-sheet-text-align | _center_ | - |
| --l-action-sheet-font-size | _$font-size-md_ | - |
| --l-action-sheet-cancel-height | _96rpx_ | - |
| --l-action-sheet-cancel-color | _$text-color-1_ | - |
| --l-action-sheet-image-size | _96rpx_ | - |
| --l-action-sheet-image-bg-color | _$fill-3_ | - |
| --l-action-sheet-icon-size | _48rpx_ | - |
| --l-action-sheet-col-text-padding | _24rpx_ | - |


## 常见问题
插件包含一下[lime-svg](https://ext.dcloud.net.cn/plugin?id=18519)为收费插件。如果你不需要svg，可以在lime-icon里注释掉，lime-svg为APP原生插件，收费为1元，源码为5元。如果你需要svg，可以考虑一下购买。
```html
// lime-icon/components/l-icon.uvue 第4行 注释掉即可。
<!-- <l-svg class="l-icon" :class="classes" :style="styles" :color="color" :src="iconUrl" v-else :web="web" @error="imageError" @load="imageload" @click="$emit('click')"></l-svg> -->
```
## 打赏

如果你觉得本插件，解决了你的问题，赠人玫瑰，手留余香。  
![](https://testingcf.jsdelivr.net/gh/liangei/image@1.9/alipay.png)
![](https://testingcf.jsdelivr.net/gh/liangei/image@1.9/wpay.png)