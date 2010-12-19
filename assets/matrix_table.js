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

var CanvasTable = new Class({
    Implements: Events,

    initialize: function(id) {
        this.windows = {
            '22-3': [[539.50, 263.00], [539.50, 308.00], [520.00, 307.00], [518.50, 265.00]],
            '22-2': [[538.50, 194.00], [538.50, 239.00], [519.00, 238.00], [517.50, 196.00]],
            '22-1': [[539.50, 120.00], [539.50, 165.00], [520.00, 164.00], [518.50, 122.00]],
            '22-0': [[539.50, 51.00], [539.50, 96.00], [520.00, 95.00], [518.50, 53.00]],
            '9-1': [[256.00, 120.00], [259.00, 165.00], [235.50, 168.00], [236.00, 122.00]],
            '9-0': [[256.00, 49.00], [259.00, 94.00], [235.50, 97.00], [236.00, 51.00]],
            '19-1': [[472.00, 122.00], [472.50, 165.50], [453.00, 165.50], [452.50, 124.00]],
            '19-0': [[472.00, 52.00], [472.50, 95.50], [453.00, 95.50], [452.50, 54.00]],
            '19-3': [[472.50, 262.50], [473.00, 306.00], [453.50, 306.00], [453.00, 264.50]],
            '19-2': [[472.00, 193.00], [472.50, 236.50], [453.00, 236.50], [452.50, 195.00]],
            '9-2': [[255.00, 192.00], [258.00, 237.00], [234.50, 240.00], [235.00, 194.00]],
            '11-1': [[300.50, 121.00], [301.50, 164.50], [278.00, 163.50], [278.50, 125.00]],
            '11-0': [[300.50, 49.00], [301.50, 92.50], [278.00, 91.50], [278.50, 53.00]],
            '11-3': [[300.50, 261.00], [301.50, 304.50], [278.00, 303.50], [278.50, 265.00]],
            '11-2': [[300.50, 191.00], [301.50, 234.50], [278.00, 233.50], [278.50, 195.00]],
            '12-2': [[321.00, 193.00], [321.00, 232.00], [299.50, 236.50], [300.00, 194.00]],
            '12-3': [[322.00, 266.00], [322.00, 305.00], [300.50, 309.50], [301.00, 267.00]],
            '12-0': [[322.00, 52.00], [322.00, 91.00], [300.50, 95.50], [301.00, 53.00]],
            '12-1': [[321.00, 123.00], [321.00, 162.00], [299.50, 166.50], [300.00, 124.00]],
            '16-2': [[408.50, 194.50], [409.50, 238.00], [388.00, 243.00], [387.00, 193.50]],
            '20-1': [[495.00, 121.50], [496.00, 162.50], [475.50, 165.50], [473.00, 119.50]],
            '16-0': [[408.50, 51.50], [409.50, 95.00], [388.00, 100.00], [387.00, 50.50]],
            '16-1': [[408.50, 120.50], [409.50, 164.00], [388.00, 169.00], [387.00, 119.50]],
            '20-0': [[496.00, 52.50], [497.00, 93.50], [476.50, 96.50], [474.00, 50.50]],
            '21-0': [[516.50, 50.00], [518.50, 94.00], [496.00, 94.50], [496.00, 54.00]],
            '20-3': [[495.00, 263.50], [496.00, 304.50], [475.50, 307.50], [473.00, 261.50]],
            '21-2': [[516.50, 190.00], [518.50, 234.00], [496.00, 234.50], [496.00, 194.00]],
            '21-3': [[517.50, 259.00], [519.50, 303.00], [497.00, 303.50], [497.00, 263.00]],
            '20-2': [[495.00, 193.50], [496.00, 234.50], [475.50, 237.50], [473.00, 191.50]],
            '16-3': [[408.50, 263.50], [409.50, 307.00], [388.00, 312.00], [387.00, 262.50]],
            '15-1': [[386.50, 120.50], [387.50, 165.00], [365.50, 165.50], [366.00, 123.00]],
            '15-0': [[386.50, 50.50], [387.50, 95.00], [365.50, 95.50], [366.00, 53.00]],
            '15-3': [[386.50, 261.50], [387.50, 306.00], [365.50, 306.50], [366.00, 264.00]],
            '15-2': [[386.50, 190.50], [387.50, 235.00], [365.50, 235.50], [366.00, 193.00]],
            '18-0': [[452.00, 52.00], [453.00, 92.50], [431.00, 94.00], [431.50, 50.00]],
            '18-1': [[452.00, 123.00], [453.00, 163.50], [431.00, 165.00], [431.50, 121.00]],
            '18-2': [[451.00, 193.00], [452.00, 233.50], [430.00, 235.00], [430.50, 191.00]],
            '18-3': [[451.00, 264.00], [452.00, 304.50], [430.00, 306.00], [430.50, 262.00]],
            '6-2': [[191.50, 195.50], [192.00, 235.50], [169.00, 241.00], [169.00, 193.50]],
            '6-3': [[191.50, 263.50], [192.00, 303.50], [169.00, 309.00], [169.00, 261.50]],
            '6-0': [[191.50, 50.50], [192.00, 90.50], [169.00, 96.00], [169.00, 48.50]],
            '6-1': [[192.50, 123.50], [193.00, 163.50], [170.00, 169.00], [170.00, 121.50]],
            '4-2': [[149.00, 190.50], [148.00, 235.50], [126.00, 238.50], [128.50, 192.50]],
            '21-1': [[517.50, 122.00], [519.50, 166.00], [497.00, 166.50], [497.00, 126.00]],
            '8-0': [[234.50, 51.50], [234.50, 91.00], [214.50, 94.50], [213.50, 49.50]],
            '8-1': [[235.50, 124.50], [235.50, 164.00], [215.50, 167.50], [214.50, 122.50]],
            '8-2': [[234.50, 194.50], [234.50, 234.00], [214.50, 237.50], [213.50, 192.50]],
            '8-3': [[234.50, 265.50], [234.50, 305.00], [214.50, 308.50], [213.50, 263.50]],
            '23-2': [[558.50, 191.50], [561.50, 237.50], [540.50, 235.50], [539.00, 193.50]],
            '23-3': [[558.50, 259.50], [561.50, 305.50], [540.50, 303.50], [539.00, 261.50]],
            '23-0': [[558.50, 51.50], [561.50, 97.50], [540.50, 95.50], [539.00, 53.50]],
            '23-1': [[558.50, 122.50], [561.50, 168.50], [540.50, 166.50], [539.00, 124.50]],
            '2-2': [[105.50, 191.50], [105.50, 234.00], [84.00, 232.00], [83.50, 189.50]],
            '2-3': [[104.50, 265.50], [104.50, 308.00], [83.00, 306.00], [82.50, 263.50]],
            '2-0': [[104.50, 51.50], [104.50, 94.00], [83.00, 92.00], [82.50, 49.50]],
            '2-1': [[104.50, 120.50], [104.50, 163.00], [83.00, 161.00], [82.50, 118.50]],
            '0-0': [[61.50, 51.50], [61.50, 95.00], [36.50, 94.00], [40.50, 51.50]],
            '0-1': [[61.50, 121.50], [61.50, 165.00], [36.50, 164.00], [40.50, 121.50]],
            '0-2': [[61.50, 191.50], [61.50, 235.00], [36.50, 234.00], [40.50, 191.50]],
            '0-3': [[61.50, 262.50], [61.50, 306.00], [36.50, 305.00], [40.50, 262.50]],
            '13-3': [[340.00, 261.50], [343.50, 301.00], [321.50, 307.00], [322.50, 264.50]],
            '13-2': [[340.00, 192.50], [343.50, 232.00], [321.50, 238.00], [322.50, 195.50]],
            '13-1': [[341.00, 118.50], [344.50, 158.00], [322.50, 164.00], [323.50, 121.50]],
            '13-0': [[340.00, 49.50], [343.50, 89.00], [321.50, 95.00], [322.50, 52.50]],
            '4-0': [[149.00, 49.50], [148.00, 94.50], [126.00, 97.50], [128.50, 51.50]],
            '4-1': [[149.00, 119.50], [148.00, 164.50], [126.00, 167.50], [128.50, 121.50]],
            '9-3': [[256.00, 260.00], [259.00, 305.00], [235.50, 308.00], [236.00, 262.00]],
            '4-3': [[149.00, 260.50], [148.00, 305.50], [126.00, 308.50], [128.50, 262.50]],
            '7-3': [[213.00, 305.50], [192.50, 307.50], [193.50, 262.00], [213.00, 266.00]],
            '7-2': [[212.00, 233.50], [191.50, 235.50], [192.50, 190.00], [212.00, 194.00]],
            '7-1': [[212.00, 164.50], [191.50, 166.50], [192.50, 121.00], [212.00, 125.00]],
            '7-0': [[212.00, 92.50], [191.50, 94.50], [192.50, 49.00], [212.00, 53.00]],
            '17-3': [[432.00, 265.00], [431.00, 303.50], [408.50, 304.50], [409.00, 266.00]],
            '17-2': [[433.00, 195.00], [432.00, 233.50], [409.50, 234.50], [410.00, 196.00]],
            '17-1': [[432.00, 123.00], [431.00, 161.50], [408.50, 162.50], [409.00, 124.00]],
            '17-0': [[432.00, 52.00], [431.00, 90.50], [408.50, 91.50], [409.00, 53.00]],
            '10-0': [[278.50, 51.00], [278.00, 93.50], [255.50, 94.50], [257.50, 50.00]],
            '10-1': [[278.50, 123.00], [278.00, 165.50], [255.50, 166.50], [257.50, 122.00]],
            '10-2': [[277.50, 195.00], [277.00, 237.50], [254.50, 238.50], [256.50, 194.00]],
            '10-3': [[278.50, 265.00], [278.00, 307.50], [255.50, 308.50], [257.50, 264.00]],
            '14-0': [[365.50, 54.00], [366.00, 94.50], [347.00, 98.50], [344.50, 51.00]],
            '14-1': [[365.00, 122.50], [365.50, 163.00], [346.50, 167.00], [344.00, 119.50]],
            '14-2': [[365.50, 194.00], [366.00, 234.50], [347.00, 238.50], [344.50, 191.00]],
            '14-3': [[365.50, 264.00], [366.00, 304.50], [347.00, 308.50], [344.50, 261.00]],
            '1-1': [[79.50, 119.50], [80.50, 165.00], [61.00, 164.00], [61.00, 120.50]],
            '1-0': [[80.50, 46.50], [81.50, 92.00], [62.00, 91.00], [62.00, 47.50]],
            '1-3': [[79.50, 260.50], [80.50, 306.00], [61.00, 305.00], [61.00, 261.50]],
            '1-2': [[80.50, 191.50], [81.50, 237.00], [62.00, 236.00], [62.00, 192.50]],
            '5-1': [[169.50, 120.50], [169.50, 164.50], [149.50, 164.00], [149.50, 125.50]],
            '5-0': [[168.50, 50.50], [168.50, 94.50], [148.50, 94.00], [148.50, 55.50]],
            '5-3': [[167.50, 260.50], [167.50, 304.50], [147.50, 304.00], [147.50, 265.50]],
            '5-2': [[168.50, 190.50], [168.50, 234.50], [148.50, 234.00], [148.50, 195.50]],
            '3-3': [[126.00, 308.00], [104.50, 307.50], [104.50, 262.50], [126.50, 266.00]],
            '3-2': [[126.00, 237.00], [104.50, 236.50], [104.50, 191.50], [126.50, 195.00]],
            '3-1': [[125.00, 165.00], [103.50, 164.50], [103.50, 119.50], [125.50, 123.00]],
            '3-0': [[126.00, 94.00], [104.50, 93.50], [104.50, 48.50], [126.50, 52.00]]
        };
        
        this.maskImgLoaded = false;
        this.deferred_update = null;
        
        this.maskImg = new Image();
        this.maskImg.onload = (function() {
            // Do nothing more than just draw something so the user is happy.
            this.context.drawImage(
                this.maskImg, 0, 0, this.maskImg.width, this.maskImg.height
            );
            
            this.maskImgLoaded = true;

            if(this.deferred_update != null)
                this.deferred_update();
        }).bind(this);
        this.maskImg.src = '/assets/images/matrix-background.png';
        
        this.canvas = document.getElementById('canvas1');
        this.context = this.canvas.getContext('2d');
        
        this.id = id;

        // register click callback
        click_callback = (function (ev) {
            ev.stopPropagation();
            ev.preventDefault();
            
            var id = $(ev.target).id;
                
            if (id.split('-')[0] == 'cell' && this.clicked) {
                var col = id.split('-')[1];
                var row = id.split('-')[2];

                // call user provided callback with row and col
                this.fireEvent('click', [row, col]);
            }
        }).bind(this);
        
        document.body.addEvent('mouseup', (function(e) {
            if(!this.clicked)
                return;

            this.clicked = false;
            var colrow = $(e.target).id.split('-');
            this.fireEvent('mouseup', [colrow[2], colrow[1]]);
        }).bind(this));

        for (var row = 3; row >= 0; --row) {
            for (var col = 23; col >= 0; --col) {
                eventLayer = $('cell-'+col+'-'+row);
                
                eventLayer.addEvent('mousedown', (function(e) {
                    this.clicked = true;
                    click_callback(e);
                }).bind(this));
                
                eventLayer.addEvent('mouseover', (function(e) {
                    if (this.clicked) {
                        click_callback(e);
                    }
                }).bind(this));
            }
        }
        
        this.fireEvent('reset');
        
        return this;
    },
    
    /***
     * @ToDo: Is the reset method call from editor.js realy usefull? Doesn't has
     *     this object to take care of it's status by itself and anyone else has
     *     just set set new colors?
     */
    reset: function(height, width) {
        console.info('Resetting MatrixTable');
        this.fireEvent('reset');
    },

    update: function(data, width, height) {
        if(this.maskImgLoaded == true)
        {
            for (var row = height - 1; row >= 0; --row) {
                for (var col = width - 1; col >= 0; --col) {
                    this.context.beginPath();
                    this.context.fillStyle = data[row][col].to_string();
                    
                    var path = this.windows[col+"-"+row];
                    
                    this.context.moveTo(path[0][0], path[0][1]);
                    for(j = path.length - 1; j > 0; j--)
                    {
                        this.context.lineTo(path[j][0], path[j][1]);
                    }
                    
                    this.context.closePath();
                    this.context.fill();
                }
            }
            this.context.drawImage(
                this.maskImg, 0, 0, this.maskImg.width, this.maskImg.height
            );
        } else {
            this.deferred_update = function() {
                this.update(data, width, height);
            }.bind(this);
        }
        
        return true;
    },

    set_rgb_color: function(row, col, r, g, b) {
    },

    set_str_color: function(row, col, color) {
    },

    set_color: function(row, col, c) {
    }
});

var MatrixTable = new Class({
    Implements: Events,

    initialize: function(id, height, width) {
        this.id = id;
        this.height = height;
        this.width = width;

        // register click callback
        click_callback = (function (ev) {
            ev.stopPropagation();
            ev.preventDefault();

            var spl = $(ev.target).id.split('-');

            if (spl[0] == 'oldcell' && this.clicked) {
                var row = spl[1];
                var col = spl[2];

                this.last_clicked = [row, col];

                // call user provided callback with row and col
                this.fireEvent('click', this.last_clicked);
            }
        }).bind(this);

        var el = $(this.id);
        el.addEvent('mouseover', click_callback);

        el.addEvent('mousedown', (function(ev) {
            this.clicked = true;
            click_callback(ev);
        }).bind(this));

        var drag_end = (function(ev) {
            if(!this.clicked)
                return;

            this.clicked = false;
            this.fireEvent('mouseup', this.last_clicked);
        }).bind(this);

        document.body.addEvent('mouseup', drag_end);
        document.addEvent('mouseleave', drag_end);

        this.reset(height, width);

        return this;
    },

    reset: function(height, width) {
        if (height !== undefined && width !== undefined) {
            this.height = height;
            this.width = width;
        }
        
        console.info('Resetting MatrixTable');

        // Reset matrix content
        $(this.id).getChildren().each(function (el) { el.dispose(); });
        
        // Init matrix
        for (var row = 0; row < this.height; ++row) {
            var row_element = new Element('tr', {'id': 'row-'+row});
            row_element.inject($(this.id));
            for (var col = 0; col < this.width; ++col) {
                td = new Element('td');
                div = new Element('div', {'id': 'oldcell-'+row+'-'+col});
                td.grab(div).inject(row_element);
            }
        }

        this.fireEvent('reset');
    },
    
    update: function() {
        return false;
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
        return $('oldcell-'+row+'-'+col);
    }
});
