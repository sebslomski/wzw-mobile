App.module('User.Events', function(Events, App, Backbone, Marionette, $, _) {
    'use strict';


    Events['App.User:login'] = function() {
        App.fragment = Backbone.history.getFragment();

        // If current url is not login, change the url silently
        if (App.fragment.indexOf('auth') !== 0) {
            App.Core.Routing.showRoute('/auth/login', {
                silent: true
            });
        }

        // now load the url to show the view
        Backbone.history.loadUrl();
    };
    App.vent.on('App.User:login', Events['App.User:login']);


    Events['App.User:unauthorized'] = function() {
        App.Core.Cookie.setCookieData(null);
        window.location.reload();
    };
    App.vent.on('App.User:unauthorized', Events['App.User:unauthorized']);


    Events['App.User:loggedIn'] = function(options) {
        // Set the fragment to '' (default route) if the current
        // fragment is 'user/login' to prevent circular routing.
        //var fragment = Backbone.history.getFragment();
        if (App.fragment && App.fragment.indexOf('auth') === 0) {
            App.fragment = '';
        }

        if (!_.isUndefined(App.fragment)) {
            App.Core.Routing.showRoute(App.fragment);
            delete App.fragment;
        } else {
            if (options && options.loadUrl) {
                Backbone.history.loadUrl();
            }
        }

        if (App.options.sentry) {
            Raven.setUser({
                email: App.User.user.get('email'),
                first_name: App.User.user.get('first_name'),
                last_name: App.User.user.get('last_name')
            });
        }
    };
    App.vent.on('App.User:loggedIn', Events['App.User:loggedIn']);



    Events['App:start'] = function() {
        App.token = App.Core.Cookie.getCookieData('token');

        var model = new App.User.Models.Login();
        var loginPromise = model.isLoggedIn();

        loginPromise
            .done(function() {
                // Already logged in
                App.vent.trigger('App.User:loggedIn', {
                    loadUrl: true
                });
            })
            .fail(function() {
                $.ajaxSetup({
                    statusCode: {
                        403: function() {
                            App.vent.trigger('App.User:unauthorized');
                        }
                    }
                });

                App.vent.trigger('App.User:login');
            });
    };

    App.vent.on('App:start', Events['App:start']);
});