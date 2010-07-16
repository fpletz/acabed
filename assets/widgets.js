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
				class: 'movie-file',
				events: {
					change: this.fileReaderEvent.bind(this)
				}
			});
			
			this.el.grab(fileReaderInput);
		}
    },
    
    fileReaderEvent: function(ev) {
		this.fireEvent("loaded", [ev.target.files[0].getAsBinary()]);
	},
	
	frameEvent: function(button) {
		var frame = button.el.getFirst();
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
					change: function(uploadForm) {
						uploadForm.submit();
					}.pass(uploadForm)
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

        document.body.grab(this.el);

        this.target.addEvent('mouseover', this.show.bind(this));
        this.target.addEvent('mouseout', this.hide.bind(this));
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
