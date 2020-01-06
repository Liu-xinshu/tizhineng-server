module.exports = ()=>async (ctx,next)=>{
    let etag = ctx.get('if-none-match');
    if(etag){ //要协商缓存
        switch(etag){
            case '777':{
                ctx.response.set('cache-control','max-age=2000000');
            }
        }
        // console.log('ctx.response-------',ctx.response);
        await next();
        return;
    }

    await next();
}