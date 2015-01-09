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
            videoItems: [],
            singleItem: null,
            vidContainer: ".default"
    };

        // if settings where not set by initializing, fill with default settings
        $.extend(this.settings, settings || {});
        this.initialize();
    }

    PreviewVideo.prototype = {
        initialize: function () {

        },

        showPreview: function (item) {

            if(item instanceof VideoItem){

                this.singleItem = item;

                var $video = $(this.settings.vidContainer).find("Video");

                $video.empty();

                var src = document.createElement("source");
                src.src = this.singleItem.settings.video;
                src.type = this.singleItem.settings.type;
                $video[0].appendChild(src);
                $video.load();
            }
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