App.module('Appointments.Controller', function(Controller, App, Backbone, Marionette, $, _) {
    'use strict';


    Controller.init = function() {
        App.Core.Routing.showRoute('appointments');
    };


    Controller.showAppointments = function() {
        var appointments = new App.Appointments.Collections.Appointments();

        appointments.fetch().done(function() {
            var grouped = appointments.groupBy(function(model) {
                var date = moment(model.get('date'));
                return date.sod().toDate();
            });

            var collection = new Backbone.Collection();

            _.each(grouped, function(value, key) {
                collection.add({
                    day: key,
                    appointments: new App.Appointments.Collections.Appointments(
                        value
                    )
                });
            });

            var contentView = new App.Appointments.Views.DayList({
                collection: collection
            });
            App.content.show(contentView);
        });
    };
});
