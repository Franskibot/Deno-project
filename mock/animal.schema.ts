import { z } from "zod";

const AnimalSchema = z.object({
  id: z.string(),
  owner: z.string(),
  animal: z.string(),
});

export default AnimalSchema;