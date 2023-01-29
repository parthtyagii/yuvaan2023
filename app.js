const express = require('express');
const app = express();
const path = require('path');
const firestore = require('firebase/firestore');
const firebaseConfig = require('./firebaseConfig.js');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const uuid = require('uuid');

//----------------------------------------------------------------------------------------------

app.set('view engine', 'ejs');
// app.use(methodOverride('_method'));

app.use(express.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));

//----------------------------------------------------------------------------------------------

const collectionRef = firestore.collection(firebaseConfig.database, 'users');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    secure: false,
    auth: {
        user: 'team.yuvaandtu@gmail.com',
        pass: 'xlvytxeakduxtywf'
    },
    tls: {
        rejectUnauthorized: false
    }
});

const getId = () => {
    let str = '';
    for (let i = 0; i < 5; i++) {
        str = str + Math.floor(Math.random() * 9).toString();
    }
    return str;
}

//----------------------------------------------------------------------------------------------

app.get('/', async (req, res) => {

    const response = await firestore.getDocs(collectionRef);
    // const d = response.docs.map((user) => {
    //     return user.id;
    // })

    res.render('index');
});

app.post('/', async (req, res) => {
    const data = req.body;
    data.fname = data.fname.toUpperCase();
    data.lname = data.lname.toUpperCase();
    const randomString = getId();
    data.userId = randomString;

    try {
        const response = await firestore.addDoc(collectionRef, data);
    }
    catch (e) {
        console.log('cannot add user to firestore!');
    }

    let mailOptions = {
        from: 'team.yuvaandtu@gmail.com',
        to: req.body.email,
        subject: 'Yuvaan2023 Pass',
        html: `<h1>${'YUVA2K23 / ' + randomString}</h1>`,
        text: 'yuvaan2023',
    };

    try {
        const info = await transporter.sendMail(mailOptions);
    }
    catch (e) {
        console.log('cannot send mail');
        console.log(e);
    }

    res.redirect('/');
})


//---------------------------------------------------------------------------------------------
//using mongodb...




app.listen(3000, () => {
    console.log('Server 3000 running!');
})