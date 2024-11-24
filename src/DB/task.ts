// task.ts model for tasks
import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for the Task document
interface ITask extends Document {
  title: string;
  description: string;
  completed: boolean;
  dueDate: Date;
}

// Create the schema for the Task model
const TaskSchema: Schema<ITask> = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Please enter a task title'],
    },
    description: {
      type: String,
      default: '',
    },
    completed: {
      type: Boolean,
      default: false,
    },
    dueDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create and export the Task model
const Task = mongoose.model<ITask>('Task', TaskSchema);

// Use a named export instead of default
export { Task };  // Named export
