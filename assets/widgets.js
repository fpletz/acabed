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
        'class': '',
        text: '',
        tooltip: null,
    },

    initialize: function(id, options) {
        this.setOptions(options);
        this.addEvents(this.options.events);
        
        this.el = new Element('div', {
            id: id,
            'class': this.options['class'],
            text: this.options.text,
        });

        this.el.addEvents(this.options.events);

        if(this.options.tooltip !== null) {
            this.tooltip = new Tooltip(this.el, { text: this.options.tooltip });
        }
    },
});

var Textarea = new Class({
    Extends: Widget,

    options: {
        content: '',
        cols: 100,
        rows: 20,
    },
    
    initialize: function(id, options) {
        this.parent(id, options);
        
        this.textarea = new Element('textarea');
        this.textarea.set('value', this.options.content);
        this.textarea.setProperty('cols', this.options.cols);
        this.textarea.setProperty('rows', this.options.rows);
        this.el.grab(this.textarea);
    },
    
    content: function() {
        return this.textarea.get('value');
    }
});

var Button = new Class({
    Extends: Widget,

    options: {
        'class': 'button textbutton',
        active_class: 'button-active',
        inactive_class: 'button-inactive',
        active: true,
    },

    initialize: function(id, options) {
        this.parent(id, options);
        this.set_active(this.options.active);
    },

    set_active: function(active) {
        this.options.active = active;
        if (active) {
            this.el.addClass(this.options.active_class);
            this.el.removeClass(this.options.inactive_class);
        } else {
            this.el.addClass(this.options.inactive_class);
            this.el.removeClass(this.options.active_class);
        }
    },

    get_active: function() {
        return this.options.active;
    },
});

var ImageButton = new Class({
    Extends: Button,

    options: {
        'class': 'button imagebutton',
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
		
		
		if(typeof FileReader === 'undefined')
		{
			var frame = new IFrame({
				src: 'about:blank',
				events: {
					load: this.frameEvent.pass(this)
				}
			});
			
			this.el.grab(frame);
		}
		else
		{
			var fileReaderInput = new Element('input', {
				type: 'file',
				name: 'file',
				maxlength: '100000',
				'class': 'movie-file',
				events: {
					change: this.fileReaderEvent.bind(this)
				}
			});
			
			this.el.grab(fileReaderInput);
		}
    },
    
    fileReaderEvent: function(ev) {
		this.fireEvent("clicked");
                try {
		    this.fireEvent("loaded", [ev.target.files[0].getAsBinary()]);
                } catch(e) {
                    if(e.name==="TypeError") {
                        alert("Unbekannter Dateityp, probier's noch einmal.");
                    } else {
                        alert("Dateiupload funktioniert derzeit leider nicht mit deinem Browser! Bald fixen wir's! Bis dahin funktionierts mit Firefox ;)");
                    }
                    ModalDialog.destroy();
                    Dajaxice.acab.load_editor('Dajax.process');
                }
	},
	
	frameEvent: function(button) {
		var frame = button.el.getElement('iframe');
		var frameDocument = frame.contentDocument;
		var frameHtml = this.$(frameDocument.getElementsByTagName("html")[0]);
		var frameBody = frameHtml.getElement('body');
		
		
		/* If we got an empty element, we have are waiting for
		 * user's input. Thus we have to fill this document with
		 * an input form.
		 */
		if (frameDocument.location.href == 'about:blank') {
			/* Style the already exising top level elemnts (html/body) */
			var defaultStyle = {
				/* Otherwise Opera shows only scrollbars */
				width: '100px',
				height: '100px',
				overflow: 'hidden',
				
				border: 'none',
				padding: 0,
				margin: 0,
				cursor: 'default'
			};
			
			frameHtml.setStyles(defaultStyle);
			frameBody.setStyles(defaultStyle);
			
			
			/* Create and style <form> and inset into body */
			var uploadForm = new Element('form', {
				method: 'POST',
				action: '/acab/filereplay/',
				enctype: 'multipart/form-data',
			});
			uploadForm.setStyles(defaultStyle);
			uploadForm.injectInside(frameBody);
			
			/* Create and style <input> and inset into form */
			var uploadFile = new Element('input', {
				type: 'file',
				name: 'file',
				maxlength: '100000',
				events: {
					change: function(uploadForm, button) {
						button.fireEvent("clicked");
						uploadForm.submit();
					}.pass([uploadForm, button])
				}
			});
			uploadFile.setStyles(defaultStyle);
			uploadFile.injectInside(uploadForm);
			uploadFile.click();
		}
		else
		{
			button.fireEvent("loaded", [frameBody.getFirst().get('text')]);
			frameDocument.location.href = 'about:blank'
		}
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

var TableWidget = new Class({
    Extends: Widget,

    options: {
        columns: [],
        data: [],
    },

    initialize: function(id, options) {
        this.parent(id, options);

        var table = new Element('table');
        this.el.grab(table);

        var tr = new Element('tr');
        table.grab(tr);
        this.options.columns.each(function(h) {
            tr.grab(new Element('th', { 'text': h[1] }));
        });

        this.options.data.each(function(row) {
            tr = new Element('tr');
            table.grab(tr);

            tr.addEvent('click', function() {
                ModalDialog.destroy();
                Dajaxice.acab.load_editor('Dajax.process', {
                    pk: row.pk
                });
            });

            this.options.columns.each(function(col) {
                tr.grab(new Element('td', { 'text': row[col[0]] }));
            });
        }, this);
    },
});

var RadioContainer = new Class({
    Extends: WidgetContainer,

    initialize: function(id, options) {
        this.parent(id, options);

        this.options.widgets.each(function(button) {
            button.el.addEvent('click', (function(ev) {
                this.options.widgets.each(function(widget) {
                    widget.set_active(false);
                });
                button.set_active(true);
            }).bind(this));
        }, this);
    }
});

var OptionsContainer = new Class({
    Extends: WidgetContainer,

    initialize: function(id, options) {
        this.parent(id, options);

        this.options.widgets.each(function(button) {
            button.el.addEvent('click', (function(ev) {
                button.set_active(!button.get_active());
            }).bind(this));
        }, this);
    }
});

var Tooltip = new Class({
    Implements: [Options, Events],

    options: {
        'class': 'tooltip',
        text: 'empty tooltip',
        styles: [],
    },

    initialize: function(target, options) {
        this.setOptions(options);
        this.target = target;

        this.el = new Element('div', {
            'class': this.options['class'],
            styles: this.options.styles,
            text: this.options.text,
        });

        $('tooltips').grab(this.el);

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
        'class': 'message-widget',
        styles: {
            opacity: 0,
        },
    },

    initialize: function(id, options) {
        this.parent(id, options);

        // allow selecting text
        this.el.addEvent('mousedown', function(e) {
            e.stopPropagation();
            return true;
        });

        this.el.dissolve();

        this.mouselander = new Element('div', {
            'class': 'message-widget',
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

