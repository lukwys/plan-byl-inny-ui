import { format, parseISO } from "date-fns";
import { pl } from "date-fns/locale";

export const formatDate = (isoString: string, dateFormat = "dd.MM.yyyy") => {
  const date = parseISO(isoString);
  if (Number.isNaN(date.getTime())) return "";

  return format(date, dateFormat, { locale: pl });
};
