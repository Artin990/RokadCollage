import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    walletId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallet",
      required: [true, "شناسه کیف پول الزامی است"],
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "شناسه کاربر الزامی است"],
      index: true,
    },
    type: {
      type: String,
      enum: {
        values: ["charge", "payout", "purchase", "refund"],
        message: "نوع تراکنش نامعتبر است (باید charge، payout، purchase یا refund باشد)",
      },
      required: [true, "نوع تراکنش الزامی است"],
    },
    amount: {
      type: Number,
      required: [true, "مبلغ تراکنش الزامی است"],
      min: [0, "مبلغ تراکنش نمی‌تواند منفی باشد"],
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "success", "failed"],
        message: "وضعیت تراکنش نامعتبر است",
      },
      default: "pending",
      index: true,
    },
    authority: {
      type: String,
      trim: true,
      default: null,
      index: true,
    },
    refId: {
      type: String,
      trim: true,
      default: "",
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

transactionSchema.index({ userId: 1, createdAt: -1 });
transactionSchema.index({ authority: 1, userId: 1 });

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
