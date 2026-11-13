document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // VARIABLES
    // ==========================================

    let usuarios = [];


    // ==========================================
    // BOTONES
    // ==========================================

    const btnAgregarUsuario =
        document.getElementById("btnAgregarUsuario");

    const btnActualizarUsuario =
        document.getElementById("btnActualizarUsuario");

    const btnEliminarUsuario =
        document.getElementById("btnEliminarUsuario");


    // ==========================================
    // FORMULARIOS
    // ==========================================

    const formAgregarUsuario =
        document.getElementById("formAgregarUsuario");

    const formActualizarUsuario =
        document.getElementById("formActualizarUsuario");

    const formEliminarUsuario =
        document.getElementById("formEliminarUsuario");


    // ==========================================
    // TABLA
    // ==========================================

    const tablaUsuariosBody =
        document.getElementById("tablaUsuariosBody");

    const contadorUsuarios =
        document.getElementById("contadorUsuarios");

    // ==========================================
    // MODALS
    // ==========================================

    const modalUsuarioExito =
        new bootstrap.Modal(
            document.getElementById("modalUsuarioExito")
        );

    const modalConfirmarEliminarUsuario =
        new bootstrap.Modal(
            document.getElementById(
                "modalConfirmarEliminarUsuario"
            )
        );

    const mensajeUsuarioExito =
        document.getElementById(
            "mensajeUsuarioExito"
        );

    const nombreUsuarioEliminarModal =
        document.getElementById(
            "nombreUsuarioEliminarModal"
        );

    const btnConfirmarEliminarUsuario =
        document.getElementById(
            "btnConfirmarEliminarUsuario"
        );


    // ==========================================
    // SELECT DE ACTUALIZAR
    // ==========================================

    const idActualizarUsuario =
        document.getElementById("idActualizarUsuario");


    // ==========================================
    // SELECT DE ELIMINAR
    // ==========================================

    const idEliminarUsuario =
        document.getElementById("idEliminarUsuario");


    // ==========================================
    // MOSTRAR AGREGAR
    // ==========================================

    btnAgregarUsuario.addEventListener(
        "click",
        function () {

            formAgregarUsuario.style.display = "block";
            formActualizarUsuario.style.display = "none";
            formEliminarUsuario.style.display = "none";

            btnAgregarUsuario.classList.add("activo");
            btnActualizarUsuario.classList.remove("activo");
            btnEliminarUsuario.classList.remove("activo");
        }
    );


    // ==========================================
    // MOSTRAR ACTUALIZAR
    // ==========================================

    btnActualizarUsuario.addEventListener(
        "click",
        function () {

            formAgregarUsuario.style.display = "none";
            formActualizarUsuario.style.display = "block";
            formEliminarUsuario.style.display = "none";

            btnAgregarUsuario.classList.remove("activo");
            btnActualizarUsuario.classList.add("activo");
            btnEliminarUsuario.classList.remove("activo");

            cargarSelectActualizar();
        }
    );


    // ==========================================
    // MOSTRAR ELIMINAR
    // ==========================================

    btnEliminarUsuario.addEventListener(
        "click",
        function () {

            formAgregarUsuario.style.display = "none";
            formActualizarUsuario.style.display = "none";
            formEliminarUsuario.style.display = "block";

            btnAgregarUsuario.classList.remove("activo");
            btnActualizarUsuario.classList.remove("activo");
            btnEliminarUsuario.classList.add("activo");

            cargarSelectEliminar();
        }
    );


    // ==========================================
    // CARGAR USUARIOS
    // ==========================================

    async function cargarUsuarios() {

        try {

            const respuesta = await fetch(
                "https://localhost:7287/api/Usuarios/obtener"
            );

            if (!respuesta.ok) {

                throw new Error(
                    "No se pudieron obtener los usuarios."
                );
            }

            usuarios = await respuesta.json();

            mostrarUsuarios();

            cargarSelectActualizar();
            cargarSelectEliminar();

        }
        catch (error) {

            console.error(
                "Error al cargar usuarios:",
                error
            );

            tablaUsuariosBody.innerHTML = `
                <tr>
                    <td colspan="6"
                        class="sin-usuarios">
                        No se pudieron cargar los usuarios.
                    </td>
                </tr>
            `;
        }
    }


    // ==========================================
    // MOSTRAR USUARIOS EN TABLA
    // ==========================================

    function mostrarUsuarios() {

        tablaUsuariosBody.innerHTML = "";

        contadorUsuarios.textContent =
            usuarios.length +
            (
                usuarios.length === 1
                    ? " usuario"
                    : " usuarios"
            );


        if (usuarios.length === 0) {

            tablaUsuariosBody.innerHTML = `
                <tr>
                    <td colspan="6"
                        class="sin-usuarios">
                        No hay usuarios registrados.
                    </td>
                </tr>
            `;

            return;
        }


        usuarios.forEach(function (usuario) {

            const fila =
                document.createElement("tr");


            fila.innerHTML = `

                <td>
                    <span class="usuario-id">
                        ${usuario.idUsuario}
                    </span>
                </td>

                <td>
                    <div class="usuario-nombre">

                        <div class="usuario-icono">
                            <i class="bi bi-person"></i>
                        </div>

                        <strong>
                            ${usuario.nombreUsuario}
                        </strong>

                    </div>
                </td>

                <td>
                    ${usuario.nombre}
                    ${usuario.apellido}
                </td>

                <td>
                    <span class="usuario-correo">
                        ${usuario.correo}
                    </span>
                </td>

                <td>
                    <span class="usuario-rol">
                        ${usuario.rol}
                    </span>
                </td>

                <td>
                    ${usuario.activo

                    ? `
                            <span class="badge bg-success">
                                Activo
                            </span>
                          `

                    : `
                            <span class="badge bg-secondary">
                                Inactivo
                            </span>
                          `
                }
                </td>
            `;


            tablaUsuariosBody.appendChild(fila);

        });
    }


    // ==========================================
    // CARGAR SELECT ACTUALIZAR
    // ==========================================

    function cargarSelectActualizar() {

        idActualizarUsuario.innerHTML = `
            <option value="">
                Selecciona un usuario
            </option>
        `;


        usuarios.forEach(function (usuario) {

            const opcion =
                document.createElement("option");

            opcion.value =
                usuario.idUsuario;

            opcion.textContent =
                usuario.idUsuario +
                " - " +
                usuario.nombreUsuario;

            idActualizarUsuario.appendChild(opcion);

        });
    }


    // ==========================================
    // CARGAR SELECT ELIMINAR
    // ==========================================

    function cargarSelectEliminar() {

        idEliminarUsuario.innerHTML = `
            <option value="">
                Selecciona un usuario
            </option>
        `;


        usuarios.forEach(function (usuario) {

            const opcion =
                document.createElement("option");

            opcion.value =
                usuario.idUsuario;

            opcion.textContent =
                usuario.idUsuario +
                " - " +
                usuario.nombreUsuario;

            idEliminarUsuario.appendChild(opcion);

        });
    }


    // ==========================================
    // SELECCIONAR USUARIO PARA ACTUALIZAR
    // ==========================================

    idActualizarUsuario.addEventListener(
        "change",
        function () {

            const id =
                parseInt(
                    idActualizarUsuario.value
                );


            if (!id) {

                limpiarFormularioActualizar();

                return;
            }


            const usuario =
                usuarios.find(function (elemento) {

                    return elemento.idUsuario === id;

                });


            if (!usuario) {

                limpiarFormularioActualizar();

                return;
            }


            document.getElementById(
                "nombreActualizarUsuario"
            ).value = usuario.nombre;


            document.getElementById(
                "apellidoActualizarUsuario"
            ).value = usuario.apellido;


            document.getElementById(
                "nombreActualizarUsuarioLogin"
            ).value = usuario.nombreUsuario;


            document.getElementById(
                "correoActualizarUsuario"
            ).value = usuario.correo;


            document.getElementById(
                "passwordActualizarUsuario"
            ).value = "";


            document.getElementById(
                "rolActualizarUsuario"
            ).value = usuario.rol;


            document.getElementById(
                "activoActualizarUsuario"
            ).value =
                usuario.activo.toString();

        }
    );


    // ==========================================
    // SELECCIONAR USUARIO PARA ELIMINAR
    // ==========================================

    idEliminarUsuario.addEventListener(
        "change",
        function () {

            const id =
                parseInt(
                    idEliminarUsuario.value
                );


            if (!id) {

                limpiarFormularioEliminar();

                return;
            }


            const usuario =
                usuarios.find(function (elemento) {

                    return elemento.idUsuario === id;

                });


            if (!usuario) {

                limpiarFormularioEliminar();

                return;
            }


            document.getElementById(
                "nombreEliminarUsuario"
            ).value = usuario.nombre;


            document.getElementById(
                "apellidoEliminarUsuario"
            ).value = usuario.apellido;


            document.getElementById(
                "nombreEliminarUsuarioLogin"
            ).value = usuario.nombreUsuario;


            document.getElementById(
                "correoEliminarUsuario"
            ).value = usuario.correo;


            document.getElementById(
                "rolEliminarUsuario"
            ).value = usuario.rol;


            document.getElementById(
                "activoEliminarUsuario"
            ).value =
                usuario.activo
                    ? "Activo"
                    : "Inactivo";

        }
    );


    // ==========================================
    // LIMPIAR ACTUALIZAR
    // ==========================================

    function limpiarFormularioActualizar() {

        document.getElementById(
            "nombreActualizarUsuario"
        ).value = "";


        document.getElementById(
            "apellidoActualizarUsuario"
        ).value = "";


        document.getElementById(
            "nombreActualizarUsuarioLogin"
        ).value = "";


        document.getElementById(
            "correoActualizarUsuario"
        ).value = "";


        document.getElementById(
            "passwordActualizarUsuario"
        ).value = "";


        document.getElementById(
            "rolActualizarUsuario"
        ).value = "";


        document.getElementById(
            "activoActualizarUsuario"
        ).value = "true";
    }


    // ==========================================
    // LIMPIAR ELIMINAR
    // ==========================================

    function limpiarFormularioEliminar() {

        document.getElementById(
            "nombreEliminarUsuario"
        ).value = "";


        document.getElementById(
            "apellidoEliminarUsuario"
        ).value = "";


        document.getElementById(
            "nombreEliminarUsuarioLogin"
        ).value = "";


        document.getElementById(
            "correoEliminarUsuario"
        ).value = "";


        document.getElementById(
            "rolEliminarUsuario"
        ).value = "";


        document.getElementById(
            "activoEliminarUsuario"
        ).value = "";
    }


    // ==========================================
    // MOSTRAR MODAL DE ÉXITO
    // ==========================================

    function mostrarModalExito(mensaje) {

        mensajeUsuarioExito.textContent =
            mensaje;

        modalUsuarioExito.show();
    }

    // ==========================================
    // AGREGAR USUARIO
    // ==========================================

    document.getElementById(
        "formNuevoUsuario"
    ).addEventListener(
        "submit",
        async function (evento) {

            evento.preventDefault();


            const formulario =
                this;


            if (!formulario.checkValidity()) {

                evento.stopPropagation();

                formulario.classList.add(
                    "was-validated"
                );

                return;
            }


            const usuario = {

                Nombre:
                    document.getElementById(
                        "nombreUsuario"
                    ).value.trim(),

                Apellido:
                    document.getElementById(
                        "apellidoUsuario"
                    ).value.trim(),

                NombreUsuario:
                    document.getElementById(
                        "nombreUsuarioLogin"
                    ).value.trim(),

                Correo:
                    document.getElementById(
                        "correoUsuario"
                    ).value.trim(),

                Password:
                    document.getElementById(
                        "passwordUsuario"
                    ).value,

                Rol:
                    document.getElementById(
                        "rolUsuario"
                    ).value,

                Activo:
                    document.getElementById(
                        "activoUsuario"
                    ).value === "true"
            };


            try {

                const respuesta = await fetch(
                    "https://localhost:7287/api/Usuarios/agregar",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(usuario)
                    }
                );


                if (!respuesta.ok) {

                    const datos =
                        await respuesta.json();

                    throw new Error(
                        datos.mensaje ||
                        "No se pudo agregar el usuario."
                    );
                }


                formulario.reset();

                formulario.classList.remove(
                    "was-validated"
                );

                formAgregarUsuario.style.display =
                    "none";

                btnAgregarUsuario.classList.remove(
                    "activo"
                );

                await cargarUsuarios();

                mostrarModalExito(
                    "El usuario se agregó correctamente."
                );

            }
            catch (error) {

                console.error(
                    "Error al agregar usuario:",
                    error
                );
            }

        }
    );


    // ==========================================
    // ACTUALIZAR USUARIO
    // ==========================================

    document.getElementById(
        "formEditarUsuario"
    ).addEventListener(
        "submit",
        async function (evento) {

            evento.preventDefault();


            const formulario =
                this;


            if (!formulario.checkValidity()) {

                evento.stopPropagation();

                formulario.classList.add(
                    "was-validated"
                );

                return;
            }


            const id =
                parseInt(
                    document.getElementById(
                        "idActualizarUsuario"
                    ).value
                );


            if (!id) {
                return;
            }


            const usuario = {

                Nombre:
                    document.getElementById(
                        "nombreActualizarUsuario"
                    ).value.trim(),

                Apellido:
                    document.getElementById(
                        "apellidoActualizarUsuario"
                    ).value.trim(),

                NombreUsuario:
                    document.getElementById(
                        "nombreActualizarUsuarioLogin"
                    ).value.trim(),

                Correo:
                    document.getElementById(
                        "correoActualizarUsuario"
                    ).value.trim(),

                Password:
                    document.getElementById(
                        "passwordActualizarUsuario"
                    ).value,

                Rol:
                    document.getElementById(
                        "rolActualizarUsuario"
                    ).value,

                Activo:
                    document.getElementById(
                        "activoActualizarUsuario"
                    ).value === "true"
            };


            try {

                const respuesta = await fetch(
                    "https://localhost:7287/api/Usuarios/actualizar/" + id,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(usuario)
                    }
                );


                if (!respuesta.ok) {

                    const datos =
                        await respuesta.json();

                    throw new Error(
                        datos.mensaje ||
                        "No se pudo actualizar el usuario."
                    );
                }


                formulario.reset();

                formulario.classList.remove(
                    "was-validated"
                );

                formActualizarUsuario.style.display =
                    "none";

                btnActualizarUsuario.classList.remove(
                    "activo"
                );

                await cargarUsuarios();

                mostrarModalExito(
                    "El usuario se actualizó correctamente."
                );

            }
            catch (error) {

                console.error(
                    "Error al actualizar usuario:",
                    error
                );
            }

        }
    );


    // ==========================================
    // ELIMINAR USUARIO
    // ==========================================

    document.getElementById(
        "formBorrarUsuario"
    ).addEventListener(
        "submit",
        function (evento) {

            evento.preventDefault();


            const formulario =
                this;


            // ==========================================
            // VALIDAR FORMULARIO
            // ==========================================

            if (!formulario.checkValidity()) {

                evento.stopPropagation();

                formulario.classList.add(
                    "was-validated"
                );

                return;
            }


            // ==========================================
            // OBTENER ID DEL USUARIO
            // ==========================================

            const id =
                parseInt(
                    document.getElementById(
                        "idEliminarUsuario"
                    ).value
                );


            if (!id) {
                return;
            }


            // ==========================================
            // BUSCAR USUARIO
            // ==========================================

            const usuario =
                usuarios.find(
                    function (elemento) {

                        return elemento.idUsuario === id;

                    }
                );


            if (!usuario) {
                return;
            }


            // ==========================================
            // MOSTRAR DATOS EN EL MODAL
            // ==========================================

            nombreUsuarioEliminarModal.textContent =
                usuario.nombre +
                " " +
                usuario.apellido +
                " (" +
                usuario.nombreUsuario +
                ")";


            // ==========================================
            // MOSTRAR MODAL DE CONFIRMACIÓN
            // ==========================================

            modalConfirmarEliminarUsuario.show();

        }
    );

    // ==========================================
    // ELIMINAR USUARIO CONFIRMADO
    // ==========================================

    btnConfirmarEliminarUsuario.addEventListener(
        "click",
        async function () {

            const id =
                parseInt(
                    document.getElementById(
                        "idEliminarUsuario"
                    ).value
                );


            if (!id) {
                return;
            }


            try {

                const respuesta = await fetch(
                    "https://localhost:7287/api/Usuarios/eliminar/" + id,
                    {
                        method: "DELETE"
                    }
                );


                if (!respuesta.ok) {

                    const datos =
                        await respuesta.json();

                    throw new Error(
                        datos.mensaje ||
                        "No se pudo eliminar el usuario."
                    );
                }


                // CERRAR MODAL DE CONFIRMACIÓN
                modalConfirmarEliminarUsuario.hide();


                // LIMPIAR FORMULARIO
                document.getElementById(
                    "formBorrarUsuario"
                ).reset();

                document.getElementById(
                    "formBorrarUsuario"
                ).classList.remove(
                    "was-validated"
                );

                limpiarFormularioEliminar();


                // OCULTAR FORMULARIO
                formEliminarUsuario.style.display =
                    "none";

                btnEliminarUsuario.classList.remove(
                    "activo"
                );


                // ACTUALIZAR TABLA
                await cargarUsuarios();


                // MOSTRAR ÉXITO
                mostrarModalExito(
                    "El usuario se eliminó correctamente."
                );

            }
            catch (error) {

                console.error(
                    "Error al eliminar usuario:",
                    error
                );

            }

        }
    );


    // ==========================================
    // CANCELAR AGREGAR
    // ==========================================

    document.getElementById(
        "btnCancelarAgregarUsuario"
    ).addEventListener(
        "click",
        function () {

            document.getElementById(
                "formNuevoUsuario"
            ).reset();

            document.getElementById(
                "formNuevoUsuario"
            ).classList.remove(
                "was-validated"
            );

            formAgregarUsuario.style.display =
                "none";

            btnAgregarUsuario.classList.remove(
                "activo"
            );
        }
    );


    // ==========================================
    // CANCELAR ACTUALIZAR
    // ==========================================

    document.getElementById(
        "btnCancelarActualizarUsuario"
    ).addEventListener(
        "click",
        function () {

            document.getElementById(
                "formEditarUsuario"
            ).reset();

            document.getElementById(
                "formEditarUsuario"
            ).classList.remove(
                "was-validated"
            );

            limpiarFormularioActualizar();

            formActualizarUsuario.style.display =
                "none";

            btnActualizarUsuario.classList.remove(
                "activo"
            );
        }
    );


    // ==========================================
    // CANCELAR ELIMINAR
    // ==========================================

    document.getElementById(
        "btnCancelarEliminarUsuario"
    ).addEventListener(
        "click",
        function () {

            document.getElementById(
                "formBorrarUsuario"
            ).reset();

            document.getElementById(
                "formBorrarUsuario"
            ).classList.remove(
                "was-validated"
            );

            limpiarFormularioEliminar();

            formEliminarUsuario.style.display =
                "none";

            btnEliminarUsuario.classList.remove(
                "activo"
            );
        }
    );


    // ==========================================
    // CARGAR AL INICIAR
    // ==========================================

    cargarUsuarios();

});