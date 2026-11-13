using Npgsql;
namespace InventarioAPI
{
    public class DatabaseConnection
    {
        private readonly string _connectionString;

        public DatabaseConnection (IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public NpgsqlConnection GetConnection()
        {
            return new NpgsqlConnection(_connectionString);
        }
    }
}
