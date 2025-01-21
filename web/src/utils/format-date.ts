import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const formatDate = (dateString: string) => {
  return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", {
    locale: ptBR,
  });
};
