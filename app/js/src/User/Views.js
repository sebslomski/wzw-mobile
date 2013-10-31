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
            this.ladda.start();

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
                    that.ladda.stop();

                    if (res.status === 401) {
                        alert('Ihr Account ist noch nicht aktiviert. Bitte klicken Sie auf den Aktivierungslink in Ihrer Mail.');
                    } else {
                        alert('Ihr Passwort stimmt nicht.');
                    }
                });
        },

        onRender: function() {
            this.ladda = Ladda.create(this.$('button[type=submit]').get(0));
        }
    });
});
