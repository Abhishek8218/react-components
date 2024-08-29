"use client";

import React, { useEffect, useState } from "react";
import ProductTour from "./productTour";
import ProductTourMobile from "./productTourMobile";
import Modal from "./PopupModel";

const ProfilePage: React.FC = () => {
  // Function to check if the device is mobile
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const useUserAgent = () => {
    const [userAgent, setUserAgent] = useState("");

    useEffect(() => {
      setUserAgent(navigator.userAgent);
    }, []);

    return userAgent;
  };

  const userAgent = useUserAgent();

  const isMobile = /Mobile|Android/i.test(userAgent);

  const [tourOpen, setTourOpen] = useState(false);

    const handleTourClose = () => {
        setTourOpen(false);
        setCurrentTarget("");
    };

  const steps = [
    {
      target: "#profile-header",
      title: "Profile Header",
      content: "This is profile header. profile header.This is your profile hea header.This is your profile header. profile header.This is your profile hea . profile header.This is your profile hea header.This is your profile header. profile header.This is your profile h",
      direction: 'right',
      audioUrl: 'step-1.mp3'
    },
    {
      target: "#profile-bio",
      title: "Bio Section",
      content: "This is your bio section.",
      direction: "bottom",
      audioUrl: 'step-2.mp3'
    },
    {
      target: "#profile-posts",
      title: "Posts Section",
      content: "This is where your posts are displayed.",
      direction: "top",
      audioUrl: 'step-3.mp3'
    },
    {
      target: "#profile-friends",
      title: "Friends Section",
      content: "This is your list of friends in the profile.",
      direction: "top",
      audioUrl: 'step-last.mp3'
    },
  ];

  const [currentTarget, setCurrentTarget] = useState<string>("");

  const handleTourStepChange = (target: string) => {
    setCurrentTarget(target);
  };

  useEffect(() => {
    // Start the tour after a 1-second delay
    const timer = setTimeout(() => {
     setIsModalOpen(true);
    }, 1000); // 1000 milliseconds = 1 second

    return () => clearTimeout(timer); // Clean up the timer if the component unmounts
  }, []);



  const startTour = () => {
    setTourOpen(true);
    setIsModalOpen(false);

  }
  
  return (
    <div className="p-4">
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
          id="profile-header"
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
        id="profile-bio"
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
    
      {isMobile ? (
        <div>
          <ProductTourMobile
            steps={steps}
            isOpen={tourOpen}
            onClose={handleTourClose}
            onStepChange={handleTourStepChange}
          />
        </div>
      ) : (
        <div>
          <ProductTour
            steps={steps}
            isOpen={tourOpen}
            onClose={handleTourClose}
            onStepChange={handleTourStepChange}
          />
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
