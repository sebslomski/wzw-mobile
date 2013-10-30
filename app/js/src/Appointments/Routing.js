App.module('Appointments.Routing', function(Routing, App, Backbone, Marionette, $, _) {
    'use strict';

    Routing.Router = Marionette.AppRouter.extend({
        appRoutes: {
            '': 'init',
            'appointments': 'showAppointments'
        },
        controller: App.Appointments.Controller
    });


    App.addInitializer(function() {
        Routing.router = new Routing.Router();
    });
});
