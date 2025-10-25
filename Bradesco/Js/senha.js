document.addEventListener("DOMContentLoaded", () => {
  const bemVindo = document.getElementById("bemVindo");
  const form = document.getElementById("senhaForm");
  const mensagem = document.getElementById("mensagem");

  // Pega o nome do cliente do sessionStorage
  const nomeCliente = sessionStorage.getItem("clienteNome") || "Cliente";
  bemVindo.textContent = `Seja bem-vindo, ${nomeCliente}`;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const senha = document.getElementById("senha").value;
    const token = document.getElementById("token").value;
    const clienteId = sessionStorage.getItem("clienteId");

    // Aqui você pode enviar para o back via fetch para validar senha e token
    try {
      const response = await fetch(`http://localhost:8080/accounts/validar-senha/${clienteId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senha, token })
      });

      if (!response.ok) {
        const text = await response.text();
        mensagem.textContent = text || "Senha ou token inválidos.";
        mensagem.classList.remove("hidden");
        return;
      }

      const data = await response.json();

     // Armazena o ID retornado da conta
     sessionStorage.setItem("clienteId", data.id);

      const urlRedirecionamento = `/Bradesco/conta.html?id=${clienteId}`;

      // Login bem-sucedido
      mensagem.textContent = "Login realizado com sucesso!";
      mensagem.classList.remove("hidden");
      mensagem.classList.remove("text-red-600");
      mensagem.classList.add("text-green-600");

      // Redireciona após 2 segundos
      setTimeout(() => {
        window.location.href = urlRedirecionamento;
      }, 2000);

    } catch (error) {
      console.error("Erro ao conectar ao servidor:", error);
      mensagem.textContent = "Falha ao conectar ao servidor. Tente novamente.";
      mensagem.classList.remove("hidden");
    }
  });
});
