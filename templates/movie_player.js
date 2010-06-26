var MoviePlayer = new Class({
    initialize: function(movie, matrix_table) {
        this.movie = movie;
        this.matrix_table = matrix_table;

        this.current_frame_no = 0;

        return this;
    },

    load_file: function(file) {
        this.stop();

        var reader = new FileReader();
        reader.readAsText(file);

        var mov = this.movie;
        var mat = this.matrix_table;
        var mp = this;

        reader.onloadend = function() {
            mov.load_xml(reader.result);
            mat.reset(mov.height, mov.width);

            mp.update();
            mp.on_file_change.call(null, mp.movie);
        };
    },

    play: function() {
        var duration = this.movie.frame(this.current_frame_no).duration;
        if (this.at_end()) {
            this.rewind();
        }

        this.interval = setInterval(function(this_obj) {
            this_obj.next_frame()
        }, duration, this);
    },

    pause: function() {
        clearInterval(this.interval);
    },

    stop: function() {
        clearInterval(this.interval);
        this.rewind();
        this.on_stop.call();
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
            if (this.movie.loop == 'no') {
                this.stop();
            } else {
                this.rewind();
            }
        } else {
            this.update();
            ++this.current_frame_no;
        }
    },

    rewind: function() {
        this.current_frame_no = 0;
        this.update();
    },

    at_end: function() {
        if (this.current_frame_no >= this.movie.frames-1) {
            return true;
        } else {
            return false;
        }
    },

    render: function(frame) {
        for (var row = 0; row < this.movie.height; ++row) {
            for (var col = 0; col < this.movie.width; ++col) {
                this.matrix_table.
                    set_str_color(row, col,
                                  frame.data[row][col].to_string())
            }
        }
        this.on_render === undefined ? false : this.on_render(this.current_frame_no);
    },

    current_frame: function() {
        return this.movie.frame(this.current_frame_no);
    },

    update: function() {
        if(this.current_frame() === undefined)
            return;

        this.render(this.current_frame());
        this.update_status();
    },

    set_frame: function(no) {
        this.current_frame_no = no;
        this.update();
    },

    update_status: function() {
        $('status-field').set('text', (this.current_frame_no+1) + "/" + this.movie.frames);
    }
});
