export default function connectionCredentials(db) {
    // Change all to without the "_dev"
    return {
        host: process.env.host_dev,
        port: parseInt(process.env.port_dev),
        user: process.env.user_dev,
        password: process.env.password_dev,
        database: databaseName(db)
    }
}

function databaseName(db) {
    switch (db) {
        case "info":
            return process.env.database_Info_dev
        case "account":
            return process.env.database_Account_dev
        case "blog":
            return process.env.database_Blog_dev
        default:
            return process.env.database_Route_dev
    }
}