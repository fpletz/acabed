var Movie = new Class({
    Implements: Events,

    initialize: function() {
        this.data = new Array();

        this.title = '';
        this.description = '';
        this.author = '';
        this.email = '';
        this.url = '';
        this.loop = 'no';

        this.height = 4
        this.width = 24
        this.depth = 8
        this.channels = 3
        this.frames = 0;
    },

    load_xml: function(movie_string) {
        var movie_dom = (new DOMParser()).parseFromString(movie_string, "text/xml");
        this.movie_xml = movie_dom;
        header = this.movie_xml.getElement('header');

        this.title = header.getElement('title').get('text');
        this.description = header.getElement('description').get('text');
        this.author = header.getElement('author').get('text');
        this.email = header.getElement('email').get('text');
        this.url = $try(function () {
            u = header.getElement('url');
            return u === null ? '' : u.get('text');
        }, $lambda(''));;
        this.loop = header.getElement('loop').get('text');

        var blm = this.movie_xml.getElement('blm');
        this.height = parseInt(blm.get('height'));
        this.width = parseInt(blm.get('width'));
        this.depth = parseInt(blm.get('bits'));
        this.channels = parseInt(blm.get('channels'));
        this.frames = this.movie_xml.getElements('frame').length;

        // Build internal movie representation from xml
        var data = [];
        var xmlfr = new XmlFrame(this.height, this.width, this.depth, this.channels);
        this.movie_xml.getElements('frame').each(function(o) {
            data.push(xmlfr.load_xml(o).to_frame());
        });
        this.data = data;
        
        console.info("Movie: %s", this.title);
        console.info("size: %dx%d, depth: %d, channels: %d, frames: %d", this.height, this.width, this.depth, this.channels, this.frames);
    },

    frame: function(no) {
        return this.data[no];
    },

    // TODO corner cases
    add_frame_at: function(at) {
        ++this.frames;
        // TODO remove hardcoded fuck
        this.data.splice(at, 0, new Frame(this.height, this.width, 40));
        this.fireEvent('modify');
    },

    remove_frame_at: function(at) {
        --this.frames;
        this.data.splice(at, 1);
        this.fireEvent('modify');
    },

    duplicate_frame_at: function(at) {
        ++this.frames;
        var frame_copy = this.frame(at).copy();
        // Add after 'at'
        this.data.splice(at+1, 0, frame_copy);
        this.fireEvent('modify');
    },

    to_xml: function() {
        var xml = new Element('xml');

        var blm = new Element('blm');
        blm.set('width', this.width);
        blm.set('height', this.height);
        blm.set('bits', this.depth);
        blm.set('channels', this.channels);
        blm.inject(xml);
        
        var header = new Element('header');
        header.grab(new Element('title').set('text', this.title));
        header.grab(new Element('description').set('text', this.description));
        header.grab(new Element('creator').set('text', 'acabed'));
        header.grab(new Element('author').set('text', this.author));
        header.grab(new Element('email').set('text', this.email));
        header.grab(new Element('loop').set('text', this.loop));
        // TODO duration
        header.inject(blm);

        for (var row = 0; row < this.data.length; ++row) {
            blm.grab(this.data[row].to_xml());
        }

        return xml;
    }
});
