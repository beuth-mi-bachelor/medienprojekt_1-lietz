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
            type: "video/mp4",
            tempWrapper: "#temp-video"
        };

        // if settings where not set by initializing, fill with default settings
        $.extend(this.settings, settings || {});
    }

    VideoItemLoader.prototype = {
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
            var tempName = "tempVideo" + new Date().getTime();
            video.setAttribute("id", tempName);
            var src = document.createElement("source");
            src.src = url;
            src.type = type;
            video.appendChild(src);
            var $vidwrapper = $(this.settings.tempWrapper);
            $vidwrapper.append(video);
            var $pop = Popcorn("#"+tempName);

            $pop.videoName = this.video.name;
            $pop.videoElement = video;
            $pop.videoType = this.video.type;
            $pop.videoSize = this.video.size;
            $pop.videoPrettySize = this.video.prettySize;

            var self = this;
            $pop.listen('canplayall', function() {

                var item = new VideoItem({
                    video: this.media.currentSrc,
                    name: this.videoName,
                    length: this.media.duration,
                    start: 0,
                    end: this.media.duration,
                    size: this.videoSize,
                    type: this.videoType,
                    videoElement: this.videoElement,
                    resolution: {
                        width: this.media.videoWidth,
                        height: this.media.videoHeight
                    },
                    prettySize: this.videoPrettySize
                });

                var poster = this.currentTime(1).capture();
                item.settings.thumbnail = poster.video.poster;

                $("#"+tempName).remove();
                $("#popcorn-canvas-"+tempName).remove();

                self.settings.list.addItem(item);

                Popcorn.destroy(this);

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


