import React, { type ReactNode } from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'light' | 'dark';
  className?: string;
  icon?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  variant = 'light',
  className = '',
  icon,
  onClick,
  disabled = false,
}) => {
  const baseClasses = 'card h-100 border-0 shadow-sm position-relative';
  const variantClasses = {
    primary: 'border-start border-primary border-4 bg-gradient-light',
    secondary: 'border-start border-secondary border-4 bg-gradient-light',
    success: 'border-start border-success border-4 bg-gradient-light',
    info: 'border-start border-info border-4 bg-gradient-light',
    warning: 'border-start border-warning border-4 bg-gradient-light',
    danger: 'border-start border-danger border-4 bg-gradient-light',
    light: 'border-start border-light border-4 bg-gradient-light',
    dark: 'border-start border-dark border-4 bg-gradient-light',
  };

  const cardClasses = `${baseClasses} ${variantClasses[variant]} ${className} ${
    onClick && !disabled ? 'cursor-pointer hover-lift' : ''
  }`;

  return (
    <div
      className={cardClasses}
      onClick={onClick && !disabled ? onClick : undefined}
      style={{ cursor: onClick && !disabled ? 'pointer' : 'default', display: 'flex', flexDirection: 'column' }}
    >
      {/* Top Separator */}
      <div className="card-top-separator"></div>

      <div className="card-body p-4 d-flex flex-column flex-grow-1">
        {(title || icon) && (
          <div
            className="d-flex align-items-start mb-3"
            style={{ minHeight: '56px', maxHeight: '56px', overflow: 'hidden' }}
          >
            {icon && (
              <div className="icon-container me-3">
                <i className={`bi ${icon} fs-4 text-${variant}`}></i>
              </div>
            )}
            <div className="flex-grow-1">
              {title && (
                <h5
                  className="card-title mb-1 fw-bold"
                  style={{
                    lineHeight: '1.2',
                    fontSize: '1.25rem',
                    whiteSpace: 'normal',
                    wordBreak: 'break-word',
                    marginBottom: subtitle ? 0 : undefined,
                  }}
                >
                  {title}
                </h5>
              )}
              {subtitle && (
                <p
                  className="card-subtitle text-muted small mb-0"
                  style={{ lineHeight: '1.2', whiteSpace: 'normal', wordBreak: 'break-word' }}
                >
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Content Separator */}
        {(title || icon) && <hr className="my-3 opacity-25" />}

        <div className="card-text flex-grow-1 d-flex flex-column">{children}</div>
      </div>

      {/* Bottom Separator */}
      <div className="card-bottom-separator"></div>
    </div>
  );
};

export default Card;