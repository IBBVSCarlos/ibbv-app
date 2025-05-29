// script.js
// funçao para o header - semana atual
function definirSemanaReferencia() {
  const hoje = new Date();
  const diaSemana = hoje.getDay(); // 0 = Domingo, 6 = Sábado


  // Efeito de luz no logo do header 
document.addEventListener("DOMContentLoaded", () => {
  if (!localStorage.getItem("logoEffectShown")) {
    const light = document.querySelector(".light-effect");

    // Aplica a animação apenas uma vez
    light.style.animation = "moveLight 2s linear forwards";

    light.addEventListener("animationend", () => {
      setTimeout(() => {
        light.remove(); // Remove o efeito após executar
      }, 500);
    });

    // Salva no localStorage para não repetir na próxima vez
    localStorage.setItem("logoEffectShown", "true");
  }
});



  // scrool na area visivel
window.addEventListener("load", () => {
  const sections = document.querySelectorAll(".section-box");

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    } else {
      entry.target.classList.remove("show");
    }
  });
}, { threshold: 0.05 }); // Agora ativa quando apenas 5% do container estiver visível

sections.forEach((section) => observer.observe(section));

});


  // Último domingo
  const domingo = new Date(hoje);
  domingo.setDate(hoje.getDate() - diaSemana);
  
  // Próximo sábado
  const sabado = new Date(domingo);
  sabado.setDate(domingo.getDate() + 6);

  // Pegando o dia e o mês
  const diaInicio = domingo.getDate();
  const mesInicio = domingo.toLocaleDateString('pt-BR', { month: 'long' });
  const diaFim = sabado.getDate();
  const mesFim = sabado.toLocaleDateString('pt-BR', { month: 'long' });

  // Se ambos os dias estão no mesmo mês, não repete o nome
  const periodo = mesInicio === mesFim 
    ? `Semana de ${diaInicio} a ${diaFim} de ${mesInicio}`
    : `Semana de ${diaInicio} de ${mesInicio} a ${diaFim} de ${mesFim}`;

  document.getElementById("semana-referencia").textContent = periodo;
}

// Chamando a função quando a página carrega
document.addEventListener("DOMContentLoaded", definirSemanaReferencia);

//versiculo do dia
// tras o versiculo do dia
async function carregarVersiculoDoDia() {
  try {
    const res = await fetch('data/versiculos.json');
    const versiculos = await res.json();

    const hoje = new Date().toISOString().slice(0, 10);
    const versiculoHoje = versiculos.find(v => v.data === hoje);

    const container = document.getElementById('versiculo-conteudo'); // Corrigido!
    if (!container) return;

    if (versiculoHoje) {
      container.innerHTML = `
        <h2>Versículo do Dia</h2>
        <p>"${versiculoHoje.texto}" <strong>(${versiculoHoje.referencia})</strong></p>
        <small>${versiculoHoje.comentario}</small>
      `;
    } else {
      container.innerHTML = '<h2>Versículo do Dia</h2><p>Versículo não encontrado.</p>';
    }
  } catch (error) {
    console.error("Erro ao carregar versículo:", error);
  }
}


// Função para formatar a data no formato "dd/mm"
function formatDate(date) {
  const d = date.getDate().toString().padStart(2, '0');
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${d}/${m}`;
}

// Função para obter os aniversariantes da semana
async function carregarAniversariantesSemana() {
  try {
    const res = await fetch('data/aniversariantes.json');
    const aniversariantes = await res.json();

    const hoje = new Date();
    const diaSemana = hoje.getDay();
    
    const inicioSemana = new Date(hoje);
    inicioSemana.setDate(hoje.getDate() - diaSemana);

    const fimSemana = new Date(inicioSemana);
    fimSemana.setDate(inicioSemana.getDate() + 6);

    const lista = document.getElementById("lista-aniversariantes");
    if (!lista) return;

const aniversariantesSemana = aniversariantes.filter(item => {
  const [dia, mes] = item.data.split('/').map(Number);
  const dataAniv = new Date(hoje.getFullYear(), mes - 1, dia);
  return dataAniv >= inicioSemana && dataAniv <= fimSemana;
});

    // Array com emojis Unicode aleatórios
    const emojis = ["🎉", "🎂", "🥳", "🎊", "🍰", "🎈", "✨", "😃"];

    lista.innerHTML = aniversariantesSemana.length
      ? aniversariantesSemana.map(p => {
          const [dia, mes] = p.data.split('/').map(Number);
          const dataAniv = new Date(hoje.getFullYear(), mes - 1, dia);
          const hojeTexto = (dataAniv.getDate() === hoje.getDate() &&
                             dataAniv.getMonth() === hoje.getMonth() &&
                             dataAniv.getFullYear() === hoje.getFullYear()) 
            ? " <strong>(hoje!)</strong>" 
            : "";
          
          // Escolhe um emoji aleatório
          const emojiAleatorio = emojis[Math.floor(Math.random() * emojis.length)];

          return `<li>${emojiAleatorio} ${p.nome}${hojeTexto}</li>`;
        }).join('')
      : '<li>Nenhum aniversariante nesta semana.</li>';
  } catch (error) {
    console.error("Erro ao carregar aniversariantes:", error);
  }
}

// Função para carregar a Escala de Ministérios
async function carregarEscalaMinisterios() {
  try {
    const res = await fetch('data/escalamin.json');
    if (!res.ok) throw new Error("Erro ao carregar JSON");

    const escala = await res.json();

    const listaEscala = document.getElementById("lista-escala");
    if (!listaEscala) return;

    listaEscala.innerHTML = escala.length 
      ? escala.map(ministerio => 
          `<li><strong>${ministerio.ministerio}</strong>
            <ul>
              ${ministerio.escalados.map(pessoa => 
                `<li>${pessoa.dia}: ${pessoa.nome}</li>`
              ).join('')}
            </ul>
          </li>`
        ).join('')
      : '<li>Nenhuma escala disponível no momento.</li>';

  } catch (error) {
    console.error("Erro ao carregar escala de ministérios:", error);
    document.getElementById("lista-escala").innerHTML = '<li>Erro ao carregar escala.</li>';
  }
}

document.addEventListener("DOMContentLoaded", carregarEscalaMinisterios);

// Avisos IBBV
function carregarAvisos() {
  fetch('data/avisosibbv.json')
    .then(response => response.json())
    .then(data => {
      const listaAvisos = document.getElementById('lista-avisos');

      if (!listaAvisos || !data.avisos?.length) {
        console.warn("Nenhum aviso encontrado.");
        return;
      }

      listaAvisos.innerHTML = ""; // Limpa avisos anteriores

      data.avisos.forEach(aviso => {
        const li = document.createElement('li');
        li.classList.add('aviso-item');

        const texto = document.createElement('p');
        texto.textContent = aviso.texto; // 🚀 Corrigido: agora exibe apenas o texto do aviso
        li.appendChild(texto);

        if (aviso.imagem) {
          const img = document.createElement('img');
          img.src = `img/${aviso.imagem}`; // Ajustado para a nova pasta
          img.alt = "Imagem do aviso";
          img.classList.add('aviso-img');
          li.appendChild(img);
        }

        listaAvisos.appendChild(li);
      });
    })
    .catch(error => {
      console.error('Erro ao carregar os avisos:', error);
    });
}

// Chamar a função ao carregar a página
document.addEventListener("DOMContentLoaded", carregarAvisos);


// Função para carregar a Coluna do Pastor com historico
async function carregarColunaPastorTXT() {
  try {
    const res = await fetch('data/coluna_pastor.txt');
    if (!res.ok) throw new Error("Erro ao carregar o arquivo TXT");

    const texto = await res.text();
    const colunas = [];

    // Separar cada artigo usando "---" e aplicar sanitização
    const blocos = texto.split("---").map(bloco => bloco.trim());

    blocos.forEach((bloco, index) => {
      const linhas = bloco.split("\n").map(linha => sanitizarTexto(linha.trim())).filter(linha => linha);

      if (linhas.length < 2) return; // Ignorar blocos inválidos

      colunas.push({
        id: index + 1,
        titulo: linhas[0], // Título
        mensagem: linhas.slice(1, -1), // Parágrafos
        assinatura: linhas[linhas.length - 1] // Assinatura
      });
    });

    // Exibir no site
    exibirColunaPastor(colunas);

  } catch (error) {
    console.error("Erro ao carregar Coluna do Pastor:", error);
  }
}

function exibirColunaPastor(colunas) {
  if (!colunas.length) {
    document.getElementById("coluna-pastor").innerHTML = "<p>Nenhum conteúdo disponível.</p>";
    return;
  }

  let indiceAtual = 0;
  const titulo = document.querySelector('#coluna-pastor h2');
  const mensagemDiv = document.getElementById('mensagem-pastor');

  if (!titulo || !mensagemDiv) {
    console.error("Elementos da Coluna do Pastor não encontrados.");
    return;
  }

  function atualizarColuna() {
    titulo.textContent = colunas[indiceAtual].titulo;
    mensagemDiv.innerHTML = colunas[indiceAtual].mensagem.map(p => `<p>${p}</p>`).join('') + `<p class="assinatura">${colunas[indiceAtual].assinatura}</p>`;
  }

  atualizarColuna(); // Mostrar o primeiro artigo

  // Verificação antes de adicionar eventos aos botões
  const btnAnterior = document.getElementById("btnAnterior");
  const btnProximo = document.getElementById("btnProximo");

  if (btnAnterior) {
    btnAnterior.addEventListener("click", () => {
      if (indiceAtual > 0) {
        indiceAtual--;
        atualizarColuna();
      }
    });
  }

  if (btnProximo) {
    btnProximo.addEventListener("click", () => {
      if (indiceAtual < colunas.length - 1) {
        indiceAtual++;
        atualizarColuna();
      }
    });
  }
}

// Chamando a função ao carregar a página
document.addEventListener("DOMContentLoaded", carregarColunaPastorTXT);


  // Função para o pix
function copiarPix() {
    const chavePix = "57722761000174";
    navigator.clipboard.writeText(chavePix).then(() => {
        const mensagemPix = document.createElement("p");
        mensagemPix.style.color = "#006600";
        mensagemPix.style.fontWeight = "bold";
        mensagemPix.textContent = "Chave Pix copiada!";
        
        const pixLink = document.querySelector(".pix-link");
        pixLink.appendChild(mensagemPix); // Adiciona mensagem temporária
        
        setTimeout(() => mensagemPix.classList.add("fade-out"), 2000);
        setTimeout(() => mensagemPix.remove(), 2500);
 
    }).catch(() => {
        alert("Erro ao copiar. Copie manualmente: " + chavePix);
    });
}

// Chama as funções quando o DOM for carregado
document.addEventListener('DOMContentLoaded', async () => {
  try {
    await carregarVersiculoDoDia();
    await carregarAniversariantesSemana();
/*    await loadColunaPastor(); -- Já está chamado no coluna_pastor.js */
  } catch (error) {
    console.error("Erro ao carregar o conteúdo:", error);
  }
});
