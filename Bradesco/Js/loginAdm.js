document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("acessAdm");
  const mensagem = document.getElementById("mensagem");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const cpf = document.getElementById("cpf").value;
    const password = document.getElementById("password").value;

    // Envia para o back via fetch para validar senha e token
    try {
      const response = await fetch(`http://localhost:8080/administration/verificar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, cpf, password })
      });

      if (!response.ok) {
        const text = await response.text();
        mensagem.textContent = text || "Dados inválidos, verifique e tente novamente!";
        mensagem.classList.remove("hidden");
        return;
      }

      const data = await response.json();

     // Armazena o ID retornado da conta
     sessionStorage.setItem("AdmId", data.id);

      const urlRedirecionamento = `${window.location.origin}/Bradesco/AcessoAdm.html?id=${data.id}`;

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
