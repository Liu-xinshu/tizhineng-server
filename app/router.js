'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  // 测试示例
  router.get('/test', controller.orgChart.test);

  // 用户登录的接口
  router.post('/user/login', controller.user.login);
  // 管理用户的接口

  //获取所有用户
  router.get('/user/getAllUser', controller.user.getAllUser);
  // 获取所有身份
  router.get('/user/getAllIdentity', controller.user.getAllIdentity);
  // 获取属于该身份的所有用户
  router.get('/user/getUserFromIdentity', controller.user.getUserFromIdentity);
  // 获取属于该身份的所有权限
  router.get('/user/getAuthorityFromIdentity', controller.user.getAuthorityFromIdentity);
  // 获取所有的权限
  router.get('/user/getAllAuthority', controller.user.getAllAuthority);
  // 添加最新用户
  router.post('/user/addNewUser', controller.user.addNewUser);
  // 添加最新身份
  router.post('/user/addNewIdentity', controller.user.addNewIdentity);
  // 编辑用户
  router.post('/user/editUser', controller.user.editUser);
  // 编辑身份
  router.post('/user/editIdentiy', controller.user.editIdentity);
  // 给身份添加权限
  router.post('/user/addAuthorityForIdentity', controller.user.addAuthorityForIdentity);
  // 给身份去掉权限
  router.post('/user/removeAuthorityForIdentity', controller.user.removeAuthorityForIdentity);
  // 删除身份和用户
  router.post('/user/removeUserAndIdentity', controller.user.removeUserAndIdentity);
  // 组织架构相关接口  数据库表-org_chart
  
  // 添加部门
  router.post('/org_chart/addDepartment', controller.orgChart.addDepartment);
  // 修改部门
  router.post('/org_chart/editDepartment', controller.orgChart.editDepartment);
  // 删除部门
  router.post('/org_chart/delDepartment', controller.orgChart.delDepartment);
  // 查看组织架构(根据parentCode)
  router.get('/org_chart/getDepartment', controller.orgChart.getDepartment);
  // 获取isAble==1的所有org
  router.get('/org_chart/getTotalOrglist', controller.orgChart.getTotalOrglist);

  // 市场老师相关接口   数据库表 - market_teacher

  // 添加市场老师
  router.post('/market_teacher/addTeacher', controller.marketTeacher.addTeacher);
  // 查看市场老师
  router.get('/market_teacher/getTeacher', controller.marketTeacher.getTeacher);
  // 删除市场老师
  router.post('/market_teacher/delTeacher', controller.marketTeacher.delTeacher);

  // 录入学生相关接口   数据库表 - apply_student

  //录入学生
  router.post('/apply_student/addStudent', controller.applyStudent.addStudent);
  // 查询学生
  router.get('/apply_student/getStudent', controller.applyStudent.getStudent);
  // 删除学生
  router.post('/apply_student/delStudent', controller.applyStudent.delStudent);
  
};
