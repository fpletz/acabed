function MatrixTable(id) {
    this.id = id

    // register click callback
    var mt = this;
    $(this.id).bind('mousedown', function(ev) {
        mt.clicked = true;
    });
    $(this.id).bind('mouseup', function(ev) {
        mt.clicked = false;
    });
    $(this.id).bind('mouseover', function(ev) {
        ev.stopPropagation();
        ev.preventDefault();

        var id = $(ev.target).attr('id');

        if (id.split('-')[0] == 'element' && mt.clicked) {
            var row = id.split('-')[1];
            var col = id.split('-')[2];

            // call user provided callback with row and col
            mt.on_click.call(null, row, col);
        }
    });

    return this;
}

MatrixTable.prototype = {
    reset: function(rows, cols) {
        console.info('Resetting MatrixTable');

        // Reset matrix content
        $(this.id).children().remove();
        
        this.rows = rows;
        this.cols = cols;

        // Init matrix
        for (var row = 0; row < rows; ++row) {
            var row_element = $('<tr></tr>').attr('id', 'row-'+row);
            row_element.appendTo($(this.id));
            for (var col = 0; col < cols; ++col) {
                td = $('<td></td>');
                div = $('<div></div>').attr('id', 'element-'+row+'-'+col);
                td.append(div).appendTo(row_element);
            }
        }

        this.on_reset.call();
    },
    set_rgb_color: function(row, col, r, g, b) {
        color = 'rgb('+r+','+g+','+b+')';
        this.image(row, col).css('background-color', color);
    },
    set_str_color: function(row, col, color) {
        this.image(row, col).css('background-color', color);
    },
    set_color: function(row, col, c) {
        this.image(row, col).css('background-color', c.to_string());
    },
    image: function(row, col) {
        return $('#element-'+row+'-'+col);
    }
};
