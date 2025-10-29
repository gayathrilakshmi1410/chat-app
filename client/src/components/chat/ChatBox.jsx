import { useContext, useEffect, useRef} from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
import { Stack } from "react-bootstrap";
import moment from "moment";
import InputEmoji from "react-input-emoji";
import { useState } from "react";
import { formatMessageTime } from "../../utils/formatMessageTime";

const ChatBox=()=>{
    const {user}=useContext(AuthContext);
    const {currentChat,messages,isMessagesLoading,sendTextMessage,socket,setMessages}=useContext(ChatContext);
    const {recipientUser}=useFetchRecipientUser(currentChat,user);
    const [textMessage,setTextMessage]=useState("");
    const scroll=useRef();

    console.log("text",textMessage);

    useEffect(()=>{
        scroll.current?.scrollIntoView({behavior: "smooth"});
    },[messages]);

      // 🗑 Delete single message
  const handleDeleteMessage = (msgId) => {
    socket.emit("deleteMessage", msgId);
  };

  // 🧹 Clear entire chat
  const handleClearChat = () => {
    if (window.confirm("Are you sure you want to clear all messages in this chat?")) {
      socket.emit("clearChat", currentChat._id);
    }
  };

  // 🔁 Listen for deleted/cleared messages
  useEffect(() => {
    if (!socket) return;

socket.on("messageDeleted", (msgId) => {
  setMessages((prev) => prev.filter((msg) => msg._id !== msgId));
});

socket.on("chatCleared", (chatId) => {
  if (currentChat?._id === chatId) setMessages([]);
});

    return () => {
      socket.off("deleteMessage");
      socket.off("clearChat");
    };
  }, [socket, currentChat]);


    if(!recipientUser) return(
        <p style={{textAlign:"center",width:"100%"}}>
            No conversation selected yet...
        </p>
    );
    if(isMessagesLoading) return(
        <p style={{textAlign:"center",width:"100%"}}>
            Loading chat...
        </p>
    );
    return (  <Stack gap={4} className="chat-box">
    {/* 🔹 Chat Header with Clear Chat button */}
    <div className="chat-header d-flex justify-content-between align-items-center">
      <strong>{recipientUser?.name}</strong>
      <button
        onClick={handleClearChat}
        className="clear-btn btn btn-sm btn-outline-danger"
      >
        🧹 Clear Chat
      </button>
    </div>
        <Stack gap={3} className="messages">
            {messages && messages.map((message,index)=> (
            <Stack key={index} className={`${message?.senderId === user?._id ? "message self align-self-end flex-grow-0" : "message align-self-start flex-grow-0"}`} ref={scroll}>
                <span style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
  {message.text}
</span>

                 {/* 🔹 Delete Button for your own messages */}
          {message.senderId === user?._id && (
            <button
              onClick={() => handleDeleteMessage(message._id)}
              className="delete-btn btn btn-sm btn-outline-secondary ms-2"
              title="Delete Message"
            >
              ❌
            </button>
          )}

                <span className="message-footer">{formatMessageTime(message.createdAt)}</span>

            </Stack>))}
        </Stack>
        <Stack direction="horizontal" gap={3} className="chat-input flex-grow-0" >
<textarea
  value={textMessage}
  onChange={(e) => setTextMessage(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (textMessage && textMessage.trim() !== "") {
        sendTextMessage(textMessage, user, currentChat._id, setTextMessage);
      }
    }
  }}
  placeholder="Type your message here..."
  style={{
    width: "100%",
    borderRadius: 24,
    padding: "12px 16px",
    resize: "none",
    minHeight: 45,
    maxHeight: 120,
    overflowY: "auto",
    background: "white",
  }}
/>




            <button className="send-btn" onClick={()=>sendTextMessage(textMessage,user,currentChat._id,setTextMessage)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-send-fill" viewBox="0 0 16 16">
  <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z"/>
</svg>
            </button>
        </Stack>
    </Stack> );
};

export default ChatBox;

