/*
 *  acabed - webeditor for blinkenlights xml files
 *  Copyright (C) 2010 Raphael Mancini <sepisultrum@hcl-club.lu>
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

var CanvasMatrix = new Class({
    Implements: [Options, Events],
    options: {
        width: 24,              // Width in windows
        height: 4,              // Height in windows
        container_width: 800,   // Width in pixels of the canvas
        container_height: 600,  // Height in pixles of the canvas
        canvas: undefined,
        background_image: undefined,
        row_offset: 0,
        col_offset: 0,
        row_height: 10,
        col_width: 10,
        window_width: 9,
        window_height: 9,
        col_jitter_even: 0,
        col_jitter_odd: 0,
        row_jitter_even: 0,
        row_jitter_odd: 0
    },
    initialize: function(id, options){
        this.setOptions(options);

        this.id = $(id);
        this.canvas = new Element('canvas', {width: this.options.container_width, height: this.options.container_height});
        this.context = this.canvas.getContext("2d");
        this.id.grab(this.canvas);

        this.reset();
    },
    reset: function(height, width) {
        console.info('Resetting matrix');

        this.options.height = height;
        this.options.width = width;

        // Redraw background
        if (this.options.background_image) {
            this.context.drawImage(this.options.background_image,
                                   0, 0,
                                   this.options.container_width,
                                   this.options.container_height);
        } else {
            this.context.fillStyle = 'black';
            this.context.fillRect(0, 0,
                                  this.options.container_width,
                                  this.options.container_height);
        }

        // Recompute pixel rects
        this.compute_pixel_rects();
    },
    compute_pixel_rects: function() {
        this.pixel_rects = [];

        for (var row = 0; row < this.options.height; ++row) {
            this.pixel_rects[row] = [];
            var pixel_row = this.options.row_offset +
                row*this.options.row_height +
                ((row%2) ? this.options.row_jitter_even : this.options.row_jitter_odd);
            for (var col = 0; col < this.options.width; ++col) {
                var pixel_col = this.options.col_offset +
                    col*this.options.col_width +
                    ((col%2) ? this.options.col_jitter_even : this.options.col_jitter_odd);
                this.pixel_rects[row][col] =
                    [pixel_col, pixel_row,
                     this.options.window_width, this.options.window_height];
            }
        }
    },
    set_color: function(row, col, color) {
        var rect = this.pixel_rects[row][col];
        this.context.fillStyle = color.to_string();
        this.context.fillRect(rect[0], rect[1], rect[2], rect[3]);
    },
    set_str_color: function(row, col, color) {
        var c = new Color(0, 0, 0);
        c.set_from_string(color)
        this.set_color(row, col, c);
    },
});

var MatrixTable = new Class({
    Implements: Events,

    initialize: function(id) {
        this.id = id;

        // register click callback
        color_pixel = (function (ev) {
            ev.stopPropagation();
            ev.preventDefault();

            var id = $(ev.target).id;

            if (id.split('-')[0] == 'cell' && this.clicked) {
                var row = id.split('-')[1];
                var col = id.split('-')[2];

                // call user provided callback with row and col
                this.fireEvent('click', [row, col]);
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

    reset: function(height, width) {
        console.info('Resetting MatrixTable');

        // Reset matrix content
        $(this.id).getChildren().each(function (el) { el.dispose(); });
        
        this.height = height;
        this.width = width;

        // Init matrix
        for (var row = 0; row < height; ++row) {
            var row_element = new Element('tr', {'id': 'row-'+row});
            row_element.inject($(this.id));
            for (var col = 0; col < width; ++col) {
                td = new Element('td');
                div = new Element('div', {'id': 'cell-'+row+'-'+col});
                td.grab(div).inject(row_element);
            }
        }

        this.fireEvent('reset');
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
        return $('cell-'+row+'-'+col);
    }
});
