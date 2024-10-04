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

    const [groups] = await connection.execute("SELECT name FROM groupsList");
    const groupNames = groups.map((group) => group.name);

    res.status(200).json(groupNames);

    await connection.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
}
