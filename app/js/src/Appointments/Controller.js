App.module('Appointments.Controller', function(Controller, App, Backbone, Marionette, $, _) {
    'use strict';


    Controller.init = function() {
        App.Core.Routing.showRoute('appointments');
    };


    Controller.showAppointments = function() {
        NProgress.start();

        var appointments = new App.Appointments.Collections.Appointments();

        appointments.fetch()
            .done(function() {
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

                var headerView = new App.Appointments.Views.AppointmentListHeader();

                var contentView = new App.Appointments.Views.DayList({
                    collection: collection
                });

                var layout = new App.Core.Layouts.Main({
                    headerView: headerView,
                    contentView: contentView
                });

                App.viewport.show(layout);
            })
            .always(function() {
                NProgress.done();
            });
    };
});
