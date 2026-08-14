
function montarPayload() {

    const linha = document.getElementById("codigoBarras").value;
    const valor = document.getElementById("valorBoletoInput").value;
    const vencimento = document.getElementById("vencimento").value;
    const cnpj = document.getElementById("cpfCnpj").value;

    const linhaDigitavel = linha.replace(/\D/g, "");

    const valorNumerico = Number(
        valor
            .replace("R$", "")
            .replace(/\./g, "")
            .replace(",", ".")
            .trim()
    );

    //muda ordem da data de dd/mm/yyyy para yyyy-mm-dd
    const [dia, mes, ano] = vencimento.split("/");
    const dataFormatada = `${ano}-${mes}-${dia}`;

    const cnpjLimpo = cnpj.replace(/\D/g, "");

    return {
        linhaDigitavel: linhaDigitavel,
        valor: valorNumerico,
        dataVencimento: dataFormatada,
        beneficiario: {
            cnpj: cnpjLimpo
        }
    };
}