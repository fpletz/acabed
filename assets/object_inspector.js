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

    initialize: function(model, properties) {
        this.parent(properties.id, properties);

        this.addEvent('propertyChanged', (function(property, value) {
            this.update();
        }).bind(this));

        // if ($defined(this.model) && this.model !== null) {
        //     this.inject_model_setters();
        // }

        this.set_model(model);

        // this.update();
    },

    set_model: function(model) {
        this.model = model;
        this.inject_model_setters();
        this.update();
    },

    inject_model_setters: function() {
        var inspector = this;
        if ($defined(this.model) && this.model !== null) {
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
            var list = new Element('dl');
            
            this.options.items.each(function(item) {
            	var id = item.id + '-input';
                var nameContainer = new Element('dt');
                var valueContainer = new Element('dd');
                var nameLabel = new Element('label', {
                    'for': item.id,
                    html: item.title,
                    title: item.description});
		
                var valueInput = undefined;
                
                if(item.type == 'multiline')
                {
                    valueInput = new Element('textarea', {
                	id: id,
			html: this.model[item.id],
			title: item.description,
			maxlength: item.max,
			rows: item.height});
		    
		    valueInput.addEvent('change', (function(el) {
			this.model.set(item.id, el.target.getProperty('html'));
		    }).bind(this));
		}
		else
		{
		    valueInput = new Element('input', {
			id: id,
			value: this.model[item.id],
			title: item.description,
			maxlength: item.max,
			type: 'text'});
		    
		    valueInput.addEvent('change', (function(el) {
                        console.log(el.target.getProperty('value'));
			this.model.set(item.id, el.target.getProperty('value'));
		    }).bind(this));
		}
		
                nameContainer.grab(nameLabel);
                valueContainer.grab(valueInput);
                list.grab(nameContainer);
                list.grab(valueContainer);
            }, this);
            this.el.grab(list);
        }
    }
});
