import cron from 'node-cron';
import { TodoModel } from '../models/todo.models.js';

// Permanently delete todos marked deleted more than 24 hours ago
const deleteExpiredTodos = async () => {
  const now = new Date();
  const cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago

  const result = await TodoModel.deleteMany({
    deleted: true,
    deletedAt: { $lt: cutoff },
  });

  if (result.deletedCount > 0) {
    console.log(`[${now.toLocaleTimeString()}] Deleted ${result.deletedCount} expired todos.`);
  }
};

// Run every 1 hour at minute 0 (e.g., 1:00, 2:00, etc.)
cron.schedule("0 * * * *", async () => {
  console.log(`[${new Date().toLocaleTimeString()}] Running hourly cleanup job...`);
  await deleteExpiredTodos();
});
