App.module('Appointments.Views', function(Views, App, Backbone, Marionette, $, _) {
    'use strict';


    Views.AppointmentListHeader = Marionette.ItemView.extend({
        template: 'Appointments/Views/AppointmentListHeader.html',

        events: {
            'touchstart .header-refresh': 'refresh',
            'click .header-refresh': 'refresh',
            'touchstart .header-logout': 'logout',
            'click .header-logout': 'logout'
        },


        logout: function(e) {
            App.Core.Routing.showRoute('auth/logout');
        },


        refresh: function(e) {
            Backbone.history.loadUrl();
        }
    });


    Views.AppointmentListItem = Marionette.ItemView.extend({
        tagName: 'li',
        template: 'Appointments/Views/AppointmentListItem.html',

        onRender: function() {
            var employee = this.model.get('employee');
            if (employee) {
                this.$el.css({
                    'border-left-color': '#' + employee.color
                });
            }
        },

        serializeData: function() {
            var data = Marionette.ItemView.prototype.serializeData.call(this);

            data.end_date = moment(data.date).add('minutes', data.duration);

            return data;
        }
    });


    Views.AppointmentsList = Marionette.CompositeView.extend({
        template: 'Appointments/Views/DayAppointmentsList.html',
        itemView: Views.AppointmentListItem,
        itemViewContainer: 'ul',

        initialize: function() {
            this.collection = this.model.get('appointments');
        }
    });


    Views.DayList = Marionette.CollectionView.extend({
        itemView: Views.AppointmentsList
    });
});
