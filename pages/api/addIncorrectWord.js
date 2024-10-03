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

      const { id } = req.query;

      const [selectedRow] = await connection.execute(
        `SELECT * FROM words WHERE id = ${id} LIMIT 1`,
      );

      connection.execute(
        "INSERT INTO incorrectWords (english, translation, wordGroups, created, count) VALUES (?, ?, ?, CURDATE(), ?)",
        [
          selectedRow[0]["english"],
          selectedRow[0]["translation"],
          selectedRow[0]["wordGroups"],
          0,
        ],
      );

      const [updateIncorrectRows] = await connection.execute(
        "SELECT * FROM incorrectWords",
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
