#!/usr/bin/env node

const fs = require("fs"),
      chalk = require("chalk");

const genTable = function (data) {
  // Determine column widths and row heights.
	var col_widths = [];
	var row_heights = [];

	// Loop through rows.
	for (var i = 0; i < data.length; i++) {
		var a = data[i];
		// Loop though columns.
		for (var j = 0; j < a.length; j++) {
			// Replace tabs with spaces.
			data[i][j] = data[i][j].replace(/\t/g, '    ');

			var b = a[j];
			var c = a[j].split(/\n|\r\n/);
			if (i == 0) {
				// Set all of the column widths for first row as a baseline.
				col_widths.push(b.length);
			} else {
	        // Loop though each line in a cell to determine max column width.
					for (var k = 0; k < c.length; k++) {
						if (c[k].length > col_widths[j]) {
							col_widths[j] = c[k].length;
						};
					};
			};
			if (j == 0) {
				// Set the height of the first column as a baseline.
				row_heights.push(c.length);
			} else {
				if (c.length > row_heights[i]) {
					row_heights[i] = c.length;
				};
			};
		};
	};

	// Add 1 to all widths.
	for (var i = 0; i < col_widths.length; i++) {
		col_widths[i] = col_widths[i] + 1;
	};

  var horizontal = function (left, middle, right) {
		// Generate the horizontal row seperators.
		var row = left;
		for (var i = 0; i < col_widths.length; i++) {
			var l = col_widths[i];
			var t = 0;
			var r = ''
			while (t < l + 2) {
				r += '\u2500';
				t++;
			};
			row += r;
			if (i != col_widths.length - 1) {
				row += middle;
			};
		};
		row += right
		return row;
	};

	var align = function (row, widths, delimiter) {
		// Set the column widths.
		for (var i = 0; i < row.length; i++) {
			while (row[i].length < widths[i]) {
				row[i] += delimiter
			};
		};
		return row;
	};

	for (var i = 0; i < data.length; i++) {
		var a = data[i];
		a = align(a, col_widths, ' ');
	};

  // Unicode Format
  for (var i = 0; i < data.length; i++) {
    var a = data[i];
    a = align(a, col_widths, ' ');
    if (row_heights[i] == 1) {
      data[i] = '\u2502 ' + a.join(' \u2502 ') + ' \u2502';
      // if (i == 0) {
      //   data[i] = '\033[1m' + data[i] + '\033[0m';
      // };
    } else {
      var grid = [];
      for (var j = 0; j < row_heights[i]; j++) {
        grid.push([]);
      };
      for (var j = 0; j < a.length; j++) {
        var b = a[j].split(/\n|\r\n/);
        while (b.length < row_heights[i]) {
          b.push('');
        };
        for (var k = 0; k < b.length; k++) {
          var c = b[k];
          grid[k][j] = c;
        };
      };

      for (var j = 0; j < grid.length; j++) {
        var g = grid[j];
        g = align(g, col_widths, ' ');
        grid[j] = '\u2502 ' + g.join(' \u2502 ') + ' \u2502';
      };
      data[i] = grid.join('\n');
    };
  };

  var insert = horizontal('\u251C', '\u253C', '\u2524');
  // Insert horizontal lines [middle]
  for (var i = 0; i < data.length; i++) {
    if (i % 2) {
      data.splice(i, 0, insert);
    };
  };

  // Insert horizontal line [top]
  data.splice(0, 0, horizontal('\u250C', '\u252C', '\u2510'));
  // Insert horizontal line [bottom]
  data.push(horizontal('\u2514', '\u2534', '\u2518'));

  // Wrap the text in each header cell with bold tags
  //data[1] = data[1].replace(/(\w+)/g, '\033[1m$1\033[0m')
  data[1] = data[1].replace(/(\w+)/g, chalk.hex('#6da0fe').bold('$1'))

	return data.join('\n');
};

var data = fs.readFileSync(0).toString()
data = JSON.parse(data)
var table = genTable(data)

table = table.replace(/\u2718/g, chalk.hex('#ff2500')('\u2718')) // Cross
  .replace(/\u2714/g, chalk.hex('#4cb26e')('\u2714')) // Tick


console.log(table)
