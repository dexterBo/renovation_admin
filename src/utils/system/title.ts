import { isBackMenu, systemTitle } from '@/config'

export function changeTitle(name: any) {
  document.title = `${(name)}-${(systemTitle)}`;
}
