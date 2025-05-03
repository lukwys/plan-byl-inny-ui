import { AboutMe } from "@/components/about-me";
import Image from 'next/image'

export default async function Home() {
  const data = await fetch('http://localhost:1337/api/homepage?populate=baner')
  const { data: homepage } = await data.json()

  return (
    <div>
      <div className='relative w-full h-[350]'>
        <Image
          src={`http://127.0.0.1:1337${homepage.baner.url}`}
          alt="Zdjęcie o mnie"
          fill
        />
      </div>
      <div className='grid grid-cols-12 py-10'>
        <div className='col-start-2 col-span-6'>Content</div>
        <div className='col-start-9 col-span-3'>
          <AboutMe />
        </div>
      </div>
    </div>
  );
}
