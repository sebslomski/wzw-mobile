App.module('Groups.Controller', function(Controller, App, Backbone, Marionette, $, _) {
    'use strict';


    Controller.showDefault = function() {
        App.Core.Routing.showRoute('group');
    };


    Controller.showGroups = function() {
        if (App.Groups.groups.length === 0) {
            App.Core.Routing.showRoute('group/new');
            return;
        }

        var contentView = new App.Groups.Views.GroupList({
            collection: App.Groups.groups
        });

        var headerView = new App.Groups.Views.GroupListHeader();

        var layout = new App.Core.Layouts.Main({
            headerView: headerView,
            contentView: contentView
        });

        App.layout.showView(layout, 'Groups.Groups', {});
    };


    Controller.showNewGroup = function() {
        var headerView = new App.Groups.Views.NewGroupHeader();

        var group = new App.Groups.Models.Group();

        var contentView = new App.Groups.Views.NewGroup({
            model: group
        });

        var layout = new App.Core.Layouts.Main({
            headerView: headerView,
            contentView: contentView
        });

        App.layout.showView(layout, 'Groups.NewGroup', {'Groups.Groups': 'right'});
    };
});
