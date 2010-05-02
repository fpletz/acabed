
function Movie() {
    this.data = new Array();

    this.title = '';
    this.description = '';
    this.author = 'author';
    this.email = 'email';
    this.url = 'url';
    this.loop = 'no';

    this.rows = 4
    this.cols = 24
    this.depth = 8
    this.channels = 3
    this.frames = 0;

    return this;
}

Movie.prototype = {
    load_xml: function(movie_string) {
        var movie_dom = (new DOMParser()).parseFromString(movie_string, "text/xml");
        this.movie_xml = $(movie_dom);
        header = this.movie_xml.find('header');

        this.title = header.find('title').text();
        this.description = header.find('description').text();
        this.author = header.find('author').text();
        this.email = header.find('email').text();
        this.url = header.find('url').text();
        this.loop = header.find('loop').text();;

        var blm = this.movie_xml.find('blm')
        this.rows = parseInt(blm.attr('height'));
        this.cols = parseInt(blm.attr('width'));
        this.depth = parseInt(blm.attr('bits'));
        this.channels = parseInt(blm.attr('channels'));
        this.frames = this.movie_xml.find('frame').length;

        // Build internal movie representation from xml
        var data = [];
        var f = new XmlFrame(this.rows, this.cols, this.depth, this.channels);
        this.movie_xml.find('frame').each(function(i) {
            data.push(f.load_xml(this).to_frame());
        });
        this.data = data;
        
        console.info("Movie: %s", this.title);
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
    },
    to_xml: function() {
        var xml = $('<xml/>');

        var blm = $('<blm/>');
        blm.attr('width', this.width);
        blm.attr('height', this.height);
        blm.attr('bits', this.depth);
        blm.attr('channels', this.channels);
        blm.appendTo(xml);
        
        var header = $('<header/>');
        header.append($('<title/>').text(this.title));
        header.append($('<description/>').text(this.description));
        header.append($('<creator/>').text('acabed'));
        header.append($('<author/>').text(this.author));
        header.append($('<email/>').text(this.email));
        header.append($('<loop/>').text(this.loop));
        // TODO duration
        header.appendTo(blm);

        for (var row = 0; row < this.data.length; ++row) {
            blm.append(this.data[row].to_xml());
        }

        return xml;
    }
};
