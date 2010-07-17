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

var PlayerControls = new Class({
    Extends: WidgetContainer,

    initialize: function(id, options) {
        options.widgets = [
            new ImageButton('play-button', {
                image: '/assets/icons/control.png',
                tooltip: 'Animation abspielen',
                events: {
                    click: function() {
                        if (!options.movie_player.playing) {
                            options.movie_player.play();
                        } else {
                            options.movie_player.pause();
                        } 
                    },
                },
            }),
            new ImageButton('stop-button', {
                image: '/assets/icons/control-stop-square.png',
                tooltip: 'Animation anhalten',
                events: {
                    click: function() {
                        options.movie_player.stop();
                    },
                },
            }),
            new ImageButton('last-button', {
                image: '/assets/icons/control-skip-180.png',
                tooltip: 'Vorheriger Frame',
                events: {
                    click: function() {
                        options.movie_player.pause();
                        options.movie_player.back(1);
                    },
                },
            }),
            new ImageButton('next-button', {
                image: '/assets/icons/control-skip.png',
                tooltip: 'Nächster Frame',
                events: {
                    click: function() {
                        options.movie_player.pause();
                        options.movie_player.forward(1);
                    },
                },
            }),
            new Widget('slider', {
                class: 'button',
            }),
            new Widget('frame-counter', {
                class: '',
                tooltip: 'Aktueller Frame / Anzahl Frames',
            }),
        ];

        this.parent(id, options);
        this.setup_slider(options.movie_player);

        options.movie_player.addEvent('render', (function() {
            $('frame-counter').setProperty('text',
                (this.current_frame_no+1) + ' / ' + this.movie.frames);
        }).bind(options.movie_player));
    },

    setup_slider: function(mp) {
        this.tim = new Element('img', {'src': '/assets/icons/tim-small.png', 'id': 'slider-tim'});
        this.slider_el = $('slider');

        this.slider_el.grab(this.tim);

        function createSlider() {
            return new Slider(this.slider_el.get('id'), this.tim.get('id'), {
                range: [0, mp.movie.frames-1],
                steps: mp.movie.frames-1,
                wheel: true,
                snap: true,
                offset: -2,
                onChange: function(pos) {
                    // not portable to matrix without canvas
                    //if (mp.matrix_table.pixel_rects.length !== 0)
                        mp.set_frame(pos);
                }
            });
        }
        createSlider = createSlider.bind(this)
        
        // Update slider max on MatrixTable reset
        mp.matrix_table.addEvent('reset', (function() {
            if(this.slider !== undefined)
                this.slider.detach()

            this.slider = createSlider();
        }).bind(this));

        mp.addEvent('render', (function(frame_no) {
            this.slider.set(frame_no);
        }).bind(this));
    },
});
