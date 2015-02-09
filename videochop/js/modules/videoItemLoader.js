/**
 * (C)opyright Michael Duve, Felix Maulwurf, Angelina Staeck
 *
 * @module: VideoItemLoader
 * @requires: jQuery
 * @requires: VideoItem
 * @requires: Popcorn
 * @requires: Popcorn.capture
 *
 * this module handles the communication between video and videoItem
 */

define(["jquery", "videoItem", "utilities", "popcorn", "popcorn-capture"], (function ($, VideoItem, Utils, Popcorn) {
    "use strict";

    /**
     * initializes a new instance
     * @param settings {Object} a JSON-Object which holds all informations for the module
     * @constructor
     */
    function VideoItemLoader(settings) {

        this.settings = {
            type: "video/mp4",
            tempWrapper: "#temp-video",
            callback: function() {

            }
        };

        // if settings where not set by initializing, fill with default settings
        $.extend(this.settings, settings || {});
    }

    VideoItemLoader.prototype = {
        add: function (data) {
            this.video = {
                data: null,
                extension: "mp4",
                name: "default",
                prettySize: "0 MB",
                size: 0,
                type: "video/mp4"
            };
            $.extend(this.video, data || {});

            this.loaded = false;

            if (this.video.data === null) {
                console.error("no data found");
            }
            else {
                var url = window.URL.createObjectURL(new Blob(
                    [this.video.data], {
                        type: this.video.type
                    }
                ));
                this.loadMetaData(url, this.video.type, this.video.data);
            }
        },

        loadMetaData: function (url, type, data) {
            var video = document.createElement("video");
            var tempName = "tempVideo" + new Date().getTime();
            video.setAttribute("id", tempName);
            var src = document.createElement("source");
            src.src = url;
            src.type = type;
            video.appendChild(src);
            var $vidwrapper = $(this.settings.tempWrapper);
            $vidwrapper.append(video);
            var $pop = Popcorn("#"+tempName);

            $pop.videoName = this.video.name;
            $pop.videoElement = video;
            $pop.videoType = this.video.type;
            $pop.videoSize = this.video.size;
            $pop.videoPrettySize = this.video.prettySize;

            var self = this;
            $pop.listen('canplayall', function() {

                var item = new VideoItem({
                    video: this.media.currentSrc,
                    name: this.videoName,
                    length: this.media.duration,
                    start: 0,
                    data: data,
                    end: this.media.duration,
                    size: this.videoSize,
                    type: this.videoType,
                    videoElement: this.videoElement,
                    resolution: {
                        width: this.media.videoWidth,
                        height: this.media.videoHeight
                    },
                    prettySize: this.videoPrettySize
                });

                var poster = this.currentTime(1).capture();
                var blob = self.baseToBlob(poster.video.poster, "image/png");
                var url = URL.createObjectURL(blob);
                item.settings.thumbnail = url;
                this.videoElement.poster = url;

                $("#"+tempName).remove();
                $("#popcorn-canvas-"+tempName).remove();

                self.settings.callback(item);

                Popcorn.destroy(this);

                var worker = new Worker("../../videochop/js/lib/webworker.js");
                var fps = 0;

                worker.onmessage = function (event) {
                    var message = event.data;
                    if (message.type === "start") {
                        console.log("starting");
                    } else if (message.type === "stdout") {
                        var reg = /[0-9]{1,2}(\.)?[0-9]*(\s)fps/;
                        var m = reg.exec(message.data);
                        if (m) {
                            fps = parseFloat(m[0].split(" fps")[0]);
                        }
                    } else if (message.type === "done") {
                        item.settings.fps = fps;
                        worker.terminate();
                        worker = undefined;
                    }
                };

                var vid = {
                    data: item.settings.data,
                    name: item.settings.name + "." + item.settings.type.split("video/")[1]
                };

                var buildArguments = function(items) {
                    var string = "";
                    for (var i = 0; i < items.length; i++) {

                        string += '-i ' + items[i].name;
                    }
                    return string;
                };

                var files = [vid];

                worker.postMessage({
                    type: 'command',
                    arguments: Utils.parseArguments(buildArguments(files)),
                    files: files,
                    TOTAL_MEMORY: "ALLOW_MEMORY_GROWTH"
                });

            });
        },
        baseToBlob: function(b64Data, contentType) {
            // convert data to correct base64 type
            b64Data = b64Data.replace(/^data:image\/(png|jpg);base64,/, "");
            contentType = contentType || '';
            var sliceSize = 1024;
            var byteCharacters = atob(b64Data);
            var bytesLength = byteCharacters.length;
            var slicesCount = Math.ceil(bytesLength / sliceSize);
            var byteArrays = new Array(slicesCount);

            for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
                var begin = sliceIndex * sliceSize;
                var end = Math.min(begin + sliceSize, bytesLength);

                var bytes = new Array(end - begin);
                for (var offset = begin, i = 0 ; offset < end; ++i, ++offset) {
                    bytes[i] = byteCharacters[offset].charCodeAt(0);
                }
                byteArrays[sliceIndex] = new Uint8Array(bytes);
            }
            return new Blob(byteArrays, { type: contentType });
        },

        /**
         * describes this Object to the user
         * @returns {String} representation of this Object
         */
        toString: function () {
            return "VideoItemLoader=[]";
        }
    };

    return VideoItemLoader;

}));


