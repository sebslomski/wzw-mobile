App.module('Groups.Views', function(Views, App, Backbone, Marionette, $, _) {
    'use strict';


    Views.GroupListHeader = Marionette.ItemView.extend({
        template: 'Groups/Views/GroupListHeader.html',

        events: {
            'click .header-new': 'showNew'
        },


        showNew: function() {
            App.Core.Routing.showRoute('group/new');
        }
    });


    Views.GroupListItem = Marionette.ItemView.extend({
        tagName: 'li',
        className: 'groups-list-item',
        template: 'Groups/Views/GroupListItem.html',

        events: {
            'click ': 'showPayments'
        },


        showPayments: function(e) {
            e.stopPropagation();
            App.Core.Routing.showRoute('group/' + this.model.id + '/payment');
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


    Views.GroupListEmpty = Marionette.ItemView.extend({
        className: 'groups-list-empty',

        render: function() {
            this.$el.html('Keine Gruppen vorhanden.');
        }
    });


    Views.GroupList = Marionette.CollectionView.extend({
        tagName: 'ul',
        className: 'groups-list list',
        itemView: Views.GroupListItem,
        emptyView: Views.GroupListEmpty
    });


    Views.NewGroup = Marionette.ItemView.extend({
        template: 'Groups/Views/NewGroup.html',

        events: {
            'submit form': 'submit'
        },

        submit: function(e) {
            e.preventDefault();
            var that = this;

            this.model.save({
                name: this.$('input[name="group-name"]').val()
            }).done(function() {
                App.Groups.groups.add(that.model);
                App.Core.Routing.showRoute('group', that.model.id, 'payment');
            });
        }
    });


    Views.NewGroupHeader = Marionette.ItemView.extend({
        template: 'Groups/Views/NewGroupHeader.html',

        events: {
            'click .header-back': 'back'
        },

        back: function() {
            App.Core.Routing.showRoute('group');
        }
    });
});
