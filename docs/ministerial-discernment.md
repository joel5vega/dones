# Discernimiento y recomendaciones de servicio

## Perfil personal
El documento existente `users/{uid}` puede contener `discernment`:
- `interests: string[]`
- `skills: string[]`
- `causes: string[]`
- `context: church | society | both`
- `availability: string[]`
- `updatedAt`

Estos campos se guardan en el perfil existente para evitar migraciones y conservar el historial, las respuestas y los resultados del test.

## Modelo de ministerio o sodalidad
Colección `ministries/{ministryId}`:
- `name`, `description`
- `scope: church | society | both`
- `gifts: string[]`
- `interests: string[]`
- `skills: string[]`
- `causes: string[]`
- `activities: string[]`
- `commitment: string`
- `requirements: string[]`
- `ownerUid`, `ownerName`
- `status: pending | active | rejected`
- `createdAt`, `updatedAt`

Las propuestas de usuarios se guardan como `pending`. Solo un administrador puede aprobarlas y publicarlas como `active`. Las propuestas rechazadas quedan fuera del catálogo.

## Motor de sugerencias
Ponderaciones orientativas:
- Dones del test: 40%
- Intereses declarados: 25%
- Habilidades: 15%
- Causas que conmueven: 10%
- Ámbito preferido: 10%

Las dimensiones sin información o sin etiquetas relacionadas se excluyen y se renormaliza el peso restante. El ámbito solo se considera cuando existe al menos otra señal coincidente. No se recomiendan ministerios si no hay intereses, habilidades, causas ni resultados del test.

El motor muestra razones de coincidencia. No asigna cargos, no certifica dones ni sustituye el discernimiento, el acompañamiento pastoral o la evaluación comunitaria.

## Catálogo inicial y privacidad
El catálogo inicial en `src/data/ministerios.js` ofrece ideas editables. Las nuevas propuestas aprobadas se incorporan desde Firestore. El usuario puede leer sus propuestas; solo administradores pueden moderar. Los documentos activos se leen mediante consulta autenticada. Las reglas de Firestore impiden que un usuario publique su propia propuesta.
