import { Loader } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore"; 
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";


const HomePage = () => {

  const {authUser } = useAuthStore();
  const {selectedUser} = useChatStore()

  if (!authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  
  return (
        
    <div className="h-screen bg-base-200">

      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="grid grid-cols-[1fr_2fr] h-full rounded-lg overflow-hidden">
              <Sidebar/>

              {!selectedUser ? <NoChatSelected/> : <ChatContainer/>}
          </div>

        </div>
      </div>

    </div>
  )
}

export default HomePage