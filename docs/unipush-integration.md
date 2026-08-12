# App 推送前后端对接说明

> 当前 Android 和 iOS 均使用 **UniPush 2.0** 作为运行时推送通道。两端的设备标识均为通过 `uni.getPushClientId()` 获取的 UniPush `CID`，服务端必须使用 UniPush 向该 CID 发送。
>
> 仓库仍保留 JPush 的原生集成，供后续单独调试；当前应用启动路径不会选择或初始化 JPush adapter。**JPush RegistrationID 不是 UniPush CID，不能提交给 UniPush 或用于 UniPush 发送。**

## 1. 当前运行路径

| 平台 | 前端 provider | 设备标识 | 获取方式 | 服务端发送通道 |
| --- | --- | --- | --- | --- |
| iOS | `unipush` | UniPush `CID` | `uni.getPushClientId()` | UniPush |
| Android | `unipush` | UniPush `CID` | `uni.getPushClientId()` | UniPush |

[services/push.uts](../services/push.uts) 在 Android 和 iOS 上均明确选择 `unipush`。应用不会同时初始化两个 provider，也不会将 JPush RegistrationID 作为当前设备标识。

iOS 工程仍链接 JPush，但 [index.uts](../uni_modules/jg-jpush-u/utssdk/app-ios/index.uts) 中的自动 APNs hook 默认关闭。因此当前 UniPush 包只有 UniPush 处理 APNs 注册、`UNUserNotificationCenter` 委托和通知事件；JPush 不会在启动或 APNs token 回调中自行注册。

如需后续单独测试 JPush，必须在**独立的 JPush-only 构建**中同时完成以下操作：

1. 将 `ENABLE_JPUSH_IOS_APNS_HOOK` 改为 `true`；
2. 将 [services/push.uts](../services/push.uts) 的 iOS provider 改为 `jpush`；
3. 完整重新生成、构建并重装应用；
4. 仅使用 JPush RegistrationID 和 JPush 服务端发送。

不要在 JavaScript provider 仍为 `unipush` 的包中开启 JPush 原生 APNs hook，也不要将 JPush RegistrationID 提交到 UniPush。

## 2. 前端已实现的能力

### 2.1 初始化、本地缓存与日志

应用启动、回到前台及登录成功后会刷新 UniPush CID：

- Android 和 iOS 均注册 `uni.onPushMessage()`，并通过 `uni.getPushClientId()` 获取 CID；
- 获取失败、返回空 CID 或回调超时时，每 3 秒重试，最多 5 次；
- CID、待处理的 `messageId`、消息刷新标记和登录会话状态均使用 provider 维度的本地键；
- CID 成功获取时，会输出 `UniPush CID: <cid>` 日志，便于开发和联调时复制到 DCloud UniPush 控制台测试；
- 当前前端只缓存 CID，**尚未调用任何后端绑定、更新或解绑接口**。

CID 属于设备推送标识。请仅在受控的开发或联调日志中使用，勿将 Apple `.p8` 私钥、APNs device token、业务 token 或其他敏感信息输出到日志。

### 2.2 收到推送后的行为

UniPush 事件使用既有业务处理：

1. 从 payload 的 `messageId`、`message_id` 或 `id`（包括 `data`、`extra`、`notificationExtras`、`extras` 嵌套对象）提取业务消息 ID；
2. 将消息中心标记为需要刷新；
3. 点击通知时切换到 `/pages/message/message`；
4. 消息页刷新列表，并在第一页找到相同 `messageId` 时自动打开详情；
5. 用户打开未读消息时调用现有消息详情/已读接口。

推送 payload 中的正文或页面 URL 不作为业务页面跳转依据；消息详情以服务端消息中心数据为准。

## 3. iOS APNs 与 DCloud UniPush 配置

DCloud UniPush 控制台中的 iOS 配置必须对应应用 Bundle ID `uni.app.UNI662B0B4`。Apple Push Notifications 能力、签名 profile 和上传至 DCloud 的 APNs 凭证必须属于相同的 Apple Team 与 Bundle ID。

| 包类型 | 签名 entitlement | DCloud/UniPush APNs 环境 |
| --- | --- | --- |
| Debug 真机开发包 | `development` | development / sandbox |
| Release、TestFlight、App Store 包 | `production` | production |

仓库中的 Xcode 配置为：

- Debug 使用 `UniAppXDemo/UniAppXDemoDebug.entitlements`，其中 `aps-environment=development`；
- Release 使用 `UniAppX.entitlements`，其中 `aps-environment=production`。

Apple `.p8` 私钥只能上传和配置在 DCloud UniPush 控制台；不得读取、复制、嵌入代码、输出日志或提交到仓库。

获得 CID 只能证明客户端已完成 UniPush 注册，**不能证明通知一定可送达**。必须对环境匹配的真机包完成实际发送验证。

## 4. 已存在、前端正在调用的消息接口

当前前端 API 基地址为 `https://car.zdiot.cn:18443/api`。受保护接口使用：

```http
token: <业务登录 token>
```

不是 `Authorization: Bearer ...`。HTTP 401 会使客户端清理 token 与本地推送会话状态。

### 4.1 用户消息列表

| 项目 | 约定 |
| --- | --- |
| 方法 | `GET` |
| 路径 | `/usermessage/listForUser` |
| 认证 | 请求头 `token` |
| 参数 | `page`、`pageSize` |

服务端返回的每条消息必须带有 `messageId`、`messageType`、`content`、`createTime`、`status`，并按 `createTime` 倒序排列。新推送对应的消息应先落库，使通知点击后消息页能从第一页找到它。

### 4.2 标记消息已读

| 项目 | 约定 |
| --- | --- |
| 方法 | `GET` |
| 路径 | `/usermessage/detail/{msgId}` |
| 认证 | 请求头 `token` |

当前客户端将该接口作为“查看详情并标记已读”使用。服务端必须验证消息属于当前 token 对应的用户；鉴权过期应返回 HTTP 401。

## 5. 后端设备绑定边界与推荐契约

当前仓库未发现设备绑定、更新或解绑 API，客户端**不会凭空调用**任何推送绑定 URL。后端接口上线并确认字段后，才应接入。

建议绑定或更新接口为 `POST /push/client/bind`，认证方式为请求头 `token`，且必须幂等：

```json
{
  "provider": "unipush",
  "registrationId": "<unipush-cid>",
  "platform": "ios",
  "appVersion": "1.0.0"
}
```

Android 示例仅将 `platform` 改为 `android`。后端从 token 确定用户，**客户端不得传 `userId`**。服务端应保存 `(user_id, provider, registration_id)` 的关联、平台、状态及 `last_seen_at`。

主动退出登录或账号切换时，后端提供明确的幂等解绑契约后，再由客户端在 token 仍有效时解绑；HTTP 401 时服务端仍应依赖 `last_seen_at` 过期和发送失败回收无效绑定。

## 6. 服务端发送约定

服务端发送告警、事件或通知时：

1. 先创建用户消息记录，生成业务 `messageId`，初始 `status=1`；
2. 查询目标用户有效的 UniPush CID 绑定；
3. 通过 UniPush 向每个有效 CID 发送；
4. 在 payload 中放入与消息记录完全一致的 `messageId`；
5. 记录发送结果和失败原因；推送失败不回滚已创建的消息记录。

推荐业务 payload：

```json
{
  "messageId": "10001",
  "messageType": 1,
  "bizType": "geofence_alarm"
}
```

不要把业务 token、用户敏感信息、Apple `.p8` 私钥、APNs device token 或 JPush 密钥放入 payload。收到 UniPush 设备无效错误时，服务端应将对应绑定标记为 inactive，避免无效重试。

## 7. 真机验证清单

### Debug / sandbox

- [ ] 使用真机开发签名包，检查签名后的 `.app` 含 `aps-environment=development`；
- [ ] 应用启动日志显示已选择 `unipush`，并输出非空 `UniPush CID`；
- [ ] 在 DCloud UniPush 控制台使用与开发包匹配的环境，向该 CID 发送测试通知；
- [ ] 验证前台接收、后台横幅/通知与点击进入消息中心；
- [ ] 验证消息中心可根据 `messageId` 刷新并打开对应详情。

### Release / TestFlight / App Store

- [ ] Archive 后检查实际签名 `.app` 含 `aps-environment=production`；
- [ ] 确认 Archive 使用有效的 distribution profile；
- [ ] 通过 TestFlight 或目标生产分发渠道安装；
- [ ] 应用启动日志输出该安装实例的非空 `UniPush CID`；
- [ ] 在 DCloud UniPush 生产环境向该 CID 发送测试通知；
- [ ] 验证前台接收、后台通知和点击进入消息中心。

开发环境向生产包发送、或生产环境向开发包发送都不应作为成功用例；环境不匹配通常不会送达。

## 8. 当前边界

1. 当前前端尚未上报或解绑 CID；后端提供并确认认证接口后再接入。
2. 通知点击固定进入消息中心，不支持按 payload 深链到车辆、围栏或轨迹页面。
3. 点击通知后只会从消息列表第一页定位 `messageId`；服务端应保证新消息按时间倒序位于第一页。
4. JPush 集成仍保留用于后续单独调试，但当前 Android 和 iOS 的应用推送运行路径均为 UniPush。
