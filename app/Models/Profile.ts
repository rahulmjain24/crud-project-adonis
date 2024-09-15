import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Profile extends BaseModel {
  @column({ isPrimary: true })
  public id: number
  
  @column()
  public userId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public firstName: string

  @column()
  public lastName: string

  @column()
  public mobileNumber: string

  @column()
  public gender: string

  @column.date({
    serialize: (value) => value.toFormat('dd-MM-yyyy'),
  })
  public dob: DateTime
}
