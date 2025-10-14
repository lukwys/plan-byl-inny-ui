import { AboutMe } from "@/components/about-me"
import ReactMarkdown from "react-markdown"
import Image from 'next/image'
import qs from "qs"

type Params = { slug: string }

export default async function PostPage({ params }: { params: Params }) {
  const query = qs.stringify(
    {
      filters: {
        slug: {
          $eq: params.slug,
        },
      },
      populate: {
        cover_image: true,
        content_blocks: {
          on: {
            "content.gallery": {
              populate: {
                image_gallery: true,
              },
            },
            "content.paragraph-md": true,
          },
        },
      },
    },
    {
      encodeValuesOnly: true
    }
  );

const res = await fetch(
  `http://localhost:1337/api/posts?${query}`
);
  const { data } = await res.json()
  const post = data[0]

  console.log(post)

  return (
    <div>
      <div className="relative w-full h-[600px]">
      <Image
        src={`http://127.0.0.1:1337${post.cover_image.url}`}
        alt={post.title}
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <h1 className="text-white text-4xl font-bold">{post.title}</h1>
      </div>
    </div>
      <div className='container grid grid-cols-12 py-10 mx-auto'>
        <div className='col-span-8'>
          <article className='markdown'>
          {post.content_blocks.map(block => {
            switch (block.__component) {
              case "content.paragraph-md":
                return (
                  <div key={block.id} className="prose max-w-none">
                    <ReactMarkdown>
                      {block.paragraph}
                    </ReactMarkdown>
                  </div>
                );
        
              case "content.gallery":
                return (
                  <div
                    key={block.id}
                    className={`my-6 grid gap-4 ${
                      block.cols === "three"
                        ? "grid-cols-1 sm:grid-cols-3"
                        : block.cols === "one"
                        ? "grid-cols-1"
                        : "grid-cols-1 sm:grid-cols-2"
                    }`}
                  >
                    {block.image_gallery?.map((img: any) => (
                      <Image
                        key={img.id}
                        src={`http://127.0.0.1:1337${img.url}`}
                        alt={img.alternativeText ?? ""}
                        width={img.width}
                        height={img.height}
                        className="w-full h-auto rounded-xl"
                      />
                    ))}
                  </div>
                );
        
              default:
                return null;
            }
          })}
          </article>
        </div>
        <div className='col-start-10 col-span-3'>
          <AboutMe />
        </div>
      </div>
    </div>
  )
}
