document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // VARIABLES
    // ==========================================

    let productos = [];


    // ==========================================
    // CARGAR INVENTARIO ACTUAL
    // ==========================================

    async function cargarInventarioAdmin() {

        try {

            const respuesta = await fetch(
                "/Productos/ObtenerProductos"
            );

            if (!respuesta.ok) {
                throw new Error(
                    "No se pudieron obtener los productos."
                );
            }

            productos = await respuesta.json();

            const tabla =
                document.getElementById(
                    "tablaInventarioAdminBody"
                );

            const selectProducto =
                document.getElementById(
                    "productoMovimientoAdmin"
                );


            // Limpiar tabla

            tabla.innerHTML = "";


            // Limpiar selector

            selectProducto.innerHTML = `
                <option value="">
                    Selecciona un producto
                </option>
            `;


            // ==========================================
            // RECORRER PRODUCTOS
            // ==========================================

            productos.forEach(function (producto) {

                // ==========================================
                // CREAR FILA
                // ==========================================

                const fila =
                    document.createElement("tr");

                fila.innerHTML = `
                    <td>
                        ${producto.id}
                    </td>

                    <td>
                        ${producto.nombre}
                    </td>

                    <td>
                        ${producto.nombreCategoria || "Sin categoría"}
                    </td>

                    <td>
                        ${producto.nombreProveedor || "Sin proveedor"}
                    </td>

                    <td>
                        ${producto.stockActual}
                    </td>

                    <td>
                        $${Number(producto.precioVenta).toFixed(2)}
                    </td>
                `;


                tabla.appendChild(fila);


                // ==========================================
                // AGREGAR PRODUCTO AL SELECT
                // ==========================================

                const opcion =
                    document.createElement("option");

                opcion.value = producto.id;

                opcion.textContent =
                    "ID " +
                    producto.id +
                    " - " +
                    producto.nombre;

                selectProducto.appendChild(opcion);

            });


            // ==========================================
            // SI NO HAY PRODUCTOS
            // ==========================================

            if (productos.length === 0) {

                tabla.innerHTML = `
                    <tr>
                        <td colspan="6"
                            class="text-center">
                            No hay productos registrados.
                        </td>
                    </tr>
                `;

            }

        }
        catch (error) {

            console.error(
                "Error al cargar el inventario:",
                error
            );

        }

    }


    // ==========================================
    // CARGAR HISTORIAL
    // ==========================================

    async function cargarHistorial() {

        try {

            const respuesta = await fetch(
                "/Administrador/ObtenerHistorial"
            );


            if (!respuesta.ok) {

                throw new Error(
                    "No se pudo obtener el historial."
                );

            }


            const historial =
                await respuesta.json();


            const tabla =
                document.getElementById(
                    "tablaHistorialAdminBody"
                );


            tabla.innerHTML = "";


            // ==========================================
            // RECORRER MOVIMIENTOS
            // ==========================================

            historial.forEach(function (movimiento) {

                // ==========================================
                // BUSCAR PRODUCTO
                // ==========================================

                const producto =
                    productos.find(function (producto) {

                        return producto.id === movimiento.idProducto;

                    });


                let nombreProducto =
                    "Producto no encontrado";


                if (producto) {

                    nombreProducto =
                        producto.nombre;

                }


                // ==========================================
                // CREAR FILA
                // ==========================================

                const fila =
                    document.createElement("tr");


                fila.innerHTML = `
                    <td>
                        ${movimiento.idMovimiento}
                    </td>

                    <td>
                        ${nombreProducto}
                    </td>

                    <td>
                        ${movimiento.tipoMovimiento}
                    </td>

                    <td>
                        ${movimiento.cantidad}
                    </td>

                    <td>
                        ${formatearFecha(
                    movimiento.fechaMovimiento
                )}
                    </td>

                    <td>
                        ${movimiento.motivo || "Sin motivo"}
                    </td>
                `;


                tabla.appendChild(fila);

            });


            // ==========================================
            // SI NO HAY MOVIMIENTOS
            // ==========================================

            if (historial.length === 0) {

                tabla.innerHTML = `
                    <tr>
                        <td colspan="6"
                            class="text-center">
                            No hay movimientos registrados.
                        </td>
                    </tr>
                `;

            }

        }
        catch (error) {

            console.error(
                "Error al cargar el historial:",
                error
            );

        }

    }


    // ==========================================
    // FORMATEAR FECHA
    // ==========================================

    function formatearFecha(fecha) {

        const fechaObjeto =
            new Date(fecha);


        if (isNaN(fechaObjeto)) {

            return fecha;

        }


        return fechaObjeto.toLocaleDateString(
            "es-MX",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            }
        );

    }


    // ==========================================
    // INICIAR
    // ==========================================

    async function iniciarHistorial() {

        await cargarInventarioAdmin();

        await cargarHistorial();

    }

    // ================= MOSTRAR MODAL =================

    function mostrarModalMovimiento(titulo, mensaje, correcto) {

        const modalElemento = document.getElementById(
            "modalMovimientoAdmin"
        );

        const icono = document.getElementById(
            "modalMovimientoIcono"
        );

        const tituloElemento = document.getElementById(
            "modalMovimientoTitulo"
        );

        const mensajeElemento = document.getElementById(
            "modalMovimientoMensaje"
        );

        // Cambiar título y mensaje
        tituloElemento.textContent = titulo;
        mensajeElemento.textContent = mensaje;

        // Cambiar apariencia según el resultado
        if (correcto) {

            icono.className = "movimiento-icono exito";

            icono.innerHTML = `
            <i class="bi bi-check-lg"></i>
        `;

        } else {

            icono.className = "movimiento-icono error";

            icono.innerHTML = `
            <i class="bi bi-exclamation-lg"></i>
        `;

        }

        // Mostrar modal
        const modal = bootstrap.Modal.getOrCreateInstance(
            modalElemento
        );

        modal.show();
    }
    

    
    // ================= REGISTRAR MOVIMIENTO =================

    const formularioMovimiento = document.getElementById(
        "formMovimientoAdmin"
    );

    formularioMovimiento.addEventListener("submit", async function (evento) {

        evento.preventDefault();

        const datos = {
            idProducto: Number(
                document.getElementById("productoMovimientoAdmin").value
            ),

            tipoMovimiento: document.getElementById(
                "tipoMovimientoAdmin"
            ).value,

            cantidad: Number(
                document.getElementById("cantidadMovimientoAdmin").value
            ),

            motivo: document.getElementById(
                "motivoMovimientoAdmin"
            ).value
        };

        try {

            const respuesta = await fetch(
                "/Administrador/RegistrarMovimiento",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(datos)
                }
            );

            const resultado = await respuesta.json();

            if (resultado.correcto) {

                mostrarModalMovimiento(
                    "¡Movimiento registrado!",
                    resultado.mensaje,
                    true
                );

                formularioMovimiento.reset();

                // Actualizar las tablas
                await cargarInventarioAdmin();
                await cargarHistorial();

            } else {

                mostrarModalMovimiento(
                    "No se pudo registrar",
                    resultado.mensaje,
                    false
                );

            }

        } catch (error) {

            console.error(
                "Error al registrar el movimiento:",
                error
            );

            mostrarModalMovimiento(
                "Error inesperado",
                "Ocurrió un problema al registrar el movimiento. Inténtalo nuevamente.",
                false
            );

        }

    });

    iniciarHistorial();
});