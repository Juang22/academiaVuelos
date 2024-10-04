sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
function (Controller) {
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
        }

    });
});
