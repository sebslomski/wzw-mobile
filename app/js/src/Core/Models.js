App.module('Core.Models', function(Models, App, Backbone, Marionette, $, _) {
    'use strict';

    Models.Core = Backbone.Model.extend({
        baseUrl: function() {
            return App.options.apiUrl;
        },


        url: function() {
            var fullUrl = this.urlRoot;
            if (fullUrl[fullUrl.length - 1] !== '/') {
                fullUrl += '/';
            }

            if (this.id) {
                fullUrl += this.id + '/';
            }

            return this.baseUrl() + fullUrl;
        }
    });
});
