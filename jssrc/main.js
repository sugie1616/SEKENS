Ext.Loader.setConfig({enabled: true});
Ext.Loader.setPath('Ext.ux.DataView', '../ext-4.0.7/examples/ux/DataView');

Ext.require(['*']);
Ext.onReady(function() {
	Ext.tip.QuickTipManager.init();

	Ext.define('Code', {
		fields: ['name', 'body'],
		extend: 'Ext.data.Model',
		proxy: {
			type: 'localstorage',
			id: 'Source-Codes'
		}
	});

	var editFile = 'test.k';
	var mainWidth = document.body.clientWidth;
	var mainHeight = document.body.clientHeight;

	var editorPanel = Ext.widget('form', {
		title: 'Editor',
		frame: true,
		split: true,
		width: mainWidth * 0.7,
		//height: 400,
		//animCollapse: true,
		margins: '0 0 0 5',
		region: 'center',
		//fieldDefaults: {
		//	labelAlign: 'left',
		//},
		items: [
			//{
			//	xtype: 'displayfield',
			//	name: 'textarealabel',
			//	fieldLabel: 'hoge',
			//	value: ''
			//},
			//{
			//	xtype: 'textareafield',
			//	name: 'textarea',
			//	id: 'textarea',
			//	flex: 1.5,
			//	height: 300,
			//	width: mainWidth * 0.7,
			//	emptyText: 'Source Code'
			//},
			{
				height: 400,
				xtype: 'uxCodeMirrorPanel',
				title: editFile,
				sourceCode: '/* write here some KonohaScript code */',
				layout: 'fit',
				parser: 'clike',
				setId: 'konohatextarea',
				onSave: function() {
					var store = Ext.create('Ext.data.Store', {
						model: "Code"
					});
					store.load();
					store.add({
						name: editFile,
						body: this.codeMirrorEditor.getValue()
					});
					store.sync();
				},
				Run: function() {
					var worker = new Worker(homeURL + 'cgi-bin/run.k?title=test&name=hello.k');
					worker.onmessage = function(e) {
						editorPanel.getForm().findField('console').setValue(e.data);
						Ext.MessageBox.hide();
					};
					worker.onerror = function(e) {
						Ext.MessageBox.hide();
						Ext.MessageBox.alert('Status', 'An error occurred!', function(btn) {
							/* do nothing */
						});
					};
					worker.postMessage("start");
					var stopKonoha = function(btn) {
						worker.terminate();
					};
					Ext.MessageBox.show({
						msg: 'Running konoha, please wait...',
						progressText: 'Running...',
						width: 300,
						wait: true,
						waitConfig: {interval:200},
						buttons: Ext.MessageBox.CANCEL,
						fn: stopKonoha,
						icon: homeURL + 'resources/images/konoha.png'
					});
				},
				Push: function() {
					Ext.Ajax.request({
						method: 'POST',
						url: homeURL + 'cgi-bin/push.k',
						params: {
							input: editorPanel.items.items[0].codeMirrorEditor.getValue()
						},
						success: function(result) {
							Ext.Msg.alert(result.responseText);
						},
						failure: function() {
							Ext.Msg.alert('POST Failed');
						},
					});
				},
				codeMirror: {
					height: '100%',
					width: '100%'
				}
			},
			//{
			//	xtype: 'button',
			//	name: 'loadbtn',
			//	text: 'Load',
			//	handler: function() {
			//		Ext.Ajax.request({
			//			method: 'POST',
			//		url: homeURL + 'cgi-bin/load.k',
			//		params: {
			//			input: '',
			//		},
			//		success: function(result) {
			//			Ext.Msg.alert('Loading Completed');
			//			editorPanel.getForm().findField('textarea').setValue(result.responseText);
			//		},
			//		failure: function() {
			//			Ext.Msg.alert('Loading Failed');
			//		},
			//		});
			//	},
			//},
			//{
			//	xtype: 'displayfield',
			//	name: 'textarealabel',
			//	fieldLabel: 'Console',
			//	value: ''
			//},
			{
				xtype: 'textareafield',
				name: 'console',
				id: 'console',
				width: mainWidth * 0.7,
				flex: 1,
				emptyText: 'Console',
			},
		]
	});

	Ext.define('uSrcDirModel', {
		extend: 'Ext.data.Model',
		fields: [
			{name: 'name', type: 'string'}
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
		height: 400,
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
			/* leaf item */
			Ext.Ajax.request({
				method: 'GET',
				url: homeURL + 'cgi-bin/load.k',
				params: {
					title: record.parentNode.raw.name,
					name: record.raw.name
				},
				success: function(result) {
					var json = Ext.JSON.decode(result.responseText);
					if (json['script'] != null) {
						editorPanel.items.items[0].codeMirrorEditor.setValue(json['script']);
					}
				},
				failure: function() {
					Ext.Msg.alert('POST Failed');
				}
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

