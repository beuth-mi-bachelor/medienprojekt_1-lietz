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
        "popcorn-capture": "lib/popcorn.capture",
        "utilities": "modules/utilities"
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
        "utilities": {
            deps: ["jquery"]
        },
        "videoList": {
            deps: ["jquery", "videoItem"]
        }
    },
    waitSeconds: 0
});
define(["jquery", "jqueryui", "videoItem", "videoList", "videoItemLoader", "filereader", "utilities"], (function ($, ui, VideoItem, VideoList, VideoItemLoader, FileReaderJS, Utils) {
    "use strict";

        $(document).ready(function() {

            /*video list for debug reasons*/
            var videoList = new VideoList({
                container: ".file-list"
            });

            /*video item loader for debug reasons*/
            /**
             * VideoItemLoader
             */
            var moduleVideoItemLoader = new VideoItemLoader({
                tempWrapper: ".temporary-video",
                callback: function(item) {
                    videoList.addItem(item);
                }
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
                        $(".timeline").sortable("refresh");
                    }
                }
            };

            FileReaderJS.setupInput($(".file-add")[0], fileReaderOpts);

            $(".timeline").sortable({
                revert: 10,
                opacity: 0.3,
                axis: "x",
                tolerance: "intersect",
                placeholder: "placeholder",
                receive: function (e, ui) {
                    ui.sender.data('copied', true);
                    var $item = $(ui.item);
                    initResizable(videoList, $item);
                }
            });

            $("ul,li").disableSelection();

        });

    function initResizable(videoList, $item) {

        var id = $item.attr("id").split("-");
        var itemNumber = id[id.length-1];

        var currentVideoItem = videoList.getItem(itemNumber);

        var minWidth = 200;
        var maxWidth = minWidth + parseInt(currentVideoItem.settings.end * 5, 10);

        $item.attr("data-start", Utils.timeFormat(currentVideoItem.settings.start));
        $item.attr("data-end", Utils.timeFormat(currentVideoItem.settings.end));

        $item.resizable({
            minWidth: minWidth,
            maxWidth: maxWidth,
            handles: "e, w",
            resize: function(event, ui) {
                event.target.style.left = 0;
                var target = event.toElement.className;
                var difference = (ui.size.width - ui.originalSize.width) / 5;
                var $elem = $(ui.element);
                var data = "";
                if (target.indexOf("resizable-e") > -1) {
                    $elem.attr("data-end", Utils.timeFormat(currentVideoItem.settings.end + difference));
                    data = "end";
                } else if (target.indexOf("resizable-w") > -1) {
                    $elem.attr("data-start", Utils.timeFormat(currentVideoItem.settings.start + difference));
                    data = "start";
                }
                $(this).data(data, difference);
            },
            create: function(event, ui) {
                var $elem = $(event.target);
                var $parent = $elem.parent();

                var imgPath = $elem.find("img").attr("src");

                $elem.css({
                    "width": maxWidth + "px",
                    "background-image" :("url(" + imgPath + ")")
                });

                var widthBefore = $parent.width();
                $parent.width(widthBefore + maxWidth);

                var splitted = $elem.attr("id").split("-");
                var id = parseInt(splitted[splitted.length-1], 10);
                var currentVideoItem = videoList.getItem(id);
                $(this).data('item', currentVideoItem);

            },
            stop: function(event, ui) {
                event.target.style.left = 0;
                var currentVideoItem = $(this).data('item');
                var start = $(this).data('start');
                var end = $(this).data('end');
            }
        });
    }
}));