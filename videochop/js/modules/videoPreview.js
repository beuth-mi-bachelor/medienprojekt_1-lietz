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

define(["jquery", "videoList", "videoItem", "eventHandler", "utilities"], (function ($, VideoList, VideoItem, EventHandler, Utils) {
    "use strict";

    /**
     * initializes a new instance
     * @param settings {Object} a JSON-Object which holds all informations for the module
     * @constructor
     */
    function PreviewVideo(settings) {
        this.settings = {
            vidContainer: ".default",
            prefix: "timeline-item-"
        };

        // if settings where not set by initializing, fill with default settings
        $.extend(this.settings, settings || {});
        this.initialize();
    }

    PreviewVideo.prototype = {
        initialize: function () {
            this.$vidContainer = $(this.settings.vidContainer);
            this.videoObjects = {};
            this.indices = [];
            this.positionVideo = 0;
            this.eventHandler = new EventHandler();
            this.bindEvents();
        },
        bindEvents: function() {
            var self = this;
            this.eventHandler.subscribe("preview-order", function(order) {
                self.updateIndices(order);
            });
            this.eventHandler.subscribe("preview-item", function($item, order, id) {
                self.updateIndices(order);
                self.addVideo($item, id);
            });
            this.eventHandler.subscribe("preview-size-update", function(itemId, start, end) {
                var current = self.videoObjects[self.settings.prefix + itemId];
                current.videoitem.start = start;
                current.video.currentTime = start;
                current.videoitem.end = end;
            });
            $(this.settings.playButton).on("click", function() {
                self.play(self.loopThrough());
            });
            $(this.settings.pauseButton).on("click", function() {
                self.pause();
            });
            $(this.settings.stopButton).on("click", function() {
                self.stop();
            });
        },
        updateIndices: function (indices) {
            this.indices = indices;
        },
        addVideo: function ($element, vidItemId) {

            var self = this;

            var id = self.settings.prefix + vidItemId;

            var item = $element.data("item");
            var $videoElem = $(item.settings.videoElement).clone().attr("id", "").data("vidItemId", vidItemId).data("id", id);

            this.videoObjects[id] = {
                videoitem: item,
                video: $videoElem[0],
                vidItemId: vidItemId,
                id: id
            };

            if (this.indices.length === 1) {
                this.currentVideo = $videoElem[0];
                $(this.currentVideo).addClass("current");
            }

            this.$vidContainer.append($videoElem);

            $videoElem[0].addEventListener("canplayall", function() {
                self.currentVideo.currentTime = item.settings.start;
            }, false);

            $videoElem[0].addEventListener("timeupdate", function() {

                var id = $(this).data("id");

                var vidObj = self.videoObjects[id].videoitem;
                var vidVideo = self.videoObjects[id].video;

                if (vidVideo.currentTime >= vidObj.settings.end) {
                    $(vidVideo).removeClass("current");
                    vidVideo.pause();
                    self.positionVideo += 1;
                    vidVideo.currentTime = vidObj.settings.start;
                    self.play(self.loopThrough());
                }
            }, false);

        },
        loopThrough: function() {
            return this.positionVideo % this.indices.length;
        },
        pause: function() {
            this.currentVideo.pause();
        },
        play: function (id) {
            if (this.currentVideo) {
                var current = this.videoObjects[this.indices[id]];
                this.currentVideo = current.video;
                $(this.currentVideo).addClass("current");
                if (this.currentVideo.paused) {
                    this.currentVideo.play();
                }
                else {
                    this.currentVideo.pause();
                }
            }
        },
        stop: function () {
            this.positionVideo = 0;
            this.$vidContainer.find("video").removeClass("current");
            $(this.videoObjects[this.indices[this.positionVideo]].video).addClass("current");
            if (!this.currentVideo.paused) {
                this.currentVideo.pause();
            }
            this.resetAllVideos();
        },
        resetAllVideos: function() {
            for (var item in this.videoObjects) {
                var currentObj = this.videoObjects[item];
                currentObj.video.currentTime = currentObj.videoitem.settings.start;
            }
        },
        /**
         * describes this Object to the user
         * @returns {String} representation of this Object
         */
        toString: function () {
            return "videoPreview=[]";
        }
    };

    return PreviewVideo;

}));