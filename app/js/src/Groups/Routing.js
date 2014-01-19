App.module('Groups.Routing', function(Routing, App, Backbone, Marionette, $, _) {
    'use strict';


    Routing.Router = Marionette.AppRouter.extend({
        appRoutes: {
            '': 'showDefault',
            'group': 'showGroups'
        },
        controller: App.Groups.Controller
    });


    App.addInitializer(function() {
        Routing.router = new Routing.Router();
    });
});
