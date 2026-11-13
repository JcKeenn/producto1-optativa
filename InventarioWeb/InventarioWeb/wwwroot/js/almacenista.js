document.addEventListener("DOMContentLoaded", function () {

    // =========================
    // BUSCADOR DE PRODUCTOS
    // =========================

    const buscador = document.getElementById("buscadorProducto");
    const filas = document.querySelectorAll("#tablaProductos tbody tr");

    buscador.addEventListener("keyup", function () {

        const texto = buscador.value.toLowerCase();

        filas.forEach(function (fila) {

            const contenido = fila.textContent.toLowerCase();

            if (contenido.includes(texto)) {
                fila.style.display = "";
            } else {
                fila.style.display = "none";
            }

        });

    });


    // =========================
    // BOTÓN ACTUALIZAR
    // =========================

    const botonActualizar = document.getElementById("btnActualizar");

    botonActualizar.addEventListener("click", function () {

        location.reload();

    });


    // =========================
    // FORMULARIO DE MOVIMIENTO
    // =========================

    const formularioMovimiento = document.getElementById("formMovimiento");

    formularioMovimiento.addEventListener("submit", async function (evento) {

        evento.preventDefault();

        const datos = new FormData(formularioMovimiento);

        const respuesta = await fetch("/Almacenista/RegistrarMovimiento", {
            method: "POST",
            body: datos
        });

        const resultado = await respuesta.json();

        const modalElemento = document.getElementById("modalAviso");

        const modal = new bootstrap.Modal(modalElemento);

        const titulo = document.getElementById("modalTitulo");
        const mensaje = document.getElementById("modalMensaje");

        if (resultado.correcto) {

            titulo.textContent = "Movimiento registrado";
            mensaje.textContent = resultado.mensaje;

            formularioMovimiento.reset();

            modal.show();

            // Actualizar la página cuando se cierre el modal
            modalElemento.addEventListener("hidden.bs.modal", function () {
                location.reload();
            }, { once: true });

        } else {

            titulo.textContent = "Producto no válido";
            mensaje.textContent = "El producto indicado no existe.";

            modal.show();

        }

    });

});