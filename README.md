# VerificaBoleto
## O problema

Segundo dados do G1, entre 2024 e 2025 cerca de 24 milhões de pessoas foram vítima de golpes envolvendo boletos bancários ou pix. 
Nesse mesmo período, o prejuízo agregado gerado por esse tipo de golpe foi de quase R$29 bilhões.
Esses números evidenciam a necessidade urgente de medidas capazes de mitigar a incidência desse tipo de fraude. Entre elas, destacam-se os golpes envolvendo boletos bancários, nos quais o criminoso pode criar um documento visualmente idêntico ao original, mas alterar os dados associados à linha digitável para direcionar o pagamento à sua própria conta. Como a vítima muitas vezes não confere essas informações antes de efetuar o pagamento, o valor pode ser destinado diretamente ao golpista, mesmo que o documento apresentado aparente ser legítimo.

## O sistema
Pensando nesse contexto, desenvolvi o Boleto Verify. O intuito do sistema é ser uma ferramenta de apoio na verificação de Boletos Bancários.

O usuário insere os principais dados, ou o boleto em PDF, e o sistema utiliza as regras de cálculo de dígitos verificadores dos boletos bancários, incluindo os módulos 10 e 11, para verificar se a linha digitável é matematicamente válida, calcular o DV geral e extrair campos como banco emissor, fator de vencimento e valor.
Por fim, os dados extraídos são comparados com os informados e o sistema retorna para o usuário se existe alguma divergência e mostra quais.
Auxiliando assim, a qualquer pessoa verificar um boleto e encontrar inconsistências mesmo sem conhecimentos prévios sobre como encontrar cada campo na linha.

# Como funciona
O usuário pode:

- Informar os dados manualmente;
- Enviar um arquivo PDF contendo o boleto.

O sistema realiza:

-Extração dos dados do documento (quando enviado em PDF);

-Extração dos dados presentes na linha digitável; 

-Comparação dos dados informados com os dados cadastrados na linha; 

-Classificação dos dados do boleto como: 

* ✅ Dados Consistentes
* ⚠️ Dados Inconsistentes

Além disso, são apresentados os campos divergentes identificados durante a análise.

## Tecnologias Utilizadas

## Front-End
* HTML5
* CSS3
* JavaScript

## Back-End
* Java 21
* Spring Boot

## Infraestrutura

* Render
* GitHub/develop

## Organização

A organização do desenvolvimento do projeto foi feita através de Kanban no GitHub Projects. 

Além disso, foram feitos levantamento de regras de negócio, requisitos, funcionalidades, e prototipagem das telas pelo Whimsical e Figma.

# Funcionalidades

* Extração de dados do arquivo PDF do boleto via PDFBox
* Verificação de boletos por meio da linha digitável;
* Upload e extração automática de informações de boletos em PDF;
* Extração de data de vencimento, banco e valor do boleto a partir da linha digitável;
* Exibição dinâmica dos resultados da análise;
* Comparação visual entre dados informados e dados extraídos;
* Exibição comparativa dos dados divergentes;

## Tecnologias Utilizadas

## Front-End
* HTML5
* CSS3
* JavaScript

## Back-End
* Java
* Spring Boot

## Infraestrutura

* Render
* GitHub/develop

## Organização

A organização do desenvolvimento do projeto foi feita através de Kanban no GitHub Projects. 

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
<img width="1307" height="632" alt="image" src="https://github.com/user-attachments/assets/862ea8d3-e1cb-47df-8a41-f86befe8aa9c" />


### Tela de formulário para preechimento manual de dados do boleto
<img width="1307" height="632" alt="image" src="https://github.com/user-attachments/assets/2beac963-a46c-4829-9bae-3950f49fb185" />

### Tela de upload de arquivo PDF do boleto
<img width="1291" height="630" alt="image" src="https://github.com/user-attachments/assets/78690009-5792-4f06-8ebc-7189a55a474e" />

### Tela de resultado "Dados Consistentes"
<img width="863" height="410" alt="image" src="https://github.com/user-attachments/assets/a02ee9d4-dec4-440f-9a4b-e94c0af7bc9b" />

### Tela com dados preechidos manualmente e resultado "Dados Inconsistentes"
<img width="1287" height="626" alt="image" src="https://github.com/user-attachments/assets/f49ec8cc-592a-4003-8d47-3927c69489d6" />

### Tela PDF anexado, dados extraídos e resultado
<img width="1280" height="635" alt="image" src="https://github.com/user-attachments/assets/532685d9-1a7e-446b-91ff-baadd6866fe2" />

### Tela mostrando alguns itens da lista de bancos e resultado com um dado consistente
<img width="1272" height="630" alt="image" src="https://github.com/user-attachments/assets/96389e25-13e4-42a2-b4f6-93edabc33655" />

### Exemplos de mensagens de erro
<img width="586" height="571" alt="image" src="https://github.com/user-attachments/assets/ea1a5471-ba28-41e2-a422-cb42a79f93c5" /> <img width="583" height="567" alt="image" src="https://github.com/user-attachments/assets/d468ea4f-f528-471b-b6b4-b2bdda18effe" />














