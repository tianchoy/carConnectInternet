# 微信小程序设备订阅消息（车辆告警）— 前端实现说明

> 日期：2026-09-23 ｜ 依据：后端《微信小程序订阅消息-前端对接API完整文档》
> 通道：**设备订阅（device / 长期）** —— `wx.requestSubscribeDeviceMessage`，非一次性订阅

---

## 1. 链路

```
首页「车辆告警通知」行（用户 tap）
   │
   ├─① GET /app/notify/quota ─────────► 取 alarm 的 templateId + mode（缓存到 storage）
   │
   ├─② 判断是否已订阅（展示「已订阅/开启通知」）
   │      · alarm  → 本机按「设备 + 模板」记录的授权结果（微信无查询接口）
   │      · geofence → wx.getSetting(withSubscriptions) 的模板级状态
   │
   └─③ tap → GET /app/notify/deviceTicket?deviceNo=xxx（现取现用，5 分钟）
             → wx.requestSubscribeDeviceMessage({ sn, snTicket, modelId, tmplIds })
             → 成功即长期有效（无额度账本，不上报）
             → 紧接着再申请围栏模板（见下）
```

> **两条通道**（2026-11-04 起）：设备订阅模板（type=3）的关键词枚举由微信平台封闭，只有「超速/停留超时/震动/低电量」，**无法表达「进出围栏」**。所以围栏告警改走后端 `geofence` 的独立模板，用 `wx.requestSubscribeMessage` 授权。
>
> 2026-11-05 真机实测补充：**围栏模板是 type=2 一次性订阅**（一次授权 = 1 条下发额度，用完即 `43101`），且 `wx.requestSubscribeMessage` 必须在 tap 手势链内**同步**发起，任何 `await` 之后调用都会被微信以 `can only be invoked by user TAP gesture` 静默拒绝。因此围栏授权必须单独放在一次点击的第一步（首页已按此实现），不能排在设备订阅换票之后。

> 一次性订阅通道（`order/expire/share` → `wx.requestSubscribeMessage` + `/subscribeReport`）已在 `utils/notify.uts` 中预留 `requestSubscribeOnce()`，当前场景未接线，暂不引用。

---

## 2. 文件清单

| 文件 | 改动 |
|---|---|
| `utils/notify.uts` | **新建**。通道分流、额度缓存、换票、设备订阅授权、一次性订阅（预留）、订阅状态查询 |
| `api/request.uts` | 新增 `/app/notify/quota`、`/app/notify/deviceTicket`、`/app/notify/subscribeReport` 三个调用与 `NotifyQuotaItem` 类型 |
| `pages/index/index.uvue` | banner 下新增「车辆告警通知」行：`mode=device` 且已登录/有设备时展示；点击走换票授权；切换设备、onShow 刷新状态 |
| `pages/deviceList/deviceList.uvue` | 删除遗留的一次性订阅调试代码（`uni.requestSubscribeMessage` + 硬编码 tmplId） |

---

## 3. 关键实现约束（严格按后端文档）

| 约束 | 实现 |
|---|---|
| 模板 ID **不硬编码**，一律取 `/app/notify/quota` | ✅ `fetchNotifyQuota()` → `getCachedQuota('alarm').templateId` |
| `mode` 驱动通道，不硬编码 | ✅ 仅 `mode == 'device'` 才走设备订阅；否则隐藏入口 |
| 未配置模板的场景不返回 → **隐藏引导 UI，不报错** | ✅ `subscribeAvailable == false` 时整行不渲染 |
| `snTicket` 5 分钟有效，**现取现用禁止缓存** | ✅ 每次订阅实时调 `/deviceTicket` |
| `deviceNo` 传**原始值**，后端归一化匹配 | ✅ 用首页当前设备的 `currentCarDeviceNo` |
| 必须在 **tap 手势链**内调用 | ✅ 仅 `@click` 触发，onLoad/onShow 只拉配置不弹窗 |
| 基础库 < 2.20.0 隐藏入口 | ✅ `wx.canIUse('requestSubscribeDeviceMessage')` |
| 用户取消（`fail cancel`）不打扰、不上报 | ✅ `errMsg` 含 `cancel` 时不提示 |
| device 通道**无需上报**结果 | ✅ 未调用 `subscribeReport` |
| 已订阅时点击不再重复弹授权 | ✅ 弹窗引导 `uni.openSetting` 自行管理 |
| 强提醒（`acceptWithAlert`） | ✅ 单独提示「已在微信中开启强提醒」 |

---

## 4. 状态机（首页订阅行）

| 条件 | 表现 |
|---|---|
| 非微信端 / 基础库不支持 / 未登录 / 无设备 | 整行隐藏 |
| `/quota` 无 alarm 或 `mode != 'device'` | 整行隐藏（静默降级） |
| 两个模板都未授权 | 绿色按钮「开启通知」，desc=「开启后，告警将通过微信服务通知提醒」；点击只申请设备订阅 |
| 设备已订阅、围栏模板未授权 | 绿色按钮「开启围栏提醒」，desc=「车辆告警已开启，再点一次开启围栏进出提醒」；点击只申请围栏模板（同步发起） |
| 两个模板都已授权 | 灰色按钮「已订阅」，desc=「车辆发生进/出围栏、超速等告警时将通过微信提醒」；点击弹窗 → 去设置页 |
| 切换设备 | 按新设备重新判断设备订阅状态，不会沿用上一台设备的状态 |
| 换票失败 | Toast 直接展示后端 `msg`（如「告警订阅模板未配置」「获取设备票据失败，请稍后重试」） |
| `reject` | Toast「您拒绝了通知授权，可点击按钮前往设置手动开启」 |
| `ban` / `filter` | 引导去设置页 / Toast「通知模板暂不可用，请联系客服」 |
| 订阅成功但只选了「接收」 | 弹框提示去「去设置 - 订阅消息」把每条通知改为「接收并提醒」 |

> **为什么必须点两次**：`wx.requestSubscribeDeviceMessage`（车辆定位器告警，需先换票、可异步）与 `wx.requestSubscribeMessage`（围栏进出通知，必须同步在 tap 手势内）是两个 API，微信一次点击只能调起一个订阅弹窗。所以第 1 次点击只做设备订阅，第 2 次点击只做围栏授权——**只有两个模板都授权成功，微信「通知管理」里才会同时出现两条、并各自可设为「接收并提醒」**。按钮三态（开启通知 → 开启围栏提醒 → 已订阅）就是用来明确这一步的。

---

## 5. 联调检查清单（前端侧）

1. 小程序登录 → 首页 banner 下出现「车辆告警通知」行（说明 `/quota` 返回了 `alarm.mode=device`）
2. 点「开启通知」→ 弹出「车辆定位器告警」授权框 → 允许 → 按钮变成「开启围栏提醒」
3. 再点「开启围栏提醒」→ 弹出「围栏进出通知」授权框 → 允许 → 按钮变成「已订阅」
4. 小程序设置 → 通知管理 → 应同时看到「车辆定位器告警」「围栏进出通知」两条，且都可设为「接收并提醒」
5. 触发真实告警（进/出围栏）→ 微信「服务通知」收到卡片
6. 退出重进首页 → 仍显示「已订阅」（来自本机按设备记录的授权结果）
7. 切换到另一台车 → 该车未授权过时应回到「开启通知」，并能重新弹授权
8. 小程序设置页关闭订阅总开关 → 回首页应回到「开启通知」（引导重新授权）

后端侧配合项见对接文档 §七（`enabled`、`device.model-id`、`alarm.template-id`、`miniprogram-state`）。

---

## 6. 需要后端确认 / 存在风险的点

1. **模板 ID 一致性**：后端文档 2.1 示例中 alarm 模板 ID 为 `T35_Egmgno0Rqib...`（单下划线），小程序后台截图为 `T35__Egmgn...`（双下划线）。前端不硬编码、以 `/quota` 返回值为准，**请确认 yml 中填的是后台「我的模板」里的真实 ID**。
2. **`wx.getSetting` 不覆盖设备订阅模板（已确认）**：`subscriptionsSetting.itemSettings` 只返回一次性订阅模板，device 模板不会出现。因此设备订阅状态**只能**以授权回调结果为准，前端按「设备 + 模板」落在本机 storage（`wx_dev_sub_<deviceNo>` = `<templateId>|<status>`），换设备、换模板都要重新授权一次。
3. **多设备订阅**：`requestSubscribeDeviceMessage` 单次只能传一个 `sn`，当前首页只对「当前选中设备」订阅。用户有多台设备需切换后逐台订阅（长期、每台一次）——前端已按设备维度记录状态，切换设备后按钮会回到「开启通知」，授权成功后也会提示「其它设备需切换后单独开启」。若希望一次授权多台，需后端接入设备组（`/wxa/business/group/*`）。
4. **授权时机**：后端文档推荐转化率最高的是「绑定设备成功页」和「设备详情页开关」，当前按需求只做了首页行。如需提升订阅率，建议后续在这两处补入口（复用 `authorizeDevice(deviceNo)` 即可）。
5. **`sn` 一致性铁律**：订阅侧换票的 `sn` 与下发侧的 `sn` 必须同源同值，否则微信报 **9800006**。
6. **跳转页**：`page` 必须是现网版本 `app.json` 中存在的路径，联调期 `miniprogram-state=developer`，否则点击通知会跳线上版。

---

## 7. 「授权返回成功但微信收不到通知」排查顺序

前端授权成功只代表**微信侧建立了订阅关系**，通知能不能到手还取决于下列环节。按顺序排查：

| # | 检查项 | 判定方法 | 责任方 |
|---|---|---|---|
| 1 | 是否真的为**这台设备**授权过 | 前端已按设备维度记录；切换设备后必须重新授权（旧版本用一条全局标记，换车后会误显示「已订阅」并跳过授权，本次已修复） | 前端 |
| 2 | 授权返回的是 `accept` 还是 `acceptWithAlert` | `accept` = 只进微信「服务通知」列表，**不弹横幅、不响铃**，用户会以为没收到；需在设置页改成「接收并提醒」 | 前端/用户 |
| 3 | 订阅消息总开关 | `wx.getSetting().subscriptionsSetting.mainSwitch` 为 `false` 时全部不生效 | 用户 |
| 4 | 换票 `sn` / `modelId` / `templateId` 与下发侧是否同源 | 服务端下发必须使用与 `GET /app/notify/deviceTicket` 完全相同的 `sn`、`modelId`、`templateId`，否则微信报 **9800006**；前端已把这三个值打包在 `DeviceAuthorizeOutcome` 里，可加日志核对 | 后端 |
| 5 | 服务端是否真的调了下发接口 | 查后端日志：`subscribeMessage.send`（或设备订阅下发接口）调用返回 `errcode`。`43101` = 用户未订阅/已退订，`47003` = 模板参数不合法，`9800006` = sn 不一致 | 后端 |
| 6 | 小程序是否开通「设备消息」能力 | 微信公众平台 → 设置 → 接口设置 → 设备消息；未开通时授权可能成功但无法下发 | 后端/运营 |
| 7 | 告警是否真的触发 | 设备上报进/出围栏、超速等事件后后端才推送；可通过后端日志确认 | 后端/设备 |

> 结论：前端能保证的是「每台设备都真实发起且完成过授权」；下发放不出消息属于第 4~7 项，需后端按上表逐项核对。
