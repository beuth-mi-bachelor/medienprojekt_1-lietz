requirejs.config({
    paths: {
        "jquery": '../../videochop/js/lib/jquery-2.1.1.min'
    }
});
define(["jquery", "../../videochop/js/modules/videoItem"], (function ($, VideoItem) {
    "use strict";

        $(document).ready(function() {

            console.log($(".btn"));
            var testItem = new VideoItem({});
            console.log(testItem);
            $(".btn").on("click",function () {
                $(".test").append(testItem.getMarkUp());
            });
            $(".btn2").on("click",function () {
                testItem.deleteItem();
            });

        });

}));