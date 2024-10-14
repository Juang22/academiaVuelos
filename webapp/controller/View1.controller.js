sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
],
function (Controller,Fragment) {
    "use strict";

    return Controller.extend("academia.vuelos.controller.View1", {
        onInit: function () {

        },

        onAfterRendering: function() {
            let aAerolineas = [{aerolinea:'AA'},
                {aerolinea:'FLY'},
                {aerolinea:'JET'},
            ];
            const oModelAerolineas = new sap.ui.model.json.JSONModel(aAerolineas);
            this.getView().setModel(oModelAerolineas, "oModelAerolineas");

            const aModelVuelos = new sap.ui.model.json.JSONModel(aAerolineas);
            this.getView().setModel(aModelVuelos, "aModelVuelos");

            const oModelEdit = new sap.ui.model.json.JSONModel();
            this.getView().setModel(oModelEdit, "oModelEdit");


            let oFilter = []
            this._getDataVuelos(oFilter)
        },

        onSearch: function(oEvent) {
            let idAerolinea = this.byId('idAerolinea').getSelectedKey()
            let oFilter = [] 
            oFilter.push(new sap.ui.model.Filter(
                            "Aerolinea",
                            sap.ui.model.FilterOperator.EQ,
                            idAerolinea
                          ));
            this._getDataVuelos(oFilter)
        },

        _getDataVuelos: function(oFilter) {

            let oModel = this.getView().getModel() 
                oModel.read("/vueloSet", {
                    filters:oFilter,
                    success: function (oData) {
                        this.getView().getModel('aModelVuelos').setData(oData.results)
                    }.bind(this),
                    error: function () {
                      sap.m.MessageToast.show("Error al conectar con SAP");
                    }.bind(this),
                  });
        },

        onHandleReset: function() {
            this.byId('idAerolinea').setSelectedKey();
            this._getDataVuelos([])
        },

        onHandleNav: function(oEvent) {
            let { IdVuelo } = oEvent.getSource().getBindingContext('aModelVuelos').getProperty();
            let { Fecha } = oEvent.getSource().getBindingContext('aModelVuelos').getProperty()
            Fecha = Fecha.toISOString().split('T')[0]
            this.getOwnerComponent().getRouter().navTo("pasajero",{
                IdVuelo, Fecha
            });
        },

        onHandleUpdate: function(oEvent) {
            let { IdVuelo } = oEvent.getSource().getBindingContext('aModelVuelos').getProperty();
            let { Fecha } = oEvent.getSource().getBindingContext('aModelVuelos').getProperty()
            let { Destino } = oEvent.getSource().getBindingContext('aModelVuelos').getProperty();
            let { Salida } = oEvent.getSource().getBindingContext('aModelVuelos').getProperty()
            let { EstadoVuelo } = oEvent.getSource().getBindingContext('aModelVuelos').getProperty();
            let { Aerolinea } = oEvent.getSource().getBindingContext('aModelVuelos').getProperty()

            this.getView().getModel('oModelEdit').setData({IdVuelo,Fecha,Destino,Salida,EstadoVuelo,Aerolinea})

            if (!this.nameDialog) {
                Fragment.load({
                    name: `academia.vuelos.view.fragment.Edit`,
                    controller: this,
                    id: this.getView().getId(),
                }).then(
                    function (oDialog) {
                        this.nameDialog = oDialog;
                        this.getView().addDependent(oDialog);
                        this.nameDialog.attachAfterClose(function (oEvent) {
                            oEvent.getSource().destroy();
                        });
                        this.nameDialog.open();
                    }.bind(this)
                );
            };
        },

        onCloseEdit:function() {
            this.nameDialog.close()
        },


        onHandleSaveEdit: function() {
            let parameters = this.getView().getModel('oModelEdit').getData();

            let path = `/vueloSet(IdVuelo='${parameters.IdVuelo}',Fecha='${parameters.Fecha}')`
            let oModel = this.getView().getModel() 
                oModel.update(path, parameters,{
                    success: function (oData) {
                        this._getDataVuelos([]);
                        this.getView().getModel('aModelVuelos').refresh()
                    }.bind(this),
                    error: function () {
                      sap.m.MessageToast.show("Error al conectar con SAP");
                    }.bind(this),
                  });


        }

    });
});
