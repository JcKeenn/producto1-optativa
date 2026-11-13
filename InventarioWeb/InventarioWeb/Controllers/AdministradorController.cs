using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Net.Http.Json;
using InventarioWeb.Models;

namespace InventarioWeb.Controllers
{
    public class AdministradorController : Controller
    {
        private readonly HttpClient _httpClient;

        public AdministradorController(IHttpClientFactory httpClientFactory)
        {
            _httpClient = httpClientFactory.CreateClient();
        }

        public IActionResult Index()
        {
            return View();
        }

        // ==============================
        // OBTENER HISTORIAL
        // ==============================

        [HttpGet]
        public async Task<IActionResult> ObtenerHistorial()
        {
            try
            {
                var respuesta = await _httpClient.GetAsync(
                    "https://localhost:7287/api/HistorialInventario"
                );

                var contenido = await respuesta.Content.ReadAsStringAsync();

                if (respuesta.IsSuccessStatusCode)
                {
                    return Content(
                        contenido,
                        "application/json"
                    );
                }

                return StatusCode(
                    (int)respuesta.StatusCode,
                    contenido
                );
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    mensaje = "No se pudo conectar con la API.",
                    error = ex.Message
                });
            }
        }

        [HttpPost]
        public async Task<IActionResult> RegistrarMovimiento(
            [FromBody] MovimientoInventario movimiento)
        {
            try
            {
                var respuesta = await _httpClient.PostAsJsonAsync(
                    "https://localhost:7287/api/HistorialInventario",
                    movimiento
                );

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