import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Card, Form, Button, Container, Row, Col, Spinner } from 'react-bootstrap';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { loginUser } from '../../api/authApi';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        mode: 'onTouched',
        reValidateMode: 'onChange',
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const handleLogin = async (formData) => {
        try {
            const payload = {
                email: formData.email.trim().toLowerCase(),
                password: formData.password,
            };
            const response = await loginUser(payload);
            const { token } = response.data.data;

            localStorage.setItem('authToken', token);

            toast.success(response.data.message || 'Login successful');
            navigate('/dashboard');
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed. Please check your email and password.';
            toast.error(message);
        }
    };

    return (
        <div className="vh-100 d-flex m-0 bg-white" style={{ overflow: 'hidden' }}>
            {/* Left Side — Aesthetic Image & Brand */}
            <div className="d-none d-lg-flex col-lg-8 position-relative align-items-center justify-content-center bg-light">
                <img
                    src={`${import.meta.env.BASE_URL}img/login-img.png`}
                    alt="Warehouse"
                    className="position-absolute w-100 h-100"
                />
            </div>

            {/* Right Side — Login Form */}
            <div className="col-12 col-lg-4 d-flex align-items-center justify-content-center px-4 position-relative">
                <div style={{ width: '100%', maxWidth: '420px' }}>

                    {/* Mobile Logo */}
                    <div className="text-center d-lg-none mb-4">
                        <img src={`${import.meta.env.BASE_URL}img/logo.jpg`} alt="Taakt Logo" style={{ height: '60px', width: 'auto', objectFit: 'contain' }} />
                    </div>

                    <h2 className="fw-bold text-dark mb-2">Welcome</h2>
                    <p className="text-muted mb-5 pb-2" style={{ fontSize: '0.9rem' }}>Welcome to TAAKt GLOBAL, a comprehensive logistics management platform.</p>

                    <div className="d-flex align-items-center mb-4 border-bottom">
                        <div className="fw-bold pb-2 px-1 me-4 cursor-pointer" style={{ fontSize: '0.95rem', color: 'var(--primary-color)', borderBottom: '2px solid var(--primary-color)' }}>Account Login</div>
                    </div>

                    <Form onSubmit={handleSubmit(handleLogin)}>
                        <Form.Group className="mb-4">
                            <Form.Label className="fw-semibold text-secondary" style={{ fontSize: '0.85rem' }}>
                                Email Address <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="position-relative">
                                <Form.Control
                                    type="email"
                                    placeholder="Enter your email"
                                    className="login-input px-3 py-2 bg-light border-0 rounded-2 shadow-none"
                                    style={{ height: '48px', fontSize: '0.9rem' }}
                                    aria-invalid={errors.email ? 'true' : 'false'}
                                    {...register('email', {
                                        required: 'Email is required',
                                        validate: (value) => {
                                            const email = value.trim();
                                            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                                                return 'Enter a valid email address';
                                            }
                                            return true;
                                        },
                                    })}
                                />
                                {errors.email && <div className="text-danger mt-1" style={{ fontSize: '0.75rem' }}>{errors.email.message}</div>}
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-4 pb-2">
                            <Form.Label className="fw-semibold text-secondary" style={{ fontSize: '0.85rem' }}>
                                Password <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="position-relative">
                                <Form.Control
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter password"
                                    className="login-input px-3 py-2 bg-light border-0 rounded-2 shadow-none"
                                    style={{ height: '48px', fontSize: '0.9rem', paddingRight: '45px' }}
                                    aria-invalid={errors.password ? 'true' : 'false'}
                                    {...register('password', {
                                        required: 'Password is required',
                                        minLength: {
                                            value: 6,
                                            message: 'Password must be at least 6 characters',
                                        },
                                    })}
                                />
                                <button
                                    type="button"
                                    className="position-absolute end-0 top-50 translate-middle-y border-0 bg-transparent text-muted px-3"
                                    onClick={() => setShowPassword((current) => !current)}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? <FiEye size={18} /> : <FiEyeOff size={18} />}
                                </button>
                                {errors.password && <div className="text-danger mt-1" style={{ fontSize: '0.75rem' }}>{errors.password.message}</div>}
                            </div>
                        </Form.Group>

                        <Button
                            variant="primary"
                            type="submit"
                            className="w-100 rounded-2 fw-bold text-white shadow-sm border-0"
                            style={{ height: '50px', background: 'var(--primary-color)', fontSize: '1rem' }}
                            disabled={isSubmitting}
                        >
                            {isSubmitting && <Spinner animation="border" size="sm" className="me-2" />}
                            {isSubmitting ? 'Logging in...' : 'Sign In'}
                        </Button>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default Login;
