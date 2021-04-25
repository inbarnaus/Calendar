var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10;

mongoose.connect('mongodb+srv://admin:Inbar5594@cluster0.yqhob.mongodb.net/Calendar?retryWrites=true&w=majority', {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useFindAndModify: false 
})
.then(async ()=>{
    console.log("db is connected"); 
})

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const UserSchema = new Schema({
    fname: {
        type: String,
        // required: true
    },
    lname:{
        type: String,
        // required: true
    },
    email: {
        type: String,
        // required: true,
        index: { unique: true }
    },
    password: {
        type: String,
        // required: true
    }
})

UserSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

const User = mongoose.model('User', UserSchema);
module.exports = User ;