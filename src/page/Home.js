import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleRight } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";

import { useSelector } from "react-redux";
import { fetchUserInfo, fetchUserInfoDetails, fetchUserInfoPost } from './../redux/user/userSlice';

export default function Home() {
  const [feature1, setFeature1] = useState(false);
  const [feature2, setFeature2] = useState(false);
  const [feature3, setFeature3] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.userView.data);
  console.log(userInfo);
  const previousUser = useSelector((state) => state.userView.previousUser);
  console.log(Object.keys(previousUser).length);
const previousUserAllData= [previousUser]
console.log(previousUserAllData.length)
  useEffect(() => {
    dispatch(fetchUserInfo());
    dispatch(fetchUserInfoDetails());
    sessionStorage.setItem("userInfo", userInfo.ip);
  }, [dispatch, userInfo.ip]);

  return (
    <div
      className="flex items-center justify-center h-screen bg-[#F3F4FA]"
      style={{
        backgroundImage:
          "linear-gradient(to #F3F4FA, #D5D5D5, #F3F4FA, #D5D5D5, #F3F4FA, #D5D5D5, #F3F4FA, #D5D5D5) ",
      }}
    >
      <div className="lg:w-[70%] md:w-[70%] sm:w-[70%] xl:w-[70%] 2xl:w-[70%] p-6 shadow-2xl rounded">
        <div className="flex justify-between">
          <h2 className="sm:text-[24px] md:text-[32px] lg:text-[24px] text-black font-bold mb-2">
            Project Details
          </h2>

          <h2 className="sm:text-[24px] md:text-[32px] lg:text-[24px] text-black font-bold mb-2">
            Total Visited: {previousUserAllData.length}
          </h2>

          <h2
            className="sm:text-[24px] md:text-[32px] lg:text-[24px] text-black font-bold mb-2"
            onClick={() => {
              if (previousUser.length > 0 && previousUser.length != undefined) {
                const existing = previousUser?.filter(
                  (user) => user.ip == userInfo.ip
                );
                console.log(existing);
                if (existing) {
                  console.log("alraedy visit");
                } else {
                  dispatch(fetchUserInfoPost(userInfo));
                }
              } else {
                dispatch(fetchUserInfoPost(userInfo));
              }

              navigate("/project");
            }}
          >
            View Project
            <FontAwesomeIcon icon={faArrowAltCircleRight}></FontAwesomeIcon>
          </h2>
        </div>

        <div className="join join-vertical w-full">
          <div
            className="collapse collapse-arrow join-item border border-base-300  bg-gray-200"
            onClick={() => {
              setFeature1(!feature1);
              setFeature2(false);
              setFeature3(false);
            }}
          >
            <input type="radio" name="my-accordion-4" checked={feature1} />
            <div className="collapse-title text-[16px] font-medium text-black">
              User Interface (UI)
            </div>
            <div className="collapse-content">
              <ul className="list-disc px-4">
                <li className="text-black">
                  <strong>Task Input Form: </strong> Add task form where users
                  can input new tasks. Include fields for task name, due date,
                  priority, and any other relevant information.
                </li>
                <li className="text-black">
                  <strong>Task List Display:</strong> Show users a list of their
                  tasks. This could task show by categories.
                </li>
              </ul>
            </div>
          </div>
          <div
            className="collapse collapse-arrow join-item border border-base-300 bg-gray-200"
            onClick={() => {
              setFeature2(!feature2);
              setFeature1(false);
              setFeature3(false);
            }}
          >
            <input type="radio" name="my-accordion-4" checked={feature2} />
            <div className="collapse-title text-[16px] font-medium text-black">
              Task Management
            </div>
            <div className="collapse-content">
              <ul className="list-disc px-4">
                <li className="text-black">
                  <strong>Add Task:</strong> Implement functionality to add new
                  tasks to the list.
                </li>
                <li className="text-black">
                  <strong>Edit Task:</strong> Allow users to modify task details
                  such as name, due date, and priority.
                </li>
                <li className="text-black">
                  <strong>Delete Task:</strong> Enable users to remove completed
                  or unnecessary tasks.
                </li>
              </ul>
            </div>
          </div>
          <div
            className="collapse collapse-arrow join-item border border-base-300 bg-gray-200"
            onClick={() => {
              setFeature3(!feature3);
              setFeature1(false);
              setFeature2(false);
            }}
          >
            <input type="radio" name="my-accordion-4" checked={feature3} />
            <div className="collapse-title text-[16px] font-medium text-black">
              Notification System
            </div>
            <div className="collapse-content">
              <p className="text-black">
                Implement a system to remind users of upcoming tasks or
                deadlines. This could include before finish date, if anyone need
                to change task finish date they can change increase task finish
                date.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
