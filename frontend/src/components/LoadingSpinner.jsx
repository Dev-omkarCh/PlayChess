const LoadingSpinner = ({ size = 8 }) => {
  return (
    <div className="flex justify-center items-center">
        <div className={`animate-spin rounded-full border-b-4 border-green-600`}
        style={{ height: size, width: size }}></div>
    </div>
  );
};

export default LoadingSpinner;
