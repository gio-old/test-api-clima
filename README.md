<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# 🌤️ Weather API

![Coverage](https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9)
![Build Status](https://img.shields.io/circleci/build/github/nestjs/nest/master)
![License](https://img.shields.io/npm/l/@nestjs/core.svg)

## 📌 Descripción
Weather API es una aplicación basada en [NestJS](https://nestjs.com/) diseñada para obtener datos meteorológicos en tiempo real a partir del nombre de una ciudad. Implementa la arquitectura hexagonal para mantener una estructura modular y flexible, lo que permite una fácil escalabilidad y mantenimiento del código.

## 🏗️ Arquitectura
- **Hexagonal Architecture**: Separa la lógica de negocio de las implementaciones externas.
- **NestJS Framework**: Construcción eficiente y escalable de aplicaciones backend.
- **MongoDB (Opcional)**: Se puede integrar una base de datos para almacenar consultas previas.
- **Servicios externos**: La API consume datos de terceros para obtener información del clima.

## 🚀 Instalación
```bash
$ npm install
```

## 🔧 Uso y ejecución
```bash
# Modo desarrollo
$ npm run start

# Modo live-reload
$ npm run start:dev

# Modo producción
$ npm run start:prod
```

## ✅ Pruebas
```bash
# Pruebas unitarias
$ npm run test

# Pruebas E2E
$ npm run test:e2e

# Cobertura de pruebas
$ npm run test:cov
```

## 🌍 Endpoints principales
- **GET `/weather?city=NombreCiudad`**: Retorna la información del clima para la ciudad especificada.

### 📄 Ejemplo de respuesta:
```json
{
  "temperature": 18.5,
  "humidity": 75,
  "description": "Parcialmente nublado"
}
```

## 📖 Documentación
Para visualizar la documentación de la API con Swagger, inicia el servidor y accede a la siguiente URL en tu navegador:
http://localhost:3000/api
Para más información, consulta la [documentación oficial de NestJS](https://docs.nestjs.com/) o revisa nuestra implementación en este repositorio.
Solo en esta oportunidad a modo de prueba se compartira esta variable que debe ir en un archivo .env en la raiz del directorio: OPENWEATHER_API_KEY='2ce774404ae0a626982cb3fdabced3f3'

## 🤝 Contribuciones
Las contribuciones son bienvenidas. Si deseas contribuir, abre un **issue** o un **pull request** con mejoras.

## 📜 Licencia
Este proyecto está licenciado bajo **MIT License**.

