module.exports = (thisFun)=>(req, res, next)=>{
    Promise.resolve(thisFun(req, res, next)).then().catch(next)
}