import axios from "axios";
import { ChangeEvent, FunctionComponent, useState } from "react";
import { MdCancel } from "react-icons/md";
import { BiImageAdd } from "react-icons/bi";
import { Post } from "@libs/types";
import Image from "next/image";
import { mutate } from "swr";
import { useQuery } from "react-query";


const CreateTweet: FunctionComponent<{}> = () => {
  const [file, setFile] = useState(null);
  const [tags, setTags] = useState<string[]>([]);
  const [content, setContent] = useState("");

  const [page, setPage] = useState(0)

  
  const user =
    typeof window !== 'undefined' && localStorage.getItem('userInfo')
      ? JSON.parse(
          typeof window !== 'undefined' && localStorage.getItem('userInfo')
        )
      : null

  const onChangePicture = (e: ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files[0]);
    e.target.value = null; // else cant select the previous file
  };

  const fetchProjects = async(page = 0) => {
    let newURL = `/api/posts/feed?page=${page}`
    const {data} = await axios.get(newURL)
    return data

   }
   const {
    isLoading,
    isError,
    error,
    data,
    isFetching,
    isPreviousData,
  } = useQuery(['projects', page], () => fetchProjects(page), { keepPreviousData : true })

  const handleTweet = async (e:any) => {
    e.preventDefault();
    if (!content) return;

    // Optimistic UI
    const FAKE_POST: Post = {
      _id: Math.floor(Math.random()).toString(),
      content,
      tags: [], // refactor we don't need tags in frontend anymore
      user,
      attachmentURL: file && URL.createObjectURL(file),
      createdAt: new Date(),
      clientOnly: true,
    };

    
     

    setContent("");
    setTags([]); // reset the form
    setFile(null);

    const formData = new FormData();
    formData.append("content", content);

    if (tags.length > 0) formData.append("tags", tags.join(",").replaceAll("#", ""));
    if (file) formData.append("attachment", file);

    await axios("/api/posts", {
      method: "POST",
      data: formData,
    });

    
    mutate("/api/tags");
  };

  const handleChange = (e) => {
    setContent(e.target.value);
    const s = e.target.value;
    setTags(s.match(/#[a-z]+/gi) || []);
  };

  return (
    user && (
      <div className="flex p-2 space-x-2">
        <Image
          width={44}
          height={44}
          layout="fixed"
          objectFit="cover"
          quality={100}
          src={user.profilePicture}
          alt="avatar"
          className="rounded-full"
        />

        <div className="flex-1">
          <form onSubmit={handleTweet}>
            <div
              className={`border-2 ${content.length < 100 ? "border-dark-100" : "border-red-500"}`}
            >
              <textarea
                // ref={register}
                className="w-full h-24 p-2 text-lg bg-transparent rounded-md focus:outline-none"
                placeholder={user && `Hey ${user?.username}, what's going on?`}
                name="text"
                value={content}
                onChange={handleChange}
              />

              <div className="my-1">
                {tags?.map((tag, i) => (
                  <span key={i} className="p-1 mx-1 bg-blue-500 rounded-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            {file && (
              <div className="relative mt-2">
                {/*eslint-disable-next-line */}
                <img
                  src={URL.createObjectURL(file)}
                  alt=" attachment"
                  className="h-[280px] w-full object-contain mx-auto border rounded-xl "
                />
                <MdCancel
                  className="absolute w-8 h-8 text-gray-100 transform -translate-x-1/2 cursor-pointer inset-x-1/2 bottom-3"
                  onClick={() => setFile(null)}
                />
              </div>
            )}
            <div className="flex py-2 ">
              <div>
                <label htmlFor="file-input">
                  <BiImageAdd className="w-10 h-10 text-blue-600 cursor-pointer " />
                </label>
                <input
                  id="file-input"
                  onChange={onChangePicture}
                  // onClick={(e) => (e. = "")}
                  type="file"
                  name="attachment"
                  className="hidden"
                  accept="image/*"
                />
              </div>
              <button
                className="px-4 py-1 ml-auto text-lg font-bold bg-blue-700 rounded-full focus:outline-none "
                type="submit"
              >
                Tweet
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default CreateTweet;
