import { Connection, createConnection } from 'mongoose';

/* Database Connection Handler */

// Shouldn't be stored like this in actuality
const mainDB: string = "mongodb+srv://client:36557ucg@web-forum-database.jnhslem.mongodb.net/mainDB?retryWrites=true&w=majority";
const testDB: string = "mongodb+srv://client:36557ucg@web-forum-database.jnhslem.mongodb.net/testDB?retryWrites=true&w=majority";

const DB_URI = process.env.NODE_ENV === "test" ? testDB : mainDB;

export const conn: Connection = createConnection(DB_URI);

conn.on('connected', () => {
    console.log('Connected to MongoDB');
});

conn.on('error', (error) => {
    if (error instanceof Error) {
        console.error('Error connecting to MongoDB:', error.message);
    } else {
        console.error('Unexpected error during MongoDB connection:', error);
    }
});




