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

var Color = new Class({
    initialize: function(r, g, b) {
        this.set_from_rgb(r, g, b);
        
        return this;
    },

    set_from_rgb: function(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    },

    set_from_mono: function(a) {
        this.r = a;
        this.g = a;
        this.b = a;
    },

    set_from_string: function(s) {
        s = s.substr(1, s.length-1);
        if (s.length == 6) {
            this.r = parseInt(s.substr(0, 2), 16);
            this.g = parseInt(s.substr(2, 2), 16);
            this.b = parseInt(s.substr(4, 2), 16);
        } else if (s.length == 3) {
            this.r = parseInt(s[0], 16);
            this.g = parseInt(s[1], 16);
            this.b = parseInt(s[2], 16);
        } else if (s.length == 1 || s.length == 2) {
            this.set_from_mono(parseInt(s, 16));
        }
    },

    to_string: function() {
        var rs = this.r.toString(16);
        var gs = this.g.toString(16);
        var bs = this.b.toString(16);
        if (rs.length == 1) rs = '0'+rs;
        if (gs.length == 1) gs = '0'+gs;
        if (bs.length == 1) bs = '0'+bs;
        return '#'+rs+gs+bs;
    },

    copy: function() {
        return new Color(this.r, this.g, this.b);
    }
});
