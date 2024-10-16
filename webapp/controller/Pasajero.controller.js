sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "academia/vuelos/model/formatter"
    ],
    function(Controller,formatter) {
      "use strict";
  
      return Controller.extend("academia.vuelos.controller.Pasajero", {
        formatter : formatter,
        onInit: function() {
            this.getOwnerComponent()
            .getRouter("object")
            .getRoute("pasajero")
            .attachPatternMatched(this._recibirParametros, this);

            const oModelPasajeros = new sap.ui.model.json.JSONModel();
            this.getView().setModel(oModelPasajeros, "oModelPasajeros");

            
            const oModelVuelo = new sap.ui.model.json.JSONModel();
            this.getView().setModel(oModelVuelo, "oModelVuelo");

            const oModelHeader = new sap.ui.model.json.JSONModel();
            this.getView().setModel(oModelHeader, "oModelHeader");
        },

        _recibirParametros: function(oEvent) {
            let parameters = oEvent.getParameter("arguments");
            this.getView().getModel('oModelVuelo').setData(parameters)
            this._getDataPasajeros(parameters.IdVuelo,parameters.Fecha)
            this._getDataVuelo(parameters.IdVuelo,parameters.Fecha)
            
        },

        _getDataPasajeros: function(IdVuelo,Fecha) {

            var fechaCodificada = this.formatter._formatFecha(Fecha);
            let path = `/vueloSet(IdVuelo='${IdVuelo}',Fecha=datetime'${fechaCodificada}')/PersonaSet`
            
            let oModel = this.getView().getModel() 
                oModel.read(path, {
                    success: function (oData) {
                        this.getView().getModel('oModelPasajeros').setData(oData.results)
                    }.bind(this),
                    error: function (e) {
                      sap.m.MessageToast.show("Error al conectar con SAP");
                    }.bind(this),
                  });
        },

        _getDataVuelo: function(IdVuelo,Fecha) {

            var fechaCodificada = this.formatter._formatFecha(Fecha);
            // let path = `/vueloSet(IdVuelo='AR100',Fecha='${fecha.toISOString().split('.')[0]}')/PersonaSet`
            let path = `/vueloSet(IdVuelo='${IdVuelo}',Fecha=datetime'${fechaCodificada}')`
            let oModel = this.getView().getModel() 
                oModel.read(path, {
                    success: function (oData) {
                        console.log(oData)
                        this.getView().getModel('oModelHeader').setData(oData)
                        // this.getView().getModel('aModelVuelos').setData(oData.results)
                    }.bind(this),
                    error: function (e) {
                      sap.m.MessageToast.show("Error al conectar con SAP");
                    }.bind(this),
                  });
        },


       
      });
    }
  );