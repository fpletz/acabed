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

function build_app() {
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
    var bg_image = new Element('img', {src: '/assets/images/matrix-background.png' });
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
    });
    var mp = new MoviePlayer(mv, mt);
    var ed = new Editor(mp);
    var pc = new PlayerControls('player-controls', {'movie_player': mp});

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

    build_app();

/*
    var mv = new Movie();
    var mt = new MatrixTable('matrix-table');
    var mp = new MoviePlayer(mv, mt);
    var pc = new PlayerControls('player-controls', mp);
    var ec = new EditorControls('editor-controls', mp);
    var fc = new FileControls('file-controls', mp);
    var iw = new InfoWidget('movie-info');
    var ed = new Editor(mt, pc);



    // Update slider max on Movie resizing
    mv.on_modify = function() {
        mt.on_reset();
        pc.slider.set(mp.current_frame_no);
        mp.update_status();
    };


    // Reset player controls on stop
    mp.on_stop = function() {
        pc.reset();
    };

    // Register Movie info change callback
    mp.on_file_change = function(movie) {
        iw.update_movie_info(movie);
    };
    iw.update_movie_info(mv);

    // Set initial State
    mv.add_frame_at(0);
    mt.reset(4, 24);

    // Load animootions
    var req = new Request.JSON({
	url: 'animation/list',
	onSuccess: function(movies) {
		var table = new Element('table');
		var head_line = new Element('tr');
		head_line.grab(new Element('th', {'html': 'ID'}));
		head_line.grab(new Element('th', {'html': 'Name'}));
		table.grab(head_line);

		movies.each(function(movie, i) {
		    var row = new Element('tr');
		    var id = new Element('td', {'html': movie.pk});
		    var name = new Element('td', {'html': movie.fields.title});
		    row.grab(id);
		    row.grab(name);
		    table.grab(row);
		});
		$('movie-list').grab(table);
	}
    }).get();
*/
};

window.addEvent('domready', init);
