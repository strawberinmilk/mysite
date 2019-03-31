const http = require("http")
const fs = require("fs")

let specialFileList = fs.readdirSync('./special/')
let specialList = {}
for(let i of specialFileList){
  specialList[i] = fs.readFileSync(`./special/${i}`,"utf8")
}
fs.watch('./special/',(event,filename)=>{
  specialFileList = fs.readdirSync('./special/')
  specialList[filename] = fs.readFileSync(`./special/${filename}`,"utf8")
})

let controllerFileList = fs.readdirSync('./controller/')
let controllerList = {}
for(let i of controllerFileList){
  i = i.replace(/\.js/gi,"")
  controllerList[i] = require(`./controller/${i}.js`)
}
fs.watch('./controller/',(event,filename)=>{
  controllerFileList = fs.readdirSync('./controller/')
  filename = filename.replace(/\.js/gi,"")
  delete require.cache[`${__dirname}/controller/${filename}.js`];
  controllerList[filename] = require(`./controller/${filename}.js`)
})
setInterval(()=>{
  controllerList.portfolio()
},1000)

const log = (URL,statusCode,headers)=>{
  console.log(`${statusCode} -- ${URL}`)
  fs.appendFileSync("./log/log.txt",`${new Date},${statusCode},${URL},${JSON.stringify(headers)}\n`)
}

let server = http.createServer((request, response) => {
  let URL = request.url.toLowerCase()
  if(URL === "/"){
    response.writeHead(302, {
      "Location": "/top/index.html"
    });
    response.end();
    log(URL,302,request.headers)
    return
  }
  //request.headers.time = new Date
  let data

  for(let i of specialFileList){
    if(URL.match(i)){
      data = specialList[i]
      URL = i
      break
    }
  }
  /*
  let aa = require(`./controller/portfolio.js`)
  aa()
  
  let controllerList = []
  for(let i of controllerFileList){
    if(URL===`/${i}`){
      //data = fs.readFileSync(`./special/${i}`,"utf8")
      break
    }
  }
*/

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
