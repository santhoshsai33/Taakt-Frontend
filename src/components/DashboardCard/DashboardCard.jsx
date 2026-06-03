import React from 'react';
import { Card } from 'react-bootstrap';

const DashboardCard = ({ title, children, className = '', noPadding = false, headerAction }) => {
    return (
        <Card className={`saas-card border-0 ${className}`}>
            {(title || headerAction) && (
                <Card.Header className="saas-card-header border-0 bg-transparent px-4 pt-4 pb-0 d-flex justify-content-between align-items-center">
                    <h5 className="saas-card-title fw-bold mb-0 text-dark">{title}</h5>
                    {headerAction && <div>{headerAction}</div>}
                </Card.Header>
            )}
            <Card.Body className={`p-4 ${noPadding ? 'p-0' : ''}`}>
                {children}
            </Card.Body>
        </Card>
    );
};

export default DashboardCard;
