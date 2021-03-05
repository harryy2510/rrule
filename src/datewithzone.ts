import dateutil from './dateutil'
import * as moment from 'moment-timezone'

export class DateWithZone {
  public date: Date
  public tzid?: string | null

  constructor (date: Date, tzid?: string | null) {
    this.date = date
    this.tzid = tzid
  }

  private get isUTC () {
    return !this.tzid || this.tzid.toUpperCase() === 'UTC'
  }

  public toString () {
    const datestr = dateutil.timeToUntilString(this.date.getTime(), this.isUTC)
    if (!this.isUTC) {
      return `;TZID=${this.tzid}:${datestr}`
    }

    return `:${datestr}`
  }

  public getTime () {
    return this.date.getTime()
  }

  public rezonedDate () {
    if (this.isUTC) {
      return this.date
    }

    try {
      const datetime = moment(this.date)

      const rezoned = datetime.tz(this.tzid!, true)

      return rezoned.toDate()
    } catch (e) {
      if (e instanceof TypeError) {
        console.error('Using TZID without Moment available is unsupported. Returned times are in UTC, not the requested time zone')
      }
      return this.date
    }
  }
}
