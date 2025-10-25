document.addEventListener("DOMContentLoaded", async () => {
  // Pega o id da URL
  const urlParams = new URLSearchParams(window.location.search);
  const clienteId = urlParams.get("id");

  if (!clienteId) {
    // Se não tiver ID, redireciona para login
    window.location.href = "/Bradesco/Login.html";
    return;
  }

  // Elementos do DOM
  const bemVindo = document.getElementById("bemVindo");
  const saldoEl = document.getElementById("saldo");
  const nomeCliente = document.getElementById("nomeCliente");
  const cpfCliente = document.getElementById("cpfCliente");
  const emailCliente = document.getElementById("emailCliente");
  const telefoneCliente = document.getElementById("telefoneCliente");
  const agenciaCliente = document.getElementById("agenciaCliente");
  const contaCliente = document.getElementById("contaCliente");
  const limitePixCliente = document.getElementById("limitePixCliente");

  try {
    const response = await fetch(`http://localhost:8080/accounts/${clienteId}`);
    if (!response.ok) throw new Error("Erro ao buscar dados da conta");

    const data = await response.json();

    // Popula os elementos
    bemVindo.textContent = `Seja bem-vindo, ${data.name}`;
    saldoEl.textContent = `R$ ${Number(data.saldo).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    nomeCliente.textContent = data.name;
    cpfCliente.textContent = data.cpf;
    emailCliente.textContent = data.email;
    telefoneCliente.textContent = data.phoneNumber;
    agenciaCliente.textContent = data.agencyNumber;
    contaCliente.textContent = data.accountNumber;
    limitePixCliente.textContent = `R$ ${Number(data.limitePix.replace('.', '')).toLocaleString('pt-BR')}`;

  } catch (error) {
    console.error(error);
    bemVindo.textContent = "Erro ao carregar dados da conta.";
  }
});
