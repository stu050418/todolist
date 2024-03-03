//小步測試
const http = require('http');
const errorHandle = require('./errorHandle');
const { v4: uuidv4 } = require('uuid');
const todos = [];
/* 測試用
  const todos = [
    {
      "title": "今天要刷牙",
      "id": uuidv4(),
    }
  ];
*/

const requestListener = (req, res)=>{
  const headers = {
    // "Content-Type": "text/plain"
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*', //跨網域
    'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE', //這幾個方法可以使用
    'Content-Type': 'application/json'
  }

  let body = ""; //接收資料的空間    知識：如何接收 POST API 的 body 資料？
  req.on('data', chunk=>{
    // console.log(chunk);
    body+=chunk;
  })
  // req.on('end',()=>{
  //   // console.log(JSON.parse(body));
  // })

  // console.log(req);
  console.log(req.url);
  console.log(req.method);
  if(req.url == "/todos" && req.method == "GET"){
    res.writeHead(200, headers);
    res.write(JSON.stringify({
      "status": "success",
      "data": todos,
    }));
    res.end();

  }else if(req.url == "/todos" && req.method == "POST"){ //method >> 不同請求類型
    req.on('end',()=>{
      try
      {
        const title = JSON.parse(body).title;
        // console.log(title);
        // console.log(typeof title);
        // title !== undefined  一定要有 title 的名稱(值)
        // title !== ""  title 一定要有值
        if(title !== undefined){
          const todo ={
            "title" : title,
            "id": uuidv4(),
          }
          // console.log(todo);
          todos.push(todo);///增加很多
          res.writeHead(200, headers);
          res.write(JSON.stringify({
            "status": "success",
            "data": todos,
          }));
          res.end();

        }else{
          errorHandle(res);
        }
      }
      catch(error)
      {
        // console.log("程式錯誤",error);
        //提醒式錯誤的
        errorHandle(res);
      }

    })
  }else if(req.url == "/todos" && req.method == "DELETE"){ //method >> 不同請求類型
    // 請注意url要包含 todos
    todos.length=0; //刪除所有代辦事項。
    res.writeHead(200, headers);
    res.write(JSON.stringify({
      "status": "success",
      "data": todos,
    }));
    res.end();

  }else if(req.url.startsWith("/todos/") && req.method == "DELETE"){ //method >> 不同請求類型
    // 檢查 uuid
    const id = req.url.split('/').pop();
    const index = todos.findIndex(item => item.id == id);
    if(index !== -1){
      todos.splice(index, 1);
      res.writeHead(200, headers);
      res.write(JSON.stringify({
        "status": "success",
        "data": todos,
      }));
      res.end();
    }else{
      errorHandle(res);
    }

  }else if(req.url.startsWith("/todos/") && req.method == "PATCH"){ //method >> 不同請求類型
    req.on('end',()=>{
      try
      {
        const todo = JSON.parse(body).title; //注意命名
        // 檢查 uuid
        const id = req.url.split('/').pop();
        const index = todos.findIndex(item => item.id == id);
        // title !== undefined  一定要有 title 的名稱(值)
        // title !== ""  title 一定要有值
        console.log("todo：",　todo);
        console.log("id：",　id);
        console.log("index：",　index);
        if(todo !== undefined && index !== -1){
          todos[index].title = todo;
    
          res.writeHead(200, headers);
          res.write(JSON.stringify({
            "status": "success",
            "data": todos,
          }));
          res.end();

        }else{
          errorHandle(res);
        }
      }
      catch(error)
      {
        //提醒式錯誤的
        errorHandle(res);
      }

    })


  }else if(req.method == "OPTIONS"){ //method >> 不同請求類型
      res.writeHead(200, headers);
      res.end();
  // }else if(req.url == "/" && req.method == "DELETE"){ //method >> 不同請求類型
  //   res.writeHead(200, headers);
  //   res.write("刪除成功!!");
  //   res.end();
  }else{
    res.writeHead(404, headers);
    // res.write("not found");
    res.write(JSON.stringify({
      "status": "false",
      "message": "沒有資料",
    }));
    res.end();
  }
}

// const requestListener = (req, res)=>{
//   res.writeHead(200,{ "Content-Type": "text/html" });
//   res.write("<h1>Hello!!</h1>");
//   res.end();
// }

const server = http.createServer(requestListener); //只要使用者一進來就可以處發函式
server.listen(3005);