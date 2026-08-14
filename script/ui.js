
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