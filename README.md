# WeChat MiniProgram Auth
WeChat MiniProgram Auth helps you to easily create WeChat MiniProgram authentication available for your user. It uses the official [USER LOGIN REQUEST](https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/user-login/code2Session.html) to get the authorization, you can get it working in under 5 minutes in your WeChat MiniProgram application.

# Features
- Official USER LOGIN REQUEST integration
- Using strapi default user-permission collection
- JWT Authentication
- Sanitized response
- Highly secure

# How to use
### STEP 1
Install the strapi plugin
> npm i strapi-wechat-miniprogram-auth

### STEP 2
Add the folling lines of code in the file: config/plugins.js
```
module.exports = {
    // ...
    'strapi-wechat-miniprogram-auth': {
        enabled: true
    },
    // ...
}
```
After done this, you can start the application with command:
> npm run develop

### STEP 3
- Config the WeChat AppID and AppSecret.

Go to the Strapi Dashboard, and change to the PLUGINS -> WeChat Mini Program Authenticator, input the AppID,AppSecret and save it.

- Add fileds to User Collection

Go to the Strapi Dashboard, and change to the User Collection(PLUGINS -> Content-Type Builder -> COLLECTION TYPES -> User).
Add two fields to this collection, and save.
|  NAME   | TYPE  |
|  ----  | ----  |
| openid  | Text |
| wechatUserInfo  | JSON |

### STEP 4

Use the getUserInfo button in your WeChat MiniProgram to get the current userinfo and use wx.login to get User login credentials

#### WXML

```html
<!-- 需要使用 button 来授权登录 -->
<button open-type="getUserInfo" bindgetuserinfo="login">授权登录</button>
```

#### Javascript
Initialisation a request to STRAPI_BACKEND to get JWT token and Sanitized userinfo.

```javascript
login(e) {
    let userInfo = e.detail.userInfo
    wx.login({
      success: res => {
        // 发送res.code到后台换取openId,sessionKey,unionId
        wx.request({
          url: 'STRAPI_BACKEND_URL/strapi-wechat-miniprogram-auth/login',
          method: "post",
          data: {
            code: res.code,
            userInfo
          },
          success(res) {
            console.log('wx.request res', res)
          }
        })
      }
    })
  }
```

The STRAPI_BACKEND request response look like this:
```JSON
    {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjY3NTM3MzU5LCJleHAiOjE2NzAxMjkzNTl9.giRP146cEV0wyIh98D3KJigHShsEGofedtW5YYckzsQ",
      "user": {
        "id": 1,
        "username": null,
        "email": null,
        "provider": "local",
        "confirmationToken": null,
        "confirmed": true,
        "blocked": false,
        "createdAt": "2022-11-04T02:41:27.149Z",
        "updatedAt": "2022-11-04T02:41:27.149Z",
        "openid": "oFHxc5TV5VKscIudqlmfx9JpK4d4",
        "wechatUserInfo": {
          "nickName": "wfz",
          "gender": 0,
          "language": "zh_CN",
          "city": "",
          "province": "",
          "country": "",
          "avatarUrl": "https://A-WECHAT-AVATAR-LINK"
        }
      }
    }
```
You can using the JWT token in your application.

# Report Bugs/Issues
Any bugs/issues you may face can be submitted as issues in the Github repo.
