'use strict';

var gulp = require('gulp');
var path = require('path');

var service, proxyPort;

/**
 * Run test scripts
 */
gulp.task('test', function(done) {
    var packageJson = require('./package.json');
    if (packageJson.dependencies['@syncfusion/ej2-data'] || packageJson.name === '@syncfusion/ej2-data') {
        console.log('Service Started');
        var spawn = require('child_process').spawn;
        service = spawn('node', [path.join(__dirname, '/spec/services/V4service.js')]);

        service.stdout.on('data', (data) => {
            proxyPort = data.toString().trim();
            console.log('Proxy port: ' + proxyPort);
            startKarma(done);
        });
    } else {
        startKarma(done);
    }
});

function startKarma(done) {
    var karma = require('karma');
    return new karma.Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true,
        browsers: ['PhantomJS']
    }, function(e) {
        if (service) {
            service.kill();
        }
        if (e === 1) {
            console.log('Karma has exited with ' + e);
            process.exit(e);
        } else {
            done();
        }
    }).start();
}