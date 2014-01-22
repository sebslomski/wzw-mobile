App.module('User.Controller', function(Controller, App, Backbone, Marionette, $, _) {
    'use strict';


    Controller.showLogin = function() {
        var contentView = new App.User.Views.Login();

        var layout = new App.Core.Layouts.Main({
            contentView: contentView
        });

        App.viewport.show(layout);
    };


    Controller.showClaimAccount = function(claimId) {
        NProgress.start();

        var claimAccount = new App.User.Models.ClaimAccount();
        claimAccount.claimId = claimId;

        claimAccount.fetch()
            .done(function() {
                var contentView = new App.User.Views.ClaimAccount({
                    model: claimAccount
                });

                var layout = new App.Core.Layouts.Main({
                    contentView: contentView
                });

                App.viewport.show(layout);
            })
            .always(function() {
                NProgress.done();
            });
    };


    Controller.showLogout = function() {
        var model = new App.User.Models.Logout();
        model.destroy()
            .always(function() {
                App.Core.Cookie.setCookieData(null);
                App.Core.Routing.showRoute('', {silent: true});
                window.location.reload();
            });
    };
});
