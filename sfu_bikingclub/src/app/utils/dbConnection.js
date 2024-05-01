export default function connectionCredentials(db) {
    // Change all to without the "_dev"
    return {
        host: process.env.host_dev,
        port: parseInt(process.env.port_dev),
        user: process.env.user_dev,
        password: process.env.password_dev,
        database: (db == "club"? process.env.database_Club_dev : process.env.database_Route_dev),
    }
}