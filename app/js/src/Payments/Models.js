App.module('Payments.Models', function(Models, App, Backbone, Marionette, $, _) {
    'use strict';


    Models.Payment = App.Core.Models.Core.extend({
        url: function() {
            return this.baseUrl() + '/group/' + this.groupId + '/payment/';
        }
    });


    Models.Tag = App.Core.Models.Core.extend({
        url: function() {
            return this.baseUrl() + '/group/' + this.groupId + '/tag/';
        }
    });
});
