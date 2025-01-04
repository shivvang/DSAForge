import {connect} from "mongoose";

const dbConnect = async()=>{
    try {
        const monoDbConnection = await connect(process.env.MONGO_DB_CONNECTION_URL);
        console.log(`Database connected and is Hosted At: ${monoDbConnection.connection.host}`);
    } catch (error) {
        console.log(`Database Connection Failed ${error}`);
        process.exit(1);
    }
}

export default dbConnect;