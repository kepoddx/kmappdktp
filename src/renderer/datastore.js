import { from, BehaviorSubject, of, forkJoin} from 'rxjs';
import { switchMap, mergeMap, map } from 'rxjs/operators';
import Datastore from './backend/db';
import { getAllRoutes } from '../renderer/router';

const routeNames = getAllRoutes();

class Db {
  constructor() {
    this.Datastore = Datastore;
    this.routeNames = routeNames;
    /* eslint-disable array-callback-return */
    this.routeNames.map(route => {
        this[route] = new BehaviorSubject();
    })
    this.verifyDbEntry()
        .pipe(
            switchMap((res) => {
                if (res === null) return this.initRouteSettings()
                return this.loadRouteSettings()
            }),
        )
        .subscribe()  

  }
  initRouteSettings() {
    /* eslint-disable array-callback-return */
    return of(this.routeNames.map(async (routeName) => {
        const res = await this.Datastore.insert({recType: routeName});
        /* eslint-disable no-console */
        console.log("Init Routes", res)
        this[routeName].next(res)
    }))
  }
  loadRouteSettings() {
    return of(this.routeNames)
        .pipe(
            mergeMap(routeList => forkJoin(...routeList.map(route => this.getUpdatedSettings(route)))),
            map(records => {
                console.log("AFTRE UPDATE", records)
                /* eslint-disable array-callback-return */
                records.map((record) => {
                    this[record.recType].next(record)
                })
                return { message: "Records loaded"}
            })
        )
  }
  getViewSettings$(recType) {
    return this[recType].asObservable()
  }
  verifyDbEntry() {
      return from(this.getUpdatedSettings(this.routeNames[0]))
  }
  save$(name, data) {
      console.log("Name", name, "Data", data)
    from(this.Datastore.update({ recType: name }, { $set: data}, { returnUpdatedDocs : true }))
      .pipe(switchMap(()=> this.getUpdatedSettings(name)))
      .subscribe((res) => {
        /* eslint-disable no-console */
        console.log(res)
        this[name].next(res)
      })
  }
  clearAll() {
    from(this.Datastore.remove({}, { multi: true }))
      .subscribe((res) => {
        /* eslint-disable no-console */
        console.log(res)
        this.updateAllSettings();
      })
  }
  updateAllSettings() {
      this.routeNames.map(route => this[route].next({}))
  }
  getUpdatedSettings(name) {
    return from(this.Datastore.findOne({recType : name}))
  }
  getDbCount() {
     from(this.Datastore.count({}))
     .subscribe(count => {
         console.log("Records in Db", count)
     })
  }
}

export default new Db();
