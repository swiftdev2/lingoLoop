// pages/api/addWord.js
import { Pool } from "pg";
import { createClient } from "@supabase/supabase-js";

import { validateToken } from "../../utils/validateToken";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY,
    );

    const inputValues = req.body;

    const pool = new Pool({
      host: "host.docker.internal",
      user: "postgres",
      password: "password",
      database: "lingoLoop",
      port: 5432,
    });

    const validateResponse = await validateToken(req);

    if (!validateResponse.valid) {
      return res.status(500).json({
        error: validateResponse.error,
      });
    }
    const { userId } = validateResponse;

    try {
      for (const { englishWord, translation, group } of inputValues) {
        await pool.query(
          "INSERT INTO words (english, translation, wordgroups, created, userid) VALUES ($1, $2, $3, CURRENT_DATE, $4)",
          [englishWord, translation, group, userId],
        );

        // const { error } = await supabase.from("words").insert({
        //   english: englishWord,
        //   translation: translation,
        //   wordgroups: group,
        //   created: new Date(),
        //   userid: userId,
        // });

        // if (error) {
        //   throw error; // Throw the error to handle it in the catch block
        // }
      }

      const { rows } = await pool.query(
        "SELECT * FROM words WHERE userid = $1",
        [userId],
      );

      // const { data: rows, error: fetchError } = await supabase
      //   .from("words")
      //   .select("*")
      //   .eq("userid", userId);

      // if (fetchError) {
      //   throw fetchError;
      // }

      const transformedRows = rows.map((row) => ({
        ...row,
        shown: row.shown == true ? "Yes" : "No", // Convert 1 to "true" and 0 to "false"
      }));

      res.status(200).json(transformedRows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error adding word to the database." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
