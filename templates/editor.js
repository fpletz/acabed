function Editor(matrix_table, player_controls) {
    this.matrix_table = matrix_table;
    this.player_controls = player_controls;
    this.current_color = new Color(0, 0, 0);

    // initialize matrix click handler
    ed = this;
    this.matrix_table.on_click = function(row, col) {
        var current_frame = ed.player_controls.movie_player.current_frame();
        current_frame.set_color(row, col, ed.current_color);
        ed.player_controls.movie_player.render(current_frame);

        console.info('set color to %s', ed.current_color.to_string());
    };
    
    return this;
}

Editor.prototype = {
    set_color: function(c) {
        this.current_color = c;
    }
};

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
        alert("FileReader not supportet!");
    }

    var mv = new Movie();
    var mt = new MatrixTable('#matrix-table');
    var mp = new MoviePlayer(mv, mt);
    var pc = new PlayerControls('#player-controls', mp);
    var ec = new EditorControls('#editor-controls', mp);
    var fc = new FileControls('#file-controls', mp);
    var iw = new InfoWidget('#movie-info');
    var ed = new Editor(mt, pc);

    // Color picker change callback sets current_color of editor
    $('#color-picker').ColorPicker({flat: true,
                                    color: '#000000',
    	                            onChange: function(hsb, hex, rgb, el) {
                                        c = new Color(0, 0, 0);
                                        c.set_from_string('#'+hex);
                                        ed.set_color(c);
                                    }});

    // Update slider max on MatrixTable reset
    mt.on_reset = function() {
        pc.sl.slider("option", "max", mv.frames-1);
    };
    // Update slider max on Movie resizing
    mv.on_modify = function() {
        pc.sl.slider("option", "max", mv.frames-1);
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
    $.getJSON('animation/list', function(movies) {
        var table = $('<table/>');
        var head_line = $('<tr/>');
        head_line.append($('<th/>').text('ID'));
        head_line.append($('<th/>').text('Name'));        
        table.append(head_line);

        $.each(movies, function(i, movie) {
            var row = $('<tr/>');
            var id = $('<td/>').text(movie.pk);
            var name = $('<td/>').text(movie.fields.name);
            row.append(id);
            row.append(name);
            table.append(row);
        });
        $('#movie-list').append(table);
    });
}

$(document).ready(init);
