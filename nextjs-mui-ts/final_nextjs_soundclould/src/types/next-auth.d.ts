import NextAuth, { IUser } from "next-auth"
import { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"


declare module "next-auth/jwt" {

    interface IUser {
        id: string,
        username: string,
        email: string,
        isVerify: boolean,
        type: string,
        role: string
    }

    interface JWT {
        access_token: string,
        refresh_token: string,
        user: IUser
    }
}

declare module "next-auth" {

/**
 * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
 */
interface Session {
    access_token: string,
    refresh_token: string,
    user: IUser
}

}






