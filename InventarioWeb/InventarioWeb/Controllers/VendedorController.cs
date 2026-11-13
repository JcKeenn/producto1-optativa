using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Json;
using System.Text.Json;

namespace InventarioWeb.Controllers
{
    public class VendedorController : Controller
    {
        private readonly HttpClient _httpClient;

        public VendedorController(
            IHttpClientFactory httpClientFactory)
        {
            _httpClient = httpClientFactory.CreateClient();
        }

        // ==========================================
        // VISTA
        // ==========================================

        public IActionResult Index()
        {
            int? idUsuario =
                HttpContext.Session.GetInt32("IdUsuario");

            string? rol =
                HttpContext.Session.GetString("Rol");

            if (idUsuario == null || rol != "Vendedor")
            {
                return RedirectToAction(
                    "Index",
                    "Login"
                );
            }

            return View();
        }

        // ==========================================
        // OBTENER PRODUCTOS
        // ==========================================

        [HttpGet]
        public async Task<IActionResult> ObtenerProductos()
        {
            try
            {
                var respuesta = await _httpClient.GetAsync(
                    "https://localhost:7287/api/Productos"
                );

                if (!respuesta.IsSuccessStatusCode)
                {
                    return StatusCode(
                        (int)respuesta.StatusCode,
                        new
                        {
                            mensaje = "No se pudieron obtener los productos."
                        }
                    );
                }

                var productos =
                    await respuesta.Content.ReadFromJsonAsync<object>();

                return Ok(productos);
            }
            catch (Exception ex)
            {
                return StatusCode(
                    500,
                    new
                    {
                        mensaje = "Error al consultar los productos.",
                        error = ex.Message
                    }
                );
            }
        }

        // ==========================================
        // OBTENER VENTAS
        // ==========================================

        [HttpGet]
        public async Task<IActionResult> ObtenerVentas()
        {
            try
            {
                var respuesta = await _httpClient.GetAsync(
                    "https://localhost:7287/api/Ventas"
                );

                if (!respuesta.IsSuccessStatusCode)
                {
                    return StatusCode(
                        (int)respuesta.StatusCode,
                        new
                        {
                            mensaje = "No se pudieron obtener las ventas."
                        }
                    );
                }

                var ventas =
                    await respuesta.Content.ReadFromJsonAsync<object>();

                return Ok(ventas);
            }
            catch (Exception ex)
            {
                return StatusCode(
                    500,
                    new
                    {
                        mensaje = "Error al consultar las ventas.",
                        error = ex.Message
                    }
                );
            }
        }

        // ==========================================
        // OBTENER DETALLE DE VENTA
        // ==========================================

        [HttpGet]
        public async Task<IActionResult> ObtenerDetalleVenta(int id)
        {
            try
            {
                var respuesta = await _httpClient.GetAsync(
                    $"https://localhost:7287/api/Ventas/{id}/detalle"
                );

                if (!respuesta.IsSuccessStatusCode)
                {
                    return StatusCode(
                        (int)respuesta.StatusCode,
                        new
                        {
                            mensaje = "No se pudo obtener el detalle de la venta."
                        }
                    );
                }

                var detalle =
                    await respuesta.Content.ReadFromJsonAsync<object>();

                return Ok(detalle);
            }
            catch (Exception ex)
            {
                return StatusCode(
                    500,
                    new
                    {
                        mensaje = "Error al consultar el detalle.",
                        error = ex.Message
                    }
                );
            }
        }

        // ==========================================
        // REALIZAR VENTA
        // ==========================================

        [HttpPost]
        public async Task<IActionResult> RealizarVenta(
            [FromBody] JsonElement modelo)
        {
            try
            {
                int? idUsuario =
                    HttpContext.Session.GetInt32("IdUsuario");

                string? rol =
                    HttpContext.Session.GetString("Rol");

                if (idUsuario == null || (rol != "Vendedor" && rol != "Administrador"))
                {
                    return Unauthorized(new
                    {
                        mensaje = "La sesión del vendedor no es válida."
                    });
                }

                // ==========================================
                // OBTENER PRODUCTOS DEL CARRITO
                // ==========================================

                if (!modelo.TryGetProperty(
                    "productos",
                    out JsonElement productos))
                {
                    return BadRequest(new
                    {
                        mensaje = "No se encontraron productos en la venta."
                    });
                }

                // ==========================================
                // CREAR DATOS PARA LA API
                // ==========================================

                var venta = new
                {
                    idUsuario = idUsuario.Value,
                    productos = productos
                };

                // ==========================================
                // ENVIAR VENTA A LA API
                // ==========================================

                var respuesta = await _httpClient.PostAsJsonAsync(
                    "https://localhost:7287/api/Ventas",
                    venta
                );

                var contenido =
                    await respuesta.Content.ReadAsStringAsync();

                if (!respuesta.IsSuccessStatusCode)
                {
                    return StatusCode(
                        (int)respuesta.StatusCode,
                        contenido
                    );
                }

                return Content(
                    contenido,
                    "application/json"
                );
            }
            catch (Exception ex)
            {
                return StatusCode(
                    500,
                    new
                    {
                        mensaje = "Error al realizar la venta.",
                        error = ex.Message
                    }
                );
            }
        }
    }
}