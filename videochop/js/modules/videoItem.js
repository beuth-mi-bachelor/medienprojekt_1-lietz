/**
 * (C)opyright Michael Duve, Felix Maulwurf, Angelina Staeck
 *
 * @module: VideoItem
 * @requires: jQuery
 *
 * This module describes the properties of an video item.
 * video: adress of the video file, name: name of the video, length: duration of the video,
 * start: starttime of the video, end: endtime of the video,
 * size: volume of the video, resolution: width and height pixel, thumbnail: picture from the video
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
            video: null,
            name: "TEST",
            length: 100,
            start: 0,
            end: 100,
            size: 5500,
            resolution: {
                width: 3840,
                height: 2160
            },
            thumbnail: null,
            prettySize: "0 MB"
        };

        // if settings where not set by initializing, fill with default settings
        $.extend(this.settings, settings || {});

        this.initialize();
    }

    VideoItem.prototype = {
        initialize: function () {
            VideoItem.indices = (VideoItem.indices || 0) + 1;
            this.id = VideoItem.indices;
        },

        getMarkUp: function () {
            return '<li class="file" id="video-item-' + this.id + '">' +
                '<div class="file-delete icon_close"></div>' +
                '<img class="file-thumb" src="'+this.settings.thumbnail+'" alt="'+this.settings.name+'" />' +
                '<div class="file-info">' +
                '<p><span class="file-name">'+this.settings.name+'</span></p>' +
                '<p><span class="file-duration">'+this.timeFormat()+' min</span></p>' +
                '<p class="small"><span class="file-resolution">'+this.settings.resolution.width + " x " + this.settings.resolution.height +' px</span><span class="file-size">'+this.settings.prettySize+'</span></p>' +
                '</div></li>';
        },

        timeFormat: function () {
            var millis = Math.abs(this.settings.length);
            var secs = this.fillZeros(millis%60);
            var mins = this.fillZeros(secs%60);
            return  mins + ":" + secs;
        },

        fillZeros: function(value) {
            if (value<10) {
                return "0" + parseInt(value, 10);
            }
            else {
                return parseInt(value, 10);
            }
        },
        deleteItem: function () {
            $("#video-item-" + this.id).remove();
             this.settings = null;
             delete this.settings;
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


