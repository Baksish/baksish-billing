import React from "react";
import "./Loader.css";

const LoaderComponent = ({message = "Please Wait..."}:{message?:string}) => {
  return (
    <div className="flex-1 justify-center items-center mt-40">
      <div className="hourglassBackground">
        <div className="hourglassContainer">
          <div className="hourglassCurves"></div>
          <div className="hourglassCapTop"></div>
          <div className="hourglassGlassTop"></div>
          <div className="hourglassSand"></div>
          <div className="hourglassSandStream"></div>
          <div className="hourglassCapBottom"></div>
          <div className="hourglassGlass"></div>
        </div>
      </div>
      <p className="text-center">{message}</p>
    </div>
  );
};

export default LoaderComponent;
