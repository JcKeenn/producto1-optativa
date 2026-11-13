# Producto 1 — Sistema de Inventario

Sistema de inventario compuesto por una **Web API** en ASP.NET Core y una **aplicación web MVC** que consume esa API. Permite administrar productos, categorías, proveedores, usuarios, ventas y el historial de movimientos de inventario, con vistas y permisos por rol (Administrador, Almacenista y Vendedor).

## Estructura

```
Producto1-Optativa/
├── InventarioAPI/    # Web API (ASP.NET Core, Npgsql + OpenAPI)
└── InventarioWeb/    # Aplicación MVC que consume la API vía HttpClient
```

## Requisitos

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- Una base de datos PostgreSQL (el proyecto usa neon.tech, pero sirve cualquier instancia)

## Configuración de la base de datos

La cadena de conexión de `InventarioAPI/InventarioAPI/appsettings.json` contiene **valores de ejemplo**. Para ejecutar en local:

1. Copia `InventarioAPI/InventarioAPI/appsettings.Development.example.json` como `appsettings.Development.json` (este archivo está ignorado por Git para no subir credenciales).
2. Reemplaza `TU_HOST`, `TU_BASE_DE_DATOS`, `TU_USUARIO` y `TU_PASSWORD` con tus datos reales.

Alternativamente puedes definir la variable de entorno:

```
ConnectionStrings__DefaultConnection=Host=...;Port=5432;Database=...;Username=...;Password=...
```

## Cómo ejecutar

API (escucha en `https://localhost:7287` y `http://localhost:5095`):

```bash
cd InventarioAPI/InventarioAPI
dotnet run
```

Web (escucha en `https://localhost:7159`):

```bash
cd InventarioWeb/InventarioWeb
dotnet run
```

Abre `https://localhost:7159` en el navegador. La web consume la API en `https://localhost:7287`, así que la API debe estar en ejecución.

## Endpoints principales de la API

- `/api/Productos`
- `/api/Categorias`
- `/api/Proveedores`
- `/api/Usuarios` (incluye login)
- `/api/Ventas`
- `/api/HistorialInventario`
- `/api/prueba-conexion` (verifica la conexión a PostgreSQL)

## Nota de seguridad

Este repositorio no incluye credenciales reales. Si vas a desplegarlo, usa variables de entorno o un gestor de secretos y evita dejar contraseñas en archivos versionados.
