/*global FileReaderJS*/
requirejs.config({
    baseUrl: "../../videochop/js/"
});
define(["../../web-placeholder/js/lib/jquery-2.1.1.min", "videoItemLoader", "filereader", "videoList"], (function ($, VideoItemLoader, FileReaderJS, VideoList) {
    "use strict";

    $(document).ready(function () {

        var $fileLoading = $(".video-loading");

        var list = new VideoList({
            container: ".file-list"
        });

        var files = 0;

        var loader = new VideoItemLoader({
            tempWrapper: ".vid",
            callback: function(item) {
                list.addItem(item);
                files--;
                if (files === 0) {
                    $fileLoading.fadeOut(500);
                }
            }
        });

        FileReaderJS.setupDrop(document.getElementById('dropzone'), {
            readAsDefault: 'ArrayBuffer',
            on: {
                loadstart: function(e, file) {
                    $fileLoading.show();
                },
                groupstart: function(e) {
                    files = e.files.length;
                },
                loadend: function (e, file) {
                    var item = loader.add({
                        data: new Uint8Array(e.target.result),
                        extension: file.extra.extension,
                        name: file.extra.nameNoExtension,
                        prettySize: file.extra.prettySize,
                        size: file.size,
                        type: file.type
                    });
                }
            }
        });

    });

}));