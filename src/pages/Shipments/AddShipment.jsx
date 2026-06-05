import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Form, Button, Row, Col, Card, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useApp } from '../../context/AppContext';
import PageTitle from '../../components/PageTitle/PageTitle';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import { createShipment, editShipment, getShipmentDetails } from '../../api/shipmentsApi';

const tripTypeOptions = [
    { value: 'SHORT_TRIP', label: 'Short Trip' },
    { value: 'LONG_TRIP', label: 'Long Trip' },
];

const createStatusOptions = [
    { value: 'BOOKED', label: 'Booked' },
    { value: 'READY_TO_DISPATCH', label: 'Ready To Dispatch' },
];

const editStatusOptions = [
    // { value: 'IN_TRANSIT', label: 'In Transit' },
    { value: 'READY_TO_DISPATCH', label: 'Ready To Dispatch' },
    // { value: 'DELIVERED', label: 'Delivered' },
    { value: 'DELAYED', label: 'Delayed' },
];

const idPattern = /^[A-Za-z0-9-]+$/;
const textPattern = /^[A-Za-z0-9 ]+$/;
const phonePattern = /^[6-9][0-9]{9}$/;
// Indian vehicle number: e.g.  MH12AB1234  or  MH 12 AB 1234
const vehiclePattern = /^[A-Z]{2}[\s-]?[0-9]{1,2}[\s-]?[A-Z]{1,3}[\s-]?[0-9]{4}$/;

const toTitleCase = (value) => {
    return value
        .toLowerCase()
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const getMinDispatchDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const minDispatchDate = getMinDispatchDate();

const isValidDispatchDate = (dateValue) => {
    if (!dateValue) {
        return false;
    }

    const selected = new Date(`${dateValue}T00:00:00`);
    const minimum = new Date(`${minDispatchDate}T00:00:00`);
    return selected >= minimum;
};

const AddShipment = () => {
    const { addShipment } = useApp();
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;
    const statusOptions = isEditMode ? editStatusOptions : createStatusOptions;

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        mode: 'onTouched',
        reValidateMode: 'onChange',
        defaultValues: {
            orderId: '',
            tripType: '',
            fromLocation: '',
            toLocation: '',
            customerName: '',
            customerPhone: '',
            driverName: '',
            driverPhone: '',
            vehicleNumber: '',
            dispatchDate: '',
            status: '',
            remarks: '',
        },
    });

    const selectedStatus = watch('status');
    const editStatusDisplayOptions =
        isEditMode && selectedStatus && !editStatusOptions.some((option) => option.value === selectedStatus)
            ? [{ value: selectedStatus, label: toTitleCase(selectedStatus), disabled: true }, ...editStatusOptions]
            : statusOptions;

    useEffect(() => {
        if (isEditMode) {
            const fetchDetails = async () => {
                try {
                    const res = await getShipmentDetails(id);
                    const data = res.data?.data?.shipment;
                    if (data) {
                        reset({
                            orderId: data.orderId || '',
                            tripType: data.tripType || '',
                            fromLocation: data.fromLocation || '',
                            toLocation: data.toLocation || '',
                            customerName: data.customerName || '',
                            customerPhone: data.customerPhone || '',
                            driverName: data.driverName || '',
                            driverPhone: data.driverPhone || '',
                            vehicleNumber: data.vehicleNumber || '',
                            dispatchDate: data.expectedDeliveryDate ? data.expectedDeliveryDate.split('T')[0] : '',
                            status: data.currentStatus || '',
                            remarks: data.remarks || '',
                        });
                    }
                } catch (err) {
                    toast.error('Failed to fetch shipment details');
                }
            };
            fetchDetails();
        }
    }, [id, reset, isEditMode]);

    const requiredLabel = (label) => (
        <>
            {label} <span className="required-mark">*</span>
        </>
    );

    const getFieldClass = (fieldName) => `custom-input ${errors[fieldName] ? 'has-error' : ''}`;

    const onInvalid = () => {
        toast.error('Please fill all required fields.');
    };

    const handleCreateShipment = async (formData) => {
        const payload = {
            orderId: formData.orderId.trim().toUpperCase(),
            tripType: formData.tripType,
            customerName: formData.customerName.trim(),
            customerPhone: formData.customerPhone.trim(),
            fromLocation: formData.fromLocation.trim(),
            toLocation: formData.toLocation.trim(),
            driverName: formData.driverName.trim(),
            driverPhone: formData.driverPhone.trim(),
            vehicleNumber: (formData.vehicleNumber || '').trim(),
            expectedDeliveryDate: new Date(formData.dispatchDate).toISOString(),
            status: formData.status,
            remarks: formData.remarks.trim(),
        };

        try {
            if (isEditMode) {
                const response = await editShipment(id, payload);
                toast.success(response.data?.message || 'Shipment updated successfully');
            } else {
                const response = await createShipment(payload);
                addShipment({
                    id: payload.orderId,
                    tripType: toTitleCase(payload.tripType),
                    from: payload.fromLocation,
                    to: payload.toLocation,
                    driverName: payload.driverName,
                    driverPhone: payload.driverPhone,
                    vehicleNumber: payload.vehicleNumber,
                    customerName: payload.customerName,
                    customerPhone: payload.customerPhone,
                    dispatchDate: formData.dispatchDate,
                    status: toTitleCase(payload.status),
                    remarks: payload.remarks,
                    currentLocation: payload.fromLocation,
                });
                toast.success(response.data?.message || 'Shipment created successfully');
            }
            navigate('/shipments');
        } catch (error) {
            const message = error.response?.data?.message || `Unable to ${isEditMode ? 'update' : 'create'} shipment. Please try again.`;
            toast.error(message);
        }
    };

    return (
        <div>
            <Form onSubmit={handleSubmit(handleCreateShipment, onInvalid)} noValidate>
                <div className="d-flex align-items-center mb-4">
                    <Button variant="light" className="rounded-circle shadow-sm d-flex align-items-center justify-content-center border-0 p-0 me-3" style={{ width: '40px', height: '40px' }} onClick={() => navigate('/shipments')}>
                        <FiArrowLeft className="fs-5" />
                    </Button>
                    <h2 className="fw-bold mb-0 text-dark">{isEditMode ? "Edit Shipment" : "Add New Shipment"}</h2>
                </div>

                <Card className="border-0 shadow-sm custom-card">
                    <Card.Body className="p-5">
                        <Row className="gy-4">
                            <Col md={6}>
                                <Form.Label className="fw-semibold text-secondary">{requiredLabel('Shipment ID')}</Form.Label>
                                <Form.Control
                                    type="text"
                                    className={getFieldClass('orderId')}
                                    placeholder="Enter Shipment ID"
                                    aria-invalid={errors.orderId ? 'true' : 'false'}
                                    disabled={isEditMode}
                                    {...register('orderId', {
                                        required: 'Shipment ID is required',
                                        pattern: {
                                            value: idPattern,
                                            message: 'Shipment ID can contain only letters, numbers, and hyphen',
                                        },
                                    })}
                                />
                                {errors.orderId && <div className="form-error-text">{errors.orderId.message}</div>}
                            </Col>
                            <Col md={6}>
                                <Form.Label className="fw-semibold text-secondary">{requiredLabel('Trip Type')}</Form.Label>
                                <Form.Select
                                    className={getFieldClass('tripType')}
                                    aria-invalid={errors.tripType ? 'true' : 'false'}
                                    {...register('tripType', {
                                        required: 'Trip Type is required',
                                    })}
                                >
                                    <option value="">Select trip type</option>
                                    {tripTypeOptions.map((option) => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}
                                </Form.Select>
                                {errors.tripType && <div className="form-error-text">{errors.tripType.message}</div>}
                            </Col>
                            <Col md={6}>
                                <Form.Label className="fw-semibold text-secondary">{requiredLabel('From Location')}</Form.Label>
                                <Form.Control
                                    type="text"
                                    className={getFieldClass('fromLocation')}
                                    placeholder="Enter from location"
                                    aria-invalid={errors.fromLocation ? 'true' : 'false'}
                                    {...register('fromLocation', {
                                        required: 'From Location is required',
                                        pattern: {
                                            value: textPattern,
                                            message: 'From Location can contain only letters, numbers, and spaces',
                                        },
                                    })}
                                />
                                {errors.fromLocation && <div className="form-error-text">{errors.fromLocation.message}</div>}
                            </Col>
                            <Col md={6}>
                                <Form.Label className="fw-semibold text-secondary">{requiredLabel('To Location')}</Form.Label>
                                <Form.Control
                                    type="text"
                                    className={getFieldClass('toLocation')}
                                    placeholder="Enter to location"
                                    aria-invalid={errors.toLocation ? 'true' : 'false'}
                                    {...register('toLocation', {
                                        required: 'To Location is required',
                                        pattern: {
                                            value: textPattern,
                                            message: 'To Location can contain only letters, numbers, and spaces',
                                        },
                                    })}
                                />
                                {errors.toLocation && <div className="form-error-text">{errors.toLocation.message}</div>}
                            </Col>

                            <div className="w-100 my-2"><hr className="text-muted" opacity="0.1" /></div>
                            <h6 className="fw-bold mb-3 mt-0 text-dark">Customer Details</h6>

                            <Col md={6}>
                                <Form.Label className="fw-semibold text-secondary">{requiredLabel('Customer Name')}</Form.Label>
                                <Form.Control
                                    type="text"
                                    className={getFieldClass('customerName')}
                                    placeholder="Enter customer name"
                                    aria-invalid={errors.customerName ? 'true' : 'false'}
                                    {...register('customerName', {
                                        required: 'Customer Name is required',
                                        pattern: {
                                            value: textPattern,
                                            message: 'Customer Name can contain only letters, numbers, and spaces',
                                        },
                                    })}
                                />
                                {errors.customerName && <div className="form-error-text">{errors.customerName.message}</div>}
                            </Col>
                            <Col md={6}>
                                <Form.Label className="fw-semibold text-secondary">{requiredLabel('Customer Phone Number')}</Form.Label>
                                <Form.Control
                                    type="tel"
                                    maxLength={10}
                                    className={getFieldClass('customerPhone')}
                                    placeholder="Enter custome phone number"
                                    aria-invalid={errors.customerPhone ? 'true' : 'false'}
                                    {...register('customerPhone', {
                                        required: 'Customer Phone Number is required',
                                        pattern: {
                                            value: phonePattern,
                                            message: 'Enter a valid 10 digit phone number',
                                        },
                                    })}
                                />
                                {errors.customerPhone && <div className="form-error-text">{errors.customerPhone.message}</div>}
                            </Col>

                            <div className="w-100 my-2"><hr className="text-muted" opacity="0.1" /></div>
                            <h6 className="fw-bold mb-3 mt-0 text-dark">Driver Details</h6>

                            <Col md={6}>
                                <Form.Label className="fw-semibold text-secondary">{requiredLabel('Driver Name')}</Form.Label>
                                <Form.Control
                                    type="text"
                                    className={getFieldClass('driverName')}
                                    placeholder="Enter driver name"
                                    aria-invalid={errors.driverName ? 'true' : 'false'}
                                    {...register('driverName', {
                                        required: 'Driver Name is required',
                                        pattern: {
                                            value: textPattern,
                                            message: 'Driver Name can contain only letters, numbers, and spaces',
                                        },
                                    })}
                                />
                                {errors.driverName && <div className="form-error-text">{errors.driverName.message}</div>}
                            </Col>
                            <Col md={6}>
                                <Form.Label className="fw-semibold text-secondary">{requiredLabel('Driver Phone Number')}</Form.Label>
                                <Form.Control
                                    type="tel"
                                    maxLength={10}
                                    className={getFieldClass('driverPhone')}
                                    placeholder="Enter driver phone number"
                                    aria-invalid={errors.driverPhone ? 'true' : 'false'}
                                    {...register('driverPhone', {
                                        required: 'Driver Phone Number is required',
                                        pattern: {
                                            value: phonePattern,
                                            message: 'Enter a valid 10 digit phone number',
                                        },
                                    })}
                                />
                                {errors.driverPhone && <div className="form-error-text">{errors.driverPhone.message}</div>}
                            </Col>
                            <Col md={12}>
                                <Form.Label className="fw-semibold text-secondary">Vehicle Number</Form.Label>
                                <div className="position-relative">
                                    <Form.Control
                                        type="text"
                                        maxLength={13}
                                        className={getFieldClass('vehicleNumber')}
                                        placeholder="e.g. MH12AB1234"
                                        aria-invalid={errors.vehicleNumber ? 'true' : 'false'}
                                        {...register('vehicleNumber', {
                                            pattern: {
                                                value: vehiclePattern,
                                                message: 'Invalid format. Use: MH12AB1234 or MH 12 AB 1234',
                                            },
                                            setValueAs: (v) => v.toUpperCase(),
                                        })}
                                        onChange={(e) => {
                                            e.target.value = e.target.value.toUpperCase();
                                        }}
                                    />
                                    <span
                                        className="position-absolute text-muted"
                                        style={{ right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.75rem', pointerEvents: 'none' }}
                                    >
                                        {/* {(watch('vehicleNumber') || '').length}/13 */}
                                    </span>
                                </div>

                                {errors.vehicleNumber && <div className="form-error-text mt-1">{errors.vehicleNumber.message}</div>}
                            </Col>

                            <div className="w-100 my-2"><hr className="text-muted" opacity="0.1" /></div>
                            <h6 className="fw-bold mb-3 mt-0 text-dark">Dispatch Info</h6>

                            <Col md={6}>
                                <Form.Label className="fw-semibold text-secondary">{requiredLabel('Expected Delivery Date')}</Form.Label>
                                <Form.Control
                                    type="date"
                                    className={getFieldClass('dispatchDate')}
                                    min={minDispatchDate}
                                    aria-invalid={errors.dispatchDate ? 'true' : 'false'}
                                    {...register('dispatchDate', {
                                        required: 'Expected Delivery Date is required',
                                        validate: (value) => isValidDispatchDate(value) || 'Dispatch Date cannot be in the past',
                                    })}
                                />
                                {errors.dispatchDate && <div className="form-error-text">{errors.dispatchDate.message}</div>}
                            </Col>
                            <Col md={6}>
                                <Form.Label className="fw-semibold text-secondary">{requiredLabel('Status')}</Form.Label>
                                <Form.Select
                                    className={getFieldClass('status')}
                                    aria-invalid={errors.status ? 'true' : 'false'}
                                    {...register('status', {
                                        required: 'Status is required',
                                    })}
                                >
                                    <option value="">Select status</option>
                                    {editStatusDisplayOptions.map((option) => (
                                        <option key={option.value} value={option.value} disabled={option.disabled}>
                                            {option.label}
                                        </option>
                                    ))}
                                </Form.Select>
                                {errors.status && <div className="form-error-text">{errors.status.message}</div>}
                            </Col>
                            <Col md={12}>
                                <Form.Label className="fw-semibold text-secondary">Remarks</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    className={getFieldClass('remarks')}
                                    placeholder="Enter remarks"
                                    aria-invalid={errors.remarks ? 'true' : 'false'}
                                    {...register('remarks')}
                                />
                                {errors.remarks && <div className="form-error-text">{errors.remarks.message}</div>}
                            </Col>
                        </Row>

                        <div className="d-flex justify-content-end mt-5 pt-3 border-top gap-2">
                            <Button variant="primary" type="submit" className="px-4 fw-bold shadow-sm rounded-3 d-flex align-items-center gap-2 custom-btn" disabled={isSubmitting}>
                                {isSubmitting ? <Spinner animation="border" size="sm" /> : <FiSave />}
                                {isSubmitting ? (isEditMode ? 'Updating...' : 'Saving...') : (isEditMode ? 'Update Shipment' : 'Save Shipment')}
                            </Button>
                            <Button variant="light" className="px-4 fw-bold text-secondary border shadow-sm rounded-3 btn-light-two" onClick={() => navigate('/shipments')} disabled={isSubmitting}>Cancel</Button>
                        </div>
                    </Card.Body>
                </Card>
            </Form>
        </div>
    );
};

export default AddShipment;
