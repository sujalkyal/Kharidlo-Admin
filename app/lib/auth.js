import db from "../../db/src/index";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email", placeholder: "example@gmail.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                // Do zod validation, OTP validation here
                const hashedPassword = await bcrypt.hash(credentials.password, 10);
                const existingAdmin = await db.admin.findFirst({
                    where: {
                        email: credentials.email
                    }
                });

                if (existingAdmin) {
                    const passwordValidation = await bcrypt.compare(credentials.password, existingAdmin.password);
                    if (passwordValidation) {
                        return {
                            id: existingAdmin.id.toString(),
                            email: existingAdmin.email
                        };
                    }
                    return null;
                }

                try {
                    const admin = await db.admin.create({
                        data: {
                            email: credentials.email,
                            password: hashedPassword
                        }
                    });

                    return {
                        id: admin.id.toString(),
                        email: admin.email
                    };
                } catch (e) {
                    console.error(e);
                }

                return null;
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        })
    ],
    secret: process.env.NEXTAUTH_SECRET || "fallback_secret",
    callbacks: {
        async session({ token, session }) {
            session.user.id = token.sub;
            return session;
        }
    }
};
