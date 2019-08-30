const ExtendList = require('../utils/extendList');

// 去掉可访问接口，返回最终的受限接口,其类型为 ExtendList;
/**
 * 
 * @param {Array} visibleApis 所有可访问的api接口编号组成的数组
 * @return {ExtendLit} 当前身份受限的api接口列表 
 */
function removeVisibleApi(visibleApis){
  const limitAPisArray = Object.keys(limitAPis).map(item => {
    return {
      ...limitAPis[item],
      index: parseInt(item)
    };
  });
  let allList = new ExtendList(limitAPisArray);
  visibleApis.forEach(item => {
    allList.remove({index: item});
  });
  return allList;
}

// 去掉可以访问视图，返回最终的受限视图
/**
 * 
 * @param {Array} routesElements 类似于['0-1-0']这样的数组，第一数字代表当前受限的路由，第二个数字代该路由是否可以访问，后边的数字分别代表受限的按钮
 * 
 * @return {ExtendLit} 当前身份受限的视图列表
 */
function removeVisibleRoutesElements(routesElements){
  // 最终受限的视图
  let allRoutesElements = Object.keys(limitsRoutesElements).map(item => {
    return {
      ...limitsRoutesElements[item],
      elements: {...limitsRoutesElements[item].elements},
      index: parseInt(item)
    };
  });
  allRoutesElements = new ExtendList(allRoutesElements);
  routesElements.map(item => {
    let arr = item.split('-');
    return [...arr].map(item => parseInt(item));
  }).forEach(item => {
    const [route, isVisible] = item;
    let index = allRoutesElements.find({index: route});
    allRoutesElements.toString()[index].routeIsVisible = isVisible;
    item.slice(2).forEach(item => {
      delete allRoutesElements.toString()[index].elements[item];
    });

  });
  return allRoutesElements;

}


// 所有的受限api接口
const limitAPis = {
  0: { // 查看组织架构
    url: '/org_chart/getDepartment', method: 'GET'
  },
  1: { // 添加组织架构
    url: '/org_chart/addDepartment', method: 'POST'
  },
  2: { // 删除组织架构
    url: '/org_chart/delDepartment', method: 'POST'
  },
  3: { // 编辑组织架构中的部门
    url: '/org_chart/editDepartment', method: 'POST'
  },
  4: { // 添加市场老师
    url: '/market_teacher/addTeacher', method: 'POST'
  },
  5: { // 查看市场老师
    url: '/market_teacher/getTeacher', method: 'GET'
  },
  6: { // 删除市场老师
    url: '/market_teacher/delTeacher', method: 'POST'
  },
  7: { // 录入学生
    url: '/apply_student/addStudent', method: 'POST'
  },
  8: { // 查询学生
    url: '/apply_student/getStudent', method: 'GET'
  },
  9: { //删除学生
    url: '/apply_student/delStudent', method: 'POST'
  },
  10: { // 获取所有用户
    url: '/user/getAllUser', method: 'GET'
  },
  11: {// 获取所有身份
    url: '/user/getAllIdentity', method: 'GET'
  },
  12: { // 获取该身份的所有用户
    url: '/user//user/getUserFromIdentity', method: 'GET'
  },
  13: { // 获取所有的权限
    url: '/user/getAllAuthority', method: 'GET'
  },
  14: { // 添加最新用户
    url: '/user/addNewUser', method: 'POST'
  },
  15: { // 添加最新身份
    url: '/user/addNewIdentity', method: 'POST'
  },
  16: { // 编辑用户
    url: '/user/editUser', method: 'POST'
  },
  17: { // 编辑身份
    url: '/user/editIdentiy', method: 'POST'
  },
  18: { // 给身份添加权限
    url: '/user/addAuthorityForIdentity', method: 'POST'
  },
  19: { // 给身份去掉权限
    url: '/user/removeAuthorityForIdentity', method: 'POST'
  },
  20: { // 获取该身份的所有权限
    url: '/user//user/getAuthorityFromIdentity', method: 'GET'
  },
  21: { // 删除用户和身份
    url: '/user/removeUserAndIdentity', method: 'POST'
  }
};

// 所有的受限的路由和元素

const limitsRoutesElements = {
  0: {
    routerId: 'org',  //  组织架构
    routeIsVisible: 0,
    elements: {
      0: 'addRootOrg', // 添加根组织按钮
      1: 'addChildOrg', // 添加子组织按钮
      2: 'delChildOrg' // 删除子组织按钮
    }
  },
  1: {
    routerId: 'userManger',  // 用户管理
    routeIsVisible: 0,
    elements: {}
  },
  2: {
    routerId: 'studyManger-test',  // 教学管理中的测试路由
    routeIsVisible: 1, 
    elements: {}
  },
  3: {
    routerId: 'marketTeacher', // 市场老师管理
    routeIsVisible: 0,
    elements: {}
  },
  4: {
    routerId: 'student', // 学生管理
    routeIsVisible: 0,
    elements: {}
  }
};

// 教学测试权限
const studyMangerTest = {
  name: '教学测试',
  vieibleRoutesElements: ['2-1'],
  visibleApi: []
};


// 查看组织架构的权限

const getOrg = {
  name: '查看组织架构',
  vieibleRoutesElements: ['0-1'],
  visibleApi: [0]
};

// 编辑组织架构的权限

const editOrg = {
  name: '编辑组织架构',
  vieibleRoutesElements: ['0-1-0-1-2'],
  visibleApi: [0,1,2]
};

// 仅能访问组织架构数据的权限
const getOrgApi = {
  name: '访问组织架构（仅仅api接口）',
  vieibleRoutesElements: [],
  visibleApi: [0]
};

// 用户管理的权限
const userManger = {
  name: '用户管理的权限(可进行全部的操作)',
  vieibleRoutesElements: ['1-1'],
  visibleApi: [10,11,12,13,14,15,16,17,18,19,20,21]
};

// 查看市场老师的权限
const getMarketTeacher = {
  name: '查看市场老师(仅仅能查看市场老师)',
  vieibleRoutesElements: ['3-1'],
  visibleApi: [0,5]
};
// 编辑市场老师的权限
const editMarketTeacher = {
  name: '编辑市场老师的权限(可添加可删除)',
  vieibleRoutesElements: ['3-1'],
  visibleApi: [0,4,5,6]
};

// 查看学生的权限
const getStudent = {
  name: '查看学生(仅能查看学生)',
  vieibleRoutesElements: ['4-1'],
  visibleApi: [0,8]
};
// 编辑学生的权限
const editStudent = {
  name: '编辑学生(可增加可删除)',
  vieibleRoutesElements: ['4-1'],
  visibleApi: [0,5,7,8,9]
};
// 
const authority = {
  editOrg,
  getOrg,
  getOrgApi,
  userManger,
  getMarketTeacher,
  getStudent,
  editMarketTeacher,
  editStudent,
  studyMangerTest
};
module.exports = {
  authority,
  removeVisibleApi,
  removeVisibleRoutesElements
};