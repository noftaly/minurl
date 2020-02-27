function padNumber(x) {
  return (x.toString().length < 2 ? `0${x}` : x).toString();
}

export default function formatDate(d) {
  const date = new Date(d);
  const now = new Date(Date.now());
  // Même jour, mois, année
  if (date.getDate() === now.getDate()
    && date.getMonth() === now.getMonth()
    && date.getFullYear() === now.getFullYear())
    return `aujourd'hui à ${padNumber(date.getHours())}h${padNumber(date.getMinutes())}'${padNumber(date.getSeconds())}`;

  // Jours précédents, même mois, même année (pour éviter que 04/05/2015 soit "hier" quand on est le 05/08/2019)
  if (date.getDate() + 1 === now.getDate()
    && date.getMonth() === now.getMonth()
    && date.getFullYear() === now.getFullYear())
    return `hier à ${padNumber(date.getHours())}h${padNumber(date.getMinutes())}'${padNumber(date.getSeconds())}`;
  if (date.getDate() + 2 === now.getDate()
    && date.getMonth() === now.getMonth()
    && date.getFullYear() === now.getFullYear())
    return `avant-hier à ${padNumber(date.getHours())}h${padNumber(date.getMinutes())}'${padNumber(date.getSeconds())}`;

  // Date par défaut.
  return `le ${padNumber(date.getDate())}/${padNumber(date.getMonth() + 1)}/${padNumber(date.getFullYear())} à ${padNumber(date.getHours())}h${padNumber(date.getMinutes())}'${padNumber(date.getSeconds())}`;
}
