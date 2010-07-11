/*
 *  acabed - webeditor for blinkenlights xml files
 *  Copyright (C) 2010 Raffael Mancini <raffael.mancini@hcl-club.lu>
 *                     Franz Pletz <fpletz@fnordicwalking.de>
 *
 *  This file is part of acabed.
 *
 *  acabed is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as
 *  published by the Free Software Foundation, either version 3 of the
 *  License, or (at your option) any later version.
 *
 *  acabed is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var Movie = new Class({
    Implements: [Events, Settable], 

    initialize: function() {
        this.data = new Array();

        this.set('title', '');
        this.set('description', '');
        this.set('author', '');
        this.set('creator', 'acabed');
        this.set('email', '');
        this.set('url', '');
        this.set('loop', 'no');

        this.set('height', 4);
        this.set('width', 24);
        this.set('depth', 8);
        this.set('channels', 3);
        this.set('frames', 0);
    },

    load_xml: function(movie_string) {
        var movie_dom = (new DOMParser()).parseFromString(movie_string, "text/xml");
        this.movie_xml = movie_dom;
        header = this.movie_xml.getElement('header');

        this.set('title', header.getElement('title').get('text'));
        this.set('description', header.getElement('description').get('text'));
        this.set('author', header.getElement('author').get('text'));
        this.set('email', header.getElement('email').get('text'));
        this.set('url', $try(function () {
            u = header.getElement('url');
            return u === null ? '' : u.get('text');
        }, $lambda('')));
        this.set('loop', header.getElement('loop').get('text'));

        var blm = this.movie_xml.getElement('blm');
        this.set('height', parseInt(blm.get('height')));
        this.set('width', parseInt(blm.get('width')));
        this.set('depth', parseInt(blm.get('bits')));
        this.set('channels', parseInt(blm.get('channels')));
        this.set('frames', this.movie_xml.getElements('frame').length);

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
        var frame = new Frame(this.height, this.width, 40);
        frame.duration = 100;
        this.data.splice(at, 0, frame);
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
