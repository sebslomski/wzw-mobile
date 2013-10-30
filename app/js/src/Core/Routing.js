App.module('Core.Routing', function(Routing, App, Backbone, Marionette, $, _){
    'use strict';

    Routing.Router = Marionette.AppRouter.extend({
        appRoutes: {
            '': 'showInit',
            '*path': 'notFound'
        },

        controller: {
            showInit: function() {
                App.vent.trigger('App.Routing:init');
            },
            notFound: function(path) {
                //Routing.showRoute('');
            }
        }
    });


    App.addInitializer(function() {
        Routing.router = new Routing.Router();
    });


    // Copied from http://github.com/derickbailey/backbone.bbclonemail
    // Public API
    // ----------

    // The `showRoute` method is a private method used to update the 
    // url's hash fragment route. It accepts a base route and an 
    // unlimited number of optional parameters for the route: 
    // `showRoute("foo", "bar", "baz", "etc");`.
    Routing.showRoute = function() {
        var routes = _.toArray(arguments);
        var options = {
            trigger: true
        };

        if (_.isObject(_.last(routes))) {
            options = _.extend(options, _.last(routes));
            delete routes[routes.length -1];
            routes = _.compact(routes);
        }

        if (options.silent) {
            options.trigger = !options.silent;
            delete options.silent;
        }

        var route = getRoutePath(routes);
        Backbone.history.navigate(route, options);
    };

    // Helper Methods
    // --------------

    // Creates a proper route based on the `routeParts`
    // that are passed to it.
    var getRoutePath = function(routeParts) {
        var base = routeParts[0];
        var length = routeParts.length;
        var route = base;

        if (length > 1) {
            for(var i = 1; i < length; i++) {
                var arg = routeParts[i];
                if (arg) {
                    route = route + '/' + arg;
                }
            }
        }
        return route;
    };
});
