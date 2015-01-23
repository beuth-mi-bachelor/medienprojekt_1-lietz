requirejs.config({
    baseUrl:"../../videochop/js/"
});

define(["jquery", "videoItem"], (function ($, VideoItem) {
    "use strict";

    $(document).ready(function() {

            var testItem = new VideoItem({});

            $(".btn").on("click",function () {
                console.log("test", testItem);
                $(".test").append(testItem.toString() + "<br>");
            });

        });

}));