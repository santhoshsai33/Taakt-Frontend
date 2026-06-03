import React from 'react';

const SectionHeader = ({ title, subtitle, rightContent }) => {
    return (
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 mt-2">
            <div>
                <h4 className="fw-bolder text-dark mb-1 d-flex align-items-center gap-2">{title}</h4>
                {subtitle && <p className="text-muted fw-medium mb-0" style={{ fontSize: '0.95rem' }}>{subtitle}</p>}
            </div>
            {rightContent && <div className="mt-3 mt-md-0 d-flex gap-2">{rightContent}</div>}
        </div>
    );
};

export default SectionHeader;
