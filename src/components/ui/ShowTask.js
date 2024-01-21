/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect } from "react";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import UpdateTakModal from "../ui/UpdateTakModal";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useDispatch } from "react-redux";
import {
  fetchTaskById,
  fetchTasks,
  fetchUpdateTasks,
  taskMove,
} from "../../redux/boards/boardSlice";
import { useSelector } from "react-redux";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import "./Showtask.css";
import swal from "sweetalert";



const ShowTask = ({
  setShowModal,
  setShowUpdate,
  setShowFormData,
  deleteTaskModal,
  setDeleteTaskModal,
  columnName,
  setColumnName,
}) => {
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const [startDate, setStartDate] = useState(new Date());
  const [filteredDropData, setFilteredDropData] = useState([]);
  const [pinTaskData, setPinTaskData] = useState([]);
  const [previousStatusData,setPreviousStatusData] = useState('');

  const tasks = useSelector((state) => state.boardview);
  const columns = tasks;

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

  useEffect(() => {
    const mergeResult = [].concat(
      tasks.toDo.items,
      tasks.inProgress.items,
      tasks.unitTest.items,
      tasks.qualityAssurance.items,
      tasks.completed.items
    );
    setData(mergeResult);
  }, [
    tasks.toDo.items,
    tasks.inProgress.items,
    tasks.unitTest.items,
    tasks.qualityAssurance.items,
    tasks.completed.items,
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchTasks());
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };
    fetchData();
  }, [dispatch]);

  const onDragStart = async (start) => {
   const {source}=start
    const filterSourceData = await data.filter(
      (item) => item._id == start.draggableId
    );
    setPreviousStatusData(source.droppableId)
    setFilteredDropData([{...filterSourceData[0]}]);
      
  };

  const onDragEnd = async(result) => {
    if (!result.destination) return;
  await  dispatch(taskMove(result));
  await  dispatch(fetchUpdateTasks(filteredDropData));
  // setCountNotification(filteredDropData)
  };

  const onDragUpdate = (updateDestination) => {
    const { destination } = updateDestination;
    const starttimeString = filteredDropData[0]?.startTime;
    const now = new Date().getTime();
    const finishTaskcalculate = new Date(starttimeString).getTime();
    const finishtask = now - finishTaskcalculate;
    const finishDays = Math.floor(finishtask / (1000 * 60 * 60 * 24));
    if (destination != null) {
      setFilteredDropData((prevState) => {
        return prevState.map((item) => ({
          ...item,
          status: destination.droppableId,
          priviousStatus: previousStatusData,
          taskSubmissionDate: formattedDate,
          taskCompletionDate: finishDays,
          markNotification: "",
        }));
      });
    }
  };

  const handlePinTask = () => {
    const filterTaskTodo = tasks.toDo.items.filter(
      (x) => x.pinTask == "pinned" && x.status == pinTaskData.status
    );
    const filterTaskInprogress = tasks?.inProgress?.items.filter(
      (x) => x.pinTask == "pinned" && x.status == pinTaskData.status
    );
    const filterTaskUnittest = tasks?.unitTest?.items.filter(
      (x) => x.pinTask == "pinned" && x.status == pinTaskData.status
    );
    const filterTaskQualityAssurance = tasks?.qualityAssurance?.items.filter(
      (x) => x.pinTask == "pinned" && x.status == pinTaskData.status
    );
    const filterTaskDone = tasks?.completed?.items.filter(
      (x) => x.pinTask == "pinned" && x.status == pinTaskData.status
    );

    if (
      filterTaskTodo.length > 0 ||
      filterTaskInprogress.length > 0 ||
      filterTaskUnittest.length > 0 ||
      filterTaskQualityAssurance.length > 0 ||
      filterTaskDone.length > 0
    ) {
      swal({
        title: "Not Possible!",
        text: "You can not pin two task at a time",
        icon: "warning",
        dangerMode: true,
      });
    } else {
      dispatch(fetchTaskById(pinTaskData));
      swal("Task pined successfully", "success");
    }
  };

  const handleRemovePinTask = async () => {
    await dispatch(fetchTaskById(pinTaskData));
    swal("Task unpined successfully", "success");
  };

  return (
    <div
      style={{ display: "flex", justifyContent: "center", overflowX: "auto" }}
    >
      <DragDropContext
        onDragStart={(result) => onDragStart(result)}
        onDragUpdate={(result) => onDragUpdate(result)}
        onDragEnd={(result) => onDragEnd(result, columns)}
      >
        {Object.entries(columns)?.map(([columnId]) => {
          const column = columns[columnId];
          return (
            // <div c lassName="flex">
            <div
              className="md:w-[250px] lg:w-[250px] xl:w-[250px] 2xl:md:w-[350px] border-gray-300  p-2 bg-[#F8F9FA] ml-4 mt-2 relative sm:h-[400px] md:h-[380px] lg:h-[500px] xl:h-[500px] 2xl:h-[815px]"
              style={{
                border: "1px solid #d1d5db",
              }}
            >
              <div key={columnId}>
                <div className="flex justify-between items-center">
                  <h2 className="mb-2 text-black text-center font-bold  text-[18px]">
                    {column?.name}
                  </h2>

                  <div className="dropdown dropdown-bottom mb-2">
                    <div
                      tabindex="0"
                      role="button"
                      className=" m-1 text-[20px]"
                    >
                      ...
                    </div>
                    <ul
                      tabindex="0"
                      className="dropdown-content z-[1] left-[-115px] menu p-2 shadow text-black bg-gray-100 rounded-box "
                    >
                      {column.name == "In Progress" ||
                      column.name == "Unit Test" ||
                      column.name == "Quality Assurance" ||
                      column.name == "Completed" ? (
                        ""
                      ) : (
                        <li
                          className="border-b"
                          onClick={() => {
                            setShowModal(true);
                            setShowUpdate(false);
                            setShowFormData(false);
                          }}
                        >
                          <a>Add Task</a>
                        </li>
                      )}

                      <li
                        className="border-b"
                        onClick={() => {
                          setShowModal(true);
                          setShowUpdate(true);
                          setColumnName(column.name);
                        }}
                      >
                        <a>Update Task</a>
                      </li>

                      <li
                        className="border-b"
                        onClick={() => {
                          setDeleteTaskModal(true);
                          setColumnName(column.name);
                        }}
                      >
                        <a>Delete Task</a>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className=" bg-white shadow-xl">
                  {column?.items?.map((item) => {
                    return (
                      <div>
                        {item.pinTask == "pinned" ? (
                          <div className="border-2 p-2 border-red-500 mb-4">
                            <div className={`flex justify-between relative`}>
                              {item.pinTask !== "" &&
                              item.pinTask == "pinned" ? (
                                <FontAwesomeIcon
                                  icon={faStar}
                                  className="text-[20px] text-green-600 absolute top-[-19px]"
                                ></FontAwesomeIcon>
                              ) : (
                                ""
                              )}
                              <div>
                                <div>
                                  <p className="text-black text-[15px]">
                                    {item?.task}
                                  </p>
                                  <p className="text-black text-[15px]">
                                    Close Time:
                                    <b>{item?.time}</b>
                                  </p>
                                  <p className="text-black text-[15px]">
                                    Close Date:
                                    <b>{item?.deadlineDate}</b>
                                  </p>
                                </div>
                                <div className="dropdown ">
                                  <button
                                    className=" text-white text-[15px] font-bold border px-1 bg-orange-400"
                                    onClick={() => {
                                      setPinTaskData({
                                        _id: item._id,
                                        deadlineDate: item.deadlineDate,
                                        remarks: item.remarks,
                                        startTime: item.startTime,
                                        taskPriority: item.taskPriority,
                                        time: item.time,
                                        task: item.task,
                                        pinTask: " ",
                                        status: item.status,
                                        markNotification: item.markNotification,
                                        priviousStatus: item.status,
                                        taskSubmissionDate:
                                          item.taskSubmissionDate,
                                        taskCompletionDate:
                                          item.taskCompletionDate,
                                      });
                                    }}
                                  >
                                    Action
                                  </button>
                                  <div className="dropdown-content z-[1] menu p-2 shadow text-black bg-gray-100 rounded-box w-36 text-center">
                                
                                    <a
                                    href="#"
                                      className="text-black"
                                      onClick={() => {
                                        handleRemovePinTask();
                                      }}
                                    >
                                      Remove Pin Task
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    );
                  })}
                </div>

                <Droppable droppableId={columnId}>
                  {(provided, snapshot) => {
                    return (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{
                          background: snapshot.isDraggingOver
                            ? "lightblue"
                            : "#F8F9FA",
                          padding: 4,
                        }}
                        className="scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thumb-slate-500 scrollbar-track-slate-300  overflow-y-scroll w-full sm:h-[250px] md:h-[150px] lg:h-[280px] xl:h-[280px] 2xl:h-[630px]"
                      >
                        {column?.items?.map((item, index) => {
                          const dateString = item?.deadlineDate;
                          const timeString = item?.time;
                          const starttimeString = item?.startTime;
                          const now = new Date().getTime();

                          const futureDate = new Date(
                            dateString + " " + timeString
                          ).getTime();
                          const finishTaskcalculate = new Date(
                            starttimeString
                          ).getTime();

                          const finishtask = now - finishTaskcalculate;

                          const finishDays = Math.floor(
                            finishtask / (1000 * 60 * 60 * 24)
                          );

                          const timeleft = futureDate - now;
                          const days = Math.floor(
                            timeleft / (1000 * 60 * 60 * 24)
                          );
                          const hours = Math.floor(
                            (timeleft % (1000 * 60 * 60 * 24)) /
                              (1000 * 60 * 60)
                          );
                          const minutes = Math.floor(
                            (timeleft % (1000 * 60 * 60)) / (1000 * 60)
                          );

                          return (
                            <Draggable
                              key={item._id}
                              draggableId={item._id}
                              index={index}
                            >
                              {(provided, snapshot) => {
                                return (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    {item.pinTask == "pinned" ? (
                                      ""
                                    ) : (
                                      <ul
                                        className={`mb-6 px-2 pb-2 bg-white shadow-xl rounded-md`}
                                        style={{ border: "1px solid #d1d5db" }}
                                      >
                                        <>
                                          <div
                                            className={`flex justify-between items-center shadow-sm mb-1`}
                                          >
                                            <div className="dropdown">
                                              <button
                                                className=" text-black text-[20px] font-bold"
                                                onClick={() => {
                                                  if (
                                                    item.pinTask == "pinned"
                                                  ) {
                                                    setPinTaskData({
                                                      _id: item._id,
                                                      deadlineDate:
                                                        item.deadlineDate,
                                                      remarks: item.remarks,
                                                      startTime: item.startTime,
                                                      taskPriority:
                                                        item.taskPriority,
                                                      time: item.time,
                                                      task: item.task,
                                                      pinTask: " ",
                                                      status: item.status,
                                                      markNotification:
                                                        item.markNotification,
                                                      priviousStatus:
                                                        item.status,
                                                      taskSubmissionDate:
                                                        item.taskSubmissionDate,
                                                      taskCompletionDate:
                                                        item.taskCompletionDate,
                                                    });
                                                  } else {
                                                    setPinTaskData({
                                                      _id: item._id,
                                                      deadlineDate:
                                                        item.deadlineDate,
                                                      remarks: item.remarks,
                                                      startTime: item.startTime,
                                                      taskPriority:
                                                        item.taskPriority,
                                                      time: item.time,
                                                      task: item.task,
                                                      pinTask: "pinned",
                                                      status: item.status,
                                                      markNotification:
                                                        item.markNotification,
                                                      priviousStatus:
                                                        item.status,
                                                      taskSubmissionDate:
                                                        item.taskSubmissionDate,
                                                      taskCompletionDate:
                                                        item.taskCompletionDate,
                                                    });
                                                  }
                                                }}
                                              >
                                                ...
                                              </button>
                                              <div className="dropdown-content z-[1] menu p-2 shadow text-black bg-gray-100 rounded-box w-36 text-center">
                                                {item.pinTask == "pinned" ? (
                                                  <a
                                                    href="#"
                                                    className="text-black"
                                                    onClick={() => {
                                                      handleRemovePinTask();
                                                    }}
                                                  >
                                                    Remove Pin Task
                                                  </a>
                                                ) : (
                                                  <a
                                                    href="#"
                                                    className="text-black"
                                                    onClick={() => {
                                                      handlePinTask();
                                                    }}
                                                  >
                                                    Pin Task
                                                  </a>
                                                )}
                                              </div>
                                            </div>
                                            {item.taskPriority !== "" &&
                                            item.taskPriority == "high" ? (
                                              <div className="w-4 h-4 rounded-full bg-red-500"></div>
                                            ) : (
                                              ""
                                            )}
                                            {item.taskPriority !== "" &&
                                            item.taskPriority == "low" ? (
                                              <div className="w-4 h-4 rounded-full bg-green-500"></div>
                                            ) : (
                                              ""
                                            )}
                                            {item.taskPriority !== "" &&
                                            item.taskPriority == "medium" ? (
                                              <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                                            ) : (
                                              ""
                                            )}
                                          </div>

                                          <li className="text-black text-[15px]">
                                            {item?.task}
                                          </li>
                                          <p className="text-black text-[15px]">
                                            Close Time:{" "}
                                            <b className="text-[15px]">
                                              {item?.time}
                                            </b>
                                          </p>
                                          <p className="text-black text-[15px]">
                                            Close Date:{" "}
                                            <b className="text-[15px]">
                                              {item?.deadlineDate}
                                            </b>
                                          </p>
                                          {item.status == "completed" ? (
                                            <>
                                              <p className="text-black text-[15px]">
                                                Task Complete Time:
                                                <strong>
                                                  {item.taskCompletionDate} days
                                                </strong>
                                              </p>
                                            </>
                                          ) : (
                                            <>
                                              {days <= 2 && days > 0 ? (
                                                <p className="text-red-500 text-[15px]">
                                                  <b>
                                                    Remaining Time: {days} days
                                                    {hours} hours {minutes}{" "}
                                                    minutes
                                                  </b>
                                                </p>
                                              ) : days < 0 ? (
                                                <p className="text-black text-[15px]">
                                                  Remaining Time:
                                                  <b className=" text-red-600">
                                                    {/* {days} days {hours} hours{" "}
                                                {minutes} minutes  */}
                                                    off
                                                  </b>
                                                </p>
                                              ) : (
                                                <p className="text-black">
                                                  Remaining Time:
                                                  <b className="text-[15px]">
                                                    {days} days {hours} hours{" "}
                                                    {minutes} minutes
                                                  </b>
                                                </p>
                                              )}
                                            </>
                                          )}
                                        </>
                                      </ul>
                                    )}
                                  </div>
                                );
                              }}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    );
                  }}
                </Droppable>
              </div>
              {deleteTaskModal ? (
                <UpdateTakModal
                  setDeleteTaskModal={setDeleteTaskModal}
                  columnName={columnName}
                ></UpdateTakModal>
              ) : null}
            </div>
          );
        })}
      </DragDropContext>
    </div>
  );
};

export default ShowTask;
