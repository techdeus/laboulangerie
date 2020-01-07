import React, { useState, useContext, useEffect } from 'react';
import { InfoContext } from './store';
import Axios from 'axios';
import Loader from './loader';
import generatePassword from '../helpers/password';
import '../stylesheets/base/master.scss';
import '../stylesheets/components/login.scss';
import { useHistory } from 'react-router-dom';

function Login() {
    const [ username, setUsername ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ message, setMessage ] = useState('');
    const [ showForgot, setShowForgot ] = useState(false);
    const [ showConfirmation, setShowConfirmation ] = useState(false);
    const [ loginForever, setLoginForever ] = useState(true);
    const [ email, setEmail ] = useState('');
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
        } else if (e.target.name === 'password') {
            setPassword(e.target.value);
        } else {
            setEmail(e.target.value);
        }
    };

    const stayLoginChange = (e) => {
        setLoginForever((prevValue) => !prevValue);
    };

    const showForgotPassword = () => {
        setShowForgot((prevValue) => !prevValue);
    };

    const handleForgotPassword = async () => {
        try {
            
            let newPassword  = generatePassword('2');
            const sendData = {
                email,
                newPassword, 
            }
            const result = await Axios.put('/forgotPassword', sendData)
            
            if (result.data.message === 'Success') {
                setShowForgot(false);
                setShowConfirmation(true);
            }
        } catch (err) {
            setError(err.response.data.message);
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const result = await Axios.post('/login/user', {
                username: username.toLowerCase(),
                password,
                loginForever,
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
            <div className="curved upper">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 318"><path fill="#ff822B" fillOpacity="1" d="M0,64L48,53.3C96,43,192,21,288,48C384,75,480,149,576,176C672,203,768,181,864,160C960,139,1056,117,1152,112C1248,107,1344,117,1392,122.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>
            </div>
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
                <label className="" htmlFor="isLogin">
                    <input onChange={stayLoginChange} type="checkbox" id="isLogin" className="loginCheckbox" value={loginForever} checked={loginForever} />
                    Stay Logged In
                </label>
                <button className="loginButton" onClick={handleSubmit}>
                    <span className="loginButtonText">Login</span> {loading ? <Loader isLoading={loading} size="1rem" thickness={1} /> : null}   
                </button>
                {
                    message ? <div className="message">{message}</div> : null
                }
                {
                    error ? <div className="error">{error}</div> : null
                }
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 318"><path fill="#e2e1e0" fillOpacity="1" d="M0,64L48,53.3C96,43,192,21,288,48C384,75,480,149,576,176C672,203,768,181,864,160C960,139,1056,117,1152,112C1248,107,1344,117,1392,122.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>
                </form>
                <div className="forgotPassword" role="button" onClick={showForgotPassword}>Did you forget the password?</div>
                {
                    showForgot ? 
                    <div className="forgotWrapper">
                        <input type="text" name="email" placeholder="Enter Email Address" onChange={handleChange} value={email} className="forgot" autoComplete="off" />
                        <button onClick={handleForgotPassword}className="forgotButton">Recover</button> 
                    </div>
                    : null
                }
                {
                    showConfirmation ? 
                <div className="confMessage">check <span class="confSpecial">{email}</span> now.</div>
                    : null
                }
        </div>
    )
}

export default Login;
