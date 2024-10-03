import mysql from "mysql2/promise";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      // Create a connection to the MySQL database
      const connection = await mysql.createConnection({
        host: "host.docker.internal",
        user: "root",
        password: "password",
        database: "lingoLoop",
      });

      const { id } = req.query;
      const { count } = req.query;

      console.log("id", id);
      console.log("count", count);

      if (count === "3") {
        // remove from list
        connection.execute(`DELETE FROM incorrectWords WHERE id = ${id}`);
      } else {
        const updateQuery = `UPDATE incorrectWords SET count = ${count} WHERE id = ${id}`;

        await connection.execute(updateQuery);
        // update counter
      }

      const [incorrectRows] = await connection.execute(
        "SELECT * FROM incorrectWords",
      );

      res.status(200).json(incorrectRows);
      await connection.end();
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
