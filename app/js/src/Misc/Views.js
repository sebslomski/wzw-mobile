App.module('Misc.Views', function(Views, App, Backbone, Marionette, $, _) {
    'use strict';


    Views.Intro = Marionette.ItemView.extend({
        tagName: 'li',
        className: 'misc-intro',

        events: {
            'click #misc-intro-start': 'start'
        },

        initialize: function() {
            this.template = this.model.get('template');
        },

        start: function() {
            App.overlay.close();

            App.Core.Cookie.setCookieData({intro: true});
        }
    });


    Views.Carousel = Marionette.CompositeView.extend({
        className: 'carousel',
        itemViewContainer: 'ul',
        template: 'Misc/Views/Carousel.html',

        initialize: function() {
            var that = this;

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
        },

        onRender: function() {
            var that = this;

            _.defer(function() {
                that.currentPane = 0;
                that.setPaneDimensions();
            });
        },


        showPane: function(index, animate) {
            index = Math.max(0, Math.min(index, this.collection.length - 1));
            this.currentPane = index;

            var offset = -((100 / this.collection.length) * this.currentPane);
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
                    var paneOffset = -(100 / this.collection.length) * this.currentPane;
                    var dragOffset = ((100 / this.$el.width()) * e.gesture.deltaX) / this.collection.length;

                    // slow down at the first and last pane
                    if ((this.currentPane === 0 && e.gesture.direction === 'right') || (this.currentPane === this.collection.length-1 && e.gesture.direction === 'left')) {
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
                    if (Math.abs(e.gesture.deltaX) > this.$el.width() / 2) {
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
            var $container = this.$('ul');
            $container.removeClass('animate');

            if (animate) {
                $container.addClass('animate');
            }

            $container.css('transform', 'translate3d(' + percent + '%,0,0) scale3d(1,1,1)');
        },

        setPaneDimensions: function() {
            var that = this;

            this.$('li').each(function() {
                $(this).css({
                    width: that.$el.width()
                });
            });

            this.$('ul').width(that.$el.width() * this.collection.length);
        }
    });




    Views.IntroCarousel = Views.Carousel.extend({
        itemView: Views.Intro
    });

    App.vent.on('App:start', function() {

        var intro = App.Core.Cookie.getCookieData('intro');

        if (!intro) {
            var carouselView = new Views.IntroCarousel({
                collection: new Backbone.Collection([
                    {template: 'Misc/Views/Intro1.html'},
                    {template: 'Misc/Views/Intro2.html'},
                    {template: 'Misc/Views/Intro3.html'}
                ])
            });

            App.overlay.show(carouselView);
        }
    });


    Views.SettingsHeader = Marionette.ItemView.extend({
        template: 'Misc/Views/SettingsHeader.html',

        events: {
            'click .header-back': 'showBack'
        },

        showBack: function() {
            App.Core.Routing.showRoute('group');
        }
    });


    Views.Settings = Marionette.ItemView.extend({
        template: 'Misc/Views/Settings.html',
        className: 'misc-settings',

        events: {
            'click #settings-feedback': 'showFeedback',
            'click #settings-invite': 'showInvite',
            'click #settings-logout': 'showLogout'
        },

        showLogout: function() {
            App.Core.Routing.showRoute('auth/logout');
        },

        showInvite: function() {
            App.Core.Routing.showRoute('invite');
        },

        showFeedback: function() {
            window.location.href = 'mailto:' + App.options.feedbackEmail + '?subject=Feedback';
        },

        serializeData: function() {
            var data = Marionette.ItemView.prototype.serializeData.call(this);

            data.user = App.User.user.toJSON();

            return data;
        }
    });
});
