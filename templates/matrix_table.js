var MatrixTable = new Class({
    initialize: function(id) {
        this.id = id

        // register click callback
        color_pixel = (function (ev) {
            ev.stopPropagation();
            ev.preventDefault();

            var id = $(ev.target).id;

            if (id.split('-')[0] == 'element' && this.clicked) {
                var row = id.split('-')[1];
                var col = id.split('-')[2];

                // call user provided callback with row and col
                this.on_click.call(null, row, col);
            }
        }).bind(this);

        $(this.id).addEvent('mousedown', (function(ev) {
            this.clicked = true;
            color_pixel(ev);
        }).bind(this));
        $(this.id).addEvent('mouseup', (function(ev) {
            this.clicked = false;
        }).bind(this));
        $(this.id).addEvent('mouseover', color_pixel);

        return this;
    },

    reset: function(rows, cols) {
        console.info('Resetting MatrixTable');

        // Reset matrix content
        $(this.id).getChildren().each(function (el) { el.dispose(); });
        
        this.rows = rows;
        this.cols = cols;

        // Init matrix
        for (var row = 0; row < rows; ++row) {
            var row_element = new Element('tr', {'id': 'row-'+row});
            row_element.inject($(this.id));
            for (var col = 0; col < cols; ++col) {
                td = new Element('td');
                div = new Element('div', {'id': 'element-'+row+'-'+col});
                td.grab(div).inject(row_element);
            }
        }

        this.on_reset.call();
    },

    set_rgb_color: function(row, col, r, g, b) {
        color = 'rgb('+r+','+g+','+b+')';
        this.image(row, col).setStyle('background-color', color);
    },

    set_str_color: function(row, col, color) {
        this.image(row, col).setStyle('background-color', color);
    },

    set_color: function(row, col, c) {
        this.image(row, col).setStyle('background-color', c.to_string());
    },

    image: function(row, col) {
        return $('element-'+row+'-'+col);
    }
});
