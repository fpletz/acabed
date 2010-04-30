function MoviePlayer(movie, matrix_table) {
    this.movie = movie;
    this.matrix_table = matrix_table;

    this.current_frame_no = 0;

    return this;
}

MoviePlayer.prototype = {
    load_file: function(file) {
        this.stop();

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
