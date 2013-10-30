App.module('Appointments.Collections', function(Collections, App, Backbone, Marionette, $, _) {
    'use strict';


    Collections.DayAppointments = App.Core.Collections.Core.extend({
        model: App.Appointments.Models.Appointment,
        urlRoot: '/appointments/by-days/'
    });


    Collections.Appointments = App.Core.Collections.Core.extend({
        model: App.Appointments.Models.Appointment,
        urlRoot: '/appointments/by-days/'
    });
});
