import { useEffect, useState } from "react";
import swal from "sweetalert";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector } from "react-redux";

import { useDispatch } from "react-redux";
import { fetchTaskById, fetchTasks } from "../../redux/boards/boardSlice";

const NotificationModal = ({ setNotificationModal, countNotification }) => {

  const [updateEstimateDate, setUpdateEstimateDate] = useState(false);
  const [singleId, setSingleId] = useState([]);
  const [singleItem, setSingleItem] =  useState([]);
  const [finishDate, setFinishDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const [expanDate, setExpanDate] = useState("");
  const [notificationData,setNotificationData] = useState([]);
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.boardview);
  const [data,setData]=useState([])
  useEffect(() => {
    const mergeResult = [].concat(
      tasks.toDo.items,
      tasks.inProgress.items,
      tasks.unitTest.items,
      tasks.qualityAssurance.items,
      tasks.completed.items
    );
    const filterNotificationData=mergeResult.filter((data)=>(data.markNotification == "" ||  data.markNotification == 'viewed'))
    setNotificationData(filterNotificationData)
    setData(mergeResult)
  }, [
    tasks.toDo.items,
    tasks.inProgress.items,
    tasks.unitTest.items,
    tasks.qualityAssurance.items,
    tasks.completed.items,
    setNotificationData,
    setData
  ]);
  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleGetSingleData = (id) => {
    setSingleId(id._id);
  };

  // useEffect(() => {
  //   if (countNotification.length == 0) {
  //     setNotificationModal(false);
  //   }
  // }, [countNotification.length, setNotificationModal]);

  const handleUpdateTaskDate =  (e) => {
    e.preventDefault();
    const comments = e.target.msg.value;
    // const expandDate = e.target.expandDate.value;

    const updateData = {
      _id: singleItem?._id,
      task: singleItem?.task,
      status: singleItem?.status,
      time: singleItem?.time,
      deadlineDate: finishDate.toLocaleDateString("en-CA"),
      startTime:singleItem?.startTime,
      remarks: comments,
      pinTask: singleItem.pinTask,
      taskPriority:singleItem.taskPriority,
      markNotification:'viewed',
      priviousStatus:singleItem.priviousStatus,
      taskSubmissionDate:singleItem.taskSubmissionDate,
      taskCompletionDate:singleItem.taskCompletionDate,
    };
   dispatch(fetchTaskById(updateData));
    swal("Not approve yet.", "Admin will check and let you know..", "success");
    setUpdateEstimateDate(false);
  };
const handleNotificationViewData=async(data)=>{
  const updateData = {
    _id: data?._id,
    task: data?.task,
    status: data?.status,
    time: data?.time,
    deadlineDate: data.deadlineDate,
    startTime:data?.startTime,
    remarks: data.remarks,
    taskPriority:data.taskPriority,
    pinTask: data.pinTask,
    markNotification:'viewed',
    priviousStatus:data.priviousStatus,
    taskSubmissionDate:data.taskSubmissionDate,
    taskCompletionDate:data.taskCompletionDate,
  };
    await dispatch(fetchTaskById(updateData));
  
}
  useEffect(() => {
    const newDates = new Date(singleItem?.deadlineDate);
    newDates.setDate(newDates.getDate() + 10);
    
    console.log(newDates);
    const date_data1 = newDates;
    const newDate1 = new Date(date_data1);
    const year1 = newDate1.toLocaleString("default", {
      year: "numeric",
    });
    const month1 = newDate1.toLocaleString("default", {
      month: "2-digit",
    });
    const day1 = newDate1.toLocaleString("default", {
      day: "2-digit",
    });
    const formattedDates = year1 + "-" + month1 + "-" + day1;
    setExpanDate(formattedDates);
  }, [singleItem?.deadlineDate, finishDate]);

  return (
    <>
      <div className=" justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative sm:w-[60%] md:w-[60%] lg:w-[60%] xl:w-[70%] 2xl:w-[70%]  mx-auto ">
          {/*content*/}
          <div className="border-0 rounded-lg   relative flex flex-col w-full bg-white shadow-2xl outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between p-5 border-b border-solid border-gray-500 rounded-t">
              <h3 className="text-xl font-bold text-black">
                Task Notification
              </h3>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-black  float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={() => setNotificationModal(false)}
              >
                <span className="bg-transparent text-red-500  h-6 w-6 text-[30px] block outline-none focus:outline-none">
                  ×
                </span>
              </button>
            </div>
            {/*body*/}

            <div className="relative flex-auto justify-between items-center mx-auto rounded-xl p-4">
              {notificationData?.map((item, index) => {

                const findMatchingIndices = (data, notificationData) => {
                  const matchingIndices = [];
                  data.forEach((element, index) => {
                    if (notificationData.includes(element)) {
                      matchingIndices.push(index + 1);
                    }
                  });
                  return matchingIndices;
                };

                const matchingIndices = findMatchingIndices(
                  data,
                  notificationData
                );
                console.log(matchingIndices)
                return (
                  <div className={` flex justify-between   items-center  text-black border-b-2  px-4 py-2 ${item.markNotification =="" ? 'bg-slate-200' : 'bg-white' }`}>
                    <div className="w-[70%]"> 
                     {
                      item.status !=='' ? (   <p>Task No: <span className="text-red-600 font-bold">{matchingIndices[index]}</span> That is in previous State was <span className="text-red-500"> {item.priviousStatus}</span>&nbsp; 
                      and present state <span className="text-red-500">{item.status}</span>&nbsp;
                      state is
                      <mark> {item.task}</mark>&nbsp;</p>) :(<p>Task No: New task added 
                        task name is
                        <mark> {item.task}</mark>&nbsp;</p>)
                     }
                      
                      {/* time will expired within 2 days */}
                    </div>
                    {/* <button
                      className=" px-2 py-1 text-black font-bold bg-gray-100 rounded"
                      onClick={() => {
                        handleGetSingleData(item);
                        setUpdateEstimateDate(true);
                        setSingleItem(item);
                        
                      }}
                    >
                      Mark as Read
                    </button> */}
                    <button
                      className=" px-2 py-1 text-black font-bold bg-gray-100 rounded"
                      onClick={() => {
                        handleGetSingleData(item);
                        setSingleItem(item);
                        handleNotificationViewData(item)
                      }}
                    >
                      View
                    </button>
                  </div>
                );
              })}
            </div>
            {updateEstimateDate ? (
              <>
                <div
                  aria-hidden="true"
                  className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                >
                  <div className="relative w-[700px] my-6 mx-auto max-w-3xl">
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                      <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                        <h3 className="text-[20px] font-semibold text-black">
                          Aprroximate Completion Date
                        </h3>
                        <button
                          className="p-1 ml-auto bg-transparent border-0 text-black  float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                          onClick={() => setUpdateEstimateDate(false)}
                        >
                          <span className="bg-transparent text-red-500  h-6 w-6 text-[30px] block outline-none focus:outline-none">
                            ×
                          </span>
                        </button>
                      </div>
                      <div className="relative px-10 py-6 flex-auto">
                        <form action="" onSubmit={handleUpdateTaskDate}>
                          <label
                            htmlFor="message"
                            className="block mb-2 text-[16px] font-medium text-gray-900 dark:text-black"
                          >
                            Your Comments
                          </label>
                          <textarea
                            id="message"
                            rows="2"
                            className="block p-2.5 w-full text-sm text-gray-900 rounded-lg border border-gray-300 outline-none   dark:border-gray-600 dark:placeholder-gray-400 dark:black mb-2 bg-white"
                            placeholder="Write your thoughts here..."
                            required
                            name="msg"
                          ></textarea>
                          <label
                            htmlFor="message"
                            className="block mb-2 text-[16px] font-medium text-gray-900 dark:text-black"
                          >
                            Task Closing Date
                          </label>
                          <input
                            type="date"
                            name="date"
                            disabled
                            value={singleItem?.deadlineDate}
                            className="block p-2.5 w-full text-sm text-gray-900 rounded-lg border border-gray-300 outline-none  dark:bg-gray-400 dark:placeholder-gray-400 dark:text-black  "
                          />
                          <label
                            htmlFor="message"
                            className="block mb-2 text-[16px] font-medium text-gray-900 dark:text-black mt-2"
                          >
                            Aprroximate Completion Date 
                             <mark className="bg-red-300">
                               ( You can't expand this task more 10 days )
                            </mark>
                          </label>
                         
                          <div className=" block p-2.5 w-full text-sm text-gray-900 rounded-lg border border-gray-300 outline-none  dark:border-gray-600 dark:placeholder-gray-400 dark:text-black ">
                            <DatePicker
                              selected={finishDate}
                              onChange={(finishDate) => {
                                setFinishDate(finishDate);
                              }}
                              className="outline-none bg-white"
                              minDate={new Date(singleItem?.deadlineDate)}
                              maxDate={new Date(expanDate)}
                              startDate={finishDate}
                              endDate={endDate}
                            />
                          </div>
                          <button className=" bg-[#d7888a] text-black mt-2 p-2 w-[30%] rounded mx-auto">
                            Update
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
              </>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
};

export default NotificationModal;
