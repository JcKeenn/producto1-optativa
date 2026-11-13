using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Npgsql;
using InventarioAPI.Models;

namespace InventarioAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriasController : ControllerBase
    {
        private readonly DatabaseConnection _db;

        public CategoriasController(DatabaseConnection db)
        {
            _db = db;
        }

        // ==========================================
        // OBTENER TODAS LAS CATEGORIAS
        // GET: api/Categorias
        // ==========================================

        [HttpGet]
        public async Task<IActionResult> ObtenerCategorias()
        {
            try
            {
                var categorias = new List<Categoria>();

                using var conexion = _db.GetConnection();
                await conexion.OpenAsync();

                string sql = @"SELECT id_categoria, nombre, descripcion
                               FROM categorias
                               ORDER BY id_categoria";

                using var comando = new NpgsqlCommand(sql, conexion);
                using var lector = await comando.ExecuteReaderAsync();

                while (await lector.ReadAsync())
                {
                    categorias.Add(new Categoria
                    {
                        Id = Convert.ToInt32(lector["id_categoria"]),
                        Nombre = lector["nombre"].ToString(),
                        Descripcion = lector["descripcion"] == DBNull.Value
                            ? null
                            : lector["descripcion"].ToString()
                    });
                }

                return Ok(categorias);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    mensaje = "Error al consultar las categorias",
                    error = ex.Message
                });
            }
        }

        // ==========================================
        // AGREGAR CATEGORIA
        // POST: api/Categorias
        // ==========================================

        [HttpPost]
        public async Task<IActionResult> AgregarCategoria(
            [FromBody] Categoria categoria)
        {
            if (categoria == null ||
                string.IsNullOrWhiteSpace(categoria.Nombre))
            {
                return BadRequest(new
                {
                    mensaje = "El nombre de la categoria es obligatorio."
                });
            }

            try
            {
                using var conexion = _db.GetConnection();
                await conexion.OpenAsync();

                string sql = @"INSERT INTO categorias (nombre, descripcion)
                               VALUES (@nombre, @descripcion)
                               RETURNING id_categoria";

                using var comando = new NpgsqlCommand(sql, conexion);

                comando.Parameters.AddWithValue(
                    "@nombre", categoria.Nombre.Trim());

                comando.Parameters.AddWithValue(
                    "@descripcion",
                    (object?)categoria.Descripcion ?? DBNull.Value);

                int id = Convert.ToInt32(
                    await comando.ExecuteScalarAsync());

                categoria.Id = id;
                categoria.Nombre = categoria.Nombre.Trim();

                return Ok(new
                {
                    mensaje = "Categoria agregada correctamente.",
                    categoria
                });
            }
            catch (PostgresException ex)
                when (ex.SqlState == "23505")
            {
                return Conflict(new
                {
                    mensaje = "Ya existe una categoria con ese nombre."
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    mensaje = "Error al agregar la categoria.",
                    error = ex.Message
                });
            }
        }

        // ==========================================
        // ACTUALIZAR CATEGORIA
        // PUT: api/Categorias/5
        // ==========================================

        [HttpPut("{id}")]
        public async Task<IActionResult> ActualizarCategoria(
            int id,
            [FromBody] Categoria categoria)
        {
            if (categoria == null ||
                string.IsNullOrWhiteSpace(categoria.Nombre))
            {
                return BadRequest(new
                {
                    mensaje = "El nombre de la categoria es obligatorio."
                });
            }

            try
            {
                using var conexion = _db.GetConnection();
                await conexion.OpenAsync();

                string sql = @"UPDATE categorias
                               SET nombre = @nombre,
                                   descripcion = @descripcion
                               WHERE id_categoria = @id";

                using var comando = new NpgsqlCommand(sql, conexion);

                comando.Parameters.AddWithValue(
                    "@id", id);

                comando.Parameters.AddWithValue(
                    "@nombre", categoria.Nombre.Trim());

                comando.Parameters.AddWithValue(
                    "@descripcion",
                    (object?)categoria.Descripcion ?? DBNull.Value);

                int filas = await comando.ExecuteNonQueryAsync();

                if (filas == 0)
                {
                    return NotFound(new
                    {
                        mensaje = "No se encontro la categoria."
                    });
                }

                return Ok(new
                {
                    mensaje = "Categoria actualizada correctamente."
                });
            }
            catch (PostgresException ex)
                when (ex.SqlState == "23505")
            {
                return Conflict(new
                {
                    mensaje = "Ya existe otra categoria con ese nombre."
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    mensaje = "Error al actualizar la categoria.",
                    error = ex.Message
                });
            }
        }

        // ==========================================
        // ELIMINAR CATEGORIA
        // DELETE: api/Categorias/5
        // ==========================================

        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarCategoria(int id)
        {
            try
            {
                using var conexion = _db.GetConnection();
                await conexion.OpenAsync();

                string sql = @"DELETE FROM categorias
                               WHERE id_categoria = @id";

                using var comando = new NpgsqlCommand(sql, conexion);

                comando.Parameters.AddWithValue("@id", id);

                int filas = await comando.ExecuteNonQueryAsync();

                if (filas == 0)
                {
                    return NotFound(new
                    {
                        mensaje = "No se encontro la categoria."
                    });
                }

                return Ok(new
                {
                    mensaje = "Categoria eliminada correctamente."
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    mensaje = "Error al eliminar la categoria.",
                    error = ex.Message
                });
            }
        }
    }
}