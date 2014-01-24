App.module('Misc.Routing', function(Routing, App, Backbone, Marionette, $, _) {
    'use strict';

    Routing.Router = Marionette.AppRouter.extend({
        appRoutes: {
            'settings': 'showSettings'
        },
        controller: App.Misc.Controller
    });


    App.addInitializer(function() {
        Routing.router = new Routing.Router();
    });
});
