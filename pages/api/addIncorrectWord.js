import { Pool } from "pg";

import { validateToken } from "../../utils/validateToken";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      // Create a connection to the MySQL database
      // const connection = await mysql.createConnection({
      //   host: "host.docker.internal",
      //   user: "root",
      //   password: "password",
      //   database: "lingoLoop",
      // });

      const pool = new Pool({
        host: "host.docker.internal",
        user: "postgres",
        password: "password",
        database: "lingoLoop",
        port: 5432,
      });

      // validate user
      const validateResponse = await validateToken(req);

      if (!validateResponse.valid) {
        return res.status(500).json({
          error: validateResponse.error,
        });
      }
      const { userId } = validateResponse;

      const { id } = req.query;

      // const [selectedRow] = await connection.execute(
      //   `SELECT * FROM words WHERE id = ${id} LIMIT 1`,
      // );

      // const { selectedRow } = await pool.query(
      //   "SELECT * FROM words WHERE id = $1 LIMIT 1",
      //   [id],
      // );

      const result = await pool.query(
        "SELECT * FROM words WHERE id = $1 LIMIT 1",
        [id],
      );
      const selectedRow = result.rows[0]; // Access the first row from the result

      // connection.execute(
      //   "INSERT INTO incorrectWords (english, translation, wordGroups, created, count, userId) VALUES (?, ?, ?, CURDATE(), ?, ?)",
      //   [
      //     selectedRow[0]["english"],
      //     selectedRow[0]["translation"],
      //     selectedRow[0]["wordGroups"],
      //     0,
      //     userId,
      //   ],
      // );

      await pool.query(
        `INSERT INTO incorrectwords (english, translation, wordgroups, created, count, userid) 
         VALUES ($1, $2, $3, CURRENT_DATE, $4, $5)`,
        [
          selectedRow["english"],
          selectedRow["translation"],
          selectedRow["wordgroups"],
          0,
          userId,
        ],
      );

      // const [updateIncorrectRows] = await connection.execute(
      //   "SELECT * FROM incorrectWords WHERE userId = ?",
      //   [userId],
      // );

      const updateIncorrectRowsRaw = await pool.query(
        "SELECT * FROM incorrectwords WHERE userid = $1",
        [userId],
      );

      const updateIncorrectRows = updateIncorrectRowsRaw.rows;

      res.status(200).json(updateIncorrectRows);

      // Close the database connection
      // await connection.end();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Database error" });
    }
  } else {
    // If not a GET request, return method not allowed
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
