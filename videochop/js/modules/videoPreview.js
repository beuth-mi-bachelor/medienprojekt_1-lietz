/**
 * (C)opyright Michael Duve, Felix Maulwurf, Angelina Staeck
 *
 * @module: PreviewVideo
 * @requires: jQuery
 * @requires: videoList
 * @requires: videoItem
 *
 * TODO: add more dependencies here
 *
 * this module shows a video and controls it
 */

define(["jquery", "videoList", "videoItem", "eventHandler", "utilities"], (function ($, VideoList, VideoItem, EventHandler, Utils) {
    "use strict";

    /**
     * initializes a new instance
     * @param settings {Object} a JSON-Object which holds all informations for the module
     * @constructor
     */
    function PreviewVideo(settings) {
        this.settings = {
            vidContainer: ".default",
            prefix: "timeline-item-",
            time: {
                current: ".video-current",
                length: ".video-length"
            },
            playButton: ".play",
            pauseButton: ".pause",
            stopButton: ".stop",
            fullscreenButton: ".fullscreen",
            slider: ".range-slider"
        };

        // if settings where not set by initializing, fill with default settings
        $.extend(this.settings, settings || {});
        this.initialize();
    }

    PreviewVideo.prototype = {
        initialize: function () {
            this.$vidContainer = $(this.settings.vidContainer);
            this.videoObjects = {};
            this.indices = [];
            this.positionVideo = 0;
            this.lengthOfVideos = 0;
            this.eventHandler = new EventHandler();
            this.$time = {
                current: $(this.settings.time.current),
                length: $(this.settings.time.length)
            };
            this.$slider = $(this.settings.slider);
            this.currentTimePosition = 0;
            this.globalTime = 0;
            this.isPlayingAlone = false;
            this.bindEvents();
        },
        bindEvents: function() {
            var self = this;
            this.eventHandler.subscribe("preview-order", function(order) {
                self.updateIndices(order);
            });
            this.eventHandler.subscribe("preview-item", function($item, order, id) {
                self.updateIndices(order);
                self.addVideo($item, id);
                self.calculateLength();
                self.$slider.attr("max", (parseInt(self.lengthOfVideos, 10) * 10));
            });
            this.eventHandler.subscribe("preview-size-update", function(itemId, start, end) {
                var current = self.videoObjects[self.settings.prefix + itemId];
                current.videoitem.start = start;
                current.video.currentTime = start;
                current.videoitem.end = end;
                current.itemLength = end - start;
                self.calculateLength();
                self.$slider.attr("max", (parseInt(self.lengthOfVideos, 10) * 10));
            });
            $(this.settings.playButton).on("click", function() {
                self.play(self.loopThrough());
                self.isPlayingAlone = true;
            });
            $(this.settings.pauseButton).on("click", function() {
                self.pause();
            });
            $(this.settings.fullscreenButton).on("click", function() {
                self.enterFullscreen();
            });
            $(this.settings.stopButton).on("click", function() {
                self.stop();
            });
            this.$slider.on("input", function() {
                self.updateToVideo(this.value);
                self.isPlayingAlone = false;
            });
        },
        updateIndices: function (indices) {
            this.indices = indices;
        },
        enterFullscreen: function() {

        },
        exitFullscreen: function() {

        },
        addVideo: function ($element, vidItemId) {

            var self = this;

            var id = self.settings.prefix + vidItemId;

            var item = $element.data("item");
            var $videoElem = $(item.settings.videoElement).clone().attr("id", "").data("vidItemId", vidItemId).data("id", id);

            this.videoObjects[id] = {
                videoitem: item,
                video: $videoElem[0],
                vidItemId: vidItemId,
                id: id,
                itemLength: item.settings.end - item.settings.start
            };

            if (this.indices.length === 1) {
                this.currentVideo = $videoElem[0];
                $(this.currentVideo).addClass("current");
            }

            this.$vidContainer.append($videoElem);

            $videoElem[0].addEventListener("canplayall", function() {
                self.currentVideo.currentTime = item.settings.start;
            }, false);

            $videoElem[0].addEventListener("timeupdate", function() {

                var id = $(this).data("id");

                var vidObj = self.videoObjects[id].videoitem;
                var vidVideo = self.videoObjects[id].video;

                self.updateTime((this.currentTime - vidObj.settings.start));
                if (!this.paused) {
                    self.$slider.val((self.globalTime + this.currentTime) * 10);
                }
                if (vidVideo.currentTime >= vidObj.settings.end) {
                    if (!this.paused || self.isPlayingAlone) {
                        self.globalTime += (vidObj.settings.end - vidObj.settings.start);
                        self.currentTimePosition = self.globalTime;
                        $(vidVideo).removeClass("current");
                        vidVideo.pause();
                        self.positionVideo += 1;
                        vidVideo.currentTime = vidObj.settings.start;
                        self.play(self.loopThrough());
                    }
                }
            }, false);
        },
        loopThrough: function() {
            var next = this.positionVideo % this.indices.length;
            if (next === 0) {
                this.globalTime = 0;
            }
            return next;
        },
        pause: function() {
            if (this.currentVideo) {
                this.currentVideo.pause();
            }
        },
        updateToVideo: function(time) {
            if (!this.currentVideo.paused) {
                this.stop();
            }
            var i = 0;
            var newTime = 0;
            var currentLength = 0;

            while (newTime < time) {
                var current = this.videoObjects[this.indices[i]];
                currentLength = current.itemLength * 10;
                newTime += currentLength;
                i++;
            }

            var vidId = i - 1;
            if (vidId < 0) {
                vidId = 0;
            }

            this.globalTime = (newTime - currentLength) / 10;
            this.currentTimePosition = (time - (newTime - currentLength)) / 10;
            this.positionVideo = vidId;
            if (this.currentVideo !== this.videoObjects[this.indices[vidId]].video) {
                $(this.currentVideo).removeClass("current");
                this.currentVideo = this.videoObjects[this.indices[vidId]].video;
                $(this.currentVideo).addClass("current");
            }
            this.currentVideo.currentTime = this.currentTimePosition;
        },
        updateTime: function(time) {
            this.currentTimePosition = (time + this.globalTime);
            var timeFormatted = Utils.timeFormat(this.currentTimePosition).split(".")[0];
            this.$time.current.text(timeFormatted);
        },
        play: function (id) {
            if (this.currentVideo) {
                this.isPlayingAlone = true;
                var current = this.videoObjects[this.indices[id]];
                this.currentVideo = current.video;
                $(this.currentVideo).addClass("current");
                if (this.currentVideo.paused) {
                    this.currentVideo.play();
                }
                else {
                    this.currentVideo.pause();
                }
            }
        },
        calculateLength: function() {
            this.lengthOfVideos = 0;
            for (var item in this.videoObjects) {
                var currentObj = this.videoObjects[item];
                this.lengthOfVideos += (currentObj.videoitem.settings.end - currentObj.videoitem.settings.start);
            }
            var time = Utils.timeFormat(this.lengthOfVideos).split(".")[0];
            this.$time.length.text(time);
        },
        stop: function () {
            if (this.currentVideo) {
                this.positionVideo = 0;
                this.$vidContainer.find("video").removeClass("current");
                $(this.videoObjects[this.indices[this.positionVideo]].video).addClass("current");
                if (!this.currentVideo.paused) {
                    this.currentVideo.pause();
                }
                this.currentTimePosition = 0;
                this.globalTime = 0;
                this.resetAllVideos();
            }
        },
        resetAllVideos: function() {
            for (var item in this.videoObjects) {
                var currentObj = this.videoObjects[item];
                currentObj.video.currentTime = currentObj.videoitem.settings.start;
            }
        },
        /**
         * describes this Object to the user
         * @returns {String} representation of this Object
         */
        toString: function () {
            return "videoPreview=[]";
        }
    };

    return PreviewVideo;

}));