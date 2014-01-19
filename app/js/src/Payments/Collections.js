App.module('Payments.Collections', function(Collections, App, Backbone, Marionette, $, _) {
    'use strict';


    Collections.Payments = App.Core.Collections.Core.extend({
        model: App.Payments.Models.Payment,

        url: function() {
            return this.baseUrl() + '/group/' + this.groupId + '/payment/';
        },

        initialize: function(models, options) {
            this.groupId = options.groupId;
            App.Core.Collections.Core.prototype.initialize.apply(this, arguments);
        }
    });


    Collections.Tags = App.Core.Collections.Core.extend({
        model: App.Payments.Models.Tag,

        url: function() {
            return this.baseUrl() + '/group/' + this.groupId + '/tag/';
        },

        initialize: function(models, options) {
            this.groupId = options.groupId;
            App.Core.Collections.Core.prototype.initialize.apply(this, arguments);
        }
    });
});
