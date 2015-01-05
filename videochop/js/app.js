/**
 * global require config
 */
requirejs.config({
    paths: {
        "jquery": "lib/jquery-2.1.1.min",
        "jqueryui": "lib/jquery-ui.min",
        "modernizr": "lib/modernizr",
        "useragent": "lib/ua-parser.min",
        "filereader": 'lib/filereader',
        "videoItemLoader": "modules/videoItemLoader",
        "videoItem": "modules/videoItem",
        "videoList": "modules/videoList",
        "popcorn": "lib/popcorn.min",
        "popcorn-capture": "lib/popcorn.capture"
    },
    shim: {
        "videoItemLoader": {
            deps: ["jquery", "videoItem", "popcorn", "popcorn-capture"]
        },
        "popcorn-capture": {
            deps: ["popcorn"]
        },
        "popcorn": {
            deps: ["jquery"]
        },
        "videoItem": {
            deps: ["jquery"]
        },
        "modernizr": {
            deps: ["jquery"]
        },
        "videoList": {
            deps: ["jquery", "videoItem"]
        }
    },
    waitSeconds: 0
});

/**
 * what is to load
 * @type {string[]}
 */
var modulesToLoadInDefine = ["jquery", "jqueryui", "modernizr", "useragent", "filereader", "videoItemLoader", "videoList"];
/**
 * counter for loading modules
 * @type {number}
 */
var modulesLoaded = 0,
    modulesToLoad = modulesToLoadInDefine.length;

for (var i = 0; i < modulesToLoadInDefine.length; i++) {
    var currentModule = modulesToLoadInDefine[i];
    var shims = requirejs.s.contexts._.config.shim;
    if (shims.hasOwnProperty(currentModule)) {
        if (shims[currentModule].deps) {
            var deps = shims[currentModule].deps;
            for (var j = 0; j < deps.length; j++) {
                if (modulesToLoadInDefine.indexOf(deps[j]) < 0) {
                    modulesToLoad++;
                }
            }
        }
    }
}

/**
 * percentage calculations
 * @type {number}
 */
var percentage = 0;

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

define(modulesToLoadInDefine, function ($, ui, Modernizr, UserAgent, FileReaderJS, VideoItemLoader, VideoList) {
    "use strict";

    $(document).ready(function() {

        var $preloader,
            $appWrapper,
            $impress,
            $navItems,
            $closeImpress,
            $body;

        // wrapper and instances of modules
        var moduleVideoList,
            moduleVideoItemLoader,
            $wrapperVideoDrop,
            $wrapperVideoAdd;

        // User-Agent helper to identify user
        var ua = new UserAgent();

        // disableing selection of navigational elements
        $(".nav").disableSelection();
        $(".preview").disableSelection();

        initializeVariables();

        checkIfAllScriptsAreLoaded();

        /**
         * Content is loaded - preloader is hidden
         */

        bindEvents();

        startModules();


        /**
         *
         * Functions
         *
         */

        /**
         * initialize all variables used
         */
        function initializeVariables() {
            $preloader = $(".preloader");
            $appWrapper = $(".application-wrapper");
            $impress = $(".impress-wrapper");
            $navItems = $(".nav-item");
            $closeImpress = $(".close-impress");
            $body = $("body");

            // placeholders for module wrappers
            $wrapperVideoDrop = $appWrapper.find(".file-list");
            $wrapperVideoAdd = $appWrapper.find(".file-add");

        }

        function bindEvents() {

            $navItems.on("click", function() {
                if ($(this).hasClass("impress")) {
                    $body.toggleClass("impress-open");
                }
            });

            $closeImpress.on("click", function() {
                $body.toggleClass("impress-open");
            });

            $(".file-add-button").on("click", function() {
                $(".file-add").trigger("click");
            });
        }

        function startModules() {
            /**
             * VideoList
             */
            moduleVideoList = new VideoList({
                container: ".file-list"
            });



            /**
             * VideoItemLoader
             */
            moduleVideoItemLoader = new VideoItemLoader({
                tempWrapper: ".temporary-video",
                list: moduleVideoList
            });

            $(document).on('drop dragover', function (e) {
                e.preventDefault();
            });

            var fileReaderOpts = {
                readAsDefault: 'ArrayBuffer',
                accept: "video/*",
                on: {
                    loadend: function (e, file) {
                        moduleVideoItemLoader.add({
                            data: new Uint8Array(e.target.result),
                            extension: file.extra.extension,
                            name: file.extra.nameNoExtension,
                            prettySize: file.extra.prettySize,
                            size: file.size,
                            type: file.type
                        });
                    }
                }
            };

            FileReaderJS.setupDrop($wrapperVideoDrop[0], fileReaderOpts);
            FileReaderJS.setupInput($wrapperVideoAdd[0], fileReaderOpts);

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

    });
});