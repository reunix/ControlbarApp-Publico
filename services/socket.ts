import { URL_API } from "@/constants/consts";
import { io } from 'socket.io-client';
const socket = io(URL_API, {
  autoConnect: false,
});

export default socket;