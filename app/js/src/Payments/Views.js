App.module('Payments.Views', function(Views, App, Backbone, Marionette, $, _) {
    'use strict';


    Views.Header = Marionette.ItemView.extend({
        template: 'Payments/Views/Header.html',

        events: {
            'click .header-new': 'showNew',
            'click .header-back': 'back'
        },


        back: function(e) {
            App.Core.Routing.showRoute('group');
        },


        showNew: function(e) {
            App.Core.Routing.showRoute('group/' + this.model.id + '/' + this.options.view + '/new');
        },


        serializeData: function() {
            var data = Marionette.ItemView.prototype.serializeData.call(this);

            data.usernames = _.map(data.users, function(user) {
                if (user.id === App.User.user.id) {
                    return 'Du';
                }
                return user.first_name;
            });

            return data;
        }
    });


    Views.PaymentListFooter = Marionette.ItemView.extend({
        template: 'Payments/Views/PaymentListFooter.html',

        events: {
            'click .payments-footer-payment': 'showPayments',
            'click .payments-footer-user': 'showUsers',
        },

        showUsers: function(e) {
            App.Core.Routing.showRoute('group/' + this.model.id + '/user');
        },

        showPayments: function(e) {
            App.Core.Routing.showRoute('group/' + this.model.id + '/payment');
        },

        onRender: function() {
            this.$('.payments-footer-' + this.options.view).addClass('s-is-active');
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
            'click .payments-list-header': 'toggleHeader'
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


        toggleHeader: function(e) {
            e.stopPropagation();
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
            'submit form': 'submit',
            'click .payments-new-tags li': 'toggleTag',
            'keyup input[name="payment-tags"]': 'tagsKeyup'
        },

        getCurrentTagList: function() {
            var tags = this.$('input[name="payment-tags"]').val().split(',');
            tags = _.map(tags, function(elem) {
                return elem.trim();
            });

            return _.uniq(_.compact(tags));
        },

        submit: function(e) {
            e.preventDefault();
            var that = this;

            this.model.save({
                amount: this.$('input[name="payment-amount"]').val().replace(',', '.'),
                purpose: this.$('input[name="payment-purpose"]').val(),
                tags: this.getCurrentTagList()
            }).done(function() {
                App.Groups.groups.get(that.model.groupId).fetch().done(function() {
                    App.Core.Routing.showRoute('group', that.model.groupId, 'payment');
                });
            });
        },

        toggleTag: function(e) {
            var $tag = this.$(e.currentTarget);
            $tag.toggleClass('s-is-selected');
            var isSelected = $tag.hasClass('s-is-selected');
            var tag = $tag.html().trim();

            var $tags = this.$('input[name="payment-tags"]');
            var tagList = this.getCurrentTagList();

            if (isSelected) {
                tagList.push(tag);
            } else {
                tagList = _.filter(tagList, function(elem) {
                    return elem !== tag;
                });
            }

            $tags.val(_.uniq(tagList).join(', '));
        },

        tagsKeyup: function(e) {
            var $tags = this.$(e.currentTarget);
            var tagList = this.getCurrentTagList();

            var selectedTags = _.intersection(this.options.tags.pluck('name'), tagList);

            this.$('.payments-new-tags li').each(function() {
                var $tag = $(this);
                var tag = $tag.html().trim();

                $tag.toggleClass('s-is-selected', _.contains(selectedTags, tag));
            });

        },

        serializeData: function() {
            var data = Marionette.ItemView.prototype.serializeData.call(this);

            data.tags = this.options.tags.toJSON();

            return data;
        }
    });


    Views.NewHeader = Marionette.ItemView.extend({
        template: 'Payments/Views/NewHeader.html',

        events: {
            'click .header-back': 'back'
        },

        back: function() {
            App.Core.Routing.showRoute('group/' + this.model.id + '/' + this.options.view);
        },

        serializeData: function() {
            var data = Marionette.ItemView.prototype.serializeData.call(this);

            data.title = this.options.title;

            return data;
        }
    });


    Views.Users = Marionette.ItemView.extend({
        template: 'Payments/Views/Users.html',

        serializeData: function() {
            var data = Marionette.ItemView.prototype.serializeData.call(this);

            data.invited_users = _.filter(data.users, function(user) {
                return _.isNull(user.claimed_at);
            });

            data.active_users = _.difference(data.users, data.invited_users);

            return data;
        }
    });


    Views.NewUser = Marionette.ItemView.extend({
        template: 'Payments/Views/NewUser.html',

        events: {
            'submit form': 'submit'
        },

        submit: function(e) {
            e.preventDefault();
            var that = this;

            this.model.save({
                first_name: this.$('input[name="group-user-firstname"]').val(),
                last_name: this.$('input[name="group-user-lastname"]').val(),
                email: this.$('input[name="group-user-email"]').val()
            }).done(function() {
                App.Groups.groups.get(that.model.groupId).fetch().done(function() {
                    App.Core.Routing.showRoute('group', that.model.groupId, 'user');
                });
            });
        }
    });
});
