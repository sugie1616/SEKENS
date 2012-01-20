Ext.Loader.setConfig({enabled: true});
Ext.Loader.setPath('Ext.ux.DataView', '../ext-4.0.7/example/ux/DataView');

Ext.require(['*']);
Ext.onReady(function() {
Ext.tip.QuickTipManager.init();

var userName = 'Gest User';
var editFile = 'test.k';

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
					url: '../cgi-bin/run.k',
					params: {
						input: document.getElementById("textarea").getElementsByTagName("textarea")[0].value
					},
					success: function(result) {
						document.getElementById("console").getElementsByTagName("textarea")[0].value = result.responseText;
					},
					failure: function() {
						Ext.Msg.alert('Fail Run Konoha');
					},
				});
			}
		},	
		{
			xtype: 'button',
			name: 'savebtn',
			text: 'Save',
			handler: function() {
				Ext.Ajax.request({
					method: 'POST',
					url: '../cgi-bin/save.k',
					params: {
						input: 'sugimoto' + '!!!' + document.getElementById("textarea").getElementsByTagName("textarea")[0].value
					},
					success: function(result) {
						Ext.Msg.alert(result.responseText);
					},
					failure: function() {
						Ext.Msg.alert('POST Failed');
					},
				});
			}
		},
		{
			xtype: 'button',
			name: 'loadbtn',
			text: 'Load',
			handler: function() {
				Ext.Ajax.request({
					method: 'POST',
					url: '../cgi-bin/load.k',
					params: {
						input: '',
					},
					success: function(result) {
						Ext.Msg.alert('Loading Completed');
						document.getElementById("textarea").getElementsByTagName("textarea")[0].value = result.responseText;
					},
					failure: function() {
						Ext.Msg.alert('Loading Failed');
					},
				});
			}
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
	//Ext.BLANK_IMAGE_URL = '../ext-4.0.7/resources/themes/images/default/tree/s.gif';
//		var dirTreePanel = new Ext.tree.TreePanel({
//			title: 'Directory',
//		root: {
//			text: 'Problem',
//			id: 'root',
//			expanded: true,
//			children: [
//			{
//				id: 'test1.k',
//				text: 'test1',
//				leaf: true,
//			},
//			{
//				id: 'test2.k',
//				text: 'test2',
//				leaf: true,
//			},
//			{
//				id: 'test3.k',
//				text: 'test3',
//				leaf: true,
//			},
//			]
//		}
//		});
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
	//collapsible: true,
	//animCollapse: true,
	margins: '0 0 0 5',
	title: userName,
	region:'center',
	items:[
	{
		xtype: 'displayfield',
		value: 'Welcome, ' + userName,
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

//var formPanel = Ext.widget('form', {
//	renderTo: Ext.getBody(),
//	id: 'accountFormPanel',
//	frame: true,
//	//width: 200,
//	bodyPadding: 10,
//	bodyBorder: true,
//	title: 'Account Registration',
//
//	defaults: {
//		anchor: '100%'
//	},
//	fieldDefaults: {
//		labelAlign: 'left',
//	msgTarget: 'none',
//	invalidCls: '' //unset the invalidCls so individual fields do not get styled as invalid
//	},
//	listeners: {
//		fieldvaliditychange: function() {
//			this.updateErrorState();
//		},
//	fielderrorchange: function() {
//		this.updateErrorState();
//	}
//	},
//
//	updateErrorState: function() {
//		var me = this,
//		errorCmp, fields, errors;
//
//		if (me.hasBeenDirty || me.getForm().isDirty()) { //prevents showing global error when form first loads
//			errorCmp = me.down('#formErrorState');
//			fields = me.getForm().getFields();
//			errors = [];
//			fields.each(function(field) {
//				Ext.Array.forEach(field.getErrors(), function(error) {
//					errors.push({name: field.getFieldLabel(), error: error});
//				});
//			});
//			errorCmp.setErrors(errors);
//			me.hasBeenDirty = true;
//		}
//	},
//
//	items: [
//	{
//		xtype: 'displayfield',
//		value: 'User Name:',
//	},
//	{
//		xtype: 'textfield',
//		name: 'username',
//		id: 'username',
//		emptyText: 'User Name',
//		//fieldLabel: 'User Name',
//		allowBlank: false,
//		minLength: 6
//	},
////	{
////		xtype: 'displayfield',
////		value: 'E-mail Adress:',
////	},
////	{
////		xtype: 'textfield',
////		name: 'email',
////		emptyText: 'E-mail Adress',
////		//fieldLabel: 'Email Address',
////		vtype: 'email',
////		allowBlank: false
////	},
//	{
//		xtype: 'displayfield',
//		value: 'Password:',
//	},
//	{
//		xtype: 'textfield',
//		name: 'password1',
//		id: 'password1',
//		inputType: 'password',
//		allowBlank: false,
//		minLength: 8
//	},
//	{
//		xtype: 'displayfield',
//		value: 'Repeat Password:',
//	},
//	{
//		xtype: 'textfield',
//		name: 'password2',
//		id: 'password2',
//		inputType: 'password',
//		allowBlank: false,
//		validator: function(value) {
//			var password1 = this.previousSibling('[name=password1]');
//			return (value === password1.getValue()) ? true : 'Passwords do not match.'
//		}
//	},
//	{
//		xtype: 'displayfield',
//		value: 'Debug:',
//	},
//	{
//		xtype: 'textfield',
//		name: 'debug',
//		id: 'debug',
//	},
//
//	],
//
//	dockedItems: [{
//		xtype: 'container',
//		dock: 'bottom',
//		layout: {
//			type: 'hbox',
//			align: 'middle'
//		},
//		padding: '10 10 5',
//
//		items: [
//		{
//			xtype: 'component',
//			id: 'formErrorState',
//			baseCls: 'form-error-state',
//			flex: 1,
////			validText: 'Form is valid',
////			invalidText: 'Form has errors',
//			tipTpl: Ext.create('Ext.XTemplate', '<ul><tpl for="."><li><span class="field-name">{name}</span>: <span class="error">{error}</span></li></tpl></ul>'),
//
//			getTip: function() {
//				var tip = this.tip;
//				if (!tip) {
//					tip = this.tip = Ext.widget('tooltip', {
//						target: this.el,
//						title: 'Error Details:',
//						autoHide: false,
//						anchor: 'top',
//						mouseOffset: [-11, -2],
//						closable: true,
//						constrainPosition: false,
//						cls: 'errors-tip'
//					});
//					tip.show();
//				}
//				return tip;
//			},
//
//			setErrors: function(errors) {
//				var me = this,
//				baseCls = me.baseCls,
//				tip = me.getTip();
//
//				errors = Ext.Array.from(errors);
//
//				// Update CSS class and tooltip content
//				if (errors.length) {
//					me.addCls(baseCls + '-invalid');
//					me.removeCls(baseCls + '-valid');
//					me.update(me.invalidText);
//					tip.setDisabled(false);
//					tip.update(me.tipTpl.apply(errors));
//				} else {
//					me.addCls(baseCls + '-valid');
//					me.removeCls(baseCls + '-invalid');
//					me.update(me.validText);
//					tip.setDisabled(true);
//					tip.hide();
//				}
//			}
//		},
//		{
//			xtype: 'button',
//			formBind: true,
//			disabled: true,
//			text: 'Register!',
//			width: 80,
//			handler: function() {
//				var debugEl = Ext.get("debug");
//				var form = formPanel.getForm();
//				Ext.Ajax.request({
//					method: 'GET',
//					url: 'http://localhost/cgi-bin/register.k',
//					params: form.getValues(true),
//					success: function(result) {
//						debugEl.dom.innerHTML = result.responseText;
//					},
//					failure: function() {
//					},
//				});
//			},
//		},
//		{
//			xtype: 'button',
//			formBind: true,
//			disabled: true,
//			text: 'Login',
//			width: 80,
//			handler: function() {
//				var debugEl = Ext.get("debug");
//				var form = formPanel.getForm();
//				Ext.Ajax.request({
//					method: 'GET',
//					url: 'http://localhost/cgi-bin/login.k',
//					params: form.getValues(true),
//					success: function(result) {
//						debugEl.dom.innerHTML = result.responseText;
//						userName = 'sugimoto';
//					},
//					failure: function() {
//					},
//				});
//			}
//		},
//		]
//	}]
//});
//
//
