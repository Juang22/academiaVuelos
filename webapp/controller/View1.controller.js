sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "../model/formatter"
],
function (Controller,Fragment,formatter) {
    "use strict";

    return Controller.extend("academia.vuelos.controller.View1", {
        formatter: formatter,
        onInit: function () {

        },

        onAfterRendering: function() {
            let aAerolineas = [{aerolinea:'AA'},
                {aerolinea:'FLY'},
                {aerolinea:'JET'},
            ];
            const oModelAerolineas = new sap.ui.model.json.JSONModel(aAerolineas);
            this.getView().setModel(oModelAerolineas, "oModelAerolineas");




            let aEstado = [{estado:'En Horario', valor:'1'},
                {estado:'Embarcando',valor:'2'},
                {estado:'Demorado',valor:'3'},
                {estado:'Cancelado',valor:'4'},
            ];
            const oModelEstado = new sap.ui.model.json.JSONModel(aEstado);
            this.getView().setModel(oModelEstado, "oModelEstado");

            const aModelVuelos = new sap.ui.model.json.JSONModel(aAerolineas);
            this.getView().setModel(aModelVuelos, "aModelVuelos");

            const oModelEdit = new sap.ui.model.json.JSONModel();
            this.getView().setModel(oModelEdit, "oModelEdit");

            let modelCreate = {
                'IdVuelo':'',
                'Fecha':'',
                'Aerolinea':'',
                'Destino':'',
                'Salida':'',
                'EstadoVuelo':''
            }
            const oModelCreate = new sap.ui.model.json.JSONModel(modelCreate);
            this.getView().setModel(oModelCreate, "oModelCreate");


            let oFilter = []
            this._getDataVuelos(oFilter)

            this._oBundle = this.getView().getModel("i18n").getResourceBundle();
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

        // update -----------------------------------


        onHandleUpdate: async function(oEvent) {
            let { IdVuelo } = oEvent.getSource().getBindingContext('aModelVuelos').getProperty();
            let { Fecha } = oEvent.getSource().getBindingContext('aModelVuelos').getProperty()
            let { Destino } = oEvent.getSource().getBindingContext('aModelVuelos').getProperty();
            let { Salida } = oEvent.getSource().getBindingContext('aModelVuelos').getProperty()
            let { EstadoVuelo } = oEvent.getSource().getBindingContext('aModelVuelos').getProperty();
            let { Aerolinea } = oEvent.getSource().getBindingContext('aModelVuelos').getProperty()

            this.getView().getModel('oModelEdit').setData({IdVuelo,Fecha,Destino,Salida,EstadoVuelo,Aerolinea})

            this.fragmentUpdate = await this._openFragment('Edit',this.fragmentEdit);
            
        },

        onCloseEdit:function() {
            this.fragmentUpdate.close()
        },

        // Edit ------------------------------------

        onHandleSaveEdit: function() {
            let parameters = this.getView().getModel('oModelEdit').getData();

            var fechaCodificada = this.formatter._formatFecha(parameters.Fecha);

            let path = `/vueloSet(IdVuelo='${parameters.IdVuelo}',Fecha='${fechaCodificada}')`
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


        },


        // Create --------------------------------------------------




        onHandleCrear: async function() {
            this.fragmentCrear = await this._openFragment('CreateVuelo',this.CrearVuelo)
        },

        onCloseCrear: function(){
            this.fragmentCrear.close()
        },

        onHandleSaveCrear: function() {

            let oModel = this.getView().getModel() 
            let oModelCreate = this.getView().getModel('oModelCreate').getData()
            // oModelCreate.Fecha = this.formatter._formatFechaCreate(oModelCreate.Fecha);
            oModelCreate.Fecha = new Date(oModelCreate.Fecha)

           
                oModel.create('/vueloSet', oModelCreate,{
                    success: function (oData) {
                        sap.m.MessageToast.show(this._oBundle.getText('mensajeCreate'));
                        this.fragmentCrear.close()
                    }.bind(this),
                    error: function () {
                      sap.m.MessageToast.show("Error al conectar con SAP");
                    }.bind(this),
                  });

        },
        // fragment ----------------------

        _openFragment: function(name,nameFragment) {

            return new Promise((resolve,reject) => {
                if (!nameFragment) {
                    Fragment.load({
                        name: `academia.vuelos.view.fragment.${name}`,
                        controller: this,
                        id: this.getView().getId(),
                    }).then(
                        function (oDialog) {
                            nameFragment = oDialog;
                            this.getView().addDependent(oDialog);
                            nameFragment.attachAfterClose(function (oEvent) {
                                oEvent.getSource().destroy();
                            });
                            nameFragment.open();
                            resolve(nameFragment)
                        }.bind(this)
                    );
                };
            })
        },

    });
});
