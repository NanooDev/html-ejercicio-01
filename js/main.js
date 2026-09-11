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

document.querySelectorAll(".product-card").forEach((tarjeta, indice) => {
	const boton = tarjeta.querySelector(".btn-primary");
	const id = `producto-${indice + 1}`;

	boton.addEventListener("click", () => {
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
		boton.textContent = "Añadido ✓";
		setTimeout(() => {
			boton.textContent = textoOriginal;
		}, 1000);
	});
});

actualizarContador();