Especificación de API: Endpoint de Resumen para el Dashboard

Este documento describe el endpoint requerido para alimentar el dashboard principal del Sistema de Gestión Deportiva (SGD).

1. Resumen del Endpoint

* Método HTTP: GET
* Ruta Sugerida: /api/dashboard/summary
* Autenticación: Requerida (Bearer Token JWT).
* Descripción: Provee un conjunto de datos agregados y KPIs que resumen el estado actual del club. Este endpoint debe ser altamente eficiente, ya que es la primera llamada que se
  realiza al cargar la página principal de la aplicación.

2. Consideraciones de Autorización (Roles)

El endpoint debe interpretar los roles y permisos del usuario (presentes en el token JWT) para devolver los datos correspondientes:
* `ADMIN_GENERAL`: Devuelve las estadísticas globales de todo el sistema.
* `ADMIN_CLUB`: Devuelve las estadísticas correspondientes únicamente a su club y sedes asignadas.
* `PROFESOR`: (Opcional para este endpoint) Podría devolver un conjunto de datos simplificado y filtrado solo para sus atletas.

3. Respuesta Exitosa (200 OK)

* Content-Type: application/json

##### Estructura del Cuerpo de la Respuesta (JSON)


┌─────────────────────────┬───────────────┬────────────────────────────────────────────────────────────────────────────────────────────────┐
│ Campo                   │ Tipo          │ Descripción                                                                                    │
├─────────────────────────┼───────────────┼────────────────────────────────────────────────────────────────────────────────────────────────┤
│ totalActiveAthletes     │ Integer       │ Conteo total de atletas con estado 'activo'.                                                   │
│ newAthletesLast30Days   │ Integer       │ Conteo de atletas cuya fecha de registro está en los últimos 30 días.                          │
│ totalActiveVenues       │ Integer       │ Conteo total de sedes (venues) con estado 'activo'.                                            │
│ totalActiveSports       │ Integer       │ Conteo total de deportes con estado 'activo'.                                                  │
│ athletesBySport         │ Array<Object> │ Un arreglo de objetos, cada uno representando un deporte y el número de atletas activos en él. │
│ athletesBySport[].name  │ String        │ Nombre del deporte.                                                                            │
│ athletesBySport[].value │ Integer       │ Número de atletas en ese deporte.                                                              │
│ athletesByVenue         │ Array<Object> │ Un arreglo de objetos, cada uno representando una sede y el número de atletas activos en ella. │
│ athletesByVenue[].name  │ String        │ Nombre de la sede.                                                                             │
│ athletesByVenue[].value │ Integer       │ Número de atletas en esa sede.                                                                 │
│ athletesWithoutGuardian │ Integer       │ Conteo de atletas activos menores de 18 años que no tienen ningún tutor asociado.              │
└─────────────────────────┴───────────────┴────────────────────────────────────────────────────────────────────────────────────────────────┘

  ---

4. Ejemplo de Respuesta JSON

    1 {
    2   "totalActiveAthletes": 734,
    3   "newAthletesLast30Days": 42,
    4   "totalActiveVenues": 5,
    5   "totalActiveSports": 8,
    6   "athletesBySport": [
    7     { "name": "Fútbol", "value": 210 },
    8     { "name": "Baloncesto", "value": 155 },
    9     { "name": "Natación", "value": 120 },
10     { "name": "Tenis", "value": 95 },
11     { "name": "Atletismo", "value": 84 },
12     { "name": "Voleibol", "value": 70 }
13   ],
14   "athletesByVenue": [
15     { "name": "Sede Central", "value": 250 },
16     { "name": "Sede Norte", "value": 180 },
17     { "name": "Sede Sur", "value": 154 },
18     { "name": "Sede Este", "value": 90 },
19     { "name": "Sede Oeste", "value": 60 }
20   ],
21   "athletesWithoutGuardian": 3
22 }

  ---