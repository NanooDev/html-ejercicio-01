
const CLAVE_SESION = 'motoshop-sesion';
const CLAVE_PRODUCTO_PENDIENTE = 'motoshop-producto-pendiente';
const CLAVE_COMPRAS = 'motoshop-compras';

function obtenerSesion() {
    try {
        return JSON.parse(localStorage.getItem(CLAVE_SESION)) || null;
    } catch {
        return null;
    }
}

function actualizarCuentaNav() {
    const botonCuenta = document.querySelector('.btn-user');
    if (!botonCuenta) return;

    const sesion = obtenerSesion();

    if (!sesion || !sesion.email) {
        const menuExistente = botonCuenta.closest('.user-menu-wrap');
        if (menuExistente) {
            menuExistente.replaceWith(botonCuenta);
        }

        botonCuenta.innerHTML = '<span>👤</span> Mi Cuenta';
        botonCuenta.classList.remove('is-logged');
        botonCuenta.setAttribute('href', 'cuenta.html');
        return;
    }

    const nombreUsuario = sesion.displayName || sesion.email.split('@')[0];
    botonCuenta.innerHTML = `<span>👤</span> ${nombreUsuario}`;
    botonCuenta.title = `Sesión activa: ${sesion.email}`;
    botonCuenta.classList.add('is-logged');
    botonCuenta.setAttribute('href', '#');

    const contenedorPadre = botonCuenta.parentElement;
    if (!contenedorPadre) return;

    const menuExistente = botonCuenta.closest('.user-menu-wrap');
    if (menuExistente && menuExistente !== contenedorPadre) {
        menuExistente.replaceWith(botonCuenta);
    }

    if (contenedorPadre.classList.contains('user-menu-wrap')) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'user-menu-wrap';
    contenedorPadre.insertBefore(wrapper, botonCuenta);
    wrapper.appendChild(botonCuenta);

    const menu = document.createElement('div');
    menu.className = 'user-menu-panel';
    menu.innerHTML = `
        <button type="button" class="menu-item" data-action="perfil">Perfil</button>
        <button type="button" class="menu-item" data-action="compras">Mis compras</button>
        <button type="button" class="menu-item logout-option" data-action="logout">Cerrar sesión</button>
    `;
    wrapper.appendChild(menu);

    botonCuenta.addEventListener('click', (event) => {
        event.preventDefault();
        wrapper.classList.toggle('open');
    });

    menu.querySelectorAll('.menu-item').forEach((item) => {
        item.addEventListener('click', () => {
            const accion = item.dataset.action;

            if (accion === 'logout') {
                localStorage.removeItem(CLAVE_SESION);
                window.location.href = 'cuenta.html';
                return;
            }

            if (accion === 'perfil') {
                window.location.href = 'cuenta.html';
                return;
            }

            if (accion === 'compras') {
                mostrarPanelCompras();
                return;
            }

            wrapper.classList.remove('open');
        });
    });

    document.addEventListener('click', (event) => {
        const clicFuera = !wrapper.contains(event.target);
        const clicFueraPanel = !event.target.closest('.compras-panel') && !event.target.closest('[data-action="compras"]');

        if (clicFuera) {
            wrapper.classList.remove('open');
        }

        if (clicFueraPanel) {
            document.querySelector('.compras-panel')?.remove();
        }
    });
}

function obtenerComprasUsuario(email) {
    try {
        const comprasPorUsuario = JSON.parse(localStorage.getItem(CLAVE_COMPRAS) || '{}');
        return Array.isArray(comprasPorUsuario[email]) ? comprasPorUsuario[email] : [];
    } catch {
        return [];
    }
}

function mostrarPanelCompras() {
    const sesion = obtenerSesion();
    if (!sesion?.email) {
        window.location.href = 'cuenta.html';
        return;
    }

    document.querySelector('.compras-panel')?.remove();

    const panel = document.createElement('aside');
    panel.className = 'compras-panel';

    const compras = obtenerComprasUsuario(sesion.email);
    const comprasOrdenadas = [...compras].reverse();

    panel.innerHTML = `
        <div class="compras-header">
            <div>
                <p class="compras-kicker">Historial</p>
                <h3>Mis compras</h3>
            </div>
            <button type="button" class="compras-close" aria-label="Cerrar compras">&times;</button>
        </div>
        ${comprasOrdenadas.length === 0 ? '<p class="compras-vacia">Aún no tienes compras realizadas.</p>' : ''}
        <div class="compras-lista"></div>
    `;

    const lista = panel.querySelector('.compras-lista');

    comprasOrdenadas.forEach((compra) => {
        const compraItem = document.createElement('article');
        compraItem.className = 'compra-item';

        const fecha = new Date(compra.fecha).toLocaleDateString('es-CL', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });

        const total = compra.total || compra.productos.reduce((sum, producto) => sum + (producto.precio * producto.cantidad), 0);

        compraItem.innerHTML = `
            <div class="compra-item-header">
                <span>Compra</span>
                <strong>${fecha}</strong>
            </div>
            <ul class="compra-productos">
                ${compra.productos.map((producto) => `
                    <li>
                        <span>${producto.nombre} x${producto.cantidad}</span>
                        <span>${producto.precioTexto}</span>
                    </li>
                `).join('')}
            </ul>
            <div class="compra-total-row">
                <span>Total</span>
                <strong>${formatearPrecio(total)}</strong>
            </div>
        `;

        lista.appendChild(compraItem);
    });

    panel.querySelector('.compras-close')?.addEventListener('click', () => {
        panel.remove();
    });

    document.body.appendChild(panel);
}

function formatearPrecio(precio) {
    return `$${Number(precio).toLocaleString('es-CL')} CLP`;
}

function mostrarAvisoAutenticacion(idProducto) {
    document.querySelector('.auth-notice')?.remove();

    const aviso = document.createElement('aside');
    aviso.className = 'auth-notice';
    aviso.setAttribute('role', 'alertdialog');
    aviso.setAttribute('aria-labelledby', 'auth-notice-title');
    aviso.innerHTML = `
        <button type="button" class="auth-notice-close" aria-label="Cerrar aviso">&times;</button>
        <span class="auth-notice-icon" aria-hidden="true">👤</span>
        <div>
            <strong id="auth-notice-title">Inicia sesión para continuar</strong>
            <p>Necesitas una cuenta para añadir productos al carrito.</p>
            <button type="button" class="auth-notice-action">Ir a mi cuenta</button>
        </div>
    `;

    document.body.appendChild(aviso);

    aviso.querySelector('.auth-notice-close').addEventListener('click', () => {
        aviso.remove();
    });

    aviso.querySelector('.auth-notice-action').addEventListener('click', () => {
        localStorage.setItem(CLAVE_PRODUCTO_PENDIENTE, idProducto);
        window.location.href = 'cuenta.html';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    actualizarCuentaNav();

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
            if (!obtenerSesion()?.email) {
                mostrarAvisoAutenticacion(id);
                return;
            }

            agregarProductoAlCarrito(card, id, addButton);
        });
    });

	actualizarContador();
    procesarProductoPendiente(cards);
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

function agregarProductoAlCarrito(tarjeta, id, boton) {
    const carrito = obtenerCarrito();
    const productoExistente = carrito.find((producto) => producto.id === id);

    if (productoExistente) {
        productoExistente.cantidad += 1;
    } else {
        carrito.push(productoDesdeTarjeta(tarjeta, id));
    }

    guardarCarrito(carrito);
    actualizarContador();

    const textoOriginal = boton.textContent;
    boton.textContent = 'Añadido ✓';
    setTimeout(() => {
        boton.textContent = textoOriginal;
    }, 1000);
}

function procesarProductoPendiente(cards) {
    const idPendiente = localStorage.getItem(CLAVE_PRODUCTO_PENDIENTE);
    if (!idPendiente || !obtenerSesion()?.email) return;

    const indice = Number(idPendiente.replace('producto-', '')) - 1;
    const tarjeta = cards[indice];
    const boton = tarjeta?.querySelector('.btn-primary');

    localStorage.removeItem(CLAVE_PRODUCTO_PENDIENTE);
    if (tarjeta && boton) {
        agregarProductoAlCarrito(tarjeta, idPendiente, boton);
    }
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

