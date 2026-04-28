(function(){
  const current = location.pathname.split('/').pop() || 'index.html';
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-nav]').forEach(a => {
      const href = a.getAttribute('href');
      if (!href) return;
      const file = href.split('/').pop() || 'index.html';
      if (file === current) a.classList.add('active');
    });

    const modal = document.getElementById('configModal');
    const openers = document.querySelectorAll('[data-open-config]');
    const close = document.querySelector('[data-close-config]');
    const input = document.getElementById('backendUrlInput');
    const save = document.getElementById('saveBackendUrl');
    const clear = document.getElementById('clearBackendUrl');
    const status = document.getElementById('configStatus');

    function getBackendUrl(){
      return localStorage.getItem('ENEM_BACKEND_URL') || window.ENEM_CONFIG?.BACKEND_URL || '';
    }
    window.getBackendUrl = getBackendUrl;

    openers.forEach(btn => btn.addEventListener('click', () => {
      if (!modal) return;
      if (input) input.value = getBackendUrl();
      if (status) status.textContent = '';
      modal.showModal();
    }));
    if (close) close.addEventListener('click', () => modal?.close());
    if (save) save.addEventListener('click', () => {
      const value = (input?.value || '').trim().replace(/\/$/, '');
      if (!value) {
        status.textContent = 'Cole o link do Render antes de salvar.';
        status.className = 'alert danger small';
        return;
      }
      localStorage.setItem('ENEM_BACKEND_URL', value);
      status.textContent = 'Link salvo neste navegador.';
      status.className = 'alert success small';
    });
    if (clear) clear.addEventListener('click', () => {
      localStorage.removeItem('ENEM_BACKEND_URL');
      if (input) input.value = window.ENEM_CONFIG?.BACKEND_URL || '';
      if (status) {
        status.textContent = 'Configuração local apagada.';
        status.className = 'alert info small';
      }
    });
  });
})();

function normalizeText(text){
  return String(text || '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function stripHtml(html){
  const div = document.createElement('div');
  div.innerHTML = html || '';
  return div.textContent || div.innerText || '';
}

function escapeHtml(str){
  return String(str ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function shuffle(array){
  const arr = [...array];
  for(let i = arr.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function headerHtml(){
  return `
  <header class="topbar">
    <div class="container nav">
      <a class="logo" href="./index.html" aria-label="Início">
        <span class="logo-mark">EN</span>
        <span>Questões ENEM<small>Banco de treino com IA</small></span>
      </a>
      <nav class="nav-links" aria-label="Menu principal">
        <a data-nav href="./index.html">Início</a>
        <a data-nav href="./materias.html">Matérias</a>
        <a data-nav href="./gerar.html">Gerar lista</a>
        <a data-nav href="./questoes.html">Questões</a>
        <a data-nav href="./sobre.html">Sobre</a>
        <button class="ghost-btn" data-open-config type="button">Configurar IA</button>
      </nav>
    </div>
  </header>`;
}

function footerHtml(){
  return `
  <footer class="footer">
    <div class="container footer-grid">
      <div>
        <strong>Questões ENEM</strong>
        <p class="small">Site estático para GitHub Pages + backend no Render + Gemini.</p>
      </div>
      <div class="small">Fonte das questões: banco local curado em data/banco-questoes.json. Conferência oficial: provas e gabaritos do Inep.</div>
    </div>
  </footer>`;
}

function configModalHtml(){
  return `
  <dialog class="modal" id="configModal">
    <div class="modal-inner">
      <div class="modal-header">
        <div>
          <h2>Configurar IA</h2>
          <p class="muted">Cole aqui o link do backend publicado no Render. Exemplo: https://back-enem.onrender.com</p>
        </div>
        <button class="x" type="button" data-close-config>×</button>
      </div>
      <div class="field">
        <label for="backendUrlInput">Link do Render</label>
        <input id="backendUrlInput" placeholder="https://seu-backend.onrender.com" />
      </div>
      <div class="form-footer">
        <div class="actions">
          <button class="btn" id="saveBackendUrl" type="button">Salvar link</button>
          <button class="btn secondary" id="clearBackendUrl" type="button">Limpar</button>
        </div>
      </div>
      <p id="configStatus" class="small"></p>
      <p class="source-note">A chave do Gemini fica no Render como variável de ambiente. Não coloque chave de API no GitHub Pages.</p>
    </div>
  </dialog>`;
}

function mountLayout(){
  const appHeader = document.getElementById('appHeader');
  const appFooter = document.getElementById('appFooter');
  const appModal = document.getElementById('appModal');
  if(appHeader) appHeader.innerHTML = headerHtml();
  if(appFooter) appFooter.innerHTML = footerHtml();
  if(appModal) appModal.innerHTML = configModalHtml();
}

document.addEventListener('DOMContentLoaded', mountLayout);
