import Image from 'next/image'

const AboutMe = async () => {
  const data = await fetch('http://localhost:1337/api/about-me?populate=*')
  const { data: aboutMe } = await data.json()

  return (
    <div>
      <div className='relative w-full h-[350]'>
        <h1 className='absolute w-full text-white font-dm-sans font-semibold text-6xl text-center top-2/4 -translate-y-1/2 z-10'>O mnie</h1>
        <Image
          src={`http://127.0.0.1:1337${aboutMe.header_image.url}`}
          alt="Zdjęcie o mnie"
          className="object-cover object-center"
          priority
          sizes="100vw"
          fill
        />
      </div>
      <div className='grid grid-cols-12 py-10 max-w-7xl mx-auto'>
        <div className='col-start-2 col-span-5'>
          <p className='font-dm-sans font-semibold mb-2.5'>{aboutMe.title}</p>
          <p className='font-eb-garamond mb-2.5'>{aboutMe.bio}</p>
        </div>
        <div className='col-start-8 col-span-3'>
          <div className='relative w-[500] h-[500] mb-12'>
            <Image
              src={`http://127.0.0.1:1337${aboutMe.avatar.url}`}
              alt="Zdjęcie o mnie"
              className="object-cover object-center"
              priority
              sizes="100vw"
              fill
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutMe
