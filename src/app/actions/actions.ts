"use server"

import {  z } from "zod"


const formSchema = z.object({
    audience: z.string().min(2),
    description: z.string().min(10),
    slideCount: z.coerce.number().min(3).max(20),
    numberOfBulletPoints: z.coerce.number().min(1).max(5),
  })



  export async function createPresentation(formData: z.infer<typeof formSchema>) {
    const result = formSchema.safeParse(formData)

    if (!result.success) {
      return { error: "Invalid input data" }
    }

    const { audience, description, slideCount, numberOfBulletPoints } = result.data

    // Get the client's IP address
    const response = await fetch(`${process.env.NEXT_PUBLIC_DEPLOYED_URL}/api/ip`)
    if (!response.ok) {
      return { error: "Failed to fetch client IP address" }
    }

    const ipData = await response.json()
    const clientIPAddress = ipData.ip
    console.log("Client IP Address:", clientIPAddress)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/presentation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Client-IP": clientIPAddress,
        },
        body: JSON.stringify({
            audience,
          description,
          number_of_slides: slideCount,
          number_of_bullet_points: numberOfBulletPoints,
        }),
      })

        if (!response.ok) {
         if(response.status == 429){
          return { error: "Too Many Requests. Please try again later after 24 hours." }
         }else{
          return {error: response.statusText}
         }
        }

        const data = await response.json()
      return data;
    } catch (error) {
      console.error("Error generating presentation:", error)
      return { error: "Failed to generate presentation" }
    }
  }