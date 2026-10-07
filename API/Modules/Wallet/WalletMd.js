import mongoose from "mongoose";

const walletSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "شناسه صاحب کیف پول الزامی است"],
      unique: true,
      index: true,
    },
    balance: {
      type: Number,
      default: 0,
      min: [0, "موجودی کیف پول نمی‌تواند منفی باشد"],
    },
  },
  {
    timestamps: true,
  }
);

const Wallet = mongoose.model("Wallet", walletSchema);
export default Wallet;
