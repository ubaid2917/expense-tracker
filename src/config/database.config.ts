// mongodb+srv://ubaid29170_db_user:LQ1fEdt6h6VfWJ0U@cluster0.gekh0mc.mongodb.net/?appName=Cluster0

import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  uri: "mongodb://0.0.0.0:27017/expense-tracker",
}));