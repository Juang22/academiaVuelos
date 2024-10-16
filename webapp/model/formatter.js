sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device"
], 
function (JSONModel, Device) {
    "use strict";

    return {
        /**
         * Provides runtime info for the device the UI5 app is running on as JSONModel
         */

        _formatFecha: function(Fecha) {
            let fecha = new Date(Fecha.slice(0,4),Fecha.slice(5,7)-1,Fecha.slice(8))
            var fechaFormateada = fecha.toISOString().split('.')[0]; 

            return encodeURIComponent(fechaFormateada)
        },

        _formatFechaCreate: function(Fecha) {
            let fecha = new Date(Fecha)
            var fechaFormateada = fecha.toISOString().split('.')[0]; 

            return encodeURIComponent(fechaFormateada)
        }
        
    };

});