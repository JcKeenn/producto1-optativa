using InventarioAPI;
using Npgsql;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(opciones =>
{
    opciones.AddPolicy("PermitirInventarioWeb", politica =>
    {
        politica
            .WithOrigins("https://localhost:7159")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddScoped<DatabaseConnection>();//CREA UNA CONEXION PARA CADA CONTROLADOR SI ES NECESARIA

var app = builder.Build();
app.UseCors("PermitirInventarioWeb");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapGet("/api/prueba-conexion", async (DatabaseConnection db) =>
{
    try
    {
        using var conexion = db.GetConnection();

        await conexion.OpenAsync();

        using var comando = new NpgsqlCommand(
            "SELECT current_database()", conexion);

        var nombreBD = await comando.ExecuteScalarAsync();

        return Results.Ok(new
        {
            mensaje = "Conexión exitosa con PostgreSQL",
            baseDatos = nombreBD
        });
    }
    catch (Exception ex)
    {
        return Results.Problem(
            detail: ex.Message
        );
    }
});

app.Run();
