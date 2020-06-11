import { Request, Response } from 'express';
import { parseIdFromCommand } from './parseIdFromCommand';
import { Activity } from '../entity/Activity';
import { getConnection } from 'typeorm';

export const archiveRammeHandler = async (req: Request, res: Response) => {
  const id = parseIdFromCommand(req.body.text);
  if (!id) {
    res.send('Could not parse id');
    return;
  }

  const event = await getConnection()
    .getRepository(Activity)
    .findOne({ shortId: id });

  if (!event) {
    res.send({
      response_type: 'in_channel',
      text: 'There is no activity with this ID',
    });
    return;
  }

  if (event.username !== req.body.user_name) {
    res.send({
      response_type: 'in_channel',
      text: "You're not allowed to archive the activities of other people",
    });
    return;
  }

  try {
    const repoRes = await getConnection().getRepository(Activity).remove(event);
    const response = `Activity med id ${repoRes.shortId} deleted`;
    res.send({
      response_type: 'in_channel',
      text: response,
    });
  } catch (e) {
    res.status(401).send('Could not archive ramme');
  }
};
