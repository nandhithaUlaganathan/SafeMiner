require("./db/mongoose.js")
const express = require("express");
const bodyParser = require('body-parser');
const path = require("path");
const auth = require("./middleware/auth");
const app = express();

const Users = require("./models/user");
const Otp = require("./models/otp");

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// /Define Path for express config
const publicDirPath = path.join(__dirname, '../public');
const viewPath = path.join(__dirname, '../templates/views');
const partialPath = path.join(__dirname, '../templates/partials');

// setup static directory to serve
app.use(express.static(publicDirPath));
app.set('view engine', 'hbs');
app.set('views', viewPath);


app.get("/data", function (req, res) {
    res.render("data");
})

app.post('/api/user', async (req, res) => {
    try {
        var user = new Users(req.body);
        await user.save();
        res.status(201).send("User created successfully");
    } catch (e) {
        console.log(e);
        res.status(500).send("Internal server error");
    }
})

//api to get all users
app.get('/api/user', auth, async (req, res) => {
    try {
        var users = await Users.find(req.query);
        res.status(201).send(users);
    } catch (e) {
        console.log(e);
        res.status(500).send("Internal server error");
    }
})

//api to edit user
app.put('/api/user/:id', auth, async (req, res) => {
    try {
        await Users.findByIdAndUpdate(req.params.id, req.body);
        res.status(201).send("User updated Successfully");
    } catch (e) {
        console.log(e);
        res.status(500).send("Internal server error");
    }
})

//api to delete user
app.delete('/api/user/:id', auth, async (req, res) => {
    try {
        await Users.findByIdAndDelete(req.params.id);
        res.status(200).send("User deleted Successfully");
    } catch (e) {
        console.log(e);
        res.status(500).send("Internal server error");
    }
})

//api to login user
app.post('/api/login', async (req, res) => {
    try {
        const OTP = otpGenerator.generate(6, {
            digits: true,
            alphabets: false,
            uppercase: false,
            specialChar: false
        });
        const number = req.body.number;
        console.log(OTP);

        const otp = new Otp({
            number: number,
            otp: OTP
        });
        const salt = await bcrypt.genSalt(10);
        otp.otp = await bcrypt.hash(otp.otp, salt);
        const result = await otp.save();

        const otpHolder = await Otp.find({
            number: req.body.number
        })
        if (otpHolder.length === 0)
            return res.status(400).send("OTP expired");
        const rightOtpFind = otpHolder[otpHolder.length - 1];
        const validUser = await bcrypt.compare(req.body.otp, rightOtpFind.otp);

        if (rightOtpFind.number === req.body.number && validator) {
            const user = await Users.findByCredential(req.body.email, req.body.password, req.body.number);
            const token = await user.generateAuthToken();
            const result = await user.save();
            const OtpDelete = await Otp.deleteMany({
                msg: "User Registration successfull !",
                token: token,
                data: result
            })
        }
    } catch (e) {
        res.status(500).send("Unable To Login");
    }
})


app.listen(2300, () => {
    console.log("The server runs in port 2300")
})