namespace InventarioAPI.Models
{
    public class Producto
    {
        public int Id { get; set; }

        public string? CodigoBarras { get; set; }

        public string Nombre { get; set; }

        public string? Descripcion { get; set; }

        public int IdCategoria { get; set; }

        public string? NombreCategoria { get; set; }

        public int IdProveedor { get; set; }

        public string? NombreProveedor { get; set; }

        public decimal PrecioCompra { get; set; }

        public decimal PrecioVenta { get; set; }

        public int StockActual { get; set; }

        public int StockMinimo { get; set; }

        public DateTime FechaCreacion { get; set; }
    }
}