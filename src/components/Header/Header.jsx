import React, { useState, useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';
import { FaUserCircle } from 'react-icons/fa';
import { FiMenu, FiBell } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { getProfile } from '../../api/authApi';

const Header = ({ onMenuToggle }) => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('Admin User');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await getProfile();
                const data = res.data?.data || res.data;
                if (data && data.name) {
                    setUserName(data.name);
                }
            } catch (error) {
                // Silently bypass if profile can't load in header
            }
        };
        fetchUserData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/login', { replace: true });
    };

    return (
        <div className="header-nav d-flex align-items-center justify-content-between">
            {/* Hamburger — mobile only */}
            <button
                className="hamburger-btn d-lg-none"
                onClick={onMenuToggle}
                aria-label="Open menu"
            >
                <FiMenu size={22} />
            </button>

            {/* Spacer for desktop */}
            <div className="d-none d-lg-block" />

            {/* Right side */}
            <div className="d-flex align-items-center gap-3">


                {/* Profile */}
                <Dropdown align="end">
                    <Dropdown.Toggle
                        variant="link"
                        id="dropdown-profile"
                        className="p-0 text-decoration-none d-flex align-items-center gap-2"
                    >
                        <FaUserCircle className="fs-3 text-secondary" />
                        <div className="text-start d-none d-md-block">
                            <div className="fw-bold text-dark" style={{ fontSize: '0.85rem' }}>{userName}</div>
                            <div className="text-secondary" style={{ fontSize: '0.75rem' }}>Logistics Head</div>
                        </div>
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="border-0 shadow-lg rounded-4">
                        <Dropdown.Item onClick={() => navigate('/profile')}>My Profile</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={handleLogout} className="text-danger">Logout</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        </div>
    );
};

export default Header;
