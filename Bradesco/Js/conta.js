document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const clienteId = urlParams.get("id");

  if (!clienteId) {
    window.location.href = "/Bradesco/Login.html";
    return;
  }

  const bemVindo = document.getElementById("bemVindo");
  const section = document.getElementById("conteudoPrincipal");

  // 1. FUNÇÃO PARA CRIAR E INJETAR O CONTAINER DE MENSAGENS
  const criarContainerMensagem = () => {
    let container = document.getElementById("mensagemContainer");

    // Se o container já existe, apenas retorna
    if (container) return container;

    // Cria o container principal
    container = document.createElement("div");
    container.id = "mensagemContainer";

    // Classes Tailwind CSS para posicionamento e estado inicial (invisível/no topo)
    container.className =
      "fixed top-0 left-1/2 transform -translate-x-1/2 mt-5 p-4 rounded-lg text-white shadow-xl z-50 transition-opacity duration-300 opacity-0 pointer-events-none min-w-80";

    // Cria o parágrafo para o texto
    const texto = document.createElement("p");
    texto.id = "mensagemTexto";
    texto.className = "font-semibold";

    container.appendChild(texto);
    document.body.appendChild(container); // Anexa o container ao body

    return container;
  };

  // Inicializa o container
  const mensagemContainer = criarContainerMensagem();
  const mensagemTexto = document.getElementById("mensagemTexto");

  // 2. FUNÇÃO PARA MOSTRAR MENSAGENS
  const mostrarMensagem = (tipo, texto) => {
    // Remove classes de cor anteriores
    mensagemContainer.classList.remove(
      "bg-green-600",
      "bg-red-600",
      "bg-gray-700"
    );

    if (tipo === "sucesso") {
      mensagemContainer.classList.add("bg-green-600");
    } else if (tipo === "erro") {
      mensagemContainer.classList.add("bg-red-600"); // Cor padrão para erro
    } else {
      mensagemContainer.classList.add("bg-gray-700");
    }

    mensagemTexto.textContent = texto;

    // Torna visível
    mensagemContainer.classList.remove("opacity-0", "pointer-events-none");
    mensagemContainer.classList.add("opacity-100");

    // Esconde após 4 segundos (4000ms)
    setTimeout(() => {
      mensagemContainer.classList.remove("opacity-100");
      mensagemContainer.classList.add("opacity-0", "pointer-events-none");
    }, 4000);
  };

  try {
    const response = await fetch(`http://localhost:8080/accounts/${clienteId}`);
    if (!response.ok) throw new Error("Erro ao buscar dados da conta");

    const data = await response.json();

    let dadosDestinatarioPix = null;

    bemVindo.textContent = data.name;

    // Função para animar transição suave
    const trocarConteudo = (html) => {
      section.classList.remove("show");
      setTimeout(() => {
        section.innerHTML = html;
        section.classList.add("show");
        adicionarListenersPix(data.saldo, data.id, data.accountNumber);
      }, 150);
    };

    // FUNÇÃO PARA ADICIONAR LISTENERS DE PIX (ATUALIZADA)
    const adicionarListenersPix = (saldoCliente, idOrigem, accountPayment) => {
      const cadastrarChavePix = document.getElementById("cadastrarChavePix");
      const blocoPixCadastra = document.getElementById("blocoCadastrarPix");
      const btnCadastrarPix = document.getElementById("btnCadastrarPix");
      const inputCadastraChavePix = document.getElementById(
        "inputCadastrarChavePix"
      );
      const btnFazerPix = document.getElementById("btnFazerPix");

      const blocoPixBusca = document.getElementById("blocoPixBusca");
      const btnProcurarPix = document.getElementById("btnProcurarPix");
      const inputChavePix = document.getElementById("inputChavePix");
      const blocoPixConfirmacaoValor = document.getElementById(
        "blocoPixConfirmacaoValor"
      );
      const btnRealizarPix = document.getElementById("btnRealizarPix");
      const inputValorPix = document.getElementById("inputValorPix");

      if (btnFazerPix && blocoPixBusca) {
        btnFazerPix.addEventListener("click", () => {
          blocoPixBusca.classList.remove("hidden");
          if (blocoPixConfirmacaoValor)
            blocoPixConfirmacaoValor.classList.add("hidden");
          dadosDestinatarioPix = null;

          // Oculta o bloco de Cadastro ao clicar em Fazer Pix
          if (blocoPixCadastra) {
            blocoPixCadastra.classList.add("hidden");
          }
        });
      }

      // 1. Mostrar o bloco de busca ao clicar em "Fazer Pix"
      if (btnFazerPix && blocoPixBusca) {
        btnFazerPix.addEventListener("click", () => {
          blocoPixBusca.classList.remove("hidden");
          if (blocoPixConfirmacaoValor)
            blocoPixConfirmacaoValor.classList.add("hidden");
          dadosDestinatarioPix = null;
        });
      }

      // 2. Lógica de procurar a chave e exibir a confirmação/valor
      if (btnProcurarPix && inputChavePix && blocoPixConfirmacaoValor) {
        btnProcurarPix.addEventListener("click", async () => {
          const chavePix = inputChavePix.value.trim();
          dadosDestinatarioPix = null;
          blocoPixConfirmacaoValor.classList.add("hidden");

          if (!chavePix) {
            mostrarMensagem("erro", "Por favor, digite a chave Pix.");
            return;
          }

          try {
            const response = await fetch(
              `http://localhost:8080/accounts/pix?pixKey=${chavePix}`
            );

            if (!response.ok) {
              mostrarMensagem(
                "erro",
                "Chave Pix não encontrada. Verifique e tente novamente."
              );
              return;
            }

            const data = await response.json();

            dadosDestinatarioPix = data;

            document.getElementById("nomeDestino").textContent = data.name;
            document.getElementById(
              "agenciaContaDestino"
            ).textContent = `Agência ${data.agencyNumber} | Conta ${data.accountNumber}`;

            blocoPixConfirmacaoValor.classList.remove("hidden");
            mostrarMensagem(
              "sucesso",
              `Destinatário: ${data.name} confirmado.`
            );
          } catch (error) {
            console.error("Erro ao buscar chave Pix:", error);
            mostrarMensagem("erro", "Erro de comunicação ao buscar a chave.");
          }
        });
      }

      // 3. Lógica final de Realizar Pix
      if (btnRealizarPix && inputValorPix) {
        btnRealizarPix.addEventListener("click", async () => {
          if (!dadosDestinatarioPix) {
            mostrarMensagem(
              "erro",
              "Destinatário Pix não encontrado ou não confirmado."
            );
            return;
          }

          const valorStr = inputValorPix.value.replace(",", ".");
          const valorPix = parseFloat(valorStr);

          if (isNaN(valorPix) || valorPix <= 0) {
            mostrarMensagem(
              "erro",
              "Por favor, digite um valor válido e positivo para a transferência."
            );
            return;
          }

          if (valorPix > parseFloat(saldoCliente)) {
            mostrarMensagem(
              "erro",
              "Saldo insuficiente para realizar a transferência."
            );
            return;
          }

          try {
            const transferData = {
              type: "Pix",
              method: "Saida",
              chave: dadosDestinatarioPix.pixKey,
              accountPayment: accountPayment,
              accountReceivable: dadosDestinatarioPix.accountNumber,
              value: valorPix,
              description: "Transferência Pix",
            };

            const transferResponse = await fetch(
              `http://localhost:8080/transactions`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(transferData),
              }
            );

            if (!transferResponse.ok) {
              const errorText = await transferResponse.text();
              const mensagemErro = errorText.includes("Erro")
                ? errorText
                : `Erro ao efetuar Pix: ${transferResponse.statusText}`;
              throw new Error(mensagemErro);
            }

            mostrarMensagem(
              "sucesso",
              `Pix de R$ ${valorPix
                .toFixed(2)
                .replace(".", ",")} enviado com sucesso para ${
                dadosDestinatarioPix.name
              }!`
            );

            // Recarrega a tela após um pequeno atraso para o usuário ler
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          } catch (error) {
            console.error("Erro na transação Pix:", error);
            mostrarMensagem(
              "erro",
              `Falha ao realizar o Pix: ${error.message}`
            );
          }
        });
      }

      //. Para aparecer o bloco de cadastrar chave Pix
      if (cadastrarChavePix && blocoPixCadastra) {
        cadastrarChavePix.addEventListener("click", () => {
          blocoPixCadastra.classList.remove("hidden");
        });
      }

      if (cadastrarChavePix && blocoPixCadastra) {
        cadastrarChavePix.addEventListener("click", () => {
          blocoPixCadastra.classList.remove("hidden");

          // Oculta o bloco de Busca/Transferência
          if (blocoPixBusca) {
            blocoPixBusca.classList.add("hidden"); // Ocultar o bloco de confirmação de valor caso estivesse visível
            if (blocoPixConfirmacaoValor) {
              blocoPixConfirmacaoValor.classList.add("hidden");
            }
          }
        });
      }

      if (btnCadastrarPix && inputCadastraChavePix) {
        btnCadastrarPix.addEventListener("click", async () => {
          const chavePixCadastrar = inputCadastraChavePix.value.trim();

          if (!chavePixCadastrar) {
            mostrarMensagem("erro", "Por favor, digite a chave Pix.");
            return;
          }

          try {
            const response = await fetch(
              `http://localhost:8080/accounts/${data.accountNumber}/pix`,
              {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pixKey: chavePixCadastrar }),
              }
            );

            if (!response.ok) {
              throw new Error("Erro ao cadastrar chave Pix");
            }

            mostrarMensagem(
              "sucesso",
              `Chave ${chavePixCadastrar} cadastrada com sucesso!`
            );

            // Recarrega a tela após um pequeno atraso para o usuário ler
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          } catch (error) {
            console.error("Erro ao cadastrar chave Pix:", error);
            mostrarMensagem(
              "erro",
              "Erro de comunicação ao cadastrar a chave Pix."
            );
          }
        });
      }
    };

    // Conteúdo inicial (Início) (MANTIDO IGUAL)

    trocarConteudo(`

            <div class="bg-white shadow-xl rounded-xl p-6 mb-6">

                <h2 class="text-xl font-bold mb-1">Conta Corrente</h2>

                <p class="text-gray-500 text-sm">Dinheiro disponível</p>

                <div class="text-4xl font-bold bradesco-red-text mt-2 flex items-center"><span>R$ ${Number(
                  data.saldo
                ).toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}</span></div>

            </div>



            <div class="bg-white shadow-xl rounded-xl p-6 border border-gray-100 mb-6">

           

            <h3 class="text-xl font-bold mb-4 text-gray-800 border-b pb-3 "></h3>

            <div class="space-y-6">

                <div>

                    <h4 class="text-base font-bold text-gray-700 mb-3">Sua Conta</h4>

                    <div class="grid grid-cols-2 gap-x-8 gap-y-4">

                        <div>

                            <p class="font-medium text-gray-500 text-sm">Agência</p>

                            <p class="font-bold text-gray-800">${
                              data.agencyNumber
                            }</p>

                        </div>

                       

                        <div>

                            <p class="font-medium text-gray-500 text-sm">Conta</p>

                            <p class="font-bold text-lg text-red-600">${
                              data.accountNumber
                            }</p>

                        </div>

                       

                    </div>

                </div>



                <div>

                    <h4 class="text-base font-bold text-gray-700 mb-3 pt-4 border-t">Dados Pessoais</h4>

                    <div class="grid grid-cols-2 gap-x-8 gap-y-4">

                       

                        <div>

                            <p class="font-medium text-gray-500 text-sm">Nome</p>

                            <p class="font-semibold text-gray-800">${
                              data.name
                            }</p>

                        </div>

                       

                        <div>

                            <p class="font-medium text-gray-500 text-sm">CPF</p>

                            <p class="font-semibold text-gray-800">${
                              data.cpf
                            }</p>

                        </div>

                       

                        <div>

                            <p class="font-medium text-gray-500 text-sm">Idade</p>

                            <p class="font-semibold text-gray-800">

                                ${Math.floor(
                                  (new Date() - new Date(data.dataNascimento)) /
                                    (1000 * 60 * 60 * 24 * 365.25)
                                )} anos

                            </p>

                        </div>

                       

                        <div>

                            <p class="font-medium text-gray-500 text-sm">Profissão</p>

                            <p class="font-semibold text-gray-800">${
                              data.profissao
                            }</p>

                        </div>

                    </div>

                </div>

               

                <div>

                    <h4 class="text-base font-bold text-gray-700 mb-3 pt-4 border-t">Dados de Contato</h4>

                    <div class="grid grid-cols-2 gap-x-8 gap-y-4">

                       

                        <div>

                            <p class="font-medium text-gray-500 text-sm">Email</p>

                            <p class="font-semibold text-gray-800">${
                              data.email
                            }</p>

                        </div>

                       

                        <div>

                            <p class="font-medium text-gray-500 text-sm">Telefone</p>

                            <p class="font-semibold text-gray-800">${
                              data.phoneNumber
                            }</p>

                        </div>

                    </div>

                </div>

               

                <div>

                    <h4 class="text-base font-bold text-gray-700 mb-3 pt-4 border-t">Informações Sobre Pix</h4>

                    <div class="grid grid-cols-2 gap-x-8 gap-y-4">

                       

                        <div>

                            <p class="font-medium text-gray-500 text-sm">Chave Pix</p>

                            <p class="font-bold text-green-600">${
                              data.pixKey
                            }</p>

                        </div>

                       

                        <div>

                            <p class="font-medium text-gray-500 text-sm">Limite Pix</p>

                            <p class="font-bold text-green-700">R$ ${Number(
                              data.limitePix.replace(".", "")
                            ).toLocaleString("pt-BR")}</p>

                        </div>

                    </div>

                </div>

               

            </div>

            </div>

        `);

    // Navegação dinâmica
    const menuItens = document.querySelectorAll("aside nav a");

    menuItens.forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        const id = item.id;

        // Reseta destaque
        menuItens.forEach((i) =>
          i.classList.remove("bg-red-100", "bradesco-red-text", "font-bold")
        );
        item.classList.add("bg-red-100", "bradesco-red-text", "font-bold");

        // MANTIDO IGUAL: Apenas o conteúdo muda
        switch (id) {
          case "inicio":
            trocarConteudo(`
                            <div class="bg-white shadow-xl rounded-xl p-6 mb-6">
                                <h2 class="text-xl font-bold mb-1">Conta Corrente</h2>
                                <p class="text-gray-500 text-sm">Dinheiro disponível</p>
                                <div class="text-4xl font-bold bradesco-red-text mt-2 flex items-center"><span>R$ ${Number(
                                  data.saldo
                                ).toLocaleString("pt-BR", {
                                  minimumFractionDigits: 2,
                                })}</span></div>
                            </div>
                            
                            <div class="bg-white shadow-xl rounded-xl p-6 border border-gray-100 mb-6">
                            
                            <h3 class="text-xl font-bold mb-4 text-gray-800 border-b pb-3 "></h3>
                            <div class="space-y-6">
                                <div>
                                    <h4 class="text-base font-bold text-gray-700 mb-3">Sua Conta</h4>
                                    <div class="grid grid-cols-2 gap-x-8 gap-y-4">
                                        <div>
                                            <p class="font-medium text-gray-500 text-sm">Agência</p>
                                            <p class="font-bold text-gray-800">${
                                              data.agencyNumber
                                            }</p>
                                        </div>
                                        
                                        <div>
                                            <p class="font-medium text-gray-500 text-sm">Conta</p>
                                            <p class="font-bold text-lg text-red-600">${
                                              data.accountNumber
                                            }</p>
                                        </div>
                                        
                                    </div>
                                </div>

                                <div>
                                    <h4 class="text-base font-bold text-gray-700 mb-3 pt-4 border-t">Dados Pessoais</h4>
                                    <div class="grid grid-cols-2 gap-x-8 gap-y-4">
                                        
                                        <div>
                                            <p class="font-medium text-gray-500 text-sm">Nome</p>
                                            <p class="font-semibold text-gray-800">${
                                              data.name
                                            }</p>
                                        </div>
                                        
                                        <div>
                                            <p class="font-medium text-gray-500 text-sm">CPF</p>
                                            <p class="font-semibold text-gray-800">${
                                              data.cpf
                                            }</p>
                                        </div>
                                        
                                        <div>
                                            <p class="font-medium text-gray-500 text-sm">Idade</p>
                                            <p class="font-semibold text-gray-800">
                                                ${Math.floor(
                                                  (new Date() -
                                                    new Date(
                                                      data.dataNascimento
                                                    )) /
                                                    (1000 *
                                                      60 *
                                                      60 *
                                                      24 *
                                                      365.25)
                                                )} anos
                                            </p>
                                        </div>
                                        
                                        <div>
                                            <p class="font-medium text-gray-500 text-sm">Profissão</p>
                                            <p class="font-semibold text-gray-800">${
                                              data.profissao
                                            }</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div>
                                    <h4 class="text-base font-bold text-gray-700 mb-3 pt-4 border-t">Dados de Contato</h4>
                                    <div class="grid grid-cols-2 gap-x-8 gap-y-4">
                                        
                                        <div>
                                            <p class="font-medium text-gray-500 text-sm">Email</p>
                                            <p class="font-semibold text-gray-800">${
                                              data.email
                                            }</p>
                                        </div>
                                        
                                        <div>
                                            <p class="font-medium text-gray-500 text-sm">Telefone</p>
                                            <p class="font-semibold text-gray-800">${
                                              data.phoneNumber
                                            }</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div>
                                    <h4 class="text-base font-bold text-gray-700 mb-3 pt-4 border-t">Informações Sobre Pix</h4>
                                    <div class="grid grid-cols-2 gap-x-8 gap-y-4">
                                        
                                        <div>
                                            <p class="font-medium text-gray-500 text-sm">Chave Pix</p>
                                            <p class="font-bold text-green-600">${
                                              data.pixKey
                                            }</p>
                                        </div>
                                        
                                        <div>
                                            <p class="font-medium text-gray-500 text-sm">Limite Pix</p>
                                            <p class="font-bold text-green-700">R$ ${Number(
                                              data.limitePix.replace(".", "")
                                            ).toLocaleString("pt-BR")}</p>
                                        </div>
                                    </div>
                                </div>
                                
                            </div>
                            </div>
                        `);
            break;

          case "saldosExtratos":
            trocarConteudo(`
                            <div class="bg-white shadow-xl rounded-xl p-20">
                                <h2 class="text-xl font-bold mb-3">Saldos e Extratos</h2>
                                <p class="text-gray-600">Saldo atual: <strong>R$ ${Number(
                                  data.saldo
                                ).toLocaleString("pt-BR", {
                                  minimumFractionDigits: 2,
                                })}</strong></p>
                                <p class="text-gray-600 mt-2">Última atualização: ${new Date().toLocaleDateString(
                                  "pt-BR"
                                )}</p>
                            </div>
                        `);
            break;

          case "transferenciasPix":
            trocarConteudo(`
                            <div class="bg-white shadow-xl rounded-xl p-6 mb-6">
                            <h2 class="text-xl font-bold mb-1">Conta Corrente</h2>
                            <p class="text-gray-500 text-sm">Dinheiro disponível</p>
                            <div class="text-4xl font-bold bradesco-red-text mt-2 flex items-center"><span>R$ ${Number(
                              data.saldo
                            ).toLocaleString("pt-BR", {
                              minimumFractionDigits: 2,
                            })}</span></div>
                            </div>
                            
                            <div class="bg-white shadow-xl rounded-xl p-6 border border-gray-100 mb-6">
                                
                                <h4 class="text-base font-bold text-gray-700 mb-3">Informações Sobre Pix</h4>
                                <div class="grid grid-cols-2 gap-x-8 gap-y-4 border-b pb-4">
                                    <div>
                                        <p class="font-medium text-gray-500 text-sm">Chave Pix</p>
                                        <p class="font-bold text-green-600">${
                                          data.pixKey
                                        }</p>
                                    </div>
                                
                                    <div>
                                        <p class="font-medium text-gray-500 text-sm">Limite Pix</p>
                                        <p class="font-bold text-green-700">R$ ${Number(
                                          data.limitePix.replace(".", "")
                                        ).toLocaleString("pt-BR")}</p>
                                    </div>
                                </div>

                                <div class="flex mt-6 gap-5"> 
                                    <button id="btnFazerPix" class="bradesco-red text-white px-10 py-3 rounded-lg shadow-md bradesco-red-hover transition">
                                        Fazer Pix
                                    </button>
                                    <button id="cadastrarChavePix" class="bradesco-red text-white px-10 py-3 rounded-lg shadow-md bradesco-red-hover transition">
                                        Cadastrar Chave Pix
                                    </button>
                                </div>
                            </div>

                            <div id="blocoCadastrarPix" class="bg-white shadow-xl rounded-xl p-6 border border-gray-100 mt-6 hidden mb-6">
                                <h4 class="text-base font-bold text-gray-700 mb-4">Qual Chave Você Quer Cadastrar?</h4>
                                
                                <label for="inputCadastrarChavePix" class="block text-gray-500 text-sm mb-2">Chave Pix (CPF, CNPJ, Email ou Telefone)</label>
                                <div class="flex space-x-3">
                                    <input type="text" id="inputCadastrarChavePix" placeholder="Digite a chave Pix" class="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600">
                                    <button id="btnCadastrarPix" class="bradesco-red text-white px-6 py-3 rounded-lg shadow-md bradesco-red-hover transition">
                                        Cadastrar 
                                    </button>
                                </div>
                              </div>
                            
                            <div id="blocoPixBusca" class="bg-white shadow-xl rounded-xl p-6 border border-gray-100 mt-6 hidden mb-6">
                                <h4 class="text-base font-bold text-gray-700 mb-4">Para quem você quer enviar?</h4>
                                
                                <label for="inputChavePix" class="block text-gray-500 text-sm mb-2">Chave Pix (CPF, CNPJ, Email ou Telefone)</label>
                                <div class="flex space-x-3">
                                    <input type="text" id="inputChavePix" placeholder="Digite a chave Pix" class="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600">
                                    <button id="btnProcurarPix" class="bradesco-red text-white px-6 py-3 rounded-lg shadow-md bradesco-red-hover transition">
                                        Procurar
                                    </button>
                                </div>
                                
                                <div id="blocoPixConfirmacaoValor" class="grid grid-cols-1 gap-x-8 gap-y-4 mt-6 hidden p-4 border rounded-lg bg-gray-50"> 
                                    
                                    <h4 class="text-base font-bold text-gray-700 mb-2">Destinatário:</h4>
                                    <div class="border-b pb-3 mb-3">
                                        <p class="font-medium text-gray-500 text-sm">Nome:</p>
                                        <p id="nomeDestino" class="font-bold text-green-700 text-lg">...</p> 
                                        <p class="font-medium text-gray-500 text-sm mt-1">Agência e Conta:</p>
                                        <p id="agenciaContaDestino" class="font-semibold text-gray-800">...</p> 
                                    </div>

                                    <h4 class="text-base font-bold text-gray-700 mb-2">Qual o valor do Pix?</h4>
                                    
                                    <label for="inputValorPix" class="block text-gray-500 text-sm mb-2">Valor (R$)</label>
                                    <input type="text" id="inputValorPix" placeholder="Ex: 150,50" class="p-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-red-600">
                                    
                                    <div class="mt-4">
                                        <button id="btnRealizarPix" class="bradesco-red text-white px-6 py-3 rounded-lg shadow-md bradesco-red-hover transition w-full text-lg">
                                            Realizar Pix
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `);
            break;

          case "financiamentos":
            trocarConteudo(`
                            <div class="bg-white shadow-xl rounded-xl p-20">
                                <h2 class="text-xl font-bold mb-3">Financiamentos</h2>
                                <p class="text-gray-600">Nenhum financiamento ativo no momento.</p>
                            </div>
                        `);
            break;

          case "emprestimos":
            trocarConteudo(`
                            <div class="bg-white shadow-xl rounded-xl p-20">
                                <h2 class="text-xl font-bold mb-3">Empréstimos</h2>
                                <p class="text-gray-600">Nenhum Empréstimo ativo no momento.</p>
                                <button class="bradesco-red text-white px-6 py-3 rounded-lg shadow-md bradesco-red-hover transition mt-3">Solicitar agora</button>
                            </div>
                        `);
            break;
        }
      });
    });
  } catch (error) {
    console.error(error);
    bemVindo.textContent = "Erro ao carregar dados da conta.";
    mostrarMensagem(
      "erro",
      "Erro ao carregar dados da conta. Tente novamente mais tarde."
    ); 
  }
});
