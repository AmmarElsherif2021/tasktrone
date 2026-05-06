import { readFile } from 'fs/promises';

const data = JSON.parse(await readFile(new URL('./enums.json', import.meta.url), 'utf8'));
const enumsMap = new Map();
for(const [key, value] of Object.entries(data)) {
  if(enumsMap.has(value['enum_type_name'])) {
    enumsMap.get(value['enum_type_name']).push(value['enum_value']);
  } else {
    enumsMap.set(value['enum_type_name'], [value['enum_value']]);
  }
}
console.log('enums map', enumsMap);