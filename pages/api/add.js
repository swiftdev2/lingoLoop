// pages/api/addWord.js
import mysql from "mysql2/promise";

import { validateToken } from "../../utils/validateToken";

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

    const validateResponse = await validateToken(req);

    if (!validateResponse.valid) {
      return res.status(500).json({
        error: validateResponse.error,
      });
    }
    const { userId } = validateResponse;

    try {
      for (const { englishWord, translation, group } of inputValues) {
        // Insert each item into the database
        await connection.execute(
          "INSERT INTO words (english, translation, wordGroups, created, userId) VALUES (?, ?, ?, CURDATE(), ?)",
          [englishWord, translation, group, userId],
        );
      }

      const [rows] = await connection.execute(
        "SELECT * FROM words WHERE userId = ?",
        [userId],
      );
      const transformedRows = rows.map((row) => ({
        ...row,
        shown: row.shown == 1 ? "Yes" : "No", // Convert 1 to "true" and 0 to "false"
      }));

      res.status(200).json(transformedRows);
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
