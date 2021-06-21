let submitDateTime
const workStartTime = 9
const workEndTime = 17
const workingHoursDuration = 8

function calculateDueDate(dateAndTimeOfSubmission, turnaroundTime = 0) {
  if (!isDate(dateAndTimeOfSubmission)) { return "Date of submission is not valid!" }
  if (!Number.isInteger(turnaroundTime)) { return "Turnaround time is not valid! Please provide duration in hours." }

  let DueDateOfResolve = new Date(dateAndTimeOfSubmission)

  if (DueDateOfResolve.getHours() < workStartTime || DueDateOfResolve.getHours() >= workEndTime) { return "Please report your problem during working hours (9AM to 5PM)!" }

  const { days, hours } = convertTurnaroundTimeToDaysAndHours(turnaroundTime)
  addDaysToDate(DueDateOfResolve, days)
  addHoursToTime(DueDateOfResolve, hours)
  if (isOutOfWorkingHours(DueDateOfResolve)) {
    addDaysToDate(DueDateOfResolve, 1)
    const excessTime = DueDateOfResolve.getHours() % workEndTime
    DueDateOfResolve.setHours((workStartTime + excessTime))
  }

  return `Issue is due to be resolved by ${DueDateOfResolve.toString()}`
}

function addDaysToDate(date, days) {
  for (let i = 0; i < days; i++) {
    date.setDate(date.getDate() + 1)
    skipWeekend(date)
  }
}

function addHoursToTime(date, hours) {
  date.setHours(date.getHours() + hours)
}

function convertTurnaroundTimeToDaysAndHours(time) {
  const days = Math.floor(time / workingHoursDuration)
  const hours = time % workingHoursDuration
  return { days, hours }
}

function isOutOfWorkingHours(date) {
  if (date.getHours() >= workEndTime) { return true }
  return false
}

function skipWeekend(date) {
  if (date.getDay() === 0 || date.getDay() === 6) {
    date.setDate(date.getDate() + 1)
    skipWeekend(date)
  }
}

// https://jsfiddle.net/remarkablemark/7wegs1ao/
function isDate(value) {
  switch (typeof value) {
    case 'number':
      return true;
    case 'string':
      return !isNaN(Date.parse(value));
    case 'object':
      if (value instanceof Date) {
        return !isNaN(value.getTime());
      }
    default:
      return false;
  }
}

// NAIVE TESTING

submitDateTime = '2021 06 18 9:24:00'

for (let i = 0; i < 12; i++) {
  console.log(i * 3)
  console.log(calculateDueDate(submitDateTime, 3 * i))
}
