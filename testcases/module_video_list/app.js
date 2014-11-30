requirejs.config({
    baseUrl:"../../videochop/js/",
    paths: {
        "jquery": 'lib/jquery-2.1.1.min'
    }
});
define(["jquery", "modules/videoList", "modules/videoItem"], (function ($, VideoList, VideoItem) {
    "use strict";

        $(document).ready(function() {

            var test = new VideoList({
                container: ".file-list"
            });


            $(".test").on("click",".button",function() {
                var videoNew = new VideoItem({
                    thumbnail: generateString()
                });
                test.addItem(videoNew);
            });

            var x;
            function randomColor ()
            {
                var color="";
                for (x=0;x<6;x++)
                {
                    color+=
                        "0123456789ABCDEF"
                            .charAt (Math.round (Math.random ()*1000)%16);
                }
                return color;
            }

            function generateString() {
                var string = "http://placehold.it/200/" + randomColor();
                return string;
            }

        });

}));