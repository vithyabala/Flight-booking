import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from "./routes/authRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"
import flightRoutes from "./routes/flightRoutes.js"
import customerRoutes from "./routes/customerRoutes.js"
const app = express();

app.use(express.json());
app.use(bodyParser.json({ limit: "30mb", extended: true }))
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use(authRoutes, adminRoutes, flightRoutes, customerRoutes)

const PORT = 6001;
mongoose.connect('mongodb+srv://root:root@express-project.zmk69mr.mongodb.net/Flight_booking?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}
).then(() => {
    console.log("Connected to db")
}
).catch((e) => console.log(`Error in db connection ${e}`));

app.listen(PORT, () => {
    console.log(`Running @ ${PORT}`);
});