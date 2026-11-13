namespace InventarioAPI.Models
{
    public class HistorialInventario
    {
        public int IdMovimiento { get; set; }

        public int IdProducto { get; set; }

        public string TipoMovimiento { get; set; }

        public int Cantidad { get; set; }

        public DateTime FechaMovimiento { get; set; }

        public string? Motivo { get; set; }
    }
}
