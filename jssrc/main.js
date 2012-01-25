Ext.Loader.setConfig({enabled: true});
Ext.Loader.setPath('Ext.ux.DataView', '../ext-4.0.7/examples/ux/DataView');

Ext.require(['*']);
Ext.onReady(function() {
Ext.tip.QuickTipManager.init();

var userName = 'sugimoto';
var editFile = 'test.k';
var homeURL = 'http://localhost/SEKENS/';

var editorPanel = Ext.widget('form', {
	title: 'Editor',
	frame: true,
	split: true,
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
			height: 300,
			width: 800,
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
			width: 800,
			emptyText: 'Console',
		},
	]
});

//var gData = [
//	[sugies1],
//	[sugies2],
//];
//
//function getUsersGroup() {
//
//}
//
//var gStore = Ext.create('Ext.data.ArrayStore', {
//	data: gData,
//});
//
//var groupView = Ext.create('Ext.view.View', {
//	deferInitialRefresh: false,
//	store: gStore,
//
//});
//
//var groupPanel = Ext.create('Ext.panel.Panel', {
//	title: 'Group',
//	layout: 'fit',
//	items: groupView,
//});

var pData = [
	["sugi1"],
	["sugi2"],
	["sugi3"],
];

Ext.define('Peers', {
	extend: 'Ext.data.Model',
	fields: [
		'name',
	]
});

//function getUsersPeers() {
//
//}

var pStore = Ext.create('Ext.data.ArrayStore', {
	model: 'Peers',
	data: pData,
});
pStore.load();

var peersView = Ext.create('Ext.view.View', {
	//deferInitialRefresh: false,
	store: pStore,
	tpl: Ext.create('Ext.XTemplate',
		'<tpl for = ".">',
			'<div class = "peers">',
				(!Ext.isIE6? '<img width = "64" height = "64" src = "../resources/images/kiva.png" />' : '<div style="width:74px;height:74px;filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'../resources/images/kiva.png\',sizingMethod=\'scale\')"></div>'),
			'</div>',
		'</tpl>'
	),
	id: 'peers',
	
	itemSelector: 'div.peer',
	overItemCls : 'peer-hover',
	multiSelect : true,
	autoScroll  : true
});

var menuPanel = Ext.create('Ext.tab.Panel', {
	frame: true,
	items: [
		editorPanel,
		{
		xtype: 'panel',
		title: 'Group',
		closable: false,
		items: [
		    peersView,
		]
		},
		{
		xtype: 'panel',
		title: 'Directory',
		html: 'User Directory',
		closable: false
		},
	],
});

//var searchPanel = Ext.create('Ext.form.Panel', {
//	title: 'Search',
//	frame: true,
//	split: 'true',
//	margins: '5 0 0 5',
//	items: [
//{
//	xtype: 'displayfield',
//	value: 'Search Object:',
//},
//{
//	xtype: 'textfield',
//	name: 'findTextArea',
//	id: 'findTextArea',
//	emptyText: 'Object Name',
//},
//{
//	xtype: 'checkboxgroup',
//	cls: 'x-check-group-alt',
//	items: [
//		{boxLabel: 'Student', name: 'studentCB', checked: true},
//		{boxLabel: 'Teacher', name: 'teacherCB'},
//		{boxLabel: 'Group', name: 'groupCB'},
//	],
//	},
//{
//	xtype: 'button',
//	text: 'Search',
//	handler: function() {
//		Ext.Ajax.request({
//			method: 'POST',
//			url: 'http://localhost/cgi-bin/search.k',
//			params: {
//			input: document.getElementById("findTextArea").getElementsByTagName("findTextArea")[0].value
//		},
//		success: function(result) {
//			Ext.Msg.alert('Search Completed');
//			input: document.getElementById("searchdebug").getElementsByTagName("searchdebug")[0].value = result.responseText;
//		},
//		failure: function() {
//			Ext.Msg.alert('Search Failed');
//		},
//		});
//	}
//},
//{
//		xtype: 'displayfield',
//		value: 'Debug:',
//	},
//	{
//		xtype: 'textfield',
//		name: 'searchdebug',
//		id: 'searchdebug',
//	},
//
//	],
//});

//north panel
var northPanel = Ext.create('Ext.panel.Panel', {
	frame: true,
	split: true,
	//collapsible: true,
	//animCollapse: true,
	margins: '0 0 0 5',
	title: 'north',
	region:'north',
	html: 'Welcome !',
	items: [
	],
});

//center panel
var centerPanel = Ext.create('Ext.panel.Panel', {
	frame: true,
	split: true,
	margins: '0 0 0 5',
	title: userName,
	region:'center',
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
				method: 'GET',
				url: homeURL + 'cgi-bin/logout.k',
				params: 'sugimoto',
				success: function(result) {
					Ext.Msg.alert('Logout Completed');
				},
				failure: function() {
					Ext.Msg.alert('Logout Failed');
				},
			});
		},
	},
	menuPanel,
	]
});

//west panel
//var westPanel = Ext.create('Ext.panel.Panel', {
//	title: 'Menu',
//	width: 210,
//	region: 'west',
//	maxWidth: 400,
//	frame: true,
//	split: true,
//	collapsible: true,
//	animCollapse: true,
//	margins: '0 0 0 5',
//	items:[
//	formPanel,
//	searchPanel,
//	]
//});

//east panel
var eastPanel = Ext.create('Ext.panel.Panel',{
	title: 'Friends',
	width: 210,
	maxWidth: 400,
	region: 'east',
	frame: true,
	split: true,
	collapsible: true,
	animCollapse: true,
	margins: '0 0 0 5',
	items:[
	],
});

new Ext.Viewport({
	layout: 'border',
	items:[
	//northPanel,
	centerPanel,
	//westPanel,
	//eastPanel,
	]
});
});

