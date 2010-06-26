// Internal Frame type
var Frame = new Class({
    initialize: function(height, width, duration) {
        this.height = height;
        this.width = width;
        this.duration = duration;
        this.data = new Array();

        
        for (var row = 0; row < height; ++row) {
            t = new Array();
            for (var col = 0; col < width; ++col) {
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
        
        for (var row = 0; row < this.height; ++row) {
            var line = '';
            for (var col = 0; col < this.width; ++col) {
                var color = this.data[row][col].to_string();
                line += color.substr(1, color.length-1);
            }
            line = new Element('row', {'text': line});
            frame.grab(line);
        }

        return frame;
    },

    copy: function() {
        var f = new Frame(this.height, this.width, this.duration);
        for (var row = 0; row < this.height; ++row) {
            for (var col = 0; col < this.width; ++col) {
                f.set_color(row, col,
                            this.color(row, col).copy());
            }
        }
        return f; 
    }
});

// Concrete xml based frame implementation
var XmlFrame = new Class({
    initialize: function(height, width, depth, channels) {
        this.height = height;
        this.width = width;
        this.depth = depth;
        this.channels = channels;

        return this;
    },

    load_xml: function(f) {
	this.duration = parseInt(f.get('duration'));
	this.rows = f.getElements('row');
        return this;
    },

    colorFromString: function(row_str, col) {
        var c = new Color(0, 0, 0);
        c.set_from_string('#'+row_str.textContent.substr(this.depth*this.channels/4*col, this.depth*this.channels/4));
        return c;
    },

    to_frame: function() {
        frame = new Frame(this.height, this.width, this.duration);
        frame.data = [];

        this.rows.each((function(o) {
            var t = [];
            for(var col = 0; col < this.width; ++col) {
                t.push(this.colorFromString(o, col));
            }
            frame.data.push(t);
        }).bind(this));

        return frame;
    }
});
