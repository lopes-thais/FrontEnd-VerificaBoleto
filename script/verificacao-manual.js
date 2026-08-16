async function verificar() {

    const linha = document.getElementById("codigoBarras");
    const vencimento = document.getElementById("vencimento");
    const valor = document.getElementById("valorBoletoInput");
    const banco = document.getElementById("codigoBanco");

    // limpa erros
    document.getElementById("erroCodigo").textContent = "";
    document.getElementById("erroVencimento").textContent = "";
    document.getElementById("erroValor").textContent = "";
    document.getElementById("erroBanco").textContent = "";


    let valido = true;

    if (linha.value.trim() === "") {
        document.getElementById("erroCodigo").textContent = "Preencha este campo";
        valido = false;
    }

    if (vencimento.value.trim() === "") {
        document.getElementById("erroVencimento").textContent = "Preencha este campo";
        valido = false;
    }

    if (valor.value.trim() === "") {
        document.getElementById("erroValor").textContent = "Preencha este campo";
        valido = false;
    }

    if (banco.value.trim() === "") {
        document.getElementById("erroCodigo").textContent = "Informe o banco emissor.";
        valido = false;
    }

    // verificar se a data inserida é válida
    const regexData = /^\d{2}\/\d{2}\/\d{4}$/;
    if (vencimento.value.trim() !== "") {
        if (!regexData.test(vencimento.value.trim())) {
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
    }

    const codigoBanco = document.getElementById("codigoBanco").value;

    if (!codigoBanco) {
        document.getElementById("erroCodigo").textContent = "Selecione um banco válido na lista.";
        valido = false;
    }

    const linhaApenasNumeros = linha.value.replace(/\D/g, "");

    if (linhaApenasNumeros.length !== 47) {
        document.getElementById("erroCodigo").textContent = "A linha digitável deve ter 47 dígitos numéricos.";
        valido = false;
    } else if (linhaApenasNumeros.endsWith("0000000000")) {
        document.getElementById("erroCodigo").textContent =
            "Não é possível validar faturas de cartão ou contas de consumo.";
        valido = false;
    }

    if (!valido) return;

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
            linhaDigitavel: linhaApenasNumeros,
            banco: document.getElementById("codigoBanco").value,
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
            })()
        };

        const resposta = await fetch(
            "https://verificaboleto-m9zt.onrender.com/boleto/verificar",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            }
        );

        const resultado = await resposta.json();

        if (resposta.status === 400) {
            document.getElementById("erroCodigo").textContent = resultado.mensagem;

            return;
        }
        console.log("RETORNO BACK:", resultado);

        const status = resultado.status || "INVALIDO";

        mostrarResultado(status, resultado.mensagem, resultado.verificacoes);

    } catch (erro) {

        console.error("ERRO FETCH:", erro);
        alert("Erro de comunicação com o servidor");

    } finally {

        botao.disabled = false;
        botao.innerHTML = "Verificar Boleto";
    }
}

function limparCampos() {
    document.getElementById("codigoBarras").value = "";
    document.getElementById("vencimento").value = "";
    document.getElementById("valorBoletoInput").value = "";
    document.getElementById("codigoBanco").value = "";

    // limpar mensagens de erro e bordas vermelhas
    document.getElementById("codigoBarras").style.border = "";
    document.getElementById("vencimento").style.border = "";
    document.getElementById("valorBoletoInput").style.border = "";
    document.getElementById("codigoBanco").style.border = "";
    document.getElementById("erroCodigo").innerText = "";
    document.getElementById("erroVencimento").innerText = "";
    document.getElementById("erroValor").innerText = "";
}

// Lista de bancos
const listaBancos = [
    { codigo: "001", nome: "Banco do Brasil" },
    { codigo: "003", nome: "Banco da Amazônia" },
    { codigo: "004", nome: "Banco do Nordeste" },
    { codigo: "033", nome: "Santander" },
    { codigo: "041", nome: "Banrisul" },
    { codigo: "070", nome: "BRB" },
    { codigo: "077", nome: "Banco Inter" },
    { codigo: "104", nome: "Caixa Econômica Federal" },
    { codigo: "237", nome: "Bradesco" },
    { codigo: "260", nome: "Nubank" },
    { codigo: "336", nome: "C6 Bank" },
    { codigo: "341", nome: "Itaú" },
    { codigo: "422", nome: "Safra" },
    { codigo: "748", nome: "Sicredi" },
    { codigo: "756", nome: "Sicoob" }
];

const inputBusca = document.getElementById("buscaBanco");
const inputHidden = document.getElementById("codigoBanco");
const listaUl = document.getElementById("listaSugestoes");

// Variável para controlar qual item está selecionado via teclado
let indiceFocado = -1;

inputBusca.addEventListener("input", function () {
    const termo = this.value.trim().toLowerCase();

    inputHidden.value = "";
    document.getElementById("erroCodigo").textContent = "";
    indiceFocado = -1;

    if (termo === "") {
        listaUl.style.display = "none";
        return;
    }

    const filtrados = listaBancos.filter(b =>
        b.codigo.includes(termo) || b.nome.toLowerCase().includes(termo)
    );

    renderizarSugestoes(filtrados);
});

inputBusca.addEventListener("keydown", function (e) {
    const itens = listaUl.getElementsByTagName("li");

    if (listaUl.style.display === "none" || itens.length === 0) return;

    // SETA PARA BAIXO ⬇️
    if (e.key === "ArrowDown") {
        e.preventDefault();
        indiceFocado++;
        if (indiceFocado >= itens.length) indiceFocado = 0;
        atualizarItemFocado(itens);

    } else if (e.key === "ArrowUp") {
        e.preventDefault();
        indiceFocado--;
        if (indiceFocado < 0) indiceFocado = itens.length - 1;
        atualizarItemFocado(itens);

        // TECLA ENTER ↵
    } else if (e.key === "Enter") {
        e.preventDefault();

        if (indiceFocado > -1 && itens[indiceFocado]) {
            itens[indiceFocado].click();
        }
    }
});

function atualizarItemFocado(itens) {
    // Remove a classe "focado" de todos os itens
    for (let i = 0; i < itens.length; i++) {
        itens[i].classList.remove("focado");
    }

    if (indiceFocado > -1 && itens[indiceFocado]) {
        // Adiciona a classe "focado" no item atual
        const itemAtual = itens[indiceFocado];
        itemAtual.classList.add("focado");

        itemAtual.scrollIntoView({
            block: "nearest"
        });
    }
}

function renderizarSugestoes(bancos) {
    listaUl.innerHTML = "";
    indiceFocado = -1; // Reseta o índice sempre que a lista é redesenhada

    if (bancos.length === 0) {
        listaUl.style.display = "none";
        return;
    }

    bancos.forEach(banco => {
        const li = document.createElement("li");
        li.textContent = `${banco.codigo} - ${banco.nome}`;

        // Evento de clique do mouse na opção
        li.addEventListener("click", function () {
            inputBusca.value = `${banco.codigo} - ${banco.nome}`;
            inputHidden.value = banco.codigo;
            listaUl.style.display = "none";
            indiceFocado = -1;
        });

        listaUl.appendChild(li);
    });

    listaUl.style.display = "block";
}

// Esconde a lista ao clicar fora da área
document.addEventListener("click", function (e) {
    if (!e.target.closest(".campo-autocomplete")) {
        listaUl.style.display = "none";
        indiceFocado = -1;
    }
});