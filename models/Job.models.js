const { Schema, model } = require("mongoose");

// MODELS
// Create the `Category` model:

const Category = mongoose.model('Category', new mongoose.Schema({
    Job: String,
  }));
  
  // Create the `Purchase` model:
  
  const Purchase = mongoose.model('Purchase', new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    album: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Album'
    }
  }));


// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
  {
    filter: {
      type: String,
      category: {

      },
      required: [true, "Username is required."],
      unique: true
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      // this match will disqualify all the emails with accidental empty spaces, missing dots in front of (.)com and the ones with no domain at all
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
      unique: true,
      lowercase: true,
      trim: true
    },
    passwordHash: {
      type: String,
      required: [true, "Password is required."]
    }
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);



const User = model("User", userSchema);

module.exports = User;
