/**
 * Script: Moopick.js
 * 		A 216 pallet color picker
 * 
 * License:
 * 		MIT-style license
 * 
 * Copyright:
 * 		2009 - Zohar Arad - www.zohararad.com
 */

/**
 * Class: Moopick
 * 		A 216 pallet color picker
 * 
 * Implements:
 * 		Mootools.Options, Mootools.Events
 * 
 * Requires:
 * 		Mootools 1.2 Core with Class, Class.Extras, Events, Element, Element.Events, Element.Style, Element.Dimensions
 * 
 * Options:
 * 		- palletParentElement (DOM Element) - The element which contains the color picker.
 * 			Defaults to document.body
 * 		- palletID (String) - A Unique ID for the picker's top-level HTML element
 * 			Defaults to 'pallet'
 * 		- styles (Object) - An object with user-defined styles applied to the color picker. Any styles added or modified here will be applied
 * 			to each color box inside the pallet.
 * 			- width (String) - The width of each color box inside the pallet in pixels.
 * 				Defaults to '8px'.
 * 			- height (String) - The height of each color box inside the pallet in pixels.
 * 				Defaults to 8px.
 * 			- border-color (String) - The border color (in Hex) applied to each color box inside the pallet
 * 				Defaults to '#ddd'.
 * 			- border-width (String) - The border-width of each color box inside the pallet in pixels.
 * 				Defaults to 1px
 * Example:
 * 		<code>
 * 		var pallet = new Moopick({
 * 			palletParentElement:$('mypallet')
 * 		});
 * 
 * 		pallet.addEvents({
 * 			'onColorClick':function(color){console.log(color);},
 * 			'onColorHover':function(color){console.log(color);},
 * 		});
 * 		</code>
 */
var Moopick = new Class({
	Implements:[Options,Events],
	options:{
		palletParentElement:$(document.body),
		palletID:'pallet',
		styles:{
			'width':'8px',
			'height':'8px',
			'border-color':'#ddd',
			'border-width':'1px'
		}
	},
	initialize:function(options){
		this.setOptions(options);
		this.options.styles = this.getPalletStyles();
		this.currentColor = '';
		this.buildPallet();
		this.attachPalletEvents();
	},
	buildPaletContainer: function(){
		this.pallet = new Element('ul',{
			'styles': {
				'width': ((this.options.styles.width.toInt() + this.options.styles['border-width'].toInt()) * 24)/2 + 'px',
				'height': ((this.options.styles.height.toInt() + this.options.styles['border-width'].toInt()) * 9)*2 + 1 + 'px',
				'padding':'0',
				'margin':'0',
				'list-style':'none'
			}
		}).set('id',this.options.palletID).injectInside(this.options.palletParentElement);
	},
	buildPallet: function(){
		this.buildPaletContainer();
		var r = 255, b = 255, g = 255;
		for(r = 255; r > -51 ; r = r-51){
			for(b = 255; b > -51 ; b = b-51){
				for(g = 255; g > -51 ; g = g-51){
					var _r = r.toString(16).length == 1 ? r.toString(16)+r.toString(16) : r.toString(16);
					var _b = b.toString(16).length == 1 ? b.toString(16)+b.toString(16) : b.toString(16);
					var _g = g.toString(16).length == 1 ? g.toString(16)+g.toString(16) : g.toString(16);
					var hex = '#'+_r+_b+_g;
					this.options.styles.background = hex;
					var li = new Element('li').setStyles(this.options.styles).set('html',hex).injectInside(this.pallet);
                                        var d = new Drag(li, {
                                            onComplete: function(el, ev) {
                                                ev.target.setStyle('background-color', el.getStyle('background-color'));
                                                ev.target.setProperty('html', el.getProperty('html'));
                                            },
                                        });
                                    }
			}
		}
	},
	attachPalletEvents: function(){
		this.pallet.getElements('li').addEvents({
			'click':this.onColorClick.bindWithEvent(this),
			'mouseover':this.onColorHover.bindWithEvent(this)
		});
	},
	getPalletStyles: function(){
		var border = '-'+this.options.styles['border-width'] || '-1px';
		var boxStyles = {
			'display':'block',
			'float':'left',
			'overflow':'hidden',
			'text-indent':'-1000em',
			'padding':'0px',
			'margin':'0px '+border+' '+border+' 0px',
			'cursor':'pointer',
			'border-style':'solid'
		}	
		return $merge(boxStyles,this.options.styles);
	},
	onColorClick:function(ev){
		ev.preventDefault();
		var t = $(ev.target);
		this.currentColor = t.get('text');
		this.fireEvent('onColorClick',[this.currentColor]);
	},
	onColorHover:function(ev){
		var t = $(ev.target);
		this.fireEvent('onColorHover',[t.get('text')]);
	}
});
