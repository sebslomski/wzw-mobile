App.module('Payments.Controller', function(Controller, App, Backbone, Marionette, $, _) {
    'use strict';


    Controller.showPayments = function(groupId) {
        NProgress.start();
        $('body').addClass('s-is-loading');

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

                var headerView = new App.Payments.Views.PaymentListHeader({
                    model: App.Groups.groups.get(groupId)
                });

                var contentView = new App.Payments.Views.DayList({
                    collection: collection,
                    group: App.Groups.groups.get(groupId)
                });

                var layout = new App.Core.Layouts.Main({
                    headerView: headerView,
                    contentView: contentView
                });

                App.viewport.show(layout);
            })
            .always(function() {
                NProgress.done();
                $('body').removeClass('s-is-loading');
            });
    };


    Controller.showNewPayment = function(groupId) {
        NProgress.start();
        $('body').addClass('s-is-loading');

        var headerView = new App.Payments.Views.NewPaymentHeader({
            model: App.Groups.groups.get(groupId)
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

            App.viewport.show(layout);
        })
        .always(function() {
            NProgress.done();
            $('body').removeClass('s-is-loading');
        });
    };
});
