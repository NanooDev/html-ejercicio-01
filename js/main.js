
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

		const addButton = front.querySelector('.btn-primary');
		const id = `producto-${Array.from(cards).indexOf(card) + 1}`;

		addButton?.addEventListener('click', () => {
			const carrito = obtenerCarrito();
			const productoExistente = carrito.find((producto) => producto.id === id);

			if (productoExistente) {
				productoExistente.cantidad += 1;
			} else {
				carrito.push(productoDesdeTarjeta(card, id));
			}

			guardarCarrito(carrito);
			actualizarContador();

			const textoOriginal = addButton.textContent;
			addButton.textContent = 'Añadido ✓';
			setTimeout(() => {
				addButton.textContent = textoOriginal;
			}, 1000);
		});
    });

	actualizarContador();
});

const CLAVE_CARRITO = "motoshop-carrito";

function obtenerCarrito() {
	try {
		return JSON.parse(localStorage.getItem(CLAVE_CARRITO)) || [];
	} catch {
		return [];
	}
}

function guardarCarrito(carrito) {
	localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
}

function precioNumerico(textoPrecio) {
	return Number(textoPrecio.replace(/[^0-9]/g, ""));
}

function actualizarContador() {
	const contador = document.querySelector("#contador-carrito");
	if (!contador) return;

	const cantidad = obtenerCarrito().reduce((total, producto) => total + producto.cantidad, 0);
	contador.textContent = cantidad;
}

function productoDesdeTarjeta(tarjeta, id) {
	const precioTexto = tarjeta.querySelector(".price").textContent;

	return {
		id,
		nombre: tarjeta.querySelector("h4").textContent.trim(),
		descripcion: tarjeta.querySelector(".specs").textContent.trim(),
		precio: precioNumerico(precioTexto),
		precioTexto,
		imagen: tarjeta.querySelector("img").getAttribute("src"),
		cantidad: 1
	};
}

