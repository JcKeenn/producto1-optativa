using Microsoft.AspNetCore.Mvc;
using System.Text;
using System.Text.Json;

namespace InventarioWeb.Controllers
{
    public class ProveedoresController : Controller
    {
        private readonly HttpClient _httpClient;

        public ProveedoresController(IHttpClientFactory httpClientFactory)
        {
            _httpClient = httpClientFactory.CreateClient();
        }


        // ==========================================
        // OBTENER PROVEEDORES
        // ==========================================

        [HttpGet]
        public async Task<IActionResult> ObtenerProveedores()
        {
            try
            {
                var respuesta = await _httpClient.GetAsync(
                    "https://localhost:7287/api/Proveedores"
                );

                if (!respuesta.IsSuccessStatusCode)
                {
                    var error = await respuesta.Content.ReadAsStringAsync();

                    return StatusCode(
                        (int)respuesta.StatusCode,
                        error
                    );
                }

                var contenido =
                    await respuesta.Content.ReadAsStringAsync();

                return Content(
                    contenido,
                    "application/json"
                );
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    mensaje = "Error al consultar los proveedores.",
                    error = ex.Message
                });
            }
        }


        // ==========================================
        // AGREGAR PROVEEDOR
        // ==========================================

        [HttpPost]
        public async Task<IActionResult> AgregarProveedor(
            [FromBody] JsonElement proveedor)
        {
            try
            {
                var contenido = new StringContent(
                    proveedor.GetRawText(),
                    Encoding.UTF8,
                    "application/json"
                );

                var respuesta = await _httpClient.PostAsync(
                    "https://localhost:7287/api/Proveedores",
                    contenido
                );

                var resultado =
                    await respuesta.Content.ReadAsStringAsync();

                return StatusCode(
                    (int)respuesta.StatusCode,
                    resultado
                );
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    mensaje = "Error al agregar el proveedor.",
                    error = ex.Message
                });
            }
        }


        // ==========================================
        // ACTUALIZAR PROVEEDOR
        // ==========================================

        [HttpPut]
        public async Task<IActionResult> ActualizarProveedor(
            int id,
            [FromBody] JsonElement proveedor)
        {
            try
            {
                var contenido = new StringContent(
                    proveedor.GetRawText(),
                    Encoding.UTF8,
                    "application/json"
                );

                var respuesta = await _httpClient.PutAsync(
                    "https://localhost:7287/api/Proveedores/" + id,
                    contenido
                );

                var resultado =
                    await respuesta.Content.ReadAsStringAsync();

                return StatusCode(
                    (int)respuesta.StatusCode,
                    resultado
                );
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    mensaje = "Error al actualizar el proveedor.",
                    error = ex.Message
                });
            }
        }


        // ==========================================
        // ELIMINAR PROVEEDOR
        // ==========================================

        [HttpDelete]
        public async Task<IActionResult> EliminarProveedor(int id)
        {
            try
            {
                var respuesta = await _httpClient.DeleteAsync(
                    "https://localhost:7287/api/Proveedores/" + id
                );

                var resultado =
                    await respuesta.Content.ReadAsStringAsync();

                return StatusCode(
                    (int)respuesta.StatusCode,
                    resultado
                );
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    mensaje = "Error al eliminar el proveedor.",
                    error = ex.Message
                });
            }
        }
    }
}