# Uni Verify 一键登录接入说明

> Android / iOS 同时提供本机号码一键登录和短信验证码登录。一键登录保持默认且优先；短信登录仅在用户主动选择后显示。

## 平台行为

| 平台 | 个人用户登录 | 兜底 |
| --- | --- | --- |
| 微信小程序 | 保持现有微信 `getPhoneNumber` + `/authLogin` | 保持现状 |
| Android / iOS | `uni.getUniVerifyManager()` 标准授权页本机号码一键登录 | 提示用户检查设备、SIM 卡、移动网络或稍后重试 |

企业账号密码登录继续使用既有 `/sys/login`，不受本次改动影响。

## 原生配置前置条件

`manifest.json` 已在 `app-android.distribute.modules`、`app-ios.distribute.modules` 中启用 `uni-verify`。在 HBuilderX / DCloud Uni Verify 控制台仍必须完成下列发布配置：

1. 为应用 AppID `__UNI__662B0B4` 开通 Uni Verify。
2. Android 配置正式包名、**release 签名证书**和控制台要求的运营商信息；离线工程的 debug APK 通常使用另一份 debug 证书，不能用于验收一键登录。
3. iOS 配置正式 Bundle Identifier、证书/描述文件和控制台要求的信息。
4. 使用包含 `uni-verify` 的 Android/iOS 原生包在真机上测试；热更新和模拟器不能替代运营商认证验证。
5. 在隐私政策中告知：为本机号码认证，会向运营商请求认证并在服务端处理手机号；授权页须同时展示业务协议和运营商协议。

当前实现采用官方标准授权页 `login()`，未使用 `customLogin()`，以避免自定义运营商授权页的协议展示合规风险。

## Android 离线构建排查

Android 离线工程必须以最终 release APK/AAB 的证书指纹为准：用 `apksigner verify --print-certs` 或 `keytool` 获取 SHA-1，并与 Uniappx 控制台登记值逐字比对。包名、`DCLOUD_UNI_APPID`、`dcloud_appkey`、`GETUI_APPID`、`GY_APP_ID` 也必须与控制台配置一致。

官方 Uni Login 错误码表将 `30004` 定义为“其他错误”，并建议查看 30004 专题排查或联系官方支持。因此客户端预取号返回 `30004` 时，不能将其直接归因为 SIM 卡、移动网络或 `READ_PHONE_STATE` 缺失；应同时记录 `errMsg`、`cause`、实际包名、最终 APK 签名及测试网络环境。应用代码不应在预取号前申请 `READ_PHONE_STATE`，除非后续 SDK 官方文档明确要求且完成合规评估。

官方参考：[一键登录错误码](https://doc.dcloud.net.cn/uniCloud/uni-login/dev.html#错误码)。

## Uni Verify 后端待实现接口

> 以下仅为 Uni Verify 前端示例契约。`api/request.uts` 已标注“后端待实现的示例接口”。后端完成后可替换 URL 或按同样数据语义联调。

### 1. Uni Verify 换号登录

`POST /auth/login`

请求：

```json
{
  "openId": "Uni Verify 成功回调的 openId",
  "accessToken": "Uni Verify 成功回调的 accessToken",
  "platform": "android",
  "clientVersion": "1.0.0",
  "clientId": "428a8310cd442757ae699df5d894f051",
  "grantType": "univerify",
  "tenantId": "000000"
}
```

- `openId`、`accessToken` 由 `uni.getUniVerifyManager().login()` 成功回调直接透传；不得由客户端伪造手机号代替。
- `platform` 仅为 `android` 或 `ios`，用于审计和服务端处理，不可作为身份凭证。
- 客户端不会存储或打印完整 `accessToken`。

成功响应（`data.access_token` 必填）：

```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {
    "access_token": "业务登录 token",
    "expire_in": 7200,
    "client_id": "428a8310cd442757ae699df5d894f051"
  }
}
```

失败响应：

```json
{
  "code": 500,
  "msg": "认证凭据无效或已过期",
  "data": null
}
```

服务端必须使用 Uni Verify 服务端能力通过 `openId` / `accessToken` 换取手机号，再按手机号查找个人用户；不存在时自动注册个人用户，校验账号状态后返回现有业务 token。

## 短信验证码登录

### 平台与切换规则

Android/iOS 个人用户登录页默认显示本机号码一键登录和“验证码登录”入口：

- 一键登录优先，Uni Verify 取消、预取号失败、运营商不支持或服务端拒绝时，仅显示失败原因，**不会自动切换**到短信登录。
- 用户必须主动点击“验证码登录”后，才会看到手机号、验证码及获取验证码表单；可点击“返回一键登录”回到默认页面。
- 微信小程序继续使用微信 `getPhoneNumber` + `/authLogin`；企业账号密码继续使用 `/sys/login`，不受此流程影响。

### 1. 获取短信验证码

`GET /resource/sms/code`

查询参数：

```text
phonenumber=13800138000&tenantId=000000
```

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `phonenumber` | 是 | 用户手机号，不能为空。 |
| `tenantId` | 否 | 租户 ID；客户端默认传 `000000`。 |

成功响应：

```json
{
  "code": 200,
  "msg": "操作成功",
  "data": null
}
```

后端按手机号限流，同一手机号 60 秒内只能发送一次。客户端在发码成功后启动 60 秒倒计时，倒计时结束前禁用再次发送；实际验证码为 4 位数字，有效期由后端配置控制（当前为 2 分钟）。

### 2. 短信验证码登录

`POST /auth/login`

请求体：

```json
{
  "clientId": "428a8310cd442757ae699df5d894f051",
  "grantType": "sms",
  "tenantId": "000000",
  "phonenumber": "13800138000",
  "smsCode": "4826"
}
```

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `clientId` | 是 | 当前 App 客户端 ID；后端 `sys_client` 必须启用 `sms` 授权类型。 |
| `grantType` | 是 | 固定为 `sms`。 |
| `tenantId` | 否 | 客户端默认传 `000000`。 |
| `phonenumber` | 是 | 用户手机号。 |
| `smsCode` | 是 | 4 位短信验证码。 |

成功响应必须在 `data.access_token` 返回业务令牌：

```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {
    "access_token": "eyJhbGciOiJIUzUxMiJ9....",
    "expire_in": 86400,
    "client_id": "428a8310cd442757ae699df5d894f051"
  }
}
```

验证码校验成功后后端会删除 Redis 中的验证码，不能重复使用。业务失败会以 `code: 500` 和 `msg` 返回，例如验证码过期、验证码错误、用户不存在/停用、租户校验失败，或客户端未配置 `sms` 授权类型。客户端优先展示该 `msg`。

## 验收清单

1. 微信小程序仍将 `{ code, encryptedData, iv }` 提交到 `/authLogin`。
2. 企业账号密码仍将原字段提交到 `/sys/login`。
3. Android/iOS 默认进入一键登录视图；一键登录失败后页面不会自动显示短信表单。
4. 用户主动选择“验证码登录”后，未同意协议、非法手机号或非 4 位验证码均不能发起对应请求。
5. 发码请求为 `GET /resource/sms/code`，携带 `phonenumber` 和 `tenantId=000000`；成功后 60 秒内不可重复发送。
6. 短信登录请求为 `POST /auth/login`，携带完整 SMS 授权字段；成功时保存 `data.access_token` 并进入首页。
7. 正确处理服务端业务错误、网络失败及一键登录取消，且任何按钮的 loading 状态都能恢复。

官方 API 参考：[uni.getUniVerifyManager()](https://doc.dcloud.net.cn/uni-app-x/api/get-univerify-manager.html)。
