import AdminBro from 'admin-bro';
import { Activity } from './entity/Activity';
import { Database, Resource } from 'admin-bro-typeorm';
import { validate } from 'class-validator';
import { Connection } from 'typeorm';
import { SlackUser } from './entity/SlackUser';
import { StravaUser } from './entity/StravaUser';
import { User } from './entity/User';

AdminBro.registerAdapter({ Database, Resource });
Resource.validate = validate;
export default (connection: Connection) => {
  Activity.useConnection(connection);
  User.useConnection(connection);
  SlackUser.useConnection(connection);
  StravaUser.useConnection(connection);
  return new AdminBro({
    resources: [
      {
        resource: Activity,
        options: { parent: 'Data' },
      },
      {
        resource: User,
        options: { parent: 'Data' },
      },
      {
        resource: SlackUser,
        options: { parent: 'Data' },
      },
      {
        resource: StravaUser,
        options: { parent: 'Data' },
      },
    ],
    branding: {
      companyName: 'Rammebuddy',
      softwareBrothers: false,
    },
    rootPath: '/admin',
  });
};
