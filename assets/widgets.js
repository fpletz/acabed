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

var Widget = new Class({
    Implements: [Events, Options],

    options: {
        events: {},
        class: '',
        text: ''
    },

    initialize: function(id, options) {
        this.setOptions(options);
        this.addEvents(this.options.events);
        
        this.el = new Element('div', {
            id: id,
            class: this.options.class,
            text: this.options.text,
        });

        this.el.addEvents(this.options.events);
    },
});

var Button = new Class({
    Extends: Widget,

    options: {
        //text: undefined, // TODO: tooltips
        image: undefined,
        class: 'button'
    },

    initialize: function(id, options) {
        this.parent(id, options);
        
        if(this.options.image !== undefined) {
            this.el.setStyle('background-image', 'url(' + this.options.image + ')');
        }

        //if (this.options.text !== undefined) {
        //    this.el.setProperty('alt', this.options.text);
        //}
    }
});

var FileButton = new Class({
    Extends: Button,

    initialize: function(id, options) {
        this.parent(id, options);

        var file = new Element('input', {
            id: 'movie-file',
            type: 'file',
            styles: {
                display: 'none',
            },
        });

        this.el.addEvent('click', function() {
            if (file.getStyle('display') == 'none')
                file.setStyle('display', 'block');
        });

        file.addEvent('change', (function() {
            //this.fireEvent('change', [file]);
            file.setStyle('display', 'none');
        }).bind(this));

        this.el.grab(file);
    }
});

var WidgetContainer = new Class({
    Implements: Options,

    options: {
        widgets: [],
    },

    initialize: function(id, options) {
        this.setOptions(options);
        this.id = id;
        
        var el = $(this.id);
        this.options.widgets.each(function (widget) { el.grab(widget.el); });
    }
});

