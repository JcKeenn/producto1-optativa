namespace InventarioAPI.Models
{
    public class RegistrarVenta
    {
        public int IdUsuario { get; set; }

        public List<ProductoVenta> Productos { get; set; } = new();
    }

    public class ProductoVenta
    {
        public int IdProducto { get; set; }

        public int Cantidad { get; set; }
    }
}