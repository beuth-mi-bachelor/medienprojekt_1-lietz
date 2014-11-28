/*global FileReaderJS*/
requirejs.config({
    baseUrl: "../../videochop/js/",
    paths: {
        "jquery": 'lib/jquery-2.1.1.min',
        "filereader": 'lib/filereader',
        "popcorn": "lib/popcorn.min",
        "popcorn.capture": 'lib/popcorn.capture'
    },
    shim: {
        "popcorn.capture": {
            deps: ["popcorn"]
        }
    }
});
define(["jquery", "modules/videoItemLoader", "filereader"], (function ($, VideoItemLoader, filereader) {
    "use strict";

    $(document).ready(function () {


        FileReaderJS.setupDrop(document.getElementById('dropzone'), {
            readAsDefault: 'ArrayBuffer',
            on: {
                loadend: function (e, file) {
                    var loader = new VideoItemLoader();
                    console.log(loader);
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