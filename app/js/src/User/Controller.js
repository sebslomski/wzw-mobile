App.module('User.Controller', function(Controller, App, Backbone, Marionette, $, _) {
    'use strict';


    Controller.showLogin = function() {
        var contentView = new App.User.Views.Login();

        delete App.token;
        App.Core.Cookie.unsetCookieDataItem('token');

        var layout = new App.Core.Layouts.Main({
            contentView: contentView
        });

        App.layout.showView(layout);
    };


    Controller.showClaimAccount = function(claimId) {
        NProgress.start();

        delete App.token;
        App.Core.Cookie.unsetCookieDataItem('token');

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

                App.layout.showView(layout);
            })
            .always(function() {
                NProgress.done();
            });
    };


    Controller.showLogout = function() {
        var model = new App.User.Models.Logout();
        model.destroy()
            .always(function() {
                App.Core.Cookie.unsetCookieDataItem('token');
                App.Core.Routing.showRoute('', {silent: true});
                window.location.reload();
            });
    };
});
