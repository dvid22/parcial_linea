# Garbage Schedule Backend (Node.js + Express + PostgreSQL)

Proyecto backend para gestión de horarios de recolección de basura y sistema de comentarios/contacto entre usuarios y recicladores.

## Tecnologías
- Node.js (ES Modules)
- Express
- PostgreSQL
- Sequelize (ORM)
- JWT para autenticación
- bcryptjs para encriptar contraseñas

## Estructura
```
backend/
├── config/
│   └── db.js
├── controllers/
├── middleware/
├── models/
├── routes/
├── seeders/
├── server.js
├── package.json
├── .env.example
└── README.md
```

## Instalación
1. Copia el proyecto y navega a la carpeta:
```bash
cd garbage-schedule-backend
npm install
```

2. Crea un archivo `.env` basado en `.env.example` con tus credenciales de PostgreSQL.

3. Inicia el servidor:
```bash
npm run dev
```

El servidor usará `sequelize.sync()` para crear/alterar tablas automáticamente (útil en desarrollo). Para producción usa migraciones.

## Endpoints principales
- `POST /api/auth/register` - registrar usuario
- `POST /api/auth/login` - iniciar sesión
- `GET /api/horarios` - obtener horarios (filtros por barrio, sector, tipo, día)
- `POST /api/horarios` - crear horario (protegido, rol admin o gestor)
- `GET /api/comentarios` - obtener comentarios públicos
- `POST /api/comentarios` - crear comentario (autenticado)
- `PUT /api/comentarios/:id/like` - dar like (autenticado)
- `PUT /api/comentarios/:id/dislike` - dar dislike (autenticado)
- `POST /api/messages` - enviar mensaje directo (autenticado)
- `GET /api/messages/conversation/:userId` - obtener conversación con otro usuario (autenticado)

Consulta la carpeta `controllers` y `routes` para más detalles.

