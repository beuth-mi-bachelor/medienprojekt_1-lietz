/*! videochop by VideoChop-Team 2014-11-06 */
requirejs.config({paths:{jquery:"lib/jquery-2.1.1.min",modernizr:"lib/modernizr",ffmpeg:"lib/ffmpeg",useragent:"lib/ua-parser.min"},waitSeconds:0});var modulesToLoadInDefine=["jquery","modernizr","useragent"],modulesToLoadAfterDefine=["ffmpeg"],modulesLoaded=0,modulesToLoad=modulesToLoadInDefine.length+modulesToLoadAfterDefine.length+1,percentage=0,percentageForEachModule=100/modulesToLoad,percentageContainer=document.getElementById("percentage"),percentageText=document.getElementById("percentage-text"),currentModuleText=document.getElementById("currently-loading");require.onResourceLoad=function(a,b){"use strict";modulesLoaded+=1,percentage=parseInt(modulesLoaded/modulesToLoad*100,10),displayLoadProgress(percentage),currentModuleText.textContent=b.name};var displayLoadProgress=function(a){"use strict";percentageText.textContent=a,percentageContainer.style.height=a+"%"};define(modulesToLoadInDefine,function(a,b,c){"use strict";a(document).ready(function(){function b(a){var b=document.getElementsByTagName("head")[0],c=document.createElement("script");c.type="text/javascript",c.src=a,b.appendChild(c),modulesLoaded+=1,f()}function d(){h=a(".preloader"),i=a(".application-wrapper")}function e(){for(var a=requirejs.s.contexts._.config,c=0;c<modulesToLoadAfterDefine.length;c++){var d=a.baseUrl+a.paths[modulesToLoadAfterDefine[c]]+".js";currentModuleText.textContent=modulesToLoadAfterDefine[c],"Firefox"!==j.getBrowser().name?g(d):b(d)}}function f(){modulesLoaded===modulesToLoad&&(h.fadeOut(500),i.addClass("loading-complete"))}function g(b){a.ajax({url:b,dataType:"script",cache:!0,success:function(){modulesLoaded+=1,percentage=parseInt(modulesLoaded/modulesToLoad*100,10),displayLoadProgress(percentage),f()},error:function(a){},xhr:function(){var a=new XMLHttpRequest;return a.addEventListener("progress",function(a){if(a.lengthComputable){var b=a.loaded/a.total,c=percentageForEachModule*b,d=parseInt(percentage+c,10);displayLoadProgress(d)}},!1),a}})}var h,i,j=new c;d(),e()})});