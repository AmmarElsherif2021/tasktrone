import { readFile,writeFile } from 'fs/promises';

const data = JSON.parse(await readFile(new URL('./enums.json', import.meta.url), 'utf8'));
const enumsMap = new Map();
for(const [key, value] of Object.entries(data)) {
  if(enumsMap.has(value['enum_type_name'])) {
    if(!enumsMap.get(value['enum_type_name']).includes(value['enum_value'])) {
      enumsMap.get(value['enum_type_name']).push(value['enum_value']);
    }
  } else {
    enumsMap.set(value['enum_type_name'], [value['enum_value']]);
  }
}
await writeFile(new URL('./enums_map.json', import.meta.url), JSON.stringify(Object.fromEntries(enumsMap)), 'utf8');