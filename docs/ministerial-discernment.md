# Discernimiento y recomendaciones de servicio

## Modelo de perfil
Cada documento `users/{uid}` puede contener `discernment`:
- `interests: string[]`
- `skills: string[]`\n- `causes: string[]`
- `causes: string[]` (reservado para ampliación)
- `context: church | society | both`
- `availability: string[]`
- `updatedAt`

Los campos se guardan dentro del perfil existente para evitar migraciones y conservar historial, respuestas y resultados.

## Modelo de ministerio
Colección `ministries/{ministryId}`:
- `name`, `description`
- `scope: church | society | both`
- `gifts: string[]` (nombres del catálogo actual de dones)
- `interests: string[]`
- `skills: string[]`
- `activities: string[]`
- `commitment: string`
- `requirements: string[]`
- `ownerUid`, `ownerName`
- `status: pending | active`
- `createdAt`, `updatedAt`

Las propuestas de usuarios se guardan como `pending`. Solo un administrador puede publicarlas cambiando el estado a `active`. El catálogo público lee únicamente documentos activos.

## Motor de sugerencias
Ponderaciones orientativas:
- Dones del test: 40%
- Intereses declarados: 25%
- Habilidades: 15%\n- Causas que conmueven: 10%
- Ámbito preferido: 10%

Las dimensiones sin información se excluyen y se renormaliza el peso restante. Las sugerencias incluyen razones legibles. No se utiliza para asignar cargos, certificar dones ni sustituir discernimiento, acompañamiento pastoral o evaluación comunitaria.

El catálogo inicial en `src/data/ministerios.js` funciona sin nuevos documentos en Firestore. El catálogo se amplía con ministerios aprobados.

## Reglas y privacidad
- El usuario edita solo su propio perfil.
- Cualquier usuario autenticado puede proponer un ministerio, pero no publicarlo.
- Los documentos activos son legibles; las propuestas pendientes solo por su autor y administradores.
- No se almacenan historias sensibles ni datos de terceros en este módulo.
