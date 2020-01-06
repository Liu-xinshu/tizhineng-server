'use strict';

const Controller = require('egg').Controller;
const Mock = require('mockjs');
class HomeController extends Controller {
  async checkWork() {
      let {ctx} = this;
      let {month} = ctx.request.query;
      if(month <= 0 || (!month)){
        ctx.sendRes(this.ctx, {
            code: 0,
            status: 400,
            msg: '参数格式不正确'
        })
        return ;
      }
      let data = Mock.mock({
        'attendance|20-25':1,
        'leave|1-5':1,
        'businessTravel|0-2':1,
        'late|4-10':1
      });
      const now = new Date();
      let nowMethod = now.getMonth()-(month-1);
      let year = now.getFullYear();
      ctx.sendRes(this.ctx, {
        code: 1,
        status: 200,
        data: {
            ...data,
            rate:Math.abs((data.leave)/(data.attendance+data.leave)-1).toFixed(2),
            date:new Date(year,nowMethod).toLocaleDateString()
        }
    })
  }
  async daily(){
      let {ctx} = this;
      const {time} = ctx.request.query;
      let data = Mock.mock({
        'finish|25-30':1
      });
      data.total = 30;
      data.notFinished = data.total - data.finish;
      if(!time){
        ctx.sendRes(this.ctx, {
            code: 0,
            status: 400,
            msg: '参数格式不正确'
        })
        return ;
      }
      ctx.sendRes(this.ctx, {
        code: 1,
        status: 200,
        data: {
            ...data,
            date:new Date(time).toLocaleDateString()
        }
    })
  }
  async client(){
    let {ctx} = this;
    const {time} = ctx.request.query;
    let data = Mock.mock({
      'newClient|25-30':1,
      'totalClient|200-300':1,
      'visitClient|30-20':1
    });
    if(!time){
      ctx.sendRes(this.ctx, {
          code: 0,
          status: 400,
          msg: '参数格式不正确'
      })
      return ;
    }
    ctx.sendRes(this.ctx, {
      code: 1,
      status: 200,
      data: {
          ...data,
          date:new Date(time).toLocaleDateString()
      }
    })
  }
  getDays(nowDate,nowMonth){
    let days = [];
    for(let i=1;i<=nowDate;i++){
        days.push({
            time:`${nowMonth}-${i}`,
            num:Math.ceil(Math.random() * 10)
        })
    }
    return days;
  }
  async activeData(){
    let {ctx} = this;
    let {month} = ctx.request.query;
    if(month <= 0 || (!month)){
        ctx.sendRes(this.ctx, {
            code: 0,
            status: 400,
            msg: '参数格式不正确'
        })
        return ;
    }
    let now = new Date();
    let year = now.getFullYear();
    let nowMonth = now.getMonth();
    let nowDate = now.getDate();
    let targetMonth = nowMonth - (month-1);
    let getYear = new Date(year,targetMonth).getFullYear();
    let sumDays = targetMonth === nowMonth ? nowDate : new Date(getYear,targetMonth+1,0).getDate();
    ctx.sendRes(this.ctx, {
        code: 1,
        status: 200,
        data: {
            data:this.getDays(sumDays,new Date(getYear,targetMonth).getMonth()+1)
        }
    })
  }
}

module.exports = HomeController;
