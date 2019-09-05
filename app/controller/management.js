const Controller = require('egg').Controller;
const xlsx = require("node-xlsx");
const path = require('path');
const md5 = require('md5');
const fs = require('fs');
// const tmp = require('tmp')
// //故名思意 异步二进制 写入流
const awaitWriteStream = require('await-stream-ready').write;
//管道读入一个虫洞。
const sendToWormhole = require('stream-wormhole');
const formatData = function(data){
    let sheet1Data = data[0].data;
    let dataResult = [];
    sheet1Data.map((item,index)=>{
        if(index > 0){
            dataResult.push(item.reduce((prev,value,i)=>{
                let key = sheet1Data[0][i];
                let keyWord = key.match(/\((\w+)\)/)[1];
                prev[keyWord] = value;
                return prev;
            },{}))
        }
    })
    return dataResult;
}

const readFile = (filepath)=>new Promise((resolve)=>{
    const rs = fs.ReadStream(filepath);
    let buf = Buffer.from('');
    rs.on('data',(chunk)=>{
        buf = Buffer.concat([buf,chunk])
    })
    rs.on('end', () => {
        resolve(buf);
    })
})

class Management extends Controller{
    /**
     * 文件上传
     */
    async importXlsx(){
        const {ctx} = this;
        // console.log(this.ctx.get('Content-Type'));
        if (this.ctx.get('Content-Type').startsWith('multipart/')) {
            const stream = await ctx.getFileStream();
            const filename = md5(stream.filename) + '_' + Date.now() + path
                .extname(stream.filename)
                .toLocaleLowerCase();
            const target = path.join(this.config.baseDir, 'app/public/uploads', filename);
            
            const writeStream = fs.createWriteStream(target);
            try {
                //异步把文件流 写入
                await awaitWriteStream(stream.pipe(writeStream));
            } catch (err) {
                //如果出现错误，关闭管道
                await sendToWormhole(stream);
                throw err;
            }
            const filepath = path.join(__dirname,'../public/uploads',filename);
            // console.log(filepath)
            let xlsxData = formatData(xlsx.parse(filepath));
            let res = await this.service.management.importXlsx(xlsxData);
            if(res.insertId){
                ctx.sendRes(this.ctx, {
                    code: 1,
                    status: 200,
                    data: xlsxData
                })
            }else{
                ctx.sendRes(this.ctx, {
                    code: 0,
                    status: 400,
                    msg: '插入数据失败'
                })
            }
            
        }else{
            ctx.sendRes(this.ctx, {
                code: 0,
                status: 400,
                msg: '参数格式不正确'
            })
        }
        
    }
    /**
     * 文件导出
     */
    async exportXlsx(){
        const {ctx} = this;
        const {original} = ctx.params;
        const {filename} = ctx.request.body;
        if(!filename){
            ctx.sendRes(this.ctx, {
                code: 0,
                status: 400,
                msg: '参数格式不正确'
            })
            return ;
        }
        if(original === 'original'){  //导出原始模板
            const filepath = path.join(__dirname,'../public/original/',filename+'.xlsx');
            ctx.attachment(filename+'.xlsx');
            ctx.set('Content-Type', 'application/octet-stream');
            const rs = await readFile(filepath);
            ctx.body = rs;
        }else{ //data 导出部分数据

        }
    }
}



module.exports = Management;