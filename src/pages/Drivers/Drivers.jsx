import React, { useState } from 'react';
import { Table, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { useApp } from '../../context/AppContext';
import PageTitle from '../../components/PageTitle/PageTitle';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import { FaPlus, FaUserPlus } from 'react-icons/fa';

const Drivers = () => {
    const { drivers, addDriver } = useApp();
    const [showModal, setShowModal] = useState(false);
    const [newDriver, setNewDriver] = useState({
        id: Date.now(),
        name: '',
        mobile: '',
        license: '',
        truckNumber: '',
        status: 'Available'
    });

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    const handleSubmit = (e) => {
        e.preventDefault();
        addDriver({ ...newDriver, id: Date.now() });
        setShowModal(false);
        setNewDriver({ id: Date.now(), name: '', mobile: '', license: '', truckNumber: '', status: 'Available' });
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <PageTitle title="Driver Management" subtitle="Manage your fleet drivers and their availability." />
                <Button variant="primary" onClick={handleShow} className="d-flex align-items-center gap-2 shadow-sm">
                    <FaUserPlus /> Add New Driver
                </Button>
            </div>

            <div className="custom-table-container">
                <Table responsive hover className="mb-0">
                    <thead>
                        <tr>
                            <th>Driver Name</th>
                            <th>Mobile Number</th>
                            <th>License Number</th>
                            <th>Truck Number</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {drivers.map((driver) => (
                            <tr key={driver.id}>
                                <td className="fw-bold">{driver.name}</td>
                                <td>{driver.mobile}</td>
                                <td>{driver.license}</td>
                                <td>{driver.truckNumber}</td>
                                <td><StatusBadge status={driver.status} /></td>
                                <td>
                                    <Button variant="outline-secondary" size="sm" className="rounded-pill px-3">Edit</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            <Modal show={showModal} onHide={handleClose} centered>
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fw-bold">Register New Driver</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={12} className="mb-3">
                                <Form.Label>Driver Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    required
                                    value={newDriver.name}
                                    onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
                                />
                            </Col>
                            <Col md={12} className="mb-3">
                                <Form.Label>Mobile Number</Form.Label>
                                <Form.Control
                                    type="text"
                                    required
                                    value={newDriver.mobile}
                                    onChange={(e) => setNewDriver({ ...newDriver, mobile: e.target.value })}
                                />
                            </Col>
                            <Col md={12} className="mb-3">
                                <Form.Label>License Number</Form.Label>
                                <Form.Control
                                    type="text"
                                    required
                                    value={newDriver.license}
                                    onChange={(e) => setNewDriver({ ...newDriver, license: e.target.value })}
                                />
                            </Col>
                            <Col md={12} className="mb-3">
                                <Form.Label>Truck Number</Form.Label>
                                <Form.Control
                                    type="text"
                                    required
                                    value={newDriver.truckNumber}
                                    onChange={(e) => setNewDriver({ ...newDriver, truckNumber: e.target.value })}
                                />
                            </Col>
                        </Row>
                        <div className="d-flex justify-content-end gap-2 mt-4">
                            <Button variant="light" onClick={handleClose} className="rounded-pill px-4">Cancel</Button>
                            <Button variant="primary" type="submit" className="rounded-pill px-4">Save Driver</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Drivers;
