// Internal Frame type
var Frame = new Class({
    initialize: function(rows, cols, duration) {
        this.rows = rows;
        this.cols = cols;
        this.duration = duration;
        this.data = new Array();

        
        for (var row = 0; row < rows; ++row) {
            t = new Array();
            for (var col = 0; col < cols; ++col) {
                var color = new Color(0, 0, 0);
                t.push(color);
            }
            this.data.push(t);
        }

        return this;
    },

    color: function(row, col) {
        return this.data[row][col];
    },

    set_color: function(row, col, color) {
        this.data[row][col] = color;
    },

    // TODO: Handle non 3 color values
    to_xml: function() {
        var frame = new Element('__frame');
        frame.get('duration', this.duration);
        
        for (var row = 0; row < this.rows; ++row) {
            var line = '';
            for (var col = 0; col < this.cols; ++col) {
                var color = this.data[row][col].to_string();
                line += color.substr(1, color.length-1);
            }
            line = new Element('row', {'text': line});
            frame.grab(line);
        }

        return frame;
    },

    copy: function() {
        var f = new Frame(this.rows, this.cols, this.duration);
        for (var row = 0; row < this.rows; ++row) {
            for (var col = 0; col < this.cols; ++col) {
                f.set_color(row, col,
                            this.color(row, col).copy());
            }
        }
        return f; 
    }
});

// Concrete xml based frame implementation
var XmlFrame = new Class({
    initialize: function(rows, cols, depth, channels) {
        this.rows = rows;
        this.cols = cols;
        this.depth = depth;
        this.channels = channels;

        return this;
    },

    load_xml: function(f) {
        this.frame_xml = f;
        this.duration = parseInt(this.frame_xml.get('duration'));
        return this;
    },

    colorFromString: function(row_str, col) {
        var c = new Color(0, 0, 0);
        c.set_from_string('#'+row_str.textContent.substr(this.depth*this.channels/4*col, this.depth*this.channels/4));
        return c;
    },

    to_frame: function() {
        fpletz = new Frame(this.rows, this.cols, this.duration);
        var xf = this;

        fpletz.data = [];        // fpletz
        this.frame_xml.getElements('row').each(function(o) {
            var t = [];
            for(var col = 0; col < xf.cols; ++ col) {
                t.push(xf.colorFromString(o, col));
            }
            fpletz.data.push(t);
        });

        return fpletz;
    }
});
