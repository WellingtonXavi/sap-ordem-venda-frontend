sap.ui.define([
    "sap/ui/core/mvc/Controller",
     "sap/m/MessageToast",
     "sap/ui/core/routing/History",
    "sap/ui/core/UIComponent"
], (Controller,MessageToast,  History, UIComponent) => {
    "use strict";

    return Controller.extend("zov.controller.OrdemForm", {

        formMode: "I",

        onInit() {
            
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

            oRouter.getRoute("RouteOrdemNew").attachMatched(this._onRouteMatchedNew,this);
            oRouter.getRoute("RouteOrdemEdit").attachMatched(this._onRouteMatchedEdit,this);           

        
            },

            
_onRouteMatchedNew: function(){

    this.formMode = "I";

     this.getView().byId("bt-save").setType(sap.m.ButtonType.Accept);
     this.getView().byId("bt-save").setText("Salvar Ordem");
     this.getView().byId("OVCab.DataCriacao").setEditable(true);

     this.getView().byId("bt-delete").setVisible(false);

var oModel = new sap.ui.model.json.JSONModel();        

                oModel.setData(this.createEmptyOrderObject());

                oModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);

         this.getView().setModel(oModel);

          

},


_onRouteMatchedEdit: function(oEvent){

    this.formMode = "U";

    var that  = this;
    var oView = this.getView();
    var oArgs = oEvent.getParameter("arguments");
    var sOrdemId = oArgs.OrdemId;
    var oODataModel = this.getOwnerComponent().getModel();  
    var oJsonModel = null;

    oJsonModel = new sap.ui.model.json.JSONModel(this.createEmptyOrderObject());
    oJsonModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);

    oView.byId("OVCab.DataCriacao").setEditable(false);
    oView.byId("OVCab.CriadoPor").setEditable(false);
    oView.byId("OVCab.ClienteId").setValueState("None");

     oView.byId("bt-save").setText("Atualizar Ordem");
     oView.byId("bt-save").setType(sap.m.ButtonType.Emphasized);

     oView.byId("bt-delete").setVisible(true);


    
 oView.setBusy(true);
    oODataModel.read("/OVCabSet("+sOrdemId+")",
                        {
                          
                            success: function(oOrdemResponse, oResponse){

                             

                                oODataModel.read("/OVCabSet("+sOrdemId+")/toOVItem",{

                                     success: function(oItemResponse, oResponse)
                                     {

                                        oOrdemResponse.toOVItem = oItemResponse.results;
                                        oJsonModel.setData(oOrdemResponse);
                                        oView.setModel(oJsonModel);

                                        that.recalcOrder();
                                        oView.setBusy(false);

                                    
                                           

                                     },

                                     error: function()
                                     {
                                        oView.setBusy(false);
                                         MessageToast.show("Erro ao carregar os dados.");

                                     }

                                 }



                                            );


                                
                            },

                             error: function()
                                     {
                                        oView.setBusy(false);
                                         MessageToast.show("Erro ao carregar os dados.");

                                     }
                           
                            
                        }
                    );









},

 onPageBack: function(){

                
                  var oRouter = UIComponent.getRouterFor(this);

    oRouter.navTo("RouteOrdemList", {}, true);             
                    
               

             
            },

createEmptyOrderObject: function(){

 var oOrdem = {  
                    OrdemId: "", 
                    DataCriacao: null,
                    CriadoPor: "",
                    ClienteId: "",
                    TotalItens: 0.0,                    
                    TotalOrdem: 0.0,
                    Status: "",
                    toOVItem: []

                };

return oOrdem;


},

createEmptyItem: function () {

    var oItem = {
        ItemId: 0,
        Material: "",
        Descricao: "",
        Quantidade: "",
        PrecoUni: "",
        PrecoTot: ""
    };

    return oItem;
},

onNewItem: function(){

var oView = this.getView();
var oModel = oView.getModel();
var oOrdem = oModel.getData();
var lastItemId = 0;

for(var i in oOrdem.toOVItem ){

    if(oOrdem.toOVItem[i].ItemId > lastItemId ){

        lastItemId = oOrdem.toOVItem[i].ItemId;

    }

}




var oItem = this.createEmptyItem();
oItem.ItemId = lastItemId + 1;

oOrdem.toOVItem.push(oItem);

oModel.setData(oOrdem);



this.recalcOrder();



},


recalcOrder: function () {

   debugger;

var oView = this.getView();
var oModel = oView.getModel();
var oOrdem = oModel.getData();

oOrdem.TotalItens = 0;

for(    var i in oOrdem.toOVItem){
    var oItem = oOrdem.toOVItem[i];

    var quantidade = parseFloat(oItem.Quantidade) || 0;
    var precoUni = parseFloat(oItem.PrecoUni) || 0;

    oItem.PrecoTot = quantidade * precoUni;

    oOrdem.TotalItens = oOrdem.TotalItens + oItem.PrecoTot;

}


oOrdem.TotalOrdem = oOrdem.TotalItens ;

oModel.setData(oOrdem);




},

onQuantityChange: function (oEvent) {

var oInput = oEvent.getSource();

    var sValue = oInput.getValue();

    var oContext = oInput.getBindingContext();

    var oItem = oContext.getObject();

    oItem.Quantidade = sValue;

    this.recalcOrder();
},

onPriceChange: function (oEvent) {

    var oInput = oEvent.getSource();

    var sValue = oInput.getValue();

    var oContext = oInput.getBindingContext();

    var oItem = oContext.getObject();

    oItem.PrecoUni = sValue;

    this.recalcOrder();
},






getOrderObject: function(){

    var oView = this.getView();
    var oModel = oView.getModel();
    var oOrdem = oModel.getData();   

    return oOrdem;

},



fnFormatDecimal: function (vValue) {
        if (!vValue) {
            return "0.00";
        }
        if (typeof vValue === "string") {
            // Trata digitação no padrão PT-BR (ex: "1.250,50" -> "1250.50")
            vValue = vValue.replace(/\./g, "").replace(",", ".");
        }
        var fParsed = parseFloat(vValue);
        return isNaN(fParsed) ? "0.00" : fParsed.toFixed(2);
    },




getOrderOData: function () {


 var oOrdem = this.getOrderObject();

  if(oOrdem.OrdemId == ""){

        oOrdem.OrdemId = 0;

      }     

      oOrdem.ClienteId = parseInt(oOrdem.ClienteId);
/*
 var fnFormatDecimal = function (vValue) {
        if (!vValue) {
            return "0.00";
        }
        if (typeof vValue === "string") {
            // Trata digitação no padrão PT-BR (ex: "1.250,50" -> "1250.50")
            vValue = vValue.replace(/\./g, "").replace(",", ".");
        }
        var fParsed = parseFloat(vValue);
        return isNaN(fParsed) ? "0.00" : fParsed.toFixed(2);
    };

    */

      oOrdem.TotalItens = this.fnFormatDecimal(oOrdem.TotalItens);      
      oOrdem.TotalOrdem = this.fnFormatDecimal(oOrdem.TotalOrdem);


      for(var i in oOrdem.toOVItem ){
      oOrdem.toOVItem[i].PrecoUni = parseFloat(oOrdem.toOVItem[i].PrecoUni || 0).toFixed(2);

      oOrdem.toOVItem[i].PrecoTot = parseFloat(oOrdem.toOVItem[i].PrecoTot || 0).toFixed(2);

      oOrdem.toOVItem[i].Quantidade = parseInt(oOrdem.toOVItem[i].Quantidade);


      }

    return oOrdem;

},


onSave: function(){

       
       var oView = this.getView();       
       var oJsonModel = oView.getModel();      
       var oData = this.getOrderOData();
       var oODataModel = this.getOwnerComponent().getModel();   
    


 if(this.formMode == "I")
{

     oView.setBusy(true);

    

    oODataModel.create("/OVCabSet", oData, 
                    {

                        success: function (oDataResponse, oResponse) 
                                {                 

                                    oDataResponse.toOVItem = oDataResponse.toOVItem.results;    

                                    oJsonModel.setData(oDataResponse);

                                    oView.setBusy(false);

                                    if(oResponse.statusCode == 201 )
                                    {

                                        MessageToast.show("Ordem criada!");
                                    }

                                    
                                },

                        error: function (oError)
                            {
                                    oView.setBusy(false);
                                    MessageToast.show("Erro ao criar ordem");
                            } 
                   }          
                );


}else
    {

        debugger;
        
        oView.setBusy(true);

        oODataModel.create("/OVCabSet", oData, 
                    {
                        success: function (oDataResponse, oResponse) 
                                {  
                                    if(oResponse.statusCode == 204 ||  oResponse.statusCode == 201)
                                    {

                                        MessageToast.show("Ordem Atualizada com sucesso");
                                    }

                                    oView.setBusy(false);

                                    
                                },

                                 error: function (oError)
                                        {
                                            oView.setBusy(false);
                                            MessageToast.show("Erro ao criar ordem");
                                        } 


                    }
                );



    }


  

       

},


          
onDelete: function(){


 var that = this;
    var oModel = this.getOwnerComponent().getModel();
    var oOrdem = this.getOrderObject();

    sap.m.MessageBox.confirm(
        "Deseja realmente excluir a ordem " + oOrdem.OrdemId + "?",
        {
            title: "Excluir ordem",

            onClose: function (sAction) {

                if (sAction !== sap.m.MessageBox.Action.OK) {
                    return;
                }
                    
                var sPath = oModel.createKey("OVCabSet", {
                    OrdemId: oOrdem.OrdemId
                });

                oModel.remove("/" + sPath, {

                    success: function () {

                        sap.m.MessageToast.show(
                            "Ordem excluída com sucesso."

                        );

                        
                             var oRouter = sap.ui.core.UIComponent.getRouterFor(that);

                            oRouter.navTo("RouteOrdemList");


                    },

                    error: function (oError) {

                        sap.m.MessageBox.error(
                            "Erro ao excluir a ordem."
                        );

                    }

                });

            }
        }
    );





},

onDeleteItem: function (oEvent) {

    var oButton = oEvent.getSource();
    var sItemId = oButton.data("ItemId");

    var oModel = this.getView().getModel();
    var oOrdem = this.getOrderObject();

    var aItens = oOrdem.toOVItem;

    var iIndex = aItens.findIndex(function (oItem) {
        return String(oItem.ItemId) === String(sItemId);
    });

    if (iIndex === -1) {
        return;
    }

    aItens.splice(iIndex, 1);

    oModel.setProperty("/toOVItem", aItens);

    this.recalcOrder();

}

  




    });
});