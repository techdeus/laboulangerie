import React, { useState, useContext, useRef, useEffect } from 'react';
import { InfoContext } from './store';
import { useHistory } from 'react-router-dom';
import '../stylesheets/components/changePassword.scss';
import Loader from './loader';
import generatePassword from '../helpers/password';
import Axios from 'axios';

function ChangePassword() {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [checkBox, setCheckBox] = useState('1');
    const [complete, setComplete] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [buttonText, setButtonText] = useState('Copy To Clipboard');
    const { appInfo } = useContext(InfoContext);
    const textArea = useRef(null);
    const token = appInfo[0].accessToken;
    const user = appInfo[0].user;
    const history = useHistory();

    useEffect(() => {
        if (complete) {
            const redirect = setTimeout(() => {
                history.push('/home')
                // window.location.reload(true);
            }, 10000);
            return () => {
                clearTimeout(redirect);
            }
        }
    }, [complete])

    const handleChange = (e) => {
        setCheckBox(e.target.value);
    };

    const handleTextChange = (e) => {
        if (e.target.id === 'password-4') {
            setPassword(e.target.value);
        } else {
            setError('');
            setConfirmPassword(e.target.value);
            if (password !== e.target.value) {
                setError('Passwords do not match');
            }
        }
    };

    const changePassword = async (e) => {
        e.preventDefault();
        setError('');
        try {
            setLoading(true);
            let newPassword;
            if (e.target.id === 'auto-create') {
                newPassword = generatePassword(checkBox);
            } else {
                if (password !== confirmPassword) {
                    setLoading(false);
                    setError('Passwords do not match');
                    return;
                }
                newPassword = password; 
            }
            const sendData = {
                newPassword,
                user,
            }
            const result = await Axios.put('/changePassword', sendData,
            {
                headers: { 'Authorization': "bearer " + token }
            });
            
            if (result.data.message === 'Password Changed') {
                setLoading(false); 
                setPassword(newPassword);
                setComplete(true);  
                const currStorage = JSON.parse(window.localStorage.getItem('data'));
                const updateStorage = {...currStorage, user: result.data.user };
                window.localStorage.setItem('data', JSON.stringify(updateStorage));
            }
        } catch (err) {
            setLoading(false);
            setError(err.response.data.message);
        }
    };

    const copyClipBoard = () => {
        textArea.current.select();
        document.execCommand('copy');
        setButtonText('Copied');
        textArea.current.focus();
    };

    if (complete) {
        return (
            <div className="changePasswordWrapper">
                <div className="confSuccessPicture" />
                <h1 className="passwordTitle large">Your password has been successfully changed</h1>
                <textarea className="passwordView" ref={textArea} value={password} readOnly/>
                <button className="generatePassword placement" onClick={copyClipBoard}>{buttonText}</button>
            </div>
        );
    }

    return (
        <div className="changePasswordWrapper">
            <h1 className="passwordTitle large" htmlFor="password-1">Change Password</h1>
            <h2 className="passwordTitle" htmlFor="password-1">Choose Password Difficulty</h2>
            <form id="auto-create" className="formPasswordWrapper" onSubmit={changePassword}>
                    <label htmlFor="password-1" className="radioLabel"> Easy
                    <input id="password-1" className="radioButton" type="radio"  onChange={handleChange} value="1" checked={checkBox === '1'}/>
                    </label>
                    <label htmlFor="password-2" className="radioLabel"> Medium
                    <input id="password-2" className="radioButton"  type="radio" onChange={handleChange} value="2" checked={checkBox === '2'}/>
                    </label>
                    <label htmlFor="password-3" className="radioLabel"> Hard
                    <input id="password-3" className="radioButton" type="radio" onChange={handleChange} value="3" checked={checkBox === '3'}/>
                    </label>
                <button id="auto-create" onClick={changePassword}className="generatePassword">Generate New Password</button>
            </form>
            <h2 className="passwordTitle" htmlFor="password-1">OR</h2>
            <form id="user-create" className="formPasswordWrapper column" onSubmit={changePassword}>
                <input id="password-4" className="passwordText" type="password"  onChange={handleTextChange} value={password} placeholder="Enter Password" />
                <input id="password-5" className="passwordText" type="password" onChange={handleTextChange} value={confirmPassword} placeholder="Confirm Password" />
                
                <button onClick={changePassword}className="generatePassword">Change Password</button>
            </form>
            {
                loading ? <Loader isLoading={loading} size="3rem" thickness={1} /> : null
            }
            <div className="error">{error}</div>
        </div>
    );
}

export default ChangePassword;