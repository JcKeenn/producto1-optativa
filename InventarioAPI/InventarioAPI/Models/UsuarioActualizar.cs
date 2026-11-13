namespace InventarioAPI.Models
{
    public class UsuarioActualizar
    {
        public string Nombre { get; set; }

        public string Apellido { get; set; }

        public string NombreUsuario { get; set; }

        public string Correo { get; set; }

        public string Password { get; set; }

        public string Rol { get; set; }

        public bool Activo { get; set; }
    }
}
