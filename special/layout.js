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
$("#headerPortfolio").hover(function(d){
  $(d.currentTarget).append("<span>comming soon...</span>")
},function(d){
  $(d.currentTarget)[0].childNodes[1].remove()
})
$("#headerContent").hover(function(d){
  $(d.currentTarget).append("<span>comming soon...</span>")
},function(d){
  $(d.currentTarget)[0].childNodes[1].remove()
})
$("#headerAya")
$("#headerAboutme")

$("#headerTop").click(function(){
  window.location.href = "/top/index.html"
})
$("#headerPortfolio").click(function(){

})
$("#headerContent").click(function(){

})
$("#headerAya").click(function(){

})
$("#headerAboutme").click(function(){
})
/*
$("#headerTop")
$("#headerPortfolio")
$("#headerContent")
$("#headerAya")
$("#headerAboutme")
*/