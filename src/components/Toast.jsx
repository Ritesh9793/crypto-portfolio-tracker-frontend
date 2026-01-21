export default function Toast({ message, type, onClose }) {
  return (
    <div
      className={`
        fixed top-6 right-6 z-50
        px-5 py-4 rounded-xl shadow-xl
        text-white font-medium
        animate-slide-in
        ${type === "SUCCESS" ? "bg-green-600" :
          type === "WARNING" ? "bg-red-600" :
          "bg-blue-600"}
      `}
      onClick={onClose}
    >
      {message}
    </div>
  );
}
