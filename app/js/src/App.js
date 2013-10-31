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

        if (navigator.standalone) {
            $('body').addClass('standalone');
        }

        $('.content').css({
            'min-height': $(window).height()
        });

        Backbone.history.start();
    });
})();
