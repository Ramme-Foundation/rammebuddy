import AdminBro from 'admin-bro'
import { Activity } from './entity/Activity'
import { Database, Resource } from 'admin-bro-typeorm'
import { validate } from 'class-validator'
import { Connection } from 'typeorm'

AdminBro.registerAdapter({ Database, Resource })
Resource.validate = validate
export default (connection: Connection) => {
  Activity.useConnection(connection)
  return new AdminBro({
    resources: [
      {
        resource: Activity,
        options: { parent: 'Data' },
      },
    ],
    branding: {
      companyName: 'Rammebuddy',
      softwareBrothers: false,
    },
    rootPath: '/admin',
  })
}
