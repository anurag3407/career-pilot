const DragHandle = () => {
  return (
    <div
      className="cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      // aria-label="Drag Handle"
    >
      <div className="grid grid-cols-2 gap-1">
        {[...Array(6)].map((_, index) => (
          <span
            key={index}
            className="w-1 h-1 bg-gray-500 rounded-full"
          ></span>
        ))}
      </div>
    </div>
  )
}

export default DragHandle