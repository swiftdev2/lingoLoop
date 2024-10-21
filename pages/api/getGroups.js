import { Pool } from "pg";

import { validateToken } from "../../utils/validateToken";

export default async function handler(req, res) {
  try {
    // Create a connection to the MySQL database
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

    const { rows: groups } = await pool.query(
      "SELECT name FROM groupslist WHERE userId = $1",
      [userId],
    );
    const groupNames = groups.map((group) => group.name);

    res.status(200).json(groupNames);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
}
