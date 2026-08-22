# App 推送前后端对接说明

> 当前 Android 与 iOS 均使用 **JPush** 作为运行时推送 provider，设备标识为 JPush `RegistrationID`。服务端必须通过 JPush 向该 RegistrationID 发送，不能将其当作 UniPush CID。
>
> Android 已启用华为 JPush 厂商通道：华为/HMS 设备由 JPush 选择华为通道送达；这不是第二个前端 provider，应用也不会直接调用华为 Push Kit。iOS 继续使用 JPush/APNs。

## 1. 当前运行路径

| 平台 | 前端 provider | 设备标识 | 获取方式 | 服务端发送通道 |
| --- | --- | --- | --- | --- |
| Android | `jpush` | JPush `RegistrationID` | `jg-jpush-u` | JPush（华为设备可走华为厂商通道） |
| iOS | `jpush` | JPush `RegistrationID` | `jg-jpush-u` | JPush / APNs |

[services/push.uts](../services/push.uts) 默认选择 `jpush`。Android 会在初始化 JPush 前加载 `jg-jpush-u-huawei`，使其原生 Gradle 配置与华为依赖参与构建；iOS 不加载该 Android 专用模块。

## 2. Android 华为厂商通道配置

### 2.1 项目内文件

华为 AG Connect 配置文件必须位于：

```text
nativeResources/android/agconnect-services.json
```

该文件由 [jg-jpush-u-huawei](../uni_modules/jg-jpush-u-huawei/readme.md) 在 Android 原生构建时使用。它必须与本应用包名 `uni.app.UNI662B0B4` 一致；不要在业务代码、`manifestPlaceholders.json` 或日志中复制其中的凭据字段。

JPush Android AppKey 和 channel 继续通过 [nativeResources/android/manifestPlaceholders.json](../nativeResources/android/manifestPlaceholders.json) 提供，Android 代码以空 AppKey 调用初始化，从而读取原生 Manifest 配置。

### 2.2 控制台前置条件

发布或真机验证前，须同时完成：

1. 在华为 AppGallery Connect 为 `uni.app.UNI662B0B4` 启用 **Push Kit**；
2. 在 AG Connect 登记实际签名包使用的 SHA-256 证书指纹：Debug、Release，以及计划上架 AppGallery 时的重签名证书；修改后重新下载并替换 `agconnect-services.json`；
3. 在极光控制台同一 JPush 应用的“华为厂商通道”填写华为 App ID、Client ID/Client Secret 等控制台要求的参数；
4. 确认 JPush AppKey 归属于该极光应用，且极光、AG Connect、最终 APK/AAB 的包名均为 `uni.app.UNI662B0B4`。

华为 Client Secret、服务账号私钥和 JPush Master Secret 仅能保存在相应的控制台或后端安全密钥库，**不得**放入客户端代码、原生资源、日志、推送 payload 或 Git 提交。

## 3. 前端行为

### 3.1 初始化与 RegistrationID

应用在启动、回到前台及登录成功后刷新 JPush RegistrationID：

- 注册 JPush 事件回调后初始化 Android/iOS JPush；
- Android 会先加载华为厂商插件，再初始化 JPush 核心 SDK；
- RegistrationID 为空时每 3 秒重试，最多 5 次；
- RegistrationID、待处理 `messageId`、消息刷新标记和登录会话状态按 provider 维度缓存；
- RegistrationID 就绪后，若存在有效业务登录 token，前端会异步调用后端设备绑定接口；如果 Android 的 RegistrationID 早于登录获得，登录成功会立即使用已缓存的 RegistrationID 补发绑定。请求不阻塞登录或页面跳转，失败后可在下一次 RegistrationID 刷新时重试；

RegistrationID 属于设备推送标识，生产 logcat 不输出其具体值；仅在受控开发或联调环境中通过安全渠道核验。

### 3.2 收到推送后的行为

JPush 事件沿用现有业务处理：

1. 从 payload 的 `messageId`、`message_id` 或 `id`（含 `data`、`extra`、`notificationExtras`、`extras`）提取业务消息 ID；
2. 标记消息中心需要刷新；
3. 用户点击通知时切换到 `/pages/message/message`；
4. 消息页刷新列表，并在第一页找到同一 `messageId` 时自动打开详情；
5. 用户查看未读消息时调用已有消息详情/已读接口。

### 3.3 iOS 主屏幕角标策略

本应用没有服务端同步的全局未读数；消息列表中的 `status` 仅表示单条消息的已读状态。因此 iOS 主屏幕 App 图标角标固定保持为 `0`，不能将其当作未读消息总数。

客户端会在启动、回到前台以及处理 JPush 事件时调用 JPush 的 `resetBadge()`，同时清除系统角标和 JPush 记录的角标值；这不会影响通知送达、通知点击跳转、消息列表刷新或单条消息已读状态。

后端通过 JPush/APNs 发送 iOS 通知时，必须省略 `aps.badge`，或显式发送 `0`。若后端继续发送例如 `"badge": 1`，iOS 会在应用处于后台时再次显示红色角标；客户端会在下次处理事件或回到前台时清除它，但不能阻止系统在收到该 payload 的瞬间设置角标。

## 4. 已存在的消息接口

当前前端 API 基地址以 [api/http.uts](../api/http.uts) 中的 `BASE_URL` 为准（当前为 `https://gpsapp.zdiot.cn`）。既有受保护请求使用：

```http
Authorization: Bearer <业务登录 token>
```

### 4.1 用户消息列表

| 项目 | 约定 |
| --- | --- |
| 方法 | `GET` |
| 路径 | `/usermessage/listForUser` |
| 参数 | `page`、`pageSize` |

### 4.2 标记消息已读

| 项目 | 约定 |
| --- | --- |
| 方法 | `GET` |
| 路径 | `/usermessage/detail/{msgId}` |

## 5. 后端绑定与发送约定

### 5.1 设备绑定

前端在 JPush `RegistrationID` 就绪且用户已登录后，异步调用以下接口：

```http
POST /app/push/bind
Authorization: Bearer <业务登录 token>
clientId: 428a8310cd442757ae699df5d894f051
Content-Type: application/json
```

请求体：

```json
{
  "registrationId": "<jpush-registration-id>",
  "platform": "android",
  "deviceName": "Xiaomi 14",
  "appVersion": "1.2.0"
}
```

- `Authorization` 使用 `Bearer <APP 登录 token>`，`clientId` 必须为 `428a8310cd442757ae699df5d894f051`；后端从 token 解析用户 ID，前端不传 `userId`；
- `platform` 仅为 `android` 或 `ios`；
- 同一 token 与 RegistrationID 在当前运行期内只会成功绑定一次；不同登录会话到来时会在当前请求完成后继续处理，避免登录/前台刷新产生重复请求；
- 绑定失败不会阻塞登录、跳转或提示用户，后续 RegistrationID 刷新时可以再次提交；日志只记录绑定生命周期、平台和安全的业务响应信息，不记录 token 或 RegistrationID；
- 前端不调用 JPush 原生 `setAlias`，也不调用解绑接口。若 RegistrationID 已归属其他账号，由后端按接口约定转移到当前登录用户，并负责设置/补偿 JPush alias。

### 5.2 服务端发送

服务端应先创建用户消息记录并生成业务 `messageId`，再查询有效 JPush RegistrationID 绑定，通过 JPush 发送，并将相同的 `messageId` 写入 payload。华为通道由 JPush 后台选择和投递，后端不应拿 RegistrationID 直接调用 Huawei Push Kit。

## 6. 真机验证清单

### Android 华为/HMS

- [ ] 以完整原生 Android 构建生成新包，不能用热重载验证；
- [ ] 最终包 application ID 为 `uni.app.UNI662B0B4`，实际签名 SHA-256 已登记在 AG Connect；
- [ ] 在真机华为/HMS 设备安装，Android 13+ 已授予通知权限；
- [ ] 日志显示 JPush 初始化，并获得非空 JPush RegistrationID；
- [ ] 在极光控制台按该 RegistrationID 发送测试，验证前台接收、后台系统通知、杀进程/冷启动和点击进入消息中心；
- [ ] payload 带有效 `messageId`，验证消息中心刷新和详情打开；
- [ ] 在极光控制台核验华为厂商通道送达状态。

### 回归

- [ ] 非华为 Android 设备仍可使用 JPush；
- [ ] iOS JPush/APNs 初始化和通知点击不受 Android 厂商模块影响；
- [ ] 不存在第二个 provider 初始化，且日志、包内容和 Git 变更不含私钥或 JPush Master Secret。
