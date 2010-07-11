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

var Editor = new Class({
    initialize: function(movie_player) {
        this.movie_player = movie_player;
        this.current_color = new Color(255, 0, 255);

        // initialize matrix click handler
        this.movie_player.matrix_table.addEvent('click', (function(row, col) {
            var current_frame = this.movie_player.current_frame();
            current_frame.set_color(row, col, this.current_color);
            this.movie_player.render(current_frame);

            console.info('set color to %s', this.current_color.to_string());
        }).bind(this));
        
        return this;
    },

    set_color: function(c) {
        this.current_color = c;
    }
});

// Dirty hack
function fix_frame(xml) {
    return xml.innerHTML.replace(/__frame/g, 'frame');
}

function init_editor() {
    var actions = new WidgetContainer('pixel-tools', {
        widgets: [
            new Button('draw-button', {
                events: {
                    click: function() {alert("test");},
                },
                text: 'draw!',
            }),
            new Button('select-button', {
                events: {
                    click: function() {alert("test");},
                }
            }),
            new Button('fill-button', {
                events: {
                    click: function() {alert("test");},
                }
            }),
        ],
    });

    var mv = new Movie();
    /*var bg_image = new Element('img', {src: '/assets/images/matrix-background.png' });
    var mt = new CanvasMatrix('matrix-table', {
        row_offset: 39,
        col_offset: 30,
        row_height: 47,
        col_width: 14.5,
        window_width: 9.4,
        window_height: 19.2,
        col_jitter_even: -2,
        container_width: bg_image.width/1.5,
        container_height: bg_image.height/1.5,
        background_image: bg_image,
    });*/
    var mt = new MatrixTable('matrix-table');
    var mp = new MoviePlayer(mv, mt);
    var ed = new Editor(mp);
    var pc = new PlayerControls('player-controls', {'movie_player': mp});

    var frame_inspector = new ObjectInspector('frame-inspector',
                                              { properties: ['duration'], },
                                              mp.current_frame());

    var movie_inspector = new ObjectInspector('movie-inspector',
                                              { properties: ['title',
                                                             'description',
                                                             'author',
                                                             'email',
                                                             'loop'], },
                                              mv);

    // Update Frame info
    mp.addEvent('render', (function() {
        if (!this.playing) {
            frame_inspector.set_model(mp.current_frame());
        }
    }).bind(mp));

    var inspectors = new WidgetContainer('right', {
        widgets: [frame_inspector,
                  movie_inspector],
    });

    var toolbar = new WidgetContainer('toolbar', {
        widgets: [
            new FileButton('load-xml-button', {
                image: '/assets/icons/48px-Go-jump.svg.png',
                events: {
                    change: function() {
                        mp.load_file($$('#load-xml-button input')[0].files[0]);
                    },
                },
            }),
            new Button('download-xml-button', {
                image: '/assets/icons/48px-Go-jump.svg.png',
                events: {
                    click: function() {
                        var uri = 'data:text/xml;charset=utf-8,';
                        uri += fix_frame(mp.movie.to_xml());
                        document.location = uri;
                    },
                },
            }),
        ],
    });

    var frametools = new WidgetContainer('frame-tools', {
        widgets: [
            new Button('duplicate-frame-button', {
                //image: '',
                events: {
                    click: function() {
                        console.info('duplicate frame: %d', mp.current_frame_no);
                        mv.duplicate_frame_at(mp.current_frame_no);
                        mp.forward(1);
                    },
                },
            }),
            new Button('add-frame-button', {
                image: '/assets/icons/48px-List-add.svg.png',
                events: {
                    click: function() {
                        console.info('add frame');
                        mv.add_frame_at(mp.current_frame_no+1);
                        mp.forward(1);
                    },
                },
            }),
            new Button('delete-frame-button', {
                image: '/assets/icons/48px-List-remove.svg.png',
                events: {
                    click: function() {
                        console.info('remove frame');
                        if (mv.frames > 1) {
                            mv.remove_frame_at(mp.current_frame_no);
                            mp.update();
                        }
                    },
                }
            }),
        ],
    });

    // Color picker change callback sets current_color of editor
    var set_editor_color = function (s) {
        c = new Color();
        c.set_from_string(s);
        ed.set_color(c);
    };

    var picker = new Moopick({
	palletParentElement: $('color-tools'),
	palletID: 'colorfoo',
	styles: { width: '10px', height: '10px' }
    });

    picker.addEvents({
	'onColorClick': set_editor_color,
    });

    // Color picker change callback sets current_color of editor
    var palette = new Palette({
	palletParentElement: $('colorpalette-tools'),
	palletID: 'colorpalettefoo',
	styles: { width: '10px', height: '10px' }
    });
    palette.addEvents({
	'onColorClick': set_editor_color,
    });

    // Update slider max on Movie resizing
    mv.addEvent('modify', function() {
        mt.fireEvent('reset');
        pc.slider.set(mp.current_frame_no);
    });
    mt.addEvent('reset',function() { });

    // Set initial State
    mv.add_frame_at(0);
    mt.reset(4, 24);
};

function init() {
    // Don't use firebug console if not installed
    if (typeof console === 'undefined') {
        console = {
            log: function () {},
            info: function () {},
            group: function () {},
            error: function () {},
            warn: function () {},
            groupEnd: function () {}
        };
    }

    if (typeof FileReader === 'undefined') {
        alert("FileReader not supported! fuck off");
    }

    // omgwtf, iphone or ipad!
    if (navigator.userAgent.contains('iPhone OS')) {
        apple = new Element('div', {
            class: 'applefail',
            styles: {
                position: 'fixed',
                left: 0,
                top: 0,
                width: '100%',
                height: '100%',
                cursor: 'pointer',
                opacity: 0.9,
                zoom: 1,
                'background-color': 'black',
                'z-index': 1,
            },
            events: {
                'click': function(event) {
                    $$('.applefail').setStyle('display', 'none');
                },
            },
        });

        // scaling for the poor
        apimgw = window.innerWidth < 960 ? window.innerWidth : 960;
        apimgh = window.innerHeight < 960 ? window.innerHeight : 960;
        if(apimgw < 960)
            apimgh = apimgw;
        else if(apimgh < 960)
            apimgw = apimgh;

        apimg = new Element('img', {
            src: '/assets/ipad1984.png',
            class: 'applefail',
            styles: {
                width: apimgw,
                height: apimgh,
                position: 'fixed',
                left: window.innerWidth / 2 - apimgw / 2,
                top: window.innerHeight / 2 - apimgh / 2,
                'z-index': 2,
            },
         });
        $$('body').grab(apimg);
        $$('body').grab(apple);
    }

    Dajaxice.animations.login_widget('Dajax.process');
    Dajaxice.animations.load_editor('Dajax.process');
};

window.addEvent('domready', init);
