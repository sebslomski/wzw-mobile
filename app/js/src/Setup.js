/*globals Backbone:false, $:false, _:false,  window:false, App:false, Handlebars:false */

$(function() {
    'use strict';

    Backbone.Marionette.Renderer.render = function(template, data){
        template = 'templates/' + template;

        if (!Handlebars.templates[template]) {
            throw 'Template not found (' + template + ')';
        }
        template = Handlebars.templates[template];
        return template(data);
    };


    /*
     * Overrides Backbone.sync - adds custom headers like Authorization and
     * Clounge_origin
     * */
    var oldSync = Backbone.sync;
    Backbone.sync = function(method, model, options) {
        options = options || {};

        var origin = window.location.protocol + '//' + window.location.hostname;
        if (window.location.port) {
            origin += ':' + window.location.port;
        }

        var headers = {};

        if (App.token) {
            headers.AUTHORIZATION = 'Token ' + App.token;
        }

        options.headers = _.extend(headers, options.headers);

        return oldSync(method, model, options);
    };


    numeral.language('de');

    window.asEvents = function(el) {
        var args;
        return {
            on: function(event, handler) {
                if (args) throw new Error("this is one off wrapper");
                el.addEventListener(event, handler, false);
                args = [event, handler];
            },
            off: function() {
                el.removeEventListener.apply(el, args);
            }

        };
    }
});
