const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const usersauthRoutes = require('./src/routes/users_auth');
const adminauthRoutes = require('./src/routes/admin_auth');
const adminStatsRoutes = require('./src/routes/admin_stats');
const adminCategoryRoutes = require("./src/routes/admin_categories");


app.use('/uploads', express.static('uploads'));

app.use(cors());
app.use(express.json());

app.use('/auth', usersauthRoutes);
app.use('/admin', adminauthRoutes);
app.use('/admin', adminStatsRoutes);
app.use("/admin/categories", adminCategoryRoutes);



const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
