// ==========================================
// VARIABLES
// ==========================================

let productos = [];
let carrito = [];
let ventas = [];


// ==========================================
// ELEMENTOS
// ==========================================

const buscarProductoVenta =
    document.getElementById("buscarProductoVenta");

const productoVenta =
    document.getElementById("productoVenta");

const cantidadVenta =
    document.getElementById("cantidadVenta");

const btnDisminuirCantidad =
    document.getElementById("btnDisminuirCantidad");

const btnAumentarCantidad =
    document.getElementById("btnAumentarCantidad");

const btnAgregarCarrito =
    document.getElementById("btnAgregarCarrito");

const btnCancelarVenta =
    document.getElementById("btnCancelarVenta");

const btnConfirmarVenta =
    document.getElementById("btnConfirmarVenta");

const carritoBody =
    document.getElementById("carritoBody");

const totalVenta =
    document.getElementById("totalVenta");

const contadorCarrito =
    document.getElementById("contadorCarrito");

const buscarProductos =
    document.getElementById("buscarProductos");

const tablaProductosBody =
    document.getElementById("tablaProductosBody");

const contadorProductos =
    document.getElementById("contadorProductos");

const buscarVentas =
    document.getElementById("buscarVentas");

const tablaVentasBody =
    document.getElementById("tablaVentasBody");

const contadorVentas =
    document.getElementById("contadorVentas");


// ==========================================
// INICIAR
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        cargarProductos();

        cargarVentas();

        cantidadVenta.value = 1;
    }
);


// ==========================================
// CARGAR PRODUCTOS
// ==========================================

async function cargarProductos() {

    try {

        const respuesta =
            await fetch("/Vendedor/ObtenerProductos");

        if (!respuesta.ok) {

            throw new Error(
                "No se pudieron cargar los productos."
            );
        }

        productos =
            await respuesta.json();

        mostrarProductos(productos);

        cargarSelectProductos(productos);

    }
    catch (error) {

        console.error(error);

        tablaProductosBody.innerHTML = `
            <tr>
                <td colspan="4"
                    class="mensaje-tabla">
                    No se pudieron cargar los productos.
                </td>
            </tr>
        `;
    }
}


// ==========================================
// MOSTRAR PRODUCTOS
// ==========================================

function mostrarProductos(lista) {

    tablaProductosBody.innerHTML = "";

    contadorProductos.textContent =
        lista.length +
        (lista.length === 1
            ? " producto"
            : " productos");


    if (lista.length === 0) {

        tablaProductosBody.innerHTML = `
            <tr>
                <td colspan="4"
                    class="mensaje-tabla">
                    No hay productos disponibles.
                </td>
            </tr>
        `;

        return;
    }


    lista.forEach(function (producto) {

        let claseStock = "stock-normal";

        if (producto.stockActual <= 0) {

            claseStock = "stock-agotado";

        }
        else if (
            producto.stockActual <=
            producto.stockMinimo
        ) {

            claseStock = "stock-bajo";
        }


        tablaProductosBody.innerHTML += `
            <tr>
                <td>${producto.id}</td>

                <td>
                    ${producto.nombre}
                </td>

                <td>
                    $${Number(
            producto.precioVenta
        ).toFixed(2)}
                </td>

                <td>
                    <span class="stock-badge ${claseStock}">
                        ${producto.stockActual}
                    </span>
                </td>
            </tr>
        `;
    });
}


// ==========================================
// CARGAR SELECT DE PRODUCTOS
// ==========================================

function cargarSelectProductos(lista) {

    productoVenta.innerHTML = `
        <option value="">
            Seleccionar producto...
        </option>
    `;


    lista.forEach(function (producto) {

        if (producto.stockActual > 0) {

            productoVenta.innerHTML += `
                <option value="${producto.id}">
                    ${producto.nombre}
                    - $${Number(
                producto.precioVenta
            ).toFixed(2)}
                    - Stock: ${producto.stockActual}
                </option>
            `;
        }
    });
}


// ==========================================
// BUSCAR PRODUCTOS - TABLA
// ==========================================

buscarProductos.addEventListener(
    "input",
    function () {

        const texto =
            buscarProductos.value
                .toLowerCase()
                .trim();


        const filtrados =
            productos.filter(function (producto) {

                return (
                    producto.nombre
                        .toLowerCase()
                        .includes(texto)
                    ||
                    (
                        producto.codigoBarras &&
                        producto.codigoBarras
                            .toLowerCase()
                            .includes(texto)
                    )
                );
            });


        mostrarProductos(filtrados);
    }
);


// ==========================================
// BUSCAR PRODUCTOS - SELECT
// ==========================================

buscarProductoVenta.addEventListener(
    "input",
    function () {

        const texto =
            buscarProductoVenta.value
                .toLowerCase()
                .trim();


        const filtrados =
            productos.filter(function (producto) {

                return (
                    producto.nombre
                        .toLowerCase()
                        .includes(texto)
                    ||
                    (
                        producto.codigoBarras &&
                        producto.codigoBarras
                            .toLowerCase()
                            .includes(texto)
                    )
                );
            });


        cargarSelectProductos(filtrados);
    }
);


// ==========================================
// DISMINUIR CANTIDAD
// ==========================================

btnDisminuirCantidad.addEventListener(
    "click",
    function () {

        let cantidad =
            Number(cantidadVenta.value);

        if (cantidad > 1) {

            cantidad--;

            cantidadVenta.value =
                cantidad;
        }
    }
);


// ==========================================
// AUMENTAR CANTIDAD
// ==========================================

btnAumentarCantidad.addEventListener(
    "click",
    function () {

        let cantidad =
            Number(cantidadVenta.value);

        if (cantidad < 1) {

            cantidad = 1;
        }

        cantidad++;

        cantidadVenta.value =
            cantidad;
    }
);


// ==========================================
// AGREGAR AL CARRITO
// ==========================================

btnAgregarCarrito.addEventListener(
    "click",
    function () {

        const idProducto =
            Number(productoVenta.value);

        const cantidad =
            Number(cantidadVenta.value);


        if (idProducto <= 0) {

            mostrarMensaje(
                "Selecciona un producto.",
                "warning"
            );

            return;
        }


        if (cantidad <= 0) {

            mostrarMensaje(
                "La cantidad debe ser mayor a cero.",
                "warning"
            );

            return;
        }


        const producto =
            productos.find(function (item) {

                return item.id === idProducto;
            });


        if (!producto) {

            mostrarMensaje(
                "El producto no existe.",
                "danger"
            );

            return;
        }


        if (producto.stockActual <= 0) {

            mostrarMensaje(
                "El producto no tiene stock disponible.",
                "warning"
            );

            return;
        }


        const existente =
            carrito.find(function (item) {

                return item.idProducto === idProducto;
            });


        let nuevaCantidad = cantidad;


        if (existente) {

            nuevaCantidad =
                existente.cantidad +
                cantidad;
        }


        if (
            nuevaCantidad >
            producto.stockActual
        ) {

            mostrarMensaje(
                "No puedes agregar más productos que el stock disponible.",
                "warning"
            );

            return;
        }


        if (existente) {

            existente.cantidad =
                nuevaCantidad;

        }
        else {

            carrito.push({

                idProducto:
                    producto.id,

                nombre:
                    producto.nombre,

                precio:
                    Number(
                        producto.precioVenta
                    ),

                cantidad:
                    cantidad
            });
        }


        cantidadVenta.value = 1;

        productoVenta.value = "";

        buscarProductoVenta.value = "";

        cargarSelectProductos(productos);

        mostrarCarrito();
    }
);


// ==========================================
// MOSTRAR CARRITO
// ==========================================

function mostrarCarrito() {

    carritoBody.innerHTML = "";


    if (carrito.length === 0) {

        carritoBody.innerHTML = `
            <tr class="carrito-vacio">
                <td colspan="5">
                    <i class="bi bi-cart-x"></i>

                    <span>
                        No hay productos en el carrito.
                    </span>
                </td>
            </tr>
        `;

        contadorCarrito.textContent =
            "0 productos";

        totalVenta.textContent =
            "$0.00";

        return;
    }


    let total =
        0;

    let cantidadProductos =
        0;


    carrito.forEach(function (producto, indice) {

        const subtotal =
            producto.precio *
            producto.cantidad;


        total += subtotal;

        cantidadProductos +=
            producto.cantidad;


        carritoBody.innerHTML += `
            <tr>

                <td>
                    ${producto.nombre}
                </td>

                <td>

                    <div class="cantidad-carrito">

                        <button
                            type="button"
                            class="btn-cantidad-carrito"
                            onclick="disminuirProductoCarrito(${indice})">

                            <i class="bi bi-dash"></i>

                        </button>

                        <span>
                            ${producto.cantidad}
                        </span>

                        <button
                            type="button"
                            class="btn-cantidad-carrito"
                            onclick="aumentarProductoCarrito(${indice})">

                            <i class="bi bi-plus"></i>

                        </button>

                    </div>

                </td>

                <td>
                    $${producto.precio.toFixed(2)}
                </td>

                <td>
                    $${subtotal.toFixed(2)}
                </td>

                <td>

                    <button
                        type="button"
                        class="btn-eliminar-carrito"
                        onclick="eliminarProductoCarrito(${indice})">

                        <i class="bi bi-trash"></i>

                    </button>

                </td>

            </tr>
        `;
    });


    contadorCarrito.textContent =
        cantidadProductos +
        (
            cantidadProductos === 1
                ? " producto"
                : " productos"
        );


    totalVenta.textContent =
        "$" + total.toFixed(2);
}


// ==========================================
// AUMENTAR PRODUCTO DEL CARRITO
// ==========================================

function aumentarProductoCarrito(indice) {

    const producto =
        carrito[indice];


    const productoInventario =
        productos.find(function (item) {

            return item.id ===
                producto.idProducto;
        });


    if (!productoInventario) {

        return;
    }


    if (
        producto.cantidad >=
        productoInventario.stockActual
    ) {

        mostrarMensaje(
            "No hay más stock disponible.",
            "warning"
        );

        return;
    }


    producto.cantidad++;

    mostrarCarrito();
}


// ==========================================
// DISMINUIR PRODUCTO DEL CARRITO
// ==========================================

function disminuirProductoCarrito(indice) {

    const producto =
        carrito[indice];


    if (producto.cantidad > 1) {

        producto.cantidad--;

    }
    else {

        carrito.splice(
            indice,
            1
        );
    }


    mostrarCarrito();
}


// ==========================================
// ELIMINAR PRODUCTO DEL CARRITO
// ==========================================

function eliminarProductoCarrito(indice) {

    carrito.splice(
        indice,
        1
    );

    mostrarCarrito();
}


// ==========================================
// CANCELAR VENTA
// ==========================================

btnCancelarVenta.addEventListener(
    "click",
    function () {

        carrito = [];

        productoVenta.value = "";

        buscarProductoVenta.value = "";

        cantidadVenta.value = 1;

        cargarSelectProductos(productos);

        mostrarCarrito();
    }
);


// ==========================================
// REALIZAR VENTA
// ==========================================

btnConfirmarVenta.addEventListener(
    "click",
    async function () {

        if (carrito.length === 0) {

            mostrarMensaje(
                "Agrega al menos un producto al carrito.",
                "warning"
            );

            return;
        }


        const venta = {

            productos:
                carrito.map(function (producto) {

                    return {

                        idProducto:
                            producto.idProducto,

                        cantidad:
                            producto.cantidad
                    };
                })
        };


        try {

            btnConfirmarVenta.disabled =
                true;


            const respuesta =
                await fetch(
                    "/Vendedor/RealizarVenta",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(venta)
                    }
                );


            const resultado =
                await respuesta.json();


            if (!respuesta.ok) {

                mostrarMensaje(
                    resultado.mensaje ||
                    "No se pudo realizar la venta.",
                    "danger"
                );

                return;
            }


            mostrarMensaje(
                "Venta realizada correctamente. Venta #" +
                resultado.idVenta +
                " - Total: $" +
                Number(
                    resultado.total
                ).toFixed(2),
                "success"
            );


            carrito = [];

            productoVenta.value = "";

            buscarProductoVenta.value = "";

            cantidadVenta.value = 1;

            mostrarCarrito();

            await cargarProductos();

            await cargarVentas();

        }
        catch (error) {

            console.error(error);

            mostrarMensaje(
                "Ocurrió un error al realizar la venta.",
                "danger"
            );

        }
        finally {

            btnConfirmarVenta.disabled =
                false;
        }
    }
);


// ==========================================
// CARGAR VENTAS
// ==========================================

async function cargarVentas() {

    try {

        const respuesta =
            await fetch(
                "/Vendedor/ObtenerVentas"
            );


        if (!respuesta.ok) {

            throw new Error(
                "No se pudieron cargar las ventas."
            );
        }


        ventas =
            await respuesta.json();


        mostrarVentas(ventas);

    }
    catch (error) {

        console.error(error);

        tablaVentasBody.innerHTML = `
            <tr>
                <td colspan="4"
                    class="mensaje-tabla">

                    No se pudieron cargar las ventas.

                </td>
            </tr>
        `;
    }
}


// ==========================================
// MOSTRAR VENTAS
// ==========================================

function mostrarVentas(lista) {

    tablaVentasBody.innerHTML = "";


    contadorVentas.textContent =
        lista.length +
        (
            lista.length === 1
                ? " venta"
                : " ventas"
        );


    if (lista.length === 0) {

        tablaVentasBody.innerHTML = `
            <tr>
                <td colspan="4"
                    class="mensaje-tabla">

                    No hay ventas realizadas.

                </td>
            </tr>
        `;

        return;
    }


    lista.forEach(function (venta) {

        const fecha =
            new Date(
                venta.fechaVenta
            );


        const fechaTexto =
            fecha.toLocaleString(
                "es-MX",
                {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );


        tablaVentasBody.innerHTML += `
            <tr>

                <td>
                    ${venta.idVenta}
                </td>

                <td>
                    ${fechaTexto}
                </td>

                <td>
                    $${Number(
            venta.total
        ).toFixed(2)}
                </td>

                <td>

                    <button
                        type="button"
                        class="btn-ver-venta"
                        onclick="verDetalleVenta(${venta.idVenta})">

                        <i class="bi bi-eye"></i>

                        Ver

                    </button>

                </td>

            </tr>
        `;
    });
}


// ==========================================
// BUSCAR VENTAS
// ==========================================

buscarVentas.addEventListener(
    "input",
    function () {

        const texto =
            buscarVentas.value
                .toLowerCase()
                .trim();


        const filtradas =
            ventas.filter(function (venta) {

                return String(
                    venta.idVenta
                )
                    .includes(texto);
            });


        mostrarVentas(filtradas);
    }
);


// ==========================================
// VER DETALLE
// ==========================================

async function verDetalleVenta(idVenta) {

    try {

        const respuesta =
            await fetch(
                "/Vendedor/ObtenerDetalleVenta?id=" +
                idVenta
            );


        if (!respuesta.ok) {

            throw new Error(
                "No se pudo obtener el detalle."
            );
        }


        const detalle =
            await respuesta.json();


        let contenido = "";


        if (detalle.length === 0) {

            contenido = `
                <div class="text-center py-3">
                    No hay productos registrados.
                </div>
            `;

        }
        else {

            detalle.forEach(function (producto) {

                contenido += `
                    <div class="detalle-venta-item">

                        <div>

                            <strong>
                                ${producto.nombreProducto}
                            </strong>

                            <small>
                                ${producto.cantidad}
                                x
                                $${Number(
                    producto.precioUnitario
                ).toFixed(2)}
                            </small>

                        </div>

                        <strong>
                            $${Number(
                    producto.subtotal
                ).toFixed(2)}
                        </strong>

                    </div>
                `;
            });
        }


        mostrarModalDetalle(
            idVenta,
            contenido
        );

    }
    catch (error) {

        console.error(error);

        mostrarMensaje(
            "No se pudo consultar el detalle de la venta.",
            "danger"
        );
    }
}


// ==========================================
// MODAL DETALLE
// ==========================================

function mostrarModalDetalle(
    idVenta,
    contenido
) {

    const modalAnterior =
        document.getElementById(
            "modalDetalleVenta"
        );


    if (modalAnterior) {

        modalAnterior.remove();
    }


    const modalHTML = `
        <div
            class="modal fade"
            id="modalDetalleVenta"
            tabindex="-1">

            <div class="modal-dialog modal-dialog-centered">

                <div class="modal-content">

                    <div class="modal-header">

                        <h5 class="modal-title">

                            <i class="bi bi-receipt"></i>

                            Venta #${idVenta}

                        </h5>

                        <button
                            type="button"
                            class="btn-close"
                            data-bs-dismiss="modal">
                        </button>

                    </div>

                    <div class="modal-body">

                        ${contenido}

                    </div>

                    <div class="modal-footer">

                        <button
                            type="button"
                            class="btn btn-secondary"
                            data-bs-dismiss="modal">

                            Cerrar

                        </button>

                    </div>

                </div>

            </div>

        </div>
    `;


    document.body.insertAdjacentHTML(
        "beforeend",
        modalHTML
    );


    const modal =
        new bootstrap.Modal(
            document.getElementById(
                "modalDetalleVenta"
            )
        );


    modal.show();
}


// ==========================================
// MENSAJE BOOTSTRAP
// ==========================================

function mostrarMensaje(
    mensaje,
    tipo
) {

    const anterior =
        document.getElementById(
            "mensajeVendedor"
        );


    if (anterior) {

        anterior.remove();
    }


    const contenedor =
        document.createElement("div");


    contenedor.id =
        "mensajeVendedor";

    contenedor.className =
        `alert alert-${tipo} alert-dismissible fade show mensaje-vendedor`;

    contenedor.setAttribute(
        "role",
        "alert"
    );


    contenedor.innerHTML = `
        ${mensaje}

        <button
            type="button"
            class="btn-close"
            data-bs-dismiss="alert">
        </button>
    `;


    document.body.prepend(
        contenedor
    );


    setTimeout(
        function () {

            if (contenedor) {

                contenedor.remove();
            }

        },
        5000
    );
}