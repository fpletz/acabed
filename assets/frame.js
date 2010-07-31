/*
 *  acabed - webeditor for blinkenlights xml files
 *  Copyright (C) 2010 Raffael Mancini <raffael.mancini@hcl-club.lu>
 *                     Franz Pletz <fpletz@fnordicwalking.de>
 *
 *  This file is part of acabed.
 *
 *  acabed is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as
 *  published by the Free Software Foundation, either version 3 of the
 *  License, or (at your option) any later version.
 *
 *  acabed is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

// Internal Frame type
var Frame = new Class({
    Implements: Model,
    
    initialize: function(height, width, duration) {
        this.set('height', height);
        this.set('width', width);
        this.set('duration', duration);
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

    invert_color: function(row, col) {                                                                                                      
        this.set_color(row, col, new Color(255-this.color(row, col).r, 255-this.color(row, col).b, 255-this.color(row, col).g));
    },

    set_color_alpha: function(alpha, row, col, color) {
        this.set_color(row, col, new Color
            (parseInt(color.r*alpha+((1-alpha)*this.color(row, col).r))
            ,parseInt(color.g*alpha+((1-alpha)*this.color(row, col).g))
            ,parseInt(color.b*alpha+((1-alpha)*this.color(row, col).b))));
    },

    // TODO: Handle non 3 color values
    to_xml: function() {
        var frame = new Element('__frame');
        frame.set('duration', this.duration);
        
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

    to_json: function() {
        var frame = new Object();
        frame.duration = this.duration;
        frame.rows = [];
        for (var row = 0; row < this.height; ++row) {
            var line = '';
            for (var col = 0; col < this.width; ++col) {
                var color = this.data[row][col].to_string();
                line += color.substr(1, color.length-1);
            }
            frame.rows.push(line);
        }

        return frame;
    },

    from_json: function(frame) {
        this.set('duration', frame.duration);
        this.data = [];

        frame.rows.each(function(row) {
            var t = [];
            for(var col = 0; col < this.width; ++col) {
                t.push(colorFromString(row, col));
            }
            this.data.push(t);
        }, this);
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

    color_from_string: function (row_str, col) {
        var c = new Color(0, 0, 0);
        c.set_from_string('#'+row_str.substr(this.depth*this.channels/4*col, this.depth*this.channels/4));
        return c;
    },

    to_frame: function() {
        frame = new Frame(this.height, this.width, this.duration);
        frame.data = [];

        this.rows.each((function(o) {
            var t = [];
            for(var col = 0; col < this.width; ++col) {
                // FIXME: textContent for o, XML is fucked
                t.push(this.color_from_string(o, col));
            }
            frame.data.push(t);
        }).bind(this));

        return frame;
    }
});
