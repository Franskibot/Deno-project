import { z } from "zod";

const PersonalDetailSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  password: z.string(),
});

export default PersonalDetailSchema;