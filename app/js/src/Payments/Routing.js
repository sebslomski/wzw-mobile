App.module('Payments.Routing', function(Routing, App, Backbone, Marionette, $, _) {
    'use strict';

    Routing.Router = Marionette.AppRouter.extend({
        appRoutes: {
            'group/:group_id/payment': 'showPayments',
            'group/:group_id/user': 'showUsers',
            'group/:group_id/user/new': 'showNewUser',
            'group/:group_id/payment/new': 'showPayment',
            'group/:group_id/payment/:payment_id': 'showPayment'
        },
        controller: App.Payments.Controller
    });


    App.addInitializer(function() {
        Routing.router = new Routing.Router();
    });
});
