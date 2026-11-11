# Dones — Test de dones espirituales

React + Vite + Firebase (Auth/Firestore). Publicado en https://joel5vega.github.io/dones/

```bash
npm install
npm run dev      # desarrollo
npm run build    # genera ./build (lo despliega .github/workflows/deploy.yml)
firebase deploy --only firestore:rules   # reglas de seguridad
```

## Estructura
- `config/` inicialización de Firebase · `services/` acceso a Firestore
- `contexts/AuthContext` sesión + perfil · `hooks/useTest` estado del test
- `utils/scoring` cálculo de puntajes (funciones puras) · `data/` preguntas, dones, referencias
- `components/` UI reutilizable · `pages/` Home, Dones, Test, Profile
