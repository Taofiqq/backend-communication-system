// import { Pool } from "pg";
// import dotenv from "dotenv";

// dotenv.config();

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false,
//   },
// });

// pool.on("connect", () => {
//   console.log("Connected to the PostgreSQL database");
// });

// export default pool;

// database.ts
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // ssl: {
  //   rejectUnauthorized: false,
  // },
  // Add these connection pool settings
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
});

// Add error handling for the pool
pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});

// Test the connection on startup
pool.connect((err, client, release) => {
  if (err) {
    console.error("Error acquiring client", err.stack);
    return;
  }
  client?.query("SELECT NOW()", (err, result) => {
    release();
    if (err) {
      console.error("Error executing query", err.stack);
      return;
    }
    console.log("Connected to database:", result.rows[0]);
  });
});

export default pool;
