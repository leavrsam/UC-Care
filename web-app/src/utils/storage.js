const STORAGE_KEY = 'issy_care_data_v1';

export const getStorageData = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;

    if (!parsed || typeof parsed !== 'object') {
      return { pills: [], water: [], stool: [], emotions: [] };
    }
    return parsed;
  } catch (error) {
    console.error('Error reading storage', error);
    return { pills: [], water: [], stool: [], emotions: [] };
  }
};

export const saveStorageData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving storage', error);
  }
};

export const addEntry = (type, entry) => {
  const data = getStorageData();
  if (!data[type]) data[type] = [];

  const newEntry = {
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    ...entry
  };

  data[type].unshift(newEntry); // Newest first
  saveStorageData(data);
  return data;
};

export const removeLastEntry = (type) => {
  const data = getStorageData();
  if (data[type] && data[type].length > 0) {
    data[type].shift(); // Remove the first (newest) item
    saveStorageData(data);
  }
  return data;
};

export const getTodayTotal = (type, filterFn) => {
  const data = getStorageData();
  const today = new Date().toDateString();
  return (data[type] || [])
    .filter(item => new Date(item.timestamp).toDateString() === today)
    .filter(item => filterFn ? filterFn(item) : true);
};

// --- Medication Schedule Storage ---
const MED_STORAGE_KEY = 'issy_care_medications_v1';

export const getMedications = () => {
  try {
    const data = localStorage.getItem(MED_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading medications', error);
    return [];
  }
};

export const saveMedication = (med) => {
  const meds = getMedications();
  const index = meds.findIndex(m => m.id === med.id);
  if (index >= 0) {
    meds[index] = med;
  } else {
    meds.push(med);
  }
  localStorage.setItem(MED_STORAGE_KEY, JSON.stringify(meds));
  return meds;
};

export const deleteMedication = (id) => {
  const meds = getMedications();
  const newMeds = meds.filter(m => m.id !== id);
  localStorage.setItem(MED_STORAGE_KEY, JSON.stringify(newMeds));
  return newMeds;
};
export const deleteEntry = (type, id) => {
  const data = getStorageData();
  if (data[type]) {
    data[type] = data[type].filter(item => item.id !== id);
    saveStorageData(data);
  }
  return data;
};

export const updateEntry = (type, id, updatedFields) => {
  const data = getStorageData();
  if (data[type]) {
    const index = data[type].findIndex(item => item.id === id);
    if (index !== -1) {
      data[type][index] = { ...data[type][index], ...updatedFields };
      saveStorageData(data);
    }
  }
  return data;
};
