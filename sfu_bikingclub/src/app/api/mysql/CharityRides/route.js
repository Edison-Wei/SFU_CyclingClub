import mysql from 'mysql2/promise';
import { NextResponse, NextRequest } from "next/server";

// Change host to 'localhost' and port to '3306' when ready to deploy
let connectionParams = {
    host: process.env.host_dev,
    port: parseInt(process.env.port_dev),
    user: process.env.user_dev,
    password: process.env.password_dev,
    database: process.env.database_dev,
}

export async function GET(request) {

    try {
        const connection = await mysql.createConnection(connectionParams);

        let get_exp_query = "SELECT * FROM CharityRides.CharityRide";

        let values = [];

        const [results, fields] = await connection.execute(get_exp_query, values);

        connection.end();

        return NextResponse.json({fields: fields.map(f => f.name), results});
    } catch(error) {
        console.error(`Error: could reach the database: ${error}`);
        return NextResponse.json(error.message, { status: 400});
    }
}