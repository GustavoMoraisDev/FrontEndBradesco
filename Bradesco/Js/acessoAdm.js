document.addEventListener("DOMContentLoaded", async () => {
  // Pega o id da URL
  const urlParams = new URLSearchParams(window.location.search);
  const clienteId = urlParams.get("id");

  if (!clienteId) {
    window.location.href = "/Bradesco/Login.html";
    return;
  }

  const bemVindo = document.getElementById("bemVindo");
  const lista = document.getElementById("listaContasPendentes");
  const Aprovados = document.getElementById("contasAtivas");
  const Reprovados = document.getElementById("contasReprovadas");
  const Pendentes = document.getElementById("contasPendentes");



  // BUSCA ADMIN PELO ID
  try {
    const response = await fetch(
      `http://localhost:8080/administration/${clienteId}`
    );
    if (!response.ok) throw new Error("Erro ao buscar dados da conta");

    const data = await response.json();
    bemVindo.textContent = `Seja bem-vindo, ${data.name}`;
  } catch (error) {
    console.error(error);
    bemVindo.textContent = "Erro ao carregar dados da conta.";
  }

  // BUSCA CONTAS APROVADAS
  try {
    const status = "2";
    const response = await fetch(
      `http://localhost:8080/preRegistration/status?status=${status}`
    );
    const data = await response.json();

    if (!response.ok) throw new Error("Erro ao buscar contas pendentes");

    const totalAprovados = data.length;
    Aprovados.textContent = `Contas Ativas: ${totalAprovados}`;
  } catch (error) {
    console.error("Erro ao carregar contas:", error);
  }

  // BUSCA CONTAS REPROVADAS
  try {
    const status = "3";
    const response = await fetch(
      `http://localhost:8080/preRegistration/status?status=${status}`
    );
    const data = await response.json();

    if (!response.ok) throw new Error("Erro ao buscar contas pendentes");

    const totalReprovados = data.length;
    Reprovados.textContent = `Contas Reprovadas: ${totalReprovados}`;
  } catch (error) {
    console.error("Erro ao carregar contas:", error);
  }

  // BUSCA CONTAS PENDENTES //
  try {
    const status = "1";
    const response = await fetch(
      `http://localhost:8080/preRegistration/status?status=${status}`
    );
    const contas = await response.json();

    const totalPendentes = contas.length;
    Pendentes.textContent = `Contas Pendentes: ${totalPendentes}`;

    if (!response.ok) throw new Error("Erro ao buscar contas pendentes");

    lista.innerHTML = ""; // limpa a lista

    if (!contas.length) {
      lista.innerHTML = `
        <p class="text-gray-500 col-span-full text-center py-20">
          Nenhuma conta pendente encontrada.
        </p>
      `;
      return;
    }

    // Monta cada card
    contas.forEach((conta) => {
      const card = document.createElement("div");
      card.className =
        "w-full bg-white border-l-4 border-[#cc092f] shadow-md rounded-2xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer";
      card.id = `conta-${conta.id}`;

      card.innerHTML = `
  <!-- Cabeçalho -->
  <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
    <div>
      <h4 class="text-xl font-semibold text-gray-800 mb-1">${conta.name}</h4>
    </div>
    <span class="inline-block text-xs font-semibold bg-[#cc092f] text-white py-1 px-3 rounded-full">
      ${conta.status === "1" ? "Em análise" : conta.status}
    </span>
  </div>

  <!-- Dados Pessoais -->
  <div class="mb-4">
    <h5 class="text-md font-semibold text-[#cc092f] border-b pb-1 mb-2">Dados Pessoais</h5>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm text-gray-700">
      <p><strong>Nome:</strong> ${conta.name}</p>
      <p><strong>CPF:</strong> ${conta.cpf}</p>
      <p><strong>Data de Nascimento:</strong> ${conta.dataNascimento}</p>
      <p><strong>Estado Civil:</strong> ${conta.estadoCivil}</p>
      <p><strong>Profissão:</strong> ${conta.profissao}</p>
      <p><strong>Renda Mensal:</strong> R$ ${conta.rendaMensal}</p>
    </div>
  </div>

  <!-- Dados de Contato -->
  <div class="mb-4">
    <h5 class="text-md font-semibold text-[#cc092f] border-b pb-1 mb-2">Dados de Contato</h5>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm text-gray-700">
      <p><strong>Email:</strong> ${conta.email}</p>
      <p><strong>Telefone:</strong> ${conta.phoneNumber}</p>
      <p><strong>Data de Cadastro:</strong> ${new Date(
        conta.createdAt
      ).toLocaleString("pt-BR")}</p>
    </div>
  </div>

  <!-- Endereço -->
  <div class="mb-4">
    <h5 class="text-md font-semibold text-[#cc092f] border-b pb-1 mb-2">Endereço</h5>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm text-gray-700">
      <p><strong>CEP:</strong> ${conta.cep}</p>
      <p><strong>Logradouro:</strong> ${conta.logradouro}</p>
      <p><strong>Número:</strong> ${conta.numero}</p>
      <p><strong>Bairro:</strong> ${conta.bairro}</p>
      <p><strong>Cidade:</strong> ${conta.cidade}</p>
      <p><strong>UF:</strong> ${conta.uf}</p>
      <p><strong>Complemento:</strong> ${conta.complemento || ""}</p>
    </div>
  </div>

  <!-- Botões -->
  <div class="flex flex-col sm:flex-row gap-3 mt-5">
    <button
      data-action="aprovar"
      class="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg transition-all duration-200 shadow-sm">
      Aprovar
    </button>
    <button
      data-action="reprovar"
      class="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 rounded-lg transition-all duration-200 shadow-sm">
      Reprovar
    </button>
  </div>
`;

      lista.appendChild(card);
    });

    lista.addEventListener("click", async (event) => {
      const button = event.target.closest("button");
      if (!button) return;

      const action = button.dataset.action;
      const card = button.closest("[id^='conta-']");
      if (!card) return;

      const contaId = card.id.replace("conta-", "");
      const conta = contas.find((c) => c.id == contaId);
      if (!conta) return console.error("Conta não encontrada:", contaId);

      if (action === "aprovar") {
        const body = {
          name: conta.name,
          cpf: conta.cpf,
          dataNascimento: conta.dataNascimento,
          email: conta.email,
          phoneNumber: conta.phoneNumber,
          profissao: conta.profissao,
          rendaMensal: conta.rendaMensal,
          cep: conta.cep,
          logradouro: conta.logradouro,
          numero: conta.numero,
          bairro: conta.bairro,
          cidade: conta.cidade,
          uf: conta.uf,
          complemento: conta.complemento,
          password: conta.password,
        };

        const bodyApprovedPreRegistration = {
          cpf: conta.cpf,
          status: "2",
        };

        try {
          button.disabled = true;
          button.textContent = "Aprovando...";

          const response = await fetch("http://localhost:8080/accounts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });

          let erroMsg;

          if (!response.ok) {
            const contentType = response.headers.get("content-type");

            if (contentType && contentType.includes("application/json")) {
              const errorData = await response.json();
              if (errorData?.errors?.length) {
                erroMsg = errorData.errors
                  .map((e) => e.defaultMessage)
                  .join(" | ");
              } else if (errorData?.message) {
                erroMsg = errorData.message;
              }
            } else {
              erroMsg = await response.text();
            }

            mostrarToast(`Erro ao Aprovar Cadastro: ${erroMsg}`, "erro");
            throw new Error(erroMsg);
          }

          const updateStatus = await fetch(
            "http://localhost:8080/preRegistration/analysis",
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(bodyApprovedPreRegistration),
            }
          );

          if (!updateStatus.ok)
            throw new Error("Erro ao mudar Status da Conta");

          card.remove();
          mostrarToast(
            `Conta de ${conta.name} aprovada com sucesso!`,
            "sucesso"
          );

          setTimeout(() => {
            location.reload();
          }, 2000);
        } catch (err) {
          console.error(err);
        } finally {
          button.disabled = false;
          button.textContent = "Aprovar";
        }
      }

      if (action === "reprovar") {
        try {
          button.disabled = true;
          button.textContent = "Reprovando...";

          const bodyDisapprovedPreRegistration = {
            cpf: conta.cpf,
            status: "3",
          };

          const updateStatus = await fetch(
            "http://localhost:8080/preRegistration/analysis",
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(bodyDisapprovedPreRegistration),
            }
          );

          if (!updateStatus.ok) throw new Error("Erro ao reprovar conta");

          card.remove();
          mostrarToast(`Conta de ${conta.name} reprovada.`, "erro");

          setTimeout(() => {
            location.reload();
          }, 2000);
        } catch (err) {
          console.error(err);
          alert("Erro ao reprovar conta.");
        } finally {
          button.disabled = false;
          button.textContent = "Reprovar";
        }
      }
    });
  } catch (error) {
    console.error("Erro ao carregar contas pendentes:", error);
    lista.innerHTML = `<p class="text-red-600 text-center py-20">Erro ao carregar contas pendentes.</p>`;
  }
});

function mostrarToast(mensagem, tipo = "sucesso") {
  const toastContainer = document.getElementById("toastContainer");

  const cores = {
    sucesso: "bg-green-600",
    erro: "bg-red-600",
  };

  const toast = document.createElement("div");
  toast.className = `${cores[tipo]} text-white px-4 py-3 rounded-lg shadow-lg text-sm animate-fade-in-down`;
  toast.textContent = mensagem;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("opacity-0", "transition-opacity", "duration-700");
    setTimeout(() => toast.remove(), 700);
  }, 3000);
}
