import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateProfileValidator {
  constructor(protected ctx: HttpContextContract) {
  }

  public schema = schema.create({
    email: schema.string.optional({}, [rules.email()]),
    password: schema.string.optional({}, [rules.minLength(8), rules.maxLength(16)]),
    first_name: schema.string.optional({}, [rules.minLength(3), rules.maxLength(30)]),
    last_name: schema.string.optional({}, [rules.minLength(3), rules.maxLength(30)]),
    mobile_number: schema.string.optional({}, [rules.mobile(), rules.minLength(10), rules.maxLength(10)]),
    gender: schema.enum.optional(['MALE', 'FEMALE']),
    dob: schema.date.optional({
        format: 'dd-MM-yyyy'
    })
})
  public messages: CustomMessages = {}
}
