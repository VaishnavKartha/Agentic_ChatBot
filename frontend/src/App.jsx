import { Route,Routes } from "react-router-dom"
import ChatRoom from "./pages/ChatRoom"
import Layout from "./pages/Layout"
import NewChat from "./pages/NewChat"


function App() {
  

  return (
    <>


    <Routes>

      <Route path="/chat" element={<Layout/>}>
        <Route index element={<NewChat/>}/>
        <Route path=":id" element={<ChatRoom/>}/>

      </Route>
    </Routes>
    
    </>
  )
}

export default App
