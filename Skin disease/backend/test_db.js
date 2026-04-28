import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = 'mongodb://localhost:27017/cureskin';
mongoose.connect(MONGODB_URI).then(async () => {
    const db = mongoose.connection.useDb('cureskin');
    const User = db.collection('users');
    const users = await User.find({}).toArray();
    console.log(users.map(u => ({ email: u.email, password: u.password })));
    process.exit(0);
});
