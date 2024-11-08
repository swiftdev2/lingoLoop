import fs from "fs";
import path from "path";

import { Pool } from "pg";
import { createClient } from "@supabase/supabase-js";

import { validateToken } from "../../utils/validateToken";

export default async function handler(req, res) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY,
    );

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
    const { fullList } = req.query;
    const { groups } = req.query;

    // just get all users words, no filters
    if (fullList == "true") {
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
    } else {
      // select incorrect words so we can return them to quiz
      // const result = await pool.query(
      //   "SELECT * FROM incorrectwords WHERE userid = $1",
      //   [userId],
      // );
      // const incorrectRows = result.rows;

      const { data: incorrectRows, error: fetchError } = await supabase
        .from("incorrectwords")
        .select("*")
        .eq("userid", userId);

      // const data2 = fs.readFileSync(
      //     path.join(process.cwd(), "utils", "mocIncorrectkWords.json"),
      //     "utf8",
      //   );
      // const incorrectRows = JSON.parse(data2);

      if (fetchError) {
        throw fetchError;
      }

      if (groups.toLowerCase().includes("all")) {
        // find number of users words where shown is false

        // const { rows: fullRows } = await pool.query(
        //   "SELECT * FROM words WHERE shown = false AND userid = $1 LIMIT 5",
        //   [userId],
        // );
        // const { data: fullRows } = await supabase
        //   .from("words")
        //   .select("*")
        //   .eq("shown", false)
        //   .eq("userid", userId)
        //   .limit(5);

        const data = fs.readFileSync(
          path.join(process.cwd(), "utils", "mockWords.json"),
          "utf8",
        );
        const fullRows = JSON.parse(data);

        // const { rows } = await pool.query(
        //   "SELECT * FROM words WHERE userid = $1 AND shown=true",
        //   [userId],
        // );
        // const { data: rows } = await supabase
        //   .from("words")
        //   .select("*")
        //   .eq("userid", userId)
        //   .eq("shown", true);
        const rows = JSON.parse(data);

        // if length is 0 then figure out if any left to show
        if (rows.length === 0 && fullRows.length !== 0) {
          const wordIds = fullRows.map((row) => row.id);
          // const placeholders = wordIds
          //   .map((_, index) => `$${index + 1}`)
          //   .join(", ");
          // const updateQuery = `UPDATE words SET shown = true WHERE id IN (${placeholders})`;
          // await pool.query(updateQuery, wordIds);

          const { error } = await supabase
            .from("words")
            .update({ shown: true })
            .in("id", wordIds);

          if (error) {
            throw error;
          }

          // const { rows: rowsUpdated } = await pool.query(
          //   "SELECT * FROM words WHERE userid = $1 AND shown=true",
          //   [userId],
          // );

          const { data: rowsUpdated } = await supabase
            .from("words")
            .select("*")
            .eq("userid", userId)
            .eq("shown", true);

          res.status(200).json({
            words: rowsUpdated,
            incorrectWords: incorrectRows === undefined ? [] : incorrectRows,
          });
        }

        // res.status(200).json({
        //   words: rows,
        //   incorrectWords: incorrectRows === undefined ? [] : incorrectRows,
        // });

        rows.length !== 0
          ? res.status(200).json({
              words: rows,
              incorrectWords: incorrectRows === undefined ? [] : incorrectRows,
            })
          : res.status(500).json({
              error: "No words found - please add some using the Add page",
            });
      } else {
        const groupsArray = groups
          .split(",")
          .map((group) => group.trim().toLowerCase());

        // const { rows } = await pool.query(
        //   "SELECT * FROM words WHERE userid = $1",
        //   [userId],
        // );
        const { data: rows } = await supabase
          .from("words")
          .select("*")
          .eq("userid", userId);

        const filteredResults = rows.filter((row) => {
          // Split the wordGroups into an array and trim whitespace

          const wordGroupsArray = row.wordgroups
            .split(",")
            .map((group) => group.trim().toLowerCase());

          return wordGroupsArray.some((wordGroup) =>
            groupsArray.includes(wordGroup.toLowerCase()),
          );
        });

        filteredResults.length !== 0
          ? res.status(200).json({
              words: filteredResults,
              incorrectWords: incorrectRows === undefined ? [] : incorrectRows,
            })
          : res.status(500).json({
              error: "No words found for the specified filters",
            });
      }
    }
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Unable to connect to the database. Please try again later.",
    });
  }
}
