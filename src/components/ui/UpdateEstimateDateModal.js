
const UpdateEstimateDateModal = ({setUpdateEstimateDate,singleItem,handleUpdateTaskDate,setSingleItem}) => {
    console.log(singleItem)
  return (
    <>
    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
      <div className="relative sm:w-[60%] md:w-[60%] lg:w-[60%] xl:w-[70%] 2xl:w-[70%] my-6 mx-auto ">
        {/*content*/}
        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
          {/*header*/}
          <div className=" ">
            <span
              className="text-red-800 rounded-full p-1 text-3xl"
              onClick={() => setUpdateEstimateDate(false)}
            >
              ×
            </span>
          </div>

          <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
            <h3 className="text-3xl font-semibold">Update Task</h3>
            <button
              className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
              onClick={() => setUpdateEstimateDate(false)}
            >
              <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                ×
              </span>
            </button>
          </div>
          {/*body*/}
          <div className="relative p-10 flex-auto">
            <form action="" onSubmit={handleUpdateTaskDate}>
              <div className="flex justify-center">
                <input
                  type="text"
                  className="border"
                  name="name"
                  value={singleItem?.task}
                  onChange={(e) => {
                    setSingleItem({
                      _id: singleItem._id,
                      task: e.target.value,
                      status: singleItem.status,
                      priviousStatus:singleItem.priviousStatus,
                      markNotification:singleItem.markNotification,
                      time:singleItem.time,
                      deadlineDate:singleItem.deadlineDate,
                      startDate:singleItem.startDate,
                      pinTask: singleItem.pinTask,
                      remarks: singleItem.remarks,
                      taskPriority: singleItem.taskPriority,
                      taskSubmissionDate: singleItem.taskSubmissionDate,
                      taskCompletionDate: singleItem.taskCompletionDate,
                    });
                  }}
                  style={{
                    border: "1px solid green",
                    padding: "5px",
                    width: "100%",
                  }}
                />
                <input
                  type="time"
                  className="border"
                  name="time"
                  value={singleItem?.time}
                  onChange={(e) => {
                    setSingleItem({
                      _id: singleItem._id,
                      task: singleItem.task,
                      status: singleItem.status,
                      priviousStatus:singleItem.priviousStatus,
                      markNotification:singleItem.markNotification,
                      time:e.target.value,
                      deadlineDate:singleItem.deadlineDate,
                      startDate:singleItem.startDate,
                      pinTask: singleItem.pinTask,
                      remarks: singleItem.remarks,
                      taskPriority: singleItem.taskPriority,
                      taskSubmissionDate: singleItem.taskSubmissionDate,
                      taskCompletionDate: singleItem.taskCompletionDate,
                    });
                  }}
                  style={{
                    border: "1px solid green",
                    padding: "5px",
                    width: "100%",
                  }}
                />
                <input
                  type="date"
                  className="border"
                  name="date"
                  value={singleItem?.deadlineDate}
                  onChange={(e) => {
                    setSingleItem({
                      _id: singleItem._id,
                      task: singleItem.task,
                      status: singleItem.status,
                      priviousStatus:singleItem.priviousStatus,
                      markNotification:singleItem.markNotification,
                      time:singleItem.time,
                      deadlineDate:e.target.value,
                      startDate:singleItem.formattedDate,
                      pinTask: singleItem.pinTask,
                      remarks: singleItem.remarks,
                      taskPriority: singleItem.taskPriority,
                      taskSubmissionDate: singleItem.taskSubmissionDate,
                      taskCompletionDate: singleItem.taskCompletionDate,
                    });
                  }}
                  style={{
                    border: "1px solid green",
                    padding: "5px",
                    width: "100%",
                  }}
                />
                <button className="btn bg-indigo-600 text-white ml-2 p-2">
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
  </>
  )
}

export default UpdateEstimateDateModal
