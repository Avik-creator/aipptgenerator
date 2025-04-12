"use server"

import { z } from "zod"

const formSchema = z.object({
    audience: z.string().min(2),
    description: z.string().min(10),
    slideCount: z.coerce.number().min(3).max(20),
  })


  export async function createPresentation(formData: z.infer<typeof formSchema>) {
    const result = formSchema.safeParse(formData)

    if (!result.success) {
      return { error: "Invalid input data" }
    }

    const { audience, description, slideCount } = result.data

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/presentation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            audience,
          description,
          number_of_slides: slideCount,
        }),
      })

        if (!response.ok) {
          console.error("Failed to generate presentation:", response)
            throw new Error("Failed to generate presentation")
        }
        const data = await response.json()
        console.log("Generated presentation data:", JSON.stringify(data, null, 2))
      return data;
    } catch (error) {
      console.error("Error generating presentation:", error)
      return { error: "Failed to generate presentation" }
    }
  }