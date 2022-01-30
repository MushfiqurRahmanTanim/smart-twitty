
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { BiLoaderAlt } from "react-icons/bi";
import { yupResolver } from "@hookform/resolvers/yup";

import Input from "@components/Input";
import { signupSchema } from "@libs/schemaValidation";
import { loginSchema } from "@libs/schemaValidation";
import { useMutation, useQueryClient } from "react-query";

import { login, registerUser } from "@features/api/user.api";


const AuthComponent = () => {
  const [isLogin, setIsLogin] = useState(true);
  
  const user =
    typeof window !== 'undefined' && localStorage.getItem('userInfo')
      ? JSON.parse(
          typeof window !== 'undefined' && localStorage.getItem('userInfo')
        )
      : null
  const {
    register,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm({
    mode: "onTouched",
    resolver: yupResolver(isLogin ? loginSchema : signupSchema),
  });

  const url = isLogin ?login : registerUser;
  const queryClient = useQueryClient()

  const router = useRouter();
  const pathName = router.query.next || '/' as any
  const { isLoading, error,  mutateAsync} = useMutation(
    'auth',
    url,
    {
      retry: 0,
      onSuccess:(data) => {
        reset()
         queryClient.setQueryData('userInfo', data)
        router.push(pathName)
      },
    }
  )

  useEffect(() => {


  }, [router])


  const handleClick = async (data: any) => {
    mutateAsync(data)
  };

  return (
    <div className="w-full p-2 mx-auto space-y-4 md:max-w-max">
      <form className="flex flex-col space-y-3" onSubmit={handleSubmit(handleClick)}>
        <div className="space-y-3 md:space-y-0 md:flex md:space-x-4 md:items-center">
          {!isLogin && (
            <Input
              label="Name"
              type="text"
              register={register}
              fieldName="name"
              error={errors.name}
            />
          )}
          <Input
            label="Username"
            type="text"
            placeholder="Hi, Twitty"
            register={register}
            fieldName="username"
            error={errors.username}
          />
        </div>
        {!isLogin && (
          <Input
            label="Email"
            type="email"
            fieldName="email"
            error={errors.email}
            register={register}
          />
        )}
        <Input
          label="Password"
          type="password"
          placeholder="6+ Characters"
          fieldName="password"
          error={errors.password}
          register={register}
        />

        <button className="button" type="submit">
          {isLoading ? <BiLoaderAlt className="mr-2 animate-spin" /> : isLogin ? "Log in" : "Sign up"}
        </button>
      </form>

      <p className="p-1 text-center text-red-600 ">{error}</p>

      <p className="text-lg tracking-wide text-center text-white">
        {!isLogin ? "Already a member?" : "Don't have an account yet?"}
        <span className="cursor-pointer" onClick={() => setIsLogin(!isLogin)}>
          {!isLogin ? " Sign In" : " Sign Up"}
        </span>
      </p>
    </div>
  );
};

export default AuthComponent;


