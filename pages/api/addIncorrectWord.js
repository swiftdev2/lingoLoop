import mysql from "mysql2/promise";

import { validateToken } from "../../utils/validateToken";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      // Create a connection to the MySQL database
      const connection = await mysql.createConnection({
        host: "host.docker.internal",
        user: "root",
        password: "password",
        database: "lingoLoop",
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

      const [selectedRow] = await connection.execute(
        `SELECT * FROM words WHERE id = ${id} LIMIT 1`,
      );

      connection.execute(
        "INSERT INTO incorrectWords (english, translation, wordGroups, created, count, userId) VALUES (?, ?, ?, CURDATE(), ?, ?)",
        [
          selectedRow[0]["english"],
          selectedRow[0]["translation"],
          selectedRow[0]["wordGroups"],
          0,
          userId,
        ],
      );

      const [updateIncorrectRows] = await connection.execute(
        "SELECT * FROM incorrectWords WHERE userId = ?",
        [userId],
      );

      res.status(200).json(updateIncorrectRows);

      // Close the database connection
      await connection.end();
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
