"use server"
import Groq from "groq-sdk"
import { JWTPayload, SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"

const key = new TextEncoder().encode(process.env.LOGIN_SECRET)

const cookieOptions = {
  name: "session",
  options: {
    secure: true, // only send cookies over https
    httpOnly: false, // make sure JS can access the cookie
    sameSite: "lax", // only send cookies to same site (not cross-site)
    path: "/",
  },
  duration: 24 * 60 * 60 * 1000, // 24 hours
}

export const encrypt = async (payload: JWTPayload) => {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime("1day")
    .sign(key)
}

export const createSession = async ({
  userName,
  password,
}: {
  userName: string
  password: string
}) => {
  if (
    userName !== process.env.USER_NAME ||
    password !== process.env.USER_PASSWORD
  ) {
    return { success: false, message: "Invalid credentials" }
  }
  const expires = new Date(Date.now() + cookieOptions.duration)
  const session = await encrypt({ userName, expires })
  ;(await cookies()).set(cookieOptions.name, session, {
    ...cookieOptions,
    expires,
  })
  return { success: true, message: "Session created" }
}

export const deleteSession = async () => {
  ;(await cookies()).delete(cookieOptions.name)
  return { success: true, message: "Session deleted" }
}

export const verifySession = async () => {
  const cookie = (await cookies()).get(cookieOptions.name)?.value

  if (!cookie) {
    return null
  }
  const session = await decrypt(cookie)

  if (!session) {
    return null
  }
  if (!session.userName) {
    return null
  }
  return { userName: session.userName }
}

async function decrypt(session: string) {
  try {
    const { payload } = await jwtVerify(session, key, {
      algorithms: ["HS256"],
    })
    return payload
  } catch (error) {
    console.error("Error decrypting session", error)
    return null
  }
}

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
export async function getResponse({
  input,
  model,
}: {
  input: string
  model: string
}): Promise<string> {
  const response = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: input,
      },
    ],
    model,
  })
  if (!response.choices[0].message.content) {
    console.error("No response from the model")
    return "Sorry, I have some internal issues. Please try again later."
  }
  console.log(response.choices[0].message.content)

  return response.choices[0].message.content
}
