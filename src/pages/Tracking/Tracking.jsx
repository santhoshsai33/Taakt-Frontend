import { useEffect, useRef, useState } from 'react';
import { Form, Button, Row, Col, Card, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import PageTitle from '../../components/PageTitle/PageTitle';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import { FaMapMarkerAlt, FaLocationArrow, FaChevronDown } from 'react-icons/fa';
import { getShipmentDetails, getShipmentDropdownOptions, updateShipment } from '../../api/shipmentsApi';

const formatEnumLabel = (value = '') => {
    return value.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const Tracking = () => {
    const [shipmentOptions, setShipmentOptions] = useState([]);
    const [selectedShipmentId, setSelectedShipmentId] = useState('');
    const [selectedShipmentData, setSelectedShipmentData] = useState(null);
    const [trackingHistory, setTrackingHistory] = useState([]);
    const [isLoadingOptions, setIsLoadingOptions] = useState(true);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [update, setUpdate] = useState({
        shipmentId: '',
        location: '',
        remarks: '',
        status: ''
    });
    // Searchable dropdown state
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [dropdownSearch, setDropdownSearch] = useState('');
    const dropdownRef = useRef(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClick = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    useEffect(() => {
        const fetchShipmentOptions = async () => {
            try {
                const response = await getShipmentDropdownOptions();
                setShipmentOptions(response.data?.data || []);
            } catch (error) {
                const message = error.response?.data?.message || 'Unable to load shipment options.';
                toast.error(message);
            } finally {
                setIsLoadingOptions(false);
            }
        };

        fetchShipmentOptions();
    }, []);

    const fetchShipmentDetails = async (shipmentId) => {
        if (!shipmentId) {
            setSelectedShipmentData(null);
            setTrackingHistory([]);
            return;
        }

        setIsLoadingDetails(true);

        try {
            const response = await getShipmentDetails(shipmentId);
            const shipment = response.data?.data?.shipment || null;
            const history = response.data?.data?.trackingHistory || [];

            setSelectedShipmentData(shipment);
            setTrackingHistory(history);
            setUpdate((current) => ({
                ...current,
                shipmentId,
                location: shipment?.currentLocation || '',
                status: '',
            }));
        } catch (error) {
            const message = error.response?.data?.message || 'Unable to load shipment details.';
            toast.error(message);
            setSelectedShipmentData(null);
            setTrackingHistory([]);
        } finally {
            setIsLoadingDetails(false);
        }
    };

    useEffect(() => {
        fetchShipmentDetails(selectedShipmentId);
    }, [selectedShipmentId]);

    // Automatically adjust status based on destination match
    useEffect(() => {
        if (!selectedShipmentData || !update.location) return;

        const dest = selectedShipmentData.toLocation?.trim().toLowerCase();
        const loc = update.location.trim().toLowerCase();
        const isDestination = dest && loc && dest === loc;

        if (isDestination && update.status !== 'DELIVERED') {
            setUpdate(prev => ({ ...prev, status: 'DELIVERED' }));
        } else if (!isDestination && update.status === 'DELIVERED') {
            setUpdate(prev => ({ ...prev, status: '' }));
        }
    }, [update.location, selectedShipmentData]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!update.shipmentId) {
            toast.error('Please select a shipment.');
            return;
        }

        if (!update.status) {
            toast.error('Please select a status.');
            return;
        }

        setIsSubmitting(true);

        try {
            const payload = {
                location: update.location.trim(),
                currentLocation: update.location.trim(),
                status: update.status,
                currentStatus: update.status,
                remarks: update.remarks.trim(),
            };

            const response = await updateShipment(update.shipmentId, payload);
            toast.success(response.data?.message || 'Shipment updated successfully.');

            if (update.status === 'DELIVERED') {
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                setUpdate(prev => ({ ...prev, remarks: '' }));
                await fetchShipmentDetails(update.shipmentId);
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Unable to update shipment.';
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <PageTitle title="Update Tracking" subtitle="Manually update shipment progress and location." />

            <Row className="mb-4">
                <Col md={5}>
                    <Card className="border-0 shadow-sm rounded-4 h-100">
                        <Card.Body className="p-4">
                            <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
                                <FaLocationArrow className="text-primary" /> Log Update
                            </h5>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Select Shipment</Form.Label>
                                    <div className="trk-searchable-dropdown" ref={dropdownRef}>
                                        <div
                                            className={`trk-dropdown-trigger ${dropdownOpen ? 'open' : ''}`}
                                            onClick={() => !isLoadingOptions && setDropdownOpen(o => !o)}
                                        >
                                            <span className={selectedShipmentId ? 'trk-selected-label' : 'trk-placeholder'}>
                                                {isLoadingOptions
                                                    ? 'Loading shipments...'
                                                    : selectedShipmentId
                                                        ? shipmentOptions.find(s => s._id === selectedShipmentId)?.displayLabel || 'Choose Shipment...'
                                                        : 'Choose Shipment...'}
                                            </span>
                                            <FaChevronDown className="trk-chevron" />
                                        </div>
                                        {dropdownOpen && (
                                            <div className="trk-dropdown-panel">
                                                <div className="trk-search-wrap">
                                                    <input
                                                        autoFocus
                                                        type="text"
                                                        className="trk-search-input"
                                                        placeholder="Search shipment..."
                                                        value={dropdownSearch}
                                                        onChange={e => setDropdownSearch(e.target.value)}
                                                    />
                                                </div>
                                                <ul className="trk-options-list">
                                                    {shipmentOptions
                                                        .filter(s => s.displayLabel.toLowerCase().includes(dropdownSearch.toLowerCase()))
                                                        .map(shipment => (
                                                            <li
                                                                key={shipment._id}
                                                                className={`trk-option-item ${selectedShipmentId === shipment._id ? 'selected' : ''}`}
                                                                onClick={() => {
                                                                    setSelectedShipmentId(shipment._id);
                                                                    setDropdownOpen(false);
                                                                    setDropdownSearch('');
                                                                }}
                                                            >
                                                                {shipment.displayLabel}
                                                            </li>
                                                        ))
                                                    }
                                                    {shipmentOptions.filter(s => s.displayLabel.toLowerCase().includes(dropdownSearch.toLowerCase())).length === 0 && (
                                                        <li className="trk-option-empty">No results found</li>
                                                    )}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Current Location</Form.Label>
                                    <Form.Control
                                        type="text"
                                        required
                                        placeholder="e.g., Bangalore"
                                        value={update.location}
                                        onChange={(e) => setUpdate({ ...update, location: e.target.value })}
                                        disabled={!selectedShipmentId || isLoadingDetails}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Status</Form.Label>
                                    <Form.Select
                                        value={update.status}
                                        onChange={(e) => setUpdate({ ...update, status: e.target.value })}
                                        disabled={!selectedShipmentId || isLoadingDetails}
                                    >
                                        {(() => {
                                            const dest = selectedShipmentData?.toLocation?.trim().toLowerCase();
                                            const loc = update.location.trim().toLowerCase();
                                            const isDestination = dest && loc && dest === loc;

                                            if (isDestination) {
                                                return <option value="DELIVERED">Delivered</option>;
                                            } else {
                                                return (
                                                    <>
                                                        <option value="" disabled>Select Status</option>
                                                        {/* <option value="BOOKED">Booked</option> */}
                                                        {/* <option value="DISPATCH">Dispatch</option> */}
                                                        <option value="IN_TRANSIT">In Transit</option>
                                                        <option value="DELAYED">Delayed</option>
                                                    </>
                                                );
                                            }
                                        })()}
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label>Remarks</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        placeholder="Weather delayed, resting, etc."
                                        value={update.remarks}
                                        onChange={(e) => setUpdate({ ...update, remarks: e.target.value })}
                                        disabled={!selectedShipmentId || isLoadingDetails}
                                    />
                                </Form.Group>

                                <Button
                                    variant="primary"
                                    type="submit"
                                    className="w-100 rounded-pill py-2"
                                    disabled={!selectedShipmentId || isLoadingDetails || isSubmitting}
                                >
                                    {isSubmitting ? 'Saving...' : 'Submit Update'}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={7}>
                    <div className="custom-table-container h-100 p-4">
                        <h5 className="fw-bold mb-4 d-flex align-items-center gap-2 border-bottom pb-3">
                            <FaMapMarkerAlt className="text-secondary" /> Selected Shipment Details
                        </h5>

                        {isLoadingDetails ? (
                            <div className="d-flex align-items-center justify-content-center h-75 text-muted">
                                <Spinner animation="border" size="sm" className="me-2" />
                                Loading shipment details...
                            </div>
                        ) : selectedShipmentData ? (
                            <div className="shipment-details">
                                <Row className="mb-4">
                                    <Col sm={6}>
                                        <p className="text-muted mb-1 fs-sm fw-semibold">Shipment ID</p>
                                        <h5 className="fw-bold text-primary">{selectedShipmentData.orderId}</h5>
                                    </Col>
                                    <Col sm={6}>
                                        <p className="text-muted mb-1 fs-sm fw-semibold">Status</p>
                                        <StatusBadge status={selectedShipmentData.currentStatus} />
                                    </Col>
                                </Row>

                                <Row className="mb-4">
                                    <Col sm={6}>
                                        <p className="text-muted mb-1 fs-sm fw-semibold">Route</p>
                                        <h6 className="fw-bold mb-0">{selectedShipmentData.fromLocation}</h6>
                                        <p className="text-muted mb-0">{selectedShipmentData.toLocation}</p>
                                    </Col>
                                    <Col sm={6}>
                                        <p className="text-muted mb-1 fs-sm fw-semibold">Trip Type</p>
                                        <h6 className="fw-bold mb-0">{formatEnumLabel(selectedShipmentData.tripType)}</h6>
                                        <p className="text-muted mb-0">{selectedShipmentData.currentLocation}</p>
                                    </Col>
                                </Row>

                                <div className="tracking-timeline-scroll mt-4 border-top pt-4" style={{ maxHeight: '350px', overflowY: 'auto', paddingRight: '10px' }}>
                                    <div className="tracking-timeline">
                                        <div className="timeline-item completed">
                                            <div className="timeline-marker"></div>
                                            <h6 className="fw-bold mb-1">{selectedShipmentData.fromLocation}</h6>
                                            <p className="text-muted small mb-0 fw-semibold">Origin / Dispatch</p>
                                        </div>

                                        {trackingHistory
                                            .filter((item, index) => !(index === 0 && item.location === selectedShipmentData.fromLocation))
                                            .map((item, index, array) => {
                                                const isLastHistory = index === array.length - 1;
                                                return (
                                                    <div key={item._id} className={`timeline-item ${isLastHistory ? 'current' : 'completed'}`}>
                                                        <div className="timeline-marker"></div>
                                                        <h6 className={`fw-bold mb-1 ${isLastHistory ? 'text-primary fs-5' : ''}`}>{item.location}</h6>
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <p className={`small mb-0 fw-semibold ${isLastHistory ? 'text-primary' : 'text-muted'}`}>
                                                                {isLastHistory ? (selectedShipmentData.currentStatus === 'DELIVERED' ? 'Destination reached' : 'Current location') : item.remarks}
                                                            </p>
                                                            <span className="text-secondary" style={{ fontSize: '0.75rem' }}>
                                                                {new Date(item.createdAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            })}

                                        {/* Only show static destination placeholder if NOT delivered yet */}
                                        {selectedShipmentData.currentStatus !== 'DELIVERED' && (
                                            <div className="timeline-item destination">
                                                <div className="timeline-marker"></div>
                                                <h6 className="fw-bold mb-1">{selectedShipmentData.toLocation}</h6>
                                                <p className="text-muted small mb-0 fw-semibold">Destination</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="d-flex flex-column align-items-center justify-content-center h-75 text-muted text-center pt-5">
                                <div className="bg-light rounded-circle p-4 mb-3 d-flex align-items-center justify-content-center" style={{ width: '90px', height: '90px' }}>
                                    <img src={`${import.meta.env.BASE_URL}img/truck-icon.png`} alt="Truck" style={{ width: '90px', height: '90px', objectFit: 'contain', opacity: 0.7 }} />
                                </div>
                                <h5 className="fw-bold">No Shipment Selected</h5>
                                <p className="mb-0 mx-4" style={{ fontSize: '0.9rem' }}>
                                    Please select a shipment from the dropdown on the left to view its complete details here.
                                </p>
                            </div>
                        )}
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default Tracking;
