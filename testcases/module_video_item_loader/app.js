/*global FileReaderJS*/
requirejs.config({
    baseUrl: "../../videochop/js/",
    paths: {
        "jquery": 'lib/jquery-2.1.1.min',
        "filereader": 'lib/filereader',
        "videoItemLoader": "modules/videoItemLoader",
        "videoItem": "modules/videoItem",
        "videoList": "modules/videoList",
        "popcorn": "lib/popcorn.min",
        "popcorn-capture": "lib/popcorn.capture"
    },
    shim: {
        "popcorn-capture": {
            deps: ["popcorn"]
        }
    }
});
define(["jquery", "videoItemLoader", "filereader", "videoList"], (function ($, VideoItemLoader, FileReaderJS, VideoList) {
    "use strict";

    $(document).ready(function () {

        var list = new VideoList({
            container: ".videolist"
        });

        var loader = new VideoItemLoader({
            tempWrapper: ".vid",
            list: list
        });

        FileReaderJS.setupDrop(document.getElementById('dropzone'), {
            readAsDefault: 'ArrayBuffer',
            on: {
                loadend: function (e, file) {
                    var item = loader.add({
                        data: new Uint8Array(e.target.result),
                        extension: file.extra.extension,
                        name: file.extra.nameNoExtension,
                        prettySize: file.extra.prettySize,
                        size: file.size,
                        type: file.type
                    });
                    console.log(item);
                }
            }
        });

    });

}));