module.exports = [
  {
    method: 'GET',
    path: '/credentials',
    handler: 'wechatController.getCredentials',
    config: {
      policies: [],
    },
  },

  {
    method: 'POST',
    path: '/credentials/add',
    handler: 'wechatController.createCredentials',
    config: {
      policies: [],
    },
  },


  {
    method: 'POST',
    path: '/login',
    handler: 'wechatController.login',
    config: {
      auth: false,
      policies: [],
    },
  },

];
