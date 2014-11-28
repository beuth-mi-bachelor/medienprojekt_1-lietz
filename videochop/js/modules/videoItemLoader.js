/**
 * (C)opyright Michael Duve, Felix Maulwurf, Angelina Staeck
 *
 * @module: VideoItemLoader
 * @requires: jQuery
 * TODO: add more dependencies here
 *
 * this module handles the communication between video and videoItem
 */

define(["jquery", "modules/videoItem", "popcorn", "popcorn.capture"], (function ($, VideoItem) {
    "use strict";

    /**
     * initializes a new instance
     * @param settings {Object} a JSON-Object which holds all informations for the module
     * @constructor
     */
    function VideoItemLoader(settings) {

        this.settings = {

            data: null,
            extension: "mp4",
            name: "default",
            prettySize: "0 MB",
            size: 0,
            type: "video/mp4"

        };

        // if settings where not set by initializing, fill with default settings
        $.extend(this.settings, settings || {});

        this.initialize();
    }

    VideoItemLoader.prototype = {
        initialize: function () {

        },

        add: function (data) {
            this.video = {
                data: null,
                extension: "mp4",
                name: "default",
                prettySize: "0 MB",
                size: 0,
                type: "video/mp4"
            };
            $.extend(this.video, data || {});

            this.loaded = false;

            if (this.video.data === null) {
                console.error("no data found");
                return;
            }
            else {
                var url = window.URL.createObjectURL(new Blob(
                    [this.video.data], {
                        type: this.video.type
                    }
                ));
                console.log(url);
                return this.loadMetaData(url, this.video.type);
            }


        },

        loadMetaData: function (url, type) {
            var video = document.createElement("video");
            video.setAttribute("id", "tempVideo");
            var src = document.createElement("source");
            src.src = url;
            src.type = type;
            video.appendChild(src);
            var self = this;
            $(".vid").append(video);
            var $pop = Popcorn("#tempVideo");
            console.log($pop);
            var poster = $pop.currentTime( 10 ).capture();
            this.video.thumbnail = poster.video.poster;
            this.video.duration = $pop.media.duration;
            console.log($pop.media);
            this.video.width = $pop.media.clientWidth;
            this.video.height = $pop.media.clientHeight;
            return new VideoItem({
                video: this.video.data,
                name: this.video.name,
                length: this.video.duration,
                start: 0,
                end: this.video.duration,
                size: this.video.size,
                resolution: {
                    width: this.video.width,
                    height: this.video.height
                },
                thumbnail: this.video.thumbnail});


        },

        /**
         * describes this Object to the user
         * @returns {String} representation of this Object
         */
        toString: function () {
            return "VideoItemLoader=[]";
        }
    };

    return VideoItemLoader;

}));


