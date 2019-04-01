
const nedb = require("nedb")
let db = new nedb({ 
    filename: './nedb.db',
    autoload: true
});

let ggg = function(err, docs){
  console.log("ggg")
  return new Promise((resolve, reject) => {
    console.log(docs)
    returnData += docs
    resolve()
  })
}
module.exports = async (request) =>{
  /*
  let returnData = `
  <!DOCTYPE html>
    <html lang="ja">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>portfolio</title>
  </head>
  <body>
  <div id="mask" style="background-color:white;position:fixed;height:100%;width:100%;top:0px;left:0px;z-index:9999;"></div>
  <div id="main">`

  returnData += "aa"
  if(request.URL === "/portfolioc"){
    let doc = {
      "id":1,
      "name":"tetris",
      "html":"tetrisHTML",
    }
    
//    db.insert(doc)

      console.log("find前")
      db.find({},(err, docs)=>{console.log(docs)})    
      console.log("find後")

  }else{

  }

  returnData += `</div>
    <script type="text/javascript" src="./jquery.js"></script>
    <script type="text/javascript" src="./layoutget.js"></script>
    <script type="text/javascript" src="./backmoveboxget.js"></script>
    `
    //<script type="text/javascript" src="./index.js"></script>`
  return returnData
*/
}
