using Microsoft.AspNetCore.Mvc;
using InventarioWeb.Models;
using System.Net.Http.Json;

namespace InventarioWeb.Controllers
{
    public class ProductosController : Controller
    {
        private readonly HttpClient _httpClient;

        public ProductosController(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<IActionResult> Index()
        {
            var productos = await _httpClient.GetFromJsonAsync<List<Producto>>(
                "https://localhost:7287/api/Productos"
            );

            return View(productos);
        }

        [HttpGet]
        public async Task<IActionResult> ObtenerProductos()
        {

            var productos = await _httpClient.GetFromJsonAsync<List<Producto>>(
                "https://localhost:7287/api/Productos"
            );

            return Json(productos);
        }

        [HttpPost]
        public async Task<IActionResult> AgregarProducto([FromBody] Producto producto)
        {
            try
            {
                var respuesta = await _httpClient.PostAsJsonAsync(
                    "https://localhost:7287/api/Productos",
                    producto
                );

                var contenido = await respuesta.Content.ReadAsStringAsync();

                return new ContentResult
                {
                    StatusCode = (int)respuesta.StatusCode,
                    Content = contenido,
                    ContentType = "application/json"
                };
            }
            catch (HttpRequestException)
            {
                return StatusCode(503, new
                {
                    mensaje = "No fue posible conectarse con la API."
                });
            }
        }

        [HttpPut]
        [Route("Productos/ActualizarProducto/{id}")]
        public async Task<IActionResult> ActualizarProducto(
            int id,
            [FromBody] Producto producto)
        {
            try
            {
                var respuesta = await _httpClient.PutAsJsonAsync(
                    $"https://localhost:7287/api/Productos/{id}",
                    producto
                );

                var contenido = await respuesta.Content.ReadAsStringAsync();

                Console.WriteLine("STATUS API: " + (int)respuesta.StatusCode);
                Console.WriteLine("RESPUESTA API: " + contenido);

                if (!respuesta.IsSuccessStatusCode)
                {
                    return StatusCode(
                        (int)respuesta.StatusCode,
                        new
                        {
                            mensaje = contenido
                        }
                    );
                }

                return Content(
                    contenido,
                    "application/json",
                    System.Text.Encoding.UTF8
                );
            }
            catch (Exception ex)
            {
                Console.WriteLine("ERROR MVC: " + ex.Message);

                return StatusCode(
                    500,
                    new
                    {
                        mensaje = "Error en MVC al comunicarse con la API.",
                        error = ex.Message
                    }
                );
            }
        }

        [HttpDelete]
        [Route("Productos/EliminarProducto/{id}")]
        public async Task<IActionResult> EliminarProducto(int id)
        {
            try
            {
                var respuesta = await _httpClient.DeleteAsync(
                    $"https://localhost:7287/api/Productos/{id}"
                );

                var contenido = await respuesta.Content.ReadAsStringAsync();

                Console.WriteLine("STATUS API: " + (int)respuesta.StatusCode);
                Console.WriteLine("RESPUESTA API: " + contenido);

                if (!respuesta.IsSuccessStatusCode)
                {
                    return StatusCode(
                        (int)respuesta.StatusCode,
                        new
                        {
                            mensaje = contenido
                        }
                    );
                }

                return Content(
                    contenido,
                    "application/json",
                    System.Text.Encoding.UTF8
                );
            }
            catch (Exception ex)
            {
                Console.WriteLine("ERROR MVC: " + ex.Message);

                return StatusCode(
                    500,
                    new
                    {
                        mensaje = "Error en MVC al comunicarse con la API.",
                        error = ex.Message
                    }
                );
            }
        }
    }
}