Ext.Loader.setConfig({enabled: true});
Ext.Loader.setPath('Ext.ux.DataView', '../ext-4.0.7/examples/ux/DataView');
Ext.require(['*']);

Ext.define('Code', {
	fields: ['repo', 'name', 'body'],
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

Ext.onReady(function() {
	Ext.tip.QuickTipManager.init();
	var todo = function() {
		Ext.Msg.alert('TODO', 'Coming soon.');
	};
	var data = {
		repo: 'Repository',
		name: 'notitle.k',
		body: '/* write here some KonohaScript code */'
	};
	var mainWidth = document.body.clientWidth;
	var mainHeight = document.body.clientHeight;
	var store = Ext.create('Ext.data.Store', {
		model: "Code"
	});
	store.load();
	if (store.last() != null) {
		data = store.last().data;
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
	var showCanvas = function(kctx, width, height) {
		var win = Ext.create('widget.window', {
				title: 'Canvas',
				width: width + 12,
				height: height + 35,
				html: '<div id="canvas-body"></div>'
		});
		win.show();
		Ext.DomHelper.append('canvas-body', {
			id: 'konoha-canvas',
			tag: 'canvas',
			width: width,
			height: height
		});
		var canvas = Ext.getDom('konoha-canvas');
		var ctx = canvas.getContext('2d');
		for (var i = 0; i < kctx['2d'][0]._rect.length; i++) {
			var rect = kctx['2d'][0]._rect[i];
			ctx.fillStyle = rect._style.rawptr;
			ctx.fillRect(rect._x, rect._y, rect._w, rect._h);
		}
	};
	var runKonoha = function(title, name) {
		var worker = new Worker(homeURL + 'cgi-bin/run.k?title=' + title + '&name=' + name);
		//var worker = new Worker(homeURL + 'jssrc/worker.js');
		worker.onmessage = function(e) {
			var json = Ext.JSON.decode(e.data);
			if (json['document']['_context']['2d'].length > 0) {
				var body = json['document']._elems.body._elems[0];
				var width = 300;
				var height = 300;
				if (body != null) {
					for (var i = 0; i < body._child.length; i++) {
						var node = body._child[i];
						if (node.nodeName == "Canvas") {
							for (var j = 0; j < node._attributes.length; j++) {
								var attr = node._attributes[j];
								if (attr.indexOf("width") >= 0) {
									width = parseInt(attr.split("=")[1]);
								} else if (attr.indexOf("height") >= 0) {
									height = parseInt(attr.split("=")[1]);
								}
							}
						}
					}
				}
				showCanvas(json['document']['_context'], width, height);
			}
			//var el = document.createElement('span');
			Ext.DomHelper.overwrite('console-out', {
				tag: 'div',
				style: {
					color: 'blue'
				},
				html: (function() {
					if (json['out'] == null) {
						return '<p>out: </p>';
					} else {
						return '<p>out: </p><p>' + json['out'] + '</p>';
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
						return '<p>err: </p>';
					} else {
						return '<p>err: </p><p>' + json['err'] + '</p>';
					}
				})()
			});
			//el.innerHTML = j['out'];
			//el.style.color = '##0000ff';
			//editorPanel.getChildByElement('console').setRawValueWithColor('hi', 'red');
			//editorPanel.getChildByElement('console')
			//editorPanel.getChildByElement('console').setValue(el);
			Ext.MessageBox.hide();
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
		worker.postMessage("start");
		Ext.MessageBox.show({
				msg: 'Running konoha, please wait...',
				progressText: 'Running...',
				width: 300,
				wait: true,
				waitConfig: {interval:200},
				buttons: Ext.MessageBox.CANCEL,
				fn: function(btn) {
					worker.terminate();
				},
				icon: 'konoha-running'
		});
	};
	var loadScript = function(title, name, success) {
			Ext.Ajax.request({
				method: 'GET',
				url: homeURL + 'cgi-bin/load.k',
				params: {
					title: title,
					name: name
				},
				success: function(result) {
					var json = Ext.JSON.decode(result.responseText);
					success(json['script']);
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
					success(json['result']);
				},
				failure: function() {
					Ext.Msg.alert('POST Failed');
				}
			});
	};
	var storeScript = function(title, name, script) {
		store.load();
		store.add({
			repo: title,
			name: name,
			body: script
		});
		store.sync();
	};

	var editorPanel = Ext.create('Ext.panel.Panel', {
		title: data.repo,
		frame: true,
		split: true,
		//width: mainWidth * 0.7,
		//height: 400,
		//animCollapse: true,
		margins: '0 0 0 5',
		region: 'center',
		//fieldDefaults: {
		//	labelAlign: 'left',
		//},
		items: [
			{
				height: 400,
				width: mainWidth * 0.7,
				xtype: 'uxCodeMirrorPanel',
				title: data.name,
				sourceCode: data.body,
				layout: 'fit',
				parser: 'clike',
				setId: 'ktextarea',
				onSave: function() {
					storeScript(editorPanel.title, this.title, this.codeMirrorEditor.getValue());
				},
				Run: function() {
					var requrl = homeURL + 'cgi-bin/run.k';
					loadScript(data.repo, data.name, function(script) {
						var current = editorPanel.getChildByElement('ktextarea').codeMirrorEditor.getValue();
						if (script == current) {
							runKonoha(data.repo, data.name);
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
					//if (repotitle == 'Repository' && filename == 'notitle.k') {
					//	/* test run */
					//	Ext.Ajax.request({
					//		method: 'POST',
					//		url: homeURL + 'cgi-bin/save.k',
					//		params: {
					//			title: repotitle,
					//			name: filename,
					//			script: editorPanel.getChildByElement('ktextarea').codeMirrorEditor.getValue()
					//		},
					//		success: function(result) {
					//			var json = json_alert(result);
					//			if (json != null) {
					//				//Ext.MessageBox.show({
					//				//	title: 'Result',
					//				//	msg: json['result'],
					//				//	icon: Ext.MessageBox.OK,
					//				//	buttons: Ext.MessageBox.OK
					//				//});
					//				runKonoha(repotitle, filename);
					//			}
					//		},
					//		failure: function() {
					//			Ext.Msg.alert('POST Failed');
					//		},
					//	});
					//} else {
					//}
				},
				Push: function() {
					todo();
					//Ext.Ajax.request({
					//	method: 'POST',
					//	url: homeURL + 'cgi-bin/push.k',
					//	params: {
					//		input: editorPanel.getChildByElement('ktextarea').codeMirrorEditor.getValue()
					//	},
					//	success: function(result) {
					//		var json = json_alert(result);
					//		if (json != null) {
					//			Ext.MessageBox.show({
					//				title: 'Result',
					//				msg: json['result'],
					//				icon: Ext.MessageBox.OK,
					//				buttons: Ext.MessageBox.OK
					//			});
					//		}
					//	},
					//	failure: function() {
					//		Ext.Msg.alert('POST Failed');
					//	},
					//});
				},
				codeMirror: {
					height: '100%',
					width: '100%'
				}
			},
			{
				xtype: 'panel',
				name: 'console',
				id: 'console',
				html: '<div id="console-out" style="font-family: monospace;"></div><div id="console-err" style="font-family: monospace;"></div>',
				width: mainWidth * 0.7,
				height: 100
			}
		]
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
		//height: 400,
		frame: true,
		split: true,
		margins: '0 5 0 0',
		//collapsible: true,
		useArrows: true,
		rootVisible: false,
		store: uSrcDirStore,
		//multiSelect: true,
		//singleExpand: true,
		columns: [
			{
				xtype: 'treecolumn',
				text: 'File',
				flex: 1.5,
				sortable: true,
				dataIndex: 'name'
			},
			//		{
			//			text: 'Name',
			//			flex: 1,
			//			dateIndex: 'userName',
			//			sortable: true,
			//		}
		],
	});

	uSrcDirTree.addListener('itemdblclick', function(view, record, item, index, e, eOpts) {
		if (record.raw.leaf) {
			data.repo = record.parentNode.raw.name;
			data.name = record.raw.name;
			/* leaf item */
			loadScript(data.repo, data.name, function(script) {
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

	//var mainPanel = Ext.create('Ext.panel.Panel', {
	//	frame: true,
	//	split: true,
	//	margins: '0 0 0 5',
	//	region: 'center',
	//	title: editFile,
	//	layout: {
	//		type: 'table',
	//		columns: 2
	//	},
	//	items: [
	//		editorPanel,
	//		uSrcDirTree,
	//	],
	//});

	//var mainTabPanel = Ext.create('Ext.panel.Panel', {
	//	frame: true,
	//	split: true,
	//	region: 'center',
	//	margins: '0 0 0 5',
	//	title: userName,
	//	items: [
	//		editorPanel,
	//		uSrcDirTree
	////	mainPanel,
	////		new Ext.Viewport({
	////			layout: 'border',
	////			items: [
	////				editorPanel,
	////				uSrcDirTree,
	////			]
	////		}),
	//		//mainPanel,
	//	],
	//});

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
			//mainTabPanel,
			editorPanel,
			uSrcDirTree
		]
	});
});
