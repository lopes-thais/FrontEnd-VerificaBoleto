
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