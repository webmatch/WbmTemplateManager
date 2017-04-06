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
    layout      : {
        type: 'vbox',
        align: 'stretch'
    },
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
            title: '{s name="smartyFieldLabel"}Extension{/s}',
            xtype: 'codemirrorfield',
            mode: 'smarty',
            name: 'content',
            allowBlank: true
        });

        me.editorField2 = Ext.create('Shopware.form.field.CodeMirror', {
            title: '{s name="smarty2FieldLabel"}Base{/s}',
            xtype: 'codemirrorfield',
            readOnly: true,
            mode: 'smarty',
            name: 'oContent',
            allowBlank: true
        });

        me.on('resize', function(cmp, width, height) {
            me.resizeEditor(cmp, cmp.editorField, width, height);
            me.resizeEditor(cmp, cmp.editorField2, width, height);
        });

        me.editorField.on('editorready', function() {
            me.resizeEditor(me, me.editorField, me.getWidth(), me.getHeight());
        });
        me.editorField2.on('editorready', function() {
            me.resizeEditor(me, me.editorField2, me.getWidth(), me.getHeight());
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
            {
                xtype: 'tabpanel',
                flex: 1,
                items: [
                    me.editorField,
                    me.editorField2
                ],
                listeners: {
                    tabchange: function() {
                        if(!me.editorField.editor || !me.editorField2.editor) {
                            return;
                        }
                        me.editorField.editor.refresh();
                        me.editorField2.editor.refresh();
                    }
                }
            }
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
    resizeEditor : function(cmp, editorField, width, height) {
        var editor = editorField.editor,
            scroller;

        if(!editor || !editor.hasOwnProperty('display')) {
            return false;
        }

        scroller = editor.display.scroller;

        width -= cmp.bodyPadding * 2 + 5;
        // We need to remove the bodyPadding, the padding on the field itself and the scrollbars
        height -= cmp.bodyPadding * 5 + 90;

        editor.setSize(width, height);
        Ext.get(scroller).setSize({ width: width, height: height });
    }
});