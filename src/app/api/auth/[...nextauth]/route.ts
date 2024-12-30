import { createSocialAccount, handleLogin, handleSocialAccount, } from "@/app/login/api/route";
import NextAuth, { Account, AuthOptions, DefaultSession, DefaultUser, Session, User } from "next-auth";
import { DefaultJWT, JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";  // Added FacebookProvider

// Define the type for credentials
interface Credentials {
    email: string;
    password: string;
}

declare module "next-auth" {
    interface User extends DefaultUser {
        role?: string;
        image?: string;
        user_name?: string;
        address?: object;
        uuid?: string;
        DOB?: string;
        gender?: string;
        phone_number?: string;
    }

    interface Session {
        user: {
            role?: string;
            image?: string;
            user_name?: string;
            address?: object;
            uuid?: string;
            DOB?: string;
            gender?: string;
            phone_number?: string;
        } & DefaultSession["user"];
    }
    interface JWT extends DefaultJWT {
        role?: string;
        image?: string;
        address?: object;
        uuid: string;
        DOB?: string;
        gender?: string;
        phone_number?: string;
    }
}
// START FUNC
const authOptions: AuthOptions = {
    secret: process.env.NEXT_PUBLIC_AUTH_SECRET,
    session: {
        strategy: "jwt", // Or "database" if you're using a database
        maxAge: 3 * 24 * 60 * 60, // 3 days in seconds
    },
    jwt: {
        maxAge: 3 * 24 * 60 * 60, // 3 days in seconds
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {},
                password: {},
            },
            async authorize(credentials) {
                const { email, password } = credentials as Credentials;

                if (!email || !password) {
                    return null;
                }

                try {
                    // check in db email and password
                    const currentUser = await handleLogin({ email, password });

                    if (!currentUser?.user) {
                        return null;
                    }

                    return currentUser.user;
                } catch (error) {
                    console.error("Error during login:", error);
                    return null;
                }
            }
        }),
        // Google authentication
        GoogleProvider({
            clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET || '',
        }),
        // Facebook authentication
        FacebookProvider({
            clientId: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID || '',
            clientSecret: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_SECRET || '',
        })
    ],
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === 'google' || account?.provider === 'facebook') {
                await createSocialAccount(user);
                return true;
            }
            return true;
        },
        async jwt({ token, user, account }: { token: JWT, user?: User, account?: Account | null }) {
            if (account && user) {
                if (account.provider === 'google' || account.provider === 'facebook') {
                    const { socialUser } = await handleSocialAccount(user.email as string);
                    token.name = user.name;
                    token.gender = user.gender;
                    token.DOB = user.DOB;
                    token.phone_number = user.phone_number;
                    token.role = socialUser?.role;
                    token.address = user?.address;
                    token.uuid = user.uuid;
                } else {
                    token.name = user.name;
                    token.gender = user.gender;
                    token.DOB = user.DOB;
                    token.phone_number = user.phone_number;
                    token.role = user.role;
                    token.address = user?.address;
                    token.uuid = user.uuid;
                }
            }
            return token;
        },
        async session({ session, token }: { session: Session, token: JWT }) {
            session.user.role = token.role as string | undefined;
            session.user.name = token.name as string | undefined;
            session.user.address = token.address as object | undefined;
            session.user.uuid = token.uuid as string;
            session.user.DOB = token.DOB as string;
            session.user.phone_number = token.phone_number as string;
            session.user.gender = token.gender as string;
            return session;
        },
    },
    pages: {
        signIn: '/login',
    },
};

const handler = NextAuth(authOptions);

export { handler as POST, handler as GET };
