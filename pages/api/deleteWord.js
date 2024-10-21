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

      // await pool.query("DELETE FROM words WHERE id = $1 AND userid = $2", [
      //   id,
      //   userId,
      // ]);
      const { error } = await supabase
        .from("words")
        .delete()
        .eq("id", id)
        .eq("userid", userId);

      if (error) {
        throw error;
      }

      // const { rows } = await pool.query(
      //   "SELECT * FROM words WHERE userid = $1",
      //   [userId],
      // );
      const { data: rows, error: fetchError } = await supabase
        .from("words")
        .select("*")
        .eq("userid", userId);

      if (fetchError) {
        throw fetchError;
      }

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
