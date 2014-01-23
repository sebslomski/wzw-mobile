App.module('Payments.Controller', function(Controller, App, Backbone, Marionette, $, _) {
    'use strict';


    Controller.showUsers = function(groupId) {
        var headerView = new App.Payments.Views.Header({
            model: App.Groups.groups.get(groupId),
            view: 'user'
        });

        var footerView = new App.Payments.Views.PaymentListFooter({
            model: App.Groups.groups.get(groupId),
            view: 'user'
        });

        var contentView = new App.Payments.Views.Users({
            model: App.Groups.groups.get(groupId)
        });

        var layout = new App.Core.Layouts.Main({
            headerView: headerView,
            contentView: contentView,
            footerView: footerView
        });

        App.layout.showView(layout, 'Groups.Users', {
            'Groups.Groups': 'right',
            'Groups.Payments': 'fade'
        });
    };


    Controller.showPayments = function(groupId) {
        NProgress.start();

        var payments = new App.Payments.Collections.Payments([], {
            groupId: groupId
        });

        payments.fetch()
            .done(function() {
                var grouped = payments.groupBy(function(model) {
                    var date = moment(model.get('created_at'));
                    return date.sod().toDate();
                });

                var collection = new Backbone.Collection();

                _.each(grouped, function(items, key) {
                    collection.add({
                        day: key,
                        payments: new App.Payments.Collections.Payments(items, {
                            groupId: groupId
                        })
                    });
                });

                var headerView = new App.Payments.Views.Header({
                    model: App.Groups.groups.get(groupId),
                    view: 'payment'
                });

                var footerView = new App.Payments.Views.PaymentListFooter({
                    model: App.Groups.groups.get(groupId),
                    view: 'payment'
                });

                var contentView = new App.Payments.Views.DayList({
                    collection: collection,
                    group: App.Groups.groups.get(groupId)
                });

                var layout = new App.Core.Layouts.Main({
                    headerView: headerView,
                    contentView: contentView,
                    footerView: footerView
                });

                App.layout.showView(layout, 'Groups.Payments', {
                    'Groups.Groups': 'right',
                    'Groups.Users': 'fade'
                });
            })
            .always(function() {
                NProgress.done();
            });
    };


    Controller.showNewPayment = function(groupId) {
        NProgress.start();

        var headerView = new App.Payments.Views.NewHeader({
            model: App.Groups.groups.get(groupId),
            view: 'payment',
            title: 'Neue Zahlung'
        });

        var tags = new App.Payments.Collections.Tags([], {
            groupId: groupId
        });

        tags.fetch().done(function() {
            var payment = new App.Payments.Models.Payment();
            payment.groupId = groupId;

            var contentView = new App.Payments.Views.NewPayment({
                model: payment,
                tags: tags
            });

            var layout = new App.Core.Layouts.Main({
                headerView: headerView,
                contentView: contentView
            });

            App.layout.showView(layout, 'Groups.Payments.NewPayment', {
                'Groups.Payments': 'right'
            });
        })
        .always(function() {
            NProgress.done();
        });
    };


    Controller.showNewUser = function(groupId) {
        var headerView = new App.Payments.Views.NewHeader({
            model: App.Groups.groups.get(groupId),
            view: 'user',
            title: 'Freund einladen'
        });

        var user = new App.Groups.Models.User();
        user.groupId = groupId;

        var users = new App.User.Collections.Users();

        var contentView = new App.Payments.Views.NewUser({
            model: user,
            collection: users
        });

        var layout = new App.Core.Layouts.Main({
            headerView: headerView,
            contentView: contentView
        });

        App.layout.showView(layout, 'Groups.Users.NewUser', {
            'Groups.Users': 'right'
        });
    };
});
