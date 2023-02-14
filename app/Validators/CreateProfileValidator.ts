import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateProfileValidator {
  constructor(protected ctx: HttpContextContract) {
  }

  public schema = schema.create({
    first_name: schema.string({}, [rules.minLength(3), rules.maxLength(30)]),
    last_name: schema.string({}, [rules.minLength(3), rules.maxLength(30)]),
    mobile_number: schema.string({}, [rules.mobile(), rules.minLength(10), rules.maxLength(10)]),
    gender: schema.enum(['MALE', 'FEMALE']),
    dob: schema.date({
        format: 'dd-MM-yyyy'
    })
})
  public messages: CustomMessages = {}
}
