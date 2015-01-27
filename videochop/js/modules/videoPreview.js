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
            vidContainer: ".default"
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
                        var currentItem = list[item];
                        var video = currentItem.settings.videoElement;
                        this.$vidContainer.append(video);
                }
            }
            var self = this;

            $.each(self.$vidContainer.find("video"), function (k,v) {
                console.log(v);

                $(v).on('canplaythrough', self.videoCallback());
            });
        },

        videoCallback: function () {
            console.log("Hallooo");
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