var express = require('express'),
    app     = express(),
    body    = require('body-parser')
    reader  = require('line-reader'),
    chalk   = require('chalk')
    _       = require('lodash');

var definitions = [],
    current_record = null;
    reading_data = false,
    reading_currently = null,
    data_spool = '';

reader.eachLine('readme.md', function(line, last) {
    var route_matches = line.match(/^#+.*?`([a-z]+ .*?)`/i);
    if (route_matches) {
        if (current_record) {
            definitions.push(current_record);
        }

        current_record = {route: route_matches[1].toLowerCase()};
        reading_currently = 'response';
    }
    debugger;
    if (/^#+.*?Request/i.test(line)) {
        reading_currently = 'request';
    }

    if (/^#+.*?Response/i.test(line)) {
        reading_currently = 'response';
    }

    if (/^```/.test(line)) {
        if (reading_data) {
            current_record[reading_currently] = reading_currently === 'request' ? JSON.parse(data_spool) : data_spool;
            data_spool = '';
            reading_data = false;
        } else {
            reading_data = true;
        }
    } else if (reading_data) {
        data_spool += line + "\n";
    }

    if (last) {
        if (current_record) {
            definitions.push(current_record);
        }

        bootServer();
    }
});

function bootServer() {
    app.use(body());
    app.use(function(req, res, next) {
        console.log(chalk.green('Got request ' + (req.method + ' ' + req.url) + (req.body ? ' with body: ' : 'with no body.')));
        if (req.body) {
            console.log(req.body);
        }

        var route = _.find(definitions, function (definition) {
            if ((req.method + ' ' + req.url).toLowerCase() !== definition.route) {
                return false;
            }

            if (_.isUndefined(definition.request)) {
                return true;
            }

            return _.isEqual(definition.request, req.body);
        });

        if (route) {
            console.log(chalk.green('Returning the response:'));
            console.log(route.response);
            res.end(route.response);
        } else {
            console.log(chalk.red('No definitions found for this request!'));
            res.status(404).end();
        }

        console.log("------------------------------\n");
    });

    console.log("Listening on port 3000\n");
    app.listen(3000);
}
