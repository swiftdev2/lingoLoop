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

      const { id } = req.query;
      const { count } = req.query;

      if (count === "3") {
        // remove from list

        // await pool.query(
        //   "DELETE FROM incorrectwords WHERE id = $1 AND userid = $2",
        //   [id, userId],
        // );
        const { error } = await supabase
          .from("incorrectwords")
          .delete()
          .eq("id", id)
          .eq("userid", userId);

        if (error) {
          throw error; // Handle the error appropriately
        }
      } else {
        // const updateQuery = `UPDATE incorrectwords SET count = $1 WHERE id = $2`;
        // await pool.query(updateQuery, [count, id]);

        const { error } = await supabase
          .from("incorrectwords")
          .update({ count: count })
          .eq("id", id);

        if (error) {
          throw error; // Handle the error if the update fails
        }
      }

      // const { rows: incorrectRows } = await pool.query(
      //   "SELECT * FROM incorrectwords WHERE userid = $1",
      //   [userId],
      // );

      const { data: incorrectRows, error: fetchError } = await supabase
        .from("incorrectwords")
        .select("*")
        .eq("userid", userId);

      if (fetchError) {
        throw fetchError;
      }

      res.status(200).json(incorrectRows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Database error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
