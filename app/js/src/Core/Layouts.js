App.module('Core.Layouts', function(Layouts, App, Backbone, Marionette, $, _) {
    'use strict';

    var VisibleRegion = Backbone.Marionette.Region.extend({
        open: function() {
            this.$el.addClass('s-is-visible');
            $('body').addClass('s-has-footer');
            return Backbone.Marionette.Region.prototype.open.apply(this, arguments);
        },

        close: function() {
            var view = this.currentView;

            $('body').removeClass('s-has-footer');

            if (!view || view.isClosed){
                return;
            }

            this.$el.removeClass('s-is-visible');
            return Backbone.Marionette.Region.prototype.close.apply(this, arguments);
        }
    });

    Layouts.Main = Backbone.Marionette.Layout.extend({
        template: 'Core/Layout.html',
        className: 'core-layout',

        regions: {
            headerRegion: '#core-layout-header',
            contentRegion: '#core-layout-content',
            footerRegion: {
                selector: '#core-layout-footer',
                regionType: VisibleRegion
            }
        },

        onRender: function() {
            if (this.options.headerView) {
                this.headerRegion.show(this.options.headerView);
            }

            if (this.options.contentView) {
                this.contentRegion.show(this.options.contentView);
            }

            if (this.options.footerView) {
                this.footerRegion.show(this.options.footerView);
            }
        }
    });
});
