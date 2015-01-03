requirejs.config({
    baseUrl:"../../videochop/js/",
    paths: {
        "jquery": 'lib/jquery-2.1.1.min',
        "ui": 'lib/jquery-ui.min'
    },
    shim: {
        "ui": {
            deps: ["jquery"]
        }
    }
});
define(["jquery", "ui", "modules/videoItem", "modules/videoList"], (function ($, ui, VideoItem, VideoList) {
    "use strict";

        $(document).ready(function() {

            var vidItem = new VideoItem({

            });

            console.log(vidItem);

            $(".timeline").sortable({
                revert: true,
                revertDuration: 10
            });


            $(".timeline li").resizable({
                minWidth: 100,
                maxWidth: 300,
                handles: "e, w",
                stop: function( event, ui ) {
                    event.target.style.left = 0;
                }
            });

            $( "ul, li" ).disableSelection();

        });

}));