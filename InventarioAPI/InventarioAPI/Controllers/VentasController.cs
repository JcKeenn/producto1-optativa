using Microsoft.AspNetCore.Mvc;
using Npgsql;
using InventarioAPI.Models;

namespace InventarioAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VentasController : ControllerBase
    {
        private readonly DatabaseConnection _db;

        public VentasController(DatabaseConnection db)
        {
            _db = db;
        }

        // ==========================================
        // OBTENER VENTAS
        // ==========================================

        [HttpGet]
        public async Task<IActionResult> ObtenerVentas()
        {
            try
            {
                var ventas = new List<Venta>();

                using var conexion = _db.GetConnection();

                await conexion.OpenAsync();

                string sql = @"
                    SELECT
                        id_venta,
                        id_usuario,
                        fecha_venta,
                        total,
                        estado
                    FROM ventas
                    ORDER BY id_venta DESC";

                using var comando =
                    new NpgsqlCommand(sql, conexion);

                using var lector =
                    await comando.ExecuteReaderAsync();

                while (await lector.ReadAsync())
                {
                    ventas.Add(new Venta
                    {
                        IdVenta =
                            Convert.ToInt32(
                                lector["id_venta"]
                            ),

                        IdUsuario =
                            Convert.ToInt32(
                                lector["id_usuario"]
                            ),

                        FechaVenta =
                            Convert.ToDateTime(
                                lector["fecha_venta"]
                            ),

                        Total =
                            Convert.ToDecimal(
                                lector["total"]
                            ),

                        Estado =
                            lector["estado"].ToString()
                    });
                }

                return Ok(ventas);
            }
            catch (Exception ex)
            {
                return StatusCode(
                    500,
                    new
                    {
                        mensaje = "Error al obtener las ventas.",
                        error = ex.Message
                    }
                );
            }
        }

        // ==========================================
        // OBTENER DETALLE DE UNA VENTA
        // ==========================================

        [HttpGet("{id}/detalle")]
        public async Task<IActionResult> ObtenerDetalleVenta(
            int id)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest(new
                    {
                        mensaje = "El ID de la venta no es válido."
                    });
                }

                var detalles =
                    new List<DetalleVenta>();

                using var conexion =
                    _db.GetConnection();

                await conexion.OpenAsync();

                string sql = @"
                    SELECT
                        d.id_detalle,
                        d.id_venta,
                        d.id_producto,
                        p.nombre,
                        d.cantidad,
                        d.precio_unitario,
                        d.subtotal
                    FROM detalle_ventas d
                    INNER JOIN productos p
                        ON d.id_producto = p.id_producto
                    WHERE d.id_venta = @id
                    ORDER BY d.id_detalle";

                using var comando =
                    new NpgsqlCommand(sql, conexion);

                comando.Parameters.AddWithValue(
                    "@id",
                    id
                );

                using var lector =
                    await comando.ExecuteReaderAsync();

                while (await lector.ReadAsync())
                {
                    detalles.Add(new DetalleVenta
                    {
                        IdDetalle =
                            Convert.ToInt32(
                                lector["id_detalle"]
                            ),

                        IdVenta =
                            Convert.ToInt32(
                                lector["id_venta"]
                            ),

                        IdProducto =
                            Convert.ToInt32(
                                lector["id_producto"]
                            ),

                        NombreProducto =
                            lector["nombre"].ToString(),

                        Cantidad =
                            Convert.ToInt32(
                                lector["cantidad"]
                            ),

                        PrecioUnitario =
                            Convert.ToDecimal(
                                lector["precio_unitario"]
                            ),

                        Subtotal =
                            Convert.ToDecimal(
                                lector["subtotal"]
                            )
                    });
                }

                return Ok(detalles);
            }
            catch (Exception ex)
            {
                return StatusCode(
                    500,
                    new
                    {
                        mensaje = "Error al obtener el detalle.",
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
            [FromBody] RegistrarVenta modelo)
        {
            NpgsqlConnection conexion = null;
            NpgsqlTransaction transaccion = null;

            try
            {
                if (modelo == null)
                {
                    return BadRequest(new
                    {
                        mensaje = "No se recibieron datos de la venta."
                    });
                }

                if (modelo.IdUsuario <= 0)
                {
                    return BadRequest(new
                    {
                        mensaje = "El usuario no es válido."
                    });
                }

                if (modelo.Productos == null ||
                    modelo.Productos.Count == 0)
                {
                    return BadRequest(new
                    {
                        mensaje = "El carrito está vacío."
                    });
                }

                conexion = _db.GetConnection();

                await conexion.OpenAsync();

                transaccion =
                    await conexion.BeginTransactionAsync();

                // ==========================================
                // VALIDAR USUARIO
                // ==========================================

                string sqlUsuario = @"
                    SELECT COUNT(*)
                    FROM usuarios
                    WHERE id_usuario = @id
                    AND activo = true";

                using var comandoUsuario =
                    new NpgsqlCommand(
                        sqlUsuario,
                        conexion,
                        transaccion
                    );

                comandoUsuario.Parameters.AddWithValue(
                    "@id",
                    modelo.IdUsuario
                );

                int existeUsuario =
                    Convert.ToInt32(
                        await comandoUsuario.ExecuteScalarAsync()
                    );

                if (existeUsuario == 0)
                {
                    await transaccion.RollbackAsync();

                    return BadRequest(new
                    {
                        mensaje = "El usuario no existe o está inactivo."
                    });
                }

                // ==========================================
                // LISTA PARA GUARDAR INFORMACIÓN
                // ==========================================

                var productosVenta =
                    new List<ProductoVentaDetalle>();

                decimal total = 0;

                // ==========================================
                // REVISAR PRODUCTOS Y STOCK
                // ==========================================

                foreach (var producto in modelo.Productos)
                {
                    if (producto.IdProducto <= 0)
                    {
                        await transaccion.RollbackAsync();

                        return BadRequest(new
                        {
                            mensaje = "Hay un producto con ID inválido."
                        });
                    }

                    if (producto.Cantidad <= 0)
                    {
                        await transaccion.RollbackAsync();

                        return BadRequest(new
                        {
                            mensaje = "La cantidad debe ser mayor a cero."
                        });
                    }

                    string sqlProducto = @"
                        SELECT
                            nombre,
                            precio_venta,
                            stock_actual
                        FROM productos
                        WHERE id_producto = @id
                        FOR UPDATE";

                    using var comandoProducto =
                        new NpgsqlCommand(
                            sqlProducto,
                            conexion,
                            transaccion
                        );

                    comandoProducto.Parameters.AddWithValue(
                        "@id",
                        producto.IdProducto
                    );

                    using var lector =
                        await comandoProducto.ExecuteReaderAsync();

                    if (!await lector.ReadAsync())
                    {
                        await lector.CloseAsync();
                        await transaccion.RollbackAsync();

                        return BadRequest(new
                        {
                            mensaje =
                                "Uno de los productos ya no existe."
                        });
                    }

                    string nombre =
                        lector["nombre"].ToString();

                    decimal precio =
                        Convert.ToDecimal(
                            lector["precio_venta"]
                        );

                    int stock =
                        Convert.ToInt32(
                            lector["stock_actual"]
                        );

                    await lector.CloseAsync();

                    if (stock < producto.Cantidad)
                    {
                        await transaccion.RollbackAsync();

                        return BadRequest(new
                        {
                            mensaje =
                                $"No hay suficiente stock de {nombre}. Stock disponible: {stock}."
                        });
                    }

                    decimal subtotal =
                        precio * producto.Cantidad;

                    total += subtotal;

                    productosVenta.Add(
                        new ProductoVentaDetalle
                        {
                            IdProducto =
                                producto.IdProducto,

                            Nombre =
                                nombre,

                            Cantidad =
                                producto.Cantidad,

                            PrecioUnitario =
                                precio,

                            Subtotal =
                                subtotal
                        }
                    );
                }

                // ==========================================
                // CREAR VENTA
                // ==========================================

                string sqlVenta = @"
                    INSERT INTO ventas
                    (
                        id_usuario,
                        total,
                        estado
                    )
                    VALUES
                    (
                        @usuario,
                        @total,
                        'COMPLETADA'
                    )
                    RETURNING id_venta";

                using var comandoVenta =
                    new NpgsqlCommand(
                        sqlVenta,
                        conexion,
                        transaccion
                    );

                comandoVenta.Parameters.AddWithValue(
                    "@usuario",
                    modelo.IdUsuario
                );

                comandoVenta.Parameters.AddWithValue(
                    "@total",
                    total
                );

                int idVenta =
                    Convert.ToInt32(
                        await comandoVenta.ExecuteScalarAsync()
                    );

                // ==========================================
                // GUARDAR DETALLES
                // ==========================================

                foreach (var producto in productosVenta)
                {
                    string sqlDetalle = @"
                        INSERT INTO detalle_ventas
                        (
                            id_venta,
                            id_producto,
                            cantidad,
                            precio_unitario,
                            subtotal
                        )
                        VALUES
                        (
                            @venta,
                            @producto,
                            @cantidad,
                            @precio,
                            @subtotal
                        )";

                    using var comandoDetalle =
                        new NpgsqlCommand(
                            sqlDetalle,
                            conexion,
                            transaccion
                        );

                    comandoDetalle.Parameters.AddWithValue(
                        "@venta",
                        idVenta
                    );

                    comandoDetalle.Parameters.AddWithValue(
                        "@producto",
                        producto.IdProducto
                    );

                    comandoDetalle.Parameters.AddWithValue(
                        "@cantidad",
                        producto.Cantidad
                    );

                    comandoDetalle.Parameters.AddWithValue(
                        "@precio",
                        producto.PrecioUnitario
                    );

                    comandoDetalle.Parameters.AddWithValue(
                        "@subtotal",
                        producto.Subtotal
                    );

                    await comandoDetalle.ExecuteNonQueryAsync();

                    // ==========================================
                    // DESCONTAR STOCK
                    // ==========================================

                    /*string sqlStock = @"
                        UPDATE productos
                        SET stock_actual =
                            stock_actual - @cantidad
                        WHERE id_producto = @producto";

                    using var comandoStock =
                        new NpgsqlCommand(
                            sqlStock,
                            conexion,
                            transaccion
                        );

                    comandoStock.Parameters.AddWithValue(
                        "@cantidad",
                        producto.Cantidad
                    );

                    comandoStock.Parameters.AddWithValue(
                        "@producto",
                        producto.IdProducto
                    );

                    await comandoStock.ExecuteNonQueryAsync();*/

                    // ==========================================
                    // HISTORIAL
                    // SALIDA / VENTA
                    // ==========================================

                    string sqlHistorial = @"
                        INSERT INTO historial_inventario
                        (
                            id_producto,
                            tipo_movimiento,
                            cantidad,
                            motivo
                        )
                        VALUES
                        (
                            @producto,
                            'SALIDA',
                            @cantidad,
                            'VENTA'
                        )";

                    using var comandoHistorial =
                        new NpgsqlCommand(
                            sqlHistorial,
                            conexion,
                            transaccion
                        );

                    comandoHistorial.Parameters.AddWithValue(
                        "@producto",
                        producto.IdProducto
                    );

                    comandoHistorial.Parameters.AddWithValue(
                        "@cantidad",
                        producto.Cantidad
                    );

                    await comandoHistorial.ExecuteNonQueryAsync();
                }

                // ==========================================
                // CONFIRMAR TODO
                // ==========================================

                await transaccion.CommitAsync();

                return Ok(new
                {
                    mensaje = "Venta realizada correctamente.",
                    idVenta = idVenta,
                    total = total
                });
            }
            catch (Exception ex)
            {
                if (transaccion != null)
                {
                    try
                    {
                        await transaccion.RollbackAsync();
                    }
                    catch
                    {
                    }
                }

                return StatusCode(
                    500,
                    new
                    {
                        mensaje = "Error al realizar la venta.",
                        error = ex.Message
                    }
                );
            }
            finally
            {
                if (conexion != null)
                {
                    await conexion.CloseAsync();
                    await conexion.DisposeAsync();
                }
            }
        }
    }

    // ==========================================
    // CLASE AUXILIAR
    // ==========================================

    public class ProductoVentaDetalle
    {
        public int IdProducto { get; set; }

        public string Nombre { get; set; }

        public int Cantidad { get; set; }

        public decimal PrecioUnitario { get; set; }

        public decimal Subtotal { get; set; }
    }
}