var Palette = new Class({
	Implements: [Options,Events],
	options:{
		palletParentElement:$(document.body),
		palletID: 'pallet',
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
				'height': (this.options.styles.height.toInt() + this.options.styles['border-width'].toInt()) + 1 + 'px',
				'padding':'0',
				'margin':'0',
				'list-style':'none'
			}
		}).set('id',this.options.palletID).injectInside(this.options.palletParentElement);
	},
	buildPallet: function(){
		this.buildPaletContainer();
                var hex = '#000000';
                this.options.styles.background = hex;
                
                for(i=0; i<24/2; i++) {
                    var li = new Element('li').setStyles(this.options.styles).set('html',hex).injectInside(this.pallet);
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
