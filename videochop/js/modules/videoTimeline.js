/**
 * (C)opyright Michael Duve, Felix Maulwurf, Angelina Staeck
 *
 * @module: VideoTimeline
 * @requires: jQuery
 * @requires: jQueryUI
 * @requires: VideoItem
 * @requires: Utilities
 * @requires: EventHandler
 *
 * manages the arrangement of items and the length of each of it
 */

define(["jquery", "jqueryui", "videoItem", "utilities", "eventHandler"], (function ($, ui, VideoItem, Utils, EventHandler) {
    "use strict";

    /**
     * initializes a new instance
     * @param settings {Object} a JSON-Object which holds all informations for the module
     * @constructor
     */
    function VideoTimeline(settings) {
        this.settings = {
            minWidth: 200,
            scaleFactor: 5,
            container: ".default",
            videoList: null
        };

        // if settings where not set by initializing, fill with default settings
        $.extend(this.settings, settings || {});

        this.$container = $(this.settings.container);
        this.direction = 0;
        this.id = 0;
        this.order = [];
        this.initialize();
    }

    VideoTimeline.prototype = {
        initialize: function () {

            this.bindEvents();

            this.eventHandler = new EventHandler();

            var self = this;
            this.$container.sortable({
                revert: 10,
                opacity: 0.3,
                axis: "x",
                placeholder: "placeholder",
                receive: function (e, ui) {
                    ui.sender.data('copied', true);
                    var $item = $(ui.item);
                    var id = Utils.splitId($item);
                    self.id++;
                    $item.attr("id", "timeline-item-" + self.id);
                    $item.data("id", id);
                    self.initResizable(self.settings.videoList, $item);
                    self.order = $(this).sortable('toArray');
                    self.eventHandler.publish("preview-item", [$item, self.order, self.id]);
                },
                update: function () {
                    self.order = $(this).sortable('toArray');
                    self.eventHandler.publish("preview-order", [self.order]);
                }
            });

            this.$container.disableSelection();
            this.$container.find("li").disableSelection();

        },
        bindEvents: function() {
            var self = this;
            self.$container.on("mousedown", ".ui-resizable-handle", function() {
                var $this = $(this);
                if ($this.hasClass("ui-resizable-e")) {
                    self.direction = 1;
                } else if ($this.hasClass("ui-resizable-w")) {
                    self.direction = -1;
                }
            });
        },
        initResizable: function (videoList, $item) {
            var self = this;

            var id = parseInt($item.data("id"), 10);

            var currentVideoItem = videoList.getItem(id);

            var maxWidth = self.settings.minWidth + parseInt(currentVideoItem.settings.end * self.settings.scaleFactor, 10);

            $item.attr("data-start", Utils.timeFormat(currentVideoItem.settings.start));
            $item.attr("data-end", Utils.timeFormat(currentVideoItem.settings.end));

            $item.resizable({
                minWidth: self.settings.minWidth,
                maxWidth: maxWidth,
                handles: "e, w",
                addClasses: false,
                create: function (event) {
                    var $elem = $(event.target);
                    var $parent = $elem.parent();

                    var imgPath = $elem.find("img").attr("src");

                    $elem.css({
                        "width": maxWidth + "px",
                        "background-image": ("url(" + imgPath + ")")
                    });

                    var widthBefore = $parent.width();
                    $parent.width(widthBefore + maxWidth);

                    var id = parseInt($elem.data("id"), 10);
                    var currentVideoItem = videoList.getItem(id);
                    $(this).data('item', currentVideoItem);
                    $(this).data('max', maxWidth);
                    $(this).data('min', self.settings.minWidth);
                },
                start: function (event, ui) {
                    $(this).data("before", ui.originalSize.width);
                },
                resize: function (event, ui) {

                    event.target.style.left = 0;

                    var difference = (ui.size.width - ui.originalSize.width) / self.settings.scaleFactor;
                    var $elem = $(ui.element);

                    if (self.direction > 0) {
                        var newEnd = currentVideoItem.settings.end + difference;
                        if (newEnd > currentVideoItem.settings.length) {
                            newEnd = currentVideoItem.settings.length;
                            $(this).resizable("option", "maxWidth", ((newEnd - currentVideoItem.settings.start) * self.settings.scaleFactor) + self.settings.minWidth);
                        }
                        $elem.attr("data-end", Utils.timeFormat(newEnd));
                    } else if (self.direction < 0) {
                        var newStart = currentVideoItem.settings.start - difference;
                        if (newStart < 0) {
                            newStart = 0;
                            $(this).resizable("option", "maxWidth", ((newStart + currentVideoItem.settings.end) * self.settings.scaleFactor) + self.settings.minWidth);
                        }
                        $elem.attr("data-start", Utils.timeFormat(newStart));
                    }
                },
                stop: function (event, ui) {
                    event.target.style.left = 0;

                    $(this).resizable("option", "maxWidth", $(this).data('max'));

                    var currentVideoItem = $(this).data('item'),
                        start = $(this).data('before'),
                        end = ui.size.width,
                        difference = (end - start) / self.settings.scaleFactor;
                    if (self.direction > 0) {
                        currentVideoItem.settings.end += difference;
                    } else if (self.direction < 0) {
                        currentVideoItem.settings.start -= difference;
                    }
                    self.direction = 0;

                    self.eventHandler.publish("preview-size-update", [$(this).data("id"), currentVideoItem.settings.start, currentVideoItem.settings.end]);

                }
            });
        },
        getDataForItemId: function(item) {
            var $item = $("#"+item);
            return $item.data("item");
        },
        getCurrentList: function() {
            return this.$container.sortable("toArray");
        },
        /**
         * describes this Object to the user
         * @returns {String} representation of this Object
         */
        toString: function () {
            return "VideoTimeline=[]";
        }
    };

    return VideoTimeline;

}));

    
