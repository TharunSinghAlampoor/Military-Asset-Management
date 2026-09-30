import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleLogin = async (e) => {

        e.preventDefault();

        try {

            const response = await api.post(
                '/api/auth/login',
                {
                    email: email,
                    password: password
                }
            );

            // Store JWT token
            localStorage.setItem(
                'token',
                response.data.token
            );

            // Store logged-in user's role
            localStorage.setItem(
                'role',
                response.data.role
            );

            // Store logged-in user's ID
            localStorage.setItem(
                'userId',
                response.data.id
            );

            // Store logged-in user's base ID
            if (response.data.baseId !== null) {
                localStorage.setItem(
                    'baseId',
                    response.data.baseId
                );
            } else {
                localStorage.removeItem('baseId');
            }

            // Store email
            localStorage.setItem(
                'email',
                response.data.email
            );

            console.log('Login successful');
            console.log('Role:', response.data.role);
            console.log('User ID:', response.data.id);
            console.log('Base ID:', response.data.baseId);

            navigate('/');

        } catch (error) {

            console.error(
                'Login error:',
                error
            );

            alert(
                error.response?.data ||
                'Invalid email or password'
            );
        }
    };

    return (

        <div
            style={{
                minHeight: '100vh',
                backgroundColor: '#f4f6f8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '30px',
                boxSizing: 'border-box'
            }}
        >

            <div
                style={{
                    width: '100%',
                    maxWidth: '430px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '38px',
                    boxSizing: 'border-box',
                    boxShadow: '0 8px 25px rgba(15, 23, 42, 0.08)'
                }}
            >

                <h1
                    style={{
                        margin: '0 0 28px',
                        textAlign: 'center',
                        fontSize: '24px',
                        fontWeight: '600',
                        color: '#172554'
                    }}
                >
                    Login
                </h1>


                <form onSubmit={handleLogin}>

                    <div
                        style={{
                            marginBottom: '20px'
                        }}
                    >

                        <label
                            style={{
                                display: 'block',
                                marginBottom: '7px',
                                fontSize: '13px',
                                fontWeight: '500',
                                color: '#374151'
                            }}
                        >
                            Email
                        </label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            required
                            style={{
                                width: '100%',
                                height: '44px',
                                padding: '0 13px',
                                border: '1px solid #cbd5e1',
                                borderRadius: '6px',
                                outline: 'none',
                                fontSize: '14px',
                                boxSizing: 'border-box'
                            }}
                        />

                    </div>


                    <div
                        style={{
                            marginBottom: '25px'
                        }}
                    >

                        <label
                            style={{
                                display: 'block',
                                marginBottom: '7px',
                                fontSize: '13px',
                                fontWeight: '500',
                                color: '#374151'
                            }}
                        >
                            Password
                        </label>

                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            required
                            style={{
                                width: '100%',
                                height: '44px',
                                padding: '0 13px',
                                border: '1px solid #cbd5e1',
                                borderRadius: '6px',
                                outline: 'none',
                                fontSize: '14px',
                                boxSizing: 'border-box'
                            }}
                        />

                    </div>


                    <button
                        type="submit"
                        style={{
                            width: '100%',
                            height: '45px',
                            border: 'none',
                            borderRadius: '6px',
                            backgroundColor: '#172554',
                            color: '#ffffff',
                            fontSize: '14px',
                            fontWeight: '500',
                            cursor: 'pointer'
                        }}
                    >
                        Login
                    </button>

                </form>

            </div>

        </div>
    );
}

export default Login;