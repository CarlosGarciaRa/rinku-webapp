import ToastEventBus from 'primevue/toasteventbus';

export const useToastService = () => {
  const showToast = ({ severity, summary, detail, life = 3000 }) => {
    ToastEventBus.emit('add', { severity, summary, detail, life });
  };

  return { showToast };
};
