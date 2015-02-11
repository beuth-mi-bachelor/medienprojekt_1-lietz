/**
 * (C)opyright Michael Duve, Felix Maulwurf, Angelina Staeck
 *
 * @module: EventHandler
 * @requires: jQuery
 *
 * this plugin receives and publishes all kind of events
 */

define(["jquery"], (function ($) {
    "use strict";

    /**
     * initializes a new instance
     * @constructor
     */
    function EventHandler() {
        if (EventHandler.prototype.instance !== undefined) {
            return EventHandler.prototype.instance;
        }

        EventHandler.prototype.instance = this;

        this.topics = {};
    }

    EventHandler.prototype = {
        publish: function (topic, args) {
            if (this.topics[topic]) {
                for (var i = 0, len = this.topics[topic].length; i < len; i++) {
                    if (typeof this.topics[topic][i] !== "undefined") {
                        this.topics[topic][i].apply(this, args || []);
                    }
                }
            }
        },
        subscribe: function (topic, callback) {
            if (!this.topics[topic]) {
                this.topics[topic] = [];
            }
            this.topics[topic].push(callback);
            return [topic, callback];
        },
        dismiss: function (topic, callback) {
            if (!this.topics[topic]) {
                return false;
            }
            for (var i = 0, len = this.topics[topic].length; i < len; i++) {
                if (this.topics[topic][i] === callback) {
                    this.topics[topic].splice(i, 1);
                }
            }
        },
        /**
         * describes this Object to the user
         * @returns {String} representation of this Object
         */
        toString: function () {
            return "EventHandler=[]";
        }
    };

    return EventHandler;

}));

    
