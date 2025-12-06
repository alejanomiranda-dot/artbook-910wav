// src/components/ui/SuccessMessage.jsx

/**
 * Mensaje de éxito reutilizable con diseño consistente
 * @param {Object} props
 * @param {string} props.message - Mensaje de éxito a mostrar
 * @param {string} props.className - Clases adicionales
 * @returns {JSX.Element}
 */
export default function SuccessMessage({ message, className = '' }) {
    if (!message) return null;

    return (
        <div className={`form-message form-message-success ${className}`}>
            {message}
        </div>
    );
}
