import { Activity } from '../entity/Activity';
import groupBy from 'lodash/groupBy';

export interface Dictionary<T> {
  [index: string]: T;
}

export default function groupByUsername(activities: Activity[]) {
  return groupBy(activities, 'username');
}
