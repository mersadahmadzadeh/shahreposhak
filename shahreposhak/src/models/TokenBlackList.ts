import mongoose, { Document, Schema } from "mongoose";

export interface IBlackList extends Document {
  token: string;
  userId: string;
  expiredAt: Date;
}


const BlackListSchema: Schema = new Schema<IBlackList>({
 token:{type: String, required: true},
 userId: {type: String, required: true},
 expiredAt: {type: Date, required: true}
})

export default mongoose.model<IBlackList>("TokenBlackList", BlackListSchema);