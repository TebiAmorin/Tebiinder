# 🛡️🔥 Tebiinder R6 Siege LFTLFG Platform

## 🎯 Visión General del Proyecto
Tebiinder es una plataforma web producto mínimo viable (MVP) diseñada para conectar jugadores (Free Agents) y equipos (LFG) de Rainbow Six Siege de cara a competiciones inminentes. 

El proyecto funciona como un híbrido entre un tablón de anuncios y Tinder. Elimina la fricción de los largos registros y perfiles de texto, apoyándose en la automatización de estadísticas y forzando la conexión directa a través de mensajes privados de Discord.

---

## 🚀 Características Principales

 Autenticación Fricción Cero Login exclusivo mediante OAuth2 de Discord.
 Perfiles sin Escritura Cuestionarios basados 100% en menús desplegables para roles y disponibilidad.
 Automatización de Estadísticas Conexión con la API de Ubisoft para extraer y mostrar el Rango y KD real de los jugadores.
 Métricas de Equipo Agregadas Cálculo automático del rango medio y KD medio de un roster completo usando solo los Ubisoft IDs de sus integrantes.
 Interacción Directa (El Match) Botones de contacto que abren enlaces profundos (`deep links`) hacia la aplicación de Discord para iniciar una conversación privada al instante.
 Modo Streamer (Admin) Panel oculto para destacar (fijar arriba) perfiles de jugadores y equipos en tiempo real durante transmisiones en directo.

---

## 🛠️ Stack Tecnológico

 Frontend Next.js (App Router), React, Tailwind CSS.
 Backend & Base de Datos Supabase (PostgreSQL).
 Autenticación Supabase Auth (Discord Provider).
 Iconografía & Gráficos SVGs vectoriales propios (diseño flatsticker).

---

## 👥 Sistema de Roles y Permisos

 Rol  Registro  Crea Perfil  Visibilidad  Acción Contactar (Discord) 
 ---  ---  ---  ---  --- 
 Invitado  No  No  Total  Requiere Login 
 OjeadorManager  Sí  No  Total  Permitido 
 Jugador (LFT)  Sí  Ficha Jugador  Total  Permitido 
 Capitán (LFG)  Sí  Ficha Equipo  Total  Permitido 

---

## 🎨 Sistema de Diseño (UIUX)

 Paleta de Colores Fondo principal morado vibrante (estilo lavanda) con patrón de cuadrícula sutil. Colores de acento sólidos (blanco puro o naranja) para llamadas a la acción (CTAs).
 Tipografía Fuente bold y condensada para los titulares (estilo cartel de esports). Fuente sans-serif limpia y legible para los datos técnicos.
 Estilo Visual Flat design. Contenedores de perfil con fondos sólidos oscuros y bordes blancos gruesos (2px-4px) simulando un estilo pegatina. Ausencia total de estéticas IA (sin neones, sin sombras difuminadas, sin brillos excesivos).

---

## 📋 Roadmap de Desarrollo (Paso a Paso)

- [ ] Fase 1 Configuración Base
  - Inicializar Next.js con Tailwind CSS.
  - Crear proyecto en Supabase y configurar base de datos (tablas `jugadores` y `equipos`).
  - Habilitar login de Discord en Supabase.
- [ ] Fase 2 Lógica Backend & APIs
  - Configurar las políticas de seguridad (RLS) en Supabase para los distintos roles.
  - Desarrollar la función (Server Action) para extraer datos de r6data.com API (Rango, KD). Env var: R6DATA_API_KEY.
  - Crear la lógica de cálculo matemático para las medias de los equipos.
- [ ] Fase 3 Interfaz de Usuario (UI)
  - Construir la Landing Page con los tablones visuales (Cards estilo pegatina).
  - Desarrollar los formularios modales (desplegables) para creación de perfiles.
  - Integrar los SVGs personalizados en la cabecera e iconografía.
- [ ] Fase 4 Funcionalidades Core
  - Implementar el deep link de Discord en el botón de Match (`discord-users[id]`).
  - Desarrollar el Modo Streamer (panel de administración oculto).
  - Activar Supabase Realtime para que los perfiles destacados suban automáticamente en el tablón.
- [ ] Fase 5 Testing & Despliegue
  - Probar flujos de usuarios en incógnito (Invitado vs Capitán vs Jugador).
  - Despliegue a producción.