import React from 'react';

const PageTitle = ({ title, subtitle }) => {
    return (
        <div className="mb-4">
            <h2 className="fw-bold mb-1">{title}</h2>
            {subtitle && <p className="text-secondary mb-0">{subtitle}</p>}
        </div>
    );
};

export default PageTitle;
