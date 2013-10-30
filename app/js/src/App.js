var App = null;

(function() {
    'use strict';

    App = new Backbone.Marionette.Application();

    App.addRegions({
        content: '.content',
        header: '.header'
    });


    App.on('start', function(options) {
        App.options = options;

        Backbone.history.start();
    });
})();
