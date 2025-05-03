export const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <div className='grid grid-cols-12 py-10 bg-[#940315] text-white'>
      <div className='col-start-2 col-span-10'>
        <span>© {year} WysoccyDesigns, All Rights Reserved</span>
      </div>
    </div>
  )
}
