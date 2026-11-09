const clean = (s) => String(s ?? '').replace(/\uFFFD/g, '').trim()

export async function fetchPeople(token) {
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${import.meta.env.VITE_SHEET_ID}/values/A:F`,
    { headers: { Authorization: `Bearer ${token}` } },
  )
  if (!res.ok) throw new Error(`Sheets API ${res.status}`)
  const { values } = await res.json()
  return values.slice(1).map(([name, photo, age, country, interest, worth]) => ({
    name: clean(name), photo: clean(photo), age: clean(age), country: clean(country), interest: clean(interest),
    worth: clean(worth), worthNum: Number(clean(worth).replace(/[$,]/g, '')),
  }))
}
