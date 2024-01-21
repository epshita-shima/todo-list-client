import { Route, Routes } from "react-router-dom";
import Login from "./page/Login";
import NotFound from "./page/NotFound";
import Footer from "./page/Footer";
import Home from "./page/Home";
import MainViewPage from "./page/MainViewPage";


function App() {

  return (
   <div >
    <Routes>
      <Route path="/" element={<Home></Home>}></Route>
      <Route path="/project" element={<MainViewPage></MainViewPage>}></Route>
        <Route path='/login' element={<Login></Login>}></Route>
        <Route path='*' element={<NotFound></NotFound>}></Route>
      </Routes>
      </div>
  );
}

export default App;
