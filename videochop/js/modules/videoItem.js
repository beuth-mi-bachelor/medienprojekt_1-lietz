/**
 * (C)opyright Michael Duve, Felix Maulwurf, Angelina Staeck
 *
 * @module: VideoItem
 * @requires: jQuery
 * TODO: add more dependencies here
 *
 * TODO: add description here
 */

define(["jquery"], (function ($) {
    "use strict";

    /**
     * initializes a new instance
     * @param settings {Object} a JSON-Object which holds all informations for the module
     * @constructor
     */
    function VideoItem(settings) {
        this.settings = {
            //src: "../module_video_item/img/big_buck_bunny",
            video: null,
            name: "TEST",
            length: 100,
            size: 5000,
            //format: ["mp4", "webM", "ogg"],
            //codec: "FFmpeg",
            resolution: {
                width: 3840,
                height: 2160
            },
            thumbnail: null
        };

        // if settings where not set by initializing, fill with default settings
        $.extend(this.settings, settings || {});

        this.initialize();
    }

    VideoItem.prototype = {
        initialize: function () {

        },

        getMarkUp: function () {
            return '<li class="file">' +
                '<div class="file-delete icon_close"></div>' +
                '<img class="file-thumb" src="'+this.settings.thumbnail+'" alt="'+this.settings.name+'" />' +
                '<div class="file-info">' +
                '<p>Name: <span class="file-name">'+this.settings.name+'</span></p>' +
                '<p>Duration: <span class="file-duration">'+this.timeFormat()+'</span></p>' +
                '<p>Size: <span class="file-size">'+this.sizeFormat()+'</span></p>' +
                '</div></li>';
        },

        timeFormat: function () {
            var sek = Math.abs(this.settings.length); //TODO
            return this.fuehrendeNull((sek/60/60)%24) + ":" +
                this.fuehrendeNull((sek/60)%60) + ":" + this.fuehrendeNull(sek%60);
        },

        fuehrendeNull: function(wert) {
            if (wert<10) {
                return "0" + parseInt(wert);
            }
            else {
                return parseInt(wert);
            }
        },

        sizeFormat: function () {
            return this.settings.size;
        },

        deleteItem: function () {
             this.settings = null;
             delete this.settings; //TODO
        },


        /**
         * describes this Object to the user
         * @returns {String} representation of this Object
         */
        toString: function () {
            return "VideoItem=[" + this.settings.name + "," + this.settings.length + ","+ this.settings.size + "]";
        }
    };

    return VideoItem;

}));


