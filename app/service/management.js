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
}

module.exports = ManagementService;
