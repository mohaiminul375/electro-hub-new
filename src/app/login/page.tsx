'use client';
import { Divider, Input } from '@nextui-org/react';
import React, { Suspense, useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import Link from 'next/link';
import { useForm, SubmitHandler } from "react-hook-form";
import SocialLogin from '../../components/shared/SocialLogin';
import { signIn } from 'next-auth/react';
import toast from 'react-hot-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';

const LottiePlayer = dynamic(() => import('@lottiefiles/react-lottie-player').then((mod) => mod.Player), { ssr: false });

type Inputs = {
    email: string;
    password: string;
    redirects: boolean;
};

function Page() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const path = searchParams.get("redirect");
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => setIsVisible((prev) => !prev);

    // react-hook-form
    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();
    const onSubmit: SubmitHandler<Inputs> = async (user_info) => {
        try {
            const email = user_info.email;
            const password = user_info.password;

            const res = await signIn('credentials', {
                email,
                password,
                redirect: true,
                callbackUrl: path ? path : '/',
            });

            if (res?.status === 200) {
                router.push('/');
                toast.success('Login successfully');
            } else {
                toast.error('Invalid email or password');
            }
        } catch (error) {
            console.error("Error during login:", error);
            toast.error('Something went wrong, please try again later');
        }
    };

    return (
        <section className="grid md:grid-cols-2 gap-5 mt-5 px-4 lg:px-8">
            {/* Lottie animation */}
            <div className="hidden md:flex justify-center">
                <LottiePlayer
                    autoplay
                    loop
                    src="/auth.json" // Ensure the correct path to your JSON file
                    style={{ height: 'auto' }}
                    className="w-full max-w-full"
                />
            </div>

            {/* Login form */}
            <div>
                <div className="w-full max-w-[500px] mx-auto border-2 py-8 px-4 md:px-8 rounded-md shadow-2xl border-primary bg-[#F5F5F5]">
                    <h2 className="text-center text-2xl md:text-3xl font-bold text-accent">LogIn</h2>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* Email input */}
                        <div className="mt-4">
                            <label className="block mb-2 text-accent text-base">Enter Your Email</label>
                            <Input
                                type="email"
                                variant="flat"
                                label="Email"
                                color="success"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                        message: "Please enter a valid email address",
                                    },
                                })}
                            />
                            {errors.email && <span className="text-red-500 text-sm">*{errors.email.message}</span>}
                        </div>

                        {/* Password input */}
                        <div className="mt-4">
                            <label className="block mb-2 text-accent">Enter Your Password</label>
                            <Input
                                fullWidth
                                label="Password"
                                color="success"
                                variant="flat"
                                endContent={
                                    <button
                                        className="focus:outline-none"
                                        type="button"
                                        onClick={toggleVisibility}
                                        aria-label="toggle password visibility"
                                    >
                                        {isVisible ? (
                                            <FaRegEye className="text-2xl text-default-400 pointer-events-none" />
                                        ) : (
                                            <FaRegEyeSlash className="text-2xl text-default-400 pointer-events-none" />
                                        )}
                                    </button>
                                }
                                type={isVisible ? "text" : "password"}
                                {...register("password", {
                                    required: 'Password is required',
                                    minLength: {
                                        value: 6,
                                        message: 'Password must be at least 6 characters long',
                                    },
                                })}
                            />
                            {errors.password && <span className="text-red-500 text-sm">*{errors.password.message}</span>}
                        </div>

                        {/* Submit button */}
                        <div className="mt-5">
                            <button className="w-full py-2 bg-primary text-white rounded-md hover:rounded-2xl duration-700 hover:bg-hoverPrimary">
                                Login
                            </button>
                        </div>
                    </form>

                    {/* Divider and Social Login */}
                    <div>
                        <Divider className="my-4" />
                        <SocialLogin />
                        <div className="mt-5">
                            <p className="text-center text-base">
                                New here?{' '}
                                <Link className="text-accent hover:underline hover:text-primary duration-700" href="/register">
                                    Register
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default function Login() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Page />
        </Suspense>
    );
}
