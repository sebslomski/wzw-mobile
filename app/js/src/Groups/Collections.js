App.module('Groups.Collections', function(Collections, App, Backbone, Marionette, $, _) {
    'use strict';


    Collections.Groups = App.Core.Collections.Core.extend({
        model: App.Groups.Models.Group,
        urlRoot: '/group/'
    });
});
