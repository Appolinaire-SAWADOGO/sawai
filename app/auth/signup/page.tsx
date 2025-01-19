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
import { signupFormType } from "@/lib/type/zod";
import { useSignUp, useUser } from "@clerk/nextjs";
import { redirect, useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { ClerkAPIError } from "@clerk/types";
import { OAuthStrategy } from "@clerk/types";
import { useSignIn } from "@clerk/nextjs";
import axios from "axios";

const Page = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const { signIn } = useSignIn();
  const { isSignedIn } = useUser();
  const [verifying, setVerifying] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [step, setStep] = React.useState<1 | 2>(1);
  const [errors, setErrors] = React.useState<ClerkAPIError[]>([]);
  const router = useRouter();

  const { toast } = useToast();

  const form = useForm<z.infer<typeof signupFormType>>({
    resolver: zodResolver(signupFormType),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const { control, handleSubmit, reset, watch } = form;

  // Handle submission of the sign-up form
  const Submit = async ({
    username,
    email,
    password,
  }: z.infer<typeof signupFormType>) => {
    if (isSignedIn) return;

    if (!isLoaded) return;

    if (verifying) return;

    if (!username || !email || !password) return;

    // Start the sign-up process using the email and password provided
    try {
      // set veryfying true
      setVerifying(true);

      await signUp?.create({
        username,
        emailAddress: email,
        password: password,
      });

      // Send the user an email with the verification code
      await signUp?.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      // send a toast
      toast({
        description: "A verification code has been sent to your email address.",
      });

      setStep(2);
    } catch (err) {
      // gestion des erreurs avec clerk
      if (isClerkAPIResponseError(err)) {
        if (
          err.errors?.[0].message ===
          "Something went wrong, please try again later."
        ) {
          // send a toast
          toast({
            description: "Something went wrong, please try again later.",
          });
        }

        // set arrors
        setErrors(err.errors);
      } else {
        // send a toast
        toast({
          description: "An error has occurred.",
        });
      }

      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      if (err instanceof Error) {
        console.error(JSON.stringify(err, null, 2));
      }
    } finally {
      // set veryfying false
      setVerifying(false);
    }
  };

  // Handle the submission of the verification form
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSignedIn) return;

    if (!isLoaded) return;

    if (verifying) return;

    if (!code) return;

    try {
      // set veryfying false
      setVerifying(true);

      // form userName
      const name = watch("username");
      // form email
      const email = watch("email");

      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });

        // Post new user
        await axios.post("/api/create-user", {
          name,
          email,
        });

        // reset form
        reset();

        // set step est egale a 1
        setStep(1);

        // send toast
        toast({ description: "Registration successful." });

        router.push("/ai/content-generetor");
      } else {
        // send toast
        toast({
          description: "Something went wrong, please try again later.",
        });
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      if (isClerkAPIResponseError(err)) setErrors(err.errors);

      if (err instanceof Error) {
        console.error("Error:", JSON.stringify(err, null, 2));
      }
    } finally {
      // code est vide
      setCode("");
      // set veryfying false
      setVerifying(false);
    }
  };

  const signInWith = (strategy: OAuthStrategy) => {
    // si deja authentifier
    if (isSignedIn) return;
    if (!isLoaded) return;
    if (verifying) return;

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
      <div className="px-7  h-screen max-[325px]:h-full  w-96 max-w-full mx-auto flex flex-col items-center justify-center">
        <Logo className="sm:text-5xl text-4xl" />
        {step === 1 && (
          <>
            <div className="w-full flex items-center justify-between gap-2 mt-10">
              <Button
                disabled={verifying}
                onClick={() => signInWith("oauth_google")}
                className="flex items-center gap-2 bg-[#d8d8d8] font-bold text-base p-6 px-8    max-[370px]:px-5  text-black hover:text-white hover:bg-[#27282A] hover:border hover:border-[#58595A]"
              >
                <i className="fa-brands fa-google"></i>
                Google
              </Button>
              <Button
                disabled={verifying}
                onClick={() => signInWith("oauth_github")}
                className="flex items-center gap-2 bg-[#d8d8d8] font-bold text-base p-6 px-8   max-[370px]:px-5  text-black hover:text-white hover:bg-[#27282A] hover:border hover:border-[#58595A]"
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
                    name="username"
                    render={({ field }) => (
                      <FormItem className="mt-6">
                        <FormLabel className="text-color text-lg opacity-70 text-start flex">
                          Username
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="example"
                            className="w-full h-12 bg-[#27282A] bg-opacity-70 border border-[#58595A] focus:border-[3px] text-color"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage
                          className="text-start

                    "
                        >
                          {errors[0] &&
                            errors?.[0].message ===
                              "Username can only contain letters, numbers and '_' or '-'." &&
                            "Username can only contain letters, numbers and '_' or '-'."}
                          {errors[0] &&
                            errors?.[0].message ===
                              "That username is taken. Please try another." &&
                            "User name already exists."}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="mt-10">
                        <FormLabel className="text-color text-lg opacity-70 text-start flex">
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="example@gmail.com"
                            className="w-full h-12 bg-[#27282A] bg-opacity-70 border border-[#58595A] focus:border-[3px] text-color"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage
                          className="text-start
                    "
                        >
                          {errors[0] &&
                            errors?.[0].message ===
                              "That email address is taken. Please try another." &&
                            "Email already exists."}
                        </FormMessage>
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
                            className="w-full h-12 bg-[#27282A] bg-opacity-70 border border-[#58595A] focus:border-[3px] text-color"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage
                          className="text-start
                    "
                        >
                          {errors?.[0] &&
                            errors?.[0].code === "user_locked" &&
                            accountLocked()}
                          {errors?.[0] &&
                            errors?.[0].code === "captcha_invalid" &&
                            "Something went wrong, please try again later."}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={verifying || isSignedIn}
                  className="flex items-center gap-2 bg-[#d8d8d8] w-full font-bold text-black py-6 mt-6 hover:text-white hover:bg-[#27282A] hover:border hover:border-[#58595A]"
                >
                  {verifying && <Loader2 className="w-5 h-5 animate-spin " />}
                  Signup
                </Button>

                <div className="mt-4 flex items-center max-[325px]:text-start max-[325px]:items-start gap-3 text-color">
                  <span className="opacity-70 text-sm max-[350px]:text-xs">
                    Do you already have an account?
                  </span>
                  <Link
                    href={"/auth/signin"}
                    className="text-blue-500 text-sm max-[350px]:text-xs"
                  >
                    Signin
                  </Link>
                </div>
              </form>
            </Form>
          </>
        )}
        {step === 2 && (
          <div className="mt-10 w-full flex flex-col items-center justify-center">
            <Label className="text-color text-lg opacity-70 flex w-full text-start mb-3">
              Enter code
            </Label>
            <InputOTP
              maxLength={6}
              value={code}
              onChange={(value) => setCode(value)}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>

            <Label className="w-full flex text-start justify-start text-destructive text-sm mt-4">
              {errors?.[0] &&
                errors?.[0].code === "form_code_incorrect" &&
                "Code incorrect."}
              {errors?.[0] &&
                errors?.[0].code === "verification_failed" &&
                "Too many failed attempts. You have to try again with the same or another method."}
            </Label>

            <Button
              onClick={handleVerify}
              disabled={verifying || isSignedIn}
              type="button"
              className="flex items-center gap-2 bg-[#d8d8d8] w-full font-bold text-black py-6 mt-6 hover:text-white hover:bg-[#27282A] hover:border hover:border-[#58595A]"
            >
              {verifying && <Loader2 className="w-5 h-5 animate-spin" />}
              Signup
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
