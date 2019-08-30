const Controller = require('egg').Controller;
const jwt = require('jsonwebtoken');
const {createRule, createProp} = require('../../utils/utils');
// 签发token
function createToken(userInfo, key){
  // 签发token
  let token = jwt.sign(userInfo, key);
  return token;
}
class UserController extends Controller{
  constructor(props){
    super(props);
    this.statuShow = {
      nopass: () => this.ctx.sendRes(this.ctx, {
        code: 0,
        status: 406
      }),
      msg400: (msg) => this.ctx.sendRes(this.ctx, {
        code: 0,
        status: 400,
        msg: msg
      }),
      success: () => this.ctx.sendRes(this.ctx, {
        code: 1,
        status: 200
      }),
      successData: (data) => this.ctx.sendRes(this.ctx, {
        code: 1,
        status: 200,
        data: data
      }),
      noIdentity: () => this.ctx.sendRes(this.ctx, {
        code: 0,
        status: 406,
        msg: '该身份不存在'
      }),
      authoExsis: () => this.ctx.sendRes(this.ctx, {
        code: 0,
        status: 406,
        msg: '该身份的权限已经存在'
      }),
      noAutho: () => this.ctx.sendRes(this.ctx, {
        code: 0,
        status: 406,
        msg: '该身份的权限不存在，删除失败'
      }),
      userNameExsis: () => this.ctx.sendRes(this.ctx, {
        code: 0,
        status: 406,
        msg: '用户名重复'
      })
    };
  }
  // 登录接口
  async login(){
    // 验证用户明和面是否符合规则
    let isSucc = this.ctx.valid(this.ctx, {
      rules: {
        userName: 'username',
        userPwd: 'userpwd'
      }
    });
    if(!isSucc){
      return;
    }
    // 验证是否有用户名和密码
    let {userName, userPwd} = this.ctx.request.body;
    // 判断是否是超级管理员
    if(userName === this.ctx.app.config.superAdmin.userName && userPwd === this.ctx.app.config.superAdmin.userPwd){
      let userInfo = {
        signTime:new Date().getTime(),
        superAdmin: true
      };
      let token = createToken(userInfo, this.ctx.app.config.keys);
      this.statuShow['successData']({
        identityName: this.ctx.app.config.superAdmin.identityName,
        userName: this.ctx.app.config.superAdmin.userName,
        token: token,
        limitView: this.ctx.app.config.superAdmin.limitView
      });
      return;
    }
    let sql = `select * from user,identity where userName="${userName}" And user.identity=identity.id And user.isAble=1`;
    let userResult = await this.app.mysql.query(sql);
    if(userResult.length === 0){
      this.statuShow['msg400']('没有该用户');
      return;
    }
    if(userResult[0].userPwd !== userPwd){
      this.statuShow['msg400']('密码不正确');
      return;
    }
    // 获取该用户的视图权限信息
    let viewSql = `select * from identity,identity_autho where
    identity.id=identity_autho.identity_id And identity.id=${userResult[0].identity}
    And identity_autho.isAble=1
    `;

    let authoritys = await this.app.mysql.query(viewSql);
    // 该身份的所有的权限
    authoritys = authoritys.map(item => item.authority);
    // 写入用户信息
    delete userResult[0].userPwd;
    let userInfo = {
      signTime:new Date().getTime(),
      ...userResult[0],
      authoritys
    };
    let token = createToken(userInfo, this.ctx.app.config.keys);
    // 获取所有的权限表
    let allAuthority = this.ctx.app.config.authority;
    // 把该身份所有的视图权限组合起来
    let authorityForIdentity = [];
    authoritys.forEach(item => {
      authorityForIdentity = authorityForIdentity.concat(allAuthority[item].vieibleRoutesElements);
    });
    authorityForIdentity = [...new Set(authorityForIdentity)];
    this.statuShow['successData']({
      identityName: userResult[0].identityName,
      userName: userResult[0].userName,
      token: token,
      limitView: this.ctx.app.config.removeVisibleRoutesElements(authorityForIdentity).toString() //筛选受限视图
    });
        
  }
  // 获取所有的用户
  async getAllUser(){
    let result = await this.ctx.service.user.getAllUser();
    this.statuShow['successData'](result);
  }

  // 获取所有的身份
  async getAllIdentity(){
    let result = await this.ctx.service.user.getAllIdentity();
    this.statuShow['successData'](result);
  }

  // 获取属于该身份的所有用户
  async getUserFromIdentity(){
    const {ctx} = this;
    let isPass = ctx.valid(ctx, {
      rules: {
        identityId: 'number'
      },
      params: ctx.request.query
    });
    if(!isPass){
      return;
    }
    const {identityId} = ctx.request.query;
    let result = await ctx.service.user.getUserFromIdentity(identityId);
    this.statuShow['successData'](result);
  }
  // 获取属于该身份的所有权限
  async getAuthorityFromIdentity(){
    const {ctx} = this;
    let isPass = ctx.valid(ctx, {
      rules: {
        identityId: 'number'
      },
      params: ctx.request.query
    });
    if(!isPass){
      return;
    }
    const {identityId} = ctx.request.query;
    let result = await ctx.service.user.getAuthorityFromIdentity(identityId);
    this.statuShow['successData'](result);
  }

  // 获取所有的权限
  async getAllAuthority(){
    this.statuShow['successData'](this.app.config.authority);
  }
  // 添加新用户
  async addNewUser(){
    const allProps = [
      ['userName', 'username', true],
      ['userPwd', 'userpwd', true],
      ['identity', 'number', true]
    ];
    const isPass = this.ctx.valid(this.ctx, {
      rules: createRule(allProps)
    });
    if(!isPass){
      return;
    }
    const isSuccess = this.ctx.moreProp(this.ctx, createProp(allProps), this.ctx.request.body);
    if(!isSuccess){
      return;
    }
    const {userName, userPwd, identity} = this.ctx.request.body;
    let result = await this.ctx.service.user.addNewUser(userName, userPwd, identity);
    this.statuShow[result]();
  }
  // 添加新身份
  async addNewIdentity(){
    const allProps = [
      ['identityName','string', true]
    ];
    let isPass = this.ctx.valid(this.ctx, {
      rules: createRule(allProps)
    });
    if(!isPass){
      return;
    }
    const {identityName} = this.ctx.request.body;
    let result = await this.ctx.service.user.addNewIdentity(identityName);
    this.statuShow[result]();
  }
  // 编辑用户
  async editUser(){
    const editProp = [
      ['userName', 'username', false],
      ['userPwd', 'userpwd', false],
      ['identity', 'number', false]
    ];
    const allProps = [
      ['userid', 'number', true],
      ['editData', 'object', true]
    ];
    // 判断参数是否合法
    const isPass = this.ctx.valid(this.ctx, {
      rules: createRule(allProps)
    });
    if(!isPass){
      return;
    }
    const {editData} = this.ctx.request.body;
    const isPass2 = this.ctx.valid(this.ctx, {
      rules: createRule(editProp),
      params: editData
    });
    if(!isPass2){
      return;
    }
    // 判断是否有多余的参数
    const isSucc = this.ctx.moreProp(this.ctx, createProp(editProp), editData);
    if(!isSucc){
      return;
    }
    const {userid} = this.ctx.request.body;
    // 开始操作数据库
    let result = await this.ctx.service.user.editUser(userid, editData);
    this.statuShow[result]();
  }

  // 编辑身份
  async editIdentity(){
    const allProps = [
      ['id', 'number', true],
      ['editData', 'object', true]
    ];
    const editProp = [
      ['identityName', 'string', false]
    ];
    let isPass = this.ctx.valid(this.ctx, {
      rules: createRule(allProps)
    });
    if(!isPass){
      return;
    }
    let {editData} = this.ctx.request.body;
    let isPass2 = this.ctx.valid(this.ctx, {
      rules: createRule(editProp),
      params: editData
    });
    if(!isPass2){
      return;
    }
    let isSucc = this.ctx.moreProp(this.ctx, createProp(editProp), editData);
    if(!isSucc){
      return;
    }
    const {id} = this.ctx.request.body;
    let result = await this.ctx.service.user.editIdentity(id, editData); 
    this.statuShow[result]();
  }
  // 给身份添加权限
  async addAuthorityForIdentity(){
    const allProp = [
      ['identity_id', 'number', true],
      ['authority', 'string', true]
    ];
    let isPass = this.ctx.valid(this.ctx, {
      rules: createRule(allProp)
    });
    if(!isPass){
      return;
    }
    const {identity_id, authority} = this.ctx.request.body;
    let result = await this.ctx.service.user.addAuthorityForIdentity(identity_id,authority);
    this.statuShow[result]();
  }
  // 去掉该身份的权限
  async removeAuthorityForIdentity(){
    const allProp = [
      ['identity_id', 'number', true],
      ['authority', 'string', true]
    ];
    let isPass = this.ctx.valid(this.ctx, {
      rules: createRule(allProp)
    });
    if(!isPass){
      return;
    }
    const {identity_id, authority} = this.ctx.request.body;
    let result = await this.ctx.service.user.removeAuthorityForIdentity(identity_id,authority);
    this.statuShow[result]();
  }
  // 删除身份和用户
  async removeUserAndIdentity(){
    let allProps = [
      ['tableName', 'string', true], // 该值只能是 identity 或者 user
      ['id', 'number', true]
    ];
    let isPass = this.ctx.valid(this.ctx, {
      rules: createRule(allProps)
    });
    if(!isPass){
      return;
    }
    const {tableName, id} = this.ctx.request.body;
    let result = await this.ctx.service.user.removeUserAndIdentity(tableName, id);
    this.statuShow[result]();
  }
}
module.exports = UserController;