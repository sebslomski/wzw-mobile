App.module('Misc.Controller', function(Controller, App, Backbone, Marionette, $, _) {
    'use strict';


    Controller.showSettings = function() {
        var headerView = new App.Misc.Views.SettingsHeader();

        var contentView = new App.Misc.Views.Settings();

        var layout = new App.Core.Layouts.Main({
            headerView: headerView,
            contentView: contentView
        });

        App.layout.showView(layout, 'Misc.Settings', {
            'Groups.Groups': 'left'
        });
    };


    Controller.showInvite = function() {
        var headerView = new App.Misc.Views.InviteHeader();

        var contentView = new App.Misc.Views.Invite({
            model: new App.Misc.Models.Invite()
        });

        var layout = new App.Core.Layouts.Main({
            headerView: headerView,
            contentView: contentView
        });

        App.layout.showView(layout, 'Misc.Invite', {
            'Groups.Groups': 'fade'
        });
    };
});
