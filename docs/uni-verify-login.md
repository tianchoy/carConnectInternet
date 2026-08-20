# Uni Verify 一键登录接入说明

> Android / iOS 的短信验证码登录功能目前已注释停用；仅保留本机号码一键登录。相关短信接口和页面代码保留在源码注释中，恢复前不得作为可用登录方式对外说明。

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

## 后端待实现接口

> 以下接口目前是前端示例契约。`api/request.uts` 已标注“后端待实现的示例接口”。后端完成后可替换 URL 或按同样数据语义联调。

### 1. Uni Verify 换号登录

`POST /authLogin/uniVerify`

请求：

```json
{
  "openId": "Uni Verify 成功回调的 openId",
  "accessToken": "Uni Verify 成功回调的 accessToken",
  "platform": "android",
  "clientVersion": "1.0.0"
}
```

- `openId`、`accessToken` 由 `uni.getUniVerifyManager().login()` 成功回调直接透传；不得由客户端伪造手机号代替。
- `platform` 仅为 `android` 或 `ios`，用于审计和服务端处理，不可作为身份凭证。
- 客户端不会存储或打印完整 `accessToken`。

成功响应（`data.access_token` 必填）：

```json
{
  "code": 0,
  "msg": "登录成功",
  "data": {
    "access_token": "业务登录 token",
    "refreshToken": "可选",
    "expiresIn": 7200,
    "userInfo": {
      "id": "用户ID",
      "mobile": "可选，建议脱敏"
    }
  }
}
```

失败响应：

```json
{
  "code": 40101,
  "msg": "认证凭据无效或已过期",
  "data": null
}
```

服务端必须使用 Uni Verify 服务端能力通过 `openId` / `accessToken` 换取手机号，再按手机号查找个人用户；不存在时自动注册个人用户，校验账号状态后返回现有业务 token。

## 已停用的短信登录接口

以下短信验证码接口及其页面入口当前均已注释停用，仅保留历史契约供后续恢复功能时参考，Android/iOS 客户端不会调用它们。

### 历史接口：发送短信验证码

`POST /authLogin/sms/send`

```json
{
  "mobile": "13800138000",
  "scene": "login"
}
```

成功响应：

```json
{
  "code": 0,
  "msg": "发送成功",
  "data": {
    "cooldownSeconds": 60
  }
}
```

### 历史接口：短信验证码登录

`POST /authLogin/sms/login`

```json
{
  "mobile": "13800138000",
  "code": "123456",
  "platform": "ios"
}
```

成功响应与 Uni Verify 登录成功响应一致，且必须返回 `data.access_token`。

服务端应实现短信发送与校验频控、验证码过期和一次性使用、异常审计、HTTPS、认证凭据/手机号日志脱敏。首次验证成功但无对应个人用户时自动注册后登录。

## 验收清单

1. 微信小程序仍将 `{ code, encryptedData, iv }` 提交到 `/authLogin`。
2. 企业账号密码仍将原字段提交到 `/sys/login`。
3. Android / iOS 真机、受支持运营商 SIM 卡下，可打开标准授权页并在服务端换号后进入首页。
4. 用户取消、无 SIM、运营商不支持、网络失败或后端拒绝时，页面不残留加载状态，并提示用户检查设备、SIM 卡或移动网络后重试。
5. Android / iOS 个人用户登录页不展示短信号码、验证码、发码、验证码登录或登录方式切换入口；登录成功读取 `data.access_token`、保存既有本地 `token` 并进入首页。

官方 API 参考：[uni.getUniVerifyManager()](https://doc.dcloud.net.cn/uni-app-x/api/get-univerify-manager.html)。
