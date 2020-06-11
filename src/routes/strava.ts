import express from 'express';
import { StravaApi } from '../apis/strava/StravaApi';
import { logger } from '../utils/logger';
import { getRepository } from 'typeorm';
import { StravaUser } from '../entity/StravaUser';
import { User } from '../entity/User';

const api = new StravaApi();

const oauthCallbackPath = async (
  req: express.Request,
  res: express.Response,
) => {
  const userId = req.query.state as string;
  if (!userId) {
    res.status(400).send('Could not connect account to user');
    return;
  }

  const userRepo = getRepository(User);
  const user = await userRepo.findOne({ id: userId });
  if (!user) {
    res.status(400).send('Could not find user account to connect');
    return;
  }
  const resp = await api.verifyOauth(req.query.code as string);
  console.log('RESP', resp);
  const stravaRepo = getRepository(StravaUser);
  const stravaUser = await stravaRepo.findOne({
    stravaId: resp.athlete.id,
  });
  if (stravaUser) {
    stravaUser.user = user;
    stravaUser.accessToken = resp.access_token;
    stravaUser.refreshToken = resp.refresh_token;
    stravaUser.expiresAt = new Date(resp.expires_at * 1000); // Convert from unix time
    stravaRepo.save(stravaUser);
  } else {
    const sUser = stravaRepo.create({
      user: user,
      stravaId: resp.athlete.id,
      accessToken: resp.access_token,
      refreshToken: resp.refresh_token,
      expiresAt: new Date(resp.expires_at * 1000), // Convert from unix time
    });
    stravaRepo.save(sUser);
  }

  // TODO Map to stravaUser and add slack stravaUser to that as well

  res.send(`Authenticated with Strava! You can now close this window`);
};

const createSubscription = async (
  req: express.Request,
  res: express.Response,
) => {
  await api.createAppSubscription();
  res.send('Yay!');
};

const verifySubscription = async (
  req: express.Request,
  res: express.Response,
) => {
  // Your verify token. Should be a random string.
  const VERIFY_TOKEN = 'STRAVA';
  // Parses the query params
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
    // Verifies that the mode and token sent are valid
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.json({ 'hub.challenge': challenge });
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
  res.sendStatus(403);
};

const subscriptionHandler = async (
  req: express.Request,
  res: express.Response,
) => {
  logger.info(
    '[STRAVA][EVENT]: Received Strava event',
    JSON.stringify(req.body),
  );
  /** Object for create
 * {
    aspect_type: 'create',
    event_time: 1590348478,
    object_id: 3506019230,
    object_type: 'activity',
    owner_id: 58334645,
    subscription_id: 157567,
    updates: {}
}
 * 
 * 
 */
  res.status(200).send('EVENT_RECEIVED');
};

export const registerStravaRoutes = (app: express.Express) => {
  app.get('/strava/oauth/callback', oauthCallbackPath);
  app.get('/strava/subscribe', createSubscription);
  app.get('/strava/subscriptions', verifySubscription);
  app.post('/strava/subscriptions', subscriptionHandler);
};
