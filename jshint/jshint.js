/**
 *
 */
module.exports = function( grunt ){
	var data = grunt.config.data;
	
	var reporter='config/jshint/caphReporter.js';
	var jshintrc='config/jshint/jshintrc';

	_.merge(data,{
		clean : {
			jshintAngular : [ 'build/angular/caph-angular.jshint*.*' ],
			jshintjQuery : [ 'build/jquery/caph-jquery.jshint*.*' ]
		},
		jshint: {
			options: {
                jshintrc: jshintrc,
                force:true,
                reporter: reporter,
            },
	        angular:{
	            options: {
	                reporterOutput: 'build/angular/caph-angular.jshint.txt'
	            },
	            src: ['src/common/**/*.js', 'src/angular/**/*.js']
	        },
	        jquery:{
	            options: {
	                reporterOutput: 'build/jquery/caph-jquery.jshint.txt'
	            },
	            src: ['src/common/**/*.js', 'src/jquery/**/*.js']
	        }
		}
	 });

    grunt.registerTask('jshintAngular', ['clean:jshintAngular', 'jshint:angular']);
    grunt.registerTask('jshintjQuery', ['clean:jshintjQuery', 'jshint:jquery']);
    grunt.registerTask('jshintAll', ['jshintAngular', 'jshintjQuery']);

};