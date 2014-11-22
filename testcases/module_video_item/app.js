requirejs.config({
    paths: {
        "jquery": '../../videochop/js/lib/jquery-2.1.1.min'
    }
});
define(["jquery", "../../videochop/js/modules/videoItem", "../../videochop/js/modules/videoList"], (function ($, VideoItem, VideoList) {
    "use strict";

        $(document).ready(function() {

            console.log($(".btn"));
            var testItem = new VideoItem({});
            var testList = new VideoList([testItem, testItem]);
            console.log(testItem);
            $(".btn").on("click",function () {
                $(".test").append(testList.listVideoItems());
            });
            $(".btn2").on("click",function () {
                testItem.deleteItem();
            });

        });

}));