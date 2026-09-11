document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.product-card');

    cards.forEach((card) => {
        const title = card.querySelector('h4')?.textContent || 'Producto';
        const description = card.querySelector('.specs')?.textContent || 'Sin descripción disponible.';
        const price = card.querySelector('.price')?.textContent || '$0 CLP';

        const inner = document.createElement('div');
        inner.className = 'product-card-inner';

        const front = document.createElement('div');
        front.className = 'product-card-face product-card-front';
        front.innerHTML = card.innerHTML;

        const back = document.createElement('div');
        back.className = 'product-card-face product-card-back';
        back.innerHTML = `
            <div class="detail-panel">
                <h5>${title}</h5>
                <p>${description}</p>
                <span class="detail-price">${price}</span>
                <button type="button" class="btn-close">Volver</button>
            </div>
        `;

        card.innerHTML = '';
        inner.appendChild(front);
        inner.appendChild(back);
        card.appendChild(inner);

        const detailButton = front.querySelector('.btn-secondary');
        const closeButton = back.querySelector('.btn-close');

        detailButton?.addEventListener('click', (e) => {
            e.stopPropagation();
            card.classList.add('is-flipped');
        });

        closeButton?.addEventListener('click', (e) => {
            e.stopPropagation();
            card.classList.remove('is-flipped');
        });
    });
});