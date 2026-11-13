document.addEventListener("DOMContentLoaded", function () {

// ==========================================
// VARIABLES
// ==========================================

let proveedores = [];


// ==========================================
// BOTONES PRINCIPALES
// ==========================================

const btnAgregarProveedor =
    document.getElementById("btnAgregarProveedor");

const btnActualizarProveedor =
    document.getElementById("btnActualizarProveedor");

const btnEliminarProveedor =
    document.getElementById("btnEliminarProveedor");


// ==========================================
// FORMULARIOS
// ==========================================

const formAgregarProveedor =
    document.getElementById("formAgregarProveedor");

const formActualizarProveedor =
    document.getElementById("formActualizarProveedor");

const formEliminarProveedor =
    document.getElementById("formEliminarProveedor");


// ==========================================
// AGREGAR
// ==========================================

const nombreEmpresa =
    document.getElementById("nombreEmpresa");

const contactoNombre =
    document.getElementById("contactoNombre");

const telefonoProveedor =
    document.getElementById("telefonoProveedor");

const emailProveedor =
    document.getElementById("emailProveedor");

const direccionProveedor =
    document.getElementById("direccionProveedor");


const btnGuardarProveedor =
    document.getElementById("btnGuardarProveedor");

const btnCancelarAgregarProveedor =
    document.getElementById("btnCancelarAgregarProveedor");


// ==========================================
// ERRORES AGREGAR
// ==========================================

const errorNombreEmpresa =
    document.getElementById("errorNombreEmpresa");

const errorContactoNombre =
    document.getElementById("errorContactoNombre");

const errorTelefonoProveedor =
    document.getElementById("errorTelefonoProveedor");

const errorEmailProveedor =
    document.getElementById("errorEmailProveedor");

const errorDireccionProveedor =
    document.getElementById("errorDireccionProveedor");


// ==========================================
// ACTUALIZAR
// ==========================================

const proveedorActualizar =
    formActualizarProveedor.querySelector(
        "#proveedorActualizar"
    );

const idProveedorActualizar =
    document.getElementById("idProveedorActualizar");

const nombreEmpresaActualizar =
    document.getElementById("nombreEmpresaActualizar");

const contactoNombreActualizar =
    document.getElementById("contactoNombreActualizar");

const telefonoProveedorActualizar =
    document.getElementById("telefonoProveedorActualizar");

const emailProveedorActualizar =
    document.getElementById("emailProveedorActualizar");

const direccionProveedorActualizar =
    document.getElementById("direccionProveedorActualizar");


const btnGuardarActualizarProveedor =
    document.getElementById(
        "btnGuardarActualizarProveedor"
    );

const btnCancelarActualizarProveedor =
    document.getElementById(
        "btnCancelarActualizarProveedor"
    );


// ==========================================
// ERRORES ACTUALIZAR
// ==========================================

const errorProveedorActualizar =
    document.getElementById(
        "errorProveedorActualizar"
    );

const errorNombreEmpresaActualizar =
    document.getElementById(
        "errorNombreEmpresaActualizar"
    );

const errorContactoNombreActualizar =
    document.getElementById(
        "errorContactoNombreActualizar"
    );

const errorTelefonoProveedorActualizar =
    document.getElementById(
        "errorTelefonoProveedorActualizar"
    );

const errorEmailProveedorActualizar =
    document.getElementById(
        "errorEmailProveedorActualizar"
    );

const errorDireccionProveedorActualizar =
    document.getElementById(
        "errorDireccionProveedorActualizar"
    );


// ==========================================
// ELIMINAR
// ==========================================

const proveedorEliminar =
    formEliminarProveedor.querySelector(
        "#proveedorEliminar"
    );

const idProveedorEliminar =
    document.getElementById("idProveedorEliminar");

const nombreEmpresaEliminar =
    document.getElementById("nombreEmpresaEliminar");

const contactoNombreEliminar =
    document.getElementById("contactoNombreEliminar");

const telefonoProveedorEliminar =
    document.getElementById(
        "telefonoProveedorEliminar"
    );

const emailProveedorEliminar =
    document.getElementById(
        "emailProveedorEliminar"
    );

const direccionProveedorEliminar =
    document.getElementById(
        "direccionProveedorEliminar"
    );


const btnConfirmarEliminarProveedor =
    document.getElementById(
        "btnConfirmarEliminarProveedor"
    );

const btnCancelarEliminarProveedor =
    document.getElementById(
        "btnCancelarEliminarProveedor"
    );


// ==========================================
// ERROR ELIMINAR
// ==========================================

const errorProveedorEliminar =
    document.getElementById(
        "errorProveedorEliminar"
    );


// ==========================================
// TABLA
// ==========================================

const tablaProveedoresBody =
    document.getElementById(
        "tablaProveedoresBody"
    );

const contadorProveedores =
    document.getElementById(
        "contadorProveedores"
    );


// ==========================================
// MODAL DE RESULTADO
// ==========================================

const modalResultadoProveedor =
    new bootstrap.Modal(
        document.getElementById(
            "modalResultadoProveedor"
        )
    );

const modalProveedorTitulo =
    document.getElementById(
        "modalProveedorTitulo"
    );

const modalProveedorMensaje =
    document.getElementById(
        "modalProveedorMensaje"
    );


// ==========================================
// MOSTRAR RESULTADO
// ==========================================

function mostrarResultadoProveedor(
    titulo,
    mensaje
) {

    modalProveedorTitulo.textContent =
        titulo;

    modalProveedorMensaje.textContent =
        mensaje;

    modalResultadoProveedor.show();
}


// ==========================================
// FUNCIONES PARA ERRORES
// ==========================================

function mostrarError(
    elemento,
    mensaje
) {

    elemento.textContent =
        mensaje;

    elemento.style.display =
        "block";
}


function ocultarError(elemento) {

    elemento.textContent =
        "";

    elemento.style.display =
        "none";
}


// ==========================================
// MOSTRAR FORMULARIO
// ==========================================

function mostrarFormulario(
    formularioActivo,
    botonActivo
) {

    formAgregarProveedor.style.display =
        "none";

    formActualizarProveedor.style.display =
        "none";

    formEliminarProveedor.style.display =
        "none";


    btnAgregarProveedor.classList.remove(
        "activo"
    );

    btnActualizarProveedor.classList.remove(
        "activo"
    );

    btnEliminarProveedor.classList.remove(
        "activo"
    );


    formularioActivo.style.display =
        "block";

    botonActivo.classList.add(
        "activo"
    );
}
function cerrarFormularioProveedor() {

    // Ocultar todos los formularios
    formAgregarProveedor.style.display = "none";
    formActualizarProveedor.style.display = "none";
    formEliminarProveedor.style.display = "none";

    // Quitar estado activo de los botones
    btnAgregarProveedor.classList.remove("activo");
    btnActualizarProveedor.classList.remove("activo");
    btnEliminarProveedor.classList.remove("activo");

    // Limpiar formularios
    limpiarFormularioAgregar();
    limpiarFormularioActualizar();
    limpiarFormularioEliminar();
}

// ==========================================
// LIMPIAR FORMULARIO AGREGAR
// ==========================================

function limpiarFormularioAgregar() {

    nombreEmpresa.value =
        "";

    contactoNombre.value =
        "";

    telefonoProveedor.value =
        "";

    emailProveedor.value =
        "";

    direccionProveedor.value =
        "";


    ocultarError(
        errorNombreEmpresa
    );

    ocultarError(
        errorContactoNombre
    );

    ocultarError(
        errorTelefonoProveedor
    );

    ocultarError(
        errorEmailProveedor
    );

    ocultarError(
        errorDireccionProveedor
    );
}


// ==========================================
// LIMPIAR FORMULARIO ACTUALIZAR
// ==========================================

function limpiarFormularioActualizar() {

    proveedorActualizar.value =
        "";

    idProveedorActualizar.value =
        "";

    nombreEmpresaActualizar.value =
        "";

    contactoNombreActualizar.value =
        "";

    telefonoProveedorActualizar.value =
        "";

    emailProveedorActualizar.value =
        "";

    direccionProveedorActualizar.value =
        "";


    ocultarError(
        errorProveedorActualizar
    );

    ocultarError(
        errorNombreEmpresaActualizar
    );

    ocultarError(
        errorContactoNombreActualizar
    );

    ocultarError(
        errorTelefonoProveedorActualizar
    );

    ocultarError(
        errorEmailProveedorActualizar
    );

    ocultarError(
        errorDireccionProveedorActualizar
    );
}


// ==========================================
// LIMPIAR FORMULARIO ELIMINAR
// ==========================================

function limpiarFormularioEliminar() {

    proveedorEliminar.value =
        "";

    idProveedorEliminar.value =
        "";

    nombreEmpresaEliminar.value =
        "";

    contactoNombreEliminar.value =
        "";

    telefonoProveedorEliminar.value =
        "";

    emailProveedorEliminar.value =
        "";

    direccionProveedorEliminar.value =
        "";


    ocultarError(
        errorProveedorEliminar
    );
}


// ==========================================
// CARGAR PROVEEDORES
// ==========================================

async function cargarProveedores() {

    try {

        console.log(
            "Cargando proveedores..."
        );


        const respuesta =
            await fetch(
                "/Proveedores/ObtenerProveedores"
            );


        console.log(
            "Respuesta:",
            respuesta
        );

        console.log(
            "Status:",
            respuesta.status
        );


        if (!respuesta.ok) {

            throw new Error(
                "No se pudieron obtener los proveedores."
            );
        }


        const texto =
            await respuesta.text();


        console.log(
            "JSON recibido:",
            texto
        );


        proveedores =
            JSON.parse(texto);


        console.log(
            "Proveedores cargados:",
            proveedores
        );


        mostrarProveedores();

        llenarSelectActualizar();

        llenarSelectEliminar();

    }
    catch (error) {

        console.error(
            "ERROR AL CARGAR PROVEEDORES:",
            error
        );
    }
}


// ==========================================
// MOSTRAR PROVEEDORES EN TABLA
// ==========================================

function mostrarProveedores() {

    tablaProveedoresBody.innerHTML =
        "";


    proveedores.forEach(
        function (proveedor) {

            const fila =
                document.createElement("tr");


            fila.innerHTML = `

        <td>
        <span class="producto-id">
            ${proveedor.id}
        </span>
                </td >

                <td>
                    ${proveedor.nombreEmpresa}
                </td>

                <td>
                    ${proveedor.contactoNombre}
                </td>

                <td>
                    ${proveedor.telefono}
                </td>

                <td>
                    ${proveedor.email}
                </td>

                <td>
                    ${proveedor.direccion}
                </td>

    `;


            tablaProveedoresBody.appendChild(
                fila
            );
        }
    );


    const cantidad =
        proveedores.length;


    if (cantidad === 1) {

        contadorProveedores.textContent =
            "1 proveedor";

    }
    else {

        contadorProveedores.textContent =
            cantidad +
            " proveedores";
    }
}


// ==========================================
// LLENAR SELECT ACTUALIZAR
// ==========================================
function llenarSelectActualizar() {

    proveedorActualizar.innerHTML = "";

    const opcionInicial = document.createElement("option");

    opcionInicial.value = "";
    opcionInicial.textContent = "Seleccione un proveedor";
    opcionInicial.selected = true;

    proveedorActualizar.appendChild(opcionInicial);

    proveedores.forEach(function (proveedor) {

        const opcion = document.createElement("option");

        opcion.value = proveedor.id;
        opcion.textContent =
            proveedor.id + " - " + proveedor.nombreEmpresa;

        proveedorActualizar.appendChild(opcion);
    });
}

// ==========================================
// LLENAR SELECT ELIMINAR
// ==========================================
    function llenarSelectEliminar() {

        proveedorEliminar.innerHTML = "";

        const opcionInicial = document.createElement("option");

        opcionInicial.value = "";
        opcionInicial.textContent = "Seleccione un proveedor";
        opcionInicial.selected = true;

        proveedorEliminar.appendChild(opcionInicial);

        proveedores.forEach(function (proveedor) {

            const opcion = document.createElement("option");

            opcion.value = proveedor.id;
            opcion.textContent =
                proveedor.id + " - " + proveedor.nombreEmpresa;

            proveedorEliminar.appendChild(opcion);
        });
    }


// ==========================================
// CAMBIO DE PROVEEDOR - ACTUALIZAR
// ==========================================

proveedorActualizar.addEventListener(
    "change",
    function () {

        const id =
            parseInt(
                proveedorActualizar.value
            );


        if (!id) {

            limpiarFormularioActualizar();

            return;
        }


        ocultarError(
            errorProveedorActualizar
        );


        const proveedor =
            proveedores.find(
                function (item) {

                    return item.id === id;

                }
            );


        if (!proveedor) {

            return;
        }


        idProveedorActualizar.value =
            proveedor.id;


        nombreEmpresaActualizar.value =
            proveedor.nombreEmpresa || "";


        contactoNombreActualizar.value =
            proveedor.contactoNombre || "";


        telefonoProveedorActualizar.value =
            proveedor.telefono || "";


        emailProveedorActualizar.value =
            proveedor.email || "";


        direccionProveedorActualizar.value =
            proveedor.direccion || "";


        ocultarError(
            errorNombreEmpresaActualizar
        );

        ocultarError(
            errorContactoNombreActualizar
        );

        ocultarError(
            errorTelefonoProveedorActualizar
        );

        ocultarError(
            errorEmailProveedorActualizar
        );

        ocultarError(
            errorDireccionProveedorActualizar
        );
    }
);


// ==========================================
// CAMBIO DE PROVEEDOR - ELIMINAR
// ==========================================

proveedorEliminar.addEventListener(
    "change",
    function () {

        const id =
            parseInt(
                proveedorEliminar.value
            );


        if (!id) {

            limpiarFormularioEliminar();

            return;
        }


        ocultarError(
            errorProveedorEliminar
        );


        const proveedor =
            proveedores.find(
                function (item) {

                    return item.id === id;

                }
            );


        if (!proveedor) {

            return;
        }


        idProveedorEliminar.value =
            proveedor.id;


        nombreEmpresaEliminar.value =
            proveedor.nombreEmpresa || "";


        contactoNombreEliminar.value =
            proveedor.contactoNombre || "";


        telefonoProveedorEliminar.value =
            proveedor.telefono || "";


        emailProveedorEliminar.value =
            proveedor.email || "";


        direccionProveedorEliminar.value =
            proveedor.direccion || "";
    }
);


// ==========================================
// QUITAR ERRORES AL ESCRIBIR
// ==========================================

nombreEmpresa.addEventListener(
    "input",
    function () {

        if (
            nombreEmpresa.value.trim() !== ""
        ) {

            ocultarError(
                errorNombreEmpresa
            );
        }
    }
);


contactoNombre.addEventListener(
    "input",
    function () {

        if (
            contactoNombre.value.trim() !== ""
        ) {

            ocultarError(
                errorContactoNombre
            );
        }
    }
);


telefonoProveedor.addEventListener(
    "input",
    function () {

        if (
            telefonoProveedor.value.trim() !== ""
        ) {

            ocultarError(
                errorTelefonoProveedor
            );
        }
    }
);


emailProveedor.addEventListener(
    "input",
    function () {

        if (
            emailProveedor.value.trim() !== ""
        ) {

            ocultarError(
                errorEmailProveedor
            );
        }
    }
);


direccionProveedor.addEventListener(
    "input",
    function () {

        if (
            direccionProveedor.value.trim() !== ""
        ) {

            ocultarError(
                errorDireccionProveedor
            );
        }
    }
);


// ==========================================
// QUITAR ERRORES - ACTUALIZAR
// ==========================================

nombreEmpresaActualizar.addEventListener(
    "input",
    function () {

        if (
            nombreEmpresaActualizar.value.trim() !== ""
        ) {

            ocultarError(
                errorNombreEmpresaActualizar
            );
        }
    }
);


contactoNombreActualizar.addEventListener(
    "input",
    function () {

        if (
            contactoNombreActualizar.value.trim() !== ""
        ) {

            ocultarError(
                errorContactoNombreActualizar
            );
        }
    }
);


telefonoProveedorActualizar.addEventListener(
    "input",
    function () {

        if (
            telefonoProveedorActualizar.value.trim() !== ""
        ) {

            ocultarError(
                errorTelefonoProveedorActualizar
            );
        }
    }
);


emailProveedorActualizar.addEventListener(
    "input",
    function () {

        if (
            emailProveedorActualizar.value.trim() !== ""
        ) {

            ocultarError(
                errorEmailProveedorActualizar
            );
        }
    }
);


direccionProveedorActualizar.addEventListener(
    "input",
    function () {

        if (
            direccionProveedorActualizar.value.trim() !== ""
        ) {

            ocultarError(
                errorDireccionProveedorActualizar
            );
        }
    }
);


// ==========================================
// AGREGAR PROVEEDOR
// ==========================================

async function agregarProveedor() {

    const empresa =
        nombreEmpresa.value.trim();

    const contacto =
        contactoNombre.value.trim();

    const telefono =
        telefonoProveedor.value.trim();

    const email =
        emailProveedor.value.trim();

    const direccion =
        direccionProveedor.value.trim();


    // ==========================================
    // VALIDACIONES
    // ==========================================

    if (empresa === "") {

        mostrarError(
            errorNombreEmpresa,
            "El nombre de la empresa es obligatorio."
        );

        nombreEmpresa.focus();

        return;
    }


    if (contacto === "") {

        mostrarError(
            errorContactoNombre,
            "El nombre del contacto es obligatorio."
        );

        contactoNombre.focus();

        return;
    }


    if (telefono === "") {

        mostrarError(
            errorTelefonoProveedor,
            "El teléfono es obligatorio."
        );

        telefonoProveedor.focus();

        return;
    }


    if (email === "") {

        mostrarError(
            errorEmailProveedor,
            "El correo electrónico es obligatorio."
        );

        emailProveedor.focus();

        return;
    }


    if (direccion === "") {

        mostrarError(
            errorDireccionProveedor,
            "La dirección es obligatoria."
        );

        direccionProveedor.focus();

        return;
    }


    // ==========================================
    // ENVIAR
    // ==========================================

    try {

        btnGuardarProveedor.disabled =
            true;


        const respuesta =
            await fetch(
                "/Proveedores/AgregarProveedor",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        nombreEmpresa:
                            empresa,

                        contactoNombre:
                            contacto,

                        telefono:
                            telefono,

                        email:
                            email,

                        direccion:
                            direccion

                    })
                }
            );


        const resultado =
            await respuesta.json();


        if (!respuesta.ok) {

            alert(
                resultado.mensaje ||
                "No se pudo agregar el proveedor."
            );

            return;
        }


        // ==========================================
        // ÉXITO
        // ==========================================

        mostrarResultadoProveedor(
            "Proveedor agregado",
            "El proveedor se agregó correctamente al inventario."
        );


        limpiarFormularioAgregar();


        await cargarProveedores();


        window.dispatchEvent(
            new Event(
                "proveedoresActualizados"
            )
        );
    }
    catch (error) {

        console.error(
            "Error al agregar proveedor:",
            error
        );

        alert(
            "Ocurrió un error al agregar el proveedor."
        );
    }
    finally {

        btnGuardarProveedor.disabled =
            false;
    }
}


// ==========================================
// ACTUALIZAR PROVEEDOR
// ==========================================

async function actualizarProveedor() {

    const id =
        idProveedorActualizar.value;

    const empresa =
        nombreEmpresaActualizar.value.trim();

    const contacto =
        contactoNombreActualizar.value.trim();

    const telefono =
        telefonoProveedorActualizar.value.trim();

    const email =
        emailProveedorActualizar.value.trim();

    const direccion =
        direccionProveedorActualizar.value.trim();


    // ==========================================
    // VALIDAR PROVEEDOR
    // ==========================================

    if (id === "") {

        mostrarError(
            errorProveedorActualizar,
            "Debes seleccionar un proveedor."
        );

        proveedorActualizar.focus();

        return;
    }


    // ==========================================
    // VALIDACIONES
    // ==========================================

    if (empresa === "") {

        mostrarError(
            errorNombreEmpresaActualizar,
            "El nombre de la empresa es obligatorio."
        );

        nombreEmpresaActualizar.focus();

        return;
    }


    if (contacto === "") {

        mostrarError(
            errorContactoNombreActualizar,
            "El nombre del contacto es obligatorio."
        );

        contactoNombreActualizar.focus();

        return;
    }


    if (telefono === "") {

        mostrarError(
            errorTelefonoProveedorActualizar,
            "El teléfono es obligatorio."
        );

        telefonoProveedorActualizar.focus();

        return;
    }


    if (email === "") {

        mostrarError(
            errorEmailProveedorActualizar,
            "El correo electrónico es obligatorio."
        );

        emailProveedorActualizar.focus();

        return;
    }


    if (direccion === "") {

        mostrarError(
            errorDireccionProveedorActualizar,
            "La dirección es obligatoria."
        );

        direccionProveedorActualizar.focus();

        return;
    }


    // ==========================================
    // ENVIAR
    // ==========================================

    try {

        btnGuardarActualizarProveedor.disabled =
            true;


        const respuesta =
            await fetch(
                "/Proveedores/ActualizarProveedor?id=" +
                id,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        nombreEmpresa:
                            empresa,

                        contactoNombre:
                            contacto,

                        telefono:
                            telefono,

                        email:
                            email,

                        direccion:
                            direccion

                    })
                }
            );


        const resultado =
            await respuesta.json();


        if (!respuesta.ok) {

            alert(
                resultado.mensaje ||
                "No se pudo actualizar el proveedor."
            );

            return;
        }


        // ==========================================
        // ÉXITO
        // ==========================================

        mostrarResultadoProveedor(
            "Proveedor actualizado",
            "La información del proveedor se actualizó correctamente."
        );


        limpiarFormularioActualizar();


        await cargarProveedores();


        window.dispatchEvent(
            new Event(
                "proveedoresActualizados"
            )
        );
    }
    catch (error) {

        console.error(
            "Error al actualizar proveedor:",
            error
        );

        alert(
            "Ocurrió un error al actualizar el proveedor."
        );
    }
    finally {

        btnGuardarActualizarProveedor.disabled =
            false;
    }
}


// ==========================================
// ELIMINAR PROVEEDOR
// ==========================================

async function eliminarProveedor() {

    const id =
        idProveedorEliminar.value;


    // ==========================================
    // VALIDAR PROVEEDOR
    // ==========================================

    if (id === "") {

        mostrarError(
            errorProveedorEliminar,
            "Debes seleccionar un proveedor."
        );

        proveedorEliminar.focus();

        return;
    }


    // ==========================================
    // CONFIRMAR ELIMINACIÓN
    // ==========================================

    const confirmar =
        confirm(
            "¿Estás seguro de que deseas eliminar este proveedor?"
        );


    if (!confirmar) {

        return;
    }


    // ==========================================
    // ELIMINAR
    // ==========================================

    try {

        btnConfirmarEliminarProveedor.disabled =
            true;


        const respuesta =
            await fetch(
                "/Proveedores/EliminarProveedor?id=" +
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
                "No se pudo eliminar el proveedor."
            );

            return;
        }


        // ==========================================
        // ÉXITO
        // ==========================================

        mostrarResultadoProveedor(
            "Proveedor eliminado",
            "El proveedor se eliminó correctamente del inventario."
        );


        limpiarFormularioEliminar();


        await cargarProveedores();


        window.dispatchEvent(
            new Event(
                "proveedoresActualizados"
            )
        );
    }
    catch (error) {

        console.error(
            "Error al eliminar proveedor:",
            error
        );

        alert(
            "Ocurrió un error al eliminar el proveedor."
        );
    }
    finally {

        btnConfirmarEliminarProveedor.disabled =
            false;
    }
}


// ==========================================
// BOTÓN AGREGAR
// ==========================================

btnAgregarProveedor.addEventListener(
    "click",
    function () {

        mostrarFormulario(
            formAgregarProveedor,
            btnAgregarProveedor
        );

        limpiarFormularioAgregar();
    }
);


// ==========================================
// BOTÓN ACTUALIZAR
// ==========================================

btnActualizarProveedor.addEventListener(
    "click",
    function () {

        mostrarFormulario(
            formActualizarProveedor,
            btnActualizarProveedor
        );
    }
);


// ==========================================
// BOTÓN ELIMINAR
// ==========================================

btnEliminarProveedor.addEventListener(
    "click",
    function () {

        mostrarFormulario(
            formEliminarProveedor,
            btnEliminarProveedor
        );
    }
);


// ==========================================
// CANCELAR AGREGAR
// ==========================================

    btnCancelarAgregarProveedor.addEventListener(
    "click",
        cerrarFormularioProveedor
    );


// ==========================================
// CANCELAR ACTUALIZAR
// ==========================================

btnCancelarActualizarProveedor.addEventListener(
    "click",
    cerrarFormularioProveedor
);


// ==========================================
// CANCELAR ELIMINAR
// ==========================================

btnCancelarEliminarProveedor.addEventListener(
    "click",
    cerrarFormularioProveedor
);


// ==========================================
// BOTONES GUARDAR
// ==========================================

btnGuardarProveedor.addEventListener(
    "click",
    agregarProveedor
);


btnGuardarActualizarProveedor.addEventListener(
    "click",
    actualizarProveedor
);


btnConfirmarEliminarProveedor.addEventListener(
    "click",
    eliminarProveedor
);


// ==========================================
// CARGAR AL INICIAR
// ==========================================

cargarProveedores();

});
