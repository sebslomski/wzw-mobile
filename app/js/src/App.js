var App = null;

(function() {
    'use strict';

    App = new Backbone.Marionette.Application();

    var OverlayRegion = Backbone.Marionette.Region.extend({
        open: function() {
            this.$el.addClass('s-is-visible');
            return Backbone.Marionette.Region.prototype.open.apply(this, arguments);
        },

        close: function() {
            var that = this;

            var duration = 0.2 * 1000;

            var view = this.currentView;
            if (!view || view.isClosed){
                return;
            }

            this.$el.addClass('hide');

            var args = arguments;

            _.delay(function() {
                that.$el.removeClass('s-is-visible hide');
                Backbone.Marionette.Region.prototype.close.apply(that, args);
            }, duration);
        }
    });

    App.addRegions({
        viewport: '#viewport',
        overlay: {
            selector: '#overlay',
            regionType: OverlayRegion
        }
    });


    App.on('start', function(options) {
        App.options = options;

        NProgress.configure({
            showSpinner: false
        });

        if (navigator.standalone) {
            $('body').addClass('standalone');
        }

        $('body').addClass('debug');

        App.layout = new App.Core.Layouts.SwitchPane();

        App.viewport.show(App.layout);

        Backbone.history.start({
            silent: true
        });

        App.vent.trigger('App:start');


        if (options.googleAnalyticsId) {
            /* jshint ignore:start */
            (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
                (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
                m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
            })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

            ga('create', options.googleAnalyticsId, 'purelabs.de');
            ga('send', 'pageview');
            /* jshint ignore:end */
        }
    });
})();
