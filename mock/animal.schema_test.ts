import { assert } from "https://deno.land/std@0.152.0/testing/asserts.ts";
import AnimalSchema from "./animal.schema.ts";
import { factoryAnimals } from "./factory.ts";

Deno.test("Animal or pet details matches Zod object schema `AnimalSchema`.", () => {
  factoryAnimals.forEach((animal) => {
    assert(
      AnimalSchema.safeParse({
        id: animal.id,
        animal: animal.animal,
        owner: animal.owner,
      }).success,
    );
  });
});