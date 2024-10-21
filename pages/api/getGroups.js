// import { Pool } from "pg";

import { createClient } from "@supabase/supabase-js";

import { validateToken } from "../../utils/validateToken";

export default async function handler(req, res) {
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

    // const { rows: groups } = await pool.query(
    //   "SELECT name FROM groupslist WHERE userId = $1",
    //   [userId],
    // );

    const { data: groups, error: fetchError } = await supabase
      .from("groupslist")
      .select("*")
      .eq("userid", userId);

    if (fetchError) {
      throw fetchError;
    }

    const groupNames = groups.map((group) => group.name);

    res.status(200).json(groupNames);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
}
