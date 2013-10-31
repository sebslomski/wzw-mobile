App.module('Core.Layouts', function(Layouts, App, Backbone, Marionette, $, _) {
    'use strict';

    Layouts.Main = Backbone.Marionette.Layout.extend({
        template: 'Core/Layout.html',

        regions: {
            headerRegion: '#core-layout-header',
            contentRegion: '#core-layout-content'
        },

        onRender: function() {
            if (this.options.headerView) {
                this.headerRegion.show(this.options.headerView);
            }

            this.$(this.contentRegion.el).css({
                'min-height': $(window).height()
            });

            if (this.options.contentView) {
                this.contentRegion.show(this.options.contentView);
            }
        }
    });
});