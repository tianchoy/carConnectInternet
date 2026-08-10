# UniPush 前后端对接说明

> 本文依据当前项目的真实前端实现整理，明确区分：
>
> - **已存在且前端正在调用的接口**；
> - **为完成“用户—设备 CID 绑定 / 解绑”必须由后端新增、且前端尚未调用的接口**；
> - UniPush 到达后的消息中心联动和通知点击跳转约定。
>
> 当前前端 API 基地址为 `https://car.zdiot.cn:18443/api`，下文接口路径均相对此基地址。

## 1. 总体设计与业务流程

UniPush 的 `CID`（Client ID）标识的是**一次 App 安装/设备推送实例**，不是用户 ID，也不是业务登录 token。后端只有在保存 CID 与当前登录用户的关联后，才能按用户定向发送推送。

推荐的完整链路如下：

```text
App 启动或切回前台
  └─ 前端注册 uni.onPushMessage 监听，并调用 uni.getPushClientId 获取 CID

用户登录成功
  └─ 前端携带业务 token 调用“绑定 CID”接口
       └─ 后端从 token 识别 userId，建立 userId <-> CID 关系

后端产生告警/事件/通知
  ├─ 先持久化一条用户消息，生成 messageId
  ├─ 查询目标用户当前有效的 CID
  └─ 经 UniPush 向 CID 发送通知，其中 payload 必须包含 messageId

用户点击系统通知
  └─ 前端切换到消息中心，刷新消息列表，以 messageId 查找并打开对应消息

用户在消息中心点开未读消息
  └─ 前端调用已存在的“消息详情/已读”接口，后端将状态更新为已读

用户退出登录或 token 失效
  └─ 前端调用“解绑 CID”接口；后端删除或失效当前 userId <-> CID 关系
```

## 2. 当前前端已经实现的能力

### 2.1 平台范围

- UniPush 初始化和 CID 获取仅编译到 **Android / iOS App**。
- 微信小程序没有使用此 UniPush CID 流程；当前仅在 `manifest.json` 声明了订阅消息权限，未实现订阅消息申请或接收逻辑。
- Android 已声明 `POST_NOTIFICATIONS` 权限并在启动后请求运行时通知权限；iOS 已启用 `uni-push` 模块，但仍须在 DCloud/Apple 发布配置中完成 APNs 相关配置。

### 2.2 CID 获取与本地缓存

前端在 App 启动、App 回到前台、登录成功后获取 CID：

- 调用：`uni.getPushClientId()`；
- 成功后：将 `result.cid` 缓存在本地键 `push_client_id`；
- 异常、CID 为空或 18 秒未回调时：每 3 秒重试，最多 5 次；
- 当前实现**仅缓存 CID，未上传后端**。

因此，后端即便已具备 UniPush 发送能力，现有前端也不能完成“向当前用户设备推送”，必须补充第 4 节的绑定调用。

### 2.3 收到推送后的前端行为

前端以 `uni.onPushMessage` 接收事件，并按以下规则处理：

1. 从推送事件中提取消息 ID；
2. 将消息中心标记为需要刷新；
3. 当事件 `type` 为 `click` 时，切换到消息中心 Tab；
4. 消息中心展示/激活时调用消息列表接口刷新第一页；
5. 若推送中带有消息 ID，在已加载的列表中找到同一 `messageId` 后自动打开详情弹窗；
6. 打开未读消息时调用已读接口。

> 注意：前端当前不显示推送 payload 中的正文，也不按 payload 中的 URL/页面路径跳转；它以服务端消息中心数据为准，通知点击固定进入“消息”Tab。

## 3. 已存在、前端正在调用的后端接口

所有受保护接口均通过 HTTP 请求头传递业务 token：

```http
token: <业务登录 token>
```

不是 `Authorization: Bearer ...`。HTTP 状态码必须返回 `200`，业务成功与否通过响应体 `code` 判断。HTTP `401` 会使前端清理 token 与本地推送会话状态，并跳回登录页。

### 3.1 获取当前用户消息列表

| 项目 | 约定 |
| --- | --- |
| 方法 | `GET` |
| 路径 | `/usermessage/listForUser` |
| 认证 | 请求头 `token`，后端据此确定当前用户，不能依赖前端传 userId |
| 前端调用时机 | 进入消息页、点击推送后的刷新、消息页每 10 秒轮询、分页加载 |

#### 前端传给后端的值

通过 Query String 传递：

| 参数 | 类型 | 必填 | 示例 | 说明 |
| --- | --- | --- | --- | --- |
| `page` | number | 是 | `1` | 页码，从 1 开始 |
| `pageSize` | number | 是 | `20` / `50` | 每页数量。普通列表当前默认值由页面控制；轮询固定请求 `50` 条 |

示例：

```http
GET /api/usermessage/listForUser?page=1&pageSize=50
token: eyJ...
```

#### 后端必须返回的数据

```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "list": [
      {
        "messageId": "10001",
        "messageType": 1,
        "content": "车辆粤B12345发生围栏告警",
        "createTime": "2026-08-10 14:30:00",
        "status": 1
      }
    ],
    "totalPage": 3,
    "totalCount": 52
  }
}
```

字段要求：

| 字段 | 类型 | 必填 | 前端用途 |
| --- | --- | --- | --- |
| `code` | number | 是 | `0` 表示业务成功；非 `0` 时不更新列表 |
| `msg` | string | 是 | 成功/错误描述 |
| `data.list` | array | 是 | 消息数组；无数据时返回 `[]`，不要省略 |
| `data.totalPage` | number | 是 | 判断是否还有下一页 |
| `data.totalCount` | number | 是 | 总消息数 |
| `list[].messageId` | string 或 number（建议 string） | **是** | 去重、推送点击定位、已读更新的唯一标识 |
| `list[].messageType` | number | 是 | `1`=警告、`2`=事件，其他值显示为通知 |
| `list[].content` | string | 是 | 列表摘要和详情弹窗正文 |
| `list[].createTime` | string | 是 | 消息时间展示；建议统一 `yyyy-MM-dd HH:mm:ss` |
| `list[].status` | number | 是 | `1`=未读；`0`=已读 |

后端应按 `createTime` 倒序返回。这样轮询第一页时，前端才能正确识别新增消息。

### 3.2 标记消息为已读

| 项目 | 约定 |
| --- | --- |
| 方法 | `GET` |
| 路径 | `/usermessage/detail/{msgId}` |
| 认证 | 请求头 `token` |
| 前端调用时机 | 用户打开一条 `status == 1` 的消息后 |

> 虽然路径名称是 `detail`，当前前端把它当作“查看详情并标记已读”的接口调用，且使用 `GET`。为兼容当前客户端，后端必须保留此行为；后续如要改为更语义化的 `PUT` 接口，需要同步改前端。

#### 前端传给后端的值

- 路径参数 `msgId`：消息列表中的 `messageId`。
- 请求头 `token`：用于鉴权，并验证该消息属于当前用户。

示例：

```http
GET /api/usermessage/detail/10001
token: eyJ...
```

#### 后端必须返回的数据

最小兼容响应：

```json
{
  "code": 0,
  "msg": "success"
}
```

前端将下列任一条件视为成功，并在本地把该消息 `status` 改为 `0`：

- `code == 0`；或
- `msg == "success"`。

建议始终返回 `code: 0`，避免仅依赖文案。若消息不存在、不属于当前用户或更新失败，应返回非零业务码；鉴权失效应返回 HTTP `401`。

## 4. 为 UniPush 完整闭环需要新增的接口

当前项目没有 CID 绑定、更新或解绑接口，也没有前端发起此类请求。以下是与现有风格一致的建议契约；后端实现后，前端需要按第 5 节补上调用。

### 4.1 绑定或更新当前用户的 CID（建议新增）

| 项目 | 建议 |
| --- | --- |
| 方法 | `POST` |
| 路径 | `/push/client/bind` |
| 认证 | 请求头 `token` |
| 幂等性 | 是；同一用户重复提交同一 CID 不应产生重复记录 |
| 调用时机 | 登录成功后获取到 CID；CID 变化后；App 回前台发现 CID 变化后 |

#### 前端请求体

```json
{
  "cid": "a0b1c2d3e4f5...",
  "platform": "android",
  "appVersion": "1.0.0"
}
```

| 字段 | 类型 | 必填 | 来源/用途 |
| --- | --- | --- | --- |
| `cid` | string | 是 | `uni.getPushClientId()` 返回的 `result.cid`；不能为空 |
| `platform` | string | 建议 | `android` 或 `ios`，供后端审计与排障，不可作为身份依据 |
| `appVersion` | string | 可选 | 客户端版本，便于排障和灰度 |

**不要由前端传递 `userId`。** 后端应完全依据 `token` 解析当前用户。

#### 后端处理要求

1. 校验 token，得到当前 `userId`；
2. 校验 `cid` 不为空且长度在合理范围；
3. 对 `(userId, cid)` 做新增或更新；
4. 同一 CID 若原先属于其他用户，按产品策略迁移到当前用户或拒绝；共享设备场景建议保留多对多关系，并记录最后活跃时间；
5. 记录 `platform`、`appVersion`、`lastSeenAt`、状态；
6. 返回成功前，确保后续按该 CID 可查询到推送目标。

#### 建议响应

```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "cid": "a0b1c2d3e4f5...",
    "bound": true,
    "updatedAt": "2026-08-10 14:30:00"
  }
}
```

前端当前只需要 `code` 和 `msg`，`data` 主要用于日志与后续扩展。

### 4.2 解绑当前用户的 CID（建议新增）

| 项目 | 建议 |
| --- | --- |
| 方法 | `POST`（或 `DELETE`） |
| 路径 | `/push/client/unbind` |
| 认证 | 请求头 `token` |
| 幂等性 | 是；记录不存在也可返回成功 |
| 调用时机 | 用户主动退出登录、账号切换、token 失效前（若网络仍可用） |

#### 前端请求体

```json
{
  "cid": "a0b1c2d3e4f5..."
}
```

`cid` 应从本地缓存 `push_client_id` 读取。后端仍须由 token 确定用户，并只删除/失效当前用户与该 CID 的关联，不能根据 CID 删除其他用户记录。

#### 建议响应

```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "unbound": true
  }
}
```

### 4.3 可选：刷新设备活跃状态

如果后端需要清理失效 CID，可复用 `POST /push/client/bind` 作为心跳：每次 CID 成功获取且用户已登录时提交即可，无须单独增加心跳接口。后端可以以 `lastSeenAt` 超时作为 CID 失效判定依据，并在 UniPush 返回无效 CID 时立即失效对应绑定关系。

## 5. 前端接入新增绑定接口的改动点

后端接口上线后，前端应在 `services/push.uts` 增加“CID 获取成功后同步后端”的逻辑，并在以下位置调用：

1. **登录成功后**：现有登录成功流程已经调用 `markPushSessionAuthenticated()`；此处或 CID 获取成功回调中触发绑定。
2. **CID 每次成功获取后**：若本次 CID 与已上报 CID 不同，重新绑定；即使相同，也可按节流策略更新活跃时间。
3. **退出登录前**：先读取缓存 CID 调用解绑接口，再清理本地推送会话状态。
4. **HTTP 401 场景**：401 通常无法可靠调用解绑接口，因此后端必须具备 CID 超时清理与发送失败失效机制；前端仍应清理本地会话状态。

建议维护一个本地 `push_bound_cid`（或 `push_last_uploaded_cid`）键，只有在以下情况上传：

- 当前用户已登录且 CID 非空；
- CID 与上次成功绑定值不同；或
- 距上次成功上报已超过后端约定的保活周期。

这样可避免 App 每次前台切换都产生无效写请求。

## 6. 后端发送 UniPush 的业务约定

### 6.1 先落库，再推送

发送告警、事件或通知时，后端应按下列顺序执行：

1. 创建用户消息记录，生成全局唯一 `messageId`，初始 `status=1`；
2. 查找目标用户的有效 CID；
3. 使用 UniPush 服务端 API 向这些 CID 推送；
4. 在推送日志中保存 `messageId`、CID、UniPush 任务/消息 ID、发送结果和失败原因；
5. 推送失败不应回滚已创建的消息记录，用户仍可在消息中心通过轮询看到该消息。

**原因**：当前前端点击推送后需要通过 `/usermessage/listForUser` 查询同一个 `messageId`。如果只推送、不落消息中心记录，点击通知后无法打开详情。

### 6.2 推送 payload 必填字段

前端接受以下任一 ID 字段：

1. `messageId`（**推荐，标准字段**）；
2. `message_id`；
3. `id`；
4. 字符串或对象形式的 `data.messageId`。

推荐使用扁平 JSON：

```json
{
  "messageId": "10001",
  "messageType": 1,
  "bizType": "geofence_alarm"
}
```

其中 `messageId` 必须与消息列表接口中该条记录的 `messageId` **完全一致**（字符串比较）。`messageType`、`bizType` 当前前端不会读取，但可为后端日志和后续扩展保留。

### 6.3 点击事件与页面跳转

前端仅在收到的 UniPush 事件满足以下条件时自动跳转：

```json
{
  "type": "click",
  "messageId": "10001"
}
```

随后跳到 `/pages/message/message`，重新加载消息列表并打开匹配消息。

实际 UniPush 透传/点击事件的外层结构由 DCloud SDK 与厂商通道决定。后端的核心责任是确保自定义 payload 原样包含 `messageId`；前端已能兼容 payload 为 JSON 字符串或对象的情况。

### 6.4 通知展示字段

建议后端发送时同时提供通知标题、正文和自定义 payload，例如：

```json
{
  "title": "电子围栏告警",
  "content": "车辆粤B12345于 14:30 离开围栏",
  "payload": {
    "messageId": "10001",
    "messageType": 1,
    "bizType": "geofence_alarm"
  }
}
```

标题和正文由系统通知栏展示；当前前端业务代码不读取它们。消息详情最终内容仍以消息列表 API 返回的 `content` 为准。

## 7. 数据表与发送侧建议

以下为后端实现建议，不是当前前端强制字段。

### 7.1 CID 绑定表

建议至少具备：

| 字段 | 说明 |
| --- | --- |
| `id` | 主键 |
| `user_id` | 业务用户 ID |
| `cid` | UniPush Client ID |
| `platform` | android / ios |
| `app_version` | 可选客户端版本 |
| `status` | active / inactive |
| `last_seen_at` | 最近一次绑定/活跃时间 |
| `created_at` / `updated_at` | 审计时间 |

建议索引：`user_id + status`、`cid`；并根据“一个 CID 是否允许绑定多个账号”的业务规则设计唯一约束。

### 7.2 用户消息表

应至少能提供第 3.1 节所需字段：`messageId`、`messageType`、`content`、`createTime`、`status`，并具备所属 `userId`。服务端查询消息详情/标记已读时必须校验该消息归属当前 token 对应的用户。

### 7.3 失败处理

- UniPush 返回 CID 无效/失效：将该 CID 标记 inactive，避免持续重试发送；
- 一个用户有多个有效 CID：向全部有效 CID 发送，同一 `messageId` 只创建一条用户消息；
- 发送接口超时：记录可追踪的失败日志，消息中心记录保留；
- CID 绑定接口重复请求：返回成功，不能产生重复数据；
- 收到过期 token：返回 HTTP 401，不要仅返回 HTTP 200 + 非零业务码，因为现有前端只会在 HTTP 401 时自动清理登录态。

## 8. 联调清单

### 后端完成前

- [ ] 确认 UniPush 控制台、Android 厂商通道、iOS APNs 的发布配置已完成；
- [ ] 实现 `POST /push/client/bind`；
- [ ] 实现 `POST /push/client/unbind`；
- [ ] 确认 `/usermessage/listForUser` 返回字段与第 3.1 节一致；
- [ ] 确认 `/usermessage/detail/{msgId}` 会将未读消息设为已读；
- [ ] 确认服务端发送前先创建消息记录，并将相同 `messageId` 放入 payload。

### 前后端联调时

- [ ] Android 13+：通知权限允许后，确认日志中获取到非空 CID；
- [ ] iOS 真机：确认 APNs 配置完成并能拿到 CID；
- [ ] 登录后：确认绑定接口请求头有 `token`、请求体有 CID，后端能查到 userId—CID 关系；
- [ ] 从后端向该 CID 发送一条含 `messageId` 的通知；
- [ ] 点击通知：确认进入消息 Tab，且对应消息记录存在于第一页并自动打开；
- [ ] 打开未读消息：确认 `/usermessage/detail/{msgId}` 被调用，重新查询后状态为 `0`；
- [ ] 退出登录/切换账号：确认 CID 绑定关系符合产品设定，旧账号不再接收新账号消息；
- [ ] 将 CID 人为设为无效：确认服务端发送失败后能失效/清理记录。

## 9. 当前实现的边界与注意事项

1. **当前代码没有 CID 上报**：仅完成了 CID 获取和本地缓存。因此本文第 4、5 节是上线 UniPush 定向推送所需的补充契约。
2. **通知点击只能进入消息中心**：尚未实现按车辆、围栏、轨迹等业务页面深链跳转。
3. **点击后只查消息列表第一页**：如果目标 `messageId` 不在第一页，前端会刷新列表但不会自动打开该消息。后端应保证新推送消息按时间倒序位于第一页；如需支持历史消息点击精确打开，建议后续新增“按 messageId 获取消息详情”接口并改造前端兜底查询。
4. **本地 CID 不会随退出登录删除**：这是合理的，CID 属于 App 安装；但用户与 CID 的服务端关联需要解绑或切换。
5. **Token 不应出现在推送 payload 中**：payload 可被设备侧读取，推送仅传递非敏感业务定位信息（如 `messageId`）。
6. **所有按 messageId 的接口必须做归属鉴权**：不能因客户端知道 messageId 就允许查看或修改其他用户消息。
