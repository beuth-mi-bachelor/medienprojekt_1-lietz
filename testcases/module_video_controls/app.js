requirejs.config({
    baseUrl:"../../videochop/js/",
    paths: {
        "jquery": 'lib/jquery-2.1.1.min'
    }
});
define(["jquery", "modules/videoList", "modules/videoItem"], (function ($, VideoList, VideoItem) {
    "use strict";

        $(document).ready(function() {


            console.log(VideoItem.indices);
            var videoOne = new VideoItem({
                thumbnail: "http://placehold.it/200x200"
            });
            console.log(VideoItem.indices, videoOne.id);

            var videoTwo = new VideoItem({
                thumbnail: "http://placehold.it/200x200/808080"
            });
            console.log(VideoItem.indices, videoOne.id, videoTwo.id);

            var videoThree = new VideoItem({
                thumbnail: "http://placehold.it/200x200/db0000"
            });

            var test = new VideoList({
                container: ".file-list",
                items:[videoOne, videoTwo]
            });

            test.addItem(videoThree);

            console.log(VideoItem.indices);
            console.log(test.videolist);

            //test.deleteItem(2);
            console.log(test.videolist);

            $(".file").on("click", ".file-delete", function () {
                var $this = $(this).parent();
                var id = $this.attr("id");
                var splittedarray = id.split("-");
                id = splittedarray[splittedarray.length-1];
                id = parseInt(id,10);
                test.deleteItem(id);
            });

        });

}));