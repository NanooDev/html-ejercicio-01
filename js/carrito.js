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

function formatoPrecio(precio) {
	return `$${precio.toLocaleString("es-CL")} CLP`;
}

function renderizarCarrito() {
	const contenedor = document.querySelector("#carrito-productos");
	const subtotalElemento = document.querySelector("#subtotal-carrito");
	const totalElemento = document.querySelector("#total-carrito");
	const carrito = obtenerCarrito();

	contenedor.replaceChildren();

	if (carrito.length === 0) {
		const mensaje = document.createElement("p");
		mensaje.textContent = "Tu carrito está vacío.";
		contenedor.append(mensaje);
	}

	let subtotal = 0;

	carrito.forEach((producto) => {
		const articulo = document.createElement("article");
		const titulo = document.createElement("h4");
		const precio = document.createElement("p");
		const descripcion = document.createElement("p");
		const etiqueta = document.createElement("label");
		const cantidad = document.createElement("input");
		const subtotalProducto = document.createElement("p");
		const eliminar = document.createElement("button");

		titulo.textContent = producto.nombre;
		precio.textContent = `Precio unitario: ${producto.precioTexto}`;
		descripcion.textContent = producto.descripcion;
		etiqueta.textContent = "Cantidad: ";
		cantidad.type = "number";
		cantidad.min = "1";
		cantidad.value = producto.cantidad;
		cantidad.setAttribute("aria-label", `Cantidad de ${producto.nombre}`);
		subtotalProducto.textContent = `Subtotal: ${formatoPrecio(producto.precio * producto.cantidad)}`;
		eliminar.type = "button";
		eliminar.textContent = "Eliminar producto";

		cantidad.addEventListener("change", () => {
			const nuevaCantidad = Math.max(1, Number.parseInt(cantidad.value, 10) || 1);
			producto.cantidad = nuevaCantidad;
			guardarCarrito(carrito);
			renderizarCarrito();
		});

		eliminar.addEventListener("click", () => {
			const carritoActualizado = carrito.filter((elemento) => elemento.id !== producto.id);
			guardarCarrito(carritoActualizado);
			renderizarCarrito();
		});

		etiqueta.append(cantidad);
		articulo.append(titulo, precio, descripcion, etiqueta, subtotalProducto, eliminar);
		contenedor.append(articulo);
		subtotal += producto.precio * producto.cantidad;
	});

	subtotalElemento.textContent = formatoPrecio(subtotal);
	totalElemento.textContent = formatoPrecio(subtotal);
}

renderizarCarrito();
