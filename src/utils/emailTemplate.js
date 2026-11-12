import { firstName } from "./peer";

export const SITE_URL = "https://joel5vega.github.io/dones/";

const esc = (s = "") =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const firstSentence = (t = "") => (t.split(/(?<=\.)\s/)[0] ?? t).trim();

/** Correo personalizado: resultados actualizados + explicación de la evaluación externa. */
export function buildResultsEmail({ name, top }, siteUrl = SITE_URL) {
  const nombre = firstName(name);
  const profileUrl = `${siteUrl}#/perfil`;
  const peerUrl = `${siteUrl}#/evaluaciones`;
  const subject = "Tus resultados de dones se actualizaron + nueva función";

  const gifts = top
    .map((g, i) => `
      <tr><td style="padding:10px 0;border-bottom:1px solid #e6ebf2">
        <strong style="color:#052f5f">${i + 1}. ${esc(g.name)}</strong>
        <span style="color:#b97a00;font-weight:700"> · ${esc(g.score)}%</span><br>
        <span style="color:#51607a;font-size:14px">${esc(firstSentence(g.definicion))}</span>
      </td></tr>`)
    .join("");

  const html = `<!DOCTYPE html><html lang="es"><body style="margin:0;background:#f3f6fa;font-family:Arial,Helvetica,sans-serif;color:#1d2b44">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px 12px">
    <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border-radius:14px;overflow:hidden">
      <tr><td style="background:#052f5f;color:#fff;padding:24px"><h1 style="margin:0;font-size:22px">Test de Dones Espirituales</h1></td></tr>
      <tr><td style="padding:24px;line-height:1.6">
        <p>Hola ${esc(nombre)},</p>
        <p>Mejoramos la forma de calcular los resultados del test. Con <strong>tus mismas respuestas</strong> recalculamos tu resultado; estos son tus dones principales:</p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${gifts}</table>
        <p style="text-align:center;margin:24px 0">
          <a href="${profileUrl}" style="background:#fbaf00;color:#052f5f;text-decoration:none;font-weight:700;padding:12px 22px;border-radius:999px;display:inline-block">Ver mi perfil completo</a>
        </p>
        <h2 style="font-size:18px;color:#052f5f;margin-bottom:6px">Novedad: evaluación de alguien más</h2>
        <p style="margin-top:0">A veces otros ven en nosotros lo que nosotros no. Ahora puedes pedir a alguien que te conozca bien que responda unas <strong>16 preguntas cortas</strong> sobre ti y elija los 3 dones que cree que tienes. Luego compararás su visión con la tuya sobre un mismo gráfico.</p>
        <ol style="padding-left:20px;margin-top:0">
          <li>Entra a tu perfil y toca <em>Evaluación de otros</em>.</li>
          <li>Crea tu enlace y compártelo (también funciona con un código).</li>
          <li>Cuando responda, verás la comparación.</li>
        </ol>
        <p style="text-align:center"><a href="${peerUrl}" style="color:#052f5f;font-weight:700">Crear mi enlace de evaluación</a></p>
        <p style="font-size:12px;color:#8793a8;margin-top:28px">Recibes este aviso único porque hiciste el test en ${esc(siteUrl)}. Que Dios te bendiga.</p>
      </td></tr>
    </table>
  </td></tr></table></body></html>`;

  const text = [
    `Hola ${nombre},`, "",
    "Mejoramos el cálculo del test. Con tus mismas respuestas recalculamos tu resultado. Tus dones principales:",
    ...top.map((g, i) => `${i + 1}. ${g.name} (${g.score}%)`), "",
    `Ver mi perfil: ${profileUrl}`, "",
    "NOVEDAD: evaluación de alguien más. Pide a alguien que te conozca que responda ~16 preguntas cortas sobre ti y compara su visión con la tuya.",
    `Crea tu enlace en: ${peerUrl}`, "",
    "Que Dios te bendiga.",
  ].join("\n");

  return { subject, html, text };
}
