document.addEventListener("DOMContentLoaded", async () => {
  
  const bemVindo = document.getElementById("bemVindo");
  const section = document.getElementById("conteudoPrincipal");
  const contasAtivasBtn = document.getElementById("contasAtivas");
  const contasPendentesBtn = document.getElementById("contasPendentes");
  const contasReprovadasBtn = document.getElementById("contasReprovadas");
  const menuItens = document.querySelectorAll("aside nav a");

  
  // Variáveis globais
  let dataAdmin = {}; // dados do admin
  let contasPendentesData = []; // somente contas pendentes (status 1)
  let todasContasGlobal = [];

  
  // FUNÇÃO: Mostrar Toast
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

  
  // FUNÇÃO: Trocar conteúdo do section
  const trocarConteudo = (html) => section.innerHTML = html;

  
  // BUSCAR DADOS DO ADMIN
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const clienteId = urlParams.get("id");
    if (!clienteId) return window.location.href = "/Bradesco/Login.html";

    const response = await fetch(`http://localhost:8080/administration/${clienteId}`);
    if (!response.ok) throw new Error("Erro ao buscar dados da conta");

    dataAdmin = await response.json();
    bemVindo.textContent = `Seja bem-vindo, ${dataAdmin.name}`;
  } catch (err) {
    console.error(err);
    bemVindo.textContent = "Erro ao carregar dados da conta.";
  }

  
  // FUNÇÃO: Buscar Contas Pré Registro
  const buscarContas = async (status, element) => {
    try {
      const response = await fetch(`http://localhost:8080/preRegistration/status?status=${status}`);
      if (!response.ok) throw new Error("Erro ao buscar contas");

      const contasStatus = await response.json();

      // Atualiza contador
      element.textContent =
        status === "1" ? `Contas em Análise: ${contasStatus.length}` :
        status === "2" ? `Contas Ativas: ${contasStatus.length}` :
        `Contas Reprovadas: ${contasStatus.length}`;

      // Armazena pendentes
      if (status === "1") contasPendentesData = contasStatus;
    } catch (err) {
      console.error(err);
      element.textContent =
        element.id === "contasAtivas" ? "Contas Ativas: Erro" :
        element.id === "contasPendentes" ? "Contas em Análise: Erro" :
        "Contas Reprovadas: Erro";
    }
  };

  // FUNÇÃO: Buscar Contas Totais
  const buscarTodasContas = async () => {
  try {
    const response = await fetch("http://localhost:8080/accounts");
    if (!response.ok) throw new Error("Erro ao buscar todas as contas");
    const contas = await response.json();

    // Ordena da mais recente para a mais antiga
    contas.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return contas;
  } catch (err) {
    console.error(err);
    mostrarToast("Erro ao buscar todas as contas", "erro");
    return [];
  }
};

  
  // FUNÇÃO: Criar Cards de Contas Pré Registro
  
  const criarCards = (contasData) => {
    if (!contasData || contasData.length === 0) {
      return `
        <div class="bg-white rounded-xl p-20 text-center">
          <p class="text-black text-1xl font-medium">Nenhuma Conta em Análise</p>
        </div>
      `;
    }



    // Ordena do mais recente
    contasData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return contasData.map(conta => {


          const cor =
  conta.riskIndex >= 900 ? "bg-[#FF0000]" :
  conta.riskIndex >= 800 ? "bg-[#FF6600]" :
  conta.riskIndex > 700 ? "bg-[#FF9933]" :
  conta.riskIndex > 600 ? "bg-[#FFC000]" :
  conta.riskIndex > 500 ? "bg-[#FFFF00]" :
  "bg-[#B5E6A2]";
  

  return `

      <div id="conta-${conta.id}" class="w-full bg-white shadow-lg rounded-2xl p-6 transition-all duration-300 cursor-pointer mb-5">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
    <!-- Nome -->
    <h4 class="text-xl font-semibold text-gray-800 mb-1">${conta.name}</h4>

    <!-- Container do risco -->
    <div class="flex flex-col items-end">
      <span class="text-[15px] font-semibold text-gray-800 mb-1">Índice de Risco</span>
      <span class="inline-block text-xs font-semibold text-white py-2 px-10 rounded-full ${cor}">
        ${conta.riskIndex}
      </span>
    </div>
  </div>

        <!-- Dados Pessoais -->
        <div class="mb-4">
          <h5 class="text-md font-semibold text-[#cc092f] border-b pb-1 mb-2">Dados Pessoais</h5>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm text-gray-700">
            <p><strong>Nome:</strong> ${conta.name}</p>
            <p><strong>CPF:</strong> ${conta.cpf}</p>
            <p><strong>Data de Nascimento:</strong> ${new Date(conta.dataNascimento).toLocaleDateString("pt-BR")}</p>
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
            <p><strong>Data de Cadastro:</strong> ${new Date(conta.createdAt).toLocaleString("pt-BR")}</p>
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

        <div class="flex flex-col sm:flex-row gap-3 mt-5">
          <button data-action="aprovar" data-id="${conta.id}" class="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg transition shadow-sm">Aprovar</button>
          <button data-action="reprovar" data-id="${conta.id}" class="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 rounded-lg transition shadow-sm">Reprovar</button>
        </div>
      </div>
    `  }).join("");
};


  // FUNÇÃO: Criar Cards de Contas Totais
const criarCardsTodas = (contas) => {
  if (!contas || contas.length === 0) {
    return `
      <div class="bg-white rounded-xl p-20 text-center">
        <p class="text-black text-1xl font-medium">Nenhuma conta encontrada</p>
      </div>
    `;
  }

  return contas.map(conta => {

    let statusConta
    if(conta.status === '1') {
      statusConta = 'Ativo'
    } else {
      statusConta = 'Inativo'
    }

    let colorStatus
    if(conta.status === '1') {
      colorStatus = 'bg-green-600'
    } else {
      colorStatus = 'bg-red-600'
    }

    let buttonAction
    if(conta.status === '1') {
      buttonAction = 'Inativar'
    } else {
      buttonAction = 'Ativar'
    }

    let colorButton
    if(conta.status === '1') {
      colorButton = 'bg-red-500 hover:bg-red-700'
    } else {
      colorButton = 'bg-green-500 hover:bg-green-700'
    }

    let actionData
    if(conta.status === '1') {
      actionData = '2'
    } else {
      actionData = '1'
    }

     
    
    return `
      <div class="grid grid-cols-[2fr_2fr_1fr_1fr_1.5fr_1fr_auto] gap-2 items-center p-3 border-b text-sm text-gray-800">
      <p>${conta.name}</p>
      <p>${conta.cpf}</p>
      <p>${conta.accountNumber}</p>
      <p>${Number(conta.saldo).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
      <p>${new Date(conta.createdAt).toLocaleDateString("pt-BR")}</p>
      <p class="text-xs font-bold text-white px-3 py-1 rounded-full ${colorStatus} w-fit">${statusConta}</p>
      <button data-action="${actionData}" data-id="${conta.accountNumber}" class="text-xs text-white font-bold ${colorButton} border-amber-50 px-3 py-1 rounded-full w-fit">${buttonAction}</button>
    </div>
    `;
  }).join("");
};
  

  
  // FUNÇÃO: Carregar Menu-
  const carregarMenu = (id) => {
    // reset menu
    menuItens.forEach(i => i.classList.remove("bg-red-100", "bradesco-red-text", "font-bold"));
    const itemAtivo = document.getElementById(id);
    if (itemAtivo) itemAtivo.classList.add("bg-red-100", "bradesco-red-text", "font-bold");

    switch (id) {
      case "inicio":
        trocarConteudo(`
          <div class="space-y-6">
            <div class="bg-white shadow-xl rounded-xl p-6 border border-gray-100 mb-6">
            
              ${criarCards(contasPendentesData)}
            </div>
          </div>
        `);
        break;
      case "Contas":
        trocarConteudo(`
          <div class="space-y-6">
          
            <div class="bg-white shadow-xl rounded-xl p-6 border border-gray-100 mb-6">
            <div class="grid grid-cols-[2fr_2fr_0.9fr_0.9fr_2fr_1.1fr_0.8fr] text-neutral-600 font-semibold border-b pb-2 px-3">
            <p>Nome</p> <p>Documento</p> <p>Conta</p> <p>Saldo</p> <p>Data de Criação</p> <p>Satus</p> <p>Ação</p>
            </div>
            ${criarCardsTodas(todasContasGlobal)}
              
            </div>
          </div>
          `);
        break;
      case "Dashboard":
        trocarConteudo(`<div class="bg-white shadow-xl rounded-xl p-20">... Dashboard ...</div>`);
        break;
      case "Administradores":
        trocarConteudo(`<div class="bg-white shadow-xl rounded-xl p-20">... Gerenciamento de Admins ...</div>`);
        break;
    }
  };

  
  // FUNÇÃO: Ação de Aprovar / Reprovar
  const handleContaAction = async (event) => {
    const button = event.target.closest("button");
    if (!button || !["aprovar", "reprovar"].includes(button.dataset.action)) return;

    const action = button.dataset.action;
    const contaId = button.dataset.id;
    const card = button.closest(`[id='conta-${contaId}']`);
    const conta = contasPendentesData.find(c => c.id == contaId);
    if (!conta) return console.error();

    try {
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
          riskIndex: conta.riskIndex,
          password: conta.password,
        };

        const bodyApprovedPreRegistration = {
          cpf: conta.cpf,
          status: "2",
        };

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

          card.remove();
          mostrarToast(
            `Conta de ${conta.name} aprovada com sucesso!`,
            "sucesso"
          );

          setTimeout(() => {
            location.reload();
          }, 2000);
          
      } else if (action === "reprovar") {

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
          

        setTimeout(() => {
            location.reload();
          }, 2000);
      }
    
     return;
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (event) => {
  const button = event.target.closest("button");
  if (!button || !["1", "2"].includes(button.dataset.action)) return;

  // Lê os valores dos atributos
  const novoStatus = button.dataset.action;  // 1 = Ativar, 2 = Inativar
  const accountNumber = button.dataset.id;   // Número da conta

  try {
    const response = await fetch(`http://localhost:8080/accounts/${accountNumber}/${novoStatus}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" }
    });

    const message = await response.text();
    mostrarToast(message, "sucesso");

    setTimeout(() => {
            location.reload();
          }, 2000);

     } catch (err) {
    console.error(err);
    mostrarToast("Erro ao conectar com o servidor", "erro");
  }
};

  
  // Inicialização

  // 1. Buscar contadores
  await Promise.all([
    buscarContas("2", contasAtivasBtn),
    buscarContas("1", contasPendentesBtn),
    buscarContas("3", contasReprovadasBtn)
  ]);

    todasContasGlobal = await buscarTodasContas();

  // 2. Carregar conteúdo inicial
  carregarMenu("inicio");

  // 3. Menu lateral
  menuItens.forEach(item => {
    item.addEventListener("click", e => {
      e.preventDefault();
      carregarMenu(item.id);
    });
  });

  // 4. Listener dos botões Aprovar/Reprovar (delegação)
  section.addEventListener("click", handleContaAction);

  // 5. Listener dos botões Ativar/Inativar (delegação)
  section.addEventListener("click", handleStatusChange);

  // 6. Botão contasPendentesBtn
  contasPendentesBtn.addEventListener("click", () => carregarMenu("Administradores"));
});
