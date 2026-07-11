// ==============================
// RESTRIÇÃO ALIMENTAR
// ==============================

const restricao = document.getElementById("restricao");
const outraRestricao = document.getElementById("outraRestricao");

restricao.addEventListener("change", () => {

    if (restricao.value === "Outro") {

        outraRestricao.style.display = "block";

    } else {

        outraRestricao.style.display = "none";
        outraRestricao.value = "";

    }

});

// ==============================
// ENVIO DO FORMULÁRIO
// ==============================

const formulario = document.getElementById("rsvpForm");

formulario.addEventListener("submit", function(event){

    event.preventDefault();

    const dados = {

        nome: document.getElementById("nome").value,

        telefone: document.getElementById("telefone").value,

        presenca: document.querySelector('input[name="presenca"]:checked').value,

        adultos: document.getElementById("adultos").value,

        criancas: document.getElementById("criancas").value,

        restricao: document.getElementById("restricao").value,

        outraRestricao: document.getElementById("outraRestricao").value,

        mensagem: document.getElementById("mensagem").value

    };

    console.log(dados);

    alert("💙 Obrigado! Sua presença foi registrada com sucesso.");

    formulario.reset();

    outraRestricao.style.display = "none";

});