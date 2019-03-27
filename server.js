const http = require("http")
const fs = require("fs")

let specialFileList = fs.readdirSync('./special/')
fs.watch('./special/',(event,filename)=>{
  specialFileList = fs.readdirSync('./special/')
})

const log = (URL,statusCode,headers)=>{
  console.log(`${statusCode} -- ${URL}`)
  fs.appendFileSync("./log/log.txt",`${new Date},${statusCode},${URL},${JSON.stringify(headers)}\n`)
}

let server = http.createServer((request, response) => {
  let URL = request.url.toLowerCase()
  request.headers.time = new Date
  let data

  for(let i of specialFileList){
    if(URL.match(i)){
      data = fs.readFileSync(`./special/${i}`,"utf8")
      URL = i
      break
    }
  }

  if(!data){
    try{
      data = fs.readFileSync(`./views/${URL}`)
    }catch(e){
      response.writeHead(404, {"Content-Type": "text/html"})
      response.end(fs.readFileSync("./views/error/404.html"))
      log(URL,404,request.headers)
      return
    }
  }

  //ステータスコード
  if(URL.match(/.+\.html$/)){
    response.writeHead(200,{"Content-Type":"text/html"})
  }else if(URL.match(/.+\.js$/)){
    response.writeHead(200,{"Content-Type":"text/javascript"})
  }else if(URL.match(/.+\.png$/)){
    response.writeHead(200,{"Content-Type":"image/png"})
  }else{
  }

  response.write(data)
  response.end()
  log(URL,200,request.headers)
})

server.listen(7080)
