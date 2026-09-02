sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device"
], 
function (JSONModel, Device) {
    "use strict";

    return {
       formatPrice: function(sValue){
                var oFormatOptions = {
                    groupingEnabled : true,
                    groupingSeparator: '.',
                    decimalSeparator: ',',
                    decimals: 2
                };
                var oFloatFormat = sap.ui.core.format.NumberFormat.getFloatInstance(oFormatOptions);
                return oFloatFormat.format(parseFloat(sValue));
            },

              formatStatus: function(sValue){
            if(sValue == null){
                return "Desconhecido";    
            }
            const oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			return oResourceBundle.getText("Status"+sValue);
        }
        
    };

});