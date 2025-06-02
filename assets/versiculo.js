import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function buscarVersiculoDoDia() {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.goto("https://www.bibliaonline.com.br/acf");

  const versiculo = await page.evaluate(() => {
    const versiculoElemento = document.querySelector(".versiculo");
    return versiculoElemento ? versiculoElemento.innerText.trim() : null;
  });

  if (!versiculo) {
    console.error("❌ Erro ao buscar versículo do dia.");
    await browser.close();
    return;
  }

  const hoje = new Date().toISOString().slice(0, 10);
  const novoVersiculo = {
    data: hoje,
    livro: "Versículo do Dia",
    capitulo: "",
    versiculo: "",
    texto: versiculo,
    referencia: "Fonte: Bíblia Online - ACF",
    comentario: "Reflexão automática",
    categoria: "Diário",
    fonte: "https://www.bibliaonline.com.br/acf",
    favorito: false
  };

  if (!fs.existsSync("data")) {
    fs.mkdirSync("data");
  }

  const jsonPath = path.join(__dirname, "data/versiculos.json");

  let versiculos = [];
  if (fs.existsSync(jsonPath)) {
    versiculos = JSON.parse(fs.readFileSync(jsonPath));
  }

  const existe = versiculos.some(v => v.data === hoje);
  if (!existe) {
    versiculos.push(novoVersiculo);
    fs.writeFileSync(jsonPath, JSON.stringify(versiculos, null, 2));
    console.log("📖 Versículo do dia salvo com sucesso!");
  } else {
    console.log("✅ O versículo de hoje já está salvo no JSON.");
  }

  await browser.close();
}

// Exportando a função para ser usada em scripts.js
export default buscarVersiculoDoDia;

console.log("✅ Versículo do dia foi atualizado!");
