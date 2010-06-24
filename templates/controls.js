function PlayerControls(id, movie_player) {
    this.id = id;
    this.movie_player = movie_player;

    var div = $(id);
    this.play = new Element('img', {
        'src': "/assets/icons/48px-Media-playback-start.svg.png",
        'id': 'play-button',
        'class': 'icon'
    });
    this.stop = new Element('img', {
        'src': '/assets/icons/48px-Media-playback-stop.svg.png',
        'id': 'stop-button',
        'class': 'icon'
    });
    this.last = new Element('img', {
        'src': '/assets/icons/48px-Go-previous.svg.png',
        'id': 'last-button',
        'class': 'icon'
    });
    this.next = new Element('img', {
        'src': '/assets/icons/48px-Go-next.svg.png',
        'id': 'next-button',
        'class': 'icon'
    });
    this.sl = new Element('div', {
        'id': 'slider'
    });
    this.status = new Element('span', {
        'id': 'status-field'
    });

    div.grab(this.play);
    div.grab(this.stop);
    div.grab(this.last);
    div.grab(this.next);

    div.grab(this.sl);

    div.grab(this.status);

    // Click handlers
    var pc = this;
    this.play.addEvent('click', function() {
        pc.play_click();
    });
    this.stop.addEvent('click', function() {
        pc.stop_click();
    });
    this.last.addEvent('click', function() {
        pc.last_click();
    });
    this.next.addEvent('click', function() {
        pc.next_click();
    });

    // Setup slider
    /*this.sl.slider({ stop: function(event, ui) {
        movie_player.set_frame(ui.value);
    }});
    var captured_sl = this.sl;
    this.movie_player.on_render = function() {
        captured_sl.slider( "option", "value", this); 
    };*/
 
    return this;
}

PlayerControls.prototype = {
    play_click: function() {
        if (this.play.html == 'Play') {
            this.movie_player.play();
            this.play.html = 'Pause';
        } else {
            this.movie_player.pause();
            this.play.html = 'Play';
        }
    },
    stop_click: function() {
        this.movie_player.stop();
        this.play.html = 'Play';
    },
    last_click: function() {
        this.movie_player.pause();
        this.play.html = 'Play';
        
        this.movie_player.back(1);
    },
    next_click: function() {
        this.movie_player.pause();
        this.play.html = 'Play';
        
        this.movie_player.forward(1);
    },
    reset: function() {
        this.play.html = 'Play';
    }
};

function EditorControls(id, movie_player) {
    this.id = id;
    this.movie_player = movie_player;

    var div = $(id);
    this.add = new Element('img', {
        'src': '/assets/icons/48px-List-add.svg.png',
        'id': 'add-button',
        'class': 'icon'
    });
    this.remove = new Element('img', {
        'src': '/assets/icons/48px-List-remove.svg.png',
        'id': 'remove-button',
        'class': 'icon'
    });
    this.duplicate = new Element('span', {
        'class': 'button',
        'html': 'Duplicate frame'
    });
    // this.column = $('<span></span>').attr('class', 'button').text('Draw column');
    var br = new Element('br');
    
    div.grab(this.add);
    div.grab(this.remove);
    div.grab(br);
    div.grab(this.duplicate);
    // div.grab(this.column);

    // Click handlers
    var pc = this;

    this.add.addEvent('click', function() {
        pc.add_click()
    });
    this.remove.addEvent('click', function() {
        pc.remove_click();
    });
    this.duplicate.addEvent('click', function() {
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
    return new Element('label', {
        'for': id,
        'html': name
    });
}

function FileControls(id, movie_player) {
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
    var fc = this;

    download_button.addEvent('click', function() {
        fc.download_click();
    });

    // File stuff
    file.addEvent('change', function() {
        movie_player.load_file(this.files[0])
    });

    return this;
}

FileControls.prototype = {
    download_click: function() {
        var uri = 'data:text/xml;charset=utf-8,';
        uri += fix_frame(this.movie_player.movie.to_xml());
        document.location = uri;
    }
};

function InfoWidget(id) {
    this.id = $(id);
    this.fields = ['title', 'description', 'author', 'email', 'url', 'loop', 'rows', 'cols', 'depth', 'channels', 'frames'];

    return this;
}

InfoWidget.prototype = {
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
};

// Dirty hack
function fix_frame(xml) {
    return xml.innerHTML.replace(/__frame/g, 'frame');
}
