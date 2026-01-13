const StatusIndicator = ({ isOnline, right, color = "green" }) => {

    if (!isOnline) return;

    return (
        <span
            className={`absolute top-0 ${right ? 'right-0' : 'left-0'} 
            w-3 h-3 bg-${color}-500 rounded-full border z-50 border-gray-800 `
            }></span>
    );
};

export default StatusIndicator;
