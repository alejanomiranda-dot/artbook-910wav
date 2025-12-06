// src/lib/constants.js

export const TIPOS_EVENTOS_OPCIONES = [
    "Casamientos",
    "Cumpleaños",
    "Eventos corporativos",
    "Bares / pubs",
    "Teatros / salas",
    "Festivales",
    "Fiestas privadas",
    "Eventos infantiles",
    "Eventos al aire libre",
    "Eventos culturales",
];

export const GENEROS_OPCIONES = [
    "Pop",
    "Rock",
    "Trap",
    "Reggaetón",
    "Latino",
    "Cumbia",
    "Folklore",
    "Jazz",
    "Blues",
    "Soul / R&B",
    "Electrónica",
    "Indie",
    "Infantil",
    "Tango",
    "Clásica",
    "Metal",
    "Punk",
    "Funk",
    "Rap / Hip-Hop"
];

export const CLIMAS_OPCIONES = [
    "Fiesta",
    "Chill",
    "Emotivo",
    "Ceremonial",
    "After / Lounge",
    "Romántico",
    "Familia / Infantil",
    "Background / Ambiental",
    "Concierto"
];

export const CIUDADES_ARG = [
    { ciudad: "Rosario", provincia: "Santa Fe" },
    { ciudad: "Santa Fe", provincia: "Santa Fe" },
    { ciudad: "Buenos Aires", provincia: "Buenos Aires" },
    { ciudad: "Córdoba", provincia: "Córdoba" },
    { ciudad: "Mendoza", provincia: "Mendoza" },
    { ciudad: "La Plata", provincia: "Buenos Aires" },
    { ciudad: "Mar del Plata", provincia: "Buenos Aires" },
    { ciudad: "San Miguel de Tucumán", provincia: "Tucumán" },
    { ciudad: "Salta", provincia: "Salta" },
    { ciudad: "Paraná", provincia: "Entre Ríos" },
    { ciudad: "Neuquén", provincia: "Neuquén" },
    { ciudad: "Posadas", provincia: "Misiones" },
    { ciudad: "San Salvador de Jujuy", provincia: "Jujuy" },
    { ciudad: "Corrientes", provincia: "Corrientes" },
    { ciudad: "San Luis", provincia: "San Luis" },
    { ciudad: "San Luis", provincia: "San Luis" },
    { ciudad: "Otra ciudad", provincia: "Otra" }
];

// Diccionario para normalizar géneros (eliminar duplicados, typos, etc.)
// Clave: string en minúsculas sin acentos
// Valor: Display Name correcto
export const GENEROS_NORMALIZACION = {
    // Reggaetón variations
    "regaeton": "Reggaetón",
    "reggaeton": "Reggaetón",
    "reggaetón": "Reggaetón",
    "regaetón": "Reggaetón",
    "regueton": "Reggaetón",

    // Hip Hop / Rap variations
    "rap": "Rap / Hip-Hop",
    "hiphop": "Rap / Hip-Hop",
    "hip-hop": "Rap / Hip-Hop",
    "rap / hip-hop": "Rap / Hip-Hop",
    "trap": "Trap",

    // Standard genres
    "pop": "Pop",
    "rock": "Rock",
    "latino": "Latino",
    "salsa": "Salsa",
    "cumbia": "Cumbia",
    "folklore": "Folklore",
    "jazz": "Jazz",
    "blues": "Blues",
    "soul": "Soul / R&B",
    "r&b": "Soul / R&B",
    "soul / r&b": "Soul / R&B",
    "electronica": "Electrónica",
    "indie": "Indie",
    "infantil": "Infantil",
    "tango": "Tango",
    "clasica": "Clásica",
    "metal": "Metal",
    "punk": "Punk",
    "funk": "Funk",
};

// ============================================
// PREMIUM CONSTANTS
// ============================================

/**
 * Tiers de suscripción disponibles
 */
export const SUBSCRIPTION_TIERS = {
    FREE: 'free',
    PREMIUM: 'premium',
    PRO: 'pro', // Para futuro
};

/**
 * Nombres de tiers para mostrar
 */
export const TIER_NAMES = {
    free: 'Gratis',
    premium: 'Premium',
    pro: 'Pro'
};

/**
 * Precios mensuales en USD
 */
export const TIER_PRICES = {
    free: 0,
    premium: 2,
    pro: 5, // Futuro
};

/**
 * Features y límites por tier
 * - Boolean true = feature habilitada
 * - Boolean false = feature deshabilitada
 * - Number = límite cuantitativo
 * - 999 = "ilimitado" 
 */
export const TIER_FEATURES = {
    free: {
        // Contenido
        max_tracks: 3,
        max_videos: 2,
        max_photos: 1, // Solo avatar + portada = 2 fotos
        max_links: 5,

        // Analytics
        analytics_basic: true,
        analytics_advanced: false,
        analytics_traffic_sources: false,
        analytics_peak_hours: false,

        // Visibilidad
        priority_ranking: false,
        featured_rotation: false,
        custom_url: false,

        // Soporte
        support_priority: false,

        // Visual
        badge: false,
        custom_theme: false,
    },
    premium: {
        // Contenido
        max_tracks: 5,
        max_videos: 4,
        max_photos: 999, // "Ilimitadas"
        max_links: 999,  // "Ilimitados"

        // Analytics
        analytics_basic: true,
        analytics_advanced: true,
        analytics_traffic_sources: true,
        analytics_peak_hours: true,

        // Visibilidad
        priority_ranking: true,  // Multiplicador x1.2 en ranking
        featured_rotation: true, // Aparece en destacados
        custom_url: false,       // Futuro

        // Soporte
        support_priority: true,

        // Visual
        badge: true,
        custom_theme: false,
    },
    pro: {
        // Tier futuro - todos los features
        max_tracks: 999,
        max_videos: 999,
        max_photos: 999,
        max_links: 999,

        analytics_basic: true,
        analytics_advanced: true,
        analytics_traffic_sources: true,
        analytics_peak_hours: true,

        priority_ranking: true,
        featured_rotation: true,
        custom_url: true,

        support_priority: true,

        badge: true,
        custom_theme: true,
    },
};

/**
 * Status de suscripciones
 */
export const SUBSCRIPTION_STATUS = {
    FREE: 'free',
    ACTIVE: 'active',
    CANCELLED: 'cancelled',
    EXPIRED: 'expired',
    TRIAL: 'trial', // Futuro
};

