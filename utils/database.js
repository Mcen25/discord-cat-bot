const { database } = require("pg/lib/defaults");

const {Client} = require(pg);

const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "AppaMomo2025",
    database: "Cat_Images_DB"
});

client.connect();

