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
        this.set_color(new AcabColor(0, 0, 0));
        this.current_tool = new PenTool();
        this.clipboard = null;
        this.options = {
            alpha_use: false,
            alpha_val: 0.5,
            alpha: function() {
                return this.alpha_use?this.alpha_val:1.0;
            },
            alpha_toggle: function() {
                this.alpha_use = !this.alpha_use;
                console.log("toggle alpha %x",this.alpha_use);
            },
        };

        // initialize matrix click handler
        this.movie_player.matrix_table.addEvent('click', (function(row, col) {
            var current_frame = this.movie_player.current_frame();
            this.current_tool.apply_to(current_frame, row, col, this.current_color, this.options);
            this.movie_player.render(current_frame);
        }).bind(this));

        this.movie_player.matrix_table.addEvent('mouseup', (function(row, col) {
            var current_frame = this.movie_player.current_frame();
            if(!(isNaN(row) || isNaN(col))) {
                this.current_tool.reset(current_frame, row, col, this.current_color, this.options);
            }
            this.movie_player.render(current_frame);
        }).bind(this));

        return this;
    },

    set_color: function(c) {
        $('current-color').setStyle('background-color', c.to_string());
        this.current_color = c;
        if(this.picker !== undefined)
            this.picker.setRGB(c.to_array(),1,true);
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

function init_editor(animation) {
    var DIMENSIONS = [6, 16];

    var mv = new Movie(DIMENSIONS[0], DIMENSIONS[1]);
    var mt = new MatrixTable('matrix-table', DIMENSIONS[0], DIMENSIONS[1]);
    var mp = new MoviePlayer(mv, mt);
    var ed = new Editor(mp);
    var pc = new PlayerControls('player-controls', {'movie_player': mp});

    var actions = new RadioContainer('pixel-tools', {
        widgets: [
            new ImageButton('draw-button', {
                image: '/assets/icons/pencil.png',
                tooltip: 'Draw selected color',
                active: true,
                events: {
                    click: function() {
                        ed.current_tool = new PenTool(ed);
                        MessageWidget.msg('Click on a pixel to color it with the current color');
                    },
                },
            }),
            // new ImageButton('select-button', {
            //     image: '/assets/icons/layer-select.png',
            //     tooltip: 'Bereich auswählen',
            //     events: {
            //         click: function() {alert("test");},
            //     }
            // }),
            new ImageButton('fill-button', {
                image: '/assets/icons/paint-can--exclamation.png',
                tooltip: 'Fill frame',
                active: false,
                events: {
                    click: function() {
                        ed.current_tool = new FillTool();
                        MessageWidget.msg('Click on a pixel to color the whole image with selected color');
                    },
                }
            }),

            new ImageButton('floodfill-button', {
                image: '/assets/icons/paint-can.png',
                tooltip: 'Fill a connected region',
                active: false,
                events: {
                    click: function() {
                        ed.current_tool = new FloodfillTool();
                        MessageWidget.msg('Click on a pixel to color the connected region with same color');
                    },
                }
            }),

            new ImageButton('replacecolor-button', {
                image: '/assets/icons/paint-can-color.png',
                tooltip: 'Substitue color',
                active: false,
                events: {
                    click: function() {
                        ed.current_tool = new ReplacecolorTool();
                        MessageWidget.msg('Click on a pixel to substitute all pixels with it\'s color with the selected color');
                    },
                }
            }),

            new ImageButton('colorpicker-button', {
                image: '/assets/icons/pipette-color.png',
                tooltip: 'Color picker',
                active: false,
                events: {
                    click: function() {
                        ed.current_tool = new ColorpickerTool(ed);
                        MessageWidget.msg('Click on a pixel to use it\'s color as the current color');
                    },
                }
            }),

            new ImageButton('move-button', {
                image: '/assets/icons/arrow-move.png',
                tooltip: 'Move',
                active: false,
                events: {
                    click: function() {
                        ed.current_tool = new MoveTool(ed.movie_player.movie.height, ed.movie_player.movie.width);
                        MessageWidget.msg('Drag on a pixel to move the whole frame');
                    },
                }
            }),

            new ImageButton('fliph-button', {
                image: '/assets/icons/arrow-resize-090.png',
                tooltip: 'Flip horizontally',
                active: false,
                events: {
                    click: function() {
                        ed.current_tool = new FliphorizTool();
                        MessageWidget.msg('Click on a pixel to flip the frame horizontally');
                    },
                }
            }),

            new ImageButton('flipv-button', {
                image: '/assets/icons/arrow-resize.png',
                tooltip: 'Flip vertically',
                active: false,
                events: {
                    click: function() {
                        ed.current_tool = new FlipvertTool();
                        MessageWidget.msg('Click on a pixel to flip the frame vertically');
                    },
                }
            }),

            // new ImageButton('reflect-button-vert', {
            //     image: '/assets/icons/arrow-resize.png',
            //     tooltip: 'Mirror vertically',
            //     active: false,
            //     events: {
            //         click: function() {
            //             ed.current_tool = new MirrorTool(true);
            //             MessageWidget.msg('Drag a vertical axis which will be used as a mirror axis');
            //         },
            //     }
            // }),

            // new ImageButton('reflect-button-horiz', {
            //     image: '/assets/icons/arrow-resize-090.png',
            //     tooltip: 'Mirror horizontally',
            //     active: false,
            //     events: {
            //         click: function() {
            //             ed.current_tool = new MirrorTool(false);
            //             MessageWidget.msg('Drag a horizontal axis which will be used as a mirror axis');
            //         },
            //     }
            // }),

            // new ImageButton('gradient-button', {
            //     image: '/assets/icons/rainbow.png',
            //     tooltip: 'Gradient',
            //     active: false,
            //     events: {
            //         click: function() {
            //             ed.current_tool = new GradientTool();
            //             MessageWidget.msg('Draw a line between 2 or 4 Pixels');
            //         },
            //     }
            // }),

            new ImageButton('invert-button', {
                image: '/assets/icons/contrast.png',
                tooltip: 'Invert color',
                active: false,
                events: {
                    click: function() {
                        ed.current_tool = new InvertTool();
                        MessageWidget.msg('Click on pixel to ivert it¸\'s color');
                    },
                },
            }),

	    new ImageButton('life-button', {
                image: '/assets/icons/life.png',
                tooltip: 'Life',
                active: false,
                events: {
                    click: function() {
                        ed.current_tool = new LifeTool();
                        MessageWidget.msg('Conway\'s Game of Life. Klicke auf ein Fenster für eine weitere Generation.');
                    },
                },
            }),
	    
	    new ImageButton('random-button', {
                image: '/assets/icons/random.png',
                tooltip: 'Random',
                active: false,
                events: {
                    click: function() {
                        ed.current_tool = new RandomTool();
                        MessageWidget.msg('Randomly add some pixels in the current color');
                    },
                },
            }),
/*
            new ImageButton('alpha-button', {
                image: '/assets/icons/contrast.png',
                tooltip: 'Alphafarbe zeichnen',
                active: false,
                events: {
                    click: function() {
                        ed.current_tool = new AlphaTool();
                        MessageWidget.msg('Click auf ein Fenster um die Farbe darin mit der aktuellen mit Alpha-Kanal zu übermalen');
                    },
                },
            }),
*/

        ],
    });

    var frame_inspector = new ObjectInspector(mp.current_frame(), {
        id: 'frame-inspector',
        items: [
            {
                id: 'duration',
                title: 'Frame duration/ms',
                description: 'Time in milliseconds (1000ms = 1s) the current frame will be displayed for',
                type: 'number',
                max: '10',
                range: [0,2000],
            }
        ]
    });

    var movie_inspector = new ObjectInspector(mv, {
        id: 'movie-inspector',
        items: [
            {
                id: 'title',
                title: 'Title',
                description: 'Title of your animation',
                type: 'text',
                max: '50'
            },
            {
                id: 'description',
                title: 'Description',
                description: 'More detailed description of your animation',
                type: 'multiline',
                max: '1500',
                height: '5'
            },
            {
                id: 'author',
                title: 'Author',
                description: 'Your name',
                type: 'text',
                max: '50'
            },
            {
                id: 'email',
                title: 'E-Mail',
                description: 'Your email address',
                type: 'text',
                max: '50'
            },
            {
                id: 'max_duration',
                title: 'Movie duration/s',
                description: 'Duration in seconds the movie will be played',
                type: 'number',
                range: [0,60],
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
                tooltip: 'Create new movie',
                events: {
                    click: function() {
                        mp.stop();

                        var d = new ModalDialog('really-new-movie',
                            new Widget('question', {
                                text: 'Do you really want to create a new movie? This will discard your current movie without saving it!'
                            }),
                            {
                                title: 'Alarm',
                                buttons: [
                                    new Button('open-button', {
                                        text: 'New Movie',
                                        events: {
                                            click: function() {
                                                mp.stop(); 
                                                Dajaxice.acab.load_editor('Dajax.process');
                                                MessageWidget.msg('Created new movie');
                                                ModalDialog.destroy();
                                            },
                                        }
                                    }),
                                     new Button('cancel-button', {
                                        text: 'Cancel',
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
                tooltip: 'Load movie from server',
                events: {
                    click: function() {
                        Dajaxice.acab.list((function(animations) {
                            var d = new ModalDialog('movie-list',
                                new TableWidget('movie-list', {
                                    data: animations,
                                    columns: [
                                        ['playlist_id', 'SMS-ID'],
                                        ['title', 'Name'],
                                        ['author', 'Author'],
                                        ['max_duration', 'Duration'],
                                    ],
                                }),
                                {
                                    title: 'Load movie',
                                    buttons: [
                                         new Button('cancel-button', {
                                            text: 'Cancel',
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
                        }));
                    },
                },
            }),
            new ImageButton('save-movie-button', {
                image: '/assets/icons/disk.png',
                tooltip: 'Send movie',
                events: {
                    click: function() {
                        Dajaxice.acab.add('Dajax.process', {
                            'animation': mp.movie.to_json()});
                    },
                },
            }),
        ],
    });

    var port_toolbar = new WidgetContainer('port-toolbar', {
        widgets: [
            // new ImageButton('load-xml-button', {
            //     image: '/assets/icons/arrow-090.png',
            //     tooltip: 'Film aus Zwischenablage öffnen',
            //     events: {
            //         click: function() {
            //             var ta = new Textarea('movie-xml');
            //             var md = new ModalDialog('loading-dialog',
            //                                      ta,
            //                                      {title: 'Bml text ins Textfeld kopieren',
            //                                       buttons: [new Button('load-button',
            //                                                            {text: 'Laden',
            //                                                             events: {
            //                                                                 click: function() {
            //                                                                     mp.load(ta.content());
            //                                                                     ModalDialog.destroy();
            //                                                                 }
            //                                                             }}),
            //                                                 new Button('close-button',
            //                                                            {text: 'Schließen',
            //                                                             events: {
            //                                                                 click: function() {
            //                                                                     ModalDialog.destroy();
            //                                                                 },
            //                                                             }})]})
            //             md.show();
            //         },
            //     },
            // }),
            new FileButton('load-xml-button', {
                image: '/assets/icons/arrow-090.png',
                tooltip: 'Upload movie',
                events: {
                    loaded: function(text) {
                        mp.load(text);
                        ModalDialog.destroy();
                    },
                    
                    clicked: function() {
                        (new ModalDialog(
                            'loading-dialog',
                            new Widget('loading', {
                                text: 'Movie loading'
                            }),
                            {
                                title: 'Please wait',
                            }
                        )).show();
                    },
                },
            }),
            // new ImageButton('download-xml-button', {
            //     image: '/assets/icons/arrow-270.png',
            //     tooltip: 'Film in Zwischenablage kopieren',
            //     events: {
            //         click: function() {
            //             var d = new ModalDialog('movie-xml-dialog',
            //                 new Textarea('movie-xml', {
            //                     content: fix_frame(ed.movie_player.movie.to_xml())
            //                 }),
            //                 {
            //                     title: 'Diesen text kopieren und als movie.bml speichern',
            //                     buttons: [
            //                          new Button('close-button', {
            //                             text: 'Schließen',
            //                             events: {
            //                                 click: function() {
            //                                     ModalDialog.destroy();
            //                                 },
            //                             }
            //                         }),
            //                    ],
            //                 }
            //             );
            //             d.show();
            //         },
            //     },
            // }),
            new ImageButton('download-xml-button', {
                image: '/assets/icons/arrow-270.png',
                tooltip: 'Download movie',
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

    // disabled for now
    /*
    var tooloptions = new OptionsContainer('tool-options', {
        widgets: [
            new ImageButton('activate-alpha', {
                image: '/assets/icons/alpha.png',
                tooltip: 'Deckkraft einstellen',
                active: false,
                events: {
                    click: function(ev) {
                        ed.options.alpha_toggle();
                    },
                },
            }),
        ],
    });
    */

    var frametools = new WidgetContainer('frame-tools', {
        widgets: [
            new ImageButton('duplicate-frame-button', {
                image: '/assets/icons/layers-arrange.png',
                tooltip: 'Duplicate current frame',
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
                tooltip: 'Create new empty frame',
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
                tooltip: 'Delete current frame',
                events: {
                    click: function() {
                        console.info('remove frame');
                        if (mv.frames != 1) {
                            mv.remove_frame_at(mp.current_frame_no);
                            mp.update();
                        } else {
                            console.info('removing last frame');
                            mv.add_frame_at(mp.current_frame_no+1);
                            mv.remove_frame_at(mp.current_frame_no)
                            mp.update();
                        }
                    },
                }
            }),
            new ImageButton('copy-frame-button', {
                image: '/assets/icons/document-copy.png',
                tooltip: 'Copy frame',
                events: {
                    click: function() {
                        ed.current_frame_to_clipboard();
                    },
                }
            }),
            new ImageButton('paste-frame-button', {
                image: '/assets/icons/clipboard-paste.png',
                tooltip: 'Paste frame',
                events: {
                    click: function() {
                        ed.clipboard_to_current_position();
                    },
                }
            }),
        ],
    });

    var set_editor_color = function (color) {
        c = new AcabColor();
        c.set_from_string(color);
        ed.set_color(c);
    };

    // Color picker change callback sets current_color of editor
    ed.picker = new ColorRoller($('color-tools'), {
        color: '#ffffff',
        type: 2,
        space: 'B',
        onChange: set_editor_color,
    });

    /* old picker
    var picker = new Moopick({
        palletParentElement: $('color-tools'),
        palletID: 'colorfoo',
        styles: { width: '10px', height: '10px' }
    });

    picker.addEvents({
        'onColorClick': set_editor_color,
    });
    */

    var d = new Drag('current-color', {
        snap: 0,
        onComplete: function(el, ev) {
            if(ev.target.parentNode.parentNode.id == 'colorpalette-tools')
            {
                var t = ev.target;
                t.setStyle('background-color', el.getStyle('background-color'));
                t.setProperty('html', el.getStyle('background-color'));
            }
        },
    });
    d.attach();

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

    // Prevent accidental unloading of page
    // FIXME: don't always prevent
    window.addEvent('beforeunload', function() {
        return false;
    });

    // Set initial State
    if(animation === undefined) {
        mv.add_frame_at(0);
        mt.reset();
    } else {
        mp.load(undefined, animation);
    }
};

