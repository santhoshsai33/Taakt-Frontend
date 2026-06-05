import { useEffect, useState, useRef } from 'react';
import { Table, Button, Modal, Spinner, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import PageTitle from '../../components/PageTitle/PageTitle';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import { getShipmentList, deleteShipmentApi } from '../../api/shipmentsApi';
import { FaPlus, FaEye, FaEdit, FaTrash, FaChevronLeft, FaChevronRight, FaSearch, FaTimes } from 'react-icons/fa';

const defaultPagination = {
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    pageSize: 5,
    hasNextPage: false,
    hasPrevPage: false,
};

const formatEnumLabel = (value = '') => {
    return value.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
};

// Resolve trip type enum from free-text search
const resolveTripType = (query = '') => {
    const q = query.trim().toLowerCase().replace(/[\s_]+/g, '');
    if (q === 'shorttrip' || q === 'short') return 'SHORT_TRIP';
    if (q === 'longtrip' || q === 'long') return 'LONG_TRIP';
    return '';
};

const isBookedStatus = (status = '') => {
    return String(status).replace(/\s+/g, '_').toUpperCase() === 'BOOKED';
};

const isInTransitStatus = (status = '') => {
    return String(status).replace(/\s+/g, '_').toUpperCase() === 'IN_TRANSIT';
};

const Shipments = () => {
    const navigate = useNavigate();

    const [shipments, setShipments] = useState([]);
    const [pagination, setPagination] = useState(defaultPagination);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [isLoading, setIsLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [shipmentToDelete, setShipmentToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    // Debounce search: wait 500ms after user stops typing
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        const fetchShipments = async () => {
            setIsLoading(true);
            try {
                const tripType = resolveTripType(debouncedSearch);
                const response = await getShipmentList({
                    page,
                    pageSize,
                    search: tripType ? '' : debouncedSearch,
                    tripType,
                });
                const data = response.data?.data;
                setShipments(data?.items || []);
                setPagination(data?.pagination || defaultPagination);
            } catch (error) {
                const message = error.response?.data?.message || 'Unable to load shipment list.';
                toast.error(message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchShipments();
    }, [page, pageSize, debouncedSearch]);

    const handleAddClick = () => {
        navigate('/shipments/add');
    };

    const handlePageSizeChange = (event) => {
        const newSize = Number(event.target.value);
        setPageSize(newSize);
        setPage(1);  // always reset to page 1 when page size changes
    };

    const handleDeleteClick = (shipment) => {
        if (!isBookedStatus(shipment?.currentStatus)) return;

        setShipmentToDelete(shipment);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!shipmentToDelete) return;

        setIsDeleting(true);
        try {
            const response = await deleteShipmentApi(shipmentToDelete._id);
            toast.success(response.data?.message || 'Shipment deleted successfully');

            setShipments(prev => prev.filter(s => s._id !== shipmentToDelete._id));
            setPagination(prev => ({ ...prev, totalItems: Math.max(0, prev.totalItems - 1) }));

            setShowDeleteModal(false);
            setShipmentToDelete(null);
        } catch (error) {
            const message = error.response?.data?.message || 'Unable to delete shipment.';
            toast.error(message);
        } finally {
            setIsDeleting(false);
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setShipmentToDelete(null);
    };

    const startItem = pagination.totalItems === 0 ? 0 : ((pagination.currentPage - 1) * pageSize) + 1;
    const endItem = Math.min(pagination.currentPage * pageSize, pagination.totalItems);

    const renderPageNumbers = () => {
        const { currentPage, totalPages } = pagination;
        const pages = [];

        let startPage = Math.max(1, currentPage - 1);
        let endPage = Math.min(totalPages, currentPage + 1);

        if (currentPage <= 2) {
            endPage = Math.min(totalPages, 3);
        }
        if (currentPage >= totalPages - 1) {
            startPage = Math.max(1, totalPages - 2);
        }

        if (totalPages === 0) return pages;

        if (startPage > 1) {
            pages.push(
                <button key={1} className={`shp-nav-num ${currentPage === 1 ? 'active' : ''}`} onClick={() => setPage(1)}>1</button>
            );
            if (startPage > 2) {
                pages.push(<span key="ellipsis-start" className="shp-nav-ellipsis">...</span>);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button key={i} className={`shp-nav-num ${currentPage === i ? 'active' : ''}`} onClick={() => setPage(i)}>{i}</button>
            );
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pages.push(<span key="ellipsis-end" className="shp-nav-ellipsis">...</span>);
            }
            pages.push(
                <button key={totalPages} className={`shp-nav-num ${currentPage === totalPages ? 'active' : ''}`} onClick={() => setPage(totalPages)}>{totalPages}</button>
            );
        }

        return pages;
    };

    return (
        <div>
            {/* Page Header */}
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
                <PageTitle title="Shipment Management" />
                <Button
                    variant="primary"
                    onClick={handleAddClick}
                    className="d-flex align-items-center gap-2 shadow-sm custom-btn rounded-3 px-3 py-2 fw-bold"
                    style={{ whiteSpace: 'nowrap' }}
                >
                    <FaPlus /> <span className="d-none d-sm-inline">Add New Shipment</span><span className="d-sm-none">Add</span>
                </Button>
            </div>

            {/* Search Bar Row */}
            <div className="d-flex justify-content-start mb-3">
                <div className="shp-search-wrap shp-search-lg">
                    <span className="shp-search-icon"><FaSearch size={14} /></span>
                    <input
                        type="text"
                        className="shp-search-input"
                        placeholder="Search by ID, location, customer, trip type..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button className="shp-search-clear" onClick={() => setSearchQuery('')}>
                            <FaTimes size={12} />
                        </button>
                    )}
                </div>
            </div>

            <div className="custom-table-container">
                <Table responsive hover className="mb-0 align-middle">
                    <thead className="bg-light">
                        <tr>
                            <th className="py-3 px-4 rounded-start">Shipment ID</th>
                            <th className="py-3">Trip Type</th>
                            <th className="py-3">From</th>
                            <th className="py-3">Current Location</th>
                            <th className="py-3">To</th>
                            <th className="py-3">Status</th>
                            <th className="py-3 px-4 rounded-end text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading && (
                            <tr>
                                <td colSpan={7} className="text-center py-5">
                                    <Spinner animation="border" size="sm" className="me-2" />
                                    Loading shipments...
                                </td>
                            </tr>
                        )}
                        {!isLoading && shipments.length === 0 && (
                            <tr>
                                <td colSpan={7} className="text-center text-muted py-5">No shipments found.</td>
                            </tr>
                        )}
                        {!isLoading && shipments.map((shipment) => (
                            <tr key={shipment._id}>
                                <td className="py-3 px-3 fw-bold text-primary" style={{ whiteSpace: 'nowrap' }}>{shipment.orderId}</td>
                                <td className="py-3 text-secondary fw-medium" style={{ whiteSpace: 'nowrap' }}>{formatEnumLabel(shipment.tripType)}</td>
                                <td className="py-3 fw-bold text-dark" style={{ whiteSpace: 'nowrap' }}>{shipment.fromLocation}</td>
                                <td className="py-3 text-primary fw-semibold" style={{ whiteSpace: 'nowrap' }}>{shipment.currentLocation}</td>
                                <td className="py-3 fw-bold text-dark" style={{ whiteSpace: 'nowrap' }}>{shipment.toLocation}</td>
                                <td className="py-3" style={{ whiteSpace: 'nowrap' }}><StatusBadge status={shipment.currentStatus} /></td>
                                <td className="py-3 px-3">
                                    <div className="d-flex justify-content-start gap-2">
                                        <button
                                            className="tbl-action-btn tbl-action-view"
                                            title="View"
                                            onClick={() => navigate(`/shipments/view/${shipment._id}`)}
                                        ><FaEye /></button>
                                        {!isInTransitStatus(shipment.currentStatus) && shipment.currentStatus !== 'DELIVERED' && (
                                            <button
                                                className="tbl-action-btn tbl-action-edit"
                                                title="Edit"
                                                onClick={() => navigate(`/shipments/edit/${shipment._id}`)}
                                            ><FaEdit /></button>
                                        )}
                                        {isBookedStatus(shipment.currentStatus) && (
                                            <button
                                                className="tbl-action-btn tbl-action-delete"
                                                title="Delete"
                                                onClick={() => handleDeleteClick(shipment)}
                                            ><FaTrash /></button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                {/* Pagination Bar */}
                <div className="shp-pagination">
                    <div className="d-flex align-items-center gap-3">
                        <div className="shp-pagination-info">
                            Showing <strong>{startItem}–{endItem}</strong> of <strong>{pagination.totalItems}</strong>
                        </div>

                        <div className="shp-rows-select ps-3 border-start">
                            <span className="shp-rows-label">Rows</span>
                            <div className="shp-rows-dropdown-wrap">
                                <select
                                    className="shp-rows-dropdown"
                                    value={pageSize}
                                    onChange={handlePageSizeChange}
                                    disabled={isLoading}
                                >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    {/* <option value={15}>15</option> */}
                                    <option value={25}>25</option>
                                    <option value={50}>50</option>
                                    {/* <option value={100}>100</option> */}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="shp-pagination-controls">
                        <div className="shp-page-btns">
                            <button
                                className="shp-nav-btn"
                                disabled={!pagination.hasPrevPage || isLoading}
                                onClick={() => setPage(p => Math.max(p - 1, 1))}
                            >
                                <FaChevronLeft size={11} /> <span className="d-none d-sm-inline">Prev</span>
                            </button>

                            {renderPageNumbers()}

                            <button
                                className="shp-nav-btn"
                                disabled={!pagination.hasNextPage || isLoading}
                                onClick={() => setPage(p => p + 1)}
                            >
                                <span className="d-none d-sm-inline">Next</span> <FaChevronRight size={11} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={showDeleteModal} onHide={cancelDelete} centered>
                <Modal.Header closeButton className="border-0 px-4 pt-4 pb-2">
                    <Modal.Title className="fw-bold text-danger">Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body className="px-4 pt-3 pb-3 text-center">
                    <FaTrash className="text-danger mb-3" style={{ fontSize: '3rem', opacity: 0.2 }} />
                    <h5 className="mb-2">Are you sure?</h5>
                    <p className="text-muted mb-0">
                        Do you really want to delete shipment {shipmentToDelete?.orderId || ''}? This process cannot be undone.
                    </p>
                </Modal.Body>
                <Modal.Footer className="border-0 px-4 pt-2 pb-4 d-flex justify-content-center gap-3">
                    <Button variant="danger" className="px-4 py-2 fw-bold" onClick={confirmDelete} disabled={isDeleting}>
                        {isDeleting ? <Spinner animation="border" size="sm" className="me-2" /> : null}
                        {isDeleting ? 'Deleting...' : 'Yes'}
                    </Button>
                    <Button variant="light" className="px-4 py-2 fw-bold" onClick={cancelDelete} disabled={isDeleting}>
                        No
                    </Button>

                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Shipments;
