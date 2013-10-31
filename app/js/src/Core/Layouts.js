App.module('Core.Layouts', function(Layouts, App, Backbone, Marionette, $, _) {
    'use strict';

    Layouts.Main = Backbone.Marionette.Layout.extend({
        template: 'Core/Layout.html',
        className: 'core-layout',

        regions: {
            headerRegion: '#core-layout-header',
            contentRegion: '#core-layout-content'
        },

        onRender: function() {
            if (this.options.headerView) {
                this.headerRegion.show(this.options.headerView);
            }

            if (this.options.contentView) {
                this.contentRegion.show(this.options.contentView);
            }
        }
    });
});
