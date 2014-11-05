requirejs.config({
    paths: {
        "jquery": "lib/jquery-2.1.1.min",
        "modernizr": "lib/modernizr",
        "ffmpeg": "lib/ffmpeg"
    },
    waitSeconds: 0
});

var modulesToLoadInDefine = ["jquery", "modernizr"];
var modulesToLoadAfterDefine = ["ffmpeg"];

var modulesLoaded = 0;
var modulesToLoad = modulesToLoadInDefine.length + modulesToLoadAfterDefine.length + 1;

var percentage = 0;
var percentageForEachModule = 100 / modulesToLoad;

var percentageContainer = document.getElementById("percentage");
var percentageText = document.getElementById("percentage-text");
var currentModuleText = document.getElementById("currently-loading");

require.onResourceLoad = function(context, map) {
    "use strict";

    modulesLoaded += 1;

    percentage = parseInt(modulesLoaded / modulesToLoad * 100, 10);

    percentageText.innerText = percentage;
    percentageContainer.style.height = percentage + "%";

    currentModuleText.innerText = map.name;
};

define(modulesToLoadInDefine, function ($) {
    "use strict";

    $(document).ready(function() {

        var $preloader,
            $appWrapper;

        initializeVariables();
        getCustomScripts();












        function initializeVariables() {
            $preloader = $(".preloader");
            $appWrapper = $(".application-wrapper");
        }

        function getCustomScripts() {
            var requireJsConfig = requirejs.s.contexts._.config;
            for (var i = 0; i < modulesToLoadAfterDefine.length; i++) {
                var url = requireJsConfig.baseUrl + requireJsConfig.paths[modulesToLoadAfterDefine[i]] + ".js";
                currentModuleText.innerText = modulesToLoadAfterDefine[i];
                requestScript(url);
            }
        }

        function requestScript(url) {
            $.ajax({
                url: url,
                dataType: "script",
                cache: true,
                success: function() {
                    modulesLoaded += 1;

                    percentage = parseInt(modulesLoaded / modulesToLoad * 100, 10);
                    percentageText.innerText = percentage;
                    percentageContainer.style.height = percentage + "%";

                    if (modulesLoaded === modulesToLoad) {
                        $preloader.fadeOut(500);
                        $appWrapper.addClass("loading-complete");
                    }
                }, xhr: function () {
                    var xhr = new window.XMLHttpRequest();

                    xhr.addEventListener("progress", function (evt) {
                        if (evt.lengthComputable) {
                            var percentComplete = evt.loaded / evt.total;
                            var percentageDependend = percentageForEachModule * percentComplete;
                            var tempPercentage = parseInt(percentage + percentageDependend, 10);

                            percentageText.innerText = tempPercentage;
                            percentageContainer.style.height = tempPercentage + "%";
                        }
                    }, false);

                    return xhr;
                }
            });
        }

    });

});