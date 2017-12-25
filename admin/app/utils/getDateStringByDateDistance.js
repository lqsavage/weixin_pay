export default function (dateDistance) {
  return new Date( new Date(  new Date().toDateString() ).getTime() + (dateDistance || 0) * 24 * 3600 * 1000).toDateString()
}