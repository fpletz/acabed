    var Widget = new Class({
    Implements: [Events, Options],

    options: {
        events: {},
        class: 'button'
    },

    initialize: function(id, options) {
        this.setOptions(options);
        this.addEvents(this.options.events);
        
        this.el = new Element('div', {
            id: id,
            class: this.options.class,
        });
        
        this.el.addEvents(this.options.events);
    },
});

var Button = new Class({
    Extends: Widget,

    options: {
        text: undefined,
        image: undefined,
    },

    initialize: function(id, options) {
        this.parent(id, options);
        
        if(this.options.image !== undefined) {
            this.el.setStyle('background-image', 'url(' + this.options.image + ')');
        }

        if (this.options.text !== undefined) {
            this.el.setProperty('alt', this.options.text);
        }
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

