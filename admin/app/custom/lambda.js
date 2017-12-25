export default {
  reverse    : str => str.split('').reverse().join(''),
  localString: str => new Date(str).toLocaleString(),
  dateTime   : str => new Date(str).toLocaleDateString() + new Date(str).toLocaleTimeString(),
  dictionary : str => require('./dictionary')(str)
}