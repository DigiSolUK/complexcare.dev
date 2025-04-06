// Import the AvatarUpload component at the top
import { AvatarUpload } from "@/components/ui/avatar-upload"

// Add this to the CareProfessionalFormValues type
// avatarUrl: z.string().optional(),

// Add this to the careProfessionalFormSchema
// avatarUrl: z.string().optional(),

// Add this to the defaultValues
// avatarUrl: professional?.avatarUrl || "",

// Add this to the handleSubmit function to include avatarUrl in the formattedData

// Add this inside the form, at the beginning of the form content
;<div className="flex justify-center mb-6">
  <AvatarUpload
    name={`${form.watch("firstName")} ${form.watch("lastName")}`}
    avatarUrl={form.watch("avatarUrl")}
    onAvatarChange={(url) => form.setValue("avatarUrl", url)}
  />
</div>

