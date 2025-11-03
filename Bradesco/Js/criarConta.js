document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const mensagemContainer = document.createElement("div");

  // Container da mensagem
  mensagemContainer.className =
    "fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 text-center text-lg font-medium text-gray-800 hidden z-50 px-6";
  document.body.appendChild(mensagemContainer);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const dados = {
      name: document.querySelector("#nome").value,
      cpf: document.querySelector("#cpf").value,
      dataNascimento: document.querySelector("#data-nascimento").value,
      email: document.querySelector("#email").value,
      phoneNumber: document.querySelector("#telefone").value,
      estadoCivil: document.querySelector("#estado-civil").value,
      profissao: document.querySelector("#profissao").value,
      rendaMensal: document.querySelector("#renda").value,
      cep: document.querySelector("#cep").value,
      logradouro: document.querySelector("#logradouro").value,
      numero: document.querySelector("#numero").value,
      bairro: document.querySelector("#bairro").value,
      cidade: document.querySelector("#cidade").value,
      uf: document.querySelector("#estado").value,
      complemento: document.querySelector("#complemento").value,
      password: document.querySelector("#senha").value,
    };

    try {
      const response = await fetch("http://localhost:8080/preRegistration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });

      if (!response.ok) {
        let erroMsg = "Erro ao processar sua solicitação.";

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          if (errorData?.errors?.length) {
            erroMsg = errorData.errors.map((e) => e.defaultMessage).join(" | ");
          } else if (typeof errorData === "string") {
            erroMsg = errorData;
          }
        } else {
          erroMsg = await response.text();
        }

        mensagemContainer.textContent = erroMsg;
        mensagemContainer.classList.remove("hidden", "text-green-600");
        mensagemContainer.classList.add("text-red-600");
        setTimeout(() => mensagemContainer.classList.add("hidden"), 4000);
        return;
      }

      // Sucesso
      mensagemContainer.textContent =
        "Seu cadastro está em análise, aguarde que logo entraremos em contato.";
      mensagemContainer.classList.remove("hidden", "text-red-600");
      mensagemContainer.classList.add("text-green-600");

      // aguarda e redireciona
      setTimeout(() => {
        window.location.href = "/Bradesco/Home.html";
      }, 3000);

      form.reset();
    } catch (error) {
      console.error("Erro:", error);
      mensagemContainer.textContent =
        "Falha ao conectar ao servidor. Verifique sua conex.";
      mensagemContainer.classList.remove("hidden", "text-green-600");
      mensagemContainer.classList.add("text-red-600");

      setTimeout(() => mensagemContainer.classList.add("hidden"), 4000);
    }
  });
});
