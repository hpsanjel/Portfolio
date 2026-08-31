import mongoose, { Document, Schema } from 'mongoose';

export interface ITimeSlotBooking {
	name: string;
	email: string;
	phone: string;
	message?: string;
	bookedAt: Date;
}

export interface ITimeSlot extends Document {
	date: string; // "YYYY-MM-DD"
	time: string; // "HH:00", 24h
	isBooked: boolean;
	booking?: ITimeSlotBooking;
	createdAt: Date;
	updatedAt: Date;
}

const TimeSlotSchema: Schema = new Schema(
	{
		date: {
			type: String,
			required: true,
		},
		time: {
			type: String,
			required: true,
		},
		isBooked: {
			type: Boolean,
			default: false,
			index: true,
		},
		booking: {
			name: String,
			email: String,
			phone: String,
			message: String,
			bookedAt: Date,
		},
	},
	{ timestamps: true }
);

TimeSlotSchema.index({ date: 1, time: 1 }, { unique: true });

export default mongoose.models.TimeSlot || mongoose.model<ITimeSlot>('TimeSlot', TimeSlotSchema);
