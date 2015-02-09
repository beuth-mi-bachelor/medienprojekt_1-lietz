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
        "videoPreview": "modules/videoPreview",
        "videoList": "modules/videoList",
        "videoTimeline" :"modules/videoTimeline",
        "popcorn": "lib/popcorn.min",
        "popcorn-capture": "lib/popcorn.capture",
        "utilities": "modules/utilities",
        "videoInformationRetriever": "modules/videoInformationRetriever"
    },
    shim: {
        "videoItemLoader": {
            deps: ["jquery", "videoItem", "utilities", "popcorn", "popcorn-capture"]
        },
        "videoInformationRetriever": {
            deps: ["jquery", "utilities"]
        },
        "popcorn-capture": {
            deps: ["popcorn"]
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
        "utilities": {
            deps: ["jquery"]
        },
        "videoList": {
            deps: ["jquery", "videoItem"]
        },
        "videoPreview": {
            deps: ["jquery", "videoList", "videoItem"]
        },
        "videoTimeline": {
            deps: ["jquery","jqueryui", "videoItem", "utilities"]
        }
    },
    waitSeconds: 0
});