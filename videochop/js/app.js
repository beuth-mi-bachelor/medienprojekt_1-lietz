/**
 * global require config
 */
requirejs.config({
    paths: {
        "jquery": "lib/jquery-2.1.1.min",
        "modernizr": "lib/modernizr",
        "ffmpeg": "lib/ffmpeg",
        "useragent": "lib/ua-parser.min"
    },
    waitSeconds: 0
});

/**
 * what is to load
 * @type {string[]}
 */
var modulesToLoadInDefine = ["jquery", "modernizr", "useragent"],
    modulesToLoadAfterDefine = ["ffmpeg"];

/**
 * counter for loading modules
 * @type {number}
 */
var modulesLoaded = 0,
    modulesToLoad = modulesToLoadInDefine.length + modulesToLoadAfterDefine.length + 1;

/**
 * percentage calculations
 * @type {number}
 */
var percentage = 0;
var percentageForEachModule = 100 / modulesToLoad;

/**
 * element bindings for displaying preloading
 */
var percentageContainer = document.getElementById("percentage");
var percentageText = document.getElementById("percentage-text");
var currentModuleText = document.getElementById("currently-loading");

/**
 * when resource is loaded via require count moduls and display progress
 */
require.onResourceLoad = function(context, map) {
    "use strict";
    modulesLoaded += 1;
    percentage = parseInt(modulesLoaded / modulesToLoad * 100, 10);
    displayLoadProgress(percentage);
    currentModuleText.textContent = map.name;
};

var displayLoadProgress = function(p) {
    "use strict";
    percentageText.textContent = p;
    percentageContainer.style.height = p + "%";
};

define(modulesToLoadInDefine, function ($, Modernizr, UserAgent) {
    "use strict";

    $(document).ready(function() {

        var $preloader,
            $appWrapper,
            $impress,
            $navItems;

        // User-Agent helper to identify user
        var ua = new UserAgent();

        initializeVariables();
        getCustomScripts();

        /**
         * Content is loaded - preloader is hidden
         */

        bindEvents();




        /**
         *
         * Functions
         *
         */

        /**
         * appends a script to a head
         * @param url {String} full url to js file
         */
        function appendScript(url) {
            var head = document.getElementsByTagName("head")[0];
            var js = document.createElement("script");
            js.type = "text/javascript";
            js.src = url;
            head.appendChild(js);
            modulesLoaded += 1;
            checkIfAllScriptsAreLoaded();
        }

        /**
         * initialize all variables used
         */
        function initializeVariables() {
            $preloader = $(".preloader");
            $appWrapper = $(".application-wrapper");
            $impress = $(".impress-wrapper");
            $navItems = $(".nav-item");
        }

        function bindEvents() {
            $navItems.on("click", function() {
                var $this = $(this);
                $this.toggleClass("active");
                if ($this.hasClass("impress")) {
                    $impress.toggleClass("active");
                }
            });
        }

        /**
         * Iterate over all modules which should be loaded after define structure
         */
        function getCustomScripts() {
            var requireJsConfig = requirejs.s.contexts._.config;
            for (var i = 0; i < modulesToLoadAfterDefine.length; i++) {
                var url = requireJsConfig.baseUrl + requireJsConfig.paths[modulesToLoadAfterDefine[i]] + ".js";
                currentModuleText.textContent = modulesToLoadAfterDefine[i];
                // FF has a bug in loading large scripts with ajax
                if (ua.getBrowser().name !== "Firefox") {
                    requestScript(url);
                } else {
                    appendScript(url);
                }
            }
        }

        /**
         * checks that loading ends and displays content and hides loader
         */
        function checkIfAllScriptsAreLoaded() {
            if (modulesLoaded === modulesToLoad) {
                $preloader.fadeOut(500);
                $appWrapper.addClass("loading-complete");
            }
        }

        /**
         * request a script via Ajax and show percentage of download-progress
         * @param url {String} full URL to a script
         */
        function requestScript(url) {
            $.ajax({
                url: url,
                dataType: "script",
                cache: true,
                success: function() {
                    modulesLoaded += 1;

                    percentage = parseInt(modulesLoaded / modulesToLoad * 100, 10);
                    displayLoadProgress(percentage);

                    checkIfAllScriptsAreLoaded();
                },
                error: function(e) {
                    console.error("Error", e);
                },
                xhr: function () {
                    var xhr = new XMLHttpRequest();

                    xhr.addEventListener("progress", function (evt) {
                        if (evt.lengthComputable) {
                            var percentComplete = evt.loaded / evt.total;
                            var percentageDependend = percentageForEachModule * percentComplete;
                            var tempPercentage = parseInt(percentage + percentageDependend, 10);

                            displayLoadProgress(tempPercentage);
                        }
                    }, false);

                    return xhr;
                }
            });
        }

    });

});