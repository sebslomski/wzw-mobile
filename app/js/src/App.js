var App = null;

(function() {
    'use strict';

    App = new Backbone.Marionette.Application();

    App.addRegions({
        viewport: 'body'
    });


    App.on('start', function(options) {
        App.options = options;

        NProgress.configure({
            showSpinner: false
        });

        if (navigator.standalone) {
            $('body').addClass('standalone');
        }

        Backbone.history.start({
            silent: true
        });

        App.vent.trigger('App:start');
    });
})();
