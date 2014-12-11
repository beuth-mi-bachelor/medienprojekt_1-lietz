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

        var $body = $("body");
        var $navItems = $(".nav-item");
        var $closeImpress = $(".close-impress");

        $navItems.on("click", function() {
            if ($(this).hasClass("impress")) {
                $body.toggleClass("impress-open");
            }
        });

        $closeImpress.on("click", function() {
            $body.toggleClass("impress-open");
        });

    });
});