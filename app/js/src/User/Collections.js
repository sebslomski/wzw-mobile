App.module('User.Collections', function(Collections, App, Backbone, Marionette, $, _) {
    'use strict';


    Collections.Users = App.Core.Collections.Core.extend({
        urlRoot: '/user/'
    });
});
