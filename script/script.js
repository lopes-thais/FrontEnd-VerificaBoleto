function mostrarCodigo() {
    document.getElementById("conteudo-codigo").style.display = "block";
    document.getElementById("conteudo-pdf").style.display = "none";
}

function mostrarPdf() {
    document.getElementById("conteudo-pdf").style.display = "flex";
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

    if(!arquivo) return;

    const formData = new FormData();
    formData.append("arquivo", arquivo);

    try{

        const resposta = await fetch("http://localhost:8080/upload", {
            method: "POST",
            body: formData
        });

        const dados = await resposta.json();

        console.log(dados);

    } catch(erro){
        console.error("Erro ao enviar PDF:", erro);
    }

});


function mostrarResultado(status){

    const painel = document.getElementById("painelResultado");

    if(status === "verdadeiro"){

        painel.innerHTML = `            

             <div class="resultado">
                <div class="verdadeiro">
                        <img src="./imagens/icone-oficial.png" alt="Icone verde certo" id="icone-verdadeiro">
                    <h3 class="tituloResultado">BOLETO OFICIAL!</h3>               
                </div>

                <p class="recomendacao">O boleto NÃO apresenta indícios de falsificação! É seguro realizar o pagamento.</p>

                        <div class="resultadoItem">
                            <strong>Linha digitável:</strong>
                            <span class="linhaDigitavel"></span>
                        </div>

                        <div class="resultadoItem">
                            <strong>Valor (no documento):</strong>
                            <strong>Valor (na linha digitável):</strong>
                            <span class="valorBoleto"></span>
                        </div>

                        <div class="resultadoItem">
                            <strong>Vencimento:</strong>
                            <span class="vencimento"></span>
                        </div>

                        <div class="resultadoItem">
                            <strong>CNPJ Beneficiário:</strong>
                            <span class="cnpj"></span>
                        </div>

                        <div class="resultadoItem">
                            <strong>Código banco emissor (no documento):</strong>
                            <strong>Código banco emissor (na linha digitável):</strong>
                            <span class="agenciaBeneficiario"></span>
                        </div>
            <div>
        `;

    }

    if(status === "suspeito"){

        painel.innerHTML = `

             <div class="resultado">
                <div class="suspeito">
                    <img src="./imagens/icone-suspeito.png" alt="Icone alerta amarelo" id="icone-suspeito">
                    <h3 class="tituloResultado">BOLETO SUSPEITO!</h3>               
                </div>

                    <p class="recomendacao">O boleto apresenta inconsistências! Recomendamos não realizar o pagamento.</p>
                
                        <div class="resultadoItem">
                            <strong>Linha digitável:</strong>
                            <span class="linhaDigitavel"></span>
                        </div>

                        <div class="resultadoItem">
                            <strong>Valor (no documento):</strong>
                            <strong>Valor (na linha digitável):</strong>
                            <span class="valorBoleto"></span>
                        </div>

                        <div class="resultadoItem">
                            <strong>Vencimento:</strong>
                            <span class="vencimento"></span>
                        </div>

                        <div class="resultadoItem">
                            <strong>CNPJ Beneficiário:</strong>
                            <span class="cnpj"></span>
                        </div>

                        <div class="resultadoItem">
                            <strong>Código banco emissor (no documento):</strong>
                            <strong>Código banco emissor (na linha digitável):</strong>
                            <span class="agenciaBeneficiario"></span>
                        </div>
            <div>
        `;

    }

    if(status === "falso"){

        painel.innerHTML = `

            <div class="resultado">
                <div class="falso">
                    <img src="./imagens/icone-alerta.png" alt="Icone vermelho alerta" id="icone-falso">
                    <h3 class="tituloResultado">BOLETO FALSO!</h3>               
                </div>

                    <p class="recomendacao">O boleto apresenta fortes indícios de falsificação! Recomendamos não realizar o pagamento.</p>

                        <div class="resultadoItem">
                            <strong>Linha digitável:</strong>
                            <span class="linhaDigitavel"></span>
                        </div>

                        <div class="resultadoItem">
                            <strong>Valor (no documento):</strong>
                            <strong>Valor (na linha digitável):</strong>
                            <span class="valorBoleto"></span>
                        </div>

                        <div class="resultadoItem">
                            <strong>Vencimento:</strong>
                            <span class="vencimento"></span>
                        </div>

                        <div class="resultadoItem">
                            <strong>CNPJ Beneficiário:</strong>
                            <span class="cnpj"></span>
                        </div>

                        <div class="resultadoItem">
                            <strong>Código banco emissor (no documento):</strong>
                            <strong>Código banco emissor (na linha digitável):</strong>
                            <span class="agenciaBeneficiario"></span>
                        </div>
            <div>
        `;

    }

}
