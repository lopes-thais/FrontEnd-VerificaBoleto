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

        const textoIcone = v.ok ? "Dado confere" : "Dado divergente";

        let textoComparacao = `Cadastrado: ${v.valorExtraido}`;

        if (v.valorInformado) {
            textoComparacao += ` <br> Informado: ${v.valorInformado}`;
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