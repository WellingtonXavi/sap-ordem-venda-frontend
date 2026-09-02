sap.ui.define([
    "sap/ui/core/mvc/Controller",
     "sap/m/MessageToast",
     "../model/formatter",
     "sap/ui/model/Sorter"
], (Controller,MessageToast,formatter,Sorter) => {
    "use strict";

    return Controller.extend("zov.controller.OrdemList", {
            formatter: formatter,

        onInit() {

                var oView = this.getView();
                var oFModel = new sap.ui.model.json.JSONModel();
                

                   oFModel.setData({
                    "OrdemId": "",
                    "DataCriacao": null,
                    "CriadoPor": "",
                    "ClienteId": "",
                    "TotalItens": 0,                    
                    "TotalOrdem": 0,
                    "Status": "",
                    "OrdenacaoCampo": "OrdemId",
                    "OrdenacaoTipo": "ASC",
                    "Limite": 25,
                    "Ignorar": 0
                });

                oView.setModel(oFModel,"filter");




var oDashboardModel = new sap.ui.model.json.JSONModel({ 
    Novas: {
        quantidade: 0,
        valor: "0,00"
    },
    Fornecidas: {
        quantidade: 0,
        valor: "0,00"
    },
    Faturadas: {
        quantidade: 0,
        valor: "0,00"
    },
    Canceladas: {
        quantidade: 0,
        valor: "0,00"
    },
    Total: {
        quantidade: 0,
        valor: "0,00"
    }});

    oView.setModel(oDashboardModel,"dashboard");

   /* this._carregarDashboard();*/



                var oTModel = new sap.ui.model.json.JSONModel();
                oTModel.setData([]);
                oView.setModel(oTModel,"table");

                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.getRoute("RouteOrdemList").attachMatched(this._onRouteMatchedList,this);





          



},



_carregarTabela: function(){


var oODataModel = this.getOwnerComponent().getModel();
    var oTableModel = this.getView().getModel("table");

 oODataModel.read("/OVCabSet", {

        success: function (oData) {

            oTableModel.setData(oData.results);

        },

        error: function (oError) {

            console.error("Erro ao carregar tabela:", oError);

        }

    });

},

onFilterSearch: function(oEvent){

 var oView = this.getView();

    var oODataModel = this.getOwnerComponent().getModel();
    var oTableModel = oView.getModel("table");
    var oFilterModel = oView.getModel("filter");

    var oFilterData = oFilterModel.getData();

    var aFilters = [];
    var aSorters = [];

    var iTop = parseInt(oFilterData.Limite, 10);
    var iSkip = parseInt(oFilterData.Ignorar, 10);

    if (oFilterData.OrdenacaoCampo) {

    var bDescending = oFilterData.OrdenacaoTipo === "DESC";

    aSorters.push(
        new Sorter(
            oFilterData.OrdenacaoCampo,
            bDescending
        )
    );
}

    console.log("Dados Filtro" , oFilterData);

    // =========================
    // FILTRO ORDEM ID
    // =========================

    if (oFilterData.OrdemId) {

        var iOrdemId = parseInt(oFilterData.OrdemId, 10);

       aFilters.push(
            new sap.ui.model.Filter(
                "OrdemId",
                sap.ui.model.FilterOperator.EQ,
                iOrdemId
            )
        );

    }

     // =========================
    // FILTRO CLIENTE ID
    // =========================

     if (oFilterData.ClienteId) {

        var iClienteId = parseInt(oFilterData.ClienteId, 10);

        aFilters.push(
            new sap.ui.model.Filter(
                "ClienteId",
                sap.ui.model.FilterOperator.EQ,
                iClienteId
            )
        );

    }

    console.log("Filtros OData:", aFilters);

    oODataModel.read("/OVCabSet", {
    filters: aFilters,
    sorters: aSorters,
    urlParameters: {
        "$top": iTop,
        "$skip": iSkip
    },

        success: function (oData) {

            oTableModel.setData(oData.results);

        },

        error: function (oError) {

            console.error("Erro ao carregar ordens:", oError);

        }

    });



    

},




_carregarDashboard:function(){

    var oODataModel = this.getOwnerComponent().getModel();

    var that = this;

    oODataModel.read("/OVDashboardSet" , {success: function (oData) {

            that._montarDashboard(oData.results);

           

        },
        error: function (oError) {

            console.error(
                "Erro ao carregar dashboard:",
                oError
            );}
    
    
    })

},


_montarDashboard( oData ){



    var oDashboard = {
        Novas: {
            quantidade: 0,
            valor: 0
        },
        Fornecidas: {
            quantidade: 0,
            valor: 0
        },
        Faturadas: {
            quantidade: 0,
            valor: 0
        },
        Canceladas: {
            quantidade: 0,
            valor: 0
        },
        Total: {
            quantidade: 0,
            valor: 0
        }
    };


        oData.forEach(function (oItem){


             var iQuantidade = parseInt(oItem.Quantidade, 10) || 0;

            var fValor = parseFloat(oItem.ValorTotal) || 0;

             oDashboard.Total.quantidade += iQuantidade;
             oDashboard.Total.valor += fValor;

           

              switch (oItem.Status) {

            case "N":
                oDashboard.Novas.quantidade += iQuantidade;
                oDashboard.Novas.valor += fValor;
                break;

            case "L":
                oDashboard.Fornecidas.quantidade += iQuantidade;
                oDashboard.Fornecidas.valor += fValor;
                break;

            case "F":
                oDashboard.Faturadas.quantidade += iQuantidade;
                oDashboard.Faturadas.valor += fValor;
                break;

            case "C":
                oDashboard.Canceladas.quantidade += iQuantidade;
                oDashboard.Canceladas.valor += fValor;
                break;
        }



         } );



 this.getView()
        .getModel("dashboard")
        .setData(oDashboard);

       
        

},



          


_onRouteMatchedList: function(oEvent)
{

  
    this._carregarDashboard(); 
    
    this.onFilterSearch();
                
},


onNew: function(oEvent)
{
   var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
   oRouter.navTo("RouteOrdemNew");
},

onEdit: function(oEvent){

var oSource = oEvent.getSource();
                var sOrdemId = oSource.data("OrdemId");
                
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteOrdemEdit",{OrdemId:sOrdemId});
    
},



      

  




    });
});