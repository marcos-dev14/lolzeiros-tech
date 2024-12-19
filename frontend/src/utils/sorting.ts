export function sortByField(items: any[], value: string) {
  return items.sort((a, b) => String(a[value]).localeCompare(String(b[value])))
}

export function sortNumberFields(items: any[], value: string) {
  return items.sort((a, b) =>  a[value] - b[value]);
}
