import mysql from "mysql2/promise";

import { validateToken } from "../../utils/validateToken";

export default async function handler(req, res) {
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

    await connection.connect();

    const { fullList } = req.query;
    const { groups } = req.query;

    if (fullList == "true") {
      // const [rows] = await connection.execute("SELECT * FROM words");
      const [rows] = await connection.execute(
        "SELECT * FROM words WHERE userId = ?",
        [userId],
      );

      // convert the 1/0 to true/false
      const transformedRows = rows.map((row) => ({
        ...row,
        shown: row.shown == 1 ? "Yes" : "No",
      }));

      res.status(200).json(transformedRows);
    } else {
      if (groups.toLowerCase().includes("all")) {
        const [rows] = await connection.execute(
          "SELECT * FROM words WHERE userId = ?",
          [userId],
        );
        const [incorrectRows] = await connection.execute(
          "SELECT * FROM incorrectWords WHERE userId = ?",
          [userId],
        );

        rows.length !== 0
          ? res.status(200).json({
              words: rows,
              incorrectWords: incorrectRows,
            })
          : res.status(500).json({
              error: "No words found - please add some using the Add page",
            });
      } else {
        const groupsArray = groups
          .split(",")
          .map((group) => group.trim().toLowerCase());

        // Construct the SQL query
        // const sql = "SELECT * FROM words";
        // const [rows] = await connection.execute(sql);

        const [rows] = await connection.execute(
          "SELECT * FROM words WHERE userId = ?",
          [userId],
        );
        const filteredResults = rows.filter((row) => {
          // Split the wordGroups into an array and trim whitespace
          const wordGroupsArray = row.wordGroups
            .split(",")
            .map((group) => group.trim().toLowerCase());

          return wordGroupsArray.some((wordGroup) =>
            groupsArray.includes(wordGroup.toLowerCase()),
          );
        });

        const [incorrectRows] = await connection.execute(
          "SELECT * FROM incorrectWords WHERE userId = ?",
          [userId],
        );

        filteredResults.length !== 0
          ? res.status(200).json({
              words: filteredResults,
              incorrectWords: incorrectRows,
            })
          : res.status(500).json({
              error: "No words found for the specified filters",
            });
      }
    }
    await connection.end();

    await new Promise((r) => setTimeout(r, 2000));
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Unable to connect to the database. Please try again later.",
    });
  }
}
