App.module('Groups.Models', function(Models, App, Backbone, Marionette, $, _) {
    'use strict';


    Models.Group = App.Core.Models.Core.extend({
        urlRoot: '/group/'
    });

    Models.User = App.Core.Models.Core.extend({
        url: function() {
            return this.baseUrl() + '/group/' + this.groupId + '/user/';
        }
    });
});
