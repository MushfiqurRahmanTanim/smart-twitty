import TweetCard from "@components/TweetCard";
import Trends from "@components/Trends";
import People from "@components/People";
import CreateTweet from "@components/CreateTweet";
import Loader from "@components/Loader";

import { useRouter } from "next/router";
import React, { useState } from "react";
import { useEffect } from "react";
import TweetSkeleton from "@components/skeletons/TweetSkeleton";
import { useQuery } from "react-query";
import { Post } from "@libs/types";
import axios from "axios";




export default function Home() {
  const [page, setPage] = React.useState(0)

  const fetchProjects = async(page = 0) => {
    let newURL = `/api/posts/feed?page=${page}`
    const {data} = await axios.get(newURL)
    return data

   }
   const {
    // isLoading,
    // isError,
    error,
    data,
    // isFetching,
    isPreviousData,
  } = useQuery(['projects', page], () => fetchProjects(page), { keepPreviousData : true })
   const posts: Post[] = data ? [].concat(...data.map((paginatedPost) => paginatedPost.posts)) : []
  const { push } = useRouter();

  const user =
  typeof window !== 'undefined' && localStorage.getItem('userInfo')
    ? JSON.parse(
        typeof window !== 'undefined' && localStorage.getItem('userInfo')
      )
    : null
  
    
 

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
                                     //  solves the hydration problem
  }, [mounted]);

  return (
    <div className="grid grid-cols-8 gap-x-8 ">
      <div className="col-span-8 md:col-span-5">
        <div className="h-[90vh] overflow-y-auto">
          {user ? (
            <CreateTweet />
          ) : (
            <div className="p-3 text-center">
              <p>Sign in to talk to the world 😉</p>
              <button onClick={() => push("/auth")} className="mx-auto mt-3 button">
                Sign up / Sign in
              </button>
            </div>
          )}
          {!posts &&  [...Array(10)].map((_, i) => <TweetSkeleton key={i} />)}

          {error && <h3 className="customText-h3">Could not load the post, Retrying</h3>}
          {user &&  posts.length === 0 ? (
            <h3 className=" customText-h3">
              You don't have any posts in your feed, create one or follow someone!
            </h3>
          ) : (
            <>
            <button
            onClick={() => setPage(old => Math.max(old - 1, 0))}
            disabled={page === 0}
          >
            Previous Page
          </button>
          {posts?.map((tweet) => (
                <TweetCard tweet={tweet} key={tweet._id.toString()} />
              ))}
          <button
            onClick={() => {
              if (!isPreviousData && data.hasMore) {
                setPage(old => old + 1)
              }
            }}
            // Disable the Next Page button until we know a next page is available
            disabled={isPreviousData || !data?.hasMore}
          >
            Next Page
          </button>
          </>
            
          )}
        </div>
      </div>
      <div className="hidden col-span-8 py-4 space-y-4 md:col-span-3 md:block">
        <Trends noOfElements={5} />
        <People noOfElements={5} />
      </div>
    </div>
  );
}
