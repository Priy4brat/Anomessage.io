import { NextAuthOptions } from "next-auth";
import  CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions: NextAuthOptions = { 
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials : any) : Promise<any>{
                await dbConnect()
                try {
                    // while finding user from db 
                    // its written as -> credentials.identifier
                  const user =  await UserModel.findOne({
                        $or : [
                            {email : credentials.identifier},
                            {username : credentials.identifier}
                        ]
                    })

                    if(!user){
                        throw new Error("No user found with this email")
                    }
                    
                    if(!user.isVerified){
                        throw new Error("Please verify your account first before login")
                    }

                    //  while comparing with bcrypt
                    //  its written as -> credentials.password
                    // not as -> credentials.identifier.password
                   const isPassCorrect = await bcrypt.compare(credentials.password, user.password) 

                   if(isPassCorrect) return user
                   else throw new Error('Incorrect user')

                } catch (error: any) {
                    throw new Error(error)
                }

            }
        }),
    ],
    callbacks: {
        async jwt({token, user}){
            // inject user data in token
            // to reduce database querries while authentication
            
            return token 
        },
        async session({session, token}){
            return session
        }
    },
    pages: {
        signIn : '/sign-in'
    }, 
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,


}