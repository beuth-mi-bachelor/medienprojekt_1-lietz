/*! videochop by VideoChop-Team 2015-02-16 */
requirejs.config({basePath:"/"});for(var modulesToLoadInDefine=["jquery","jqueryui","modernizr","useragent","utilities","filereader","filesaver","videoItemLoader","videoList","videoTimeline","videoExporter","videoPreview","videoInformationRetriever","eventHandler","videoItem","popcorn","popcorn-capture"],modulesLoaded=0,modulesToLoad=modulesToLoadInDefine.length+1,circle=new ProgressBar.Circle(".preloader-hold",{color:"#FF6400",strokeWidth:5}),i=0;i<modulesToLoadInDefine.length;i++){var currentModule=modulesToLoadInDefine[i],shims=requirejs.s.contexts._.config.shim;if(shims.hasOwnProperty(currentModule)&&shims[currentModule].deps)for(var deps=shims[currentModule].deps,j=0;j<deps.length;j++)modulesToLoadInDefine.indexOf(deps[j])<0&&modulesToLoad++}var percentage=0,percentageText=document.getElementById("percentage-text"),currentModuleText=document.getElementById("currently-loading");require.onResourceLoad=function(a,b){"use strict";modulesLoaded+=1,percentage=parseInt(modulesLoaded/modulesToLoad*100,10),displayLoadProgress(percentage),currentModuleText.textContent=b.name};var displayLoadProgress=function(a){"use strict";percentageText.textContent=a,circle.animate(a/100,{duration:100})};define(modulesToLoadInDefine,function(a,b,c,d,e,f,g,h,i,j,k,l,m){"use strict";a(document).ready(function(){function b(){g=a(".preloader"),n=a(".application-wrapper"),o=a(".overlay-wrapper"),p=a(".mobile-stop"),q=a(".impress-wrapper"),r=a(".nav-item"),s=a(".close-impress"),t=a(".close-help"),u=a("body"),B=n.find(".file-list"),C=n.find(".file-add"),D=B.find(".video-loading")}function c(){a(".time-slider").disableSelection(),o.on("click",function(){a(this).hide()}),r.on("click",function(){a(this).hasClass("impress")&&u.toggleClass("impress-open"),a(this).hasClass("help")&&u.toggleClass("help-open")}),s.on("click",function(){u.toggleClass("impress-open")}),t.on("click",function(){u.toggleClass("help-open")}),a(".file-add-button").on("click",function(){a(".file-add").trigger("click")})}function d(){v=new i({container:".file-list"}),A=new m({defaultFPS:24,callback:function(){}});var b=0;w=new h({tempWrapper:".temporary-video",callback:function(a){v.addItem(a),A.addVideoItemToQueue(a),b--,0===b&&D.fadeOut(200)}}),a(document).on("drop dragover",function(a){a.preventDefault()});var c={readAsDefault:"ArrayBuffer",accept:"video/webm|video/mp4|video/ogg",on:{loadstart:function(){D.show()},groupstart:function(a){b=a.files.length},loadend:function(a,b){w.add({data:new Uint8Array(a.target.result),extension:b.extra.extension,name:b.extra.nameNoExtension,prettySize:b.extra.prettySize,size:b.size,type:b.type})},skip:function(){window.alert("Only webm, ogv and mp4 supported"),b--}}};f.setupDrop(B[0],c),f.setupInput(C[0],c),z=new j({minWidth:200,scaleFactor:10,container:".timeline",videoList:v}),y=new l({vidContainer:".video-wrapper"}),x=new k({exportBindings:{bar:"#progressbar",value:".progress-value",text:".export-text",status:".export-status",progress:".export-progress",link:".export-link",button:".export",overlay:".export-overlay"},timeLineInstance:z})}function e(){modulesLoaded===modulesToLoad&&(g.fadeOut(500),n.addClass("loading-complete"))}var g,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E=new UAParser;a(".nav").disableSelection(),a(".preview").disableSelection(),b(),e(),c(),d(),"mobile"===E.getDevice().type&&(u.parent().addClass("mobile-fallback"),p.show(),n.hide()),a(document).disableSelection()})});