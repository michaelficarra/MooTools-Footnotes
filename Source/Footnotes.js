/*
---
description: Finds all links or citations for a given element and generates footnotes
license: LGPL
authors: ['Michael Ficarra']
requires: [Core,Array,Hash,Class,Options]
provides: [Footnotes]
... */

var Footnotes;

(function(){

	var predefinedCharsets = $H({
		numeric: '0123456789'.split(''),
		alpha: 'abcdefghijklmnopqrstuvwxyz'.split(''),
		alphanumeric: '0123456789abcdefghijklmnopqrstuvwxyz'.split(''),
		qwerty: 'qwertyuiopasdfghjklzxcvbnm'.split(''),
		greek: ['&alpha;','&beta;','&gamma;','&delta;','&epsilon;','&zeta;',
			'&eta;','&theta;','&iota;','&kappa;','&lambda;','&mu;','&nu;',
			'&xi;','&omicron;','&pi;','&rho;','&sigma;','&tau;','&upsilon;',
			'&phi;','&chi;','&psi;','&omega;'],
		special: ['*','&dagger;','&Dagger;','&plusmn;','&otimes;','&nabla;',
			'&diams;','&times;','&nsub;','&piv;','&part;','&empty;','&ne;',
			'&prop;','&there4;','&tilde;']
	});

	Footnotes = new Class({

		Implements: Options,
		options: {
			charset: predefinedCharsets.alpha,
			format: '{id}',
			footnoteContainer: null,
			backreferences: false //not implemented yet
		},

		initialize: function(content,options){
			this.target = $(content);
			if(this.target===null) throw new Error('Footnotes: Target element not found.');
			this.footnoteUrls = [];
			this.setOptions(options||{});
			this.footnoteContainer = $(this.options.footnoteContainer);
			if(!this.footnoteContainer) this.footnoteContainer = this.appendFootnoteContainer(this.target);
			this.footnoteContainer.addClass('footnotes');
			if(['object','hash'].contains($type(options)) && $defined(options.charset)){
				switch($type(options.charset)){
					case 'array':
						this.options.charset = options.charset;
						break;
					case 'string':
						this.options.charset = predefinedCharsets.has(options.charset) ? predefinedCharsets[options.charset] : options.charset.split('');
						break;
					default:
						throw new Error('Footnotes: Incorrect usage of the charset option. Must be of type array or string.')
				}
			}
			return this;
		},

		apply: function(){
			var citations = this.target.getElements('*[href^=""],*[cite^=""]');
			// sort by position in the document
			citations.sort(function(a,b){
				var cmp = a.compareDocumentPosition(b);
				return (cmp&2)+(cmp&8)-(cmp&4)-(cmp&16);
			});
			citations.each(this.attempt,this);
			return this;
		},

		clear: function(){
			this.footnoteContainer.empty();
			$$('.footnoteReference').dispose();
			this.target.getElements('.noted').removeClass('noted');
			return this;
		},

		attempt: function(el){
			if(el.hasClass('noted')) return;
			var url = el.get('cite');
			if(url===null) url = el.get('href');
			if(url===null) return;
			this.cite(el,url);
		},

		cite: function(el,url){
			var footnoteNum = this.footnoteUrls.indexOf(url);
			if(footnoteNum<0){
				this.appendFootnote(url);
				this.footnoteUrls = this.footnoteContainer.getElements('.footnoteUrl').get('text');
				footnoteNum = this.footnoteUrls.length-1;
			}
			var ref = new Element('span',{
				'class':'footnoteReference',
				html: this.options.format.substitute({id:this.identifier(footnoteNum),url:url})
			});
			if(el.get('tag')=='blockquote'){
				var child = el;
				do {
					child = child.getLast();
				} while(child!==null && !['p','li','dd'].contains(child.get('tag').toLowerCase()));
				if(child===null) child = el;
				child.grab(ref,'bottom');
			} else {
				el.grab(ref,'after');
			}
			el.addClass('noted');
			return this;
		},

		// private methods

		appendFootnoteContainer: function(parent){
			var list = new Element('ul',{
				'class':'footnotes'
			});
			parent.adopt(list);
			return list;
		}.protect(),

		appendFootnote: function(url){
			var li = new Element('li',{
				'class': 'footnote'
			});
			li.adopt(
				new Element('span',{
					'class': 'footnoteIdentifier',
					html: this.identifier(this.footnoteContainer.getChildren().length)
				}),
				new Element('span',{
					'class': 'footnoteUrl',
					text: url
				})
			);
			this.footnoteContainer.adopt(li);
			return li;
		}.protect(),

		//retrieves the footnote identifier for footnote at index <index>
		identifier: function(index){
			var charset = $splat(this.options.charset);
			var base = charset.length;
			if(base < 2){
				charset = predefinedCharsets['alpha'];
				base = charset.length;
			}
			if(index<base) return charset[index];
			var result = '';
			do {
				result = charset[index % base] + result;
				index = ((index / base) - 0.5).round();
			} while(index>0);
			return result;
		}.protect()

	})

})();

Element.implement({
	footnotes: function(footnoteContainer,options){
		return (new Footnotes(this,footnoteContainer,options)).apply();
	}
});

/* Copyright 2010 Michael Ficarra
This program is distributed under the (very open)
terms of the GNU Lesser General Public License */
