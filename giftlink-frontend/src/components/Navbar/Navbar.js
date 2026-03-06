import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AuthContext';

export default function Navbar() {
    const { isLoggedIn, setIsLoggedIn, userName, setUserName } = useAppContext();
    const navigate = useNavigate();

    useEffect(() => {
        const authToken = sessionStorage.getItem('auth-token');
        const name = sessionStorage.getItem('name');
        if (authToken) {
            setIsLoggedIn(true);
            setUserName(name);
        }
    }, [setIsLoggedIn, setUserName]);

    const handleLogout = () => {
        sessionStorage.removeItem('auth-token');
        sessionStorage.removeItem('name');
        sessionStorage.removeItem('email');
        setIsLoggedIn(false);
        setUserName('');
        navigate('/app');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <a className="navbar-brand" href="/">GiftLink</a>

            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <a className="nav-link" href="/">Home</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/app">Gifts</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/app/search">Search</a>
                    </li>
                </ul>
                <ul className="navbar-nav ml-auto">
                    {isLoggedIn ? (
                        <>
                            <li className="nav-item">
                                <span className="nav-link">Welcome, {userName}</span>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/app/profile">Profile</a>
                            </li>
                            <li className="nav-item">
                                <button className="nav-link logout-btn" onClick={handleLogout}>Logout</button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className="nav-item">
                                <a className="nav-link login-btn" href="/app/login">Login</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/app/register">Register</a>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
}
