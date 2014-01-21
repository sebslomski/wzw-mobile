App.module('User.Models', function(Models, App, Backbone, Marionette, $, _) {
    'use strict';

    Models.Login = App.Core.Models.Core.extend({
        urlRoot: '/auth/token/',


        isLoggedIn: function() {
            var promise = $.Deferred();

            this.save({}, {
                    type: 'PUT'
                }).always(function(res) {
                    if (res.status === 200) {
                        promise.resolve();
                    } else {
                        promise.reject();
                    }
                });

            return promise;
        }
    });


    Models.Logout = App.Core.Models.Core.extend({
        urlRoot: '/auth/token/',

        isNew: function() {  return false; }
    });


    Models.User = App.Core.Models.Core.extend({
        urlRoot: '/user/me/',

        url: function() {
            return this.baseUrl() + this.urlRoot;
        }
    });
});
