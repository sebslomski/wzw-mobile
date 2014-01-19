App.module('Groups.Controller', function(Controller, App, Backbone, Marionette, $, _) {
    'use strict';


    Controller.showDefault = function() {
        App.Core.Routing.showRoute('group');
    };


    Controller.showGroups = function() {
        var contentView = new App.Groups.Views.GroupList({
            collection: App.Groups.groups
        });

        var headerView = new App.Groups.Views.GroupListHeader();

        var layout = new App.Core.Layouts.Main({
            headerView: headerView,
            contentView: contentView
        });

        App.viewport.show(layout);
    };
});
