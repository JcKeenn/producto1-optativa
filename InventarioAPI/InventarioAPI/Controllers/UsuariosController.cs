using Microsoft.AspNetCore.Mvc;
using Npgsql;
using InventarioAPI.Models;

namespace InventarioAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuariosController : ControllerBase
    {
        private readonly DatabaseConnection _db;

        public UsuariosController(DatabaseConnection db)
        {
            _db = db;
        }


        // ==========================================
        // LOGIN
        // ==========================================

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] Login modelo)
        {
            try
            {
                using var conexion = _db.GetConnection();
                await conexion.OpenAsync();

                string sql = @"
                    SELECT
                        id_usuario,
                        nombre,
                        apellido,
                        nombre_usuario,
                        correo,
                        password_hash,
                        rol
                    FROM usuarios
                    WHERE nombre_usuario = @usuario
                    AND activo = true";

                using var comando = new NpgsqlCommand(sql, conexion);

                comando.Parameters.AddWithValue(
                    "@usuario",
                    modelo.Usuario
                );

                using var lector = await comando.ExecuteReaderAsync();

                if (await lector.ReadAsync())
                {
                    string passwordHash =
                        lector["password_hash"].ToString();

                    bool passwordCorrecta =
                        BCrypt.Net.BCrypt.Verify(
                            modelo.Password,
                            passwordHash
                        );

                    if (!passwordCorrecta)
                    {
                        return Unauthorized(new
                        {
                            mensaje = "Usuario o contraseña incorrectos"
                        });
                    }

                    var usuario = new UsuarioLogin
                    {
                        IdUsuario =
                            Convert.ToInt32(lector["id_usuario"]),

                        Nombre =
                            lector["nombre"].ToString(),

                        Apellido =
                            lector["apellido"].ToString(),

                        NombreUsuario =
                            lector["nombre_usuario"].ToString(),

                        Correo =
                            lector["correo"].ToString(),

                        Rol =
                            lector["rol"].ToString()
                    };

                    return Ok(usuario);
                }

                return Unauthorized(new
                {
                    mensaje = "Usuario o contraseña incorrectos"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    mensaje = "Error al realizar el login",
                    error = ex.Message
                });
            }
        }


        // ==========================================
        // OBTENER USUARIOS
        // ==========================================

        [HttpGet("obtener")]
        public async Task<IActionResult> ObtenerUsuarios()
        {
            try
            {
                using var conexion = _db.GetConnection();
                await conexion.OpenAsync();

                string sql = @"
                    SELECT
                        id_usuario,
                        nombre,
                        apellido,
                        nombre_usuario,
                        correo,
                        rol,
                        activo,
                        fecha_creacion
                    FROM usuarios
                    ORDER BY id_usuario";

                using var comando =
                    new NpgsqlCommand(sql, conexion);

                using var lector =
                    await comando.ExecuteReaderAsync();

                var usuarios = new List<object>();

                while (await lector.ReadAsync())
                {
                    usuarios.Add(new
                    {
                        idUsuario =
                            Convert.ToInt32(
                                lector["id_usuario"]
                            ),

                        nombre =
                            lector["nombre"].ToString(),

                        apellido =
                            lector["apellido"].ToString(),

                        nombreUsuario =
                            lector["nombre_usuario"].ToString(),

                        correo =
                            lector["correo"].ToString(),

                        rol =
                            lector["rol"].ToString(),

                        activo =
                            Convert.ToBoolean(
                                lector["activo"]
                            ),

                        fechaCreacion =
                            lector["fecha_creacion"]
                                .ToString()
                    });
                }

                return Ok(usuarios);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    mensaje = "Error al obtener los usuarios",
                    error = ex.Message
                });
            }
        }


        // ==========================================
        // AGREGAR USUARIO
        // ==========================================

        [HttpPost("agregar")]
        public async Task<IActionResult> AgregarUsuario(
            [FromBody] Usuario modelo)
        {
            try
            {
                using var conexion = _db.GetConnection();
                await conexion.OpenAsync();

                // ==========================================
                // HASHEAR CONTRASEÑA
                // ==========================================

                string passwordHash =
                    BCrypt.Net.BCrypt.HashPassword(
                        modelo.Password
                    );


                string sql = @"
                    INSERT INTO usuarios
                    (
                        nombre,
                        apellido,
                        nombre_usuario,
                        correo,
                        password_hash,
                        rol,
                        activo
                    )
                    VALUES
                    (
                        @nombre,
                        @apellido,
                        @nombre_usuario,
                        @correo,
                        @password_hash,
                        @rol,
                        @activo
                    )
                    RETURNING id_usuario";

                using var comando =
                    new NpgsqlCommand(sql, conexion);

                comando.Parameters.AddWithValue(
                    "@nombre",
                    modelo.Nombre
                );

                comando.Parameters.AddWithValue(
                    "@apellido",
                    modelo.Apellido
                );

                comando.Parameters.AddWithValue(
                    "@nombre_usuario",
                    modelo.NombreUsuario
                );

                comando.Parameters.AddWithValue(
                    "@correo",
                    modelo.Correo
                );

                comando.Parameters.AddWithValue(
                    "@password_hash",
                    passwordHash
                );

                comando.Parameters.AddWithValue(
                    "@rol",
                    modelo.Rol
                );

                comando.Parameters.AddWithValue(
                    "@activo",
                    modelo.Activo
                );

                int idUsuario =
                    Convert.ToInt32(
                        await comando.ExecuteScalarAsync()
                    );

                return Ok(new
                {
                    mensaje = "Usuario agregado correctamente",
                    idUsuario = idUsuario
                });
            }
            catch (PostgresException ex)
            {
                return StatusCode(500, new
                {
                    mensaje = "Error al agregar el usuario",
                    error = ex.Message
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    mensaje = "Error al agregar el usuario",
                    error = ex.Message
                });
            }
        }


        // ==========================================
        // ACTUALIZAR USUARIO
        // ==========================================

        [HttpPut("actualizar/{id}")]
        public async Task<IActionResult> ActualizarUsuario(
            int id,
            [FromBody] UsuarioActualizar modelo)
        {
            try
            {
                using var conexion = _db.GetConnection();
                await conexion.OpenAsync();


                // ==========================================
                // SI SE ESCRIBIÓ UNA NUEVA CONTRASEÑA
                // ==========================================

                if (!string.IsNullOrWhiteSpace(modelo.Password))
                {
                    string passwordHash =
                        BCrypt.Net.BCrypt.HashPassword(
                            modelo.Password
                        );

                    string sql = @"
                        UPDATE usuarios
                        SET
                            nombre = @nombre,
                            apellido = @apellido,
                            nombre_usuario = @nombre_usuario,
                            correo = @correo,
                            password_hash = @password_hash,
                            rol = @rol,
                            activo = @activo
                        WHERE id_usuario = @id";

                    using var comando =
                        new NpgsqlCommand(sql, conexion);

                    comando.Parameters.AddWithValue(
                        "@nombre",
                        modelo.Nombre
                    );

                    comando.Parameters.AddWithValue(
                        "@apellido",
                        modelo.Apellido
                    );

                    comando.Parameters.AddWithValue(
                        "@nombre_usuario",
                        modelo.NombreUsuario
                    );

                    comando.Parameters.AddWithValue(
                        "@correo",
                        modelo.Correo
                    );

                    comando.Parameters.AddWithValue(
                        "@password_hash",
                        passwordHash
                    );

                    comando.Parameters.AddWithValue(
                        "@rol",
                        modelo.Rol
                    );

                    comando.Parameters.AddWithValue(
                        "@activo",
                        modelo.Activo
                    );

                    comando.Parameters.AddWithValue(
                        "@id",
                        id
                    );

                    int filas =
                        await comando.ExecuteNonQueryAsync();

                    if (filas == 0)
                    {
                        return NotFound(new
                        {
                            mensaje = "Usuario no encontrado"
                        });
                    }

                    return Ok(new
                    {
                        mensaje =
                            "Usuario actualizado correctamente"
                    });
                }


                // ==========================================
                // SIN CAMBIAR CONTRASEÑA
                // ==========================================

                string sqlSinPassword = @"
                    UPDATE usuarios
                    SET
                        nombre = @nombre,
                        apellido = @apellido,
                        nombre_usuario = @nombre_usuario,
                        correo = @correo,
                        rol = @rol,
                        activo = @activo
                    WHERE id_usuario = @id";

                using var comandoSinPassword =
                    new NpgsqlCommand(
                        sqlSinPassword,
                        conexion
                    );

                comandoSinPassword.Parameters.AddWithValue(
                    "@nombre",
                    modelo.Nombre
                );

                comandoSinPassword.Parameters.AddWithValue(
                    "@apellido",
                    modelo.Apellido
                );

                comandoSinPassword.Parameters.AddWithValue(
                    "@nombre_usuario",
                    modelo.NombreUsuario
                );

                comandoSinPassword.Parameters.AddWithValue(
                    "@correo",
                    modelo.Correo
                );

                comandoSinPassword.Parameters.AddWithValue(
                    "@rol",
                    modelo.Rol
                );

                comandoSinPassword.Parameters.AddWithValue(
                    "@activo",
                    modelo.Activo
                );

                comandoSinPassword.Parameters.AddWithValue(
                    "@id",
                    id
                );

                int filasSinPassword =
                    await comandoSinPassword.ExecuteNonQueryAsync();

                if (filasSinPassword == 0)
                {
                    return NotFound(new
                    {
                        mensaje = "Usuario no encontrado"
                    });
                }

                return Ok(new
                {
                    mensaje =
                        "Usuario actualizado correctamente"
                });
            }
            catch (PostgresException ex)
            {
                return StatusCode(500, new
                {
                    mensaje =
                        "Error al actualizar el usuario",

                    error = ex.Message
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    mensaje =
                        "Error al actualizar el usuario",

                    error = ex.Message
                });
            }
        }


        // ==========================================
        // ELIMINAR USUARIO
        // ==========================================

        [HttpDelete("eliminar/{id}")]
        public async Task<IActionResult> EliminarUsuario(int id)
        {
            try
            {
                using var conexion = _db.GetConnection();
                await conexion.OpenAsync();

                string sql = @"
                    DELETE FROM usuarios
                    WHERE id_usuario = @id";

                using var comando =
                    new NpgsqlCommand(sql, conexion);

                comando.Parameters.AddWithValue(
                    "@id",
                    id
                );

                int filas =
                    await comando.ExecuteNonQueryAsync();

                if (filas == 0)
                {
                    return NotFound(new
                    {
                        mensaje = "Usuario no encontrado"
                    });
                }

                return Ok(new
                {
                    mensaje =
                        "Usuario eliminado correctamente"
                });
            }
            catch (PostgresException ex)
            {
                return StatusCode(500, new
                {
                    mensaje =
                        "No se puede eliminar el usuario",

                    error = ex.Message
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    mensaje =
                        "Error al eliminar el usuario",

                    error = ex.Message
                });
            }
        }
    }
}