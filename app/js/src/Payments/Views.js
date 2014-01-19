App.module('Payments.Views', function(Views, App, Backbone, Marionette, $, _) {
    'use strict';


    Views.PaymentListHeader = Marionette.ItemView.extend({
        template: 'Payments/Views/PaymentListHeader.html',

        events: {
            'touchstart .header-new': 'newPayment',
            'click .header-new': 'newPayment',
            'touchstart .header-back': 'back',
            'click .header-back': 'back'
        },


        back: function(e) {
            App.Core.Routing.showRoute('group');
        },


        newPayment: function(e) {
            App.Core.Routing.showRoute('group/' + this.model.id + '/payment/new');
        },


        serializeData: function() {
            var data = Marionette.ItemView.prototype.serializeData.call(this);

            data.usernames = _.map(data.users, function(user) {
                return user.first_name;
            });

            return data;
        }
    });


    Views.PaymentListItem = Marionette.ItemView.extend({
        tagName: 'li',
        template: 'Payments/Views/PaymentListItem.html',

        onRender: function() {
            var color = this.model.get('user').color;
            if (color) {
                this.$el.css({
                    'border-left-color': color
                });
            }
        }
    });


    Views.PaymentsList = Marionette.CompositeView.extend({
        template: 'Payments/Views/DayPaymentsList.html',
        itemView: Views.PaymentListItem,
        itemViewContainer: 'ul',

        initialize: function() {
            this.collection = this.model.get('payments');
        }
    });


    Views.NoDayListItems = Marionette.ItemView.extend({
        className: 'payments-no-day-list-items',

        render: function() {
            this.$el.html('Keine Zahlungen vorhanden.');
        }
    });


    Views.DayList = Marionette.CompositeView.extend({
        template: 'Payments/Views/PaymentList.html',
        itemView: Views.PaymentsList,
        emptyView: Views.NoDayListItems,
        itemViewContainer: '#payments-list',

        initialize: function() {
            var that = this;
            this.listenTo(asEvents(window), 'resize', _.debounce(function() {
                that.positionHeader();
            }, 300));
        },

        serializeData: function() {
            var data = Marionette.CompositeView.prototype.serializeData.call(this);

            data.group = this.options.group.toJSON();

            return data;
        },


        positionHeader: function() {
            var that = this;
            var screenWidthPercentage = that.$el.width() / 100;

            var total = _.reduce(that.options.group.get('users'), function(memo, user) {
                return memo + parseInt(user.total, 10);
            }, 0);

            _.each(that.options.group.get('users'), function(user) {
                var percentage = (parseInt(user.total, 10) * 100) / total;
                that.$('#payments-list-header-user-' + user.id).css({
                    width: percentage * screenWidthPercentage,
                    transition: 'width 0.6s ease-out'
                });
            });
        },

        onRender: function() {
            var that = this;

            _.defer(function() {
                var screenWidthPercentage = that.$el.width() / 100;

                _.each(that.options.group.get('users'), function(user) {
                    that.$('#payments-list-header-user-' + user.id).css({
                        width: (100 / that.options.group.get('users').length) * screenWidthPercentage
                    });
                });

                _.delay(function() {
                    that.positionHeader();
                }, 200);
            });
        }
    });


    Views.NewPayment = Marionette.ItemView.extend({
        template: 'Payments/Views/NewPayment.html',

        events: {
            'submit form': 'submit'
        },

        submit: function(e) {
            e.preventDefault();

            this.model.save({
                amount: this.$('input[name="payment-amount"]').val(),
                purpose: this.$('input[name="payment-purpose"]').val()
            }).done(function() {
                App.Core.Routing.showRoute('group', this.model.groupId, 'payment');
            });
        }
    });


    Views.NewPaymentHeader = Marionette.ItemView.extend({
        template: 'Payments/Views/NewPaymentHeader.html',

        events: {
            'touchstart .header-back': 'back',
            'click .header-back': 'back'
        },


        back: function(e) {
            App.Core.Routing.showRoute('group/' + this.model.id + '/payment');
        }
    });
});
