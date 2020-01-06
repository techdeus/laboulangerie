import React, { useState, useContext, useRef } from 'react';
import { InfoContext } from './store';
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
    const [buttonText, setButtonText] = useState('Copy To Clipboard');
    const { appInfo } = useContext(InfoContext);
    const textArea = useRef(null);
    const token = appInfo[0].accessToken;
    const user = appInfo[0].user;

    const handleChange = (e) => {
        setCheckBox(e.target.value);
    };

    const changePassword = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const newPassword = generatePassword(checkBox);
            // const sendData = {
            //     newPassword,
            //     user,
            // }
            // const result = await Axios.put('/changePassword', sendData,
            // {
            //     headers: { 'Authorization': "bearer " + token }
            // });
            
            // if (result.msg === 'Successful') {
                setLoading(false); 
                setPassword(newPassword);
                setComplete(true);  
            // }
        } catch (err) {
            setLoading(false);
            setError(err);
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
                <h3>Your password has been successfully changed</h3>
                <textarea className="passwordView" ref={textArea}>{password}</textarea>
                <button onClick={copyClipBoard}>{buttonText}</button>
            </div>
        );
    }

    return (
        <div className="changePasswordWrapper">
            <h1 htmlFor="password-1">Choose Password Difficulty</h1>
            <form className="formPasswordWrapper" onSubmit={changePassword}>
                    <label htmlFor="password-1"> Easy
                    <input id="password-1" type="radio"  onChange={handleChange} value="1" checked={checkBox === '1'}/>
                    </label>
                    <label htmlFor="password-2"> Medium
                    <input id="password-2" type="radio" onChange={handleChange} value="2" checked={checkBox === '2'}/>
                    </label>
                    <label htmlFor="password-3"> Hard
                    <input id="password-3" type="radio" onChange={handleChange} value="3" checked={checkBox === '3'}/>
                    </label>
                <button onClick={changePassword}className="generatePassword">Generate New Password</button>
            </form>
            {
                loading ? <Loader isLoading={loading} size="3rem" thickness={1} /> : null
            }
            <div className="error">{error}</div>
        </div>
    );
}

export default ChangePassword;