export const generateSlug = (title: string, year: string): string => {
  return `${title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove caracteres especiais
    .replace(/\s+/g, "-") // Substitui espaços por hífens
    .trim()}-${year}`;
};
