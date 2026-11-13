using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Npgsql;
using InventarioAPI.Models; 

namespace InventarioAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HistorialInventarioController : ControllerBase
    {
        private readonly DatabaseConnection _db;

        public HistorialInventarioController(DatabaseConnection db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> ObtenerHistorial()
        {
            try
            {
                var historial = new List<HistorialInventario>();

                using var conexion = _db.GetConnection();

                await conexion.OpenAsync();

                string sql = @"
                    SELECT 
                        id_movimiento,
                        id_producto,
                        tipo_movimiento,
                        cantidad,
                        fecha_movimiento,
                        motivo
                    FROM historial_inventario
                    ORDER BY id_movimiento";

                using var comando = new NpgsqlCommand(sql, conexion);

                using var lector = await comando.ExecuteReaderAsync();

                while (await lector.ReadAsync())
                {
                    historial.Add(new HistorialInventario
                    {
                        IdMovimiento = Convert.ToInt32(lector["id_movimiento"]),
                        IdProducto = Convert.ToInt32(lector["id_producto"]),
                        TipoMovimiento = lector["tipo_movimiento"].ToString(),
                        Cantidad = Convert.ToInt32(lector["cantidad"]),
                        FechaMovimiento = Convert.ToDateTime(lector["fecha_movimiento"]),

                        Motivo = lector["motivo"] == DBNull.Value
                            ? null
                            : lector["motivo"].ToString()
                    });
                }

                return Ok(historial);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    mensaje = "Error al consultar el historial de inventario",
                    error = ex.Message
                });
            }
        }

        [HttpPost]
        public async Task<IActionResult> RegistrarMovimiento(MovimientoInventario movimiento)
        {
            try
            {
                using var conexion = _db.GetConnection();

                await conexion.OpenAsync();

                string sqlProducto = @"
            SELECT COUNT(*)
            FROM productos
            WHERE id_producto = @id_producto";

                using var comandoProducto = new NpgsqlCommand(sqlProducto, conexion);

                comandoProducto.Parameters.AddWithValue(
                    "@id_producto",
                    movimiento.IdProducto
                );

                int existeProducto = Convert.ToInt32(
                    await comandoProducto.ExecuteScalarAsync()
                );

                if (existeProducto == 0)
                {
                    return BadRequest(new
                    {
                        mensaje = "El producto no existe."
                    });
                }

                string sql = @"
            INSERT INTO historial_inventario
            (
                id_producto,
                tipo_movimiento,
                cantidad,
                motivo
            )
            VALUES
            (
                @id_producto,
                @tipo_movimiento,
                @cantidad,
                @motivo
            )";

                using var comando = new NpgsqlCommand(sql, conexion);

                comando.Parameters.AddWithValue(
                    "@id_producto",
                    movimiento.IdProducto
                );

                comando.Parameters.AddWithValue(
                    "@tipo_movimiento",
                    movimiento.TipoMovimiento
                );

                comando.Parameters.AddWithValue(
                    "@cantidad",
                    movimiento.Cantidad
                );

                if (movimiento.Motivo == null)
                {
                    comando.Parameters.AddWithValue(
                        "@motivo",
                        DBNull.Value
                    );
                }
                else
                {
                    comando.Parameters.AddWithValue(
                        "@motivo",
                        movimiento.Motivo
                    );
                }

                await comando.ExecuteNonQueryAsync();

                return Ok(new
                {
                    mensaje = "Movimiento registrado correctamente"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    mensaje = "Error al registrar el movimiento",
                    error = ex.Message
                });
            }
        }
    }
}
