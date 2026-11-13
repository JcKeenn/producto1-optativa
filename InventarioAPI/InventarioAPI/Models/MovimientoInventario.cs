namespace InventarioAPI.Models
{
    public class MovimientoInventario
    {
        public int IdProducto { get; set; }
        public string TipoMovimiento { get; set; }
        public int Cantidad { get; set; }
        public string? Motivo { get; set; }
    }
}
