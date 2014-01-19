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

        events: {
            'click .payments-list-header': 'toggleHeader',
            'touchstart .payments-list-header': 'toggleHeader'
        },

        initialize: function() {
            var that = this;
            this.listenTo(asEvents(window), 'resize', _.debounce(function() {
                that.positionHeader({equal: that.$('.payments-list-header').hasClass('s-is-toggled')});
            }, 300));
        },

        serializeData: function() {
            var data = Marionette.CompositeView.prototype.serializeData.call(this);
            var that = this;

            data.group = this.options.group.toJSON();
            _.each(data.group.users, function(user) {
                user.offset = ((that.getTotal() / data.group.users.length) - user.total) * -1;
            });

            data.group.users = _.sortBy(data.group.users, function(user) {
                return -1 * parseInt(user.total, 10);
            });

            return data;
        },


        toggleHeader: function() {
            var that = this;

            that.positionHeader({equal: !that.$('.payments-list-header').hasClass('s-is-toggled')});

            that.$('.payments-list-header').toggleClass('s-is-toggled');
        },


        getTotal: function() {
            return _.reduce(this.options.group.get('users'), function(memo, user) {
                return memo + parseInt(user.total, 10);
            }, 0);
        },

        positionHeader: function(options) {
            var that = this;
            var screenWidthPercentage = that.$el.width() / 100;

            var total = this.getTotal();

            if (options.equal) {
                var screenWidthPercentage = that.$el.width() / 100;

                _.each(that.options.group.get('users'), function(user) {
                    var $item = that.$('#payments-list-header-user-' + user.id);

                    $item.css({
                        width: (100 / that.options.group.get('users').length) * screenWidthPercentage
                    });
                });
            } else {
                _.each(that.options.group.get('users'), function(user) {
                    var percentage = (parseInt(user.total, 10) * 100) / total;
                    that.$('#payments-list-header-user-' + user.id).css({
                        width: percentage * screenWidthPercentage
                    });
                });
            }
        },

        onRender: function() {
            var that = this;

            _.defer(function() {
                that.positionHeader({equal: true});

                _.delay(function() {
                    that.$('.payments-list-header').addClass('s-is-initialized');
                    that.positionHeader({equal: false});
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
