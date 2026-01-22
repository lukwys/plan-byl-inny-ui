import { Comment } from './comment'

export const Comments = () => {
  return (
    <div className="mt-6">
      <h2 className="font-dm-sans font-bold text-2xl">Komentarze</h2>
      <Comment />
      <Comment />
    </div>
  )
}