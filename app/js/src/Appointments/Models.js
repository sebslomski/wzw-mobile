App.module('Appointments.Models', function(Models, App, Backbone, Marionette, $, _) {
    'use strict';


    Models.Appointment = App.Core.Models.Core.extend({
        urlRoot: '/appointments/'
    });
});
