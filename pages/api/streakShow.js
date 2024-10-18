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

      const [rows] = await connection.execute(
        "SELECT * FROM words WHERE shown = false LIMIT 5 AND userId = ?",
        [userId],
      );

      if (rows.length === 0) {
        const [rows] = await connection.execute(
          "SELECT * FROM words WHERE shown=TRUE AND userId = ?",
          [userId],
        );

        res.status(200).json(rows);
      }

      // Get the IDs of the first 5 rows
      const wordIds = rows.map((row) => row.id);

      // Update the 'shown' status of the selected rows
      const updateQuery = `UPDATE words SET shown = true WHERE id IN (${wordIds.join(", ")})`;

      await connection.execute(updateQuery);

      // get updated rows
      const [rowsUpdated] = await connection.execute(
        "SELECT * FROM words WHERE shown=TRUE AND userId = ?",
        [userId],
      );

      // Return the updated rows
      res.status(200).json(rowsUpdated);

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
