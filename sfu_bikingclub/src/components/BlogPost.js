export default function BlogPost({ post }) {
  return (
    <div className="w-72 h-96 m-4 flex flex-col bg-white shadow-md transition-shadow duration-300 ease-in-out hover:shadow-lg overflow-hidden">
      <a href={`/blog/${post._id}`} className="flex flex-col h-full">
        {post.image ? (
          <>
            <div
              className="h-1/2 bg-cover bg-center"
              style={{ backgroundImage: `url(${post.image})` }}
            ></div>
            <div className="flex flex-col h-1/2 p-4">
              <h1 className="text-lg font-bold truncate mb-2">{post.title}</h1>
              <p className="text-sm text-gray-700 flex-1 overflow-y-auto line-clamp-2">{post.desc}</p>
              <span className="text-xs text-gray-500">{post.authorName}</span>
            </div>
          </>
        ) : (
          <div className="flex flex-col h-full p-4">
            <h1 className="text-lg font-bold mb-2">{post.title}</h1>
            <p className="text-sm text-gray-700 flex-1 overflow-y-auto">{post.desc}</p>
            <span className="text-xs text-gray-500 text-center">{post.authorName}</span>
          </div>
        )}
      </a>
    </div>
  );
}
