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
        }
    });


    Views.Carousel = Marionette.CompositeView.extend({
        className: 'carousel',
        itemViewContainer: 'ul',
        template: 'Misc/Views/Carousel.html',

        initialize: function() {
            var that = this;
            this.carousel = new App.Misc.Helpers.Carousel({
                el: this.el,
                containerSelector: '> ul',
                childrenSelector: '> ul > li'
            });
        },

        onRender: function() {
            var that = this;

            _.defer(function() {
                that.carousel.initialize();
            });
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


    Views.InviteHeader = Marionette.ItemView.extend({
        template: 'Misc/Views/InviteHeader.html',

        events: {
            'click .header-close': 'showBack'
        },

        showBack: function() {
            App.Core.Routing.showRoute('');
        }
    });


    Views.Invite = Marionette.ItemView.extend({
        className: 'misc-invite',
        template: 'Misc/Views/Invite.html',

        events: {
            'submit form': 'submit',
            'keyup input[name="invite-user-email"]': 'keyupEmail'
        },

        initialize: function() {
            this.users = new App.User.Collections.Users();
        },

        onRender: function() {
            this.$('.misc-settings-already-invited').hide();
            this.laddaButton = Ladda.create(this.$('.ladda-button').get(0));
        },

        submit: function(e) {
            e.preventDefault();
            var that = this;
            this.laddaButton.start();

            this.model.save({
                first_name: this.$('input[name="invite-user-firstname"]').val(),
                last_name: this.$('input[name="invite-user-lastname"]').val(),
                email: this.$('input[name="invite-user-email"]').val()
            }).done(function() {
                App.Core.Routing.showRoute('');
            }).fail(function() {
                alert('Da stimmt was nicht. Bitte überprüfe deine Eingaben.');
                that.laddaButton.stop();
            });
        },

        keyupEmail: function(e) {
            var email = $(e.currentTarget).val();
            var that = this;

            this.users.fetch({
                data: {
                    email: email,
                    strict: true
                }
            }).done(function() {
                that.$('[type="submit"]').attr('disabled', Boolean(that.users.length));
                that.$('[type="text"]').attr('disabled', Boolean(that.users.length));
                that.$('.misc-settings-already-invited').toggle(Boolean(that.users.length));
            });
        },
    });
});
