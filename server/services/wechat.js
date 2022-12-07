'use strict';
const axios = require("axios")
const pluginId = require("../pluginId")
let queryIdentification = `plugin::${pluginId}.wx-credential`

module.exports = ({ strapi }) => ({

  makeRandomPassword(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() *
        charactersLength));
    }
    return result;
  },

  async getWeChatCredentials() {
    let data = await strapi.db.query(queryIdentification).findOne();
    return data;
  },

  createWeChatCredentials(data) {
    return new Promise(async (resolve, reject) => {
      try {
        let credentials = await this.getWeChatCredentials();
        if (!credentials) {
          await strapi.db.query(queryIdentification).create({
            data
          });
        } else {
          await strapi.db.query(queryIdentification).update({
            where: { id: credentials.id },
            data
          });
        }
        resolve();
      } catch (error) {
        reject(error);
      }
    })
  },

  login(code, userInfo = {}) {
    return new Promise(async (resolve, reject) => {
      try {
        let credentials = await this.getWeChatCredentials();
        if (!credentials) {
          return reject({ error: true, message: "Add credentials to activate the login feature." })
        }

        const { app_id, app_secret } = credentials;
        if (!app_id || !app_secret) {
          return reject({ error: true, message: "Missing credentials" });
        }

        let resData = await axios.get(`https://api.weixin.qq.com/sns/jscode2session?appid=${app_id}&secret=${app_secret}&js_code=${code}&grant_type=authorization_code`)
        if (resData.status !== 200) {
          return reject({ error: true, message: "Error occur when request to wechat api" });
        }
        if (!resData.data.openid) {
          return reject({ error: true, message: resData.data });
        }

        const { openid } = resData.data;
        const user = await strapi.db.query('plugin::users-permissions.user').findOne({ where: { openid } });
        if (!user) {
          let randomPass = this.makeRandomPassword(10);
          let password = await strapi.service("admin::auth").hashPassword(randomPass);
          let newUser = await strapi.db.query('plugin::users-permissions.user').create({
            data: {
              password,
              openid,
              wechatUserInfo: userInfo,
              confirmed: true,
              blocked: false,
              role: 1,
              provider: "local"
            }
          })
          return resolve({
            token: strapi.plugin('users-permissions').service('jwt').issue({ id: newUser.id }),
            user: strapi.service('admin::user').sanitizeUser(newUser),
          })
        }
        resolve({
          token: strapi.plugin('users-permissions').service('jwt').issue({ id: user.id }),
          user: strapi.service('admin::user').sanitizeUser(user),
        })
      } catch (error) {
        return reject({ error: true, message: error });
      }
    })
  },

});
