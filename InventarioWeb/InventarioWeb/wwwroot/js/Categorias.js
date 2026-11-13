document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // VARIABLES
    // ==========================================

    let categorias = [];


    // ==========================================
    // BOTONES PRINCIPALES
    // ==========================================

    const btnAgregarCategoria =
        document.getElementById("btnAgregarCategoria");

    const btnActualizarCategoria =
        document.getElementById("btnActualizarCategoria");

    const btnEliminarCategoria =
        document.getElementById("btnEliminarCategoria");


    // ==========================================
    // FORMULARIOS
    // ==========================================

    const formAgregarCategoria =
        document.getElementById("formAgregarCategoria");

    const formActualizarCategoria =
        document.getElementById("formActualizarCategoria");

    const formEliminarCategoria =
        document.getElementById("formEliminarCategoria");


    // ==========================================
    // AGREGAR
    // ==========================================

    const nombreCategoria =
        document.getElementById("nombreCategoria");

    const descripcionCategoria =
        document.getElementById("descripcionCategoria");

    const btnGuardarCategoria =
        document.getElementById("btnGuardarCategoria");

    const btnCancelarAgregarCategoria =
        document.getElementById("btnCancelarAgregarCategoria");


    // ==========================================
    // ERRORES AGREGAR
    // ==========================================

    const errorNombreCategoria =
        document.getElementById("errorNombreCategoria");


    // ==========================================
    // ACTUALIZAR
    // ==========================================

    // IMPORTANTE:
    // Se busca dentro del formulario para evitar
    // conflictos con Productos.

    const categoriaActualizar =
        formActualizarCategoria.querySelector("#categoriaActualizar");

    const idCategoriaActualizar =
        document.getElementById("idCategoriaActualizar");

    const nombreCategoriaActualizar =
        document.getElementById("nombreCategoriaActualizar");

    const descripcionCategoriaActualizar =
        document.getElementById("descripcionCategoriaActualizar");

    const btnGuardarActualizarCategoria =
        document.getElementById("btnGuardarActualizarCategoria");

    const btnCancelarActualizarCategoria =
        document.getElementById("btnCancelarActualizarCategoria");


    // ==========================================
    // ERRORES ACTUALIZAR
    // ==========================================

    const errorCategoriaActualizar =
        document.getElementById("errorCategoriaActualizar");

    const errorNombreCategoriaActualizar =
        document.getElementById("errorNombreCategoriaActualizar");


    // ==========================================
    // ELIMINAR
    // ==========================================

    // IMPORTANTE:
    // Se busca dentro del formulario para evitar
    // conflictos con Productos.

    const categoriaEliminar =
        formEliminarCategoria.querySelector("#categoriaEliminar");

    const idCategoriaEliminar =
        document.getElementById("idCategoriaEliminar");

    const nombreCategoriaEliminar =
        document.getElementById("nombreCategoriaEliminar");

    const descripcionCategoriaEliminar =
        document.getElementById("descripcionCategoriaEliminar");

    const btnConfirmarEliminarCategoria =
        document.getElementById("btnConfirmarEliminarCategoria");

    const btnCancelarEliminarCategoria =
        document.getElementById("btnCancelarEliminarCategoria");


    // ==========================================
    // ERROR ELIMINAR
    // ==========================================

    const errorCategoriaEliminar =
        document.getElementById("errorCategoriaEliminar");


    // ==========================================
    // TABLA
    // ==========================================

    const tablaCategoriasBody =
        document.getElementById("tablaCategoriasBody");

    const contadorCategorias =
        document.getElementById("contadorCategorias");


    // ==========================================
    // MODAL DE RESULTADO
    // ==========================================

    const modalResultadoCategoria =
        new bootstrap.Modal(
            document.getElementById("modalResultadoCategoria")
        );

    const modalCategoriaTitulo =
        document.getElementById("modalCategoriaTitulo");

    const modalCategoriaMensaje =
        document.getElementById("modalCategoriaMensaje");


    // ==========================================
    // MOSTRAR RESULTADO
    // ==========================================

    function mostrarResultadoCategoria(
        titulo,
        mensaje
    ) {

        modalCategoriaTitulo.textContent = titulo;
        modalCategoriaMensaje.textContent = mensaje;

        modalResultadoCategoria.show();
    }


    // ==========================================
    // FUNCIONES PARA ERRORES
    // ==========================================

    function mostrarError(elemento, mensaje) {

        elemento.textContent = mensaje;
        elemento.style.display = "block";
    }


    function ocultarError(elemento) {

        elemento.textContent = "";
        elemento.style.display = "none";
    }


    // ==========================================
    // MOSTRAR FORMULARIO
    // ==========================================

    function mostrarFormulario(
        formularioActivo,
        botonActivo
    ) {

        formAgregarCategoria.style.display = "none";
        formActualizarCategoria.style.display = "none";
        formEliminarCategoria.style.display = "none";

        btnAgregarCategoria.classList.remove("activo");
        btnActualizarCategoria.classList.remove("activo");
        btnEliminarCategoria.classList.remove("activo");

        formularioActivo.style.display = "block";
        botonActivo.classList.add("activo");
    }

    function cerrarFormularioCategoria() {

        // Ocultar todos los formularios
        formAgregarCategoria.style.display = "none";
        formActualizarCategoria.style.display = "none";
        formEliminarCategoria.style.display = "none";

        // Quitar estado activo de los botones
        btnAgregarCategoria.classList.remove("activo");
        btnActualizarCategoria.classList.remove("activo");
        btnEliminarCategoria.classList.remove("activo");

        // Limpiar formularios
        limpiarFormularioAgregar();
        limpiarFormularioActualizar();
        limpiarFormularioEliminar();
    }


    // ==========================================
    // LIMPIAR FORMULARIO AGREGAR
    // ==========================================

    function limpiarFormularioAgregar() {

        nombreCategoria.value = "";
        descripcionCategoria.value = "";

        ocultarError(errorNombreCategoria);
    }


    // ==========================================
    // LIMPIAR FORMULARIO ACTUALIZAR
    // ==========================================

    function limpiarFormularioActualizar() {

        categoriaActualizar.value = "";

        idCategoriaActualizar.value = "";

        nombreCategoriaActualizar.value = "";

        descripcionCategoriaActualizar.value = "";

        ocultarError(errorCategoriaActualizar);

        ocultarError(errorNombreCategoriaActualizar);
    }


    // ==========================================
    // LIMPIAR FORMULARIO ELIMINAR
    // ==========================================

    function limpiarFormularioEliminar() {

        categoriaEliminar.value = "";

        idCategoriaEliminar.value = "";

        nombreCategoriaEliminar.value = "";

        descripcionCategoriaEliminar.value = "";

        ocultarError(errorCategoriaEliminar);
    }


    // ==========================================
    // CARGAR CATEGORÍAS
    // ==========================================

    async function cargarCategorias() {

        try {

            console.log("Cargando categorías...");

            const respuesta = await fetch(
                "/Categorias/ObtenerCategorias"
            );

            console.log("Respuesta:", respuesta);

            console.log("Status:", respuesta.status);


            if (!respuesta.ok) {

                throw new Error(
                    "No se pudieron obtener las categorías."
                );
            }


            const texto = await respuesta.text();

            console.log("JSON recibido:", texto);


            categorias = JSON.parse(texto);

            console.log(
                "Categorías cargadas:",
                categorias
            );


            mostrarCategorias();

            llenarSelectActualizar();

            llenarSelectEliminar();

        }
        catch (error) {

            console.error(
                "ERROR AL CARGAR CATEGORÍAS:",
                error
            );
        }
    }


    // ==========================================
    // MOSTRAR CATEGORÍAS EN TABLA
    // ==========================================

    function mostrarCategorias() {

        tablaCategoriasBody.innerHTML = "";


        categorias.forEach(function (categoria) {

            const fila =
                document.createElement("tr");


            fila.innerHTML = `
                <td>
                    <span class="categoria-id">
                        ${categoria.id}
                    </span>
                </td>

                <td>
                    <div class="categoria-nombre">
                        <i class="bi bi-tag categoria-icono"></i>
                        ${categoria.nombre}
                    </div>
                </td>

                <td>
                    <span class="descripcion-categoria">
                        ${categoria.descripcion || "Sin descripción"}
                    </span>
                </td>
            `;


            tablaCategoriasBody.appendChild(fila);
        });


        const cantidad =
            categorias.length;


        if (cantidad === 1) {

            contadorCategorias.textContent =
                "1 categoría";

        }
        else {

            contadorCategorias.textContent =
                cantidad + " categorías";
        }
    }


    // ==========================================
    // LLENAR SELECT ACTUALIZAR
    // ==========================================

    function llenarSelectActualizar() {

        categoriaActualizar.innerHTML = `
            <option value="">
                Selecciona una categoría
            </option>
        `;


        categorias.forEach(function (categoria) {

            const opcion =
                document.createElement("option");


            opcion.value =
                categoria.id;


            opcion.textContent =
                categoria.id +
                " - " +
                categoria.nombre;


            categoriaActualizar.appendChild(opcion);
        });
    }


    // ==========================================
    // LLENAR SELECT ELIMINAR
    // ==========================================

    function llenarSelectEliminar() {

        categoriaEliminar.innerHTML = `
            <option value="">
                Selecciona una categoría
            </option>
        `;


        categorias.forEach(function (categoria) {

            const opcion =
                document.createElement("option");


            opcion.value =
                categoria.id;


            opcion.textContent =
                categoria.id +
                " - " +
                categoria.nombre;


            categoriaEliminar.appendChild(opcion);
        });
    }


    // ==========================================
    // CAMBIO DE CATEGORÍA - ACTUALIZAR
    // ==========================================

    categoriaActualizar.addEventListener(
        "change",
        function () {

            const id =
                parseInt(
                    categoriaActualizar.value
                );


            if (!id) {

                limpiarFormularioActualizar();

                return;
            }


            // Ya seleccionó una categoría
            ocultarError(
                errorCategoriaActualizar
            );


            const categoria =
                categorias.find(
                    function (item) {

                        return item.id === id;
                    }
                );


            if (!categoria) {

                return;
            }


            idCategoriaActualizar.value =
                categoria.id;


            nombreCategoriaActualizar.value =
                categoria.nombre;


            descripcionCategoriaActualizar.value =
                categoria.descripcion || "";


            // Como ya hay nombre cargado,
            // no mostramos error de nombre.
            ocultarError(
                errorNombreCategoriaActualizar
            );
        }
    );


    // ==========================================
    // CAMBIO DE CATEGORÍA - ELIMINAR
    // ==========================================

    categoriaEliminar.addEventListener(
        "change",
        function () {

            const id =
                parseInt(
                    categoriaEliminar.value
                );


            if (!id) {

                limpiarFormularioEliminar();

                return;
            }


            ocultarError(
                errorCategoriaEliminar
            );


            const categoria =
                categorias.find(
                    function (item) {

                        return item.id === id;
                    }
                );


            if (!categoria) {

                return;
            }


            idCategoriaEliminar.value =
                categoria.id;


            nombreCategoriaEliminar.value =
                categoria.nombre;


            descripcionCategoriaEliminar.value =
                categoria.descripcion || "";
        }
    );


    // ==========================================
    // QUITAR ERROR AL ESCRIBIR NOMBRE
    // ==========================================

    nombreCategoria.addEventListener(
        "input",
        function () {

            if (
                nombreCategoria.value.trim() !== ""
            ) {

                ocultarError(
                    errorNombreCategoria
                );
            }
        }
    );


    // ==========================================
    // QUITAR ERROR AL ESCRIBIR
    // NOMBRE ACTUALIZAR
    // ==========================================

    nombreCategoriaActualizar.addEventListener(
        "input",
        function () {

            if (
                nombreCategoriaActualizar.value.trim() !== ""
            ) {

                ocultarError(
                    errorNombreCategoriaActualizar
                );
            }
        }
    );


    // ==========================================
    // AGREGAR CATEGORÍA
    // ==========================================

    async function agregarCategoria() {

        const nombre =
            nombreCategoria.value.trim();

        const descripcion =
            descripcionCategoria.value.trim();


        // ==========================================
        // VALIDAR NOMBRE
        // ==========================================

        if (nombre === "") {

            mostrarError(
                errorNombreCategoria,
                "El nombre de la categoría es obligatorio."
            );

            nombreCategoria.focus();

            return;
        }


        // ==========================================
        // ENVIAR
        // ==========================================

        try {

            btnGuardarCategoria.disabled = true;


            const respuesta =
                await fetch(
                    "/Categorias/AgregarCategoria",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            nombre: nombre,

                            descripcion:
                                descripcion === ""
                                    ? null
                                    : descripcion
                        })
                    }
                );


            const resultado =
                await respuesta.json();


            if (!respuesta.ok) {

                alert(
                    resultado.mensaje ||
                    "No se pudo agregar la categoría."
                );

                return;
            }


            // ==========================================
            // ÉXITO
            // ==========================================

            mostrarResultadoCategoria(
                "Categoría agregada",
                "La categoría se agregó correctamente al inventario."
            );


            limpiarFormularioAgregar();


            await cargarCategorias();


            window.dispatchEvent(
                new Event(
                    "categoriasActualizadas"
                )
            );
        }
        catch (error) {

            console.error(
                "Error al agregar categoría:",
                error
            );

            alert(
                "Ocurrió un error al agregar la categoría."
            );
        }
        finally {

            btnGuardarCategoria.disabled =
                false;
        }
    }


    // ==========================================
    // ACTUALIZAR CATEGORÍA
    // ==========================================

    async function actualizarCategoria() {

        const id =
            idCategoriaActualizar.value;

        const nombre =
            nombreCategoriaActualizar.value.trim();

        const descripcion =
            descripcionCategoriaActualizar.value.trim();


        // ==========================================
        // VALIDAR CATEGORÍA
        // ==========================================

        if (id === "") {

            mostrarError(
                errorCategoriaActualizar,
                "Debes seleccionar una categoría."
            );

            categoriaActualizar.focus();

            return;
        }


        // ==========================================
        // VALIDAR NOMBRE
        // ==========================================

        if (nombre === "") {

            mostrarError(
                errorNombreCategoriaActualizar,
                "El nombre de la categoría es obligatorio."
            );

            nombreCategoriaActualizar.focus();

            return;
        }


        // ==========================================
        // ENVIAR
        // ==========================================

        try {

            btnGuardarActualizarCategoria.disabled =
                true;


            const respuesta =
                await fetch(
                    "/Categorias/ActualizarCategoria?id=" +
                    id,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            nombre: nombre,

                            descripcion:
                                descripcion === ""
                                    ? null
                                    : descripcion
                        })
                    }
                );


            const resultado =
                await respuesta.json();


            if (!respuesta.ok) {

                alert(
                    resultado.mensaje ||
                    "No se pudo actualizar la categoría."
                );

                return;
            }


            // ==========================================
            // ÉXITO
            // ==========================================

            mostrarResultadoCategoria(
                "Categoría actualizada",
                "La información de la categoría se actualizó correctamente."
            );


            limpiarFormularioActualizar();


            await cargarCategorias();


            window.dispatchEvent(
                new Event(
                    "categoriasActualizadas"
                )
            );
        }
        catch (error) {

            console.error(
                "Error al actualizar categoría:",
                error
            );

            alert(
                "Ocurrió un error al actualizar la categoría."
            );
        }
        finally {

            btnGuardarActualizarCategoria.disabled =
                false;
        }
    }


    // ==========================================
    // ELIMINAR CATEGORÍA
    // ==========================================

    async function eliminarCategoria() {

        const id =
            idCategoriaEliminar.value;


        // ==========================================
        // VALIDAR CATEGORÍA
        // ==========================================

        if (id === "") {

            mostrarError(
                errorCategoriaEliminar,
                "Debes seleccionar una categoría."
            );

            categoriaEliminar.focus();

            return;
        }


        // ==========================================
        // CONFIRMAR ELIMINACIÓN
        // ==========================================

        const confirmar =
            confirm(
                "¿Estás seguro de que deseas eliminar esta categoría?"
            );


        if (!confirmar) {

            return;
        }


        // ==========================================
        // ELIMINAR
        // ==========================================

        try {

            btnConfirmarEliminarCategoria.disabled =
                true;


            const respuesta =
                await fetch(
                    "/Categorias/EliminarCategoria?id=" +
                    id,
                    {
                        method: "DELETE"
                    }
                );


            const resultado =
                await respuesta.json();


            if (!respuesta.ok) {

                alert(
                    resultado.mensaje ||
                    "No se pudo eliminar la categoría."
                );

                return;
            }


            // ==========================================
            // ÉXITO
            // ==========================================

            mostrarResultadoCategoria(
                "Categoría eliminada",
                "La categoría se eliminó correctamente del inventario."
            );


            limpiarFormularioEliminar();


            await cargarCategorias();


            window.dispatchEvent(
                new Event(
                    "categoriasActualizadas"
                )
            );
        }
        catch (error) {

            console.error(
                "Error al eliminar categoría:",
                error
            );

            alert(
                "Ocurrió un error al eliminar la categoría."
            );
        }
        finally {

            btnConfirmarEliminarCategoria.disabled =
                false;
        }
    }


    // ==========================================
    // BOTÓN AGREGAR
    // ==========================================

    btnAgregarCategoria.addEventListener(
        "click",
        function () {

            mostrarFormulario(
                formAgregarCategoria,
                btnAgregarCategoria
            );

            limpiarFormularioAgregar();
        }
    );


    // ==========================================
    // BOTÓN ACTUALIZAR
    // ==========================================

    btnActualizarCategoria.addEventListener(
        "click",
        function () {

            mostrarFormulario(
                formActualizarCategoria,
                btnActualizarCategoria
            );
        }
    );


    // ==========================================
    // BOTÓN ELIMINAR
    // ==========================================

    btnEliminarCategoria.addEventListener(
        "click",
        function () {

            mostrarFormulario(
                formEliminarCategoria,
                btnEliminarCategoria
            );
        }
    );


    // ==========================================
    // CANCELAR AGREGAR
    // ==========================================

    btnCancelarAgregarCategoria.addEventListener(
        "click",
        function () {

            cerrarFormularioCategoria();
        }
    );


    // ==========================================
    // CANCELAR ACTUALIZAR
    // ==========================================

    btnCancelarActualizarCategoria.addEventListener(
        "click",
        function () {

            cerrarFormularioCategoria();
        }
    );


    // ==========================================
    // CANCELAR ELIMINAR
    // ==========================================

    btnCancelarEliminarCategoria.addEventListener(
        "click",
        function () {

            cerrarFormularioCategoria();
        }
    );


    // ==========================================
    // BOTONES GUARDAR
    // ==========================================

    btnGuardarCategoria.addEventListener(
        "click",
        agregarCategoria
    );


    btnGuardarActualizarCategoria.addEventListener(
        "click",
        actualizarCategoria
    );


    btnConfirmarEliminarCategoria.addEventListener(
        "click",
        eliminarCategoria
    );


    // ==========================================
    // CARGAR AL INICIAR
    // ==========================================

    cargarCategorias();

});