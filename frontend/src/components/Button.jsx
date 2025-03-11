
const colorSchema = {
  green: {
    bgColor: "bg-green-500 hover:bg-green-600",
    bgDisabled: "bg-green-900 hover:bg-green-900",
    shadow: "shadow-[0_4px_0_#15803d]"
  },
  red: {
    bgColor: "bg-red-600 hover:bg-red-700",
    bgDisabled: "bg-red-900 hover:bg-red-900",
    shadow: "shadow-[0_4px_0_#991b1b]"
  },
  orange: {
    bgColor: "bg-orange-500 hover:bg-orange-600",
    bgDisabled: "bg-orange-900 hover:bg-orange-900",
    shadow: "shadow-[0_4px_0_#c2410c]"
  },
  blue: {
    bgColor: "bg-blue-500 hover:bg-blue-600",
    bgDisabled: "bg-blue-900 hover:bg-blue-900",
    shadow: "shadow-[0_4px_0_#1d4ed8]"
  },
  purple: {
    bgColor: "bg-purple-500 hover:bg-purple-600",
    bgDisabled: "bg-purple-900 hover:bg-purple-900",
    shadow: "shadow-[0_4px_0_#7e22ce]"
  },
  gray :{
    bgColor: "bg-gray-800 hover:bg-gray-700",
    bgDisabled: "bg-purple-900 hover:bg-purple-900",
    shadow: "shadow-[0_4px_0_#374151]"
  }
}

const Button = ({ text, type, handleOnClick, className, disabled = false, noScale = false, color = "green", width }) => {

  // Dynamic Color based on the color prop
  const choosedColor = colorSchema[color];

  return (
    <button type={type ? type : "button"} onClick={handleOnClick}
      className={` p-1 py-2 rounded-lg text-lg font-bold ${choosedColor.shadow}
        ${width ? width : "w-full"}
        active:translate-y-1 active:shadow-none transition-all duration-300 text-white
        transform ${disabled ? choosedColor.bgDisabled : `${choosedColor.bgColor} ${!noScale && "hover:scale-105"}`}
        ${className}`}
      >
      {text}
    </button>
  )
}


export default Button;
