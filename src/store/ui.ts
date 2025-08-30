import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', {
  state: () => ({
    loading: false as boolean,
    snackbar: { show: false, text: '', color: 'success' as 'success' | 'error' | 'info' },
    confirm: { show: false, title: '', text: '', resolve: null as null | ((v: boolean) => void) },
  }),
  actions: {
    setLoading(v: boolean) { this.loading = v },
    toast(text: string, color: 'success' | 'error' | 'info' = 'info') { this.snackbar = { show: true, text, color } },
    ask(title: string, text: string) {
      return new Promise<boolean>((resolve) => {
        this.confirm = { show: true, title, text, resolve }
      })
    },
    confirmAnswer(v: boolean) { this.confirm.resolve?.(v); this.confirm = { show: false, title: '', text: '', resolve: null } },
  },
})


