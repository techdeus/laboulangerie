const fs = require('fs');
const format = require('date-fns/format');
const path = require('path');

function passwordLog({ user, password }) {
    const file = path.join(__dirname, '../../logs/passwordLogs.txt');
    const date = format(new Date(Date.now()), 'MM-dd-yyyy');
    const time = format(new Date(Date.now()), 'h:mm:ss a');
    const log = `User: ${user} has changed password to ${password} on ${date} at ${time}! \n`;
    
    return new Promise((resolve, reject) => {
        fs.appendFile(file, log, 'utf-8', (err) => {
                if (err) {
                    console.log('Reached Error');
                    reject(err);
                } else {
                    console.log('Log Saved!');
                    resolve({msg: 'File Written'});
                }
        });
    })
}

module.exports = {
    passwordLog,
}