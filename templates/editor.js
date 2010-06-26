var Editor = new Class({
    initialize: function(matrix_table, player_controls) {
        this.matrix_table = matrix_table;
        this.player_controls = player_controls;
        this.current_color = new Color(255, 0, 255);

        // initialize matrix click handler
        ed = this;
        this.matrix_table.on_click = function(row, col) {
            var current_frame = ed.player_controls.movie_player.current_frame();
            current_frame.set_color(row, col, ed.current_color);
            ed.player_controls.movie_player.render(current_frame);

            console.info('set color to %s', ed.current_color.to_string());
        };
        
        return this;
    },

    set_color: function(c) {
        this.current_color = c;
    }
});

function init() {
    // Don't use firebug console if not installed
    if (typeof console === "undefined") {
        console = {
            log: function () {},
            info: function () {},
            group: function () {},
            error: function () {},
            warn: function () {},
            groupEnd: function () {}
        };
    }

    if (typeof FileReader === "undefined") {
        alert("FileReader not supported!");
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

    var mv = new Movie();
    var mt = new MatrixTable('matrix-table');
    var mp = new MoviePlayer(mv, mt);
    var pc = new PlayerControls('player-controls', mp);
    var ec = new EditorControls('editor-controls', mp);
    var fc = new FileControls('file-controls', mp);
    var iw = new InfoWidget('movie-info');
    var ed = new Editor(mt, pc);

    // Color picker change callback sets current_color of editor
    var pallet = new Moopick({
	palletParentElement: $('color-picker'),
	palletID: 'colorfoo',
	styles: { width: '15px', height: '15px' }
    });
    pallet.addEvents({
	'onColorClick': function (s) {
	    c = new Color();
	    c.set_from_string(s);
	    ed.set_color(c);
	},
	//'onColorHover': showColor
    });

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
}

window.addEvent('domready', init);
