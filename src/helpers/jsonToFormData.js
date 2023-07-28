export function jsonToFormData(jsonData, formData = new FormData(), parentKey = '') {
  if (jsonData && typeof jsonData === 'object' && !(jsonData instanceof Date) && !(jsonData instanceof File)) {
    Object.keys(jsonData).forEach((key) => {
      const value = jsonData[key];
      const computedKey = parentKey ? `${parentKey}[${key}]` : key;

      if (value !== null) {
        jsonToFormData(value, formData, computedKey);
      }
    });
  } else if (Array.isArray(jsonData)) {
    jsonData.forEach((value, index) => {
      const computedKey = `${parentKey}[${index}]`;
      if (value !== null) {
        jsonToFormData(value, formData, computedKey);
      }
    });
  } else {
    if (jsonData !== null) {
      formData.append(parentKey, jsonData);
    }
  }

  return formData;
}
