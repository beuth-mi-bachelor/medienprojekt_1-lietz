/**
 * (C)opyright Michael Duve, Felix Maulwurf, Angelina Staeck
 *
 * @module: VideoExporter
 * @requires: jQuery
 *
 * module is for receiving detailed information about a videoItem
 */

define(["jquery", "utilities", "filesaver"], (function ($, Utils, FileSaver) {
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
            exportBindings: {
                bar: '#progressbar',
                value: '.progress-value',
                text: ".export-text",
                status: ".export-status",
                progress: ".export-progress",
                link: ".export-link",
                button: ".export",
                overlay: ".export-overlay"
            },
            close: ".close"
        };

        // if settings where not set by initializing, fill with default settings
        $.extend(this.settings, settings || {});

        this.isBusy = false;
        this.isReady = false;

        this.initialize();
    }

    VideoExporter.prototype = {
        initialize: function () {
            var self = this;
            this.$export =  {
                bar: $(self.settings.exportBindings.bar),
                value: $(self.settings.exportBindings.value),
                text: $(self.settings.exportBindings.text),
                status: $(self.settings.exportBindings.status),
                progress: $(self.settings.exportBindings.progress),
                link: $(self.settings.exportBindings.link),
                button: $(self.settings.exportBindings.button),
                overlay: $(self.settings.exportBindings.overlay)
            };
            this.$close =  $(self.settings.close);
            this.setUpWorker();
            this.initMessageHandler();
            this.bindEvents();
        },
        setUpWorker: function() {
            this.worker = new Worker("./js/lib/webworker.js");
        },
        bindEvents: function() {
            var self = this;
            this.$export.link.on("click", function(e) {
                e.preventDefault();
                self.saveFile();
                return false;
            });
            this.$export.button.on("click", function() {
                self.prepareToExport();
            });
            this.$close.on("click", function() {
                self.cancelExporting();
            });
        },
        saveFile: function() {
            saveAs(this.blobData, "output");
        },
        initMessageHandler: function() {
            var self = this;
            this.worker.onmessage = function (event) {
                var message = event.data;
                if (message.type === "ready") {
                    self.isReady = true;
                }
                if (message.type === "start") {
                    self.isBusy = true;
                    self.$export.overlay.fadeIn();
                    self.$export.status.text("starting export");
                    self.$export.link.html("");
                    self.$export.progress.text("");

                } else if (message.type === "stdout") {
                    self.handleMessages(message.data);
                } else if (message.type === "done") {
                    self.isBusy = false;
                    self.$export.status.text("export done\n");
                    self.$export.link.html(self.createURL(message.data[0]));
                    self.$export.bar.val(100);
                    self.$export.value.text("100 %");
                }
            };
        },
        cancelExporting: function() {
            this.isBusy = false;
            this.ready = false;
            this.worker.terminate();
            this.worker = undefined;
            this.$export.overlay.fadeOut();
            this.setUpWorker();
            this.initMessageHandler();
        },
        createURL: function(item) {
            var fileArray = new Uint8Array(item.data);
            var blob = new Blob([fileArray], {type: "video/mp4"});
            this.blobData = blob;
            var url = window.URL.createObjectURL(blob);
            return $("<a href='"+url+"'>Download "+item.name+"</a>");
        },
        handleMessages: function(message) {
            var conversionInfo = /size=(\s)*(\d)*(\w*) time=(\d|\:|\.)*/g;

            if (conversionInfo.test(message)) {
                var info = message.match(conversionInfo)[0];
                var size = info.match(/(\d)*(\w)* /g);
                size = size[size.length-1];
                var time = info.match(/(\d)*:(\d)*:(\d)*\.(\d)*/g);
                time = time[0];
                this.$export.progress.text("handled " + size + " and encoded " + time + " hours");
                this.showProgress(time);
            } else if (message === "Press [q] to stop, [?] for help") {
                this.$export.status.text("encoding\n");
            }
        },
        showProgress: function(time) {
            var splitted = time.split(":");

            var secsAndMillis = splitted[splitted.length-1];
            var mins = splitted[splitted.length-2];
            var hours = splitted[splitted.length-3];
            var seconds = parseFloat(secsAndMillis) + (parseInt(mins, 10) * 60) + (parseInt(hours, 10) * 3600);
            var percentage = parseFloat((seconds / this.lengthOfVideos) * 100).toFixed(2);

            if (percentage > 100.0) {
                percentage = 100.00;
            }
            this.$export.bar.val(percentage);
            this.$export.value.text(percentage + "%");
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
            this.lengthOfVideos = 0;
            this.listToExport.forEach(function(videoItem) {
                self.files.push({
                    data: videoItem.settings.data,
                    name: videoItem.settings.name + "." + videoItem.settings.type.split("video/")[1]
                });
                self.timings.push({
                    start: Math.floor(videoItem.settings.start * (videoItem.settings.fps)),
                    end: Math.floor(videoItem.settings.end * (videoItem.settings.fps))
                });
                self.lengthOfVideos += (videoItem.settings.end - videoItem.settings.start);
            });
            this.args = this.generateArguments();

            console.log(this.args);
            this.startExporting();
        },
        generateArguments: function() {
            var fileString = "";
            this.files.forEach(function(item) {
                fileString += "-i " + item.name + " ";
            });

            fileString += "-v debug -strict -2 -r 24 ";
            fileString += this.buildComplexFilter();
            fileString += "output.mp4";

            return fileString;
        },
        buildComplexFilter: function() {
            var self = this;
            var filter = '-filter_complex "';
            for (var i = 0; i < this.timings.length; i++) {
                filter += "[" + i + ":v]trim="+self.timings[i].start+":"+self.timings[i].end+",setpts=PTS-STARTPTS[v"+i+"];" +  "[" + i + ":a]atrim="+self.timings[i].start+":"+self.timings[i].end+",asetpts=PTS-STARTPTS[a"+i+"]; ";
            }
            for (var j = 0; j < this.timings.length; j++) {
                filter += "[v" + j + "]" + "[a" + j + "]";
            }
            filter += ' concat=n='+this.timings.length+':v=1:a=1 [out]" -map "[out]" ';
            return filter;
        },
        startExporting: function() {
            var self = this;
            this.worker.postMessage({
                type: 'command',
                arguments: Utils.parseArguments(self.args),
                files: self.files,
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

    
