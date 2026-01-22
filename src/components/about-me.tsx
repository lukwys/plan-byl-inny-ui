import Image from 'next/image'
import Link from 'next/link'

export const AboutMe = async () => {
  const data = await fetch('http://localhost:1337/api/about-me?populate=avatar')
  const { data: aboutMe } = await data.json()

  return (
    <div className='flex flex-col items-center'>
      <div className='relative w-[150] h-[150] mb-12'>
        <Image
          src={`http://127.0.0.1:1337${aboutMe.avatar.url}`}
          alt="Zdjęcie o mnie"
          className="object-cover object-center"
          priority
          sizes="100vw"
          fill
        />
      </div>
      <p className='font-dm-sans font-semibold mb-2.5'>{aboutMe.title}</p>
      <p className='text-center font-eb-garamond mb-2.5'>{aboutMe.bio}</p>
      <Link href='/about' className='text-main-red'>dowiedz się więcej →</Link>
    </div>
  )
}
