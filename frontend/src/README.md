# 🚤 LanchaYa Iquitos

**Sistema web para consultar y administrar salidas fluviales desde Iquitos.**

## 1. Descripción del proyecto

LanchaYa Iquitos es una aplicación web Full Stack que permite consultar información de salidas fluviales, conocer los destinos disponibles y administrar los viajes de diferentes empresas de transporte.

El sistema permite registrar, consultar, actualizar y eliminar salidas, así como filtrar los viajes por destino, fecha y tipo de embarcación.

## 2. Tecnologías utilizadas

### Backend
- Node.js
- Express.js
- API REST
- Axios (consumo desde el frontend)
- Archivo JSON para almacenar los datos

### Frontend
- React 18
- Vite
- JavaScript
- CSS
- Axios
- React Router DOM

## 3. Funcionalidades principales

- Consultar salidas fluviales.
- Registrar nuevas salidas.
- Editar información de los viajes.
- Eliminar salidas.
- Consultar destinos disponibles.
- Filtrar por destino, fecha y tipo de embarcación.
- Validar los datos antes de registrarlos.
- Mostrar información de empresas, embarcaciones, puertos, precios y cupos.

## 4. Requisitos previos

Antes de instalar el proyecto, se necesita:

- Node.js y npm.
- Visual Studio Code.
- Navegador web.
- Conexión a Internet para instalar las dependencias.

## 5. Instalación del proyecto

### Paso 1. Descargar o clonar el proyecto

Abrir una terminal y ubicarse en la carpeta del proyecto:

```bash
cd LanchaYa
```

### Paso 2. Instalar las dependencias del backend

```bash
cd backend
npm install
```

### Paso 3. Configurar las variables de entorno

Crear el archivo `.env` dentro de la carpeta `backend` con estas variables:

```env
ADMIN_USER=admin
ADMIN_PASSWORD_HASH=PEGA_AQUI_EL_HASH_GENERADO
SESSION_SECRET=CAMBIAR_POR_UNA_CLAVE_SEGURA
```

Para generar el hash de una contraseña:

```bash
node -e "require('bcryptjs').hash('TuClaveSegura123*', 10).then(console.log)"
```

Copiar el resultado y reemplazar `PEGA_AQUI_EL_HASH_GENERADO`.

No subir el archivo `.env` a GitHub.

### Paso 4. Iniciar el backend

Desde la carpeta `backend`, ejecutar:

```bash
npm run dev
```

El servidor estará disponible en:

`http://localhost:3001`

### Paso 5. Instalar las dependencias del frontend

Abrir una segunda terminal y ejecutar:

```bash
cd LanchaYa/frontend
npm install
```

### Paso 6. Iniciar el frontend

Ejecutar:

```bash
npm run dev
```

La aplicación estará disponible en:

`http://localhost:5173`

**Importante:** mantener abiertas las dos terminales mientras se utiliza el sistema.

## 6. Endpoints de la API REST

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/salidas` | Listar salidas |
| GET | `/api/salidas/:id` | Obtener una salida |
| POST | `/api/salidas` | Registrar una salida |
| PUT | `/api/salidas/:id` | Actualizar una salida |
| DELETE | `/api/salidas/:id` | Eliminar una salida |
| GET | `/api/destinos` | Listar destinos |

### Filtros disponibles

La API permite filtrar las salidas mediante parámetros:

```text
/api/salidas?destino=Nauta
/api/salidas?fecha=2026-11-09
/api/salidas?tipo=rapido
```

También se pueden combinar los filtros.

## 7. Validaciones del sistema

El sistema verifica:

- Campos obligatorios.
- Precio mayor que cero.
- Duración del viaje mayor que cero.
- Cantidad de cupos como número entero positivo.
- Tipo de embarcación permitido: lancha, rápido o deslizador.
- Fecha futura al registrar una nueva salida.

Las validaciones se realizan en el frontend y en el backend.

## 8. Persistencia de datos

Los registros de las salidas se almacenan en el archivo:

```text
backend/src/data/salidas.json
```

Esto permite conservar la información sin utilizar un gestor de base de datos externo.

## 9. Estructura del proyecto

```text
LanchaYa/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── data/
│   │       └── salidas.json
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── Admin.jsx
│   │   ├── Login.jsx
│   │   ├── App.css
│   │   └── Admin.css
│   └── package.json
│
└── README.md
```

## 10. Ejecución del proyecto

Para utilizar LanchaYa Iquitos:

1. Iniciar el backend en el puerto 3001.
2. Iniciar el frontend en el puerto 5173.
3. Abrir `http://localhost:5173` en el navegador.
4. Consultar los viajes y utilizar los filtros.
5. Acceder a la administración para gestionar las salidas.

---

**Proyecto académico: LanchaYa Iquitos**

Desarrollado como aplicación Full Stack utilizando Node.js, Express y React.