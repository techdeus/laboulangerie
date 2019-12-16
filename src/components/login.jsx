import React, { useState, useContext, useEffect } from 'react';
import { InfoContext } from './store';
import Axios from 'axios';
import Loader from './loader';
import '../stylesheets/base/master.scss';
import '../stylesheets/components/login.scss';
import { useHistory } from 'react-router-dom';

function Login() {
    const [ username, setUsername ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ message, setMessage ] = useState('');
    const [ error, setError ] = useState('');
    const [ loading, setLoading ] = useState(false);
    const { appInfo } = useContext(InfoContext);
    const history = useHistory();
    
    useEffect(() => {
        if (window.localStorage.getItem('data') && appInfo[0]['message'] === 'Logged In') {
            return history.push('/home');
        }
    }, [message])

    const handleChange = (e) => {
        if (e.target.name === 'username') {
            setUsername(e.target.value);
        } else {
            setPassword(e.target.value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
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
            setLoading(false);
            window.localStorage.setItem('data', JSON.stringify(result.data));
            setMessage(result.data.message);
        } catch (err) {
            setError(err.response.data.message);
            setLoading(false);
        }
    };

    return (
        <div className="wrapper">
            <img className="loginSplashPic" src="/img/assets/cafe_logo_big.jpg" alt="Logo"/>
            <form className="loginWrapper">
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
                <span className="loginButtonText">Login</span> {loading ? <Loader isLoading={loading} size="1rem" thickness={1} /> : null}   
                </button>
                {
                    message ? <div className="message">{message}</div> : null
                }
                {
                    error ? <div className="error">{error}</div> : null
                }
            </form>
        </div>
    )
}

export default Login;
