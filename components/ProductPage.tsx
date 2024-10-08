"use client";

import React, { useEffect, useState } from "react";
import Modal from "./PopupModel";
import { useTour } from "../context/tourContext";

const ProfilePage: React.FC = () => {
  

//useTour is a custom hook that we created to manage the tour state and steps. It provides the following methods and properties:
  const { setSteps, setIsOpen,currentTarget } = useTour();

//setSteps: A function to set the steps for the tour
//setIsOpen: A function to set the isOpen state to start or stop the tour
//currentTarget: The current target element for the tour to highlight the element


  
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false) ;//isModalOpen state to manage the visibility of the modal








//Each step object should have the following properties:


//target: The CSS selector of the target element
//title: The title of the step
//content: The content of the step
//direction: The direction of the tooltip
//audioUrl: The URL of the audio file to be played for the step

//Available Directions: top, top-right, right, bottom-right, bottom, bottom-left, left, top-left




//Define the steps for the tour
  const steps = [
    {
      target: "#profile-header",
      title: "Profile Header",
      content: "This is profile header. profile header.This is your profile hea header.This is your profile header. profile header.This is your profile hea . profile header.This is your profile hea header.This is your profile header. profile header.This is your profile h",
      direction: 'right',//direction of the tooltip
      audioUrl: 'step-1.mp3'
    },
    {
      target: "#profile-bio",
      title: "Bio Section",
      content: "This is your bio section.",
      direction: "bottom",//direction of the tooltip
      audioUrl: 'step-2.mp3'
    },
    {
      target: "#profile-posts",
      title: "Posts Section",
      content: "This is where your posts are displayed.",
      direction: "top-left",
      audioUrl: 'step-3.mp3'
    },
    {
      target: "#profile-friends",
      title: "Friends Section",
      content: "This is your list of friends in the profile.",
      direction: "top-left",
      audioUrl: 'step-last.mp3'
    },
  ];

//useEffect hook to start the tour after a 1-second delay
  useEffect(() => {
    // Start the tour after a 1-second delay
    const timer = setTimeout(() => {
     setIsModalOpen(true);
    }, 1000); // 1000 milliseconds = 1 second

    return () => clearTimeout(timer); // Clean up the timer if the component unmounts
  }, []);


//startTour function to start the tour
  const startTour = () => {


    setSteps(steps);//set the steps for the tour
    setIsOpen(true);//set the isOpen state to true to start the tour
    setIsModalOpen(false);//close the modal

  }
  


  return (
    <div className="p-4">

      {/* Modal Component */}
        <Modal  isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStartTour={() => {startTour()}}
        />
    

      {/* Profile Header */}
      <div
       
        className={` bg-gray-800 text-white p-4 flex items-center mb-4 ${
          currentTarget === "#profile-heade"
            ? "border-4 border-green-500 relative z-[50] "
            : ""
        }`}
      >
        <img
          src="/profile-pic.png" // Replace with actual image path
          alt="Profile"
          id="profile-header"//id of the target element
          className={`w-16 h-16 rounded-full mr-4 ${
            currentTarget === "#profile-header"
              ? "border-4 border-green-500 relative z-[50] "
              : ""
          }`}
        />
        <div>
          <h1 className="text-2xl font-bold">John Doe</h1>
          <p className="text-sm">@johndoe</p>
        </div>
      </div>

      {/* Profile Bio */}
      <div
        id="profile-bio"//id of the target element
        className={`p-4 bg-white shadow-md mb-4 ${
          currentTarget === "#profile-bio"
            ? "border-4 border-green-500 relative z-[50] "
            : ""
        }`}
      >
        <h2 className="text-xl font-semibold mb-2">Bio</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
          imperdiet, nulla nec pharetra egestas, felis est ultrices metus, non
          bibendum eros nulla id dui.
        </p>
      </div>

      {/* Profile Posts */}
      <div className={`p-4 bg-white shadow-md mb-4 `}>
        <h2 className="text-xl font-semibold mb-2">Posts</h2>
        <div className="space-y-4">
          {[1, 2, 3].map(
            (post) => (
              console.log(post),
              (
                <div
                  key={post}
                  id={post === 1 ? "profile-posts" : ""}
                  className={`border p-4 rounded-lg ${
                    post === 1 && currentTarget === "#profile-posts"
                      ? "border-4 border-green-500 relative z-[50] bg-white "
                      : ""
                  }`}
                >
                  <h3 className="text-lg font-semibold">Post Title {post}</h3>
                  <p>
                    This is a sample post content. Lorem ipsum dolor sit amet,
                    consectetur adipiscing elit. Sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua.
                  </p>
                </div>
              )
            )
          )}
        </div>
      </div>

      {/* Profile Friends */}
      <div
        id="profile-friends"
        className={`p-4 bg-white shadow-md ${
          currentTarget === "#profile-friends"
            ? "border-4 border-green-500 relative z-[50] "
            : ""
        }`}
      >
        <h2 className="text-xl font-semibold mb-2">Friends</h2>
        <ul className="list-disc pl-5">
          <li>Friend 1</li>
          <li>Friend 2</li>
          <li>Friend 3</li>
        </ul>
      </div>

      {/* Product Tour Component */}
    

    </div>
  );
};

export default ProfilePage;