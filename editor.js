function Movie() {
    return this;
}

Movie.prototype = {
    load_xml: function(movie_string) {
        var movie_dom = (new DOMParser()).parseFromString(movie_string, "text/xml");
        this.movie_xml = $(movie_dom);
        header = this.movie_xml.find('header');

        this.title = header.find('title');
        this.description = header.find('description');
        this.author = header.find('author');
        this.email = header.find('email');
        this.url = header.find('url');

        this.rows = this.movie_xml.find('blm').attr('height');
        this.cols = this.movie_xml.find('blm').attr('width');
        this.depth = this.movie_xml.find('blm').attr('bits');
        this.channels = this.movie_xml.find('blm').attr('channels');
        this.frames = this.movie_xml.find('frame').length;

        // Build internal movie representation from xml
        this.data = new Array(this.frames);
        var frames = this.movie_xml.find('frame')
        for (var i = 0; i < this.frames; ++i) {
            var f = new XmlFrame(this.rows, this.cols);
            f.load_xml(frames[i], this.depth, this.channels);
            this.data[i] = xml_frame_to_frame(f);
        }

        console.info("Movie: %s", this.title.text());
        console.info("size: %dx%d, depth: %d, channels: %d, frames: %d", this.rows, this.cols, this.depth, this.channels, this.frames);
    },
    frame: function(no) {
        return this.data[no];
    },
    // TODO corner cases
    add_frame_at: function(at) {
        ++this.frames;
        this.data.splice(at, 0, new Frame(this.rows, this.cols));
        this.on_modify.call();
    },
    remove_frame_at: function(at) {
        --this.frames;
        this.data.splice(at, 1);
        this.on_modify.call();
    }
};

function Color(r, g, b) {
    this.set_from_rgb(r, g, b);
    
    return this;
}

Color.prototype = {
    set_from_rgb: function(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    },
    set_from_mono: function(a) {
        this.r = a;
        this.g = a;
        this.b = a;
    },
    set_from_string: function(s) {
        s = s.substr(1, s.length-1);
        if (s.length == 6) {
            this.r = parseInt(s.substr(0, 2), 16);
            this.g = parseInt(s.substr(2, 2), 16);
            this.b = parseInt(s.substr(4, 2), 16);
        } else if (s.length == 3) {
            this.r = parseInt(s[0], 16);
            this.g = parseInt(s[1], 16);
            this.b = parseInt(s[2], 16);
        } else if (s.length == 1 || s.length == 2) {
            this.set_from_mono(parseInt(s, 16));
        }
    },
    to_string: function() {
        var rs = this.r.toString(16);
        var gs = this.g.toString(16);
        var bs = this.b.toString(16);
        if (rs.length == 1) rs += '0';
        if (gs.length == 1) gs += '0';
        if (bs.length == 1) bs += '0';
        return '#'+rs+gs+bs;
    }
};

// Internal Frame type
function Frame(rows, cols) {
    this.rows = rows;
    this.cols = cols;

    this.data = new Array(rows);

    var color = new Color(0, 0, 0)

    for (var row = 0; row < rows; ++row) {
        this.data[row] = new Array(cols);
        for (var col = 0; col < cols; ++col) {
            this.data[row][col] = color;
        }
    }

    return this;
}

Frame.prototype = {
    color: function(row, col) {
        return this.data[row][col];
    },
    set_color: function(row, col, color) {
        this.data[row][col] = color;
    }
};

function xml_frame_to_frame(xml_frame) {
    f = new Frame(xml_frame.rows, xml_frame.cols);

    for (var row = 0; row < xml_frame.rows; ++row) {
        for (var col = 0; col < xml_frame.cols; ++col) {
            f.set_color(row, col,
                        xml_frame.color(row, col));
        }
    }
    return f;
}

// // TODO Finish
// function frame_to_xml_frame(frame) {
//     f = new XmlFrame(frame.rows, frame.cols);
//     for (var row = 0; row < xml_frame.rows; ++row) {
//         ;
//     }
//     return f;
// }

// Concrete xml based frame implementation
function XmlFrame(rows, cols) {
    this.rows = rows;
    this.cols = cols;

    return this;
}

XmlFrame.prototype = {
    load_xml: function(f, depth, channels) {
        this.frame_xml = $(f);
        this.duration = this.frame_xml.attr('duration');
        this.depth = depth;
        this.channels = channels;
    },
    color: function(row, col) {
        var row = $(this.frame_xml.find('row')[row]);
        var c = new Color(0, 0, 0);
        c.set_from_string('#'+row.text().substr(this.depth*this.channels/4*col, this.depth*this.channels/4));
        return c
    }
};

function MatrixTable(id) {
    this.id = id

    return this;
}

MatrixTable.prototype = {
    reset: function(rows, cols) {
        console.info('Resetting MatrixTable');

        // Reset matrix content
        $(this.id).children().remove();
        
        this.rows = rows;
        this.cols = cols;

        // Init matrix
        for (var row = 0; row < rows; ++row) {
            var row_element = $('<tr></tr>').attr('id', 'row-'+row);
            row_element.appendTo($(this.id));
            for (var col = 0; col < cols; ++col) {
                td = $('<td></td>');
                div = $('<div></div>').attr('id', 'element-'+row+'-'+col);
                td.append(div).appendTo(row_element);
            }
        }

        this.on_reset.call();
    },
    set_rgb_color: function(row, col, r, g, b) {
        color = 'rgb('+r+','+g+','+b+')';
        this.image(row, col).css('background-color', color);
    },
    set_str_color: function(row, col, color) {
        this.image(row, col).css('background-color', color);
    },
    set_color: function(row, col, c) {
        this.image(row, col).css('background-color', c.to_string());
    },
    image: function(row, col) {
        return $('#element-'+row+'-'+col);
    }
};

function MoviePlayer(movie, matrix_table) {
    this.movie = movie;
    this.matrix_table = matrix_table;

    this.current_frame_no = 0;

    return this;
}

MoviePlayer.prototype = {
    load_file: function(file) {
        this.stop();

        if (typeof FileReader === "undefined") {
            alert("FileReader not supportet!");
        } else {
            var reader = new FileReader();
            reader.readAsText(file);

            var mov = this.movie;
            var mat = this.matrix_table;
            var mp = this;

            reader.onloadend = function() {
                mov.load_xml(reader.result);
                mat.reset(mov.rows, mov.cols);

                f = mov.frame(0);
                fr = xml_frame_to_frame(f);

                mp.update();
            };
        }
    },
    play: function() {
        var duration = this.movie.frame(this.current_frame_no).duration;
        this.interval = setInterval(function(this_obj) {
            this_obj.next_frame()
        }, duration, this);
    },
    pause: function() {
        clearInterval(this.interval);
    },
    stop: function() {
        clearInterval(this.interval);
        this.current_frame_no = 0;
    },
    forward: function(no) {
        if (this.current_frame_no + no < this.movie.frames) {
            this.current_frame_no = this.current_frame_no + no;
            this.update();
        }
    },
    back: function(no) {
        if (this.current_frame_no - no >= 0) {
            this.current_frame_no = this.current_frame_no - no;
            this.update();
        }
    },
    next_frame: function() {
        var frame = this.movie.frame(this.current_frame_no)

        if (this.current_frame_no >= this.movie.frames) {
            clearInterval(this.interval);
            // TODO reset player controls
        } else {
            this.render(frame);
            ++this.current_frame_no;
        }
    },
    render: function(frame) {
        for (var row = 0; row < this.movie.rows; ++row) {
            for (var col = 0; col < this.movie.cols; ++col) {
                this.matrix_table.
                    set_str_color(row,
                                  col,
                                  frame.color(row, col).to_string())
            }
        }
        this.on_render.call(this.current_frame_no);
    },
    current_frame: function() {
        return this.movie.frame(this.current_frame_no);
    },
    update: function() {
        this.render(this.current_frame());
    },
    set_frame: function(no) {
        this.current_frame_no = no;
        this.update();
    }
};

function PlayerControls(id, movie_player) {
    this.id = id;
    this.movie_player = movie_player;

    var fs = $('<fieldset></fieldset>');
    var lg = $('<legend>Video Control</legend>');
    this.play = $('<button>Play</button>').attr('id', 'play-button');
    this.stop = $('<button>Stop</button>').attr('id', 'stop-button');
    this.last = $('<button>‹</button>').attr('id', 'last-button');
    this.next = $('<button>›</button>').attr('id', 'next-button');
    this.sl = $('<div></div>').attr('id', 'slider');
    var br = $('<br/>');
    var file = $('<input />').attr('id', 'movie-file').attr('type', 'file');
    
    fs.append(lg);
    fs.append(this.play);
    fs.append(this.stop);
    fs.append(this.last);
    fs.append(this.next);
    fs.append(br);
    fs.append(file);
    fs.append(br);
    fs.append(this.sl);

    fs.appendTo($(id));

    // Click handlers
    var pc = this;
    this.play.bind('click', function() {
        pc.play_click();
    });
    this.stop.bind('click', function() {
        pc.stop_click();
    });
    this.last.bind('click', function() {
        pc.last_click();
    });
    this.next.bind('click', function() {
        pc.next_click();
    });

    // File stuff
    file.bind('change', function() {movie_player.load_file(this.files[0])});

    // Setup slider
    this.sl.slider({ stop: function(event, ui) {
        movie_player.set_frame(ui.value);
    }});
    var captured_sl = this.sl;
    this.movie_player.on_render = function() {
        captured_sl.slider( "option", "value", this); 
    };
 
    return this;
}

PlayerControls.prototype = {
    play_click: function() {
        if (this.play.text() == 'Play') {
            this.movie_player.play();
            this.play.text('Pause');
        } else {
            this.movie_player.pause();
            this.play.text('Play');
        }
    },
    stop_click: function() {
        this.movie_player.stop();
        this.play.text('Play');
    },
    last_click: function() {
        this.movie_player.pause();
        this.play.text('Play');
        
        this.movie_player.back(1);
    },
    next_click: function() {
        this.movie_player.pause();
        this.play.text('Play');
        
        this.movie_player.forward(1);
    }
};

function EditorControls(id, movie_player) {
    this.id = id;
    this.movie_player = movie_player;

    var fs = $('<fieldset></fieldset>');
    var lg = $('<legend>Editor Control</legend>');
    this.add = $('<button>+</button>').attr('id', 'last-button');
    this.remove = $('<button>-</button>').attr('id', 'next-button');
    var br = $('<br/>');
    
    fs.append(lg);
    fs.append(this.add);
    fs.append(this.remove);
    fs.append(br);

    fs.appendTo($(id));

    // Click handlers
    var pc = this;

    this.add.bind('click', function() {
        pc.add_click()
    });
    this.remove.bind('click', function() {
        pc.remove_click();
    });

    return this;
}

EditorControls.prototype = {
    add_click: function() {
        console.info('add frame');
        this.movie_player.movie.add_frame_at(this.movie_player.current_frame_no+1);
        this.movie_player.forward(1);
    },
    remove_click: function() {
        console.info('remove frame');
        this.movie_player.movie.remove_frame_at(this.movie_player.current_frame_no);
        this.movie_player.update();
    }
};

function Editor(matrix_table, player_controls) {
    this.matrix_table = matrix_table;
    this.player_controls = player_controls;
    this.current_color = new Color(0, 0, 0);

    // initialize matrix click handler
    ed = this;
    $(matrix_table.id).bind('click', function(ev) {
        var id = $(ev.target).attr('id');

        if (id.split('-')[0] == 'element') {
            var row = id.split('-')[1];
            var col = id.split('-')[2];

            var current_frame = ed.player_controls.movie_player.current_frame();
            current_frame.set_color(row, col, ed.current_color);
            ed.player_controls.movie_player.render(current_frame);

            console.info('set color to %s', ed.current_color.to_string());
        }
    });
    
    return this;
}

Editor.prototype = {
    set_color: function(c) {
        this.current_color = c;
    }
};

function init() {
    var mv = new Movie();
    var mt = new MatrixTable('#matrix-table');
    var mp = new MoviePlayer(mv, mt);
    var pc = new PlayerControls('#player-controls', mp);
    var ec = new EditorControls('#editor-controls', mp);
    var ed = new Editor(mt, pc);

    // Color picker change callback sets current_color of editor
    $('#color-picker').ColorPicker({flat: true,
                                    color: '#000000',
    	                            onChange: function(hsb, hex, rgb, el) {
                                        c = new Color(0, 0, 0);
                                        c.set_from_string('#'+hex);
                                        ed.set_color(c);
                                    }});

    mt.on_reset = function() {
        pc.sl.slider("option", "max", mv.frames-1);
    };
    mv.on_modify = function() {
        pc.sl.slider("option", "max", mv.frames-1);
    };

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
}

$(document).ready(init);
