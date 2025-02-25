import { useState } from "react";
import { FaChevronDown, FaMale, FaFemale, FaTransgenderAlt } from "react-icons/fa";

const genders = [
    { id: "male", label: "Male", icon: <FaMale className="text-blue-500" /> },
    { id: "female", label: "Female", icon: <FaFemale className="text-pink-500" /> },
    { id: "other", label: "Other", icon: <FaTransgenderAlt className="text-purple-500" /> },
];

const GenderSelect = ({ onSelect }) => {
    const [selectedGender, setSelectedGender] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (gender) => {
        setSelectedGender(gender);
        setIsOpen(false);
        if (onSelect) onSelect(gender.id);
    };

    return (
        <div className="relative w-full">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex justify-between items-center w-full px-4 py-2 rounded-lg 
                 bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-md hover:shadow-lg transition-all"
            >
                <span className="flex items-center gap-2">
                    {selectedGender ? (
                        <>
                            {selectedGender.icon}
                            {selectedGender.label}
                        </>
                    ) : (
                        "Select Gender"
                    )}
                </span>
                <FaChevronDown className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
                <ul className="absolute w-full mt-2 z-10 bg-white dark:bg-gray-800 border rounded-lg shadow-lg">
                    {genders.map((gender) => (
                        <li
                            key={gender.id}
                            onClick={() => handleSelect(gender)}
                            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition-all"
                        >
                            {gender.icon}
                            {gender.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default GenderSelect;
