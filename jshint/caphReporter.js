'use strict';
var table = require('text-table');
var stringLength = require('string-length');

module.exports = {
	reporter: function (result, config, options) {
		var total = result.length;
		var ret = '';
		var headers = [];
		var prevfile;
		var errorCount = 0;
		var warningCount = 0;

		options = options || {};

		ret += table(result.map(function (el, i) {
			var err = el.error;
			// E: Error, W: Warning, I: Info
			var isError = err.code && err.code[0] === 'E';

			var line = [
				'',
				err.code,
				'line ' + err.line,
				'col ' + err.character,
				err.reason
			];

			if (el.file !== prevfile) {
				headers[i] = el.file;
			}

			if (options.verbose) {
				line.push('(' + err.code + ')');
			}

			if (isError) {
				errorCount++;
			} else {
				warningCount++;
			}

			prevfile = el.file;

			return line;
		}), {
			stringLength: stringLength
		}).split('\n').map(function (el, i) {
			return headers[i] ? '\n' + headers[i] + '\n' + el : el;
		}).join('\n') + '\n\n';

		if (total > 0) {
			if (errorCount > 0) {
				ret += ' error ' + errorCount + (warningCount > 0 ? '\n' : '');
			}

			ret += ' warning ' +  warningCount;
		} else {
			ret += ' No problems';
			ret = '\n' + ret.trim();
		}

		console.log(ret + '\n');
	}
};
