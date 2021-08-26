export default class TimeUtils {
  static tsInSeconds() {
    return Math.round(new Date().getTime() / 1000);
  }
}