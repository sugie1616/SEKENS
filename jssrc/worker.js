/* for Web Workers */

var elem = function(elemname) {
	this.nodeName = elemname;
	this._attributes = [];
	this._child = [];
	this.setAttribute = function(attrname, attrval) {
		postMessage(JSON.stringify({
			'event': 'setAttribute',
			'name': attrname,
			'value': attrval
		}));
		this._attributes.push(attrname + "=" + attrval);
	};
	this.appendChild = function(child) {
		this._child.push(child);
	};
}

var elems = function(elemname) {
	this._elems = [elemname];
	this.item = function(index) {
		return this._elems[index];
	}
}

var document = function() {
	this._context = {
		'2d': []
	};
	this._elems = {
		//html: new elems(new elem('html')),
		//head: new elems(new elem('head')),
		body: new elems(new elem('body'))
	};
	this.getElementsByTagName = function(tagname) {
		return this._elems[tagname];
	};
	this.createElement = function(elemname) {
		postMessage(JSON.stringify({
			'event': 'createElement',
			'element': elemname
		}));
		return new elem(elemname);
	};
	this.setCanvasContext = function(str, ctx) {
		this._context[str].push(ctx);
	};
	this.getCanvasContext = function(str) {
		return this._context[str];
	};
};

document = new document();
