async function verificarPdf(e) {

    if (e && typeof e.preventDefault === "function") e.preventDefault();

    const textoArquivo = document.getElementById("nomeArquivo");
    const arquivo = window.arquivoPdf;

    if (!arquivo) {
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
            <span aria-live="polite">Analisando...</span>
        </div>
    `;

    try {
        const formData = new FormData();
        formData.append("arquivo", arquivo);

        const resposta = await fetch("https://verificaboleto-m9zt.onrender.com/boleto/pdf", {
            method: "POST",
            body: formData
        });

        const resultado = await resposta.json();
        const status = resultado.status || "naoEncontrado";

        mostrarResultado(status, resultado.mensagem, resultado.verificacoes);

    } catch (erro) {
        console.error("ERRO FETCH PDF:", erro);
        alert("Erro de comunicação com o servidor");
    } finally {
        botaoPdf.disabled = false;
        botaoPdf.innerHTML = "Verificar Boleto";
    }
}