// Internal Frame type
function Frame(rows, cols) {
    this.rows = rows;
    this.cols = cols;

    this.duration = 40;

    this.data = new Array(rows);

    var color = new Color(0, 0, 0)

    for (var row = 0; row < rows; ++row) {
        this.data[row] = new Array(cols);
        for (var col = 0; col < cols; ++col) {
            this.data[row][col] = color;
        }
    }

    return this;
}

Frame.prototype = {
    color: function(row, col) {
        return this.data[row][col];
    },
    set_color: function(row, col, color) {
        this.data[row][col] = color;
    },
    // TODO: Handle non 3 color values
    to_xml: function() {
        var frame = $('<__frame></__frame>');
        frame.attr('duration', this.duration);
        
        for (var row = 0; row < this.rows; ++row) {
            var line = '';
            for (var col = 0; col < this.cols; ++col) {
                var color = this.data[row][col].to_string();
                line += color.substr(1, color.length-1);
            }
            line = '<row>'+line+'</row>';
            frame.append(line);
        }

        return frame;
    }
};

function xml_frame_to_frame(xml_frame) {
    f = new Frame(xml_frame.rows, xml_frame.cols);
    f.duration = xml_frame.duration;

    for (var row = 0; row < xml_frame.rows; ++row) {
        for (var col = 0; col < xml_frame.cols; ++col) {
            f.set_color(row, col,
                        xml_frame.color(row, col));
        }
    }
    return f;
}

// Concrete xml based frame implementation
function XmlFrame(rows, cols) {
    this.rows = rows;
    this.cols = cols;

    return this;
}

XmlFrame.prototype = {
    load_xml: function(f, depth, channels) {
        this.frame_xml = $(f);
        this.duration = this.frame_xml.attr('duration');
        this.depth = depth;
        this.channels = channels;
    },
    color: function(row, col) {
        var row = $(this.frame_xml.find('row')[row]);
        var c = new Color(0, 0, 0);
        c.set_from_string('#'+row.text().substr(this.depth*this.channels/4*col, this.depth*this.channels/4));
        return c
    }
};
