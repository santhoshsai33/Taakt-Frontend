import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Button, Badge, Spinner } from 'react-bootstrap';
import PageTitle from '../../components/PageTitle/PageTitle';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import { FiArrowLeft } from 'react-icons/fi';
import { getShipmentDetails } from '../../api/shipmentsApi';
import { toast } from 'react-toastify';

const formatEnumLabel = (value = '') => {
    return value.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const ShipmentView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [shipment, setShipment] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            setIsLoading(true);
            try {
                const res = await getShipmentDetails(id);
                setShipment(res.data?.data?.shipment);
            } catch (error) {
                toast.error('Failed to fetch shipment details');
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchDetails();
        }
    }, [id]);

    if (isLoading) {
        return (
            <div className="d-flex align-items-center justify-content-center py-5 mt-5 text-muted">
                <Spinner animation="border" size="md" className="me-3" />
                <h5>Loading shipment details...</h5>
            </div>
        );
    }

    if (!shipment && !isLoading) {
        return (
            <div className="text-center py-5 mt-5">
                <h4 className="fw-bold text-muted">Shipment Not Found</h4>
                <Button variant="primary" className="mt-3" onClick={() => navigate('/shipments')}>Back to Shipments</Button>
            </div>
        );
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex align-items-center gap-3">
                    <Button variant="light" className="rounded-circle shadow-sm d-flex align-items-center justify-content-center border-0 p-0" style={{ width: '40px', height: '40px' }} onClick={() => navigate('/shipments')}>
                        <FiArrowLeft className="fs-5 text-dark" />
                    </Button>
                    <PageTitle title="Shipment Details" subtitle={`Viewing full details for ${shipment.orderId}`} />
                </div>
            </div>

            <Row>
                <Col lg={8}>
                    {/* Main Details Card */}
                    <Card className="border-0 shadow-sm rounded-4 mb-4">
                        <Card.Body className="p-4 p-md-5">
                            <div className="d-flex justify-content-between align-items-center border-bottom pb-4 mb-4">
                                <div>
                                    <h4 className="fw-bolder text-primary mb-1">{shipment.orderId}</h4>
                                    <div className="text-muted fw-semibold">Dispatch Date: <span className="text-dark bg-light px-2 py-1 rounded">{shipment.expectedDeliveryDate ? new Date(shipment.expectedDeliveryDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}</span></div>
                                </div>
                                <div className="text-end">
                                    <p className="text-muted mb-1 fw-bold fs-sm">Current Status</p>
                                    <StatusBadge status={shipment.currentStatus} />
                                </div>
                            </div>

                            {/* Route Info */}
                            <h6 className="fw-bold text-dark mb-3">Route Information</h6>
                            <Row className="mb-4 bg-light p-4 rounded-4 border">
                                <Col sm={5} className="text-center text-sm-start">
                                    <p className="text-muted mb-1 fs-sm fw-bold">From Location</p>
                                    <h5 className="fw-bolder text-dark mb-0">{shipment.fromLocation}</h5>
                                </Col>
                                <Col sm={2} className="d-flex align-items-center justify-content-center py-2 py-sm-0">
                                    <div className="text-primary fw-bold" style={{ fontSize: '1.5rem' }}>→</div>
                                </Col>
                                <Col sm={5} className="text-center text-sm-end">
                                    <p className="text-muted mb-1 fs-sm fw-bold">To Location</p>
                                    <h5 className="fw-bolder text-dark mb-0">{shipment.toLocation}</h5>
                                </Col>
                            </Row>

                            <hr className="text-muted opacity-10 my-4" />

                            {/* Entity Details */}
                            <Row className="gy-4">
                                <Col md={6}>
                                    <div className="p-4 border rounded-4 h-100 position-relative">
                                        <Badge bg="success" className="position-absolute top-0 start-50 translate-middle rounded-pill fw-normal shadow-sm">Customer</Badge>
                                        <h6 className="fw-bold text-dark mt-2">{shipment.customerName}</h6>
                                        <p className="text-secondary mb-0 fw-medium">{shipment.customerPhone}</p>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="p-4 border rounded-4 h-100 position-relative">
                                        <Badge bg="info" className="position-absolute top-0 start-50 translate-middle rounded-pill fw-normal shadow-sm text-dark">Driver</Badge>
                                        <h6 className="fw-bold text-dark mt-2">{shipment.driverName}</h6>
                                        <p className="text-secondary mb-1 fw-medium">{shipment.driverPhone}</p>
                                        {shipment.vehicleNumber && (
                                            <p className="text-muted mb-0 fw-bold" style={{ fontSize: '0.85rem' }}>Vehicle: <span className="text-dark">{shipment.vehicleNumber}</span></p>
                                        )}
                                    </div>
                                </Col>
                            </Row>

                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={4}>
                    {/* Meta Card */}
                    <Card className="border-0 shadow-sm rounded-4 mb-4">
                        <Card.Body className="p-4">
                            <h6 className="fw-bold border-bottom pb-3 mb-4">Shipment</h6>

                            <div className="mb-4">
                                <p className="text-muted mb-1 fs-sm fw-semibold">Trip Type</p>
                                <h6 className="fw-bold text-dark">{formatEnumLabel(shipment.tripType)}</h6>
                            </div>

                            {shipment.currentStatus !== 'DELIVERED' && shipment.currentLocation !== shipment.toLocation && (
                                <div className="mb-4">
                                    <p className="text-muted mb-1 fs-sm fw-semibold">Current Location</p>
                                    <h6 className="fw-bold text-primary bg-primary bg-opacity-10 p-2 rounded-3 border border-primary border-opacity-25 d-inline-block">
                                        {shipment.currentLocation}
                                    </h6>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ShipmentView;
