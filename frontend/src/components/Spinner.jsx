import React from "react";

const Spinner = ({ size = 30, color = "#6bff71" }) => {
  return (
    <div className="flex justify-center items-center h-fit">
      <div
        className="animate-spin ease-in-out rounded-full border-4 border-t-transparent"
        style={{
          width: size,
          height: size,
          borderColor: color,
          borderTopColor: "transparent",
        }}
      />
    </div>
  );
}

export default Spinner;