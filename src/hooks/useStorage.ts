import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Category } from '../types';
import { CURATED } from '../data/curatedLists';

const KEY = '@decider_categories';

export function useStorage() {
  const [categories, setCategories] = useState<Category[]>(CURATED);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(KEY).then((raw) => {
      if (raw) setCategories(JSON.parse(raw));
      setLoaded(true);
    });
  }, []);

  const save = async (cats: Category[]) => {
    setCategories(cats);
    await AsyncStorage.setItem(KEY, JSON.stringify(cats));
  };

  return { categories, save, loaded };
}
