function errorHandle(res){
  const headers = {
    // "Content-Type": "text/plain"
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*', //跨網域
    'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE', //這幾個方法可以使用
    'Content-Type': 'application/json'
  }
  res.writeHead(400, headers);
  res.write(JSON.stringify({
    "status": "false",
    "message": "欄位未填寫正確，或無此 todo id",
  }));
  res.end();
}

module.exports = errorHandle;