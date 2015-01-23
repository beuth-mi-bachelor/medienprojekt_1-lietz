requirejs.config({
    baseUrl:"../../videochop/js/"
});
define(["jquery", "filereader", "videoList", "videoItem", "videoItemLoader"], (function ($, FileReaderJS, VideoList, VideoItem, VideoItemLoader) {
    "use strict";

    $(document).ready(function() {

        var debug = false;

        var outputElement = document.getElementById("output");
        var arrayContent = document.getElementById("array-content");

        var files = [];

        var itemsToLoad = 0;

        var lengthOfVideos = 0;

        if (debug) {
            $(outputElement).show();
            $(arrayContent).show();
        }

        /*video item loader for debug reasons*/
        /**
         * VideoItemLoader
         */
        var moduleVideoItemLoader = new VideoItemLoader({
            tempWrapper: ".temporary-video",
            callback: function(item) {
                if (debug) {
                    console.log(item);
                }
                var vid = {
                    data: item.settings.data,
                    name: item.settings.name + "." + item.settings.type.split("video/")[1]
                };
                files.push(vid);
                itemsToLoad--;
                lengthOfVideos += (item.settings.end - item.settings.start);
                if (debug) {
                    console.log(item.settings.end, item.settings.start);
                }
                if (itemsToLoad === 0) {
                    startExporting(files);
                }
            }
        });

        var fileReaderOpts = {
            readAsDefault: 'ArrayBuffer',
            accept: "video/*",
            on: {
                groupstart: function(e) {
                    itemsToLoad = e.files.length;
                },
                loadend: function (e, file) {
                    moduleVideoItemLoader.add({
                        data: new Uint8Array(e.target.result),
                        extension: file.extra.extension,
                        name: file.extra.nameNoExtension,
                        prettySize: file.extra.prettySize,
                        size: file.size,
                        type: file.type
                    });
                }
            }
        };

        FileReaderJS.setupDrop($("#dropzone")[0], fileReaderOpts);


        var worker = new Worker("webworker.js");

        var $progressbar = $('#progressbar');
        var $progressValue = $('.progress-value');
        var $exportText = $(".export-text");
        var $exportStatus = $exportText.find(".export-status");
        var $exportProgress = $exportText.find(".export-progress");
        var $exportLink = $exportText.find(".export-link");

        function fadeInLoadingOverlay() {
            $(".export-overlay").fadeIn();
        }

        worker.onmessage = function (event) {
            var message = event.data;
            if (message.type === "ready") {
                if (debug) {
                    outputElement.textContent += "Loaded\n";
                }
                $exportStatus.text("export library loaded");
            } else if (message.type === "start") {
                if (debug) {
                    outputElement.textContent += "Starting\n";
                }
                fadeInLoadingOverlay();
                $exportStatus.text("starting export");
            } else if (message.type === "stdout") {
                $exportStatus.text("exporting\n");
                if (debug) {
                    outputElement.textContent += message.data + "\n";
                }
                handleMessages(message.data);
            } else if (message.type === "done") {
                if (debug) {
                    outputElement.textContent += "Done\n";
                }
                $exportStatus.text("export done\n");
                $exportLink.html(createURL(message.data[0]));
            }
        };

        function handleMessages(message) {
            var conversionInfo = /size=(\s)*(\d)*(\w*) time=(\d|\:|\.)*/g;

            if (conversionInfo.test(message)) {
                var info = message.match(conversionInfo)[0];
                var size = info.match(/(\d)*(\w)* /g);
                size = size[size.length-1];
                var time = info.match(/(\d)*:(\d)*:(\d)*\.(\d)*/g);
                time = time[0];

                $exportProgress.text("handled " + size + " and encoded " + time + " hours");

                showProgress(time);
            } else {
                console.log(message);
            }
        }

        function showProgress(time) {
            var splitted = time.split(":");
            var secsAndMillis = splitted[splitted.length-1];
            var mins = splitted[splitted.length-2];
            var hours = splitted[splitted.length-3];
            var seconds = parseFloat(secsAndMillis) + (parseInt(mins, 10) * 60) + (parseInt(hours, 10) * 3600);
            var percentage = parseFloat((seconds / lengthOfVideos) * 100).toFixed(2);
            $progressbar.val(percentage);
            $progressValue.text(percentage + "%");

            if (debug) {
                console.log(seconds, lengthOfVideos, percentage);
            }
        }

        function createURL(item) {
            var fileArray = new Uint8Array(item.data);
            var blob = new Blob([fileArray], {type: "video/mp4"});
            var url = window.URL.createObjectURL(blob);
            return $("<a href='"+url+"'>Download "+item.name+"</a>");
        }

        function parseArguments(text) {
            text = text.replace(/\s+/g, ' ');
            var args = [];
            // Allow double quotes to not split args.
            text.split('"').forEach(function(t, i) {
                t = t.trim();
                if ((i % 2) === 1) {
                    args.push(t);
                } else {
                    args = args.concat(t.split(" "));
                }
            });
            return args;
        }

        $(".close").on("click", function() {
            cancelExporting();
            $(".export-overlay").fadeOut();
        });

        function cancelExporting() {

            // TODO
        }

        function buildArguments(items) {
            var string = "";
            for (var i = 0; i < items.length; i++) {
                string += '-i ' + items[i].name + ' ';
            }
            return string;
        }

        function startExporting(files) {

            var inputs = buildArguments(files);

            if (debug) {
                console.log(files, inputs);
            }

            var args = parseArguments(inputs + '-v debug -strict -2 -filter_complex "[0:v] [0:a:0] [1:v] [1:a:0] concat=n=2:v=1:a=1 [v] [a]" -map "[v]" -map "[a]" output.mp4');

            if (debug) {
                console.log(args);
            }

            worker.postMessage({
                type: 'command',
                arguments: args,
                files: files,
                TOTAL_MEMORY: "ALLOW_MEMORY_GROWTH"
            });

        }

    });

}));
