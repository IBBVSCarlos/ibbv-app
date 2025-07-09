// =====================================
// 🚀 PWA - Service Worker e Notificações
// =====================================
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./service-worker.js")
    .then(() => console.log("✅ Service Worker registrado com sucesso!"))
    .catch(error => console.log("⚠️ Erro ao registrar Service Worker:", error));
}

function solicitarPermissaoNotificacao() {
  if ("Notification" in window && "serviceWorker" in navigator) {
    Notification.requestPermission().then(permission => {
      console.log(permission === "granted" ? "✅ Permissão concedida!" : "⚠️ Permissão negada pelo usuário.");
    });
  }
}
document.addEventListener("DOMContentLoaded", solicitarPermissaoNotificacao);

// =====================================
// 🎨 Header - Logo & Semana Referência
// =====================================

// Garantindo execução após o carregamento do DOM
document.addEventListener("DOMContentLoaded", () => {
  const semanaReferenciaElemento = document.getElementById("semana-referencia");

  if (semanaReferenciaElemento) {
    definirSemanaReferencia();
  } else {
    console.warn("⚠️ Elemento #semana-referencia não encontrado!");
  }
});

// Função para definir a Semana Referência
function definirSemanaReferencia() {
  const hoje = new Date();
  const diaSemana = hoje.getDay();

  // Definir início e fim da semana corretamente
  const inicioSemana = new Date(hoje);
  inicioSemana.setDate(hoje.getDate() - (diaSemana === 0 ? 6 : diaSemana - 1));

  const fimSemana = new Date(inicioSemana);
  fimSemana.setDate(inicioSemana.getDate() + 6);

  // Obter os nomes dos meses
  const opcoesDiaMes = { day: "2-digit", month: "long" };
  const inicioFormatado = inicioSemana.toLocaleDateString("pt-BR", opcoesDiaMes);
  const fimFormatado = fimSemana.toLocaleDateString("pt-BR", opcoesDiaMes);
  const mesInicio = inicioSemana.toLocaleDateString("pt-BR", { month: "long" });
  const mesFim = fimSemana.toLocaleDateString("pt-BR", { month: "long" });

  // Ajuste na exibição do nome do mês
  const semanaTexto = mesInicio === mesFim
    ? `${inicioSemana.getDate()} a ${fimSemana.getDate()} de ${mesInicio}`
    : `${inicioFormatado} a ${fimFormatado}`;

  // Atualizar conteúdo no elemento
  const semanaReferenciaElemento = document.getElementById("semana-referencia");
  if (semanaReferenciaElemento) {
    semanaReferenciaElemento.textContent = semanaTexto;
    console.log("✅ Semana referência ajustada:", semanaTexto);
  } else {
    console.warn("⚠️ Elemento #semana-referencia não encontrado!");
  }
}


// =====================================
// 🔥 Efeito de luz no logo do header
// =====================================
document.addEventListener("DOMContentLoaded", () => {
  if (!localStorage.getItem("logoEffectShown")) {
    const light = document.querySelector(".light-effect");

    if (light) {
      light.style.animation = "moveLight 2s linear forwards";
      light.addEventListener("animationend", () => setTimeout(() => light.remove(), 500));
      localStorage.setItem("logoEffectShown", "true");
    } else {
      console.warn("⚠️ Elemento .light-effect não encontrado!");
    }
  }
});

// =====================================
// 🔄 Scroll - Exibição dinâmica das seções
// =====================================
window.addEventListener("load", () => {
  const sections = document.querySelectorAll(".section-box");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.target.classList.toggle("show", entry.isIntersecting));
  }, { threshold: 0.05 });

  sections.forEach(section => observer.observe(section));
});

// =====================================
// 🎉 Aniversariantes da Semana
// =====================================
async function carregarAniversariantesSemana() {
  try {
    const res = await fetch('data/aniversariantes.json');
    const aniversariantes = await res.json();
    const hoje = new Date();
    const inicioSemana = new Date(hoje);
    inicioSemana.setDate(hoje.getDate() - hoje.getDay());
    const fimSemana = new Date(inicioSemana);
    fimSemana.setDate(inicioSemana.getDate() + 7);
    const emojis = ["🎉", "🎂", "🥳", "🎊", "🍰", "🎈", "✨", "😃"];

    const aniversariantesSemana = aniversariantes.filter(({ data }) => {
      const [dia, mes] = data.split('/').map(Number);
      const dataAniv = new Date(hoje.getFullYear(), mes - 1, dia);
      return dataAniv >= inicioSemana && dataAniv <= fimSemana;
    });

    document.getElementById("lista-aniversariantes").innerHTML = aniversariantesSemana.length
      ? aniversariantesSemana.map(p => {
          const hojeTexto = new Date().toLocaleDateString("pt-BR") === p.data ? " <strong>(hoje!)</strong>" : "";
          return `<li>${emojis[Math.floor(Math.random() * emojis.length)]} ${p.nome}${hojeTexto}</li>`;
        }).join("")
      : '<li>Nenhum aniversariante nesta semana.</li>';
  } catch (error) {
    console.error("Erro ao carregar aniversariantes:", error);
  }
}
document.addEventListener("DOMContentLoaded", carregarAniversariantesSemana);


// =====================================
// 📢 Avisos IBBV (com expiração dinâmica via executaEm) AJUSTADO
// =====================================
function carregarAvisos() {
  fetch('data/avisosibbv.json')
    .then(res => res.json())
    .then(({ avisos }) => {
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);

      const listaAvisos = document.getElementById('lista-avisos');

      const avisosValidos = avisos
        .filter(aviso => {
          const [ano, mes, dia] = aviso.executaEm.split('-').map(Number);

          const executa = new Date(ano, mes - 1, dia, 0, 0, 0, 0);
          const expira = new Date(ano, mes - 1, dia, 23, 59, 59, 999);

          const limitePublicacao = new Date(ano, mes - 1, dia - 7, 0, 0, 0, 0);

          return hoje >= limitePublicacao && hoje <= expira;
        })
        .sort((a, b) => new Date(a.executaEm) - new Date(b.executaEm));

      listaAvisos.innerHTML = avisosValidos.length
        ? avisosValidos.map(({ texto, imagem, linkAgenda, executaEm }, index) => {
            const idContador = `contador-${index}`;

            // Caminho exibido (prévia) e caminho real (sem 'a')
            const imagemPreview = imagem; // já vem como 'data/avisos/aXYZ.png'
            const imagemReal = imagem ? imagem.replace(/^.*\/a/, 'img/') : '';

            return `
              <li class="aviso-item">
                <p class="aviso-texto">${texto.replace(' - ', '<br>').replace(' - ', ' - ')}</p>
                ${imagem ? `<img src="${imagemPreview}" alt="${texto}" class="aviso-img" onclick="ampliarImagem('${imagemReal}')">` : ''}
                <div class="aviso-contador" id="${idContador}">⏳ Carregando...</div>
                <div class="aviso-botoes">
                  ${imagem ? `
                  <a href="${imagemReal}" download class="btn-aviso" title="Baixar imagem">
                    📥 Baixar
                  </a>` : ''}
                  ${linkAgenda && linkAgenda.trim() !== "" ? `
                  <a href="${linkAgenda}" target="_blank" class="btn-aviso" title="Abrir agenda">
                    📅 Agendar
                  </a>` : ''}
                </div>
              </li>
            `;
          }).join("")
        : '<li>Nenhum aviso disponível.</li>';

      avisosValidos.forEach((aviso, index) => iniciarContador(aviso.executaEm, `contador-${index}`));

      const ultimosAvisos = JSON.stringify(avisosValidos.map(a => a.texto));
      const anteriores = localStorage.getItem('avisos-vistos');

      if (anteriores && ultimosAvisos !== anteriores) {
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("📣 Novos avisos disponíveis no IBBV!");
        }

        if ("vibrate" in navigator) {
          navigator.vibrate(200);
        }
      }

      localStorage.setItem('avisos-vistos', ultimosAvisos);
    })
    .catch(err => console.error('Erro ao carregar avisos:', err));
}

// =====================================
// ⏳ Contador regressivo
// =====================================
function iniciarContador(dataEvento, elementoId) {
  const alvo = new Date(dataEvento + 'T00:00:00');

  function atualizar() {
    const agora = new Date();
    const distancia = alvo - agora;
    const el = document.getElementById(elementoId);
    if (!el) return;

    if (distancia <= 0) {
      el.textContent = '🎉 É Hoje!!';
      el.removeAttribute('data-status');
      return;
    }

    const dias = Math.floor(distancia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((distancia % (1000 * 60)) / 1000);

    el.textContent = `⏳ Faltam ${dias}d ${horas}h ${minutos}m ${segundos}s`;

    if (dias <= 1) {
      el.setAttribute('data-status', 'urgente');
    } else if (dias <= 3) {
      el.setAttribute('data-status', 'moderado');
    } else {
      el.setAttribute('data-status', 'leve');
    }

    setTimeout(atualizar, 1000);
  }

  atualizar();
}

// =====================================
// ▶️ Início
// =====================================
document.addEventListener("DOMContentLoaded", () => {
  carregarAvisos();

  if ("Notification" in window && Notification.permission !== "granted") {
    Notification.requestPermission();
  }
});

// =====================================
// 🔍 Ampliar imagem
// =====================================
function ampliarImagem(src) {
  const modal = document.createElement('div');
  modal.className = 'imagem-modal';
  modal.innerHTML = `
    <div class="imagem-modal-conteudo">
      <span class="imagem-modal-fechar" onclick="this.parentElement.parentElement.remove()">✖</span>
      <img src="${src}" alt="Aviso ampliado">
    </div>
  `;
  document.body.appendChild(modal);
}

// =====================================
// CAMPANHAS IBBV
// =====================================

function carregarCampanhas() {
  fetch('data/campanhasibbv.json')
    .then(res => res.json())
    .then(({ campanhas }) => {
      const listaCampanhas = document.getElementById('lista-campanhas');

      window.listaCampanhasIBBV = campanhas; // Guarda globalmente

      listaCampanhas.innerHTML = campanhas.length
        ? campanhas.map(({ texto, imagem, linkAgenda }, index) => {
            const imagemPreview = imagem;
            const imagemReal = imagem ? imagem.replace(/^.*\/c/, 'img/') : '';

            return `
              <li class="aviso-item">
                <p class="aviso-texto">${texto.replace(' - ', '<br>').replace(' - ', ' - ')}</p>
                ${imagem ? `<img src="${imagemPreview}" alt="${texto}" class="aviso-img" onclick="abrirModalCampanha(${index})">` : ''}
                <div class="aviso-botoes">
                  ${imagem ? `
                  <a href="${imagemReal}" download class="btn-aviso" title="Baixar imagem">
                    📥 Baixar
                  </a>` : ''}
                  ${linkAgenda && linkAgenda.trim() !== "" ? `
                  <a href="${linkAgenda}" target="_blank" class="btn-aviso" title="Abrir agenda">
                    📅 Agendar
                  </a>` : ''}
                </div>
              </li>
            `;
          }).join("")
        : '<li>Nenhuma campanha no momento.</li>';
    })
    .catch(err => console.error('Erro ao carregar campanhas:', err));
}

function abrirModalCampanha(index) {
  const campanha = window.listaCampanhasIBBV[index];
  const modal = document.getElementById('modal-campanha');

  modal.querySelector('.modal-imagem').src = campanha.imagem;
  modal.querySelector('.modal-imagem').alt = campanha.texto;
  modal.querySelector('.modal-titulo').textContent = campanha.texto;
  modal.querySelector('.modal-descricao').textContent = campanha.descricao || "Nenhuma descrição disponível.";

  modal.classList.add('aberto');
}

document.addEventListener("DOMContentLoaded", carregarCampanhas);
