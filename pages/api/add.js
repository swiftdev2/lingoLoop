// pages/api/addWord.js
import mysql from 'mysql2/promise';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const inputValues = req.body; 

        // Create a connection to the MySQL database
        const connection = await mysql.createConnection({
            host: 'host.docker.internal',
            user: 'root',
            password: 'password',
            database: 'lingoLoop'
        });

        try {
            for (const { englishWord, translation, group } of inputValues) {
                // Insert each item into the database
                await connection.execute(
                  'INSERT INTO words (english, translation, wordGroups, created) VALUES (?, ?, ?, CURDATE())',
                  [englishWord, translation, group]
                );
              }
          

            res.status(200).json({ message: 'Word added successfully!' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error adding word to the database.' });
        } finally {
            await connection.end(); // Close the database connection
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
