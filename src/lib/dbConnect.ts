import mongoose from "mongoose";
type connectionObject = {
    isConnected?: number;
}

const connection: connectionObject = {};

async function dbConnect(): Promise<void> {
    // first check if db is alredy connected or not if not then connnect again
        if (connection.isConnected) {
        console.log("Already connected to db")
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '', {})
        connection.isConnected = db.connections[0].readyState;
        console.log("Db connected successfully")

    } catch (error) {
        console.log("DB connection failed", error)
        process.exit(1)
    }
}