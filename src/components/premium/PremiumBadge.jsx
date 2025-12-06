// src/components/premium/PremiumBadge.jsx

/**
 * Badge que identifica artistas premium
 * @param {Object} props
 * @param {'premium'|'pro'} props.tier - Tier del artista
 * @param {'sm'|'md'|'lg'} props.size - Tamaño del badge
 * @param {string} props.className - Clases adicionales
 * @returns {JSX.Element}
 */
export default function PremiumBadge({ tier = 'premium', size = 'md', className = '' }) {
    if (tier === 'free') return null;

    const sizeClasses = {
        sm: 'premium-badge-sm',
        md: 'premium-badge-md',
        lg: 'premium-badge-lg',
    };

    const tierLabels = {
        premium: 'Premium',
        pro: 'Pro',
    };

    const tierColors = {
        premium: 'premium-badge-premium',
        pro: 'premium-badge-pro',
    };

    return (
        <span
            className={`premium-badge ${sizeClasses[size]} ${tierColors[tier]} ${className}`}
            title={`Artista ${tierLabels[tier]}`}
        >
            <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span>{tierLabels[tier]}</span>
        </span>
    );
}
