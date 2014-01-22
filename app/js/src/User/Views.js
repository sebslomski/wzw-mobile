App.module('User.Views', function(Views, App, Backbone, Marionette, $, _) {
    'use strict';


    Views.Login = Marionette.ItemView.extend({
        template: 'User/Views/Login.html',
        className: 'user-login',

        events: {
            'submit form': 'login'
        },


        login: function(e) {
            e.preventDefault();
            var that = this;

            var data = {
                email: this.$('input[name="user-email"]').val(),
                password: this.$('input[name="user-password"]').val()
            };

            var model = new App.User.Models.Login();
            var loginPromise = model.save(data);

            loginPromise
                .done(function() {
                    App.token = model.get('token');
                    App.Core.Cookie.setCookieData({
                        token: App.token
                    });

                    App.vent.trigger('App.User:loggedIn');
                })
                .fail(function(res) {
                    if (res.status === 401) {
                        alert('Ihr Account ist noch nicht aktiviert. Bitte klicken Sie auf den Aktivierungslink in Ihrer Mail.');
                    } else {
                        alert('Ihr Passwort stimmt nicht.');
                    }
                });
        },

        onRender: function() {
            $('body').addClass('user-auth');
        },

        onClose: function() {
            $('body').removeClass('user-auth');
        }
    });


    Views.ClaimAccount = Marionette.ItemView.extend({
        template: 'User/Views/ClaimAccount.html',
        className: 'user-claim-account',

        events: {
            'submit form': 'claimAccount'
        },


        claimAccount: function(e) {
            e.preventDefault();
            var that = this;

            var data = {
                email: this.$('input[name="user-claim-account-email"]').val(),
                first_name: this.$('input[name="user-claim-account-firstname"]').val(),
                last_name: this.$('input[name="user-claim-account-lastname"]').val(),
                password: this.$('input[name="user-claim-account-password"]').val()
            };

            var loginPromise = this.model.save(data);

            loginPromise
                .done(function() {
                    App.token = that.model.get('token');
                    App.Core.Cookie.setCookieData({
                        token: App.token
                    });

                    App.vent.trigger('App.User:loggedIn');
                });
        },

        onRender: function() {
            $('body').addClass('user-auth');
        },

        onClose: function() {
            $('body').removeClass('user-auth');
        }
    });
});
