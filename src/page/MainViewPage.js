import React from 'react'
import ShowTask from '../components/ui/ShowTask'
import AddTask from '../redux/features/AddTask/AddTask'
import { useState } from "react";
import Footer from './Footer';
const MainViewPage = () => {
    const [showModal, setShowModal] = useState(false);
    const [showUpdate,setShowUpdate]=useState(false)
    const [showFormData, setShowFormData] = useState(true);
    const [deleteTaskModal,setDeleteTaskModal]=useState(false)
    const [columnName,setColumnName]=useState('')
    const [countNotification, setCountNotification] = useState([]);
    const [notificationModal, setNotificationModal] = useState(false);
  return (
    <div className="mx-auto containers">
      {
         <><AddTask showModal={showModal}
                  setShowModal={setShowModal}
                  showUpdate={showUpdate}
                  showFormData={showFormData}
                  setShowFormData={setShowFormData}
                  columnName={columnName}
                  countNotification={countNotification}
                  setCountNotification={setCountNotification}
                  notificationModal={notificationModal}
                  setNotificationModal={setNotificationModal}
              ></AddTask><ShowTask
                  setShowModal={setShowModal}
                  setShowUpdate={setShowUpdate}
                  setShowFormData={setShowFormData}
                  deleteTaskModal={deleteTaskModal}
                  setDeleteTaskModal={setDeleteTaskModal}
                  columnName={columnName}
                  setColumnName={setColumnName}
              ></ShowTask>
                <Footer></Footer>
              </>
            
      }
    </div>
  )
}

export default MainViewPage
