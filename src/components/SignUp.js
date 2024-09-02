import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PasswordInput from './passwords/PasswordInputs';
import { useAuth } from '../context/AuthContext';

const SignUpForm = () => {
    const initialState = {
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        password: '',
        passwordConfirmation: ''
       // role: '', // Added role field if needed
    };

    const [formData, setFormData] = useState(initialState);
    const [token, setToken] = useState('');
    const [step, setStep] = useState(1); // Step 1: Sign up, Step 2: Verify
    const [error, setError] = useState(''); // State to manage error messages
    const [passwordMatchError, setPasswordMatchError] = useState(''); // State for password match error
    const navigate = useNavigate();
    const { signup, verifyToken } = useAuth();

    const handleFieldChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSignup = (e) => {
        e.preventDefault();
        const { firstname, lastname, email, phone ,password, passwordConfirmation} = formData;

        // Check if passwords match
        if (password !== passwordConfirmation) {
            setPasswordMatchError('Passwords do not match.');
            return;
        }

        const name = `${firstname} ${lastname}`;
        signup(name, email, phone, password) // Include role in the signup call
            .then(() => {
                setStep(2); // Move to verification step on successful signup
                setError(''); // Clear any previous errors
                setPasswordMatchError(''); // Clear password match error
            })
            .catch((error) => {
                console.error(error);
                setError('Failed to sign up. Please try again.'); // Show error message
            });
    };

    const handleVerify = (e) => {
        e.preventDefault();
        const { email } = formData;
        verifyToken(email, token)
            .then((response) => {
                if (response.message === "Token verified successfully.") {
                    navigate('/login'); // Navigate to login on successful verification
                } else {
                    setError('Invalid verification token. Please try again.'); // Show error message
                }
            })
            .catch((error) => {
                console.error(error);
                setError('Verification failed. Please try again.'); // Show error message
            });
    };

    return (
        <div className="row">
            <section className="sign in column center">
                <Link to="/" className="home-icon"><i className="fas fa-home" /></Link>
                <h2>
                    Apartment App
                </h2>
                <form onSubmit={step === 1 ? handleSignup : handleVerify}>
                    <p className="hint">Fill the form below to create an account</p>
                    <hr className="dash" />
                    {error && <p className="error-message">{error}</p>}
                    {passwordMatchError && <p className="error-message">{passwordMatchError}</p>}
                    {step === 1 ? (
                        <>
                            <div className="input-wrapper">
                                <input
                                    type="text"
                                    name="firstname"
                                    placeholder="First name"
                                    minLength="3"
                                    required
                                    onChange={handleFieldChange}
                                />
                            </div>
                            <div className="input-wrapper">
                                <input
                                    type="text"
                                    name="lastname"
                                    placeholder="Last name"
                                    minLength="3"
                                    required
                                    onChange={handleFieldChange}
                                />
                            </div>
                            <div className="input-wrapper">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email address"
                                    pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                                    required
                                    onChange={handleFieldChange}
                                />
                            </div>
                            <div className="input-wrapper">
                                <input
                                    type="text"
                                    name="phone"
                                    placeholder="Phone Number"
                                    onChange={handleFieldChange}
                                />
                            </div>
                            <PasswordInput
                                name="password"
                                placeholder="Password"
                                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                                title="Please include at least 1 uppercase character, 1 lowercase character, and 1 number."
                                minLength="6"
                                handleOnChange={handleFieldChange}
                            />
                            <PasswordInput
                                name="passwordConfirmation"
                                placeholder="Confirm password"
                                handleOnChange={handleFieldChange}
                            />
                            <div className="container">
                                <div>
                                    <button className="reg" type="submit">Sign up</button>
                                    <div className="row center">
                                        <div className="row signin--or">
                                            <span>or</span>
                                        </div>
                                    </div>
                                    <button type="button" onClick={() => navigate("/login")} className="log">Login</button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="input-wrapper">
                                <input
                                    type="text"
                                    placeholder="Verification Token"
                                    value={token}
                                    onChange={(e) => setToken(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="container">
                                <div>
                                    <button className="reg" type="submit">Verify</button>
                                </div>
                            </div>
                        </>
                    )}
                </form>
            </section>
        </div>
    );
};

export default SignUpForm;
