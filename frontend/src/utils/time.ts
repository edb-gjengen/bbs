import { format, parseISO } from "date-fns";

export const formatTime = (isoDateTime: string): string => format(parseISO(isoDateTime), "yyyy-MM-dd HH:mm");

export const formatMonth = (isoDateTime: string): string => format(parseISO(isoDateTime), "yyyy-MM");
