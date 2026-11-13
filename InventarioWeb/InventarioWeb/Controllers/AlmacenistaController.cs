using Microsoft.AspNetCore.Mvc;
using InventarioWeb.Models;
using System.Net.Http.Json;

namespace InventarioWeb.Controllers
{
    public class AlmacenistaController : Controller
    {
        private readonly HttpClient _httpClient;

        public AlmacenistaController(IHttpClientFactory httpClientFactory)
        {
            _httpClient = httpClientFactory.CreateClient();
        }

        public async Task<IActionResult> Index()
        {
            try
            {
                var productos =
                    await _httpClient.GetFromJsonAsync<List<Producto>>(
                        "https://localhost:7287/api/Productos");

                return View(productos ?? new List<Producto>());
            }
            catch (Exception)
            {
                ViewBag.Error =
                    "No se pudo conectar con la API. " +
                    "Verifica que esté en ejecución.";

                return View(new List<Producto>());
            }
        }

        [HttpPost]
        public async Task<IActionResult> RegistrarMovimiento(MovimientoInventario movimiento)
        {
            try
            {
                var respuesta = await _httpClient.PostAsJsonAsync(
                    "https://localhost:7287/api/HistorialInventario",
                    movimiento);

                var contenido = await respuesta.Content.ReadAsStringAsync();

                if (respuesta.IsSuccessStatusCode)
                {
                    return Json(new
                    {
                        correcto = true,
                        mensaje = "Movimiento registrado correctamente."
                    });
                }

                return Json(new
                {
                    correcto = false,
                    mensaje = "No se pudo registrar el movimiento.",
                    detalle = contenido
                });
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    correcto = false,
                    mensaje = "No se pudo conectar con la API.",
                    detalle = ex.Message
                });
            }
        }
    }
}