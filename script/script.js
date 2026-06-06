
function removerAtivo() {
    document.querySelectorAll('.btn')
        .forEach(btn => btn.classList.remove('ativo'));
}

function mostrarCodigo(botao) {
    removerAtivo();
    botao.classList.add('ativo');

    document.getElementById("conteudo-codigo").style.display = "block";
    document.getElementById("conteudo-pdf").style.display = "none";
}

function mostrarPdf(botao) {
    removerAtivo();
    botao.classList.add('ativo');

    document.getElementById("conteudo-pdf").style.display = "flex";
    document.getElementById("conteudo-codigo").style.display = "none";
}


const input = document.getElementById("fileInput");
const texto = document.getElementById("nomeArquivo");
const remover = document.getElementById("btnRemover");

input.addEventListener("change", () => {

    if(input.files.length > 0){

        texto.textContent = input.files[0].name;
        remover.style.visibility = "visible";

    } else {

        texto.textContent = "Nenhum arquivo selecionado";
        remover.style.visibility = "hidden";
    }

});

remover.addEventListener("click", (e) => {

    e.preventDefault();
    e.stopPropagation();

    input.value = "";
    texto.textContent = "Nenhum arquivo selecionado";
    remover.style.visibility = "hidden";

});

//logica envio arquivo pdf para o back

input.addEventListener("change", async () => {

    const arquivo = input.files[0];
    if (!arquivo) return;

    if (arquivo.type !== "application/pdf") {
        texto.textContent = "Apenas arquivos PDF são permitidos";
        texto.style.color = "red";
        remover.style.visibility = "hidden";
        input.value = "";
        return;
    }

    const formData = new FormData();
    formData.append("arquivo", arquivo);

    texto.style.color = "#555";
    texto.textContent = arquivo.name;
    remover.style.visibility = "visible";

    const botaoPdf = document.querySelector("#conteudo-pdf .btn-verificar");

    try {

        botaoPdf.disabled = true;
        botaoPdf.innerHTML = "Extraindo dados...";

        console.log("ENVIANDO PDF:", arquivo);

        const resposta = await fetch("https://verificaboleto.onrender.com/pdf/extrair", {
            method: "POST",
            body: formData    
        });

        console.log("STATUS:", resposta.status);
        console.log("OK:", resposta.ok);

        const dados = await resposta.json();

        console.log("PDF EXTRAÍDO:", dados);

        document.getElementById("linhaDigitavel").textContent = dados.linhaDigitavel || "-";
        document.getElementById("valorBoletoResultado").textContent = dados.valor || "-";
        document.getElementById("vencimentoResultado").textContent = dados.dataVencimento ? dados.dataVencimento.split("-").reverse().join("/"): "-";
        document.getElementById("cnpj").textContent = dados.beneficiario?.cnpj || "-";

        window.dadosPdf = dados;



    } catch (erro) {

        console.error("Erro ao enviar PDF:", erro);

    } finally {

        botaoPdf.disabled = false;
        botaoPdf.innerHTML = "Verificar Boleto";
    }
});

async function verificarPdf(e) {
    
    if (e && typeof e.preventDefault === "function") e.preventDefault();

    const textoArquivo = document.getElementById("nomeArquivo");
    const dados = window.dadosPdf;

    if (!dados) {
        textoArquivo.textContent = "Faça o upload de um PDF válido antes de verificar.";
        textoArquivo.style.color = "red"; 
        textoArquivo.style.fontWeight = "bold";
        textoArquivo.style.fontSize = "14px";
        textoArquivo.style.fontFamily = "Arial, sans-serif";
        return;
    }

    const botaoPdf = document.querySelector("#conteudo-pdf .btn-verificar");
    botaoPdf.disabled = true;
    botaoPdf.innerHTML = `
        <div class="loading-btn">
            <div class="spinner-btn"></div>
            <span>Analisando...</span>
        </div>
    `;

    const dadosLinha = parseLinhaDigitavel(dados.linhaDigitavel);

    try {
        const body = {
            linhaDigitavel: dados.linhaDigitavel,
            valor: dados.valor,
            dataVencimento: dados.dataVencimento, 
            beneficiario: {
            cnpj: dados.beneficiario?.cnpj || ""
            }
        };

        const resposta = await fetch("https://verificaboleto.onrender.com/boletos/analise", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        if (resposta.status === 400) {

            const verificacoesNaoEncontrado = [
                {
                    nome: "Valor do boleto",
                    valorBanco: "Não encontrado",
                    valorInformado: dados.valor,
                    ok: null
                },
                {
                    nome: "Data de vencimento",
                    valorBanco: "Não encontrado",
                    valorInformado: dados.dataVencimento,
                    ok: null
                },
                {
                    nome: "CNPJ do beneficiário",
                    valorBanco: "Não encontrado",
                    valorInformado: dados.beneficiario?.cnpj || "",
                    ok: null
                },
                {
                    nome: "Razão social",
                    valorBanco: "Não encontrado",
                    ok: null
                }
            ];

            mostrarResultado(
                "naoEncontrado",
                body,
                dadosLinha,
                0,
                verificacoesNaoEncontrado
            );

            return;
        }

        const resultado = await resposta.json();
        const status = resultado.status || "naoEncontrado";
        
        let score = status === "Seguro" ? 15 : status === "Suspeito" ? 65 : status === "Fraude" ? 95 : 0;

        mostrarResultado(
            status,
            body,
            dadosLinha,
            score,
            resultado.verificacoes
        );

    } catch (erro) {
        console.error("ERRO FETCH PDF:", erro);
        alert("Erro de comunicação com o servidor");
    } finally {
        botaoPdf.disabled = false;
        botaoPdf.innerHTML = "Verificar Boleto";
    }
}

function montarPayload() {

    const linha = document.getElementById("codigoBarras").value;
    const valor = document.getElementById("valorBoletoInput").value;
    const vencimento = document.getElementById("vencimento").value;
    const cnpj = document.getElementById("cpfCnpj").value;

    const linhaDigitavel = linha.replace(/\D/g, "");

    const valorNumerico = Number(
        valor
            .replace("R$", "")
            .replace(/\./g, "")
            .replace(",", ".")
            .trim()
    );

    //muda ordem da data de dd/mm/yyyy para yyyy-mm-dd
    const [dia, mes, ano] = vencimento.split("/");
    const dataFormatada = `${ano}-${mes}-${dia}`;

    const cnpjLimpo = cnpj.replace(/\D/g, "");

    return {
        linhaDigitavel: linhaDigitavel,
        valor: valorNumerico,
        dataVencimento: dataFormatada,
        beneficiario: {
        cnpj: cnpjLimpo
        }
    };
}

async function envioBack() {

    const body = montarPayload();

    console.log("ENVIANDO PRO BACK:", body);

    const resposta = await fetch("https://verificaboleto.onrender.com/boletos/analise", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });

    const resultado = await resposta.json();

    console.log("RETORNO:", resultado);

    return resultado;
}

function formatarData(data) {
    if (!data) return data;

    const partes = data.split("-");

    if (partes.length === 3) {
        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }

    return data;
}

function formatarCNPJ(cnpj) {
    if (!cnpj) return cnpj;

    cnpj = cnpj.replace(/\D/g, "");

    if (cnpj.length !== 14) return cnpj;

    return cnpj.replace(
        /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
        "$1.$2.$3/$4-$5"
    );
}

function mostrarResultado(status, dadosUsuario, dadosLinha, score=0, verificacoes=[], resposta=null) {

    const painel = document.getElementById("painelResultado");

    let mensagem = "";
    let corScore = "#6c757d";
    let textoClassificacao = "Desconhecido";
    let iconeScore = "./imagens/score-suspeito.PNG";
    let icone = "";    

    // 1. status vindo do backend tem prioridade
    if (status === "naoEncontrado") {

        mensagem = "Este boleto não foi encontrado na base de dados. Não é possível confirmar sua autenticidade. Dados extraídos da linha digitavel:";
        corScore = "#6c757d";
        textoClassificacao = "Não encontrado";
        iconeScore = "./imagens/icone-indefinido.PNG";

    } else {

        if (status == "Seguro") {
            corScore = "#4e974e";
            textoClassificacao = "Seguro";
            iconeScore = "./imagens/score-bom.PNG";
            mensagem = "O boleto não apresenta indícios de falsificação! É seguro realizar o pagamento.";            

        } else if (status == "Suspeito") {
            corScore = "#d37408";
            textoClassificacao = "Suspeito";
            iconeScore = "./imagens/score-suspeito.PNG";
            mensagem = "O boleto apresenta inconsistências. Recomendamos não realizar o pagamento e entrar em contato com a instituição financeira.";
            

        } else if (status == "Fraude") {
            corScore = "#c62828";
            textoClassificacao = "Falso";
            iconeScore = "./imagens/score-fraude.PNG";
            mensagem = "O boleto apresenta fortes indícios de falsificação! Recomendamos não realizar o pagamento.";
            
        }
    }


    let htmlVerificacoes = "";

    verificacoes.forEach(v => {

        const temComparacao = v.valorInformado && v.valorInformado !== "Não informado" && v.valorInformado !== "Não informada";
        const icone = temComparacao ? (v.ok ? "/imagens/icone-dado-ok.PNG" : "/imagens/icone-dado-divergente.PNG"): "";

        if (v.nome === "Banco emissor confere") {
            return;
        }

        let valorBanco = v.valorBanco;
        let valorInformado = v.valorInformado;

        if (v.nome === "Data de vencimento confere") {
            valorBanco = formatarData(valorBanco);
            valorInformado = formatarData(valorInformado);
        }

        if (v.nome === "CNPJ do beneficiário válido") {
            valorBanco = formatarCNPJ(valorBanco);
            valorInformado = formatarCNPJ(valorInformado);
        }

        const confRazaoSocial = v.nome === "Razão social confere";
        let textoComparacao = confRazaoSocial ? valorBanco: `Cadastrado: ${valorBanco}`;

        const classeLinha = v.nome === "Razão social confere" ? "linha-razao-social" : "";
        //let textoComparacao = `Cadastrado: ${valorBanco}`;

        if (
            valorInformado &&
            valorInformado !== "Não informado" &&
            valorInformado !== "Não informada"
        ) {
            textoComparacao += ` • Informado: ${valorInformado}`;
        }


        htmlVerificacoes += `                

                <div class="linhaResultado ${classeLinha}">
                        
                    <div class="espaco-icone">
                        ${temComparacao ? `<img src="${icone}" class="comparacao-icone">`: "" }
                    </div>

                    <div class="conteudoComparacao">
                       
                        <strong>${v.nome}</strong>
                        <span>${textoComparacao}</span>
                    </div>
                </div>
        `;
    });

    painel.innerHTML = `
        <div class="resultado ${status.toLowerCase()}">

            <div class="scoreChat">
                <div class="score" style="border: 2px solid ${corScore}; background-color: ${corScore}60;">

                    <img class="icone-score" src="${iconeScore}" />

                    <div class="texto-score">
                        <strong>Boleto ${textoClassificacao}</strong>

                        <span style="color:${corScore}">
                            Risco de fraude: ${score}%
                        </span>

                        <div class="barra-score">
                            <div class="barra-score-preenchida"
                                style="width:${score}%; background:${corScore};">
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <p class="recomendacao">
                ${mensagem}
            </p>

            <div class="resultadoLista">
                    ${htmlVerificacoes}
            </div>
                
             
            <div class="chat">
                <button class="btn-chat" onclick="abrirChat()">Dúvidas? Entre em contato pelo chat!</button>
            </div>

        </div>
    `;
}
async function verificar() {

    const codigo = document.getElementById("codigoBarras");
    const cpf = document.getElementById("cpfCnpj");
    const vencimento = document.getElementById("vencimento");
    const valor = document.getElementById("valorBoletoInput");

    // limpa erros
    document.getElementById("erroCodigo").textContent = "";
    document.getElementById("erroCpf").textContent = "";
    document.getElementById("erroVencimento").textContent = "";
    document.getElementById("erroValor").textContent = "";

    let valido = true;

    if (codigo.value.trim() === "") {
        document.getElementById("erroCodigo").textContent = "Preencha este campo";
        valido = false;
    }

    if (cpf.value.trim() === "") {
        document.getElementById("erroCpf").textContent = "Preencha este campo";
        valido = false;
    }

    if (vencimento.value.trim() === "") {
        document.getElementById("erroVencimento").textContent = "Preencha este campo";
        valido = false;
    }

    if (valor.value.trim() === "") {
        document.getElementById("erroValor").textContent = "Preencha este campo";
        valido = false;
    } else {
        
        const dadosLinha = parseLinhaDigitavel(codigo.value);        
        
        if (!dadosLinha.valida) {            
            document.getElementById("erroCodigo").textContent = dadosLinha.mensagem;
            valido = false;
        }
    }

    //const cpfLimpo = cpf.value.replace(/\D/g, ""); 
    if (cpf.value.trim() === "") {
        document.getElementById("erroCpf").textContent = "Preencha este campo";
        valido = false;
    } else if (cpf.value.replace(/\D/g, "").length !== 11 && cpf.value.replace(/\D/g, "").length !== 14) {
        document.getElementById("erroCpf").textContent = "Digite um CPF válido (11 números) ou CNPJ (14 números).";
        valido = false;
    }

   //verificar se a data inserida é valida
    const regexData = /^\d{2}\/\d{2}\/\d{4}$/;
    if (vencimento.value.trim() === "") {
        document.getElementById("erroVencimento").textContent = "Preencha este campo";
        valido = false;
    } else if (!regexData.test(vencimento.value.trim())) {
        document.getElementById("erroVencimento").textContent = "Formato inválido. Use dd/mm/aaaa";
        valido = false;
    } else {
        
        const [dia, mes, ano] = vencimento.value.split("/");
        const dataObj = new Date(ano, mes - 1, dia);
        
        if (dataObj.getFullYear() != ano || dataObj.getMonth() != mes - 1 || dataObj.getDate() != dia) {
            document.getElementById("erroVencimento").textContent = "Data inválida. Verifique o dia e o mês.";
            valido = false;
        }
    }
    
    if (!valido) return;

    const dadosLinha = parseLinhaDigitavel(codigo.value);

    if (!dadosLinha.valida) {
        document.getElementById("erroCodigo").textContent = dadosLinha.mensagem;
        return;
    }

    if (dadosLinha.linhaCompleta.endsWith("0000000000")) {
        document.getElementById("erroCodigo").textContent =
            "Não é possível validar faturas de cartão ou contas de consumo.";
        return;
    }

    const botao = document.querySelector(".btn-verificar");

    botao.disabled = true;
    botao.innerHTML = `
        <div class="loading-btn">
            <div class="spinner-btn"></div>
            <span>Analisando...</span>
        </div>
    `;

    try {

        const body = {
            linhaDigitavel: dadosLinha.linhaCompleta,
            valor: Number(
                valor.value
                    .replace("R$", "")
                    .replace(/\./g, "")
                    .replace(",", ".")
                    .trim()
            ),
            dataVencimento: (() => {
                const [d, m, a] = vencimento.value.split("/");
                return `${a}-${m}-${d}`;
            })(),
            beneficiario: {
                cnpj: cpf.value.replace(/\D/g, "")
            }
        };

        const resposta = await fetch(
            "https://verificaboleto.onrender.com/boletos/analise",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            }
        );

        if (resposta.status === 400) {

            const verificacoesNaoEncontrado = [
                {
                    nome: "Valor do boleto",
                    valorBanco: "Não encontrado",
                    valorInformado: valor.value,
                    ok: null
                },
                {
                    nome: "Data de vencimento",
                    valorBanco: "Não encontrado",
                    valorInformado: vencimento.value,
                    ok: null
                },
                {
                    nome: "CNPJ do beneficiário",
                    valorBanco: "Não encontrado",
                    valorInformado: cpf.value,
                    ok: null
                },
                {
                    "nome": "Razão social confere",
                    "ok": null,
                    "valorBanco": "Não encontrado"
                }
            ];   
                 mostrarResultado(    
                    "naoEncontrado",
                    body,
                    dadosLinha,
                    0,
                    verificacoesNaoEncontrado
                );

            return;
        }

        const resultado = await resposta.json();
        console.log(JSON.stringify(resultado, null, 2));
        console.log("RETORNO BACK:", resultado);

        const status = resultado.status || "naoEncontrado";
        let score = resultado.scoreRisco;

        if (score == null){
            if (status === "Seguro") {
            score = 15;
            }
            else if (status === "Suspeito") {
                score = 65;
            }
            else if (status === "Fraude") {
                score = 95;
            }
            else {
                score = 0;
            }
        }       

        mostrarResultado(
            status,
            body,
            dadosLinha,
            score,
            resultado.verificacoes
        );

    } catch (erro) {

        console.error("ERRO FETCH:", erro);
        alert("Erro de comunicação com o servidor");

    } finally {

        botao.disabled = false;
        botao.innerHTML = "Verificar Boleto";
    }
}

const cpfCnpjInput = document.getElementById("cpfCnpj");

cpfCnpjInput.addEventListener("input", () => {

    let valor = cpfCnpjInput.value.replace(/\D/g, "");
    valor = valor.substring(0, 14);

    if (valor.length <= 11) {
        valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
        valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
        valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    } else {
        valor = valor.replace(/^(\d{2})(\d)/, "$1.$2");
        valor = valor.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
        valor = valor.replace(/\.(\d{3})(\d)/, ".$1/$2");
        valor = valor.replace(/(\d{4})(\d{1,2})$/, "$1-$2");
    }

    cpfCnpjInput.value = valor;
});


const vencimentoInput = document.getElementById("vencimento");

vencimentoInput.addEventListener("input", () => {

    let valor = vencimentoInput.value.replace(/\D/g, "");
    valor = valor.substring(0, 8);

    valor = valor.replace(/(\d{2})(\d)/, "$1/$2");
    valor = valor.replace(/(\d{2})\/(\d{2})(\d)/, "$1/$2/$3");
    vencimentoInput.value = valor;
});

const valorInput = document.getElementById("valorBoletoInput");

valorInput.addEventListener("input", () => {

    let valor = valorInput.value.replace(/\D/g, "");
    valor = (valor / 100).toFixed(2) + "";
    valor = valor.replace(".", ",");
    valor = valor.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    valorInput.value = "R$ " + valor;
});


const codigoInput = document.getElementById("codigoBarras");

codigoInput.addEventListener("input", () => {

    let valor = codigoInput.value.replace(/\D/g, "");

    valor = valor.substring(0, 47);

    if(valor.length > 5){
        valor = valor.replace(/^(\d{5})(\d)/, "$1.$2");
    }

    if(valor.length > 11){
        valor = valor.replace(/^(\d{5})\.(\d{5})(\d)/, "$1.$2 $3");
    }

    if(valor.length > 17){
        valor = valor.replace(/^(\d{5})\.(\d{5}) (\d{5})(\d)/, "$1.$2 $3.$4");
    }

    if(valor.length > 24){
        valor = valor.replace(/^(\d{5})\.(\d{5}) (\d{5})\.(\d{6})(\d)/, "$1.$2 $3.$4 $5");
    }

    if(valor.length > 30){
        valor = valor.replace(/^(\d{5})\.(\d{5}) (\d{5})\.(\d{6}) (\d{5})(\d)/, "$1.$2 $3.$4 $5.$6");
    }

    if(valor.length > 37){
        valor = valor.replace(/^(\d{5})\.(\d{5}) (\d{5})\.(\d{6}) (\d{5})\.(\d{6})(\d)/, "$1.$2 $3.$4 $5.$6 $7");
    }

    if(valor.length > 39){
        valor = valor.replace(/^(.+)\s(\d)(\d{1,14})$/, "$1 $2 $3");
    }

    codigoInput.value = valor;
});


function limparCampos() {
    document.getElementById("codigoBarras").value = "";
    document.getElementById("cpfCnpj").value = "";
    document.getElementById("vencimento").value = "";
    document.getElementById("valorBoletoInput").value = "";

    //limpar mensagens de erro e bordas vermelhas
    document.getElementById("codigoBarras").style.border = "";
    document.getElementById("cpfCnpj").style.border = "";
    document.getElementById("vencimento").style.border = "";
    document.getElementById("valorBoletoInput").style.border = "";
    document.getElementById("erroCodigo").innerText = "";
    document.getElementById("erroCpf").innerText = "";
    document.getElementById("erroVencimento").innerText = "";
    document.getElementById("erroValor").innerText = "";
}

function parseLinhaDigitavel(linha) {

    let linhaTexto = String(linha).trim();

    if (linhaTexto.includes('e+')) {
        return {
            valida: false,
            mensagem: "Erro de digitação: O navegador converteu o código. Tente digitar ou colar pausadamente."
        };
    }

    const linhaLimpa = linha.replace(/\D/g, "");

    
        if(linhaLimpa.length !== 47){

        return {
            valida: false,
            mensagem: "Linha digitável inválida."
        };
    }
        

    const valorBruto = parseFloat(linhaLimpa.substring(37, 47));
    let valorFormatado = "";

    if (valorBruto === 0) {
        valorFormatado = "Valor Flexível (Fatura/Consumo)";
    } else {
        // 3. Se não for zero, formata o R$ normalmente
        valorFormatado = "R$ " + (valorBruto / 100)
            .toFixed(2)
            .replace(".", ",")
            .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    return {
        valida: true,
        linhaCompleta: linhaLimpa,
        codigoBanco: linhaLimpa.substring(0,3),
        valorBoleto: valorFormatado
    };

}

