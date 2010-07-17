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

var MatrixTable = new Class({
    Implements: Events,

    initialize: function(id) {
        this.windows = Array();
        this.windows["22-3"] = Array(
                Array(539.50, 263.00),
                Array(539.50, 308.00),
                Array(520.00, 307.00),
                Array(518.50, 265.00)
        );
        this.windows["22-2"] = Array(
                Array(538.50, 194.00),
                Array(538.50, 239.00),
                Array(519.00, 238.00),
                Array(517.50, 196.00)
        );
        this.windows["22-1"] = Array(
                Array(539.50, 120.00),
                Array(539.50, 165.00),
                Array(520.00, 164.00),
                Array(518.50, 122.00)
        );
        this.windows["22-0"] = Array(
                Array(539.50, 51.00),
                Array(539.50, 96.00),
                Array(520.00, 95.00),
                Array(518.50, 53.00)
        );
        this.windows["9-1"] = Array(
                Array(256.00, 120.00),
                Array(259.00, 165.00),
                Array(235.50, 168.00),
                Array(236.00, 122.00)
        );
        this.windows["9-0"] = Array(
                Array(256.00, 49.00),
                Array(259.00, 94.00),
                Array(235.50, 97.00),
                Array(236.00, 51.00)
        );
        this.windows["19-1"] = Array(
                Array(472.00, 122.00),
                Array(472.50, 165.50),
                Array(453.00, 165.50),
                Array(452.50, 124.00)
        );
        this.windows["19-0"] = Array(
                Array(472.00, 52.00),
                Array(472.50, 95.50),
                Array(453.00, 95.50),
                Array(452.50, 54.00)
        );
        this.windows["19-3"] = Array(
                Array(472.50, 262.50),
                Array(473.00, 306.00),
                Array(453.50, 306.00),
                Array(453.00, 264.50)
        );
        this.windows["19-2"] = Array(
                Array(472.00, 193.00),
                Array(472.50, 236.50),
                Array(453.00, 236.50),
                Array(452.50, 195.00)
        );
        this.windows["9-2"] = Array(
                Array(255.00, 192.00),
                Array(258.00, 237.00),
                Array(234.50, 240.00),
                Array(235.00, 194.00)
        );
        this.windows["11-1"] = Array(
                Array(300.50, 121.00),
                Array(301.50, 164.50),
                Array(278.00, 163.50),
                Array(278.50, 125.00)
        );
        this.windows["11-0"] = Array(
                Array(300.50, 49.00),
                Array(301.50, 92.50),
                Array(278.00, 91.50),
                Array(278.50, 53.00)
        );
        this.windows["11-3"] = Array(
                Array(300.50, 261.00),
                Array(301.50, 304.50),
                Array(278.00, 303.50),
                Array(278.50, 265.00)
        );
        this.windows["11-2"] = Array(
                Array(300.50, 191.00),
                Array(301.50, 234.50),
                Array(278.00, 233.50),
                Array(278.50, 195.00)
        );
        this.windows["12-2"] = Array(
                Array(321.00, 193.00),
                Array(321.00, 232.00),
                Array(299.50, 236.50),
                Array(300.00, 194.00)
        );
        this.windows["12-3"] = Array(
                Array(322.00, 266.00),
                Array(322.00, 305.00),
                Array(300.50, 309.50),
                Array(301.00, 267.00)
        );
        this.windows["12-0"] = Array(
                Array(322.00, 52.00),
                Array(322.00, 91.00),
                Array(300.50, 95.50),
                Array(301.00, 53.00)
        );
        this.windows["12-1"] = Array(
                Array(321.00, 123.00),
                Array(321.00, 162.00),
                Array(299.50, 166.50),
                Array(300.00, 124.00)
        );
        this.windows["16-2"] = Array(
                Array(408.50, 194.50),
                Array(409.50, 238.00),
                Array(388.00, 243.00),
                Array(387.00, 193.50)
        );
        this.windows["20-1"] = Array(
                Array(495.00, 121.50),
                Array(496.00, 162.50),
                Array(475.50, 165.50),
                Array(473.00, 119.50)
        );
        this.windows["16-0"] = Array(
                Array(408.50, 51.50),
                Array(409.50, 95.00),
                Array(388.00, 100.00),
                Array(387.00, 50.50)
        );
        this.windows["16-1"] = Array(
                Array(408.50, 120.50),
                Array(409.50, 164.00),
                Array(388.00, 169.00),
                Array(387.00, 119.50)
        );
        this.windows["20-0"] = Array(
                Array(496.00, 52.50),
                Array(497.00, 93.50),
                Array(476.50, 96.50),
                Array(474.00, 50.50)
        );
        this.windows["21-0"] = Array(
                Array(516.50, 50.00),
                Array(518.50, 94.00),
                Array(496.00, 94.50),
                Array(496.00, 54.00)
        );
        this.windows["20-3"] = Array(
                Array(495.00, 263.50),
                Array(496.00, 304.50),
                Array(475.50, 307.50),
                Array(473.00, 261.50)
        );
        this.windows["21-2"] = Array(
                Array(516.50, 190.00),
                Array(518.50, 234.00),
                Array(496.00, 234.50),
                Array(496.00, 194.00)
        );
        this.windows["21-3"] = Array(
                Array(517.50, 259.00),
                Array(519.50, 303.00),
                Array(497.00, 303.50),
                Array(497.00, 263.00)
        );
        this.windows["20-2"] = Array(
                Array(495.00, 193.50),
                Array(496.00, 234.50),
                Array(475.50, 237.50),
                Array(473.00, 191.50)
        );
        this.windows["16-3"] = Array(
                Array(408.50, 263.50),
                Array(409.50, 307.00),
                Array(388.00, 312.00),
                Array(387.00, 262.50)
        );
        this.windows["15-1"] = Array(
                Array(386.50, 120.50),
                Array(387.50, 165.00),
                Array(365.50, 165.50),
                Array(366.00, 123.00)
        );
        this.windows["15-0"] = Array(
                Array(386.50, 50.50),
                Array(387.50, 95.00),
                Array(365.50, 95.50),
                Array(366.00, 53.00)
        );
        this.windows["15-3"] = Array(
                Array(386.50, 261.50),
                Array(387.50, 306.00),
                Array(365.50, 306.50),
                Array(366.00, 264.00)
        );
        this.windows["15-2"] = Array(
                Array(386.50, 190.50),
                Array(387.50, 235.00),
                Array(365.50, 235.50),
                Array(366.00, 193.00)
        );
        this.windows["18-0"] = Array(
                Array(452.00, 52.00),
                Array(453.00, 92.50),
                Array(431.00, 94.00),
                Array(431.50, 50.00)
        );
        this.windows["18-1"] = Array(
                Array(452.00, 123.00),
                Array(453.00, 163.50),
                Array(431.00, 165.00),
                Array(431.50, 121.00)
        );
        this.windows["18-2"] = Array(
                Array(451.00, 193.00),
                Array(452.00, 233.50),
                Array(430.00, 235.00),
                Array(430.50, 191.00)
        );
        this.windows["18-3"] = Array(
                Array(451.00, 264.00),
                Array(452.00, 304.50),
                Array(430.00, 306.00),
                Array(430.50, 262.00)
        );
        this.windows["6-2"] = Array(
                Array(191.50, 195.50),
                Array(192.00, 235.50),
                Array(169.00, 241.00),
                Array(169.00, 193.50)
        );
        this.windows["6-3"] = Array(
                Array(191.50, 263.50),
                Array(192.00, 303.50),
                Array(169.00, 309.00),
                Array(169.00, 261.50)
        );
        this.windows["6-0"] = Array(
                Array(191.50, 50.50),
                Array(192.00, 90.50),
                Array(169.00, 96.00),
                Array(169.00, 48.50)
        );
        this.windows["6-1"] = Array(
                Array(192.50, 123.50),
                Array(193.00, 163.50),
                Array(170.00, 169.00),
                Array(170.00, 121.50)
        );
        this.windows["4-2"] = Array(
                Array(149.00, 190.50),
                Array(148.00, 235.50),
                Array(126.00, 238.50),
                Array(128.50, 192.50)
        );
        this.windows["21-1"] = Array(
                Array(517.50, 122.00),
                Array(519.50, 166.00),
                Array(497.00, 166.50),
                Array(497.00, 126.00)
        );
        this.windows["8-0"] = Array(
                Array(234.50, 51.50),
                Array(234.50, 91.00),
                Array(214.50, 94.50),
                Array(213.50, 49.50)
        );
        this.windows["8-1"] = Array(
                Array(235.50, 124.50),
                Array(235.50, 164.00),
                Array(215.50, 167.50),
                Array(214.50, 122.50)
        );
        this.windows["8-2"] = Array(
                Array(234.50, 194.50),
                Array(234.50, 234.00),
                Array(214.50, 237.50),
                Array(213.50, 192.50)
        );
        this.windows["8-3"] = Array(
                Array(234.50, 265.50),
                Array(234.50, 305.00),
                Array(214.50, 308.50),
                Array(213.50, 263.50)
        );
        this.windows["23-2"] = Array(
                Array(558.50, 191.50),
                Array(561.50, 237.50),
                Array(540.50, 235.50),
                Array(539.00, 193.50)
        );
        this.windows["23-3"] = Array(
                Array(558.50, 259.50),
                Array(561.50, 305.50),
                Array(540.50, 303.50),
                Array(539.00, 261.50)
        );
        this.windows["23-0"] = Array(
                Array(558.50, 51.50),
                Array(561.50, 97.50),
                Array(540.50, 95.50),
                Array(539.00, 53.50)
        );
        this.windows["23-1"] = Array(
                Array(558.50, 122.50),
                Array(561.50, 168.50),
                Array(540.50, 166.50),
                Array(539.00, 124.50)
        );
        this.windows["2-2"] = Array(
                Array(105.50, 191.50),
                Array(105.50, 234.00),
                Array(84.00, 232.00),
                Array(83.50, 189.50)
        );
        this.windows["2-3"] = Array(
                Array(104.50, 265.50),
                Array(104.50, 308.00),
                Array(83.00, 306.00),
                Array(82.50, 263.50)
        );
        this.windows["2-0"] = Array(
                Array(104.50, 51.50),
                Array(104.50, 94.00),
                Array(83.00, 92.00),
                Array(82.50, 49.50)
        );
        this.windows["2-1"] = Array(
                Array(104.50, 120.50),
                Array(104.50, 163.00),
                Array(83.00, 161.00),
                Array(82.50, 118.50)
        );
        this.windows["0-0"] = Array(
                Array(61.50, 51.50),
                Array(61.50, 95.00),
                Array(36.50, 94.00),
                Array(40.50, 51.50)
        );
        this.windows["0-1"] = Array(
                Array(61.50, 121.50),
                Array(61.50, 165.00),
                Array(36.50, 164.00),
                Array(40.50, 121.50)
        );
        this.windows["0-2"] = Array(
                Array(61.50, 191.50),
                Array(61.50, 235.00),
                Array(36.50, 234.00),
                Array(40.50, 191.50)
        );
        this.windows["0-3"] = Array(
                Array(61.50, 262.50),
                Array(61.50, 306.00),
                Array(36.50, 305.00),
                Array(40.50, 262.50)
        );
        this.windows["13-3"] = Array(
                Array(340.00, 261.50),
                Array(343.50, 301.00),
                Array(321.50, 307.00),
                Array(322.50, 264.50)
        );
        this.windows["13-2"] = Array(
                Array(340.00, 192.50),
                Array(343.50, 232.00),
                Array(321.50, 238.00),
                Array(322.50, 195.50)
        );
        this.windows["13-1"] = Array(
                Array(341.00, 118.50),
                Array(344.50, 158.00),
                Array(322.50, 164.00),
                Array(323.50, 121.50)
        );
        this.windows["13-0"] = Array(
                Array(340.00, 49.50),
                Array(343.50, 89.00),
                Array(321.50, 95.00),
                Array(322.50, 52.50)
        );
        this.windows["4-0"] = Array(
                Array(149.00, 49.50),
                Array(148.00, 94.50),
                Array(126.00, 97.50),
                Array(128.50, 51.50)
        );
        this.windows["4-1"] = Array(
                Array(149.00, 119.50),
                Array(148.00, 164.50),
                Array(126.00, 167.50),
                Array(128.50, 121.50)
        );
        this.windows["9-3"] = Array(
                Array(256.00, 260.00),
                Array(259.00, 305.00),
                Array(235.50, 308.00),
                Array(236.00, 262.00)
        );
        this.windows["4-3"] = Array(
                Array(149.00, 260.50),
                Array(148.00, 305.50),
                Array(126.00, 308.50),
                Array(128.50, 262.50)
        );
        this.windows["7-3"] = Array(
                Array(213.00, 305.50),
                Array(192.50, 307.50),
                Array(193.50, 262.00),
                Array(213.00, 266.00)
        );
        this.windows["7-2"] = Array(
                Array(212.00, 233.50),
                Array(191.50, 235.50),
                Array(192.50, 190.00),
                Array(212.00, 194.00)
        );
        this.windows["7-1"] = Array(
                Array(212.00, 164.50),
                Array(191.50, 166.50),
                Array(192.50, 121.00),
                Array(212.00, 125.00)
        );
        this.windows["7-0"] = Array(
                Array(212.00, 92.50),
                Array(191.50, 94.50),
                Array(192.50, 49.00),
                Array(212.00, 53.00)
        );
        this.windows["17-3"] = Array(
                Array(432.00, 265.00),
                Array(431.00, 303.50),
                Array(408.50, 304.50),
                Array(409.00, 266.00)
        );
        this.windows["17-2"] = Array(
                Array(433.00, 195.00),
                Array(432.00, 233.50),
                Array(409.50, 234.50),
                Array(410.00, 196.00)
        );
        this.windows["17-1"] = Array(
                Array(432.00, 123.00),
                Array(431.00, 161.50),
                Array(408.50, 162.50),
                Array(409.00, 124.00)
        );
        this.windows["17-0"] = Array(
                Array(432.00, 52.00),
                Array(431.00, 90.50),
                Array(408.50, 91.50),
                Array(409.00, 53.00)
        );
        this.windows["10-0"] = Array(
                Array(278.50, 51.00),
                Array(278.00, 93.50),
                Array(255.50, 94.50),
                Array(257.50, 50.00)
        );
        this.windows["10-1"] = Array(
                Array(278.50, 123.00),
                Array(278.00, 165.50),
                Array(255.50, 166.50),
                Array(257.50, 122.00)
        );
        this.windows["10-2"] = Array(
                Array(277.50, 195.00),
                Array(277.00, 237.50),
                Array(254.50, 238.50),
                Array(256.50, 194.00)
        );
        this.windows["10-3"] = Array(
                Array(278.50, 265.00),
                Array(278.00, 307.50),
                Array(255.50, 308.50),
                Array(257.50, 264.00)
        );
        this.windows["14-0"] = Array(
                Array(365.50, 54.00),
                Array(366.00, 94.50),
                Array(347.00, 98.50),
                Array(344.50, 51.00)
        );
        this.windows["14-1"] = Array(
                Array(365.00, 122.50),
                Array(365.50, 163.00),
                Array(346.50, 167.00),
                Array(344.00, 119.50)
        );
        this.windows["14-2"] = Array(
                Array(365.50, 194.00),
                Array(366.00, 234.50),
                Array(347.00, 238.50),
                Array(344.50, 191.00)
        );
        this.windows["14-3"] = Array(
                Array(365.50, 264.00),
                Array(366.00, 304.50),
                Array(347.00, 308.50),
                Array(344.50, 261.00)
        );
        this.windows["1-1"] = Array(
                Array(79.50, 119.50),
                Array(80.50, 165.00),
                Array(61.00, 164.00),
                Array(61.00, 120.50)
        );
        this.windows["1-0"] = Array(
                Array(80.50, 46.50),
                Array(81.50, 92.00),
                Array(62.00, 91.00),
                Array(62.00, 47.50)
        );
        this.windows["1-3"] = Array(
                Array(79.50, 260.50),
                Array(80.50, 306.00),
                Array(61.00, 305.00),
                Array(61.00, 261.50)
        );
        this.windows["1-2"] = Array(
                Array(80.50, 191.50),
                Array(81.50, 237.00),
                Array(62.00, 236.00),
                Array(62.00, 192.50)
        );
        this.windows["5-1"] = Array(
                Array(169.50, 120.50),
                Array(169.50, 164.50),
                Array(149.50, 164.00),
                Array(149.50, 125.50)
        );
        this.windows["5-0"] = Array(
                Array(168.50, 50.50),
                Array(168.50, 94.50),
                Array(148.50, 94.00),
                Array(148.50, 55.50)
        );
        this.windows["5-3"] = Array(
                Array(167.50, 260.50),
                Array(167.50, 304.50),
                Array(147.50, 304.00),
                Array(147.50, 265.50)
        );
        this.windows["5-2"] = Array(
                Array(168.50, 190.50),
                Array(168.50, 234.50),
                Array(148.50, 234.00),
                Array(148.50, 195.50)
        );
        this.windows["3-3"] = Array(
                Array(126.00, 308.00),
                Array(104.50, 307.50),
                Array(104.50, 262.50),
                Array(126.50, 266.00)
        );
        this.windows["3-2"] = Array(
                Array(126.00, 237.00),
                Array(104.50, 236.50),
                Array(104.50, 191.50),
                Array(126.50, 195.00)
        );
        this.windows["3-1"] = Array(
                Array(125.00, 165.00),
                Array(103.50, 164.50),
                Array(103.50, 119.50),
                Array(125.50, 123.00)
        );
        this.windows["3-0"] = Array(
                Array(126.00, 94.00),
                Array(104.50, 93.50),
                Array(104.50, 48.50),
                Array(126.50, 52.00)
        );
        
        this.maskImgLoaded = false;
        
        this.maskImg = new Image();
        this.maskImg.src = '/assets/images/matrix-background.png';
        this.maskImg.onload = (function() {
            this.context.drawImage(
                this.maskImg, 0, 0, this.maskImg.width, this.maskImg.height
            );
            
            this.maskImgLoaded = true;
        }).bind(this);
        
        this.canvas = document.getElementById('canvas1');
        this.context = this.canvas.getContext('2d');
        
        this.id = id;
        this.lastColordWindow = undefined;
        
        // register click callback
        color_pixel = (function (ev) {
            ev.stopPropagation();
            ev.preventDefault();
            
            var id = $(ev.target).id;
            if(this.lastColordWindow != id)  {
                this.lastColordWindow = id;
                
                if (id.split('-')[0] == 'cell' && this.clicked) {
                    var col = id.split('-')[1];
                    var row = id.split('-')[2];
                    
                    // call user provided callback with row and col
                    this.fireEvent('click', [row, col]);
                }
            }
        }).bind(this);
        
        
        document.body.addEvent('mouseup', (function(e) {
            this.clicked = false;
        }).bind(this));
        
        
        for (var row = 3; row >= 0; --row) {
            for (var col = 23; col >= 0; --col) {
                eventLayer = $('cell-'+col+'-'+row);
                
                eventLayer.addEvent('mousedown', (function(e) {
                    this.clicked = true;
                    color_pixel(e);
                }).bind(this));
                
                eventLayer.addEvent('mouseout', (function(e) {
                    // More usefull in img.mouseout? oder body.mouseup ?
                    //this.clicked = false;
                }).bind(this));
                
                eventLayer.addEvent('mouseover', (function(e) {
                    if (this.clicked) {
                        color_pixel(e);
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
        }
        
        return true;
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
    }
});
