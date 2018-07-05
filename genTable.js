var genTable = function (obj) {
	// Determine column widths and row heights.
	var col_widths = [];
	var row_heights = [];
	// Loop through rows.
	for (var i = 0; i < obj.data.length; i++) {
		var a = obj.data[i];
		// Loop though columns.
		for (var j = 0; j < a.length; j++) {
			// Replace tabs with spaces.
			obj.data[i][j] = obj.data[i][j].replace(/\t/g, '    ');

			var b = a[j];
			var c = a[j].split(/\n|\r\n/);
			if (i == 0) {
				// Set all of the column widths for first row as a baseline.
				col_widths.push(b.length);
			} else {
				if (obj.markdown) {
					if (b.length > col_widths[j]) {
						col_widths[j] = b.length;
					};
				} else {
					// Loop though each line in a cell to determine max column width.
					for (var k = 0; k < c.length; k++) {
						if (c[k].length > col_widths[j]) {
							col_widths[j] = c[k].length;
						};
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

	var horisontal = function (left, middle, right) {
		// Generate the horisontal row seperators.
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

	for (var i = 0; i < obj.data.length; i++) {
		var a = obj.data[i];
		a = align(a, col_widths, ' ');
	};

	if (obj.markdown) {
		// Markdown Format
		var head = [];
		for (var i = 0; i < obj.data[0].length; i++) {
			head.push('');
		};
		head = align(head, col_widths, '-');
		obj.data.splice(1, 0, head);
		for (var i = 0; i < obj.data.length; i++) {
			var a = obj.data[i];
			a = align(a, col_widths, ' ');
			obj.data[i] = '| ' + a.join(' | ').replace(/\n|\r\n/g, ' ') + ' |';
		};
	} else {
		// ASCII Format
		for (var i = 0; i < obj.data.length; i++) {
			var a = obj.data[i];
			a = align(a, col_widths, ' ');
			if (row_heights[i] == 1) {
				obj.data[i] = '\u2502 ' + a.join(' \u2502 ') + ' \u2502';
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
				obj.data[i] = grid.join('\n');
			};
		};

		var insert = horisontal('\u251C', '\u253C', '\u2524');
		// Insert horisontal lines [middle]
		for (var i = 0; i < obj.data.length; i++) {
			if (i % 2) {
				obj.data.splice(i, 0, insert);
			};
		};

		if (obj.headers != false) {
			obj.data[0] = obj.data[0].toUpperCase();
		};

		// Insert horisontal line [top]
		obj.data.splice(0, 0, horisontal('\u250C', '\u252C', '\u2510'));
		// Insert horisontal line [bottom]
		obj.data.push(horisontal('\u2514', '\u2534', '\u2518'));
	};

	return obj.data.join('\n');
};
