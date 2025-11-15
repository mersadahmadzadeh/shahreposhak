import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt"


export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin" , default: "user";
  comparePassword(candidatePassword: string): Promise<boolean>;

}


const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" }
},
{timestamps: true})

UserSchema.pre("save" , async function(next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
})


UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>("User", UserSchema);
