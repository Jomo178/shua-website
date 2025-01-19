import { z } from "zod";

export const addFormSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Issue Name is required!"),
  releaseDate: z.string().datetime(),
  era: z.string().min(1, "Issue Era is required!"),
  group: z.string().min(1, "Issue Group is required!"),
  code: z.string().min(1, "Issue Code is required!"),
  image: fileValidation(),
});

function fileValidation(allowedExtensions: string[] = ["png", "jpg"]) {
  return z
    .any()
    .refine(
      (file) => file instanceof File,
      "File is required and must be a file."
    )
    .refine((file: File) => file?.name !== "", "File name cannot be empty.")
    .refine((file) => file.size < 1_000_000, "Max size is 1MB.")
    .refine(
      (file) => checkFileType(file, allowedExtensions),
      `Only ${allowedExtensions.join(", ")} formats are supported.`
    );
}

function checkFileType(
  file: File,
  allowedTypes: string[] = ["png", "jpg", "gif"]
) {
  if (file?.name) {
    const fileType = file.name.split(".").pop();
    if (fileType && allowedTypes.includes(fileType)) {
      return true;
    }
  }
  return false;
}
