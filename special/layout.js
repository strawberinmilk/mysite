const delayTime = 0//2
setTimeout(()=>{
  $("#mask").css("display","none")
},2000)

$("#headerOpenButton").click(function(){
  $("#header").stop().toggle(1000)
})

if($("body").width()<850){
//  console.log("mobile")
  $(".headerButton").css({"width":"100%"})
  $("#header").toggle()
}else{
//  console.log("pc")
  $("#headerOpenButton").css({"display":"none"})
  $("#main").css({"width":"75%","position":"relative","left":"12.5%"})
  $("#header").css({"height":"75px","width":"100%"})
  $(".headerButton").css({"width":"20%","float":"left"})
}
$(".headerButton").hover(function(d){
},function(d){
})
$("#headerTop")
/*
$("#headerContent").hover(function(d){
  $(d.currentTarget).append("<span>comming soon...</span>")
},function(d){
  $(d.currentTarget)[0].childNodes[1].remove()
})
*/
$("#headerAya")
$("#headerAbout")

$("#headerTop").click(function(){
  window.location.href = "/top/index.html"
})
$("#headerPortfolio").click(function(){
  window.location.href = "/portfolio/index.html"
})
$("#headerContent").click(function(){
  window.location.href = "/blog/search/"
})
$("#headerAya").click(function(){
  window.location.href = "/lightpage/komichiayabot.html"
})
$("#headerAbout").click(function(){
  window.location.href = "/lightpage/about.html"
})
/*
$("#headerTop")
$("#headerPortfolio")
$("#headerContent")
$("#headerAya")
$("#headerAbout")
*/