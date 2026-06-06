const btnChatbot = document.getElementById("btnChatbot");
const painelChat = document.getElementById("painelChat");
const overlay = document.getElementById("overlay");
btnChatbot.addEventListener("click", abrirChat);

function abrirChat() {
    document.getElementById("painelChat").classList.add("ativo");
    document.getElementById("overlay").classList.add("ativo");
}

function fecharChat() {
    document.getElementById("painelChat").classList.remove("ativo");
    document.getElementById("overlay").classList.remove("ativo");
}

overlay.addEventListener("click", fecharChat);

document.getElementById("btn-enviar").addEventListener("click", enviarPergunta);
let historico = [];

async function enviarPergunta() {

    const input = document.getElementById("inputChat");
    const pergunta = input.value;

    if (!pergunta.trim()) return;

    input.value = "";
    adicionarMensagemUsuario(pergunta);

    historico.push({
        role: "user",
        content: pergunta
    });

    
    const conteudo = document.querySelector(".conteudo-chat");

    conteudo.innerHTML += `
        <div class="mensagens-chatbot" id="digitando">
            <strong>Assistente Virtual</strong>
            <div class="mensagem">
                <p>Digitando...</p>
            </div>
        </div>
    `;
    
    try{

        const resposta = await fetch("https://verificaboleto.onrender.com/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                mensagens: historico
            })
        });

        const texto = await resposta.text();
        document.getElementById("digitando").remove();
        adicionarMensagemBot(texto);

        historico.push({
            role: "assistant",
            content: texto
        });

    } catch (erro) {

        console.error(erro);
        document.getElementById("digitando")?.remove();

        adicionarMensagemBot(
            "Desculpe, o chat está temporariamente indisponível. Tente novamente mais tarde."
        );
    }
}

function adicionarMensagemUsuario(texto) {
    const conteudo = document.querySelector(".conteudo-chat");

    conteudo.innerHTML += `
        <div class="mensagem-usuario">
            <p>${texto}</p>
        </div>
    `;
    conteudo.scrollTop = conteudo.scrollHeight;
}

function adicionarMensagemBot(texto) {
    const conteudo = document.querySelector(".conteudo-chat");

    conteudo.innerHTML += `
        <div class="mensagens-chatbot">
            <strong>Assistente Virtual</strong>
                <div class="mensagem">
                    <p>${texto}</p>
                </div>
        </div>
    `;
    conteudo.scrollTop = conteudo.scrollHeight;
}

document.getElementById("inputChat").addEventListener("keydown", function(e){

    if(e.key === "Enter"){
        enviarPergunta();
    }
});