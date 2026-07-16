# lime-action-sheet 动作面板

一个功能丰富的动作面板组件，用于展示一组与当前情境相关的操作选项。支持标题、取消按钮、自定义内容等多种配置，可用于分享、操作确认、筛选等多种场景。组件提供了丰富的自定义选项，可以满足各种复杂的交互需求。

> 插件依赖：`lime-shared`、`lime-style`

## 文档链接
📚 组件详细文档请访问以下站点：
- [动作面板文档 - 站点1](https://limex.qcoon.cn/components/action-sheet.html)
- [动作面板文档 - 站点2](https://limeui.netlify.app/components/action-sheet.html)
- [动作面板文档 - 站点3](https://limeui.familyzone.top/components/action-sheet.html)

## 安装方法
1. 在uni-app插件市场中搜索并导入`lime-action-sheet`
2. 导入后可能需要重新编译项目
3. 在页面中使用`l-action-sheet`组件


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
const onSelect = (index:number, item: UTSJSONObject) => {
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
<l-action-sheet v-model="show" :rowCol="[4, 8]" :list="grid" @select="select" cancel-text="取消" description="这是一段描述信息"></l-action-sheet>
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


## Vue2使用说明
main.js中添加以下代码：
```js
// vue2项目中使用
import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'
Vue.use(VueCompositionAPI)
```

详细配置请参考官方文档：[Vue Composition API](https://uniapp.dcloud.net.cn/tutorial/vue-composition-api.html)

## 插件标签说明
`l-action-sheet` 为组件标签   
`lime-action-sheet` 为演示标签

## API文档

### Props 属性说明

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| v-model | 是否显示动作面板（推荐） | _boolean_ | `false` |
| visible | 是否显示动作面板（同义别名 | _boolean_ | `false` |
| list | 面板选项列表 | _ActionSheetItem[]_ | `[]` |
| title | 顶部标题 | _string_ | - |
| cancel-text | 取消按钮文字 | _string_ | - |
| align | 对齐方式，可选`center\|left` | _string_ | `center` |
| description | 选项上方的描述信息 | _string_ | - |
| overlay | 是否显示遮罩层 | _boolean_ | `true` |
| safe-area-inset-bottom | 是否开启底部安全区适配 | _boolean_ | `true` |
| rowCol | ​​横向排列的每行菜单项数量​​（例如 [4, 4]表示两行，每行最多 4 个选项） | _number[]_ | `-` |
| bordered | 是否显示菜单项之间的边框/分割线 | _boolean_ | `true` |
| closeable | 是否显示关闭图标 | _boolean_ | `true` |


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

### Events 事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| select | 点击选项时触发 | <em>(index: number, item: UTSJSONObject)</em> |
| cancel | 点击取消按钮时触发 | - |

### Slots 插槽

| 名称 | 说明 |
| --- | --- |
| default | 自定义面板内容 |
| description | 自定义描述文案 |
| title | 自定义标题栏 |

## 主题定制

组件提供了以下CSS变量，可以通过自定义CSS变量来自定义组件样式：

| 变量名称 | 默认值 | 描述 |
|---------|--------|------|
| `--l-action-sheet-item-height` | `56px` | 选项项高度 |
| `--l-action-sheet-font-size` | `$font-size-md` | 选项文字大小 |
| `--l-action-sheet-color` | `$text-color-1` | 选项文字颜色 |
| `--l-action-sheet-border-radius` | `$border-radius-lg` | 面板圆角半径 |
| `--l-action-sheet-border-color` | `$border-color-2` | 边框颜色 |
| `--l-action-sheet-hover-color` | `$gray-3` | 悬停背景色 |
| `--l-action-sheet-item-disabled-color` | `$text-color-4` | 禁用选项颜色 |
| `--l-action-sheet-gap-color` | `$bg-color-page` | 间隔区域背景色 |
| `--l-action-sheet-cancel-bg-color` | `$bg-color-container` | 取消按钮背景色 |
| `--l-action-sheet-title-font-size` | `18px` | 标题文字大小 |
| `--l-action-sheet-title-color` | `$text-color-1` | 标题文字颜色 |
| `--l-action-sheet-title-font-weight` | `700` | 标题字重 |
| `--l-action-sheet-description-color` | `$text-color-3` | 描述文字颜色 |
| `--l-action-sheet-description-font-size` | `$font-size` | 描述文字大小 |
| `--l-action-sheet-image-size` | `48px` | 网格图片尺寸 |
| `--l-action-sheet-image-bg-color` | `$fill-3` | 网格图片背景色 |
| `--l-action-sheet-col-font-size` | `$font-size-sm` | 网格文字大小 |
| `--l-action-sheet-col-icon-size` | `24px` | 网格图标大小 |
| `--l-action-sheet-gap-height` | `$spacer-xs` | 间隔区域高度 |
| `--l-action-sheet-title-padding` | `$spacer` | 标题内边距 |
| `--l-action-sheet-close-btn-spacing` | `$spacer` | 关闭按钮边距 |
| `--l-action-sheet-col-text-padding` | `$spacer-sm` | 网格文字上边距 |

## 支持与赞赏

如果你觉得本插件解决了你的问题，可以考虑支持作者：

| 支付宝赞助 | 微信赞助 |
|------------|------------|
| ![支付宝赞赏码](https://testingcf.jsdelivr.net/gh/liangei/image@1.9/alipay.png) | ![微信赞赏码](https://testingcf.jsdelivr.net/gh/liangei/image@1.9/wpay.png) |