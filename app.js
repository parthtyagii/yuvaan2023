const express = require('express');
const app = express();
const path = require('path');
const firestore = require('firebase/firestore');
const firebaseConfig = require('./firebaseConfig.js');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

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
        user: 'parthtyagi414@gmail.com',
        pass: 'osgcdxrfgsbfvzkj'
    },
    tls: {
        rejectUnauthorized: false
    }
});

//----------------------------------------------------------------------------------------------


app.get('/', async (req, res) => {

    const response = await firestore.getDocs(collectionRef);
    const d = response.docs.map((user) => {
        return user.id;
    })

    res.render('index');
});

app.post('/', async (req, res) => {
    const data = req.body;
    const response = await firestore.addDoc(collectionRef, data);
    const randomString = crypto.randomBytes(3).toString('hex');
    // console.log(randomString);

    let mailOptions = {
        from: 'parthtyagi414@gmail.com',
        to: req.body.email,
        subject: 'Yuvaan2023 Pass',
        html: `<h1>${randomString}</h1>`,
        text: 'yuvaan2023',
    };

    const info = await transporter.sendMail(mailOptions);
    // console.log(info.response);

    res.redirect('/');
})




app.listen(3000, () => {
    console.log('Server 3000 running!');
})