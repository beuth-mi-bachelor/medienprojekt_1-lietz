/**
 * (C)opyright Michael Duve, Felix Maulwurf, Angelina Staeck
 *
 * @module: VideoInformationRetriever
 * @requires: jQuery
 * @requires: Utilities
 *
 * module is for receiving detailed information about a videoItem
 */

define(["jquery", "utilities"], (function ($, Utils) {
    "use strict";

    /**
     * initializes a new singleton instance
     * @param settings {Object} a JSON-Object which holds all informations for the VideoInformationRetriever
     * @constructor
     */
    function VideoInformationRetriever(settings) {

        if (VideoInformationRetriever.prototype.instance !== undefined) {
            return VideoInformationRetriever.prototype.instance;
        }

        VideoInformationRetriever.prototype.instance = this;

        this.settings = {
            defaultFPS: 24,
            callback: function (item) {
                console.log(item);
            }
        };

        // if settings where not set by initializing, fill with default settings
        $.extend(this.settings, settings || {});

        this.queue = [];

        this.isBusy = false;
        this.isReady = false;

        this.initialize();
    }

    VideoInformationRetriever.prototype = {
        initialize: function () {
            this.worker = new Worker("./js/lib/webworker.js");
            this.initMessageHandler();
        },
        initMessageHandler: function () {
            var self = this;
            var fps = self.settings.defaultFPS;
            this.worker.onmessage = function (event) {
                var message = event.data;
                if (message.type === "ready") {
                    self.isReady = true;
                    if (self.checkForNext()) {
                        self.getNextItem();
                    } else {
                        self.worker.postMessage({
                            type: 'command',
                            arguments: Utils.parseArguments("-help"),
                            files: [],
                            TOTAL_MEMORY: "ALLOW_MEMORY_GROWTH"
                        });
                    }
                }
                if (message.type === "start") {
                    self.isBusy = true;
                } else if (message.type === "stdout") {
                    var reg = /[0-9]{1,2}(\.)?[0-9]*(\s)fps/;
                    var m = reg.exec(message.data);
                    if (m) {
                        var newFPS = parseFloat(m[0].split(" fps")[0]);
                        if (typeof newFPS === "number") {
                            fps = newFPS;
                        }
                    }
                } else if (message.type === "done") {
                    if (self.currentItem) {
                        self.currentItem.settings.fps = fps;
                        self.settings.callback(self.currentItem);
                    }
                    self.isBusy = false;
                    fps = self.settings.defaultFPS;
                    if (self.checkForNext()) {
                        self.getNextItem();
                    }
                }
            };
        },
        checkForNext: function () {
            return this.queue.length !== 0;
        },
        getNextItem: function () {
            if (this.queue.length > 0) {
                this.currentItem = this.queue.shift();
                this.startWorkingOnCurrentItem();
            }
        },
        startWorkingOnCurrentItem: function () {
            var file = {
                data: this.currentItem.settings.data,
                name: this.currentItem.settings.name + "." + this.currentItem.settings.type.split("video/")[1]
            };

            this.worker.postMessage({
                type: 'command',
                arguments: Utils.parseArguments("-i " + file.name),
                files: [file],
                TOTAL_MEMORY: "ALLOW_MEMORY_GROWTH"
            });

        },
        addVideoItemToQueue: function (item) {
            this.queue.push(item);
            if (!this.isBusy && this.isReady) {
                this.getNextItem();
            }
        },
        /**
         * describes this Object to the user
         * @returns {String} representation of this Object
         */
        toString: function () {
            return "VideoInformationRetriever=[]";
        }
    };

    return VideoInformationRetriever;

}));

    
