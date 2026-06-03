import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FiGrid, FiPackage, FiMapPin, FiX } from 'react-icons/fi';

const Sidebar = ({ isOpen, onClose }) => {
    const menuItems = [
        { path: '/dashboard', name: 'Dashboard', icon: <FiGrid size={18} /> },
        { path: '/shipments', name: 'Shipments', icon: <FiPackage size={18} /> },
        { path: '/tracking', name: 'Update Tracking', icon: <FiMapPin size={18} /> },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={onClose}
                />
            )}

            <div className={`sidebar shadow-sm ${isOpen ? 'sidebar-open' : ''}`}>
                {/* Brand */}
                <div className="sidebar-brand-wrap">
                    <img src="/img/logo.jpg" alt="Taakt Logo" className="sidebar-logo" />
                    {/* Mobile close button */}
                    <button className="sidebar-close-btn d-lg-none" onClick={onClose}>
                        <FiX size={20} />
                    </button>
                </div>

                {/* Nav items */}
                <nav className="sidebar-nav-list">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={onClose}
                            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                        >
                            <span className="nav-icon-wrap">{item.icon}</span>
                            <span className="nav-label">{item.name}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* User Footer */}
                {/* <div className="sidebar-user">
                    <div className="sidebar-user-avatar">A</div>
                    <div className="sidebar-user-info">
                        <div className="sidebar-user-name">Admin User</div>
                        <div className="sidebar-user-role">Logistics Head</div>
                    </div>
                </div> */}
            </div>
        </>
    );
};

export default Sidebar;
