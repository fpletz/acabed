function PlayerControls(id, movie_player) {
    this.id = id;
    this.movie_player = movie_player;

    var div = $(id);
    this.play = $('<img src="icons/48px-Media-playback-start.svg.png" />').attr('id', 'play-button').attr('class', 'icon');
    this.stop = $('<img src="icons/48px-Media-playback-stop.svg.png" />').attr('id', 'stop-button').attr('class', 'icon');
    this.last = $('<img src="icons/48px-Go-previous.svg.png" />').attr('id', 'last-button').attr('class', 'icon');
    this.next = $('<img src="icons/48px-Go-next.svg.png" />').attr('id', 'next-button').attr('class', 'icon');
    this.sl = $('<div></div>').attr('id', 'slider');
    this.status = $('<span>').attr('id', 'status-field');

    div.append(this.play);
    div.append(this.stop);
    div.append(this.last);
    div.append(this.next);

    div.append(this.sl);

    div.append(this.status);

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

    var div = $(id);
    this.add = $('<img src="icons/48px-List-add.svg.png">').attr('id', 'add-button').attr('class', 'icon');
    this.remove = $('<img src="icons/48px-List-remove.svg.png">').attr('id', 'remove-button').attr('class', 'icon');
    this.duplicate = $('<span></span>').attr('class', 'button').text('Duplicate frame');
    this.column = $('<span></span>').attr('class', 'button').text('Draw column');
    var br = $('<br/>');
    
    div.append(this.add);
    div.append(this.remove);
    div.append(br);
    div.append(this.duplicate);
    div.append(this.column);

    // Click handlers
    var pc = this;

    this.add.bind('click', function() {
        pc.add_click()
    });
    this.remove.bind('click', function() {
        pc.remove_click();
    });
    this.duplicate.bind('click', function() {
        pc.duplicate_click();
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
        // TODO: should also delete at end
        console.info('remove frame');
        if (!this.movie_player.at_end()) {
            this.movie_player.movie.remove_frame_at(this.movie_player.current_frame_no);
            this.movie_player.update();
        }
    },
    duplicate_click: function() {
        console.info('duplicate frame: %d', this.movie_player.current_frame_no);
        this.movie_player.movie.duplicate_frame_at(this.movie_player.current_frame_no);
        this.movie_player.forward(1);
    }
};

function label_for(id, name) {
    return $('<label for="'+id+'" >'+name+'</label>');
}

function FileControls(id, movie_player) {
    this.id = id;
    this.movie_player = movie_player;

    var div = $(id);
    var file = $('<input />').attr('id', 'movie-file').attr('type', 'file');
    var download_button = $('<img src="icons/48px-Go-jump.svg.png" alt="download xml"/>').attr('id', 'download-button').attr('class', 'icon');
    var br = $('<br/>');
    
    div.append(label_for('movie-file', 'Upload '));
    div.append(file);
    div.append(br);
    div.append(label_for('download-button', 'Download '));
    div.append(download_button);

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
