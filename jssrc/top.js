Ext.Loader.setConfig({enable: true});
Ext.Loader.setPath('Ext.ux.DataView', '../../ext-4.0.7/example/ux/DataView');

Ext.require(['*']);
Ext.onReady(function() {

	var formPanel = Ext.widget('form', {
		renderTo: Ext.getBody(),
		id: 'accountFormPanel',
		frame: true,
		width: 200,
		bodyPadding: 10,
		bodyBorder: true,
		title: 'Registration',
		region: 'center',
		defaults: {
			anchor: '100%'
		},
		fieldDefaults: {
			labelAlign: 'left',
		msgTarget: 'none',
		invalidCls: '' //unset the invalidCls so individual fields do not get styled as invalid
		},
		listeners: {
			fieldvaliditychange: function() {
				this.updateErrorState();
			},
			fielderrorchange: function() {
				this.updateErrorState();
			}
		},

		updateErrorState: function() {
			var me = this,
			errorCmp, fields, errors;

			if (me.hasBeenDirty || me.getForm().isDirty()) { //prevents showing global error when form first loads
				errorCmp = me.down('#formErrorState');
				fields = me.getForm().getFields();
				errors = [];
				fields.each(function(field) {
					Ext.Array.forEach(field.getErrors(), function(error) {
						errors.push({name: field.getFieldLabel(), error: error});
					});
				});
				errorCmp.setErrors(errors);
				me.hasBeenDirty = true;
			}
		},

		items: [
		{
			xtype: 'displayfield',
			value: 'User Name:',
		},
		{
			xtype: 'textfield',
			name: 'username',
			id: 'username',
			emptyText: 'User Name',
			//fieldLabel: 'User Name',
			allowBlank: false,
			minLength: 6
		},
		//	{
		//		xtype: 'displayfield',
		//		value: 'E-mail Adress:',
		//	},
		//	{
		//		xtype: 'textfield',
		//		name: 'email',
		//		emptyText: 'E-mail Adress',
		//		//fieldLabel: 'Email Address',
		//		vtype: 'email',
		//		allowBlank: false
		//	},
		{
			xtype: 'displayfield',
			value: 'Password:',
		},
		{
			xtype: 'textfield',
			name: 'password1',
			id: 'password1',
			inputType: 'password',
			allowBlank: false,
			minLength: 4,
		},
		{
			xtype: 'displayfield',
			value: 'Repeat Password:',
		},
		{
			xtype: 'textfield',
			name: 'password2',
			id: 'password2',
			inputType: 'password',
			allowBlank: false,
			validator: function(value) {
				var password1 = this.previousSibling('[name=password1]');
				return (value === password1.getValue()) ? true : 'Passwords do not match.'
			}
		},
//		{
//			xtype: 'displayfield',
//			value: 'Debug:',
//		},
//		{
//			xtype: 'textfield',
//			name: 'debug',
//			id: 'debug',
//			height: 300,
//		},
//
		],

		dockedItems: [{
			xtype: 'container',
			dock: 'bottom',
			layout: {
				type: 'hbox',
				align: 'middle'
			},
			padding: '10 10 5',

			items: [
			{
				xtype: 'component',
				id: 'formErrorState',
				baseCls: 'form-error-state',
				flex: 1,
				//			validText: 'Form is valid',
				//			invalidText: 'Form has errors',
				tipTpl: Ext.create('Ext.XTemplate', '<ul><tpl for="."><li><span class="field-name">{name}</span>: <span class="error">{error}</span></li></tpl></ul>'),

				getTip: function() {
					var tip = this.tip;
					if (!tip) {
						tip = this.tip = Ext.widget('tooltip', {
							target: this.el,
							title: 'Error Details:',
							autoHide: false,
							anchor: 'top',
							mouseOffset: [-11, -2],
							closable: true,
							constrainPosition: false,
							cls: 'errors-tip'
						});
						tip.show();
					}
					return tip;
				},

				setErrors: function(errors) {
					var me = this,
					baseCls = me.baseCls,
					tip = me.getTip();

					errors = Ext.Array.from(errors);

					// Update CSS class and tooltip content
					if (errors.length) {
						me.addCls(baseCls + '-invalid');
						me.removeCls(baseCls + '-valid');
						me.update(me.invalidText);
						tip.setDisabled(false);
						tip.update(me.tipTpl.apply(errors));
					} else {
						me.addCls(baseCls + '-valid');
						me.removeCls(baseCls + '-invalid');
						me.update(me.validText);
						tip.setDisabled(true);
						tip.hide();
					}
				}
			},
			{
				xtype: 'button',
				formBind: true,
				disabled: true,
				text: 'Register!',
				width: 80,
				handler: function() {
					var debugEl = Ext.get("debug");
					var param = "username=" + formPanel.getForm().getValues().username + "&password=" + formPanel.getForm().getValues().password1;
					Ext.Ajax.request({
						method: 'POST',
						url: homeURL + 'cgi-bin/register.k',
						
						params: param,
						success: function(result) {
//							debugEl.dom.innerHTML = result.responseText;
						},
						failure: function() {
						},
					});
				},
			},
			{
				xtype: 'button',
				formBind: true,
				disabled: true,
				text: 'Login',
				width: 80,
				handler: function() {
					var debugEl = Ext.get("debug");
					var param = "username=" + formPanel.getForm().getValues().username + "&password=" + formPanel.getForm().getValues().password1;
					Ext.Ajax.request({
						method: 'POST',
						url: homeURL + 'cgi-bin/login.k',
						params: param,
						success: function(result) {
							var resultJson = Ext.JSON.decode(result.responseText);
							Ext.util.Cookies.set(
								"SID", // name
								resultJson["SID"], // value
								new Date(new Date().getTime() + (1000 * 60 * 60 * 4)), // expires (4 hours)
								"/" // path
							);
							location.reload();
						},
						failure: function() {
						},
					});
				}
			},
			]
		}]
	});

	new Ext.Viewport({
		layout: 'border',
		items: [
		formPanel,
		]
	});

});
