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

define(["jquery", "videoList", "videoItem", "eventHandler"], (function ($, VideoList, VideoItem, EventHandler) {
    "use strict";

    /**
     * initializes a new instance
     * @param settings {Object} a JSON-Object which holds all informations for the module
     * @constructor
     */
    function PreviewVideo(settings) {
        this.settings = {
            vidContainer: ".default"
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
            this.eventHandler.subscribe("preview-item", function($item) {
                self.addVideo($item);
            });
            $(this.settings.playButton).on("click", function() {
                self.play();
            });
            $(this.settings.pauseButton).on("click", function() {
                self.pause();
            });
        },

        updateIndices: function (indices) {
            this.indices = indices;
        },

        addVideo: function ($element) {

            var self = this;
            var id = "timeline-item-" + $element.data("id");
            var item = $element.data("item");
            this.videoObjects[id] = {
                videoitem: item,
                video: item.settings.videoElement
            };
            var currentVideo = item.settings.videoElement;
            this.$vidContainer.append(currentVideo);
            currentVideo.addEventListener("canplayall", function() {
                currentVideo.currentTime = item.settings.start;
            }, false);
            currentVideo.addEventListener("timeupdate", function() {
                console.log(currentVideo.currentTime);
                if (currentVideo.currentTime === item.settings.end) {
                    currentVideo.pause();
                    self.positionVideo += 1;
                    self.play();
                }
            }, false);

        },

        play: function () {
            this.currentVideo = this.videoObjects[this.indices[this.positionVideo]].video;
            this.currentVideo.play();
        },

        pause: function () {
            this.currentVideo.pause();
        },


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