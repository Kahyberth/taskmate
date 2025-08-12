#!/bin/bash

# Configurar variables de entorno para el frontend
export VITE_CHAT_WS=http://localhost:3001

echo "Starting taskmate frontend with environment variables:"
echo "VITE_CHAT_WS: $VITE_CHAT_WS"

# Ejecutar el servidor de desarrollo
npm run dev
