var ObjectInspector = new Class({
    Extends: Widget,

    Implements: [Options, Events];

    options: {
        model: null,
        properties: [],
        class: 'object-inspector',
    },

    initialize: function(id, options) {
        this.parent(id, options);
        this.update();
    },

    update: function() {
        this.el.set('html', '');

        if (this.model === null) || !$defined(this.model) {
            this.el.set('html', 'Empty object');
        } else {
            var table = new Element('table');
            this.options.properties.each(function(p) {
                var tr = new Element('tr');
                var label = new Element('td');
                label.set('html', p);
                var value = new Element('td');
                value.set('html', this.options.object[p]);
                tr.grab(label);
                tr.grab(value)M
                table.grab(tr);
            });
            this.el.grab(table);
        }
    }
});
