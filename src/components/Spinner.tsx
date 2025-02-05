const Spinner = ({
  className = "w-7 aspect-square",
}: {
  className?: string;
}) => {
  return (
    <div
      className={`border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin ${className}`}
    ></div>
  );
};

export default Spinner;
