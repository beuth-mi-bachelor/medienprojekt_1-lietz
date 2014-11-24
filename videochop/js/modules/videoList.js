/**
 * (C)opyright Michael Duve, Felix Maulwurf, Angelina Staeck
 *
 * @module: videoList //TODO: change name
 * @requires: jQuery
 * TODO: add more dependencies here
 *
 * TODO: add description here
 */

define(["jquery", "VideoItem"], (function ($, VideoItem) {
    "use strict";

    /**
     * initializes a new instance
     * @param settings {Object} a JSON-Object which holds all informations for the module
     * @constructor
     */
    function VideoList(settings) {
        this.settings = {
            itemList: [],
            videoItem: new VideoItem({})
        };

        // if settings where not set by initializing, fill with default settings
        $.extend(this.settings, settings || {});

        this.initialize();
    }

    VideoList.prototype = {
        initialize: function () {

        },
        /**
         * describes this Object to the user
         * @returns {String} representation of this Object
         */

        listVideoItems: function () {
            var list = [];
            for (var i = 0; i < this.itemList.length; i++) {
                list += this.itemList[i].getMarkUp() + "<br>";
            }
            return list;
        },


        toString: function () {
            return "VideoList=[" + this.settings.itemList + "]";
        }
    };

    return VideoList;

}));