'use strict';

const Service = require('egg').Service;

class ManagementService extends Service {
  async importXlsx(data) {  //[{},{}]
    const sql = `
        INSERT INTO staff_list (${Object.keys(data[0]).join(',')}) VALUES ${data.map(item=>{
            return `(${Object.keys(item).map(key=>`"${item[key]}"`).join(',')})`
          }).join(',')}`;
    console.log(sql);
    let res = await this.app.mysql.query(sql)
    return res;
  }
  async findData(arr){
    const res = await this.app.mysql.query(`select * from staff_list WHERE ${
      arr.map(id=>`id=${id*1}`).join(' or ')
    }`);
    return res;
  }
}

module.exports = ManagementService;
