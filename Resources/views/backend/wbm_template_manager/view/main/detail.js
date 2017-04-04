/**
 * Template Manager
 * Copyright (c) Webmatch GmbH
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 */

//{namespace name=backend/plugins/wbm/templatemanager}
//
Ext.define('Shopware.apps.WbmTemplateManager.view.main.Detail', {
    extend:'Ext.form.Panel',
    alias:'widget.template-manager-detail',
    cls:'template-manager-detail',
    collapsible : false,
    bodyPadding : 10,
    split       : false,
    region      : 'center',
    defaultType : 'textfield',
    autoScroll  : true,
    items : [],
    initComponent: function() {
        var me = this;
        
        me.dockedItems = [
            {
                xtype: 'toolbar',
                dock: 'bottom',
                cls: 'shopware-toolbar',
                ui: 'shopware-ui',
                items: me.getButtons()
            }
        ];
    
        me.editorField = Ext.create('Shopware.form.field.CodeMirror', {
            fieldLabel: '{s name="smartyFieldLabel"}Smarty{/s}',
            xtype: 'codemirrorfield',
            mode: 'smarty',
            labelAlign: 'top',
            name: 'content',
            allowBlank: true
        });

        me.on('resize', function(cmp, width, height) {
            me.resizeEditor(cmp, width, height)
        });

        me.editorField.on('editorready', function(editorField, editor) {
           me.resizeEditor(me, me.getWidth(), me.getHeight());
        });
        
        me.items = me.getItems();
        
        me.callParent(arguments);
        me.loadRecord(me.record);
    },  
    getItems:function () {
        var me = this;
        return [
            {
                fieldLabel: '{s name="nameFieldLabel"}Name{/s}',
                labelWidth: 50,
                anchor: '100%',
                name: 'name',
                allowBlank: false
            },
            me.editorField
        ];
    },
    getButtons : function()
    {
        var me = this;
        return [
            '->',
            {
                text    : '{s name="reset"}Reset{/s}',
                scope   : me,
                cls: 'secondary',
                action  : 'reset'
            },
            {
                text    : '{s name="save"}Save{/s}',
                action  : 'save',
                cls     : 'primary',
                formBind: true
            }
        ];
    },
    resizeEditor : function(cmp, width, height) {
        var editorField = cmp.editorField,
            editor = editorField.editor,
            scroller;
console.log(editorField);
        if(!editor || !editor.hasOwnProperty('display')) {
            return false;
        }

        scroller = editor.display.scroller;

        width -= cmp.bodyPadding * 2;
        // We need to remove the bodyPadding, the padding on the field itself and the scrollbars
        height -= cmp.bodyPadding * 5 + 90;

        editor.setSize(width, height);
        Ext.get(scroller).setSize({ width: width, height: height });
    }
});