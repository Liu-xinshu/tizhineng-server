'use strict';

const Service = require('egg').Service;

class ManagementService extends Service {
  async importXlsx(data) {  //[{},{}]
    const sql = `
        INSERT INTO staff_list (${Object.keys(data[0]).join(',')}) VALUES ${data.map(item=>{
            return `(${Object.keys(item).map(key=>`"${item[key]}"`).join(',')})`
          }).join(',')}`;
    let res = await this.app.mysql.query(sql)
    return res;
  }
  async findData(arr){
    const res = await this.app.mysql.query(`select * from staff_list WHERE ${
      arr.map(id=>`id="${id}"`).join(' or ')
    }`);
    return res;
  }
  async alldata(limit,pageid){
    const res = await this.app.mysql.select('staff_list',{
      limit,
      offset: pageid*limit
    })
    return res;
    
  }
}

module.exports = ManagementService;
