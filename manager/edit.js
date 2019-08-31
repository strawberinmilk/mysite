const write = ()=>{
  document.getElementById('seeArea').innerHTML = document.getElementById('html').value
}

write()
document.getElementById('editArea').addEventListener('keyup',()=>{
  write()
})

setTimeout(() => {
  document.getElementById('header').parentNode.removeChild(document.getElementById('header'))
}, 1000)

document.getElementById('getButton').onclick = (()=>{
  let xhr = new XMLHttpRequest()
  xhr.onreadystatechange = ()=>{
    if(xhr.readyState === 4){
      if(xhr.status === 200){
        document.getElementById('status').innerText = '通信完了'
        let json = JSON.parse(xhr.responseText)
        document.getElementById('title').value = json.title
        document.getElementById('html').value  = json.html
        document.getElementById('tag').value   = json.tag
      }else if(xhr.status === 404){
        document.getElementById('status').innerText = '404 notfound'
      }
    }else{
      document.getElementById('status').innerText = '通信中'
    }
  }
  xhr.open('GET',`edit/${document.getElementById('id').value}`,true)
  xhr.send(null)
})
