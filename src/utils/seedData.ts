import pool from "@config/database";

const seedData = async () => {
  try {
    const customerResult = await pool.query(`
      INSERT INTO customers (name, email, password_hash)
      VALUES 
        ('Harry Winks', 'harrywinks@gmail.com', 'hashed_password_1'),
        ('Joe Worall', 'joeworall@gmail,com', 'hashed_password_2')
      RETURNING id;
    `);

    const customerIds = customerResult.rows.map((row) => row.id);

    const accountResult = await pool.query(`
      INSERT INTO accounts (customer_id, account_number, balance)
      VALUES 
        (${customerIds[0]}, 'ACC1234567890', 5000.00),
        (${customerIds[1]}, 'ACC0987654321', 1500.00)
      RETURNING id;
    `);

    const accountIds = accountResult.rows.map((row) => row.id);

    await pool.query(`
      INSERT INTO transactions (account_id, type, amount)
      VALUES 
        (${accountIds[0]}, 'DEPOSIT', 1000.00),
        (${accountIds[0]}, 'WITHDRAWAL', 500.00),
        (${accountIds[1]}, 'DEPOSIT', 1500.00),
        (${accountIds[1]}, 'TRANSFER', 200.00);
    `);

    console.log("Mock data seeded successfully!");
  } catch (error) {
    console.error("Error seeding mock data:", error);
  } finally {
    pool.end();
  }
};

seedData();
