function mostrarResultado(status, mensagemBack, verificacoes = []) {

    const painel = document.getElementById("painelResultado");

    let corStatus = "#6c757d";
    let textoClassificacao = "Desconhecido";
    let iconeStatus = "./imagens/icone-indefinido.PNG";


    if (status === "INVALIDO") {
        corStatus = "#6c757d";
        textoClassificacao = "Linha inválida";
        iconeStatus = "./imagens/icone-indefinido.PNG";

    } else if (status === "CONSISTENTE") {
        corStatus = "#4e974e";
        textoClassificacao = "Dados consistentes";
        iconeStatus = "./imagens/score-bom.PNG";

    } else if (status === "INCONSISTENTE") {
        corStatus = "#d37408";
        textoClassificacao = "Dados inconsistentes";
        iconeStatus = "./imagens/score-suspeito.PNG";
    }

    const mensagemExibicao = (mensagemBack);
    let htmlVerificacoes = "";

    verificacoes.forEach(v => {
        const icone = v.ok
            ? "./imagens/icone-dado-ok.PNG"
            : "./imagens/icone-dado-divergente.PNG";

        const eCampoData = v.campo && v.campo.toLowerCase().includes("vencimento");
        const textoIcone = v.ok ? "Dado confere" : "Dado divergente";

        const valorExtraidoExibicao = eCampoData ? formatarData(v.valorExtraido) : v.valorExtraido;
        const valorInformadoExibicao = eCampoData ? formatarData(v.valorInformado) : v.valorInformado;

        let textoComparacao = `Cadastrado: ${valorExtraidoExibicao}`;

        if (v.valorInformado) {
            textoComparacao += ` <br> Informado: ${valorInformadoExibicao}`;
        }
        if (v.mensagem) {
            textoComparacao += `<br> ${v.mensagem}`;
        }

        htmlVerificacoes += `
            <div class="linhaResultado">
                <div class="espaco-icone">
                    <img src="${icone}" class="comparacao-icone" alt="${textoIcone}">
                </div>
                <div class="conteudoComparacao">
                    <strong>${v.campo}</strong>
                    <span>${textoComparacao}</span>
                </div>
            </div>
        `;
    });

    painel.innerHTML = `
        <div class="resultado ${status.toLowerCase()}">

            <div class="scoreChat">
                <div class="score" style="border: 2px solid ${corStatus}; background-color: ${corStatus}60;">
                    <img class="icone-score" alt="Classificação: ${textoClassificacao}" src="${iconeStatus}" />
                    <div class="texto-score">
                        <strong>${textoClassificacao}</strong>
                        <p class="recomendacao" style="color: ${corStatus};">
                            ${mensagemExibicao}
                        </p>
                    </div>
                </div>
            </div>

            <div class="resultadoLista">
                ${htmlVerificacoes}
            </div>

        </div>
    `;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    if (isMobile) {
        painel.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}

// Função para converter formato de data para dia/mes/ano
function formatarData(dataString) {
    if (!dataString) return "";

    // Lida com datas que usam hífen (-) ou barra (/)
    const partes = dataString.split(/[-/]/);

    if (partes.length === 3 && partes[0].length === 4) {
        const [ano, mes, dia] = partes;
        return `${dia.padStart(2, '0')}/${mes.padStart(2, '0')}/${ano}`;
    }

    return dataString;
}