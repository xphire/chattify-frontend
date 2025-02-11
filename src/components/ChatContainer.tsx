import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore"
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";

const ChatContainer = () => {

  const {messages, getMessages, isMessagesLoading,selectedUser, subscribeToMessages, unsubscribeFromMessages} = useChatStore();
  const {authUser} = useAuthStore()

  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({behavior : 'instant'})
  }

  function parseTime(time : string){

     const [part1,part2] = time.split('T');

     const secondSplit = part2.split(':');

     const secondJoin = secondSplit[0] + ':' + secondSplit[1];

     return part1 + ' ' + secondJoin
  }

  useEffect(() => {

    if(!selectedUser) return

    getMessages(selectedUser._id);

    () => scrollToBottom()

    subscribeToMessages();

    return () => unsubscribeFromMessages()
    
  },[getMessages, selectedUser?._id, subscribeToMessages, unsubscribeFromMessages])


  useEffect(() => {

     scrollToBottom()
  }, [messages])

  if(isMessagesLoading) {return (

    <div className="flex flex-col flex-1 overflow-auto">

      <ChatHeader/>
      <MessageSkeleton/>
      <MessageInput/>

    </div>

  )}

  

  return (
    <div className="flex flex-1 flex-col overflow-auto">
      <ChatHeader/>
      <div className="flex-1 flex-col-reverse overflow-auto p-4 space-y-4" id='chat-box'>

        {messages.map((message) => (
          <div key={message._id}
          className={`chat ${message.senderId === authUser?._id ? 'chat-end' : 'chat-start'}`}>

            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img 
                 src={message.senderId === authUser?._id ? authUser.profilePic || '/avatar.png' : selectedUser?.profilePic || '/avatar.png'}
                 alt='profile picture' 
                 />
              </div>
            </div>

            <div className="chat-header mb-1">
               <time className="text-xs opacity-50 ml-1">
                    {parseTime(message.createdAt)}
               </time>
            </div>
            <div className="chat-bubble flex flex-col gap-2">

              {message.image && (
                <img 
                src={message.image} 
                alt="Attachment"
                className="sm:mx-w-[200px] rounded-md mb-2" />
              )}
              {message.text && (<p>{message.text}</p>)}


            </div>

          </div>
        ))}

         <div ref={messagesEndRef}></div>

      </div>
      <MessageInput/>


    </div>
  )
}

export default ChatContainer