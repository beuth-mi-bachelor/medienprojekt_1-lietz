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
            this.eventHandler = new EventHandler();
            this.bindEvents();
        },

        bindEvents: function() {
            var self = this;
            this.eventHandler.subscribe("preview-order", function(order) {
                console.error("there", order);
                self.updateIndices(order);
            });
            this.eventHandler.subscribe("preview-item", function($item) {
                console.error("here", $item);
                self.addVideo($item);
            });
        },

        updateIndices: function (indices) {
            this.indices = indices;
        },

        addVideo: function ($element) {

            var id = $element.data("id");
            var item = $element.data("item");
            this.videoObjects[id] = {
                videoitem: item,
                video: item.settings.videoElement
            };
            var currentVideo = item.settings.videoElement;
            this.$vidContainer.append(currentVideo);

        },

        removeVideo: function () {


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