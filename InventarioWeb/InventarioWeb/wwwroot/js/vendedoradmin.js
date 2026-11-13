// ==========================================
// VARIABLES
// ==========================================

let productosAdminVenta = [];
let carritoAdminVenta = [];
let ventasAdminVenta = [];


// ==========================================
// ELEMENTOS
// ==========================================

const buscarProductoVentaAdmin =
    document.getElementById("buscarProductoVenta");

const productoVentaAdmin =
    document.getElementById("productoVenta");

const cantidadVentaAdmin =
    document.getElementById("cantidadVenta");

const btnDisminuirCantidadAdmin =
    document.getElementById("btnDisminuirCantidad");

const btnAumentarCantidadAdmin =
    document.getElementById("btnAumentarCantidad");

const btnAgregarCarritoAdmin =
    document.getElementById("btnAgregarCarrito");

const btnCancelarVentaAdmin =
    document.getElementById("btnCancelarVenta");

const btnConfirmarVentaAdmin =
    document.getElementById("btnConfirmarVenta");

const carritoBodyAdmin =
    document.getElementById("carritoBody");

const totalVentaAdmin =
    document.getElementById("totalVenta");

const contadorCarritoAdmin =
    document.getElementById("contadorCarrito");

const buscarProductosAdmin =
    document.getElementById("buscarProductosVentaAdmin");

const tablaProductosBodyAdmin =
    document.getElementById("tablaProductosVentaAdmin");

const contadorProductosAdmin =
    document.getElementById("contadorProductosVentaAdmin");

const buscarVentasAdmin =
    document.getElementById("buscarVentas");

const tablaVentasBodyAdmin =
    document.getElementById("tablaVentasBody");

const contadorVentasAdmin =
    document.getElementById("contadorVentas");


// ==========================================
// INICIAR
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        cargarProductosAdmin();

        cargarVentasAdmin();

        cantidadVentaAdmin.value = 1;
    }
);


// ==========================================
// CARGAR PRODUCTOS
// ==========================================

async function cargarProductosAdmin() {

    try {

        console.log("=================================");
        console.log("CARGANDO PRODUCTOS");
        console.log("=================================");

        const respuesta = await fetch("/Vendedor/ObtenerProductos");

        console.log("STATUS:", respuesta.status);

        if (!respuesta.ok) {

            const errorTexto = await respuesta.text();

            console.error("ERROR DEL SERVIDOR:", errorTexto);

            throw new Error(
                "No se pudieron cargar los productos."
            );
        }

        productosAdminVenta = await respuesta.json();

        console.log(
            "PRODUCTOS RECIBIDOS:",
            productosAdminVenta
        );

        console.log(
            "CANTIDAD DE PRODUCTOS:",
            productosAdminVenta.length
        );

        mostrarProductosAdmin(productosAdminVenta);

        cargarSelectProductosAdmin(productosAdminVenta);

    } catch (error) {

        console.error(
            "ERROR AL CARGAR PRODUCTOS:",
            error
        );

        tablaProductosBodyAdmin.innerHTML = `
            <tr>
                <td colspan="4" class="mensaje-tabla">
                    No se pudieron cargar los productos.
                </td>
            </tr>
        `;

        contadorProductosAdmin.textContent =
            "0 productos";
    }
}



// ==========================================
// MOSTRAR PRODUCTOS EN TABLA
// ==========================================

function mostrarProductosAdmin(lista) {

    console.log("=================================");
    console.log("MOSTRANDO PRODUCTOS EN TABLA");
    console.log("LISTA RECIBIDA:", lista);
    console.log("TOTAL:", lista.length);
    console.log("TBODY:", tablaProductosBodyAdmin);

    // Limpiar tabla
    tablaProductosBodyAdmin.innerHTML = "";

    // Actualizar contador
    contadorProductosAdmin.textContent =
        lista.length + " productos";

    // Si no hay productos
    if (lista.length === 0) {

        tablaProductosBodyAdmin.innerHTML = `
            <tr>
                <td colspan="4" class="mensaje-tabla">
                    No hay productos disponibles.
                </td>
            </tr>
        `;

        return;
    }

    // Recorrer productos
    lista.forEach(function (producto) {

        console.log("PRODUCTO:", producto);

        let claseStock = "stock-normal";
        let textoStock = producto.stockActual;

        if (producto.stockActual <= 0) {

            claseStock = "stock-agotado";
            textoStock = "Agotado";

        } else if (
            producto.stockActual <= producto.stockMinimo
        ) {

            claseStock = "stock-bajo";
        }

        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>
                ${producto.id}
            </td>

            <td>
                ${producto.nombre}
            </td>

            <td>
                $${Number(producto.precioVenta).toFixed(2)}
            </td>

            <td>
                <span class="${claseStock}">
                    ${textoStock}
                </span>
            </td>
        `;

        tablaProductosBodyAdmin.appendChild(fila);
    });
}

// ==========================================
// CARGAR PRODUCTOS EN SELECT
// ==========================================

function cargarSelectProductosAdmin(lista) {

    productoVentaAdmin.innerHTML = `
        <option value="">
            Seleccionar producto...
        </option>
    `;

    lista.forEach(function (producto) {

        if (producto.stockActual > 0) {

            const opcion = document.createElement("option");

            opcion.value = producto.id;

            opcion.textContent =
                producto.nombre +
                " - $" +
                Number(producto.precioVenta).toFixed(2);

            productoVentaAdmin.appendChild(opcion);
        }
    });
}


// ==========================================
// BUSCAR PRODUCTOS - TABLA
// ==========================================

buscarProductosAdmin.addEventListener(
    "input",
    function () {

        const texto =
            buscarProductosAdmin.value
                .toLowerCase()
                .trim();


        const filtrados =
            productosAdminVenta.filter(
                function (producto) {

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
                }
            );


        mostrarProductosAdmin(
            filtrados
        );
    }
);


// ==========================================
// BUSCAR PRODUCTOS - SELECT
// ==========================================

buscarProductoVentaAdmin.addEventListener(
    "input",
    function () {

        const texto =
            buscarProductoVentaAdmin.value
                .toLowerCase()
                .trim();


        const filtrados =
            productosAdminVenta.filter(
                function (producto) {

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
                }
            );


        cargarSelectProductosAdmin(
            filtrados
        );
    }
);


// ==========================================
// DISMINUIR CANTIDAD
// ==========================================

btnDisminuirCantidadAdmin.addEventListener(
    "click",
    function () {

        let cantidad =
            Number(
                cantidadVentaAdmin.value
            );


        if (cantidad > 1) {

            cantidad--;

            cantidadVentaAdmin.value =
                cantidad;
        }
    }
);


// ==========================================
// AUMENTAR CANTIDAD
// ==========================================

btnAumentarCantidadAdmin.addEventListener(
    "click",
    function () {

        let cantidad =
            Number(
                cantidadVentaAdmin.value
            );


        if (cantidad < 1) {

            cantidad = 1;
        }


        cantidad++;

        cantidadVentaAdmin.value =
            cantidad;
    }
);


// ==========================================
// AGREGAR AL CARRITO
// ==========================================

btnAgregarCarritoAdmin.addEventListener(
    "click",
    function () {

        const idProducto =
            Number(
                productoVentaAdmin.value
            );


        const cantidad =
            Number(
                cantidadVentaAdmin.value
            );


        if (idProducto <= 0) {

            mostrarMensajeAdmin(
                "Selecciona un producto.",
                "warning"
            );

            return;
        }


        if (cantidad <= 0) {

            mostrarMensajeAdmin(
                "La cantidad debe ser mayor a cero.",
                "warning"
            );

            return;
        }


        const producto =
            productosAdminVenta.find(
                function (item) {

                    return item.id ===
                        idProducto;
                }
            );


        if (!producto) {

            mostrarMensajeAdmin(
                "El producto no existe.",
                "danger"
            );

            return;
        }


        if (producto.stockActual <= 0) {

            mostrarMensajeAdmin(
                "El producto no tiene stock disponible.",
                "warning"
            );

            return;
        }


        const existente =
            carritoAdminVenta.find(
                function (item) {

                    return item.idProducto ===
                        idProducto;
                }
            );


        let nuevaCantidad =
            cantidad;


        if (existente) {

            nuevaCantidad =
                existente.cantidad +
                cantidad;
        }


        if (
            nuevaCantidad >
            producto.stockActual
        ) {

            mostrarMensajeAdmin(
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

            carritoAdminVenta.push({

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


        cantidadVentaAdmin.value =
            1;

        productoVentaAdmin.value =
            "";

        buscarProductoVentaAdmin.value =
            "";

        cargarSelectProductosAdmin(
            productosAdminVenta
        );

        mostrarCarritoAdmin();
    }
);


// ==========================================
// MOSTRAR CARRITO
// ==========================================

function mostrarCarritoAdmin() {

    carritoBodyAdmin.innerHTML =
        "";


    if (carritoAdminVenta.length === 0) {

        carritoBodyAdmin.innerHTML = `
            <tr class="carrito-vacio">

                <td colspan="5">

                    <i class="bi bi-cart-x"></i>

                    <span>
                        No hay productos en el carrito.
                    </span>

                </td>

            </tr>
        `;


        contadorCarritoAdmin.textContent =
            "0 productos";


        totalVentaAdmin.textContent =
            "$0.00";


        return;
    }


    let total =
        0;

    let cantidadProductos =
        0;


    carritoAdminVenta.forEach(
        function (producto, indice) {

            const subtotal =
                producto.precio *
                producto.cantidad;


            total +=
                subtotal;


            cantidadProductos +=
                producto.cantidad;


            carritoBodyAdmin.innerHTML += `
                <tr>

                    <td>
                        ${producto.nombre}
                    </td>

                    <td>

                        <div class="cantidad-carrito">

                            <button
                                type="button"
                                class="btn-cantidad-carrito"
                                onclick="disminuirProductoCarritoAdmin(${indice})">

                                <i class="bi bi-dash"></i>

                            </button>


                            <span>
                                ${producto.cantidad}
                            </span>


                            <button
                                type="button"
                                class="btn-cantidad-carrito"
                                onclick="aumentarProductoCarritoAdmin(${indice})">

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
                            onclick="eliminarProductoCarritoAdmin(${indice})">

                            <i class="bi bi-trash"></i>

                        </button>

                    </td>

                </tr>
            `;
        }
    );


    contadorCarritoAdmin.textContent =
        cantidadProductos +
        (
            cantidadProductos === 1
                ? " producto"
                : " productos"
        );


    totalVentaAdmin.textContent =
        "$" +
        total.toFixed(2);
}


// ==========================================
// AUMENTAR PRODUCTO DEL CARRITO
// ==========================================

function aumentarProductoCarritoAdmin(indice) {

    const producto =
        carritoAdminVenta[indice];


    const productoInventario =
        productosAdminVenta.find(
            function (item) {

                return item.id ===
                    producto.idProducto;
            }
        );


    if (!productoInventario) {

        return;
    }


    if (
        producto.cantidad >=
        productoInventario.stockActual
    ) {

        mostrarMensajeAdmin(
            "No hay más stock disponible.",
            "warning"
        );

        return;
    }


    producto.cantidad++;


    mostrarCarritoAdmin();
}


// ==========================================
// DISMINUIR PRODUCTO DEL CARRITO
// ==========================================

function disminuirProductoCarritoAdmin(indice) {

    const producto =
        carritoAdminVenta[indice];


    if (producto.cantidad > 1) {

        producto.cantidad--;

    }
    else {

        carritoAdminVenta.splice(
            indice,
            1
        );
    }


    mostrarCarritoAdmin();
}


// ==========================================
// ELIMINAR PRODUCTO DEL CARRITO
// ==========================================

function eliminarProductoCarritoAdmin(indice) {

    carritoAdminVenta.splice(
        indice,
        1
    );


    mostrarCarritoAdmin();
}


// ==========================================
// CANCELAR VENTA
// ==========================================

btnCancelarVentaAdmin.addEventListener(
    "click",
    function () {

        carritoAdminVenta = [];


        productoVentaAdmin.value =
            "";

        buscarProductoVentaAdmin.value =
            "";

        cantidadVentaAdmin.value =
            1;


        cargarSelectProductosAdmin(
            productosAdminVenta
        );


        mostrarCarritoAdmin();
    }
);


// ==========================================
// REALIZAR VENTA
// ==========================================

btnConfirmarVentaAdmin.addEventListener(
    "click",
    async function () {

        if (
            carritoAdminVenta.length === 0
        ) {

            mostrarMensajeAdmin(
                "Agrega al menos un producto al carrito.",
                "warning"
            );

            return;
        }


        const venta = {

            productos:
                carritoAdminVenta.map(
                    function (producto) {

                        return {

                            idProducto:
                                producto.idProducto,

                            cantidad:
                                producto.cantidad
                        };
                    }
                )
        };


        try {

            btnConfirmarVentaAdmin.disabled =
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

                mostrarMensajeAdmin(
                    resultado.mensaje ||
                    "No se pudo realizar la venta.",
                    "danger"
                );

                return;
            }


            mostrarMensajeAdmin(
                "Venta realizada correctamente. Venta #" +
                resultado.idVenta +
                " - Total: $" +
                Number(
                    resultado.total
                ).toFixed(2),
                "success"
            );


            carritoAdminVenta =
                [];


            productoVentaAdmin.value =
                "";

            buscarProductoVentaAdmin.value =
                "";

            cantidadVentaAdmin.value =
                1;


            mostrarCarritoAdmin();


            await cargarProductosAdmin();

            await cargarVentasAdmin();

        }
        catch (error) {

            console.error(error);

            mostrarMensajeAdmin(
                "Ocurrió un error al realizar la venta.",
                "danger"
            );

        }
        finally {

            btnConfirmarVentaAdmin.disabled =
                false;
        }
    }
);


// ==========================================
// CARGAR VENTAS
// ==========================================

async function cargarVentasAdmin() {

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


        ventasAdminVenta =
            await respuesta.json();


        mostrarVentasAdmin(
            ventasAdminVenta
        );

    }
    catch (error) {

        console.error(error);

        tablaVentasBodyAdmin.innerHTML = `
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

function mostrarVentasAdmin(lista) {

    tablaVentasBodyAdmin.innerHTML =
        "";


    contadorVentasAdmin.textContent =
        lista.length +
        (
            lista.length === 1
                ? " venta"
                : " ventas"
        );


    if (lista.length === 0) {

        tablaVentasBodyAdmin.innerHTML = `
            <tr>

                <td colspan="4"
                    class="mensaje-tabla">

                    No hay ventas realizadas.

                </td>

            </tr>
        `;

        return;
    }


    lista.forEach(
        function (venta) {

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


            tablaVentasBodyAdmin.innerHTML += `
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
                            onclick="verDetalleVentaAdmin(${venta.idVenta})">

                            <i class="bi bi-eye"></i>

                            Ver

                        </button>

                    </td>

                </tr>
            `;
        }
    );
}


// ==========================================
// BUSCAR VENTAS
// ==========================================

buscarVentasAdmin.addEventListener(
    "input",
    function () {

        const texto =
            buscarVentasAdmin.value
                .toLowerCase()
                .trim();


        const filtradas =
            ventasAdminVenta.filter(
                function (venta) {

                    return String(
                        venta.idVenta
                    ).includes(texto);
                }
            );


        mostrarVentasAdmin(
            filtradas
        );
    }
);


// ==========================================
// VER DETALLE
// ==========================================

async function verDetalleVentaAdmin(idVenta) {

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


        let contenido =
            "";


        if (detalle.length === 0) {

            contenido = `
                <div class="text-center py-3">

                    No hay productos registrados.

                </div>
            `;

        }
        else {

            detalle.forEach(
                function (producto) {

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
                }
            );
        }


        mostrarModalDetalleAdmin(
            idVenta,
            contenido
        );

    }
    catch (error) {

        console.error(error);

        mostrarMensajeAdmin(
            "No se pudo consultar el detalle de la venta.",
            "danger"
        );
    }
}


// ==========================================
// MODAL DETALLE
// ==========================================

function mostrarModalDetalleAdmin(
    idVenta,
    contenido
) {

    const modalAnterior =
        document.getElementById(
            "modalDetalleVentaAdmin"
        );


    if (modalAnterior) {

        modalAnterior.remove();
    }


    const modalHTML = `
        <div
            class="modal fade"
            id="modalDetalleVentaAdmin"
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
                "modalDetalleVentaAdmin"
            )
        );


    modal.show();
}


// ==========================================
// MENSAJE BOOTSTRAP
// ==========================================

function mostrarMensajeAdmin(
    mensaje,
    tipo
) {

    const anterior =
        document.getElementById(
            "mensajeAdministradorVenta"
        );


    if (anterior) {

        anterior.remove();
    }


    const contenedor =
        document.createElement("div");


    contenedor.id =
        "mensajeAdministradorVenta";


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



const pestañaVentas = document.getElementById("ventas-tab");

if (pestañaVentas) {

    pestañaVentas.addEventListener("shown.bs.tab", function () {

        console.log("PESTAÑA VENTAS ABIERTA");

        cargarProductosAdmin();
        cargarVentasAdmin();

    });

}