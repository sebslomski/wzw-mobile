App.module('Misc.Models', function(Models, App, Backbone, Marionette, $, _) {
    'use strict';


    Models.Invite = App.Core.Models.Core.extend({
        url: function() {
            return this.baseUrl() + '/user/invite/';
        }
    });
});
