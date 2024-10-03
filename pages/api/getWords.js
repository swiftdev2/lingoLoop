import mysql from "mysql2/promise";

export default async function handler(req, res) {
  try {
    // Create a connection to the MySQL database
    const connection = await mysql.createConnection({
      host: "host.docker.internal",
      user: "root",
      password: "password",
      database: "lingoLoop",
    });

    const { fullList } = req.query;

    if (fullList == "true") {
      const [rows] = await connection.execute("SELECT * FROM words");

      res.status(200).json(rows);
    } else {
      const [rows] = await connection.execute(
        "SELECT * FROM words WHERE shown=TRUE",
      );
      const [incorrectRows] = await connection.execute(
        "SELECT * FROM incorrectWords",
      );

      res.status(200).json({
        words: rows,
        incorrectWords: incorrectRows,
      });
    }

    // Close the connection
    await connection.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
}
