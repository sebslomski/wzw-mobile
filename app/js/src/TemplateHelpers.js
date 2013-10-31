(function() {
    'use strict';

    /*
     * Add the statisUrl settings variable to the context
     * */
    Handlebars.registerHelper('moment', function(date, format) {
        return moment(date).format(format);
    });


    Handlebars.registerHelper('list', function(items) {
        return items.join(', ')
    });


    Handlebars.registerHelper('static', function(path) {
        return App.options.staticUrl + path;
    });


    Handlebars.registerHelper('equal', function(lvalue, rvalue, options) {
        if (arguments.length < 3) {
            throw {
                name: 'TemplateHelperError',
                message: 'Handlebars Helper equal needs 2 parameters'
            };
        }
        // Don't change that to !== !!!
        if (lvalue != rvalue) {
            return options.inverse(this);
        } else {
            return options.fn(this);
        }
    });


    Handlebars.registerHelper('notequal', function(lvalue, rvalue, options) {
        if (arguments.length < 3) {
            throw {
                name: 'TemplateHelperError',
                message: 'Handlebars Helper equal needs 2 parameters'
            };
        }
        // Don't change that to !== !!!
        if (lvalue != rvalue) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    });
}());
