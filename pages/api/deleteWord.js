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

      await pool.query("DELETE FROM words WHERE id = $1 AND userid = $2", [
        id,
        userId,
      ]);

      const { rows } = await pool.query(
        "SELECT * FROM words WHERE userid = $1",
        [userId],
      );

      // convert the 1/0 to true/false
      const transformedRows = rows.map((row) => ({
        ...row,
        shown: row.shown == 1 ? "Yes" : "No",
      }));

      res.status(200).json(transformedRows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Database error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
