/**
 * (C)opyright Michael Duve, Felix Maulwurf, Angelina Staeck
 *
 * @module: PreviewVideo
 * @requires: jQuery
 * @requires: videoList
 * @requires: videoItem
 *
 * TODO: add more dependencies here
 *
 * this module shows a video and controls it
 */

define(["jquery", "videoList", "videoItem"], (function ($, VideoList, VideoItem) {
    "use strict";

    /**
     * initializes a new instance
     * @param settings {Object} a JSON-Object which holds all informations for the module
     * @constructor
     */
    function PreviewVideo(settings) {
        this.settings = {
            videoList: null,
            singleItem: null,
            vidContainer: ".default",
            lengthContainer: ".default",
            duration: 0
    };

        // if settings where not set by initializing, fill with default settings
        $.extend(this.settings, settings || {});
        this.initialize();
    }

    PreviewVideo.prototype = {
        initialize: function () {
            this.$vidContainer = $(this.settings.vidContainer);
        },

        showPreview: function (item) {

            if(item instanceof VideoItem){

                this.singleItem = item;

                var $video = this.$vidContainer.find("Video");

                $video.empty();

                var src = document.createElement("source");
                src.src = this.singleItem.settings.video;
                src.type = this.singleItem.settings.type;
                $video[0].appendChild(src);
                $video.load();
            }
        },

        prepareToPlay: function () {

            var list = this.settings.videoList.videolist;

            console.log(list);
            this.$vidContainer.empty();

            for (var item in list) {
                if (list.hasOwnProperty(item)) {
                        this.settings.singleItem = list[item];
                        var video = this.settings.singleItem.settings.videoElement;
                        this.$vidContainer.append(video);
                }
            }
            var self = this;

            $.each(self.$vidContainer.find("video"), function (k,v) {
                console.log(v);
                var _this = self;

                $(v).on('canplaythrough', self.videoCallback());

                _this.settings.duration += _this.settings.singleItem.settings.videoElement.duration;

            });
            document.getElementById("length").innerHTML = self.settings.duration + "";

        },

        videoCallback: function () {
            console.log("Hallooo");
            this.currentTime = this.settings.singleItem.settings.start;
            $(this).on('timeupdate', function() {
                var self = this;
                if (self.currentTime >= self.settings.singleItem.settings.end) {
                    //playNextVideo();
                }

            });
        },

        playVideo: function () {

           var videos = document.getElementById('video-item-1');
            var list = this.settings.videoList.videolist;

           // console.log(videos);
            for (var item in list) {
                if (list.hasOwnProperty(item)) {
                    var currentItem = list[item];
                }
            }

            videos.addEventListener("timeupdate", function() {

                if (this.currentTime === this.duration) {
                    var $this = $(this);
                }
            }, false);

        },

            
/*
            var $video = $(this.settings.vidContainer).find("Video");
            var video = $video[0];

            video.currentTime = this.singleItem.settings.video.start;

            video.play();*/

        /**
         * describes this Object to the user
         * @returns {String} representation of this Object
         */
        toString: function () {
            return "PreviewVideo=[]";
        }
    };

    return PreviewVideo;

}));