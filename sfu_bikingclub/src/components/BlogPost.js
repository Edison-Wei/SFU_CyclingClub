import { month } from "./DateTimeFormat";

export default function BlogPost({ post }) {
  const datePosted = new Date(post.datePosted);

  return (
    <div className="w-72 h-96 m-4 flex flex-col rounded-sm bg-white shadow-md transition-shadow duration-600 ease-in-out hover:shadow-xl overflow-hidden hover:border border-red-400">
      <a href={`/blog/${post._id}`} className="flex flex-col h-full">
        {post.image ? (
          <>
            <div
              className="h-2/5 bg-cover bg-center"
              style={{ backgroundImage: `url(${post.image})` }}
            ></div>
          </>
        ): (
          <></>
        )}
          <div className={` ${post.image? 'h-3/5' : 'h-full'} p-4 flex flex-col gap-4`}>
            <h1 className="text-xl font-bold">{post.title}</h1>
            <p className="h-full flex overflow-y-hidden text-sm text-gray-700">{post.desc}</p>
            <div className="flex justify-between text-gray-500">
              <p className="text-sm font-semibold">{post.authorName}</p>
              <p className="text-xs">{`Posted: ${month(datePosted.getMonth())} ${datePosted.getDate()}, ${datePosted.getFullYear()}`}</p>
            </div>
          </div>
      </a>
    </div>
  );
}