requirejs.config({
    baseUrl:"../../videochop/js/",
    paths: {
        "jquery": 'lib/jquery-2.1.1.min'
    }
});
define(["jquery", "modules/eventHandler"], (function ($, EventHandler) {
    "use strict";

        $(document).ready(function() {

            var eventHandler = new EventHandler();
            eventHandler.subscribe("test-name", function(arg1, arg2) {
                console.log(arg1);
                console.log(arg2);
            });

            $("#button").on("click", function() {
                var content = $("#test").val();
                eventHandler.publish("test-name", ["Data entered", content]);
            });


        });

}));