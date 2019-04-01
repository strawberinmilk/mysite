//////////////////////////////////////////////////////////////////
//モジュールの設定
const http = require("http")
const fs = require("fs")
//////////////////////////////////////////////////////////////////
//specialFileの取得と更新時のリロード
let specialFileList = fs.readdirSync('./special/')
let specialList = {}
for(let i of specialFileList){
  specialList[i] = fs.readFileSync(`./special/${i}`,"utf8")
}
fs.watch('./special/',(event,filename)=>{
  console.log("special file reload")
  specialFileList = fs.readdirSync('./special/')
  specialList[filename] = fs.readFileSync(`./special/${filename}`,"utf8")
})
//controllerの取得と更新時のリロード
let controllerFileList = fs.readdirSync('./controller/')
let controllerList = {}
for(let i of controllerFileList){
  i = i.replace(/\.js/gi,"")
  controllerList[i] = require(`./controller/${i}.js`)
}
fs.watch('./controller/',(event,filename)=>{
  console.log("controller file reload")
  controllerFileList = fs.readdirSync('./controller/')
  filename = filename.replace(/\.js/gi,"")
  delete require.cache[`${__dirname}/controller/${filename}.js`]//これwindowsで動く？
  controllerList[filename] = require(`./controller/${filename}.js`)
})
//////////////////////////////////////////////////////////////////
//汎用関数
const log = (URL,statusCode,headers)=>{
  console.log(`${statusCode} -- ${URL}`)
  fs.appendFileSync("./log/log.txt",`${new Date},${statusCode},${URL},${JSON.stringify(headers)}\n`)
}
//////////////////////////////////////////////////////////////////
//メイン関数
//response.end()の際は
//log(URL,statusCode,request.headers)
//を呼ぶこと
const server = http.createServer((request, response) => {
  let URL = request.url.toLowerCase()
  let data
  //リダイレクト
  if(URL === "/"){
    response.writeHead(302, {
      "Location": "/top/index.html"
    })
    response.end()
    log(URL,302,request.headers)
    return
  }
  //special
  for(let i of specialFileList){
    if(URL.match(i)){
      data = specialList[i]
      URL = i
      break
    }
  }
　 //controller
//  let controllerData
  if(!data){
    for(let i of controllerFileList){
      i = i.replace(/\.js/,"")
      if((!URL.match(/js|css|png|jpg/))&&URL.match(i)){
//        controllerData = controllerList[i]({"URL":URL})
        console.log("awaitするよん")
        data = controllerList[i]({"URL":URL})
        console.log("awaitしたよん")
        console.log(data + "----------------------------------------")
        break
      }
    }
  }
  //tryでviewからデータが取れるか試す、
  //あればそれが返され、なければ404
  if(!data){
    try{
      if(URL.match(/\.html$/gi)){
        data = fs.readFileSync(`./views/${URL}`,"utf8")
      }else{
        data = fs.readFileSync(`./views/${URL}`)
      }
    }catch(e){
      response.writeHead(404, {"Content-Type": "text/html"})
      response.end(fs.readFileSync("./views/error/404.html"))
      log(URL,404,request.headers)
      return
    }
  }
//  if(URL.match(/\.html$/gi) && controllerData){
//    data = data.replace(/<!--controller-->/,controllerData)
//  }

  //ステータスコード
  if(URL.match(/.+\.js$/)){
    response.writeHead(200,{"Content-Type":"text/javascript"})
  }else if(URL.match(/.+\.css$/)){
    response.writeHead(200,{"Content-Type":"text/css"})
  }else if(URL.match(/.+\.png$/)){
    response.writeHead(200,{"Content-Type":"image/png"})
  }else if(URL.match(/.+\.jpg$/)){
    response.writeHead(200,{"Content-Type":"image/jpg"})
  }else if(URL.match(/.+\.mp3$/)){
    response.writeHead(200,{"Content-Type":"audio/mpeg"})
  }else{
  //if(URL.match(/.+\.html$/)){
    response.writeHead(200,{"Content-Type":"text/html"})
  }
  
  response.write(data)
  response.end()
  log(URL,200,request.headers)
})

server.listen(7080)
