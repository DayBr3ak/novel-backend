export default async function sendMail(lastChapter, slug, stored, link) {
  if (
    process.env.NODE_ENV !== "production" ||
    process.env.FORCE_MAIL !== "true"
  ) {
    return;
  }
  if (process.env.FORCE_MAIL === "true") {
    console.log("force mail send");
  }
  const domain = process.env.MAILGUN_DOMAIN;
  const recip = process.env.RECIPIENT;
  const apiKey = process.env.MAILGUN_API;
  if (!domain || !recip || !apiKey) {
    throw new Error("env properties missing in sendmail");
  }
  await axios({
    method: "POST",
    url: "https://api.mailgun.net/v3/" + domain + "/messages",
    auth: {
      username: "api",
      password: apiKey
    },
    params: {
      from: "bkservice@" + domain,
      to: recip,
      subject: `C-${lastChapter} : ${slug}`,
      text: `New chapter(s) since ${stored.updatedAt}\n\n${link}\n`
    }
  })
    .then(() => console.log("mail sent"))
    .catch(console.error);
}
