// Edite aqui os dados da loja
export const STORE = {
  name: "Confeitaria da Júlia",
  slogan: "Doce em cada detalhe...",
  owner: "Júlia",
  whatsapp: "5581985640805", // DDI + DDD + número
  whatsappLabel: "(81) 98564-0805",
  instagram: "https://instagram.com/confeitariadajulia",
  instagramHandle: "@confeitariadajulia",
  facebook: "https://facebook.com/confeitariadajulia",
  address: "Rua das Flores, 123 - Recife - PE",
  phrase: "Bolos que tornam sua vida mais doce!",
  phraseSub: "Feitos com amor, qualidade e muito carinho para todas as ocasiões.",
  carouselPhrase: "Transformando momentos em doces lembranças!",
};
export const waLink = (text = "Olá! Gostaria de fazer um pedido.") =>
  `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(text)}`;
export const brl = (v) => Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
