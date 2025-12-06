// src/components/ui/LoadingSpinner.jsx
import './LoadingSpinner.css';

/**
 * Spinner de carga consistente para toda la app
 * @param {Object} props
 * @param {'sm'|'md'|'lg'} props.size - Tamaño del spinner
 * @param {string} props.className - Clases adicionales
 * @returns {JSX.Element}
 */
export default function LoadingSpinner({ size = 'md', className = '' }) {
    const sizeClass = `spinner-${size}`;

    return (
        <div className={`loading-spinner ${sizeClass} ${className}`}>
            <div className="spinner-ring">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    );
}
