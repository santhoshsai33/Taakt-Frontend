import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { useApp } from '../../context/AppContext';
import PageTitle from '../../components/PageTitle/PageTitle';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

const Reports = () => {
    const { shipments } = useApp();

    const totalTrips = shipments.length;
    const longTrips = shipments.filter(s => s.tripType === 'Long Trip').length;
    const shortTrips = shipments.filter(s => s.tripType === 'Short Trip').length;
    const delivered = shipments.filter(s => s.status === 'Delivered').length;

    const tripTypeData = [
        { name: 'Long Trips', value: longTrips },
        { name: 'Short Trips', value: shortTrips },
    ];
    const COLORS = ['#6366f1', '#2dd4bf'];

    const weeklyData = [
        { name: 'Mon', completed: 2, new: 4 },
        { name: 'Tue', completed: 3, new: 1 },
        { name: 'Wed', completed: 5, new: 2 },
        { name: 'Thu', completed: 1, new: 5 },
        { name: 'Fri', completed: 4, new: 3 },
        { name: 'Sat', completed: 6, new: 2 },
        { name: 'Sun', completed: 2, new: 1 },
    ];

    return (
        <div>
            <PageTitle title="Analytics & Reports" subtitle="View performance metrics and shipment statistics." />

            <Row className="mb-4">
                {[
                    { title: 'Total Trips Logged', value: totalTrips, color: 'text-primary' },
                    { title: 'Long Distance Trips', value: longTrips, color: 'text-info' },
                    { title: 'Short Distance Trips', value: shortTrips, color: 'text-secondary' },
                    { title: 'Successfully Delivered', value: delivered, color: 'text-success' },
                ].map((stat, idx) => (
                    <Col key={idx} md={3} sm={6} className="mb-3">
                        <Card className="border-0 shadow-sm rounded-4 text-center p-3 h-100">
                            <h6 className="text-muted mb-2">{stat.title}</h6>
                            <h2 className={`fw-bold mb-0 ${stat.color}`}>{stat.value}</h2>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Row>
                <Col md={8} className="mb-4">
                    <Card className="border-0 shadow-sm rounded-4 h-100">
                        <Card.Body>
                            <h5 className="fw-bold mb-4">Weekly Shipment Activity</h5>
                            <div style={{ height: 300 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={weeklyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                        <YAxis axisLine={false} tickLine={false} />
                                        <RechartsTooltip cursor={{ fill: '#f8fafc' }} />
                                        <Legend />
                                        <Bar dataKey="new" fill="#6366f1" radius={[4, 4, 0, 0]} name="New Shipments" />
                                        <Bar dataKey="completed" fill="#2dd4bf" radius={[4, 4, 0, 0]} name="Completed" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4} className="mb-4">
                    <Card className="border-0 shadow-sm rounded-4 h-100">
                        <Card.Body>
                            <h5 className="fw-bold mb-4 text-center">Trip Type Distribution</h5>
                            <div style={{ height: 300 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={tripTypeData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={90}
                                            fill="#8884d8"
                                            paddingAngle={5}
                                            dataKey="value"
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        >
                                            {tripTypeData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Reports;
