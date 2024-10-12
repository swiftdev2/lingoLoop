import mysql from "mysql2/promise";

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

      const [rows] = await connection.execute(
        "SELECT * FROM words WHERE shown = false LIMIT 5",
      );

      if (rows.length === 0) {
        const [rows] = await connection.execute(
          "SELECT * FROM words WHERE shown=TRUE",
        );

        res.status(200).json(rowsUpdated);
      }

      // Get the IDs of the first 5 rows
      const wordIds = rows.map((row) => row.id);

      // Update the 'shown' status of the selected rows
      const updateQuery = `UPDATE words SET shown = true WHERE id IN (${wordIds.join(", ")})`;

      await connection.execute(updateQuery);

      // get updated rows
      const [rowsUpdated] = await connection.execute(
        "SELECT * FROM words WHERE shown=TRUE",
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
