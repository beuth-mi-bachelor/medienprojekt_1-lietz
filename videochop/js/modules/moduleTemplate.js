/**
 * (C)opyright Michael Duve, Felix Maulwurf, Angelina Staeck
 *
 * @module: modulname //TODO: change name
 * @requires: jQuery
 * TODO: add more dependencies here
 *
 * TODO: add description here
 */

define(["jquery"], (function ($) {
    "use strict";

    /**
     * initializes a new instance
     * @param settings {Object} a JSON-Object which holds all informations for the module
     * @constructor
     */
    function ModulName(settings) {
        this.settings = {
            param1: "default setting 1",
            param2: "default setting 2"
        };

        // if settings where not set by initializing, fill with default settings
        $.extend(this.settings, settings || {});

        this.initialize();
    }

    ModulName.prototype = {
        initialize: function () {

        },
        /**
         * describes this Object to the user
         * @returns {String} representation of this Object
         */
        toString: function () {
            return "ModulName=[]";
        }
    };

    return ModulName;

}));

    
