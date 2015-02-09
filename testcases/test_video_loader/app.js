requirejs.config({
    baseUrl:"../../videochop/js/"
});
define(["jquery", "videoItem"], (function ($, VideoItem) {
    "use strict";

        $(document).ready(function() {

            /*BEGIN********************************************************/
            var video = $(".testvideo")[0];
            var start = 20;
            var end = 30;
            var filledTestItem = videoItemLoader(video, start, end);
            /*END**********************************************************/

            console.log(filledTestItem);
            $(".btn").on("click",function () {
                $(".test").append(filledTestItem.getMarkUp());
            });
            $(".btn2").on("click",function () {
                filledTestItem.deleteItem();
            });

    /*BEGIN********************************************************/
    function videoItemLoader(video, start, end) {
        /**
         * needed test variables
         */

        var name = video.currentSrc;
        var length = video.getLength;
        var size = video.size;
        var resolution = video.resolution;

        var thumbnail = "./img/Big_Buck_Bunny_thumbnail_vlc.png";




        var loadContentIntoItem = new VideoItem({
            video:video,
            name:name,
            length:length,
            start:start,
            end:end,
            size:size,
            resolution:resolution,
            thumbnail:thumbnail
        });
        return loadContentIntoItem;
    }
    /*END**********************************************************/


            /**
         * Variabledeclaration
         */
        var testvideo = $(".testvideo")[0];
        var currentslider = $(".slide.currenttime")[0];
        var durslider = $(".slide.durtime")[0];
        var slider = $(".slide.videoslider")[0];
        var intervalRewind;

        /**
         * JQuery Selector for all Click-Functions
         */
        $(".controls").on("click", ".control", function () {
            var $this = $(this);
            if ($this.hasClass("playpause")) {
                playPause();
            } else if ($this.hasClass("stop")) {
                videoStop();
            } else if ($this.hasClass("normal")) {
                videoNormal();
            } else if ($this.hasClass("faster")) {
                videoFaster();
            } else if ($this.hasClass("backward")) {
                videoBackward();
            } else if ($this.hasClass("mute")) {
                videoMute();
            } else if ($this.hasClass("fullscreen")) {
                videoFullscreen();
            } else if ($this.hasClass("loop")) {
                videoLoop();
            }
        });

        /**
         * JQuery Selector for all Change-Functions
         */
        $(".slides").on("change", ".slide", function () {
            var $this = $(this);
            if ($this.hasClass("volumeslider")) {
                changeVolume(this.value);
            } else if ($this.hasClass("videoslider"))  {
                this.max = testvideo.duration;
                vidJumpTo(this.value);
            }
        });

        /**
         * EventListener für timeupdate funktion auf HTML Objekt
         */

        /*BEGIN********************************************************/
        testvideo.addEventListener("timeupdate", function() {
            console.log("timeupdate");
            var $this = $(this);
            if ($this.hasClass("vid")) {
                vidTimeUpdate(this.currentTime);

                var time = (Math.floor(this.currentTime));
                if (time === filledTestItem.settings.end) {
                    playPause();
                }
            }
        }, false);
        /*END**********************************************************/

        /**
         * FUNCTION for Play and Pause
         */

        /*BEGIN********************************************************/
        function playPause() {
            testvideo.currentTime = filledTestItem.settings.start;

            if (testvideo.paused) {
                testvideo.play();
            }
            else {
                testvideo.pause();
            }
            clearInterval(intervalRewind);
        }
        /*END**********************************************************/

        /**
         * FUNCTION for Stop
         */
        function videoStop() {
            if (testvideo.paused) {
                testvideo.currentTime = 0;
            }
            else {
                testvideo.pause();
                testvideo.currentTime = 0;
            }
            clearInterval(intervalRewind);
        }

        // ab playbackRate 5 fängt es an zu ruckeln / bis 4 ist es flüssig
        /**
         * FUNCTION for Faster
         */
        function videoFaster() {
            if (testvideo.paused) {
                testvideo.playbackRate += 1;
            }
            else {
                playPause();
                testvideo.playbackRate += 1;
            }
            playPause();
            clearInterval(intervalRewind);
        }

        /**
         * FUNCTION for Normal Speed
         */
        function videoNormal() {
            if (testvideo.paused) {
                testvideo.playbackRate = 1;
            }
            else {
                playPause();
                testvideo.playbackRate = 1;
            }
            playPause();
            clearInterval(intervalRewind);
        }


        // funktion adaptiert von http://jsfiddle.net/bplumb/h9EVQ/8/
        // etwas unsauber aber anders nicht wirklich machbar !
        /**
         * FUNCTION for Backward
         */
        function videoBackward() {
            intervalRewind = setInterval(function () {
                testvideo.playbackRate = 1.0;
                if (testvideo.currentTime === 0) {
                    clearInterval(intervalRewind);
                    testvideo.pause();
                }
                else {
                    testvideo.currentTime -= .1;
                }
            }, 30);
        }

        /**
         * FUNCTION for Volume
         * @param value is the new Volume Level
         */
        function changeVolume(value){
            testvideo.volume = value/100;
        }

        /**
         * FUNCTION for Seeking in Videos
         * @param value is the new Position
         */
        function vidTime(){

            var curmins = Math.floor(testvideo.currentTime / 60);
            var cursecs = Math.floor(testvideo.currentTime - curmins * 60);
            var durmins = Math.floor(testvideo.duration / 60);
            var dursecs = Math.floor(testvideo.duration - durmins * 60);

            if(cursecs < 10){ cursecs = "0"+cursecs; }
            if(dursecs < 10){ dursecs = "0"+dursecs; }
            if(curmins < 10){ curmins = "0"+curmins; }
            if(durmins < 10){ durmins = "0"+durmins; }

            currentslider.innerHTML = curmins+":"+cursecs;
            durslider.innerHTML = durmins+":"+dursecs;
        }

        /**
         * FUNCTION FOR JUMPTO FUNCTION
         */

        function vidJumpTo(value) {
            testvideo.currentTime = value;
        }

        /**
         * FUNCTION for the Timeupdate of the Videoseekslider
         * @param value is the curentTime of the Video
         */
        function vidTimeUpdate(value) {
            slider.value = value;
            vidTime();
        }

        /**
         * FUNCTION for Mute
         */
        function videoMute() {
            if (testvideo.muted) {
                testvideo.muted = false;
            }
            else {
                testvideo.muted = true;
            }
        }

        /**
         * FUCNTION for Fullscreen
         */
        function videoFullscreen() {
            if (testvideo.requestFullScreen) {
                testvideo.requestFullScreen();
            } else if (testvideo.mozRequestFullScreen) {
                testvideo.mozRequestFullScreen();
            } else if (testvideo.webkitRequestFullScreen) {
                testvideo.webkitRequestFullScreen();
            }
        }

        /**
         * FUNCTION for Loop
         */
        function videoLoop() {
            if (testvideo.loop) {
                testvideo.loop = false;
            }
            else {
                testvideo.loop = true;
            }
        }
        });
}));