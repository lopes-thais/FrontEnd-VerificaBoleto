function mostrarCodigo() {
    document.getElementById("conteudo-codigo").style.display = "block";
    document.getElementById("conteudo-pdf").style.display = "none";
}

function mostrarPdf() {
    document.getElementById("conteudo-pdf").style.display = "block";
    document.getElementById("conteudo-codigo").style.display = "none";
}


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

    document.getElementById("conteudo-pdf").style.display = "block";
    document.getElementById("conteudo-codigo").style.display = "none";
}

document.getElementById("btnUpload").onclick = () => {
  document.getElementById("fileInput").click();
};

const input = document.getElementById("fileInput");
const texto = document.getElementById("nomeArquivo");

input.addEventListener("change", () => {
    if (input.files.length > 0) {
        texto.textContent = "Arquivo selecionado: " + input.files[0].name;
    } else {
        texto.textContent = "Nenhum arquivo selecionado";
    }
});


const icone = document.getElementById("iconeSucesso");
const remover = document.getElementById("btnRemover");

input.addEventListener("change", () => {
    if (input.files.length > 0) {
        texto.textContent = input.files[0].name;

        icone.style.display = "inline";
        remover.style.display = "inline";
    } else {
        texto.textContent = "Nenhum arquivo selecionado";

        icone.style.display = "none";
        remover.style.display = "none";
    }
});

remover.addEventListener("click", () => {
    input.value = ""; // limpa o input

    texto.textContent = "Nenhum arquivo selecionado";
    icone.style.display = "none";
    remover.style.display = "none";
});

