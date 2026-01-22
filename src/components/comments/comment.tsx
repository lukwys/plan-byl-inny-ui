export const Comment = () => {
  return (
    <div className="flex my-4 w-full gap-10 font-dm-sans">
      <div className="w-20 h-20 bg-amber-700 rounded-full shrink-0" />
      <div className="flex flex-1 justify-between">
        <div>
          <div className="text-main-red ">Gall Annonim</div>
          <div>Komentarz</div>
        </div>
        <div className="text-gray text-[10px]">18:30, 12 marca 2025</div>
      </div>
    </div>
  )
}