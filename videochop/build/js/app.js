/*! videochop by VideoChop-Team 2015-02-13 */
requirejs.config({basePath:"/"});for(var modulesToLoadInDefine=["jquery","jqueryui","modernizr","useragent","utilities","filereader","filesaver","videoItemLoader","videoList","videoTimeline","videoExporter","videoPreview","eventHandler","videoItem","popcorn","popcorn-capture"],modulesLoaded=0,modulesToLoad=modulesToLoadInDefine.length+1,circle=new ProgressBar.Circle(".preloader-hold",{color:"#FF6400",strokeWidth:5}),i=0;i<modulesToLoadInDefine.length;i++){var currentModule=modulesToLoadInDefine[i],shims=requirejs.s.contexts._.config.shim;if(shims.hasOwnProperty(currentModule)&&shims[currentModule].deps)for(var deps=shims[currentModule].deps,j=0;j<deps.length;j++)modulesToLoadInDefine.indexOf(deps[j])<0&&modulesToLoad++}var percentage=0,percentageText=document.getElementById("percentage-text"),currentModuleText=document.getElementById("currently-loading");require.onResourceLoad=function(a,b){"use strict";modulesLoaded+=1,percentage=parseInt(modulesLoaded/modulesToLoad*100,10),displayLoadProgress(percentage),currentModuleText.textContent=b.name};var displayLoadProgress=function(a){"use strict";percentageText.textContent=a,circle.animate(a/100,{duration:100})};define(modulesToLoadInDefine,function(a,b,c,d,e,f,g,h,i,j,k,l){"use strict";a(document).ready(function(){function b(){g=a(".preloader"),m=a(".application-wrapper"),n=a(".overlay-wrapper"),o=a(".mobile-stop"),p=a(".impress-wrapper"),q=a(".nav-item"),r=a(".close-impress"),s=a(".close-help"),t=a("body"),z=m.find(".file-list"),A=m.find(".file-add"),B=z.find(".video-loading")}function c(){a(".time-slider").disableSelection(),n.on("click",function(){a(this).hide()}),q.on("click",function(){a(this).hasClass("impress")&&t.toggleClass("impress-open"),a(this).hasClass("help")&&t.toggleClass("help-open")}),r.on("click",function(){t.toggleClass("impress-open")}),s.on("click",function(){t.toggleClass("help-open")}),a(".file-add-button").on("click",function(){a(".file-add").trigger("click")})}function d(){u=new i({container:".file-list"});var b=0;v=new h({tempWrapper:".temporary-video",callback:function(a){u.addItem(a),b--,0===b&&B.fadeOut(200)}}),a(document).on("drop dragover",function(a){a.preventDefault()});var c={readAsDefault:"ArrayBuffer",accept:"video/*",on:{loadstart:function(){B.show()},groupstart:function(a){b=a.files.length},loadend:function(a,b){v.add({data:new Uint8Array(a.target.result),extension:b.extra.extension,name:b.extra.nameNoExtension,prettySize:b.extra.prettySize,size:b.size,type:b.type})},skip:function(){b--}}};f.setupDrop(z[0],c),f.setupInput(A[0],c),y=new j({minWidth:200,scaleFactor:10,container:".timeline",videoList:u}),x=new l({vidContainer:".video-wrapper"}),w=new k({exportBindings:{bar:"#progressbar",value:".progress-value",text:".export-text",status:".export-status",progress:".export-progress",link:".export-link",button:".export",overlay:".export-overlay"},timeLineInstance:y})}function e(){modulesLoaded===modulesToLoad&&(g.fadeOut(500),m.addClass("loading-complete"))}var g,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C=new UAParser;a(".nav").disableSelection(),a(".preview").disableSelection(),b(),e(),c(),d(),"mobile"===C.getDevice().type?o.show():o.hide()})});