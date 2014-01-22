App.module('User.Routing', function(Routing, App, Backbone, Marionette, $, _) {
    'use strict';


    Routing.Router = Marionette.AppRouter.extend({
        appRoutes: {
            'auth/login': 'showLogin',
            'auth/claim/:claimId': 'showClaimAccount',
            'auth/logout': 'showLogout'
        },
        controller: App.User.Controller
    });


    App.addInitializer(function() {
        Routing.router = new Routing.Router();
    });
});
