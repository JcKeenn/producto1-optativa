using Microsoft.AspNetCore.Mvc;
using System.Text;
using System.Text.Json;

namespace InventarioWeb.Controllers
{
    public class CategoriasController : Controller
    {
        private readonly HttpClient _httpClient;

        public CategoriasController(IHttpClientFactory httpClientFactory)
        {
            _httpClient = httpClientFactory.CreateClient();
        }

        // ==========================================
        // OBTENER CATEGORIAS
        // ==========================================

        [HttpGet]
        public async Task<IActionResult> ObtenerCategorias()
        {
            try
            {
                var respuesta = await _httpClient.GetAsync(
                    "https://localhost:7287/api/Categorias"
                );

                if (!respuesta.IsSuccessStatusCode)
                {
                    return StatusCode((int)respuesta.StatusCode);
                }

                var contenido = await respuesta.Content.ReadAsStringAsync();

                return Content(contenido, "application/json");
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    mensaje = "Error al consultar las categorías.",
                    error = ex.Message
                });
            }
        }

        // ==========================================
        // AGREGAR CATEGORIA
        // ==========================================

        [HttpPost]
        public async Task<IActionResult> AgregarCategoria(
            [FromBody] Models.Categoria categoria)
        {
            try
            {
                var json = JsonSerializer.Serialize(categoria);

                var contenidoJson = new StringContent(
                    json,
                    Encoding.UTF8,
                    "application/json"
                );

                var respuesta = await _httpClient.PostAsync(
                    "https://localhost:7287/api/Categorias",
                    contenidoJson
                );

                if (!respuesta.IsSuccessStatusCode)
                {
                    var error = await respuesta.Content.ReadAsStringAsync();

                    return Content(
                        error,
                        "application/json"
                    );
                }

                var contenido = await respuesta.Content.ReadAsStringAsync();

                return Content(contenido, "application/json");
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    mensaje = "Error al agregar la categoría.",
                    error = ex.Message
                });
            }
        }

        // ==========================================
        // ACTUALIZAR CATEGORIA
        // ==========================================

        [HttpPut]
        public async Task<IActionResult> ActualizarCategoria(
            int id,
            [FromBody] Models.Categoria categoria)
        {
            try
            {
                var json = JsonSerializer.Serialize(categoria);

                var contenidoJson = new StringContent(
                    json,
                    Encoding.UTF8,
                    "application/json"
                );

                var respuesta = await _httpClient.PutAsync(
                    $"https://localhost:7287/api/Categorias/{id}",
                    contenidoJson
                );

                if (!respuesta.IsSuccessStatusCode)
                {
                    var error = await respuesta.Content.ReadAsStringAsync();

                    return Content(
                        error,
                        "application/json"
                    );
                }

                var contenido = await respuesta.Content.ReadAsStringAsync();

                return Content(contenido, "application/json");
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    mensaje = "Error al actualizar la categoría.",
                    error = ex.Message
                });
            }
        }

        // ==========================================
        // ELIMINAR CATEGORIA
        // ==========================================

        [HttpDelete]
        public async Task<IActionResult> EliminarCategoria(int id)
        {
            try
            {
                var respuesta = await _httpClient.DeleteAsync(
                    $"https://localhost:7287/api/Categorias/{id}"
                );

                if (!respuesta.IsSuccessStatusCode)
                {
                    var error = await respuesta.Content.ReadAsStringAsync();

                    return Content(
                        error,
                        "application/json"
                    );
                }

                var contenido = await respuesta.Content.ReadAsStringAsync();

                return Content(contenido, "application/json");
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    mensaje = "Error al eliminar la categoría.",
                    error = ex.Message
                });
            }
        }
    }
}