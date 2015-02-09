requirejs.config({
    basePath: "/"
});
/**
 * what is to load
 * @type {string[]}
 */
var modulesToLoadInDefine = ["jquery", "jqueryui", "modernizr", "useragent", "utilities", "filereader", "videoItemLoader", "videoList", "videoTimeline"];
/**
 * counter for loading modules
 * @type {number}
 */
var modulesLoaded = 0,
    modulesToLoad = modulesToLoadInDefine.length - 1;

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

define(modulesToLoadInDefine, function ($, ui, Modernizr, UserAgent, Utils, FileReaderJS, VideoItemLoader, VideoList, VideoTimeline) {
    "use strict";

    $(document).ready(function() {

        var $preloader,
            $appWrapper,
            $impress,
            $navItems,
            $closeImpress,
            $closeHelp,
            $body;

        // wrapper and instances of modules
        var moduleVideoList,
            moduleVideoItemLoader,
            modulevideoTimeline,
            $wrapperVideoDrop,
            $wrapperVideoAdd,
            $fileLoading;

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
            $closeHelp = $(".close-help");
            $body = $("body");

            // placeholders for module wrappers
            $wrapperVideoDrop = $appWrapper.find(".file-list");
            $wrapperVideoAdd = $appWrapper.find(".file-add");
            $fileLoading = $wrapperVideoDrop.find(".video-loading");

        }

        function bindEvents() {

            $(".time-slider").disableSelection();

            $navItems.on("click", function() {
                if ($(this).hasClass("impress")) {
                    $body.toggleClass("impress-open");
                }
                if ($(this).hasClass("help")) {
                    $body.toggleClass("help-open");
                }
            });

            $closeImpress.on("click", function() {
                $body.toggleClass("impress-open");
            });

            $closeHelp.on("click", function() {
                $body.toggleClass("help-open");
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

            var files = 0;

            moduleVideoItemLoader = new VideoItemLoader({
                tempWrapper: ".temporary-video",
                callback: function(item) {
                    moduleVideoList.addItem(item);
                    files--;
                    if (files === 0) {
                        $fileLoading.fadeOut(200);
                    }
                }
            });

            $(document).on('drop dragover', function (e) {
                e.preventDefault();
            });

            var fileReaderOpts = {
                readAsDefault: 'ArrayBuffer',
                accept: "video/webm",
                on: {
                    loadstart: function(e, file) {
                        $fileLoading.show();
                    },
                    groupstart: function(e) {
                        files = e.files.length;
                    },
                    loadend: function (e, file) {
                        moduleVideoItemLoader.add({
                            data: new Uint8Array(e.target.result),
                            extension: file.extra.extension,
                            name: file.extra.nameNoExtension,
                            prettySize: file.extra.prettySize,
                            size: file.size,
                            type: file.type
                        });
                    },
                    skip: function() {
                        window.alert("only webm supported");
                        files--;
                    }
                }
            };

            FileReaderJS.setupDrop($wrapperVideoDrop[0], fileReaderOpts);
            FileReaderJS.setupInput($wrapperVideoAdd[0], fileReaderOpts);

            /**
             * VideoTimeline
             */
            modulevideoTimeline = new VideoTimeline({
                minWidth: 200,
                scaleFactor: 5,
                container: ".timeline",
                videoList: moduleVideoList
            });

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