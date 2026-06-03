import React from 'react';
import { Link } from 'react-router-dom';

const pageStyles = {
    wrapper: {
        alignItems: 'center',
        background: '#f8fafc',
        display: 'flex',
        inset: 0,
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '24px 16px',
        position: 'fixed',
        width: '100%',
        zIndex: 1,
    },
    content: {
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
        justifyContent: 'center',
        textAlign: 'center',
        width: '100%',
    },
    logo: {
        display: 'block',
        height: 'auto',
        marginBottom: '0.75rem',
        maxWidth: '190px',
        objectFit: 'contain',
        width: '100%',
    },
    title: {
        color: '#0f172a',
        fontSize: 'clamp(3rem, 5vw, 4.5rem)',
        fontWeight: 700,
        lineHeight: 1.05,
        margin: 0,
    },
    text: {
        color: '#64748b',
        fontSize: '1.15rem',
        lineHeight: 1.6,
        margin: 0,
    },
    link: {
        color: '#3b82f6',
        fontSize: '1.02rem',
        fontWeight: 500,
        textDecoration: 'underline',
        textUnderlineOffset: '3px',
    },
};

const NotFound = () => {
    return (
        <div style={pageStyles.wrapper}>
            <div style={pageStyles.content}>
                <img src="/img/logo.jpg" alt="Taakt Logistics" style={pageStyles.logo} />
                <h1 style={pageStyles.title}>404</h1>
                <p style={pageStyles.text}>Oops! Page not found</p>
                <Link to="/dashboard" style={pageStyles.link}>
                    Return to Home
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
