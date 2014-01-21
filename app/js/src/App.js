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

        Backbone.history.start({
            silent: true
        });

        App.vent.trigger('App:start');
    });
})();
