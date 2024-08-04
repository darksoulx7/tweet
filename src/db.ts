import mongoose from "mongoose";

export default() => {
    const connect = () => {
        mongoose.connect('mongodb+srv://rengoku:admin123@cluster0.fu2qi6k.mongodb.net/chat-back?retryWrites=true&w=majority')
                .then(() => {
                    console.log('Succesfully connected to the database');
                    return process.exit(1)
                })
                .catch((err) => {
                    console.error('Error to connect database', err);
                })
    };
    connect();
    mongoose.connection.on('disconnected', connect)

}