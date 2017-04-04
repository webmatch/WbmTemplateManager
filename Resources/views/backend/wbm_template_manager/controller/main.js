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
Ext.define('Shopware.apps.WbmTemplateManager.controller.Main', {
    /**
     * Extend from the standard ExtJS 4 controller
     * @string
     */
    extend: 'Ext.app.Controller',
    mainWindow: null,
    /** Contains all text messages for this controller */
    messages: {
        saveDialogSuccess :'{s name="templateSaveSuccess"}Template wurde erfolgreich gespeichert{/s}',
        growlMessage: ''
    },
    /**
     * Creates the necessary event listener for this
     * specific controller and opens a new Ext.window.Window
     * to display the subapplication
     *
     * @return void
     */
    init: function() {
        var me = this;

        me.getStore('Template').load({
            scope: this,
            callback: function(records, operation, success) {
                me.mainWindow = me.getView('main.Window').create({
                    mainStore: me.getStore('Template'),
                    record: Ext.create('Shopware.apps.WbmTemplateManager.model.Template')
                });
            }
        });        

        me.callParent(arguments);
        me.control({
            'template-manager-detail button[action=save]' : {
                'click' : function(btn) {
                    this.onSave(btn);
                }
            },
            'template-manager-detail button[action=reset]' : {
                'click' : function(btn) {
                    this.onReset(btn);
                }
            },
            'template-manager-list button[action=addTemplate]' : {
                'click' : function (btn) {
                    this.addTemplate(btn);
                }
            },
            'template-manager-list':{
                openTemplateDetail: me.openTemplateDetail,
                deleteTemplate: me.deleteTemplate
            }
        });
    },
    onSave: function(btn) {
        var win     = btn.up('window'), 
        form    = win.down('form'), 
        formBasis = form.getForm(), 
        me      = this,             
        store   = me.getStore('Template'),
        record  = form.getRecord();  
        if (!(record instanceof Ext.data.Model)){
            record = Ext.create('Shopware.apps.WbmTemplateManager.model.Template');
        }
        
        formBasis.updateRecord(record);

        if (formBasis.isValid()) {
            record.save({
                params: {
                    name: record.get("name")
                },
                success: function(rec, op) {
                    var newName = op.request.scope.reader.jsonData["name"];
                    if(newName){
                        record.set("name", newName);
                    }
                    store.load();
                    Shopware.Msg.createGrowlMessage('','{s name="templateSaveSuccess"}Template wurde erfolgreich gespeichert{/s}', '');
                },
                failure: function(rec, op) {
                    store.load();
                    Shopware.Msg.createGrowlMessage('','{s name="templateSaveError"}Fehler beim Speichern des Template: {/s}'+op.request.scope.reader.jsonData["message"], '');
                    
                }
            });
        }
    },
    onReset: function(btn) {
        var win     = btn.up('window'),
            form    = win.down('form'),
            formBasis = form.getForm(),
            me      = this,
            store   = me.getStore('Template'),
            record  = form.getRecord();
        if (!(record instanceof Ext.data.Model)){
            record = Ext.create('Shopware.apps.WbmTemplateManager.model.Template');
        }

        form.loadRecord(record);
    },
    openTemplateDetail:function (view, rowIndex) {
        var me = this,
        record = me.getStore('Template').getAt(rowIndex);
        me.record = record;
        me.detailStore = new Ext.data.Store({
            extend:'Ext.data.Store',
            remoteFilter : true,
            model:'Shopware.apps.WbmTemplateManager.model.Template'
        });
        me.detailStore.load({
            params : {
                name: record.get("name")
            },
            callback: function(records, operation) {
                if (operation.success !== true || !records.length) {
                    return;
                }
                me.detailRecord = records[0];
                var win = view.up('window'), 
                form = win.down('form');
                form.loadRecord(me.detailRecord);
            }
        });     
        
    },
    addTemplate:function (btn) {
        var me = this,
        win = btn.up('window'), 
        form = win.down('form');   
        me.detailRecord = Ext.create('Shopware.apps.WbmTemplateManager.model.Template');
        form.loadRecord(me.detailRecord);
    },
    deleteTemplate: function (view, rowIndex) {
        var me = this,
        store = me.getStore('Template'),
        record = store.getAt(rowIndex);
        me.record = record;

        if (me.record instanceof Ext.data.Model && me.record.get('name')) {
            Ext.MessageBox.confirm('Template löschen?', '{s name="templateDeleteAlert"}Sind Sie sicher, dass Sie das Template löschen wollen?{/s}' , function (response) {
                if ( response !== 'yes' ) {
                    return;
                }
                me.record.destroy({
                    callback: function(operation) {
                        Shopware.Msg.createGrowlMessage('','{s name="templateDeleted"}Template wurde erfolgreich gelöscht{/s}', 'TemplateManager');
                        store.load();
                        var win = view.up('window'), 
                        form = win.down('form');   
                        me.detailRecord = Ext.create('Shopware.apps.WbmTemplateManager.model.Template');
                        form.loadRecord(me.detailRecord);
                    }
                });
            });
        }
    }
});
 
