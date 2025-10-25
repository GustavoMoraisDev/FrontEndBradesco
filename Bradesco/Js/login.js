document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  
  // Container para mensagens de erro
  const mensagemContainer = document.createElement("div");
  mensagemContainer.className =
    "mt-4 text-center text-red-600 font-medium hidden";
  form.appendChild(mensagemContainer);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const dados = {
      agencyNumber: document.getElementById("agencia").value,
      accountNumber: parseInt(document.getElementById("conta").value),
      cpf: document.getElementById("cpf").value
    };

    try {
      const response = await fetch("http://localhost:8080/accounts/verificar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
      });

      if (!response.ok) {
        const text = await response.text();
        mensagemContainer.textContent = text || "Erro inesperado. Verifique seus dados.";
        mensagemContainer.classList.remove("hidden");
        return;
      }

      const data = await response.json();

      // Salva ID e nome do cliente para usar na próxima tela
      sessionStorage.setItem("clienteId", data.id);
      sessionStorage.setItem("clienteNome", data.name);

      // Redireciona para a tela de senha
      window.location.href = "/Bradesco/Senha.html";

    } catch (error) {
      console.error("Erro ao conectar ao servidor:", error);
      mensagemContainer.textContent = "Falha ao conectar ao servidor. Tente novamente.";
      mensagemContainer.classList.remove("hidden");
    }
  });
});
