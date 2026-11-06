/* Modo claro / escuro, igual em todas as páginas.
   Coloque <script src="tema.js"></script> no <head> de cada página, logo depois do CSS.
   A escolha fica guardada no navegador de cada pessoa e vale para o site todo. */
(function () {
  'use strict';
  var CHAVE = 'sv-tema';
  var raiz = document.documentElement;

  // Quem nunca escolheu vê o modo escuro. Para seguir o modo do aparelho, troque 'dark' por
  // (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark').
  function doAparelho() { return 'dark'; }
  function guardado() {
    try {
      var v = localStorage.getItem(CHAVE);
      return v === 'light' || v === 'dark' ? v : null;
    } catch (e) { return null; }
  }
  function atual() { return raiz.getAttribute('data-theme') === 'light' ? 'light' : 'dark'; }

  function aplicar(tema) {
    raiz.setAttribute('data-theme', tema);
    var botao = document.querySelector('.tema-btn');
    if (botao) rotular(botao);
  }
  function rotular(botao) {
    var texto = atual() === 'dark' ? 'Mudar para o modo claro' : 'Mudar para o modo escuro';
    botao.setAttribute('aria-label', texto);
    botao.setAttribute('title', texto);
  }

  // Aplica já no carregamento, antes de a página aparecer, para não piscar.
  aplicar(guardado() || doAparelho());

  function montarBotao() {
    if (document.querySelector('.tema-btn')) return;
    var botao = document.createElement('button');
    botao.type = 'button';
    botao.className = 'tema-btn';
    botao.innerHTML =
      '<svg class="icone-sol" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true">' +
      '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>' +
      '<svg class="icone-lua" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>';
    var nav = document.querySelector('.sv-nav');
    if (nav) nav.appendChild(botao); else { botao.classList.add('flutuante'); document.body.appendChild(botao); }
    rotular(botao);
    botao.addEventListener('click', function () {
      var novo = atual() === 'dark' ? 'light' : 'dark';
      aplicar(novo);
      try { localStorage.setItem(CHAVE, novo); } catch (e) { /* sem armazenamento: vale só nesta página */ }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', montarBotao);
  else montarBotao();

  // Se a pessoa trocar o modo em outra aba, esta aba acompanha.
  window.addEventListener('storage', function (e) {
    if (e.key === CHAVE && (e.newValue === 'light' || e.newValue === 'dark')) aplicar(e.newValue);
  });
})();
