import mysql from 'mysql2/promise';
import connectionCredentials from '../../../app/utils/dbConnection';

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        const connection = await mysql.createConnection(connectionCredentials("info"));

        const queryExecutivesNSponsors = `SELECT * FROM CyclingInfo.ExecutivesandSponsors`;
        const queryImages = `SELECT * FROM CyclingInfo.Image`

        const [ExecutivesNSponsors] = await connection.execute(queryExecutivesNSponsors);
        const [Images] = await connection.execute(queryImages);

        connection.end();

        // Create a check later

        res.status(200).json({ ExecutivesNSponsors, Images });
        // res.status(200).json({ execs, images });

    } catch (error) {
        console.error("Error Fetching : ", error);
        res.status(500).json({ error: error.message });

        console.error("Error Fetching ExecutivesandSponsors and Images: ", error);
        res.status(500).json({ results: [ExecutivesNSponsors, Images] });
    }
}

const ExecutivesNSponsors = [
    {
        id: 0,
        name: "",
        role: "",
        link: null,
        description: "Refresh the page. If this persist, please contact an executive"
    }
]

const Images = [
    {
        id: 0,
        image: "/logo.jpg"
    }
]