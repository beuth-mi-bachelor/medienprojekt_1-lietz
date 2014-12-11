/**
 * global require config
 */
requirejs.config({
    paths: {
        "jquery": "lib/jquery-2.1.1.min",
        "modernizr": "lib/modernizr"
    },
    waitSeconds: 0
});



define(["jquery", "modernizr"], function ($, Modernizr) {
    "use strict";

    $(document).ready(function() {

    });
});