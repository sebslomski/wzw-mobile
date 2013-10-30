App.module('Core.Collections', function(Collections, App, Backbone, Marionette, $, _){
    'use strict';

    Collections.Core = Backbone.Collection.extend({
        model: App.Core.Models.Core,


        baseUrl: function() {
            return App.options.apiUrl;
        },


        url: function() {
            var fullUrl = this.urlRoot;

            if (fullUrl[fullUrl.length - 1] !== '/') {
                fullUrl += '/';
            }

            return this.baseUrl() + fullUrl;
        }
    });



    Collections.Paginator = Collections.Core.extend({
        limit: 10,

        fetch: function(options) {
            options = options || {};

            if (_.isNull(this.next)) {
                return $.Deferred().resolve();
            }

            var data = {
                page: this.next || 1
            };

            if (!_.isEmpty(this.searchQuery)) {
                data = _.extend(data, this.searchQuery);
            }

            options.data = _.extend(data, options.data);
            options = _.extend({remove: false}, options);

            return Collections.Core.prototype.fetch.call(this, options);
        },


        hasNext: function() {
            return !_.isNull(this.next);
        },


        parse: function(response) {
            this.prev = response.prev;
            this.next = response.next;
            this.total_results = response.total_results;
            return response.results;
        },


        search: function(query, showNextPage) {
            if (JSON.stringify(this.searchQuery) === JSON.stringify(query)) {
                if (showNextPage && this.hasNext()) {
                    return this.fetch();
                } else {
                    return $.Deferred().resolve();
                }
            } else {
                this.next = 1;
                this.searchQuery = query;
                return this.fetch({remove: true});
            }
        }
    });
});
