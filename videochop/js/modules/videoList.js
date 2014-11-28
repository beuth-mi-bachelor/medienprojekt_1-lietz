/**
 * (C)opyright Michael Duve, Felix Maulwurf, Angelina Staeck
 *
 * @module: VideoList
 * @requires: jQuery
 * TODO: add more dependencies here
 *
 * VideoList can save VideoItems in it. It provides the possibility to delete videos out of the list.
 */

define(["jquery", "modules/videoItem"], (function ($, VideoItem) {
    "use strict";

    /**
     * initializes a new instance
     * @param settings {Object} a JSON-Object which holds all informations for the module
     * @constructor
     */
    function VideoList(settings) {
        this.settings = {
            container: ".default",
            listname: "files",
            items:[]
        };

        // if settings where not set by initializing, fill with default settings
        $.extend(this.settings, settings || {});
        this.$container = $(this.settings.container);
        this.videolist = {};
        this.initialize();
    }

    VideoList.prototype = {
        initialize: function () {
            this.$container.append("<ul class='" + this.settings.listname + "'/>");
            this.$list = $("." + this.settings.listname);
            this.addItem(this.settings.items);
        },

        addItem: function(listOfItems) {
            if(!Array.isArray(listOfItems)){
                listOfItems = [listOfItems];
            }
            var self = this;
            $.each(listOfItems, function(key,videoItem) {
                if(videoItem instanceof VideoItem){
                    self.$list.append(videoItem.getMarkUp());
                    self.videolist[videoItem.id] = videoItem;
                }
            });
        },

        deleteItem: function(itemToBeRemoved) {
            this.videolist[itemToBeRemoved].deleteItem();
            delete this.videolist[itemToBeRemoved];
        },
        /**
         * describes this Object to the user
         * @returns {String} representation of this Object
         */
        toString: function () {
            return "VideoList=[]";
        }
    };

    return VideoList;

}));

    
