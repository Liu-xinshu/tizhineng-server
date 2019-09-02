'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  console.log('app',app);
  // 用户登录的接口
  router.post('/user/login', controller.user.login);
  
};
