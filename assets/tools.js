var PenTool = new Class({
    apply_to: function(frame, row, col, color) {
        frame.set_color(row, col, color);
    }
});

var FillTool = new Class({
    apply_to: function(frame, row, col, color) {
        for (var row = 0; row < frame.height; ++row) {
            for (var col = 0; col < frame.width; ++col) {
                frame.set_color(row, col, color);
            }
        }
    }
});

var MoveTool = new Class({
    Implements: Options,

    options: {
        width: null,
        height: null
    },

    initialize: function(height, width) {
        this.options.height = height;
        this.options.width = width;
    },
    
    get_direction: function(row, col) {
        console.log("%d %d", col, this.options.width-1);
        if (row == 0) {
            if (col == 0) {
                return [-1, -1];
            } else if (col == this.options.width-1) {
                return [-1, 1];
            } else {
                return [-1, 0];
            }
        } else if (row == this.options.height-1) {
            if (col == 0) {
                return [1, -1];
            } else if (col == this.options.width-1) {
                return [1, 1];
            } else {
                return [1, 0];
            }
        } else {
            if (col == 0) {
                return [0, -1];
            } else if (col == this.options.width-1)  {
                return [0, 1];
            } else {
                return [0, 0];
            }
        }
            
    },

    apply_to: function(frame, row, col, color) {
        var direction = this.get_direction(row, col);
        var frame_copy = frame.copy();

        for (var row = 0; row < frame.height; ++row) {
            for (var col = 0; col < frame.width; ++col) {
                var row_from = row-direction[0];
                var col_from = col-direction[1];

                if (row_from < 0)
                    row_from += frame.height;
                row_from %= frame.height;

                if (col_from < 0)
                    col_from += frame.width;
                col_from %= frame.width;

                frame.set_color(row, col,
                                frame_copy.color(row_from, col_from));
            }
        }
    }

});