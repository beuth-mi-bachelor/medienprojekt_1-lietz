requirejs.config({
    baseUrl:"../../videochop/js/",
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
define(["jquery", "jqueryui", "videoItem", "videoList"], (function ($, ui, VideoItem, VideoList) {
    "use strict";

        $(document).ready(function() {

            var vidItem = new VideoItem({

            });

            console.log(vidItem);

            $(".timeline").sortable({
                revert: 10,
                opacity: 0.3,
                axis: "x"
            });


            $(".timeline li").resizable({
                minWidth: 100,
                maxWidth: 300,
                handles: "e, w",
                stop: function(event) {
                    event.target.style.left = 0;
                }
            });

            $( "ul, li" ).disableSelection();

        });

}));