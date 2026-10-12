import mongoose from "mongoose";
import { phoneRegex } from "../../Utils/validateRequest.js";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    trim: true,
    default: "",
  },
  phoneNumber: {
    type: String,
    required: [true, "وارد کردن شماره موبایل الزامی است"],
    trim: true,
    unique: true,
    match: [
      phoneRegex,
      "فرمت شماره موبایل نامعتبر است",
    ],
  },
  password: {
    type: String,
    trim: true,
    select: false,
  },
  birthDate: {
    type: String,
    trim: true,
    default: "",
  },
  role: {
    type: String,
    enum: {
      values: ["user", "admin", "superAdmin"],
      message: "نقش کاربر نامعتبر است",
    },
    default: "user",
  },
}, {
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      delete ret.password;
      return ret;
    },
  },
  toObject: {
    transform: (doc, ret) => {
      delete ret.password;
      return ret;
    },
  },
});

userSchema.index({ role: 1, createdAt: -1 });
userSchema.index({ createdAt: -1 });

// Automatically ensure a default Wallet exists for every created user
userSchema.post("save", async function (doc) {
  try {
    const Wallet = mongoose.models.Wallet || mongoose.model("Wallet");
    if (Wallet) {
      await Wallet.findOneAndUpdate(
        { ownerId: doc._id },
        { $setOnInsert: { ownerId: doc._id, balance: 0 } },
        { upsert: true }
      );
    }
  } catch (err) {
    // Non-blocking catch to prevent interrupting the user save lifecycle
  }
});

const User = mongoose.model("User", userSchema);
export default User;
