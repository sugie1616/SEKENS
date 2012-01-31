Ext.Loader.setConfig({enabled: true});
Ext.Loader.setPath('Ext.ux.DataView', '../ext-4.0.7/examples/ux/DataView');

Ext.require(['*']);
Ext.onReady(function() {
	Ext.tip.QuickTipManager.init();
	var editFile = 'test.k';
	var mainWidth = 1000;
		
	var editorPanel = Ext.widget('form', {
		title: 'Editor',
		frame: true,
		split: true,
		width: mainWidth * 0.6,
		height: 400,
		animCollapse: true,
		margins: '0 0 0 5',
		region: 'center',
		fieldDefaults: {
			labelAlign: 'left',
		},
		items: [
			{
				xtype: 'displayfield',
				name: 'textarealabel',
				fieldLabel: editFile,
				value: ''
			},
			{
				xtype: 'textareafield',
				name: 'textarea',
				id: 'textarea',
				flex: 1.5,
				height: 200,
				width: mainWidth * 0.55,
				emptyText: 'Source Code',
			},
			{
				xtype: 'button',
				name: 'runbtn',
				text: 'Run',
				handler: function() {
					Ext.Ajax.request({
						method: 'POST',
					url: homeURL + 'cgi-bin/run.k',
					params: {
						input: editorPanel.getForm().getValues().textarea,
					},
					success: function(result) {
						editorPanel.getForm().findField('console').setValue(result.responseText);
					},
					failure: function() {
						Ext.Msg.alert('Fail Run Konoha');
					},
					});
				},
			},	
			{
				xtype: 'button',
				name: 'savebtn',
				text: 'Save',
				handler: function() {
					Ext.Ajax.request({
						method: 'POST',
					url: homeURL + 'cgi-bin/save.k',
					params: {
						input: editorPanel.getForm().getValues().textarea,
					},
					success: function(result) {
						Ext.Msg.alert(result.responseText);
					},
					failure: function() {
						Ext.Msg.alert('POST Failed');
					},
					});
				},
			},
			{
				xtype: 'button',
				name: 'loadbtn',
				text: 'Load',
				handler: function() {
					Ext.Ajax.request({
						method: 'POST',
					url: homeURL + 'cgi-bin/load.k',
					params: {
						input: '',
					},
					success: function(result) {
						Ext.Msg.alert('Loading Completed');
						editorPanel.getForm().findField('textarea').setValue(result.responseText);
					},
					failure: function() {
						Ext.Msg.alert('Loading Failed');
					},
					});
				},
			},
			{
				xtype: 'displayfield',
				name: 'textarealabel',
				fieldLabel: 'Console',
				value: ''
			},
			{
				xtype: 'textareafield',
				name: 'console',
				id: 'console',
				width: mainWidth * 0.55,
				flex: 1,
				emptyText: 'Console',
			},
		]
	});

	Ext.define('uSrcDirModel', {
		extend: 'Ext.data.Model',
		fields: [
			{name: 'userName', type: 'string'},
			{name: 'repoName', type: 'string'},
			{name: 'fileName', type: 'string'}
		]
	});

	var uSrcDirStore = Ext.create('Ext.data.TreeStore', {
		model: 'uSrcDirModel',
		proxy: {
			type: 'ajax',
			url: homeURL + 'resources/usrcdir.json'
		},
		folderSort: true
	});

	var uSrcDirTree = Ext.create('Ext.tree.Panel', {
		title: 'Directory',
		region: 'east',
		width: 400,
		height: 400,
		frame: true,
		split: true,
		margins: '0 0 0 5',
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
				dataIndex: 'repoName'
			},
			//		{
			//			text: 'Name',
			//			flex: 1,
			//			dateIndex: 'userName',
			//			sortable: true,
			//		}
		]
	});

	var mainPanel = Ext.create('Ext.panel.Panel', {
		frame: true,
		split: true,
		margins: '0 0 0 5',
		region: 'center',
		title: editFile,
		layout: {
			type: 'table',
			columns: 2
		},
		items: [
			editorPanel,
			uSrcDirTree,
		],
	});


	var mainTabPanel = Ext.create('Ext.tab.Panel', {
		frame: true,
		split: true,
		region: 'center',
		margins: '0 0 0 5',
		title: userName,
		items: [
	//	mainPanel,
	//		new Ext.Viewport({
	//			layout: 'border',
	//			items: [
	//				editorPanel,
	//				uSrcDirTree,
	//			]
	//		}),
			mainPanel,
		],
	});

	var northPanel = Ext.create('Ext.panel.Panel', {
		frame: true,
		split: true,
		margins: '0 0 0 5',
		title: editFile,
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
							//Ext.Msg.alert('Logout Completed');
							Ext.util.Cookies.clear("SID", "/");
							location.reload();
						},
						failure: function() {
							//Ext.Msg.alert('Logout Failed');
						}
					});
				}
			}
		]
	});
	
	new Ext.Viewport({
		layout: 'border',
		items:[
			northPanel,
			mainTabPanel,
		]
	});
});

