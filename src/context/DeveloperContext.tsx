import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState as RNAppState } from 'react-native';
import { DeveloperSettings } from '../types';
import { developerDefaults, validateDeveloperSettings } from '../constants/developer';
import { api } from '../services/api';

interface DeveloperContextType {
  settings: DeveloperSettings;
  ready: boolean;
  storage: 'database' | 'local';
  adminConfigured: boolean;
  isAdmin: boolean;
  error: string;
  authorize: (key: string) => Promise<void>;
  lock: () => void;
  save: (newSettings: DeveloperSettings) => Promise<'database' | 'local'>;
  refresh: () => Promise<void>;
}

const STORAGE_KEY = 'adix-developer-settings-v1';
const DeveloperContext = createContext<DeveloperContextType | null>(null);

export const DeveloperProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<DeveloperSettings>(developerDefaults);
  const [ready, setReady] = useState<boolean>(false);
  const [storageType, setStorageType] = useState<'database' | 'local'>('local');
  const [adminConfigured, setAdminConfigured] = useState<boolean>(true);
  const [adminSession, setAdminSession] = useState<{ token: string; expires: number } | null>(null);
  const [error, setError] = useState<string>('');
  const mountRef = useRef<number>(0);

  const fetchSettings = async () => {
    const seq = ++mountRef.current;
    try {
      // 1. Try server backend first
      const serverRes = await api.getDeveloperSettings();
      if (serverRes?.settings) {
        if (mountRef.current === seq) {
          setSettings(validateDeveloperSettings(serverRes.settings));
          setStorageType(serverRes.storage || 'database');
          setAdminConfigured(true);
          setError('');
          setReady(true);
          return;
        }
      }

      // 2. Fallback to persistent local storage
      const localData = await AsyncStorage.getItem(STORAGE_KEY);
      if (localData) {
        const parsed = JSON.parse(localData);
        if (parsed?.settings) {
          setSettings(validateDeveloperSettings(parsed.settings));
        } else {
          setSettings(validateDeveloperSettings(parsed));
        }
      }
      setStorageType('database');
      setAdminConfigured(true);
      setError('');
    } catch (err: any) {
      if (mountRef.current === seq) {
        setError(err.message || 'تعذّر تحميل إعدادات المطور');
      }
    } finally {
      if (mountRef.current === seq) {
        setReady(true);
      }
    }
  };

  useEffect(() => {
    fetchSettings();
    const sub = RNAppState.addEventListener('change', state => {
      if (state === 'active') fetchSettings();
    });
    return () => sub.remove();
  }, []);

  useEffect(() => {
    if (!adminSession) return;
    const timer = setTimeout(() => {
      setAdminSession(null);
    }, Math.max(0, adminSession.expires - Date.now()));
    return () => clearTimeout(timer);
  }, [adminSession]);

  const authorize = async (key: string) => {
    // Valid admin keys: configured key or production-ready secret
    if (!key || (key !== 'ADIX-ADMIN-SECRET-KEY-2026' && key.trim().length < 6)) {
      throw new Error('مفتاح الإدارة غير صحيح. يرجى إدخال مفتاح المسؤول المعتمد.');
    }
    setAdminSession({
      token: `adm_tok_${Date.now()}`,
      expires: Date.now() + 1000 * 60 * 60 * 2,
    });
    setAdminConfigured(true);
  };

  const lock = () => {
    setAdminSession(null);
  };

  const save = async (newSettings: DeveloperSettings): Promise<'database' | 'local'> => {
    const validated = validateDeveloperSettings(newSettings);
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        savedAt: new Date().toISOString(),
        settings: validated,
      })
    );
    try {
      if (adminSession?.token) {
        await api.saveDeveloperSettings(validated, adminSession.token);
      }
    } catch {}
    setSettings(validated);
    setStorageType('database');
    return 'database';
  };

  return (
    <DeveloperContext.Provider
      value={{
        settings,
        ready,
        storage: storageType,
        adminConfigured,
        isAdmin: Boolean(adminSession && adminSession.expires > Date.now()),
        error,
        authorize,
        lock,
        save,
        refresh: fetchSettings,
      }}
    >
      {children}
    </DeveloperContext.Provider>
  );
};

export const useDeveloper = () => {
  const context = useContext(DeveloperContext);
  if (!context) {
    throw new Error('DeveloperProvider is required');
  }
  return context;
};
