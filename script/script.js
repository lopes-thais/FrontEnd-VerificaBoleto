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

    if(arquivo.type !== "application/pdf"){

        texto.textContent = "Apenas arquivos PDF são permitidos";        
        texto.style.color = "red";
        remover.style.visibility = "hidden";
        input.value = "";

        return;
    }

            
    texto.style.color = "#555";
    texto.textContent = arquivo.name;
    remover.style.visibility = "visible";


    try{

        const botaoPdf = document.querySelector("#conteudo-pdf .btn-verificar");

        botaoPdf.disabled = true;

        botaoPdf.innerHTML = `
            <div class="loading-btn">
                <div class="spinner-btn"></div>
                <span>Extraindo os dados...</span>
            </div>
        `;

        await new Promise(resolve => setTimeout(resolve, 3000));

        const resposta = await fetch("http://localhost:8080/upload", {
            method: "POST",
            body: formData
        });

        const dados = await resposta.json();

        console.log(dados);

        document.getElementById("linhaDigitavel").textContent =
            dados.linhaDigitavel || "Não encontrado";

        document.getElementById("valorBoletoResultado").textContent =
            dados.valor || "Não encontrado";

        document.getElementById("vencimentoResultado").textContent =
            dados.vencimento || "Não encontrado";

        document.getElementById("cnpj").textContent =
            dados.cnpj || "Não encontrado";

    } catch(erro){

        console.error("Erro ao enviar PDF:", erro);

    } finally {

        const botaoPdf = document.querySelector("#conteudo-pdf .btn-verificar");

        botaoPdf.disabled = false;

        botaoPdf.innerHTML = "Verificar Boleto";

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

                <div class="resultadoLista">

                    <div class="linhaResultado">
                        <strong>Linha digitável:</strong>
                        <span class="linhaDigitavel"></span>
                    </div>

                    <div class="linhaResultado">
                        <strong>Valor no documento:</strong>
                        <span class="valorDocumento">R$ 120,00</span>
                    </div>

                    <div class="linhaResultado">
                        <strong>Valor na linha digitável:</strong>
                        <span class="valorLinha">R$ 120,00</span>
                    </div>

                    <div class="linhaResultado">
                        <strong>Vencimento:</strong>
                        <span class="vencimento"></span>
                    </div>

                    <div class="linhaResultado">
                        <strong>CNPJ Beneficiário:</strong>
                        <span class="cnpj"></span>
                    </div>

                    <div class="linhaResultado">
                        <strong>Banco emissor (documento):</strong>
                        <span class="bancoDocumento"></span>
                    </div>

                    <div class="linhaResultado">
                        <strong>Banco emissor (linha digitável):</strong>
                        <span class="bancoLinha"></span>
                    </div>

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
                
                <div class="resultadoLista">

                    <div class="linhaResultado">
                        <strong>Linha digitável:</strong>
                        <span class="linhaDigitavel"></span>
                    </div>

                    <div class="linhaResultado">
                        <strong>Valor no documento:</strong>
                        <span class="valorDocumento">R$ 120,00</span>
                    </div>

                    <div class="linhaResultado">
                        <strong>Valor na linha digitável:</strong>
                        <span class="valorLinha">R$ 120,00</span>
                    </div>

                    <div class="linhaResultado">
                        <strong>Vencimento:</strong>
                        <span class="vencimento"></span>
                    </div>

                    <div class="linhaResultado">
                        <strong>CNPJ Beneficiário:</strong>
                        <span class="cnpj"></span>
                    </div>

                    <div class="linhaResultado">
                        <strong>Banco emissor (documento):</strong>
                        <span class="bancoDocumento"></span>
                    </div>

                    <div class="linhaResultado">
                        <strong>Banco emissor (linha digitável):</strong>
                        <span class="bancoLinha"></span>
                    </div>

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

                        <div class="resultadoLista">
                            <div class="linhaResultado">
                                <strong>Linha digitável:</strong>
                                <span class="linhaDigitavel"></span>
                            </div>

                            <div class="linhaResultado">
                                <strong>Valor no documento:</strong>
                                <span class="valorDocumento">R$ 120,00</span>
                            </div>
                        
                            <div class="linhaResultado">
                                <strong>Valor na linha digitável:</strong>
                                <span class="valorLinha">R$ 120,00</span>
                            </div>

                            <div class="linhaResultado">
                                <strong>Vencimento:</strong>
                                <span class="vencimento"></span>
                            </div>

                            <div class="linhaResultado">
                                <strong>CNPJ Beneficiário:</strong>
                                <span class="cnpj"></span>
                            </div>

                            <div class="linhaResultado">
                                <strong>Banco emissor (documento):</strong>
                                <span class="bancoDocumento"></span>
                            </div>

                            <div class="linhaResultado">
                                <strong>Banco emissor (linha digitável):</strong>
                                <span class="bancoLinha"></span>
                            </div>
                            <div class="linhaResultado">
                                <strong>Código banco emissor (na linha digitável):</strong>
                                <span class="agenciaBeneficiario"></span>
                            </div>
                        </div>
            <div>
        `;

    }

}

async function verificar() {

    const codigo = document.getElementById("codigoBarras");
    const cpf = document.getElementById("cpfCnpj");
    const vencimento = document.getElementById("vencimento");
    const valor = document.getElementById("valorBoletoInput");
    let valido = true;

    document.getElementById("erroCodigo").textContent = "";
    document.getElementById("erroCpf").textContent = "";
    document.getElementById("erroVencimento").textContent = "";
    document.getElementById("erroValor").textContent = "";

    if(codigo.value.trim() === ""){

        codigo.style.border = "2px solid red";
        document.getElementById("erroCodigo").textContent =
        "Preencha este campo";
        valido = false;

    } else {

        codigo.style.border = "";
    }

    if(cpf.value.trim() === ""){

        cpf.style.border = "2px solid red";
        document.getElementById("erroCpf").textContent =
        "Preencha este campo";

        valido = false;

    } else {

        cpf.style.border = "";
    }

    if(vencimento.value.trim() === ""){

        vencimento.style.border = "2px solid red";
        document.getElementById("erroVencimento").textContent =
        "Preencha este campo";
        valido = false;

    } else {

        vencimento.style.border = "";
    }

    if(valor.value.trim() === ""){

        valor.style.border = "2px solid red";
        document.getElementById("erroValor").textContent =
        "Preencha este campo";
        valido = false;

    } else {

        valor.style.border = "";
    }

    if(!valido){
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

    setTimeout(() => {

        mostrarResultado("verdadeiro");
        botao.disabled = false;
        botao.innerHTML = "Verificar Boleto";

    }, 2000);
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

img.addEventListener("click", function (event) {
  menu.style.display = (menu.style.display === "block") ? "none" : "block";
  
  // posiciona o menu perto da imagem
  const rect = img.getBoundingClientRect();
  menu.style.left = rect.left + "px";
  menu.style.top = rect.bottom + "px";
});

// fecha se clicar fora
document.addEventListener("click", function (event) {
  if (!img.contains(event.target) && !menu.contains(event.target)) {
    menu.style.display = "none";
  }
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
