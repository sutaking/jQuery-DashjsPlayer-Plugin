module.exports = function(grunt) {

    //var reporter='./jshint/caphReporter.js';
    var jshintrc='./jshint/jshintrc';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean : {
            build : [ '*-jshint-report.html' ]
        },
        jshint: {
            options: {
                reporter: require('jshint-html-reporter'),
                reporterOutput: 'build/'+grunt.template.date('yymmddmmss')+'-jshint-report.html',//
                jshintrc: jshintrc,
            },
            target: ['src/*.js']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.registerTask('default', ['jshint']);
};