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

var MoviePlayer = new Class({
    Implements: Events,

    initialize: function(movie, matrix_table) {
        this.movie = movie;
        this.matrix_table = matrix_table;
        this.current_frame_no = 0;
        this.playing = false;
		
        return this;
    },

    // FIXME: arguments WTF?!
    load: function(xmlContent, json) {
        this.stop();

        if(json === undefined)
            this.movie.load_xml(xmlContent);
        else
            this.movie.from_json(json);

        this.matrix_table.reset(this.movie.height, this.movie.width);
        setTimeout(function() {
            this.update();
            MessageWidget.msg('Animation aus Datei geladen!');
        }.bind(this), 0); // FIXME: HACK
    },

    play: function() {
        // var duration = this.movie.frame(this.current_frame_no).duration;
        this.playing = true;

        // this.interval = setTimeout(function(this_obj) {
        //     this_obj.next_frame()
        // }, duration, this);
        
        this.play_whatever(true);
    },

    play_whatever: function(first) {
        if (this.playing) {
            if (!first) {
                this.next_frame();
            }

            var duration = this.current_frame().duration;
            this.timout = setTimeout(this.play_whatever.bind(this), duration, false);
        }
    },

    pause: function() {
        this.playing = false;
    },

    stop: function() {
        this.rewind();
        this.fireEvent('stop');
        this.playing = false;
    },

    forward: function(no) {
        if (this.current_frame_no + no < this.movie.frames) {
            this.current_frame_no = this.current_frame_no + no;
            this.update();
        }
    },

    back: function(no) {
        if (this.current_frame_no - no >= 0) {
            this.current_frame_no = this.current_frame_no - no;
            this.update();
        }
    },

    next_frame: function() {
        var frame = this.movie.frame(this.current_frame_no)

        if (this.current_frame_no +1 >= this.movie.frames) {
            if (this.movie.loop == 'no') {
                this.stop();
            } else {
                this.rewind();
            }
        } else {
            ++this.current_frame_no;
            this.update();
        }
    },

    rewind: function() {
        this.current_frame_no = 0;
        this.update();
    },

    at_end: function() {
        if (this.current_frame_no >= this.movie.frames-1) {
            return true;
        } else {
            return false;
        }
    },

    render: function(frame) {
        if(this.matrix_table.update(frame.data, this.movie.width, this.movie.height) == false) {
            for (var row = this.movie.height - 1; row >= 0; --row) {
                for (var col = this.movie.width - 1; col >= 0; --col) {
                    this.matrix_table.set_str_color(
                            row, col, frame.data[row][col].to_string());
                }
            }
        }

        this.fireEvent('render', [this.current_frame_no]);
    },

    current_frame: function() {
        return this.movie.frame(this.current_frame_no);
    },

    update: function() {
        if(this.current_frame() === undefined)
            return;

        this.render(this.current_frame());
    },

    set_frame: function(no) {
        this.current_frame_no = no;
        this.update();
    },
});
