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
            this.eventHandler.subscribe("preview-item", function($item, order) {
                self.addVideo($item);
                self.updateIndices(order);
            });
            this.eventHandler.subscribe("preview-size-update", function(itemId, start, end) {
                var current = self.videoObjects[self.settings.prefix + itemId];
                current.videoitem.start = start;
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
            if (this.indices.length > 0) {
                $(".preview video:not(#video-item-"+this.indices[0]+")").hide();
                $(this.videoObjects[this.indices[0]].video).show();
            }
        },
        addVideo: function ($element) {
            var self = this;
            var id = self.settings.prefix + $element.data("id");
            var item = $element.data("item");
            this.videoObjects[id] = {
                videoitem: item,
                video: item.settings.videoElement
            };
            this.currentVideo = item.settings.videoElement;
            this.$vidContainer.append(this.currentVideo);
            if (this.indices[0] !== id) {
                console.log("NOT FIRST"  + id);
                console.log(this.indices[0], this.indices);
                $(this.currentVideo).hide();
            }
            this.currentVideo.addEventListener("canplayall", function() {
                self.currentVideo.currentTime = item.settings.start;
            }, false);
            this.currentVideo.addEventListener("timeupdate", function() {
                var id = Utils.splitId($(self.currentVideo));
                var now = $("#" + self.settings.prefix + id);
                var itemNew = now.data("item");
                if (self.currentVideo.currentTime === itemNew.settings.end) {
                    self.currentVideo.pause();
                    $(self.currentVideo).hide();
                    self.positionVideo += 1;
                    console.log(itemNew.settings.start);
                    self.currentVideo.currentTime = itemNew.settings.start;
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
            var current = this.videoObjects[this.indices[id]];
            this.currentVideo = current.video;
            $(this.currentVideo).show();
            if (this.currentVideo.paused) {
                this.currentVideo.play();
            }
            else {
                this.currentVideo.pause();
            }
        },
        stop: function () {
            this.positionVideo = 0;
            if (this.currentVideo.paused) {
                this.currentVideo.currentTime = 0;
            }
            else {
                this.currentVideo.pause();
                this.currentVideo.currentTime = 0;
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