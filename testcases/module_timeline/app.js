requirejs.config({
    baseUrl:"../../videochop/js/"
});
define(["jquery", "videoList", "videoItemLoader", "filereader", "videoTimeline", "PreviewVideo"], (function ($, VideoList, VideoItemLoader, FileReaderJS, VideoTimeline, PreviewVideo) {
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

            /**
             * PreviewVideo
             */
            var modulePreviewVideo = new PreviewVideo({
                vidContainer: ".preview-video"
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

            var videoTimeline = new VideoTimeline({
                minWidth: 100,
                scaleFactor: 10,
                container: ".timeline",
                videoList: videoList
            });

        });
}));