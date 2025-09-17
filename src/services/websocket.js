import io from "socket.io-client";

let socket = null;

/**
 * Connect to WebSocket server
 * @param {string} url - WebSocket server URL
 * @param {string} token - Optional auth token to send as query
 */
export const connectSocket = (url, token) => {
  if (socket) {
    return socket;
  }
  const options = {
    transports: ["websocket"],
  };
  if (token) {
    options.query = { token };
  }
  socket = io(url, options);

  socket.on("connect", () => {
    console.log("WebSocket connected");
  });

  socket.on("disconnect", (reason) => {
    console.log("WebSocket disconnected:", reason);
  });

  socket.on("connect_error", (error) => {
    console.error("WebSocket connect error:", error);
  });

  return socket;
};

export const sendPoint = (point) => {
  if (socket && socket.connected) {
    socket.emit("locationPoint", point);
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
