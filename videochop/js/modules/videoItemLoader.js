/**
 * (C)opyright Michael Duve, Felix Maulwurf, Angelina Staeck
 *
 * @module: VideoItemLoader
 * @requires: jQuery
 * @requires: VideoItem
 * @requires: Popcorn
 * @requires: Popcorn.capture
 *
 * this module handles the communication between video and videoItem
 */

define(["jquery", "videoItem", "popcorn", "popcorn-capture"], (function ($, VideoItem, Popcorn) {
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
            type: "video/mp4",
            tempWrapper: "#temp-video"
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

            if (this.settings.list === null) {
                console.error("no list to append found");
            } else if (this.video.data === null) {
                console.error("no data found");
            }
            else {
                var url = window.URL.createObjectURL(new Blob(
                    [this.video.data], {
                        type: this.video.type
                    }
                ));
                this.loadMetaData(url, this.video.type);
            }
        },

        loadMetaData: function (url, type) {
            var video = document.createElement("video");
            video.setAttribute("id", "tempVideo");
            var src = document.createElement("source");
            src.src = url;
            src.type = type;
            video.appendChild(src);
            var $vidwrapper = $(this.settings.tempWrapper);
            $vidwrapper.empty();
            $vidwrapper.append(video);
            var $pop = Popcorn("#tempVideo");

            var self = this;
            $pop.listen('canplayall', function() {
                var poster = $pop.currentTime(3).capture();
                self.video.thumbnail = poster.video.poster;
                self.video.width = $pop.media.clientWidth;
                self.video.height = $pop.media.clientHeight;

                var item = new VideoItem({
                    video: self.video.data,
                    name: self.video.name,
                    length: self.duration,
                    start: 0,
                    end: self.duration,
                    size: self.video.size,
                    resolution: {
                        width: self.video.width,
                        height: self.video.height
                    },
                    thumbnail: self.video.thumbnail
                });

                self.settings.list.addItem(item);
            });
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


