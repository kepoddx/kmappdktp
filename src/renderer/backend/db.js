import path from 'path';
/* eslint-disable import/no-extraneous-dependencies */
import { remote } from 'electron';
import Datastore from 'nedb-promises';


export default new Datastore({
  autoload: true,
  filename: path.join(remote.app.getPath('userData'), '/kdata.db')
});

