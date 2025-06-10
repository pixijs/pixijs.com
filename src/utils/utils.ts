export function camelCaseToSentenceCase(str: string) {
  const tmp = str.replace(/([A-Z])/g, ' $1');

  return tmp.charAt(0).toUpperCase() + tmp.slice(1);
}

export function camelCaseToSnakeCase(str: string) {
  return str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}
