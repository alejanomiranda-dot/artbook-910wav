// src/components/ui/ErrorMessage.jsx

/**
 * Mensaje de error reutilizable con diseño consistente
 * @param {Object} props
 * @param {string} props.message - Mensaje de error a mostrar
 * @param {Function} props.onRetry - Función opcional para reintentar
 * @param {string} props.className - Clases adicionales
 * @returns {JSX.Element}
 */
export default function ErrorMessage({ message, onRetry, className = '' }) {
    if (!message) return null;

    return (
        <div className={`form-message form-message-error ${className}`}>
            <div style={{ marginBottom: onRetry ? '0.75rem' : 0 }}>
                {message}
            </div>
            {onRetry && (
                <button
                    type="button"
                    onClick={onRetry}
                    className="btn btn-small btn-secondary"
                    style={{ marginTop: '0.5rem' }}
                >
                    Reintentar
                </button>
            )}
        </div>
    );
}
