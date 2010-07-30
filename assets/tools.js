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

var Tool = new Class({
    reset: function() {},
});


var PenTool = new Class({
    Extends: Tool,

    apply_to: function(frame, row, col, color) {
        frame.set_color(row, col, color);
    }
});

var FillTool = new Class({
    Extends: Tool,

    apply_to: function(frame, row, col, color) {
        for (var row = 0; row < frame.height; ++row) {
            for (var col = 0; col < frame.width; ++col) {
                frame.set_color(row, col, color);
            }
        }
    }
});

var Helpers = new Class({
    swap_pixels: function(frame, row_a, col_a, row_b, col_b) {
        var tmpcolor = frame.color(row_a, col_a);
        frame.set_color(row_a, col_a, frame.color(row_b, col_b));
        frame.set_color(row_b, col_b, tmpcolor);
    }
});

var FliphorizTool = new Class({
    Extends: Tool,
    Implements: Helpers,

    apply_to: function(frame, row, col, color) {
        var height = frame.height/2;
        var row_max = frame.height-1;
        for (var row = 0; row < height; ++row) {
            for (var col = 0; col < frame.width; ++col) {
                this.swap_pixels(frame, row, col, row_max-row, col);
            }
        }
    }
});

var FlipvertTool = new Class({
    Extends: Tool,
    Implements: Helpers,

    apply_to: function(frame, row, col, color) {
        var width = frame.width/2;
        var col_max = frame.width-1;
        for (var row = 0; row < frame.height; ++row) {
            for (var col = 0; col < width; ++col) {
                this.swap_pixels(frame, row, col, row, col_max-col);
            }
        }
    }
});

var ReplacecolorTool = new Class({
    Extends: Tool,

    apply_to: function(frame, row, col, color) {
        var replaced_color = frame.color(row, col);
        for (var rowi = 0; rowi < frame.height; ++rowi) {
            for (var coli = 0; coli < frame.width; ++coli) {
                if(frame.color(rowi, coli).b === replaced_color.b
                    && frame.color(rowi, coli).r === replaced_color.r
                    && frame.color(rowi, coli).g === replaced_color.g) {
                    frame.set_color(rowi, coli, color);
                }
            }
        }
    }
});

var ColorpickerTool = new Class({
    Extends: Tool,
    Implements: Options,

    options: {
        editor: null,
    },

    initialize: function(editor) {
        // TODO: Select last selected tool after selecting color
        //       (Remember to check if old tool is already Colorpicker don't set old tool)
        this.options.editor = editor;
    },

    apply_to: function(frame, row, col, color) {
        this.options.editor.set_color(frame.color(row,col));
    }
});

var FloodfillTool = new Class({
    Extends: Tool,

    flood_fill: function(frame, row, col, target_color, replacement_color) {
        if(row < 0 || col < 0 || row === frame.height || col === frame.width
            || frame.color(row, col).r !== target_color.r
            || frame.color(row, col).g !== target_color.g
            || frame.color(row, col).b !== target_color.b) {
            return;
        }
        frame.set_color(row, col, replacement_color);
        arguments.callee(frame, row-1, col, target_color, replacement_color);
        arguments.callee(frame, 1+parseInt(row), col, target_color, replacement_color);
        arguments.callee(frame, row, col-1, target_color, replacement_color);
        arguments.callee(frame, row, 1+parseInt(col), target_color, replacement_color);
    },

    apply_to: function(frame, row, col, color) {
        this.flood_fill(frame, row, col, frame.color(row, col), color);
    }
});

var MoveTool = new Class({
    Extends: Tool,
    Implements: Options,

    options: {
        width: null,
        height: null
    },

    initialize: function(height, width) {
        this.options.height = height;
        this.options.width = width;
        this.initialized = false;
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
        if (!this.initialized) {
            this.old_row = row;
            this.old_col = col;
            this.initialized = true
        };
        // var direction = this.get_direction(row, col);
        var direction = [row-this.old_row,
                         col-this.old_col];

        console.log(row, col, this.old_row, this.old_col);
        this.old_row = row;
        this.old_col = col;
        
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
    },

    reset: function() {
        this.initialized = false;
    }
});

var MirrorTool = new Class({
    Extends: Tool,
    Implements: [Options, Helpers],

    options: {
        from: null,
        vert: null
    },

    initialize: function(vert) {
        this.initialized = false;
        this.options.vert = vert;
    },

    vert: function(frame, pointa, pointb) {
console.log("vert %d %d",pointa, pointb);
        if(pointa > pointb) {
            pointa^=pointb;
            pointb^=pointa;
            pointa^=pointb;
        }
        var width_max = Math.min(parseInt(pointa)+1, frame.width-pointb);
        for (var row = 0; row < frame.height; ++row) {
           for (var i = 0; i < width_max; ++i) {
               this.swap_pixels(frame, row, pointa-i, row, (parseInt(pointb)+i));
           }
        }           
    },

    horiz: function(frame, pointa, pointb) {
console.log("horiz %d %d",pointa, pointb);
        if(pointa > pointb) {
            pointa^=pointb;
            pointb^=pointa;
            pointa^=pointb;
        }
        var height_max = Math.min(parseInt(pointa)+1, frame.height-pointb);
        for (var col = 0; col < frame.width; ++col) {
           for (var i = 0; i < height_max; ++i) {
               this.swap_pixels(frame, pointa-i, col, (parseInt(pointb)+i), col);
           }
        }           
    },

    apply_to: function(frame, row, col, color) {
        if (!this.initialized) {
            this.options.from=this.options.vert?col:row;
            this.initialized = true
        };

    },

    reset: function(frame, row, col, color) {
        this.options.vert?this.vert(frame,this.options.from,col):this.horiz(frame,this.options.from,row);
        this.initialized = false;
    },


});


