/////////////////////////////////////////////////////
//モジュール読み込み
const nedb = require("nedb")
let db = new nedb({ 
    filename: './nedb.db',
    autoload: true
})
/////////////////////////////////////////////////////
//汎用関数
/////////////////////////////////////////////////////
const find = search => new Promise(resolve =>{
  db.loadDatabase()
  db.find(search).sort({id:-1}).exec((err, docs)=>{
    //console.log(docs)
    resolve(docs)
  })
})
/////////////////////////////////////////////////////
//メイン関数
/////////////////////////////////////////////////////
module.exports = async (request) =>{
  let returnData
  if(request.URL.match(/^\/blog\/\d+$/gi)){
    const pageNumber = request.URL.match(/\d+$/gi)[0] *1
    let data = await find({id:pageNumber})
    if(data.length===0){
      return
    }
    returnData = data[0]
    returnData.html += '<br></br>この記事につけられたタグ<br>'
    returnData.tag = returnData.tag.split(' ')
    for(j of returnData.tag){
      returnData.html += `<a href="/blog/search/${j}">${j}</a>`
    }
  }else if(request.URL.match(/^\/blog\/search/gi)){

    let search = request.URL.replace(/^\/blog\/search/gi,'')
    try{
      search = decodeURIComponent(search)
    }catch(e){}
    let data
    search = search.replace(/[!-@]|[\[-\`]|[\{-\~]/gi,"")
    data = await find({tag:new RegExp(search)})
    returnData = {}
    returnData.title = 'result'
    returnData.html = 
      `<link rel="stylesheet" type="text/css" href="search.css">
      <h3>${search} 検索結果</h3>
      <table id=table>
      <tr class="magenta">
        <th class="searchtitle">タイトル</th>
        <th class="searchtext">更新日時</th>
        <th class="searchtag">タグ</th>
      </tr>`
      for(let i=0;i<data.length;i++){
        let c = data[i]
        let color = 'magenta'
        if(i%2===0) color = 'blue'
        returnData.html += 
      `<tr class="${color}">
        <td class="searchtitle"><a href="/blog/${c.id}">${c.title}</a></td>
        <td class="searchtext">${c.time}</td>
        <td class="searchtag">`
        c.tag = c.tag.split(' ')
        for(j of c.tag){
          returnData.html +=
          `<a href="/blog/search/${j}">${j}</a>&nbsp;&nbsp;`
        }
        `</td>
      </tr>`
    }
    returnData.html += 
      `</table>`
  }else{
    return
  }
  
  let returnHTML = `
  <!DOCTYPE html>
    <html lang="ja">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>${returnData.title}</title>
  </head>
  <body>
  <div id="mask" style="background-color:white;position:fixed;height:100%;width:100%;top:0px;left:0px;z-index:9999;pointer-events:none;" ></div>
  <div id="main">
  ${returnData.html}
  </div>
    <script type="text/javascript" src="./jquery.js"></script>
    <script type="text/javascript" src="./layoutget.js"></script>
    <script type="text/javascript" src="./backmoveboxget.js"></script>
    `
    //<script type="text/javascript" src="./index.js"></script>`
  return returnHTML
}
