'use strict';
const pluginId = require("../pluginId")

module.exports = ({ strapi }) => ({
  async getCredentials(ctx) {
    ctx.body = await strapi
      .plugin(pluginId)
      .service('wechatService')
      .getWeChatCredentials();
  },

  async createCredentials(ctx) {
    try {
      await strapi
        .plugin(pluginId)
        .service('wechatService')
        .createWeChatCredentials(ctx.request.body);

      ctx.body = { status: true }
    } catch (error) {
      console.log(error)
      ctx.body = { status: false }
    }
  },

  async login(ctx) {
    try {
      const code = ctx.request.body.code ? ctx.request.body.code : null;
      const userInfo = ctx.request.body.code ? ctx.request.body.userInfo : null;
      if (!code) {
        throw new ValidationError("Invalid/Missing auth code", null);
      }

      let user = await strapi
        .plugin(pluginId)
        .service('wechatService')
        .login(code, userInfo);

      ctx.body = user;
    } catch (error) {
      ctx.badRequest("Error occured while fetching the user profile", error);
    }
  },

});
