import React, { useState, useContext } from 'react';
import { InfoContext } from './store';
import Axios from 'axios';
import '../stylesheets/base/master.scss';
import '../stylesheets/components/login.scss';
import { Redirect } from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';

function Login() {
    const [ username, setUsername ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ message, setMessage ] = useState('');
    const [ error, setError ] = useState('');
    const { appInfo } = useContext(InfoContext);
    const { cart } = useContext(InfoContext);
    const [ loading, setLoading ] = useState(false);
    
    if (window.localStorage.getItem('data')) {
        return <Redirect to='/home' />
    }

    const handleChange = (e) => {
        if (e.target.name === 'username') {
            setUsername(e.target.value);
        } else {
            setPassword(e.target.value);
        }
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const result = await Axios.post('/login/user', {
                username: username.toLowerCase(),
                password,
            })
            if (error) {
                setError('');
            }
            appInfo[1](result.data);
            window.localStorage.setItem('data', JSON.stringify(result.data));
            setLoading(false);
            setMessage(result.data.message);
        } catch (err) {
            if (loading) setLoading(false);
            setError(err.response.data.message);
        }
    };

    

    return (
        <div className="wrapper">
            <img className="loginSplashPic" src="/img/assets/cafe_logo_big.jpg" alt="Logo"/>
            <div className="loginWrapper">
                <input 
                    type="text" 
                    name="username" 
                    value={username} 
                    placeholder="Enter Username" 
                    onChange={handleChange}
                    autoComplete="off"
                    className="inputBoxes"
                >
                </input>
                <input 
                    type="password" 
                    name="password" 
                    value={password} 
                    placeholder="Enter Password" 
                    onChange={handleChange}
                    autoComplete="off"
                    className="inputBoxes"
                >
                </input>
                <button className="loginButton" onClick=            {handleSubmit}
                >
                 {loading ? <CircularProgress size="small" /> : null}   Login
                </button>
                {
                    message ? <div className="message">{message}</div> : null
                }
                {
                    error ? <div className="error">{error}</div> : null
                }
            </div>
        </div>
    )
}

export default Login;
