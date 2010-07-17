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
        text: '',
        tooltip: null,
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

        if(this.options.tooltip !== null) {
            this.tooltip = new Tooltip(this.el, { text: this.options.tooltip });
        }
    },
});

var Button = new Class({
    Extends: Widget,

    options: {
        class: 'button textbutton'
    },

    initialize: function(id, options) {
        this.parent(id, options);
    }
});

var ImageButton = new Class({
    Extends: Button,

    options: {
        class: 'button imagebutton',
        image: undefined,
    },

    initialize: function(id, options) {
        this.parent(id, options);

        this.el.setStyle('background-image', 'url(' + this.options.image + ')');
    },
});

var FileButton = new Class({
    Extends: ImageButton,

    initialize: function(id, options) {
        this.parent(id, options);

        var file = new Element('input', {
            class: 'movie-file',
            type: 'file',
        });

        this.el.addEvent('click', function() {
            if (file.getStyle('display') == 'none')
                file.setStyle('display', 'block');
        });

        file.addEvent('change', (function() {
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
        
        this.el = $(this.id);
        if(this.el === null)
            this.el = new Element('div', { id: id });

        this.options.widgets.each((function (widget) {
            this.el.grab(widget.el);
        }).bind(this));
    }
});


var Tooltip = new Class({
    Implements: [Options, Events],

    options: {
        class: 'tooltip',
        text: 'empty tooltip',
        styles: [],
    },

    initialize: function(target, options) {
        this.setOptions(options);
        this.target = target;

        this.el = new Element('div', {
            class: this.options.class,
            styles: this.options.styles,
            text: this.options.text,
        });

        this.target.grab(this.el);

        this.target.addEvent('mouseenter', this.show.bind(this));
        this.target.addEvent('mouseleave', this.hide.bind(this));
    },

    show: function() {
        var coords = this.target.getCoordinates();
        this.el.setStyles({
            display: 'block',
            left: coords.left + coords.width,
            top: coords.top + coords.height,
        });
    },

    hide: function() {
        this.el.setStyle('display', 'none');
    },

});

var MessageWidget = new Class({
    Extends: Widget,

    options: {
        tooltip: 'Wichtige Meldungen',
        class: 'message-widget',
        styles: {
            opacity: 0,
        },
    },

    initialize: function(id, options) {
        this.parent(id, options);


        this.el.dissolve();

        this.mouselander = new Element('div', {
            class: 'message-widget',
        });

        this.el.setProperty('text', '')

        this.mouselander.addEvent('mouseenter', (function() {
            if(this.el.getProperty('text') !== '') {
                this.show();
            }
        }).bind(this));
        this.mouselander.addEvent('mouseleave', (function() {
            if(this.el.getProperty('text') !== '') {
                this.hide();
            }
        }).bind(this));

        document.body.grab(this.el);
        document.body.grab(this.mouselander);
    },

    show: function() {
        clearTimeout(this.timeout);

        this.el.set('reveal', {
            duration: 'normal',
            transition: 'bounce:out'
        }).reveal();

        this.timeout = setTimeout((function() {
            this.hide();
        }).bind(this), 5000);
    },

    hide: function() {
        clearTimeout(this.timeout);
        this.el.get('reveal').dissolve();
    },
});

MessageWidget.create = function() {
    this.instance = new MessageWidget('message-widget');
};

MessageWidget.msg = function(msg) {
    this.instance.el.setProperty('text', msg);
    this.instance.show();
};

