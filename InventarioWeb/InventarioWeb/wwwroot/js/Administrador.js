document.addEventListener("DOMContentLoaded", function () {

    // ==============================
    // BOTONES PRINCIPALES
    // ==============================

    const btnAgregar = document.getElementById("btnAgregarProducto");
    const btnActualizar = document.getElementById("btnActualizarProducto");
    const btnEliminar = document.getElementById("btnEliminarProducto");


    // ==============================
    // FORMULARIOS
    // ==============================

    const formAgregar = document.getElementById("formAgregarProducto");
    const formActualizar = document.getElementById("formActualizarProducto");
    const formEliminar = document.getElementById("formEliminarProducto");


    // ==============================
    // PRODUCTOS DE PRUEBA
    // ==============================

    const productos = {};

    // ===============================
    // FUNCIONES PARA CARGAR CATEGORÍAS
    // ===============================

    async function cargarCategorias() {
        try {
            const respuesta = await fetch('/Categorias/ObtenerCategorias');

            if (!respuesta.ok) {
                throw new Error('No se pudieron obtener las categorías.');
            }

            const categorias = await respuesta.json();

            const selectAgregar = document.getElementById('categoriaProducto');
            const selectActualizar = document.getElementById('categoriaActualizar');

            selectAgregar.innerHTML = '<option value="">Selecciona una categoría</option>';
            selectActualizar.innerHTML = '<option value="">Selecciona una categoría</option>';

            categorias.forEach(categoria => {
                const opcionAgregar = document.createElement('option');
                opcionAgregar.value = categoria.id;
                opcionAgregar.textContent = categoria.nombre;

                const opcionActualizar = document.createElement('option');
                opcionActualizar.value = categoria.id;
                opcionActualizar.textContent = categoria.nombre;

                selectAgregar.appendChild(opcionAgregar);
                selectActualizar.appendChild(opcionActualizar);
            });

        } catch (error) {
            console.error('Error al cargar categorías:', error);
        }
    }


    // ===============================
    // FUNCIONES PARA CARGAR PROVEEDORES
    // ===============================

    async function cargarProveedores() {
        try {
            const respuesta = await fetch('/Proveedores/ObtenerProveedores');

            if (!respuesta.ok) {
                throw new Error('No se pudieron obtener los proveedores.');
            }

            const proveedores = await respuesta.json();

            const selectAgregar = document.getElementById('proveedorProducto');
            const selectActualizar = document.getElementById('proveedorActualizar');

            selectAgregar.innerHTML = '<option value="">Selecciona un proveedor</option>';
            selectActualizar.innerHTML = '<option value="">Selecciona un proveedor</option>';

            proveedores.forEach(proveedor => {
                const opcionAgregar = document.createElement('option');
                opcionAgregar.value = proveedor.id;
                opcionAgregar.textContent = proveedor.nombreEmpresa;

                const opcionActualizar = document.createElement('option');
                opcionActualizar.value = proveedor.id;
                opcionActualizar.textContent = proveedor.nombreEmpresa;

                selectAgregar.appendChild(opcionAgregar);
                selectActualizar.appendChild(opcionActualizar);
            });

        } catch (error) {
            console.error('Error al cargar proveedores:', error);
        }
    }


    // ==============================
    // MODAL
    // ==============================

    const modalElemento =
        document.getElementById("modalResultadoProducto");

    const modalResultado =
        new bootstrap.Modal(modalElemento);

    const modalTitulo =
        document.getElementById("modalResultadoTitulo");

    const modalMensaje =
        document.getElementById("modalResultadoMensaje");


    function mostrarModal(titulo, mensaje) {

        modalTitulo.textContent = titulo;
        modalMensaje.textContent = mensaje;

        modalResultado.show();

    }


    // ==============================
    // CAMBIAR OPCIÓN ACTIVA
    // ==============================

    function activarOpcion(boton) {

        btnAgregar.classList.remove("activo");
        btnActualizar.classList.remove("activo");
        btnEliminar.classList.remove("activo");

        boton.classList.add("activo");

    }


    // ==============================
    // MOSTRAR FORMULARIO
    // ==============================

    function mostrarFormulario(formulario) {

        formAgregar.style.display = "none";
        formActualizar.style.display = "none";
        formEliminar.style.display = "none";

        formulario.style.display = "block";

    }


    // ==============================
    // LIMPIAR FORMULARIO AGREGAR
    // ==============================

    function limpiarFormularioAgregar() {

        document.getElementById("codigoBarras").value = "";
        document.getElementById("nombreProducto").value = "";
        document.getElementById("categoriaProducto").value = "";
        document.getElementById("proveedorProducto").value = "";
        document.getElementById("precioCompra").value = "";
        document.getElementById("precioVenta").value = "";
        document.getElementById("stockMinimo").value = "";
        document.getElementById("descripcionProducto").value = "";

    }


    // ==============================
    // LIMPIAR FORMULARIO ACTUALIZAR
    // ==============================

    function limpiarFormularioActualizar() {

        document.getElementById("productoActualizar").value = "";
        document.getElementById("codigoActualizar").value = "";
        document.getElementById("nombreActualizar").value = "";
        document.getElementById("categoriaActualizar").value = "";
        document.getElementById("proveedorActualizar").value = "";
        document.getElementById("precioCompraActualizar").value = "";
        document.getElementById("precioVentaActualizar").value = "";
        document.getElementById("stockMinimoActualizar").value = "";
        document.getElementById("descripcionActualizar").value = "";

    }


    // ==============================
    // LIMPIAR FORMULARIO ELIMINAR
    // ==============================

    function limpiarFormularioEliminar() {

        document.getElementById("productoEliminar").value = "";
        document.getElementById("idProductoEliminar").value = "";
        document.getElementById("codigoEliminar").value = "";
        document.getElementById("nombreEliminar").value = "";
        document.getElementById("categoriaEliminar").value = "";
        document.getElementById("proveedorEliminar").value = "";

    }


    // ==============================
    // LIMPIAR ERRORES
    // ==============================

    function limpiarErrores(formulario) {

        formulario.querySelectorAll(".campo-error")
            .forEach(function (campo) {

                campo.classList.remove("campo-error");

            });

        formulario.querySelectorAll(".mensaje-error")
            .forEach(function (mensaje) {

                mensaje.remove();

            });

    }


    // ==============================
    // MOSTRAR ERROR
    // ==============================

    function mostrarError(campo, mensaje) {

        campo.classList.add("campo-error");

        const mensajeError =
            document.createElement("div");

        mensajeError.className = "mensaje-error";
        mensajeError.textContent = mensaje;

        const contenedor =
            campo.closest(".col-md-4, .col-md-6, .col-12");

        if (contenedor) {
            contenedor.appendChild(mensajeError);
        }

    }


    // ==============================
    // VALIDAR CAMPO
    // ==============================

    function validarCampo(campo, mensaje) {

        if (campo.value.trim() === "") {

            mostrarError(campo, mensaje);

            return true;

        }

        return false;

    }


    // ==============================
    // QUITAR ERROR
    // ==============================

    function quitarError(campo) {

        campo.classList.remove("campo-error");

        const contenedor =
            campo.closest(".col-md-4, .col-md-6, .col-12");

        if (!contenedor) {
            return;
        }

        const mensaje =
            contenedor.querySelector(".mensaje-error");

        if (mensaje) {
            mensaje.remove();
        }

    }


    // ==============================
    // CONFIGURAR ERRORES
    // ==============================

    function configurarErrores(formulario) {

        formulario.querySelectorAll(
            "input, select, textarea"
        ).forEach(function (campo) {

            campo.addEventListener("input", function () {

                if (campo.value.trim() !== "") {
                    quitarError(campo);
                }

            });

            campo.addEventListener("change", function () {

                if (campo.value.trim() !== "") {
                    quitarError(campo);
                }

            });

        });

    }


    configurarErrores(formAgregar);
    configurarErrores(formActualizar);
    configurarErrores(formEliminar);


    // ==============================
    // CONTADOR
    // ==============================

    function actualizarContador() {

        const cantidad =
            document.querySelectorAll(
                "#tablaProductosBody tr"
            ).length;

        document.getElementById(
            "contadorProductos"
        ).textContent = cantidad + " productos";

    }


    // ==============================
    // CREAR FILA DE PRODUCTO
    // ==============================

    function crearFilaProducto(producto) {

        const fila = document.createElement("tr");

        fila.innerHTML = `
        <td>
            <span class="producto-id">
                ${producto.id}
            </span>
        </td>

        <td>
            <span class="codigo-producto">
                ${producto.codigo}
            </span>
        </td>

        <td>
            <div class="producto-nombre">

                <div class="producto-icono">
                    <i class="bi bi-box-seam"></i>
                </div>

                <div>
                    <strong>${producto.nombre}</strong>

                    <small>
                        ${producto.descripcion || "Sin descripción"}
                    </small>
                </div>

            </div>
        </td>

        <td>
            ${producto.categoria}
        </td>

        <td>
            ${producto.proveedor}
        </td>

        <td>
            $${parseFloat(producto.precioCompra).toFixed(2)}
        </td>

        <td>
            $${parseFloat(producto.precioVenta).toFixed(2)}
        </td>

        <td>
            <span class="${producto.stockActual <= producto.stockMinimo ? "stock-bajo" : "stock-normal"}">
                ${producto.stockActual}
            </span>
        </td>

        <td>
            ${producto.stockMinimo}
        </td>
    `;

        return fila;
    }

    /*CARGAR LOS PRODUCTOS MEDIANTE LA APIIIII */

    async function cargarProductos() {

        try {

            const respuesta =
                await fetch("/Productos/ObtenerProductos");

            if (!respuesta.ok) {
                throw new Error("No se pudieron obtener los productos.");
            }

            const productosAPI =
                await respuesta.json();


            const tabla =
                document.getElementById("tablaProductosBody");


            tabla.innerHTML = "";


            productosAPI.forEach(function (productoAPI) {

                const producto = {

                    id: productoAPI.id,

                    codigo: productoAPI.codigoBarras,

                    nombre: productoAPI.nombre,

                    categoriaId: productoAPI.idCategoria,

                    categoria: productoAPI.nombreCategoria,

                    proveedorId: productoAPI.idProveedor,

                    proveedor: productoAPI.nombreProveedor,

                    precioCompra: productoAPI.precioCompra,

                    precioVenta: productoAPI.precioVenta,

                    stockActual: productoAPI.stockActual,

                    stockMinimo: productoAPI.stockMinimo,

                    descripcion: productoAPI.descripcion

                };


                productos[producto.id] = producto;


                const fila =
                    crearFilaProducto(producto);


                tabla.appendChild(fila);


                agregarProductoASelects(producto);

            });


            actualizarContador();

        }
        catch (error) {

            console.error(
                "Error al cargar productos:",
                error
            );

        }

    }

    // ==============================
    // AGREGAR PRODUCTO A SELECTS
    // ==============================

    function agregarProductoASelects(producto) {

        const selectActualizar =
            document.getElementById("productoActualizar");

        const selectEliminar =
            document.getElementById("productoEliminar");


        const opcionActualizar =
            document.createElement("option");

        opcionActualizar.value = producto.id;

        opcionActualizar.textContent =
            "ID " + producto.id + " - " + producto.nombre;


        const opcionEliminar =
            document.createElement("option");

        opcionEliminar.value = producto.id;

        opcionEliminar.textContent =
            "ID " + producto.id + " - " + producto.nombre;


        selectActualizar.appendChild(opcionActualizar);
        selectEliminar.appendChild(opcionEliminar);

    }


    // ==============================
    // ACTUALIZAR OPCIÓN EN SELECTS
    // ==============================

    function actualizarProductoEnSelects(producto) {

        const selects = [

            document.getElementById(
                "productoActualizar"
            ),

            document.getElementById(
                "productoEliminar"
            )

        ];


        selects.forEach(function (select) {

            const opcion =
                select.querySelector(
                    'option[value="' + producto.id + '"]'
                );

            if (opcion) {

                opcion.textContent =
                    "ID " +
                    producto.id +
                    " - " +
                    producto.nombre;

            }

        });

    }


    // ==============================
    // ELIMINAR DE SELECTS
    // ==============================

    function eliminarProductoDeSelects(id) {

        const selects = [

            document.getElementById(
                "productoActualizar"
            ),

            document.getElementById(
                "productoEliminar"
            )

        ];


        selects.forEach(function (select) {

            const opcion =
                select.querySelector(
                    'option[value="' + id + '"]'
                );

            if (opcion) {
                opcion.remove();
            }

        });

    }


    // ==============================
    // AGREGAR
    // ==============================

    btnAgregar.addEventListener("click", function () {

        activarOpcion(btnAgregar);

        mostrarFormulario(formAgregar);

    });


    // ==============================
    // ACTUALIZAR
    // ==============================

    btnActualizar.addEventListener("click", function () {

        activarOpcion(btnActualizar);

        mostrarFormulario(formActualizar);

    });


    // ==============================
    // ELIMINAR
    // ==============================

    btnEliminar.addEventListener("click", function () {

        activarOpcion(btnEliminar);

        mostrarFormulario(formEliminar);

    });


    // ==============================
    // AGREGAR - GUARDAR USO DE LA APIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII
    // ==============================

    document
        .getElementById("btnGuardarProducto")
        .addEventListener("click", async function () {

            limpiarErrores(formAgregar);

            let hayErrores = false;

            const codigo =
                document.getElementById("codigoBarras").value.trim();

            const nombre =
                document.getElementById("nombreProducto").value.trim();

            const categoria =
                document.getElementById("categoriaProducto").value;

            const proveedor =
                document.getElementById("proveedorProducto").value;

            const precioCompra =
                document.getElementById("precioCompra").value;

            const precioVenta =
                document.getElementById("precioVenta").value;

            const stockMinimo =
                document.getElementById("stockMinimo").value;

            const descripcion =
                document.getElementById("descripcionProducto").value.trim();


            // VALIDACIONES

            hayErrores =
                validarCampo(
                    document.getElementById("codigoBarras"),
                    "El código de barras es obligatorio."
                ) || hayErrores;

            hayErrores =
                validarCampo(
                    document.getElementById("nombreProducto"),
                    "El nombre del producto es obligatorio."
                ) || hayErrores;

            hayErrores =
                validarCampo(
                    document.getElementById("categoriaProducto"),
                    "Selecciona una categoría."
                ) || hayErrores;

            hayErrores =
                validarCampo(
                    document.getElementById("proveedorProducto"),
                    "Selecciona un proveedor."
                ) || hayErrores;

            hayErrores =
                validarCampo(
                    document.getElementById("precioCompra"),
                    "El precio de compra es obligatorio."
                ) || hayErrores;

            hayErrores =
                validarCampo(
                    document.getElementById("precioVenta"),
                    "El precio de venta es obligatorio."
                ) || hayErrores;

            hayErrores =
                validarCampo(
                    document.getElementById("stockMinimo"),
                    "El stock mínimo es obligatorio."
                ) || hayErrores;


            if (hayErrores) {
                return;
            }


            // PREPARAR PRODUCTO PARA LA API

            const nuevoProducto = {

                codigoBarras: codigo,
                nombre: nombre,
                descripcion: descripcion,

                idCategoria: Number(categoria),
                idProveedor: Number(proveedor),

                precioCompra: Number(precioCompra),
                precioVenta: Number(precioVenta),

                stockMinimo: Number(stockMinimo)

            };


            // EVITAR DOBLE CLIC

            const botonGuardar =
                document.getElementById("btnGuardarProducto");

            botonGuardar.disabled = true;

            try {

                // ENVIAR PRODUCTO AL MVC

                const respuesta = await fetch(
                    "/Productos/AgregarProducto",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(nuevoProducto)
                    }
                );


                const resultado = await respuesta.json();


                // REVISAR SI HUBO UN ERROR

                if (!respuesta.ok) {

                    mostrarModal(
                        "No se pudo agregar",
                        resultado.mensaje ||
                        "Ocurrió un error al registrar el producto."
                    );

                    return;
                }


                // OBTENER LOS TEXTOS DE LOS SELECTS

                const categoriaSelect =
                    document.getElementById("categoriaProducto");

                const proveedorSelect =
                    document.getElementById("proveedorProducto");


                const categoriaTexto =
                    categoriaSelect.options[
                        categoriaSelect.selectedIndex
                    ].text;


                const proveedorTexto =
                    proveedorSelect.options[
                        proveedorSelect.selectedIndex
                    ].text;


                // CREAR OBJETO CON EL ID REAL DE NEON

                const productoGuardado = {

                    id: resultado.id,

                    codigo: codigo,
                    nombre: nombre,

                    categoriaId: categoria,
                    categoria: categoriaTexto,

                    proveedorId: proveedor,
                    proveedor: proveedorTexto,

                    precioCompra: precioCompra,
                    precioVenta: precioVenta,

                    stockActual: 0,
                    stockMinimo: stockMinimo,

                    descripcion: descripcion

                };


                // GUARDAR EN LA LISTA DE JAVASCRIPT

                productos[productoGuardado.id] =
                    productoGuardado;


                // AGREGAR FILA A LA TABLA

                const fila =
                    crearFilaProducto(productoGuardado);

                document
                    .getElementById("tablaProductosBody")
                    .appendChild(fila);


                // AGREGAR A LOS SELECTS DE ACTUALIZAR Y ELIMINAR

                agregarProductoASelects(productoGuardado);


                // ACTUALIZAR CONTADOR

                actualizarContador();


                // LIMPIAR FORMULARIO

                limpiarFormularioAgregar();

                limpiarErrores(formAgregar);


                // MOSTRAR CONFIRMACIÓN

                mostrarModal(
                    "Producto agregado",
                    "El producto se guardó correctamente en el inventario."
                );

            }
            catch (error) {

                console.error("Error al agregar producto:", error);

                mostrarModal(
                    "Error de conexión",
                    "No fue posible comunicarse con el servidor. Verifica que la API esté ejecutándose."
                );

            }
            finally {

                botonGuardar.disabled = false;

            }

        });


    // ==============================
    // ACTUALIZAR - SELECCIONAR
    // ==============================

    document
        .getElementById("productoActualizar")
        .addEventListener("change", function () {

            const id = this.value;

            const producto =
                productos[id];


            if (!producto) {

                limpiarFormularioActualizar();

                return;

            }


            document.getElementById(
                "codigoActualizar"
            ).value = producto.codigo;

            document.getElementById(
                "nombreActualizar"
            ).value = producto.nombre;

            document.getElementById(
                "categoriaActualizar"
            ).value = producto.categoriaId;

            document.getElementById(
                "proveedorActualizar"
            ).value = producto.proveedorId;

            document.getElementById(
                "precioCompraActualizar"
            ).value = producto.precioCompra;

            document.getElementById(
                "precioVentaActualizar"
            ).value = producto.precioVenta;

            document.getElementById(
                "stockMinimoActualizar"
            ).value = producto.stockMinimo;

            document.getElementById(
                "descripcionActualizar"
            ).value = producto.descripcion;

        });// ACA TERMINA AGREGAR


    // ==============================
    // ACTUALIZAR - GUARDAR
    // ==============================

    document
        .getElementById("btnGuardarActualizar")
        .addEventListener("click", async function () {

            limpiarErrores(formActualizar);

            let hayErrores = false;

            const id =
                document.getElementById(
                    "productoActualizar"
                ).value;

            const codigo =
                document.getElementById(
                    "codigoActualizar"
                ).value.trim();

            const nombre =
                document.getElementById(
                    "nombreActualizar"
                ).value.trim();

            const categoria =
                document.getElementById(
                    "categoriaActualizar"
                ).value;

            const proveedor =
                document.getElementById(
                    "proveedorActualizar"
                ).value;

            const precioCompra =
                document.getElementById(
                    "precioCompraActualizar"
                ).value;

            const precioVenta =
                document.getElementById(
                    "precioVentaActualizar"
                ).value;

            const stockMinimo =
                document.getElementById(
                    "stockMinimoActualizar"
                ).value;

            const descripcion =
                document.getElementById(
                    "descripcionActualizar"
                ).value.trim();


            // VALIDACIONES

            hayErrores =
                validarCampo(
                    document.getElementById(
                        "productoActualizar"
                    ),
                    "Selecciona el producto que deseas actualizar."
                ) || hayErrores;

            hayErrores =
                validarCampo(
                    document.getElementById(
                        "codigoActualizar"
                    ),
                    "El código de barras es obligatorio."
                ) || hayErrores;

            hayErrores =
                validarCampo(
                    document.getElementById(
                        "nombreActualizar"
                    ),
                    "El nombre del producto es obligatorio."
                ) || hayErrores;

            hayErrores =
                validarCampo(
                    document.getElementById(
                        "categoriaActualizar"
                    ),
                    "Selecciona una categoría."
                ) || hayErrores;

            hayErrores =
                validarCampo(
                    document.getElementById(
                        "proveedorActualizar"
                    ),
                    "Selecciona un proveedor."
                ) || hayErrores;

            hayErrores =
                validarCampo(
                    document.getElementById(
                        "precioCompraActualizar"
                    ),
                    "El precio de compra es obligatorio."
                ) || hayErrores;

            hayErrores =
                validarCampo(
                    document.getElementById(
                        "precioVentaActualizar"
                    ),
                    "El precio de venta es obligatorio."
                ) || hayErrores;

            hayErrores =
                validarCampo(
                    document.getElementById(
                        "stockMinimoActualizar"
                    ),
                    "El stock mínimo es obligatorio."
                ) || hayErrores;


            if (hayErrores) {
                return;
            }


            const producto =
                productos[id];


            if (!producto) {

                mostrarModal(
                    "Error",
                    "No se encontró el producto seleccionado."
                );

                return;

            }


            // TEXTOS

            const categoriaSelect =
                document.getElementById(
                    "categoriaActualizar"
                );

            const proveedorSelect =
                document.getElementById(
                    "proveedorActualizar"
                );


            const categoriaTexto =
                categoriaSelect.options[
                    categoriaSelect.selectedIndex
                ].text;


            const proveedorTexto =
                proveedorSelect.options[
                    proveedorSelect.selectedIndex
                ].text;


            // ==============================
            // ACTUALIZAR EN LA BASE DE DATOS
            // ==============================

            const productoActualizado = {

                codigoBarras: codigo,

                nombre: nombre,

                descripcion: descripcion,

                idCategoria: Number(categoria),

                idProveedor: Number(proveedor),

                precioCompra: Number(precioCompra),

                precioVenta: Number(precioVenta),

                stockMinimo: Number(stockMinimo)

            };


            try {

                const respuesta =
                    await fetch(
                        `/Productos/ActualizarProducto/${id}`,
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type": "application/json"
                            },

                            body: JSON.stringify(
                                productoActualizado
                            )
                        }
                    );


                const texto =
                    await respuesta.text();

                if (!respuesta.ok) {

                    console.error(
                        "Código de error:",
                        respuesta.status
                    );

                    console.error(
                        "Respuesta del servidor:",
                        texto
                    );

                    mostrarModal(
                        "Error " + respuesta.status,
                        texto || "El servidor no devolvió información."
                    );

                    return;
                }


            }
            catch (error) {

                console.error(
                    "Error de conexión:",
                    error
                );

                mostrarModal(
                    "Error",
                    "No se pudo conectar con el servidor."
                );

                return;

            }
            // ACTUALIZAR OBJETO

            producto.codigo = codigo;
            producto.nombre = nombre;

            producto.categoriaId = categoria;
            producto.categoria = categoriaTexto;

            producto.proveedorId = proveedor;
            producto.proveedor = proveedorTexto;

            producto.precioCompra = precioCompra;
            producto.precioVenta = precioVenta;

            producto.stockMinimo = stockMinimo;
            producto.descripcion = descripcion;


            // BUSCAR FILA

            const filas =
                document.querySelectorAll(
                    "#tablaProductosBody tr"
                );

            let filaEncontrada = null;


            filas.forEach(function (fila) {

                const idFila =
                    fila.querySelector(
                        ".producto-id"
                    );

                if (
                    idFila &&
                    idFila.textContent.trim() === id
                ) {

                    filaEncontrada = fila;

                }

            });


            if (!filaEncontrada) {

                mostrarModal(
                    "Error",
                    "No se encontró el producto en la tabla."
                );

                return;

            }


            // REEMPLAZAR FILA

            const nuevaFila =
                crearFilaProducto(producto);


            filaEncontrada.replaceWith(
                nuevaFila
            );


            actualizarProductoEnSelects(
                producto
            );


            limpiarFormularioActualizar();

            limpiarErrores(formActualizar);


            mostrarModal(
                "Producto actualizado",
                "La información del producto se actualizó correctamente."
            );

        });//ACA TERMINA ACTUALIZAR


    // ==============================
    // ELIMINAR - SELECCIONAR
    // ==============================

    document
        .getElementById("productoEliminar")
        .addEventListener("change", function () {

            const id = this.value;

            const producto =
                productos[id];


            if (!producto) {

                limpiarFormularioEliminar();

                return;

            }


            document.getElementById(
                "idProductoEliminar"
            ).value = producto.id;


            document.getElementById(
                "codigoEliminar"
            ).value = producto.codigo;


            document.getElementById(
                "nombreEliminar"
            ).value = producto.nombre;


            document.getElementById(
                "categoriaEliminar"
            ).value = producto.categoria;


            document.getElementById(
                "proveedorEliminar"
            ).value = producto.proveedor;

        });


    // ==============================
    // ELIMINAR - CONFIRMAR
    // ==============================

    document
        .getElementById("btnConfirmarEliminar")
        .addEventListener("click", async function () {

            limpiarErrores(formEliminar);


            const id =
                document.getElementById(
                    "productoEliminar"
                ).value;


            if (id === "") {

                mostrarError(
                    document.getElementById(
                        "productoEliminar"
                    ),
                    "Selecciona el producto que deseas eliminar."
                );

                return;

            }


            const producto =
                productos[id];


            if (!producto) {

                mostrarModal(
                    "Error",
                    "No se encontró el producto seleccionado."
                );

                return;

            }


            const confirmar =
                confirm(
                    "¿Seguro que deseas eliminar el producto " +
                    producto.nombre +
                    "?"
                );


            if (!confirmar) {
                return;
            }

            // ELIMINAR DE LA BASE DE DATOS

            try {

                const respuesta = await fetch(
                    `/Productos/EliminarProducto/${id}`,
                    {
                        method: "DELETE"
                    }
                );

                const contenido = await respuesta.text();

                if (!respuesta.ok) {

                    mostrarModal(
                        "Error",
                        "No se pudo eliminar el producto. Código: " +
                        respuesta.status
                    );

                    return;
                }

            }
            catch (error) {

                console.error("ERROR AL ELIMINAR:", error);

                mostrarModal(
                    "Error",
                    "No fue posible comunicarse con el servidor."
                );

                return;
            }


            // ELIMINAR DEL OBJETO

            delete productos[id];


            // BUSCAR FILA

            const filas =
                document.querySelectorAll(
                    "#tablaProductosBody tr"
                );


            filas.forEach(function (fila) {

                const idFila =
                    fila.querySelector(
                        ".producto-id"
                    );


                if (
                    idFila &&
                    idFila.textContent.trim() === id
                ) {

                    fila.remove();

                }

            });


            eliminarProductoDeSelects(id);

            actualizarContador();

            limpiarFormularioEliminar();


            mostrarModal(
                "Producto eliminado",
                "El producto se eliminó correctamente del inventario."
            );

        });


    // ==============================
    // CANCELAR AGREGAR
    // ==============================

    document
        .querySelector(
            "#formAgregarProducto .btn-cancelar-producto"
        )
        .addEventListener("click", function () {

            limpiarErrores(formAgregar);

            limpiarFormularioAgregar();

            formAgregar.style.display = "none";

        });


    // ==============================
    // CANCELAR ACTUALIZAR
    // ==============================

    document
        .getElementById("btnCancelarActualizar")
        .addEventListener("click", function () {

            limpiarErrores(formActualizar);

            limpiarFormularioActualizar();

            formActualizar.style.display = "none";

        });


    // ==============================
    // CANCELAR ELIMINAR
    // ==============================

    document
        .getElementById("btnCancelarEliminar")
        .addEventListener("click", function () {

            limpiarErrores(formEliminar);

            limpiarFormularioEliminar();

            formEliminar.style.display = "none";

        });
    // ==============================
    // CARGAR PRODUCTOS DESDE LA API
    // ==============================

    cargarCategorias();
    cargarProveedores();
    cargarProductos();

    window.addEventListener(
        "categoriasActualizadas",
        function () {
            cargarCategorias();
        }
    );


    window.addEventListener(
        "proveedoresActualizados",
        function () {
            cargarProveedores();
        }
    );
});