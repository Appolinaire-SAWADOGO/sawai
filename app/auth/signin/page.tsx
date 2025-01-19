"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Logo from "@/components/ui/main/logo";
import Link from "next/link";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signinFormType } from "@/lib/type/zod";
import { redirect } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useSignIn } from "@clerk/nextjs";
import { OAuthStrategy } from "@clerk/types";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { ClerkAPIError } from "@clerk/types";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";

const Page = () => {
  const { isSignedIn } = useUser();
  const { isLoaded, signIn, setActive } = useSignIn();

  const router = useRouter();
  const [verifying, setVerifying] = React.useState(false);
  const [errors, setErrors] = React.useState<ClerkAPIError[]>([]);

  const { toast } = useToast();

  const form = useForm<z.infer<typeof signinFormType>>({
    resolver: zodResolver(signinFormType),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { control, handleSubmit, reset } = form;

  const Submit = async ({
    email,
    password,
  }: z.infer<typeof signinFormType>) => {
    if (isSignedIn) return;
    if (!isLoaded) return;

    if (verifying) return;

    if (!email || !password) return;

    // Start the sign-in process using the email and password provided
    try {
      setVerifying(true);

      const signInAttempt = await signIn.create({
        identifier: email,
        password,
      });

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });

        toast({ description: "Connection successful." });

        reset();

        router.push("/ai");
      } else {
        toast({ description: "Something went wrong." });

        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      if (isClerkAPIResponseError(err)) setErrors(err.errors);

      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      if (err instanceof Error) console.error(JSON.stringify(err, null, 2));
    } finally {
      setVerifying(false);
    }
  };

  const signInWith = (strategy: OAuthStrategy) => {
    // si deja authentifier
    if (isSignedIn) return;
    if (!isLoaded) return;

    return signIn?.authenticateWithRedirect({
      strategy,
      redirectUrl: "/ai/content-generetor",
      redirectUrlComplete: "/ai/content-generetor",
    });
  };

  const accountLocked = () => {
    const currentDate = new Date();

    // Add the remaining seconds until lockout expires
    currentDate.setSeconds(currentDate.getSeconds() + 1800);

    // Format the resulting date and time into a human-readable string
    const lockoutExpiresAt = currentDate.toLocaleString();

    // Do something with lockoutExpiresAt
    return (
      "Your account is locked, you will be able to try again at " +
      lockoutExpiresAt
    );
  };

  if (isSignedIn) {
    return redirect("/ai/content-generetor");
  }

  return (
    <div className="h-screen max-[325px]:h-full  overflow-auto w-full flex items-center justify-center text-center mt-10 mb-10">
      <div className="px-7 h-screen max-[325px]:h-full w-96 max-w-full mx-auto flex flex-col items-center justify-center">
        <Logo className="sm:text-5xl text-4xl" />
        <div className="w-full flex items-center justify-between gap-2 mt-10">
          <Button
            onClick={() => signInWith("oauth_google")}
            disabled={isSignedIn || verifying}
            className="flex items-center gap-2 bg-[#d8d8d8] font-bold text-base p-6  text-black hover:text-white hover:bg-[#27282A] hover:border hover:border-[#58595A]"
          >
            <i className="fa-brands fa-google"></i>
            Google
          </Button>
          <Button
            onClick={() => signInWith("oauth_github")}
            disabled={isSignedIn || verifying}
            className="flex items-center gap-2 bg-[#d8d8d8] font-bold text-base p-6  text-black hover:text-white hover:bg-[#27282A] hover:border hover:border-[#58595A]"
          >
            <i className="fa-brands fa-github"></i>
            Github
          </Button>
        </div>
        <Form {...form}>
          <form className="w-full" onSubmit={handleSubmit(Submit)}>
            <div className="space-y-4">
              <FormField
                control={control}
                name="email"
                render={({ field }) => (
                  <FormItem className="mt-7">
                    <FormLabel className="text-color text-lg opacity-70 text-start flex">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="example@gmail.com"
                        className="w-full h-12 bg-[#27282A] bg-opacity-70 text-color border border-[#58595A] focus:border-[3px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage
                      className="text-start
                    "
                    />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="password"
                render={({ field }) => (
                  <FormItem className="mt-10">
                    <FormLabel className="text-color text-lg opacity-70 text-start flex">
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="********"
                        className="w-full h-12 bg-[#27282A] bg-opacity-70 text-color border border-[#58595A] focus:border-[3px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage
                      className="text-start
                    "
                    >
                      {errors?.[0] &&
                        errors?.[0].code === "form_password_incorrect" &&
                        "Password is incorrect. Try again, or use another method."}
                      {errors?.[0] &&
                        errors?.[0].code === "form_identifier_not_found" &&
                        "Couldn't find your account."}
                      {errors?.[0] &&
                        errors?.[0].code === "user_locked" &&
                        accountLocked()}
                    </FormMessage>
                  </FormItem>
                )}
              />
            </div>
            <Button
              type="submit"
              disabled={isSignedIn || verifying}
              className="flex items-center gap-2 bg-[#d8d8d8] w-full font-bold text-black py-6 mt-6 max-[380px]: hover:text-white hover:bg-[#27282A] hover:border hover:border-[#58595A]"
            >
              {verifying && <Loader2 className="w-5 h-5 animate-spin " />}
              Signin
            </Button>
            <div className="mt-4 flex items-center max-[325px]:text-start max-[325px]:items-start gap-3 text-color">
              <span className="opacity-70">
                Do you haven&apos;t an account?{" "}
              </span>
              <Link href={"/auth/signup"} className="text-blue-500">
                Signup
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Page;
