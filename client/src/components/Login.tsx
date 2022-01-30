
import { useRouter } from "next/router";
import { FunctionComponent, useEffect } from "react";
import { useForm } from "react-hook-form";
import { BiLoaderAlt } from "react-icons/bi";
import classNames from "classnames";
import { yupResolver } from "@hookform/resolvers/yup";


import Input from "./Input";
import { loginSchema } from "@libs/schemaValidation";
import { login as logFrom} from "@features/api/user.api";
import { useMutation, useQueryClient } from "react-query";
import { customLocalStorage } from "@app/customLocalStorage";
// interface loginData {
//   email?: string;
//   username?: string;
//   password: string;
// }

const Login: FunctionComponent<{
  large: Boolean;
}> = ({ large }) => {


  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    mode: "onTouched", // when to execute the validation first time
    resolver: yupResolver(loginSchema),
  });
  
  const router = useRouter()
  
  const pathName = router.query.next || '/' 
  
  const queryClient = useQueryClient()

  const { isLoading, isError, error,  mutateAsync} = useMutation (
    "login",
    logFrom,
    {
      retry: 0,
      onSuccess: (data) => {
        reset()
        queryClient.setQueryData('userInfo', data)
        router.push(pathName as string)
      },
    }
  )

  useEffect(() => {
    customLocalStorage() && customLocalStorage().userInfo && router.push('/')
  }, [router])

  const handleClick = async (data: any) => {
     await mutateAsync(data)
  };

  return (
    <div
      className={classNames("flex flex-col space-y-4", {
        "w-10/12 md:w-6/12": large,
      })}
    >
      <h1 className="text-2xl font-bold text-white">Sign in to Twitty</h1>
      <form className="flex flex-col space-y-3" onSubmit={handleSubmit(handleClick)}>
        <Input
          label="Email"
          type="text"
          fieldName="email"
          error={errors.email}
          register={register}
        />
        <Input
          label="Password"
          type="password"
          placeholder="6+ Characters"
          fieldName="password"
          error={errors.password}
          register={register}
        />
        <button className="button">
          {!isLoading ? "Sign In" : <BiLoaderAlt className="mr-2 animate-spin" />}
        </button>
      </form>

      {isError && (
        <div className="p-1 text-lg tracking-wide text-center text-red-600 border border-red-600">
          {error}
        </div>
      )}
    </div>
  );
};
export default Login;

// 7,6mb tra
