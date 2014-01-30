App.module('Misc.Helpers', function(Helpers, App, Backbone, Marionette, $, _) {
    'use strict';

    Helpers.Carousel = function(options) {
        var that = this;
        this.el = options.el;
        this.containerSelector = options.containerSelector;
        this.childrenSelector = options.childrenSelector;

        this.hammertime = new Hammer(this.el, {
            drag_lock_to_axis: true
        });
        this.hammertime.on(
            'release dragleft dragright swipeleft swiperight',
            _.bind(this.handleHammer, this)
        );

        _.each('load resize orientationchange'.split(' '), function(e) {
            that.listenTo(asEvents(window), e, function() {
                that.setPaneDimensions();
            });
        });
    };

    _.extend(Helpers.Carousel.prototype, Backbone.Events, {
        initialize: function() {
            this.currentPane = 0;
            this.setPaneDimensions();
        },

        getChildren: function() {
            return $(this.el).find(this.childrenSelector);
        },

        showPane: function(index, animate) {
            index = Math.max(0, Math.min(index, this.getChildren().length - 1));
            this.currentPane = index;

            var offset = -((100 / this.getChildren().length) * this.currentPane);
            this.setContainerOffset(offset, animate);
        },


        showNext: function() {
            return this.showPane(this.currentPane + 1, true);
        },

        showPrev: function() {
            return this.showPane(this.currentPane - 1, true);
        },


        handleHammer: function(e) {
            e.gesture.preventDefault();

            switch(e.type) {
                case 'dragright':
                case 'dragleft':
                    var paneOffset = -(100 / this.getChildren().length) * this.currentPane;
                    var dragOffset = ((100 / $(this.el).width()) * e.gesture.deltaX) / this.getChildren().length;

                    // slow down at the first and last pane
                    if ((this.currentPane === 0 && e.gesture.direction === 'right') || (this.currentPane === this.getChildren().length-1 && e.gesture.direction === 'left')) {
                        dragOffset *= 0.4;
                    }

                    this.setContainerOffset(dragOffset + paneOffset);
                    break;

                case 'swipeleft':
                    this.showNext();
                    e.gesture.stopDetect();
                    break;

                case 'swiperight':
                    this.showPrev();
                    e.gesture.stopDetect();
                    break;

                case 'release':
                    // more then 50% moved, navigate
                    if (Math.abs(e.gesture.deltaX) > $(this.el).width() / 2) {
                        if (e.gesture.direction === 'right') {
                            this.showPrev();
                        } else {
                            this.showNext();
                        }
                    } else {
                        this.showPane(this.currentPane, true);
                    }

                    break;
            }
        },

        setContainerOffset: function(percent, animate) {
            var $container = $(this.el).find(this.containerSelector);
            $container.removeClass('animate');

            if (animate) {
                $container.addClass('animate');
            }

            $container.css('transform', 'translate3d(' + percent + '%,0,0) scale3d(1,1,1)');
        },

        setPaneDimensions: function() {
            var that = this;

            this.getChildren().each(function() {
                $(this).css({
                    width: $(that.el).width()
                });
            });

            $(this.el).find(this.containerSelector).width(
                $(that.el).width() * this.getChildren().length
            );
        }
    });
});
