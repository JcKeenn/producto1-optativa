using Microsoft.AspNetCore.Mvc;
using InventarioWeb.Models;
using System.Net.Http.Json;

namespace InventarioWeb.Controllers
{
    public class LoginController : Controller
    {
        private readonly HttpClient _httpClient;

        public LoginController(IHttpClientFactory httpClientFactory)
        {
            _httpClient = httpClientFactory.CreateClient();
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Index(LoginModel modelo)
        {
            try
            {
                var respuesta = await _httpClient.PostAsJsonAsync(
                    "https://localhost:7287/api/Usuarios/login",
                    modelo
                );

                if (respuesta.IsSuccessStatusCode)
                {
                    var usuario =
                        await respuesta.Content.ReadFromJsonAsync<UsuarioLogin>();

                    if (usuario == null)
                    {
                        ViewBag.Error = "No se pudo obtener la información del usuario.";
                        return View(modelo);
                    }

                    // ==========================================
                    // GUARDAR USUARIO EN SESSION
                    // ==========================================

                    HttpContext.Session.SetInt32(
                        "IdUsuario",
                        usuario.IdUsuario
                    );

                    HttpContext.Session.SetString(
                        "NombreUsuario",
                        usuario.NombreUsuario
                    );

                    HttpContext.Session.SetString(
                        "Nombre",
                        usuario.Nombre
                    );

                    HttpContext.Session.SetString(
                        "Apellido",
                        usuario.Apellido
                    );

                    HttpContext.Session.SetString(
                        "Rol",
                        usuario.Rol
                    );

                    // ==========================================
                    // REDIRECCIÓN
                    // ==========================================

                    if (usuario.Rol == "Administrador")
                    {
                        return RedirectToAction(
                            "Index",
                            "Administrador"
                        );
                    }

                    if (usuario.Rol == "Almacenista")
                    {
                        return RedirectToAction(
                            "Index",
                            "Almacenista"
                        );
                    }

                    if (usuario.Rol == "Vendedor")
                    {
                        return RedirectToAction(
                            "Index",
                            "Vendedor"
                        );
                    }

                    ViewBag.Error =
                        "El usuario no tiene un rol válido.";

                    return View(modelo);
                }

                ViewBag.Error =
                    "Usuario o contraseña incorrectos.";

                return View(modelo);
            }
            catch (Exception ex)
            {
                ViewBag.Error =
                    "No se pudo conectar con la API: " + ex.Message;

                return View(modelo);
            }
        }

        // ==========================================
        // CERRAR SESIÓN
        // ==========================================

        public IActionResult CerrarSesion()
        {
            HttpContext.Session.Clear();

            return RedirectToAction(
                "Index",
                "Login"
            );
        }
    }
}