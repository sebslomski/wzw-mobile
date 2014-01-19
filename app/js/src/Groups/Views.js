App.module('Groups.Views', function(Views, App, Backbone, Marionette, $, _) {
    'use strict';


    Views.GroupListHeader = Marionette.ItemView.extend({
        template: 'Groups/Views/GroupListHeader.html',

        events: {
            'touchstart .header-refresh': 'refresh',
            'click .header-refresh': 'refresh'
        },


        refresh: function(e) {
            e.stopPropagation();
            App.Groups.groups.fetch();
        }
    });


    Views.GroupListItem = Marionette.ItemView.extend({
        tagName: 'li',
        className: 'groups-list-item',
        template: 'Groups/Views/GroupListItem.html',

        events: {
            'touchstart ': 'showPayments',
            'click ': 'showPayments'
        },


        showPayments: function(e) {
            e.stopPropagation();
            App.Core.Routing.showRoute('group/' + this.model.id + '/payment');
        },


        serializeData: function() {
            var data = Marionette.ItemView.prototype.serializeData.call(this);

            data.usernames = _.map(data.users, function(user) {
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
});
