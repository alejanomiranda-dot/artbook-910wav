// src/pages/Pricing.jsx
import { Link } from 'react-router-dom';
import { TIER_FEATURES, TIER_PRICES, TIER_NAMES } from '../lib/constants';

function Pricing() {
    const freeTier = TIER_FEATURES.free;
    const premiumTier = TIER_FEATURES.premium;

    // WhatsApp de contacto - puede configurarse según necesidad
    const whatsappNumber = "5493416123456"; // Cambiar por número real
    const whatsappMessage = encodeURIComponent("Hola! Quiero activar mi plan Premium en Artbook 🎵");
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

    return (
        <div className="page-wrapper">
            <div className="page-header" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
                <h1 className="page-title">Planes de Artbook</h1>
                <p className="page-subtitle">
                    Elegí el plan que mejor se adapte a tus necesidades y llevá tu perfil al siguiente nivel.
                </p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '2rem',
                maxWidth: '1000px',
                margin: '3rem auto',
                padding: '0 1rem'
            }}>
                {/* PLAN FREE */}
                <div style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '2rem',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                        {TIER_NAMES.free}
                    </h2>
                    <div style={{
                        fontSize: '2.5rem',
                        fontWeight: 'bold',
                        color: 'var(--accent-violet)',
                        marginBottom: '1.5rem'
                    }}>
                        Gratis
                    </div>

                    <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0,
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem'
                    }}>
                        <li className="pricing-feature">✓ Perfil público personalizado</li>
                        <li className="pricing-feature">✓ Hasta {freeTier.max_tracks} tracks de música</li>
                        <li className="pricing-feature">✓ Hasta {freeTier.max_videos} videos</li>
                        <li className="pricing-feature">✓ Stats básicas (visitas totales y del mes)</li>
                        <li className="pricing-feature">✓ Redes sociales y contacto</li>
                        <li className="pricing-feature">✓ Aparición en catálogo y rankings</li>
                    </ul>

                    <Link
                        to="/apply"
                        className="btn btn-secondary"
                        style={{ marginTop: '1.5rem', width: '100%', justifyContent: 'center' }}
                    >
                        Crear perfil gratis
                    </Link>
                </div>

                {/* PLAN PREMIUM */}
                <div style={{
                    background: 'linear-gradient(135deg, rgba(168, 85, 255, 0.1), rgba(236, 72, 153, 0.1))',
                    border: '2px solid var(--accent-violet)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    boxShadow: '0 8px 32px rgba(168, 85, 255, 0.2)'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: '-12px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: 'linear-gradient(135deg, var(--accent-violet), var(--accent-pink))',
                        color: '#fff',
                        padding: '0.35rem 1.5rem',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.85rem',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                    }}>
                        Popular
                    </div>

                    <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                        {TIER_NAMES.premium}
                    </h2>
                    <div style={{
                        fontSize: '2.5rem',
                        fontWeight: 'bold',
                        color: 'var(--accent-pink)',
                        marginBottom: '0.25rem'
                    }}>
                        USD {TIER_PRICES.premium}
                        <span style={{ fontSize: '1rem', fontWeight: 'normal', color: 'var(--text-muted)' }}>/mes</span>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                        Incluye todo de Gratis, más:
                    </p>

                    <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0,
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem'
                    }}>
                        <li className="pricing-feature pricing-feature-premium">
                            <strong>Badge Premium</strong> visible en tu perfil
                        </li>
                        <li className="pricing-feature pricing-feature-premium">
                            Hasta <strong>{premiumTier.max_tracks} tracks</strong> y <strong>{premiumTier.max_videos} videos</strong>
                        </li>
                        <li className="pricing-feature pricing-feature-premium">
                            <strong>Analytics avanzados</strong> (fuentes de tráfico, horarios pico)
                        </li>
                        <li className="pricing-feature pricing-feature-premium">
                            <strong>Prioridad en rankings</strong> (multiplicador x1.2)
                        </li>
                        <li className="pricing-feature pricing-feature-premium">
                            <strong>Rotación en destacados</strong> del home
                        </li>
                        <li className="pricing-feature pricing-feature-premium">
                            <strong>Soporte prioritario</strong>
                        </li>
                    </ul>

                    <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary"
                        style={{
                            marginTop: '1.5rem',
                            width: '100%',
                            justifyContent: 'center',
                            background: 'linear-gradient(135deg, var(--accent-violet), var(--accent-pink))',
                            border: 'none'
                        }}
                    >
                        Activar Premium
                    </a>

                    <p style={{
                        textAlign: 'center',
                        fontSize: '0.85rem',
                        color: 'var(--text-muted)',
                        marginTop: '1rem'
                    }}>
                        Escribinos por WhatsApp o Instagram para activar tu plan
                    </p>
                </div>
            </div>

            {/* FAQ Section */}
            <div style={{ maxWidth: '700px', margin: '4rem auto 2rem', padding: '0 1rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>
                    Preguntas Frecuentes
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--accent-violet)' }}>
                            ¿Cómo activo mi plan Premium?
                        </h3>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                            Escribinos por WhatsApp haciendo click en el botón "Activar Premium". Te guiaremos en el proceso de activación.
                        </p>
                    </div>

                    <div>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--accent-violet)' }}>
                            ¿Puedo cancelar cuando quiera?
                        </h3>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                            Sí, podés cancelar tu suscripción en cualquier momento. Tu perfil seguirá activo pero volverá al plan gratuito.
                        </p>
                    </div>

                    <div>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--accent-violet)' }}>
                            ¿Qué métodos de pago aceptan?
                        </h3>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                            Actualmente gestionamos los pagos de forma manual. Contáctanos para conocer las opciones disponibles.
                        </p>
                    </div>
                </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '3rem', paddingBottom: '2rem' }}>
                <Link to="/book" className="btn btn-secondary">
                    Volver al catálogo
                </Link>
            </div>
        </div>
    );
}

export default Pricing;
