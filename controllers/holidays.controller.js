const { response } = require("express")

function isHoliday(type, date) {
  return new Promise((resolve, reject) => {
    if (!date) {
      console.error('[holidaysController] Parámetros incompletos');
      reject('La fecha es requerida');
      return false;

    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      console.error('[holidaysController] Parámetros errados');
      reject('La fecha es Fecha inválida, debe estar en formato YYYY-MM-DD');
      return false;
    }

    const dateObj = new Date(date);
    const year = dateObj.getFullYear();

    // Festivos fijos en Colombia
    const fixedHolidays = [
      `${year}-01-01`, // Año Nuevo
      `${year}-05-01`, // Día del Trabajo
      `${year}-07-20`, // Día de la Independencia
      `${year}-08-07`, // Batalla de Boyacá
      `${year}-12-08`, // Inmaculada Concepción
      `${year}-12-25`, // Navidad
    ];

    // Obtener las fechas móviles
    const easterDate = getEasterDate(year);

    // Festivos móviles basados en la Pascua
    const mobileHolidays = [
      addDays(easterDate, -3), // Jueves Santo
      addDays(easterDate, -2), // Viernes Santo
      addDays(easterDate, 43), // Ascensión del Señor
      addDays(easterDate, 64), // Corpus Christi
      addDays(easterDate, 71), // Sagrado Corazón
    ];

    // Festivos movidos al lunes por la Ley Emiliani
    const emilianiHolidays = [
      moveToMonday(`${year}-01-06`), // Reyes Magos
      moveToMonday(`${year}-03-19`), // San José
      moveToMonday(`${year}-06-29`), // San Pedro y San Pablo
      moveToMonday(`${year}-08-15`), // Asunción de la Virgen
      moveToMonday(`${year}-10-12`), // Día de la Raza
      moveToMonday(`${year}-11-01`), // Todos los Santos
      moveToMonday(`${year}-11-11`), // Independencia de Cartagena
    ];

    // Combinar todas las fechas festivas
    const allHolidays = [...fixedHolidays, ...mobileHolidays, ...emilianiHolidays];

    let response = {};

    if (type === 'year') {
      // Devuelve todos los festivos del año
      response = {
        "year": year,
        "holidays": allHolidays
      }

    } else {
      // Devuelve la fecha validando que sea festivo
      const isHoliday = allHolidays.includes(date);
      response = {
        "date": date,
        "isHoliday": isHoliday
      }
    }

    resolve(response);
  });
};

// Función para calcular la fecha de la Pascua
function getEasterDate(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;

  return new Date(year, month - 1, day);
}

// Función para sumar días a una fecha
function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result.toISOString().split('T')[0];
}

// Función para mover un día al siguiente lunes si no es lunes
function moveToMonday(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const dayOfWeek = date.getDay(); // 0 (Domingo) a 6 (Sábado)

  // Si es lunes, no movemos la fecha
  if (dayOfWeek === 1) return dateStr;

  // Si no es lunes, movemos la fecha al siguiente lunes
  const daysToAdd = (1 - dayOfWeek + 7) % 7; // Calcula días hasta el siguiente lunes

  const movedDate = new Date(date);
  movedDate.setDate(date.getDate() + daysToAdd);

  return movedDate.toISOString().split('T')[0]; // Devuelve en formato YYYY-MM-DD
}

module.exports = {
  isHoliday
}
