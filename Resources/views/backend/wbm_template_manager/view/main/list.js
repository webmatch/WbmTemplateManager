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
Ext.define('Shopware.apps.WbmTemplateManager.view.main.List', {
    extend:'Ext.grid.Panel',
    border: false,
    alias:'widget.template-manager-list',
    region:'center',
    autoScroll:true,
    listeners: {
        itemclick: function(dv, record, item, rowIndex, e) {
            var me = this;
            me.fireEvent('openTemplateDetail', me, rowIndex);
        }
    },
    initComponent:function () {
        var me = this;
        me.columns = me.getColumns();
        me.dockedItems = [
            {
                xtype: 'toolbar',
                dock: 'top',
                cls: 'shopware-toolbar',
                ui: 'shopware-ui',
                items: me.getButtons()
            }
        ];
        me.callParent(arguments);
    },
    getColumns:function () {
        var me = this;
        return [
            {
                header: '{s name="nameColumnHeader"}Name{/s}',
                dataIndex:'name',
                flex:1,
                renderer:function(value, metaData, record) {
                    if (record.get('custom') != 1) {
                        return '<span style="color:#999">' + value + '</span>';
                    } else {
                        return value;
                    }
                }
            },
            {
                xtype:'actioncolumn',
                width:30,
                items:me.getActionColumnItems()
            }
        ];
    },
    getButtons : function()
    {
        var me = this;
            return [
                {
                    text    : '{s name="add"}Hinzufügen{/s}',
                    scope   : me,
                    iconCls : 'sprite-plus-circle-frame',
                    action : 'addTemplate'
                }
            ];
    },
    getActionColumnItems: function () {
        var me = this;
        return [
            {
                iconCls:'x-action-col-icon sprite-minus-circle-frame',
                cls:'duplicateColumn',
                tooltip:'{s name="delete"}Löschen{/s}',
                getClass: function(value, metadata, record) {
                    if (record.get("custom") != 1) {
                        return 'x-hidden';
                    }
                },
                handler:function (view, rowIndex, colIndex, item) {
                    me.fireEvent('deleteTemplate', view, rowIndex, colIndex, item);
                }
            }
        ];
    }
});
