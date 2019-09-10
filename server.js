console.log('http://localhost:7080')
console.log('http://localhost:7082')
//////////////////////////////////////////////////////////////////
//モジュールの設定
const http = require("http")
const fs = require("fs")

fs.appendFileSync('./nedb.db','','utf8')

const nedb = require("nedb")
let db = new nedb({ 
  filename: './nedb.db',
  autoload: true
})

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
  console.log(process.platform)
  controllerFileList = fs.readdirSync('./controller/')
  filename = filename.replace(/\.js/gi,"")
  if(process.platform==='win32'){
    delete require.cache[`${__dirname}\\controller\\${filename}.js`]
  }else{
    delete require.cache[`${__dirname}/controller/${filename}.js`]
  }
  controllerList[filename] = require(`./controller/${filename}.js`)
})
//////////////////////////////////////////////////////////////////
//汎用関数
const log = (URL,statusCode,headers)=>{
  console.log(`${statusCode} -- ${URL}`)
  fs.appendFileSync("./log/log.txt",`${new Date},${statusCode},${URL},${JSON.stringify(headers)}\n`)
}
const special = (URL)=>{
  for(let i of specialFileList){
    if(URL.match(i)) return ({data:specialList[i],URL:i})
  }
  return
}
//////////////////////////////////////////////////////////////////
//メイン関数
//response.end()の際は
//log(URL,statusCode,request.headers)
//を呼ぶこと
const server =  http.createServer(async(request, response) => {
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
  let spesialExist = special(URL)
  if(spesialExist){
    data = spesialExist.data
    URL = spesialExist.URL
  }
  //controller
  //let controllerData
  if(!data){
    for(let i of controllerFileList){
      i = i.replace(/\.js/,"")
      if((!URL.match(/js|css|png|jpg/))&&URL.match(i)){
//        controllerData = controllerList[i]({"URL":URL})
        data = await controllerList[i]({"URL":URL,'db':db})
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
      }else if(URL.match(/^\/blog\/.+/gi)){
        data = fs.readFileSync(`./blog/${URL.replace(/^\/blog\//,'')}`)
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

///////////////////////////////////////////////////////////////
/*
const findSort = () => new Promise(resolve =>{
  db.find({}).sort({id:-1}).exec((err, docs)=>{
    resolve(docs)
  })
})
const managerServer =  http.createServer(async(request, response) => {
  let URL = request.url.toLowerCase()
  console.log(URL)
  let data
  if(request.method === 'GET') {
  }else if(request.method === 'POST') {
    if(URL==='/manager/add'){
      let d = ''
      request.on('data', function(chunk) {
      d += chunk
      }).on('end',async function() {
        d = d.replace(/\+/gi,' ')
        response.end()
        let maxid = await findSort()
        maxid = maxid[0].id
        maxid++
        d = d.split('&')
        let time = new Date
        time = time.toLocaleString()
        let doc = {
          "id":maxid,
          "time":time,
        }
        for(i of d){
          let key = decodeURIComponent(i.match(/^.+\=/gi)[0].replace(/\=$/,''))
          let text = decodeURIComponent(i.match(/\=.+$/gi)[0].replace(/^\=/,''))
          doc[key] = text
        }
        db.insert(doc)
      })
    }else if(URL==='/manager/upload'){
      let d
      let dn = ''
      request.on('data', function(chunk) {
        d = chunk
        dn += chunk
      }).on('end',async function() {
        dn = dn.replace(/^file\=/,'')
        console.log(d)
        console.log(dn)
        fs.writeFileSync(`./views/blog/${dn}`,d)
      })
    }
    
  }
  let resData
  try{
    if(URL.match(/\.html$/gi)){
      resData = fs.readFileSync(`./manager/${URL}`,"utf8")
    }else{
      resData = fs.readFileSync(`./manager/${URL}`)
    }
  }catch(e){
    response.writeHead(404, {"Content-Type": "text/html"})
    response.end('404')
    return
  }
  response.writeHead(200, {"Content-Type": "text/html"})
  response.end(resData)
})

managerServer.listen(7081)
*/
///////////////////////////////////////////////////////////////
const managerServer =  http.createServer(async(request, response) => {
  const find = search => new Promise(resolve =>{
    db.loadDatabase()
    db.find(search).sort({id:-1}).exec((err, docs)=>{
      //console.log(docs)
      resolve(docs)
    })
  })
  let URL = request.url.toLowerCase()
  console.log(`m - ${URL}`)
  let spesialExist = special(URL)
  if(spesialExist){
    URL = spesialExist.URL
    response.writeHead(200)
    response.end(spesialExist.data)
    return
  }else if(request.method === 'POST' && URL.match(/^\/blog$/gi)) {
    let postData = ''
    request.on('data', (chunk) => {
      postData += chunk
    })
    request.on('end',async function() {
      postData = postData.replace(/\+/gi,' ')
      postData = postData.split('&')
      const postDataJson = {}
      const match = ['id','title','html','tag']
      for(let i of postData){
        i = decodeURIComponent(i)
        for(let j of match){
          if(i.match(j)){
            postDataJson[j] = i.replace(j,'').replace(/\=/,'')
          }
        }
      }
      //バリテーション
      for(let i in postDataJson){
        if(i==='tag')continue
        if(postDataJson[i]===''){
          response.writeHead(400)
          response.end(`error\n${i} empty`)
          return
        }
      }
      postDataJson.id = Number(postDataJson.id)
      postDataJson.time = (new Date).toLocaleString()
      //console.log(postDataJson)
      db.update({id:postDataJson.id},postDataJson,{ upsert: true },(err, numReplaced, upsert)=>{
        response.writeHead(200)
        response.end(`${!!upsert?'newDataInsert':'update'}\nsucsess`)
        return
      })
    })
  }else if(request.method === 'POST' && URL.match(/^\/upload$/gi)) {
    const multiparty = require('multiparty')
    var form = new multiparty.Form({uploadDir:`./temp/`});
    form.parse(request, function(err, fields, files) {
      console.log(JSON.stringify(files))
      const originalFilename = files.pic[0].originalFilename
      const tempFIlePath = files.pic[0].path
      if(originalFilename===''){
        response.writeHead(400, {"Content-Type": "text/html"})
        response.end(`<meta charset="UTF-8">データをおくりなさーーい`)
        fs.unlinkSync(`${__dirname}/${tempFIlePath}`)
        return
      }else if(false){
      }else{
        try{
          fs.statSync(`${__dirname}/blog/${originalFilename}`)
        }catch(e){
          //既存なし
          fs.renameSync(`${__dirname}/${tempFIlePath}`,`${__dirname}/blog/${originalFilename}`)
          response.writeHead(200)
          response.end('<meta charset="UTF-8">データは保存されました(既存なし)')
          return
        }
        if(fields.overwrite){
          //既存ありフラグあり(強制上書き)
          fs.renameSync(`${__dirname}/${tempFIlePath}`,`${__dirname}/blog/${originalFilename}`)
          response.writeHead(200)
          response.end('<meta charset="UTF-8">データは保存されました(既存ありフラグあり強制上書き)')
          return
        }else{
          //既存ありフラグなし
          fs.unlinkSync(`${__dirname}/${tempFIlePath}`)
          response.writeHead(202)
          response.end('<meta charset="UTF-8">ファイルがあります<br>上書きフラグをオンにしてください')
          return
        }
      }
    })
  }else if(URL.match(/^\/$|^\/index.html$/gi)){
    response.writeHead(200)
    response.end(fs.readFileSync('./manager/index.html'))
    return
  }else if(URL.match(/^\/favicon.ico$/gi)){
    //なんとかしろ
    response.writeHead(404)
    response.end()
    return
  }else if(URL.match(/^\/edit\.js$|^\/edit\.css$|^\/edit\.html$|^\/upload.html$/gi)){
    response.writeHead(200)
    response.end(fs.readFileSync(`./manager${URL}`,'utf8'))
    return
  }else if(URL.match(/^\/edit\/\d$/gi)){
    let findData = await find({id:Number(URL.match(/^\/edit\/\d$/gi)[0].replace(/^\/edit\//,''))})
    if(findData.length===0){
      response.writeHead(404)
      response.end(`404 notfound`)
      return
    }else{
      response.writeHead(200)
      response.end(JSON.stringify(findData[0]))
    }
    return
  }else/* if(URL.match(/\.png$|\.jpg$/gi))*/{
    try{
      const file = fs.readFileSync(`./blog/${URL}`)
      response.writeHead(200)
      response.end(file)
      return
    }catch(e){
      response.writeHead(404)
      response.end('404 notfound')
      return
    }
  }/*else{
    response.writeHead(404)
    response.end('404 notfound')
    return
  }*/
})

managerServer.listen(7082)
