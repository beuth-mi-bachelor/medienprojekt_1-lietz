/*! videochop by VideoChop-Team 2015-02-11 */
requirejs.config({basePath:"/"});for(var modulesToLoadInDefine=["jquery","jqueryui","modernizr","useragent","utilities","filereader","videoItemLoader","videoList","videoTimeline","videoExporter"],modulesLoaded=0,modulesToLoad=modulesToLoadInDefine.length-1,i=0;i<modulesToLoadInDefine.length;i++){var currentModule=modulesToLoadInDefine[i],shims=requirejs.s.contexts._.config.shim;if(shims.hasOwnProperty(currentModule)&&shims[currentModule].deps)for(var deps=shims[currentModule].deps,j=0;j<deps.length;j++)modulesToLoadInDefine.indexOf(deps[j])<0&&modulesToLoad++}var percentage=0,percentageContainer=document.getElementById("percentage"),percentageText=document.getElementById("percentage-text"),currentModuleText=document.getElementById("currently-loading");require.onResourceLoad=function(a,b){"use strict";modulesLoaded+=1,percentage=parseInt(modulesLoaded/modulesToLoad*100,10),displayLoadProgress(percentage),currentModuleText.textContent=b.name};var displayLoadProgress=function(a){"use strict";percentageText.textContent=a,percentageContainer.style.height=a+"%"};define(modulesToLoadInDefine,function(a,b,c,d,e,f,g,h,i,j){"use strict";a(document).ready(function(){function b(){l=a(".preloader"),m=a(".application-wrapper"),n=a(".impress-wrapper"),o=a(".nav-item"),p=a(".close-impress"),q=a(".close-help"),r=a("body"),w=m.find(".file-list"),x=m.find(".file-add"),y=w.find(".video-loading")}function c(){a(".time-slider").disableSelection(),o.on("click",function(){a(this).hasClass("impress")&&r.toggleClass("impress-open"),a(this).hasClass("help")&&r.toggleClass("help-open")}),p.on("click",function(){r.toggleClass("impress-open")}),q.on("click",function(){r.toggleClass("help-open")}),a(".file-add-button").on("click",function(){a(".file-add").trigger("click")})}function e(){s=new h({container:".file-list"});var b=0;t=new g({tempWrapper:".temporary-video",callback:function(a){s.addItem(a),b--,0===b&&y.fadeOut(200)}}),a(document).on("drop dragover",function(a){a.preventDefault()});var c={readAsDefault:"ArrayBuffer",accept:"video/*",on:{loadstart:function(){y.show()},groupstart:function(a){b=a.files.length},loadend:function(a,b){t.add({data:new Uint8Array(a.target.result),extension:b.extra.extension,name:b.extra.nameNoExtension,prettySize:b.extra.prettySize,size:b.size,type:b.type})},skip:function(){b--}}};f.setupDrop(w[0],c),f.setupInput(x[0],c),v=new i({minWidth:200,scaleFactor:5,container:".timeline",videoList:s}),u=new j({exportBindings:{bar:"#progressbar",value:".progress-value",text:".export-text",status:".export-status",progress:".export-progress",link:".export-link",button:".export",overlay:".export-overlay"},timeLineInstance:v})}function k(){modulesLoaded===modulesToLoad&&(l.fadeOut(500),m.addClass("loading-complete"))}{var l,m,n,o,p,q,r,s,t,u,v,w,x,y;new d}a(".nav").disableSelection(),a(".preview").disableSelection(),b(),k(),c(),e()})});