// import { Pool } from "pg";
import { createClient } from "@supabase/supabase-js";

import { validateToken } from "../../utils/validateToken";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_KEY,
      );
      // const pool = new Pool({
      //   host: "host.docker.internal",
      //   user: "postgres",
      //   password: "password",
      //   database: "lingoLoop",
      //   port: 5432,
      // });

      // validate user
      const validateResponse = await validateToken(req);

      if (!validateResponse.valid) {
        return res.status(500).json({
          error: validateResponse.error,
        });
      }
      const { userId } = validateResponse;

      // const { rows } = await pool.query(
      //   "SELECT * FROM words WHERE shown = false AND userid = $1 LIMIT 5",
      //   [userId],
      // );
      const { data: rows } = await supabase
        .from("words")
        .select("*")
        .eq("shown", false)
        .eq("userid", userId)
        .limit(5);

      if (rows.length === 0) {
        // const { rows } = await pool.query(
        //   "SELECT * FROM words WHERE userid = $1 AND shown=true",
        //   [userId],
        // );
        const { data: rows } = await supabase
          .from("words")
          .select("*")
          .eq("shown", true)
          .eq("userid", userId)
          .limit(5);

        res.status(200).json(rows);
      }

      // Get the IDs of the first 5 rows
      const wordIds = rows.map((row) => row.id);

      // // Update the 'shown' status of the selected rows
      // const placeholders = wordIds
      //   .map((_, index) => `$${index + 1}`)
      //   .join(", ");
      // // Update the 'shown' status of the selected rows
      // const updateQuery = `UPDATE words SET shown = true WHERE id IN (${placeholders})`;
      // // Execute the query with wordIds as parameters
      // await pool.query(updateQuery, wordIds);

      const { error } = await supabase
        .from("words")
        .update({ shown: true })
        .in("id", wordIds);

      if (error) {
        throw error;
      }

      // get updated rows
      // const { rows: rowsUpdated } = await pool.query(
      //   "SELECT * FROM words WHERE userid = $1 AND shown=true",
      //   [userId],
      // );
      const { data: rowsUpdated } = await supabase
        .from("words")
        .select("*")
        .eq("userid", userId)
        .eq("shown", true);

      // Return the updated rows
      res.status(200).json(rowsUpdated);
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
