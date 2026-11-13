using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Npgsql;
using InventarioAPI.Models;

namespace InventarioAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProveedoresController : ControllerBase
    {
        private readonly DatabaseConnection _db;

        public ProveedoresController(DatabaseConnection db)
        {
            _db = db;
        }


        // ==========================================
        // OBTENER TODOS LOS PROVEEDORES
        // ==========================================

        [HttpGet]
        public async Task<IActionResult> ObtenerProveedores()
        {
            try
            {
                var proveedores = new List<Proveedor>();

                using var conexion = _db.GetConnection();

                await conexion.OpenAsync();

                string sql = @"
                    SELECT 
                        id_proveedor,
                        nombre_empresa,
                        contacto_nombre,
                        telefono,
                        email,
                        direccion
                    FROM proveedores
                    ORDER BY id_proveedor;
                ";

                using var comando = new NpgsqlCommand(sql, conexion);

                using var lector = await comando.ExecuteReaderAsync();

                while (await lector.ReadAsync())
                {
                    proveedores.Add(new Proveedor
                    {
                        Id = Convert.ToInt32(
                            lector["id_proveedor"]
                        ),

                        NombreEmpresa =
                            lector["nombre_empresa"] == DBNull.Value
                            ? null
                            : lector["nombre_empresa"].ToString(),

                        ContactoNombre =
                            lector["contacto_nombre"] == DBNull.Value
                            ? null
                            : lector["contacto_nombre"].ToString(),

                        Telefono =
                            lector["telefono"] == DBNull.Value
                            ? null
                            : lector["telefono"].ToString(),

                        Email =
                            lector["email"] == DBNull.Value
                            ? null
                            : lector["email"].ToString(),

                        Direccion =
                            lector["direccion"] == DBNull.Value
                            ? null
                            : lector["direccion"].ToString()
                    });
                }

                return Ok(proveedores);
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
            [FromBody] Proveedor proveedor)
        {
            try
            {
                if (proveedor == null)
                {
                    return BadRequest(new
                    {
                        mensaje = "Los datos del proveedor son obligatorios."
                    });
                }

                using var conexion = _db.GetConnection();

                await conexion.OpenAsync();

                string sql = @"
                    INSERT INTO proveedores
                    (
                        nombre_empresa,
                        contacto_nombre,
                        telefono,
                        email,
                        direccion
                    )
                    VALUES
                    (
                        @nombre_empresa,
                        @contacto_nombre,
                        @telefono,
                        @email,
                        @direccion
                    );
                ";

                using var comando = new NpgsqlCommand(sql, conexion);

                comando.Parameters.AddWithValue(
                    "nombre_empresa",
                    (object?)proveedor.NombreEmpresa ?? DBNull.Value
                );

                comando.Parameters.AddWithValue(
                    "contacto_nombre",
                    (object?)proveedor.ContactoNombre ?? DBNull.Value
                );

                comando.Parameters.AddWithValue(
                    "telefono",
                    (object?)proveedor.Telefono ?? DBNull.Value
                );

                comando.Parameters.AddWithValue(
                    "email",
                    (object?)proveedor.Email ?? DBNull.Value
                );

                comando.Parameters.AddWithValue(
                    "direccion",
                    (object?)proveedor.Direccion ?? DBNull.Value
                );

                await comando.ExecuteNonQueryAsync();

                return Ok(new
                {
                    mensaje = "Proveedor agregado correctamente."
                });
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

        [HttpPut("{id}")]
        public async Task<IActionResult> ActualizarProveedor(
            int id,
            [FromBody] Proveedor proveedor)
        {
            try
            {
                if (proveedor == null)
                {
                    return BadRequest(new
                    {
                        mensaje = "Los datos del proveedor son obligatorios."
                    });
                }

                using var conexion = _db.GetConnection();

                await conexion.OpenAsync();

                string sql = @"
                    UPDATE proveedores
                    SET
                        nombre_empresa = @nombre_empresa,
                        contacto_nombre = @contacto_nombre,
                        telefono = @telefono,
                        email = @email,
                        direccion = @direccion
                    WHERE id_proveedor = @id_proveedor;
                ";

                using var comando = new NpgsqlCommand(sql, conexion);

                comando.Parameters.AddWithValue(
                    "id_proveedor",
                    id
                );

                comando.Parameters.AddWithValue(
                    "nombre_empresa",
                    (object?)proveedor.NombreEmpresa ?? DBNull.Value
                );

                comando.Parameters.AddWithValue(
                    "contacto_nombre",
                    (object?)proveedor.ContactoNombre ?? DBNull.Value
                );

                comando.Parameters.AddWithValue(
                    "telefono",
                    (object?)proveedor.Telefono ?? DBNull.Value
                );

                comando.Parameters.AddWithValue(
                    "email",
                    (object?)proveedor.Email ?? DBNull.Value
                );

                comando.Parameters.AddWithValue(
                    "direccion",
                    (object?)proveedor.Direccion ?? DBNull.Value
                );

                int filasAfectadas =
                    await comando.ExecuteNonQueryAsync();

                if (filasAfectadas == 0)
                {
                    return NotFound(new
                    {
                        mensaje = "No se encontró el proveedor."
                    });
                }

                return Ok(new
                {
                    mensaje = "Proveedor actualizado correctamente."
                });
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

        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarProveedor(int id)
        {
            try
            {
                using var conexion = _db.GetConnection();

                await conexion.OpenAsync();

                string sql = @"
                    DELETE FROM proveedores
                    WHERE id_proveedor = @id_proveedor;
                ";

                using var comando = new NpgsqlCommand(sql, conexion);

                comando.Parameters.AddWithValue(
                    "id_proveedor",
                    id
                );

                int filasAfectadas =
                    await comando.ExecuteNonQueryAsync();

                if (filasAfectadas == 0)
                {
                    return NotFound(new
                    {
                        mensaje = "No se encontró el proveedor."
                    });
                }

                return Ok(new
                {
                    mensaje = "Proveedor eliminado correctamente."
                });
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
