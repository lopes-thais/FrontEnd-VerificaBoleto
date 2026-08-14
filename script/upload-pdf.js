
const input = document.getElementById("fileInput");
const texto = document.getElementById("nomeArquivo");
const remover = document.getElementById("btnRemover");

remover.addEventListener("click", (e) => {

    e.preventDefault();
    e.stopPropagation();

    input.value = "";
    texto.textContent = "Nenhum arquivo selecionado";
    remover.style.visibility = "hidden";

});

input.addEventListener("change", async () => {

    const arquivo = input.files[0];
    if (!arquivo) return;

    if(input.files.length > 0){

        texto.textContent = input.files[0].name;
        remover.style.visibility = "visible";

    } else {

        texto.textContent = "Nenhum arquivo selecionado";
        remover.style.visibility = "hidden";
    }

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

        const resposta = await fetch("http://localhost:8081/boleto/pdf/extrair", {
            method: "POST",
            body: formData
        });

         console.log("STATUS:", resposta.status);
         console.log("OK:", resposta.ok);

        const dados = await resposta.json();

        console.log("PDF EXTRAÍDO:", dados);

        document.getElementById("linhaDigitavel").textContent = dados.linhaDigitavel || "-";
        document.getElementById("valorBoletoResultado").textContent = dados.valoresEncontrados || "-";
        document.getElementById("vencimentoResultado").textContent = dados.datasEncontradas;

        window.dadosPdf = dados;
        window.arquivoPdf = arquivo;

    } catch (erro) {

        console.error("Erro ao enviar PDF:", erro);

    } finally {

        botaoPdf.disabled = false;
        botaoPdf.innerHTML = "Verificar Boleto";
    }
});