/**
 * (C)opyright Michael Duve, Felix Maulwurf, Angelina Staeck
 *
 * @module: PreviewVideo
 * @requires: jQuery
 * @requires: videoItemLoader
 * TODO: add more dependencies here
 *
 * this module shows a video and controls it
 */

define(["jquery", "videoItemLoader"], (function ($, VideoItemLoader) {
    "use strict";

    /**
     * initializes a new instance
     * @param settings {Object} a JSON-Object which holds all informations for the module
     * @constructor
     */
    function PreviewVideo(settings) {
        this.settings = {
            videoItems: [],
            vidContainer: ".default"
    };

        // if settings where not set by initializing, fill with default settings
        $.extend(this.settings, settings || {});
        //this.$vidContainer = $(this.settings.vidContainer);
        this.initialize();
    }

    PreviewVideo.prototype = {
        initialize: function () {

        },

        showPreview: function (videoItemLoader) {
            if(videoItemLoader instanceof VideoItemLoader){
                var url = window.URL.createObjectURL(new Blob(
                    [videoItemLoader.video.data], {
                        type: videoItemLoader.video.type
                    }
                ));
                var src = document.createElement("source");
                src.src = url;
                src.type = videoItemLoader.video.type;
                var $vidwrapper = $(this.settings.vidContainer);
                $vidwrapper.html(src);
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