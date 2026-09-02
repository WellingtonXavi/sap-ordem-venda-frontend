# SAP Ordem de Venda — Frontend

Aplicação frontend desenvolvida em **SAPUI5 Freestyle**, responsável pela gestão de Ordens de Venda e integrada ao backend através de um serviço **OData V2 desenvolvido em SAP Gateway**.

O projeto implementa uma interface baseada no padrão **MVC (Model-View-Controller)**, utilizando `JSONModel` para gerenciamento do estado da interface e `ODataModel` para comunicação com o backend SAP.

🖥️ **Visão Geral**

A aplicação permite consultar, criar, alterar e excluir Ordens de Venda, além de disponibilizar recursos de filtragem, ordenação, paginação e visualização consolidada das ordens por status.

A comunicação com o backend é realizada através de uma API OData V2.

```text
┌──────────────────────────────┐
│       SAPUI5 / Fiori         │
│          Frontend            │
│                              │
│  Views + Controllers         │
│  JSONModel + ODataModel      │
└──────────────┬───────────────┘
               │
               │ HTTP / OData V2
               ▼
┌──────────────────────────────┐
│      SAP Gateway Backend     │
│                              │
│     ABAP OO / Service / DAO  │
└──────────────────────────────┘
```

🛠️ **Tecnologias Utilizadas**

- **SAPUI5 Freestyle:**  Desenvolvimento da interface da aplicação.
- **JavaScript:**  Controllers, regras de interação e manipulação dos modelos.
- **XML Views:**  Construção das interfaces utilizando controles SAPUI5.
- **JSONModel:**  Gerenciamento do estado e dos dados utilizados na interface.
- **ODataModel:**  Comunicação com o serviço OData V2 do backend SAP.
- **OData V2:**  Protocolo utilizado na integração com o SAP Gateway.
- **SAP Gateway:**  Backend responsável pela exposição dos serviços OData.
- **UI5 Tooling:**  Execução e desenvolvimento local da aplicação.
- **Git / GitHub:**  Versionamento do código-fonte.

 🚀 **Funcionalidades**

- Consulta de Ordens de Venda
- Criação de novas Ordens de Venda
- Alteração de Ordens de Venda
- Exclusão de Ordens de Venda
- Cadastro e edição de múltiplos itens
- Dashboard com consolidação das ordens por status
- Filtros para consulta de ordens
- Ordenação dos resultados
- Paginação da lista de ordens
- Cálculo automático dos totais da ordem
- Integração com backend SAP através de OData V2

🏗️ **Arquitetura SAPUI5**

A aplicação segue a arquitetura MVC (Model-View-Controller), utilizando os recursos padrão do SAPUI5 para separação entre interface, lógica de apresentação e gerenciamento de dados.

📁 Estrutura do Projeto

```text
webapp/
│
├── controller/
│   ├── App.controller.js
│   ├── OrdemForm.controller.js
│   └── OrdemList.controller.js
│
├── model/
│   ├── formatter.js
│   └── models.js
│
├── view/
│   ├── App.view.xml
│   ├── OrdemForm.view.xml
│   └── OrdemList.view.xml
│
├── localService/
│   └── mainService/
│       ├── data/
│       ├── metadata.xml
│       └── ...
│
├── Component.js
├── manifest.json
└── index.html
```

🎯 **Model — Dados e Estado da Aplicação**

A aplicação utiliza dois modelos principais:

ODataModel

Responsável pela comunicação com o backend SAP através do serviço OData V2.

É utilizado para operações como:

Consulta de ordens
Criação de ordens
Alteração de ordens
Exclusão de ordens
Comunicação com entidades OData
Execução de requisições HTTP para o SAP Gateway

JSONModel

Utilizado principalmente para controlar dados e estados da interface.

No formulário de Ordem de Venda, por exemplo, o JSONModel mantém temporariamente os dados da ordem e seus itens antes do envio ao backend.

Também é utilizado para informações específicas da interface, como dados do dashboard e filtros.

🖼️ **View — Interface**

As interfaces são desenvolvidas utilizando XML Views, seguindo o padrão SAPUI5.

Principais telas:

OrdemList.view.xml — Lista e consulta das Ordens de Venda.
OrdemForm.view.xml — Cadastro e manutenção da Ordem de Venda.
App.view.xml — Estrutura principal da aplicação.

As Views são responsáveis pela definição dos controles visuais e dos bindings utilizados pela aplicação.

🧠 **Controller — Lógica da Interface**

Os Controllers concentram a lógica de interação entre o usuário e a interface.

OrdemList.controller.js

Responsável pelas operações da tela de consulta, incluindo:

Carregamento das ordens
Filtros
Ordenação
Paginação
Navegação para o formulário
Exclusão de ordens
Atualização das informações do dashboard

OrdemForm.controller.js

Responsável pelo cadastro e manutenção das ordens, incluindo:

Criação da ordem
Inclusão e edição dos itens
Cálculo dos valores
Validações da interface
Preparação do payload OData
Criação e alteração das ordens
Deep Insert

🧩 **Component.js**

O Component.js representa o ponto de inicialização da aplicação SAPUI5.

É responsável pela inicialização do componente principal da aplicação e pela configuração necessária para o funcionamento da aplicação.

⚙️**manifest.json**

O manifest.json concentra as principais configurações da aplicação, incluindo:

Identificação da aplicação
Configuração dos modelos
DataSources
Serviço OData
Routing
Configurações das Views
Dependências da aplicação

🧭 **Routing**

A navegação entre as telas é realizada utilizando o Router do SAPUI5.

A aplicação possui rotas para:

Lista de Ordens de Venda
Inclusão de uma nova ordem
Edição de uma ordem existente

O mecanismo de routing permite que a aplicação altere a View apresentada de acordo com a rota acessada, mantendo a estrutura de navegação definida no manifest.json.

📡 **Integração com OData V2**

A comunicação entre o frontend SAPUI5 e o backend SAP é realizada através de um serviço OData V2 disponibilizado pelo SAP Gateway.

O frontend utiliza o ODataModel do SAPUI5 para executar as operações de leitura, criação, alteração e exclusão das Ordens de Venda.

🔗 **Entidades OData**

O serviço disponibiliza principalmente as seguintes entidades:

OVCabSet — Cabeçalho da Ordem de Venda
OVItemSet — Itens da Ordem de Venda

A entidade OVCabSet possui uma associação com os itens através da navegação toOVItem.

📥 Consulta de Ordens

A listagem das ordens é realizada através de uma requisição GET para a entidade OVCabSet.

GET /OVCabSet

O frontend utiliza o ODataModel para solicitar os dados ao Gateway. O backend processa a requisição na implementação do método OVCabSet_GET_ENTITYSET.

A consulta suporta recursos OData como:

$filter
$orderby
$top
$skip

Exemplo conceitual:

/OVCabSet?$filter=Status eq 'NOVO'

🔎 Filtros

Os filtros informados pelo usuário na interface são convertidos em parâmetros OData e enviados ao backend.

Exemplo:

/OVCabSet?$filter=Status eq 'FATURADO'

O backend interpreta o filtro através do contexto da requisição Gateway e executa a consulta correspondente no banco de dados.

↕️ Ordenação

A aplicação também permite ordenar os resultados.

Exemplo:

/OVCabSet?$orderby=OrdemId desc

O parâmetro $orderby é processado no backend para definir a ordenação dos registros retornados.

📄 Paginação

A lista utiliza os parâmetros $top e $skip para controlar a quantidade de registros retornados e a posição inicial da consulta.

Exemplo:

/OVCabSet?$top=10&$skip=20

Nesse exemplo, a requisição solicita até 10 registros a partir da posição 20.

➕ Criação de Ordem

Uma nova Ordem de Venda é criada através de uma requisição POST:

POST /OVCabSet

O frontend prepara os dados da ordem no JSONModel e posteriormente monta o objeto que será enviado através do ODataModel.

🧩 Deep Insert

O projeto também implementa Deep Insert, permitindo criar o cabeçalho da ordem e seus múltiplos itens em uma única requisição.

Exemplo simplificado:
```json
{
  "OrdemId": "0001",
  "DataCriacao": null,
  "CriadoPor": "",
  "ClienteId": "100001",
  "TotalItens": 250.00,
  "TotalOrdem": 250.00,
  "Status": "NOVO",
  "toOVItem": [
    {
      "ItemId": 1,
      "Material": "MAT001",
      "Descricao": "Produto 1",
      "Quantidade": 2,
      "PrecoUni": 100.00,
      "PrecoTot": 200.00
    },
    {
      "ItemId": 2,
      "Material": "MAT002",
      "Descricao": "Produto 2",
      "Quantidade": 1,
      "PrecoUni": 50.00,
      "PrecoTot": 50.00
    }
  ]
}
```

✏️ Alteração

A alteração de uma Ordem de Venda é realizada através de uma requisição de atualização para a entidade correspondente.

PUT /OVCabSet(...)

O frontend envia os dados modificados através do ODataModel, enquanto o backend direciona o processamento para a camada de serviço responsável pela regra de negócio.

🗑️ Exclusão

A exclusão utiliza uma requisição DELETE:

DELETE /OVCabSet(...)

O Controller solicita a exclusão através do ODataModel e o backend executa a operação correspondente.

🧮 **Regras e Comportamento da Interface**

A aplicação utiliza um JSONModel para controlar temporariamente os dados da Ordem de Venda durante a interação do usuário.

O modelo é configurado com TwoWay Binding, permitindo que alterações realizadas nos controles da interface sejam refletidas diretamente nos dados mantidos pelo modelo.

🔄 Gerenciamento da Ordem

Ao iniciar o cadastro de uma nova Ordem de Venda, a aplicação cria uma estrutura inicial contendo os dados do cabeçalho e uma coleção de itens:
```json
{
    OrdemId: "",
    DataCriacao: null,
    CriadoPor: "",
    ClienteId: "",
    TotalItens: 0.0,
    TotalFrete: 0,
    TotalOrdem: 0.0,
    Status: "",
    toOVItem: []
}
```

Os itens são mantidos dentro da propriedade toOVItem, permitindo que múltiplos produtos sejam adicionados à mesma Ordem de Venda.

📦 Gerenciamento dos Itens

Cada item possui informações como:

Identificação do item
Material
Descrição
Quantidade
Preço unitário
Preço total

A aplicação permite adicionar, editar e remover itens diretamente na interface.

Os valores dos itens são utilizados para calcular automaticamente o total da Ordem de Venda.

🧮 Cálculo dos Totais

A aplicação possui uma rotina de recálculo responsável por atualizar os valores da ordem conforme os itens são modificados.

O cálculo considera:

Preço Total do Item = Quantidade × Preço Unitário

Total de Itens = Soma dos valores dos itens

Total da Ordem = Total de Itens 

Dessa forma, alterações na quantidade, preço  podem refletir automaticamente nos valores apresentados ao usuário.

💰 Tratamento de Valores Decimais

Como a interface utiliza o formato numérico brasileiro, os valores monetários recebem tratamento específico antes de serem enviados ao backend.

A aplicação possui funções de formatação responsáveis por converter valores entre a representação utilizada na interface e o formato esperado pelo serviço OData.

Esse tratamento evita problemas de interpretação entre valores como:

100,50

na interface e:

100.50

no payload enviado ao backend.

📊 Dashboard

A tela de consulta possui um Dashboard para consolidação das Ordens de Venda por status.

São apresentados indicadores para diferentes situações da ordem, incluindo:

Novas
Fornecidas
Faturadas
Canceladas
Total de ordens

Além da quantidade de registros, os indicadores podem apresentar a consolidação dos valores financeiros correspondentes a cada status.

🔁 Atualização da Interface

Após operações como criação, alteração ou exclusão de uma ordem, a aplicação atualiza os dados apresentados na lista para manter a interface sincronizada com o backend.

🖼️ **Screenshots**


**Lista de Ordens**


<img width="847" height="552" alt="image" src="https://github.com/user-attachments/assets/1d9edb8a-7cdb-4297-95d8-a6678496fa95" />


**Formulário de Ordem**


<img width="841" height="505" alt="image" src="https://github.com/user-attachments/assets/252ddee1-ac6a-4b2a-a9a5-acfe18a1da0f" />

**Alterar/Deletar de Ordens**


<img width="846" height="562" alt="image" src="https://github.com/user-attachments/assets/b8419f78-34a5-4d20-bff2-aa26c00edfb7" />




