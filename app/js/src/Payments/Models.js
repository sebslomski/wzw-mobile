App.module('Payments.Models', function(Models, App, Backbone, Marionette, $, _) {
    'use strict';


    Models.Payment = App.Core.Models.Core.extend({
        url: function() {
            var url = this.baseUrl() + '/group/' + this.groupId + '/payment/';

            if (this.id) {
                url += this.id + '/';
            }

            return url;
        },

        isOwner: function() {
            if (this.id) {
                return this.get('user').id === App.User.user.id;
            } else {
                return true;
            }
        }
    });


    Models.Tag = App.Core.Models.Core.extend({
        url: function() {
            return this.baseUrl() + '/group/' + this.groupId + '/tag/';
        }
    });
});
