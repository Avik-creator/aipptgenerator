"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import { createPresentation } from "@/app/actions/actions"
import { PresentationPreview } from "@/components/page/presentation-previewer"
import { toast } from "sonner"

const formSchema = z.object({
  audience: z.string().min(2, {
    message: "Audience must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  slideCount: z.coerce.number().min(3).max(10),
  numberOfBulletPoints: z.coerce.number().min(1).max(5),
})

export function PresentationForm() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [presentation, setPresentation] = useState(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      audience: "",
      description: "",
      slideCount: 5,
      numberOfBulletPoints: 3,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsGenerating(true)

    try {
      const result = await createPresentation(values)

      if (result.error) {

        toast("Generation failed", {
          description: result.error,
          position: "bottom-right",
          style: { backgroundColor: "red", color: "white", outline: "none"  },
        })
      } else {
        setPresentation(result.presentation)
        toast("Presentation Generated", {
          description: "Your presentation has been created successfully!",
          position: "bottom-right",
          style: { backgroundColor: "green", color: "white", outline: "none" },
        })
      }
    } catch (err) {
      toast.error("Something went wrong", {
        description: "An error occurred while generating your presentation.",
        position: "bottom-right",
        style: { backgroundColor: "red", color: "white", outline: "none"  },
      })
      console.error(err)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8" id="generate">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Describe Your Presentation</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="audience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Presentation Audience</FormLabel>
                <FormControl>
                  <Input placeholder="E.g., College Students" {...field} />
                </FormControl>
                <FormDescription>This will make the Understand the Audience of your PPT.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe what you want in your presentation. Be specific for better results."
                    className="min-h-24"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Provide details about the content you want in your slides.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slideCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Slides</FormLabel>
                <FormControl>
                  <Input type="number" min={5} max={20} {...field} />
                </FormControl>
                <FormDescription>Choose between 5 and 10 slides.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="numberOfBulletPoints"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Bullet Points</FormLabel>
                <FormControl>
                  <Input type="number" min={1} max={5} {...field} />
                </FormControl>
                <FormDescription>Choose between 1 and 5 bullet points per slide.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Presentation"
            )}
          </Button>
        </form>
      </Form>

      {presentation && (
        <div className="mt-8 space-y-6">
          <PresentationPreview presentation={presentation} />
        </div>
      )}
    </div>
  )
}