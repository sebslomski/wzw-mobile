App.module('Payments.Routing', function(Routing, App, Backbone, Marionette, $, _) {
    'use strict';

    Routing.Router = Marionette.AppRouter.extend({
        appRoutes: {
            'group/:group_id/payment': 'showPayments',
            'group/:group_id/payment/new': 'showNewPayment'
        },
        controller: App.Payments.Controller
    });


    App.addInitializer(function() {
        Routing.router = new Routing.Router();
    });
});
