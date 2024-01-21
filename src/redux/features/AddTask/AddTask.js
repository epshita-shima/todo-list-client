/* eslint-disable @typescript-eslint/no-explicit-any */
import swal from "sweetalert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import { useEffect } from "react";
import NotificationModal from "../../../components/ui/NotificationModal";
import Select from "react-select";
import { useDispatch } from "react-redux";

import { useSelector } from "react-redux";
import { fetchTaskById, fetchTasks, fetchTasksPost } from "../../boards/boardSlice";

const AddTask = ({
  showModal,
  setShowModal,
  showUpdate,
  showFormData,
  setShowFormData,
  columnName,
  countNotification, setCountNotification,
  notificationModal, setNotificationModal
}) => {
  const [startDate, setStartDate] = useState(new Date());
  const [priorityValue, setPriorityValue] = useState();
  const [data, setData] = useState([]);
  const [dataOption, setDataOption] = useState([]);
  const [singleUpdateData, setSingleUpdateData] = useState([]);
  const dispatch = useDispatch();
  const userLocalData = sessionStorage.getItem("userInfo");

  const date_data = startDate;
  const newDate = new Date(date_data);
  const year = newDate.toLocaleString("default", {
    year: "numeric",
  });
  const month = newDate.toLocaleString("default", {
    month: "2-digit",
  });
  const day = newDate.toLocaleString("default", {
    day: "2-digit",
  });
  const formattedDate = year + "-" + month + "-" + day;
  const tasks = useSelector((state) => state.boardview);
  const stringWithoutSpaces = columnName.split(" ").join("");
console.log(stringWithoutSpaces)
  useEffect(() => {
    const mergeResult = [].concat(
      tasks.toDo.items,
      tasks.inProgress.items,
      tasks.unitTest.items,
      tasks.qualityAssurance.items,
      tasks.completed.items
    );
    const filterMargeData = mergeResult.filter(
      (data) => data.status.toLowerCase() == stringWithoutSpaces.toLowerCase() || data.status==''
    );
    
    const filterNotificationData=mergeResult.filter((data)=>(data.markNotification == ""))
    setCountNotification(filterNotificationData)
    setData(filterMargeData);
  }, [
    tasks.toDo.items,
    tasks.inProgress.items,
    tasks.unitTest.items,
    tasks.qualityAssurance.items,
    tasks.completed.items,
    stringWithoutSpaces,
    setData,setCountNotification
  ]);
  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  // useEffect(() => {
  //   const tempData = [];
  //   data?.forEach((element) => {
  //     const deadlineDateString = element?.deadlineDate;
  //     const now = new Date().getDate();
  //     const futureDate = new Date(deadlineDateString).getDate();
  //     const dayleft = futureDate - now;
  //     if (dayleft <= 2 && dayleft >= 0) {
  //       tempData.push(element);
  //     }
  //   });
  //   data?.map((item) => {
  //     const dateString = item?.deadlineDate;
  //     const now = new Date().getDate();
  //     const futureDate = new Date(dateString).getDate();
  //     const dayleft = futureDate - now;
  //     if (dayleft >= 2) {
  //       setCountNotification(countNotification + 1);
  //     }
  //   });
  //   setCountNotification(tempData);
  // }, [data, setCountNotification]);



  const handelAddTask = async (e) => {
    e.preventDefault();
    const task = e.target.name.value;
    const time = e.target.time.value;
    const date = e.target.date.value;
    if (showUpdate == true) {
      await dispatch(fetchTaskById(singleUpdateData));
      swal({
        title: "Good job!",
        text: "Update successfully",
        icon: "success",
        button: "OK",
      });
    } else {
      const taskDetails = {
        task: task,
        startTime: formattedDate,
        time: time,
        deadlineDate: date,
        taskPriority: priorityValue,
        status: "",
        pinTask: "",
        markNotification:'',
        remarks: "",
        taskSubmissionDate: "",
        taskCompletionDate: "",
        priviousStatus:""
      };
      if (
        taskDetails.task == "" ||
        taskDetails.time == "" ||
        taskDetails.deadlineDate == ""
      ) {
        swal({
          title: "Not Possible!",
          text: "Please write something..",
          icon: "warning",
          button: "OK",
        });
      } else {
        // await addtask(taskDetails);
        await dispatch(fetchTasksPost(taskDetails));
        e.target.name.value = "";
        e.target.time.value = "";
        e.target.date.value = "";
        swal({
          title: "Good job!",
          text: "Data added successfully",
          icon: "success",
          button: "OK",
        });
      }
    }

    setShowModal(false);
    setShowFormData(!showFormData);
  };

  const options = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
  ];

  useEffect(() => {
    const newArray = data.map((element) => {
      return { value: element._id, label: element.task };
    });
    setDataOption(newArray);
  }, [data]);

  return (
    <>
      <div className="navbar bg-gray-100 text-black">
        <div className="navbar-start">
          {/* <div className="dropdown">
            <div tabindex="0" role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabindex="0"
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-gray-100 rounded-box w-52"
            >
              <li>
                <a>Item 1</a>
              </li>
              <li>
                <a>Parent</a>
                <ul className="p-2">
                  <li>
                    <a>Submenu 1</a>
                  </li>
                  <li>
                    <a>Submenu 2</a>
                  </li>
                </ul>
              </li>
              <li>
                <a>Item 3</a>
              </li>
            </ul>
          </div> */}
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1"></ul>
        </div>
        <div className="navbar-end">
          <div onClick={() => setNotificationModal(true)} className="mr-6">
            <button className="text-black text-[25px] relative mt-2">
              <FontAwesomeIcon icon={faBell}></FontAwesomeIcon>
            </button>
            <div className="counter absolute top-[10px] w-6 h-6 rounded-full bg-red-500 text-white text-center">
              {countNotification.length}
            </div>
          </div>
          <button
            className=" btn-sm px-4 text-white"
            style={{
              borderRadius: "5px",
              border: "none",
              cursor: "pointer",
              outlineOffset: "4px",
              background: "#9ca3af",
            }}
          >
            {userLocalData}
          </button>
        </div>
      </div>

      <form action="" onSubmit={handelAddTask} className="flex justify-center">
        {showModal ? (
          <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
              <div className="relative sm:w-[60%] md:w-[60%] lg:w-[60%] xl:w-[70%] 2xl:w-[70%]  my-6 mx-auto">
                {/*content*/}
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                  {/*header*/}
                  <div className="flex  justify-between items-center p-5 border-b border-solid border-blueGray-200 rounded ">
                    <h3 className="text-xl font-semibold text-black">
                      {showUpdate ? "Update Task Details" : "Add Task Details"}
                    </h3>
                    <button
                      className="p-1 ml-auto bg-transparent border-0 text-black  float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                      onClick={() => {
                        setShowModal(false);
                        setShowFormData(true);
                        setSingleUpdateData({
                          _id: "",
                          deadlineDate: "",
                          remarks: "",
                          startTime: "",
                          taskPriority: "",
                          time: "",
                          task: "",
                          pinTask: "",
                          status: "",
                          markNotification:'',
                          taskSubmissionDate: "",
                          taskCompletionDate: "",
                          priviousStatus:""
                        });
                      }}
                    >
                      <span className="bg-transparent text-red-500  h-6 w-6 text-[30px] block outline-none focus:outline-none">
                        ×
                      </span>
                    </button>
                  </div>
                  {/*body*/}

                  <div className="relative px-10 py-6 flex-auto ">
                    <div className="shadow-2xl p-4 rounded-md">
                      {showUpdate ? (
                        <>
                          <div className="mb-2">
                            <label
                              htmlFor="message"
                              className="block mb-2 text-[16px] font-medium text-gray-900 dark:text-black"
                            >
                              Select task for update
                            </label>
                            <Select
                              options={dataOption}
                              className="rounded-2xl text-black"
                              onChange={(e) => {
                                setPriorityValue(e.value);
                                const filterSingleData = data.filter(
                                  (x) => x._id == e.value
                                );
                                // dispatch(fetchTaskById(filterSingleData))
                                setSingleUpdateData(filterSingleData[0]);
                                setShowFormData(false);
                              }}
                            />
                          </div>
                        </>
                      ) : (
                        ""
                      )}
                      <div>
                        <label
                          htmlFor="message"
                          className="block mb-2 text-[16px] font-medium text-gray-900 dark:text-black"
                        >
                          Task Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          disabled={showFormData}
                          value={showUpdate ? singleUpdateData.task : null}
                          placeholder="Enter text"
                          className={`block p-2 w-full text-sm  text-gray-900 rounded-lg border border-gray-300 outline-none dark:placeholder-gray dark:text-black ${
                            showFormData ? "bg-gray-100" : " bg-white"
                          }`}
                          onChange={(e) => {
                            // eslint-disable-next-line no-unused-expressions
                            showUpdate
                              ? setSingleUpdateData({
                                  _id: singleUpdateData._id,
                                  deadlineDate: singleUpdateData.deadlineDate,
                                  remarks: singleUpdateData.remarks,
                                  startTime: singleUpdateData.startTime,
                                  taskPriority: singleUpdateData.taskPriority,
                                  time: singleUpdateData.time,
                                  task: e.target.value,
                                  pinTask: singleUpdateData.pinTask,
                                  status: singleUpdateData.status,
                                  markNotification:singleUpdateData.markNotification,
                                  priviousStatus:singleUpdateData.priviousStatus,
                                  taskSubmissionDate:
                                    singleUpdateData.taskSubmissionDate,
                                  taskCompletionDate:
                                    singleUpdateData.taskCompletionDate,
                                })
                              : e.target.value;
                          }}
                        />
                      </div>
                      <div className="mt-2">
                        <label
                          htmlFor="message"
                          className="block mb-2 text-[16px] font-medium text-gray-900 dark:text-black"
                        >
                          Choose Priority
                        </label>
                        <Select
                          options={options}
                          className="rounded-2xl text-black"
                          isDisabled={showFormData}
                          value={
                            showUpdate
                              ? options.find(
                                  (x) =>
                                    x.value == singleUpdateData?.taskPriority
                                )
                              : options.find((x) => x.value == priorityValue)
                          }
                          onChange={(e) =>
                            showUpdate
                              ? setSingleUpdateData({
                                  _id: singleUpdateData._id,
                                  deadlineDate: singleUpdateData.deadlineDate,
                                  remarks: singleUpdateData.remarks,
                                  startTime: singleUpdateData.startTime,
                                  taskPriority: e.value,
                                  time: singleUpdateData.time,
                                  task: singleUpdateData.task,
                                  pinTask: singleUpdateData.pinTask,
                                  status: singleUpdateData.status,
                                  markNotification:singleUpdateData.markNotification,
                                  priviousStatus:singleUpdateData.priviousStatus,
                                  taskSubmissionDate:
                                  singleUpdateData.taskSubmissionDate,
                                taskCompletionDate:
                                  singleUpdateData.taskCompletionDate,
                                })
                              : setPriorityValue(e.value)
                          }
                        />
                      </div>

                      <div className="mt-2">
                        <label
                          htmlFor="message"
                          className="block mb-2 text-[16px] font-medium text-gray-900 dark:text-black"
                        >
                          Close Time
                        </label>
                        <input
                          type="time"
                          name="time"
                          disabled={showFormData}
                          value={showUpdate ? singleUpdateData.time : null}
                          onChange={(e) => {
                            // eslint-disable-next-line no-unused-expressions
                            showUpdate
                              ? setSingleUpdateData({
                                  _id: singleUpdateData._id,
                                  deadlineDate: singleUpdateData.deadlineDate,
                                  remarks: singleUpdateData.remarks,
                                  startTime: singleUpdateData.startTime,
                                  taskPriority: singleUpdateData.taskPriority,
                                  time: e.target.value,
                                  task: singleUpdateData.task,
                                  pinTask: singleUpdateData.pinTask,
                                  status: singleUpdateData.status,
                                  markNotification:singleUpdateData.markNotification,
                                  priviousStatus:singleUpdateData.priviousStatus,
                                  taskSubmissionDate:
                                  singleUpdateData.taskSubmissionDate,
                                taskCompletionDate:
                                  singleUpdateData.taskCompletionDate,
                                })
                              : e.target.value;
                          }}
                          placeholder="Enter start time in 24 hour format e.g. 08:00PM"
                          className={`block p-2 w-full text-sm   text-gray-900 rounded-lg border border-gray-300 outline-none dark:placeholder-black dark:text-black ${
                            showFormData ? "bg-gray-100" : " bg-white"
                          }`}
                        ></input>
                      </div>
                      <div className="mt-2">
                        <label
                          htmlFor="message"
                          className="block mb-2 text-[16px] font-medium text-gray-900 dark:text-black"
                        >
                          Close Date
                        </label>
                        <input
                          type="date"
                          name="date"
                          disabled={showFormData}
                          value={
                            showUpdate ? singleUpdateData.deadlineDate : null
                          }
                          className={`block p-2 w-full text-sm text-gray-900 rounded-lg border border-gray-300 outline-none dark:placeholder-gray-400 dark:text-black ${
                            showFormData ? "bg-gray-100" : " bg-white"
                          }`}
                          onChange={(e) => {
                            if (formattedDate > e.target.value) {
                              swal({
                                title: "Not Possible!",
                                text: "Please select valid date",
                                icon: "warning",
                                button: "OK",
                              });
                              e.target.value = "";
                            } else {
                              // eslint-disable-next-line no-unused-expressions
                              showUpdate
                                ? setSingleUpdateData({
                                    _id: singleUpdateData._id,
                                    deadlineDate: e.target.value,
                                    remarks: singleUpdateData.remarks,
                                    startTime: singleUpdateData.startTime,
                                    taskPriority: singleUpdateData.taskPriority,
                                    time: singleUpdateData.time,
                                    task: singleUpdateData.task,
                                    pinTask: singleUpdateData.pinTask,
                                    status: singleUpdateData.status,
                                    markNotification:singleUpdateData.markNotification,
                                    priviousStatus:singleUpdateData.priviousStatus,
                                    taskSubmissionDate:
                                    singleUpdateData.taskSubmissionDate,
                                  taskCompletionDate:
                                    singleUpdateData.taskCompletionDate,
                                  })
                                : e.target.value;
                            }
                          }}
                        ></input>
                      </div>
                      <button className=" bg-[#d7888a] text-black text-[17px] mt-2 p-2 w-[50%] mx-auto rounded-md flex justify-center">
                        {showUpdate ? "Update" : "Save"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
        ) : null}
      </form>
      {notificationModal  ? (
        <NotificationModal
          setNotificationModal={setNotificationModal}
          countNotification={countNotification}
        ></NotificationModal>
      ) : (
        ""
      )}
    </>
  );
};

export default AddTask;
