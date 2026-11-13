using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Npgsql;
using InventarioAPI.Models;

namespace InventarioAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductosController : ControllerBase
    {
        private readonly DatabaseConnection _db;

        public ProductosController(DatabaseConnection db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> ObtenerProductos()
        {
            try
            {
                var productos = new List<Producto>();
                using var conexion = _db.GetConnection();
                await conexion.OpenAsync();

                string sql = @"
                    SELECT 
                        p.id_producto,
                        p.codigo_barras,
                        p.nombre,
                        p.descripcion,
                        p.id_categoria,
                        c.nombre AS nombre_categoria,
                        p.id_proveedor,
                        pr.nombre_empresa AS nombre_proveedor,
                        p.precio_compra,
                        p.precio_venta,
                        p.stock_actual,
                        p.stock_minimo,
                        p.fecha_creacion
                    FROM productos p
                    INNER JOIN categorias c 
                        ON p.id_categoria = c.id_categoria
                    INNER JOIN proveedores pr 
                        ON p.id_proveedor = pr.id_proveedor
                    ORDER BY p.id_producto";

                using var comando = new NpgsqlCommand(sql, conexion);
                using var lector = await comando.ExecuteReaderAsync();

                while (await lector.ReadAsync())
                {
                    productos.Add(new Producto
                    {
                        Id = Convert.ToInt32(lector["id_producto"]),

                        CodigoBarras = lector["codigo_barras"] == DBNull.Value
                            ?null
                            :lector["codigo_barras"].ToString(),

                        Nombre = lector["nombre"].ToString(),

                        Descripcion = lector["descripcion"] == DBNull.Value
                            ? null :
                            lector["descripcion"].ToString(),

                        IdCategoria = Convert.ToInt32(lector["id_categoria"]),

                        NombreCategoria = lector["nombre_categoria"].ToString(),

                        IdProveedor = Convert.ToInt32(lector["id_proveedor"]),

                        NombreProveedor = lector["nombre_proveedor"].ToString(),

                        PrecioCompra = Convert.ToDecimal(lector["precio_compra"]),

                        PrecioVenta = Convert.ToDecimal(lector["precio_venta"]),

                        StockActual = Convert.ToInt32(lector["stock_actual"]),

                        StockMinimo = Convert.ToInt32(lector["stock_minimo"]),

                        FechaCreacion = Convert.ToDateTime(lector["fecha_creacion"])
                    });
                }
                return Ok(productos);
            }
            catch(Exception ex)
            {
                return StatusCode(500, new
                {
                    mensaje = "Error al consultar los productos",
                    error = ex.Message
                });
            }
        }

        [HttpPost]
        public async Task<IActionResult> AgregarProducto([FromBody] Producto producto)
        {
            try
            {
                // Validar datos obligatorios
                if (string.IsNullOrWhiteSpace(producto.Nombre))
                {
                    return BadRequest(new
                    {
                        mensaje = "El nombre del producto es obligatorio."
                    });
                }

                if (producto.IdCategoria <= 0 || producto.IdProveedor <= 0)
                {
                    return BadRequest(new
                    {
                        mensaje = "Selecciona una categoría y un proveedor válidos."
                    });
                }

                if (producto.PrecioCompra < 0 ||
                    producto.PrecioVenta < 0 ||
                    producto.StockMinimo < 0)
                {
                    return BadRequest(new
                    {
                        mensaje = "Los precios y el stock mínimo no pueden ser negativos."
                    });
                }

                using var conexion = _db.GetConnection();
                await conexion.OpenAsync();

                string sql = @"
                    INSERT INTO productos
                    (
                        codigo_barras,
                        nombre,
                        descripcion,
                        id_categoria,
                        id_proveedor,
                        precio_compra,
                        precio_venta,
                        stock_minimo
                    )
                    VALUES
                    (
                        @codigo,
                        @nombre,
                        @descripcion,
                        @categoria,
                        @proveedor,
                        @precioCompra,
                        @precioVenta,
                        @stockMinimo
                    )
                    RETURNING id_producto";

                using var comando = new NpgsqlCommand(sql, conexion);

                comando.Parameters.AddWithValue(
                    "@codigo",
                    (object?)producto.CodigoBarras ?? DBNull.Value
                );

                comando.Parameters.AddWithValue(
                    "@nombre",
                    producto.Nombre.Trim()
                );

                comando.Parameters.AddWithValue(
                    "@descripcion",
                    (object?)producto.Descripcion ?? DBNull.Value
                );

                comando.Parameters.AddWithValue(
                    "@categoria",
                    producto.IdCategoria
                );

                comando.Parameters.AddWithValue(
                    "@proveedor",
                    producto.IdProveedor
                );

                comando.Parameters.AddWithValue(
                    "@precioCompra",
                    producto.PrecioCompra
                );

                comando.Parameters.AddWithValue(
                    "@precioVenta",
                    producto.PrecioVenta
                );

                comando.Parameters.AddWithValue(
                    "@stockMinimo",
                    producto.StockMinimo
                );

                var resultado = await comando.ExecuteScalarAsync();

                int nuevoId = Convert.ToInt32(resultado);

                return Ok(new
                {
                    mensaje = "Producto agregado correctamente.",
                    id = nuevoId
                });
            }
            catch (PostgresException ex) when (ex.SqlState == "23505")
            {
                return Conflict(new
                {
                    mensaje = "Ya existe un producto con ese código de barras."
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    mensaje = "Error al agregar el producto.",
                    error = ex.Message
                });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> ActualizarProducto(
            int id,
            [FromBody] Producto producto)
        {
            try
            {
                // Validar que el producto exista
                if (id <= 0)
                {
                    return BadRequest(new
                    {
                        mensaje = "El ID del producto no es válido."
                    });
                }

                // Validar nombre
                if (string.IsNullOrWhiteSpace(producto.Nombre))
                {
                    return BadRequest(new
                    {
                        mensaje = "El nombre del producto es obligatorio."
                    });
                }

                // Validar categoría y proveedor
                if (producto.IdCategoria <= 0 || producto.IdProveedor <= 0)
                {
                    return BadRequest(new
                    {
                        mensaje = "Selecciona una categoría y un proveedor válidos."
                    });
                }

                // Validar precios y stock mínimo
                if (producto.PrecioCompra < 0 ||
                    producto.PrecioVenta < 0 ||
                    producto.StockMinimo < 0)
                {
                    return BadRequest(new
                    {
                        mensaje = "Los precios y el stock mínimo no pueden ser negativos."
                    });
                }

                using var conexion = _db.GetConnection();
                await conexion.OpenAsync();

                string sql = @"
                    UPDATE productos
                    SET
                        codigo_barras = @codigo,
                        nombre = @nombre,
                        descripcion = @descripcion,
                        id_categoria = @categoria,
                        id_proveedor = @proveedor,
                        precio_compra = @precioCompra,
                        precio_venta = @precioVenta,
                        stock_minimo = @stockMinimo
                    WHERE id_producto = @id";

                using var comando = new NpgsqlCommand(sql, conexion);

                comando.Parameters.AddWithValue(
                    "@codigo",
                    (object?)producto.CodigoBarras ?? DBNull.Value
                );

                comando.Parameters.AddWithValue(
                    "@nombre",
                    producto.Nombre.Trim()
                );

                comando.Parameters.AddWithValue(
                    "@descripcion",
                    (object?)producto.Descripcion ?? DBNull.Value
                );

                comando.Parameters.AddWithValue(
                    "@categoria",
                    producto.IdCategoria
                );

                comando.Parameters.AddWithValue(
                    "@proveedor",
                    producto.IdProveedor
                );

                comando.Parameters.AddWithValue(
                    "@precioCompra",
                    producto.PrecioCompra
                );

                comando.Parameters.AddWithValue(
                    "@precioVenta",
                    producto.PrecioVenta
                );

                comando.Parameters.AddWithValue(
                    "@stockMinimo",
                    producto.StockMinimo
                );

                comando.Parameters.AddWithValue(
                    "@id",
                    id
                );

                int filasAfectadas = await comando.ExecuteNonQueryAsync();

                if (filasAfectadas == 0)
                {
                    return NotFound(new
                    {
                        mensaje = "El producto no existe."
                    });
                }

                return Ok(new
                {
                    mensaje = "Producto actualizado correctamente."
                });
            }
            catch (PostgresException ex) when (ex.SqlState == "23505")
            {
                return Conflict(new
                {
                    mensaje = "Ya existe otro producto con ese código de barras."
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    mensaje = "Error al actualizar el producto.",
                    error = ex.Message
                });
            }
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarProducto(int id)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest(new
                    {
                        mensaje = "El ID del producto no es válido."
                    });
                }

                using var conexion = _db.GetConnection();
                await conexion.OpenAsync();

                string sql = @"
                    DELETE FROM productos
                    WHERE id_producto = @id";

                using var comando = new NpgsqlCommand(sql, conexion);

                comando.Parameters.AddWithValue(
                    "@id",
                    id
                );

                int filasAfectadas = await comando.ExecuteNonQueryAsync();

                if (filasAfectadas == 0)
                {
                    return NotFound(new
                    {
                        mensaje = "El producto no existe."
                    });
                }

                return Ok(new
                {
                    mensaje = "Producto eliminado correctamente."
                });
            }
            catch (PostgresException ex) when (ex.SqlState == "23503")
            {
                return Conflict(new
                {
                    mensaje = "No se puede eliminar el producto porque tiene movimientos registrados."
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    mensaje = "Error al eliminar el producto.",
                    error = ex.Message
                });
            }
        }
    }
}
