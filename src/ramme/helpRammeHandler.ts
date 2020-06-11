import { Request, Response } from 'express';

export const helpRammeHandler = async (_req: Request, res: Response) => {
  try {
    const response = `Rammebuddy help guide:
    -'/ramme add <activity> [<week>]' to register an <activity>. (current week if none is specified).

    -'/ramme week [<week>]' shows current number of activities for a week <week> (current week if none is specified).

    -'/ramme edit <id> <activity>' to update an activity with id: <id> for activity <activity>

    -'/ramme archive <id>' to archive an activity with id: <id>

    -'/ramme total' to see total activities`;

    res.send({
      response_type: 'ephemeral',
      text: response,
    });
  } catch (e) {
    res.status(401).send('Could not help ramme');
  }
};
