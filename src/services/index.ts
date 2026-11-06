import { SchoolProvider } from './SchoolProvider';
import { MockSchoolProvider } from './MockSchoolProvider';
import { SponteSchoolProvider } from './SponteSchoolProvider';

export type ProviderType = 'mock' | 'sponte';

let currentProviderType: ProviderType = 
  (typeof process !== 'undefined' && process.env?.VITE_SCHOOL_PROVIDER === 'sponte') ? 'sponte' : 'mock';

const mockInstance = new MockSchoolProvider();
const sponteInstance = new SponteSchoolProvider();

export function getSchoolProvider(type?: ProviderType): SchoolProvider {
  const selected = type || currentProviderType;
  return selected === 'sponte' ? sponteInstance : mockInstance;
}

export function setSchoolProviderType(type: ProviderType) {
  currentProviderType = type;
}

export function getCurrentProviderType(): ProviderType {
  return currentProviderType;
}

export * from './SchoolProvider';
export * from './MockSchoolProvider';
export * from './SponteSchoolProvider';
