import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectMongo from "./db/dbconnect.js";
import user from "./routes/user.js";
import shipment from "./routes/shipment.js";
import { startShipmentExpiryChecker } from "./utils/shipmentExpiryChecker.js";
import bookings from "./routes/booking.js";
import bid from "./routes/bid.js";
import http from "http";
import { Server } from "socket.io";
import Chat from "./model/Chat.js";
import chat from "./routes/chat.js";
import community from "./routes/communityChatRoutes.js";
import path from "path";



const app = express();
app.use(express.json());
const corsOptions={origin:"https://shiplink.onrender.com",credentails:true};
app.use(cors());
dotenv.config();

const _dirname=path.resolve();

connectMongo();
startShipmentExpiryChecker();
const PORT = process.env.SERVER_PORT || 5000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {


  // Join chatroom
  socket.on("joinRoom", (chatroomId) => {
    socket.join(chatroomId);
  });

  // Handle messages
  socket.on(
    "sendMessage",
    async ({ chatroomId, sender, message, isAnonymous }) => {
      try {
        const newMessage = await Chat.create({
          chatroomId,
          sender,
          message,
          isAnonymous,
        });
        const populatedMessage = await newMessage.populate(
          "sender",
          "name profile"
        );

        io.to(chatroomId).emit("receiveMessage", populatedMessage); // Emit with sender details
      } catch (error) {
        console.error("Error storing message:", error);
      }
    }
  );

  socket.on("disconnect", () => {
    console.log("User disconnected:");
  });
});

app.use("/api/v1/auth", user);

app.use("/api/v1/shipment", shipment);

app.use("/api/v1/bookings", bookings);

app.use("/api/v1/bids", bid);

app.use("/api/v1/chats", chat);

app.use("/api/v1/community", community);


app.use(express.static(path.join(_dirname,"/Client/dist")));
app.get('*',(_,res)=>{
  res.sendFile(path.resolve(_dirname,"Client","dist","index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
