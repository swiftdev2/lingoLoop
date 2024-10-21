import { Pool } from "pg";

import { validateToken } from "../../utils/validateToken";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
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
      const { count } = req.query;

      if (count === "3") {
        // remove from list
        // connection.execute(
        //   "DELETE FROM incorrectWords WHERE id = ? AND userId = ?",
        //   [id, userId],
        // );
        await pool.query(
          "DELETE FROM incorrectwords WHERE id = $1 AND userid = $2",
          [id, userId],
        );
      } else {
        // const updateQuery = `UPDATE incorrectWords SET count = ${count} WHERE id = ${id}`;
        // await connection.execute(updateQuery);

        const updateQuery = `UPDATE incorrectwords SET count = $1 WHERE id = $2`;

        await pool.query(updateQuery, [count, id]);
        // update counter
      }

      // const [incorrectRows] = await connection.execute(
      //   "SELECT * FROM incorrectWords WHERE userId = ?",
      //   [userId],
      // );

      const { rows: incorrectRows } = await pool.query(
        "SELECT * FROM incorrectwords WHERE userid = $1",
        [userId],
      );

      res.status(200).json(incorrectRows);
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
