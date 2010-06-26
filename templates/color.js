var Color = new Class({
    initialize: function(r, g, b) {
        this.set_from_rgb(r, g, b);
        
        return this;
    },

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
    },

    copy: function() {
        return new Color(this.r, this.g, this.b);
    }
});
