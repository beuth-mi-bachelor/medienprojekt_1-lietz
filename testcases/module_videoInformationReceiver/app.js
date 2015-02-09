/*global FileReaderJS*/
requirejs.config({
    baseUrl: "../../videochop/js/"
});
define(["jquery", "filereader", "videoItem", "videoInformationRetriever"], (function ($, FileReaderJS, VideoItem, VideoInformationRetriever) {
    "use strict";

    $(document).ready(function () {

        var files = 0;

        var moduleVIR = new VideoInformationRetriever({
            callback: function(item) {
                $(".debug").append(item.toString());
            }
        });


        FileReaderJS.setupDrop(document.getElementById('dropzone'), {
            readAsDefault: 'ArrayBuffer',
            on: {
                groupstart: function(e) {
                    files = e.files.length;
                },
                loadend: function (e, file) {

                    files--;

                    var item = new VideoItem({
                        video: null,
                        name: file.extra.nameNoExtension,
                        length: 0,
                        start: 0,
                        end: 0,
                        size: file.size,
                        type: file.type,
                        resolution: {
                            width: 640,
                            height: 480
                        },
                        thumbnail: null,
                        prettySize: file.extra.prettySize,
                        videoElement: null,
                        data: new Uint8Array(e.target.result)
                    });

                    moduleVIR.addVideoItemToQueue(item);

                }
            }
        });

    });

}));