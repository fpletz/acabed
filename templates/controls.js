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
    
    // fs.append(lg);
    fs.append(this.play);
    fs.append(this.stop);
    fs.append(this.last);
    fs.append(this.next);
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
    },
    reset: function() {
        this.play.text('Play');
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
        if (!this.movie_player.at_end()) {
            this.movie_player.movie.remove_frame_at(this.movie_player.current_frame_no);
            this.movie_player.update();
        }
    }
};

function label_for(id, name) {
    return $('<label for="'+id+'" >'+name+'</label>');
}

function FileControls(id, movie_player) {
    this.id = id;
    this.movie_player = movie_player;

    var fs = $('<fieldset></fieldset>');
    var lg = $('<legend>File Control</legend>');
    var file = $('<input />').attr('id', 'movie-file').attr('type', 'file');
    var download_button = $('<button>Download xml</button>').attr('id', 'download-button');
    var br = $('<br/>');
    
    fs.append(lg);
    fs.append(label_for('movie-file', 'Upload xml Blinkenlight movie'));
    fs.append(file);
    fs.append(br);
    fs.append(label_for('download-button', 'Download current xml'));
    fs.append(download_button);

    fs.appendTo($(id));

    // Click stuff
    var fc = this;

    download_button.bind('click', function() {
        fc.download_click();
    });

    // File stuff
    file.bind('change', function() {movie_player.load_file(this.files[0])});

    return this;
}

FileControls.prototype = {
    download_click: function() {
        var uri = 'data:text/xml;utf-8,';
        uri += fix_frame(this.movie_player.movie.to_xml());
        document.location = uri;
    }
};

// Dirty hack
function fix_frame(xml) {
    var xml_string = xml.html().replace(/__frame/g, 'frame');
    return xml_string;
}
