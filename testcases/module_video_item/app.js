requirejs.config({
    baseUrl:"../../videochop/js/",
    paths: {
        "jquery": 'lib/jquery-2.1.1.min'
    }
});
define(["jquery", "modules/videoItem", "modules/videoList"], (function ($, VideoItem, VideoList) {
    "use strict";

        $(document).ready(function() {

            var testItem = new VideoItem({});

            $(".btn").on("click",function () {
                $(".test").append(testItem.toString() + "<br>");
            });

        });

}));