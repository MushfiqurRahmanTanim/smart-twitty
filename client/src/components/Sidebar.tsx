import { IoMdHome, IoMdLogOut, IoMdNotifications } from "react-icons/io";
import { MdExplore, MdNotifications } from "react-icons/md";
import { SiTwitter } from "react-icons/si";
import Link from "next/link";
import { useRouter } from "next/router";

import { useLayoutDispatch, useLayoutState } from "@context/layout.context";
import { FunctionComponent, MouseEventHandler } from "react";
import { IconType } from "react-icons";
import useSWR from "swr";
import { RiUserFill } from "react-icons/ri";
import { useSocket } from "@context/socket.context";
import { useMutation } from "react-query";
import { logout } from "@features/api/user.api";



const SidebarItem: FunctionComponent<{
  Icon: IconType;
  text: string;
  type?: string;
  badgeData?: number;
  handler?: MouseEventHandler<HTMLDivElement>;
}> = ({ Icon, badgeData, text, handler, type }) => {
  return (
    <div className="navItem" onClick={handler}>
      <div className="relative ">
        <Icon size="30" className="flex-shrink-0" />
        {type === "badge" && badgeData > 0 && (
          <span className="absolute grid w-5 h-5 text-xs text-white bg-blue-600 rounded-full -bottom-1 -right-1 place-items-center">
            {badgeData > 9 ? "9+" : badgeData}
          </span>
        )}
      </div>
      <span className="hidden tracking-wide lg:block">{text}</span>
    </div>
  );
};

const Sidebar = () => {
  const layoutDispatch = useLayoutDispatch();
 
  const user =
    typeof window !== 'undefined' && localStorage.getItem('userInfo')
      ? JSON.parse(
          typeof window !== 'undefined' && localStorage.getItem('userInfo')
        )
      : null
 
  const { showNavbar } = useLayoutState();
  const socket = useSocket();
  const router = useRouter()
  const { mutateAsync } = useMutation(logout, {
    onSuccess: () => router.push('/login'),
  })

  

  const showModal = async () => {
    layoutDispatch({
      type: "SHOW_CONFIRMATION_MODAL",
      payload: {
        subTitle: "Great!!! Focus on your real life",
        handleConfirmation: handleLogout,
        buttonText: "Log out",
      },
    });
  };
  const handleLogout = async (e: any) => {
    e.stopPropagation();
    socket.disconnect();
    mutateAsync()
    
  };
  // const getNotifications = () => {};
  const { data: notifications } = useSWR(user && "/api/notifications?unreadOnly");

  return (
    <div
      className={`bg-dark-700 fixed flex-col justify-between h-screen px-3 sm:px-6 py-8 pb-20 text-lg shadow-lg flex z-10 sm:sticky top-0 sm:max-w-max  max-w-max transform transition-all duration-300 ${
        showNavbar ? "  translate-x-0" : "  -translate-x-full sm:translate-x-0"
      }`}
    >
      <div className="flex items-center justify-center space-x-2 font-medium ">
        <Link href="/">
          <a>
            <SiTwitter
              className="text-blue-600 cursor-pointer "
              size="30"
              onClick={() => layoutDispatch({ type: "TOGGLE_NAVBAR" })}
            />
          </a>
        </Link>
      </div>
      <div
        className="flex flex-col space-y-5 "
        onClick={(e) => {
          e.stopPropagation();
          layoutDispatch({ type: "TOGGLE_NAVBAR" });
        }}
      >
        <SidebarItem Icon={IoMdHome} text="Home" handler={() => router.push("/")} />
        {user && (
          <SidebarItem
            Icon={RiUserFill}
            text="Profile"
            handler={() => router.push(`/user/${user._id}`)}
          />
        )}
        {user && (
          <SidebarItem
            type="badge"
            badgeData={notifications?.length}
            Icon={IoMdNotifications}
            text="Notis"
            handler={() => router.push("/notifications/")}
          />
        )}
        <SidebarItem Icon={MdExplore} text="Explore" handler={() => router.push("/explore")} />
        {/* <SidebarItem Icon={MdNotifications} text="Notifications" /> */}

        {user && <SidebarItem Icon={IoMdLogOut} text="LogOut" handler={showModal} />}
      </div>
      <div></div>
    </div>
  );
};

export default Sidebar;
