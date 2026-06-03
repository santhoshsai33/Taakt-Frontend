import React, { createContext, useState, useContext } from 'react';
import { shipments as initialShipments } from '../data/shipments';
import { drivers as initialDrivers } from '../data/drivers';
import { trackingHistory as initialHistory } from '../data/trackingHistory';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [shipments, setShipments] = useState(initialShipments);
    const [drivers, setDrivers] = useState(initialDrivers);
    const [history, setHistory] = useState(initialHistory);

    const addShipment = (shipment) => {
        setShipments([shipment, ...shipments]);
    };

    const deleteShipment = (shipmentId) => {
        setShipments(shipments.filter(s => s.id !== shipmentId));
    };

    const addDriver = (driver) => {
        setDrivers([driver, ...drivers]);
    };

    const updateTracking = (update) => {
        const newHistoryItem = {
            id: Date.now(),
            ...update,
            updatedTime: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }),
        };
        setHistory([...history, newHistoryItem]);

        // Update shipment status and location
        setShipments(shipments.map(s =>
            s.id === update.shipmentId
                ? { ...s, status: update.status, currentLocation: update.location }
                : s
        ));
    };

    return (
        <AppContext.Provider value={{
            shipments,
            drivers,
            history,
            addShipment,
            deleteShipment,
            addDriver,
            updateTracking
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => useContext(AppContext);
