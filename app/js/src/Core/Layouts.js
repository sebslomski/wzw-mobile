App.module('Core.Layouts', function(Layouts, App, Backbone, Marionette, $, _) {
    'use strict';

    Layouts.SwitchPane = Backbone.Marionette.ItemView.extend({
        className: 'core-switch-pane',

        render: function() {},

        showView: function(view, viewName, viewInfo) {
            // viewName is viewInfo[key] to key

            var that = this;

            var PANEL_SPEED = 650;
            var PANEL_EASING = 'cubic-bezier(0.23, 1, 0.32, 1)';

            var position;
            var opposite = {
                left: 'right',
                right: 'left'
            };
            var coefficient = {
                left: 1,
                right: -1
            };


            if (this.currentViewName) {
                if (viewInfo[this.currentViewName]) {
                    position = viewInfo[this.currentViewName];
                } else {
                    if (this.currentViewInfo[viewName]) {
                        position = opposite[this.currentViewInfo[viewName]];
                    }
                }
            }

            var oldView = this.currentView;
            this.currentView = view;
            this.currentViewName = viewName;
            this.currentViewInfo = viewInfo;

            position = position || 'fade';

            var $oldEl = this.$('.core-switch-pane-item');
            var $newEl = $('<div class="core-switch-pane-item"></div>');

            view.render();
            $newEl.append(view.el);
            this.$el.append($newEl);

            $oldEl.css({
                opacity: 1,
                transition: 'all 0s'
            });

            if (position === 'fade') {
                $newEl.css({
                    opacity: 0,
                    transition: 'all 0s'
                });

                _.defer(function() {
                    $oldEl.css({
                        opacity: 0,
                        transition: 'all ' + PANEL_SPEED / 1000 * 3/4 + 's'
                    });

                    $newEl.css({
                        opacity: 1,
                        transition: 'all ' + PANEL_SPEED / 1000 + 's'
                    });

                    if ($oldEl.length) {
                        _.delay(function() {
                            $oldEl.remove();
                            oldView.close();
                        }, PANEL_SPEED);
                    }
                });
            } else {
                var selector = '.core-layout > .header, .core-layout > .content, .core-layout > .footer';

                $newEl.find(selector).css({
                    transform: 'translateX(' + this.$el.width() * coefficient[position] * -1 + 'px)',
                    transition: 'all 0s',
                    opacity: 1
                });

                $oldEl.find(selector).css({
                    transition: 'all 0s',
                    opacity: 1
                });

                _.defer(function() {
                    $oldEl.find(selector).css({
                        transform: 'translateX(' + that.$el.width() * coefficient[position] + 'px)',
                        transition: 'all ' + PANEL_SPEED / 1000  + 's ' + PANEL_EASING
                    });

                    $newEl.find(selector).css({
                        transform: 'translateX(0)',
                        transition: 'all ' + PANEL_SPEED / 1000  + 's ' + PANEL_EASING
                    });

                    _.delay(function() {
                        $oldEl.remove();
                        oldView.close();
                    }, PANEL_SPEED);
                });
            }
        }
    });


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
