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

    const [groups] = await connection.execute(
      "SELECT name FROM groupsList WHERE userId = ?",
      [userId],
    );
    const groupNames = groups.map((group) => group.name);

    res.status(200).json(groupNames);

    await connection.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
}
