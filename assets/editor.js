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
        this.clipboard = null;

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
    },

    current_frame_to_clipboard: function() {
        this.clipboard = this.movie_player.current_frame().copy();
    },

    clipboard_to_current_position: function() {
        if (this.clipboard !== null) {
            this.movie_player.movie.add_frame_at(this.movie_player.current_frame_no+1);
            this.movie_player.movie.set_frame(this.movie_player.current_frame_no+1, this.clipboard.copy());
            this.movie_player.forward(1);
        }
    },
});

// Dirty hack
function fix_frame(xml) {
    return xml.innerHTML.replace(/__frame/g, 'frame');
}

function init_editor() {
    var actions = new WidgetContainer('pixel-tools', {
        widgets: [
            new ImageButton('draw-button', {
                image: '/assets/icons/pencil.png',
                tooltip: 'Farben malen',
                events: {
                    click: function() {
                        MessageWidget.msg('lorem ipsum sit dolor' +
                            ' dak dads kas j as j klkjads klajs dlksd ');
                    },
                },
            }),
            new ImageButton('select-button', {
                image: '/assets/icons/layer-select.png',
                tooltip: 'Bereich auswählen',
                events: {
                    click: function() {alert("test");},
                }
            }),
            new ImageButton('fill-button', {
                image: '/assets/icons/paint-can.png',
                tooltip: 'Füllen',
                events: {
                    click: function() {alert("test");},
                }
            }),
        ],
    });

    var mv = new Movie();
    var mt = new MatrixTable('matrix-table');
    var mp = new MoviePlayer(mv, mt);
    var ed = new Editor(mp);
    var pc = new PlayerControls('player-controls', {'movie_player': mp});

    var frame_inspector = new ObjectInspector(mp.current_frame(), {
        id: 'frame-inspector',
        items: [
            {
                id: 'duration',
                title: 'Duration [ms]',
                description: 'Display time of the current frame.',
                type: 'number',
                max: '50'
            }
        ]
    });

    var movie_inspector = new ObjectInspector(mv, {
        id: 'movie-inspector',
        items: [
            {
                id: 'title',
                title: 'Title',
                description: 'The name of the animation.',
                type: 'text',
                max: '50'
            },
            {
                id: 'description',
                title: 'Description',
                description: 'An optional description that describes the work.',
                type: 'multiline',
                max: '1500',
                height: '5'
            },
            {
                id: 'author',
                title: 'Author',
                description: 'Name of the author',
                type: 'text',
                max: '50'
            },
            {
                id: 'email',
                title: 'E-Mail',
                description: 'Author E-Mail address',
                type: 'text',
                max: '50'
            },
            {
                id: 'loop',
                title: 'Loop video',
                description: 'Should this animation be played more than once.',
                type: 'bool',
            },
            {
                id: 'max_duration',
                title: 'Maximal duration [s]',
                description: 'Maximal play time',
                type: 'number'
            },
        ]
    });

    // Update Frame info
    mp.addEvent('render', (function() {
        frame_inspector.set_model(mp.current_frame());
    }).bind(mp));

    var inspectors = new WidgetContainer('right', {
        widgets: [frame_inspector,
                  movie_inspector],
    });

    var file_toolbar = new WidgetContainer('file-toolbar', {
        widgets: [
            new ImageButton('new-movie-button', {
                image: '/assets/icons/film.png',
                tooltip: 'Neuer Film erstellen',
                events: {
                    click: function() {
                        mp.stop();

                        var d = new ModalDialog('really-new-movie',
                            new Widget('question', {
                                text: 'Wollen sie wirklich einen neuen Film anfangen? Dies verwirft den aktuellen Film!'
                            }),
                            {
                                title: 'Achtung',
                                buttons: [
                                    new Button('open-button', {
                                        text: 'Neuer Film',
                                        events: {
                                            click: function() {
                                                Dajaxice.animations.load_editor('Dajax.process');
                                                MessageWidget.msg('Ein neuer Film wurde erstellt');
                                                ModalDialog.destroy();
                                            },
                                        }
                                    }),
                                     new Button('cancel-button', {
                                        text: 'Abbrechen',
                                        events: {
                                            click: function() {
                                                ModalDialog.destroy();
                                            },
                                        }
                                    }),
                               ],
                            }
                        );
                        d.show();
                    },
                },
            }),
            new ImageButton('load-movie-button', {
                image: '/assets/icons/folder-open-film.png',
                tooltip: 'Film vom Server öffnen',
                events: {
                    click: function() {
                        var d = new ModalDialog('movie-list',
                            new Widget('movie-list', {
                                text: 'lorem ipsum'
                            }),
                            {
                                title: 'Animation öffnen',
                                buttons: [
                                    new Button('open-button', {
                                        text: 'Öffnen',
                                        events: {
                                            click: function() {
                                            },
                                        }
                                    }),
                                     new Button('cancel-button', {
                                        text: 'Abbrechen',
                                        events: {
                                            click: function() {
                                                ModalDialog.destroy();
                                            },
                                        }
                                    }),
                               ],
                            }
                        );
                        d.show();
                    },
                },
            }),
            new ImageButton('save-movie-button', {
                image: '/assets/icons/disk.png',
                tooltip: 'Film abschicken',
                events: {
                    click: function() {
                        Dajaxice.animations.add('Dajax.process', {
                            'animation': mp.movie.to_json()});
                    },
                },
            }),
        ],
    });

    var port_toolbar = new WidgetContainer('port-toolbar', {
        widgets: [
            new FileButton('load-xml-button', {
                image: '/assets/icons/arrow-090.png',
                tooltip: 'Film vom Rechner öffnen',
                events: {
                    change: function() {
                        var d = new ModalDialog('loading-dialog',
                            new Widget('loading', {
                                text: 'Der Film wird geladen'
                            }),
                            {
                                title: 'Bitte Warten',
                            }
                        );
                        d.show();

                        mp.movie.addEvent('loaded', function(mv) {
                            d.hide();
                        });

                        mp.load_file($$('#load-xml-button input')[0].files[0]);
                    },
                },
            }),
            new ImageButton('download-xml-button', {
                image: '/assets/icons/arrow-270.png',
                tooltip: 'Film auf Rechner speichern',
                events: {
                    click: function() {
                        var uri = 'data:text/xml;charset=utf-8,';
                        uri += fix_frame(mp.movie.to_xml());
                        document.location = uri;
                    },
                },
            }),
            // new ImageButton('send-json-button', {
            //     image: '/assets/icons/arrow-curve-000-left.png',
            //     tooltip: 'wtf? xD',
            //     events: {
            //         click: function() {
            //             Dajaxice.animations.add('Dajax.process', {
            //                 'animation': mp.movie.to_json()
            //             });
            //         },
            //     },
            // }),
        ],
    });

    var frametools = new WidgetContainer('frame-tools', {
        widgets: [
            new ImageButton('duplicate-frame-button', {
                image: '/assets/icons/layers-arrange.png',
                tooltip: 'Aktuellen Frame duplizieren',
                events: {
                    click: function() {
                        console.info('duplicate frame: %d', mp.current_frame_no);
                        mv.duplicate_frame_at(mp.current_frame_no);
                        mp.forward(1);
                    },
                },
            }),
            new ImageButton('add-frame-button', {
                image: '/assets/icons/layer--plus.png',
                tooltip: 'Neuen leeren Frame hinzufügen',
                events: {
                    click: function() {
                        console.info('add frame');
                        mv.add_frame_at(mp.current_frame_no+1);
                        mp.forward(1);
                    },
                },
            }),
            new ImageButton('delete-frame-button', {
                image: '/assets/icons/layer--minus.png',
                tooltip: 'Aktuellen Frame löschen',
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
            new ImageButton('copy-frame-button', {
                image: '/assets/icons/document-copy.png',
                tooltip: 'Frame kopieren',
                events: {
                    click: function() {
                        ed.current_frame_to_clipboard();
                    },
                }
            }),
            new ImageButton('paste-frame-button', {
                image: '/assets/icons/clipboard-paste.png',
                tooltip: 'Frame einfügen',
                events: {
                    click: function() {
                        ed.clipboard_to_current_position();
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

