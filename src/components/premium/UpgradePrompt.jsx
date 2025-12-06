// src/components/premium/UpgradePrompt.jsx
import { Link } from 'react-router-dom';

/**
 * CTA para que artistas free se upgraden a premium
 * @param {Object} props
 * @param {string} props.feature - Feature que requiere premium
 * @param {string} props.message - Mensaje personalizado
 * @param {string} props.className - Clases adicionales
 * @returns {JSX.Element}
 */
export default function UpgradePrompt({
    feature,
    message,
    className = ''
}) {
    const defaultMessages = {
        analytics_advanced: 'Analytics avanzados solo disponibles para usuarios Premium',
        unlimited_photos: 'Fotos ilimitadas solo disponibles para usuarios Premium',
        unlimited_links: 'Links ilimitados solo disponibles para usuarios Premium',
        priority_ranking: 'Prioridad en ranking solo disponible para usuarios Premium',
        default: 'Esta funcionalidad solo está disponible para usuarios Premium',
    };

    const displayMessage = message || defaultMessages[feature] || defaultMessages.default;

    return (
        <div className={`upgrade-prompt ${className}`}>
            <div className="upgrade-prompt-icon">
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
            </div>

            <div className="upgrade-prompt-content">
                <h3>Actualiza a Premium</h3>
                <p>{displayMessage}</p>

                <div className="upgrade-prompt-benefits">
                    <ul>
                        <li>Analytics avanzados</li>
                        <li>Fotos y links ilimitados</li>
                        <li>Prioridad en rankings</li>
                        <li>Badge premium</li>
                    </ul>
                </div>

                {/* Placeholder - link a pricing cuando exista */}
                <Link to="/pricing" className="btn btn-primary">
                    Ver Planes Premium
                </Link>

                <p className="upgrade-prompt-footer">
                    Solo <strong>USD 2/mes</strong>
                </p>
            </div>
        </div>
    );
}
