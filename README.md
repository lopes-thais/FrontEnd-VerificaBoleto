# Verifica Boleto
## Sobre o projeto
O Verifica Boleto é uma ferramenta desenvolvida para auxiliar na identificação de possíveis golpes envolvendo boletos bancários falsos.

No Brasil, o boleto continua sendo um dos meios de pagamento mais utilizados.
Criminosos aproveitam recursos tecnológicos para adulterar documentos, alterando dados como beneficiário, valor ou linha digitável.
Muitas vítimas realizam o pagamento sem perceber as inconsistências, transferindo o valor diretamente para contas controladas por golpistas.

## Links
* Deploy no Render: https://frontend-verificaboleto.onrender.com
* Repositório BackEnd: https://github.com/geooogab/VerificaBoleto

## Objetivo

O sistema foi desenvolvido como uma ferramenta de apoio à prevenção desse tipo de fraude, auxiliando usuários na identificação de informações divergentes presentes em boletos bancários.

# Como funciona
O usuário pode:

* Informar os dados manualmente;
* Enviar um arquivo PDF contendo o boleto.

O sistema realiza:

Extração dos dados do documento (quando enviado em PDF);

Consulta à base de dados simulada; 

Comparação dos dados informados com os dados cadastrados; 

Geração de um score de risco; 

Classificação do boleto como: 

* ✅ Seguro
* ⚠️ Suspeito
* ❌ Fraude

Além disso, são apresentados os campos divergentes identificados durante a análise.

## Tecnologias Utilizadas

## Front-End
* HTML5
* CSS3
* JavaScript

## Back-End
* Java
* Spring Boot

## Persistência de Dados

* PostgreSQL
* Spring Data JPA

## Infraestrutura

* Render
* GitHub/develop

## Organização

A organização do desenvolvimento do projeto foi feita através de Kanban no Trello. 

Além disso, foram feitas levantamento de funcionalidades e requisitos e prototipagem das telas pelo Whimsical e Figma.


# Funcionalidades

* Extração de dados do arquivo PDF do boleto via PDFBox
* Verificação de boletos por meio da linha digitável;
* Upload e extração automática de informações de boletos em PDF;
* Validação de CPF/CNPJ, data de vencimento e valor do boleto;
* Exibição dinâmica dos resultados da análise;
* Comparação visual entre dados informados, dados extraídos e dados cadastrados na base simulada;
* Exibição de score de risco de fraude;
* Chatbot para esclarecimento de dúvidas;
* Página de perguntas frequentes (FAQ);
* Recursos de acessibilidade utilizando atributos WAI-ARIA.
* Interface responsiva a diferentes tipos de tela.


# Usabilidade e Acessibilidade

## Acessibilidade

Utilizamos WAI-ARIA em diversos elementos, como aria-label="Verificar boleto", aria-label="Enviar mensagem", aria-live="polite", role="progressbar".

## Heurísticas de Nielsen

### Visibilidade do status do sistema:
Utilizamos ícone giratório de carregamento, status “Digitando...” antes do chatbot responder, “Extraindo...” e “Verificando boleto...” antes da tarefa ser concluída, 
com o intuito de o usuário não ter a impressão de que o sistema está sem funcionar. 

### Correspondência entre sistema e mundo real:
Através do uso de definições como constam nos boletos, utilização de ícones e que demonstrassem e status do boleto.

### Prevenção de erros:
Ao não permitir que o usuário envie data ou linhas digitáveis inválidas ou vazias.

### Ajuda para diagnosticar, reconhecer e recuperar erros: 
Implementamos mensagens de erro embaixo de campos não preenchidos ou preenchidos de forma inválida.

### Reconhecimento em vez de memorização: 
A interface não faz mudanças bruscas da localização de sessões, permite que o usuário compare de forma rápida e clara os dados que divergem no boleto 
e perceber o risco através de cores correspondentes.

### Design estético e minimalista: 
Utilizamos uma paleta de cores consistente em toda a interface, evitamos imagens, ícones ou mensagens desnecessárias na sessão de verificação de boleto.

## Diretrizes WCAG Aplicadas

### WCAG 1.1.1 – Conteúdo Não Textual
Utilização de textos alternativos (`alt`) em imagens relevantes para que leitores de tela possam descrever seu conteúdo.

### WCAG 1.4.1 – Uso de Cores
Os resultados da análise não dependem apenas de cores. Além das cores, são utilizados ícones e mensagens textuais para indicar os estados de segurança, suspeita ou fraude.

### WCAG 1.4.3 – Contraste Mínimo
Foram adotadas combinações de cores que mantêm contraste adequado entre textos, botões e elementos da interface.

### WCAG 2.1.1 – Navegação por Teclado
A interface utiliza elementos semânticos como `<button>`, `<nav>` e `<input>`, permitindo navegação por teclado.

### WCAG 3.3.1 – Identificação de Erros
Mensagens de erro claras são exibidas quando o usuário informa dados inválidos ou deixa campos obrigatórios em branco.

### WCAG 3.3.2 – Rótulos e Instruções
Os campos possuem labels, placeholders e instruções de preenchimento para facilitar o uso.

### WCAG 4.1.2 – Nome, Função e Valor
Foram utilizados atributos WAI-ARIA, como `aria-label`, `aria-live` e `role="progressbar"`.

### WCAG 4.1.3 – Mensagens de Status
Mensagens dinâmicas utilizam `aria-live="polite"`, permitindo que leitores de tela anunciem atualizações automaticamente.

## Imagens do sistema

### Tela inicial
<img width="875" height="399" alt="image" src="https://github.com/user-attachments/assets/fa66a1fc-134b-4f43-b8f3-bea59a391e45" />

### Tela de formulário para preechimento manual de dados do boleto
<img width="875" height="405" alt="image" src="https://github.com/user-attachments/assets/37f33aee-e7c3-4fad-a657-3d63f53857ac" />

### Tela de upload de arquivo PDF do boleto
<img width="858" height="405" alt="image" src="https://github.com/user-attachments/assets/2f82d613-ba83-44bc-899f-70e3ec71a40d" />

### Tela de ChatBot
<img width="886" height="411" alt="image" src="https://github.com/user-attachments/assets/3b67f298-dc66-44b2-99a0-f137e3df7489" />

### Tela de resultado "Boleto Falso"
<img width="863" height="410" alt="image" src="https://github.com/user-attachments/assets/a02ee9d4-dec4-440f-9a4b-e94c0af7bc9b" />

### Tela de resultado "Boleto Suspeito"
<img width="866" height="408" alt="image" src="https://github.com/user-attachments/assets/0d66531b-ca1e-4267-bf15-88360676c8f7" />

### Tela de resultado "Boleto Seguro"
<img width="875" height="411" alt="image" src="https://github.com/user-attachments/assets/d0bc2a75-2cde-4fba-b216-992da65c8b91" />

### Exemplos de mensagens de erro
<img width="611" height="582" alt="image" src="https://github.com/user-attachments/assets/5861f820-f212-4d8f-9372-9f07424dbdfd" /> <img width="602" height="571" alt="image" src="https://github.com/user-attachments/assets/94a319bd-d646-4f52-97f3-9e04fad3b22c" />













