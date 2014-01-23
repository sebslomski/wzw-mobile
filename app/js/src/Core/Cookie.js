App.module('Core.Cookie', function(Cookie, App, Backbone, Marionette, $, _) {
    'use strict';

    Cookie.getCookieData = function(key) {
        var data = $.cookie(App.options.cookie.name);

        if (data) {
            data = JSON.parse(data) || {};
        } else {
            data = {};
        }

        if (data && key) {
            if (key in data) {
                return data[key];
            } else {
                return null;
            }
        } else {
            return data;
        }
    };


    Cookie.setCookieData = function(newData) {
        var data = null;

        // if newData is null, we delete the cookie
        if (newData !== null) {
            data = this.getCookieData();
            data = _.extend(data, newData);
            data = JSON.stringify(data);
        }

        $.cookie(App.options.cookie.name,
            data,
            _.extend({
                path: '/'
            }, App.options.cookie)
        );
    };


    Cookie.unsetCookieDataItem = function(item) {
        var data = this.getCookieData();
        delete data['item'];
        this.setCookieData(data);
    };
});
