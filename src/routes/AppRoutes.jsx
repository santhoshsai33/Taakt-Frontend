import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard/Dashboard';
import Shipments from '../pages/Shipments/Shipments';
import AddShipment from '../pages/Shipments/AddShipment';
import ShipmentView from '../pages/Shipments/ShipmentView';
import Tracking from '../pages/Tracking/Tracking';
import Reports from '../pages/Reports/Reports';
import Profile from '../pages/Profile/Profile';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/shipments" element={<Shipments />} />
            <Route path="/shipments/add" element={<AddShipment />} />
            <Route path="/shipments/edit/:id" element={<AddShipment />} />
            <Route path="/shipments/view/:id" element={<ShipmentView />} />
            <Route path="/tracking" element={<Tracking />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/profile" element={<Profile />} />
        </Routes>
    );
};

export default AppRoutes;
