import { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Form, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { FiSave, FiLock, FiUser, FiMail, FiEye, FiEyeOff } from 'react-icons/fi';
import { FaShieldAlt } from 'react-icons/fa';
import PageTitle from '../../components/PageTitle/PageTitle';
import { getProfile, updateProfile } from '../../api/authApi';

const Profile = () => {
    const [profileForm, setProfileForm] = useState({
        name: 'Admin User',
        email: 'admin@taakt.com',
    });
    const [passwordForm, setPasswordForm] = useState({ password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [isSavingPassword, setIsSavingPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            setIsLoading(true);
            try {
                const response = await getProfile();
                const userData = response.data?.data || response.data;
                if (userData) {
                    setProfileForm({
                        name: userData.name || '',
                        email: userData.email || '',
                    });
                }
            } catch (error) {
                toast.error('Failed to load profile details.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleProfileChange = (e) => {
        setProfileForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handlePasswordChange = (e) => {
        setPasswordForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        if (!profileForm.name.trim() || !profileForm.email.trim()) {
            toast.error('Name and Email are required.');
            return;
        }
        setIsSavingProfile(true);
        try {
            const payload = { ...profileForm };
            if (passwordForm.password.trim()) {
                payload.password = passwordForm.password.trim();
            }
            await updateProfile(payload);
            toast.success('Profile updated successfully!');
            setPasswordForm({ password: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile.');
        } finally {
            setIsSavingProfile(false);
        }
    };

    const getInitials = (name) =>
        name.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

    return (
        <div>
            <div className="mb-4">
                <PageTitle title="My Profile" subtitle="Manage your account information and security settings" />
            </div>

            {isLoading ? (
                <div className="d-flex align-items-center justify-content-center py-5 mt-5 text-muted">
                    <Spinner animation="border" size="md" className="me-3" />
                    <h5>Loading profile...</h5>
                </div>
            ) : (
                <Row className="gy-4">
                    {/* Left — Avatar + name card */}
                    <Col lg={4}>
                        <Card className="border-0 shadow-sm profile-avatar-card text-center">
                            <Card.Body className="p-5">
                                <div className="profile-avatar-ring mx-auto mb-4">
                                    <div className="profile-avatar-inner">
                                        {getInitials(profileForm.name)}
                                    </div>
                                </div>
                                <h5 className="fw-bolder text-dark mb-1">{profileForm.name}</h5>
                                <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>{profileForm.email}</p>
                                <div className="mt-3">
                                    <span className="badge rounded-pill px-3 py-2 fw-semibold" style={{ background: 'rgba(56,184,72,0.12)', color: '#38b848', fontSize: '0.78rem' }}>
                                        <FaShieldAlt className="me-1" /> Logistics Head
                                    </span>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Right — Forms */}
                    <Col lg={8}>
                        {/* Profile Info */}
                        <Card className="border-0 shadow-sm profile-section-card mb-4">
                            <Card.Body className="p-4 p-md-5">
                                <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom">
                                    <div className="profile-section-icon">
                                        <FiUser size={18} />
                                    </div>
                                    <div>
                                        <h6 className="fw-bolder text-dark mb-0">Personal Information</h6>
                                        <p className="text-muted mb-0" style={{ fontSize: '0.8rem' }}>Update your name and email address</p>
                                    </div>
                                </div>

                                <Form onSubmit={handleProfileSubmit}>
                                    <Row className="gy-3">
                                        <Col md={6}>
                                            <Form.Label className="fw-semibold text-secondary" style={{ fontSize: '0.85rem' }}>
                                                Full Name <span className="required-mark">*</span>
                                            </Form.Label>
                                            <div className="position-relative">
                                                <span className="profile-input-icon"><FiUser size={15} /></span>
                                                <Form.Control
                                                    type="text"
                                                    name="name"
                                                    value={profileForm.name}
                                                    onChange={handleProfileChange}
                                                    placeholder="Enter full name"
                                                    className="custom-input profile-input-padded"
                                                />
                                            </div>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Label className="fw-semibold text-secondary" style={{ fontSize: '0.85rem' }}>
                                                Email Address <span className="required-mark">*</span>
                                            </Form.Label>
                                            <div className="position-relative">
                                                <span className="profile-input-icon"><FiMail size={15} /></span>
                                                <Form.Control
                                                    type="email"
                                                    name="email"
                                                    value={profileForm.email}
                                                    onChange={handleProfileChange}
                                                    placeholder="Enter email address"
                                                    className="custom-input profile-input-padded"
                                                />
                                            </div>
                                        </Col>

                                        {/* Divider */}
                                        <Col md={12}>
                                            <hr className="text-muted my-2" />
                                            <p className="fw-semibold text-secondary mb-0" style={{ fontSize: '0.85rem' }}>
                                                <FiLock size={14} className="me-2" />Password
                                            </p>
                                        </Col>

                                        <Col md={12}>
                                            <Form.Label className="fw-semibold text-secondary" style={{ fontSize: '0.85rem' }}>
                                                Password
                                            </Form.Label>
                                            <div className="position-relative">
                                                <span className="profile-input-icon"><FiLock size={15} /></span>
                                                <Form.Control
                                                    type={showPassword ? 'text' : 'password'}
                                                    name="password"
                                                    value={passwordForm.password}
                                                    onChange={handlePasswordChange}
                                                    placeholder="Enter new password"
                                                    className="custom-input profile-input-padded"
                                                    style={{ paddingRight: '42px' }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(p => !p)}
                                                    className="profile-eye-btn"
                                                    tabIndex={-1}
                                                >
                                                    {showPassword ? <FiEye size={15} /> : <FiEyeOff size={15} />}
                                                </button>
                                            </div>
                                            <small className="text-muted mt-1 d-block" style={{ fontSize: '0.76rem' }}>
                                                Enter a new password to change your current one. Leave blank to keep it unchanged.
                                            </small>
                                        </Col>
                                    </Row>

                                    <div className="mt-4 d-flex justify-content-end">
                                        <Button
                                            type="submit"
                                            className="d-flex align-items-center gap-2 px-4 fw-bold shadow-sm custom-btn rounded-3"
                                            disabled={isSavingProfile}
                                        >
                                            {isSavingProfile ? <Spinner animation="border" size="sm" /> : <FiSave size={15} />}
                                            {isSavingProfile ? 'Saving...' : 'Save Changes'}
                                        </Button>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}
        </div>
    );
};

export default Profile;
