import mongoose from "mongoose";

const connectMongo = () => {
  try {
    const connect = mongoose.connect(`${process.env.MONGO_CONNECT_URL}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      ssl: true,
    });

    if (!connect) {
      console.log("Error while connecting to database");
    } else {
      console.log("Successfully Connected To Database");
    }
  } catch (error) {
    console.log(error);
  }
};

export default connectMongo;
