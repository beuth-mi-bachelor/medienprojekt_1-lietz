/**
 * (C)opyright Michael Duve, Felix Maulwurf, Angelina Staeck
 *
 * @module: VideoList
 * @requires: jQuery
 * @requires: videoItem
 *
 * VideoList can save VideoItems in it. It provides the possibility to delete videos out of the list.
 */

define(["jquery", "videoItem", "jqueryui"], (function ($, VideoItem, ui) {
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
            this.bindEvents();
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
        bindEvents: function(){
            var self = this;

            this.$list.on("click", ".file-delete", function () {
                var $this = $(this).parent();
                var id = $this.attr("id");
                var splittedarray = id.split("-");
                id = splittedarray[splittedarray.length-1];
                id = parseInt(id,10);
                self.deleteItem(id);
            });

            this.$list.sortable({
                placeholder: "ui-state-highlight",
                axis: "y"
            });

            this.$list.find("li").draggable({
                revert: true,
                scroll: false,
                connectToSortable: ".timeline",
                helper: "clone"
            });

            this.$list.disableSelection();
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

    
