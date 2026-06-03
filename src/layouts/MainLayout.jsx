import React, { useState } from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import Header from '../components/Header/Header';

const MainLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="d-flex">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="main-content flex-grow-1">
                <Header onMenuToggle={() => setSidebarOpen(prev => !prev)} />
                <div className="content-body">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default MainLayout;
