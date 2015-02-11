/**
 * (C)opyright Michael Duve, Felix Maulwurf, Angelina Staeck
 *
 * @module: VideoExporter
 * @requires: jQuery
 *
 * module is for receiving detailed information about a videoItem
 */

define(["jquery", "utilities"], (function ($, Utils) {
    "use strict";

    /**
     * initializes a new singleton instance
     * @param settings {Object} a JSON-Object which holds all informations for the VideoExporter
     * @constructor
     */
    function VideoExporter(settings) {

        if (VideoExporter.prototype.instance !== undefined) {
            return VideoExporter.prototype.instance;
        }

        VideoExporter.prototype.instance = this;

        this.settings = {
            timeLineInstance: null,
            exportButton: ".export",
            callback: function(item) {
                console.log(item);
            }
        };

        // if settings where not set by initializing, fill with default settings
        $.extend(this.settings, settings || {});

        this.isBusy = false;
        this.isReady = false;

        this.initialize();
    }

    VideoExporter.prototype = {
        initialize: function () {
            this.$exportButton = $(this.settings.exportButton);

            this.worker = new Worker("../../videochop/js/lib/webworker.js");
            this.initMessageHandler();
            this.bindEvents();
        },
        bindEvents: function() {
            var self = this;
            this.$exportButton.on("click", function() {
                self.prepareToExport();
            });
        },
        initMessageHandler: function() {
            var self = this;
            this.worker.onmessage = function (event) {
                var message = event.data;
                if (message.type === "ready") {
                    self.isReady = true;
                    self.worker.postMessage({
                        type: 'command',
                        arguments: Utils.parseArguments("-help"),
                        files: [],
                        TOTAL_MEMORY: "ALLOW_MEMORY_GROWTH"
                    });
                }
                if (message.type === "start") {
                    self.isBusy = true;
                } else if (message.type === "stdout") {

                } else if (message.type === "done") {
                    self.isBusy = false;
                }
            };
        },
        prepareToExport: function() {
            this.getFilesToExport();
        },
        getFilesToExport: function() {
            var self = this;
            var list = this.settings.timeLineInstance.getCurrentList();
            this.listToExport = [];
            list.forEach( function(currentItem) {
                self.listToExport.push(self.settings.timeLineInstance.getDataForItemId(currentItem));
            });
            this.generateExportList();
        },
        generateExportList: function() {
            var self = this;
            this.files = [];
            this.timings = [];
            this.listToExport.forEach(function(videoItem) {
                self.files.push({
                    data: videoItem.settings.data,
                    name: videoItem.settings.name + "." + videoItem.settings.type.split("video/")[1]
                });
                self.timings.push({
                    start: Math.floor(videoItem.settings.start * (videoItem.settings.fps)),
                    end: Math.floor(videoItem.settings.end * (videoItem.settings.fps))
                });
            });
            this.generateArguments();
        },
        generateArguments: function() {
            var fileString = "";
            this.files.forEach(function(item) {
                fileString += "-i " + item.name + " ";
            });
            
            return "";
        },
        startExporting: function() {
            var self = this;
            this.worker.postMessage({
                type: 'command',
                arguments: Utils.parseArguments(self.arguments),
                files: [self.files],
                TOTAL_MEMORY: "ALLOW_MEMORY_GROWTH"
            });
        },
        /**
         * describes this Object to the user
         * @returns {String} representation of this Object
         */
        toString: function () {
            return "VideoExporter=[]";
        }
    };

    return VideoExporter;

}));

    
