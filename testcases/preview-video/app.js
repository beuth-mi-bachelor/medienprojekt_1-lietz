requirejs.config({
    baseUrl:"../../videochop/js/"
});
define(["jquery", "jqueryui", "videoItem", "videoList", "videoItemLoader", "filereader", "videoPreview"], (function ($, ui, VideoItem, VideoList, VideoItemLoader, FileReaderJS, VideoPreview) {
    "use strict";

        $(document).ready(function() {

            /*video list for debug reasons*/
            var videoList = new VideoList({
                container: ".file-list"
            });

            var modulePreviewVideo = new VideoPreview({
                videoList: videoList,
                vidContainer: ".preview-video"
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
                    }
                }
            };

            FileReaderJS.setupInput($(".file-add")[0], fileReaderOpts);

            $(".timeline").sortable({
                revert: 10,
                opacity: 0.3,
                axis: "x"
            });

            $( "ul, li" ).disableSelection();

           /* $(".file-list").on('click', ".file", function (e) {

                var fileId = $(this).attr("id");
                var split = fileId.split("-");

                modulePreviewVideo.showPreview(videoList.videolist[split[2]]);

            });*/

            $("#prepare").on('click', function (e) {
                modulePreviewVideo.prepareToPlay();
            });

            $("#play").on('click', function (e) {
                modulePreviewVideo.playVideo();
            });

        });

}));