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

var ObjectInspector = new Class({
    Extends: Widget,

    Implements: [Options, Events],

    options: {
        properties: [],
        class: 'object-inspector',
    },

    model: null,

    initialize: function(id, options, model) {
        this.parent(id, options);

        this.model = model;

        this.addEvent('propertyChanged', (function(property, value) {
            this.update();
        }).bind(this));

        if ($defined(this.model) && this.modeel !== null) {
            this.inject_model_setters();
        }

        this.update();
    },

    set_model: function(model) {
        this.model = model;
        this.inject_model_setters();
        this.update();
    },

    inject_model_setters: function() {
        var inspector = this;
        if ($defined(this.model) && this.modeel !== null) {
            this.model.set = (function(property, value) {
                this[property] = value;
                inspector.fireEvent('propertyChanged', [property, value]);
            }).bind(this.model);
        }
    },

    update: function() {
        this.el.set('html', '');

        if (this.model === null || ! $defined(this.model) ) {
            this.el.set('html', 'Empty object');
        } else {
            var table = new Element('table');
            this.options.properties.each(function(p) {
                var tr = new Element('tr');
                var label = new Element('td');
                label.set('html', p + ': ');
                var value = new Element('td');
                var input = new Element('input', {id: p+'-input', value: this.model[p]})

                input.addEvent('change', (function(el) {
                    this.model.set(p, el.target.getProperty('value'));
                }).bind(this));

                value.grab(input);
                tr.grab(label);
                tr.grab(value);
                table.grab(tr);
            }, this);
            this.el.grab(table);
        }
    }
});
