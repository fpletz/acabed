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
            new Button('play-button', {
                image: '/assets/icons/48px-Media-playback-start.svg.png',
                class: 'button',
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
            new Button('stop-button', {
                image: '/assets/icons/48px-Media-playback-stop.svg.png',
                class: 'button',
                events: {
                    click: function() {
                        options.movie_player.stop();
                    },
                },
            }),
            new Button('last-button', {
                image: '/assets/icons/48px-Go-previous.svg.png',
                class: 'button',
                events: {
                    click: function() {
                        options.movie_player.pause();
                        options.movie_player.back(1);
                    },
                },
            }),
            new Button('next-button', {
                image: '/assets/icons/48px-Go-next.svg.png',
                class: 'button',
                events: {
                    click: function() {
                        options.movie_player.pause();
                        options.movie_player.forward(1);
                    },
                },
            }),
            new Widget('slider', {}),
            //this.status = new Element('span', {
            //    'id': 'status-field'
            //}),
        ];

        this.parent(id, options);
        this.setup_slider(options.movie_player);
    },

    setup_slider: function(mp) {
        this.tim = new Element('img', {'src': '/assets/icons/tim.png', 'id': 'slider-tim'});
        this.slider_el = $('slider');

        this.slider_el.grab(this.tim);

        function createSlider() {
            return new Slider(this.slider_el.get('id'), this.tim.get('id'), {
                range: [0, mp.movie.frames-1],
                steps: mp.movie.frames-1,
                wheel: true,
                snap: true,
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

function label_for(id, name) {
    return new Element('label', {
        'for': id,
        'html': name
    });
}

var FileControls = new Class({
    initialize: function(id, movie_player) {
        this.id = id;
        this.movie_player = movie_player;

        var div = $(id);
        var file = new Element('input', {
            'id': 'movie-file',
            'type': 'file'
        });
        var download_button = new Element('img', {
            'src': '/assets/icons/48px-Go-jump.svg.png',
            'alt': 'download xml',
            'id': 'download-button',
            'class': 'icon'
        });
        var br = new Element('br');
        
        div.grab(label_for('movie-file', 'Upload '));
        div.grab(file);
        div.grab(br);
        div.grab(label_for('download-button', 'Download '));
        div.grab(download_button);

        // Click stuff
        download_button.addEvent('click', (function() {
            this.download_click();
        }).bind(this));

        // File stuff
        file.addEvent('change', function() {
            movie_player.load_file(this.files[0])
        });

        return this;
    },

    download_click: function() {
        var uri = 'data:text/xml;charset=utf-8,';
        uri += fix_frame(this.movie_player.movie.to_xml());
        document.location = uri;
    }
});

var InfoWidget = new Class({
    initialize: function(id) {
        this.id = $(id);
        this.fields = ['title', 'description', 'author', 'email', 'url', 'loop', 'height', 'width', 'depth', 'channels', 'frames'];

        return this;
    },

    field_el: function(field) {
        switch (typeof field) {
            case 'string':
                return new Element('input', {'type': 'text', 'value': field});
            case 'number': 
                return new Element('span', { 'html': field });
        }
        return new Element('span');
    },

    update_movie_info: function(movie) {
        this.id.html = '';

        var table = new Element('table');
        var iw = this;
        this.fields.each(function(attr, i) {
            var row = new Element('tr');
            var label = new Element('td', { 'html': attr + ': ' });
            var field = iw.field_el(movie[attr]);
            var data = new Element('td');
            data.grab(field);
            row.grab(label);
            row.grab(data);
            table.grab(row);
        });

        table.inject(this.id);
    }
});

// Dirty hack
function fix_frame(xml) {
    return xml.innerHTML.replace(/__frame/g, 'frame');
}
