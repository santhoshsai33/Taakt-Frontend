import { useEffect, useState } from 'react';
import { Row, Col, Table, Badge, Button, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import DashboardCard from '../../components/DashboardCard/DashboardCard';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import {
    FaTruck, FaBox, FaCheckCircle, FaRoute,
    FaExchangeAlt, FaPlus, FaCalendarAlt
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { getShipmentDashboard } from '../../api/shipmentsApi';

const emptyDashboard = {
    cards: {
        totalShipments: 0,
        activeShipments: 0,
        deliveredShipments: 0,
        longTripShipments: 0,
        shortTripShipments: 0,
    },
    recentShipments: [],
};

const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good morning';
    if (hour >= 12 && hour < 17) return 'Good afternoon';
    return 'Good evening';
};

const formatEnumLabel = (value = '') => {
    return value.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState(emptyDashboard);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await getShipmentDashboard();
                setDashboardData(response.data?.data || emptyDashboard);
            } catch (error) {
                const message = error.response?.data?.message || 'Unable to load dashboard summary.';
                toast.error(message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    const todayDate = new Date().toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric'
    });

    const { cards, recentShipments } = dashboardData;

    const stats = [
        {
            title: 'Total Shipments',
            value: cards.totalShipments,
            increase: '+12%',
            trend: 'up',
            icon: <FaBox />,
            bg: 'bg-primary-soft',
            iconColor: 'text-primary'
        },
        {
            title: 'Active',
            value: cards.activeShipments,
            increase: '+5%',
            trend: 'up',
            icon: <FaTruck />,
            bg: 'bg-info-soft',
            iconColor: 'text-info'
        },
        {
            title: 'Delivered',
            value: cards.deliveredShipments,
            increase: '+18%',
            trend: 'up',
            icon: <FaCheckCircle />,
            bg: 'bg-success-soft',
            iconColor: 'text-success'
        },
        {
            title: 'Long Trips',
            value: cards.longTripShipments,
            increase: '-2%',
            trend: 'down',
            icon: <FaRoute />,
            bg: 'bg-purple-soft',
            iconColor: 'text-purple'
        },
        {
            title: 'Short Trips',
            value: cards.shortTripShipments,
            increase: '+8%',
            trend: 'up',
            icon: <FaExchangeAlt />,
            bg: 'bg-orange-soft',
            iconColor: 'text-orange'
        }
    ];

    return (
        <div className="grand-dashboard">
            <DashboardCard className="mb-4 glass-welcome">
                <Row className="align-items-center">
                    <Col md={8}>
                        <h3 className="fw-bolder text-dark mb-1">{getGreeting()}, Admin!</h3>
                        <p className="text-secondary fw-medium mb-0 d-flex align-items-center gap-2">
                            <FaCalendarAlt className="text-muted" /> {todayDate}
                        </p>
                    </Col>
                    {/* <Col md={4} className="text-md-end mt-3 mt-md-0">
                        <Button
                            variant="primary"
                            className="rounded-pill px-4 py-2 shadow-sm d-inline-flex align-items-center gap-2 fw-semibold border-0"
                            onClick={() => navigate('/shipments/add')}
                            style={{ background: 'var(--primary-color)' }}
                        >
                            <FaPlus /> New Shipment
                        </Button>
                    </Col> */}
                </Row>
            </DashboardCard>

            <Row className="gx-4 mb-4">
                {stats.map((stat) => (
                    <Col key={stat.title} className="mb-3 col-lg flex-grow-1" style={{ minWidth: '200px' }}>
                        <DashboardCard className="h-100 hover-elevate">
                            <div className="d-flex justify-content-between align-items-start mb-3">
                                <div className={`stat-icon-wrapper rounded-3 d-flex align-items-center justify-content-center ${stat.bg} ${stat.iconColor}`}>
                                    {stat.icon}
                                </div>
                            </div>
                            <div>
                                <h3 className="fw-bolder text-dark mb-1">{stat.value}</h3>
                                <p className="text-muted fw-semibold mb-0" style={{ fontSize: '0.85rem' }}>{stat.title}</p>
                            </div>
                        </DashboardCard>
                    </Col>
                ))}
            </Row>

            <Row className="gx-4">
                <Col lg={12}>
                    <DashboardCard
                        title="Recent Shipments"
                        noPadding
                        headerAction={
                            <Button variant="link" className="text-decoration-none fw-bold text-primary p-0" onClick={() => navigate('/shipments')}>View All</Button>
                        }
                    >
                        <Table responsive hover className="mb-0 custom-saas-table align-middle">
                            <thead>
                                <tr>
                                    <th className="ps-4">ID / Type</th>
                                    <th>Route</th>
                                    <th>Customer</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading && (
                                    <tr>
                                        <td colSpan={4} className="text-center py-5">
                                            <Spinner animation="border" size="sm" className="me-2" />
                                            Loading dashboard...
                                        </td>
                                    </tr>
                                )}
                                {!isLoading && recentShipments.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="text-center text-muted py-5">No recent shipments found.</td>
                                    </tr>
                                )}
                                {!isLoading && recentShipments.map((shipment) => (
                                    <tr key={shipment._id}>
                                        <td className="ps-4">
                                            <div className="fw-bolder text-dark">{shipment.orderId}</div>
                                            <div className="text-muted" style={{ fontSize: '0.75rem' }}>{formatEnumLabel(shipment.tripType)}</div>
                                        </td>
                                        <td>
                                            <div className="fw-bolder text-dark" style={{ fontSize: '0.85rem' }}>{shipment.fromLocation}</div>
                                            <div className="text-muted" style={{ fontSize: '0.75rem' }}>-&gt; {shipment.toLocation}</div>
                                        </td>
                                        <td>
                                            <div className="fw-bolder text-dark" style={{ fontSize: '0.85rem' }}>{shipment.customerName}</div>
                                        </td>
                                        <td><StatusBadge status={shipment.currentStatus} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </DashboardCard>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;
