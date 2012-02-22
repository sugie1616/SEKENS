Ext.Loader.setConfig({enabled: true});
Ext.Loader.setPath('Ext.ux.DataView', '../ext-4.0.7/examples/ux/DataView');
Ext.require(['*']);

Ext.define('Code', {
	fields: ['user', 'repo', 'name', 'body'],
	extend: 'Ext.data.Model',
	proxy: {
		type: 'localstorage',
		id: 'Source-Codes'
	}
});

Ext.define('uSrcDirModel', {
	extend: 'Ext.data.Model',
	fields: [
		{name: 'name', type: 'string'}
	]
});

Ext.apply(Ext.form.field.VTypes, {
		nospace: function(val, field) {
			return (/^[a-zA-Z0-9\.\-_]+$/g).test(val);
		},
		nospaceText: 'Not a valid name. Must not be include multibyte characters.',
		nospaceMask: /[a-zA-Z0-9\.\-_]/i
});

var editorPanel;
var documentJson;

Ext.onReady(function() {
	Ext.tip.QuickTipManager.init();
	var todo = function() {
		Ext.Msg.alert('TODO', 'Coming soon.');
	};
	var mainWidth = document.body.clientWidth;
	var mainHeight = document.body.clientHeight;
	var store = Ext.create('Ext.data.Store', {
		model: "Code"
	});
	var data = {
		user: userName,
		repo: 'Repository',
		name: 'notitle.k',
		body: '/* write here some KonohaScript code */\nprint "hello, world";'
	};
	store.load();
	if (store.last() != null) {
		if (store.last().data.user == data.user) {
			data = store.last().data;
		}
	}
	var json_alert = function(result) {
		var json = Ext.JSON.decode(result.responseText);
		if (json['error'] != null) {
			Ext.MessageBox.show({
				title: 'Error',
				msg: json['error'],
				icon: Ext.MessageBox.ERROR,
				buttons: Ext.MessageBox.OK
			});
			return null;
		}
		return json;
	};
	//var canvasWindow;
	var canvasWindow;
	//var showCanvas = function(kctx, width, height) {
	//	canvasWindow = Ext.create('widget.window', {
	//			title: 'Canvas',
	//			width: width + 12,
	//			height: height + 35,
	//			html: '<div id="canvas-body"></div>'
	//	});
	//	canvasWindow.show();
	//	Ext.DomHelper.append('canvas-body', {
	//		id: 'konoha-canvas',
	//		tag: 'canvas',
	//		width: width,
	//		height: height
	//	});
	//	var canvas = Ext.getDom('konoha-canvas');
	//	var ctx = canvas.getContext('2d');
	//	for (var i = 0; i < kctx['2d'][0]._rect.length; i++) {
	//		var rect = kctx['2d'][0]._rect[i];
	//		ctx.fillStyle = rect._style.rawptr;
	//		ctx.fillRect(rect._x, rect._y, rect._w, rect._h);
	//	}
	//};
	var runKonoha = function(title, name) {
		if (canvasWindow != null) {
			canvasWindow.destroy();
			canvasWindow = null;
		}
		Ext.DomHelper.overwrite('console-out', {tag: 'div'});
		Ext.DomHelper.overwrite('console-err', {tag: 'div'});
		var worker = new Worker(homeURL + 'cgi-bin/run.k?title=' + title + '&name=' + name);
		var canvas;
		var ctx;
		var curidx = 0;
		worker.onmessage = function(e) {
			var json = Ext.JSON.decode(e.data);
			switch (json.event) {
			//case 'createElement':
			//	if (json.element.toLowerCase() == 'canvas') {
			//		canvasWindow2 = Ext.create('widget.window', {
			//				title: 'Canvas',
			//				html: '<div id="canvas-body2"></div>'
			//		});
			//		canvasWindow2.show();
			//		Ext.DomHelper.append('canvas-body2', {
			//			id: 'konoha-canvas2',
			//			tag: 'canvas'
			//		});
			//		canvas2 = Ext.getDom('konoha-canvas2');
			//		ctx2 = canvas2.getContext('2d');
			//	}
			//	break;
			//case 'setAttribute':
			//	if (json.name == 'width') {
			//		canvasWindow2.setWidth(parseInt(json.value) + 12);
			//		canvas2.width = json.value;
			//	} else if (json.name == 'height') {
			//		canvasWindow2.setHeight(parseInt(json.value) + 35);
			//		canvas2.height = json.value;
			//	}
			//	break;
			//case 'setFillStyle':
			//	ctx2.fillStyle = json.fillStyle;
			//	break;
			case 'fillRect':
				for (var i = 0; i < json.rect.length; i++) {
					var rect = json.rect[i];
					ctx.fillStyle = rect._style.rawptr;
					ctx.fillRect(rect._x, rect._y, rect._w, rect._h);
				}
				break;
			case 'appendChild':
				if (canvasWindow == null && json.child.nodeName == "Canvas") {
					for (var j = 0; j < json.child._attributes.length; j++) {
						var attr = json.child._attributes[j];
						if (attr.indexOf("width") >= 0) {
							width = parseInt(attr.split("=")[1]);
						} else if (attr.indexOf("height") >= 0) {
							height = parseInt(attr.split("=")[1]);
						}
					}
					canvasWindow = Ext.create('widget.window', {
						title: 'Canvas',
						width: width + 12,
						height: height + 35,
						html: '<div id="canvas-body2"></div>'
					});
					canvasWindow.show();
					Ext.DomHelper.append('canvas-body2', {
						id: 'konoha-canvas2',
						tag: 'canvas',
						width: width,
						height: height
					});
					canvas = Ext.getDom('konoha-canvas2');
					ctx = canvas.getContext('2d');
				}
				break;
			case 'exit':
				if (json['document']['_context']['2d'][0] != null) {
					for (var i = 0; i < json['document']['_context']['2d'][0]._rect.length; i++) {
						var rect = json['document']['_context']['2d'][0]._rect[i];
						ctx.fillStyle = rect._style.rawptr;
						ctx.fillRect(rect._x, rect._y, rect._w, rect._h);
					}
				}
				documentJson = json;
				Ext.MessageBox.hide();
			case 'progress':
				//if (json['document']['_context']['2d'].length > 0) {
				//	var body = json['document']._elems.body._elems[0];
				//	if (canvasWindow == null && body != null) {
				//		for (var i = 0; i < body._child.length; i++) {
				//			var node = body._child[i];
				//			if (node.nodeName == "Canvas") {
				//				for (var j = 0; j < node._attributes.length; j++) {
				//					var attr = node._attributes[j];
				//					if (attr.indexOf("width") >= 0) {
				//						width = parseInt(attr.split("=")[1]);
				//					} else if (attr.indexOf("height") >= 0) {
				//						height = parseInt(attr.split("=")[1]);
				//					}
				//				}
				//				canvasWindow = Ext.create('widget.window', {
				//					title: 'Canvas',
				//					width: width + 12,
				//					height: height + 35,
				//					html: '<div id="canvas-body2"></div>'
				//				});
				//				canvasWindow.show();
				//				Ext.DomHelper.append('canvas-body2', {
				//					id: 'konoha-canvas2',
				//					tag: 'canvas',
				//					width: width,
				//					height: height
				//				});
				//				canvas = Ext.getDom('konoha-canvas2');
				//				ctx = canvas.getContext('2d');
				//			}
				//		}
				//	}
				//for (var i = 0; i < json.rect.length; i++) {
				//	var rect = json.rect[i]
				//	ctx.fillStyle = rect._style.rawptr;
				//	ctx.fillRect(rect._x, rect._y, rect._w, rect._h);
				//}
				//}
				//	showCanvas(json['document']['_context'], width, height);
				//}
				//function escapeText(text) {
				//	text = text.replace(/&/g, '&amp;');
				//	text = text.replace(/</g, '&lt;');
				//	text = text.replace(/>/g, '&gt;');
				//	text = text.replace(/"/g, '&quot;');
				//	text = text.replace(/ /g, '&nbsp;');
				//	text = text.replace(/\r\n/g, '<br>');
				//	text = text.replace(/(\n|\r)/g, '<br>');
				//	return text;
				//}
				//Ext.DomHelper.overwrite('console-out', {
				//	tag: 'div',
				//	style: {
				//		color: 'blue'
				//	},
				//	html: (function() {
				//		if (json['out'] == null) {
				//			return '';
				//		} else {
				//			return '<p>' + escapeText(json['out']) + '</p>';
				//		}
				//	})()
				//});
				//Ext.DomHelper.overwrite('console-err', {
				//	tag: 'div',
				//	style: {
				//		color: 'red'
				//	},
				//	html: (function() {
				//		if (json['err'] == null) {
				//			return '';
				//		} else {
				//			return '<p>' + escapeText(json['err']) + '</p>';
				//		}
				//	})()
				//});
				//if (json['document']['_context']['2d'].length > 0) {
				//	var body = json['document']._elems.body._elems[0];
				//	var width = 300;
				//	var height = 300;
				//	if (body != null) {
				//		for (var i = 0; i < body._child.length; i++) {
				//			var node = body._child[i];
				//			if (node.nodeName == "Canvas") {
				//				for (var j = 0; j < node._attributes.length; j++) {
				//					var attr = node._attributes[j];
				//					if (attr.indexOf("width") >= 0) {
				//						width = parseInt(attr.split("=")[1]);
				//					} else if (attr.indexOf("height") >= 0) {
				//						height = parseInt(attr.split("=")[1]);
				//					}
				//				}
				//			}
				//		}
				//	}
				//	showCanvas(json['document']['_context'], width, height);
				//}
				function escapeText(text) {
					text = text.replace(/&/g, '&amp;');
					text = text.replace(/</g, '&lt;');
					text = text.replace(/>/g, '&gt;');
					text = text.replace(/"/g, '&quot;');
					text = text.replace(/ /g, '&nbsp;');
					text = text.replace(/\r\n/g, '<br>');
					text = text.replace(/(\n|\r)/g, '<br>');
					return text;
				}
				Ext.DomHelper.overwrite('console-out', {
					tag: 'div',
					style: {
						color: 'blue'
					},
					html: (function() {
						if (json['out'] == null) {
							return '';
						} else {
							return '<p>' + escapeText(json['out']) + '</p>';
						}
					})()
				});
				Ext.DomHelper.overwrite('console-err', {
					tag: 'div',
					style: {
						color: 'red'
					},
					html: (function() {
						if (json['err'] == null) {
							return '';
						} else {
							return '<p>' + escapeText(json['err']) + '</p>';
						}
					})()
				});
			}
		};
		worker.onerror = function(e) {
			Ext.MessageBox.hide();
			Ext.MessageBox.show({
					title: 'Error',
					msg: 'An error occurred!',
					icon: Ext.MessageBox.ERROR,
					buttons: Ext.MessageBox.OK
			});
		};
		//worker.postMessage(JSON.stringify({
		//	type: 'config',
		//	async: true,
		//	interval: 1000
		//}));
		worker.postMessage(JSON.stringify({
			type: 'start'
		}));
		Ext.MessageBox.show({
			msg: 'Running konoha, please wait...',
			progressText: 'Running...',
			buttons: Ext.MessageBox.CANCEL,
			fn: function(btn) {
				worker.terminate();
			},
			icon: 'konoha-running'
		});
	};
	var loadScript = function(title, name, type, success_func) {
		Ext.Ajax.request({
			method: 'GET',
			url: homeURL + 'cgi-bin/load.k',
			params: {
				title: title,
				name: name,
				type: type
			},
			success: function(result) {
				var json = Ext.JSON.decode(result.responseText);
				if (success_func != null) {
					success_func(json['script'].trim());
				}
			},
			failure: function() {
				Ext.Msg.alert('POST Failed');
			}
		});
	};
	var saveScript = function(title, name, script, success) {
			Ext.Ajax.request({
				method: 'POST',
				url: homeURL + 'cgi-bin/save.k',
				params: {
					title: title,
					name: name,
					script: script
				},
				success: function(result) {
					var json = Ext.JSON.decode(result.responseText);
					if (success != null) {
						success(json['result']);
					}
				},
				failure: function() {
					Ext.Msg.alert('POST Failed');
				}
			});
	};
	var storeScript = function(title, name, script) {
		store.load();
		store.add({
			user: userName,
			repo: title,
			name: name,
			body: script
		});
		store.sync();
	};

	editorPanel = Ext.create('Ext.panel.Panel', {
		title: data.repo,
		frame: true,
		split: true,
		margins: '0 0 0 5',
		region: 'center'
	});

	editorPanel.addListener('resize', function(component, eOpts) {
		editorPanel.add({
				resizable: true,
				height: 400,
				xtype: 'uxCodeMirrorPanel',
				title: data.name,
				sourceCode: data.body,
				layout: 'fit',
				parser: 'javascript',
				setId: 'ktextarea',
				onSave: function() {
					storeScript(editorPanel.title, this.title, this.codeMirrorEditor.getValue());
				},
				Run: function() {
					loadScript(data.repo, data.name, 'answer', function(script) {
						var current = editorPanel.getChildByElement('ktextarea').codeMirrorEditor.getValue();
						if (script == current.trim()) {
							storeScript(data.repo, data.name, current);
							saveScript(data.repo, data.name, current, function() {
								runKonoha(data.repo, data.name);
							});
						} else {
							Ext.MessageBox.show({
									msg: "'" + data.repo + "/" + data.name + "' has been modified. Save changes?",
									buttons: Ext.MessageBox.YESNOCANCEL,
									fn: function(btn) {
										switch (btn) {
										case 'yes':
											saveScript(data.repo, data.name, current, function(result) {
												runKonoha(data.repo, data.name);
											});
											break;
										case 'no':
											saveScript('Repository', 'notitle.k', current, function(result) {
												runKonoha('Repository', 'notitle.k');
											});
											break;
										case 'cancel':
											break;
										}
									},
									icon: Ext.MessageBox.QUESTION
							});
						}
					});
				},
				Push: function() {
					todo();
				},
				codeMirror: {
					height: '100%',
					width: '100%'
				}
		});
		editorPanel.add({
				xtype: 'panel',
				name: 'console',
				id: 'console',
				resizable: true,
				autoScroll: true,
				html: '<div id="console-out" style="font-family: monospace;"></div><div id="console-err" style="font-family: monospace;"></div>',
				height: 100
		});
	}, this, {
		single: true
	});

	var uSrcDirStore = Ext.create('Ext.data.TreeStore', {
		model: 'uSrcDirModel',
		proxy: {
			type: 'ajax',
			url: homeURL + 'cgi-bin/list.k'
		},
		folderSort: true
	});

	var uSrcDirTree = Ext.create('Ext.tree.Panel', {
		title: 'Directory',
		region: 'east',
		width: mainWidth * 0.3,
		frame: true,
		split: true,
		margins: '0 5 0 0',
		useArrows: true,
		rootVisible: false,
		store: uSrcDirStore,
		columns: [
			{
				xtype: 'treecolumn',
				text: 'File',
				flex: 1.5,
				sortable: true,
				dataIndex: 'name'
			}
		],
	});

	uSrcDirTree.addListener('itemdblclick', function(view, record, item, index, e, eOpts) {
		if (record.raw.leaf) {
			data.repo = record.parentNode.raw.name;
			data.name = record.raw.name;
			/* leaf item */
			//var type = 'answer';
			//if (record.parentNode.parentNode.raw == null) {
			//	type = 'subject';
			//}
			var type = 'answer';
			loadScript(data.repo, data.name, type, function(script) {
				if (script != null) {
					editorPanel.getChildByElement('ktextarea').codeMirrorEditor.setValue(script);
				} else {
					editorPanel.getChildByElement('ktextarea').codeMirrorEditor.setValue("");
				}
				editorPanel.setTitle(data.repo);
				editorPanel.getChildByElement('ktextarea').setTitle(data.name);
			});
		}
	});

	var createForm = Ext.create('Ext.form.Panel', {
		url: homeURL + 'cgi-bin/create.k',
		bodyPadding: 5,
		fieldDefaults: {
			labelWidth: 140
		},
		items: [{
			xtype: 'textfield',
			fieldLabel: 'Subject Title<br>(Git Repository Name)',
			name: 'title',
			vtype: 'nospace',
			anchor: '100%'
		}, {
			xtype: 'textareafield',
			fieldLabel: 'Contents of this subject',
			name: 'desc',
			id: 'create-desc',
			height: 200,
			anchor: '100%'
		}, {
			xtype: 'textareafield',
			fieldLabel: 'Sample Program',
			name: 'script',
			id: 'create-script',
			height: 200,
			anchor: '100%'
		}]
	});

	var createWindow = Ext.create('Ext.window.Window', {
		title: 'Create a subject',
		layout: 'fit',
		plain: true,
		width: mainWidth * 0.7,
		items: createForm,
		closeAction: 'hide',
		buttons: [{
			text: 'OK',
			handler: function() {
				var form = createForm.getForm();
				if (form.isValid()) {
					form.submit({
						success: function(form, action) {
							Ext.Msg.alert('Success', action.result.msg);
							createWindow.hide();
							form.reset();
							uSrcDirStore.sync();
						},
						failure: function(form, action) {
							Ext.Msg.alert('Failed', action.result.msg);
							createWindow.hide();
							form.reset();
						}
					});
				}
			}
		}, {
			text: 'Cancel',
			handler: function() {
				createWindow.hide();
			}
		}]
	});

	var navigationPanel = Ext.create('Ext.panel.Panel', {
		frame: true,
		split: true,
		margins: '5 5 0 5',
		title: 'Navigation',
		region: 'north',
		items:[
			{
				xtype: 'displayfield',
				value: 'Welcome, ' + userName,
			},
			{
				xtype: 'button',
				text: 'Logout',
				handler: function() {
					Ext.Ajax.request({
						method: 'POST',
						url: homeURL + 'cgi-bin/logout.k',
						success: function(result) {
							Ext.util.Cookies.clear("SID", "/");
							location.reload();
						},
						failure: function() {
							Ext.Msg.alert('Logout Failed');
						}
					});
				}
			//},
			//{
			//	xtype: 'button',
			//	text: 'Create a subject',
			//	handler: function() {
			//		if (!createWindow.isVisible()) {
			//			createWindow.show();
			//		}
			//	}
			}
		]
	});
	
	new Ext.Viewport({
		layout: 'border',
		defaults: {
			collapsible: true,
			bodyStyle: 'padding:5px'
		},
		items:[
			navigationPanel,
			editorPanel,
			uSrcDirTree
		]
	});
});
