import { assert } from "https://deno.land/std@0.152.0/testing/asserts.ts";
import PersonalDetailSchema from "./personal-details.schema.ts";
import { factoryPeople } from "./factory.ts";

Deno.test("Personal details matches Zod object schema `PersonalDetailSchema`.", () => {
  factoryPeople.forEach((person) => {
    assert(
      PersonalDetailSchema.safeParse({
        id: person.id,
        firstName: person.firstName,
        lastName: person.lastName,
        email: person.email,
        password: person.password,
      }).success,
    );
  });
});