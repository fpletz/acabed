var PlayerControls = new Class({
    Extends: WidgetContainer,

    initialize: function(id, options) {
        options.widgets = [
            new Button('play-button', {
                image: '/assets/icons/48px-Media-playback-start.svg.png',
                class: 'button',
                events: {
                    click: (function() {
                        if (this.options.movie_player.playing) {
                            this.options.movie_player.play();
                        } else {
                            this.options.movie_player.pause();
                        } 
                    }).bind(this),
                },
            }),
            new Button('stop-button', {
                image: '/assets/icons/48px-Media-playback-stop.svg.png',
                class: 'button',
                events: {
                    click: (function() {
                        this.options.movie_player.stop();
                    }).bind(this),
                },
            }),
            new Button('last-button', {
                image: '/assets/icons/48px-Go-previous.svg.png',
                class: 'button',
                events: {
                    click: (function() {
                        this.options.movie_player.pause();
                        this.options.movie_player.back(1);
                    }).bind(this),
                },
            }),
            new Button('next-button', {
                image: '/assets/icons/48px-Go-next.svg.png',
                class: 'button',
                events: {
                    click: (function() {
                        this.options.movie_player.pause();
                        this.options.movie_player.forward(1);
                    }).bind(this),
                },
            }),
            new Widget('slider', {}),
            //this.status = new Element('span', {
            //    'id': 'status-field'
            //}),
        ];

        this.parent(id, options);
        this.setup_slider();
    },

    setup_slider: function() {
        this.tim = new Element('img', {'src': '/assets/icons/tim.png', 'id': 'slider-tim'});
        this.slider = $('slider');

        this.slider.grab(this.tim);

        function createSlider() {
            return new Slider(this.slider.get('id'), this.tim.get('id'), {
                range: [0, this.options.movie_player.movie.frames-1],
                steps: this.options.movie_player.movie.frames-1,
                wheel: true,
                snap: true,
                onChange: function(pos) {
                    if(this.options.movie_player.matrix_table.height === undefined)
                        return;

                    movie_player.set_frame(pos);
                }
            });
        }
        createSlider = createSlider.bind(this)
        
        // Update slider max on MatrixTable reset
        this.options.movie_player.matrix_table.addEvent('reset', (function() {
            if(this.slider !== undefined)
                this.slider.detach()

            this.slider = createSlider();
        }).bind(this));

        this.options.movie_player.addEvent('render', (function(frame_no) {
            this.slider.set(frame_no);
        }).bind(this));
    },
});

var EditorControls = new Class({
    initialize: function(id, movie_player) {
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
    },

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
});

function label_for(id, name) {
    return new Element('label', {
        'for': id,
        'html': name
    });
}

var FileControls = new Class({
    initialize: function(id, movie_player) {
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
        download_button.addEvent('click', (function() {
            this.download_click();
        }).bind(this));

        // File stuff
        file.addEvent('change', function() {
            movie_player.load_file(this.files[0])
        });

        return this;
    },

    download_click: function() {
        var uri = 'data:text/xml;charset=utf-8,';
        uri += fix_frame(this.movie_player.movie.to_xml());
        document.location = uri;
    }
});

var InfoWidget = new Class({
    initialize: function(id) {
        this.id = $(id);
        this.fields = ['title', 'description', 'author', 'email', 'url', 'loop', 'height', 'width', 'depth', 'channels', 'frames'];

        return this;
    },

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
});

// Dirty hack
function fix_frame(xml) {
    return xml.innerHTML.replace(/__frame/g, 'frame');
}
