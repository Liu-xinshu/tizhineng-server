'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  //首页 出勤
  router.get('/home/checkWork',controller.home.checkWork);
  //首页 日报
  router.get('/home/daily',controller.home.daily);
  //首页 客户
  router.get('/home/client',controller.home.client);
  //首页 活动数据
  router.get('/home/activeData',controller.home.activeData);
  // 用户登录的接口
  router.post('/user/login', controller.user.login);
  // 用户管理导入接口
  router.post('/management/importXlsx',controller.management.importXlsx);
  ///management/exportXlsx/original
  ///management/exportXlsx/data
  router.post('/management/exportXlsx/:original',controller.management.exportXlsx);
  //全部数据
  router.get('/management/alldata',controller.management.alldata);
  //新增接口
  router.post('/management/adddata',controller.management.adddata);
  //删除接口
  router.post('/management/removedata',controller.management.removedata);

};
