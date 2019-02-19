const http = require('http');
const fs = require('fs')

let server = http.createServer(function(request, response) {
  const URL = request.url
  console.log(URL)
  let data
  if(URL.match(/jquery\.js/gi)){
    data = fs.readFileSync("./jquery.js","utf8")
//}else if(){
  }else{
    try{
      data = fs.readFileSync(`./views/${URL}`,"utf8")
    }catch(e){
      response.writeHead(404, {'Content-Type': 'text/html'})
      response.end(fs.readFileSync("./views/error/404.html"))
      return
    }
  }
  if(URL.match(/.+\.html/)){
    response.writeHead(200, {'Content-Type': 'text/html'})
  }else if(URL.match(/.+\.js/)){
    response.writeHead(200, {'Content-Type': 'text/javascript'})
  }else{
  }
  response.write(data)
  response.end()
})

server.listen(7080);
