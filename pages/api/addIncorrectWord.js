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

      // const result = await pool.query(
      //   "SELECT * FROM words WHERE id = $1 LIMIT 1",
      //   [id],
      // );
      const { data: result } = await supabase
        .from("words")
        .select("*")
        .eq("id", id)
        .limit(1);

      const selectedRow = result[0];

      // await pool.query(
      //   `INSERT INTO incorrectwords (english, translation, wordgroups, created, count, userid)
      //    VALUES ($1, $2, $3, CURRENT_DATE, $4, $5)`,
      //   [
      //     selectedRow["english"],
      //     selectedRow["translation"],
      //     selectedRow["wordgroups"],
      //     0,
      //     userId,
      //   ],
      // );

      const { error } = await supabase.from("incorrectwords").insert({
        english: selectedRow["english"],
        translation: selectedRow["translation"],
        wordgroups: selectedRow["wordgroups"],
        created: new Date(),
        count: 0,
        userid: userId,
      });

      if (error) {
        throw error; // Handle the error appropriately
      }

      // const updateIncorrectRowsRaw = await pool.query(
      //   "SELECT * FROM incorrectwords WHERE userid = $1",
      //   [userId],
      // );

      const { data: updateIncorrectRows, error: fetchError } = await supabase
        .from("incorrectwords")
        .select("*")
        .eq("userid", userId);

      if (fetchError) {
        throw fetchError;
      }

      res.status(200).json(updateIncorrectRows);
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
