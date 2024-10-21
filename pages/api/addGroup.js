// pages/api/addWord.js
// import mysql from "mysql2/promise";
import { Pool } from "pg";

import { validateToken } from "../../utils/validateToken";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const inputValues = req.body;

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

    try {
      await Promise.all(
        inputValues.map(async (item) => {
          await pool.query(
            "INSERT INTO groupslist (name, userid) VALUES ($1, $2)",
            [item, userId],
          );
        }),
      );

      // const [groups] = await connection.execute(
      //   "SELECT name FROM groupsList WHERE userId = ?",
      //   [userId],
      // );
      const { rows: groups } = await pool.query(
        "SELECT name FROM groupslist WHERE userId = $1",
        [userId],
      );

      console.log("groups", groups);
      const groupNames = groups.map((group) => group.name);

      res.status(200).json(groupNames);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error adding word to the database." });
    } finally {
      // await connection.end(); // Close the database connection
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
