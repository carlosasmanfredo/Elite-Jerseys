/* arquivo: carrinho.js */

let itensCarrinho = JSON.parse(localStorage.getItem('listaCarrinho')) || [];

const displayContador = document.getElementById('contador-sacola');
const modal = document.getElementById('modal-carrinho');
const btnAbrirModal = document.querySelector('#checkout-btn, #abrir-carrinho, .carrinho-container');
const btnFecharModal = document.querySelector('.fechar-modal');
const listaItensHtml = document.getElementById('lista-itens-carrinho');
const btnFinalizarWhatsapp = document.getElementById('btn-finalizar-whatsapp');
const btnLimparCarrinho = document.getElementById('btn-limpar-carrinho');

function atualizarInterface() {
    if (displayContador) {
        displayContador.innerText = itensCarrinho.length;
    }

    localStorage.setItem('listaCarrinho', JSON.stringify(itensCarrinho));
}

function renderizarItens() {
    if (!listaItensHtml) return;

    listaItensHtml.innerHTML = "";

    if (itensCarrinho.length === 0) {
        listaItensHtml.innerHTML = "<p class='carrinho-vazio'>Sua sacola está vazia.</p>";
        return;
    }

    itensCarrinho.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'item-carrinho';
        div.innerHTML = `
            <span class="nome-item-carrinho">${item}</span>
            <button class="btn-remover" onclick="removerItem(${index})">Remover</button>
        `;
        listaItensHtml.appendChild(div);
    });
}

window.removerItem = function(index) {
    itensCarrinho.splice(index, 1);
    atualizarInterface();
    renderizarItens();
};

if (btnAbrirModal && modal) {
    btnAbrirModal.addEventListener('click', () => {
        modal.style.display = "block";
        renderizarItens();
    });
}

if (btnFecharModal && modal) {
    btnFecharModal.addEventListener('click', () => {
        modal.style.display = "none";
    });
}

window.addEventListener('click', (event) => {
    if (modal && event.target === modal) {
        modal.style.display = "none";
    }
});

document.querySelectorAll('.btn-comprar, .add-to-cart').forEach(botao => {
    botao.addEventListener('click', function() {
        const card = this.closest('.product-card, .card-produto');
        if (!card) return;

        const titulo = card.querySelector('h3');
        if (!titulo) return;

        const nome = titulo.innerText.trim();
        itensCarrinho.push(nome);
        atualizarInterface();
        renderizarItens();

        const original = this.innerHTML;
        this.innerHTML = "✓ Adicionado";

        setTimeout(() => {
            this.innerHTML = original;
        }, 1000);
    });
});

if (btnFinalizarWhatsapp) {
    btnFinalizarWhatsapp.addEventListener('click', () => {
        if (itensCarrinho.length === 0) {
            alert("Adicione itens primeiro!");
            return;
        }

        let mensagem = "Olá, Elite Jerseys! Gostaria de encomendar:%0A%0A";
        const contagem = {};

        itensCarrinho.forEach(item => {
            contagem[item] = (contagem[item] || 0) + 1;
        });

        for (const item in contagem) {
            mensagem += `- ${contagem[item]}x ${item}%0A`;
        }

        const link = `https://wa.me/5516999999999?text=${mensagem}`;
        window.open(link, '_blank');
    });
}

if (btnLimparCarrinho) {
    btnLimparCarrinho.addEventListener('click', () => {
        if (confirm("Deseja esvaziar toda a sacola?")) {
            itensCarrinho = [];
            atualizarInterface();
            renderizarItens();
        }
    });
}

atualizarInterface();
renderizarItens();
