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
        "filesaver": 'lib/filesaver.min',
        "videoItemLoader": "modules/videoItemLoader",
        "videoItem": "modules/videoItem",
        "videoPreview": "modules/videoPreview",
        "videoList": "modules/videoList",
        "videoTimeline" :"modules/videoTimeline",
        "popcorn": "lib/popcorn.min",
        "popcorn-capture": "lib/popcorn.capture",
        "utilities": "modules/utilities",
        "videoInformationRetriever": "modules/videoInformationRetriever",
        "eventHandler": "modules/eventHandler",
        "videoExporter": "modules/videoExporter"
    },
    shim: {
        "videoItemLoader": {
            deps: ["jquery", "videoItem", "utilities", "popcorn", "popcorn-capture"]
        },
        "videoInformationRetriever": {
            deps: ["jquery", "utilities"]
        },
        "videoExporter": {
            deps: ["jquery", "utilities", "filesaver"]
        },
        "popcorn-capture": {
            deps: ["jquery", "popcorn"]
        },
        "popcorn": {
            deps: ["jquery"]
        },
        "videoItem": {
            deps: ["jquery", "utilities"]
        },
        "modernizr": {
            deps: ["jquery"]
        },
        "eventHandler": {
            deps: ["jquery"]
        },
        "utilities": {
            deps: ["jquery"]
        },
        "videoList": {
            deps: ["jquery", "videoItem", "jqueryui"]
        },
        "videoPreview": {
            deps: ["jquery", "videoList", "videoItem", "eventHandler"]
        },
        "videoTimeline": {
            deps: ["jquery", "jqueryui", "videoItem", "utilities", "eventHandler"]
        }
    },
    waitSeconds: 0
});