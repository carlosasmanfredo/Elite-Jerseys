/* arquivo: carrinho.js */

let itensCarrinho = JSON.parse(localStorage.getItem('listaCarrinho')) || [];
const displayContador = document.getElementById('contador-sacola');
const modal = document.getElementById('modal-carrinho');
const btnAbrirModal = document.querySelector('#checkout-btn, .carrinho-container');
const btnFecharModal = document.querySelector('.fechar-modal');
const listaItensHtml = document.getElementById('lista-itens-carrinho');

// Atualiza o contador visual
function atualizarInterface() {
    if (displayContador) displayContador.innerText = itensCarrinho.length;
    localStorage.setItem('listaCarrinho', JSON.stringify(itensCarrinho));
}

// Renderiza a lista dentro do Modal
function renderizarItens() {
    listaItensHtml.innerHTML = "";
    
    if (itensCarrinho.length === 0) {
        listaItensHtml.innerHTML = "<p style='text-align:center; color:#888;'>Sua sacola está vazia.</p>";
        return;
    }

    itensCarrinho.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'item-carrinho';
        div.innerHTML = `
            <span>${item}</span>
            <button class="btn-remover" onclick="removerItem(${index})">Remover</button>
        `;
        listaItensHtml.appendChild(div);
    });
}

// Função para remover item específico
window.removerItem = function(index) {
    itensCarrinho.splice(index, 1);
    atualizarInterface();
    renderizarItens();
};

// Abrir e fechar Modal
btnAbrirModal.onclick = () => {
    modal.style.display = "block";
    renderizarItens();
};
btnFecharModal.onclick = () => modal.style.display = "none";
window.onclick = (event) => { if (event.target == modal) modal.style.display = "none"; };

// Botão Adicionar à Sacola
document.querySelectorAll('.btn-comprar, .add-to-cart').forEach(botao => {
    botao.addEventListener('click', function() {
        const card = this.closest('.product-card, .card-produto');
        const nome = card.querySelector('h3').innerText;
        itensCarrinho.push(nome);
        atualizarInterface();
        
        // Efeito visual no botão
        let original = this.innerHTML;
        this.innerText = "✓ Adicionado";
        setTimeout(() => { this.innerHTML = original; }, 1000);
    });
});

// Finalizar via WhatsApp
document.getElementById('btn-finalizar-whatsapp').onclick = () => {
    if (itensCarrinho.length === 0) return alert("Adicione itens primeiro!");

    let mensagem = "Olá, Elite Jerseys! Gostaria de encomendar:\n\n";
    let contagem = {};
    itensCarrinho.forEach(i => contagem[i] = (contagem[i] || 0) + 1);
    for (let i in contagem) mensagem += `- ${contagem[i]}x ${i}\n`;

    const link = `https://wa.me/5516999999999?text=${encodeURIComponent(mensagem)}`;
    window.open(link, '_blank');
};

// Limpar tudo
document.getElementById('btn-limpar-carrinho').onclick = () => {
    if(confirm("Deseja esvaziar toda a sacola?")) {
        itensCarrinho = [];
        atualizarInterface();
        renderizarItens();
    }
};

atualizarInterface();