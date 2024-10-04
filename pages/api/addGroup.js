// pages/api/addWord.js
import mysql from "mysql2/promise";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const inputValues = req.body;

    // Create a connection to the MySQL database
    const connection = await mysql.createConnection({
      host: "host.docker.internal",
      user: "root",
      password: "password",
      database: "lingoLoop",
    });

    try {
      inputValues.map(async (item) => {
        await connection.execute("INSERT INTO groupsList (name) VALUES (?)", [
          item,
        ]);
      });

      const [groups] = await connection.execute("SELECT * FROM groupsList");

      res.status(200).json(groups);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error adding word to the database." });
    } finally {
      await connection.end(); // Close the database connection
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
